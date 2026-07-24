import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'vexatoys.com';

/**
 * Domain canonicalization middleware.
 *
 * Problem: The site is accessible at BOTH vexatoys.com AND the Vercel
 * deployment URL (*.vercel.app). Google treats these as two separate sites,
 * causing duplicate-content penalties and splitting link equity.
 *
 * Fix: Any request that arrives on a non-canonical host is permanently
 * redirected to the canonical domain in ONE hop.
 *
 * KEY: When the path is "/" we redirect directly to /sex-toys — NOT to
 * vexatoys.com/ — because vexatoys.com/ itself redirects to /sex-toys,
 * which would create a 2-hop chain that Google Search Console reports as
 * a "Redirect error".
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0]; // strip port if present

  // Already on the canonical host — nothing to do.
  if (hostname === CANONICAL_HOST) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.protocol = 'https:';
  url.host = CANONICAL_HOST;

  // Root path: redirect directly to /sex-toys to avoid a 2-hop chain.
  // (vexatoys.com/ itself redirects to /sex-toys, so going via / creates
  //  non-canonical → vexatoys.com/ → vexatoys.com/sex-toys = 2 hops.)
  if (url.pathname === '/') {
    url.pathname = '/sex-toys';
    url.search = ''; // strip stale ?category= query params
  }

  return NextResponse.redirect(url, {
    status: 301,
    headers: {
      'X-Robots-Tag': 'noindex',
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|favicon\\.svg|apple-touch-icon\\.png|opengraph\\.jpg|robots\\.txt|sitemap\\.xml|api/).*)',
  ],
};
