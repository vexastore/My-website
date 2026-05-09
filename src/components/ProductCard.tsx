import React, { useState, useRef, useCallback } from 'react';
import { Product, ProductVariant } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart, X, PackageCheck, ShieldCheck, Zap, ChevronLeft, ChevronRight, ChevronDown, Truck, Lock, Minus, Plus, Loader2 } from 'lucide-react';
import { CATEGORIES, getProductCategories } from '../data/categories';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart, cart, language, setView, fetchProductImages } = useShop();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [variantError, setVariantError] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const isArabic = language === 'ar';

  const cardImage = product.image || '';
  const hasRealImage = !!cardImage;

  const productCats = getProductCategories(product);
  const primaryCatId = productCats[0] || product.category;
  const primaryCatName = CATEGORIES.find(c => c.id === primaryCatId)?.name?.[isArabic ? 'ar' : 'en'] || primaryCatId;

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

  const selectedImage = modalImages[selectedImageIndex] || cardImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allVariantsSelected) { setVariantError(true); return; }
    setVariantError(false);
    if (remainingStock > 0) {
      addToCart(product, quantity, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined);
      setIsDetailsOpen(false);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allVariantsSelected) { setVariantError(true); return; }
    setVariantError(false);
    if (remainingStock > 0) {
      addToCart(product, quantity, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined);
      setIsDetailsOpen(false);
      setView('checkout');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setSelectedImageIndex(i => Math.min(i + 1, modalImages.length - 1));
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
    setSelectedImageIndex(i => Math.min(i + 1, modalImages.length - 1));
  };

  const openModal = useCallback(async () => {
    setIsDetailsOpen(true);
    setSelectedImageIndex(0);
    setSelectedVariants({});
    setVariantError(false);
    setIsDeliveryOpen(false);
    setQuantity(1);
    setModalImages(cardImage ? [cardImage] : []);
    setImagesLoading(true);
    try {
      const imgs = await fetchProductImages(product.id);
      setModalImages(imgs.length > 0 ? imgs : (cardImage ? [cardImage] : []));
    } catch {
      setModalImages(cardImage ? [cardImage] : []);
    } finally {
      setImagesLoading(false);
    }
  }, [product.id, cardImage, fetchProductImages]);

  return (
    <>
      {/* ── PRODUCT CARD ── */}
      <div
        onClick={openModal}
        role="button"
        aria-label={displayName}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && openModal()}
        className="group cursor-pointer bg-[#050505] text-white"
      >
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
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                fetchPriority={priority ? 'high' : 'low'}
                width="400"
                height="400"
                className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
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

      {/* ── PRODUCT MODAL ── */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setIsDetailsOpen(false)}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div
            className="relative w-full max-w-lg max-h-[96vh] overflow-y-auto bg-white sm:rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* ── Top bar: close button + delivery banner ── */}
            <div className="sticky top-0 z-30 bg-black flex items-center justify-between px-3 py-2.5 select-none">
              {/* Close button — always visible, left side in RTL */}
              <button
                onClick={() => setIsDetailsOpen(false)}
                aria-label={isArabic ? 'إغلاق' : 'Close'}
                className="bg-white/15 hover:bg-white/30 text-white rounded-full p-2 transition flex-shrink-0"
              >
                <X size={18} />
              </button>

              <span className="text-white text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 mx-2 text-center">
                <Zap size={11} className="text-emerald-400 flex-shrink-0" fill="currentColor" />
                {isArabic ? 'توصيل في نفس اليوم في بيروت' : 'Same Day Delivery in Beirut'}
              </span>

              {/* Image counter pill */}
              {modalImages.length > 1 ? (
                <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full flex-shrink-0">
                  {selectedImageIndex + 1}/{modalImages.length}
                </span>
              ) : <div className="w-10" />}
            </div>

            {/* ── Main image ── */}
            <div
              className="bg-black w-full relative"
              style={{ paddingTop: '85%', minHeight: '220px' }}
            >
              <div
                className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {imagesLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-white/40" />
                  </div>
                ) : selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={displayName}
                    loading="eager"
                    className="w-full h-full object-contain"
                    style={{ objectPosition: 'center center' }}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradientClass}`}>
                    <span className="text-3xl font-black tracking-widest text-white">VEXA</span>
                  </div>
                )}

                {/* Prev / Next arrows */}
                {modalImages.length > 1 && (
                  <>
                    <button onClick={prevImage} disabled={selectedImageIndex === 0}
                      aria-label={isArabic ? 'الصورة السابقة' : 'Previous image'}
                      className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} bg-black/50 hover:bg-black/80 backdrop-blur rounded-full p-2 transition disabled:opacity-20`}>
                      <ChevronLeft size={20} className={`text-white ${isArabic ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={nextImage} disabled={selectedImageIndex === modalImages.length - 1}
                      aria-label={isArabic ? 'الصورة التالية' : 'Next image'}
                      className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} bg-black/50 hover:bg-black/80 backdrop-blur rounded-full p-2 transition disabled:opacity-20`}>
                      <ChevronRight size={20} className={`text-white ${isArabic ? 'rotate-180' : ''}`} />
                    </button>
                  </>
                )}

                {/* Dot indicators at bottom */}
                {modalImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {modalImages.map((_, i) => (
                      <button key={i} onClick={e => { e.stopPropagation(); setSelectedImageIndex(i); }}
                        className={`rounded-full transition-all ${i === selectedImageIndex ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Product info (white) ── */}
            <div className="bg-white px-5 py-5 space-y-4">

              {/* Name */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 mb-1">{primaryCatName}</p>
                <h2 className="text-lg font-black text-stone-900 leading-snug">{displayName}</h2>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      className={i < Math.floor(product.rating) ? '' : 'text-stone-300'} />
                  ))}
                </div>
                <span className="text-sm font-bold text-amber-500">{product.rating}/5</span>
                <span className="text-sm text-stone-400">({product.reviewsCount} {isArabic ? 'تقييم' : 'ratings'})</span>
              </div>

              {/* Price row */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-bold text-stone-400 line-through">${oldPrice.toFixed(2)} USD</span>
                <span className="text-2xl font-black text-stone-900">${product.price.toFixed(2)}</span>
                <span className="text-sm font-bold text-stone-500">USD</span>
                <span className="text-[10px] font-black bg-stone-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Sale</span>
              </div>
              <p className="text-xs text-stone-400 -mt-2">
                {isArabic ? 'الشحن يُحسب عند الدفع' : 'Shipping calculated at checkout.'}
              </p>

              {/* Trust icons */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: <Lock size={20} className="text-stone-600" />, ar: 'الدفع عند\nالاستلام', en: 'Cash on\nDelivery' },
                  { icon: <PackageCheck size={20} className="text-stone-600" />, ar: 'قابل\nللاسترجاع', en: 'Returnable' },
                  { icon: <Truck size={20} className="text-stone-600" />, ar: 'توصيل سري\nوسريع', en: 'Discreet &\nFast Delivery' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl border border-stone-200 py-3 px-1">
                    {item.icon}
                    <span className="text-[9px] font-black uppercase tracking-wide text-stone-600 leading-tight whitespace-pre-line">
                      {isArabic ? item.ar : item.en}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stock status */}
              {remainingStock > 0 && remainingStock <= 5 && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
                  <span className="text-sm font-bold text-amber-700">{isArabic ? 'مخزون محدود' : 'Low stock'}</span>
                </div>
              )}
              {remainingStock > 5 && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-emerald-700">{isArabic ? 'متوفر' : 'In stock'}</span>
                </div>
              )}
              {remainingStock === 0 && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-red-600">{isArabic ? 'نفذ المخزون' : 'Out of stock'}</span>
                </div>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  {product.variants.map((variant: ProductVariant) => (
                    <div key={variant.name}>
                      <p className="text-xs font-black text-stone-700 mb-2">
                        {isArabic ? variant.name : (variant.nameEn || variant.name)}
                        {!selectedVariants[variant.name] && variantError && (
                          <span className="text-red-500 mr-1"> ({isArabic ? 'مطلوب' : 'required'})</span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map(opt => (
                          <button key={opt} type="button"
                            onClick={() => { setSelectedVariants(prev => ({ ...prev, [variant.name]: opt })); setVariantError(false); }}
                            className={`px-4 py-1.5 text-xs font-bold rounded-full border-2 transition-all ${
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

              {/* Quantity */}
              {product.stock > 0 && remainingStock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-stone-700">{isArabic ? 'الكمية' : 'Quantity'}</span>
                  <div className="flex items-center border-2 border-stone-300 rounded-lg overflow-hidden">
                    <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition disabled:opacity-30">
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-2 font-black text-stone-900 min-w-[3rem] text-center">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(q => Math.min(remainingStock, q + 1))} disabled={quantity >= remainingStock}
                      aria-label="Increase quantity"
                      className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition disabled:opacity-30">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to cart */}
              <button onClick={handleAddToCart}
                disabled={product.stock === 0 || remainingStock === 0}
                aria-label={isArabic ? 'أضف للسلة' : 'Add to cart'}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black transition active:scale-[0.98] ${
                  product.stock === 0 || remainingStock === 0
                    ? 'cursor-not-allowed bg-stone-200 text-stone-400'
                    : variantError
                    ? 'bg-red-600 text-white'
                    : 'bg-black text-white hover:bg-stone-800'
                }`}>
                <ShoppingCart size={17} />
                {product.stock === 0
                  ? (isArabic ? 'نفذ المخزون' : 'Sold out')
                  : remainingStock === 0
                  ? (isArabic ? 'تمت إضافة الكمية كلها' : 'All qty added')
                  : variantError
                  ? (isArabic ? 'اختر الخيارات أولاً' : 'Select options first')
                  : (isArabic ? `إضافة ${quantity > 1 ? quantity + ' قطع' : ''} للسلة` : `Add${quantity > 1 ? ` ${quantity}` : ''} to cart`)}
              </button>

              {/* Buy Now — red */}
              {product.stock > 0 && remainingStock > 0 && (
                <button
                  onClick={handleBuyNow}
                  aria-label={isArabic ? 'شراء الآن' : 'Buy it now'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-700 hover:to-rose-600 transition active:scale-[0.98] shadow-md"
                >
                  <Zap size={16} fill="currentColor" />
                  {isArabic ? 'شراء الآن' : 'Buy it now'}
                </button>
              )}

              {/* Delivery Info Accordion */}
              <div className="border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsDeliveryOpen(v => !v)}
                  aria-expanded={isDeliveryOpen}
                  className="flex w-full items-center justify-between py-3.5"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-700 flex items-center gap-2">
                    <ShieldCheck size={13} className="text-stone-400" />
                    {isArabic ? 'معلومات التوصيل' : 'DELIVERY INFO'}
                  </span>
                  <ChevronDown size={15} className={`text-stone-400 transition-transform duration-200 ${isDeliveryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDeliveryOpen && (
                  <div className="pb-4 space-y-3 text-sm leading-relaxed text-stone-600">
                    {isArabic ? (
                      <>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">توصيل سري في لبنان</h4>
                          <p>خصوصيتك أولويتنا. كل طلب يُشحن في كرتون عادي مغلق بدون أي إشارة إلى محتواه أو اسم المتجر.</p>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">توصيل في نفس اليوم في بيروت</h4>
                          <p>يصل طلبك خلال ساعات من الشراء لأقصى قدر من الراحة.</p>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">توصيل لكل لبنان خلال 72 ساعة</h4>
                          <p>خارج بيروت؟ نوصل لجميع المناطق بشكل سري وسريع.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">Discreet Delivery Across Lebanon</h4>
                          <p>Every order is shipped in plain, unbranded packaging with no indication of its contents.</p>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">Same-Day Delivery in Beirut</h4>
                          <p>Orders arrive within hours of purchase for maximum convenience.</p>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">Nationwide Delivery Within 72 Hours</h4>
                          <p>We deliver discreetly to all regions across Lebanon.</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {displayDesc && (
                <div className="text-sm leading-7 text-stone-600 border-t border-stone-100 pt-4">
                  <p>{displayDesc}</p>
                </div>
              )}

              {/* ── ALL images grid (2 columns) using .map() — every image shown ── */}
              {modalImages.length > 1 && (
                <div className="border-t border-stone-100 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">
                    {isArabic ? `صور المنتج (${modalImages.length})` : `Product images (${modalImages.length})`}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {modalImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedImageIndex(idx); window.scrollTo({ top: 0 }); }}
                        aria-label={`${isArabic ? 'صورة' : 'Image'} ${idx + 1}`}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-stone-900'
                            : 'border-stone-200 opacity-75 hover:opacity-100 hover:border-stone-400'
                        }`}
                      >
                        {/* padding-top trick for 1:1 ratio — works on all Android browsers */}
                        <div style={{ paddingTop: '100%', position: 'relative' }}>
                          <img
                            src={img}
                            alt={`${displayName} ${idx + 1}`}
                            loading="lazy"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        {selectedImageIndex === idx && (
                          <div className="absolute inset-0 ring-2 ring-inset ring-stone-900 rounded-xl pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
