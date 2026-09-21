import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCategoryEditorial } from '../src/utils/category-editorial.ts';
import { CATEGORY_EDITORIALS, getCategoryEditorial } from '../src/data/categoryEditorial.ts';
import { CATEGORIES } from '../src/data/categories.ts';
import { CATEGORY_TO_SLUG } from '../lib/categoryMeta.ts';

test('public editorial only renders valid FAQ pairs', () => {
  assert.deepEqual(parseCategoryEditorial({ guide: 'A guide', faqs: [
    { q: 'Question?', a: 'Answer.' }, { q: 'Bad' }, null,
  ] }), { guide: 'A guide', faqs: [{ q: 'Question?', a: 'Answer.' }] });
});

test('invalid editorial does not render as a guide', () => {
  assert.equal(parseCategoryEditorial({ guide: 4, faqs: [] }), null);
  assert.equal(parseCategoryEditorial({ guide: 'Text', faqs: {} }), null);
});

test('CATEGORY_EDITORIALS covers all catalog categories plus adult-toys', () => {
  for (const cat of CATEGORIES) {
    const slug = CATEGORY_TO_SLUG[cat.id];
    assert.ok(slug, `Category ${cat.id} has a valid slug`);
    const editorial = getCategoryEditorial(slug);
    assert.ok(editorial, `Editorial exists for category ${cat.id} (${slug})`);
    assert.ok(editorial.guide.length > 50, `Guide has substantial text for ${slug}`);
    assert.ok(editorial.faqs.length > 0, `FAQs exist for ${slug}`);
  }

  const adultToysEditorial = getCategoryEditorial('adult-toys');
  assert.ok(adultToysEditorial, 'Editorial exists for adult-toys');
  assert.ok(adultToysEditorial.faqs.length >= 3, 'Adult toys has at least 3 FAQs');
});

test('dynamic category guide changes content between categories', () => {
  const vibrators = getCategoryEditorial('vibrators');
  const dildos = getCategoryEditorial('dildos');
  const lingerie = getCategoryEditorial('lingerie');
  const maleToys = getCategoryEditorial('male-toys');

  assert.ok(vibrators && dildos && lingerie && maleToys);
  assert.notEqual(vibrators.guide, dildos.guide);
  assert.notEqual(dildos.guide, lingerie.guide);
  assert.notEqual(lingerie.guide, maleToys.guide);

  assert.ok(vibrators.guide.toLowerCase().includes('vibrator'));
  assert.ok(dildos.guide.toLowerCase().includes('dildo'));
  assert.ok(lingerie.guide.toLowerCase().includes('lingerie'));
  assert.ok(maleToys.guide.toLowerCase().includes('male'));
});

test('editorial guides and FAQs do not contain unbranded Vexa Store', () => {
  for (const [slug, editorial] of Object.entries(CATEGORY_EDITORIALS)) {
    assert.ok(!editorial.guide.includes('Vexa Store'), `Guide for ${slug} contains Vexa Store`);
    for (const faq of editorial.faqs) {
      assert.ok(!faq.q.includes('Vexa Store'), `FAQ Question for ${slug} contains Vexa Store`);
      assert.ok(!faq.a.includes('Vexa Store'), `FAQ Answer for ${slug} contains Vexa Store`);
    }
  }
});
