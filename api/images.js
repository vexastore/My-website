// جلب صور المنتجات من Firebase — مرة واحدة كل 24 ساعة على مستوى CDN
// كل الزبائن يجيبون الصور من Vercel CDN بدون Firebase reads مباشرة

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
  const PROJECT = 'vexa-store';
  const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

  try {
    // احصل على anonymous auth token
    const authRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnSecureToken: true }),
      }
    );
    const authData = await authRes.json();
    if (!authData.idToken) return res.status(200).json({});

    const headers = { Authorization: `Bearer ${authData.idToken}` };

    // جلب المجموعتين معاً
    const [imgRes, prodRes] = await Promise.all([
      fetch(`${BASE}/product_images?pageSize=200`, { headers }),
      fetch(`${BASE}/products?pageSize=200`, { headers }),
    ]);

    const [imgData, prodData] = await Promise.all([imgRes.json(), prodRes.json()]);

    const imageMap = {};

    // products — صورة رئيسية + مصفوفة
    for (const doc of prodData.documents || []) {
      const id = doc.name.split('/').pop();
      const img = doc.fields?.image?.stringValue || '';
      const imgs = (doc.fields?.images?.arrayValue?.values || [])
        .map((v) => v.stringValue)
        .filter(Boolean);
      if (img || imgs.length) imageMap[id] = { image: img || imgs[0], images: imgs };
    }

    // product_images — يتفوق على products
    for (const doc of imgData.documents || []) {
      const id = doc.name.split('/').pop();
      const imgs = (doc.fields?.images?.arrayValue?.values || [])
        .map((v) => v.stringValue)
        .filter(Boolean);
      if (imgs.length) imageMap[id] = { image: imgs[0], images: imgs };
    }

    return res.status(200).json(imageMap);
  } catch (_) {
    return res.status(200).json({});
  }
}
