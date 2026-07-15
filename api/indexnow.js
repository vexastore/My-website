// IndexNow API — instant URL submission to Bing, Yandex, and partners
// GET /api/indexnow  →  fetches all products, submits every URL
// Key file at: https://vexatoys.com/a1b2c3d4e5f6789012345678901234ab.txt

const INDEXNOW_KEY    = 'a1b2c3d4e5f6789012345678901234ab';
const FIREBASE_PROJECT = 'vexa-store';
const FIREBASE_API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';

// NOTE: Root "/" is NOT included — it permanently redirects to /sex-toys.
// Always submit the final destination URL, not redirect sources.
const CATEGORY_URLS = [
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
  'https://vexatoys.com/about',
  'https://vexatoys.com/blog',
];

function toSlug(name) {
  return (name || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60);
}

function toCategorySlug(raw) {
  return (raw || '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-').trim();
}

// Fetch ALL documents from a Firestore collection, following nextPageToken pages.
// Firestore REST API caps each response at pageSize=300; without pagination
// any collection with more than 300 documents is silently truncated.
async function fetchAllFirestoreDocs(collection, pageSize = 300) {
  const docs = [];
  let pageToken;
  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/${collection}`
    );
    url.searchParams.set('key', FIREBASE_API_KEY);
    url.searchParams.set('pageSize', String(pageSize));
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`Firestore ${res.status}`);
    const data = await res.json();
    docs.push(...(data.documents || []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return docs;
}

// Generates /{categorySlug}/{slug} matching the actual Next.js App Router route.
async function fetchProductUrls() {
  try {
    const docs = await fetchAllFirestoreDocs('products', 300);
    if (docs.length === 0) throw new Error('Empty Firestore response');

    const seen = new Set();
    const urls = [];

    for (const doc of docs) {
      const fields = doc.fields || {};
      const nameEn       = fields.nameEn?.stringValue || fields.name?.stringValue || '';
      const slug         = fields.slug?.stringValue || toSlug(nameEn);
      const categorySlug = toCategorySlug(fields.categorySlug?.stringValue || '');
      // Skip products missing either part — they would 404
      if (!slug || !categorySlug) continue;
      const url = `https://vexatoys.com/${categorySlug}/${slug}`;
      if (!seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }

    return urls;
  } catch (e) {
    console.error('fetchProductUrls error:', e.message);
    // Return empty on error — better to submit no product URLs than wrong 404 URLs
    return [];
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
