// /api/img/[id] — serves individual product image as JPEG bytes
  // Vercel CDN caches each image 24h — zero repeated Firebase reads per user
  const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
  const PROJECT = 'vexa-store';
  const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

  // Cache the anonymous auth token across warm serverless invocations instead of
  // signing up a brand-new anonymous account on every single image request.
  // Repeatedly calling accounts:signUp under real traffic exhausts Firebase's
  // free-tier quota extremely fast (each visitor loading a 60-product grid used
  // to trigger 60 fresh anonymous account creations). Reusing one token for its
  // ~1h lifetime cuts that to near zero.
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
    // Anonymous tokens are valid ~1h; refresh 5 min early to be safe.
    cachedTokenExpiry = Date.now() + 55 * 60 * 1000;
    return cachedToken;
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
  