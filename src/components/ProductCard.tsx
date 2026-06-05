import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart } from 'lucide-react';
import { CATEGORIES, getProductCategories } from '../data/categories';

function toSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/, '')
    .slice(0, 60) || 'product';
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart, cart, language, setView, setSelectedProduct, navigateToProduct } = useShop();
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

  const displayName = isArabic
    ? (product.name || product.nameEn)
    : (product.nameEn || product.name);

  const productSlug = (product as Product & { slug?: string }).slug || toSlug(product.nameEn || product.name || '');
  const productHref = `/product/${productSlug}`;

  const navigateToProduct = () => {
    setSelectedProduct(product);
    setView('product');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState(null, '', productHref);
    navigateToProduct();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (remainingStock > 0) {
      addToCart(product, 1);
    }
  };

  return (
    <a
      href={productHref}
      onClick={handleCardClick}
      aria-label={displayName}
      className="group cursor-pointer bg-[#050505] text-white block"
    >
      <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#101010] shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
        {product.isNew && (
          <span className="absolute right-3 top-3 z-10 bg-emerald-400 text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full">
            {isArabic ? 'Ø¬Ø¯ÙØ¯' : 'New'}
          </span>
        )}
        <span className="absolute left-3 top-3 z-10 bg-white/90 text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full">
          {isArabic ? 'ØªØ®ÙÙØ¶' : 'Sale'}
        </span>
        <div className={`relative aspect-square overflow-hidden ${hasRealImage ? 'bg-black' : `bg-gradient-to-br ${gradientClass}`}`}>
          {hasRealImage ? (
            <img
              src={cardImage}
              alt={isArabic ? `Ø´Ø±Ø§Ø¡ ${displayName} ÙÙ ÙØ¨ÙØ§Ù - ÙØªØ¬Ø± ÙÙÙØ³Ø§` : `Buy ${displayName} in Lebanon - Vexa Store`}
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
              {Math.max(remainingStock, 0)} {isArabic ? 'ÙØªØ¨ÙÙ' : 'left'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 px-0.5">
        <h3
          className="line-clamp-2 text-xs font-black uppercase tracking-[0.1em] text-white/80 sm:text-sm leading-snug"
          title={displayName}
        >
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

        <button
          onClick={handleAddToCart}
          disabled={remainingStock <= 0}
          aria-label={isArabic ? `Ø¥Ø¶Ø§ÙØ© ${displayName} ÙÙØ³ÙØ©` : `Add ${displayName} to cart`}
          className={`mt-3 w-full flex items-center justify-center gap-2 rounded-lg py-2 text-[11px] font-black uppercase tracking-wider transition active:scale-[0.97] ${
            remainingStock <= 0
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
          }`}
        >
          <ShoppingCart size={13} />
          {remainingStock <= 0
            ? (isArabic ? 'ÙÙØ° Ø§ÙÙØ®Ø²ÙÙ' : 'Out of stock')
            : (isArabic ? 'Ø¥Ø¶Ø§ÙØ© ÙÙØ³ÙØ©' : 'Add to cart')}
        </button>
      </div>
    </a>
  );
};
