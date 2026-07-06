import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, ProductVariant } from '../types';
import { CATEGORIES, getProductCategories } from '../data/categories';
import {
  Star, ShoppingCart, Zap, ChevronLeft, ChevronRight, ArrowLeft,
  Truck, Lock, PackageCheck, Minus, Plus, Loader2, ShieldCheck, ChevronDown, X, Link2, Copy
} from 'lucide-react';

function toSlug(name: string): string {
  return (name || '').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60);
}

const ProductPageContent: React.FC<{ product: Product }> = ({ product }) => {
  const {
    language, cart, addToCart, fetchProductImages,
    arTranslations, setView, setActiveCategory,
  } = useShop();
  const isArabic = language === 'ar';

  const hasInitialImage = !!(product.image && (product.image.startsWith('data:image/') || product.image.startsWith('http')));
  const [images, setImages]             = useState<string[]>(hasInitialImage ? [product.image!] : []);
  const [imgIdx, setImgIdx]             = useState(0);
  // Start loading=false if we already have an image — avoids spinner flash on initial render.
  // Firebase may still update the images list in the background.
  const [imgsLoading, setImgsLoading]   = useState(!hasInitialImage);
  const [variants, setVariants]         = useState<Record<string, string>>({});
  const [variantError, setVariantError] = useState(false);
  const [qty, setQty]                   = useState(1);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const touchX = useRef<number | null>(null);

  const arT         = arTranslations[product.id];
  const displayName = isArabic ? (arT?.name || product.name || product.nameEn) : (product.nameEn || product.name);
  const displayDesc = isArabic ? (arT?.description || product.description || product.descriptionEn) : (product.descriptionEn || product.description);
  const cartQty     = cart.find(i => i.product.id === product.id)?.quantity ?? 0;
  const remaining   = product.stock - cartQty;
  const oldPrice    = Math.round(product.price * 1.23);

  const productCats    = getProductCategories(product);
  const primaryCatId   = productCats[0] || product.category;
  const primaryCatName = CATEGORIES.find(c => c.id === primaryCatId)?.name?.[isArabic ? 'ar' : 'en'] || primaryCatId;
  const catSlug        = (primaryCatId || 'sex-toys').toLowerCase().replace(/\s+/g, '-');
  const productSlug    = (product as Product & { slug?: string }).slug || toSlug(product.nameEn || product.name || '');
  const productUrl     = `/${catSlug}/${productSlug}`;

  const allVariantsSelected = !product.variants?.length ||
    product.variants.every((v: ProductVariant) => variants[v.name]);

  useEffect(() => {
    const slug = (product as Product & { slug?: string }).slug || toSlug(product.nameEn || product.name || '');
    const canonical = `https://vexatoys.com${productUrl}`;

    // ── Meta tags ──
    const title = `${product.nameEn || product.name} | Vexa Store Lebanon`;
    document.title = title;
    const desc = `${product.nameEn || product.name} — $${product.price.toFixed(2)} USD — ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}. Rated ${product.rating}/5. Buy discreetly in Lebanon.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    if (product.image && !product.image.startsWith('data:')) {
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', product.image);
    }

    // Twitter Card meta tags
    document.querySelector('meta[name="twitter:site"]')?.setAttribute('content', '@vexastore');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', desc);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', product.image || 'https://vexatoys.com/opengraph.jpg');

    // ── JSON-LD Product schema ──
    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.nameEn || product.name,
      alternateName: product.name || product.nameEn,
      description: product.descriptionEn || product.description,
      image: (product.image && !product.image.startsWith('data:')) ? [product.image] : [],
      sku: product.id,
      brand: { '@type': 'Brand', name: 'Vexa Store Lebanon' },
      offers: {
        '@type': 'Offer',
        price: product.price.toFixed(2),
        priceCurrency: 'USD',
        availability: product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: canonical,
        seller: { '@type': 'Organization', name: 'Vexa Store Lebanon', url: 'https://vexatoys.com' },
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Vexa Store Lebanon', item: 'https://vexatoys.com/' },
          { '@type': 'ListItem', position: 2, name: product.nameEn || product.name, item: canonical },
        ],
      },
    };
    if (product.reviewsCount > 0) {
      jsonLd.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewsCount,
        bestRating: 5,
        worstRating: 1,
      };
    }

    const existing = document.getElementById('vexa-product-jsonld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'vexa-product-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => { document.getElementById('vexa-product-jsonld')?.remove(); };
  }, [product]);

  useEffect(() => {
    // Only show the spinner while fetching if we don't already have an image to display.
    const alreadyHasImage = images.length > 0;
    if (!alreadyHasImage) setImgsLoading(true);

    // Safety timeout: always clear spinner within 6 s even if Firebase hangs.
    const timeout = setTimeout(() => setImgsLoading(false), 6000);

    fetchProductImages(product.id).then(imgs => {
      if (imgs.length > 0) setImages(imgs);
      else if (product.image) setImages([product.image]);
    }).catch(() => {}).finally(() => {
      clearTimeout(timeout);
      setImgsLoading(false);
    });

    return () => clearTimeout(timeout);
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
    if (primaryCatId) setActiveCategory(primaryCatId);
    setView('shop');
  };

  const waOrder = () => {
    const name = isArabic ? (product.name || product.nameEn) : (product.nameEn || product.name);
    const slug  = (product as Product & { slug?: string }).slug || toSlug(product.nameEn || product.name || '');
    const msg   = isArabic
      ? `مرحباً متجر فيكسا، أريد الطلب:\n*${name}*\nالسعر: $${product.price.toFixed(2)} USD\nhttps://vexatoys.com${productUrl}`
      : `Hello Vexa Store, I want to order:\n*${name}*\nPrice: $${product.price.toFixed(2)} USD\nhttps://vexatoys.com${productUrl}`;
    window.open('https://wa.me/96176730767?text=' + encodeURIComponent(msg), '_blank');
  };

  const productSlugForLink = (product as Product & { slug?: string }).slug || toSlug(product.nameEn || product.name || '');
  const productFullLink = (product as Product & { link?: string }).link || `https://vexatoys.com${productUrl}`;

  const selectedImg = images[imgIdx] || product.image || '';

  return (
    <div className="min-h-screen bg-[#050101] text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* ── Breadcrumb bar ── */}
      <nav className="sticky top-0 z-30 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={goBack}
          aria-label={isArabic ? 'رجوع' : 'Back'}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition text-sm font-bold"
        >
          <ArrowLeft size={16} className={isArabic ? 'rotate-180' : ''} />
          {primaryCatName}
        </button>
        <span className="text-white/20">/</span>
        <span className="text-white/80 text-sm font-bold truncate max-w-[200px]">{displayName}</span>
      </nav>

      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">

        {/* ── Image carousel ── */}
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
          {imgsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-white/30" />
            </div>
          ) : selectedImg ? (
            <img
              src={selectedImg}
              alt={isArabic ? `شراء ${displayName} في لبنان — متجر فيكسا` : `Buy ${displayName} in Lebanon — Vexa Store`}
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
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {images.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === imgIdx ? 'border-white' : 'border-white/10 opacity-60'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        {/* ── Product info ── */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-1">{primaryCatName}</p>
            {/* H1 for SEO */}
            <h1 className="text-xl font-black leading-tight text-white">{displayName}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  className={i < Math.floor(product.rating) ? '' : 'text-stone-600'} />
              ))}
            </div>
            <span className="text-sm font-bold text-amber-400">{product.rating}/5</span>
            <span className="text-sm text-stone-500">({product.reviewsCount} {isArabic ? 'تقييم' : 'reviews'})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-white">${product.price.toFixed(2)}</span>
            <span className="text-sm font-bold text-stone-500 line-through">${oldPrice.toFixed(2)}</span>
            <span className="text-xs font-bold text-stone-400">USD</span>
            <span className="text-[10px] font-black bg-white text-black px-2 py-0.5 rounded-full uppercase tracking-wider">Sale</span>
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
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { icon: <Lock size={18} />, ar: 'الدفع عند\nالاستلام', en: 'Cash on\nDelivery' },
              { icon: <PackageCheck size={18} />, ar: 'قابل\nللاسترجاع', en: 'Returnable' },
              { icon: <Truck size={18} />, ar: 'توصيل سري\nوسريع', en: 'Discreet &\nFast' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 py-3 px-1 bg-white/5">
                <span className="text-stone-400">{item.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-wide text-stone-400 leading-tight whitespace-pre-line">
                  {isArabic ? item.ar : item.en}
                </span>
              </div>
            ))}
          </div>

          {/* Variants */}
          {product.variants?.map((v: ProductVariant) => (
            <div key={v.name}>
              <p className="text-xs font-black text-stone-300 mb-2">
                {isArabic ? v.name : (v.nameEn || v.name)}
                {!variants[v.name] && variantError && (
                  <span className="text-red-400 ms-1">({isArabic ? 'مطلوب' : 'required'})</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {v.options.map(opt => (
                  <button key={opt} type="button"
                    onClick={() => { setVariants(prev => ({ ...prev, [v.name]: opt })); setVariantError(false); }}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full border-2 transition ${
                      variants[v.name] === opt ? 'bg-white text-black border-white' : 'border-white/20 text-white/70 hover:border-white'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          {remaining > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-black text-stone-300">{isArabic ? 'الكمية' : 'Quantity'}</span>
              <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}
                  className="px-3 py-2 text-stone-400 hover:bg-white/10 transition disabled:opacity-30">
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 font-black text-white min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(remaining, q + 1))} disabled={qty >= remaining}
                  className="px-3 py-2 text-stone-400 hover:bg-white/10 transition disabled:opacity-30">
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
                  : 'bg-white text-black hover:bg-stone-200'
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
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-700 hover:to-rose-600 transition active:scale-[0.98]">
                <Zap size={16} fill="currentColor" />
                {isArabic ? 'شراء الآن' : 'Buy it now'}
              </button>
            )}

            <button onClick={waOrder}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white transition active:scale-[0.98]">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.845-1.587-5.921.003-6.556 5.338-11.891 11.893-11.891 3.176.001 6.165 1.236 8.413 3.484 2.248 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.544.916 3.21 1.399 4.909 1.4 5.424 0 9.835-4.411 9.838-9.835.002-2.628-1.021-5.1-2.88-6.958-1.859-1.859-4.331-2.88-6.955-2.881-5.423 0-9.835 4.412-9.838 9.836-.001 1.79.491 3.535 1.425 5.047l-1.012 3.7 3.784-.993zm11.458-7.228c-.312-.156-1.847-.91-2.132-1.014-.285-.104-.492-.156-.7.156-.207.312-.802 1.014-.983 1.221-.181.208-.363.234-.675.078-.312-.156-1.317-.485-2.51-1.549-.928-.827-1.554-1.849-1.736-2.161-.182-.312-.02-.481.136-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.207.052-.39-.026-.546-.078-.156-.7-1.688-.959-2.311-.253-.61-.51-.527-.7-.537-.182-.01-.39-.01-.597-.01-.208 0-.545.078-.83.39-.285.312-1.089 1.065-1.089 2.597 0 1.533 1.115 3.013 1.271 3.221.156.208 2.193 3.349 5.313 4.699.742.32 1.32.512 1.77.654.745.237 1.423.204 1.959.124.597-.089 1.847-.754 2.108-1.442.261-.689.261-1.274.182-1.39-.078-.118-.285-.182-.597-.338z"/>
              </svg>
              {isArabic ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
            </button>

            {/*    Shareable product link    */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5">
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
              <span className="text-xs font-black uppercase tracking-[0.18em] text-stone-400 flex items-center gap-2">
                <ShieldCheck size={13} />
                {isArabic ? 'معلومات التوصيل' : 'DELIVERY INFO'}
              </span>
              <ChevronDown size={15} className={`text-stone-400 transition-transform ${deliveryOpen ? 'rotate-180' : ''}`} />
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
