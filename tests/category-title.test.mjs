import assert from 'node:assert/strict';
import test from 'node:test';
import { CATEGORIES, getCategoryTitle } from '../src/data/categories.ts';
import { CATEGORY_META } from '../lib/categoryMeta.ts';

test('getCategoryTitle returns dynamic category titles for English and Arabic', () => {
  assert.equal(getCategoryTitle('Vibrators', 'en'), 'Vibrators in Lebanon | Vexa Toys');
  assert.equal(getCategoryTitle('Vibrators', 'ar'), 'هزازات في لبنان | متجر فيكسا');

  assert.equal(getCategoryTitle('Dildos', 'en'), 'Dildos in Lebanon | Vexa Toys');
  assert.equal(getCategoryTitle('Dildos', 'ar'), 'ديلدو في لبنان | متجر فيكسا');

  assert.equal(getCategoryTitle('Male Toys', 'en'), 'Male Toys in Lebanon | Vexa Toys');
  assert.equal(getCategoryTitle('Male Toys', 'ar'), 'ألعاب رجالية في لبنان | متجر فيكسا');

  assert.equal(getCategoryTitle('Sex Toys', 'en'), 'Sex Toys in Lebanon | Vexa Toys');
  assert.equal(getCategoryTitle('Sex Toys', 'ar'), 'ألعاب جنسية في لبنان | متجر فيكسا');
});

test('no category title contains body safe collection or body-safe silicone in CATEGORIES', () => {
  for (const cat of CATEGORIES) {
    const enLower = cat.titlePage.en.toLowerCase();
    const arLower = cat.titlePage.ar.toLowerCase();

    assert.ok(
      !enLower.includes('body safe') && !enLower.includes('body-safe'),
      `Category ${cat.id} titlePage.en contains body safe: ${cat.titlePage.en}`
    );
    assert.ok(
      !arLower.includes('سيليكون آمن') && !arLower.includes('آمن للجسم'),
      `Category ${cat.id} titlePage.ar contains body safe phrase: ${cat.titlePage.ar}`
    );
  }
});

test('no category title in CATEGORY_META contains body-safe phrases', () => {
  for (const meta of CATEGORY_META) {
    const enLower = meta.titleEn.toLowerCase();
    const arLower = meta.titleAr.toLowerCase();

    assert.ok(
      !enLower.includes('body safe') && !enLower.includes('body-safe'),
      `CategoryMeta ${meta.id} titleEn contains body safe: ${meta.titleEn}`
    );
    assert.ok(
      !arLower.includes('سيليكون آمن') && !arLower.includes('آمن للجسم'),
      `CategoryMeta ${meta.id} titleAr contains body safe phrase: ${meta.titleAr}`
    );
  }
});

test('category title changes dynamically across multiple category selections', () => {
  const categoryIds = ['Vibrators', 'Dildos', 'Male Toys', 'Lingerie', 'BDSM', 'Lubricants'];
  const titlesEn = categoryIds.map(id => getCategoryTitle(id, 'en'));

  // All category titles must be unique and correspond to their category
  const uniqueTitles = new Set(titlesEn);
  assert.equal(uniqueTitles.size, categoryIds.length, 'Each category must produce a unique dynamic title');

  // Verify dynamic switching between categories
  assert.notEqual(getCategoryTitle('Vibrators', 'en'), getCategoryTitle('Dildos', 'en'));
  assert.equal(getCategoryTitle('Vibrators', 'en'), 'Vibrators in Lebanon | Vexa Toys');
  assert.equal(getCategoryTitle('Dildos', 'en'), 'Dildos in Lebanon | Vexa Toys');
});
