import type { CategoryContent } from '../src/data/categoryContent';
import type { CategoryEditorial } from '../src/utils/category-editorial';

/**
 * One source of truth for the FAQs a category page shows and marks up.
 *
 * Google only accepts FAQPage structured data for questions that are visible
 * on the page, so the schema must be built from exactly the list the
 * CategoryGuideSection renders. Both import this helper.
 *
 * Selection rule: an admin-written editorial FAQ list wins when it exists for
 * the page language (`category_editorial.faqs` in English, `faqs_ar` in
 * Arabic); otherwise the bilingual code content in `src/data/categoryContent.ts`.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export type FaqLocale = 'en' | 'ar';

export function selectCategoryFaqs(
  locale: FaqLocale,
  editorial: Pick<CategoryEditorial, 'faqs' | 'faqsAr'> | null | undefined,
  content: Pick<CategoryContent, 'faqs'> | null | undefined,
): FaqItem[] {
  const written = locale === 'ar' ? editorial?.faqsAr : editorial?.faqs;
  if (written?.length) return written;
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
