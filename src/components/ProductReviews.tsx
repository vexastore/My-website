'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Star, ShieldCheck, CheckCircle2, MessageSquarePlus, Send, X } from 'lucide-react';
import type { ProductReview } from '@/lib/productReviews';

interface ProductReviewsProps {
  product: Product;
  isArabic: boolean;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product, isArabic }) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [orderReference, setOrderReference] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadReviews() {
      if (!product.id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/reviews?productId=${encodeURIComponent(product.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && Array.isArray(data.reviews)) {
            setReviews(data.reviews);
          }
        }
      } catch {
        // Degrade gracefully
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!customerName.trim()) {
      setSubmitError(isArabic ? 'يرجى إدخال اسمك' : 'Please enter your name');
      return;
    }
    if (body.trim().length < 5) {
      setSubmitError(isArabic ? 'نص التقييم يجب أن يحتوي على 5 أحرف على الأقل' : 'Review must be at least 5 characters');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: customerName.trim(),
          rating,
          title: title.trim() || undefined,
          body: body.trim(),
          locale: isArabic ? 'ar' : 'en',
          orderReference: orderReference.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || (isArabic ? 'فشل إرسال التقييم' : 'Failed to submit review'));
        return;
      }

      setSubmitSuccess(true);
      setCustomerName('');
      setTitle('');
      setBody('');
      setOrderReference('');
      setRating(5);
    } catch {
      setSubmitError(isArabic ? 'حدث خطأ في الاتصال' : 'Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  const hasReviews = reviews.length > 0;
  const averageRating = hasReviews
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : product.rating > 0
      ? product.rating
      : 0;

  return (
    <section className="border-t border-white/10 pt-10 mt-10" id="reviews-section">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                <Star size={12} fill="currentColor" />
                {isArabic ? 'تقييمات المتجر' : 'Product Reviews'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isArabic ? 'آراء وتجارب العملاء' : 'Customer Reviews'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              {isArabic
                ? 'تقييمات حقيقية من عملائنا في بيروت وكافة المناطق اللبنانية.'
                : 'Real reviews from verified customers across Lebanon.'}
            </p>
          </div>

          {/* Action buttons & Aggregate Rating */}
          <div className="flex flex-wrap items-center gap-3">
            {hasReviews && (
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-3 sm:px-4">
                <div className="text-2xl sm:text-3xl font-black text-white">{averageRating.toFixed(1)}</div>
                <div className="space-y-0.5">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < Math.floor(averageRating) ? 'currentColor' : 'none'}
                        className={i < Math.floor(averageRating) ? '' : 'text-stone-600'}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-stone-400">
                    {isArabic
                      ? `${reviews.length} تقييم معتمد`
                      : `${reviews.length} approved review${reviews.length > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setIsFormOpen(!isFormOpen);
                setSubmitSuccess(false);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-bold px-4 py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-rose-950/20"
              type="button"
            >
              <MessageSquarePlus size={15} />
              {isArabic ? 'أضف تقييمك' : 'Write a Review'}
            </button>
          </div>
        </div>

        {/* Write a Review Modal / Dropdown */}
        {isFormOpen && (
          <div className="bg-stone-900/90 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <MessageSquarePlus size={16} className="text-amber-400" />
                {isArabic ? 'كتابة تقييم جديد' : 'Write a Customer Review'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-stone-400 hover:text-white p-1"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X size={16} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center space-y-2">
                <CheckCircle2 size={28} className="text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-emerald-200">
                  {isArabic
                    ? 'شكراً لك! تم إرسال تقييمك بنجاح وسيظهر بعد مراجعته من قبل الإدارة.'
                    : 'Thank you! Your review has been submitted for admin approval.'}
                </p>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="mt-2 text-xs text-emerald-400 hover:underline font-semibold"
                >
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 bg-rose-950/50 border border-rose-500/30 rounded-xl text-xs text-rose-200">
                    {submitError}
                  </div>
                )}

                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    {isArabic ? 'تقييمك (من 1 إلى 5 نجوم)' : 'Your Rating'}
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition transform hover:scale-110"
                        title={`${star} stars`}
                      >
                        <Star
                          size={24}
                          fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                          className={(hoverRating || rating) >= star ? 'text-amber-400' : 'text-stone-600'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      {isArabic ? 'اسمك أو اللقب' : 'Your Name / Nickname'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isArabic ? 'مثال: سارة م.' : 'e.g. Sarah M.'}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      {isArabic ? 'عنوان التقييم (اختياري)' : 'Review Title (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={isArabic ? 'مثال: تجربة ممتازة وتوصيل سريع' : 'e.g. Fast delivery and great quality'}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    {isArabic ? 'تفاصيل تجربتك' : 'Review Details'} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={
                      isArabic
                        ? 'شاركنا برأيك حول جودة المنتج، التغليف، أو سرعة التوصيل...'
                        : 'Share your experience with product quality, discreet packaging, or delivery speed...'
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    {isArabic ? 'رقم الطلب (اختياري - للتحقق من الشراء)' : 'Order Reference (Optional - for Verified Buyer badge)'}
                  </label>
                  <input
                    type="text"
                    value={orderReference}
                    onChange={(e) => setOrderReference(e.target.value)}
                    placeholder="VEXA-1234"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none uppercase"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    {isArabic
                      ? 'إذا كنت قد طلبت هذا المنتج سابقاً، أدخل رقم طلبك للحصول على شارة "مشتري موثق".'
                      : 'If you previously ordered this product, enter your order number to automatically receive a Verified Buyer badge.'}
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-95 transition disabled:opacity-50"
                  >
                    <Send size={14} />
                    {submitting
                      ? (isArabic ? 'جارٍ الإرسال...' : 'Submitting...')
                      : (isArabic ? 'إرسال التقييم' : 'Submit Review')}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 text-xs text-stone-500">
            {isArabic ? 'جارٍ تحميل التقييمات...' : 'Loading reviews...'}
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasReviews && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-amber-400">
              <Star size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {isArabic ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
              </h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                {isArabic
                  ? 'كن أول من يقيّم هذا المنتج وشارك تجربتك مع عملائنا في لبنان.'
                  : 'Be the first to review this product and share your feedback.'}
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition mt-2"
            >
              <MessageSquarePlus size={14} />
              {isArabic ? 'أضف أول تقييم لهذا المنتج' : 'Write the first review'}
            </button>
          </div>
        )}

        {/* Real Reviews List */}
        {!loading && hasReviews && (
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
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">{rev.author}</span>
                          {rev.verified && (
                            <span
                              title={isArabic ? 'مشتري موثق من المتجر' : 'Verified Buyer from Vexa Toys'}
                              className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20"
                            >
                              <ShieldCheck size={11} className="mr-0.5 inline" />
                              {isArabic ? 'مشتري موثق' : 'Verified'}
                            </span>
                          )}
                        </div>
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
                    {rev.title && (
                      <h3 className="text-xs font-black text-white">
                        {rev.title}
                      </h3>
                    )}
                    <p className="text-xs text-stone-300 leading-relaxed">
                      &ldquo;{rev.body}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Review Date */}
                <div className="pt-3 mt-3 border-t border-white/5 text-[10px] text-stone-500 font-mono">
                  {rev.createdAt ? rev.createdAt.slice(0, 10) : ''}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
