'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { productMatchesCategory } from '../data/categories';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Homepage category discovery. Every card is a real link to the category route
 * so crawlers can follow it; the click handler only upgrades it to a client
 * route transition for people.
 */
const CATEGORY_CARDS = [
  { id: 'Vibrators', slug: 'vibrators', en: 'Vibrators', ar: 'هزازات', hintEn: 'Bullet, wand, rabbit and G-spot', hintAr: 'نحيل، عصا، أرنب ونقطة G', image: '/images/mockup/cat-vibrators.webp' },
  { id: 'Dildos', slug: 'dildos', en: 'Dildos', ar: 'ديلدو', hintEn: 'Realistic styles in every size', hintAr: 'تصاميم واقعية بكل الأحجام', image: '/images/mockup/cat-dildos.webp' },
  { id: 'Male Toys', slug: 'male-toys', en: 'Male Toys', ar: 'ألعاب رجالية', hintEn: 'Strokers, rings and pumps', hintAr: 'أدوات، حلقات ومضخات', image: '/images/mockup/cat-maletoys.webp' },
  { id: 'Sex Toys', slug: 'sex-toys', en: 'Couples Toys', ar: 'ألعاب للأزواج', hintEn: 'Shared pleasure, all sex toys', hintAr: 'متعة مشتركة، كل الألعاب الزوجية', image: '/images/mockup/cat-couples.webp' },
  { id: 'Lingerie', slug: 'lingerie', en: 'Lingerie', ar: 'لانجري', hintEn: 'Lace, satin and bodysuits', hintAr: 'دانتيل، ساتان وبدلات', image: '/images/mockup/cat-lingerie.webp' },
  { id: 'Sex Dolls', slug: 'sex-dolls', en: 'Sex Dolls', ar: 'دمى جنسية', hintEn: 'Realistic torsos and dolls', hintAr: 'تورسو ودمى واقعية' },
  { id: 'BDSM', slug: 'bdsm', en: 'BDSM & Bondage', ar: 'BDSM والقيود', hintEn: 'Restraints, blindfolds and kits', hintAr: 'قيود، عصابات عين وأطقم' },
  { id: 'Sexual Enhancers', slug: 'sexual-enhancers', en: 'Sexual Enhancers', ar: 'معززات زوجية', hintEn: 'Delay sprays, gels and more', hintAr: 'بخاخات تأخير، جل وأكثر' },
] as const;

export const CategoryShowcase: React.FC = () => {
  const { language, products, setActiveCategory, localizeHref } = useShop();
  const isArabic = language === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  const imageFor = (card: (typeof CATEGORY_CARDS)[number]): string => {
    if ('image' in card && card.image) return card.image;
    // Fall back to the first real product photo in that category.
    const product = products.find(item => productMatchesCategory(item, card.id) && item.image && !item.image.startsWith('data:'));
    return product?.image || '';
  };

  return (
    <section id="shop-by-category" className="vexa-section scroll-mt-24 border-b border-white/10 bg-vexa-ink">
      <div className="vexa-container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="vexa-eyebrow">{isArabic ? 'ابدأ من هنا' : 'Start here'}</p>
            <h2 className="vexa-h2 mt-2">{isArabic ? 'تسوّق حسب الفئة' : 'Shop by Category'}</h2>
            <div className="vexa-h2-bar" />
          </div>
          <a
            href={localizeHref('/adult-toys')}
            className="group inline-flex items-center gap-1 text-xs font-bold text-stone-400 transition hover:text-white"
          >
            <span>{isArabic ? 'كل منتجات الكبار' : 'All adult toys'}</span>
            <ChevronIcon size={14} className={`transition-transform duration-200 ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORY_CARDS.map((card, index) => {
            const image = imageFor(card);
            const label = isArabic ? card.ar : card.en;
            return (
              <a
                key={card.slug}
                href={localizeHref(`/${card.slug}`)}
                onClick={event => {
                  event.preventDefault();
                  setActiveCategory(card.id);
                }}
                className="vexa-card vexa-card-interactive group flex flex-col overflow-hidden text-start"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-vexa-raised">
                  {image ? (
                    <img
                      src={image}
                      alt={isArabic ? `${label} في لبنان` : `${label} in Lebanon`}
                      width={640}
                      height={480}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={index < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-vexa-raised via-vexa-surface to-vexa-ink">
                      <span className="text-3xl font-black tracking-tight text-white/15">{label.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-vexa-surface via-transparent to-transparent opacity-70" />
                </div>

                <div className="flex flex-1 items-start justify-between gap-2 p-3.5 sm:p-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-white transition-colors group-hover:text-vexa-pink sm:text-base">{label}</h3>
                    <p className="mt-1 line-clamp-1 text-[11px] font-medium text-stone-400 sm:text-xs">{isArabic ? card.hintAr : card.hintEn}</p>
                  </div>
                  <ArrowIcon size={16} className={`mt-0.5 shrink-0 text-vexa-pink transition-transform duration-200 ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} aria-hidden="true" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
