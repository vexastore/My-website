'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORY_TO_SLUG, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { CATEGORIES } from '@/src/data/categories';
import { getCategoryEditorial } from '@/src/data/categoryEditorial';
import { getCategoryContent } from '@/src/data/categoryContent';
import { selectCategoryFaqs } from '@/lib/categoryFaq';
import { editorialGuideFor } from '@/src/utils/category-editorial';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';

interface CategoryGuideSectionProps {
  onSelectCategory?: (category: string) => void;
}

function categoryName(slug: string, isArabic: boolean): string {
  if (slug === 'adult-toys') return isArabic ? 'منتجات الكبار' : 'Adult Toys';
  const id = SLUG_TO_CATEGORY[slug];
  const def = CATEGORIES.find(category => category.id === id);
  if (def) return isArabic ? def.name.ar : def.name.en;
  return slug.replace(/-/g, ' ');
}

/**
 * Category editorial block rendered under the product grid on every category
 * route and on /adult-toys.
 *
 * Content sources, in order:
 * - Structured, Lebanon-targeted copy from src/data/categoryContent.ts
 *   (intro, three sections, related categories, blog guides, FAQs).
 * - The Supabase `category_editorial` row when the page passed one, else the
 *   code fallback: `guide`/`faqs` on English pages, `guide_ar`/`faqs_ar` on
 *   Arabic pages when the admin wrote them (otherwise the bilingual code FAQs).
 *   The guide is offered as a collapsible "full guide" so admin copy stays live.
 */
export const CategoryGuideSection: React.FC<CategoryGuideSectionProps> = ({ onSelectCategory }) => {
  const { activeCategory, initialCategorySlug, language, setActiveCategory, categoryEditorial, localizeHref } = useShop();
  const isArabic = language === 'ar';
  const lang = isArabic ? 'ar' : 'en';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const currentSlug = activeCategory
    ? (CATEGORY_TO_SLUG[activeCategory] || activeCategory.toLowerCase().replace(/\s+/g, '-'))
    : (initialCategorySlug || '');

  if (!currentSlug) return null;

  const content = getCategoryContent(currentSlug);
  const editorial = categoryEditorial ?? getCategoryEditorial(currentSlug);
  if (!content && !editorial) return null;

  const name = categoryName(currentSlug, isArabic);
  const editorialGuide = editorialGuideFor(editorial, lang);
  // Same selection as the server's FAQPage schema (lib/categoryFaq.ts), so markup and page never drift.
  const faqs = selectCategoryFaqs(lang, editorial, content);

  const goToCategory = (event: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (slug === 'adult-toys') return;
    const id = SLUG_TO_CATEGORY[slug];
    if (!id) return;
    event.preventDefault();
    if (onSelectCategory) onSelectCategory(id);
    else setActiveCategory(id);
  };

  return (
    <div className="bg-vexa-ink text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {content && (
        <section className="border-b border-white/10">
          <div className="vexa-container vexa-section">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="vexa-eyebrow">{isArabic ? 'دليل الشراء' : 'Buying guide'}</p>
                <h2 className="vexa-h2 mt-2">
                  {isArabic ? `${name} في لبنان: ما يجب معرفته` : `${name} in Lebanon: what to know`}
                </h2>
                <div className="vexa-h2-bar" />
                <div className="mt-5 space-y-4">
                  {content.intro.map((paragraph, index) => (
                    <p key={index} className="vexa-lead">{paragraph[lang]}</p>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:col-span-7">
                {content.sections.map((section, index) => (
                  <article key={index} className="vexa-card p-5 sm:p-6">
                    <h3 className="text-base font-bold text-white sm:text-lg">{section.title[lang]}</h3>
                    <p className="mt-2 text-sm leading-7 text-stone-300">{section.body[lang]}</p>
                    {index === content.sections.length - 1 && (
                      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
                        <a href={localizeHref('/delivery')} className="vexa-link">{isArabic ? 'سياسة التوصيل' : 'Delivery policy'}</a>
                        <a href={localizeHref('/returns')} className="vexa-link">{isArabic ? 'سياسة الاسترجاع' : 'Returns policy'}</a>
                        <a href={localizeHref('/privacy')} className="vexa-link">{isArabic ? 'سياسة الخصوصية' : 'Privacy policy'}</a>
                      </p>
                    )}
                  </article>
                ))}

                {editorialGuide && (
                  <details className="vexa-card group p-5 sm:p-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-white">
                      <span>{isArabic ? `المزيد عن شراء ${name} في لبنان` : `More about buying ${name.toLowerCase()} in Lebanon`}</span>
                      <span aria-hidden="true" className="text-xl font-light text-stone-400 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-300">{editorialGuide}</p>
                  </details>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {content && content.related.length > 0 && (
        <section className="border-b border-white/10">
          <div className="vexa-container py-10 sm:py-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="vexa-eyebrow">{isArabic ? 'تابع التصفح' : 'Keep browsing'}</p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
                  {isArabic ? 'فئات ذات صلة' : 'Related categories'}
                </h2>
              </div>
              <a href={localizeHref('/adult-toys')} className="group hidden items-center gap-1 text-xs font-bold text-stone-400 transition hover:text-white sm:inline-flex">
                {isArabic ? 'كل منتجات الكبار' : 'All adult toys'}
                <ArrowIcon size={14} className={`transition-transform ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {content.related.map(slug => (
                <a
                  key={slug}
                  href={localizeHref(`/${slug}`)}
                  onClick={event => goToCategory(event, slug)}
                  className="vexa-card vexa-card-interactive group flex items-center justify-between gap-2 px-4 py-3.5"
                >
                  <span className="text-sm font-bold text-white">
                    {isArabic ? `${categoryName(slug, true)} في لبنان` : `${categoryName(slug, false)} in Lebanon`}
                  </span>
                  <ArrowIcon size={14} className={`shrink-0 text-vexa-pink transition-transform ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-white/10">
        <div className="vexa-container vexa-section">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="vexa-eyebrow">{isArabic ? 'قبل أن تطلب' : 'Before you order'}</p>
              <h2 className="vexa-h2 mt-2">{isArabic ? 'الأسئلة الشائعة' : 'Frequently asked questions'}</h2>
              <div className="vexa-h2-bar" />

              {content && content.guides.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">
                    {isArabic ? 'أدلة من المدونة' : 'Guides from the blog'}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {content.guides.map(guideLink => (
                      <li key={guideLink.href}>
                        <a href={localizeHref(guideLink.href)} className="group inline-flex items-center gap-2 text-sm font-semibold text-stone-200 transition hover:text-vexa-pink">
                          <ArrowIcon size={14} className="text-vexa-pink" aria-hidden="true" />
                          {guideLink[lang]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={localizeHref('/quiz')} className="vexa-btn-primary">
                  {isArabic ? 'ساعدني في الاختيار' : 'Help me choose'}
                </a>
                <a href="https://wa.me/96176730767" target="_blank" rel="noopener noreferrer" className="vexa-btn-secondary">
                  <MessageCircle size={14} aria-hidden="true" />
                  {isArabic ? 'اسأل على واتساب' : 'Ask on WhatsApp'}
                </a>
              </div>
            </div>

            {faqs.length > 0 && (
              <div className="vexa-card divide-y divide-white/10 px-5 sm:px-6 lg:col-span-8">
                {faqs.map((faq, index) => (
                  <details key={`${currentSlug}-faq-${index}`} className="group py-4 sm:py-5" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-start text-sm font-bold leading-snug text-stone-100 transition-colors hover:text-vexa-pink sm:text-base">
                      <span>{faq.q}</span>
                      <span aria-hidden="true" className="shrink-0 text-xl font-light text-stone-400 transition-transform group-open:rotate-45 group-open:text-vexa-pink">+</span>
                    </summary>
                    <p className="mt-3 text-xs leading-relaxed text-stone-300 sm:text-sm">{faq.a}</p>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
