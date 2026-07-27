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
 *    Root path "/" is sent directly to /sex-toys to avoid a 2-hop chain
 *    (vexatoys.com/ → permanentRedirect → /sex-toys).
 *
 * 2. Canonical host with stale ?category= query param on root "/"
 *    → 301 to /sex-toys (strip query, avoid duplicate-content URLs).
 *
 * NOTE: We read req.nextUrl.pathname BEFORE any URL mutation and use the
 * numeric-status form of NextResponse.redirect(url, 301) to prevent
 * Vercel Edge Runtime from silently converting the status to 307.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0]; // strip port if present

  // ── Canonical host ───────────────────────────────────────────────────────
  if (hostname === CANONICAL_HOST) {
    // If root arrives with any query param, clean it up.
    // This prevents /?category=Sex+Toys from being a separate crawlable URL.
    if (req.nextUrl.pathname === '/' && req.nextUrl.search) {
      const clean = req.nextUrl.clone();
      clean.pathname = '/sex-toys';
      clean.search = '';
      // Use numeric status — avoids Vercel Edge Runtime 307 coercion.
      return NextResponse.redirect(clean, 301);
    }
    return NextResponse.next();
  }

  // ── Non-canonical host (www, *.vercel.app, etc.) ─────────────────────────
  // Read pathname BEFORE URL mutation for reliable root detection.
  const originalPathname = req.nextUrl.pathname;
  const isRoot = originalPathname === '/' || originalPathname === '';

  const url = req.nextUrl.clone();
  url.protocol = 'https:';
  url.host = CANONICAL_HOST;

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
