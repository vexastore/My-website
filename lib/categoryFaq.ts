import type { CategoryContent } from '../src/data/categoryContent';

/**
 * One source of truth for the FAQs a category page shows and marks up.
 *
 * Google only accepts FAQPage structured data for questions that are visible
 * on the page, so the schema must be built from exactly the list the
 * CategoryGuideSection renders. Both import this helper.
 *
 * Selection rule: an admin-written editorial FAQ list (Supabase
 * `category_editorial.faqs`, or its code fallback) wins in English; Arabic
 * always uses the bilingual code content, because editorial FAQs are English only.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export type FaqLocale = 'en' | 'ar';

export function selectCategoryFaqs(
  locale: FaqLocale,
  editorial: { faqs: FaqItem[] } | null | undefined,
  content: Pick<CategoryContent, 'faqs'> | null | undefined,
): FaqItem[] {
  if (locale !== 'ar' && editorial?.faqs?.length) return editorial.faqs;
  return (content?.faqs || []).map(faq => ({ q: faq.q[locale], a: faq.a[locale] }));
}

export function buildFaqPageSchema(faqs: FaqItem[]) {
  const items = faqs.filter(faq => faq.q.trim() && faq.a.trim());
  if (items.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q.trim(),
      acceptedAnswer: { '@type': 'Answer', text: a.trim() },
    })),
  };
}
