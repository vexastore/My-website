import type { Product } from '@/src/types';
import { CATEGORY_META, SLUG_TO_CATEGORY } from './categoryMeta.ts';

export const SITE_BASE_URL = 'https://vexatoys.com';

/**
 * Old product slugs that must never become canonical URLs again.
 * Keep this list aligned with the permanent redirects in vercel.json.
 */
export const SLUG_REMAPS: Record<string, string> = {
  'premium-anal-cleansing-douche-easy-comfortable-cleaning-310':
    'anal-cleansing-douche-easy-comfortable-cleaning',
  'premium-adjustable-strap-on-harness-with-interchangeable-rin':
    'premium-strap-on-harness-set-interchangeable-o-ring-system-f',
  'silicone-vibrating-cock-ring-comfortable-adjustable-cock-rin':
    'zoro-vibrating-cock-ring-delay-control-ring',
  'silicone-strap-on-dildo-in-lebanon-':
    'strap-on-harness-kit-with-silicone-dildo',
  'silicone-strap-on-dildo-in-lebanon':
    'strap-on-harness-kit-with-silicone-dildo',
  'silicone-strap-on-dildo':
    'strap-on-harness-kit-with-silicone-dildo',
  'penis-sleeve-reusable-silicone-extender-enhancer':
    'silicone-textured-enhancement-sleeve',
  'double-ended-flexible-silicone-intimate-wellness-toy-ultra-s':
    'beaded-dual-silicone-toy-lebanon',
  'silicone-anal-plug-lebanon-smooth-beaded-plug-set':
    '3-piece-anal-plug-set-s-m-l-anal-plugs-in-lebanon',
  'cock-ring-set-in-lebanon-4-piece-textured-silicone-enhanceme':
    'textured-silicone-couples-enhancement-sleeve-with-beaded-des',
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
  // A second published product reused the old redirected slug. Keep the
  // historical redirect, but give that distinct product its own canonical URL.
  if (storedSlug === 'premium-anal-cleansing-douche-easy-comfortable-cleaning-310') {
    return 'premium-anal-cleansing-douche-easy-comfortable-cleaning-310-ml';
  }
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

export function findProduct(
  products: Product[],
  rawSlug: string
): Product | undefined {
  const cleanRaw = (rawSlug || '').replace(/-+$/, '');
  const remappedSlug = SLUG_REMAPS[rawSlug] ?? SLUG_REMAPS[cleanRaw] ?? cleanRaw;
  const slug = remappedSlug.replace(/-+$/, '');

  return (
    products.find((product) => canonicalProductSlug(product) === slug) ||
    products.find((product) => product.id === slug) ||
    products.find((product) => toProductSlug(product.nameEn || product.name || '') === slug)
  );
}
