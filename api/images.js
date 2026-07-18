// صور المنتجات — تُجلب مرة واحدة كل 24 ساعة من Vercel CDN
// كل زيارة تحصل على الصور من الـ cache دون أي Firebase reads مباشرة

// قائمة المنتجات الأصلية الـ76 (hardcoded للسرعة)
const STATIC_IDS = new Set([
  "prod-133R8EJ6D","prod-23B60IR2Q","prod-24NRFZBHI","prod-2IQUAPUC3","prod-2WQ1BU08R",
  "prod-3NRRJJDJU","prod-4EJO4D56E","prod-4N38Z446F","prod-4ZH2D4K4D","prod-61JDNF8LD",
  "prod-62R5H3IMR","prod-7HGO5CIKL","prod-8A6OWLC96","prod-8WODDSHO9","prod-9G7YZIF8S",
  "prod-A0FZFRQ2D","prod-APFMTW0SN","prod-APJTWQMPI","prod-BCX9XD5GJ","prod-BH16ZQ3ZK",
  "prod-BH98BPG4G","prod-BLH4DN5B8","prod-CBBZ9KYHW","prod-CNN9M6ZA5","prod-D056P0QP3",
  "prod-D150KLY9Y","prod-DGS5SBC1M","prod-E4I00E5DG","prod-E9VLPCTAS","prod-EF6HC703Y",
  "prod-EL0BFSA8U","prod-EQ95C68JB","prod-FJWQKRDK6","prod-FOHZGLNB9","prod-HZ1QJF5VS",
  "prod-I2U6S3BOA","prod-I4QXGQDDG","prod-IP8KO2EJF","prod-J2ALOTTRK","prod-JAZOIE9DM",
  "prod-KM70C3LN7","prod-KN9JAXQ0J","prod-KWTYRWVZP","prod-LBWH0XSEQ","prod-LC39XD9SO",
  "prod-LWWERQI45","prod-MPVIBW2PO","prod-MTBLD2HU9","prod-NGWJSQZMA","prod-NVXBU7AFS",
  "prod-O3KFSOEF3","prod-OI0IXDZ1O","prod-OJ1U56Q7F","prod-P1DIVLKTJ","prod-PPG89CXR3",
  "prod-PWRHZHZBZ","prod-Q8FSEH79P","prod-QBBE9RWQ3","prod-R0YWVUY2L","prod-R1PTIUH7T",
  "prod-RD1M21W5J","prod-ROXX46DP4","prod-S9LY52P9R","prod-SH91F3YTX","prod-SI9RIQEF8",
  "prod-SW2PO6PDS","prod-T5F7683VZ","prod-U5ILZEOJS","prod-UCQNEBAAE","prod-V823S82N6",
  "prod-VKHE4Z562","prod-VKRX33AMU","prod-XMN0MTS93","prod-YTOC4FAF1","prod-ZCBYKCIEQ",
  "prod-ZV63I3E7J"
]);

const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT = 'vexa-store';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

// Token مشترك — يُنشئ حساباً anonymous مرة واحدة لكل instance،
// ثم يجدد الـ token بـ refreshToken دون إنشاء حسابات جديدة.
const _imgAuth = globalThis.__vexa_images_auth
  ?? (globalThis.__vexa_images_auth = { token: null, expiry: 0, refresh: null });

async function getToken() {
  if (_imgAuth.token && Date.now() < _imgAuth.expiry) return _imgAuth.token;

  // تجديد بدون إنشاء مستخدم جديد
  if (_imgAuth.refresh) {
    try {
      const r = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: _imgAuth.refresh }) }
      );
      if (r.ok) {
        const d = await r.json();
        _imgAuth.token   = d.id_token;
        _imgAuth.refresh = d.refresh_token;
        _imgAuth.expiry  = Date.now() + (parseInt(d.expires_in, 10) - 60) * 1000;
        return _imgAuth.token;
      }
    } catch (_) { /* تابع للـ signUp */ }
  }

  // أول مرة فقط: إنشاء حساب anonymous واحد
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) }
  );
  const d = await r.json();
  if (!d.idToken) return null;
  _imgAuth.token   = d.idToken;
  _imgAuth.refresh = d.refreshToken;
  _imgAuth.expiry  = Date.now() + (parseInt(d.expiresIn, 10) - 60) * 1000;
  return _imgAuth.token;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const idToken = await getToken();
    if (!idToken) return res.status(200).json({});

    const headers = { Authorization: `Bearer ${idToken}` };

    // جلب المنتجات الجديدة من الإدارة (غير موجودة في STATIC_IDS)
    let adminIds = [];
    try {
      const listRes = await fetch(
        `${BASE}/products?pageSize=200&fields=documents.name`,
        { headers }
      );
      if (listRes.ok) {
        const listData = await listRes.json();
        const docs = listData.documents || [];
        adminIds = docs
          .map(d => d.name.split('/').pop())
          .filter(id => id && !STATIC_IDS.has(id));
      }
    } catch (_) { /* لا تُوقف الـ cache إذا فشل هذا */ }

    const ALL_IDS = [...STATIC_IDS, ...adminIds];

    const results = await Promise.allSettled(
      ALL_IDS.map(async (id) => {
        const [galleryRes, productRes] = await Promise.all([
          fetch(`${BASE}/product_images/${id}`, { headers }),
          fetch(`${BASE}/products/${id}`, { headers }),
        ]);

        let galleryImgs = [];
        let productImg = '';
        let productImgs = [];

        if (galleryRes.ok) {
          const g = await galleryRes.json();
          galleryImgs = (g.fields?.images?.arrayValue?.values || [])
            .map(v => v.stringValue || v.bytesValue || '')
            .filter(Boolean);
        }

        if (productRes.ok) {
          const p = await productRes.json();
          productImg = p.fields?.image?.stringValue || '';
          productImgs = (p.fields?.images?.arrayValue?.values || [])
            .map(v => v.stringValue || v.bytesValue || '')
            .filter(Boolean);
        }

        const bestImgs = galleryImgs.length >= productImgs.length ? galleryImgs : productImgs;
        const mainImg = bestImgs[0] || productImg;

        return { id, mainImg, bestImgs };
      })
    );

    const imageMap = {};
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value.mainImg) {
        const { id, mainImg, bestImgs } = r.value;
        imageMap[id] = { image: mainImg, images: bestImgs };
      }
    }

    return res.status(200).json(imageMap);
  } catch (_) {
    return res.status(200).json({});
  }
}
