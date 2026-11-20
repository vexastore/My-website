import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { CATEGORIES } from '../src/data/categories.ts';
import { splitHeroHeading } from '../src/utils/heroHeading.ts';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('only the home page carries the "sex toys in Lebanon" heading', async () => {
  const home = await read('src/routes/home.tsx');
  const hero = await read('src/components/HeroSection.tsx');

  assert.match(home, /HERO_HEADING_EN = 'Sex Toys Lebanon \| Discreet Adult Toys'/);
  // The hero intro names the exact query in its first sentence.
  assert.match(hero, /'Vexa Toys sells sex toys in Lebanon online:/);

  const sexToys = CATEGORIES.find(cat => cat.id === 'Sex Toys');
  assert.ok(sexToys);
  const h1 = splitHeroHeading(sexToys.titlePage.en);
  assert.deepEqual(h1, { primary: 'ONLINE SEX SHOP', secondary: 'IN LEBANON' });
  assert.doesNotMatch(sexToys.titlePage.en, /^Sex Toys in Lebanon/i, '/sex-toys must not reuse the home page heading');
});

test('internal links with the target anchor point at the home page', async () => {
  const about = await read('src/components/About.tsx');
  const quiz = await read('src/routes/quiz.tsx');
  const footer = await read('src/components/SiteFooter.tsx');

  assert.match(about, /href=\{localizeHref\('\/'\)\}[\s\S]{0,400}Browse sex toys in Lebanon/);
  assert.match(quiz, /localizePath\('\/', locale\)[^\n]*Sex Toys in Lebanon/);
  assert.match(footer, /href=\{localizeHref\('\/'\)\}[\s\S]*Sex Toys & Adult Toys in Lebanon/);
  assert.match(footer, /Delivery across all Lebanon, cash on delivery/);
});

test('site-wide schema is an OnlineStore with the Business Profile phone and service area', async () => {
  const root = await read('src/layouts/RootDocument.tsx');
  const about = await read('src/components/About.tsx');

  assert.match(root, /const STORE_PHONE = '\+961 76 730 767'/);
  assert.match(root, /'@type': 'OnlineStore', '@id': `\$\{BASE\}\/#organization`, name: 'Vexa Toys'/);
  assert.match(root, /telephone: STORE_PHONE/);
  assert.match(root, /areaServed: \{ '@type': 'Country', name: 'Lebanon' \}/);
  assert.match(root, /paymentAccepted: 'Cash on delivery'/);
  assert.match(root, /publisher: \{ '@id': `\$\{BASE\}\/#organization` \}/, 'WebSite still points at the store node');
  // The same number is printed on the About page, so Google can match site, schema and profile.
  assert.match(about, /\+961 76 730 767/);
});

test('Merchant Center verification tag is declared once in the root metadata (1.7.6)', async () => {
  const root = await read('src/layouts/RootDocument.tsx');
  const matches = root.match(/verification: \{ google: '([^']+)' \}/g) || [];
  assert.equal(matches.length, 1, 'exactly one verification entry');
  assert.ok(root.includes("google: '2RvVW58INu-IGaDumjtdQXGjxnbO_WF3EGlXpO0URf0'"), 'the Merchant Center code');
});

test('the exact phrase links to the home page from articles, the bare "sex toys" to the category (1.7.7)', async () => {
  const content = await read('lib/blogContent.ts');
  const rules = [...content.matchAll(/\{ pattern: (\/[^\n]+?\/[a-z]*), href: '([^']+)', slug: '([^']+)' \}/g)].map(m => ({ pattern: m[1], href: m[2], slug: m[3] }));
  const phrase = rules.findIndex(r => r.pattern.includes('sex toys in Lebanon'));
  const bare = rules.findIndex(r => r.pattern === '/\\bsex toys?\\b/i');
  assert.ok(phrase >= 0 && rules[phrase].href === '/' && rules[phrase].slug === 'home', 'phrase rule links home');
  assert.ok(bare > phrase, 'phrase rule comes before the bare rule so it wins');
  assert.ok(rules.find(r => r.pattern.includes('الألعاب الجنسية في لبنان') && r.href === '/'), 'Arabic phrase rule links home');
  assert.ok(content.includes("slug !== 'adult-toys' && slug !== 'home'"), 'related categories never list the home rule');
  const article = await read('src/routes/blogArticle.tsx');
  assert.ok(article.includes("localizePath(shopSlug === 'sex-toys' ? '/' : `/${shopSlug}`, locale)"), '"Shop what this covers" sends the sex-toys entry home');
});
