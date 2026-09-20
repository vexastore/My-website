'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const QuizBanner: React.FC = () => {
  const { language } = useShop();
  const isArabic = language === 'ar';

  return (
    <section className="relative overflow-hidden bg-black py-10 sm:py-14 border-b border-white/10">
      {/* Full-bleed model photo */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/mockup/quiz-model.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        {/* Fade so the content area stays readable */}
        <div
          className={`absolute inset-0 ${
            isArabic
              ? 'bg-gradient-to-l from-black/10 via-black/75 to-black'
              : 'bg-gradient-to-r from-black/10 via-black/75 to-black'
          }`}
        />
      </div>

      {/* Right Neon Script */}
      <div
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 z-0 hidden lg:block ${
          isArabic ? 'left-6 sm:left-12' : 'right-6 sm:right-12'
        }`}
      >
        <img
          src="/images/mockup/quiz-neon.webp"
          alt="Your Pleasure Our Priority"
          className="w-44 sm:w-52 h-auto object-contain drop-shadow-[0_0_16px_rgba(255,45,120,0.6)]"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Center Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div
          className={`flex flex-col items-center sm:items-start text-center sm:text-start space-y-2.5 ${
            isArabic ? 'sm:pr-56 md:pr-72 lg:pr-80' : 'sm:pl-56 md:pl-72 lg:pl-80'
          }`}
        >
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isArabic ? 'لست متأكداً من أين تبدأ؟' : 'Not sure where to start?'}
          </h3>

          <p className="text-stone-300 text-xs sm:text-sm max-w-md leading-relaxed">
            {isArabic
              ? 'أجب عن ٣ أسئلة سريعة واحصل على توصية مخصصة تناسبك تماماً.'
              : 'Take our 3-question quiz and get a personalised recommendation.'}
          </p>

          <div className="pt-2">
            <a
              href="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-[#ff2d78] hover:bg-[#e11d48] text-white px-6 py-2.5 text-xs font-bold transition-all shadow-lg shadow-[#ff2d78]/30 cursor-pointer active:scale-95"
            >
              <span>{isArabic ? 'اكتشف منتجك المثالي' : 'Find My Product'}</span>
              {isArabic ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
