import assert from 'node:assert/strict';
import test from 'node:test';

import { NextRequest } from 'next/server.js';
import { middleware } from '../middleware.ts';

const COOKIE = 'vexa_store_language';

function request(url, { cookie, headers = {} } = {}) {
  // A bare Request has no Host header; the middleware reads it, so set it from the URL like a browser would.
  const req = new NextRequest(url, { headers: { host: new URL(url).host, accept: 'text/html', 'sec-fetch-dest': 'document', ...headers } });
  if (cookie) req.cookies.set(COOKIE, cookie);
  return req;
}

const redirectTarget = (response) => response.headers.get('location');

test('Arabic URLs are served as they are', () => {
  for (const url of ['https://vexatoys.com/ar', 'https://vexatoys.com/ar/vibrators', 'https://vexatoys.com/ar/dildos/some-product', 'https://vexatoys.com/ar/blog/tips/care']) {
    const response = middleware(request(url));
    assert.equal(response.status, 200, url);
    assert.equal(redirectTarget(response), null, url);
  }
});

test('English-only routes under /ar redirect permanently to the English URL', () => {
  const response = middleware(request('https://vexatoys.com/ar/terms?ref=footer'));
  assert.equal(response.status, 301);
  assert.equal(redirectTarget(response), 'https://vexatoys.com/terms?ref=footer');
  assert.equal(redirectTarget(middleware(request('https://vexatoys.com/ar/admin'))), 'https://vexatoys.com/admin');
});

test('a visitor who chose Arabic is sent from an English URL to the Arabic one', () => {
  const response = middleware(request('https://vexatoys.com/vibrators?utm_source=ig', { cookie: 'ar' }));
  assert.equal(response.status, 302);
  assert.equal(redirectTarget(response), 'https://vexatoys.com/ar/vibrators?utm_source=ig');
  assert.equal(redirectTarget(middleware(request('https://vexatoys.com/', { cookie: 'ar' }))), 'https://vexatoys.com/ar');
  // English-only pages are not redirected even with the Arabic cookie.
  assert.equal(middleware(request('https://vexatoys.com/returns', { cookie: 'ar' })).status, 200);
});

test('crawlers and the client router get exactly the URL they asked for', () => {
  // No cookie (every crawler): no redirect.
  assert.equal(middleware(request('https://vexatoys.com/vibrators')).status, 200);
  // English cookie: no redirect.
  assert.equal(middleware(request('https://vexatoys.com/vibrators', { cookie: 'en' })).status, 200);
  // React Server Component and prefetch requests must never be redirected across languages.
  assert.equal(middleware(request('https://vexatoys.com/vibrators', { cookie: 'ar', headers: { rsc: '1' } })).status, 200);
  assert.equal(middleware(request('https://vexatoys.com/vibrators', { cookie: 'ar', headers: { 'next-router-prefetch': '1' } })).status, 200);
});

test('language routing also applies on localhost, and host canonicalization keeps the /ar path', () => {
  assert.equal(redirectTarget(middleware(request('http://localhost:3000/vibrators', { cookie: 'ar' }))), 'http://localhost:3000/ar/vibrators');
  assert.equal(redirectTarget(middleware(request('http://localhost:3000/ar/terms'))), 'http://localhost:3000/terms');
  const www = middleware(request('https://www.vexatoys.com/ar/vibrators'));
  assert.equal(www.status, 301);
  assert.equal(redirectTarget(www), 'https://vexatoys.com/ar/vibrators');
});
