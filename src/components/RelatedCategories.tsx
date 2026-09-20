import React from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronRight, Sparkles, Heart, Zap, Shield, Flame } from 'lucide-react';

interface RelatedCategoriesProps {
  onSelectCategory: (category: string) => void;
  onViewAllCategories?: () => void;
}

const RELATED_ITEMS = [
  { id: 'Vibrators', en: 'Vibrators', ar: 'هزازات', icon: Zap },
  { id: 'Dildos', en: 'Dildos', ar: 'ديلدو', icon: Flame },
  { id: 'Male Toys', en: 'Male Toys', ar: 'ألعاب رجالية', icon: Shield },
  { id: 'Sex Toys', en: 'Couples', ar: 'ألعاب زوجية', icon: Heart },
  { id: 'Lingerie', en: 'Lingerie', ar: 'لانجري', icon: Sparkles },
];

export const RelatedCategories: React.FC<RelatedCategoriesProps> = ({
  onSelectCategory,
  onViewAllCategories,
}) => {
  const { language, activeCategory } = useShop();
  const isArabic = language === 'ar';

  return (
    <section className="bg-black py-8 sm:py-10 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
            {isArabic ? 'فئات ذات صلة' : 'Related Categories'}
          </h3>

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

        {/* Horizontal Pills */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {RELATED_ITEMS.map(item => {
            const Icon = item.icon;
            const isSelected = activeCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#ff2d78] bg-[#ff2d78]/15 text-white shadow-md'
                    : 'border-white/15 bg-white/[0.02] text-stone-300 hover:border-[#ff2d78] hover:text-[#ff2d78] hover:bg-white/5'
                }`}
              >
                <Icon size={14} className="text-[#ff2d78]" />
                <span>{isArabic ? item.ar : item.en}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
