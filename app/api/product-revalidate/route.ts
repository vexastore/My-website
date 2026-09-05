import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const SECRET = 'vexa-reval-2026';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as {
    categorySlug?: string;
    slug?: string;
    oldCategorySlug?: string;
  };

  revalidateTag('vexa-images');
  revalidateTag('vexa-products');
  revalidateTag('vexa-products-live-v8');
  revalidateTag('vexa-products-live-v7');
  revalidateTag('vexa-products-live-v6');
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');

  if (body.categorySlug) {
    revalidatePath('/' + body.categorySlug);
    if (body.slug) revalidatePath('/' + body.categorySlug + '/' + body.slug);
  }
  if (body.oldCategorySlug && body.oldCategorySlug !== body.categorySlug) {
    revalidatePath('/' + body.oldCategorySlug);
    if (body.slug) revalidatePath('/' + body.oldCategorySlug + '/' + body.slug);
  }

  return NextResponse.json({ revalidated: true });
}
