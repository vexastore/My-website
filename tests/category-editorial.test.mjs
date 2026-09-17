import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCategoryEditorial } from '../src/utils/category-editorial.ts';

test('public editorial only renders valid FAQ pairs', () => {
  assert.deepEqual(parseCategoryEditorial({ guide: 'A guide', faqs: [
    { q: 'Question?', a: 'Answer.' }, { q: 'Bad' }, null,
  ] }), { guide: 'A guide', faqs: [{ q: 'Question?', a: 'Answer.' }] });
});

test('invalid editorial does not render as a guide', () => {
  assert.equal(parseCategoryEditorial({ guide: 4, faqs: [] }), null);
  assert.equal(parseCategoryEditorial({ guide: 'Text', faqs: {} }), null);
});
