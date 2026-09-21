/**
 * Centralized Cache Versioning Configuration
 *
 * ATTENTION ALL AGENTS & DEVELOPERS:
 * Whenever you make changes to:
 * 1. Data fetching queries or endpoints (Supabase, external APIs)
 * 2. Product, category, article, or editorial mapping/schema structures
 * 3. Static fallback products or categories
 * 4. Client-side cached state (translations, local caches)
 *
 * YOU MUST BUMP the CACHE_VERSION or specific key in CACHE_KEYS below!
 * Bumping this version guarantees that stale Next.js `unstable_cache` payloads
 * and client localStorage caches are immediately invalidated across deployments.
 */

export const CACHE_VERSION = 'v1.5.6';

export const CACHE_KEYS = {
  PRODUCTS: `supabase-products-${CACHE_VERSION}`,
  ARTICLES: `supabase-articles-${CACHE_VERSION}`,
  CATEGORIES: `supabase-categories-seo-${CACHE_VERSION}`,
  CATEGORY_EDITORIAL: `category-editorial-${CACHE_VERSION}`,
  AR_TRANSLATIONS: `vexa_ar_translations_${CACHE_VERSION}`,
} as const;

export const CACHE_TAGS = {
  PRODUCTS: 'vexa-products',
  ARTICLES: 'vexa-articles',
  CATEGORIES: 'vexa-categories',
  CATEGORY_EDITORIAL: 'vexa-category-editorial',
} as const;

/**
 * Generates a version-stamped cache key with a custom prefix.
 */
export function getCacheKey(prefix: string): string {
  return `${prefix}-${CACHE_VERSION}`;
}
