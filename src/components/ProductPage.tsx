import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, ProductVariant } from '../types';
import { CATEGORIES, getProductCategories } from '../data/categories';
import { canonicalProductPath } from '@/lib/productSeo';
import { generateProductJsonLd } from '@/lib/productSchema';
import { ProductReviews } from './ProductReviews';
import { selectedUnitPrice } from '../utils/pricing';
import {
  Star, ShoppingCart, Zap, ChevronLeft, ChevronRight, ArrowLeft,
  Truck, Lock, PackageCheck, Minus, Plus, Loader2, ShieldCheck, ChevronDown, X, Link2, Copy
} from 'lucide-react';

const ProductPageContent: React.FC<{ product: Product }> = ({ product }) => {
  const {
    language, cart, addToCart, fetchProductImages,
    arTranslations, setView, setActiveCategory,
  } = useShop();
  const isArabic = language === 'ar';

  // Always start with a displayable image, store logo is the fallback for products
  // that have no real URL yet. This means imgsLoading is NEVER true on first render,
  // so users (and Googlebot) never see a spinner instead of product content.
  const PRODUCT_FALLBACK_IMG = 'https://vexatoys.com/vexa-logo.jpg';
  const getInitialImg = (img: string | undefined | null): string =>
    img && (img.startsWith('data:image/') || img.startsWith('http')) ? img : PRODUCT_FALLBACK_IMG;

  const [images, setImages]             = useState<string[]>([getInitialImg(product.image)]);
  const [imgIdx, setImgIdx]             = useState(0);
  const [imgsLoading, setImgsLoading]   = useState(false); // never block on initial render
  const [variants, setVariants]         = useState<Record<string, string>>({});
  const [variantError, setVariantError] = useState(false);
  const [qty, setQty]                   = useState(1);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const touchX = useRef<number | null>(null);

  const arT         = arTranslations[product.id];
  const displayName = isArabic ? (arT?.name || product.name || product.nameEn) : (product.nameEn || product.name);
  const displayDesc = isArabic ? (arT?.description || product.description || product.descriptionEn) : (product.descriptionEn || product.description);
  const cartQty     = cart.filter(i => i.product.id === product.id).reduce((total, item) => total + item.quantity, 0);
  const optionRemaining = (product.variants || []).reduce((available, variant) => {
    const selected = variants[variant.nameEn];
    const stock = selected ? variant.optionStock?.[selected] : null;
    if (stock === null || stock === undefined) return available;
    const inCart = cart.filter(item => item.product.id === product.id &&
      (item.selectedVariant?.[variant.nameEn] ?? item.selectedVariant?.[variant.name]) === selected)
      .reduce((total, item) => total + item.quantity, 0);
    return Math.min(available, stock - inCart);
  }, product.stock);
  const remaining   = Math.min(product.stock - cartQty, optionRemaining);
  const displayedPrice = selectedUnitPrice(product, variants);
  const oldPrice    = Math.round(displayedPrice * 1.23);
  const hasReviews  = product.reviewsCount > 0 && product.rating > 0;

  const productCats    = getProductCategories(product);
  const primaryCatId   = productCats[0] || product.category;
  const primaryCatName = CATEGORIES.find(c => c.id === primaryCatId)?.name?.[isArabic ? 'ar' : 'en'] || primaryCatId;
  const productUrl     = canonicalProductPath(product);

  const allVariantsSelected = !product.variants?.length ||
    product.variants.every((v: ProductVariant) => !v.isRequired || variants[v.nameEn]);

  useEffect(() => {
    // ── Canonical: always derive from the product's own categorySlug + slug
    // so client canonical matches the server canonical and the sitemap URL.
    // Using catSlug/primaryCatId (UI-derived) would diverge from the server
    // canonical and reintroduce duplicate-canonical GSC errors after hydration.
    const canonical = `https://vexatoys.com${canonicalProductPath(product)}`;
    const productName = product.nameEn || product.name || '';

    // ── Meta tags ──
    const title = `${productName} | Vexa Toys Lebanon`;
    document.title = title;
    const ratingSummary = hasReviews ? ` Rated ${Number(product.rating).toFixed(1)}/5 from ${product.reviewsCount} reviews.` : '';
    const desc = `${productName}, ${product.price.toFixed(2)} USD, ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}.${ratingSummary} Buy discreetly in Lebanon.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    const ogImg = getInitialImg(product.image);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogImg);

    // Twitter Card meta tags
    document.querySelector('meta[name="twitter:site"]')?.setAttribute('content', '@vexatoys');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', desc);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', ogImg);

    // ── JSON-LD: structured data with aggregateRating and verified reviews
    const jsonLd = generateProductJsonLd(product, {
      locale: language,
      canonicalUrl: canonical,
      categoryLabel: primaryCatName,
      catSlug: (product.categorySlug || primaryCatId || 'sex-toys').toLowerCase().replace(/\s+/g, '-'),
      name: productName,
      description: desc,
      images: [getInitialImg(product.image)],
    });

    let script = document.getElementById('vexa-product-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'vexa-product-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(jsonLd);
  }, [product, language, primaryCatName, primaryCatId, hasReviews]);

  useEffect(() => {
    let cancelled = false;

    // ① Reset to the best available image for this product immediately.
    //    Use store logo as placeholder so there is never an empty/spinner state.
    setImages([getInitialImg(product.image)]);
    setImgIdx(0);
    setImgsLoading(false); // no spinner, we always have something to show

    // ② Safety timeout, belt-and-suspenders in case Firebase hangs.
    const timeout = setTimeout(() => { if (!cancelled) setImgsLoading(false); }, 6000);

    // ③ Request guard: ignore responses that arrive after the product changed.
    fetchProductImages(product.id).then(imgs => {
      if (cancelled) return;
      if (imgs.length > 0) setImages(imgs);
      else setImages([getInitialImg(product.image)]); // always normalized through helper
    }).catch(() => {}).finally(() => {
      if (!cancelled) { clearTimeout(timeout); setImgsLoading(false); }
    });

    return () => { cancelled = true; clearTimeout(timeout); };
  }, [product.id]); // eslint-disable-line

  const handleAddToCart = () => {
    if (!allVariantsSelected) { setVariantError(true); return; }
    if (remaining > 0) addToCart(product, qty, Object.keys(variants).length ? variants : undefined);
  };

  const handleBuyNow = () => {
    if (!allVariantsSelected) { setVariantError(true); return; }
    if (remaining > 0) {
      addToCart(product, qty, Object.keys(variants).length ? variants : undefined);
      setView('checkout');
    }
  };

  const goBack = () => {
    // Use native history.back() so the browser pops the correct history entry
    // and the popstate listener in ShopContext restores scroll position.
    // Falls back to manual navigation if no prior history exists (e.g. direct link).
    let popped = false;
    const onPop = () => { popped = true; };
    window.addEventListener('popstate', onPop, { once: true });
    window.history.back();
    setTimeout(() => {
      window.removeEventListener('popstate', onPop);
      if (!popped) {
        // No history entry was popped (user arrived via direct link)
        if (primaryCatId) setActiveCategory(primaryCatId);
        setView('shop');
      }
    }, 150);
  };

  const waOrder = () => {
    const name = isArabic ? (product.name || product.nameEn) : (product.nameEn || product.name);
    const msg   = isArabic
      ? `مرحباً متجر فيكسا، لدي استفسار عن هذا المنتج:\n*${name}*\nhttps://vexatoys.com${productUrl}`
      : `Hello Vexa Toys, I have a question about this product:\n*${name}*\nhttps://vexatoys.com${productUrl}`;
    window.open('https://wa.me/96176730767?text=' + encodeURIComponent(msg), '_blank');
  };

  // Always derive share URL from canonical path -- never use product.link
  // (may contain www.vexatoys.com, causing 301 redirects detected by crawlers).
  const productFullLink = `https://vexatoys.com${productUrl}`;

  const selectedImg = images[imgIdx] || product.image || '';

  return (
    <div className="min-h-screen bg-black text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* ── Breadcrumb bar ── */}
      <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center gap-3">
        <button
          onClick={goBack}
          aria-label={isArabic ? 'رجوع' : 'Back'}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition text-sm font-bold shrink-0"
        >
          <ArrowLeft size={16} className={isArabic ? 'rotate-180' : ''} />
          {primaryCatName}
        </button>
        <span className="text-white/15">/</span>
        <span className="text-white/80 text-sm font-bold truncate">{displayName}</span>
      </nav>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10 lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:items-start space-y-6 lg:space-y-0">

        <div className="space-y-4 lg:sticky lg:top-24">
        {/* ── Image carousel ── */}
        <div className="relative bg-black rounded-3xl overflow-hidden aspect-square border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
          {imgsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-white/30" />
            </div>
          ) : selectedImg ? (
            <img
              src={selectedImg}
              alt={(isArabic ? product.imageAltsAr?.[imgIdx] : product.imageAltsEn?.[imgIdx]) || displayName}
              className="w-full h-full object-contain"
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1b1547] to-[#9d6cff]">
              <span className="text-4xl font-black tracking-widest">VEXA</span>
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                disabled={imgIdx === 0}
                className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} bg-black/50 hover:bg-black/80 rounded-full p-2 transition disabled:opacity-20`}
              >
                <ChevronLeft size={20} className={isArabic ? 'rotate-180' : ''} />
              </button>
              <button
                onClick={() => setImgIdx(i => Math.min(images.length - 1, i + 1))}
                disabled={imgIdx === images.length - 1}
                className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} bg-black/50 hover:bg-black/80 rounded-full p-2 transition disabled:opacity-20`}
              >
                <ChevronRight size={20} className={isArabic ? 'rotate-180' : ''} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`rounded-full transition-all ${i === imgIdx ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`} />
                ))}
              </div>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <span className="absolute top-3 ${isArabic ? 'left-3' : 'right-3'} bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">
              {imgIdx + 1}/{images.length}
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
            {images.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)} aria-label={`${isArabic ? 'عرض صورة' : 'Show image'} ${i + 1}`}
                className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${i === imgIdx ? 'border-white' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
        </div>

        {/* ── Product info ── */}
        <div className="space-y-5 lg:rounded-3xl lg:border lg:border-white/10 lg:bg-white/[0.04] lg:p-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d78] mb-2">{primaryCatName}</p>
            {/* H1 for SEO */}
            <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white tracking-tight">{displayName}</h1>
          </div>

          {/* Rating */}
          <a href="#reviews-section" className="flex items-center gap-2 w-fit" aria-label={hasReviews ? `${product.rating} out of 5 from ${product.reviewsCount} reviews` : (isArabic ? 'لا توجد تقييمات بعد، أضف أول تقييم' : 'No reviews yet, write the first review')}>
            <div className="flex gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14}
                  fill={hasReviews && i < Math.round(product.rating) ? 'currentColor' : 'none'}
                  className={hasReviews && i < Math.round(product.rating) ? '' : 'text-stone-600'} />
              ))}
            </div>
            {hasReviews ? (
              <>
                <span className="text-sm font-bold text-amber-400">{Number(product.rating).toFixed(1)}/5</span>
                <span className="text-sm text-stone-500">({product.reviewsCount} {isArabic ? 'تقييم' : 'reviews'})</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-stone-400 underline decoration-white/20 underline-offset-4">
                {isArabic ? 'لا توجد تقييمات بعد — أضف أول تقييم' : 'No reviews yet — write the first review'}
              </span>
            )}
          </a>

          {/* Price */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4 flex items-baseline gap-2.5 flex-wrap">
            <span className="text-3xl font-black text-white tracking-tight">${displayedPrice.toFixed(2)}</span>
            <span className="text-sm font-bold text-stone-500 line-through">${oldPrice.toFixed(2)}</span>
            <span className="text-xs font-bold text-stone-400">USD</span>
            <span className="text-[10px] font-black bg-gradient-to-r from-rose-500 to-red-600 text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_4px_14px_-4px_rgba(225,29,72,0.6)]">
              {isArabic ? `وفّر ${Math.round((1 - displayedPrice / oldPrice) * 100)}٪` : `Save ${Math.round((1 - displayedPrice / oldPrice) * 100)}%`}
            </span>
          </div>

          {/* Stock */}
          {remaining > 0 && remaining <= 5 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
              <span className="text-sm font-bold text-amber-400">{isArabic ? `متبقي ${remaining} فقط` : `Only ${remaining} left`}</span>
            </div>
          )}
          {remaining <= 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-sm font-bold text-red-400">{isArabic ? 'نفذ المخزون' : 'Out of stock'}</span>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            {[
              { icon: <Lock size={17} />, ar: 'الدفع عند\nالاستلام', en: 'Cash on\nDelivery', color: 'text-emerald-400' },
              { icon: <PackageCheck size={17} />, ar: 'قابل\nللاسترجاع', en: 'Returnable', color: 'text-sky-400' },
              { icon: <Truck size={17} />, ar: 'توصيل سري\nوسريع', en: 'Discreet &\nFast', color: 'text-[#ff2d78]' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 py-4 px-1 bg-white/[0.04] hover:border-white/20 transition">
                <span className={`${item.color} flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06]`}>{item.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-wide text-stone-400 leading-tight whitespace-pre-line">
                  {isArabic ? item.ar : item.en}
                </span>
              </div>
            ))}
          </div>

          {/* Variants */}
          {product.variants?.map((v: ProductVariant) => (
            <div key={v.nameEn}>
              <p className="text-xs font-black text-stone-300 mb-2">
                {isArabic ? v.name : (v.nameEn || v.name)}
                {v.isRequired && !variants[v.nameEn] && variantError && (
                  <span className="text-red-400 ms-1">({isArabic ? 'مطلوب' : 'required'})</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {v.options.map(opt => (
                  <button key={opt} type="button"
                    onClick={() => { setVariants(prev => ({ ...prev, [v.nameEn]: opt })); setVariantError(false); setQty(1); }}
                    disabled={v.optionStock?.[opt] === 0}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full border-2 transition ${
                      variants[v.nameEn] === opt
                        ? 'bg-[#ff2d78] text-white border-[#ff2d78]'
                        : 'border-white/20 text-white/70 hover:border-[#ff2d78]/60'
                    }`}>
                    {opt}{v.optionPriceDeltas?.[opt] ? ` (${v.optionPriceDeltas[opt] > 0 ? '+' : ''}$${v.optionPriceDeltas[opt].toFixed(2)})` : ''}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          {remaining > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-black text-stone-300">{isArabic ? 'الكمية' : 'Quantity'}</span>
              <div className="flex items-center border border-white/20 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}
                  aria-label={isArabic ? 'تقليل الكمية' : 'Decrease quantity'}
                  className="px-3 py-2 text-white/50 hover:text-white hover:bg-white/10 transition disabled:opacity-30">
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 font-black text-white min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(remaining, q + 1))} disabled={qty >= remaining}
                  aria-label={isArabic ? 'زيادة الكمية' : 'Increase quantity'}
                  className="px-3 py-2 text-white/50 hover:text-white hover:bg-white/10 transition disabled:opacity-30">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <button onClick={handleAddToCart}
              disabled={remaining <= 0}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black transition active:scale-[0.98] ${
                remaining <= 0 ? 'bg-white/10 text-stone-500 cursor-not-allowed'
                  : variantError ? 'bg-red-600 text-white'
                  : 'bg-[#ff2d78] hover:bg-[#e11d48] text-white shadow-[0_8px_24px_-8px_rgba(255,45,120,0.5)]'
              }`}>
              <ShoppingCart size={17} />
              {remaining <= 0
                ? (isArabic ? 'نفذ المخزون' : 'Out of stock')
                : variantError
                ? (isArabic ? 'اختر الخيارات' : 'Select options first')
                : (isArabic ? 'إضافة للسلة' : 'Add to cart')}
            </button>

            {remaining > 0 && (
              <button onClick={handleBuyNow}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-700 hover:to-rose-600 transition active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(225,29,72,0.6)]">
                <Zap size={16} fill="currentColor" />
                {isArabic ? 'شراء الآن' : 'Buy it now'}
              </button>
            )}

            <button onClick={waOrder}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white transition active:scale-[0.98] shadow-[0_8px_24px_-10px_rgba(37,211,102,0.5)]">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.845-1.587-5.921.003-6.556 5.338-11.891 11.893-11.891 3.176.001 6.165 1.236 8.413 3.484 2.248 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.544.916 3.21 1.399 4.909 1.4 5.424 0 9.835-4.411 9.838-9.835.002-2.628-1.021-5.1-2.88-6.958-1.859-1.859-4.331-2.88-6.955-2.881-5.423 0-9.835 4.412-9.838 9.836-.001 1.79.491 3.535 1.425 5.047l-1.012 3.7 3.784-.993zm11.458-7.228c-.312-.156-1.847-.91-2.132-1.014-.285-.104-.492-.156-.7.156-.207.312-.802 1.014-.983 1.221-.181.208-.363.234-.675.078-.312-.156-1.317-.485-2.51-1.549-.928-.827-1.554-1.849-1.736-2.161-.182-.312-.02-.481.136-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.207.052-.39-.026-.546-.078-.156-.7-1.688-.959-2.311-.253-.61-.51-.527-.7-.537-.182-.01-.39-.01-.597-.01-.208 0-.545.078-.83.39-.285.312-1.089 1.065-1.089 2.597 0 1.533 1.115 3.013 1.271 3.221.156.208 2.193 3.349 5.313 4.699.742.32 1.32.512 1.77.654.745.237 1.423.204 1.959.124.597-.089 1.847-.754 2.108-1.442.261-.689.261-1.274.182-1.39-.078-.118-.285-.182-.597-.338z"/>
              </svg>
              {isArabic ? 'اسأل عبر واتساب' : 'Ask on WhatsApp'}
            </button>

            {/* 🔗 Shareable product link 🔗 */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <Link2 size={13} className="shrink-0 text-stone-500" />
              <a
                href={productFullLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-xs text-stone-500 hover:text-white transition"
              >
                {productFullLink}
              </a>
              <button
                type="button"
                title={isArabic ? 'نسخ الرابط' : 'Copy link'}
                onClick={() => { try { navigator.clipboard.writeText(productFullLink); } catch {} }}
                className="shrink-0 text-stone-500 hover:text-white transition p-1"
              >
                <Copy size={13} />
              </button>
            </div>
          </div>

          {/* Delivery accordion */}
          <div className="border-t border-white/10 pt-4">
            <button type="button"
              onClick={() => setDeliveryOpen(v => !v)}
              className="flex w-full items-center justify-between py-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/50 flex items-center gap-2">
                <ShieldCheck size={13} />
                {isArabic ? 'معلومات التوصيل' : 'DELIVERY INFO'}
              </span>
              <ChevronDown size={15} className={`text-white/50 transition-transform ${deliveryOpen ? 'rotate-180' : ''}`} />
            </button>
            {deliveryOpen && (
              <div className="pt-2 pb-4 space-y-3 text-sm text-stone-400 leading-relaxed">
                {isArabic ? (
                  <>
                    <p><span className="font-black text-white">توصيل سري في بيروت:</span> نفس اليوم.</p>
                    <p><span className="font-black text-white">كل لبنان:</span> خلال 24-72 ساعة.</p>
                    <p><span className="font-black text-white">التغليف:</span> كرتون عادي مغلق بدون أي إشارة للمحتوى.</p>
                    <p><span className="font-black text-white">الدفع:</span> نقداً أو بالشبكة عند الاستلام.</p>
                  </>
                ) : (
                  <>
                    <p><span className="font-black text-white">Beirut:</span> Same-day discreet delivery.</p>
                    <p><span className="font-black text-white">All Lebanon:</span> Within 24–72 hours.</p>
                    <p><span className="font-black text-white">Packaging:</span> Plain sealed box, no store name or logo.</p>
                    <p><span className="font-black text-white">Payment:</span> Cash or card on delivery.</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {displayDesc && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500 mb-3">
                {isArabic ? 'تفاصيل المنتج' : 'PRODUCT DETAILS'}
              </p>
              <p className="text-sm text-stone-400 leading-relaxed">{displayDesc}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <ProductReviews product={product} isArabic={isArabic} />
      </div>
    </div>
  );
};

export const ProductPage: React.FC = () => {
  const { selectedProduct, isProductsLoading, setView } = useShop();

  if (isProductsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/60 mx-auto mb-4" />
          <p className="text-stone-500 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-stone-300 text-lg font-bold">Product not found</p>
          <p className="text-stone-500 text-sm">This product may no longer be available.</p>
          <button
            onClick={() => setView('shop')}
            className="text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  return <ProductPageContent product={selectedProduct} />;
};
