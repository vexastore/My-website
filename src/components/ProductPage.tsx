import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, ProductVariant } from '../types';
import { CATEGORIES, getProductCategories, productMatchesCategory } from '../data/categories';
import { buildProductDescription, buildProductTitle, canonicalProductPath, shortProductName } from '@/lib/productSeo';
import { localizePath, pageAlternates } from '@/lib/localePath';
import { CATEGORY_TO_SLUG, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { generateProductJsonLd } from '@/lib/productSchema';
import { careTips, extractSpecs, productFaqs } from '@/lib/productContent';
import { ProductReviews } from './ProductReviews';
import { ProductCard } from './ProductCard';
import { selectedUnitPrice } from '../utils/pricing';
import {
  Star, ShoppingCart, Zap, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  Truck, Lock, PackageCheck, Minus, Plus, ShieldCheck, Link2, Copy, MessageCircle,
} from 'lucide-react';

const PRODUCT_FALLBACK_IMG = 'https://vexatoys.com/vexa-logo.jpg';
const getInitialImg = (img: string | undefined | null): string =>
  img && (img.startsWith('data:image/') || img.startsWith('http')) ? img : PRODUCT_FALLBACK_IMG;

const ProductPageContent: React.FC<{ product: Product }> = ({ product }) => {
  const {
    language, cart, addToCart, fetchProductImages,
    arTranslations, setView, setActiveCategory, products, localizeHref } = useShop();
  const isArabic = language === 'ar';

  const [images, setImages]             = useState<string[]>([getInitialImg(product.image)]);
  const [imgIdx, setImgIdx]             = useState(0);
  const [variants, setVariants]         = useState<Record<string, string>>({});
  const [variantError, setVariantError] = useState(false);
  const [qty, setQty]                   = useState(1);
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
  const remaining      = Math.min(product.stock - cartQty, optionRemaining);
  const displayedPrice = selectedUnitPrice(product, variants);
  // A "was" price is shown only when the catalog has one above the current price.
  const wasPrice       = product.compareAtPrice && product.compareAtPrice > displayedPrice ? product.compareAtPrice : null;
  const hasReviews     = product.reviewsCount > 0 && product.rating > 0;

  // The canonical category (the one in the URL) leads; fall back to the first assigned category.
  const productCats    = getProductCategories(product);
  const primaryCatId   = (product.categorySlug && SLUG_TO_CATEGORY[product.categorySlug]) || productCats[0] || product.category;
  const primaryCatName = CATEGORIES.find(c => c.id === primaryCatId)?.name?.[isArabic ? 'ar' : 'en'] || primaryCatId;
  const primaryCatSlug = product.categorySlug || CATEGORY_TO_SLUG[primaryCatId] || 'sex-toys';
  const productUrl     = localizePath(canonicalProductPath(product), isArabic ? 'ar' : 'en');
  const productFullLink = `https://vexatoys.com${productUrl}`;

  const specs   = extractSpecs(product, isArabic);
  const care    = careTips(product, isArabic);
  const faqs    = productFaqs(product, isArabic);
  const related = products
    .filter(p => p.id !== product.id && p.stock > 0 && productMatchesCategory(p, primaryCatId))
    .slice(0, 4);

  const allVariantsSelected = !product.variants?.length ||
    product.variants.every((v: ProductVariant) => !v.isRequired || variants[v.nameEn]);

  useEffect(() => {
    // Keep the client-side document metadata identical to what the server rendered
    // (app/[category]/[slug]/page.tsx), so hydration never swaps the SEO title for a generic one.
    const canonical = pageAlternates(canonicalProductPath(product), isArabic ? 'ar' : 'en').canonical;
    const name = (isArabic ? product.name : product.nameEn) || product.nameEn || product.name || '';
    const brand = isArabic ? 'متجر فيكسا لبنان' : 'Vexa Toys Lebanon';
    const storedTitle = ((isArabic ? product.seoTitleAr : product.seoTitleEn) || '').replace(/\s+/g, ' ').trim();
    const title = storedTitle && storedTitle.length <= 70 ? storedTitle : buildProductTitle(name, brand);
    const storedDescription = ((isArabic ? product.seoDescriptionAr : product.seoDescriptionEn) || '').replace(/\s+/g, ' ').trim();
    const sourceDescription = ((isArabic ? product.description : product.descriptionEn) || product.description || '').replace(/\s+/g, ' ').trim();
    const desc = storedDescription && storedDescription.length <= 170
      ? storedDescription
      : buildProductDescription(
          isArabic ? `تسوق ${shortProductName(name)} في لبنان من متجر فيكسا.` : `Buy ${shortProductName(name)} in Lebanon from Vexa Toys.`,
          sourceDescription,
          isArabic ? 'توصيل سري ودفع عند الاستلام.' : 'Discreet delivery across Lebanon, cash on delivery.',
        );

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    const ogImg = product.ogImageUrl || getInitialImg(product.image);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogImg);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', desc);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', ogImg);

    const jsonLd = generateProductJsonLd(product, {
      locale: language,
      canonicalUrl: canonical,
      categoryLabel: primaryCatName,
      catSlug: primaryCatSlug,
      name,
      description: sourceDescription || desc,
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
  }, [product, language, isArabic, primaryCatName, primaryCatSlug]);

  useEffect(() => {
    let cancelled = false;
    setImages([getInitialImg(product.image)]);
    setImgIdx(0);
    fetchProductImages(product.id).then(imgs => {
      if (cancelled) return;
      setImages(imgs.length > 0 ? imgs : [getInitialImg(product.image)]);
    }).catch(() => {});
    return () => { cancelled = true; };
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
    let popped = false;
    const onPop = () => { popped = true; };
    window.addEventListener('popstate', onPop, { once: true });
    window.history.back();
    setTimeout(() => {
      window.removeEventListener('popstate', onPop);
      if (!popped) {
        if (primaryCatId) setActiveCategory(primaryCatId);
        setView('shop');
      }
    }, 150);
  };

  const waOrder = () => {
    const name = isArabic ? (product.name || product.nameEn) : (product.nameEn || product.name);
    const msg = isArabic
      ? `مرحباً متجر فيكسا، لدي استفسار عن هذا المنتج:\n*${name}*\n${productFullLink}`
      : `Hello Vexa Toys, I have a question about this product:\n*${name}*\n${productFullLink}`;
    window.open('https://wa.me/96176730767?text=' + encodeURIComponent(msg), '_blank');
  };

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || images.length < 2) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 40) setImgIdx(i => Math.min(images.length - 1, Math.max(0, i + (delta < 0 ? 1 : -1))));
    touchX.current = null;
  };

  const selectedImg = images[imgIdx] || product.image || '';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-vexa-ink text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="sticky top-0 z-30 border-b border-white/10 bg-vexa-ink/85 backdrop-blur-xl">
        <div className="vexa-container flex items-center gap-2 py-3 text-xs text-stone-400">
          <button onClick={goBack} aria-label={isArabic ? 'رجوع' : 'Back'} className="flex shrink-0 items-center text-stone-300 transition hover:text-white">
            <ArrowLeft size={16} className={isArabic ? 'rotate-180' : ''} />
          </button>
          <a href={localizeHref('/')} className="transition hover:text-white">{isArabic ? 'المتجر' : 'Store'}</a>
          <span aria-hidden="true">/</span>
          <a href={localizeHref(`/${primaryCatSlug}`)} onClick={e => { e.preventDefault(); setActiveCategory(primaryCatId); }} className="transition hover:text-white">{primaryCatName}</a>
          <span aria-hidden="true">/</span>
          <span className="truncate font-semibold text-stone-200">{displayName}</span>
        </div>
      </nav>

      <div className="vexa-container py-6 sm:py-10 lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-12">
        {/* Gallery */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div
            className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-vexa-surface shadow-vexa-card"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={selectedImg}
              alt={(isArabic ? product.imageAltsAr?.[imgIdx] : product.imageAltsEn?.[imgIdx]) || displayName}
              width={800}
              height={800}
              className="h-full w-full object-contain"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => Math.max(0, i - 1))} disabled={imgIdx === 0} aria-label={isArabic ? 'الصورة السابقة' : 'Previous image'}
                  className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} rounded-full bg-vexa-ink/60 p-2 transition hover:bg-vexa-ink/90 disabled:opacity-20`}>
                  <ChevronLeft size={20} className={isArabic ? 'rotate-180' : ''} />
                </button>
                <button onClick={() => setImgIdx(i => Math.min(images.length - 1, i + 1))} disabled={imgIdx === images.length - 1} aria-label={isArabic ? 'الصورة التالية' : 'Next image'}
                  className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} rounded-full bg-vexa-ink/60 p-2 transition hover:bg-vexa-ink/90 disabled:opacity-20`}>
                  <ChevronRight size={20} className={isArabic ? 'rotate-180' : ''} />
                </button>
                <span className="absolute end-3 top-3 rounded-full bg-vexa-ink/60 px-2 py-1 text-xs font-bold">{imgIdx + 1}/{images.length}</span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} aria-label={`${isArabic ? 'عرض صورة' : 'Show image'} ${i + 1}`}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${i === imgIdx ? 'border-vexa-pink' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="" width={64} height={64} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div className="mt-6 space-y-6 lg:mt-0 lg:rounded-3xl lg:border lg:border-white/10 lg:bg-vexa-surface lg:p-8">
          <div>
            <a href={localizeHref(`/${primaryCatSlug}`)} onClick={e => { e.preventDefault(); setActiveCategory(primaryCatId); }} className="vexa-eyebrow hover:text-vexa-pink-hover">{primaryCatName}</a>
            <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">{displayName}</h1>
            {hasReviews && (
              <a href="#reviews-section" className="mt-3 flex w-fit items-center gap-2" aria-label={`${product.rating} out of 5 from ${product.reviewsCount} reviews`}>
                <span className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} className={i < Math.round(product.rating) ? '' : 'text-stone-600'} />
                  ))}
                </span>
                <span className="text-sm font-bold text-amber-400">{Number(product.rating).toFixed(1)}/5</span>
                <span className="text-sm text-stone-400">({product.reviewsCount} {isArabic ? 'تقييم' : 'reviews'})</span>
              </a>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2.5 rounded-2xl border border-white/10 bg-vexa-raised p-4">
            <span className="text-3xl font-black tracking-tight text-white">${displayedPrice.toFixed(2)}</span>
            <span className="text-xs font-bold text-stone-400">USD</span>
            {wasPrice && (
              <>
                <span className="text-sm font-bold text-stone-500 line-through">${wasPrice.toFixed(2)}</span>
                <span className="rounded-full bg-vexa-pink px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  {isArabic ? `وفّر ${Math.round((1 - displayedPrice / wasPrice) * 100)}٪` : `Save ${Math.round((1 - displayedPrice / wasPrice) * 100)}%`}
                </span>
              </>
            )}
            <span className="ms-auto text-xs font-semibold text-stone-400">{isArabic ? 'الدفع عند الاستلام' : 'Cash on delivery'}</span>
          </div>

          {/* Stock */}
          {remaining > 0 && remaining <= 5 && (
            <p className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" />
              {isArabic ? `متبقي ${remaining} فقط` : `Only ${remaining} left`}
            </p>
          )}
          {remaining <= 0 && (
            <p className="flex items-center gap-2 text-sm font-bold text-red-400">
              <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
              {isArabic ? 'نفذ المخزون' : 'Out of stock'}
            </p>
          )}

          {/* Verified assurances */}
          <ul className="grid grid-cols-3 gap-2.5 text-center">
            {[
              { icon: <Lock size={17} />, ar: 'الدفع عند\nالاستلام', en: 'Cash on\ndelivery', href: '/delivery' },
              { icon: <PackageCheck size={17} />, ar: 'إرجاع خلال\n7 أيام', en: '7-day\nreturns', href: '/returns' },
              { icon: <Truck size={17} />, ar: 'تغليف سري\nبلا شعار', en: 'Plain sealed\npackaging', href: '/privacy' },
            ].map((item, i) => (
              <li key={i}>
                <a href={localizeHref(item.href)} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-vexa-raised px-1 py-4 transition hover:border-vexa-pink/50">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-vexa-pink">{item.icon}</span>
                  <span className="whitespace-pre-line text-[9px] font-black uppercase leading-tight tracking-wide text-stone-300">{isArabic ? item.ar : item.en}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Variants */}
          {product.variants?.map((v: ProductVariant) => (
            <div key={v.nameEn}>
              <p className="mb-2 text-xs font-black text-stone-300">
                {isArabic ? v.name : (v.nameEn || v.name)}
                {v.isRequired && !variants[v.nameEn] && variantError && (
                  <span className="ms-1 text-red-400">({isArabic ? 'مطلوب' : 'required'})</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {v.options.map(opt => (
                  <button key={opt} type="button"
                    onClick={() => { setVariants(prev => ({ ...prev, [v.nameEn]: opt })); setVariantError(false); setQty(1); }}
                    disabled={v.optionStock?.[opt] === 0}
                    className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold transition disabled:opacity-30 ${
                      variants[v.nameEn] === opt ? 'border-vexa-pink bg-vexa-pink text-white' : 'border-white/20 text-white/70 hover:border-vexa-pink/60'
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
              <div className="flex items-center overflow-hidden rounded-xl border border-white/20">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} aria-label={isArabic ? 'تقليل الكمية' : 'Decrease quantity'}
                  className="px-3 py-2 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-30"><Minus size={14} /></button>
                <span className="min-w-[3rem] px-4 py-2 text-center font-black text-white">{qty}</span>
                <button onClick={() => setQty(q => Math.min(remaining, q + 1))} disabled={qty >= remaining} aria-label={isArabic ? 'زيادة الكمية' : 'Increase quantity'}
                  className="px-3 py-2 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-30"><Plus size={14} /></button>
              </div>
            </div>
          )}

          {/* Calls to action */}
          <div className="space-y-3 pt-1">
            <button onClick={handleAddToCart} disabled={remaining <= 0}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-black uppercase tracking-[0.12em] transition active:scale-[0.98] ${
                remaining <= 0 ? 'cursor-not-allowed bg-white/10 text-stone-500'
                  : variantError ? 'bg-red-600 text-white'
                  : 'bg-vexa-pink text-white shadow-vexa-glow hover:bg-vexa-pink-hover'
              }`}>
              <ShoppingCart size={17} />
              {remaining <= 0 ? (isArabic ? 'نفذ المخزون' : 'Out of stock') : variantError ? (isArabic ? 'اختر الخيارات' : 'Select options first') : (isArabic ? 'إضافة للسلة' : 'Add to cart')}
            </button>
            {remaining > 0 && (
              <button onClick={handleBuyNow} className="vexa-btn-secondary w-full py-3.5">
                <Zap size={16} />
                {isArabic ? 'شراء الآن' : 'Buy it now'}
              </button>
            )}
            <button onClick={waOrder} className="flex w-full items-center justify-center gap-2 rounded-full bg-vexa-whatsapp py-3 text-sm font-bold text-black transition hover:brightness-95 active:scale-[0.98]">
              <MessageCircle size={16} />
              {isArabic ? 'اسأل عبر واتساب' : 'Ask on WhatsApp'}
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-vexa-raised px-3 py-2.5">
              <Link2 size={13} className="shrink-0 text-stone-500" />
              <a href={productFullLink} className="flex-1 truncate text-xs text-stone-500 transition hover:text-white">{productFullLink}</a>
              <button type="button" title={isArabic ? 'نسخ الرابط' : 'Copy link'} onClick={() => { try { navigator.clipboard.writeText(productFullLink); } catch {} }} className="shrink-0 p-1 text-stone-500 transition hover:text-white">
                <Copy size={13} />
              </button>
            </div>
          </div>

          {/* Delivery summary */}
          <div className="rounded-2xl border border-white/10 bg-vexa-raised p-4 text-sm text-stone-300">
            <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-stone-400"><ShieldCheck size={13} /> {isArabic ? 'التوصيل والخصوصية' : 'Delivery and privacy'}</p>
            <ul className="space-y-1.5 leading-6">
              <li>{isArabic ? 'بيروت: توصيل سري في نفس اليوم. باقي لبنان: خلال 24 إلى 72 ساعة.' : 'Beirut: same-day discreet delivery. Rest of Lebanon: 24 to 72 hours.'}</li>
              <li>{isArabic ? 'كرتون عادي مغلق بلا شعار أو اسم منتج.' : 'Plain sealed box, no logo and no product name.'}</li>
              <li>{isArabic ? 'الدفع نقداً عند الاستلام بالدولار أو الليرة.' : 'Pay cash on delivery in USD or LBP.'}</li>
            </ul>
            <a href={localizeHref('/delivery')} className="vexa-link mt-2 inline-block text-xs">{isArabic ? 'سياسة التوصيل الكاملة' : 'Full delivery policy'}</a>
          </div>
        </div>
      </div>

      {/* Details, specs, care, FAQ */}
      <section className="border-t border-white/10">
        <div className="vexa-container vexa-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="vexa-h2">{isArabic ? 'تفاصيل المنتج' : 'Product details'}</h2>
            <div className="vexa-h2-bar" />
            {displayDesc && <p className="mt-5 whitespace-pre-line text-base leading-8 text-stone-300">{displayDesc}</p>}

            {specs.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map(row => (
                      <tr key={row.label.en} className="border-b border-white/10 last:border-0">
                        <th scope="row" className="w-1/3 bg-vexa-raised px-4 py-3 text-start font-bold text-white">{isArabic ? row.label.ar : row.label.en}</th>
                        <td className="px-4 py-3 text-stone-300">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h3 className="mt-10 text-lg font-bold text-white">{isArabic ? 'الاستخدام والعناية' : 'How to use and care for it'}</h3>
            <ul className="mt-3 space-y-2">
              {care.map(tip => (
                <li key={tip} className="flex gap-3 text-sm leading-7 text-stone-300">
                  <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-vexa-pink" />
                  {tip}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-stone-500">
              <a href={localizeHref('/blog/tips/sex-toy-cleaning-care')} className="vexa-link">{isArabic ? 'دليل التنظيف والعناية الكامل' : 'Full cleaning and care guide'}</a>
              {' · '}
              <a href={localizeHref('/lubricants')} className="vexa-link">{isArabic ? 'المزلقات المناسبة' : 'Compatible lubricants'}</a>
            </p>
          </div>

          <aside className="lg:col-span-5">
            <div className="vexa-card divide-y divide-white/10 px-5">
              <p className="py-4 text-xs font-black uppercase tracking-[0.2em] text-stone-400">{isArabic ? 'أسئلة قبل الطلب' : 'Questions before you order'}</p>
              {faqs.map((faq, index) => (
                <details key={faq.q} className="group py-4" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-stone-100 transition-colors hover:text-vexa-pink">
                    <span>{faq.q}</span>
                    <span aria-hidden="true" className="shrink-0 text-xl font-light text-stone-400 transition-transform group-open:rotate-45 group-open:text-vexa-pink">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{faq.a}</p>
                </details>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-white/10">
          <div className="vexa-container vexa-section">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="vexa-eyebrow">{isArabic ? 'من نفس الفئة' : 'From the same category'}</p>
                <h2 className="vexa-h2 mt-2">{isArabic ? `المزيد من ${primaryCatName}` : `More ${primaryCatName}`}</h2>
                <div className="vexa-h2-bar" />
              </div>
              <a href={localizeHref(`/${primaryCatSlug}`)} onClick={e => { e.preventDefault(); setActiveCategory(primaryCatId); }} className="group inline-flex items-center gap-1 text-xs font-bold text-stone-400 transition hover:text-white">
                {isArabic ? `كل ${primaryCatName}` : `All ${primaryCatName}`}
                <ArrowIcon size={14} className={`transition-transform ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <div className="vexa-container pb-12">
        <ProductReviews product={product} isArabic={isArabic} />
      </div>
    </div>
  );
};

export const ProductPage: React.FC = () => {
  const { selectedProduct, isProductsLoading, setView, language, localizeHref } = useShop();
  const isArabic = language === 'ar';

  if (isProductsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
          <p className="text-sm text-stone-500">{isArabic ? 'جارٍ تحميل المنتج...' : 'Loading product...'}</p>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-lg font-bold text-stone-300">{isArabic ? 'المنتج غير موجود' : 'Product not found'}</p>
          <p className="text-sm text-stone-500">{isArabic ? 'قد لا يكون هذا المنتج متاحاً بعد الآن.' : 'This product may no longer be available.'}</p>
          <button onClick={() => setView('shop')} className="vexa-btn-secondary">{isArabic ? 'العودة إلى المتجر' : 'Back to store'}</button>
        </div>
      </div>
    );
  }

  return <ProductPageContent product={selectedProduct} />;
};
