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
    const read = async (select: string) => {
      const url = new URL(`${base}/rest/v1/category_editorial`);
      url.searchParams.set('select', select);
      url.searchParams.set('slug', `eq.${slug}`);
      url.searchParams.set('limit', '1');
      return fetch(url, { headers: { apikey: key }, cache: 'no-store' });
    };
    // The Arabic columns arrive with the 1.7.2 migration; until it has run,
    // PostgREST rejects the select, so fall back to the English-only columns.
    let response = await read('guide,faqs,guide_ar,faqs_ar');
    if (response.status === 400) response = await read('guide,faqs');
    if (!response.ok) return fallback;
    const rows = await response.json() as unknown[];
    const editorial = parseCategoryEditorial(rows[0]);
    if (!editorial) return fallback;
    const clean = (text: string) => displayCopy(text.replace(/Vexa Store/gi, 'Vexa Toys'));
    const cleanFaqs = (faqs: CategoryEditorial['faqs']) => faqs.map(faq => ({ q: clean(faq.q), a: clean(faq.a) }));
    return {
      guide: clean(editorial.guide),
      faqs: cleanFaqs(editorial.faqs),
      guideAr: clean(editorial.guideAr || ''),
      faqsAr: cleanFaqs(editorial.faqsAr || []),
    };
  } catch {
    return fallback;
  }
}

export const fetchCategoryEditorial = unstable_cache(fetchEditorial, [CACHE_KEYS.CATEGORY_EDITORIAL], {
  revalidate: 300,
  tags: [CACHE_TAGS.CATEGORY_EDITORIAL],
});
