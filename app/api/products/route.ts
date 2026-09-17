import { NextResponse } from 'next/server';
import { fetchProductsServer } from '@/lib/fetchProducts';

// Share the cached Supabase catalog with client-side navigation.
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
