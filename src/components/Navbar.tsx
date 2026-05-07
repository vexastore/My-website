import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Search, Menu, X, ChevronRight, ChevronLeft, Lock, ClipboardList } from 'lucide-react';

const VexaLogo = () => (
  <div className="relative flex h-[58px] w-[58px] select-none items-center justify-center overflow-hidden rounded-full border border-red-500/70 bg-black shadow-[0_0_22px_rgba(255,0,33,0.45)] sm:h-[68px] sm:w-[68px]" aria-label="Vexa Store Lebanon logo">
    <svg
      className="h-full w-full"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <defs>
        <radialGradient id="vexaRedGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffebe1" stopOpacity="0.75" />
          <stop offset="40%" stopColor="#ff1e32" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#050101" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vexaGold" x1="18" y1="68" x2="82" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f6d9a3" />
          <stop offset="0.45" stopColor="#fff3d1" />
          <stop offset="0.72" stopColor="#ff3048" />
          <stop offset="1" stopColor="#f4d6a2" />
        </linearGradient>
        <filter id="vexaGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 1 0 0 0 0 .05 0 0 0 0 .08 0 0 0 .85 0" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="50" cy="50" r="50" fill="#050101" />
      <path
        d="M14 77c9-6 10-17 16-26 2 10 10 14 8 27 7-5 10-14 17-21 0 14 10 18 7 31 11-5 14-17 26-26-3 22-21 34-38 34-17 0-30-6-36-19Z"
        fill="#ff3b10"
        opacity="0.45"
        filter="url(#vexaGlow)"
      />
      <path
        d="M23 82c7-5 8-13 13-20 1 8 7 11 6 20 5-4 8-10 13-16 0 11 7 14 5 23 8-4 11-13 20-20-2 16-16 25-30 25-13 0-23-5-27-12Z"
        fill="#ffd166"
        opacity="0.22"
      />
      <circle cx="50" cy="47" r="43" fill="url(#vexaRedGlow)" opacity="0.9" />
      <circle cx="50" cy="48" r="41" stroke="#ff2338" strokeWidth="2" opacity="0.95" filter="url(#vexaGlow)" />
      <circle cx="50" cy="48" r="46" stroke="#f4d6a2" strokeWidth="0.55" opacity="0.5" />

      {/* clearer woman profile */}
      <path
        d="M47 12c-12 2-22 12-25 25 9-7 21-10 34-7 12 3 21 11 25 25 2-21-13-47-34-43Z"
        fill="#070102"
        opacity="0.98"
      />
      <path
        d="M24 39c7-17 27-28 45-17 9 5 15 16 17 29-13-16-36-22-62-12Z"
        stroke="#ff3048"
        strokeWidth="1.6"
        opacity="0.9"
        filter="url(#vexaGlow)"
      />
      <path
        d="M57 23c5 7 10 12 18 15-7 2-13 1-19-3-3 5-8 8-16 9 8-7 13-13 17-21Z"
        fill="#2b0507"
        opacity="0.9"
      />
      <path
        d="M64 34c7 4 13 11 16 19-9-7-18-11-29-12 5-1 9-3 13-7Z"
        fill="#140203"
        opacity="0.95"
      />

      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="3"
        fill="url(#vexaGold)"
        filter="url(#vexaGlow)"
      >
        VEXA
      </text>
      <path
        d="M24 61c19-9 39-12 57-4"
        stroke="#fff2cb"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.95"
        filter="url(#vexaGlow)"
      />
      <path
        d="M20 64c14-6 24-8 35-8"
        stroke="#ff3048"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.9"
      />
      <line x1="21" y1="75" x2="34" y2="75" stroke="#f4d6a2" strokeWidth="0.55" opacity="0.75" />
      <line x1="66" y1="75" x2="79" y2="75" stroke="#f4d6a2" strokeWidth="0.55" opacity="0.75" />
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="6.4"
        fontWeight="700"
        letterSpacing="4.6"
        fill="#ff4052"
      >
        STORE
      </text>
      <text
        x="50"
        y="93"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="5"
        letterSpacing="3.2"
        fill="#f1d2a5"
        opacity="0.9"
      >
        LEBANON
      </text>
    </svg>
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
    language,
    toggleLanguage
  } = useShop();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

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

          <button
            onClick={openShopHome}
            className="justify-self-center"
            aria-label="Vexa Store home"
          >
            <VexaLogo />
          </button>

          <div className="flex items-center justify-end gap-2.5 sm:gap-5">
            <button
              onClick={() => setIsSearchOpen((v) => !v)}
              className="text-white transition hover:text-white/70"
              aria-label="Search"
            >
              <Search size={28} strokeWidth={1.4} />
            </button>
            <button
              onClick={toggleLanguage}
              className="border border-white/20 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
              aria-label="Toggle language"
            >
              {isArabic ? 'EN' : 'AR'}
            </button>
            <button
              onClick={handleCartClick}
              className="relative text-white transition hover:text-white/70"
              aria-label="Cart"
            >
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
              <button onClick={() => setIsSearchOpen(false)} className="text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[10000] overflow-y-auto bg-[#050101] text-white" dir="ltr">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid h-[88px] grid-cols-[1fr_auto_1fr] items-center sm:h-[108px]">
              <button
                onClick={() => {
                  if (activeSubmenu) {
                    setActiveSubmenu(null);
                  } else {
                    setIsMenuOpen(false);
                  }
                }}
                className="flex h-14 w-14 items-center justify-center justify-self-start text-white transition hover:text-white/70"
                aria-label={activeSubmenu ? 'Back to menu' : 'Close menu'}
              >
                {activeSubmenu ? <ChevronLeft size={36} strokeWidth={1.2} /> : <X size={38} strokeWidth={1.05} />}
              </button>

              <button
                onClick={openShopHome}
                className="justify-self-center"
                aria-label="Vexa Store home"
              >
                <VexaLogo />
              </button>

              <div className="flex items-center justify-end gap-2.5 sm:gap-7">
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  aria-label="Search"
                  className="text-white transition hover:text-white/70"
                >
                  <Search size={30} strokeWidth={1.25} />
                </button>
                <button
                  onClick={toggleLanguage}
                  className="border border-white/20 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
                  aria-label="Toggle language"
                >
                  {isArabic ? 'EN' : 'AR'}
                </button>
                <button
                  onClick={handleCartClick}
                  aria-label="Cart"
                  className="relative text-white transition hover:text-white/70"
                >
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
                    {isArabic
                      ? (activeSubmenu === 'Male Toys' ? 'ألعاب رجالية' : 'ألعاب زوجية')
                      : activeSubmenu}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/25">Collections</span>
                </div>

                <div className="flex flex-col divide-y divide-white/5">
                  {(activeSubmenu === 'Male Toys' ? maleToysSubmenu : sexToysSubmenu).map((item) => (
                    <button
                      key={item.en}
                      onClick={() => handleSubmenuClick(item.category)}
                      className="flex w-full items-center justify-between py-4 text-left text-[24px] font-light tracking-wide text-white transition hover:bg-white/[0.04] hover:text-white/70 sm:py-4.5 sm:text-3xl"
                    >
                      <span>{isArabic ? item.ar : item.en}</span>
                      <ChevronRight size={24} strokeWidth={1.25} className="text-white/35" />
                    </button>
                  ))}
                </div>
              </nav>
            ) : (
              <nav className="mt-6 flex flex-col gap-5 pb-20 sm:gap-7">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`group flex w-full items-center justify-between text-left font-light tracking-wide text-white transition hover:text-white/70 ${
                      currentView === 'shop' && activeCategory === cat.id ? 'text-white' : ''
                    }`}
                  >
                    <span className="text-[24px] sm:text-3xl md:text-4xl">{cat.name}</span>
                    {cat.hasArrow && (
                      <ChevronRight size={30} strokeWidth={1.3} className="opacity-95 transition group-hover:translate-x-2" />
                    )}
                  </button>
                ))}

                <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-8">
                  <button
                    onClick={() => {
                      setView('orders');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 border border-white/15 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white/75 hover:bg-white hover:text-black"
                  >
                    <ClipboardList size={15} /> {isArabic ? 'طلباتي' : 'Orders'}
                  </button>
                  <button
                    onClick={() => {
                      setView('admin');
                      setIsMenuOpen(false);
                    }}
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
    </header>
  );
};