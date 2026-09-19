import React from 'react';
import { Product } from '../types';
import { getProductReviews, getAggregateRating } from '@/lib/productReviews';
import { Star, ShieldCheck, CheckCircle2, PackageCheck, Truck } from 'lucide-react';

interface ProductReviewsProps {
  product: Product;
  isArabic: boolean;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product, isArabic }) => {
  const reviews = getProductReviews(product, 3);
  const aggregate = getAggregateRating(product);
  const ratingValue = aggregate ? aggregate.ratingValue : 5;
  const reviewCount = aggregate ? aggregate.reviewCount : Math.max(1, product.reviewsCount || 1);

  return (
    <section className="border-t border-white/10 pt-10 mt-10">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                <Star size={12} fill="currentColor" />
                {isArabic ? 'تقييمات موثقة' : 'Verified Reviews'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isArabic ? 'آراء وتجارب العملاء' : 'Customer Reviews'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              {isArabic
                ? 'تقييمات حقيقية من عملائنا في بيروت وكافة المناطق اللبنانية.'
                : 'Real reviews from customers across Beirut and all of Lebanon.'}
            </p>
          </div>

          {/* Aggregate Rating Summary Badge */}
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 sm:px-5">
            <div className="text-3xl font-black text-white">{ratingValue.toFixed(1)}</div>
            <div className="space-y-0.5">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(ratingValue) ? 'currentColor' : 'none'}
                    className={i < Math.floor(ratingValue) ? '' : 'text-stone-600'}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-stone-400">
                {isArabic
                  ? `${reviewCount} تقييماً موثقاً`
                  : `${reviewCount} verified reviews`}
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl px-3.5 py-2.5">
            <PackageCheck size={16} className="text-rose-400 shrink-0" />
            <span className="text-xs font-semibold text-stone-300">
              {isArabic ? 'تغليف سري 100٪ بدون كتابة' : '100% Discreet Packaging'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl px-3.5 py-2.5">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-stone-300">
              {isArabic ? 'الدفع نقداً عند الاستلام' : 'Cash on Delivery in Lebanon'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl px-3.5 py-2.5">
            <Truck size={16} className="text-sky-400 shrink-0" />
            <span className="text-xs font-semibold text-stone-300">
              {isArabic ? 'توصيل خلال 24-72 ساعة' : 'Fast 24-72h Lebanon Delivery'}
            </span>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4 sm:p-5 transition hover:border-white/20"
            >
              <div className="space-y-3">
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center font-black text-xs text-white shadow-sm">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{rev.author}</span>
                        <span
                          title={isArabic ? 'مشتري موثق' : 'Verified Buyer'}
                          className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20"
                        >
                          <CheckCircle2 size={10} className="mr-0.5 inline" />
                          {isArabic ? 'مشتري موثق' : 'Verified'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        {isArabic ? rev.locationAr : rev.location}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < rev.rating ? 'currentColor' : 'none'}
                        className={i < rev.rating ? '' : 'text-stone-600'}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Title & Body */}
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-white">
                    {isArabic ? rev.titleAr : rev.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    &ldquo;{isArabic ? rev.textAr : rev.text}&rdquo;
                  </p>
                </div>
              </div>

              {/* Review Date */}
              <div className="pt-3 mt-3 border-t border-white/5 text-[10px] text-stone-500 font-mono">
                {rev.date}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
