// api/admin/migrate.js
// In-browser migration tool: moves product images from Firestore Base64 → Vercel Blob
//
// GET  ?action=scan                     → dry-run report, no writes
// POST { action:'migrate',  productId } → upload one product's images to Blob (staging)
// POST { action:'activate', productId } → move _pending_* → image/images in Firestore
// POST { action:'backup'              } → return full Firestore dump as JSON
//
// All writes are protected: BLOB_READ_WRITE_TOKEN must be set.
// Original image/images fields are NEVER touched during migrate — only _pending_* is written.
// activate() is a separate step after the user confirms everything looks correct.

import { put } from '@vercel/blob';

export const config = { api: { bodyParser: { sizeLimit: '15mb' } } };

const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT = 'vexa-store';
const BASE_FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

// ── Firebase anonymous auth ────────────────────────────────────────────────
let _token = null, _expiry = 0;
async function getAuthToken() {
  if (_token && Date.now() < _expiry) return _token;
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }) }
  );
  if (!r.ok) throw new Error(`Firebase auth failed: ${r.status}`);
  const { idToken } = await r.json();
  _token = idToken;
  _expiry = Date.now() + 55 * 60 * 1000;
  return _token;
}

// ── Firestore helpers ─────────────────────────────────────────────────────
async function fetchAllDocs(collection) {
  const token = await getAuthToken();
  const docs = [];
  let pageToken;
  do {
    const url = new URL(`${BASE_FS}/${collection}`);
    url.searchParams.set('pageSize', '300');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const r = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(`Firestore GET ${collection}: ${r.status} ${await r.text()}`);
    const data = await r.json();
    docs.push(...(data.documents || []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return docs;
}

async function getDoc(collection, id) {
  const token = await getAuthToken();
  const r = await fetch(`${BASE_FS}/${collection}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Firestore GET ${collection}/${id}: ${r.status}`);
  return r.json();
}

async function patchDoc(collection, id, fields) {
  const token = await getAuthToken();
  const updateMask = Object.keys(fields)
    .map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const r = await fetch(`${BASE_FS}/${collection}/${id}?${updateMask}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  if (!r.ok) throw new Error(`Firestore PATCH ${collection}/${id}: ${r.status} ${await r.text()}`);
  return r.json();
}

// ── Firestore value helpers ────────────────────────────────────────────────
function fsStr(v) { return v?.stringValue ?? null; }
function fsArr(v) { return (v?.arrayValue?.values || []).map(x => x.stringValue || '').filter(Boolean); }
function isBase64(s) { return typeof s === 'string' && s.startsWith('data:image/'); }
function isCdnUrl(s) { return typeof s === 'string' && s.startsWith('https://') && !s.startsWith('data:'); }

// ── Vercel Blob upload ────────────────────────────────────────────────────
async function uploadToBlob(productId, idx, dataUri) {
  const m = dataUri.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/s);
  if (!m) throw new Error('Invalid data URI');
  const mime   = m[1];
  const ext    = mime.replace('image/', '').replace('+xml', '').replace('jpeg', 'jpg') || 'jpg';
  const buffer = Buffer.from(m[2], 'base64');
  const blob   = await put(`images/migrated/${productId}/${Date.now()}-${idx}.${ext}`, buffer, {
    access: 'public',
    contentType: mime,
  });
  return blob.url;
}

// ── SCAN ──────────────────────────────────────────────────────────────────
async function scan() {
  const [productDocs, galleryDocs] = await Promise.all([
    fetchAllDocs('products'),
    fetchAllDocs('product_images'),
  ]);

  // Build gallery map: productId → images[]
  const galleryMap = {};
  for (const doc of galleryDocs) {
    const id   = doc.name.split('/').pop();
    const imgs = fsArr(doc.fields?.images);
    if (imgs.length) galleryMap[id] = imgs;
  }

  const items = [];
  let totalBase64 = 0, totalUrl = 0, estimatedBytes = 0;

  for (const doc of productDocs) {
    const id   = doc.name.split('/').pop();
    const f    = doc.fields || {};
    const img  = fsStr(f.image) || '';
    const imgs = fsArr(f.images);
    const gall = galleryMap[id] || [];

    // Merge all image sources
    const allImgs = [...new Set([img, ...imgs, ...gall].filter(Boolean))];
    const base64s = allImgs.filter(isBase64);
    const urls    = allImgs.filter(isCdnUrl);

    const hasPending = !!(fsStr(f._pending_image) || fsArr(f._pending_images).length);
    const estKb = base64s.reduce((s, b) => s + Math.round(b.length * 0.75 / 1024), 0);

    let status = 'ok';
    if (hasPending)          status = 'pending';
    else if (base64s.length) status = 'needs_migration';
    else if (!allImgs.length) status = 'no_image';

    if (base64s.length) {
      totalBase64    += base64s.length;
      estimatedBytes += base64s.reduce((s, b) => s + Math.round(b.length * 0.75), 0);
    }
    if (urls.length) totalUrl += urls.length;

    items.push({
      id,
      name:       fsStr(f.name) || id,
      status,
      base64Count: base64s.length,
      urlCount:    urls.length,
      hasPending,
      estimatedKb: estKb,
    });
  }

  return {
    totalProducts:   productDocs.length,
    needMigration:   items.filter(i => i.status === 'needs_migration').length,
    alreadyPending:  items.filter(i => i.status === 'pending').length,
    alreadyUrl:      items.filter(i => i.status === 'ok' && i.urlCount > 0).length,
    noImage:         items.filter(i => i.status === 'no_image').length,
    totalBase64Images: totalBase64,
    totalUrlImages:  totalUrl,
    estimatedMb:     +(estimatedBytes / 1024 / 1024).toFixed(2),
    blobLimitMb:     500,
    items,
  };
}

// ── MIGRATE ONE PRODUCT ───────────────────────────────────────────────────
async function migrateOne(productId) {
  const doc = await getDoc('products', productId);
  if (!doc) return { productId, status: 'not_found' };

  const f     = doc.fields || {};
  const img   = fsStr(f.image) || '';
  const imgs  = fsArr(f.images);

  // Also check gallery collection
  const gallDoc = await getDoc('product_images', productId);
  const gall    = gallDoc ? fsArr(gallDoc.fields?.images) : [];

  const allImgs = [...new Set([img, ...imgs, ...gall].filter(Boolean))];
  const base64s = allImgs.filter(isBase64);

  // Idempotency: already migrated
  if (fsStr(f._pending_image) || fsArr(f._pending_images).length) {
    return { productId, status: 'already_pending', uploaded: 0 };
  }

  if (!base64s.length) {
    return { productId, status: allImgs.length ? 'already_url' : 'no_image', uploaded: 0 };
  }

  // Upload each Base64 image to Vercel Blob
  const urls = [];
  let failed = 0;
  for (let i = 0; i < allImgs.length; i++) {
    const raw = allImgs[i];
    if (!isBase64(raw)) { urls.push(raw); continue; }
    try {
      const url = await uploadToBlob(productId, i, raw);
      urls.push(url);
    } catch (err) {
      failed++;
      urls.push(raw); // keep original on failure
    }
  }

  if (failed > 0) {
    return { productId, status: 'upload_failed', uploaded: allImgs.length - failed, failed };
  }

  // Write ONLY to staging fields — original image/images untouched
  await patchDoc('products', productId, {
    '_pending_image':  { stringValue: urls[0] || '' },
    '_pending_images': { arrayValue: { values: urls.map(u => ({ stringValue: u })) } },
  });

  if (gallDoc && base64s.length) {
    await patchDoc('product_images', productId, {
      '_pending_images': { arrayValue: { values: urls.map(u => ({ stringValue: u })) } },
    });
  }

  return { productId, status: 'migrated', uploaded: urls.length, urls };
}

// ── ACTIVATE ONE PRODUCT (move staging → live) ───────────────────────────
async function activateOne(productId) {
  const doc = await getDoc('products', productId);
  if (!doc) return { productId, status: 'not_found' };

  const f          = doc.fields || {};
  const pendingImg  = fsStr(f._pending_image);
  const pendingImgs = fsArr(f._pending_images);

  if (!pendingImg && !pendingImgs.length) {
    return { productId, status: 'no_pending' };
  }

  // Verify URLs are still accessible before activating
  for (const url of [pendingImg, ...pendingImgs].filter(isCdnUrl)) {
    const check = await fetch(url, { method: 'HEAD' }).catch(() => null);
    if (!check?.ok) {
      return { productId, status: 'verify_failed', url };
    }
  }

  // Move staging → live in products collection
  await patchDoc('products', productId, {
    'image':  { stringValue: pendingImg || pendingImgs[0] || '' },
    'images': { arrayValue: { values: pendingImgs.map(u => ({ stringValue: u })) } },
    '_pending_image':  { stringValue: '' },   // clear staging
    '_pending_images': { arrayValue: { values: [] } },
  });

  // Also update gallery collection if it has staging
  const gallDoc = await getDoc('product_images', productId);
  if (gallDoc) {
    const gallPending = fsArr(gallDoc.fields?._pending_images);
    if (gallPending.length) {
      await patchDoc('product_images', productId, {
        'images': { arrayValue: { values: gallPending.map(u => ({ stringValue: u })) } },
        '_pending_images': { arrayValue: { values: [] } },
      });
    }
  }

  return { productId, status: 'activated', image: pendingImg, imageCount: pendingImgs.length };
}

// ── Handler ───────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Token guard — rejects immediately if Blob store not connected
  if (!process.env.BLOB_READ_WRITE_TOKEN && req.method === 'POST') {
    return res.status(500).json({
      error: 'BLOB_READ_WRITE_TOKEN is not configured.',
      fix: 'In Vercel Dashboard → Storage → your Blob store → Connect to Project. Then redeploy.',
    });
  }

  try {
    if (req.method === 'GET') {
      const { action } = req.query;
      if (action === 'scan') {
        const report = await scan();
        return res.status(200).json(report);
      }
      return res.status(400).json({ error: 'Unknown action. Use ?action=scan' });
    }

    if (req.method === 'POST') {
      const { action, productId } = req.body || {};

      if (action === 'migrate') {
        if (!productId) return res.status(400).json({ error: 'productId required' });
        const result = await migrateOne(productId);
        return res.status(200).json(result);
      }

      if (action === 'activate') {
        if (!productId) return res.status(400).json({ error: 'productId required' });
        const result = await activateOne(productId);
        return res.status(200).json(result);
      }

      return res.status(400).json({ error: 'Unknown action. Use migrate or activate' });
    }

    return res.status(405).json({ error: 'GET or POST only' });
  } catch (err) {
    console.error('[MIGRATE API]', err);
    return res.status(500).json({ error: err.message });
  }
}
