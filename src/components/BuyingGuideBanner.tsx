'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Short buying guide: three practical tips, links to the real guides on the
 * blog, and the quiz as a helper. One section replaces the former separate
 * guide banner, quiz banner and "how to choose" block.
 */
const TIPS = [
  {
    number: '01',
    en: { title: 'Start with the category', body: 'Vibrators, dildos, male toys or couples toys each solve a different need. Pick the category first, then compare.' },
    ar: { title: 'ابدأ بالفئة المناسبة', body: 'الهزازات والديلدو والألعاب الرجالية وألعاب الأزواج تلبّي احتياجات مختلفة. اختر الفئة أولاً ثم قارن.' },
  },
  {
    number: '02',
    en: { title: 'Check materials and size', body: 'Look for body-safe silicone or ABS, and read the dimensions. Beginners usually prefer smaller, simpler designs.' },
    ar: { title: 'راجع المواد والحجم', body: 'ابحث عن السيليكون أو ABS الآمن للجسم واقرأ الأبعاد. يفضّل المبتدئون عادةً التصاميم الأصغر والأبسط.' },
  },
  {
    number: '03',
    en: { title: 'Plan for care', body: 'Use a water-based lubricant with silicone toys and follow the cleaning instructions so the product lasts.' },
    ar: { title: 'انتبه للعناية', body: 'استخدم مزلقاً مائياً مع ألعاب السيليكون واتبع تعليمات التنظيف ليدوم المنتج.' },
  },
];

const GUIDES = [
  { href: '/blog/guides/beginners-guide-adult-toys-couples-lebanon', en: "Beginner's guide for couples", ar: 'دليل المبتدئين للأزواج' },
  { href: '/blog/guides/vibrator-guide-lebanon', en: 'How to choose a vibrator', ar: 'كيف تختار الهزاز' },
  { href: '/blog/guides/dildos-lebanon-guide', en: 'Dildo types and materials', ar: 'أنواع الديلدو والمواد' },
  { href: '/blog/tips/sex-toy-cleaning-care', en: 'Cleaning and care', ar: 'التنظيف والعناية' },
];

export const BuyingGuideBanner: React.FC = () => {
  const { language, localizeHref } = useShop();
  const isArabic = language === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-vexa-ink">
      {/* Soft ambient photo so the section is not flat, kept far behind the text. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/mockup/guide-bg-center.webp"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-center opacity-25"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-vexa-ink)_75%)]" />
      </div>

      <div className="vexa-container vexa-section relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="vexa-eyebrow">{isArabic ? 'دليل الشراء' : 'Buying guide'}</p>
            <h2 className="vexa-h2 mt-2">{isArabic ? 'كيف تختار المنتج المناسب' : 'How to Choose the Right Sex Toy'}</h2>
            <div className="vexa-h2-bar" />
            <p className="vexa-lead mt-5 max-w-md">
              {isArabic
                ? 'المعلومات في صفحة المنتج أهم من الصورة. فكّر في طريقة الاستخدام والحجم والمواد وطريقة العناية قبل الطلب.'
                : 'The product details matter more than the photo. Think about how you will use it, the size, the materials and how it is cleaned before you order.'}
            </p>

            <ul className="mt-6 space-y-2">
              {GUIDES.map(guide => (
                <li key={guide.href}>
                  <a href={localizeHref(guide.href)} className="group inline-flex items-center gap-2 text-sm font-semibold text-stone-200 transition hover:text-vexa-pink">
                    <ArrowIcon size={14} className="text-vexa-pink" aria-hidden="true" />
                    {isArabic ? guide.ar : guide.en}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={localizeHref('/quiz')} className="vexa-btn-primary">
                {isArabic ? 'ساعدني في الاختيار' : 'Help me choose'}
              </a>
              <a href={localizeHref('/blog')} className="vexa-btn-secondary">
                {isArabic ? 'كل المقالات' : 'All guides'}
              </a>
            </div>
          </div>

          <div className="grid gap-4 lg:col-span-7 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {TIPS.map(tip => {
              const copy = isArabic ? tip.ar : tip.en;
              return (
                <article key={tip.number} className="vexa-card p-5">
                  <span className="text-xs font-black tracking-widest text-vexa-pink">{tip.number}</span>
                  <h3 className="mt-3 text-base font-bold text-white">{copy.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-stone-400">{copy.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
