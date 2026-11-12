import type { Product } from '@/src/types';
import { CATEGORY_META, SLUG_TO_CATEGORY } from './categoryMeta.ts';

export const SITE_BASE_URL = 'https://vexatoys.com';

/**
 * Old product slugs that must never become canonical URLs again.
 * Keep this list aligned with the permanent redirects in vercel.json.
 */
export const SLUG_REMAPS: Record<string, string> = {
  'dildos-silicone-custom-colors-in-lebanon':
    'silicone-dildo-custom-colors-lebanon',
  'beaded-dual-penetrator-vibrating-silicone-toy':
    'beaded-dual-silicone-toy-lebanon',
  'luxecurve-silicone-dildo-in-lebanon':
    'luxecurve-silicone-dildo',
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
  // Product name cleanup (1.7.1): the typo was in the URL too.
  'chasity-cage-in-lebanon':
    'metal-chastity-cage-3-ring-sizes',
  'remote-contro-dildo-wearable-prostate-massager-purple-silico':
    'remote-control-wearable-prostate-massager-purple-silicone',
  'silicone-anal-plug-lebanon-smooth-beaded-plug-set':
    '3-piece-anal-plug-set-s-m-l-anal-plugs-in-lebanon',
  'cock-ring-set-in-lebanon-4-piece-textured-silicone-enhanceme':
    'textured-silicone-couples-enhancement-sleeve-with-beaded-des',
};

const TITLE_MAX_LENGTH = 60;
const DESCRIPTION_MAX_LENGTH = 155;

/** Cut text at a word boundary so it fits in `max` characters. */
export function clampText(text: string, max: number): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max + 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : clean.slice(0, max);
  return cut.replace(/[\s,;:(–—-]+$/, '').replace(TRAILING_STOPWORD, '');
}

/** A clamp must not end on "with", "and", "for"... */
const TRAILING_STOPWORD = /\s+(?:with|and|for|in|of|the|a|an|to|by|or|&)$/i;

/**
 * Short, human title form of a product name: whitespace collapsed, a trailing
 * "in Lebanon" dropped (the brand suffix already carries the location), and
 * everything after the first dash, comma, bracket or pipe removed when the
 * head is still meaningful on its own.
 */
export function shortProductName(name: string): string {
  const dropLocation = (value: string) => value.replace(/\s+in\s+lebanon\s*$/i, '').trim();
  const clean = dropLocation((name || '').replace(/\s+/g, ' ').trim());
  const head = dropLocation(clean.split(/\s+[–—-]\s+|\s*\(|,\s|\s+\|\s+/)[0]);
  return head.length >= 12 ? head : clean;
}

/** `<short name> | <brand>` capped at 60 characters, with an optional middle segment. */
export function buildProductTitle(name: string, brand: string, disambiguator?: string): string {
  const short = shortProductName(name);
  const withMiddle = disambiguator ? `${short} | ${disambiguator} | ${brand}` : `${short} | ${brand}`;
  if (withMiddle.length <= TITLE_MAX_LENGTH) return withMiddle;
  const suffix = ` | ${brand}`;
  return `${clampText(short, TITLE_MAX_LENGTH - suffix.length)}${suffix}`;
}

function ensureSentence(text: string): string {
  return /[.!?؟]$/.test(text) ? text : `${text}.`;
}

/**
 * Meta description of at most 155 characters: a lead sentence, the first
 * sentence of the product copy trimmed to the remaining room, and a closing
 * delivery sentence. The lead and closing are always kept.
 */
export function buildProductDescription(lead: string, body: string, closing: string): string {
  const leadText = ensureSentence(clampText(lead, DESCRIPTION_MAX_LENGTH));
  const closingText = closing ? ensureSentence(clampText(closing, DESCRIPTION_MAX_LENGTH)) : '';
  const base = closingText ? `${leadText} ${closingText}` : leadText;
  const room = DESCRIPTION_MAX_LENGTH - base.length - 1;
  const firstSentence = (body || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?؟])\s+/)[0] || '';
  if (!firstSentence || room < 40) return clampText(base, DESCRIPTION_MAX_LENGTH);
  return `${leadText} ${ensureSentence(clampText(firstSentence, room))} ${closingText}`.trim();
}

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
