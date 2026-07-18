// /api/img/[id] — serves individual product image as JPEG bytes
  // Vercel CDN caches each image 24h — zero repeated Firebase reads per user
  const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
  const PROJECT = 'vexa-store';
  const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

  // Token مشترك — مستخدم anonymous واحد لكل instance، يُجدَّد بـ refreshToken.
  const _imgIdAuth = globalThis.__vexa_imgid_auth
    ?? (globalThis.__vexa_imgid_auth = { token: null, expiry: 0, refresh: null });

  async function getIdToken() {
    if (_imgIdAuth.token && Date.now() < _imgIdAuth.expiry) return _imgIdAuth.token;

    if (_imgIdAuth.refresh) {
      try {
        const r = await fetch(
          `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: _imgIdAuth.refresh }) }
        );
        if (r.ok) {
          const d = await r.json();
          _imgIdAuth.token   = d.id_token;
          _imgIdAuth.refresh = d.refresh_token;
          _imgIdAuth.expiry  = Date.now() + (parseInt(d.expires_in, 10) - 60) * 1000;
          return _imgIdAuth.token;
        }
      } catch (_) { /* تابع */ }
    }

    const authRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) }
    );
    const data = await authRes.json();
    if (!data.idToken) return null;
    _imgIdAuth.token   = data.idToken;
    _imgIdAuth.refresh = data.refreshToken;
    _imgIdAuth.expiry  = Date.now() + (parseInt(data.expiresIn, 10) - 60) * 1000;
    return _imgIdAuth.token;
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

      if (galleryRes.ok) {
        const g = await galleryRes.json();
        const vals = g.fields?.images?.arrayValue?.values || [];
        base64 = vals.map(v => v.stringValue || '').find(s => s.startsWith('data:')) || '';
      }

      if (!base64 && productRes.ok) {
        const p = await productRes.json();
        const img = p.fields?.image?.stringValue || '';
        if (img.startsWith('data:')) base64 = img;
        if (!base64) {
          const vals = p.fields?.images?.arrayValue?.values || [];
          base64 = vals.map(v => v.stringValue || '').find(s => s.startsWith('data:')) || '';
        }
      }

      if (!base64) return sendPlaceholder(res);

      // Strip the data URI prefix and detect mime type
      const match = base64.match(/^data:(image\/[a-z]+);base64,(.+)$/);
      if (!match) return sendPlaceholder(res);

      const mimeType = match[1];
      const buffer = Buffer.from(match[2], 'base64');

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', buffer.length);
      return res.send(buffer);

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
  