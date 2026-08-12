import type { Product } from '@/src/types';
import { CATEGORY_META, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';

export const SITE_BASE_URL = 'https://vexatoys.com';

/**
 * Old product slugs that must never become canonical URLs again.
 * Keep this list aligned with the permanent redirects in vercel.json.
 */
export const SLUG_REMAPS: Record<string, string> = {
  'premium-anal-cleansing-douche-easy-comfortable-cleaning-310':
    'anal-cleansing-douche-easy-comfortable-cleaning',
};

export function toProductSlug(value: string): string {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function canonicalProductSlug(product: Product): string {
  const storedSlug = (product.slug || toProductSlug(product.nameEn || product.name || product.id))
    .replace(/-+$/, '');
  return SLUG_REMAPS[storedSlug] ?? storedSlug;
}

export function resolveProductCategorySlug(
  product: Pick<Product, 'categorySlug' | 'categories'>,
  fallback = 'sex-toys',
): string {
  const validSlugs = new Set(CATEGORY_META.map((category) => category.slug));
  const direct = product.categorySlug || '';

  if (direct && SLUG_TO_CATEGORY[direct]) return direct;

  const normalizedDirect = direct
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .trim();
  if (validSlugs.has(normalizedDirect)) return normalizedDirect;

  for (const category of product.categories || []) {
    const normalized = String(category)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/_/g, '-')
      .trim();
    if (validSlugs.has(normalized)) return normalized;
  }

  return fallback;
}

export function canonicalProductPath(product: Product): string {
  return `/${resolveProductCategorySlug(product)}/${canonicalProductSlug(product)}`;
}
