// POST /api/upload
// Uploads a product image to Vercel Blob and returns a permanent public CDN URL.
// Body (JSON): { imageData: "data:image/jpeg;base64,...", productId: "prod-XXX" }
// Returns:     { url: "https://xxxxx.public.blob.vercel-storage.com/..." }
//
// Requires: BLOB_READ_WRITE_TOKEN environment variable (set automatically when
// you connect a Blob store in Vercel Dashboard → Storage → Blob).
//
// Benefits over Base64-in-Firestore:
//   ✓ Firestore documents stay tiny (URL string vs 200KB+ Base64)
//   ✓ Firebase free-tier quota preserved
//   ✓ Images served from Vercel's global CDN — no proxy function needed
//   ✓ Works for ALL products including newly added ones

import { put } from '@vercel/blob';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { imageData, productId = 'unknown' } = req.body || {};
  if (!imageData || typeof imageData !== 'string') {
    return res.status(400).json({ error: 'Missing imageData (expected data URI)' });
  }

  const match = imageData.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/s);
  if (!match) return res.status(400).json({ error: 'Invalid image data URI' });

  const mime   = match[1];
  const ext    = mime.replace('image/', '').replace('+xml', '').replace('jpeg', 'jpg') || 'jpg';
  const buffer = Buffer.from(match[2], 'base64');

  try {
    const pathname = `images/${productId}/${Date.now()}.${ext}`;

    const blob = await put(pathname, buffer, {
      access:      'public',
      contentType: mime,
      // token is read automatically from BLOB_READ_WRITE_TOKEN env var
    });

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('[UPLOAD] Vercel Blob error:', err);
    // Surface a clear message if the token is missing
    if (String(err.message).includes('token')) {
      return res.status(500).json({
        error: 'BLOB_READ_WRITE_TOKEN is missing or invalid.',
        fix:   'In Vercel Dashboard → Storage → Blob, create a store and connect it to this project.',
      });
    }
    return res.status(500).json({ error: String(err.message || err) });
  }
}
