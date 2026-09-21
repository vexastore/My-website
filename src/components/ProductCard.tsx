import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { canonicalProductPath } from '@/lib/productSeo';
import { Star, Heart, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority }) => {
  const { addToCart, language, navigateToProduct } = useShop();
  const isArabic = language === 'ar';

  const [imgKey, setImgKey] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const primaryImage = (product.image && product.image.length > 5)
    ? product.image
    : (product.images && product.images.length > 0 && product.images[0].length > 5)
    ? product.images[0]
    : '';
  const imgSrc = primaryImage || `/api/img/${product.id}`;

  useEffect(() => {
    if (product.image && product.image.length > 5) {
      retryCountRef.current = 0;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      setImgError(false);
    }
  }, [product.image]);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setImgError(true);
    }
  }, [imgKey]);

  // Read saved wishlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`vexa_wish_${product.id}`);
      if (saved === 'true') setIsWishlisted(true);
    } catch {
      // ignore
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isWishlisted;
    setIsWishlisted(next);
    try {
      localStorage.setItem(`vexa_wish_${product.id}`, next ? 'true' : 'false');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('vexa-toast', {
            detail: {
              message: next
                ? (isArabic ? 'تمت الإضافة إلى المفضلة' : 'Saved to Wishlist')
                : (isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from Wishlist'),
              type: 'info',
            },
          })
        );
      }
    } catch {
      // ignore
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('vexa-toast', {
          detail: {
            message: isArabic
              ? `تمت إضافة "${product.name}" إلى السلة`
              : `Added "${product.nameEn || product.name}" to cart`,
            type: 'success',
          },
        })
      );
    }
  };

  const oldPrice = Math.round(product.price * 1.25);
  const isOutOfStock = product.stock <= 0;

  // Determine badge style matching mockup
  const getBadge = () => {
    if (isOutOfStock) {
      return (
        <span className="rounded-full bg-black/80 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-stone-300">
          {isArabic ? 'نفدت الكمية' : 'Out of Stock'}
        </span>
      );
    }
    // Deterministic badge variant
    const charCode = product.id.charCodeAt(product.id.length - 1) || 0;
    if (charCode % 3 === 0) {
      return (
        <span className="rounded-full bg-[#ff2d78] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-sm">
          {isArabic ? 'الأكثر مبيعاً' : 'Best Seller'}
        </span>
      );
    }
    if (charCode % 4 === 0) {
      return (
        <span className="rounded-full bg-[#ff2d78] px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm">
          -20%
        </span>
      );
    }
    return (
      <span className="rounded-full bg-stone-800 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-stone-300">
        {isArabic ? 'جديد' : 'New'}
      </span>
    );
  };

  const productUrl = canonicalProductPath(product);

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    navigateToProduct(product);
  };

  const cardProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = isOutOfStock
    ? { 'aria-disabled': true, tabIndex: -1 }
    : { href: productUrl, onClick: handleProductClick };

  return (
    <a
      {...cardProps}
      className={`group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0d0d0d] p-3 sm:p-3.5 transition-all duration-300 hover:border-white/20 hover:bg-[#121212] hover:shadow-xl hover:shadow-[#ff2d78]/5 no-underline text-white ${
        isOutOfStock ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      }`}
      aria-label={`${isArabic ? product.name : product.nameEn}${isOutOfStock ? (isArabic ? ', نفدت الكمية' : ', Out of stock') : ''}`}
    >
      <div>
        {/* Top Badges & Wishlist Heart */}
        <div className="mb-2.5 flex items-center justify-between gap-1">
          {getBadge()}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? (isArabic ? 'إزالة من المفضلة' : 'Remove from wishlist') : (isArabic ? 'إضافة إلى المفضلة' : 'Add to wishlist')}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
              isWishlisted
                ? 'text-[#ff2d78]'
                : 'text-stone-400 hover:text-white hover:scale-110'
            }`}
          >
            <Heart
              size={16}
              className={isWishlisted ? 'fill-[#ff2d78] text-[#ff2d78]' : ''}
            />
          </button>
        </div>

        {/* Product Image Box */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#161616] flex items-center justify-center mb-3">
          {!imgError ? (
            <img
              key={imgKey}
              ref={imgRef}
              src={imgSrc}
              alt={(isArabic ? product.imageAltsAr?.[0] : product.imageAltsEn?.[0]) || (isArabic ? product.name : (product.nameEn || product.name))}
              className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isOutOfStock ? 'grayscale opacity-40' : ''
              }`}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onError={() => {
                const count = retryCountRef.current;
                if (count < 2) {
                  retryCountRef.current = count + 1;
                  retryTimerRef.current = setTimeout(() => {
                    setImgKey(k => k + 1);
                  }, 65_000);
                } else {
                  setImgError(true);
                }
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone-900 text-stone-600 text-xs font-semibold">
              {isArabic ? 'صورة المنتج' : 'Vexa Toys'}
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-xs sm:text-sm font-bold text-stone-100 line-clamp-1 group-hover:text-white transition-colors"
          title={isArabic ? product.name : product.nameEn}
        >
          {isArabic ? product.name : product.nameEn}
        </h3>

        {/* Pricing */}
        <div className="mt-1 flex items-baseline gap-2">
          {charCodePrice(product.id) ? (
            <>
              <span className="text-stone-500 line-through text-[11px] font-medium">${oldPrice.toFixed(2)}</span>
              <span className="text-sm font-extrabold text-[#ff2d78]">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-sm font-extrabold text-white">${product.price.toFixed(2)}</span>
          )}
        </div>

        {/* Star Rating */}
        <div className="mt-1.5 flex items-center gap-1.5 text-amber-400">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-[10px] font-semibold text-stone-400">
            ({product.reviewsCount || 12})
          </span>
        </div>
      </div>

      {/* Add to Cart Outline Button */}
      <button
        type="button"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className={`w-full mt-3 rounded-full border py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
          isOutOfStock
            ? 'border-white/10 text-stone-500 cursor-not-allowed bg-transparent'
            : isAdded
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-white/20 text-stone-200 hover:border-[#ff2d78] hover:bg-[#ff2d78] hover:text-white'
        }`}
      >
        <ShoppingBag size={13} />
        <span>
          {isOutOfStock
            ? (isArabic ? 'نفدت الكمية' : 'Out of Stock')
            : isAdded
            ? (isArabic ? 'تمت الإضافة!' : 'Added!')
            : (isArabic ? 'أضف إلى السلة' : 'Add to Cart')}
        </span>
      </button>
    </a>
  );
};

function charCodePrice(id: string): boolean {
  const code = id.charCodeAt(id.length - 1) || 0;
  return code % 4 === 0;
}
