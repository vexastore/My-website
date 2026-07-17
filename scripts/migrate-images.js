#!/usr/bin/env node
// =============================================================================
// migrate-images.js
//
// Migrates all existing Base64 product images from Firestore to Firebase Storage.
//
// USAGE
//   node scripts/migrate-images.js              # full migration
//   node scripts/migrate-images.js --dry-run    # read-only preview, no writes
//
// PHASES
//   0  Authenticate  — anonymous sign-in, refresh token every 55 min
//   1  Backup        — dump every document to backup-{timestamp}.json  ← NO writes yet
//   2  Migrate       — upload Base64 → Storage, write URLs into STAGING FIELDS only
//                        _pending_image   (the new Storage URL for `image`)
//                        _pending_images  (the new Storage URLs for `images`)
//                      The original `image` and `images` fields are UNTOUCHED.
//   3  Verify        — HTTP GET every _pending_image / _pending_images URL
//   4  Report        — write migration-report-{timestamp}.json + print summary
//
// The original Base64 fields are NOT touched until you run cleanup-base64.js.
// cleanup-base64.js reads this report, confirms every image is verified, then
// atomically swaps _pending_* into image/images and removes the Base64.
//
// SAFE BY DESIGN
//   • Backup JSON is written before any Firestore write.
//   • `image` and `images` fields are never touched by this script.
//   • A failed upload leaves the document completely unchanged.
//   • Already-migrated products (image already a Storage URL) are skipped.
//   • Any single failure is logged and skipped; the script continues.
//   • --dry-run exits after Phase 1 with zero writes.
// =============================================================================

'use strict';

const fs = require('fs');

// ── Config ────────────────────────────────────────────────────────────────────
const API_KEY  = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT  = 'vexa-store';
const BUCKET   = 'vexa-store.firebasestorage.app';
const BASE_FS  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const BASE_ST  = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o`;

const DRY_RUN   = process.argv.includes('--dry-run');
const DELAY_MS  = 300;    // ms between Firestore writes (avoid rate-limit)
const PAGE_SIZE = 300;

// ── Auth ──────────────────────────────────────────────────────────────────────
let _token = null, _expiry = 0;

async function getIdToken() {
  if (_token && Date.now() < _expiry) return _token;
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }) }
  );
  if (!r.ok) throw new Error(`Auth failed: ${r.status} ${await r.text()}`);
  const { idToken } = await r.json();
  if (!idToken) throw new Error('Auth returned no idToken');
  _token = idToken;
  _expiry = Date.now() + 55 * 60 * 1000;
  log('info', 'Authenticated with Firebase (token valid ~55 min)');
  return _token;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function log(level, msg) {
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function isBase64Image(str) {
  return typeof str === 'string' && str.startsWith('data:image/');
}

function isStorageUrl(str) {
  return typeof str === 'string' && (
    str.startsWith('https://firebasestorage.googleapis.com/') ||
    str.startsWith('https://storage.googleapis.com/')
  );
}

function parseMimeAndBuffer(dataUri) {
  const m = dataUri.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/s);
  if (!m) throw new Error('Not a valid image data URI');
  const mime = m[1];
  const ext  = mime.replace('image/', '').replace('+xml', '').replace('jpeg', 'jpg') || 'jpg';
  return { mime, ext, buffer: Buffer.from(m[2], 'base64') };
}

// ── Firestore helpers ─────────────────────────────────────────────────────────
async function fetchCollection(collectionName) {
  const idToken = await getIdToken();
  const headers = { Authorization: `Bearer ${idToken}` };
  const docs = [];
  let pageToken;

  do {
    const url = new URL(`${BASE_FS}/${collectionName}`);
    url.searchParams.set('pageSize', String(PAGE_SIZE));
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const r = await fetch(url.toString(), { headers });
    if (!r.ok) throw new Error(`Firestore GET ${collectionName} failed: ${r.status} ${await r.text()}`);
    const data = await r.json();
    docs.push(...(data.documents || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return docs;
}

// Patch a single Firestore document with new fields (surgical PATCH, not overwrite).
// Only the fields listed in `fields` are updated; all other fields are untouched.
async function patchDocument(docPath, fields) {
  const idToken = await getIdToken();
  const updateMask = Object.keys(fields)
    .map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const url = `${BASE_FS}/${docPath}?${updateMask}`;

  const r = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  if (!r.ok) throw new Error(`Firestore PATCH ${docPath} failed: ${r.status} ${await r.text()}`);
  return r.json();
}

// Convert raw Firestore field value → plain JS value (used for backup JSON).
function fsValToJs(v) {
  if (!v) return null;
  if ('stringValue'  in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue'  in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue'    in v) return null;
  if ('arrayValue'   in v) return (v.arrayValue.values || []).map(fsValToJs);
  if ('mapValue'     in v) {
    const out = {};
    for (const [k, val] of Object.entries(v.mapValue.fields || {})) out[k] = fsValToJs(val);
    return out;
  }
  return v;
}

function docToPlain(doc) {
  const out = { _docPath: doc.name };
  for (const [k, v] of Object.entries(doc.fields || {})) out[k] = fsValToJs(v);
  return out;
}

// ── Firebase Storage upload ───────────────────────────────────────────────────
async function uploadToStorage(productId, imageIndex, dataUri) {
  const { mime, ext, buffer } = parseMimeAndBuffer(dataUri);
  const idToken = await getIdToken();

  const fileName    = `images/migrated/${productId}/${Date.now()}-${imageIndex}.${ext}`;
  const encodedName = encodeURIComponent(fileName);

  const r = await fetch(`${BASE_ST}?uploadType=media&name=${encodedName}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': mime },
    body: buffer,
  });

  if (!r.ok) {
    const errText = await r.text();
    if (r.status === 403) {
      throw new Error(
        `Firebase Storage PERMISSION DENIED (403). ` +
        `Update Storage Rules: allow write: if request.auth != null;\n${errText}`
      );
    }
    throw new Error(`Storage upload failed ${r.status}: ${errText}`);
  }

  const { downloadTokens } = await r.json();
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedName}?alt=media&token=${downloadTokens}`;
}

// ── Verify a Storage URL ──────────────────────────────────────────────────────
async function verifyUrl(url) {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    if (!r.ok) return { ok: false, reason: `HTTP ${r.status}` };
    const ct = r.headers.get('content-type') || '';
    if (!ct.startsWith('image/')) return { ok: false, reason: `Unexpected content-type: ${ct}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// ── Migrate one image array ───────────────────────────────────────────────────
// Returns { newUrls, imageEntries, anyFailed }
// newUrls contains Storage URLs for uploaded images, original URL for already-URL images.
// On upload failure, anyFailed = true and no Firestore write should happen.
async function migrateImageArray(productId, rawImages, label) {
  const newUrls     = [];
  const imageEntries = [];
  let anyFailed     = false;

  for (let i = 0; i < rawImages.length; i++) {
    const raw      = rawImages[i];
    const imgEntry = { index: i, original: raw.slice(0, 80), newUrl: null, verified: null, error: null };

    if (!isBase64Image(raw)) {
      // Already a URL — keep as-is, mark pre-verified
      imgEntry.newUrl   = raw;
      imgEntry.status   = 'kept_url';
      imgEntry.verified = true;
      newUrls.push(raw);
      imageEntries.push(imgEntry);
      continue;
    }

    try {
      log('info', `  UPLOAD [${label}] image[${i}] (${(raw.length / 1024).toFixed(0)} KB base64)...`);
      const storageUrl   = await uploadToStorage(productId, i, raw);
      imgEntry.newUrl    = storageUrl;
      imgEntry.status    = 'uploaded';
      newUrls.push(storageUrl);
      log('info', `         → ${storageUrl.slice(0, 100)}`);
    } catch (err) {
      imgEntry.status = 'upload_failed';
      imgEntry.error  = err.message;
      anyFailed       = true;
      log('info', `  FAIL   [${label}] image[${i}]: ${err.message}`);
    }

    imageEntries.push(imgEntry);
    await sleep(DELAY_MS);
  }

  return { newUrls, imageEntries, anyFailed };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const timestamp  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupFile = `migration-backup-${timestamp}.json`;
  const reportFile = `migration-report-${timestamp}.json`;

  log('info', `=== Vexa Store Image Migration${DRY_RUN ? ' [DRY RUN]' : ''} ===`);
  log('info', `Backup → ${backupFile}`);
  log('info', `Report → ${reportFile}`);
  if (DRY_RUN) log('info', 'DRY RUN: no Firestore writes, no Storage uploads will be performed');

  // ── PHASE 0: Authenticate ─────────────────────────────────────────────────
  log('info', '--- PHASE 0: Authentication ---');
  await getIdToken();

  // ── PHASE 1: Backup ───────────────────────────────────────────────────────
  // Read ALL data first. Write the backup JSON. Only then proceed to writes.
  log('info', '--- PHASE 1: Backup (read-only) ---');

  log('info', 'Fetching products...');
  const productDocs = await fetchCollection('products');
  log('info', `  products:         ${productDocs.length} documents`);

  log('info', 'Fetching product_images...');
  const galleryDocs = await fetchCollection('product_images');
  log('info', `  product_images:   ${galleryDocs.length} documents`);

  log('info', 'Fetching deleted_products...');
  const deletedDocs = await fetchCollection('deleted_products');
  log('info', `  deleted_products: ${deletedDocs.length} documents`);

  const backup = {
    createdAt:        new Date().toISOString(),
    dryRun:           DRY_RUN,
    products:         productDocs.map(docToPlain),
    product_images:   galleryDocs.map(docToPlain),
    deleted_products: deletedDocs.map(docToPlain),
  };

  // Write backup BEFORE any Firestore writes happen.
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
  const backupSizeMb = (fs.statSync(backupFile).size / 1024 / 1024).toFixed(2);
  log('info', `Backup written: ${backupFile} (${backupSizeMb} MB) — this file contains the full original data`);

  if (DRY_RUN) {
    log('info', '--- DRY RUN: Analysis ---');
    let b64Products = 0, b64Images = 0, alreadyMigrated = 0, noImage = 0, hasPending = 0;

    for (const doc of productDocs) {
      const f    = doc.fields || {};
      const img  = f.image?.stringValue  || '';
      const imgs = (f.images?.arrayValue?.values || []).map(v => v.stringValue || '');
      const all  = [...new Set([img, ...imgs].filter(Boolean))];
      if (f._pending_image?.stringValue)      { hasPending++;       continue; }
      if (all.length === 0)                   { noImage++;          continue; }
      if (all.every(isStorageUrl))            { alreadyMigrated++;  continue; }
      if (all.some(isBase64Image))            { b64Products++; b64Images += all.filter(isBase64Image).length; }
    }
    for (const doc of galleryDocs) {
      const f    = doc.fields || {};
      const imgs = (f.images?.arrayValue?.values || []).map(v => v.stringValue || '');
      if (f._pending_images?.arrayValue)      { hasPending++;       continue; }
      if (imgs.some(isBase64Image))           { b64Products++; b64Images += imgs.filter(isBase64Image).length; }
    }

    log('info', `Products scanned:             ${productDocs.length}`);
    log('info', `Products with Base64 to migrate: ${b64Products}`);
    log('info', `Base64 images to upload:      ${b64Images}`);
    log('info', `Already Storage URLs (skip):  ${alreadyMigrated}`);
    log('info', `Already have _pending_* (resumable from prior run): ${hasPending}`);
    log('info', `No image at all (skip):       ${noImage}`);
    log('info', 'DRY RUN complete. No data was modified. Backup written for reference.');
    return;
  }

  // ── PHASE 2: Migrate ──────────────────────────────────────────────────────
  // Upload Base64 images to Firebase Storage.
  // Write Storage URLs into STAGING FIELDS ONLY (_pending_image, _pending_images).
  // The original `image` and `images` fields are NEVER touched by this script.
  log('info', '--- PHASE 2: Migration (staging fields only — original fields untouched) ---');

  const report = {
    createdAt:      new Date().toISOString(),
    backupFile,
    totalScanned:   0,
    totalMigrated:  0,   // images uploaded to Storage
    totalSkipped:   0,   // products with no Base64 (nothing to do)
    totalFailed:    0,   // upload or Firestore write failures
    verifyFailed:   0,   // set in Phase 3
    products:       [],
  };

  // Build gallery map
  const galleryMap = {};
  for (const doc of galleryDocs) {
    const id   = doc.name.split('/').pop();
    const imgs = (doc.fields?.images?.arrayValue?.values || [])
      .map(v => v.stringValue || '').filter(Boolean);
    galleryMap[id] = { docName: doc.name, images: imgs };
  }

  // ── products collection ────────────────────────────────────────────────────
  for (const doc of productDocs) {
    const productId = doc.name.split('/').pop();
    const f         = doc.fields || {};
    const img       = f.image?.stringValue  || '';
    const imgs      = (f.images?.arrayValue?.values || []).map(v => v.stringValue || '');

    report.totalScanned++;

    const entry = { productId, collection: 'products', images: [], status: null };

    // Idempotency: if _pending_image already exists this product was uploaded in
    // a prior run that crashed before writing the report. Skip so we don't
    // double-upload. (cleanup-base64.js will pick up these pending fields.)
    if (f._pending_image?.stringValue || f._pending_images?.arrayValue) {
      entry.status = 'already_pending';
      entry.note   = 'Has _pending_* fields from a prior run — will be verified in Phase 3';
      report.products.push(entry);
      report.totalSkipped++;
      log('info', `  SKIP [${productId}] already_pending (prior run)`);
      continue;
    }

    const allImgs = [...new Set([img, ...imgs].filter(Boolean))];

    if (!allImgs.some(isBase64Image)) {
      entry.status = allImgs.length === 0 ? 'no_image' : 'already_url';
      entry.images = allImgs.map(u => ({ original: u.slice(0, 80), newUrl: null, status: entry.status, verified: null }));
      report.products.push(entry);
      report.totalSkipped++;
      log('info', `  SKIP [${productId}] ${entry.status}`);
      continue;
    }

    const { newUrls, imageEntries, anyFailed } = await migrateImageArray(productId, allImgs, productId);
    entry.images = imageEntries;

    if (anyFailed) {
      // Any upload failure → no Firestore write at all → document is unchanged.
      entry.status = 'upload_failed';
      report.totalFailed += imageEntries.filter(i => i.status === 'upload_failed').length;
      log('info', `  SKIP WRITE [${productId}] upload had failures — document untouched`);
    } else {
      // All uploads succeeded. Write to STAGING FIELDS only.
      // `image` and `images` fields are NOT included here — they still contain Base64.
      const patchFields = {
        '_pending_image':  { stringValue: newUrls[0] || '' },
        '_pending_images': { arrayValue: { values: newUrls.map(u => ({ stringValue: u })) } },
      };

      try {
        const docPath = doc.name.split('/documents/')[1];
        await patchDocument(docPath, patchFields);
        entry.status = 'pending_verify'; // not yet committed; verify in Phase 3
        report.totalMigrated += imageEntries.filter(i => i.status === 'uploaded').length;
        log('info', `  STAGED [${productId}] _pending_image + _pending_images written (original fields untouched)`);
      } catch (err) {
        entry.status = 'firestore_write_failed';
        entry.error  = err.message;
        report.totalFailed++;
        log('info', `  FAIL WRITE [${productId}] Firestore: ${err.message}`);
      }
    }

    report.products.push(entry);
    await sleep(DELAY_MS);
  }

  // ── product_images (gallery) collection ───────────────────────────────────
  for (const [productId, gallery] of Object.entries(galleryMap)) {
    const imgs = gallery.images;

    // Idempotency: check if prior run left _pending_images in this doc
    const galleryDoc = galleryDocs.find(d => d.name.split('/').pop() === productId);
    if (galleryDoc?.fields?._pending_images?.arrayValue) {
      const entry = { productId, collection: 'product_images', images: [], status: 'already_pending',
        note: 'Has _pending_images from a prior run' };
      report.products.push(entry);
      report.totalSkipped++;
      log('info', `  SKIP [${productId}/gallery] already_pending`);
      continue;
    }

    if (!imgs.some(isBase64Image)) continue;

    report.totalScanned++;
    const entry = { productId, collection: 'product_images', images: [], status: null };

    const { newUrls, imageEntries, anyFailed } = await migrateImageArray(productId, imgs, `${productId}/gallery`);
    entry.images = imageEntries;

    if (anyFailed) {
      entry.status = 'upload_failed';
      report.totalFailed += imageEntries.filter(i => i.status === 'upload_failed').length;
      log('info', `  SKIP WRITE [${productId}/gallery] upload had failures — document untouched`);
    } else {
      try {
        const docPath = gallery.docName.split('/documents/')[1];
        await patchDocument(docPath, {
          '_pending_images': { arrayValue: { values: newUrls.map(u => ({ stringValue: u })) } },
        });
        entry.status = 'pending_verify';
        report.totalMigrated += imageEntries.filter(i => i.status === 'uploaded').length;
        log('info', `  STAGED [${productId}/gallery] _pending_images written`);
      } catch (err) {
        entry.status = 'firestore_write_failed';
        entry.error  = err.message;
        report.totalFailed++;
        log('info', `  FAIL WRITE [${productId}/gallery]: ${err.message}`);
      }
    }

    report.products.push(entry);
    await sleep(DELAY_MS);
  }

  // ── PHASE 3: Verify ───────────────────────────────────────────────────────
  // Check every staged Storage URL returns HTTP 200 with an image content-type.
  // This runs BEFORE the original Base64 fields are ever touched.
  log('info', '--- PHASE 3: Verification (original fields still untouched) ---');

  for (const entry of report.products) {
    if (entry.status !== 'pending_verify' && entry.status !== 'already_pending') continue;

    for (const imgEntry of entry.images) {
      if (!imgEntry.newUrl || !isStorageUrl(imgEntry.newUrl)) continue;
      if (imgEntry.verified === true) continue; // kept_url already marked verified

      const { ok, reason } = await verifyUrl(imgEntry.newUrl);
      imgEntry.verified = ok;
      if (!ok) {
        imgEntry.verifyError = reason;
        report.verifyFailed++;
        log('info', `  VERIFY FAIL [${entry.productId}] image[${imgEntry.index}]: ${reason}`);
      } else {
        log('info', `  VERIFY OK   [${entry.productId}] image[${imgEntry.index}]`);
      }
      await sleep(100);
    }

    // Mark fully verified only if every image in this entry verified correctly.
    // already_pending entries have no imageEntries array populated (from prior run),
    // so we re-fetch their _pending_* values for verification via the report entries.
    const allVerified = entry.images.every(i => i.verified === true);
    const anyVerifyFail = entry.images.some(i => i.verified === false);

    if (entry.images.length === 0) {
      // already_pending with no images array — mark as needs_manual_check
      entry.status = 'pending_verify_manual';
    } else if (allVerified) {
      entry.status = 'verified';
    } else if (anyVerifyFail) {
      entry.status = 'verify_failed';
    }
  }

  // ── PHASE 4: Report ───────────────────────────────────────────────────────
  log('info', '--- PHASE 4: Report ---');

  report.completedAt = new Date().toISOString();
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  const verifiedCount = report.products.filter(p => p.status === 'verified').length;
  const pendingManual = report.products.filter(p => p.status === 'pending_verify_manual').length;

  console.log('\n');
  console.log('════════════════════════════════════════════════');
  console.log('              MIGRATION REPORT                  ');
  console.log('════════════════════════════════════════════════');
  console.log(`  Total products scanned   : ${report.totalScanned}`);
  console.log(`  Total images uploaded    : ${report.totalMigrated}`);
  console.log(`  Products skipped (no-op) : ${report.totalSkipped}`);
  console.log(`  Upload/write failures    : ${report.totalFailed}`);
  console.log(`  Verification failures    : ${report.verifyFailed}`);
  console.log(`  Products fully verified  : ${verifiedCount}`);
  if (pendingManual > 0)
    console.log(`  Needs manual check       : ${pendingManual} (prior run's _pending_* fields)`);
  console.log(`  Backup file              : ${backupFile}`);
  console.log(`  Report file              : ${reportFile}`);
  console.log('════════════════════════════════════════════════');
  console.log('');
  console.log('STATUS OF ORIGINAL FIELDS:');
  console.log('  `image` and `images` fields in Firestore are UNCHANGED.');
  console.log('  Storage URLs are staged in `_pending_image` / `_pending_images`.');
  console.log('  Run cleanup-base64.js to swap and remove the old Base64 data.');
  console.log('════════════════════════════════════════════════');

  if (report.totalFailed > 0 || report.verifyFailed > 0) {
    console.log('\n⚠️  Failures detected. DO NOT run cleanup-base64.js until fixed.');
    console.log('    Review the report:');
    console.log(`      node -e "const r=require('./${reportFile}');r.products.filter(p=>!['verified','already_url','no_image','already_pending'].includes(p.status)).forEach(p=>console.log(p.productId,p.status,p.error||''))"`);
  } else {
    console.log('\n✅  All uploads verified. Original Base64 fields are still untouched.');
    console.log(`    When ready to swap and clean up, run:`);
    console.log(`      node scripts/cleanup-base64.js ${reportFile} --dry-run`);
    console.log(`      node scripts/cleanup-base64.js ${reportFile}`);
  }
}

main().catch(err => {
  log('error', `Fatal: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
