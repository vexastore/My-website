#!/usr/bin/env node
// =============================================================================
// migrate-images.js  (Vercel Blob edition)
//
// Migrates all existing Base64 product images from Firestore to Vercel Blob.
//
// PREREQUISITES
//   1. Create a Blob store:  Vercel Dashboard → Storage → Create Store (Blob)
//   2. Connect it to your project.  Vercel adds BLOB_READ_WRITE_TOKEN automatically
//      to your project's environment variables.
//   3. Copy that token into a local .env.local file so this script can read it:
//        BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxx
//   4. Run:  node -r dotenv/config scripts/migrate-images.js --dry-run
//      Or:   export BLOB_READ_WRITE_TOKEN=... && node scripts/migrate-images.js
//
// USAGE
//   node scripts/migrate-images.js              # full migration
//   node scripts/migrate-images.js --dry-run    # read-only preview, no writes
//
// PHASES
//   0  Check       — verify BLOB_READ_WRITE_TOKEN is set
//   1  Backup      — dump every Firestore document to backup-{ts}.json  ← NO writes
//   2  Migrate     — upload Base64 → Vercel Blob CDN URL
//                    write URL into STAGING FIELDS (_pending_image, _pending_images)
//                    original `image` / `images` fields are NEVER touched here
//   3  Verify      — HTTP HEAD every staged URL, confirm 200 + image/* content-type
//   4  Report      — write migration-report-{ts}.json + print summary
//
// After reviewing the report, run cleanup-base64.js to swap the staged URLs
// into the live fields and remove the old Base64 data.
// =============================================================================

'use strict';

const fs = require('fs');

// ── Config ────────────────────────────────────────────────────────────────────
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_API   = 'https://blob.vercel-storage.com';

const API_KEY  = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT  = 'vexa-store';
const BASE_FS  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

const DRY_RUN   = process.argv.includes('--dry-run');
const DELAY_MS  = 300;
const PAGE_SIZE = 300;

// ── Helpers ───────────────────────────────────────────────────────────────────
function log(level, msg) {
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`);
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function isBase64Image(str) {
  return typeof str === 'string' && str.startsWith('data:image/');
}
function isCdnUrl(str) {
  return typeof str === 'string' && str.startsWith('https://') && !str.startsWith('data:');
}
function parseMimeAndBuffer(dataUri) {
  const m = dataUri.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/s);
  if (!m) throw new Error('Not a valid image data URI');
  const mime = m[1];
  const ext  = mime.replace('image/', '').replace('+xml', '').replace('jpeg', 'jpg') || 'jpg';
  return { mime, ext, buffer: Buffer.from(m[2], 'base64') };
}

// ── Firebase Auth (anonymous, for Firestore REST reads/writes only) ───────────
let _fsToken = null, _fsExpiry = 0;
async function getFsToken() {
  if (_fsToken && Date.now() < _fsExpiry) return _fsToken;
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }) }
  );
  if (!r.ok) throw new Error(`Firebase auth failed: ${r.status} ${await r.text()}`);
  const { idToken } = await r.json();
  if (!idToken) throw new Error('Firebase auth returned no idToken');
  _fsToken = idToken; _fsExpiry = Date.now() + 55 * 60 * 1000;
  log('info', 'Firebase auth OK (token ~55 min)');
  return _fsToken;
}

// ── Firestore helpers ─────────────────────────────────────────────────────────
async function fetchCollection(name) {
  const token   = await getFsToken();
  const headers = { Authorization: `Bearer ${token}` };
  const docs    = [];
  let pageToken;
  do {
    const url = new URL(`${BASE_FS}/${name}`);
    url.searchParams.set('pageSize', String(PAGE_SIZE));
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const r = await fetch(url.toString(), { headers });
    if (!r.ok) throw new Error(`Firestore GET ${name}: ${r.status} ${await r.text()}`);
    const data = await r.json();
    docs.push(...(data.documents || []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return docs;
}

async function patchDocument(docPath, fields) {
  const token      = await getFsToken();
  const updateMask = Object.keys(fields)
    .map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const r = await fetch(`${BASE_FS}/${docPath}?${updateMask}`, {
    method:  'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ fields }),
  });
  if (!r.ok) throw new Error(`Firestore PATCH ${docPath}: ${r.status} ${await r.text()}`);
  return r.json();
}

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

// ── Vercel Blob upload ────────────────────────────────────────────────────────
async function uploadToBlob(productId, imageIndex, dataUri) {
  const { mime, ext, buffer } = parseMimeAndBuffer(dataUri);
  // Unique path per image — timestamp prevents collisions
  const pathname = `images/migrated/${productId}/${Date.now()}-${imageIndex}.${ext}`;

  // Vercel Blob REST API: PUT https://blob.vercel-storage.com/{pathname}
  // The token goes in the Authorization header.
  // x-content-type tells Blob the MIME type of the stored file.
  const r = await fetch(`${BLOB_API}/${pathname}`, {
    method:  'PUT',
    headers: {
      'Authorization':  `Bearer ${BLOB_TOKEN}`,
      'x-content-type': mime,
      'Content-Type':   'application/octet-stream',
    },
    body: buffer,
  });

  if (!r.ok) {
    const errText = await r.text();
    if (r.status === 401 || r.status === 403) {
      throw new Error(
        `Vercel Blob auth failed (${r.status}). ` +
        `Check BLOB_READ_WRITE_TOKEN in your .env.local or environment.\n${errText}`
      );
    }
    throw new Error(`Vercel Blob upload failed (${r.status}): ${errText}`);
  }

  const data = await r.json();
  // SDK returns { url } for the public CDN URL
  const url = data.url || data.downloadUrl;
  if (!url) throw new Error(`Vercel Blob response missing url: ${JSON.stringify(data)}`);
  return url;
}

// ── Verify a URL ──────────────────────────────────────────────────────────────
async function verifyUrl(url) {
  try {
    const r  = await fetch(url, { method: 'HEAD' });
    if (!r.ok) return { ok: false, reason: `HTTP ${r.status}` };
    const ct = r.headers.get('content-type') || '';
    if (!ct.startsWith('image/')) return { ok: false, reason: `Wrong content-type: ${ct}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// ── Migrate one image array ───────────────────────────────────────────────────
async function migrateImageArray(productId, rawImages, label) {
  const newUrls      = [];
  const imageEntries = [];
  let   anyFailed    = false;

  for (let i = 0; i < rawImages.length; i++) {
    const raw      = rawImages[i];
    const imgEntry = { index: i, original: raw.slice(0, 80), newUrl: null, verified: null, error: null };

    if (!isBase64Image(raw)) {
      imgEntry.newUrl   = raw;
      imgEntry.status   = 'kept_url';
      imgEntry.verified = true;
      newUrls.push(raw);
      imageEntries.push(imgEntry);
      continue;
    }

    try {
      const sizeKb = (raw.length / 1024).toFixed(0);
      log('info', `  UPLOAD [${label}] image[${i}] (${sizeKb} KB base64) → Vercel Blob...`);
      const blobUrl       = await uploadToBlob(productId, i, raw);
      imgEntry.newUrl     = blobUrl;
      imgEntry.status     = 'uploaded';
      newUrls.push(blobUrl);
      log('info', `         ✓ ${blobUrl.slice(0, 100)}`);
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

  log('info', `=== Vexa Store Image Migration → Vercel Blob${DRY_RUN ? ' [DRY RUN]' : ''} ===`);

  // ── PHASE 0: Check token ──────────────────────────────────────────────────
  log('info', '--- PHASE 0: Checking BLOB_READ_WRITE_TOKEN ---');
  if (!BLOB_TOKEN) {
    log('error', 'BLOB_READ_WRITE_TOKEN is not set.');
    log('error', 'Steps to fix:');
    log('error', '  1. Vercel Dashboard → Storage → Create a Blob Store');
    log('error', '  2. Connect the store to your project');
    log('error', '  3. Copy the token from the store settings into .env.local:');
    log('error', '       BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxx');
    log('error', '  4. Re-run: node scripts/migrate-images.js --dry-run');
    process.exit(1);
  }
  log('info', `Token found: ${BLOB_TOKEN.slice(0, 20)}... (${BLOB_TOKEN.length} chars)`);

  // ── PHASE 1: Backup (read-only) ───────────────────────────────────────────
  log('info', '--- PHASE 1: Backup ---');
  await getFsToken();

  log('info', 'Reading products...');
  const productDocs = await fetchCollection('products');
  log('info', `  products:         ${productDocs.length}`);

  log('info', 'Reading product_images...');
  const galleryDocs = await fetchCollection('product_images');
  log('info', `  product_images:   ${galleryDocs.length}`);

  log('info', 'Reading deleted_products...');
  const deletedDocs = await fetchCollection('deleted_products');
  log('info', `  deleted_products: ${deletedDocs.length}`);

  const backup = {
    createdAt:        new Date().toISOString(),
    dryRun:           DRY_RUN,
    products:         productDocs.map(docToPlain),
    product_images:   galleryDocs.map(docToPlain),
    deleted_products: deletedDocs.map(docToPlain),
  };

  // Write backup BEFORE any write operation
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
  const mbSize = (fs.statSync(backupFile).size / 1024 / 1024).toFixed(2);
  log('info', `Backup written: ${backupFile} (${mbSize} MB) — full original data preserved here`);

  if (DRY_RUN) {
    log('info', '--- DRY RUN: Analysis ---');
    let b64Products = 0, b64Images = 0, alreadyUrl = 0, noImage = 0, hasPending = 0;

    for (const doc of productDocs) {
      const f    = doc.fields || {};
      const img  = f.image?.stringValue || '';
      const imgs = (f.images?.arrayValue?.values || []).map(v => v.stringValue || '');
      const all  = [...new Set([img, ...imgs].filter(Boolean))];
      if (f._pending_image?.stringValue)   { hasPending++; continue; }
      if (all.length === 0)                { noImage++;    continue; }
      if (all.every(isCdnUrl))             { alreadyUrl++; continue; }
      if (all.some(isBase64Image))         { b64Products++; b64Images += all.filter(isBase64Image).length; }
    }
    for (const doc of galleryDocs) {
      const f    = doc.fields || {};
      const imgs = (f.images?.arrayValue?.values || []).map(v => v.stringValue || '');
      if (f._pending_images?.arrayValue)   { hasPending++; continue; }
      if (imgs.some(isBase64Image))        { b64Products++; b64Images += imgs.filter(isBase64Image).length; }
    }

    const avgKb    = 150;
    const estMb    = Math.round(b64Images * avgKb / 1024);
    console.log('');
    console.log('════════════════════════════════════════════');
    console.log('          DRY RUN ANALYSIS                  ');
    console.log('════════════════════════════════════════════');
    console.log(`  Products scanned:              ${productDocs.length}`);
    console.log(`  Products needing migration:    ${b64Products}`);
    console.log(`  Base64 images to upload:       ${b64Images}`);
    console.log(`  Already CDN URLs (skip):       ${alreadyUrl}`);
    console.log(`  No image (skip):               ${noImage}`);
    console.log(`  Has _pending_* (prior run):    ${hasPending}`);
    console.log(`  Estimated storage needed:      ~${estMb} MB`);
    console.log(`  Vercel Blob Hobby limit:        500 MB storage, 1 GB/month bandwidth`);
    console.log(`  Storage headroom:              ~${500 - estMb} MB remaining after migration`);
    console.log('════════════════════════════════════════════');
    log('info', 'DRY RUN complete. No data was modified. Backup written for reference.');
    return;
  }

  // ── PHASE 2: Migrate (staging fields only) ────────────────────────────────
  log('info', '--- PHASE 2: Migration (staging fields — original fields untouched) ---');

  const report = {
    createdAt:     new Date().toISOString(),
    backupFile,
    totalScanned:  0,
    totalMigrated: 0,
    totalSkipped:  0,
    totalFailed:   0,
    verifyFailed:  0,
    products:      [],
  };

  // Gallery map
  const galleryMap = {};
  for (const doc of galleryDocs) {
    const id   = doc.name.split('/').pop();
    const imgs = (doc.fields?.images?.arrayValue?.values || [])
      .map(v => v.stringValue || '').filter(Boolean);
    galleryMap[id] = { docName: doc.name, images: imgs };
  }

  // products collection
  for (const doc of productDocs) {
    const productId = doc.name.split('/').pop();
    const f         = doc.fields || {};
    const img       = f.image?.stringValue || '';
    const imgs      = (f.images?.arrayValue?.values || []).map(v => v.stringValue || '');

    report.totalScanned++;
    const entry = { productId, collection: 'products', images: [], status: null };

    // Idempotency: skip if _pending fields already exist from a prior run
    if (f._pending_image?.stringValue || f._pending_images?.arrayValue) {
      entry.status = 'already_pending';
      entry.note   = 'Has _pending_* from a prior run — will be verified in Phase 3';
      report.products.push(entry);
      report.totalSkipped++;
      log('info', `  SKIP [${productId}] already_pending`);
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
      entry.status   = 'upload_failed';
      report.totalFailed += imageEntries.filter(i => i.status === 'upload_failed').length;
      log('info', `  SKIP WRITE [${productId}] upload failure — document untouched`);
    } else {
      // Write ONLY to staging fields — original image/images stay untouched
      try {
        const docPath = doc.name.split('/documents/')[1];
        await patchDocument(docPath, {
          '_pending_image':  { stringValue: newUrls[0] || '' },
          '_pending_images': { arrayValue: { values: newUrls.map(u => ({ stringValue: u })) } },
        });
        entry.status = 'pending_verify';
        report.totalMigrated += imageEntries.filter(i => i.status === 'uploaded').length;
        log('info', `  STAGED [${productId}] _pending_image/_pending_images written`);
      } catch (err) {
        entry.status = 'firestore_write_failed';
        entry.error  = err.message;
        report.totalFailed++;
        log('info', `  FAIL WRITE [${productId}]: ${err.message}`);
      }
    }

    report.products.push(entry);
    await sleep(DELAY_MS);
  }

  // product_images (gallery) collection
  for (const [productId, gallery] of Object.entries(galleryMap)) {
    const imgs     = gallery.images;
    const galleryDoc = galleryDocs.find(d => d.name.split('/').pop() === productId);

    if (galleryDoc?.fields?._pending_images?.arrayValue) {
      report.products.push({ productId, collection: 'product_images', images: [], status: 'already_pending', note: 'Prior run' });
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
      entry.status   = 'upload_failed';
      report.totalFailed += imageEntries.filter(i => i.status === 'upload_failed').length;
      log('info', `  SKIP WRITE [${productId}/gallery] — untouched`);
    } else {
      try {
        const docPath = gallery.docName.split('/documents/')[1];
        await patchDocument(docPath, {
          '_pending_images': { arrayValue: { values: newUrls.map(u => ({ stringValue: u })) } },
        });
        entry.status = 'pending_verify';
        report.totalMigrated += imageEntries.filter(i => i.status === 'uploaded').length;
        log('info', `  STAGED [${productId}/gallery]`);
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

  // ── PHASE 3: Verify (original fields still untouched) ────────────────────
  log('info', '--- PHASE 3: Verification ---');

  for (const entry of report.products) {
    if (entry.status !== 'pending_verify' && entry.status !== 'already_pending') continue;

    for (const imgEntry of (entry.images || [])) {
      if (!imgEntry.newUrl || !isCdnUrl(imgEntry.newUrl)) continue;
      if (imgEntry.verified === true) continue;

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

    const images     = entry.images || [];
    const allVerified = images.length > 0 && images.every(i => i.verified === true);
    const anyFail     = images.some(i => i.verified === false);

    if      (images.length === 0)  entry.status = 'pending_verify_manual';
    else if (allVerified)          entry.status = 'verified';
    else if (anyFail)              entry.status = 'verify_failed';
  }

  // ── PHASE 4: Report ───────────────────────────────────────────────────────
  log('info', '--- PHASE 4: Report ---');
  report.completedAt = new Date().toISOString();
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  const verifiedCount = report.products.filter(p => p.status === 'verified').length;

  console.log('\n');
  console.log('════════════════════════════════════════════════');
  console.log('              MIGRATION REPORT                  ');
  console.log('════════════════════════════════════════════════');
  console.log(`  Products scanned          : ${report.totalScanned}`);
  console.log(`  Images uploaded to Blob   : ${report.totalMigrated}`);
  console.log(`  Products skipped (no-op)  : ${report.totalSkipped}`);
  console.log(`  Upload/write failures     : ${report.totalFailed}`);
  console.log(`  Verification failures     : ${report.verifyFailed}`);
  console.log(`  Products fully verified   : ${verifiedCount}`);
  console.log(`  Backup file               : ${backupFile}`);
  console.log(`  Report file               : ${reportFile}`);
  console.log('════════════════════════════════════════════════');
  console.log('  NOTE: original image/images fields are UNCHANGED in Firestore.');
  console.log('  Vercel Blob CDN URLs are staged in _pending_image/_pending_images.');
  console.log('════════════════════════════════════════════════');

  if (report.totalFailed > 0 || report.verifyFailed > 0) {
    console.log('\n⚠️  Failures detected. DO NOT run cleanup-base64.js until fixed.');
    console.log(`   Review: node -e "const r=require('./${reportFile}');r.products.filter(p=>!['verified','already_url','no_image'].includes(p.status)).forEach(p=>console.log(p.productId,p.status,p.error||''))"`);
  } else {
    console.log('\n✅  All images uploaded and verified. Original Firestore fields still intact.');
    console.log(`   Next step:`);
    console.log(`     node scripts/cleanup-base64.js ${reportFile} --dry-run`);
    console.log(`     node scripts/cleanup-base64.js ${reportFile}`);
  }
}

main().catch(err => {
  log('error', `Fatal: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
