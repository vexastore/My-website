import { unstable_cache } from 'next/cache.js';
import { CACHE_KEYS, CACHE_TAGS } from './cacheVersion.ts';

export interface ProductReview {
  id: string;
  productId: string;
  orderId?: string | null;
  author: string;
  rating: number;
  title?: string | null;
  body: string;
  locale: string;
  verified: boolean;
  createdAt: string;
}

type ReviewRow = {
  id: string;
  product_id: string;
  order_id: string | null;
  customer_name: string;
  rating: number;
  title: string | null;
  body: string;
  locale: string;
  verified_purchase: boolean;
  created_at: string;
  status: string;
};

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase storefront configuration is missing');
  return { url, key };
}

/**
 * Fetches approved real customer reviews for a given product directly from Supabase.
 * Strictly filters by status=approved and excludes unmoderated or rejected submissions.
 */
export async function fetchApprovedProductReviews(productId: string): Promise<ProductReview[]> {
  if (!productId) return [];

  const { url, key } = config();
  const endpoint = new URL(`${url}/rest/v1/product_reviews`);
  endpoint.searchParams.set('select', 'id,product_id,order_id,customer_name,rating,title,body,locale,verified_purchase,created_at,status');
  endpoint.searchParams.set('product_id', `eq.${productId}`);
  endpoint.searchParams.set('status', 'eq.approved');
  endpoint.searchParams.set('order', 'created_at.desc');
  endpoint.searchParams.set('limit', '50');

  const response = await fetch(endpoint, {
    headers: { apikey: key },
    cache: 'no-store',
  });

  if (!response.ok) {
    // If table is newly created or query fails gracefully degrade to empty reviews
    return [];
  }

  const rows = (await response.json()) as ReviewRow[];
  return rows.map((row) => ({
    id: row.id,
    productId: row.product_id,
    orderId: row.order_id,
    author: row.customer_name,
    rating: Math.min(5, Math.max(1, row.rating)),
    title: row.title,
    body: row.body,
    locale: row.locale,
    verified: Boolean(row.verified_purchase),
    createdAt: row.created_at,
  }));
}

/**
 * Cached server fetch for approved product reviews, keyed by product ID and versioned cache tags.
 */
export async function fetchProductReviewsServer(productId: string): Promise<ProductReview[]> {
  if (!productId) return [];

  const getCached = unstable_cache(
    () => fetchApprovedProductReviews(productId),
    [CACHE_KEYS.REVIEWS, productId],
    {
      revalidate: 300,
      tags: [CACHE_TAGS.REVIEWS, `product-reviews-${productId}`],
    }
  );

  return getCached();
}

/**
 * Computes Schema.org AggregateRating strictly from real product rating and review count.
 * Returns null if there are no approved reviews. Never returns fabricated fallback ratings.
 */
export function getAggregateRating(product: { rating?: number | null; reviewsCount?: number | null }) {
  const rating = Number(product.rating ?? 0);
  const reviewsCount = Number(product.reviewsCount ?? 0);

  // Strictly return null if no real reviews or zero rating
  if (reviewsCount <= 0 || rating <= 0) {
    return null;
  }

  const cleanRating = Math.min(5, Math.max(1, rating));
  const cleanCount = Math.max(1, Math.round(reviewsCount));

  return {
    '@type': 'AggregateRating' as const,
    ratingValue: cleanRating % 1 === 0 ? cleanRating : Number(cleanRating.toFixed(1)),
    reviewCount: cleanCount,
    bestRating: 5,
    worstRating: 1,
  };
}
