'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onSelectCategory: (category: string) => void;
}

const HERO_PILLS = [
  { id: '', en: 'All', ar: 'الكل' },
  { id: 'Vibrators', en: 'Vibrators', ar: 'هزازات' },
  { id: 'Dildos', en: 'Dildos', ar: 'ديلدو' },
  { id: 'Male Toys', en: 'Male Toys', ar: 'ألعاب رجالية' },
  { id: 'Sex Toys', en: 'Couples', ar: 'ألعاب زوجية' },
  { id: 'Lingerie', en: 'Lingerie', ar: 'لانجري' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectCategory }) => {
  const { language, activeCategory } = useShop();
  const isArabic = language === 'ar';

  return (
    <section className="relative overflow-hidden bg-black text-white py-12 sm:py-16 lg:py-20 border-b border-white/10">
      {/* Full-bleed background photo */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/mockup/hero-bg-right.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {/* Gradient: opaque black on the text side, transparent on the photo side */}
        <div
          className={`absolute inset-0 ${
            isArabic
              ? 'bg-gradient-to-l from-black/10 via-black/70 to-black'
              : 'bg-gradient-to-r from-black/10 via-black/70 to-black'
          } sm:${isArabic ? 'bg-gradient-to-l' : 'bg-gradient-to-r'}`}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="max-w-2xl space-y-5 sm:space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#ff2d78]">
            <Sparkles size={14} className="text-[#ff2d78]" />
            <span>
              {isArabic ? 'صحة وعناية حميمية فاخرة' : 'PREMIUM INTIMATE WELLNESS'}
            </span>
          </div>

          {/* Giant Title matching mockup */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02]">
            <span className="block text-white">
              {isArabic ? 'منتجات زوجية' : 'SEX TOYS'}
            </span>
            <span className="block text-[#ff2d78]">
              {isArabic ? 'في لبنان' : 'IN LEBANON'}
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="max-w-xl text-stone-300 text-sm sm:text-base font-normal leading-relaxed">
            {isArabic
              ? 'استكشف تشكيلة واسعة من المنتجات الفاخرة، بتغليف سري وتوصيل سريع في جميع أنحاء لبنان.'
              : 'Explore a wide selection of premium adult toys, with discreet packaging and fast delivery across Lebanon.'}
          </p>

          {/* Horizontal Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2">
            {HERO_PILLS.map(pill => {
              const isActive = activeCategory === pill.id;
              return (
                <button
                  key={pill.id || 'all'}
                  type="button"
                  onClick={() => onSelectCategory(pill.id)}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#ff2d78] text-white shadow-lg shadow-[#ff2d78]/30 scale-105'
                      : 'border border-white/25 bg-black/60 text-stone-200 hover:border-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isArabic ? pill.ar : pill.en}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
