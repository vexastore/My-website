/**
 * A category page with fewer published products than this is treated as thin:
 * it stays reachable and crawlable, but is marked noindex and left out of the
 * sitemap until it has enough products to be worth ranking.
 */
export const MIN_INDEXABLE_CATEGORY_PRODUCTS = 3;

export function isCategoryIndexable(productCount: number): boolean {
  return productCount >= MIN_INDEXABLE_CATEGORY_PRODUCTS;
}
