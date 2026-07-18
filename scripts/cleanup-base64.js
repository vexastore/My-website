#!/usr/bin/env node
// =============================================================================
// cleanup-base64.js
//
// STEP 2 — Swap staged Vercel Blob CDN URLs into the live fields and remove Base64.
//
// Run this ONLY after:
//   1. migrate-images.js completed with zero upload failures and zero verify failures
//   2. You have reviewed migration-report-{timestamp}.json and confirmed it
//   3. You have spot-checked several image URLs in a browser
//
// WHAT THIS DOES (per document, in order):
//   a. Reads the staged _pending_image / _pending_images values from the report.
//   b. Confirms every staged URL has verified === true in the report.
//      Refuses to proceed if any image has verified !== true.
//   c. Writes a single PATCH to Firestore that:
//        - Sets `image`  = _pending_image   (the new Vercel Blob CDN URL)
//        - Sets `images` = _pending_images  (the new Vercel Blob CDN URL array)
//        - Removes `_pending_image` and `_pending_images` staging fields
//      This is the ONLY moment the original Base64 in `image`/`images` is replaced.
//   d. The JSON backup file always retains the original Base64 data.
//
// SAFETY GATES (all must pass or the script exits before touching any document):
//   • Every image in every verified product must have verified === true (not false, not null).
//   • No product may have a failed status (upload_failed, firestore_write_failed, etc.).
//   • Interactive YES prompt before writing (skipped only if stdin is not a terminal).
//
// USAGE
//   node scripts/cleanup-base64.js migration-report-{timestamp}.json --dry-run
//   node scripts/cleanup-base64.js migration-report-{timestamp}.json
// =============================================================================

'use strict';

const fs = require('fs');

const API_KEY  = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT  = 'vexa-store';
const BASE_FS  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const DELAY_MS = 200;
const DRY_RUN  = process.argv.includes('--dry-run');

const reportArg = process.argv.find(a => a.endsWith('.json') && !a.includes('--'));
if (!reportArg) {
  console.error('Usage: node scripts/cleanup-base64.js migration-report-{timestamp}.json [--dry-run]');
  process.exit(1);
}
if (!fs.existsSync(reportArg)) {
  console.error(`Report file not found: ${reportArg}`);
  process.exit(1);
}

function log(level, msg) {
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Accepts any HTTPS CDN URL — Vercel Blob (*.public.blob.vercel-storage.com)
// or any other https:// URL that is NOT a data: URI.
function isCdnUrl(str) {
  return typeof str === 'string' &&
    str.startsWith('https://') &&
    !str.startsWith('data:');
}

let _token = null, _expiry = 0;
async function getIdToken() {
  if (_token && Date.now() < _expiry) return _token;
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }) }
  );
  if (!r.ok) throw new Error(`Auth failed: ${r.status}`);
  const { idToken } = await r.json();
  if (!idToken) throw new Error('Auth returned no idToken');
  _token = idToken; _expiry = Date.now() + 55 * 60 * 1000;
  return _token;
}

// Single PATCH that atomically:
//   - Writes newImageUrl  → `image`
//   - Writes newImageUrls → `images`
//   - Removes `_pending_image` and `_pending_images` (absent from body but in mask)
// All four fields are in the update mask; the body only includes `image` and `images`.
// Firestore deletes any masked field that is absent from the document body.
async function swapAndClean(docPath, newImageUrl, newImageUrls) {
  const idToken = await getIdToken();

  const fieldsToMask = ['image', 'images', '_pending_image', '_pending_images'];
  const updateMask   = fieldsToMask
    .map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');

  // Body only contains the fields we WANT to set (image, images).
  // _pending_image and _pending_images are in the mask but absent from the body → deleted.
  const body = {
    fields: {
      image:  { stringValue: newImageUrl },
      images: { arrayValue: { values: newImageUrls.map(u => ({ stringValue: u })) } },
    },
  };

  const r = await fetch(`${BASE_FS}/${docPath}?${updateMask}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!r.ok) throw new Error(`Firestore PATCH ${docPath} failed: ${r.status} ${await r.text()}`);
}

async function main() {
  log('info', `=== Vexa Store Base64 Cleanup${DRY_RUN ? ' [DRY RUN]' : ''} ===`);
  log('info', `Report: ${reportArg}`);

  const report = JSON.parse(fs.readFileSync(reportArg, 'utf8'));

  // ── Safety Gate ───────────────────────────────────────────────────────────
  // Check every single image entry across all verified products.
  // verified must be strictly true. false, null, and undefined all block cleanup.

  const SAFE_SKIP_STATUSES = new Set(['already_url', 'no_image', 'already_pending']);
  const ACTIONABLE_STATUSES = new Set(['verified']);

  const blockingImages = [];
  const blockingProducts = [];

  for (const p of report.products) {
    if (SAFE_SKIP_STATUSES.has(p.status)) continue;

    // Any status other than 'verified' and the safe skips blocks the cleanup.
    if (!ACTIONABLE_STATUSES.has(p.status)) {
      blockingProducts.push({ productId: p.productId, status: p.status, error: p.error || '' });
      continue;
    }

    // For verified products, every image entry must have verified === true.
    for (const img of p.images || []) {
      if (img.verified !== true) {
        blockingImages.push({
          productId: p.productId,
          index: img.index,
          verified: img.verified,
          newUrl: img.newUrl,
          error: img.verifyError || img.error || '',
        });
      }
    }
  }

  if (blockingProducts.length > 0) {
    log('error', `BLOCKED: ${blockingProducts.length} product(s) have non-verified status:`);
    blockingProducts.forEach(p => log('error', `  ${p.productId} — ${p.status} ${p.error}`));
    log('error', 'Resolve failures in migrate-images.js first, then re-run cleanup.');
    process.exit(1);
  }

  if (blockingImages.length > 0) {
    log('error', `BLOCKED: ${blockingImages.length} image(s) do not have verified === true:`);
    blockingImages.forEach(i => log('error', `  ${i.productId} image[${i.index}]: verified=${i.verified} ${i.error}`));
    log('error', 'Every image must be explicitly verified before cleanup can run.');
    process.exit(1);
  }

  // Build the list of products to act on
  const toClean = report.products.filter(p => p.status === 'verified');
  log('info', `Safety gate passed. Products to clean up: ${toClean.length}`);

  if (toClean.length === 0) {
    log('info', 'Nothing to clean up. All products are either skipped or already clean.');
    return;
  }

  if (DRY_RUN) {
    log('info', 'DRY RUN: would perform the following swaps (no writes):');
    for (const p of toClean) {
      const storageUrls = (p.images || []).map(i => i.newUrl).filter(Boolean);
      log('info', `  [${p.productId}] (${p.collection}) image → ${(storageUrls[0] || '').slice(0, 80)}`);
    }
    log('info', 'DRY RUN complete. No data was modified.');
    return;
  }

  // ── Confirmation prompt ───────────────────────────────────────────────────
  if (process.stdin.isTTY) {
    console.log('');
    console.log(`About to swap Vercel Blob CDN URLs into image/images and remove Base64 for ${toClean.length} documents.`);
    console.log('The JSON backup file will still contain the original Base64 data.');
    console.log('');
    console.log('Type YES to continue:');
    const answer = await new Promise(resolve => {
      process.stdin.once('data', d => resolve(d.toString().trim()));
    });
    if (answer !== 'YES') { log('info', 'Aborted.'); process.exit(0); }
  }

  await getIdToken();

  let swapped = 0, errors = 0;

  for (const p of toClean) {
    const collection = p.collection === 'products' ? 'products' : 'product_images';
    const docPath    = `${collection}/${p.productId}`;

    // Collect the verified Vercel Blob CDN URLs from the report's image entries.
    const cdnUrls = (p.images || [])
      .filter(i => i.newUrl && isCdnUrl(i.newUrl))
      .map(i => i.newUrl);

    if (cdnUrls.length === 0) {
      log('info', `  SKIP [${p.productId}] no CDN URLs to swap in (kept_url only)`);
      // Still need to remove _pending_* fields if they exist.
    }

    const newImageUrl  = cdnUrls[0] || '';
    const newImageUrls = cdnUrls;

    try {
      await swapAndClean(docPath, newImageUrl, newImageUrls);
      log('info', `  SWAPPED [${p.productId}] image/images now point to Vercel Blob CDN; _pending_* removed; Base64 gone`);
      swapped++;
    } catch (err) {
      log('info', `  FAIL [${p.productId}]: ${err.message}`);
      errors++;
    }

    await sleep(DELAY_MS);
  }

  console.log('');
  console.log('════════════════════════════════════════');
  console.log('           CLEANUP REPORT               ');
  console.log('════════════════════════════════════════');
  console.log(`  Documents swapped : ${swapped}`);
  console.log(`  Errors            : ${errors}`);
  console.log(`  Backup retained   : ${report.backupFile}`);
  console.log('════════════════════════════════════════');

  if (errors > 0) {
    log('error', `${errors} swap(s) failed. Affected documents still have their original Base64. Retry cleanup.`);
    process.exit(1);
  } else {
    log('info', '✅ Cleanup complete.');
    log('info', '   image/images fields now contain Vercel Blob CDN URLs.');
    log('info', '   _pending_* staging fields removed.');
    log('info', `   Original Base64 data is preserved in: ${report.backupFile}`);
  }
}

main().catch(err => {
  log('error', `Fatal: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
