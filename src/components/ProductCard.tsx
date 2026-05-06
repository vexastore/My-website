import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart, X, PackageCheck, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, language } = useShop();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isArabic = language === 'ar';
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const selectedImage = productImages[selectedImageIndex] || product.image;

  const categoryShort = product.category === 'Holiday Collection' ? 'Holiday' : product.category;
  const oldPrice = Math.round(product.price * 1.23);
  const gradientClass =
    product.category === 'Lingerie' || product.category === 'BDSM' || product.category === 'Holiday Collection'
      ? 'from-[#351018] via-[#9a1f55] to-[#bf2f65]'
      : 'from-[#1b1547] via-[#5a35bc] to-[#9d6cff]';

  // Find if item is already in cart to see current quantity selected
  const cartItem = cart.find((item) => item.product.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const remainingStock = product.stock - cartQty;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (remainingStock > 0) {
      addToCart(product);
    }
  };

  return (
    <>
    <div onClick={() => setIsDetailsOpen(true)} className="group cursor-pointer bg-[#050505] text-white">
      <div className="relative overflow-hidden rounded-md border border-white/5 bg-[#101010] p-0 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
        <span className="absolute left-4 top-4 z-10 bg-white px-3 py-2 text-sm font-black uppercase text-black sm:text-base">
          SALE
        </span>

        <div className={`relative aspect-[1.05/1] overflow-hidden bg-gradient-to-br ${gradientClass}`}>
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
              {product.category === 'Dildos'
                ? 'Medical Silicone'
                : product.category === 'Lingerie'
                ? 'Soft Fit'
                : product.category === 'Male Toys'
                ? 'Discreet'
                : product.category === 'BDSM'
                ? 'Starter Kit'
                : 'Premium'}
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.18em] text-white sm:text-xs">
            <span>{categoryShort}</span>
            <span>{Math.max(remainingStock, 0)} LEFT</span>
          </div>
        </div>
      </div>

      <div className="pt-5 text-center sm:pt-6">
        <h3 className="truncate text-sm font-black uppercase tracking-[0.14em] text-white/80 sm:text-lg" title={isArabic ? product.name : product.nameEn}>
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
    </div>

    {isDetailsOpen && (
      <div
        className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
        onClick={() => setIsDetailsOpen(false)}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div
          className="max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-white shadow-2xl sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-700">{product.category}</p>
              <h2 className="text-base font-black text-stone-900 sm:text-xl">{isArabic ? product.name : product.nameEn}</h2>
            </div>
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="rounded-full border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-100"
              aria-label="إغلاق"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            <div className="bg-stone-100 p-3">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full min-h-[320px] w-full rounded-xl object-cover"
              />
              {productImages.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`h-16 overflow-hidden rounded-lg border transition ${selectedImageIndex === idx ? 'border-black ring-2 ring-black/10' : 'border-stone-200 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-stone-400">{isArabic ? 'السعر' : 'Price'}</span>
                  <p className="text-3xl font-black text-stone-950">
                    ${product.price.toFixed(2)} <span className="text-sm font-bold text-stone-500">USD</span>
                  </p>
                </div>
                <div className="text-left">
                  <div className="mb-1 flex items-center justify-end gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                        className={i < Math.floor(product.rating) ? '' : 'text-stone-300'}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-stone-500">{product.rating} / 5 - {product.reviewsCount} {isArabic ? 'تقييم' : 'reviews'}</p>
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <h3 className="mb-2 text-sm font-black text-stone-900">{isArabic ? 'تفاصيل المنتج' : 'Product details'}</h3>
                <p className="text-sm leading-7 text-stone-600">{isArabic ? product.description : product.descriptionEn}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-800">
                  <PackageCheck size={18} className="mb-1" />
                  <p className="text-[10px] font-bold">{isArabic ? 'المخزون' : 'Stock'}</p>
                  <p className="text-sm font-black">{remainingStock > 0 ? (isArabic ? `${remainingStock} قطعة متوفرة` : `${remainingStock} available`) : (isArabic ? 'غير متوفر حالياً' : 'Currently unavailable')}</p>
                </div>
                <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-purple-800">
                  <ShieldCheck size={18} className="mb-1" />
                  <p className="text-[10px] font-bold">{isArabic ? 'الشحن' : 'Shipping'}</p>
                  <p className="text-sm font-black">{isArabic ? 'تغليف سري ودفع عند الاستلام' : 'Discreet packaging and cash on delivery'}</p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || remainingStock === 0}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-black transition active:scale-[0.98] ${
                  product.stock === 0 || remainingStock === 0
                    ? 'cursor-not-allowed bg-stone-200 text-stone-400'
                    : 'bg-black text-white hover:bg-stone-800'
                }`}
              >
                <ShoppingCart size={18} />
                {product.stock === 0 ? (isArabic ? 'غير متوفر' : 'Sold out') : remainingStock === 0 ? (isArabic ? 'تمت إضافة كل الكمية المتاحة' : 'All available quantity added') : (isArabic ? 'أضف المنتج للسلة' : 'Add product to cart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
