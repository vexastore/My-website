import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { termsPolicy } from '../src/content/policies/terms.ts';
import { privacyPolicy } from '../src/content/policies/privacy.ts';
import { deliveryPolicy } from '../src/content/policies/delivery.ts';
import { warrantyPolicy } from '../src/content/policies/warranty.ts';
import { returnsPolicy } from '../src/content/policies/returns.ts';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const rendererSource = await read('src/components/policy/PolicyPage.tsx');
// The footer lives in its own component so the shop and SiteFrame pages share it.
const appSource = await read('src/components/SiteFooter.tsx');
const sitemapSource = await read('app/sitemap.ts');
const nextConfigSource = await read('next.config.mjs');

const POLICIES = [termsPolicy, privacyPolicy, deliveryPolicy, warrantyPolicy, returnsPolicy];

/** Every piece of text in a policy, in one language. */
function allText(policy, locale) {
  const text = policy[locale];
  const blocks = [...text.intro, ...text.sections.flatMap(section => [section.title, ...section.blocks])];
  return blocks.map(block => typeof block === 'string' ? block : Object.values(block).flat().join('\n')).join('\n');
}

const linksIn = (text) => [...text.matchAll(/\]\((\/[a-z-]+)\)/g)].map(match => match[1]);

test('terms page has exact requested SEO metadata', () => {
  assert.equal(termsPolicy.en.seoTitle, 'Vexa Toys Terms & Conditions | Vexa Toys Lebanon');
  assert.match(termsPolicy.en.description, /^Read the Vexa Toys Terms & Conditions covering orders, payments, delivery, discreet packaging, returns, warranty, privacy, website use and purchases in Lebanon\./);
  assert.match(rendererSource, /pageAlternates\(`\/\$\{policy\.slug\}`, locale\)/);
});

test('terms page contains all 18 sections and required legal links in both languages', () => {
  for (const locale of ['en', 'ar']) {
    const titles = termsPolicy[locale].sections.map(section => section.title);
    for (let i = 1; i <= 18; i++) assert.ok(titles.some(title => title.startsWith(`${i}. `)), `${locale}: section ${i}`);
    const text = allText(termsPolicy, locale);
    for (const href of ['/delivery', '/warranty', '/privacy', '/returns']) assert.ok(linksIn(text).includes(href), `${locale}: link to ${href}`);
    assert.match(text, /https:\/\/wa\.me\/96176730767/);
  }
});

test('returns page has exact requested SEO metadata and the renderer emits Schema.org WebPage', () => {
  assert.equal(returnsPolicy.en.seoTitle, 'Refund & Returns Policy | Vexa Toys Lebanon');
  assert.match(rendererSource, /'@type': 'WebPage'/);
  assert.match(rendererSource, /url: pageUrl/);
});

test('returns page links to terms, warranty, and delivery without dead text references', () => {
  for (const locale of ['en', 'ar']) {
    const text = allText(returnsPolicy, locale);
    for (const href of ['/terms', '/warranty', '/delivery']) assert.ok(linksIn(text).includes(href), `${locale}: link to ${href}`);
    assert.match(text, /\+961 76 730 767/);
    assert.doesNotMatch(text, /669 821/);
    assert.match(text, /wa\.me\/96176730767/);
  }
});

test('warranty and delivery pages link to /returns in both languages', () => {
  for (const policy of [warrantyPolicy, deliveryPolicy]) {
    for (const locale of ['en', 'ar']) assert.ok(linksIn(allText(policy, locale)).includes('/returns'), `${policy.slug} ${locale}`);
  }
});

test('every policy has a complete Arabic version with the same structure as the English one', () => {
  for (const policy of POLICIES) {
    assert.equal(policy.ar.sections.length, policy.en.sections.length, policy.slug);
    assert.equal(policy.ar.intro.length, policy.en.intro.length, policy.slug);
    policy.en.sections.forEach((section, index) => {
      const arabic = policy.ar.sections[index];
      assert.equal(arabic.blocks.length, section.blocks.length, `${policy.slug}: section ${section.title}`);
      section.blocks.forEach((block, blockIndex) => {
        const arabicBlock = arabic.blocks[blockIndex];
        assert.equal(typeof arabicBlock, typeof block, `${policy.slug}: ${section.title} block ${blockIndex}`);
        if (typeof block !== 'string') {
          const [kind, items] = Object.entries(block)[0];
          assert.ok(kind in arabicBlock, `${policy.slug}: ${section.title} block ${blockIndex} kind ${kind}`);
          if (Array.isArray(items)) assert.equal(arabicBlock[kind].length, items.length, `${policy.slug}: ${section.title} list ${blockIndex}`);
        }
      });
    });
    // Arabic text is actually Arabic, and internal links are the same set in both languages.
    assert.match(allText(policy, 'ar'), /[\u0600-\u06FF]/, policy.slug);
    assert.deepEqual(new Set(linksIn(allText(policy, 'ar'))), new Set(linksIn(allText(policy, 'en'))), `${policy.slug}: links`);
    for (const locale of ['en', 'ar']) {
      assert.ok(policy[locale].seoTitle.length <= 70, `${policy.slug} ${locale}: title length`);
      // The returns description predates this check at 185 characters; keep every description under 200.
      assert.ok(policy[locale].description.length <= 200, `${policy.slug} ${locale}: description length`);
    }
  }
});

test('storefront footer links to /terms and /returns', () => {
  // Links are declared in the LEGAL_LINKS list and rendered through the language helper.
  assert.match(appSource, /href: '\/terms'/);
  assert.match(appSource, /href: '\/returns'/);
  assert.match(appSource, /href=\{localizeHref\(link\.href\)\}/);
});

test('sitemap includes both languages of /terms, /privacy, /delivery, /warranty, and /returns', () => {
  for (const slug of ['terms', 'privacy', 'delivery', 'warranty', 'returns']) {
    assert.match(sitemapSource, new RegExp(`bilingual\\('/${slug}'\\)`));
  }
});

test('next.config.mjs redirects aliases to legal routes', () => {
  assert.match(nextConfigSource, /source:\s*['"]\/terms-and-conditions['"]/);
  assert.match(nextConfigSource, /destination:\s*['"]\/terms['"]/);
  assert.match(nextConfigSource, /source:\s*['"]\/refund-returns['"]/);
  assert.match(nextConfigSource, /destination:\s*['"]\/returns['"]/);
});
