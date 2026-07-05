import { NextResponse } from 'next/server';
import { fetchProductsServer } from '@/lib/fetchProducts';

// This endpoint was referenced by the client (ShopContext) but never existed,
// so every visit to /about, /checkout, and /admin triggered a 404 → the client
// retried forever (every 5s), causing infinite loading + wasted resources.
// It now reuses the already-cached fetchProductsServer() (5 min cache),
// so this route does NOT hit Firestore on every request.
export async function GET() {
  try {
    const products = await fetchProductsServer();
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
