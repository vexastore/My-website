import React, { useState, useRef } from 'react';
import { Product, ProductVariant } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart, X, PackageCheck, ShieldCheck, Zap, ChevronLeft, ChevronRight, ChevronDown, Truck, Lock, Minus, Plus } from 'lucide-react';
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
  const [quantity, setQuantity] = useState(1);
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
      addToCart(product, quantity, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined);
      setIsDetailsOpen(false);
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

  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); setSelectedImageIndex(i => Math.max(i - 1, 0)); };
  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); setSelectedImageIndex(i => Math.min(i + 1, productImages.length - 1)); };

  const openModal = () => {
    setIsDetailsOpen(true);
    setSelectedImageIndex(0);
    setSelectedVariants({});
    setVariantError(false);
    setIsDeliveryOpen(false);
    setQuantity(1);
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
              <img src={cardImage} alt={displayName} loading="lazy" decoding="async"
                className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
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
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setIsDetailsOpen(false)}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div
            className="relative max-h-[96vh] w-full max-w-lg overflow-y-auto bg-white sm:rounded-2xl shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Floating close button */}
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition backdrop-blur-sm"
            >
              <X size={18} />
            </button>

            {/* Image section — dark background */}
            <div className="bg-black relative select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              {selectedImage ? (
                <img src={selectedImage} alt={displayName} loading="eager"
                  className="w-full object-cover" style={{ maxHeight: '380px', minHeight: '260px' }} />
              ) : (
                <div className={`flex min-h-[300px] w-full items-center justify-center bg-gradient-to-br ${gradientClass}`}>
                  <span className="text-3xl font-black tracking-widest text-white">VEXA</span>
                </div>
              )}
              {productImages.length > 1 && (
                <>
                  <button onClick={prevImage} disabled={selectedImageIndex === 0}
                    className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} bg-white/20 hover:bg-white/40 backdrop-blur rounded-full p-2 transition disabled:opacity-20`}>
                    <ChevronLeft size={18} className={`text-white ${isArabic ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={nextImage} disabled={selectedImageIndex === productImages.length - 1}
                    className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} bg-white/20 hover:bg-white/40 backdrop-blur rounded-full p-2 transition disabled:opacity-20`}>
                    <ChevronRight size={18} className={`text-white ${isArabic ? 'rotate-180' : ''}`} />
                  </button>
                  {/* Page indicator */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1">
                    <span className="bg-black/50 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur">
                      {selectedImageIndex + 1}/{productImages.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="bg-black px-3 pb-3 flex gap-2 overflow-x-auto">
                {productImages.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                    className={`h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${selectedImageIndex === idx ? 'border-white' : 'border-white/20 opacity-50 hover:opacity-80'}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* Product info section — white background */}
            <div className="bg-white flex-1 px-5 py-5 space-y-4">

              {/* Category + Name */}
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-purple-600 mb-1">{primaryCatName}</p>
                <h2 className="text-xl font-black text-stone-900 leading-snug">{displayName}</h2>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      className={i < Math.floor(product.rating) ? '' : 'text-stone-300'} />
                  ))}
                </div>
                <span className="text-sm font-bold text-amber-500">{product.rating}/5</span>
                <span className="text-sm text-stone-400">({product.reviewsCount} {isArabic ? 'تقييم' : 'ratings'})</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-stone-900">${product.price.toFixed(2)}</span>
                <span className="text-sm font-bold text-stone-400">USD</span>
                <span className="text-sm font-bold text-stone-400 line-through">${oldPrice.toFixed(2)}</span>
              </div>

              {/* Trust icons */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: <Lock size={20} className="text-stone-500" />, ar: 'الدفع عند\nالاستلام', en: 'Cash on\nDelivery' },
                  { icon: <PackageCheck size={20} className="text-stone-500" />, ar: 'استرجاع', en: 'Returnable' },
                  { icon: <Truck size={20} className="text-stone-500" />, ar: 'توصيل سري\nوسريع', en: 'Discreet &\nFast Delivery' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl border border-stone-200 py-3 px-1">
                    {item.icon}
                    <span className="text-[9px] font-black uppercase tracking-wide text-stone-600 leading-tight whitespace-pre-line">
                      {isArabic ? item.ar : item.en}
                    </span>
                  </div>
                ))}
              </div>

              {/* Low stock */}
              {remainingStock > 0 && remainingStock <= 5 && (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 animate-pulse"></span>
                  <span className="text-sm font-bold text-amber-700">
                    {isArabic ? 'مخزون محدود' : 'Low stock'}
                  </span>
                </div>
              )}
              {remainingStock === 0 && (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></span>
                  <span className="text-sm font-bold text-red-600">{isArabic ? 'نفذ المخزون' : 'Out of stock'}</span>
                </div>
              )}

              {/* Other categories */}
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

              {/* Variants */}
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

              {/* Same-day delivery badge */}
              <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5">
                <Zap size={15} className="text-emerald-600 flex-shrink-0" />
                <p className="text-xs font-black text-emerald-700">
                  {isArabic ? 'توصيل في نفس اليوم في بيروت' : 'Same day delivery in Beirut'}
                </p>
              </div>

              {/* Quantity selector */}
              {product.stock > 0 && remainingStock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-stone-700">{isArabic ? 'الكمية' : 'Quantity'}</span>
                  <div className="flex items-center border-2 border-stone-200 rounded-full overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-2.5 text-stone-600 hover:bg-stone-100 transition disabled:opacity-30 font-bold"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-2 font-black text-stone-900 min-w-[3rem] text-center text-base">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.min(remainingStock, q + 1))}
                      disabled={quantity >= remainingStock}
                      className="px-4 py-2.5 text-stone-600 hover:bg-stone-100 transition disabled:opacity-30 font-bold"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-stone-400 font-bold">
                    {remainingStock} {isArabic ? 'متوفر' : 'available'}
                  </span>
                </div>
              )}

              {/* Add to cart button */}
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
                  : (isArabic ? `إضافة ${quantity > 1 ? quantity + ' قطع' : ''} للسلة` : `Add${quantity > 1 ? ` ${quantity}` : ''} to cart`)}
              </button>

              {/* Delivery Info Accordion */}
              <div className="border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsDeliveryOpen(v => !v)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-700 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-stone-500" />
                    {isArabic ? 'معلومات التوصيل' : 'DELIVERY INFO'}
                  </span>
                  <ChevronDown size={16} className={`text-stone-500 transition-transform duration-200 ${isDeliveryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDeliveryOpen && (
                  <div className="pb-5 space-y-4 text-sm leading-relaxed text-stone-600">
                    {isArabic ? (
                      <>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">توصيل سري ومنتجات راقية في لبنان</h4>
                          <p>خصوصيتك هي أولويتنا الأولى. نحن ملتزمون بتقديم تجربة تسوق سرية وآمنة بالكامل لجميع عملائنا في لبنان. كل طلب يُشحن في كرتون عادي مغلق بدون أي إشارة إلى محتواه أو اسم المتجر.</p>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">مجموعة متميزة لكل ذوق</h4>
                          <p>اكتشف مجموعة مختارة بعناية من منتجات العناية الشخصية عالية الجودة، مصممة للراحة والأمان والمتعة. المجموعة تشمل هزازات، ديلدو، مساجات شخصية، إكسسوارات حميمة والمزيد — كلها مصنوعة من مواد طبية آمنة للجسم.</p>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">توصيل في نفس اليوم في بيروت</h4>
                          <p>تحتاجه بسرعة؟ عملاؤنا في بيروت يستفيدون من خدمة التوصيل في نفس اليوم، حيث يصل طلبك خلال ساعات من الشراء لأقصى قدر من الراحة.</p>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">توصيل سريع لكل لبنان</h4>
                          <p>خارج بيروت؟ لا مشكلة. نوصل بشكل سري لجميع المناطق في لبنان خلال 72 ساعة كحد أقصى. كل طلب يُعالج بعناية لضمان شحن سريع وآمن وخاص تماماً.</p>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">التزامنا بالخصوصية والجودة</h4>
                          <p>نجمع بين جودة المنتجات الفائقة والسرية التامة والخدمة الموثوقة. من التصفح حتى الاستلام، كل شيء مصمم ليكون سلساً وخاصاً وموثوقاً.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">Discreet Delivery & Premium Adult Wellness Products in Lebanon</h4>
                          <p>Your privacy is our top priority. We are committed to offering a fully discreet and secure shopping experience for customers across Lebanon. Every order is shipped in plain, unbranded packaging with no indication of its contents.</p>
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800 mb-1">Premium Selection for Every Preference</h4>
                          <p>Discover a carefully curated range of high-quality adult wellness products designed for comfort, safety, and satisfaction — including vibrators, dildos, personal massagers, intimate accessories, and more, all made from body-safe materials.</p>
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
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {displayDesc && (
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <h3 className="mb-2 text-sm font-black text-stone-900">{isArabic ? 'تفاصيل المنتج' : 'Product details'}</h3>
                  <p className="text-sm leading-7 text-stone-600">{displayDesc}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};
