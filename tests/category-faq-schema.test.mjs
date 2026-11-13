import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { selectCategoryFaqs, buildFaqPageSchema } from '../lib/categoryFaq.ts';
import { getCategoryContent } from '../src/data/categoryContent.ts';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('category FAQ selection matches what the page renders', () => {
  const content = getCategoryContent('vibrators');
  assert.ok(content && content.faqs.length >= 3);

  const english = selectCategoryFaqs('en', null, content);
  assert.deepEqual(english, content.faqs.map(f => ({ q: f.q.en, a: f.a.en })));

  const arabic = selectCategoryFaqs('ar', { faqs: [{ q: 'Editorial?', a: 'Yes.' }] }, content);
  assert.deepEqual(arabic, content.faqs.map(f => ({ q: f.q.ar, a: f.a.ar })), 'Arabic ignores English-only editorial FAQs');
  const arabicWritten = selectCategoryFaqs('ar', { faqs: [{ q: 'Editorial?', a: 'Yes.' }], faqsAr: [{ q: 'سؤال؟', a: 'جواب.' }] }, content);
  assert.deepEqual(arabicWritten, [{ q: 'سؤال؟', a: 'جواب.' }], 'admin-written Arabic FAQs win on Arabic pages');
  const englishUnaffected = selectCategoryFaqs('en', { faqs: [], faqsAr: [{ q: 'سؤال؟', a: 'جواب.' }] }, content);
  assert.deepEqual(englishUnaffected, content.faqs.map(f => ({ q: f.q.en, a: f.a.en })), 'Arabic FAQs never leak into English pages');

  const editorial = selectCategoryFaqs('en', { faqs: [{ q: 'Editorial?', a: 'Yes.' }] }, content);
  assert.deepEqual(editorial, [{ q: 'Editorial?', a: 'Yes.' }], 'editorial FAQs win in English');

  assert.deepEqual(selectCategoryFaqs('en', null, null), []);
});

test('FAQPage schema is built from the selected list and omitted when empty', () => {
  assert.equal(buildFaqPageSchema([]), null);
  const schema = buildFaqPageSchema([{ q: ' Is it legal? ', a: ' Yes. ' }, { q: '', a: 'dropped' }]);
  assert.equal(schema['@type'], 'FAQPage');
  assert.deepEqual(schema.mainEntity, [
    { '@type': 'Question', name: 'Is it legal?', acceptedAnswer: { '@type': 'Answer', text: 'Yes.' } },
  ]);
});

test('category pages and the guide section share the FAQ helper', async () => {
  const page = await read('src/routes/category.tsx');
  const adultToys = await read('src/routes/adultToys.tsx');
  const section = await read('src/components/CategoryGuideSection.tsx');
  for (const [name, source] of [['category page', page], ['adult-toys page', adultToys]]) {
    assert.match(source, /buildFaqPageSchema\(selectCategoryFaqs\(/, `${name} builds FAQPage from the shared selection`);
    assert.doesNotMatch(source, /locale === 'en' && content\?\.faqs/, `${name} no longer has the English-only inline FAQ block`);
    // The visible guide section reads the same row through ShopContext; without
    // this prop it falls back to the bundled English snapshot and drifts from
    // the schema (the Arabic adult-toys page did exactly that in 1.7.2).
    assert.match(source, /categoryEditorial=\{content\}/, `${name} passes the fetched editorial row to the page`);
  }
  assert.match(section, /selectCategoryFaqs\(/);
  assert.doesNotMatch(section, /!isArabic && editorial\?\.faqs\?\.length/);
});
