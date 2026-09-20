'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronRight } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory: (category: string) => void;
  onViewAllCategories?: () => void;
}

const CATEGORY_CARDS = [
  {
    id: 'Vibrators',
    titleEn: 'Vibrators',
    titleAr: 'هزازات',
    subtitleEn: 'Feel the difference',
    subtitleAr: 'اشعر بالفرق والمتعة',
    image: '/images/mockup/cat-vibrators.webp',
  },
  {
    id: 'Dildos',
    titleEn: 'Dildos',
    titleAr: 'ديلدو',
    subtitleEn: 'Realistic & Powerful',
    subtitleAr: 'واقعي وقوي وآمن',
    image: '/images/mockup/cat-dildos.webp',
  },
  {
    id: 'Male Toys',
    titleEn: 'Male Toys',
    titleAr: 'ألعاب رجالية',
    subtitleEn: 'For his pleasure',
    subtitleAr: 'لمتعة استثنائية للرجال',
    image: '/images/mockup/cat-maletoys.webp',
  },
  {
    id: 'Sex Toys',
    titleEn: 'Couples Toys',
    titleAr: 'ألعاب للأزواج',
    subtitleEn: 'Share the pleasure',
    subtitleAr: 'شارك المتعة مع الشريك',
    image: '/images/mockup/cat-couples.webp',
  },
  {
    id: 'Lingerie',
    titleEn: 'Lingerie',
    titleAr: 'لانجري',
    subtitleEn: 'Feel confident',
    subtitleAr: 'إطلالة جذابة وواثقة',
    image: '/images/mockup/cat-lingerie.webp',
  },
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  onSelectCategory,
  onViewAllCategories,
}) => {
  const { language } = useShop();
  const isArabic = language === 'ar';

  return (
    <section id="shop-by-category" className="bg-black py-10 sm:py-14 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isArabic ? 'تسوق حسب الفئة' : 'Shop by Category'}
            </h2>
            {/* Hot pink underline bar */}
            <div className="w-12 h-1 bg-[#ff2d78] rounded-full mt-2" />
          </div>

          <button
            type="button"
            onClick={onViewAllCategories}
            className="group flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-white transition cursor-pointer"
          >
            <span>{isArabic ? 'عرض جميع الفئات' : 'View All Categories'}</span>
            <ChevronRight
              size={14}
              className={`transition-transform duration-200 ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
            />
          </button>
        </div>

        {/* 5 Column Grid matching mockup */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {CATEGORY_CARDS.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="group flex flex-col text-start rounded-2xl border border-white/10 bg-[#0e0e0e] hover:border-white/25 hover:bg-[#141414] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#ff2d78]/5 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
                <img
                  src={cat.image}
                  alt={isArabic ? cat.titleAr : cat.titleEn}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-60" />
              </div>

              {/* Text Info */}
              <div className="p-3.5 sm:p-4">
                <div className="flex items-center gap-1.5 font-black text-sm text-white group-hover:text-[#ff2d78] transition-colors">
                  <span>{isArabic ? cat.titleAr : cat.titleEn}</span>
                  <span className={`text-xs transition-transform duration-200 ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                    →
                  </span>
                </div>
                <p className="text-[11px] font-medium text-stone-400 mt-1 line-clamp-1">
                  {isArabic ? cat.subtitleAr : cat.subtitleEn}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
