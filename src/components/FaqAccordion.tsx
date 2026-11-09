'use client';
import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MessageCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/faq';

/** Homepage FAQ. The same FAQ_DATA feeds the FAQPage structured data in app/page.tsx. */
export const FaqAccordion: React.FC = () => {
  const { language } = useShop();
  const isArabic = language === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="vexa-section border-b border-white/10 bg-vexa-ink">
      <div className="vexa-container">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="vexa-eyebrow">{isArabic ? 'قبل أن تطلب' : 'Before you order'}</p>
            <h2 className="vexa-h2 mt-2">{isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
            <div className="vexa-h2-bar" />
            <p className="vexa-lead mt-5">
              {isArabic
                ? 'لم تجد إجابتك؟ راسلنا على واتساب وسنرد بسرية تامة.'
                : 'Did not find your answer? Message us on WhatsApp and we will reply in confidence.'}
            </p>
            <a
              href="https://wa.me/96176730767"
              target="_blank"
              rel="noopener noreferrer"
              className="vexa-btn-secondary mt-6"
            >
              <MessageCircle size={14} aria-hidden="true" />
              {isArabic ? 'اسأل على واتساب' : 'Ask on WhatsApp'}
            </a>
          </div>

          <div className="vexa-card divide-y divide-white/10 px-5 sm:px-6 lg:col-span-8">
            {FAQ_DATA.map((item, idx) => {
              const isOpen = openIndex === idx;
              const panelId = `home-faq-${idx}`;
              return (
                <div key={idx} className="py-4 sm:py-5">
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-4 text-start"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="text-sm font-bold leading-snug text-stone-100 transition-colors group-hover:text-vexa-pink sm:text-base">
                      {isArabic ? item.qAr : item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-xl font-light text-stone-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-45 text-vexa-pink' : 'group-hover:text-white'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div id={panelId} hidden={!isOpen} className="mt-3 text-xs leading-relaxed text-stone-300 sm:text-sm">
                    <p>{isArabic ? item.aAr : item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
