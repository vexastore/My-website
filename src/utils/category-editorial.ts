export interface EditorialFaq {
  q: string;
  a: string;
}

/**
 * One `category_editorial` row as the storefront uses it.
 *
 * `guide`/`faqs` are the English fields that have always existed. `guideAr`/
 * `faqsAr` come from the `guide_ar`/`faqs_ar` columns added in 1.7.2; they are
 * optional so the bundled fallback (which predates them) still type-checks,
 * and empty means "not written yet, use the bilingual code content".
 */
export interface CategoryEditorial {
  guide: string;
  faqs: EditorialFaq[];
  guideAr?: string;
  faqsAr?: EditorialFaq[];
}

function validFaqs(value: unknown): EditorialFaq[] {
  if (!Array.isArray(value)) return [];
  return value.filter((faq): faq is EditorialFaq =>
    typeof faq === 'object' && faq !== null && typeof (faq as EditorialFaq).q === 'string' && typeof (faq as EditorialFaq).a === 'string'
  );
}

export function parseCategoryEditorial(value: unknown): CategoryEditorial | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as { guide?: unknown; faqs?: unknown; guide_ar?: unknown; faqs_ar?: unknown };
  if (typeof row.guide !== 'string' || !Array.isArray(row.faqs)) return null;
  return {
    guide: row.guide,
    faqs: validFaqs(row.faqs),
    guideAr: typeof row.guide_ar === 'string' ? row.guide_ar : '',
    faqsAr: validFaqs(row.faqs_ar),
  };
}

const ARABIC = /[؀-ۿ]/;

/**
 * The guide text to show for a language. Arabic pages show the Arabic guide
 * when the admin wrote one; otherwise the English guide is shown only when it
 * happens to be written in the page's script (some seeded guides mix both).
 */
export function editorialGuideFor(editorial: CategoryEditorial | null | undefined, locale: 'en' | 'ar'): string {
  if (!editorial) return '';
  if (locale === 'ar' && editorial.guideAr?.trim()) return editorial.guideAr;
  const guide = editorial.guide || '';
  return guide && ARABIC.test(guide) === (locale === 'ar') ? guide : '';
}
