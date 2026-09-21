import { unstable_cache } from 'next/cache';
import { CACHE_KEYS, CACHE_TAGS } from './cacheVersion';
import { parseCategoryEditorial, type CategoryEditorial } from '@/src/utils/category-editorial';
import { displayCopy } from './displayCopy';
import { getCategoryEditorial } from '@/src/data/categoryEditorial';

async function fetchEditorial(slug: string): Promise<CategoryEditorial | null> {
  const fallback = getCategoryEditorial(slug);
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!base || !key) return fallback;
    const url = new URL(`${base}/rest/v1/category_editorial`);
    url.searchParams.set('select', 'guide,faqs');
    url.searchParams.set('slug', `eq.${slug}`);
    url.searchParams.set('limit', '1');
    const response = await fetch(url, { headers: { apikey: key }, cache: 'no-store' });
    if (!response.ok) return fallback;
    const rows = await response.json() as unknown[];
    const editorial = parseCategoryEditorial(rows[0]);
    if (!editorial) return fallback;
    return {
      guide: displayCopy(editorial.guide.replace(/Vexa Store/gi, 'Vexa Toys')),
      faqs: editorial.faqs.map(faq => ({
        q: displayCopy(faq.q.replace(/Vexa Store/gi, 'Vexa Toys')),
        a: displayCopy(faq.a.replace(/Vexa Store/gi, 'Vexa Toys')),
      })),
    };
  } catch {
    return fallback;
  }
}

export const fetchCategoryEditorial = unstable_cache(fetchEditorial, [CACHE_KEYS.CATEGORY_EDITORIAL], {
  revalidate: 300,
  tags: [CACHE_TAGS.CATEGORY_EDITORIAL],
});
