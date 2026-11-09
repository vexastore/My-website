import test from 'node:test';
import assert from 'node:assert/strict';
import { CACHE_VERSION, CACHE_KEYS, CACHE_TAGS, getCacheKey } from '../lib/cacheVersion.ts';

test('CACHE_VERSION is defined and has valid version prefix', () => {
  assert.ok(typeof CACHE_VERSION === 'string');
  assert.ok(CACHE_VERSION.length > 0);
  assert.match(CACHE_VERSION, /^v[0-9]+(\.[0-9]+)*$/);
});

test('CACHE_KEYS exports all required entity cache keys containing CACHE_VERSION', () => {
  assert.ok(CACHE_KEYS.PRODUCTS.includes(CACHE_VERSION));
  assert.ok(CACHE_KEYS.ARTICLES.includes(CACHE_VERSION));
  assert.ok(CACHE_KEYS.CATEGORIES.includes(CACHE_VERSION));
  assert.ok(CACHE_KEYS.CATEGORY_EDITORIAL.includes(CACHE_VERSION));
  assert.ok(CACHE_KEYS.AR_TRANSLATIONS.includes(CACHE_VERSION));
});

test('CACHE_TAGS defines expected revalidation tags', () => {
  assert.equal(CACHE_TAGS.PRODUCTS, 'vexa-products');
  assert.equal(CACHE_TAGS.ARTICLES, 'vexa-articles');
  assert.equal(CACHE_TAGS.CATEGORIES, 'vexa-categories');
  assert.equal(CACHE_TAGS.CATEGORY_EDITORIAL, 'vexa-category-editorial');
});

test('getCacheKey generates custom keys with version stamp', () => {
  const customKey = getCacheKey('custom-prefix');
  assert.equal(customKey, `custom-prefix-${CACHE_VERSION}`);
});

test('nextConfig defines anti-caching headers for HTML and immutable headers for static chunks', async () => {
  // The immutable static-chunk rule is production-only (dev chunks are not content-hashed).
  process.env.NODE_ENV = 'production';
  const nextConfigModule = await import('../next.config.mjs');
  const nextConfig = nextConfigModule.default;
  assert.equal(typeof nextConfig.headers, 'function');
  const headersList = await nextConfig.headers();
  assert.ok(Array.isArray(headersList));
  assert.ok(headersList.length >= 2);

  // Rule 1: No-cache only for personal/admin/API responses. Public storefront
  // pages must NOT be forced to no-store so they can become CDN-cacheable.
  for (const source of ['/checkout/:path*', '/orders/:path*', '/admin/:path*', '/api/:path*']) {
    const rule = headersList.find(h => h.source === source);
    assert.ok(rule, `missing no-store rule for ${source}`);
    const cacheControlHeader = rule.headers.find(h => h.key === 'Cache-Control');
    assert.ok(cacheControlHeader);
    assert.ok(cacheControlHeader.value.includes('no-store'));
    assert.ok(cacheControlHeader.value.includes('no-cache'));
    assert.ok(cacheControlHeader.value.includes('max-age=0'));
  }
  const publicNoStore = headersList.filter(h =>
    h.headers.some(header => header.key === 'Cache-Control' && header.value.includes('no-store')),
  ).filter(h => /^\/\(/.test(h.source) || h.source === '/:path*' || h.source === '/(.*)');
  assert.equal(publicNoStore.length, 0, 'no catch-all no-store rule may cover public pages');

  // Rule 2: Immutable for static chunks
  const staticRule = headersList.find(h => h.source === '/_next/static/:path*');
  assert.ok(staticRule);
  const staticCacheHeader = staticRule.headers.find(h => h.key === 'Cache-Control');
  assert.ok(staticCacheHeader);
  assert.ok(staticCacheHeader.value.includes('immutable'));
});

