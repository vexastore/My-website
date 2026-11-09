import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { extractSpecs, careTips, productFaqs } from '../lib/productContent.ts';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const product = {
  id: 'p1', name: 'هزاز', nameEn: 'Silicone Wand Vibrator', description: '', category: 'Vibrators',
  descriptionEn: 'Body-safe silicone wand with 10 vibration modes. USB rechargeable, IPX7 waterproof, 20 cm long. Whisper quiet under 45 dB.',
  price: 49, image: '', rating: 0, reviewsCount: 0, stock: 4,
};

test('product page never invents a discount: no computed "was" price, compareAtPrice gated above price', async () => {
  const page = await read('src/components/ProductPage.tsx');
  assert.doesNotMatch(page, /displayedPrice \* 1\.\d+/, 'old fake oldPrice multiplier must be gone');
  assert.match(page, /product\.compareAtPrice > displayedPrice/);
  const fetchProducts = await read('lib/fetchProducts.ts');
  assert.match(fetchProducts, /compare_at_price/);
  assert.match(fetchProducts, /Number\(row\.compare_at_price\) > Number\(row\.price\)/);
});

test('rating stars render only with real reviews, on card and page', async () => {
  const card = await read('src/components/ProductCard.tsx');
  const page = await read('src/components/ProductPage.tsx');
  assert.doesNotMatch(card, /No reviews yet/);
  assert.match(card, /hasReviews \? \(/);
  assert.match(card, /Cash on delivery · Discreet packaging/);
  assert.match(page, /\{hasReviews && \(/);
  assert.match(page, /product\.reviewsCount > 0 && product\.rating > 0/);
});

test('product page syncs document metadata from stored SEO fields with a built fallback', async () => {
  const page = await read('src/components/ProductPage.tsx');
  assert.match(page, /product\.seoTitleEn/);
  assert.match(page, /buildProductTitle\(name, brand\)/);
  assert.doesNotMatch(page, /document\.title = `\$\{productName\}/);
  assert.match(page, /Cash on delivery/);
  assert.doesNotMatch(page, /Cash or card/);
});

test('specs, care and FAQ are derived only from stated facts', () => {
  const specs = extractSpecs(product, false);
  const labels = specs.map((row) => row.label.en);
  assert.ok(labels.includes('Material'), 'material from description');
  assert.ok(specs.some((row) => /10/.test(row.value)), 'vibration modes count');
  assert.ok(specs.some((row) => /USB/i.test(row.value)), 'charging');
  assert.ok(specs.some((row) => /IPX7|Waterproof/i.test(row.value)), 'waterproof');

  const bare = extractSpecs({ ...product, nameEn: 'Wand', descriptionEn: 'A toy.' }, false);
  assert.equal(bare.length, 0, 'no description facts means no spec rows');

  const tips = careTips(product, false);
  assert.ok(tips.length >= 3);
  assert.ok(tips.some((tip) => /water-based/i.test(tip)), 'silicone gets water-based lubricant advice');

  const faqs = productFaqs(product, false);
  assert.ok(faqs.length >= 3);
  assert.ok(faqs.every((faq) => faq.q && faq.a));
  assert.ok(faqs.some((faq) => /cash on delivery/i.test(faq.a)));
});
