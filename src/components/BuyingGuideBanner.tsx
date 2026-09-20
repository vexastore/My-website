'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Package, Truck, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface BuyingGuideBannerProps {
  onReadGuide?: () => void;
}

export const BuyingGuideBanner: React.FC<BuyingGuideBannerProps> = ({ onReadGuide }) => {
  const { language } = useShop();
  const isArabic = language === 'ar';

  const TRUST_ITEMS = [
    {
      icon: <ShieldCheck size={22} className="text-[#ff2d78] shrink-0" strokeWidth={1.5} />,
      titleEn: 'Safe & Body-Safe Materials',
      titleAr: 'مواد آمنة وطبية للجسم',
    },
    {
      icon: <Package size={22} className="text-[#ff2d78] shrink-0" strokeWidth={1.5} />,
      titleEn: 'Discreet Packaging',
      titleAr: 'تغليف سري ومحكم بدون أي علامات',
    },
    {
      icon: <Truck size={22} className="text-[#ff2d78] shrink-0" strokeWidth={1.5} />,
      titleEn: 'Fast Delivery Across Lebanon',
      titleAr: 'توصيل سريع لجميع مناطق لبنان',
    },
    {
      icon: <Lock size={22} className="text-[#ff2d78] shrink-0" strokeWidth={1.5} />,
      titleEn: 'Cash on Delivery & Card Payment',
      titleAr: 'دفع عند الاستلام أو بالبطاقة',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-black py-12 sm:py-16 border-b border-white/10">
      {/* Seamless full-bleed background photo with radial fade at the edges */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/mockup/guide-bg-center.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-60"
          decoding="async"
        />
        {/* Dark radial vignette so left and right text columns remain readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_80%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Guide Text & CTA */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isArabic ? 'دليل شراء المنتجات الزوجية' : 'Sex Toys Buying Guide'}
              </h2>
              <div className="w-12 h-1 bg-[#ff2d78] rounded-full mt-2" />
            </div>

            <p className="text-sm font-bold text-stone-200">
              {isArabic ? 'دليلك لاختيار المنتج الأنسب لك' : 'Your guide to choosing the right sex toy'}
            </p>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-md">
              {isArabic
                ? 'من المواد الآمنة للجسم والنظافة إلى الاستخدام السليم، يساعدك دليلنا على اتخاذ الخيار الأمثل والتمتع بتجربة مريحة وممتعة بأعلى درجات الخصوصية.'
                : 'From materials and safety to cleaning and care, our buying guide helps you make the best choice. Learn how to pick the right toy, use it safely, and get the most out of your experience.'}
            </p>

            <div className="pt-3">
              <a
                href="/blog"
                onClick={onReadGuide}
                className="inline-flex items-center gap-2 rounded-full border border-[#ff2d78] bg-transparent px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#ff2d78] hover:text-white"
              >
                <span>{isArabic ? 'قراءة دليل الشراء' : 'Read the Buying Guide'}</span>
                {isArabic ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </a>
            </div>
          </div>

          {/* Center Spacer for ambient background */}
          <div className="hidden lg:block lg:col-span-3" />

          {/* Right Column: 4 Trust Badges */}
          <div className="lg:col-span-4 space-y-4">
            {TRUST_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 text-xs text-stone-200"
              >
                {item.icon}
                <span className="font-semibold text-stone-100">
                  {isArabic ? item.titleAr : item.titleEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
