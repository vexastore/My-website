'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/** Policy and contact links in the same card language as the rest of the homepage. */
const LINKS = [
  { href: '/delivery', en: 'Delivery across Lebanon', ar: 'التوصيل في لبنان', enDetail: 'Areas, timing and how orders are processed', arDetail: 'المناطق والتوقيت وكيفية معالجة الطلبات' },
  { href: '/returns', en: 'Returns and exchanges', ar: 'الاسترجاع والاستبدال', enDetail: '7-day unopened returns and damaged-item reporting', arDetail: 'استرجاع خلال 7 أيام للمنتجات غير المفتوحة والإبلاغ عن التلف' },
  { href: '/privacy', en: 'Privacy policy', ar: 'سياسة الخصوصية', enDetail: 'How your details are handled and kept private', arDetail: 'كيف نتعامل مع بياناتك ونحافظ على خصوصيتها' },
  { href: '/about', en: 'About Vexa Toys', ar: 'عن متجر فيكسا', enDetail: 'The story behind the store', arDetail: 'قصة المتجر' },
];

export const ShoppingInfoSection: React.FC = () => {
  const { language } = useShop();
  const isArabic = language === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className="vexa-section bg-vexa-ink">
      <div className="vexa-container">
        <div className="mb-8 max-w-2xl">
          <p className="vexa-eyebrow">{isArabic ? 'شفافية كاملة' : 'Clear terms'}</p>
          <h2 className="vexa-h2 mt-2">{isArabic ? 'كل ما تحتاج معرفته قبل الطلب' : 'Everything you need to know before ordering'}</h2>
          <div className="vexa-h2-bar" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map(item => (
            <a key={item.href} href={item.href} className="vexa-card vexa-card-interactive group flex flex-col justify-between p-5">
              <div>
                <h3 className="font-bold text-white">{isArabic ? item.ar : item.en}</h3>
                <p className="mt-2 text-xs leading-6 text-stone-400">{isArabic ? item.arDetail : item.enDetail}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-vexa-pink">
                {isArabic ? 'عرض التفاصيل' : 'Read more'}
                <ArrowIcon size={14} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>

        <div className="vexa-card mt-6 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h3 className="text-lg font-bold text-white sm:text-xl">{isArabic ? 'تحتاج مساعدة في الاختيار؟' : 'Need help before you order?'}</h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-stone-300">
              {isArabic
                ? 'راسل متجر فيكسا عبر واتساب للسؤال عن منتج أو التوصيل قبل تأكيد طلبك.'
                : 'Message Vexa Toys on WhatsApp to ask about a product or delivery before placing your order.'}
            </p>
          </div>
          <a
            href="https://wa.me/96176730767"
            target="_blank"
            rel="noopener noreferrer"
            className="vexa-btn-primary shrink-0"
          >
            {isArabic ? 'تواصل عبر واتساب' : 'Ask on WhatsApp'}
          </a>
        </div>
      </div>
    </section>
  );
};
