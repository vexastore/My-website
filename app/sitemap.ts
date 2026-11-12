import type { MetadataRoute } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { fetchCategoriesServer } from '@/lib/fetchCategories';
import { fetchBlogPostsServer } from '@/lib/fetchArticles';
import { CATEGORY_META, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { BLOG_CATEGORIES } from '@/lib/blogPosts';
import { canonicalProductPath, SITE_BASE_URL as BASE } from '@/lib/productSeo';
import { isCategoryIndexable } from '@/lib/categoryIndexing';
import { localeAlternates } from '@/lib/localePath';
import { productMatchesCategory } from '@/src/data/categories';

export const revalidate = 300;

type Entry = MetadataRoute.Sitemap[number];

/**
 * One English and one Arabic entry for a localized page, each listing both
 * language URLs as hreflang alternates (Google reads them from the sitemap).
 */
function bilingual(path: string, lastModified?: string): Entry[] {
  const { en, ar } = localeAlternates(path);
  const languages = { en, ar, 'x-default': en };
  return [
    { url: en, lastModified, alternates: { languages } },
    { url: ar, lastModified, alternates: { languages } },
  ];
}

// Omit lastModified for authored pages without a trustworthy content timestamp.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, articles] = await Promise.all([
    fetchProductsServer(), fetchCategoriesServer(), fetchBlogPostsServer(),
  ]);
  const knownCategories = new Set(CATEGORY_META.map(category => category.slug));
  const knownBlogCategories = new Set(BLOG_CATEGORIES.map(category => category.slug));
  const latest = (dates: Array<string | undefined>) => dates.filter((date): date is string => !!date).sort().at(-1);
  const catalogUpdated = latest(products.map(product => product.updatedAt));

  const pages: MetadataRoute.Sitemap = [
    // Trailing slash: the homepage canonical is "https://vexatoys.com/", and Search
    // Console only links a sitemap entry to a page when the URLs match exactly.
    ...bilingual('/', catalogUpdated),
    ...bilingual('/adult-toys', catalogUpdated),
    ...bilingual('/about'),
    ...bilingual('/quiz'),
    ...bilingual('/terms'),
    ...bilingual('/privacy'),
    ...bilingual('/delivery'),
    ...bilingual('/warranty'),
    ...bilingual('/returns'),
    // Thin categories (see lib/categoryIndexing.ts) are noindex, so they stay out of the sitemap too.
    ...categories
      .filter(category => knownCategories.has(category.slug))
      .map(category => ({
        category,
        categoryProducts: products.filter(product => productMatchesCategory(product, SLUG_TO_CATEGORY[category.slug])),
      }))
      .filter(({ categoryProducts }) => isCategoryIndexable(categoryProducts.length))
      .flatMap(({ category, categoryProducts }) => bilingual(
        `/${category.slug}`,
        latest([category.updatedAt, ...categoryProducts.map(product => product.updatedAt)]),
      )),
    ...bilingual('/blog', latest(articles.map(article => article.updatedAt))),
    ...BLOG_CATEGORIES.filter(category => articles.some(article => article.categorySlug === category.slug)).flatMap(category => bilingual(
      `/blog/${category.slug}`,
      latest(articles.filter(article => article.categorySlug === category.slug).map(article => article.updatedAt)),
    )),
    // An article is listed in Arabic only when it has an Arabic body; otherwise
    // its Arabic URL canonicalizes to the English page and must not be listed.
    ...articles.filter(article => knownBlogCategories.has(article.categorySlug)).flatMap(article => {
      const path = `/blog/${article.categorySlug}/${article.slug}`;
      const lastModified = article.updatedAt || article.publishedAt;
      return article.contentAr?.trim() ? bilingual(path, lastModified) : [{ url: `${BASE}${path}`, lastModified }];
    }),
  ];

  const seen = new Set(pages.map(page => page.url));
  for (const product of products) {
    const canonical = product.canonicalUrlOverride || `${BASE}${canonicalProductPath(product)}`;
    if (seen.has(canonical)) continue;
    for (const entry of bilingual(canonical, product.updatedAt)) {
      if (seen.has(entry.url)) continue;
      seen.add(entry.url);
      pages.push(entry);
    }
  }
  return pages;
}
