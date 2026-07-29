import { NextRequest, NextResponse } from 'next/server';

const BASE         = 'https://vexatoys.com';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? 'a1b2c3d4e5f6789012345678901234ab';
const KEY_LOCATION = `${BASE}/${INDEXNOW_KEY}.txt`;
const HOST         = 'vexatoys.com';

// api.indexnow.org fans the submission out to Bing, Yandex, Naver, and all IndexNow members.
// Sending to Bing directly as well ensures fastest pickup.
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

// Pages that are always affected when any product changes.
const ALWAYS_INCLUDE = [
  `${BASE}/sex-toys`,
  `${BASE}/adult-toys`,
  `${BASE}/new-arrivals`,
];

function buildUrls(categorySlug?: string, slug?: string): string[] {
  const urls: string[] = [];
  if (categorySlug && slug) {
    urls.push(`${BASE}/${categorySlug}/${slug}`); // product page
    urls.push(`${BASE}/${categorySlug}`);           // category page
  } else if (categorySlug) {
    urls.push(`${BASE}/${categorySlug}`);
  }
  urls.push(...ALWAYS_INCLUDE);
  return [...new Set(urls)]; // deduplicate
}

async function submitIndexNow(urls: string[]) {
  const payload = { host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList: urls };
  return Promise.all(
    ENDPOINTS.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload),
        });
        const body = await res.text().catch(() => '');
        const ok = res.status === 200 || res.status === 202;
        return { endpoint, ok, status: res.status, body: body.slice(0, 200) };
      } catch (err) {
        return { endpoint, ok: false, status: 0, body: String(err) };
      }
    })
  );
}

// ── POST /api/indexnow ─────────────────────────────────────
// Called automatically by ShopContext after any product add / edit / delete.
// Body: { categorySlug?: string; slug?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { categorySlug?: string; slug?: string };
    const { categorySlug, slug } = body;
    const urls    = buildUrls(categorySlug, slug);
    const results = await submitIndexNow(urls);
    const allOk   = results.every(r => r.ok);

    const summary = results
      .map(r => `${new URL(r.endpoint).hostname}: ${r.ok ? '✅' : '❌'} ${r.status}`)
      .join(' | ');
    console.log(`[IndexNow] POST ${allOk ? '✅ OK' : '⚠️ PARTIAL'} | ${summary} | urls: ${urls.join(', ')}`);

    return NextResponse.json(
      { ok: allOk, urls, results: results.map(({ endpoint, ok, status }) => ({ endpoint, ok, status })) },
      { status: allOk ? 200 : 207 }
    );
  } catch (err) {
    console.error('[IndexNow] POST error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ── GET /api/indexnow ──────────────────────────────────────
// Quick ping: notifies the main static pages. No body needed.
export async function GET() {
  const urls    = [...ALWAYS_INCLUDE];
  const results = await submitIndexNow(urls);
  const allOk   = results.every(r => r.ok);
  const summary = results
    .map(r => `${new URL(r.endpoint).hostname}: ${r.ok ? '✅' : '❌'} ${r.status}`)
    .join(' | ');
  console.log(`[IndexNow] GET ${allOk ? '✅ OK' : '⚠️ PARTIAL'} | ${summary}`);
  return NextResponse.json(
    { ok: allOk, urls, results: results.map(({ endpoint, ok, status }) => ({ endpoint, ok, status })) },
    { status: allOk ? 200 : 207 }
  );
}
