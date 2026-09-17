import { NextResponse } from 'next/server';
import { fetchPublishedProducts } from '@/lib/fetchProducts';

// Client refreshes must read the latest published catalog, even while SEO pages
// retain their five-minute server cache.
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const products = await fetchPublishedProducts();
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
