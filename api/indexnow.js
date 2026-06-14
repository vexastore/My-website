// IndexNow API — instant URL submission to Bing, Yandex, and partners
// GET /api/indexnow  →  fetches all products, submits every URL
// Key file at: https://vexatoys.com/a1b2c3d4e5f6789012345678901234ab.txt

const INDEXNOW_KEY    = 'a1b2c3d4e5f6789012345678901234ab';
const FIREBASE_PROJECT = 'vexa-store';
const FIREBASE_API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';

const CATEGORY_URLS = [
  'https://vexatoys.com/',
  'https://vexatoys.com/about',
  'https://vexatoys.com/sex-toys',
  'https://vexatoys.com/vibrators',
  'https://vexatoys.com/lingerie',
  'https://vexatoys.com/male-toys',
  'https://vexatoys.com/dildos',
  'https://vexatoys.com/bdsm',
  'https://vexatoys.com/holiday-collection',
  'https://vexatoys.com/new-arrivals',
  'https://vexatoys.com/butt-plugs',
  'https://vexatoys.com/anal-toys',
  'https://vexatoys.com/bondage',
  'https://vexatoys.com/sex-dolls',
  'https://vexatoys.com/strap-ons',
  'https://vexatoys.com/kegel-balls',
  'https://vexatoys.com/sexual-enhancers',
  'https://vexatoys.com/penis-pumps',
  'https://vexatoys.com/cock-rings',
  'https://vexatoys.com/masturbators',
  'https://vexatoys.com/chastity',
  'https://vexatoys.com/sex-machines',
  'https://vexatoys.com/lubricants',
  'https://vexatoys.com/poppers',
];

const FALLBACK_SLUGS = [
  'luxury-couple-massage-set','dual-pulse-stimulation-device',
  'ultra-smooth-water-based-lubricant-200ml','upgraded-smart-rose-vibrator',
  'wand-massager-for-muscle-and-intimate-use','mini-wireless-bullet-vibrator',
  'smart-male-masturbator-stimulator','flexible-silicone-men-rings-set-of-3',
  'ribbed-automatic-stimulation-sleeve','realistic-silicone-dildo-with-suction-cup',
  'luxury-glass-dildo-for-temperature-play','flexible-curved-g-spot-dildo',
  'luxury-black-lace-babydoll','crimson-red-satin-bodysuit','soft-silk-kimono-robe',
  'soft-leather-restraints-starter-kit','luxury-silk-blindfold-with-tickler-feather',
  'short-leather-flogger-crop','24-days-of-romance-advent-calendar',
  'sexy-santa-cosplay-lingerie-set','luxury-massage-candle-vanilla-oud',
  'smart-interactive-audio-massager','luxury-gold-lace-lingerie-2-piece-set',
  'organic-essential-oils-set-arousal-deep-sleep',
  'premium-water-based-lubricant-100ml','silicone-based-long-lasting-lubricant-50ml',
  'rush-original-poppers-10ml','vibrating-cock-ring-with-remote-control',
  'pocket-stroker-masturbator-tight-texture','beginner-penis-pump-with-gauge',
  'tapered-silicone-butt-plug-small','anal-beads-with-loop-5-beads',
  'velvet-wrist-restraints-adjustable','kegel-ball-set-3-weights',
  'delay-spray-for-men-10ml','premium-silicone-torso-realistic-feel',
  'adjustable-strap-on-harness-with-silicone-dildo',
];

function toSlug(name) {
  return (name || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60);
}

async function fetchProductUrls() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/products?key=${FIREBASE_API_KEY}&pageSize=300`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Firestore ${res.status}`);
    const data = await res.json();
    const docs = data.documents || [];
    if (docs.length === 0) throw new Error('Empty Firestore response');
    return docs.map(doc => {
      const fields = doc.fields || {};
      const nameEn  = fields.nameEn?.stringValue || fields.name?.stringValue || '';
      const slug    = fields.slug?.stringValue || toSlug(nameEn);
      return slug ? `https://vexatoys.com/product/${slug}` : null;
    }).filter(Boolean);
  } catch {
    return FALLBACK_SLUGS.map(s => `https://vexatoys.com/product/${s}`);
  }
}

export default async function handler(req, res) {
  const productUrls = await fetchProductUrls();
  const allUrls     = [...CATEGORY_URLS, ...productUrls];

  const results = {};

  // ── 1. IndexNow (Bing + Yandex + Seznam + Naver + 10 more engines) ────────
  try {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body:    JSON.stringify({
        host:        'vexatoys.com',
        key:         INDEXNOW_KEY,
        keyLocation: `https://vexatoys.com/${INDEXNOW_KEY}.txt`,
        urlList:     allUrls,
      }),
      signal: AbortSignal.timeout(10000),
    });
    results.indexnow = r.status;
  } catch (e) {
    results.indexnow = `error: ${e.message}`;
  }

  // ── 2. Bing sitemap ping ──────────────────────────────────────────────────
  try {
    const r = await fetch(
      'https://www.bing.com/ping?sitemap=https%3A%2F%2Fvexatoys.com%2Fsitemap.xml',
      { signal: AbortSignal.timeout(5000) }
    );
    results.bing_ping = r.status;
  } catch (e) {
    results.bing_ping = `error: ${e.message}`;
  }

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json({
    ok:            true,
    submitted:     allUrls.length,
    categories:    CATEGORY_URLS.length,
    products:      productUrls.length,
    results,
    urls:          allUrls,
  });
}
