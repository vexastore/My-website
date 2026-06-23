import { MetadataRoute } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CATEGORY_META } from '@/lib/categoryMeta';

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

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchProductsServer();
    productPages = products
      .filter(p => p.slug && p.categorySlug)
      .map(p => ({
        url: `${BASE}/${p.categorySlug}/${p.slug}`,
        lastModified: TODAY,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch {
    // sitemap still works without products
  }

  return [...staticPages, ...productPages];
}
