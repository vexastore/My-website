import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildProductDescription,
  buildProductTitle,
  clampText,
  shortProductName,
} from '../lib/productSeo.ts';
import { isCategoryIndexable, MIN_INDEXABLE_CATEGORY_PRODUCTS } from '../lib/categoryIndexing.ts';
import { toCardProduct, toClientProduct } from '../lib/storefrontPayload.ts';
import { displayCopy } from '../lib/displayCopy.ts';

const BRAND = 'Vexa Toys Lebanon';

test('shortProductName keeps the head of a long marketing name and drops a trailing "in Lebanon"', () => {
  assert.equal(
    shortProductName('Thrusting Heating Dildo Vibrator with Remote Control – Realistic Silicone G-Spot Massager, 10 Vibration'),
    'Thrusting Heating Dildo Vibrator with Remote Control',
  );
  assert.equal(shortProductName('THE HEAVEN 6-IN-1 Dildo  in lebanon'), 'THE HEAVEN 6-IN-1 Dildo');
  assert.equal(shortProductName('Manual Penis Vacuum Pump – Compact Hand Pump (59.00 USD)'), 'Manual Penis Vacuum Pump');
  // A very short head is not meaningful on its own, so the full name is kept.
  assert.equal(shortProductName('Viagra - 50mg tablets'), 'Viagra - 50mg tablets');
});

test('buildProductTitle never exceeds 60 characters and always ends with the brand', () => {
  const names = [
    'Thrusting Heating Dildo Vibrator with Remote Control – Realistic Silicone G-Spot Massager, 10 Vibration & 7 Thrusting Modes, Waterproof Suction Cup',
    'Rabbit Thrusting Clitoral Licking Vibrator  in lebanon – 3-in-1 G-Spot & Nipple Stimulator',
    'Strap-On Harness Kit with Silicone Dildo',
    'Vibrating Bullet',
    'Extraordinarily Long Single Phrase Product Name Without Any Separator Characters At All',
  ];
  for (const name of names) {
    const title = buildProductTitle(name, BRAND);
    assert.ok(title.length <= 60, `${title} is ${title.length} chars`);
    assert.ok(title.endsWith(` | ${BRAND}`), title);
    assert.doesNotMatch(title, /\s{2,}/);
    assert.doesNotMatch(title, /\|\s*\|/);
  }
  assert.equal(buildProductTitle('Strap-On Harness Kit with Silicone Dildo', BRAND), 'Strap-On Harness Kit with Silicone Dildo | Vexa Toys Lebanon');
});

test('buildProductTitle uses the disambiguator only while the title still fits', () => {
  assert.equal(buildProductTitle('Vibrating Bullet', BRAND, 'Vibrators Lebanon'), 'Vibrating Bullet | Vibrators Lebanon | Vexa Toys Lebanon');
  const long = buildProductTitle('Remote Control Heating Vibrating Dildo Premium Silicone', BRAND, 'Dildos in Lebanon');
  assert.ok(long.length <= 60, long);
  assert.doesNotMatch(long, /Dildos in Lebanon/);
});

test('buildProductDescription keeps the lead and closing and fits in 155 characters', () => {
  const description = buildProductDescription(
    'Buy Strap-On Harness Kit with Silicone Dildo in Lebanon from Vexa Toys.',
    'The F520 Strap-On Harness Kit features an adjustable harness and a 9.5-inch dildo made from silicone. The adjustable design provides a secure fit.',
    'Discreet delivery across Lebanon, cash on delivery.',
  );
  assert.ok(description.length <= 155, `${description} is ${description.length} chars`);
  assert.ok(description.startsWith('Buy Strap-On Harness Kit with Silicone Dildo in Lebanon from Vexa Toys.'));
  assert.ok(description.endsWith('Discreet delivery across Lebanon, cash on delivery.'));
  assert.doesNotMatch(description, /provides a secure fit/, 'only the first sentence of the copy is used');

  const noBody = buildProductDescription('Buy Vibrating Bullet in Lebanon from Vexa Toys.', '', 'Discreet delivery across Lebanon, cash on delivery.');
  assert.equal(noBody, 'Buy Vibrating Bullet in Lebanon from Vexa Toys. Discreet delivery across Lebanon, cash on delivery.');
});

test('clampText cuts at a word boundary and strips dangling punctuation', () => {
  assert.equal(clampText('Shop dildos in Lebanon at Vexa Toys. Explore designs, materials and sizes.', 40), 'Shop dildos in Lebanon at Vexa Toys.');
  assert.equal(clampText('Short text', 40), 'Short text');
  assert.equal(clampText('word, word, word, word, word', 11), 'word, word');
});

test('categories need at least three products to be indexable', () => {
  assert.equal(MIN_INDEXABLE_CATEGORY_PRODUCTS, 3);
  assert.equal(isCategoryIndexable(0), false);
  assert.equal(isCategoryIndexable(2), false);
  assert.equal(isCategoryIndexable(3), true);
  assert.equal(isCategoryIndexable(30), true);
});

test('toCardProduct drops heavy fields but keeps what a product card renders', () => {
  const product = {
    id: 'p1', slug: 'premium-silicone-dildo', categorySlug: 'dildos', currency: 'USD',
    name: 'ديلدو', nameEn: 'Premium Silicone Dildo',
    description: 'وصف طويل '.repeat(50), descriptionEn: 'A very long description. '.repeat(50),
    seoTitleEn: 'Premium Silicone Dildo | Vexa Toys Lebanon', seoDescriptionEn: 'seo', canonicalUrlOverride: undefined,
    price: 49, image: 'https://cdn.example/a.webp',
    images: ['https://cdn.example/a.webp', 'https://cdn.example/b.webp', 'https://cdn.example/c.webp', 'data:image/png;base64,xxx'],
    imageAltsEn: ['a', 'b', 'c'], imageAltsAr: ['أ', 'ب', 'ج'],
    category: 'Dildos', categories: ['Dildos', 'Sex Toys'], rating: 4.5, reviewsCount: 3, stock: 7, isNew: true,
    variants: [{ name: 'لون', nameEn: 'Color', options: ['Pink'] }],
  };
  const card = toCardProduct(product);
  assert.equal(card.description, '');
  assert.equal(card.descriptionEn, '');
  assert.equal('seoTitleEn' in card, false);
  assert.deepEqual(card.images, ['https://cdn.example/a.webp', 'https://cdn.example/b.webp']);
  assert.deepEqual(card.imageAltsEn, ['a', 'b']);
  assert.equal(card.image, 'https://cdn.example/a.webp');
  assert.equal(card.slug, 'premium-silicone-dildo');
  assert.equal(card.price, 49);
  assert.equal(card.stock, 7);
  assert.deepEqual(card.variants, product.variants);
  assert.ok(JSON.stringify(card).length < JSON.stringify(product).length / 4);

  const full = toClientProduct(product);
  assert.equal(full.descriptionEn, product.descriptionEn);
  assert.deepEqual(full.images, ['https://cdn.example/a.webp', 'https://cdn.example/b.webp', 'https://cdn.example/c.webp']);
});

test('displayCopy collapses doubled spaces inside a line but keeps line breaks', () => {
  assert.equal(displayCopy('Sex Toys in  Lebanon'), 'Sex Toys in Lebanon');
  assert.equal(displayCopy('Line one\nLine  two'), 'Line one\nLine two');
});
