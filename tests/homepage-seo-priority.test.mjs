import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage owns the broad Lebanon sex-toys and adult-toys query signals', async () => {
  const home = await read('app/page.tsx');

  assert.match(home, /Sex Toys Lebanon & Adult Toys Lebanon \| Vexa Toys/);
  assert.match(home, /Shop sex toys in Lebanon and adult toys in Lebanon at Vexa Toys/);
  assert.match(home, /seoHeading=\{isAr[\s\S]*Sex Toys Lebanon & Adult Toys Lebanon \| Vexa Toys/);
});

test('shared catalog hero receives a page-specific heading instead of a fixed H1', async () => {
  const hero = await read('src/components/HeroSection.tsx');
  const productList = await read('src/components/ProductList.tsx');

  assert.match(hero, /interface HeroSectionProps[\s\S]*heading\?: string/);
  assert.match(hero, /splitHeroHeading\(heading \|\| 'Sex Toys Lebanon & Adult Toys Lebanon'\)/);
  assert.doesNotMatch(hero, /isArabic \? 'منتجات زوجية' : 'SEX TOYS'/);
  assert.match(productList, /activeCategory[\s\S]*getCategoryTitle\(activeCategory/);
  assert.match(productList, /<HeroSection heading=\{pageHeading\} \/>/);
});

test('adult-toys has persistent crawlable navigation and homepage has descriptive self-link text', async () => {
  const navbar = await read('src/components/Navbar.tsx');
  const app = await read('src/App.tsx');

  assert.match(navbar, /href="\/adult-toys"[\s\S]*All Adult Toys/);
  assert.match(app, /slug: 'adult-toys'[\s\S]*en: 'Adult Toys Lebanon'/);
  assert.match(app, /href="\/"[\s\S]*Sex Toys & Adult Toys in Lebanon/);
});

test('category navigation performs a real Next route transition', async () => {
  const context = await read('src/context/ShopContext.tsx');

  assert.match(context, /import \{ useRouter \} from 'next\/navigation'/);
  assert.match(context, /router\.push\(catPath\);[\s\S]*return;/);
  assert.doesNotMatch(context, /window\.history\.pushState\(null, '', catPath\)/);
});

test('published category SEO copy is normalized to the current brand', async () => {
  const categories = await read('lib/fetchCategories.ts');

  assert.match(categories, /value\.replace\(\/Vexa Store\/gi, 'Vexa Toys'\)/);
  assert.match(categories, /seoTitleEn: categoryCopy\(row\.seo_title_en\)/);
  assert.match(categories, /seoDescriptionEn: categoryCopy\(row\.seo_description_en\)/);
});

test('about route keeps one primary page heading for sitemap-wide SEO validation', async () => {
  const about = await read('src/components/About.tsx');

  assert.match(about, /<h1 className="text-3xl/);
  assert.match(about, /<\/h1>/);
});
