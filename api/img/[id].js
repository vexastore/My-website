// /api/img/[id] — serves individual product image as JPEG bytes
  // Vercel CDN caches each image 24h — zero repeated Firebase reads per user
  const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
  const PROJECT = 'vexa-store';
  const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

  export default async function handler(req, res) {
    const { id } = req.query;

    // CDN caches 24h, stale served while revalidating
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing id' });
    }

    try {
      // Anonymous Firebase auth
      const authRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) }
      );
      const { idToken } = await authRes.json();
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

  // 1x1 transparent PNG as fallback
  function sendPlaceholder(res) {
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', png.length);
    return res.send(png);
  }
  