'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, ArrowRight, Banknote, Lock, Truck } from 'lucide-react';
import { splitArabicHeroHeading, splitHeroHeading } from '../utils/heroHeading';

interface HeroSectionProps {
  /** Page heading, e.g. "Dildos in Lebanon | Vexa Toys" or "Sex Toys Lebanon | Discreet Adult Toys". */
  heading?: string;
  /** Homepage variant: intro copy, calls to action and reassurance chips. */
  isHome?: boolean;
  /** Category pages: one page-specific sentence under the H1. */
  intro?: string;
}

const HOME_COPY = {
  en: {
    eyebrow: 'Discreet adult store, Lebanon',
    intro:
      'Vexa Toys is an online adult store for Lebanon. Browse vibrators, dildos, couples toys, lingerie and more, compare details and prices, and order with discreet packaging, delivery across Lebanon and cash on delivery.',
    primaryCta: 'Shop sex toys',
    secondaryCta: 'Browse categories',
    chips: ['Plain, sealed packaging', 'Delivery across Lebanon', 'Cash on delivery'],
  },
  ar: {
    eyebrow: 'متجر سري للكبار في لبنان',
    intro:
      'فيكسا تويز متجر إلكتروني للمنتجات الزوجية في لبنان. تصفّح الهزازات والديلدو وألعاب الأزواج واللانجري وأكثر، قارن التفاصيل والأسعار، واطلب بتغليف سري وتوصيل إلى كل لبنان والدفع عند الاستلام.',
    primaryCta: 'تسوّق الألعاب الزوجية',
    secondaryCta: 'تصفّح الفئات',
    chips: ['تغليف عادي ومغلق', 'توصيل إلى كل لبنان', 'الدفع عند الاستلام'],
  },
};

const CHIP_ICONS = [Lock, Truck, Banknote];

export const HeroSection: React.FC<HeroSectionProps> = ({ heading, isHome = false, intro }) => {
  const { language } = useShop();
  const isArabic = language === 'ar';
  const copy = isArabic ? HOME_COPY.ar : HOME_COPY.en;
  const heroHeading = isArabic
    ? splitArabicHeroHeading(heading || 'ألعاب جنسية في لبنان | منتجات للكبار بسرية')
    : splitHeroHeading(heading || 'Sex Toys Lebanon | Discreet Adult Toys');
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-vexa-ink text-white">
      {/* Full-bleed background photo (decorative, so empty alt). It is the LCP element: eager + high priority. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/mockup/hero-bg-right.webp"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div
          className={`absolute inset-0 ${
            isArabic
              ? 'bg-gradient-to-l from-vexa-ink/20 via-vexa-ink/80 to-vexa-ink'
              : 'bg-gradient-to-r from-vexa-ink/20 via-vexa-ink/80 to-vexa-ink'
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-vexa-ink to-transparent" />
      </div>

      <div className={`vexa-container relative z-10 ${isHome ? 'py-16 sm:py-24 lg:py-28' : 'py-12 sm:py-16 lg:py-20'}`}>
        <div className="max-w-2xl space-y-6">
          {isHome && (
            <p className="vexa-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-vexa-pink" aria-hidden="true" />
              {copy.eyebrow}
            </p>
          )}

          {/*
            Two stacked lines, one heading. The accessible name is set explicitly
            so no whitespace text node is needed between the spans (a stray text
            node is easy to mismatch between server and client renders).
          */}
          <h1
            className="font-black uppercase leading-[1.02] tracking-tight text-4xl sm:text-5xl lg:text-6xl"
            aria-label={[heroHeading.primary, heroHeading.secondary].filter(Boolean).join(' ')}
          >
            <span className="block text-white">{heroHeading.primary}</span>
            {heroHeading.secondary ? (
              <span className="block text-vexa-pink">{heroHeading.secondary}</span>
            ) : null}
          </h1>

          <p className="vexa-lead max-w-xl">
            {isHome
              ? copy.intro
              : intro || (isArabic
                ? 'استكشف تشكيلة واسعة من المنتجات الفاخرة، بتغليف سري وتوصيل سريع في جميع أنحاء لبنان.'
                : 'Explore a wide selection of premium adult toys, with discreet packaging and fast delivery across Lebanon.')}
          </p>

          {!isHome && (
            <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs font-semibold text-stone-300" aria-label={isArabic ? 'مزايا التسوق' : 'Shopping assurances'}>
              {copy.chips.map((chip, index) => {
                const Icon = CHIP_ICONS[index];
                return (
                  <li key={chip} className="inline-flex items-center gap-2">
                    <Icon size={14} className="text-vexa-pink" aria-hidden="true" />
                    {chip}
                  </li>
                );
              })}
            </ul>
          )}

          {isHome && (
            <>
              <div className="flex flex-wrap gap-3 pt-1">
                <a href="/sex-toys" className="vexa-btn-primary">
                  {copy.primaryCta}
                  <ArrowIcon size={14} aria-hidden="true" />
                </a>
                <a href="#shop-by-category" className="vexa-btn-secondary">
                  {copy.secondaryCta}
                </a>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-xs font-semibold text-stone-300" aria-label={isArabic ? 'مزايا التسوق' : 'Shopping assurances'}>
                {copy.chips.map((chip, index) => {
                  const Icon = CHIP_ICONS[index];
                  return (
                    <li key={chip} className="inline-flex items-center gap-2">
                      <Icon size={14} className="text-vexa-pink" aria-hidden="true" />
                      {chip}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
