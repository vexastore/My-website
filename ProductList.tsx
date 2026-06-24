import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { SearchX, ShoppingBag, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';

const ProductSkeleton: React.FC = () => (
  <div className="bg-[#050505] animate-pulse">
    <div className="relative overflow-hidden rounded-md border border-white/5 bg-[#101010] shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
      <div className="aspect-[1.05/1] bg-[#1a1a1a]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-white/10 rounded w-1/3" />
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-8 bg-white/10 rounded mt-3" />
      </div>
    </div>
  </div>
);

export const ProductList: React.FC = () => {
  const { products, activeCategory, setActiveCategory, searchQuery, setSearchQuery, language, isProductsLoading } = useShop();
  const isArabic = language === 'ar';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openFilterSection, setOpenFilterSection] = useState<'availability' | 'price' | 'categories' | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'low-stock'>('all');
  const [sortBy, setSortBy] = useState<'best' | 'price-low' | 'price-high'>('best');

  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase();
    const matchesCategory = product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(q) ||
      product.nameEn.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q);
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

  const getCategoryTitle = (catId: string) => {
    const en: Record<string, string> = {
      'Sex Toys': 'Sex Toys Lebanon - New collection available',
      'Vibrators': 'Vibrators - Premium collection available',
      'Male Toys': 'Male Toys - New arrivals available',
      'Dildos': 'Dildos - Premium body-safe collection',
      'Lingerie': 'Lingerie - New sensual collection',
      'BDSM': 'BDSM - Soft play essentials',
      'Holiday Collection': 'Holiday Collection - Limited gifts',
      'New Arrivals': 'New Arrivals - Fresh Vexa drops'
    };
    const ar: Record<string, string> = {
      'Sex Toys': 'ألعاب زوجية في لبنان - مجموعة جديدة متوفرة',
      'Vibrators': 'هزازات فاخرة - مجموعة مميزة متوفرة',
      'Male Toys': 'ألعاب رجالية - وصلت حديثاً',
      'Dildos': 'ديلدو - منتجات آمنة وفاخرة',
      'Lingerie': 'لانجري - مجموعة جديدة ومثيرة',
      'BDSM': 'ألعاب القوة - أساسيات ناعمة وآمنة',
      'Holiday Collection': 'مجموعة الأعياد - هدايا محدودة',
      'New Arrivals': 'وصل حديثاً - أحدث منتجات Vexa'
    };
    return (isArabic ? ar : en)[catId] || catId;
  };

  const filterCategories = [
    { id: 'Sex Toys', label: isArabic ? 'ألعاب زوجية' : 'Sex Toys' },
    { id: 'Vibrators', label: isArabic ? 'هزازات' : 'Vibrators' },
    { id: 'Male Toys', label: isArabic ? 'ألعاب رجالية' : 'Male Toys' },
    { id: 'Dildos', label: isArabic ? 'ديلدو' : 'Dildos' },
    { id: 'Lingerie', label: isArabic ? 'لانجري' : 'Lingerie' },
    { id: 'BDSM', label: isArabic ? 'ألعاب القوة' : 'BDSM' },
    { id: 'Holiday Collection', label: isArabic ? 'مجموعة الأعياد' : 'Holiday' },
    { id: 'New Arrivals', label: isArabic ? 'وصل حديثاً' : 'New Arrivals' }
  ];

  const faqs = [
    {
      q: isArabic ? 'هل تقومون بتوصيل الطلبات بسرية؟' : 'Do you deliver orders discreetly?',
      a: isArabic
        ? 'نعم. كل الطلبات تصل داخل كرتون عادي مغلق بدون شعار المتجر أو اسم المنتج، حفاظاً على خصوصيتك.'
        : 'Yes. Every order is delivered in a plain sealed box with no store logo or product name for full privacy.'
    },
    {
      q: isArabic ? 'هل يمكنني الدفع عند الاستلام؟' : 'Can I pay cash on delivery?',
      a: isArabic
        ? 'نعم. الدفع عند الاستلام متاح. لا تحتاج للدفع أونلاين.'
        : 'Yes. Cash on delivery is available. No online payment is required.'
    },
    {
      q: isArabic ? 'ما هي سياسة الإرجاع؟' : 'What\'s your return policy?',
      a: isArabic
        ? 'راحتك وثقتك مهمة لنا. كل منتج يتم فحصه وتغليفه بعناية قبل الشحن. إذا وصلتك أي مشكلة في الطلب أو التغليف، تواصل معنا فوراً وسنساعدك بأفضل حل مناسب.'
        : 'Your comfort and trust matter to us. Every item is carefully checked and discreetly packed before shipping. If there is any issue with your order or packaging on arrival, contact us right away and our support team will make it right.'
    },
    {
      q: isArabic ? 'هل المنتجات جديدة بالكامل؟' : 'Are your items brand new?',
      a: isArabic
        ? 'نعم، كل المنتجات جديدة بالكامل ومغلقة داخل عبواتها الأصلية.'
        : 'Yes, all items are brand new and sealed in their original packaging.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <section className="border-y border-white/10 bg-[#141414]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 text-white sm:px-8 sm:py-4">
          <ChevronLeft size={20} strokeWidth={1.4} className="text-white/55" />
          <p className="text-center text-[11px] font-black uppercase tracking-[0.34em] text-white/65 sm:text-sm">
            {isArabic ? 'توصيل بنفس اليوم في بيروت' : 'Same Day Delivery in Beirut'}
          </p>
          <ChevronRight size={20} strokeWidth={1.4} className="text-white/55" />
        </div>
      </section>

      <section id="products-grid" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-5" dir={isArabic ? 'rtl' : 'ltr'}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.36em] text-white/35">{isArabic ? 'مجموعة متجر فيكسا' : 'Vexa Store Collection'}</p>
            <h2 className="mt-2 max-w-3xl text-2xl font-black uppercase tracking-[0.12em] text-white sm:text-3xl">
              {searchQuery ? (isArabic ? `نتائج البحث عن: ${searchQuery}` : `Search results for: ${searchQuery}`) : getCategoryTitle(activeCategory)}
            </h2>
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/80 transition hover:bg-white hover:text-black"
          >
            <SlidersHorizontal size={14} />
            {isArabic ? 'فلتر' : 'Filter'}
          </button>
        </div>

        <div className="mb-8 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
          <span>{isProductsLoading ? '...' : filteredProducts.length} {isArabic ? 'منتج' : 'items'}</span>
          <span>{activeCategory}</span>
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-white/15 bg-white/[0.03] px-4 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50">
              {searchQuery ? <SearchX size={28} /> : <ShoppingBag size={28} />}
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">{isArabic ? 'لم يتم العثور على منتجات' : 'No products found'}</h3>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              {isArabic ? 'جرّب كلمة بحث أخرى أو اختر قسماً مختلفاً من القائمة.' : 'Try another search term or choose another collection from the menu.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-5 border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black"
              >
                {isArabic ? 'مسح البحث' : 'Clear search'}
              </button>
            )}
          </div>
        )}
      </section>

      <section className="bg-[#ff8f96] px-5 py-10 text-center text-black sm:py-14">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xl font-black leading-tight tracking-wide sm:text-3xl">
            {isArabic ? (
              <>
                تبحث عن شيء مختلف؟ جرّب أيضاً <button onClick={() => setSearchQuery('vibrators')} className="underline decoration-2 underline-offset-4">الهزازات</button> أو <button onClick={() => setSearchQuery('anal')} className="underline decoration-2 underline-offset-4">ألعاب anal</button>.
              </>
            ) : (
              <>
                Looking for something different? Explore our <button onClick={() => setSearchQuery('vibrators')} className="underline decoration-2 underline-offset-4">vibrators</button> or <button onClick={() => setSearchQuery('anal')} className="underline decoration-2 underline-offset-4">anal toys</button> too.
              </>
            )}
          </h3>
        </div>
      </section>

      <section className="bg-[#151515] py-10 text-white sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-7 text-2xl font-light tracking-[0.08em] sm:text-3xl">
            {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq, index) => (
              <div key={faq.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between py-4 text-left text-base font-black tracking-wide text-[#ffc21a] transition hover:text-[#ffd45c] sm:text-xl"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-white/40 sm:text-xl">{openFaq === index ? '-' : '+'}</span>
                </button>
                {openFaq === index && (
                  <p className="pb-5 text-xs leading-6 text-white/65 sm:text-sm">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/45" onClick={() => setIsFilterOpen(false)}>
          <div className="absolute inset-y-0 right-0 w-[86%] max-w-[430px] bg-[#151515] text-white shadow-2xl" onClick={(e) => e.stopPropagation()} dir="ltr">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div className="flex-1 text-center">
                <h3 className="text-lg font-light tracking-[0.12em] text-white">Filter and sort</h3>
                <p className="mt-1 text-sm font-light tracking-[0.1em] text-white/55">{filteredProducts.length} products</p>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="ml-4 text-white/70 transition hover:text-white"
                aria-label="Close filter"
              >
                <X size={34} strokeWidth={1.05} />
              </button>
            </div>

            <div className="px-7 py-8">
              <button
                onClick={() => setOpenFilterSection(openFilterSection === 'availability' ? null : 'availability')}
                className="flex w-full items-center justify-between py-5 text-left text-xl font-light tracking-[0.06em] text-white/70 transition hover:text-white active:scale-[0.99]"
              >
                <span>Availability</span>
                <ChevronRight size={24} strokeWidth={1.1} className={openFilterSection === 'availability' ? 'rotate-90 transition' : 'transition'} />
              </button>
              {openFilterSection === 'availability' && (
                <div className="grid grid-cols-3 gap-2 pb-3">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'in-stock', label: 'In stock' },
                    { id: 'low-stock', label: 'Low stock' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setAvailabilityFilter(option.id as 'all' | 'in-stock' | 'low-stock')}
                      className={`border px-2 py-2 text-[9px] font-black uppercase tracking-[0.12em] transition ${availabilityFilter === option.id ? 'border-white bg-white text-black' : 'border-white/10 text-white/45 hover:text-white'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setOpenFilterSection(openFilterSection === 'price' ? null : 'price')}
                className="flex w-full items-center justify-between py-5 text-left text-xl font-light tracking-[0.06em] text-white/70 transition hover:text-white active:scale-[0.99]"
              >
                <span>Price</span>
                <ChevronRight size={24} strokeWidth={1.1} className={openFilterSection === 'price' ? 'rotate-90 transition' : 'transition'} />
              </button>
              {openFilterSection === 'price' && (
                <div className="grid grid-cols-2 gap-2 pb-3">
                  {[
                    { id: 'price-low', label: 'Low to high' },
                    { id: 'price-high', label: 'High to low' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id as 'price-low' | 'price-high')}
                      className={`border px-2 py-2 text-[9px] font-black uppercase tracking-[0.12em] transition ${sortBy === option.id ? 'border-white bg-white text-black' : 'border-white/10 text-white/45 hover:text-white'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setOpenFilterSection(openFilterSection === 'categories' ? null : 'categories')}
                className="flex w-full items-center justify-between py-5 text-left text-xl font-light tracking-[0.06em] text-white/70 transition hover:text-white active:scale-[0.99]"
              >
                <span>Categories</span>
                <ChevronRight size={24} strokeWidth={1.1} className={openFilterSection === 'categories' ? 'rotate-90 transition' : 'transition'} />
              </button>
              {openFilterSection === 'categories' && (
                <div className="grid grid-cols-2 gap-2 pb-3">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setSearchQuery('');
                      }}
                      className={`border px-2 py-2 text-[9px] font-black uppercase tracking-[0.12em] transition active:scale-95 ${
                        activeCategory === cat.id
                          ? 'border-white bg-white text-black'
                          : 'border-white/10 text-white/45 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between py-4">
                <span className="text-xl font-light tracking-[0.06em] text-white/60">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'best' | 'price-low' | 'price-high')}
                  className="max-w-[190px] bg-transparent text-right text-base font-light tracking-[0.08em] text-white/75 outline-none"
                >
                  <option className="bg-[#151515] text-white" value="best">Best selling</option>
                  <option className="bg-[#151515] text-white" value="price-low">Price: low to high</option>
                  <option className="bg-[#151515] text-white" value="price-high">Price: high to low</option>
                </select>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 border-t border-white/10 bg-[#151515] px-7 py-5">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Sex Toys');
                }}
                className="text-base font-light tracking-[0.08em] text-white/70 underline underline-offset-4 transition hover:text-white active:scale-95"
              >
                Remove all
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-white px-10 py-3 text-lg font-light tracking-[0.06em] text-black transition hover:bg-white/90 active:scale-95"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
