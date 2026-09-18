import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { selectedUnitPrice } from '../utils/pricing';
import { CATEGORIES } from '../data/categories';
import { ShoppingBag, Search, Menu, X, ChevronRight, ChevronLeft, Lock, Package, Truck, CheckCircle2, XCircle, ClipboardList, Info } from 'lucide-react';

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

const VexaLogo = () => (
  <div
    className="relative select-none flex-shrink-0"
    style={{ filter: 'drop-shadow(0 0 16px rgba(220,20,20,0.95)) drop-shadow(0 0 32px rgba(180,0,0,0.65))' }}
  >
    <img
      src="/vexa-logo.png"
      alt="Vexa Store logo"
      width={76}
      height={76}
      fetchPriority="high"
      className="h-[62px] w-[62px] sm:h-[76px] sm:w-[76px] rounded-full object-cover"
      style={{ border: '2.5px solid rgba(220,30,30,0.85)', boxShadow: '0 0 22px rgba(220,20,20,0.75), 0 0 44px rgba(180,0,0,0.45)' }}
    />
  </div>
);

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

  const isArabic = language === 'ar';

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setIsMenuOpen(false); setActiveSubmenu(null); }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  const openShopHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setView('shop'); setActiveCategory('');
    setSearchQuery(''); setIsMenuOpen(false);
  };

  const handleSubmenuClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    setActiveCategory(category); setSearchQuery(''); setView('shop');
    setIsMenuOpen(false); setActiveSubmenu(null);
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

  const IconBar = ({ size }: { size: number }) => (
    <div className="flex items-center justify-end gap-2.5 sm:gap-4">
      <button onClick={() => { setIsSearchOpen(v => !v); setIsMenuOpen(false); }} aria-label={isArabic ? 'بحث' : 'Search'} className="text-white transition hover:text-white/70">
        <Search size={size} strokeWidth={1.4} />
      </button>
      <button onClick={toggleLanguage} aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
        className="relative border border-white/20 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black">
        {isArabic ? 'EN' : 'AR'}
      </button>
      <button
        onClick={() => { setIsOrdersOpen(true); setIsMenuOpen(false); }}
        className="relative text-white transition hover:text-white/70"
        aria-label={isArabic ? 'طلباتي' : 'My Orders'}
      >
        <ClipboardList size={size} strokeWidth={1.35} />
        {orders.length > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
            {orders.length}
          </span>
        )}
      </button>
      <button onClick={handleCartClick} className="relative text-white transition hover:text-white/70" aria-label={isArabic ? 'السلة' : 'Cart'}>
        <ShoppingBag size={size} strokeWidth={1.35} />
        {getCartItemsCount() > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-[11px] font-black text-black">
            {getCartItemsCount()}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050101] text-white" dir="ltr">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid h-[88px] grid-cols-[1fr_auto_1fr] items-center sm:h-[108px]">
          <button onClick={() => setIsMenuOpen(true)}
            aria-label={isArabic ? 'فتح القائمة' : 'Open menu'}
            className="flex h-14 w-14 items-center justify-center justify-self-start text-white transition hover:text-white/70">
            <Menu size={28} strokeWidth={1.5} />
          </button>
          <a href="/" onClick={openShopHome} className="justify-self-center" aria-label="Vexa Store home">
            <VexaLogo />
          </a>
          <IconBar size={26} />
        </div>

        {isSearchOpen && (
          <div className="pb-5">
            <div className="mx-auto flex max-w-2xl items-center gap-3 border border-white/20 bg-white/5 px-4 py-3">
              <Search size={20} className="text-white/60" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن المنتجات...' : 'Search products...'}
                className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/40" autoFocus />
              <button onClick={() => setIsSearchOpen(false)} aria-label={isArabic ? 'إغلاق البحث' : 'Close search'} className="text-white/60 hover:text-white"><X size={18} /></button>
            </div>
          </div>
        )}
      </div>

      <div className={`fixed inset-0 z-[10000] overflow-y-auto bg-[#050101] text-white transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none ${isMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none -translate-y-4 opacity-0'}`} dir={isArabic ? 'rtl' : 'ltr'} aria-hidden={!isMenuOpen} inert={!isMenuOpen}>
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid h-[88px] grid-cols-[1fr_auto_1fr] items-center sm:h-[108px]">
              <button onClick={() => { activeSubmenu ? setActiveSubmenu(null) : setIsMenuOpen(false); }}
                aria-label={activeSubmenu ? (isArabic ? 'رجوع' : 'Go back') : (isArabic ? 'إغلاق القائمة' : 'Close menu')}
                className="flex h-14 w-14 items-center justify-center justify-self-start text-white transition hover:text-white/70">
                {activeSubmenu ? <ChevronLeft size={36} strokeWidth={1.2} /> : <X size={38} strokeWidth={1.05} />}
              </button>
              <a href="/" onClick={openShopHome} className="justify-self-center"><VexaLogo /></a>
              <IconBar size={26} />
            </div>

            {activeSubmenu === 'Products' ? (
              <nav className="mt-5 flex flex-col pb-20" aria-label={isArabic ? 'المنتجات' : 'Products'}>
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="flex items-center gap-3 text-[24px] font-light tracking-wide text-white sm:text-3xl">
                    {isArabic ? 'المنتجات' : 'Products'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/25">{isArabic ? 'الفئات' : 'Categories'}</span>
                </div>
                <div className="grid grid-cols-1 gap-x-8 divide-y divide-white/5 sm:grid-cols-2">
                  {CATEGORIES.map(item => (
                    <a
                      key={item.id}
                      href={`/${catSlug(item.id)}`}
                      onClick={(e) => handleSubmenuClick(e, item.id)}
                      className="flex w-full items-center justify-between py-3 text-start text-xl font-light tracking-wide text-white transition hover:bg-white/[0.04] hover:text-white/70 sm:text-2xl"
                    >
                      <span>{isArabic ? item.name.ar : item.name.en}</span>
                      <ChevronRight size={24} strokeWidth={1.25} className="text-white/35" />
                    </a>
                  ))}
                </div>
              </nav>
            ) : (
              <nav className="mt-6 flex flex-col gap-5 pb-20 sm:gap-7" aria-label={isArabic ? 'القائمة الرئيسية' : 'Main navigation'}>
                <button type="button" onClick={() => setActiveSubmenu('Products')} className="group flex w-full items-center justify-between text-start font-light tracking-wide text-white transition hover:text-white/70">
                  <span className="text-[24px] sm:text-3xl md:text-4xl">{isArabic ? 'المنتجات' : 'Products'}</span>
                  <ChevronRight size={30} strokeWidth={1.3} className="opacity-95 transition group-hover:translate-x-2" />
                </button>
                <a
                  href="/quiz"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center justify-between py-3 sm:py-4 border-b border-white/10 active:opacity-70 transition-opacity"
                >
                  <span className="text-[24px] sm:text-3xl md:text-4xl font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                    {isArabic ? 'اختار منتجك' : 'Find My Product'}
                  </span>
                  <span className="text-stone-500 text-xl">🎯</span>
                </a>
                                <a
                  href="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full items-center justify-between text-left font-light tracking-wide text-white transition hover:text-white/70"
                >
                  <span className="text-[24px] sm:text-3xl md:text-4xl">{isArabic ? 'المدونة' : 'Blog'}</span>
                </a>
                <a
                  href="/about"
                  onClick={(e) => { e.preventDefault(); setView('about'); setIsMenuOpen(false); setActiveSubmenu(null); }}
                  className="flex w-full items-center justify-between text-left font-light tracking-wide text-white transition hover:text-white/70"
                >
                  <span className="text-[24px] sm:text-3xl md:text-4xl">{isArabic ? 'عن المتجر' : 'About Us'}</span>
                  <Info size={24} strokeWidth={1.3} className="text-white/40" />
                </a>
                <div className="mt-8 border-t border-white/10 pt-8">
                  <a
                    href="https://admin.vexatoys.com"
                    className="flex w-full items-center justify-center gap-2 border border-white/15 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white/75 hover:bg-white hover:text-black transition">
                    <Lock size={15} /> {isArabic ? 'إدارة' : 'Admin'}
                  </a>
                </div>
              </nav>
            )}
          </div>
        </div>

      {isOrdersOpen && (
        <div className="fixed inset-0 z-[20000] flex items-end sm:items-center justify-center" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOrdersOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0d0d0d] rounded-t-3xl sm:rounded-2xl border border-white/10 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-white/60" />
                <h2 className="text-base font-black text-white">{isArabic ? 'طلباتي' : 'My Orders'}</h2>
                {orders.length > 0 && (
                  <span className="bg-white/10 text-white text-xs font-black px-2 py-0.5 rounded-full">{orders.length}</span>
                )}
              </div>
              <button onClick={() => setIsOrdersOpen(false)} aria-label={isArabic ? 'إغلاق' : 'Close'} className="text-white/40 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3">
              {orderStatusSync === 'loading' && <p className="text-xs text-white/50" role="status">{isArabic ? 'جارٍ تحديث حالة الطلبات…' : 'Checking order statuses…'}</p>}
              {orderStatusSync === 'error' && <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-200" role="alert"><span>{isArabic ? 'قد تكون الحالات المعروضة قديمة.' : 'Statuses may be outdated.'}</span><button type="button" className="underline" onClick={() => void refreshOrderStatuses()}>{isArabic ? 'إعادة المحاولة' : 'Retry'}</button></div>}
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <ClipboardList size={40} className="text-white/15" />
                  <p className="text-sm font-bold text-white/40">{isArabic ? 'لا يوجد طلبات بعد' : 'No orders yet'}</p>
                </div>
              ) : (
                orders.map(order => {
                  const si = getStatusInfo(order.status);
                  return (
                    <div key={order.id} className="bg-white/[0.04] border border-white/8 rounded-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                        <div>
                          <p className="text-[11px] text-white/40 font-bold" dir="ltr">{order.id}</p>
                          <p className="text-[10px] text-white/25 mt-0.5">{order.date}</p>
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
                              <p className="text-xs font-bold text-white/80 truncate">{isArabic ? item.product.name : item.product.nameEn}</p>
                              <p className="text-[11px] text-white/40">x{item.quantity} · ${(selectedUnitPrice(item.product, item.selectedVariant) * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                        <p className="text-[11px] text-white/30 pt-1">📍 {order.customer.city}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {orders.length > 0 && <div className="border-t border-white/10 px-4 py-3"><button type="button" className="w-full rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10" onClick={() => { setIsOrdersOpen(false); setView('orders'); }}>{isArabic ? 'عرض تفاصيل الطلبات' : 'View order details'}</button></div>}
          </div>
        </div>
      )}
    </header>
  );
};
