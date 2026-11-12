import { NextResponse } from 'next/server.js';
import type { NextRequest } from 'next/server.js';
import { isLocalizedPath, localizePath, splitLocalePath } from './lib/localePath.ts';
import { STORE_LOCALE_COOKIE } from './lib/storeLocaleShared.ts';

const CANONICAL_HOST = 'vexatoys.com';
const DUPLICATE_PARAMS = new Set(['category', 'q', 'search', 'filter', 'sort', 'page']);
const KNOWN_CATEGORY_SLUGS = new Set([
  'sex-toys', 'vibrators', 'male-toys', 'dildos', 'lingerie', 'bdsm',
  'anal-toys', 'butt-plugs', 'bondage', 'strap-ons', 'kegel-balls',
  'lubricants', 'masturbators', 'cock-rings', 'penis-pumps', 'chastity',
  'sex-machines', 'sexual-enhancers', 'new-arrivals', 'holiday-collection',
  'poppers', 'sex-dolls',
]);

function getCategoryPath(pathname: string, value: string | null) {
  const category = (value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

  return pathname === '/'
    ? (KNOWN_CATEGORY_SLUGS.has(category) ? `/${category}` : '/sex-toys')
    : pathname;
}

function buildCleanUrl(req: NextRequest, pathname: string) {
  const target = new URL(pathname, `https://${CANONICAL_HOST}`);

  // Keep useful campaign/search parameters, but never keep the legacy
  // category selector that created duplicate URLs in Search Console.
  for (const [key, value] of req.nextUrl.searchParams) {
    if (!DUPLICATE_PARAMS.has(key.toLowerCase())) target.searchParams.append(key, value);
  }

  return target;
}

/**
 * Language routing on the canonical host (and on localhost).
 *
 * Arabic pages live under `/ar/...`; the page itself never reads a cookie, so
 * both language versions are plain cacheable URLs. Two rules:
 *
 * 1. `/ar/<english-only route>` (policies, admin, legacy product redirects)
 *    -> 301 to the English URL, since no Arabic twin exists.
 * 2. A visitor who chose Arabic earlier (language cookie) and opens an English
 *    URL in the browser -> 302 to the Arabic URL. Crawlers send no cookie and
 *    always receive exactly the URL they asked for; client-side RSC and
 *    prefetch requests are left alone so the router never follows a redirect
 *    it did not ask for.
 */
function localeRouting(req: NextRequest): NextResponse | null {
  const { locale, path } = splitLocalePath(req.nextUrl.pathname);

  if (locale === 'ar') {
    if (isLocalizedPath(path)) return null;
    return NextResponse.redirect(new URL(`${path}${req.nextUrl.search}`, req.url), 301);
  }

  const prefersArabic = req.cookies.get(STORE_LOCALE_COOKIE)?.value === 'ar';
  const isDocumentRequest =
    req.method === 'GET' &&
    !req.headers.get('rsc') &&
    !req.headers.get('next-router-prefetch') &&
    (req.headers.get('sec-fetch-dest') === 'document' || (req.headers.get('accept') || '').includes('text/html'));

  if (prefersArabic && isDocumentRequest && isLocalizedPath(path)) {
    return NextResponse.redirect(new URL(`${localizePath(path, 'ar')}${req.nextUrl.search}`, req.url), 302);
  }
  return null;
}

/**
 * Domain canonicalization + query-param cleanup middleware.
 *
 * Handles two jobs (plus the language routing above):
 *
 * 1. Non-canonical host (*.vercel.app, www.vexatoys.com, etc.)
 *    → 301 to the canonical domain in ONE hop.
 *    Root path "/" is sent directly to /sex-toys for old host aliases.
 *
 * 2. Legacy category query parameters on the canonical host
 *    → 301 to a clean category URL with the query string removed.
 *
 * NOTE: We read req.nextUrl.pathname BEFORE any URL mutation and create a
 * fresh URL for query cleanup. This prevents Next.js/Vercel from retaining
 * the old query string and producing a second redirect.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0]; // strip port if present

  // Both dev and local production-mode tests must stay on loopback.
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return localeRouting(req) ?? NextResponse.next();
  }

  // ── Canonical host ───────────────────────────────────────────────────────
  if (hostname === CANONICAL_HOST) {
    // Legacy category parameters are not indexable pages. Remove them from
    // every path so Google cannot keep a duplicate URL such as
    // /sex-toys?category=Sex%20Toys.
    if ([...req.nextUrl.searchParams.keys()].some(key => DUPLICATE_PARAMS.has(key.toLowerCase()))) {
      return NextResponse.redirect(
        buildCleanUrl(
          req,
          getCategoryPath(req.nextUrl.pathname, req.nextUrl.searchParams.get('category')),
        ),
        301,
      );
    }
    return localeRouting(req) ?? NextResponse.next();
  }

  // ── Non-canonical host (www, *.vercel.app, etc.) ─────────────────────────
  // Preserve the requested path so the canonical host is reached in one hop.
  // In particular, the homepage must remain "/" rather than becoming
  // "/sex-toys"; the homepage is a real indexable landing page in the sitemap.
  const hasCategory = req.nextUrl.searchParams.has('category');
  const targetPath = hasCategory
    ? getCategoryPath(req.nextUrl.pathname, req.nextUrl.searchParams.get('category'))
    : req.nextUrl.pathname;
  const url = buildCleanUrl(req, targetPath);

  // Numeric status form prevents Vercel Edge Runtime from coercing to 307.
  // NOTE: Do NOT set X-Robots-Tag: noindex here — it is meaningless on a
  // redirect response and can confuse some crawlers.
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    // Keep robots.txt and sitemap.xml in the matcher so alternate hosts
    // and legacy query-string variants are canonicalized too. Requests to
    // the clean canonical paths still continue to their Next.js route.
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|favicon\\.svg|apple-touch-icon\\.png|opengraph\\.jpg|api/).*)',
  ],
};
