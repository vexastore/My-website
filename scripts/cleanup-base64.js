#!/usr/bin/env node
// =============================================================================
// cleanup-base64.js
//
// STEP 2 — Remove old Base64 backup fields from Firestore AFTER verifying
// that the migration was fully successful.
//
// Run this ONLY after:
//   1. migrate-images.js completed with zero failures
//   2. You have reviewed migration-report-{timestamp}.json
//   3. You have spot-checked a few image URLs in a browser
//
// USAGE
//   node scripts/cleanup-base64.js migration-report-{timestamp}.json
//   node scripts/cleanup-base64.js migration-report-{timestamp}.json --dry-run
//
// WHAT THIS DOES
//   Removes the _b64_backup_image and _b64_backup_images marker fields from
//   every successfully migrated Firestore document.
//
//   It does NOT remove the original 'image' or 'images' fields — those now
//   contain the Firebase Storage URLs written by migrate-images.js.
//
// WHAT THIS DOES NOT DO
//   It does not touch any document that did not have status === 'migrated'
//   in the report. Failures are left untouched.
// =============================================================================

'use strict';

const fs = require('fs');

const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT = 'vexa-store';
const BASE_FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const DELAY_MS = 200;
const DRY_RUN = process.argv.includes('--dry-run');

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
  _token = idToken; _expiry = Date.now() + 55 * 60 * 1000;
  return _token;
}

// Remove specific fields from a Firestore document using the transforms API.
// Firestore REST PATCH with updateMask sets fields; to DELETE a field we set
// it to { nullValue: null } then it stays as null — so instead we use the
// runQuery / batchWrite approach with FieldTransform.
// Simplest correct approach: PATCH the document setting those fields to null,
// then use a second PATCH with updateMask to remove them entirely via
// sending them absent in the document body (field mask includes them but
// document body does not — Firestore deletes absent masked fields).
async function removeFields(docPath, fieldNames) {
  const idToken = await getIdToken();
  const updateMask = fieldNames.map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  // Sending the fields absent from the body while listing them in updateMask
  // causes Firestore to delete those fields from the document.
  const r = await fetch(`${BASE_FS}/${docPath}?${updateMask}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: {} }), // empty fields → masked fields are deleted
  });
  if (!r.ok) throw new Error(`Firestore PATCH ${docPath} failed: ${r.status} ${await r.text()}`);
}

async function main() {
  log('info', `=== Vexa Store Base64 Cleanup${DRY_RUN ? ' [DRY RUN]' : ''} ===`);
  log('info', `Report: ${reportArg}`);

  const report = JSON.parse(fs.readFileSync(reportArg, 'utf8'));

  // Safety gate: refuse to run if the report shows any failures or unverified images.
  const unverified = report.products
    .flatMap(p => p.images || [])
    .filter(i => i.verified === false);

  const failed = report.products.filter(p =>
    p.status === 'upload_failed' ||
    p.status === 'partial_failure' ||
    p.status === 'firestore_write_failed'
  );

  if (unverified.length > 0) {
    log('error', `BLOCKED: ${unverified.length} image(s) failed verification in the report.`);
    log('error', 'Fix the failures first, then re-run cleanup.');
    process.exit(1);
  }

  if (failed.length > 0) {
    log('error', `BLOCKED: ${failed.length} product(s) have failed status in the report.`);
    log('error', 'Fix the failures first, then re-run cleanup.');
    process.exit(1);
  }

  const migrated = report.products.filter(p => p.status === 'migrated');
  log('info', `Products to clean up: ${migrated.length}`);

  if (DRY_RUN) {
    log('info', 'DRY RUN: would remove _b64_backup_image and _b64_backup_images from these documents:');
    migrated.forEach(p => log('info', `  ${p.productId} (${p.collection})`));
    log('info', 'DRY RUN complete. No writes performed.');
    return;
  }

  // Confirmation prompt (skip if piped)
  if (process.stdin.isTTY) {
    console.log(`\nAbout to remove Base64 marker fields from ${migrated.length} documents.`);
    console.log('Type YES to continue: ');
    const answer = await new Promise(resolve => {
      process.stdin.once('data', d => resolve(d.toString().trim()));
    });
    if (answer !== 'YES') { log('info', 'Aborted.'); process.exit(0); }
  }

  await getIdToken();

  let cleaned = 0, errors = 0;

  for (const entry of migrated) {
    const collection = entry.collection === 'products' ? 'products' : 'product_images';
    const docPath = `${collection}/${entry.productId}`;

    try {
      if (DRY_RUN) {
        log('info', `  DRY-RUN CLEAN [${entry.productId}]`);
      } else {
        await removeFields(docPath, ['_b64_backup_image', '_b64_backup_images']);
        log('info', `  CLEANED [${entry.productId}] backup marker fields removed`);
        cleaned++;
      }
    } catch (err) {
      log('info', `  FAIL [${entry.productId}]: ${err.message}`);
      errors++;
    }

    await sleep(DELAY_MS);
  }

  console.log('\n════════════════════════════════════════');
  console.log('           CLEANUP REPORT               ');
  console.log('════════════════════════════════════════');
  console.log(`  Documents cleaned : ${cleaned}`);
  console.log(`  Errors            : ${errors}`);
  console.log('════════════════════════════════════════');

  if (errors > 0) {
    log('error', 'Some cleanup operations failed. The documents are still intact; retry cleanup.');
    process.exit(1);
  } else {
    log('info', '✅ Cleanup complete. Base64 marker fields removed from all migrated documents.');
  }
}

main().catch(err => {
  log('error', `Fatal: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
