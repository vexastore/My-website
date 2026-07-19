// api/cron/migrate-all.js
// تشتغل تلقائياً كل يوم الساعة 7:05 UTC (10:05 صباح بيروت)
// بعد تجديد كوتا Firestore بـ5 دقائق
// ترحّل صور Base64 → Vercel Blob وترسل تقرير على Telegram

import { put } from '@vercel/blob';

export const config = {
  maxDuration: 300,
};

const API_KEY  = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT  = 'vexa-store';
const BASE_FS  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

// ── Auth (refreshToken — لا ينشئ مستخدم جديد) ───────────────────────────
const _auth = globalThis.__vexa_cron_auth
  ?? (globalThis.__vexa_cron_auth = { token: null, expiry: 0, refresh: null });

async function getAuthToken() {
  if (_auth.token && Date.now() < _auth.expiry) return _auth.token;
  if (_auth.refresh) {
    try {
      const r = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: _auth.refresh }) }
      );
      if (r.ok) {
        const d = await r.json();
        _auth.token = d.id_token; _auth.refresh = d.refresh_token;
        _auth.expiry = Date.now() + (parseInt(d.expires_in, 10) - 60) * 1000;
        return _auth.token;
      }
    } catch (_) {}
  }
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }) }
  );
  if (!r.ok) throw new Error(`Auth failed: ${r.status}`);
  const d = await r.json();
  _auth.token = d.idToken; _auth.refresh = d.refreshToken;
  _auth.expiry = Date.now() + (parseInt(d.expiresIn, 10) - 60) * 1000;
  return _auth.token;
}

// ── Firestore helpers ────────────────────────────────────────────────────
async function fsFetch(url, opts = {}, retries = 5) {
  for (let i = 0; i <= retries; i++) {
    const r = await fetch(url, opts);
    if (r.status !== 429) return r;
    await new Promise(res => setTimeout(res, Math.pow(2, i) * 1500));
  }
  return fetch(url, opts);
}

async function fetchAllDocs(col) {
  const token = await getAuthToken();
  const docs = []; let pageToken;
  do {
    const url = new URL(`${BASE_FS}/${col}`);
    url.searchParams.set('pageSize', '50');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const r = await fsFetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(`LIST ${col}: ${r.status} ${await r.text()}`);
    const data = await r.json();
    docs.push(...(data.documents || []));
    pageToken = data.nextPageToken;
    if (pageToken) await new Promise(res => setTimeout(res, 300));
  } while (pageToken);
  return docs;
}

async function patchDoc(col, id, fields) {
  const token = await getAuthToken();
  const mask = Object.keys(fields).map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const r = await fsFetch(`${BASE_FS}/${col}/${id}?${mask}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  if (!r.ok) throw new Error(`PATCH ${col}/${id}: ${r.status} ${await r.text()}`);
}

// ── Helpers ──────────────────────────────────────────────────────────────
function fsStr(v) { return v?.stringValue ?? null; }
function fsArr(v) { return (v?.arrayValue?.values || []).map(x => x.stringValue || '').filter(Boolean); }
function isBase64(s) { return typeof s === 'string' && s.startsWith('data:image/'); }
function isCdnUrl(s) { return typeof s === 'string' && s.startsWith('https://') && !s.startsWith('data:'); }
function docId(doc) { return doc.name.split('/').pop(); }

async function uploadToBlob(productId, idx, dataUri) {
  const m = dataUri.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/s);
  if (!m) throw new Error('Bad data URI');
  const mime = m[1];
  const ext  = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp'
             : mime.includes('gif') ? 'gif' : 'jpg';
  const buf  = Buffer.from(m[2], 'base64');
  const blob = await put(`products/${productId}/img-${idx}.${ext}`, buf, {
    access: 'public', contentType: mime,
  });
  return blob.url;
}

// ── Telegram ─────────────────────────────────────────────────────────────
async function sendTelegram(text) {
  const bot  = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!bot || !chat) {
    console.warn('[CRON] Telegram env vars missing — BOT:', !!bot, 'CHAT:', !!chat);
    return;
  }
  try {
    const r = await fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML' }),
    });
    const d = await r.json();
    if (!r.ok) console.error('[CRON] Telegram error:', r.status, JSON.stringify(d));
    else console.log('[CRON] Telegram sent ok, message_id:', d?.result?.message_id);
  } catch (err) {
    console.error('[CRON] Telegram fetch failed:', err.message);
  }
}

// ── Migration ─────────────────────────────────────────────────────────────
async function runMigration() {
  const log = [];
  const addLog = (msg) => { log.push(msg); console.log('[CRON]', msg); };

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN not set');
  }

  addLog('جلب المنتجات من Firestore...');
  const [prodDocs, gallDocs] = await Promise.all([
    fetchAllDocs('products'),
    fetchAllDocs('product_images').catch(() => []),
  ]);
  addLog(`✓ ${prodDocs.length} منتج، ${gallDocs.length} صورة gallery`);

  let migrated = 0, activated = 0, skipped = 0, failed = 0;

  for (const doc of prodDocs) {
    const id = docId(doc);
    const f  = doc.fields || {};

    // Skip if already pending or already CDN URL
    const hasPending = fsStr(f._pending_image) || fsArr(f._pending_images).length;
    const img   = fsStr(f.image) || '';
    const imgs  = fsArr(f.images);
    const gallDoc = gallDocs.find(d => docId(d) === id);
    const gall    = gallDoc ? fsArr(gallDoc.fields?.images) : [];
    const allImgs = [...new Set([img, ...imgs, ...gall].filter(Boolean))];
    const base64s = allImgs.filter(isBase64);
    const hasUrl  = allImgs.some(isCdnUrl);

    if (!hasPending && base64s.length === 0) {
      skipped++;
      continue;
    }

    // Migrate: upload Base64 → Blob
    if (!hasPending && base64s.length > 0) {
      try {
        const urls = [];
        for (let i = 0; i < allImgs.length; i++) {
          const raw = allImgs[i];
          if (!isBase64(raw)) { urls.push(raw); continue; }
          urls.push(await uploadToBlob(id, i, raw));
        }
        await patchDoc('products', id, {
          '_pending_image':  { stringValue: urls[0] || '' },
          '_pending_images': { arrayValue: { values: urls.map(u => ({ stringValue: u })) } },
        });
        if (gallDoc && base64s.length) {
          await patchDoc('product_images', id, {
            '_pending_images': { arrayValue: { values: urls.map(u => ({ stringValue: u })) } },
          });
        }
        migrated++;
        addLog(`↑ رُحِّل: ${id} (${urls.length} صورة)`);
        await new Promise(res => setTimeout(res, 200));
      } catch (err) {
        failed++;
        addLog(`✗ فشل: ${id} — ${err.message}`);
      }
    }
  }

  // Re-fetch to activate (get fresh pending values)
  if (migrated > 0) {
    addLog('جلب المنتجات مجدداً للتفعيل...');
    await new Promise(res => setTimeout(res, 1000));
    const [freshProd, freshGall] = await Promise.all([
      fetchAllDocs('products'),
      fetchAllDocs('product_images').catch(() => []),
    ]);

    for (const doc of freshProd) {
      const id = docId(doc);
      const f  = doc.fields || {};
      const pendingImg  = fsStr(f._pending_image);
      const pendingImgs = fsArr(f._pending_images);
      if (!pendingImg && !pendingImgs.length) continue;

      try {
        await patchDoc('products', id, {
          'image':  { stringValue: pendingImg || pendingImgs[0] || '' },
          'images': { arrayValue: { values: pendingImgs.map(u => ({ stringValue: u })) } },
          '_pending_image':  { stringValue: '' },
          '_pending_images': { arrayValue: { values: [] } },
        });
        const gallDoc = freshGall.find(d => docId(d) === id);
        if (gallDoc) {
          const gp = fsArr(gallDoc.fields?._pending_images);
          if (gp.length) {
            await patchDoc('product_images', id, {
              'images': { arrayValue: { values: gp.map(u => ({ stringValue: u })) } },
              '_pending_images': { arrayValue: { values: [] } },
            });
          }
        }
        activated++;
        await new Promise(res => setTimeout(res, 150));
      } catch (err) {
        addLog(`✗ فشل التفعيل: ${id} — ${err.message}`);
      }
    }
  }

  return { migrated, activated, skipped, failed, log };
}

// ── Handler ───────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Vercel يضيف هذا الـ header تلقائياً للـ cron jobs
  const isCron = req.headers['x-vercel-cron'] === '1';
  const isLocal = req.headers['x-cron-secret'] === (process.env.CRON_SECRET || 'vexa-cron-2026');

  if (!isCron && !isLocal) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('[CRON] بدء الترحيل التلقائي', new Date().toISOString());

  // رسالة فورية — تؤكد أن الكرون اشتغل حتى لو الترحيل فشل لاحقاً
  await sendTelegram(`⏳ <b>Vexa Cron — بدأ الترحيل</b>\n\n<i>${new Date().toLocaleString('ar-LB', { timeZone: 'Asia/Beirut' })}</i>`);

  try {
    const result = await runMigration();

    const msg = `🤖 <b>Vexa Store — ترحيل تلقائي</b>\n\n`
      + `✅ رُحِّل: <b>${result.migrated}</b> منتج\n`
      + `⚡ فُعِّل: <b>${result.activated}</b> منتج\n`
      + `⏭ تخطّى: <b>${result.skipped}</b> (لا تحتاج ترحيل)\n`
      + (result.failed ? `❌ فشل: <b>${result.failed}</b> منتج\n` : '')
      + `\n<i>${new Date().toLocaleString('ar-LB', { timeZone: 'Asia/Beirut' })}</i>`;

    await sendTelegram(msg);
    console.log('[CRON] اكتمل الترحيل:', result);

    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    const errorMsg = `❌ <b>Vexa Cron — خطأ في الترحيل</b>\n\n${err.message}`;
    await sendTelegram(errorMsg);
    console.error('[CRON] خطأ:', err);
    return res.status(500).json({ error: err.message });
  }
}
