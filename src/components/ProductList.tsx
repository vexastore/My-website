import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { HeroSection } from './HeroSection';
import { CategoryShowcase } from './CategoryShowcase';
import { BuyingGuideBanner } from './BuyingGuideBanner';
import { QuizBanner } from './QuizBanner';
import { RelatedCategories } from './RelatedCategories';
import { FaqAccordion } from './FaqAccordion';
import { CategoryGuideSection } from './CategoryGuideSection';
import { Search, SearchX, SlidersHorizontal, X, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { CATEGORIES, getCategoryTitle, productMatchesCategory } from '../data/categories';

export const ProductList: React.FC = () => {
  const {
    products,
    activeCategory,
    initialCategorySlug,
    seoHeading,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    language,
    isProductsLoading,
  } = useShop();

  const isArabic = language === 'ar';
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openFilterSection, setOpenFilterSection] = useState<'availability' | 'price' | 'categories' | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'low-stock'>('all');
  const [sortBy, setSortBy] = useState<'best' | 'price-low' | 'price-high'>('best');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesCategory = q ? true : productMatchesCategory(product, activeCategory);
    const matchesSearch = !q || (
      product.name.toLowerCase().includes(q) ||
      (product.nameEn || '').toLowerCase().includes(q) ||
      (product.description || '').toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q)
    );
    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'in-stock' && product.stock > 0) ||
      (availabilityFilter === 'low-stock' && product.stock > 0 && product.stock <= 5);
    return matchesCategory && matchesSearch && matchesAvailability;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return b.reviewsCount - a.reviewsCount;
  });

  const scrollToProducts = () => {
    const target = document.getElementById('products-grid');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    setSearchQuery('');
    scrollToProducts();
  };

  const handleViewAllProducts = () => {
    setActiveCategory('');
    setSearchQuery('');
    scrollToProducts();
  };

  const availabilityOptions = [
    { id: 'all', label: isArabic ? 'الكل' : 'All' },
    { id: 'in-stock', label: isArabic ? 'متوفر' : 'In stock' },
    { id: 'low-stock', label: isArabic ? 'كمية قليلة' : 'Low stock' },
  ];

  const sortOptions = [
    { id: 'best', label: isArabic ? 'الأكثر مبيعاً' : 'Best selling' },
    { id: 'price-low', label: isArabic ? 'السعر: الأقل أولاً' : 'Price: low to high' },
    { id: 'price-high', label: isArabic ? 'السعر: الأعلى أولاً' : 'Price: high to low' },
  ];

  useEffect(() => {
    if (!isCategoryDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoryDropdownOpen]);

  const activeCategoryObj = CATEGORIES.find(c => c.id === activeCategory);
  const activeCategoryLabel = activeCategory
    ? (activeCategoryObj ? (isArabic ? activeCategoryObj.name.ar : activeCategoryObj.name.en) : activeCategory)
    : (isArabic ? 'كل الفئات' : 'All categories');

  return (
    <div className="bg-black text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. SHOP BY CATEGORY (5 CARDS) ──────────────────────────── */}
      <CategoryShowcase
        onSelectCategory={handleSelectCategory}
        onViewAllCategories={scrollToProducts}
      />

      {/* ── 3. BEST SELLING PRODUCTS / CATALOG ─────────────────────── */}
      <section id="products-grid" className="mx-auto max-w-7xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8 border-b border-white/10 scroll-mt-24 sm:scroll-mt-28">
        {/* Section Header matching mockup */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {searchQuery
                ? (isArabic ? `نتائج البحث: "${searchQuery}"` : `Search Results: "${searchQuery}"`)
                : activeCategory
                ? getCategoryTitle(activeCategory, isArabic ? 'ar' : 'en')
                : (seoHeading || (isArabic ? 'المنتجات الأكثر مبيعاً' : 'Best Selling Sex Toys'))}
            </h2>
            {/* Hot pink underline bar */}
            <div className="w-12 h-1 bg-[#ff2d78] rounded-full mt-2" />
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            {activeCategory && (
              <button
                type="button"
                onClick={handleViewAllProducts}
                className="text-xs font-bold text-[#ff2d78] hover:underline cursor-pointer"
              >
                {isArabic ? 'عرض كل المنتجات ←' : 'View All Products →'}
              </button>
            )}
            {!activeCategory && (
              <button
                type="button"
                onClick={scrollToProducts}
                className="group flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-white transition cursor-pointer"
              >
                <span>{isArabic ? 'عرض جميع المنتجات' : 'View All Products'}</span>
                <ChevronRight
                  size={14}
                  className={`transition-transform duration-200 ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] items-center gap-2 sm:gap-3" dir={isArabic ? 'rtl' : 'ltr'}>
          {/* Custom Category Dropdown */}
          <div className="relative min-w-0" ref={categoryDropdownRef}>
            <button
              id="catalog-category"
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isCategoryDropdownOpen}
              aria-controls="catalog-category-listbox"
              aria-label={isArabic ? 'اختر الفئة' : 'Choose a category'}
              onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
              className={`h-10 sm:h-11 min-w-0 w-full rounded-xl border bg-[#121212] px-2.5 sm:px-3 text-xs font-bold text-white outline-none transition flex items-center justify-between gap-1.5 cursor-pointer select-none ${
                isCategoryDropdownOpen
                  ? 'border-[#ff2d78] shadow-[0_0_12px_rgba(255,45,120,0.25)]'
                  : 'border-white/15 hover:border-white/30'
              }`}
            >
              <span className="truncate">{activeCategoryLabel}</span>
              <ChevronDown
                size={14}
                className={`shrink-0 text-stone-400 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180 text-[#ff2d78]' : ''
                }`}
              />
            </button>

            {isCategoryDropdownOpen && (
              <div
                id="catalog-category-listbox"
                role="listbox"
                aria-label={isArabic ? 'قائمة الفئات' : 'Categories list'}
                className="absolute top-full mt-1.5 start-0 z-50 w-max min-w-full max-w-[calc(100vw-2rem)] sm:min-w-[220px] rounded-xl border border-white/15 bg-[#121212] p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in duration-150"
              >
                <div className="max-h-60 overflow-y-auto overscroll-contain py-0.5 space-y-0.5 [scrollbar-width:thin] [scrollbar-color:#333_transparent]">
                  {/* All Categories Option */}
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeCategory === ''}
                    onClick={() => {
                      setIsCategoryDropdownOpen(false);
                      handleSelectCategory('');
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-bold transition text-start cursor-pointer ${
                      activeCategory === ''
                        ? 'bg-[#ff2d78]/15 text-[#ff2d78]'
                        : 'text-stone-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{isArabic ? 'كل الفئات' : 'All categories'}</span>
                    {activeCategory === '' && <Check size={14} className="shrink-0 text-[#ff2d78]" />}
                  </button>

                  {/* Individual Categories */}
                  {CATEGORIES.map(cat => {
                    const isSelected = activeCategory === cat.id;
                    const catLabel = isArabic ? cat.name.ar : cat.name.en;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setIsCategoryDropdownOpen(false);
                          handleSelectCategory(cat.id);
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-bold transition text-start cursor-pointer ${
                          isSelected
                            ? 'bg-[#ff2d78]/15 text-[#ff2d78]'
                            : 'text-stone-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{catLabel}</span>
                        {isSelected && <Check size={14} className="shrink-0 text-[#ff2d78]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <label
            className="flex h-10 sm:h-11 min-w-0 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 focus-within:border-[#ff2d78] transition"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <Search size={16} className="shrink-0 text-stone-400" aria-hidden="true" />
            <span className="sr-only">{isArabic ? 'بحث المنتجات' : 'Search products'}</span>
            <input
              type="search"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder={isArabic ? 'ابحث عن منتج...' : 'Search products...'}
              className="min-w-0 w-full bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-stone-500"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            aria-label={isArabic ? 'فتح قائمة الفلتر' : 'Open filter menu'}
            className="inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-3 sm:px-4 text-xs font-bold text-stone-200 transition hover:border-[#ff2d78] hover:text-[#ff2d78] hover:bg-white/5 cursor-pointer"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">{isArabic ? 'فلتر' : 'Filter'}</span>
          </button>
        </div>

        {/* Product Count & Active Category */}
        <div className="mb-6 flex items-center justify-between text-xs font-bold text-stone-400">
          <span>
            {isProductsLoading
              ? (isArabic ? 'جاري التحميل...' : 'Loading...')
              : `${filteredProducts.length} ${isArabic ? 'منتج متاح' : 'products available'}`}
          </span>
          <span>
            {activeCategory === ''
              ? (isArabic ? 'كل المنتجات' : 'All Products')
              : (CATEGORIES.find(c => c.id === activeCategory)?.[isArabic ? 'name' : 'name']?.[isArabic ? 'ar' : 'en'] || activeCategory)}
          </span>
        </div>

        {/* Product Cards Grid - 5 Columns on Desktop matching mockup */}
        {isProductsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-[#0d0d0d] p-3 space-y-3">
                <div className="aspect-square bg-white/5 rounded-xl" />
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
                <div className="h-8 bg-white/5 rounded-full mt-2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 5} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-400">
              <SearchX size={26} />
            </div>
            <h3 className="mb-2 text-base sm:text-lg font-bold text-white">
              {isArabic ? 'لا توجد نتائج' : 'No results found'}
            </h3>
            <p className="max-w-sm text-xs sm:text-sm text-stone-400">
              {isArabic ? 'لم نجد نتائج لبحثك. جرب كلمة أخرى.' : 'No results found. Try another search term.'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 rounded-full border border-white/20 px-5 py-2 text-xs font-bold text-white hover:bg-white hover:text-black transition"
            >
              {isArabic ? 'مسح البحث' : 'Clear search'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-16 text-center">
            <div className="mb-4 text-3xl">📦</div>
            <h3 className="mb-2 text-lg font-bold text-white">
              {isArabic ? 'لا توجد منتجات في هذه الفئة' : 'No products in this category'}
            </h3>
            <p className="mb-5 max-w-sm text-xs sm:text-sm text-stone-400">
              {isArabic ? 'جرّب فئة أخرى أو تواصل معنا عبر واتساب للمساعدة الفورية.' : 'Try another category or contact us on WhatsApp for help.'}
            </p>
            <a
              href="https://wa.me/96176730767"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-black font-bold px-5 py-2.5 rounded-full text-xs transition hover:bg-[#20bd5a]"
            >
              <span>{isArabic ? 'تواصل معنا عبر واتساب' : 'Contact Us on WhatsApp'}</span>
            </a>
          </div>
        )}
      </section>

      {/* ── 4. DYNAMIC CATEGORY GUIDE & FAQS (OR HOMEPAGE SHOWCASE) ── */}
      {activeCategory || initialCategorySlug ? (
        <CategoryGuideSection
          onSelectCategory={handleSelectCategory}
          onViewAllCategories={scrollToProducts}
        />
      ) : (
        <>
          <BuyingGuideBanner />
          <QuizBanner />
          <RelatedCategories
            onSelectCategory={handleSelectCategory}
            onViewAllCategories={scrollToProducts}
          />
          <FaqAccordion onViewAllFaqs={scrollToProducts} />
        </>
      )}

      {/* ── FILTER SLIDE-IN DRAWER ─────────────────────────────────── */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}>
          <div
            className={`absolute inset-y-0 ${isArabic ? 'left-0' : 'right-0'} w-[86%] max-w-[400px] bg-[#121212] border-x border-white/10 text-white shadow-2xl flex flex-col`}
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {isArabic ? 'الفلتر والترتيب' : 'Filter and Sort'}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {filteredProducts.length} {isArabic ? 'منتج متاح' : 'products'}
                </p>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                aria-label={isArabic ? 'إغلاق الفلتر' : 'Close filter'}
                className="text-stone-400 hover:text-white p-1"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-auto flex-1 divide-y divide-white/10">
              {/* Availability Filter */}
              <div className="py-4">
                <button
                  onClick={() => setOpenFilterSection(openFilterSection === 'availability' ? null : 'availability')}
                  className="flex w-full items-center justify-between text-sm font-bold text-stone-200 hover:text-white"
                >
                  <span>{isArabic ? 'حالة التوفر' : 'Availability'}</span>
                  <ChevronRight size={16} className={`transition-transform ${openFilterSection === 'availability' ? 'rotate-90' : ''}`} />
                </button>
                {openFilterSection === 'availability' && (
                  <div className="grid grid-cols-3 gap-2 pt-3">
                    {availabilityOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setAvailabilityFilter(option.id as 'all' | 'in-stock' | 'low-stock')}
                        className={`rounded-lg border px-2 py-2 text-[11px] font-bold transition ${
                          availabilityFilter === option.id
                            ? 'border-[#ff2d78] bg-[#ff2d78] text-white'
                            : 'border-white/15 text-stone-400 hover:text-white hover:border-white/30'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Filter */}
              <div className="py-4">
                <button
                  onClick={() => setOpenFilterSection(openFilterSection === 'price' ? null : 'price')}
                  className="flex w-full items-center justify-between text-sm font-bold text-stone-200 hover:text-white"
                >
                  <span>{isArabic ? 'الترتيب' : 'Sort by'}</span>
                  <ChevronRight size={16} className={`transition-transform ${openFilterSection === 'price' ? 'rotate-90' : ''}`} />
                </button>
                {openFilterSection === 'price' && (
                  <div className="flex flex-col gap-2 pt-3">
                    {sortOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id as 'best' | 'price-low' | 'price-high')}
                        className={`rounded-lg border px-3 py-2 text-xs font-bold transition text-start ${
                          sortBy === option.id
                            ? 'border-[#ff2d78] bg-[#ff2d78]/15 text-[#ff2d78]'
                            : 'border-white/10 text-stone-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories Filter */}
              <div className="py-4">
                <button
                  onClick={() => setOpenFilterSection(openFilterSection === 'categories' ? null : 'categories')}
                  className="flex w-full items-center justify-between text-sm font-bold text-stone-200 hover:text-white"
                >
                  <span>{isArabic ? 'الفئات' : 'Categories'}</span>
                  <ChevronRight size={16} className={`transition-transform ${openFilterSection === 'categories' ? 'rotate-90' : ''}`} />
                </button>
                {openFilterSection === 'categories' && (
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { handleSelectCategory(cat.id); setIsFilterOpen(false); }}
                        className={`rounded-lg border px-2.5 py-2 text-xs font-bold transition text-start ${
                          activeCategory === cat.id
                            ? 'border-[#ff2d78] bg-[#ff2d78] text-white'
                            : 'border-white/10 text-stone-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {isArabic ? cat.name.ar : cat.name.en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 px-5 py-4 flex items-center justify-between gap-4 bg-[#0d0d0d]">
              <button
                onClick={() => { setSearchQuery(''); setAvailabilityFilter('all'); setSortBy('best'); handleSelectCategory(''); }}
                className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
              >
                {isArabic ? 'إعادة ضبط' : 'Reset all'}
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-[#ff2d78] hover:bg-[#e11d48] text-white px-6 py-2 rounded-xl text-xs font-bold transition shadow-md"
              >
                {isArabic ? 'تطبيق الفلتر' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
