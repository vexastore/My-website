import { STATIC_PRODUCTS } from './staticProducts';
import { Product } from '@/src/types';

// Returns all 76 products from static file — zero Firebase reads, zero limits.
// To update products: run the sync script then redeploy.
export async function fetchProductsServer(): Promise<Product[]> {
  return STATIC_PRODUCTS as Product[];
}
