
import React, { useState, useRef } from 'react';
import { Product, ProductVariant } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart, X, PackageCheck, ShieldCheck, Zap, ChevronLeft, ChevronRight, ChevronDown, Truck, Lock } from 'lucide-react';
import { CATEGORIES, getProductCategories } from '../data/categories';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, language } = useShop();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [variantError, setVariantError] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const isArabic = language === 'ar';

  const productImages = product.images && product.images.length > 0
    ? product.images
    : product.image ? [product.image] : [];
  const selectedImage = productImages[selectedImageIndex] || product.image;
  const cardImage = product.image || productImages[0] || '';
  const hasRealImage = !!cardImage;

  const productCats = getProductCategories(product);
  const primaryCatId = productCats[0] || product.category;
  const primaryCatName = CATEGORIES.find(c => c.id === primaryCatId)?.[isArabic ? 'name' : 'name']?.[isArabic ? 'ar' : 'en'] || primaryCatId;

  const oldPrice = Math.round(product.price * 1.23);
  const gradientClass =
    primaryCatId === 'Lingerie' || primaryCatId === 'BDSM' || primaryCatId === 'Holiday Collection'
      ? 'from-[#351018] via-[#9a1f55] to-[#bf2f65]'
      : 'from-[#1b1547] via-[#5a35bc] to-[#9d6cff]';

  const cartItem = cart.find(i => i.product.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const remainingStock = product.stock - cartQty;

  const displayName = isArabic ? (product.name || product.nameEn) : (product.nameEn || product.name);
  const displayDesc = isArabic ? (product.description || product.descriptionEn) : (product.descriptionEn || product.description);

  const allVariantsSelected = !product.variants || product.variants.length === 0 ||
    product.variants.every((v: ProductVariant) => selectedVariants[v.name]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allVariantsSelected) { setVariantError(true); return; }
    setVariantError(false);
    if (remainingStock > 0) {
      addToCart(product, 1, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setSelectedImageIndex(i => Math.min(i + 1, productImages.length - 1));
      else setSelectedImageIndex(i => Math.max(i - 1, 0));
    }
    touchStartX.current = null;
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(i => Math.max(i - 1, 0));
  };
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(i => Math.min(i + 1, productImages.length - 1));
  };

  const openModal = () => {
    setIsDetailsOpen(true);
    setSelectedImageIndex(0);
    setSelectedVariants({});
    setVariantError(false);
    setIsDeliveryOpen(false);
  };

  return (
    <>
      <div onClick={openModal} className="group cursor-pointer bg-[#050505] text-white">
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#101010] shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
          {product.isNew && (
            <span className="absolute right-3 top-3 z-10 bg-emerald-400 text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full">
              {isArabic ? 'جديد' : 'New'}
            </span>
          )}
          <span className="absolute left-3 top-3 z-10 bg-white/90 text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full">
            {isArabic ? 'تخفيض' : 'Sale'}
          </span>

          <div className={`relative aspect-square overflow-hidden ${hasRealImage ? 'bg-black' : `bg-gradient-to-br ${gradientClass}`}`}>
            {hasRealImage ? (
              <img
                src={cardImage}
                alt={displayName}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-black tracking-[0.18em] sm:text-3xl">VEXA</span>
                <span className="mt-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/90 sm:text-xs">Premium</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white">
              <span className="truncate max-w-[60%]">{primaryCatName}</span>
              <span className={remainingStock <= 3 ? 'text-red-400' : 'text-white/70'}>
                {Math.max(remainingStock, 0)} {isArabic ? 'متبقي' : 'left'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 px-0.5">
          <h3 className="line-clamp-2 text-xs font-black uppercase tracking-[0.1em] text-white/80 sm:text-sm leading-snug" title={displayName}>
            {displayName}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-black text-white sm:text-xl">${product.price.toFixed(2)}</span>
            <span className="text-xs font-bold text-white/30 line-through">${oldPrice.toFixed(2)}</span>
            <span className="text-[10px] text-white/40 font-bold">USD</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-amber-400">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill="currentColor" className={i < Math.floor(product.rating) ? '' : 'opacity-20'} />
              ))}
            </div>
            <span className="text-[10px] font-bold text-white/30">({product.reviewsCount})</span>
          </div>
        </div>
      </div>

      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setIsDetailsOpen(false)}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div
            className="max-h-[94vh] w-full max-w-4xl overflow-y-auto bg-white shadow-2xl sm:rounded-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-700">{primaryCatName}</p>
                <h2 className="text-base font-black text-stone-900 sm:text-xl line-clamp-1">{displayName}</h2>
              </div>
              <button onClick={() => setIsDetailsOpen(false)}
                className="rounded-full border border-stone-200 p-2 text-stone-600 hover:bg-stone-100 flex-shrink-0">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              <div className="bg-stone-50 p-3 sm:p-4">
                <div className="relative select-none rounded-xl overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  {selectedImage ? (
                    <img src={selectedImage} alt={displayName} loading="eager"
                      className="w-full min-h-[300px] max-h-[420px] object-cover rounded-xl" />
                  ) : (
                    <div className={`flex min-h-[320px] w-full items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass}`}>
                      <span className="text-3xl font-black tracking-widest text-white">VEXA</span>
                    </div>
                  )}
                  {productImages.length > 1 && (
                    <>
                      <button onClick={prevImage} disabled={selectedImageIndex === 0}
                        className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-2' : 'left-2'} bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition disabled:opacity-30`}>
                        <ChevronLeft size={18} className={isArabic ? 'rotate-180' : ''} />
                      </button>
                      <button onClick={nextImage} disabled={selectedImageIndex === productImages.length - 1}
                        className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-2' : 'right-2'} bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition disabled:opacity-30`}>
                        <ChevronRight size={18} className={isArabic ? 'rotate-180' : ''} />
                      </button>
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {productImages.map((_, idx) => (
                          <button key={idx} onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(idx); }}
                            className={`rounded-full transition-all ${idx === selectedImageIndex ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {productImages.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {productImages.map((img, idx) => (
                      <button key={`${img}-${idx}`} type="button" onClick={() => setSelectedImageIndex(idx)}
                        className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${selectedImageIndex === idx ? 'border-black ring-1 ring-black/10' : 'border-stone-200 opacity-60 hover:opacity-100'}`}>
                        <img src={img} alt={`${displayName} ${idx + 1}`} className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-stone-200 py-3 px-1">
                    <Lock size={18} className="text-stone-500" />
                    <span className="text-[9px] font-black uppercase tracking-wide text-stone-600 leading-tight">
                      {isArabic ? 'الدفع عند\nالاستلام' : 'Cash on\nDelivery'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-stone-200 py-3 px-1">
                    <Truck size={18} className="text-stone-500" />
                    <span className="text-[9px] font-black uppercase tracking-wide text-stone-600 leading-tight">
                      {isArabic ? 'توصيل سريع\nودسكريت' : 'Discreet &\nFast Delivery'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-stone-200 py-3 px-1">
                    <ShieldCheck size={18} className="text-stone-500" />
                    <span className="text-[9px] font-black uppercase tracking-wide text-stone-600 leading-tight">
                      {isArabic ? 'خصوصية\nتامة' : 'Full\nPrivacy'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-stone-400">{isArabic ? 'السعر' : 'Price'}</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-bold text-stone-400 line-through">${oldPrice.toFixed(2)}</span>
                      <p className="text-3xl font-black text-stone-950">${product.price.toFixed(2)}</p>
                      <span className="text-sm font-bold text-stone-400">USD</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 text-amber-400 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                          className={i < Math.floor(product.rating) ? '' : 'text-stone-300'} />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-stone-500 mt-1">({product.reviewsCount} {isArabic ? 'تقييم' : 'ratings'})</p>
                  </div>
                </div>

                {remainingStock > 0 && remainingStock <= 5 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                    <span className="text-xs font-bold text-amber-700">
                      {isArabic ? 'مخزون محدود' : 'Low stock'}
                    </span>
                  </div>
                )}

                {productCats.length > 1 && (
                  <div className="flex flex-wrap gap-1.5">
                    {productCats.map(catId => {
                      const cat = CATEGORIES.find(c => c.id === catId);
                      return cat ? (
                        <span key={catId} className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full">
                          {isArabic ? cat.name.ar : cat.name.en}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4">
                    {product.variants.map((variant: ProductVariant) => (
                      <div key={variant.name}>
                        <p className="text-xs font-black text-stone-700 mb-2.5">
                          {isArabic ? variant.name : (variant.nameEn || variant.name)}
                          {!selectedVariants[variant.name] && variantError && (
                            <span className="text-red-500 mr-1 font-bold"> ({isArabic ? 'مطلوب' : 'required'})</span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {variant.options.map(opt => (
                            <button key={opt} type="button"
                              onClick={() => { setSelectedVariants(prev => ({ ...prev, [variant.name]: opt })); setVariantError(false); }}
                              className={`px-4 py-2 text-xs font-bold rounded-full border-2 transition-all ${
                                selectedVariants[variant.name] === opt
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white text-stone-800 border-stone-300 hover:border-stone-800'
                              }`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {displayDesc && (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <h3 className="mb-2 text-sm font-black text-stone-900">{isArabic ? 'تفاصيل المنتج' : 'Product details'}</h3>
                    <p className="text-sm leading-7 text-stone-600">{displayDesc}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5">
                  <Zap size={15} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-xs font-black text-emerald-700">
                    {isArabic ? 'توصيل في نفس اليوم في بيروت' : 'Same day delivery in Beirut'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-stone-200 px-3 py-2.5 text-center">
                    <p className="text-[10px] font-bold text-stone-400">{isArabic ? 'المخزون' : 'Stock'}</p>
                    <p className="text-sm font-black text-stone-800">
                      {remainingStock > 0
                        ? (isArabic ? `${remainingStock} قطعة` : `${remainingStock} available`)
                        : (isArabic ? 'غير متوفر' : 'Sold out')}
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl border border-stone-200 px-3 py-2.5 text-center">
                    <p className="text-[10px] font-bold text-stone-400">{isArabic ? 'الشحن' : 'Shipping'}</p>
                    <p className="text-sm font-black text-stone-800">{isArabic ? 'سري + COD' : 'Discreet + COD'}</p>
                  </div>
                </div>

                <button onClick={handleAddToCart}
                  disabled={product.stock === 0 || remainingStock === 0}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-black transition active:scale-[0.98] ${
                    product.stock === 0 || remainingStock === 0
                      ? 'cursor-not-allowed bg-stone-200 text-stone-400'
                      : variantError
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-black text-white hover:bg-stone-800'
                  }`}>
                  <ShoppingCart size={18} />
                  {product.stock === 0
                    ? (isArabic ? 'نفذ المخزون' : 'Sold out')
                    : remainingStock === 0
                    ? (isArabic ? 'تمت إضافة الكمية كلها' : 'All qty added')
                    : variantError
                    ? (isArabic ? 'اختر الخيارات أولاً' : 'Select options first')
                    : (isArabic ? 'أضف للسلة' : 'Add to cart')}
                </button>

                <div className="border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsDeliveryOpen(v => !v)}
                    className="flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-700">
                      {isArabic ? 'معلومات التوصيل' : 'About Delivery'}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-stone-500 transition-transform duration-200 ${isDeliveryOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isDeliveryOpen && (
                    <div className="pb-5 space-y-4 text-sm leading-relaxed text-stone-600">
                      <div>
                        <h4 className="font-black text-stone-800 mb-1">Discreet Delivery & Premium Adult Wellness Products in Lebanon</h4>
                        <p>Your privacy is our top priority. We are committed to offering a fully discreet and secure shopping experience for customers across Lebanon. Every order is shipped in plain, unbranded packaging with no indication of its contents, ensuring complete confidentiality from checkout to delivery.</p>
                      </div>
                      <div>
                        <h4 className="font-black text-stone-800 mb-1">Premium Selection for Every Preference</h4>
                        <p>Discover a carefully curated range of high-quality adult wellness products designed for comfort, safety, and satisfaction. The collection includes vibrators, dildos, personal massagers, intimate accessories, and more — all made from body-safe, premium materials suitable for both beginners and experienced users.</p>
                        <p className="mt-2">Whether for personal exploration or shared experiences, each product is selected to provide a reliable and enjoyable experience.</p>
                      </div>
                      <div>
                        <h4 className="font-black text-stone-800 mb-1">Same-Day Delivery in Beirut</h4>
                        <p>Need it quickly? Customers in Beirut can benefit from same-day delivery service, allowing orders to arrive within hours after purchase for maximum convenience and speed.</p>
                      </div>
                      <div>
                        <h4 className="font-black text-stone-800 mb-1">Fast Nationwide Delivery Across Lebanon</h4>
                        <p>Outside Beirut? No problem. We provide discreet delivery to all regions across Lebanon within 72 hours. Every order is handled carefully to ensure fast, secure, and completely private shipping.</p>
                      </div>
                      <div>
                        <h4 className="font-black text-stone-800 mb-1">Commitment to Privacy & Quality</h4>
                        <p>We focus on combining premium product quality with absolute discretion and reliable service. From browsing to delivery, everything is designed to be smooth, private, and trustworthy.</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
