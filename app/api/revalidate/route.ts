import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// On-demand ISR revalidation — clears cached pages so next request rebuilds with fresh data.
// GET  /api/revalidate?path=/male-toys/some-slug&secret=vexa-reval-2026
// GET  /api/revalidate?tag=vexa-images&secret=vexa-reval-2026
// POST /api/revalidate?secret=vexa-reval-2026  Body: { categorySlug, slug, oldCategorySlug }
const SECRET = 'vexa-reval-2026';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const path = searchParams.get('path');
  const tag = searchParams.get('tag');

  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag });
  }
  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  }
  return NextResponse.json({ error: 'Missing path or tag' }, { status: 400 });
}

// POST — bulk revalidation triggered automatically after every admin add/update/delete
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

  // Invalidate server-side data caches
  revalidateTag('vexa-images');
  revalidateTag('vexa-products-live-v6');

  // Revalidate global layout + sitemap
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');

  // Revalidate specific product + category pages
  if (body.categorySlug) {
    revalidatePath(`/${body.categorySlug}`);
    if (body.slug) revalidatePath(`/${body.categorySlug}/${body.slug}`);
  }
  if (body.oldCategorySlug && body.oldCategorySlug !== body.categorySlug) {
    revalidatePath(`/${body.oldCategorySlug}`);
    if (body.slug) revalidatePath(`/${body.oldCategorySlug}/${body.slug}`);
  }

  return NextResponse.json({
    revalidated: true,
    tags: ['vexa-images', 'vexa-products-live-v6'],
    paths: ['/', '/sitemap.xml', body.categorySlug, `${body.categorySlug}/${body.slug}`].filter(Boolean),
  });
}
