'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { language } = useShop();
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

        </div>
      </div>
    </section>
  );
};
