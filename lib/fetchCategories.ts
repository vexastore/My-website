import { unstable_cache } from 'next/cache';
import { displayCopy } from './displayCopy';

export type PublicCategory = {
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  seoTitleEn?: string;
  seoTitleAr?: string;
  seoDescriptionEn?: string;
  seoDescriptionAr?: string;
  updatedAt: string;
};

type Row = {
  slug: string; name_en: string; name_ar: string;
  description_en: string; description_ar: string;
  seo_title_en: string | null; seo_title_ar: string | null;
  seo_description_en: string | null; seo_description_ar: string | null;
  updated_at: string;
};

async function readCategories(): Promise<PublicCategory[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) throw new Error('Supabase storefront configuration is missing');
  const url = new URL(`${base}/rest/v1/categories`);
  url.searchParams.set('select', 'slug,name_en,name_ar,description_en,description_ar,seo_title_en,seo_title_ar,seo_description_en,seo_description_ar,updated_at');
  url.searchParams.set('is_active', 'eq.true');
  url.searchParams.set('limit', '1000');
  const response = await fetch(url, { headers: { apikey: key }, cache: 'no-store' });
  if (!response.ok) throw new Error(`Supabase category read failed: ${response.status}`);
  return ((await response.json()) as Row[]).map(row => ({
    slug: row.slug, nameEn: displayCopy(row.name_en), nameAr: displayCopy(row.name_ar),
    descriptionEn: displayCopy(row.description_en), descriptionAr: displayCopy(row.description_ar),
    seoTitleEn: row.seo_title_en?.trim() || undefined, seoTitleAr: row.seo_title_ar?.trim() || undefined,
    seoDescriptionEn: row.seo_description_en?.trim() || undefined, seoDescriptionAr: row.seo_description_ar?.trim() || undefined,
    updatedAt: row.updated_at,
  }));
}

export const fetchCategoriesServer = unstable_cache(readCategories, ['supabase-categories-seo-v1'], {
  revalidate: 300, tags: ['vexa-categories'],
});
