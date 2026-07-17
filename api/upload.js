// POST /api/upload
// Uploads a product image to Firebase Storage and returns a permanent HTTPS URL.
// Body (JSON): { imageData: "data:image/jpeg;base64,...", productId: "prod-XXX" }
// Returns: { url: "https://firebasestorage.googleapis.com/..." }
//
// ⚠️  Firebase Storage Rules MUST allow authenticated writes:
//   rules_version = '2';
//   service firebase.storage {
//     match /b/{bucket}/o {
//       match /images/{allPaths=**} {
//         allow read: if true;
//         allow write: if request.auth != null;
//       }
//     }
//   }
//
// Benefits over Base64-in-Firestore:
//   - Images served from Firebase Storage CDN (fast, global)
//   - Firestore documents become tiny (URL string vs 200KB Base64)
//   - Firebase quota stays within free tier
//   - Images work for ALL products including newly added ones

const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const BUCKET = 'vexa-store.firebasestorage.app';

let _cachedToken = null;
let _cachedExpiry = 0;

async function getIdToken() {
  if (_cachedToken && Date.now() < _cachedExpiry) return _cachedToken;
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) }
  );
  const data = await r.json();
  if (!data.idToken) return null;
  _cachedToken = data.idToken;
  _cachedExpiry = Date.now() + 55 * 60 * 1000;
  return data.idToken;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { imageData, productId = 'unknown' } = req.body || {};
  if (!imageData || typeof imageData !== 'string') {
    return res.status(400).json({ error: 'Missing imageData (expected data URI)' });
  }

  // Parse data URI: data:image/jpeg;base64,...
  const match = imageData.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) return res.status(400).json({ error: 'Invalid image data URI' });

  const mimeType = match[1];
  const ext = mimeType.replace('image/', '').replace('+xml', '') || 'jpg';
  const buffer = Buffer.from(match[2], 'base64');

  try {
    const idToken = await getIdToken();
    if (!idToken) return res.status(500).json({ error: 'Firebase auth failed' });

    const fileName = `images/${productId}/${Date.now()}.${ext}`;
    const encodedName = encodeURIComponent(fileName);

    const uploadRes = await fetch(
      `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?uploadType=media&name=${encodedName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': mimeType,
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('[UPLOAD] Firebase Storage error:', uploadRes.status, errText);
      // If Storage rules deny the write, return helpful error
      if (uploadRes.status === 403) {
        return res.status(403).json({
          error: 'Firebase Storage rules deny write access.',
          fix: 'Update Firebase Storage Rules to: allow write: if request.auth != null;',
        });
      }
      return res.status(500).json({ error: `Storage upload failed (${uploadRes.status})` });
    }

    const { downloadTokens } = await uploadRes.json();
    const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedName}?alt=media&token=${downloadTokens}`;

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ url });
  } catch (err) {
    console.error('[UPLOAD] Error:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
