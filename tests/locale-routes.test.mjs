import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = (path) => stat(new URL(`../${path}`, import.meta.url)).then(() => true, () => false);

/** Every page that has an Arabic twin, as its path under app/(en) and app/(ar)/ar. */
const LOCALIZED_ROUTES = [
  'page.tsx',
  '[category]/page.tsx',
  '[category]/[slug]/page.tsx',
  'adult-toys/page.tsx',
  'about/page.tsx',
  'quiz/page.tsx',
  'checkout/page.tsx',
  'blog/page.tsx',
  'blog/[blogCategory]/page.tsx',
  'blog/[blogCategory]/[slug]/page.tsx',
  'terms/page.tsx',
  'privacy/page.tsx',
  'delivery/page.tsx',
  'warranty/page.tsx',
  'returns/page.tsx',
];

const ENGLISH_ONLY_ROUTES = ['admin', 'product/[slug]', 'products/[slug]'];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(new URL(`../${dir}/`, import.meta.url), { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...await walk(path));
    else out.push(path);
  }
  return out;
}

test('each localized route has an English and an Arabic wrapper that pass their locale', async () => {
  for (const route of LOCALIZED_ROUTES) {
    const en = await read(`app/(en)/${route}`);
    const ar = await read(`app/(ar)/ar/${route}`);
    assert.match(en, /from '@\/src\/(routes|components\/policy)\//, route);
    assert.match(ar, /from '@\/src\/(routes|components\/policy)\//, route);
    assert.match(en, /'en'/, `${route} (en)`);
    assert.match(ar, /'ar'/, `${route} (ar)`);
    assert.doesNotMatch(ar, /'en'/, `${route}: the Arabic wrapper must not mention 'en'`);
  }
});

test('admin and legacy product redirects stay English only', async () => {
  for (const route of ENGLISH_ONLY_ROUTES) {
    assert.equal(await exists(`app/(en)/${route}/page.tsx`), true, route);
    assert.equal(await exists(`app/(ar)/ar/${route}/page.tsx`), false, route);
  }
});

test('the two root layouts set the document language from the URL, not from a cookie', async () => {
  assert.equal(await exists('app/layout.tsx'), false, 'a top-level layout would nest both groups under one <html>');
  assert.match(await read('app/(en)/layout.tsx'), /<RootDocument locale="en">/);
  assert.match(await read('app/(ar)/layout.tsx'), /<RootDocument locale="ar">/);
  const document = await read('src/layouts/RootDocument.tsx');
  assert.match(document, /<html lang=\{locale\} dir=\{locale === 'ar' \? 'rtl' : 'ltr'\}>/);
});

test('no route or shared page reads request cookies or headers (keeps pages static and CDN-cacheable)', async () => {
  const files = [...await walk('app'), ...await walk('src/routes'), 'src/layouts/RootDocument.tsx']
    .filter(file => /\.tsx?$/.test(file) && !file.startsWith('app/api/'));
  for (const file of files) {
    const source = await read(file);
    assert.doesNotMatch(source, /next\/headers/, file);
    assert.doesNotMatch(source, /getStoreLocale/, file);
    assert.doesNotMatch(source, /force-dynamic/, file);
  }
  assert.equal(await exists('lib/storeLocale.ts'), false, 'the cookie reader was removed');
});

test('shared route modules localize canonicals, hreflang and internal links', async () => {
  for (const module of ['home', 'category', 'product', 'adultToys', 'about', 'quiz', 'blogIndex', 'blogCategory', 'blogArticle']) {
    const source = await read(`src/routes/${module}.tsx`);
    assert.match(source, /pageAlternates\(/, module);
    assert.doesNotMatch(source, /alternates: \{ canonical/, `${module}: canonical without hreflang languages`);
    // Links to pages must go through localizePath; preloads of files (`/images/....webp`) are not pages.
    assert.doesNotMatch(source, /href="\/(?![^"]*\.)/, `${module}: unlocalized link`);
    assert.doesNotMatch(source, /href=\{`\//, `${module}: unlocalized template link`);
  }
});

test('client components route every internal link through the language helper', async () => {
  const components = [
    'Navbar', 'SiteFooter', 'ProductPage', 'CategoryGuideSection', 'BuyingGuideBanner', 'ShoppingInfoSection',
    'AgeVerification', 'AssuranceSection', 'CategoryShowcase', 'About', 'ProductList', 'HeroSection', 'quiz/QuizClient', 'blog/BlogCard',
  ];
  for (const name of components) {
    const source = await read(`src/components/${name}.tsx`);
    assert.doesNotMatch(source, /href="\//, `${name}: unlocalized link`);
    assert.doesNotMatch(source, /href=\{`\//, `${name}: unlocalized template link`);
    assert.match(source, /localizeHref|localizePath/, name);
  }
  const context = await read('src/context/ShopContext.tsx');
  assert.match(context, /localizeHref: \(path: string\) => string;/);
  assert.match(context, /window\.location\.assign\(target\)/, 'switching language navigates to the other URL');
  assert.doesNotMatch(context, /window\.location\.pathname\.(replace|split|startsWith)/, 'client path parsing must strip the /ar prefix first');
  assert.match(context, /router\.push\(localizePath\(catPath, language\)\)/);
});

test('the sitemap lists both languages with hreflang alternates', async () => {
  const source = await read('app/sitemap.ts');
  assert.match(source, /localeAlternates/);
  assert.match(source, /alternates: \{ languages \}/);
  assert.match(source, /bilingual\('\/'/);
  assert.match(source, /bilingual\('\/adult-toys'/);
  assert.match(source, /bilingual\('\/terms'/);
  assert.match(source, /bilingual\('\/returns'/);
  assert.match(source, /article\.contentAr\?\.trim\(\) \? bilingual/);
});
