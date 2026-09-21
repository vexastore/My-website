# Caching architecture and versioning

## Overview

The Vexa Toys storefront uses a dual-layer caching strategy:
1. **Server Cache**: Next.js `unstable_cache` caches database responses from Supabase (catalog products, categories, articles, and category editorial content) with a 5-minute (300-second) revalidation window and distinct cache tags.
2. **Client Cache**: Browser `localStorage` caches client-side state including Arabic product translations and shopping context.

All cache keys are centralized and versioned in `lib/cacheVersion.ts`.

---

## Centralized Cache Registry (`lib/cacheVersion.ts`)

Instead of hardcoded string literals scattered across data fetchers, all cache keys and tags derive from the centralized module:

```typescript
export const CACHE_VERSION = 'v1.5.4';

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
```

---

## Cached Entities & Fetchers

| Entity | Fetch Function | Key Constant | Tag | Revalidate TTL |
| --- | --- | --- | --- | --- |
| Published Products | `fetchProductsServer` in `lib/fetchProducts.ts` | `CACHE_KEYS.PRODUCTS` | `vexa-products` | 300s |
| Blog Articles | `fetchBlogPostsServer` in `lib/fetchArticles.ts` | `CACHE_KEYS.ARTICLES` | `vexa-articles` | 300s |
| Category SEO | `fetchCategoriesServer` in `lib/fetchCategories.ts` | `CACHE_KEYS.CATEGORIES` | `vexa-categories` | 300s |
| Category Editorial & FAQs | `fetchCategoryEditorial` in `lib/fetchCategoryEditorial.ts` | `CACHE_KEYS.CATEGORY_EDITORIAL` | `vexa-category-editorial` | 300s |
| Arabic Product Translations | `translateProducts` in `src/utils/translate.ts` | `CACHE_KEYS.AR_TRANSLATIONS` | N/A (Client localStorage) | Persistent |

---

## Invalidation & Version Bump Rule

### When to bump the cache version:
Whenever an agent or developer modifies:
1. Data fetching queries or Supabase endpoints (fields selected, filters, ordering).
2. Product, category, variant, or article mapping structures (`mapProduct`, `mapCategory`, etc.).
3. Static fallback products, categories, or editorial records.
4. Schema.org structured data generators relying on cached properties.
5. Translation schemas or algorithms.

### How to bump the cache:
1. Open `lib/cacheVersion.ts`.
2. Update `CACHE_VERSION` (e.g. `'v1.5.4'` $\to$ `'v1.5.5'`) or bump individual keys in `CACHE_KEYS`.
3. Run `npm run test` to verify `tests/cache-version.test.mjs`.
4. Document the cache bump in `CHANGELOG.md` and the current day's worklog.
