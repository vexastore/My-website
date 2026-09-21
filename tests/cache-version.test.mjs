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
  const nextConfigModule = await import('../next.config.mjs');
  const nextConfig = nextConfigModule.default;
  assert.equal(typeof nextConfig.headers, 'function');
  const headersList = await nextConfig.headers();
  assert.ok(Array.isArray(headersList));
  assert.ok(headersList.length >= 2);

  // Rule 1: No-cache for HTML/pages
  const htmlRule = headersList[0];
  assert.ok(htmlRule.source.includes('?!_next/static'));
  const cacheControlHeader = htmlRule.headers.find(h => h.key === 'Cache-Control');
  assert.ok(cacheControlHeader);
  assert.ok(cacheControlHeader.value.includes('no-store'));
  assert.ok(cacheControlHeader.value.includes('no-cache'));
  assert.ok(cacheControlHeader.value.includes('max-age=0'));

  // Rule 2: Immutable for static chunks
  const staticRule = headersList.find(h => h.source === '/_next/static/:path*');
  assert.ok(staticRule);
  const staticCacheHeader = staticRule.headers.find(h => h.key === 'Cache-Control');
  assert.ok(staticCacheHeader);
  assert.ok(staticCacheHeader.value.includes('immutable'));
});

