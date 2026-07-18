// api/admin/migrate.js
// Migrates product images from Firestore Base64 → Vercel Blob CDN
//
// GET  ?action=scan                     → dry-run report, no writes
// POST { action:'migrate',  productId } → upload images to Blob + write staging fields
// POST { action:'activate', productId } → move _pending_* → image/images in Firestore

import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: { sizeLimit: '20mb' } },
  maxDuration: 300,
};

const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT = 'vexa-store';
const BASE_FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

// ── Firebase auth — ONE anonymous user per Vercel instance ───────────────
// globalThis persists across warm invocations of the same Vercel function.
// On first cold start: signUp (creates 1 anonymous user).
// On subsequent calls: use refreshToken → no new anonymous users created.
const _auth = globalThis.__vexa_migrate_auth
  ?? (globalThis.__vexa_migrate_auth = { token: null, expiry: 0, refresh: null });

async function getAuthToken() {
  if (_auth.token && Date.now() < _auth.expiry) return _auth.token;

  // Refresh without creating a new anonymous user
  if (_auth.refresh) {
    try {
      const r = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: _auth.refresh }) }
      );
      if (r.ok) {
        const d = await r.json();
        _auth.token   = d.id_token;
        _auth.refresh = d.refresh_token;
        _auth.expiry  = Date.now() + (parseInt(d.expires_in, 10) - 60) * 1000;
        return _auth.token;
      }
    } catch (_) { /* fall through to signUp */ }
  }

  // First call: create ONE anonymous user per instance lifetime
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }) }
  );
  if (!r.ok) throw new Error(`Firebase auth failed: ${r.status}`);
  const d = await r.json();
  _auth.token   = d.idToken;
  _auth.refresh = d.refreshToken;
  _auth.expiry  = Date.now() + (parseInt(d.expiresIn, 10) - 60) * 1000;
  return _auth.token;
}

// ── Firestore helpers — with retry on 429 ───────────────────────────────
async function firestoreFetch(url, options = {}, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const r = await fetch(url, options);
    if (r.status !== 429) return r;
    // Exponential backoff: 1s, 2s, 4s, 8s
    await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 1000));
  }
  return fetch(url, options); // final attempt, return whatever we get
}

async function fetchAllDocs(collection) {
  const token = await getAuthToken();
  const docs = []; let pageToken;
  do {
    const url = new URL(`${BASE_FS}/${collection}`);
    url.searchParams.set('pageSize', '100'); // smaller pages = less 429 risk
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const r = await firestoreFetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) {
      const body = await r.text();
      throw new Error(`Firestore LIST ${collection}: ${r.status} ${body}`);
    }
    const data = await r.json();
    docs.push(...(data.documents || []));
    pageToken = data.nextPageToken;
    // Small pause between pages to stay within rate limits
    if (pageToken) await new Promise(res => setTimeout(res, 200));
  } while (pageToken);
  return docs;
}

async function patchDoc(collection, id, fields) {
  const token = await getAuthToken();
  const mask = Object.keys(fields).map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const r = await firestoreFetch(`${BASE_FS}/${collection}/${id}?${mask}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  if (!r.ok) throw new Error(`Firestore PATCH ${collection}/${id}: ${r.status} ${await r.text()}`);
  return r.json();
}

// ── Value helpers ────────────────────────────────────────────────────────
function fsStr(v) { return v?.stringValue ?? null; }
function fsArr(v) { return (v?.arrayValue?.values || []).map(x => x.stringValue || '').filter(Boolean); }
function isBase64(s) { return typeof s === 'string' && s.startsWith('data:image/'); }
function isCdnUrl(s) { return typeof s === 'string' && s.startsWith('https://') && !s.startsWith('data:'); }
function docId(doc) { return doc.name.split('/').pop(); }

// ── Vercel Blob upload ───────────────────────────────────────────────────
async function uploadToBlob(productId, idx, dataUri) {
  const m = dataUri.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/s);
  if (!m) throw new Error('Invalid data URI');
  const mime = m[1];
  const ext  = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp'
             : mime.includes('gif') ? 'gif' : 'jpg';
  const buf  = Buffer.from(m[2], 'base64');
  const blob = await put(`products/${productId}/img-${idx}.${ext}`, buf, {
    access: 'public', contentType: mime,
  });
  return blob.url;
}

// ── SCAN ─────────────────────────────────────────────────────────────────
async function scan() {
  const docs = await fetchAllDocs('products');
  const items = [];
  let needMigration = 0, alreadyPending = 0, alreadyUrl = 0, noImage = 0;
  let totalBase64 = 0, totalUrl = 0, estimatedBytes = 0;

  for (const doc of docs) {
    const id    = docId(doc);
    const f     = doc.fields || {};
    const img   = fsStr(f.image) || '';
    const imgs  = fsArr(f.images);
    const pImg  = fsStr(f._pending_image) || '';
    const pImgs = fsArr(f._pending_images);

    const allRaw = [img, ...imgs].filter(Boolean);
    const b64s   = allRaw.filter(isBase64);
    const urls   = allRaw.filter(isCdnUrl);

    totalBase64 += b64s.length;
    totalUrl    += urls.length;
    b64s.forEach(s => { estimatedBytes += Math.round(s.length * 0.75); });

    if (pImg || pImgs.length) { alreadyPending++; items.push({ id, status: 'pending', imageCount: allRaw.length }); }
    else if (b64s.length)     { needMigration++; items.push({ id, status: 'needs_migration', b64Count: b64s.length }); }
    else if (urls.length)     { alreadyUrl++; items.push({ id, status: 'already_url', imageCount: urls.length }); }
    else                      { noImage++; items.push({ id, status: 'no_image' }); }
  }

  return {
    totalProducts: docs.length, needMigration, alreadyPending,
    alreadyUrl, noImage, totalBase64Images: totalBase64,
    totalUrlImages: totalUrl,
    estimatedMb: +(estimatedBytes / 1024 / 1024).toFixed(2),
    blobLimitMb: 500, items,
  };
}

// ── MIGRATE ONE ──────────────────────────────────────────────────────────
async function migrateOne(productId, allProductDocs, allGalleryDocs) {
  const doc = allProductDocs.find(d => docId(d) === productId);
  if (!doc) return { productId, status: 'not_found' };

  const f    = doc.fields || {};
  const img  = fsStr(f.image) || '';
  const imgs = fsArr(f.images);

  const gallDoc = allGalleryDocs.find(d => docId(d) === productId);
  const gall    = gallDoc ? fsArr(gallDoc.fields?.images) : [];

  const allImgs = [...new Set([img, ...imgs, ...gall].filter(Boolean))];
  const base64s = allImgs.filter(isBase64);

  if (fsStr(f._pending_image) || fsArr(f._pending_images).length) {
    return { productId, status: 'already_pending', uploaded: 0 };
  }
  if (!base64s.length) {
    return { productId, status: allImgs.length ? 'already_url' : 'no_image', uploaded: 0 };
  }

  const urls = [];
  let failed = 0;
  for (let i = 0; i < allImgs.length; i++) {
    const raw = allImgs[i];
    if (!isBase64(raw)) { urls.push(raw); continue; }
    try {
      urls.push(await uploadToBlob(productId, i, raw));
    } catch (err) {
      failed++;
      urls.push(raw);
    }
  }

  if (failed > 0) {
    return { productId, status: 'upload_failed', uploaded: allImgs.length - failed, failed };
  }

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

// ── ACTIVATE ONE ─────────────────────────────────────────────────────────
async function activateOne(productId, allProductDocs, allGalleryDocs) {
  const doc = allProductDocs.find(d => docId(d) === productId);
  if (!doc) return { productId, status: 'not_found' };

  const f           = doc.fields || {};
  const pendingImg  = fsStr(f._pending_image);
  const pendingImgs = fsArr(f._pending_images);

  if (!pendingImg && !pendingImgs.length) {
    return { productId, status: 'no_pending' };
  }

  for (const url of [pendingImg, ...pendingImgs].filter(isCdnUrl)) {
    const check = await fetch(url, { method: 'HEAD' }).catch(() => null);
    if (!check?.ok) return { productId, status: 'verify_failed', url };
  }

  await patchDoc('products', productId, {
    'image':  { stringValue: pendingImg || pendingImgs[0] || '' },
    'images': { arrayValue: { values: pendingImgs.map(u => ({ stringValue: u })) } },
    '_pending_image':  { stringValue: '' },
    '_pending_images': { arrayValue: { values: [] } },
  });

  const gallDoc = allGalleryDocs.find(d => docId(d) === productId);
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

// ── Handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method === 'POST' && !process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({
      error: 'BLOB_READ_WRITE_TOKEN is not configured.',
      fix: 'In Vercel Dashboard → Storage → Blob store → Rotate Credentials. Then redeploy.',
    });
  }

  try {
    if (req.method === 'GET') {
      if (req.query.action === 'scan') return res.status(200).json(await scan());
      return res.status(400).json({ error: 'Use ?action=scan' });
    }

    if (req.method === 'POST') {
      const { action, productId } = req.body || {};

      // Fetch both collections ONCE — avoids repeated getDoc calls that 429 on Firebase free tier
      const [allProductDocs, allGalleryDocs] = await Promise.all([
        fetchAllDocs('products'),
        fetchAllDocs('product_images').catch(() => []),
      ]);

      if (action === 'migrate') {
        if (!productId) return res.status(400).json({ error: 'productId required' });
        return res.status(200).json(await migrateOne(productId, allProductDocs, allGalleryDocs));
      }

      if (action === 'activate') {
        if (!productId) return res.status(400).json({ error: 'productId required' });
        return res.status(200).json(await activateOne(productId, allProductDocs, allGalleryDocs));
      }

      return res.status(400).json({ error: 'Unknown action. Use migrate or activate' });
    }

    return res.status(405).json({ error: 'GET or POST only' });
  } catch (err) {
    console.error('[MIGRATE API]', err);
    return res.status(500).json({ error: err.message });
  }
}
