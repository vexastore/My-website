'use client';
import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronRight } from 'lucide-react';
import { FAQ_DATA } from '../data/faq';

interface FaqAccordionProps {
  onViewAllFaqs?: () => void;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ onViewAllFaqs }) => {
  const { language } = useShop();
  const isArabic = language === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="bg-black py-10 sm:py-14 border-b border-white/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>

          <button
            type="button"
            onClick={onViewAllFaqs}
            className="group flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-white transition cursor-pointer"
          >
            <span>{isArabic ? 'عرض كل الأسئلة' : 'View All FAQs'}</span>
            <ChevronRight
              size={14}
              className={`transition-transform duration-200 ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
            />
          </button>
        </div>

        {/* Accordion Rows */}
        <div className="divide-y divide-white/10">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="flex w-full items-center justify-between gap-4 text-start group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-stone-100 group-hover:text-[#ff2d78] transition-colors leading-snug">
                    {isArabic ? item.qAr : item.q}
                  </span>
                  <span
                    className={`shrink-0 text-xl font-light text-stone-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-[#ff2d78]' : 'group-hover:text-white'
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-300 pr-8 animate-fade-in">
                    <p>{isArabic ? item.aAr : item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
