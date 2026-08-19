import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'vexatoys.com';
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
    if (key !== 'category') target.searchParams.append(key, value);
  }

  return target;
}

/**
 * Domain canonicalization + query-param cleanup middleware.
 *
 * Handles two jobs:
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

  // ── Canonical host ───────────────────────────────────────────────────────
  if (hostname === CANONICAL_HOST) {
    // Legacy category parameters are not indexable pages. Remove them from
    // every path so Google cannot keep a duplicate URL such as
    // /sex-toys?category=Sex%20Toys.
    if (req.nextUrl.searchParams.has('category')) {
      return NextResponse.redirect(
        buildCleanUrl(
          req,
          getCategoryPath(req.nextUrl.pathname, req.nextUrl.searchParams.get('category')),
        ),
        301,
      );
    }
    return NextResponse.next();
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
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|favicon\\.svg|apple-touch-icon\\.png|opengraph\\.jpg|robots\\.txt|sitemap\\.xml|api/).*)',
  ],
};
