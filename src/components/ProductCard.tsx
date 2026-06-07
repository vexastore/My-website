import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, Link2, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

function toSlug(text: string): string {
  return (text || '').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/, '')
    .slice(0, 60);
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, language, navigateToProduct } = useShop();
  const isArabic = language === 'ar';
  const [copied, setCopied] = useState(false);

  const categoryShort = product.category === 'Holiday Collection' ? 'Holiday' : product.category;
  const oldPrice = Math.round(product.price * 1.23);
  const gradientClass =
    product.category === 'Lingerie' || product.category === 'BDSM' || product.category === 'Holiday Collection'
      ? 'from-[#351018] via-[#9a1f55] to-[#bf2f65]'
      : 'from-[#1b1547] via-[#5a35bc] to-[#9d6cff]';

  const cartItem = cart.find((item) => item.product.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const remainingStock = product.stock - cartQty;

  const pSlug = product.slug || toSlug(product.nameEn || product.name || product.id);
  const catSlug = product.categorySlug || toSlug(product.category || 'sex-toys');
  const productUrl = `/${catSlug}/${pSlug}`;
  const productFullUrl = `https://vexatoys.com${productUrl}`;

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToProduct(product);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(productFullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
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

        <button
          type="button"
          onClick={handleCopyLink}
          title={isArabic ? 'نسخ رابط المنتج' : 'Copy product link'}
          className={`absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full px-2 py-1.5 text-[10px] font-black uppercase tracking-wide transition-all duration-200 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-black/60 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
        >
          {copied ? (
            <><Check size={11} /><span>{isArabic ? 'تم' : 'Copied'}</span></>
          ) : (
            <><Link2 size={11} /><span>{isArabic ? 'رابط' : 'Link'}</span></>
          )}
        </button>

        <div className={`relative aspect-[1.05/1] overflow-hidden bg-gradient-to-br ${gradientClass}`}>
          {product.image ? (
            <img
              src={product.image}
              alt={isArabic ? product.name : (product.nameEn || product.name)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.6),transparent_18%),radial-gradient(circle_at_72%_34%,rgba(255,255,255,0.28),transparent_10%)] opacity-50" />
              <div className="absolute left-1/2 top-1/2 h-[58%] w-[35%] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border-[18px] border-white/18 bg-white/8 shadow-2xl shadow-white/20" />
              <div className="absolute left-1/2 top-[58%] h-[16%] w-[36%] -translate-x-1/2 rounded-full bg-black/25 blur-[1px]" />
              <div className="absolute left-[22%] top-[69%] h-10 w-10 rotate-45 bg-white/16" />
              <div className="absolute right-[21%] top-[22%] h-8 w-8 rotate-45 bg-white/16" />
              <div className="absolute left-[18%] top-[25%] h-8 w-8 rounded-full bg-white/25" />
              <div className="absolute right-[15%] top-[25%] h-5 w-5 rounded-full bg-white/25" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-black tracking-[0.18em] sm:text-3xl">VEXA</span>
                <span className="mt-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/90 sm:text-xs">
                  {product.category === 'Dildos' ? 'Medical Silicone'
                    : product.category === 'Lingerie' ? 'Soft Fit'
                    : product.category === 'Male Toys' ? 'Discreet'
                    : product.category === 'BDSM' ? 'Starter Kit'
                    : 'Premium'}
                </span>
              </div>
            </>
          )}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.18em] text-white sm:text-xs" style={{textShadow:'0 1px 4px rgba(0,0,0,0.9)'}}>
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
        <div className="mt-3 flex items-center justify-center gap-1.5 px-2">
          <Link2 size={10} className="shrink-0 text-white/20" />
          <span className="truncate text-[10px] text-white/20 font-mono">
            vexatoys.com{productUrl}
          </span>
        </div>
      </div>
    </a>
  );
};
