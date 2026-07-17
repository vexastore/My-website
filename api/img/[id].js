// /api/img/[id] — serves individual product image as JPEG bytes
  // Vercel CDN caches each image 24h — zero repeated Firebase reads per user
  const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
  const PROJECT = 'vexa-store';
  const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

  // Cache the anonymous auth token across warm serverless invocations instead of
  // signing up a brand-new anonymous account on every single image request.
  let cachedToken = null;
  let cachedTokenExpiry = 0;

  async function getIdToken() {
    if (cachedToken && Date.now() < cachedTokenExpiry) return cachedToken;
    const authRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) }
    );
    const data = await authRes.json();
    if (!data.idToken) return null;
    cachedToken = data.idToken;
    cachedTokenExpiry = Date.now() + 55 * 60 * 1000;
    return cachedToken;
  }

  // Fetch an external image URL and pipe it through the response.
  // Upgrades http:// to https:// to avoid mixed-content blocking.
  async function proxyImageUrl(url, res) {
    try {
      const safeUrl = url.replace(/^http:\/\//, 'https://');
      const imgRes = await fetch(safeUrl);
      if (!imgRes.ok) return false;
      const ct = imgRes.headers.get('content-type') || '';
      if (!ct.startsWith('image/')) return false;
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      res.setHeader('Content-Type', ct);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
      res.send(buffer);
      return true;
    } catch (_) {
      return false;
    }
  }

  export default async function handler(req, res) {
    const { id } = req.query;

    // CDN caches 24h, stale served while revalidating — this is what actually
    // protects Firebase quota: once ANY request for an id succeeds, no visitor
    // triggers a new Firebase read for 24h.
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing id' });
    }

    try {
      const idToken = await getIdToken();
      if (!idToken) return sendPlaceholder(res);

      const headers = { Authorization: `Bearer ${idToken}` };

      // Try product_images collection first, then products collection
      const [galleryRes, productRes] = await Promise.all([
        fetch(`${BASE}/product_images/${id}`, { headers }),
        fetch(`${BASE}/products/${id}`, { headers }),
      ]);

      let base64 = '';
      let imageUrl = '';

      // ── product_images collection (gallery) ──────────────────────────────
      if (galleryRes.ok) {
        const g = await galleryRes.json();
        const vals = g.fields?.images?.arrayValue?.values || [];
        const strs = vals.map(v => v.stringValue || '').filter(Boolean);
        base64    = strs.find(s => s.startsWith('data:'))  || '';
        imageUrl  = strs.find(s => s.startsWith('http'))   || '';
      }

      // ── products collection (main image field + images array) ─────────────
      if (!base64 && !imageUrl && productRes.ok) {
        const p = await productRes.json();
        const img = p.fields?.image?.stringValue || '';
        if (img.startsWith('data:'))  base64    = img;
        else if (img.startsWith('http')) imageUrl = img;

        if (!base64 && !imageUrl) {
          const vals = p.fields?.images?.arrayValue?.values || [];
          const strs = vals.map(v => v.stringValue || '').filter(Boolean);
          base64   = strs.find(s => s.startsWith('data:'))  || '';
          imageUrl = strs.find(s => s.startsWith('http'))   || '';
        }
      }

      // ── Serve base64 image ───────────────────────────────────────────────
      if (base64) {
        const match = base64.match(/^data:(image\/[a-z]+);base64,(.+)$/);
        if (!match) return sendPlaceholder(res);
        const mimeType = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', buffer.length);
        return res.send(buffer);
      }

      // ── Proxy URL image (Firebase Storage or any https:// URL) ───────────
      if (imageUrl) {
        const ok = await proxyImageUrl(imageUrl, res);
        if (ok) return;
      }

      return sendPlaceholder(res);

    } catch (_) {
      return sendPlaceholder(res);
    }
  }

  // Return 404 when no image exists so the browser fires onerror and the
  // frontend can show the gradient background correctly instead of a green PNG.
  function sendPlaceholder(res) {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(404).end();
  }
