import { MetadataRoute } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CATEGORY_META, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blogPosts';

const BASE = 'https://vexatoys.com';
const TODAY = new Date().toISOString().slice(0, 10);

// Valid routed category slugs — only slugs in CATEGORY_META have real product pages.
// /adult-toys is a STANDALONE page (app/adult-toys/page.tsx) — not in CATEGORY_META
// to avoid duplicate id='Sex Toys' corruption. It IS added manually to staticPages below.
const VALID_SLUGS = new Set(CATEGORY_META.map(c => c.slug));

function toCategorySlug(raw: string): string {
  return (raw || '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-').trim();
}

/**
 * Resolve the canonical categorySlug for a product — must stay 100% in sync
 * with the identical logic in app/[category]/[slug]/page.tsx so the sitemap
 * only ever generates URLs the product page will NOT redirect away from.
 *
 * Priority:
 * 1. p.categorySlug is directly in SLUG_TO_CATEGORY → use it as-is
 * 2. p.categorySlug normalises to a VALID_SLUG (e.g. "New Arrivals" → "new-arrivals")
 * 3. Scan p.categories[] for the first valid slug
 * 4. Return undefined → product excluded from sitemap
 *
 * NOTE: 'adult-toys' is intentionally NOT in SLUG_TO_CATEGORY (not in CATEGORY_META).
 * Products stored with categorySlug='adult-toys' in Firestore will fall through to
 * categories[] resolution — this is correct behaviour and prevents redirect errors.
 */
function resolveProductCanonicalCategorySlug(p: {
  categorySlug?: string;
  categories?: string[];
}): string | undefined {
  // Step 1: direct SLUG_TO_CATEGORY match (same as product page primary check)
  if (p.categorySlug && SLUG_TO_CATEGORY[p.categorySlug]) return p.categorySlug;

  // Step 2: normalise and check VALID_SLUGS
  const primary = toCategorySlug(p.categorySlug || '');
  if (primary && VALID_SLUGS.has(primary)) return primary;

  // Step 3: scan categories[]
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
    { url: BASE,                       lastModified: TODAY, changeFrequency: 'weekly'  as const, priority: 1.0 },
    { url: `${BASE}/sex-toys`,         lastModified: TODAY, changeFrequency: 'daily'   as const, priority: 1.0 },
    // /adult-toys is a standalone page (NOT in CATEGORY_META to avoid duplicate-id corruption).
    // Adding it here manually so it still appears in the sitemap.
    { url: `${BASE}/adult-toys`,       lastModified: TODAY, changeFrequency: 'daily'   as const, priority: 0.95 },
    { url: `${BASE}/about`,            lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE}/quiz`,             lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.5 },
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

      // Resolve canonical categorySlug using the SAME logic as the product page
      // so the sitemap URL matches exactly what the product page renders at.
      // This prevents sitemap URLs from redirecting (which GSC flags as errors).
      const categorySlug = resolveProductCanonicalCategorySlug(p);
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
