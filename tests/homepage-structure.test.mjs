import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { splitHeroHeading, splitArabicHeroHeading } from '../src/utils/heroHeading.ts';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('hero heading splitter handles homepage, category and brand-suffixed headings', () => {
  assert.deepEqual(splitHeroHeading('Sex Toys Lebanon | Discreet Adult Toys'), {
    primary: 'SEX TOYS LEBANON',
    secondary: 'DISCREET ADULT TOYS',
  });
  assert.deepEqual(splitHeroHeading('Dildos in Lebanon | Vexa Toys'), {
    primary: 'DILDOS',
    secondary: 'IN LEBANON',
  });
  assert.deepEqual(splitHeroHeading('Holiday Collection'), {
    primary: 'HOLIDAY COLLECTION',
    secondary: '',
  });
  assert.deepEqual(splitArabicHeroHeading('ديلدو في لبنان | متجر فيكسا'), {
    primary: 'ديلدو',
    secondary: 'في لبنان',
  });
});

test('homepage journey renders inside the storefront in one order', async () => {
  const productList = await read('src/components/ProductList.tsx');

  const order = ['<HeroSection', '<CategoryShowcase', 'id="products-grid"', '<AssuranceSection', '<BuyingGuideBanner', '<FaqAccordion', '<ShoppingInfoSection'];
  let last = -1;
  for (const marker of order) {
    const index = productList.indexOf(marker);
    assert.ok(index > last, `${marker} must appear after the previous section`);
    last = index;
  }
  assert.doesNotMatch(productList, /QuizBanner/);
  assert.match(productList, /HOME_FEATURED_LIMIT = 15/);
});

test('product cards show only real stock, newness and price signals', async () => {
  const card = await read('src/components/ProductCard.tsx');

  assert.doesNotMatch(card, /Best Seller/);
  assert.doesNotMatch(card, /-20%/);
  assert.doesNotMatch(card, /price \* 1\.25/);
  assert.doesNotMatch(card, /line-through/);
  assert.match(card, /product\.isNew/);
  assert.match(card, /Only \$\{product\.stock\} left/);
});

test('category discovery cards are crawlable links to real category routes', async () => {
  const showcase = await read('src/components/CategoryShowcase.tsx');

  for (const slug of ['vibrators', 'dildos', 'male-toys', 'sex-toys', 'lingerie', 'sex-dolls', 'bdsm', 'sexual-enhancers']) {
    assert.match(showcase, new RegExp(`slug: '${slug}'`));
  }
  assert.match(showcase, /href=\{`\/\$\{card\.slug\}`\}/);
  assert.match(showcase, /id="shop-by-category"/);
});

test('footer and shared sections carry no placeholder social links or unverified payment claims', async () => {
  const app = await read('src/App.tsx');
  const faq = await read('src/data/faq.ts');
  const guide = await read('src/components/BuyingGuideBanner.tsx');

  assert.doesNotMatch(app, /https:\/\/instagram\.com"/);
  assert.doesNotMatch(app, /https:\/\/tiktok\.com"/);
  assert.doesNotMatch(app, /https:\/\/x\.com"/);
  assert.match(app, /wa\.me\/96176730767/);
  assert.doesNotMatch(faq, /Card and online payments/);
  assert.doesNotMatch(guide, /Card Payment/);
});

test('homepage components use the shared design tokens instead of ad-hoc hex colors', async () => {
  const tokens = await read('app/globals.css');
  assert.match(tokens, /--color-vexa-pink: #ff2d78/);
  assert.match(tokens, /--color-vexa-ink: #050505/);

  for (const file of [
    'src/components/HeroSection.tsx',
    'src/components/CategoryShowcase.tsx',
    'src/components/AssuranceSection.tsx',
    'src/components/BuyingGuideBanner.tsx',
    'src/components/FaqAccordion.tsx',
    'src/components/ShoppingInfoSection.tsx',
    'src/components/ProductList.tsx',
    'src/components/ProductCard.tsx',
    'src/App.tsx',
  ]) {
    const source = await read(file);
    assert.doesNotMatch(source, /#ff2d78|#121212|#0d0d0d|#0e0e0e|#161616|#08080b|#0e0e12|#121217/i, `${file} still uses a raw palette hex`);
  }
});
