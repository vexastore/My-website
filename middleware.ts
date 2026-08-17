import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'vexatoys.com';

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
      const cat = (req.nextUrl.searchParams.get('category') || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
      const KNOWN = new Set([
        'sex-toys','vibrators','male-toys','dildos','lingerie','bdsm',
        'anal-toys','butt-plugs','bondage','strap-ons','kegel-balls',
        'lubricants','masturbators','cock-rings','penis-pumps','chastity',
        'sex-machines','sexual-enhancers','new-arrivals','holiday-collection',
        'poppers','sex-dolls',
      ]);
      const targetPath =
        req.nextUrl.pathname === '/'
          ? (KNOWN.has(cat) ? `/${cat}` : '/sex-toys')
          : req.nextUrl.pathname;
      const target = new URL(targetPath, `https://${CANONICAL_HOST}`);

      // Preserve legitimate tracking/search parameters while removing the
      // legacy category selector that created duplicate URLs.
      for (const [key, value] of req.nextUrl.searchParams) {
        if (key !== 'category') target.searchParams.append(key, value);
      }

      return NextResponse.redirect(target, 301);
    }
    return NextResponse.next();
  }

  // ── Non-canonical host (www, *.vercel.app, etc.) ─────────────────────────
  // Read pathname BEFORE URL mutation for reliable root detection.
  const originalPathname = req.nextUrl.pathname;
  const isRoot = originalPathname === '/' || originalPathname === '';

  const url = req.nextUrl.clone();
  url.protocol = 'https:';
  url.hostname = CANONICAL_HOST;
  url.port = '';

  if (isRoot) {
    // Go directly to /sex-toys and strip any query params — avoids a second
    // hop when vercel.json's /?category=X rules would otherwise fire again.
    url.pathname = '/sex-toys';
    url.search = '';
  }

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
