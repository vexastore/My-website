'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORY_TO_SLUG } from '@/lib/categoryMeta';
import { getCategoryEditorial } from '@/src/data/categoryEditorial';
import { RelatedCategories } from './RelatedCategories';

interface CategoryGuideSectionProps {
  onSelectCategory?: (category: string) => void;
  onViewAllCategories?: () => void;
}

export const CategoryGuideSection: React.FC<CategoryGuideSectionProps> = ({
  onSelectCategory,
  onViewAllCategories,
}) => {
  const { activeCategory, initialCategorySlug, language, setActiveCategory } = useShop();
  const isArabic = language === 'ar';

  const currentSlug = activeCategory
    ? (CATEGORY_TO_SLUG[activeCategory] || activeCategory.toLowerCase().replace(/\s+/g, '-'))
    : (initialCategorySlug || '');

  if (!currentSlug) return null;

  const editorial = getCategoryEditorial(currentSlug);
  if (!editorial) return null;

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      setActiveCategory(catId);
    }
  };

  return (
    <div className="bg-[#050101] text-white border-t border-white/10" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* ── Related Categories Pills for easy cross-category switching ── */}
      <RelatedCategories
        onSelectCategory={handleCategoryClick}
        onViewAllCategories={onViewAllCategories}
      />

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-14 space-y-10">
          {/* Buying Guide */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d78] mb-4">
              {isArabic ? 'دليل الشراء' : 'Buying Guide'}
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-stone-300 text-sm leading-[1.85] whitespace-pre-line">
                {editorial.guide}
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          {editorial.faqs.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d78] mb-4">
                {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </p>

              <div className="space-y-3">
                {editorial.faqs.map((faq, index) => (
                  <div
                    key={`${currentSlug}-faq-${index}`}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <p className="font-black text-white text-sm mb-2 leading-snug">
                      {faq.q}
                    </p>
                    <p className="text-stone-400 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz CTA Banner */}
          <div className="rounded-2xl border border-[#ff2d78]/20 bg-[#ff2d78]/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-black text-white mb-1">
                {isArabic ? 'لست متأكداً من أين تبدأ؟' : 'Not sure where to start?'}
              </p>
              <p className="text-stone-400 text-sm">
                {isArabic
                  ? 'أجب عن أسئلة الاختبار الـ 3 واحصل على توصية مخصصة لمنتجك.'
                  : 'Take our 3-question quiz and get a personalised recommendation.'}
              </p>
            </div>

            <a
              href="/quiz"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-stone-200 transition active:scale-[0.98]"
            >
              {isArabic ? 'ساعدني في اختيار المنتج ←' : 'Find my product →'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
