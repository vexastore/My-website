import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { ShoppingBag, Search, Menu, X, ChevronRight, ChevronLeft, Lock, Package, Truck, CheckCircle2, XCircle, Search as SearchIcon } from 'lucide-react';

const VexaLogo = () => (
  <div
    className="relative select-none flex-shrink-0"
    style={{
      filter: 'drop-shadow(0 0 14px rgba(220,20,20,0.8)) drop-shadow(0 0 30px rgba(180,0,0,0.5))',
    }}
  >
    <img
      src="/vexa-logo.jpg"
      alt="Vexa Store Lebanon"
      className="h-[62px] w-[62px] sm:h-[76px] sm:w-[76px] rounded-full object-cover"
      style={{
        border: '2px solid rgba(220,30,30,0.7)',
        boxShadow: '0 0 18px rgba(220,20,20,0.6), 0 0 36px rgba(180,0,0,0.35)',
      }}
    />
  </div>
);

export const Navbar: React.FC = () => {
  const {
    currentView,
    setView,
    activeCategory,
    setActiveCategory,
    getCartItemsCount,
    searchQuery,
    setSearchQuery,
    cart,
    orders,
    language,
    toggleLanguage
  } = useShop();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackInput, setTrackInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null | 'not_found'>(null);

  const isArabic = language === 'ar';

  const categories = [
    { id: 'Sex Toys', name: isArabic ? 'ألعاب زوجية' : 'Sex Toys', hasArrow: true },
    { id: 'Vibrators', name: isArabic ? 'هزازات' : 'Vibrators' },
    { id: 'Male Toys', name: isArabic ? 'ألعاب رجالية' : 'Male Toys', hasArrow: true },
    { id: 'Dildos', name: isArabic ? 'ديلدو' : 'Dildos' },
    { id: 'Lingerie', name: isArabic ? 'لانجري' : 'Lingerie' },
    { id: 'BDSM', name: isArabic ? 'ألعاب القوة' : 'BDSM' },
    { id: 'Holiday Collection', name: isArabic ? 'مجموعة الأعياد' : 'Holiday Collection' },
    { id: 'New Arrivals', name: isArabic ? 'وصل حديثاً' : 'New Arrivals' }
  ];

  const sexToysSubmenu = [
    { ar: 'ديلدو', en: 'Dildos', category: 'Dildos' },
    { ar: 'هزازات', en: 'Vibrators', category: 'Vibrators' },
    { ar: 'سدادة شرجية', en: 'Butt Plugs', category: 'Butt Plugs' },
    { ar: 'عبودية', en: 'Bondage', category: 'Bondage' },
    { ar: 'دمى جنسية', en: 'Sex Dolls', category: 'Sex Dolls' },
    { ar: 'ألعاب الشرج', en: 'Anal Toys', category: 'Anal Toys' },
    { ar: 'أحزمة', en: 'Strap-ons', category: 'Strap Ons' },
    { ar: 'كرات كيجل', en: 'Kegel Balls', category: 'Kegel Balls' },
    { ar: 'معززات ومؤخرات جنسية', en: 'Sexual Enhancers & Delays', category: 'Sexual Enhancers' },
    { ar: 'مضخات وأكمام القضيب', en: 'Penis Pumps & Sleeves', category: 'Penis Pumps' },
    { ar: 'بوبرز', en: 'Poppers', category: 'Poppers' },
    { ar: 'ماكينات الجنس', en: 'Sex Machines', category: 'Sex Machines' }
  ];

  const maleToysSubmenu = [
    { ar: 'حلقات القضيب', en: 'Cock Rings', category: 'Cock Rings' },
    { ar: 'مضخات القضيب والأكمام', en: 'Penis Pumps & Sleeves', category: 'Penis Pumps' },
    { ar: 'دمى جنسية', en: 'Sex Dolls', category: 'Sex Dolls' },
    { ar: 'أدوات الاستمناء', en: 'Masturbators', category: 'Masturbators' },
    { ar: 'العفة', en: "Chastity", category: 'Chastity' },
    { ar: 'ألعاب الشرج', en: 'Anal Toys', category: 'Anal Toys' },
    { ar: 'معززات ومؤخرات جنسية', en: 'Sexual Enhancers & Delays', category: 'Sexual Enhancers' },
    { ar: 'ماكينات الجنس', en: 'Sex Machines', category: 'Sex Machines' },
    { ar: 'مواد التشحيم', en: 'Lubricants', category: 'Lubricants' },
    { ar: 'بوبرز', en: 'Poppers', category: 'Poppers' }
  ];

  const openShopHome = () => {
    setView('shop');
    setActiveCategory('Sex Toys');
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (catId: string) => {
    if (catId === 'Sex Toys' || catId === 'Male Toys') {
      setActiveSubmenu(catId);
      return;
    }
    setActiveCategory(catId);
    setSearchQuery('');
    setView('shop');
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  };

  const handleSubmenuClick = (category: string) => {
    setActiveCategory(category);
    setSearchQuery('');
    setView('shop');
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  };

  const handleCartClick = () => {
    if (cart.length === 0) {
      alert(isArabic ? 'سلة المشتريات فارغة. أضف منتجات أولاً.' : 'Your cart is empty. Add products first.');
      return;
    }
    setView('checkout');
  };

  const handleTrackOrder = () => {
    const id = trackInput.trim().toUpperCase();
    if (!id) return;
    const found = orders.find(o => o.id.toUpperCase() === id);
    setTrackedOrder(found || 'not_found');
  };

  const getStatusInfo = (status: Order['status']) => {
    const map = {
      pending:   { icon: <Package size={14} className="animate-pulse" />, label: isArabic ? 'قيد المراجعة' : 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      shipping:  { icon: <Truck size={14} />, label: isArabic ? 'قيد الشحن' : 'Shipped', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      delivered: { icon: <CheckCircle2 size={14} />, label: isArabic ? 'تم الاستلام' : 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      cancelled: { icon: <XCircle size={14} />, label: isArabic ? 'ملغي' : 'Cancelled', color: 'bg-red-50 text-red-600 border-red-200' },
    };
    return map[status] || map.pending;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050101] text-white" dir="ltr">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid h-[88px] grid-cols-[1fr_auto_1fr] items-center sm:h-[108px]">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex h-14 w-14 items-center justify-center justify-self-start text-white transition hover:text-white/70"
            aria-label="Open menu"
          >
            <Menu size={28} strokeWidth={1.5} />
          </button>

          <button onClick={openShopHome} className="justify-self-center" aria-label="Vexa Store home">
            <VexaLogo />
          </button>

          <div className="flex items-center justify-end gap-2.5 sm:gap-5">
            <button onClick={() => setIsSearchOpen((v) => !v)} className="text-white transition hover:text-white/70" aria-label="Search">
              <Search size={28} strokeWidth={1.4} />
            </button>
            <button
              onClick={toggleLanguage}
              className="border border-white/20 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
              aria-label="Toggle language"
            >
              {isArabic ? 'EN' : 'AR'}
            </button>
            <button onClick={handleCartClick} className="relative text-white transition hover:text-white/70" aria-label="Cart">
              <ShoppingBag size={28} strokeWidth={1.35} />
              {getCartItemsCount() > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-[11px] font-black text-black">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-5">
            <div className="mx-auto flex max-w-2xl items-center gap-3 border border-white/20 bg-white/5 px-4 py-3">
              <Search size={20} className="text-white/60" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن المنتجات...' : 'Search products...'}
                className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/40"
              />
              <button onClick={() => setIsSearchOpen(false)} className="text-white/60 hover:text-white"><X size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[10000] overflow-y-auto bg-[#050101] text-white" dir="ltr">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid h-[88px] grid-cols-[1fr_auto_1fr] items-center sm:h-[108px]">
              <button
                onClick={() => { if (activeSubmenu) { setActiveSubmenu(null); } else { setIsMenuOpen(false); } }}
                className="flex h-14 w-14 items-center justify-center justify-self-start text-white transition hover:text-white/70"
              >
                {activeSubmenu ? <ChevronLeft size={36} strokeWidth={1.2} /> : <X size={38} strokeWidth={1.05} />}
              </button>
              <button onClick={openShopHome} className="justify-self-center"><VexaLogo /></button>
              <div className="flex items-center justify-end gap-2.5 sm:gap-7">
                <button onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }} className="text-white transition hover:text-white/70">
                  <Search size={30} strokeWidth={1.25} />
                </button>
                <button onClick={toggleLanguage} className="border border-white/20 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black">
                  {isArabic ? 'EN' : 'AR'}
                </button>
                <button onClick={handleCartClick} className="relative text-white transition hover:text-white/70">
                  <ShoppingBag size={30} strokeWidth={1.2} />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-[11px] font-black text-black">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {activeSubmenu === 'Sex Toys' || activeSubmenu === 'Male Toys' ? (
              <nav className="mt-5 flex flex-col pb-20">
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="flex items-center gap-3 text-[24px] font-light tracking-wide text-white sm:text-3xl">
                    {activeSubmenu === 'Male Toys' && <span className="text-white/90">←</span>}
                    {isArabic ? (activeSubmenu === 'Male Toys' ? 'ألعاب رجالية' : 'ألعاب زوجية') : activeSubmenu}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/25">Collections</span>
                </div>
                <div className="flex flex-col divide-y divide-white/5">
                  {(activeSubmenu === 'Male Toys' ? maleToysSubmenu : sexToysSubmenu).map((item) => (
                    <button key={item.en} onClick={() => handleSubmenuClick(item.category)}
                      className="flex w-full items-center justify-between py-4 text-left text-[24px] font-light tracking-wide text-white transition hover:bg-white/[0.04] hover:text-white/70 sm:py-4.5 sm:text-3xl">
                      <span>{isArabic ? item.ar : item.en}</span>
                      <ChevronRight size={24} strokeWidth={1.25} className="text-white/35" />
                    </button>
                  ))}
                </div>
              </nav>
            ) : (
              <nav className="mt-6 flex flex-col gap-5 pb-20 sm:gap-7">
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => handleCategoryClick(cat.id)}
                    className={`group flex w-full items-center justify-between text-left font-light tracking-wide text-white transition hover:text-white/70 ${currentView === 'shop' && activeCategory === cat.id ? 'text-white' : ''}`}>
                    <span className="text-[24px] sm:text-3xl md:text-4xl">{cat.name}</span>
                    {cat.hasArrow && <ChevronRight size={30} strokeWidth={1.3} className="opacity-95 transition group-hover:translate-x-2" />}
                  </button>
                ))}

                <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-8">
                  <button
                    onClick={() => { setIsTrackingOpen(true); setIsMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 border border-white/15 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white/75 hover:bg-white hover:text-black"
                  >
                    <Package size={15} /> {isArabic ? 'تتبع طلبي' : 'Track Order'}
                  </button>
                  <button
                    onClick={() => { setView('admin'); setIsMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 border border-white/15 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white/75 hover:bg-white hover:text-black"
                  >
                    <Lock size={15} /> {isArabic ? 'إدارة' : 'Admin'}
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      )}

      {/* Track Order Modal */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-white">{isArabic ? 'تتبع طلبك' : 'Track Your Order'}</h2>
              <button onClick={() => { setIsTrackingOpen(false); setTrackedOrder(null); setTrackInput(''); }} className="text-white/50 hover:text-white transition">
                <X size={22} />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                value={trackInput}
                onChange={e => setTrackInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrackOrder()}
                placeholder={isArabic ? 'رقم الطلب (مثال: ORD-ABC123)' : 'Order ID (e.g. ORD-ABC123)'}
                className="flex-1 bg-white/5 border border-white/15 text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-white/40 transition placeholder:text-white/30"
                dir="ltr"
              />
              <button onClick={handleTrackOrder} className="bg-white text-black font-black px-4 py-3 rounded-xl hover:bg-stone-100 transition text-sm">
                {isArabic ? 'بحث' : 'Search'}
              </button>
            </div>

            {trackedOrder === 'not_found' && (
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300 font-bold text-center">
                {isArabic ? 'لم يتم العثور على طلب بهذا الرقم.' : 'No order found with this ID.'}
              </div>
            )}

            {trackedOrder && trackedOrder !== 'not_found' && (() => {
              const order = trackedOrder as Order;
              const statusInfo = getStatusInfo(order.status);
              return (
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white/50 uppercase tracking-widest">{isArabic ? 'رقم الطلب' : 'Order ID'}</span>
                      <span className="text-sm font-black text-white" dir="ltr">{order.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white/50 uppercase tracking-widest">{isArabic ? 'الحالة' : 'Status'}</span>
                      <span className={`inline-flex items-center gap-1.5 border px-3 py-1 rounded-full text-xs font-black ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white/50 uppercase tracking-widest">{isArabic ? 'التاريخ' : 'Date'}</span>
                      <span className="text-xs text-white/70">{order.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white/50 uppercase tracking-widest">{isArabic ? 'الإجمالي' : 'Total'}</span>
                      <span className="text-sm font-black text-white">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">{isArabic ? 'المنتجات' : 'Items'}</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.product.image && (
                            <img src={item.product.image} alt="" className="h-10 w-10 rounded-lg object-cover flex-shrink-0 bg-white/10" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{item.product.name || item.product.nameEn}</p>
                            <p className="text-[11px] text-white/50">x{item.quantity} · ${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.customer && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{isArabic ? 'معلومات التوصيل' : 'Delivery Info'}</p>
                      <p className="text-xs text-white/80 font-bold">{order.customer.name}</p>
                      <p className="text-xs text-white/50">{order.customer.city} · {order.customer.address}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </header>
  );
};
