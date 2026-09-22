import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const termsSource = await readFile(new URL('../app/terms/page.tsx', import.meta.url), 'utf8');
const warrantySource = await readFile(new URL('../app/warranty/page.tsx', import.meta.url), 'utf8');
const deliverySource = await readFile(new URL('../app/delivery/page.tsx', import.meta.url), 'utf8');
const returnsSource = await readFile(new URL('../app/returns/page.tsx', import.meta.url), 'utf8');
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
  assert.match(termsSource, /href=["']\/returns["']/);
  assert.match(termsSource, /https:\/\/wa\.me\/96176730767/);
});

test('returns page has exact requested SEO metadata, canonical, and Schema.org WebPage', () => {
  assert.match(returnsSource, /const pageTitle = 'Refund & Returns Policy \| Vexa Toys Lebanon';/);
  assert.match(returnsSource, /canonical:\s*['"]https:\/\/vexatoys\.com\/returns['"]/);
  assert.match(returnsSource, /url:\s*['"]https:\/\/vexatoys\.com\/returns['"]/);
  assert.match(returnsSource, /'@type':\s*['"]WebPage['"]/);
});

test('returns page links to terms, warranty, and delivery without dead text references', () => {
  assert.match(returnsSource, /href=["']\/terms["']/);
  assert.match(returnsSource, /href=["']\/warranty["']/);
  assert.match(returnsSource, /href=["']\/delivery["']/);
  assert.match(returnsSource, /\+961 76 669 821/);
});

test('warranty and delivery pages link to /returns without dead text references', () => {
  assert.match(warrantySource, /href=["']\/returns["']/);
  assert.match(deliverySource, /href=["']\/returns["']/);
  // Ensure unlinked "Refund & Returns Policy" plain text without Link is eliminated
  assert.doesNotMatch(warrantySource, /our Refund &amp; Returns Policy and/);
  assert.doesNotMatch(deliverySource, /our Refund &amp; Returns Policy and/);
});

test('storefront footer links to /terms and /returns', () => {
  assert.match(appSource, /href="\/terms"/);
  assert.match(appSource, /href="\/returns"/);
});

test('sitemap includes /terms, /privacy, /delivery, /warranty, and /returns', () => {
  assert.match(sitemapSource, /`\${BASE}\/terms`/);
  assert.match(sitemapSource, /`\${BASE}\/privacy`/);
  assert.match(sitemapSource, /`\${BASE}\/delivery`/);
  assert.match(sitemapSource, /`\${BASE}\/warranty`/);
  assert.match(sitemapSource, /`\${BASE}\/returns`/);
});

test('next.config.mjs redirects aliases to legal routes', () => {
  assert.match(nextConfigSource, /source:\s*['"]\/terms-and-conditions['"]/);
  assert.match(nextConfigSource, /destination:\s*['"]\/terms['"]/);
  assert.match(nextConfigSource, /source:\s*['"]\/refund-returns['"]/);
  assert.match(nextConfigSource, /destination:\s*['"]\/returns['"]/);
});
