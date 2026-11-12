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
  const page = await read('app/[category]/page.tsx');
  const adultToys = await read('app/adult-toys/page.tsx');
  const section = await read('src/components/CategoryGuideSection.tsx');
  for (const [name, source] of [['category page', page], ['adult-toys page', adultToys]]) {
    assert.match(source, /buildFaqPageSchema\(selectCategoryFaqs\(/, `${name} builds FAQPage from the shared selection`);
    assert.doesNotMatch(source, /locale === 'en' && content\?\.faqs/, `${name} no longer has the English-only inline FAQ block`);
  }
  assert.match(section, /selectCategoryFaqs\(/);
  assert.doesNotMatch(section, /!isArabic && editorial\?\.faqs\?\.length/);
});
