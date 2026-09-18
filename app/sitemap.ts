import type { MetadataRoute } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { fetchCategoriesServer } from '@/lib/fetchCategories';
import { fetchBlogPostsServer } from '@/lib/fetchArticles';
import { CATEGORY_META, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { BLOG_CATEGORIES } from '@/lib/blogPosts';
import { canonicalProductPath, SITE_BASE_URL as BASE } from '@/lib/productSeo';

export const revalidate = 300;

// Omit lastModified for authored pages without a trustworthy content timestamp.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, articles] = await Promise.all([
    fetchProductsServer(), fetchCategoriesServer(), fetchBlogPostsServer(),
  ]);
  const knownCategories = new Set(CATEGORY_META.map(category => category.slug));
  const knownBlogCategories = new Set(BLOG_CATEGORIES.map(category => category.slug));
  const latest = (dates: Array<string | undefined>) => dates.filter((date): date is string => !!date).sort().at(-1);

  const pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: latest(products.map(product => product.updatedAt)) },
    { url: `${BASE}/adult-toys`, lastModified: latest(products.map(product => product.updatedAt)) },
    { url: `${BASE}/about` },
    { url: `${BASE}/quiz` },
    ...categories.filter(category => knownCategories.has(category.slug)).map(category => ({
      url: `${BASE}/${category.slug}`,
      lastModified: latest([category.updatedAt, ...products.filter(product =>
        product.categorySlug === category.slug || product.categories?.some(name => name === SLUG_TO_CATEGORY[category.slug])
      ).map(product => product.updatedAt)]),
    })),
    { url: `${BASE}/blog`, lastModified: latest(articles.map(article => article.updatedAt)) },
    ...BLOG_CATEGORIES.filter(category => articles.some(article => article.categorySlug === category.slug)).map(category => ({
      url: `${BASE}/blog/${category.slug}`,
      lastModified: latest(articles.filter(article => article.categorySlug === category.slug).map(article => article.updatedAt)),
    })),
    ...articles.filter(article => knownBlogCategories.has(article.categorySlug)).map(article => ({
      url: `${BASE}/blog/${article.categorySlug}/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt,
    })),
  ];

  const seen = new Set(pages.map(page => page.url));
  for (const product of products) {
    const url = `${BASE}${canonicalProductPath(product)}`;
    if (seen.has(url)) continue;
    seen.add(url);
    pages.push({ url, lastModified: product.updatedAt });
  }
  return pages;
}
