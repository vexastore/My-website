import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

function toSlug(text: string): string {
  return (text || '').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/, '')
    .slice(0, 60);
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority }) => {
  const { cart, language, navigateToProduct } = useShop();
  const isArabic = language === 'ar';
  // imgKey increments to force React to remount the <img> on retry.
  const [imgKey, setImgKey] = useState(0);
  const [imgError, setImgError] = useState(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Image source priority:
  //   1. product.image   — base64 or https URL embedded in SSR (from fetchProductsServer
  //                        gallery fetch) or applied by client-side loadAllImages after auth.
  //   2. product.images[0] — fallback if image is empty but images[] is populated.
  //   3. /api/img/{id}  — Vercel proxy: authenticates anonymously, reads base64 from
  //                       Firestore, serves as JPEG, CDN-cached 24h after first hit.
  const primaryImage = (product.image && product.image.length > 5) ? product.image
    : (product.images && product.images.length > 0 && product.images[0].length > 5) ? product.images[0]
    : '';
  const imgSrc = primaryImage || `/api/img/${product.id}`;

  // When ShopContext loads the real image after hydration, clear any error
  // so the card switches from gradient → real image.
  useEffect(() => {
    if (product.image && product.image.length > 5) {
      retryCountRef.current = 0;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      setImgError(false);
    }
  }, [product.image]);

  // Cleanup retry timers on unmount.
  useEffect(() => {
    return () => { if (retryTimerRef.current) clearTimeout(retryTimerRef.current); };
  }, []);

  // After the img element mounts, check if the browser failed to load it before
  // React attached the onError handler (covers the fast-failure race condition).
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setImgError(true);
    }
  }, [imgKey]); // re-check after each retry remount

  const categoryShort = product.category === 'Holiday Collection' ? 'Holiday' : product.category;
  const oldPrice = Math.round(product.price * 1.23);
  const gradientClass =
    product.category === 'Lingerie' || product.category === 'BDSM' || product.category === 'Holiday Collection'
      ? 'from-[#351018] via-[#9a1f55] to-[#bf2f65]'
      : 'from-[#1b1547] via-[#5a35bc] to-[#9d6cff]';

  const cartItem = cart.find((item) => item.product.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const remainingStock = product.stock - cartQty;

  // Strip trailing hyphens — legacy Firestore slugs sometimes end with '-' due
  // to 60-char truncation. Using the clean slug as the href prevents 30+
  // internal links from pointing to redirect URLs instead of the canonical 200.
  const pSlug = (product.slug || toSlug(product.nameEn || product.name || product.id)).replace(/-+$/, '');
  const catSlug = product.categorySlug || toSlug(product.category || 'sex-toys');
  const productUrl = `/${catSlug}/${pSlug}`;
  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToProduct(product);
  };

  return (
    <a
      href={productUrl}
      onClick={handleProductClick}
      className="group cursor-pointer bg-[#050505] text-white block no-underline"
      aria-label={isArabic ? product.name : product.nameEn}
    >
      <div className="relative overflow-hidden rounded-md border border-white/5 bg-[#101010] p-0 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
        <span className="absolute left-4 top-4 z-10 bg-white px-3 py-2 text-sm font-black uppercase text-black sm:text-base">
          SALE
        </span>


        <div className={`relative aspect-[1.05/1] overflow-hidden bg-gradient-to-br ${gradientClass}`}>
          {!imgError && (
            <img
              key={imgKey}
              ref={imgRef}
              src={imgSrc}
              alt={isArabic ? product.name : (product.nameEn || product.name)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onError={() => {
                // /api/img/{id} CDN caches 404 for only 60 s (stale-while-revalidate=300).
                // Don't permanently hide the image — retry up to 2 times so a cold CDN
                // miss doesn't lock the gradient in place forever.
                //
                // Retry schedule:
                //   1st error  → wait 65 s (clears the 60 s CDN failure cache), then retry
                //   2nd error  → wait 65 s, retry once more
                //   3rd error  → give up; setImgError(true) hides the img permanently
                //
                // If product.image arrives from loadAllImages before the retry fires,
                // the useEffect above clears retryCountRef and cancels the timer so
                // the retry is a no-op and the real image is used instead.
                const count = retryCountRef.current;
                if (count < 2) {
                  retryCountRef.current = count + 1;
                  retryTimerRef.current = setTimeout(() => {
                    // Increment imgKey to remount the <img> with a fresh src.
                    setImgKey(k => k + 1);
                  }, 65_000);
                } else {
                  setImgError(true);
                }
              }}
            />
          )}
          <div
            className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.18em] text-white sm:text-xs"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
          >
            <span>{categoryShort}</span>
            <span>{Math.max(remainingStock, 0)} LEFT</span>
          </div>
        </div>
      </div>

      <div className="pt-5 text-center sm:pt-6">
        <h3
          className="truncate text-sm font-black uppercase tracking-[0.14em] text-white/80 sm:text-lg"
          title={isArabic ? product.name : product.nameEn}
        >
          {isArabic ? product.name : product.nameEn}
        </h3>
        <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3">
          <span className="text-lg font-black text-white sm:text-2xl">${product.price.toFixed(2)} USD</span>
          <span className="text-sm font-black text-white/25 line-through sm:text-base">${oldPrice.toFixed(2)} USD</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-[#7d650c] sm:mt-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="currentColor" className={i < Math.floor(product.rating) ? '' : 'opacity-25'} />
            ))}
          </div>
          <span className="text-xs font-black text-white/35">({product.reviewsCount})</span>
        </div>
      </div>
    </a>
  );
};
