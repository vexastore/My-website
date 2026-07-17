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
//   1  Backup        — dump every document to backup-{timestamp}.json (no writes)
//   2  Migrate       — upload Base64 → Storage, write URL to Firestore
//                      old Base64 is kept in a _b64_backup_* field, NOT deleted
//   3  Verify        — HTTP GET every new Storage URL, confirm 200 + content-type image/*
//   4  Report        — write migration-report-{timestamp}.json + print summary
//
// SAFE BY DESIGN
//   • Backup is written BEFORE any Firestore write.
//   • Old Base64 is never deleted here; cleanup-base64.js handles that separately.
//   • Already-migrated products (image already a https:// URL) are skipped.
//   • Any single-image failure is recorded and skipped; the script continues.
//   • --dry-run exits after Phase 1 with zero writes.
// =============================================================================

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────
const API_KEY  = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT  = 'vexa-store';
const BUCKET   = 'vexa-store.firebasestorage.app';
const BASE_FS  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const BASE_ST  = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o`;

const DRY_RUN  = process.argv.includes('--dry-run');
const DELAY_MS = 300;   // ms between Firestore writes (avoid rate-limit)
const PAGE_SIZE = 300;

// ── Auth ──────────────────────────────────────────────────────────────────────
let _token  = null;
let _expiry = 0;

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
  _token  = idToken;
  _expiry = Date.now() + 55 * 60 * 1000;
  log('info', 'Authenticated with Firebase (token valid ~55 min)');
  return _token;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function log(level, msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level.toUpperCase()}] ${msg}`);
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

// Patch a single Firestore document with new fields (PATCH, not overwrite).
// Only the listed fields are updated; all others are untouched.
async function patchDocument(docPath, fields) {
  const idToken = await getIdToken();
  const updateMask = Object.keys(fields).map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const url = `${BASE_FS}/${docPath}?${updateMask}`;

  const body = { fields };
  const r = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Firestore PATCH ${docPath} failed: ${r.status} ${await r.text()}`);
  return r.json();
}

// Convert a raw Firestore field value object back to a plain JS value (for backup).
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

// ── Verify a Storage URL is accessible ───────────────────────────────────────
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

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
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
  log('info', '--- PHASE 1: Backup ---');
  log('info', 'Fetching products collection...');
  const productDocs  = await fetchCollection('products');
  log('info', `  products:       ${productDocs.length} documents`);

  log('info', 'Fetching product_images collection...');
  const galleryDocs  = await fetchCollection('product_images');
  log('info', `  product_images: ${galleryDocs.length} documents`);

  log('info', 'Fetching deleted_products collection...');
  const deletedDocs  = await fetchCollection('deleted_products');
  log('info', `  deleted_products: ${deletedDocs.length} documents`);

  const backup = {
    createdAt:       new Date().toISOString(),
    dryRun:          DRY_RUN,
    products:        productDocs.map(docToPlain),
    product_images:  galleryDocs.map(docToPlain),
    deleted_products: deletedDocs.map(docToPlain),
  };

  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
  log('info', `Backup written to ${backupFile} (${(fs.statSync(backupFile).size / 1024 / 1024).toFixed(2)} MB)`);

  if (DRY_RUN) {
    // In dry-run mode, analyse what WOULD be migrated and exit.
    log('info', '--- DRY RUN: Analysis only ---');
    let b64Products = 0, b64Images = 0, alreadyUrl = 0, empty = 0;

    for (const doc of productDocs) {
      const f = doc.fields || {};
      const img  = f.image?.stringValue  || '';
      const imgs = (f.images?.arrayValue?.values || []).map(v => v.stringValue || '');
      const allImgs = [img, ...imgs].filter(Boolean);
      if (allImgs.length === 0)                  { empty++; continue; }
      if (allImgs.every(isStorageUrl))            { alreadyUrl++; continue; }
      if (allImgs.some(isBase64Image))            { b64Products++; b64Images += allImgs.filter(isBase64Image).length; }
    }
    for (const doc of galleryDocs) {
      const imgs = (doc.fields?.images?.arrayValue?.values || []).map(v => v.stringValue || '');
      if (imgs.some(isBase64Image)) { b64Products++; b64Images += imgs.filter(isBase64Image).length; }
    }

    log('info', `Products scanned:           ${productDocs.length}`);
    log('info', `Products with Base64 images: ${b64Products}`);
    log('info', `Base64 images to upload:     ${b64Images}`);
    log('info', `Already Storage URLs:        ${alreadyUrl}`);
    log('info', `No image at all:             ${empty}`);
    log('info', 'DRY RUN complete. No data was modified.');
    return;
  }

  // ── PHASE 2: Migrate ──────────────────────────────────────────────────────
  log('info', '--- PHASE 2: Migration ---');

  // Build a map: productId → gallery images (product_images collection)
  const galleryMap = {};
  for (const doc of galleryDocs) {
    const id   = doc.name.split('/').pop();
    const imgs = (doc.fields?.images?.arrayValue?.values || []).map(v => v.stringValue || '').filter(Boolean);
    galleryMap[id] = { docName: doc.name, images: imgs };
  }

  const report = {
    createdAt:     new Date().toISOString(),
    backupFile,
    totalScanned:  0,
    totalMigrated: 0,
    totalSkipped:  0,
    totalFailed:   0,
    products:      [],
  };

  // Process products collection
  for (const doc of productDocs) {
    const productId = doc.name.split('/').pop();
    const f         = doc.fields || {};
    const img       = f.image?.stringValue  || '';
    const imgs      = (f.images?.arrayValue?.values || []).map(v => v.stringValue || '');

    report.totalScanned++;

    const entry = { productId, collection: 'products', images: [], status: null };

    // Gather all unique images for this product
    const allImgs = [...new Set([img, ...imgs].filter(Boolean))];

    // Check if any need migration
    const needsMigration = allImgs.some(isBase64Image);
    if (!needsMigration) {
      entry.status = allImgs.length === 0 ? 'no_image' : 'already_url';
      entry.images = allImgs.map(u => ({ original: u.slice(0, 60) + (u.length > 60 ? '...' : ''), newUrl: null, status: entry.status }));
      report.products.push(entry);
      report.totalSkipped++;
      log('info', `  SKIP [${productId}] ${entry.status}`);
      continue;
    }

    // Migrate each image
    const newImageUrls  = [];
    let   productFailed = false;

    for (let i = 0; i < allImgs.length; i++) {
      const raw = allImgs[i];
      const imgEntry = { index: i, original: raw.slice(0, 80), newUrl: null, verified: null, error: null };

      if (!isBase64Image(raw)) {
        imgEntry.newUrl  = raw;
        imgEntry.status  = 'kept_url';
        imgEntry.verified = true;
        newImageUrls.push(raw);
        entry.images.push(imgEntry);
        continue;
      }

      try {
        log('info', `  UPLOAD [${productId}] image[${i}] (${(raw.length / 1024).toFixed(0)} KB base64)...`);
        const storageUrl = await uploadToStorage(productId, i, raw);
        imgEntry.newUrl  = storageUrl;
        imgEntry.status  = 'uploaded';
        newImageUrls.push(storageUrl);
        log('info', `         → ${storageUrl.slice(0, 100)}`);
        report.totalMigrated++;
      } catch (err) {
        imgEntry.status = 'upload_failed';
        imgEntry.error  = err.message;
        productFailed   = true;
        log('info', `  FAIL   [${productId}] image[${i}]: ${err.message}`);
        report.totalFailed++;
        newImageUrls.push(raw); // keep original on failure
      }

      entry.images.push(imgEntry);
      await sleep(DELAY_MS);
    }

    if (!productFailed && newImageUrls.length > 0) {
      // Write new URLs to Firestore.
      // Store old Base64 in _b64_backup_image / _b64_backup_images for safety.
      // These backup fields are removed only by cleanup-base64.js after verification.
      const patchFields = {};

      // Back up old Base64 fields (truncated to 50 chars just to mark presence)
      if (img && isBase64Image(img))   patchFields['_b64_backup_image']  = { stringValue: '[backed-up]' };
      if (imgs.some(isBase64Image))    patchFields['_b64_backup_images'] = { stringValue: '[backed-up]' };

      // Write new Storage URLs
      patchFields['image']  = { stringValue: newImageUrls[0] || '' };
      patchFields['images'] = {
        arrayValue: { values: newImageUrls.map(u => ({ stringValue: u })) }
      };

      try {
        const docPathSegment = doc.name.split('/documents/')[1];
        await patchDocument(docPathSegment, patchFields);
        entry.status = 'migrated';
        log('info', `  SAVED  [${productId}] Firestore updated with ${newImageUrls.length} Storage URL(s)`);
      } catch (err) {
        entry.status = 'firestore_write_failed';
        entry.error  = err.message;
        log('info', `  FAIL   [${productId}] Firestore write: ${err.message}`);
        report.totalFailed++;
      }
    } else if (productFailed) {
      entry.status = 'partial_failure';
    }

    report.products.push(entry);
    await sleep(DELAY_MS);
  }

  // Process product_images collection (gallery)
  for (const [productId, gallery] of Object.entries(galleryMap)) {
    const imgs = gallery.images;
    if (!imgs.some(isBase64Image)) continue;

    report.totalScanned++;
    const entry = { productId, collection: 'product_images', images: [], status: null };
    const newUrls = [];
    let failed = false;

    for (let i = 0; i < imgs.length; i++) {
      const raw = imgs[i];
      const imgEntry = { index: i, original: raw.slice(0, 80), newUrl: null, verified: null, error: null };

      if (!isBase64Image(raw)) {
        imgEntry.newUrl = raw; imgEntry.status = 'kept_url'; imgEntry.verified = true;
        newUrls.push(raw); entry.images.push(imgEntry); continue;
      }

      try {
        log('info', `  UPLOAD [${productId}/gallery] image[${i}] (${(raw.length / 1024).toFixed(0)} KB base64)...`);
        const storageUrl = await uploadToStorage(productId, i, raw);
        imgEntry.newUrl = storageUrl; imgEntry.status = 'uploaded';
        newUrls.push(storageUrl);
        log('info', `         → ${storageUrl.slice(0, 100)}`);
        report.totalMigrated++;
      } catch (err) {
        imgEntry.status = 'upload_failed'; imgEntry.error = err.message;
        failed = true; newUrls.push(raw); report.totalFailed++;
        log('info', `  FAIL   [${productId}/gallery] image[${i}]: ${err.message}`);
      }

      entry.images.push(imgEntry);
      await sleep(DELAY_MS);
    }

    if (!failed) {
      try {
        const docPathSegment = gallery.docName.split('/documents/')[1];
        await patchDocument(docPathSegment, {
          '_b64_backup_images': { stringValue: '[backed-up]' },
          'images': { arrayValue: { values: newUrls.map(u => ({ stringValue: u })) } },
        });
        entry.status = 'migrated';
        log('info', `  SAVED  [${productId}/gallery] Firestore updated`);
      } catch (err) {
        entry.status = 'firestore_write_failed'; entry.error = err.message;
        log('info', `  FAIL   [${productId}/gallery] write: ${err.message}`);
        report.totalFailed++;
      }
    } else {
      entry.status = 'partial_failure';
    }

    report.products.push(entry);
    await sleep(DELAY_MS);
  }

  // ── PHASE 3: Verify ───────────────────────────────────────────────────────
  log('info', '--- PHASE 3: Verification ---');

  for (const entry of report.products) {
    if (entry.status !== 'migrated') continue;
    for (const imgEntry of entry.images) {
      if (!imgEntry.newUrl || !isStorageUrl(imgEntry.newUrl)) continue;
      const { ok, reason } = await verifyUrl(imgEntry.newUrl);
      imgEntry.verified = ok;
      if (!ok) {
        imgEntry.verifyError = reason;
        log('info', `  VERIFY FAIL [${entry.productId}] image[${imgEntry.index}]: ${reason}`);
        report.totalFailed++;
      } else {
        log('info', `  VERIFY OK   [${entry.productId}] image[${imgEntry.index}]`);
      }
      await sleep(100);
    }
  }

  // ── PHASE 4: Report ───────────────────────────────────────────────────────
  log('info', '--- PHASE 4: Report ---');

  const verifyFailed = report.products.flatMap(p => p.images || []).filter(i => i.verified === false).length;
  report.verifyFailed = verifyFailed;
  report.completedAt  = new Date().toISOString();

  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  console.log('\n');
  console.log('════════════════════════════════════════');
  console.log('           MIGRATION REPORT             ');
  console.log('════════════════════════════════════════');
  console.log(`  Total products scanned : ${report.totalScanned}`);
  console.log(`  Total images migrated  : ${report.totalMigrated}`);
  console.log(`  Total skipped (no-op)  : ${report.totalSkipped}`);
  console.log(`  Total failures         : ${report.totalFailed}`);
  console.log(`  Verification failures  : ${report.verifyFailed}`);
  console.log(`  Backup file            : ${backupFile}`);
  console.log(`  Report file            : ${reportFile}`);
  console.log('════════════════════════════════════════');

  if (report.totalFailed > 0 || report.verifyFailed > 0) {
    console.log('\n⚠️  Some images failed. Review the report before running cleanup.');
    console.log(`   cat ${reportFile} | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8');const r=JSON.parse(d);r.products.filter(p=>p.status!='migrated'&&p.status!='already_url'&&p.status!='no_image').forEach(p=>console.log(p.productId,p.status,p.error||''))"`);
  } else {
    console.log('\n✅  All images migrated and verified successfully.');
    console.log(`    When ready, run: node scripts/cleanup-base64.js ${reportFile}`);
  }
}

main().catch(err => {
  log('error', `Fatal: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
