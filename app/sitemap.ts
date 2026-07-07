import { MetadataRoute } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CATEGORY_META } from '@/lib/categoryMeta';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blogPosts';

const BASE = 'https://vexatoys.com';
const TODAY = new Date().toISOString().slice(0, 10);

export const revalidate = 3600; // regenerate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/sex-toys`, lastModified: TODAY, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.6 },
    ...CATEGORY_META.filter(c => c.slug !== 'sex-toys').map(c => ({
      url: `${BASE}/${c.slug}`,
      lastModified: TODAY,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
  ];

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: TODAY, changeFrequency: 'weekly' as const, priority: 0.7 },
    ...BLOG_CATEGORIES.map(c => ({
      url: `${BASE}/blog/${c.slug}`,
      lastModified: TODAY,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    })),
    ...BLOG_POSTS.map(p => ({
      url: `${BASE}/blog/${p.categorySlug}/${p.slug}`,
      lastModified: p.updatedAt || p.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchProductsServer();
    const toSl = (n: string) => (n || '').toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
      .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60);

    productPages = products
      .filter(p => (p.slug || p.nameEn || p.name) && p.categorySlug)
      .map(p => ({
        url: `${BASE}/${p.categorySlug}/${p.slug || toSl(p.nameEn || p.name || p.id)}`,
        lastModified: TODAY,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch {
    // sitemap still works without products
  }

  return [...staticPages, ...blogPages, ...productPages];
}
