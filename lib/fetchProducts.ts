import { STATIC_PRODUCTS } from './staticProducts';
import { Product } from '@/src/types';

// Returns static products — zero Firebase reads
export async function fetchProductsServer(): Promise<Product[]> {
  return STATIC_PRODUCTS as Product[];
}
