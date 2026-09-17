import { fetchProductsServer } from './fetchProducts';

export async function fetchImages(): Promise<Record<string, { image: string; images: string[] }>> {
  const products = await fetchProductsServer();
  return Object.fromEntries(products.map(product => [
    product.id, { image: product.image, images: product.images || [] },
  ]));
}
