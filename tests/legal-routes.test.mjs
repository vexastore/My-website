import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const termsSource = await readFile(new URL('../app/terms/page.tsx', import.meta.url), 'utf8');
const appSource = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
const sitemapSource = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');
const nextConfigSource = await readFile(new URL('../next.config.mjs', import.meta.url), 'utf8');

test('terms page has exact requested SEO metadata', () => {
  assert.match(termsSource, /const pageTitle = 'Vexa Toys Terms & Conditions \| Vexa Toys Lebanon';/);
  assert.match(termsSource, /const pageDescription =\s*'Read the Vexa Toys Terms & Conditions covering orders, payments, delivery, discreet packaging, returns, warranty, privacy, website use and purchases in Lebanon\./);
  assert.match(termsSource, /canonical:\s*['"]https:\/\/vexatoys\.com\/terms['"]/);
});

test('terms page contains all 18 sections and required legal links', () => {
  for (let i = 1; i <= 18; i++) {
    assert.match(termsSource, new RegExp(`${i}\\.\\s+`));
  }
  assert.match(termsSource, /href=["']\/delivery["']/);
  assert.match(termsSource, /href=["']\/warranty["']/);
  assert.match(termsSource, /href=["']\/privacy["']/);
  assert.match(termsSource, /https:\/\/wa\.me\/96176730767/);
});

test('storefront footer links to /terms', () => {
  assert.match(appSource, /href=["']\/terms["']/);
});

test('sitemap includes /terms, /privacy, /delivery, and /warranty', () => {
  assert.match(sitemapSource, /`\${BASE}\/terms`/);
  assert.match(sitemapSource, /`\${BASE}\/privacy`/);
  assert.match(sitemapSource, /`\${BASE}\/delivery`/);
  assert.match(sitemapSource, /`\${BASE}\/warranty`/);
});

test('next.config.mjs redirects /terms-and-conditions to /terms', () => {
  assert.match(nextConfigSource, /source:\s*['"]\/terms-and-conditions['"]/);
  assert.match(nextConfigSource, /destination:\s*['"]\/terms['"]/);
});
