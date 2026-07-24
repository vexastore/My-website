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
 * Fix: Any request that arrives on a non-canonical host (the Vercel subdomain,
 * www, or any other alias) is permanently redirected to the canonical domain.
 * This ensures Google only ever sees and indexes vexatoys.com.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0]; // strip port if present

  // Already on the canonical host — nothing to do.
  if (hostname === CANONICAL_HOST) {
    return NextResponse.next();
  }

  // Redirect all other hosts (*.vercel.app, www.vexatoys.com if not caught by
  // vercel.json, any preview aliases) to the canonical domain.
  const url = req.nextUrl.clone();
  url.protocol = 'https:';
  url.host = CANONICAL_HOST;

  return NextResponse.redirect(url, {
    status: 301,
    headers: {
      // Belt-and-suspenders: tell crawlers not to index this response even
      // before the redirect is followed.
      'X-Robots-Tag': 'noindex',
    },
  });
}

export const config = {
  // Run on all routes except Next.js internals, static assets, and API routes
  // (API routes should still work from any host for Vercel's health checks).
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|favicon\\.svg|apple-touch-icon\\.png|opengraph\\.jpg|robots\\.txt|sitemap\\.xml|api/).*)',
  ],
};
