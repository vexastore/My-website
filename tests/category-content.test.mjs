import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { CATEGORY_CONTENT, getCategoryContent } from '../src/data/categoryContent.ts';
import { CATEGORY_META } from '../lib/categoryMeta.ts';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const KNOWN_SLUGS = new Set([...CATEGORY_META.map(category => category.slug), 'adult-toys']);

test('every category route has structured Lebanon content in both languages', () => {
  for (const slug of KNOWN_SLUGS) {
    const content = getCategoryContent(slug);
    assert.ok(content, `${slug} has no category content`);
    for (const lang of ['en', 'ar']) {
      assert.ok(content.heroIntro[lang].length > 40, `${slug} ${lang} hero intro too short`);
      assert.equal(content.intro.length, 2, `${slug} needs two intro paragraphs`);
      for (const paragraph of content.intro) assert.ok(paragraph[lang].length > 80, `${slug} ${lang} intro paragraph too short`);
      assert.equal(content.sections.length, 3, `${slug} needs three sections`);
      for (const section of content.sections) {
        assert.ok(section.title[lang].length > 3);
        assert.ok(section.body[lang].length > 60, `${slug} ${lang} section "${section.title.en}" too short`);
      }
      assert.ok(content.faqs.length >= 3, `${slug} needs at least three FAQs`);
      for (const faq of content.faqs) {
        assert.ok(faq.q[lang].endsWith('?') || faq.q[lang].endsWith('؟'), `${slug} FAQ question must be a question: ${faq.q[lang]}`);
        assert.ok(faq.a[lang].length > 40);
      }
    }
    // English copy targets the local query without stuffing.
    const english = [content.heroIntro.en, ...content.intro.map(p => p.en)].join(' ');
    assert.match(english, /Lebanon/, `${slug} English intro must mention Lebanon`);
    const lebanonMentions = (english.match(/Lebanon/g) || []).length;
    assert.ok(lebanonMentions <= 6, `${slug} mentions Lebanon ${lebanonMentions} times in the intro, which reads as stuffing`);
  }
});

test('related categories and blog guides only point at routes that exist', async () => {
  const sitemapLive = [
    '/blog/guides/vibrator-guide-lebanon', '/blog/guides/dildos-lebanon-guide', '/blog/guides/male-sex-toys-lebanon-guide',
    '/blog/guides/sex-dolls-lebanon-guide', '/blog/guides/bdsm-beginners-guide', '/blog/guides/lingerie-guide-lebanon',
    '/blog/guides/beginners-guide-adult-toys-couples-lebanon', '/blog/guides/app-controlled-vs-remote-controlled-toys',
    '/blog/guides/rechargeable-vs-battery-vibrators', '/blog/guides/couples-gift-guide-lebanon-2026',
    '/blog/tips/lubricants-guide', '/blog/tips/sex-toy-cleaning-care', '/blog/tips/privacy-guide-buy-adult-toys-lebanon',
    '/blog/advice/sex-toy-delivery-lebanon', '/blog/advice/sex-toys-in-lebanon-faq',
    '/blog/advice/the-importance-of-water-based-lubes-and-silicone-care',
    '/blog/advice/how-to-choose-the-right-couples-toys-for-the-first-time',
  ];
  const liveGuides = new Set(sitemapLive);

  for (const [slug, content] of Object.entries(CATEGORY_CONTENT)) {
    assert.ok(KNOWN_SLUGS.has(slug), `${slug} is not a category route`);
    assert.ok(content.related.length >= 3, `${slug} should link at least three related categories`);
    for (const related of content.related) {
      assert.ok(KNOWN_SLUGS.has(related), `${slug} links unknown category ${related}`);
      assert.notEqual(related, slug, `${slug} links to itself`);
    }
    assert.ok(content.guides.length >= 3, `${slug} should link at least three blog guides`);
    for (const guideLink of content.guides) {
      assert.ok(liveGuides.has(guideLink.href), `${slug} links a blog post that is not live: ${guideLink.href}`);
    }
  }
});

test('category guide section renders the structured content, Supabase editorial and crawlable links', async () => {
  const section = await read('src/components/CategoryGuideSection.tsx');
  const productList = await read('src/components/ProductList.tsx');
  const categoryPage = await read('src/routes/category.tsx');

  assert.match(section, /getCategoryContent\(currentSlug\)/);
  assert.match(section, /categoryEditorial \?\? getCategoryEditorial\(currentSlug\)/);
  assert.match(section, /href=\{localizeHref\(`\/\$\{slug\}`\)\}/);
  assert.match(section, /<details/);
  assert.match(section, /in Lebanon: what to know/);
  assert.match(productList, /intro=\{categoryContent\?\.heroIntro/);
  assert.match(categoryPage, /categoryEditorial=\{content\}/);
});
