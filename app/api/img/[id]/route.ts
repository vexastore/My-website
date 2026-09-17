import { NextRequest, NextResponse } from 'next/server';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id.length > 120) return new NextResponse(null, { status: 404 });
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return new NextResponse(null, { status: 503 });
  try {
    const filter = uuid.test(id) ? `id=eq.${encodeURIComponent(id)}` : `legacy_id=eq.${encodeURIComponent(id)}`;
    const productResponse = await fetch(`${base}/rest/v1/products?${filter}&select=id&limit=1`, { headers: { apikey: key } });
    if (!productResponse.ok) throw new Error('Product read failed');
    const [product] = await productResponse.json() as { id: string }[];
    if (!product) return new NextResponse(null, { status: 404 });
    const mediaResponse = await fetch(`${base}/rest/v1/product_media?product_id=eq.${product.id}&is_active=eq.true&select=source_url,storage_path&order=is_primary.desc,position.asc&limit=1`, { headers: { apikey: key } });
    if (!mediaResponse.ok) throw new Error('Media read failed');
    const [media] = await mediaResponse.json() as { source_url: string | null; storage_path: string | null }[];
    const destination = media?.storage_path
      ? `${base}/storage/v1/object/public/store-media/${media.storage_path.split('/').map(encodeURIComponent).join('/')}`
      : media?.source_url;
    if (!destination?.startsWith('https://')) return new NextResponse(null, { status: 404 });
    return NextResponse.redirect(destination, { status: 307, headers: { 'Cache-Control': 'public, s-maxage=300' } });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
