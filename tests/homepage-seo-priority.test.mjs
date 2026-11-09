import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage targets "sex toys lebanon" with one title, description and hero heading', async () => {
  const home = await read('app/page.tsx');

  assert.match(home, /SEO_TITLE = 'Sex Toys Lebanon \| Discreet Adult Toys \| Vexa Toys'/);
  assert.match(home, /Shop sex toys in Lebanon at Vexa Toys\./);
  assert.match(home, /HERO_HEADING_EN = 'Sex Toys Lebanon \| Discreet Adult Toys'/);
  assert.match(home, /title: \{ absolute: title \}/);
  assert.match(home, /canonical: `\$\{SITE_URL\}\/`/);
  // The homepage ships lightweight cards, not the full catalog, and no appended SEO layer.
  assert.match(home, /allProducts\.map\(toCardProduct\)/);
  assert.doesNotMatch(home, /seoContent=/);
});

test('shared catalog hero splits a page-specific heading into two lines', async () => {
  const hero = await read('src/components/HeroSection.tsx');
  const productList = await read('src/components/ProductList.tsx');

  assert.match(hero, /interface HeroSectionProps[\s\S]*heading\?: string/);
  assert.match(hero, /splitHeroHeading\(heading \|\| 'Sex Toys Lebanon \| Discreet Adult Toys'\)/);
  assert.match(hero, /<h1[\s\S]*aria-label=\{\[heroHeading\.primary, heroHeading\.secondary\]/);
  assert.match(productList, /activeCategory[\s\S]*getCategoryTitle\(activeCategory/);
  assert.match(productList, /<HeroSection[\s\S]*?heading=\{pageHeading\}[\s\S]*?isHome=\{isHome\}[\s\S]*?\/>/);
});

test('adult-toys has persistent crawlable navigation and homepage has descriptive self-link text', async () => {
  const navbar = await read('src/components/Navbar.tsx');
  const footer = await read('src/components/SiteFooter.tsx');
  const app = await read('src/App.tsx');

  assert.match(navbar, /href="\/adult-toys"[\s\S]*All Adult Toys/);
  assert.match(footer, /slug: 'adult-toys'[\s\S]*en: 'Adult Toys Lebanon'/);
  assert.match(footer, /href="\/"[\s\S]*Sex Toys & Adult Toys in Lebanon/);
  // The storefront shell renders the shared footer, so every view and every SiteFrame page carries these links.
  assert.match(app, /<SiteFooter \/>/);
});

test('category navigation performs a real Next route transition', async () => {
  const context = await read('src/context/ShopContext.tsx');

  assert.match(context, /import \{ useRouter \} from 'next\/navigation'/);
  assert.match(context, /router\.push\(catPath\);[\s\S]*return;/);
  assert.doesNotMatch(context, /window\.history\.pushState\(null, '', catPath\)/);
});

test('published category SEO copy is normalized to the current brand', async () => {
  const categories = await read('lib/fetchCategories.ts');

  // Both the legacy "Vexa Store" brand and the lowercase "Vexa toys" casing are normalized.
  assert.match(categories, /value\.replace\(\/vexa\\s\+\(store\|toys\)\/gi, 'Vexa Toys'\)/);
  assert.match(categories, /seoTitleEn: categoryCopy\(row\.seo_title_en\)/);
  assert.match(categories, /seoDescriptionEn: categoryCopy\(row\.seo_description_en\)/);
});

test('about route keeps one primary page heading for sitemap-wide SEO validation', async () => {
  const about = await read('src/components/About.tsx');

  assert.match(about, /<h1 className="text-3xl/);
  assert.match(about, /<\/h1>/);
});
