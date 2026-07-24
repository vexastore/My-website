import { MetadataRoute } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CATEGORY_META } from '@/lib/categoryMeta';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blogPosts';

const BASE = 'https://vexatoys.com';
const TODAY = new Date().toISOString().slice(0, 10);

// Only include products whose categorySlug is a real routed page.
// Products with unknown/empty categorySlug would produce broken or redirecting URLs.
const VALID_SLUGS = new Set(CATEGORY_META.map(c => c.slug));

function toCategorySlug(raw: string): string {
  return (raw || '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-').trim();
}

// Resolve the best valid categorySlug for a product.
// 1. Use p.categorySlug if it maps to a real page.
// 2. Otherwise, scan p.categories[] and pick the first one that maps to a real page.
// 3. Return undefined if no valid slug is found (product will be excluded).
function resolveValidCategorySlug(p: {
  categorySlug?: string;
  categories?: string[];
}): string | undefined {
  const primary = toCategorySlug(p.categorySlug || '');
  if (primary && VALID_SLUGS.has(primary)) return primary;

  for (const cat of p.categories || []) {
    const slug = toCategorySlug(cat);
    if (slug && VALID_SLUGS.has(slug)) return slug;
  }
  return undefined;
}

export const revalidate = 3600; // regenerate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/quiz`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE}/sex-toys`, lastModified: TODAY, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/about`,    lastModified: TODAY, changeFrequency: 'monthly', priority: 0.6 },
    ...CATEGORY_META.filter(c => c.slug !== 'sex-toys').map(c => ({
      url: `${BASE}/${c.slug}`,
      lastModified: TODAY,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
  ];

  // ── Blog pages ────────────────────────────────────────────────────────────
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

  // ── Dynamic product pages ─────────────────────────────────────────────────
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchProductsServer();
    const toSl = (n: string) => (n || '').toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
      .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60);

    // Deduplicate by canonical URL — prevents the same product from appearing
    // twice (e.g. once via stored slug and once via name-derived slug),
    // which was causing "Duplicate, Google chose different canonical" in GSC.
    const seenUrls = new Set<string>();

    for (const p of products) {
      const slug = p.slug || toSl(p.nameEn || p.name || p.id);
      if (!slug) continue;

      // Resolve a valid categorySlug — falls back to p.categories[] if
      // p.categorySlug itself is not a routed page (e.g. "New Arrivals" stored
      // as categorySlug but that resolves correctly via the categories array).
      const categorySlug = resolveValidCategorySlug(p);
      if (!categorySlug) continue;

      const url = `${BASE}/${categorySlug}/${slug}`;
      if (seenUrls.has(url)) continue;
      seenUrls.add(url);

      productPages.push({
        url,
        lastModified: TODAY,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }
  } catch {
    // sitemap still works without products
  }

  return [...staticPages, ...blogPages, ...productPages];
}
