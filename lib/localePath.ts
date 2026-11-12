import type { StoreLocale } from './storeLocaleShared';

/**
 * Arabic lives under its own URL prefix (`/ar`, `/ar/vibrators`, ...) so that
 * every page has one URL per language, Google can be told about both with
 * hreflang, and no page has to read a cookie to know which language to render.
 *
 * Pure functions only: the middleware, the sitemap, server routes and client
 * components all import this file.
 */

export const ARABIC_PREFIX = '/ar';
export const SITE_BASE_URL = 'https://vexatoys.com';

/** Routes that exist in English only: admin, APIs and legacy product redirects. */
const ENGLISH_ONLY_PATHS = ['/admin', '/api', '/product', '/products', '/sitemap.xml', '/robots.txt', '/_next'];

/** True when the path has an Arabic twin under `/ar`. Files (`/favicon.png`) never do. */
export function isLocalizedPath(path: string): boolean {
  const bare = splitLocalePath(stripQuery(path)).path;
  if (/\/[^/]*\.[^/]*$/.test(bare)) return false;
  return !ENGLISH_ONLY_PATHS.some(prefix => bare === prefix || bare.startsWith(`${prefix}/`));
}

/** `/ar/vibrators` -> `{ locale: 'ar', path: '/vibrators' }`; `/vibrators` -> `{ locale: 'en', path: '/vibrators' }`. */
export function splitLocalePath(pathname: string): { locale: StoreLocale; path: string } {
  if (pathname === ARABIC_PREFIX || pathname === `${ARABIC_PREFIX}/`) return { locale: 'ar', path: '/' };
  if (pathname.startsWith(`${ARABIC_PREFIX}/`)) return { locale: 'ar', path: pathname.slice(ARABIC_PREFIX.length) };
  return { locale: 'en', path: pathname || '/' };
}

/**
 * The URL of `path` in `locale`. Query strings and hashes are kept, an existing
 * `/ar` prefix is never doubled, and English-only routes are returned as they are.
 */
export function localizePath(path: string, locale: StoreLocale): string {
  const [, base = '/', rest = ''] = path.match(/^([^?#]*)(.*)$/) || [];
  const bare = splitLocalePath(base).path;
  if (locale !== 'ar' || !isLocalizedPath(bare)) return bare + rest;
  return (bare === '/' ? ARABIC_PREFIX : `${ARABIC_PREFIX}${bare}`) + rest;
}

/** Absolute URLs of one page in both languages, keyed the way hreflang wants them. */
export function localeAlternates(pathOrUrl: string): Record<'en' | 'ar' | 'x-default', string> {
  const bare = splitLocalePath(stripQuery(pathFromUrl(pathOrUrl))).path;
  const en = `${SITE_BASE_URL}${bare}`;
  return { en, ar: `${SITE_BASE_URL}${localizePath(bare, 'ar')}`, 'x-default': en };
}

/** `alternates` metadata for a page rendered in `locale`: its own canonical plus both language URLs. */
export function pageAlternates(pathOrUrl: string, locale: StoreLocale): {
  canonical: string;
  languages: Record<'en' | 'ar' | 'x-default', string>;
} {
  const languages = localeAlternates(pathOrUrl);
  return { canonical: languages[locale], languages };
}

function pathFromUrl(pathOrUrl: string): string {
  if (!/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  try {
    const url = new URL(pathOrUrl);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return pathOrUrl;
  }
}

function stripQuery(path: string): string {
  return path.replace(/[?#].*$/, '') || '/';
}
