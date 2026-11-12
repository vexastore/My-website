import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isLocalizedPath,
  localeAlternates,
  localizePath,
  pageAlternates,
  splitLocalePath,
} from '../lib/localePath.ts';

test('localizePath prefixes Arabic URLs and leaves English ones alone', () => {
  assert.equal(localizePath('/', 'ar'), '/ar');
  assert.equal(localizePath('/vibrators', 'ar'), '/ar/vibrators');
  assert.equal(localizePath('/dildos/rose-vibrator', 'ar'), '/ar/dildos/rose-vibrator');
  assert.equal(localizePath('/blog/guides/first-toy', 'ar'), '/ar/blog/guides/first-toy');
  assert.equal(localizePath('/vibrators', 'en'), '/vibrators');
  assert.equal(localizePath('/', 'en'), '/');
});

test('localizePath keeps query strings and hashes and never doubles the prefix', () => {
  assert.equal(localizePath('/vibrators?utm_source=x#top', 'ar'), '/ar/vibrators?utm_source=x#top');
  assert.equal(localizePath('/ar/vibrators', 'ar'), '/ar/vibrators');
  assert.equal(localizePath('/ar', 'ar'), '/ar');
  assert.equal(localizePath('/ar/vibrators', 'en'), '/vibrators');
  assert.equal(localizePath('/ar', 'en'), '/');
});

test('English-only routes and files have no Arabic twin', () => {
  for (const path of ['/terms', '/privacy', '/delivery', '/warranty', '/returns', '/admin', '/admin/orders', '/api/products', '/product/x', '/products/x', '/sitemap.xml', '/robots.txt', '/favicon.png', '/images/mockup/hero.webp']) {
    assert.equal(isLocalizedPath(path), false, path);
    assert.equal(localizePath(path, 'ar'), path, path);
  }
  for (const path of ['/', '/vibrators', '/adult-toys', '/about', '/quiz', '/checkout', '/blog', '/blog/tips', '/blog/tips/care', '/dildos/some-product']) {
    assert.equal(isLocalizedPath(path), true, path);
  }
});

test('splitLocalePath only treats /ar as a whole segment', () => {
  assert.deepEqual(splitLocalePath('/ar'), { locale: 'ar', path: '/' });
  assert.deepEqual(splitLocalePath('/ar/'), { locale: 'ar', path: '/' });
  assert.deepEqual(splitLocalePath('/ar/dildos/x'), { locale: 'ar', path: '/dildos/x' });
  assert.deepEqual(splitLocalePath('/arabic-nights'), { locale: 'en', path: '/arabic-nights' });
  assert.deepEqual(splitLocalePath('/'), { locale: 'en', path: '/' });
  assert.deepEqual(splitLocalePath(''), { locale: 'en', path: '/' });
});

test('hreflang alternates are absolute, paired, and x-default points at English', () => {
  assert.deepEqual(localeAlternates('/vibrators'), {
    en: 'https://vexatoys.com/vibrators',
    ar: 'https://vexatoys.com/ar/vibrators',
    'x-default': 'https://vexatoys.com/vibrators',
  });
  // The homepage keeps its trailing slash (Search Console matches sitemap URLs exactly).
  assert.equal(localeAlternates('/').en, 'https://vexatoys.com/');
  assert.equal(localeAlternates('/').ar, 'https://vexatoys.com/ar');
  // Absolute input (a stored canonical override) and an already-Arabic path give the same pair.
  assert.deepEqual(localeAlternates('https://vexatoys.com/dildos/x'), localeAlternates('/ar/dildos/x'));
});

test('pageAlternates canonicalizes each language to itself', () => {
  assert.equal(pageAlternates('/vibrators', 'en').canonical, 'https://vexatoys.com/vibrators');
  assert.equal(pageAlternates('/vibrators', 'ar').canonical, 'https://vexatoys.com/ar/vibrators');
  assert.equal(pageAlternates('/vibrators', 'ar').languages.en, 'https://vexatoys.com/vibrators');
});
