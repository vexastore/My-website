import { MetadataRoute } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CATEGORY_META } from '@/lib/categoryMeta';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blogPosts';
import {
  canonicalProductPath,
  canonicalProductSlug,
  resolveProductCategorySlug,
  SITE_BASE_URL,
} from '@/lib/productSeo';

const BASE = SITE_BASE_URL;
const TODAY = new Date().toISOString().slice(0, 10);

// Valid routed category slugs — only slugs in CATEGORY_META have real product pages.
// /adult-toys is a STANDALONE page (app/adult-toys/page.tsx) — not in CATEGORY_META
// to avoid duplicate id='Sex Toys' corruption. It IS added manually to staticPages below.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage — vexatoys.com/ is a real landing page (NOT a redirect on the canonical host).
    // Middleware only redirects non-canonical hosts (www, *.vercel.app) or root with query params.
    { url: `${BASE}`,                  lastModified: TODAY, changeFrequency: 'daily'   as const, priority: 1.0 },
    { url: `${BASE}/sex-toys`,         lastModified: TODAY, changeFrequency: 'daily'   as const, priority: 0.95 },
    // /adult-toys is a standalone page (NOT in CATEGORY_META to avoid duplicate-id corruption).
    // Adding it here manually so it still appears in the sitemap.
    { url: `${BASE}/adult-toys`,       lastModified: TODAY, changeFrequency: 'daily'   as const, priority: 0.95 },
    { url: `${BASE}/about`,            lastModified: '2026-07-01', changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE}/quiz`,             lastModified: '2026-07-01', changeFrequency: 'monthly' as const, priority: 0.5 },
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
    // Deduplicate by canonical URL — prevents the same product from appearing
    // twice (e.g. once via stored slug and once via name-derived slug),
    // which was causing "Duplicate, Google chose different canonical" in GSC.
    const seenUrls = new Set<string>();

    for (const p of products) {
      // Strip trailing hyphens first (legacy Firestore slugs ending with '-'),
      // then apply any explicit slug remaps so the sitemap never lists a URL
      // that returns 3XX (redirect) instead of 200.
      const slug = canonicalProductSlug(p);
      if (!slug) continue;

      // Resolve canonical categorySlug using the SAME logic as the product page
      // so the sitemap URL matches exactly what the product page renders at.
      // This prevents sitemap URLs from redirecting (which GSC flags as errors).
      const url = `${BASE}${canonicalProductPath(p)}`;
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
