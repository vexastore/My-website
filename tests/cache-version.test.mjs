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
