import type { Product } from '@/src/types';

/** How many gallery images a product card needs (primary + hover image). */
const CARD_IMAGE_COUNT = 2;

function safeImage(src: string | undefined | null): string {
  return src && !src.startsWith('data:') ? src : '';
}

/**
 * Full product record for the client, minus inline base64 images.
 * Use this for the product that a product page is actually about.
 */
export function toClientProduct(product: Product): Product {
  return {
    ...product,
    image: safeImage(product.image),
    images: (product.images || []).filter(src => safeImage(src)),
  };
}

/**
 * Lightweight record for product cards.
 *
 * Long descriptions, SEO-only fields and secondary gallery images are dropped
 * so the server-rendered HTML stays small. The client refreshes the complete
 * catalog from /api/products right after hydration, so nothing a shopper can
 * see or do is lost; only the first paint ships less data.
 */
export function toCardProduct(product: Product): Product {
  const images = (product.images || []).filter(src => safeImage(src)).slice(0, CARD_IMAGE_COUNT);
  return {
    id: product.id,
    legacyId: product.legacyId,
    slug: product.slug,
    categorySlug: product.categorySlug,
    currency: product.currency,
    name: product.name,
    nameEn: product.nameEn,
    description: '',
    descriptionEn: '',
    price: product.price,
    image: safeImage(product.image) || images[0] || '',
    images,
    imageAltsEn: (product.imageAltsEn || []).slice(0, CARD_IMAGE_COUNT),
    imageAltsAr: (product.imageAltsAr || []).slice(0, CARD_IMAGE_COUNT),
    category: product.category,
    categories: product.categories,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    stock: product.stock,
    isNew: product.isNew,
    variants: product.variants,
  };
}
