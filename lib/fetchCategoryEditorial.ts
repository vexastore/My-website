import { unstable_cache } from 'next/cache';
import { parseCategoryEditorial, type CategoryEditorial } from '@/src/utils/category-editorial';

async function fetchEditorial(slug: string): Promise<CategoryEditorial | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) throw new Error('Supabase storefront configuration is missing');
  const url = new URL(`${base}/rest/v1/category_editorial`);
  url.searchParams.set('select', 'guide,faqs');
  url.searchParams.set('slug', `eq.${slug}`);
  url.searchParams.set('limit', '1');
  const response = await fetch(url, { headers: { apikey: key }, cache: 'no-store' });
  if (!response.ok) throw new Error(`Category editorial read failed: ${response.status}`);
  const rows = await response.json() as unknown[];
  return parseCategoryEditorial(rows[0]);
}

export const fetchCategoryEditorial = unstable_cache(fetchEditorial, ['category-editorial-v1'], {
  revalidate: 300,
  tags: ['vexa-category-editorial'],
});
