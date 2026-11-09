'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { Banknote, Lock, MessageCircle, Truck } from 'lucide-react';

/**
 * Shopping assurances. Every line here must match the delivery, returns and
 * privacy policy pages; no ratings, counts or awards we cannot prove.
 */
const ITEMS = [
  {
    icon: Lock,
    en: { title: 'Discreet packaging', body: 'Every order ships in a plain, sealed box with no logo, store name or hint of the contents.' },
    ar: { title: 'تغليف سري', body: 'يصل كل طلب في كرتون عادي مغلق بدون شعار أو اسم المتجر أو أي إشارة إلى المحتوى.' },
    href: '/privacy',
  },
  {
    icon: Truck,
    en: { title: 'Delivery across Lebanon', body: 'Same-day delivery in Beirut and 24 to 72 hours to the rest of Lebanon, confirmed when you order.' },
    ar: { title: 'توصيل إلى كل لبنان', body: 'توصيل في نفس اليوم داخل بيروت وخلال 24 إلى 72 ساعة إلى باقي المناطق، ويتم تأكيده عند الطلب.' },
    href: '/delivery',
  },
  {
    icon: Banknote,
    en: { title: 'Cash on delivery', body: 'Pay in USD or LBP when your sealed package arrives. No online payment is required.' },
    ar: { title: 'الدفع عند الاستلام', body: 'ادفع بالدولار أو الليرة عند وصول طردك المغلق. لا حاجة لأي دفع إلكتروني.' },
    href: '/delivery',
  },
  {
    icon: MessageCircle,
    en: { title: 'Private WhatsApp support', body: 'Ask about a product, an order or a return in confidence before or after you buy.' },
    ar: { title: 'دعم خاص عبر واتساب', body: 'اسأل عن منتج أو طلب أو استرجاع بسرية تامة قبل الشراء أو بعده.' },
    href: 'https://wa.me/96176730767',
  },
];

export const AssuranceSection: React.FC = () => {
  const { language } = useShop();
  const isArabic = language === 'ar';

  return (
    <section className="vexa-section border-b border-white/10 bg-vexa-ink">
      <div className="vexa-container">
        <div className="mb-8 max-w-2xl">
          <p className="vexa-eyebrow">{isArabic ? 'لماذا فيكسا' : 'Why Vexa Toys'}</p>
          <h2 className="vexa-h2 mt-2">{isArabic ? 'تسوّق بخصوصية وراحة بال' : 'Shop privately, with no surprises'}</h2>
          <div className="vexa-h2-bar" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(item => {
            const Icon = item.icon;
            const copy = isArabic ? item.ar : item.en;
            const external = item.href.startsWith('http');
            return (
              <a
                key={item.href + copy.title}
                href={item.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="vexa-card vexa-card-interactive group flex flex-col gap-3 p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-vexa-raised text-vexa-pink">
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-wide text-white">{copy.title}</h3>
                <p className="text-xs leading-6 text-stone-400">{copy.body}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
