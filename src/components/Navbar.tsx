import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { selectedUnitPrice } from '../utils/pricing';
import { CATEGORIES } from '../data/categories';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  User,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Info,
} from 'lucide-react';

const CATEGORY_SLUGS: Record<string, string> = {
  'Sex Toys': 'sex-toys', 'Vibrators': 'vibrators', 'Male Toys': 'male-toys',
  'Dildos': 'dildos', 'Lingerie': 'lingerie', 'BDSM': 'bdsm',
  'Holiday Collection': 'holiday-collection', 'New Arrivals': 'new-arrivals',
  'Butt Plugs': 'butt-plugs', 'Anal Toys': 'anal-toys', 'Bondage': 'bondage',
  'Sex Dolls': 'sex-dolls', 'Strap Ons': 'strap-ons', 'Kegel Balls': 'kegel-balls',
  'Sexual Enhancers': 'sexual-enhancers', 'Penis Pumps': 'penis-pumps',
  'Cock Rings': 'cock-rings', 'Masturbators': 'masturbators', 'Chastity': 'chastity',
  'Sex Machines': 'sex-machines', 'Lubricants': 'lubricants', 'Poppers': 'poppers',
};

const catSlug = (id: string) => CATEGORY_SLUGS[id] || id.toLowerCase().replace(/\s+/g, '-');

export const Navbar: React.FC = () => {
  const {
    currentView, setView, activeCategory, setActiveCategory,
    getCartItemsCount, searchQuery, setSearchQuery, cart, orders,
    language, toggleLanguage, orderStatusSync, refreshOrderStatuses
  } = useShop();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  const isArabic = language === 'ar';

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setActiveSubmenu(null);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  const openShopHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setView('shop');
    setActiveCategory('');
    setSearchQuery('');
    setIsMenuOpen(false);
    setIsShopDropdownOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    setActiveCategory(category);
    setSearchQuery('');
    setView('shop');
    setIsMenuOpen(false);
    setActiveSubmenu(null);
    setIsShopDropdownOpen(false);
    const target = document.getElementById('products-grid');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCartClick = () => {
    if (cart.length === 0) {
      alert(isArabic ? 'سلة المشتريات فارغة. أضف منتجات أولاً.' : 'Your cart is empty. Add products first.');
      return;
    }
    setView('checkout');
  };

  const getStatusInfo = (status: Order['status']) => {
    const map: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
      pending:   { icon: <Package size={12} className="animate-pulse" />, label: isArabic ? 'قيد المراجعة' : 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      confirmed: { icon: <CheckCircle2 size={12} />, label: isArabic ? 'تم تأكيد الطلب' : 'Confirmed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      shipping:  { icon: <Truck size={12} />, label: isArabic ? 'قيد الشحن' : 'Shipped', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      delivered: { icon: <CheckCircle2 size={12} />, label: isArabic ? 'تم الاستلام' : 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      cancelled: { icon: <XCircle size={12} />, label: isArabic ? 'ملغي' : 'Cancelled', color: 'bg-red-50 text-red-600 border-red-200' },
    };
    return map[status] || map['pending'];
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* ── TOP ANNOUNCEMENT BAR ────────────────────────────────────── */}
      <div className="border-b border-white/10 bg-black text-stone-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[11px] sm:px-6">
          <div />

          {/* Right language toggle */}
          <button
            onClick={toggleLanguage}
            aria-label={isArabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
            className="flex items-center gap-1 text-[11px] font-semibold text-stone-400 hover:text-white transition px-2 py-0.5 rounded"
          >
            <span className={isArabic ? 'text-[#ff2d78] font-bold' : ''}>عربي</span>
            <span className="text-stone-600">|</span>
            <span className={!isArabic ? 'text-[#ff2d78] font-bold' : ''}>EN</span>
          </button>
        </div>
      </div>

      {/* ── MAIN NAVBAR ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Left: Hamburger & Logo */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label={isArabic ? 'فتح القائمة' : 'Open menu'}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>

            <a
              href="/"
              onClick={openShopHome}
              className="flex flex-col select-none group"
              aria-label="Vexa Toys Home"
            >
              <span className="text-xl sm:text-2xl font-black tracking-wider text-[#ff2d78] group-hover:brightness-110 transition leading-none">
                VEXA
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.32em] text-[#ff2d78] group-hover:brightness-110 transition mt-0.5 leading-none">
                TOYS
              </span>
            </a>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-200"
            aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}
          >
            <a
              href="/"
              onClick={openShopHome}
              className={`transition hover:text-white ${currentView === 'shop' && !activeCategory ? 'text-white font-semibold' : 'text-stone-300'}`}
            >
              {isArabic ? 'الرئيسية' : 'Home'}
            </a>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsShopDropdownOpen(v => !v)}
                className="flex items-center gap-1 transition hover:text-white text-stone-300"
              >
                <span>{isArabic ? 'المتجر' : 'Shop'}</span>
                <ChevronDown size={14} className="text-stone-400" />
              </button>

              {isShopDropdownOpen && (
                <div
                  className="absolute top-full mt-2 w-64 rounded-xl border border-white/10 bg-[#0e0e0e] py-2 shadow-2xl z-50"
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  <a
                    href="/adult-toys"
                    onClick={(e) => { e.preventDefault(); openShopHome(e); }}
                    className="block px-4 py-2 text-xs font-bold text-white hover:bg-white/10 hover:text-[#ff2d78] transition"
                  >
                    {isArabic ? 'كل المنتجات' : 'All Products'}
                  </a>
                  <div className="my-1 border-t border-white/10" />
                  {CATEGORIES.slice(0, 8).map(c => (
                    <a
                      key={c.id}
                      href={`/${catSlug(c.id)}`}
                      onClick={(e) => handleCategorySelect(e, c.id)}
                      className="block px-4 py-1.5 text-xs text-stone-300 hover:bg-white/10 hover:text-white transition"
                    >
                      {isArabic ? c.name.ar : c.name.en}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById('shop-by-category');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setView('shop');
                  }
                }}
                className="relative pb-1 text-white font-semibold transition hover:text-white"
              >
                <span>{isArabic ? 'الفئات' : 'Categories'}</span>
                {/* Hot pink active underline bar matching mockup */}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#ff2d78] rounded-full" />
              </button>
            </div>

            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                setView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition hover:text-white ${currentView === 'about' ? 'text-white font-semibold' : 'text-stone-300'}`}
            >
              {isArabic ? 'عن المتجر' : 'About'}
            </a>

            <a
              href="https://wa.me/96176730767"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-300 transition hover:text-white"
            >
              {isArabic ? 'اتصل بنا' : 'Contact'}
            </a>
          </nav>

          {/* Right: Actions (Search, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => { setIsSearchOpen(v => !v); setIsMenuOpen(false); }}
              aria-label={isArabic ? 'بحث' : 'Search'}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-300 transition hover:bg-white/10 hover:text-white"
            >
              <Search size={20} strokeWidth={1.6} />
            </button>

            <button
              onClick={() => { setIsOrdersOpen(true); setIsMenuOpen(false); }}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-stone-300 transition hover:bg-white/10 hover:text-white"
              aria-label={isArabic ? 'حسابي / طلباتي' : 'Account / My Orders'}
            >
              <User size={20} strokeWidth={1.6} />
              {orders.length > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff2d78] px-1 text-[9px] font-black text-white">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={handleCartClick}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-stone-300 transition hover:bg-white/10 hover:text-white"
              aria-label={isArabic ? 'السلة' : 'Cart'}
            >
              <ShoppingBag size={20} strokeWidth={1.6} />
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff2d78] px-1 text-[10px] font-black text-white shadow-sm">
                {getCartItemsCount()}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="pb-4 pt-1">
            <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border border-white/20 bg-stone-900/90 px-4 py-2.5 shadow-xl backdrop-blur-md">
              <Search size={18} className="text-stone-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن منتج بالاسم أو الفئة...' : 'Search products by name or category...'}
                className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-stone-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-stone-400 hover:text-white text-xs"
                >
                  {isArabic ? 'مسح' : 'Clear'}
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                aria-label={isArabic ? 'إغلاق البحث' : 'Close search'}
                className="text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE MENU DRAWER ─────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[10000] overflow-y-auto bg-black/95 backdrop-blur-md text-white transition-[opacity,transform,visibility] duration-300 ease-out ${
          isMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none -translate-y-4 opacity-0'
        }`}
        dir={isArabic ? 'rtl' : 'ltr'}
        aria-hidden={!isMenuOpen}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5">
          <div className="flex h-14 items-center justify-between border-b border-white/10 pb-4">
            <button
              onClick={() => {
                if (activeSubmenu) {
                  setActiveSubmenu(null);
                } else {
                  setIsMenuOpen(false);
                }
              }}
              aria-label={activeSubmenu ? (isArabic ? 'رجوع' : 'Go back') : (isArabic ? 'إغلاق القائمة' : 'Close menu')}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
            >
              {activeSubmenu ? <ChevronLeft size={28} strokeWidth={1.5} /> : <X size={28} strokeWidth={1.5} />}
            </button>

            <a href="/" onClick={openShopHome} className="flex flex-col select-none">
              <span className="text-xl font-black tracking-wider text-[#ff2d78]">VEXA</span>
              <span className="text-[9px] font-bold tracking-[0.32em] text-[#ff2d78] -mt-1">TOYS</span>
            </a>

            <button
              onClick={toggleLanguage}
              className="text-xs font-bold uppercase tracking-wider text-stone-300 border border-white/20 px-2.5 py-1 rounded-full"
            >
              {isArabic ? 'EN' : 'عربي'}
            </button>
          </div>

          {activeSubmenu === 'Categories' ? (
            <nav className="mt-6 flex flex-col pb-20" aria-label={isArabic ? 'الفئات' : 'Categories'}>
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xl font-bold text-white">
                  {isArabic ? 'جميع الفئات' : 'All Categories'}
                </span>
                <span className="text-xs text-[#ff2d78] font-bold">{CATEGORIES.length}</span>
              </div>
              <div className="grid grid-cols-1 divide-y divide-white/5 sm:grid-cols-2">
                {CATEGORIES.map(item => (
                  <a
                    key={item.id}
                    href={`/${catSlug(item.id)}`}
                    onClick={(e) => handleCategorySelect(e, item.id)}
                    className="flex w-full items-center justify-between py-3.5 text-start text-base font-medium text-stone-200 transition hover:text-[#ff2d78]"
                  >
                    <span>{isArabic ? item.name.ar : item.name.en}</span>
                    <ChevronRight size={18} className="text-stone-500" />
                  </a>
                ))}
              </div>
            </nav>
          ) : (
            <nav className="mt-8 flex flex-col gap-4 pb-20" aria-label={isArabic ? 'القائمة الرئيسية' : 'Main navigation'}>
              <a
                href="/"
                onClick={openShopHome}
                className="flex items-center justify-between py-2 text-2xl font-bold text-white hover:text-[#ff2d78] transition"
              >
                <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveSubmenu('Categories')}
                className="group flex w-full items-center justify-between py-2 text-start text-2xl font-bold text-white hover:text-[#ff2d78] transition"
              >
                <span>{isArabic ? 'الفئات' : 'Categories'}</span>
                <ChevronRight size={24} className="text-stone-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="/quiz"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-2 text-2xl font-bold text-white hover:text-[#ff2d78] transition"
              >
                <span>{isArabic ? 'اختار منتجك (اختبار ٣ أسئلة)' : 'Find My Product (Quiz)'}</span>
                <span className="text-lg">🎯</span>
              </a>

              <a
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-2 text-2xl font-bold text-white hover:text-[#ff2d78] transition"
              >
                <span>{isArabic ? 'المدونة' : 'Blog'}</span>
              </a>

              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  setView('about');
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-between py-2 text-2xl font-bold text-white hover:text-[#ff2d78] transition"
              >
                <span>{isArabic ? 'عن المتجر' : 'About Us'}</span>
                <Info size={20} className="text-stone-500" />
              </a>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOrdersOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-between py-2 text-base font-semibold text-stone-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-[#ff2d78]" />
                    {isArabic ? 'طلباتي' : 'My Orders'}
                  </span>
                  {orders.length > 0 && (
                    <span className="bg-[#ff2d78] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {orders.length}
                    </span>
                  )}
                </button>

                <a
                  href="https://wa.me/96176730767"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition"
                >
                  <span>{isArabic ? 'محادثة واتساب مباشرة' : 'WhatsApp Live Chat'}</span>
                </a>
              </div>
            </nav>
          )}
        </div>
      </div>

      {/* ── ORDERS MODAL ───────────────────────────────────────────── */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-[20000] flex items-end sm:items-center justify-center" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsOrdersOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0d0d0d] rounded-t-3xl sm:rounded-2xl border border-white/10 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-[#ff2d78]" />
                <h2 className="text-base font-black text-white">{isArabic ? 'طلباتي' : 'My Orders'}</h2>
                {orders.length > 0 && (
                  <span className="bg-[#ff2d78] text-white text-xs font-black px-2 py-0.5 rounded-full">{orders.length}</span>
                )}
              </div>
              <button onClick={() => setIsOrdersOpen(false)} aria-label={isArabic ? 'إغلاق' : 'Close'} className="text-stone-400 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3">
              {orderStatusSync === 'loading' && <p className="text-xs text-stone-400" role="status">{isArabic ? 'جارٍ تحديث حالة الطلبات…' : 'Checking order statuses…'}</p>}
              {orderStatusSync === 'error' && <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-200" role="alert"><span>{isArabic ? 'قد تكون الحالات المعروضة قديمة.' : 'Statuses may be outdated.'}</span><button type="button" className="underline" onClick={() => void refreshOrderStatuses()}>{isArabic ? 'إعادة المحاولة' : 'Retry'}</button></div>}
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <ClipboardList size={40} className="text-white/20" />
                  <p className="text-sm font-bold text-stone-400">{isArabic ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
                </div>
              ) : (
                orders.map(order => {
                  const si = getStatusInfo(order.status);
                  return (
                    <div key={order.id} className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <div>
                          <p className="text-[11px] text-stone-400 font-bold" dir="ltr">{order.id}</p>
                          <p className="text-[10px] text-stone-500 mt-0.5">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-[11px] font-black ${si.color}`}>
                            {si.icon} {si.label}
                          </span>
                          <span className="text-sm font-black text-white">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="px-4 py-3 space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {item.product.image && (
                              <img src={item.product.image} alt=""
                                className="h-10 w-10 rounded-xl object-cover flex-shrink-0 bg-white/10" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-stone-200 truncate">{isArabic ? item.product.name : item.product.nameEn}</p>
                              <p className="text-[11px] text-stone-400">x{item.quantity} · ${(selectedUnitPrice(item.product, item.selectedVariant) * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                        <p className="text-[11px] text-stone-400 pt-1">📍 {order.customer.city}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {orders.length > 0 && (
              <div className="border-t border-white/10 px-4 py-3">
                <button
                  type="button"
                  className="w-full rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
                  onClick={() => { setIsOrdersOpen(false); setView('orders'); }}
                >
                  {isArabic ? 'عرض تفاصيل الطلبات' : 'View order details'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
