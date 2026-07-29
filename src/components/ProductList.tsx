import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { SearchX, ShoppingBag, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, getCategoryTitle, productMatchesCategory, getCategorySeoTab } from '../data/categories';

const PAGE_SIZE = 12;

export const ProductList: React.FC = () => {
  const { products, activeCategory, setActiveCategory, searchQuery, setSearchQuery, language, isProductsLoading } = useShop();
  const isArabic = language === 'ar';
  // Dynamic title + meta description per category (SEO)
  useEffect(() => {
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    if (cat) {
      document.title = cat.seoTab[isArabic ? 'ar' : 'en'];
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const desc = isArabic
          ? cat.titlePage.ar + ' - توصيل سري بنفس اليوم في بيروت. دفع عند الاستلام. تغليف سري 100%. متجر فيكسا لبنان.'
          : cat.titlePage.en + ' - Same day discreet delivery in Beirut. Cash on delivery. 100% discreet packaging. Vexa Store Lebanon.';
        metaDesc.setAttribute('content', desc);
      }
    }
  }, [activeCategory, isArabic]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openFilterSection, setOpenFilterSection] = useState<'availability' | 'price' | 'categories' | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'low-stock'>('all');
  const [sortBy, setSortBy] = useState<'best' | 'price-low' | 'price-high'>('best');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

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
        : 'Yes. Cash on delivery is available. No online payment required.'
    },
    {
      q: isArabic ? 'ما هي سياسة الإرجاع؟' : "What's your return policy?",
      a: isArabic
        ? 'راحتك وثقتك مهمة لنا. إذا وصلتك أي مشكلة في الطلب أو التغليف، تواصل معنا فوراً وسنساعدك.'
        : 'Your comfort and trust matter to us. If there is any issue with your order, contact us right away and our team will help.'
    },
    {
      q: isArabic ? 'هل المنتجات جديدة بالكامل؟' : 'Are your items brand new?',
      a: isArabic
        ? 'نعم، كل المنتجات جديدة بالكامل ومغلقة داخل عبواتها الأصلية.'
        : 'Yes, all items are brand new and sealed in their original packaging.'
    }
  ];

  const availabilityOptions = [
    { id: 'all', label: isArabic ? 'الكل' : 'All' },
    { id: 'in-stock', label: isArabic ? 'متوفر' : 'In stock' },
    { id: 'low-stock', label: isArabic ? 'كمية قليلة' : 'Low stock' }
  ];

  const sortOptions = [
    { id: 'best', label: isArabic ? 'الأكثر مبيعاً' : 'Best selling' },
    { id: 'price-low', label: isArabic ? 'السعر: الأقل أولاً' : 'Price: low to high' },
    { id: 'price-high', label: isArabic ? 'السعر: الأعلى أولاً' : 'Price: high to low' }
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <section className="border-y border-white/10 bg-[#141414]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 text-white sm:px-8 sm:py-4">
          <ChevronLeft size={20} strokeWidth={1.4} className="text-white/55" />
          <h2 className="text-center text-[11px] font-black uppercase tracking-[0.34em] text-white/65 sm:text-sm">
            {isArabic ? 'توصيل بنفس اليوم في بيروت' : 'Same Day Delivery in Beirut'}
          </h2>
          <ChevronRight size={20} strokeWidth={1.4} className="text-white/55" />
        </div>
      </section>

      <section id="products-grid" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.36em] text-white/35">
              {isArabic ? 'مجموعة متجر فيكسا' : 'Vexa Store Collection'}
            </p>
            <h1 className="mt-2 max-w-3xl text-2xl font-black uppercase tracking-[0.12em] text-white sm:text-3xl">
              {searchQuery
                ? (isArabic ? `نتائج البحث: ${searchQuery}` : `Search: ${searchQuery}`)
                : getCategoryTitle(activeCategory, isArabic ? 'ar' : 'en')}
            </h1>
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            aria-label={isArabic ? 'فتح قائمة الفلتر' : 'Open filter menu'}
            className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/80 transition hover:bg-white hover:text-black"
          >
            <SlidersHorizontal size={14} />
            {isArabic ? 'فلتر' : 'Filter'}
          </button>
        </div>

        <div className="mb-8 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
          <span>
            {isProductsLoading
              ? (isArabic ? 'جاري التحميل...' : 'Loading...')
              : `${filteredProducts.length} ${isArabic ? 'منتج' : 'items'}`}
          </span>
          <span>
            {CATEGORIES.find(c => c.id === activeCategory)?.[isArabic ? 'name' : 'name']?.[isArabic ? 'ar' : 'en'] || activeCategory}
          </span>
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[1.05/1] bg-white/5 rounded-md" />
                <div className="pt-5 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-white/5 rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-14 flex flex-col items-center gap-2">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  aria-label={isArabic ? 'تحميل المزيد من المنتجات' : 'Load more products'}
                  className="border border-white/20 px-10 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/80 transition hover:bg-white hover:text-black active:scale-[0.98]"
                >
                  {isArabic ? 'تحميل المزيد' : 'Load more'}
                </button>
                <p className="text-[10px] text-white/30">
                  {isArabic
                    ? `عرض ${visibleProducts.length} من ${filteredProducts.length}`
                    : `Showing ${visibleProducts.length} of ${filteredProducts.length}`}
                </p>
              </div>
            )}
          </>
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-white/15 bg-white/[0.03] px-4 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50">
              <SearchX size={28} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">
              {isArabic ? 'لا توجد نتائج' : 'No results found'}
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              {isArabic ? 'لم نجد نتائج لبحثك. جرب كلمة أخرى.' : 'No results found. Try another term.'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-5 border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition"
            >
              {isArabic ? 'مسح البحث' : 'Clear search'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-white/15 bg-white/[0.03] px-4 py-20 text-center">
            <div className="mb-5 text-4xl">🔧</div>
            <h3 className="mb-3 text-xl font-black text-white tracking-wide">
              نعمل على تحسين المتجر
            </h3>
            <p className="mb-1 max-w-sm text-sm leading-relaxed text-white/60">
              الموقع تحت الصيانة مؤقتاً. سنعود قريباً بتجربة أفضل.
            </p>
            <p className="mb-6 max-w-sm text-xs leading-relaxed text-white/40">
              We're currently under maintenance. We'll be back shortly with a better experience.
            </p>
            <a
              href="https://wa.me/96176730767?text=مرحبا، متى سيعود المتجر؟"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] px-6 py-3 text-sm font-black text-white tracking-wide transition hover:bg-[#1ebe5d] active:scale-[0.98] rounded-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              تواصل معنا / Contact Us
            </a>
          </div>
        )}
      </section>

      <section className="bg-[#ff8f96] px-5 py-10 text-center text-black sm:py-14">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xl font-black leading-tight tracking-wide sm:text-3xl">
            {isArabic ? (
              <>
                تبحث عن شيء مختلف؟ جرّب{' '}
                <button onClick={() => { setActiveCategory('Vibrators'); setSearchQuery(''); }} className="underline decoration-2 underline-offset-4">
                  الهزازات
                </button>{' '}
                أو{' '}
                <button onClick={() => { setActiveCategory('BDSM'); setSearchQuery(''); }} className="underline decoration-2 underline-offset-4">
                  ألعاب القوة
                </button>
              </>
            ) : (
              <>
                Looking for something different? Try our{' '}
                <button onClick={() => { setActiveCategory('Vibrators'); setSearchQuery(''); }} className="underline decoration-2 underline-offset-4">
                  vibrators
                </button>{' '}
                or{' '}
                <button onClick={() => { setActiveCategory('BDSM'); setSearchQuery(''); }} className="underline decoration-2 underline-offset-4">
                  BDSM
                </button>{' '}
                collection.
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
              <div key={index}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between py-4 text-right text-base font-black tracking-wide text-[#ffc21a] transition hover:text-[#ffd45c] sm:text-xl"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-white/40 sm:text-xl">{openFaq === index ? '-' : '+'}</span>
                </button>
                {openFaq === index && (
                  <p className="pb-5 text-xs leading-6 text-white/65 sm:text-sm">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/45" onClick={() => setIsFilterOpen(false)}>
          <div
            className={`absolute inset-y-0 ${isArabic ? 'left-0' : 'right-0'} w-[86%] max-w-[430px] bg-[#151515] text-white shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div className="flex-1 text-center">
                <h3 className="text-lg font-light tracking-[0.12em] text-white">
                  {isArabic ? 'الفلتر والترتيب' : 'Filter and sort'}
                </h3>
                <p className="mt-1 text-sm font-light tracking-[0.1em] text-white/55">
                  {filteredProducts.length} {isArabic ? 'منتج' : 'products'}
                </p>
              </div>
              <button onClick={() => setIsFilterOpen(false)} aria-label={isArabic ? 'إغلاق الفلتر' : 'Close filter'} className="text-white/70 transition hover:text-white">
                <X size={34} strokeWidth={1.05} />
              </button>
            </div>

            <div className="px-7 py-8 overflow-y-auto max-h-[calc(100vh-160px)]">
              <button
                onClick={() => setOpenFilterSection(openFilterSection === 'availability' ? null : 'availability')}
                className="flex w-full items-center justify-between py-5 text-xl font-light tracking-[0.06em] text-white/70 transition hover:text-white"
              >
                <span>{isArabic ? 'التوفر' : 'Availability'}</span>
                <ChevronRight size={24} strokeWidth={1.1} className={openFilterSection === 'availability' ? 'rotate-90 transition' : 'transition'} />
              </button>
              {openFilterSection === 'availability' && (
                <div className="grid grid-cols-3 gap-2 pb-3">
                  {availabilityOptions.map(option => (
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
                className="flex w-full items-center justify-between py-5 text-xl font-light tracking-[0.06em] text-white/70 transition hover:text-white"
              >
                <span>{isArabic ? 'الترتيب' : 'Sort'}</span>
                <ChevronRight size={24} strokeWidth={1.1} className={openFilterSection === 'price' ? 'rotate-90 transition' : 'transition'} />
              </button>
              {openFilterSection === 'price' && (
                <div className="flex flex-col gap-2 pb-3">
                  {sortOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id as 'best' | 'price-low' | 'price-high')}
                      className={`border px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] transition text-right ${sortBy === option.id ? 'border-white bg-white text-black' : 'border-white/10 text-white/45 hover:text-white'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setOpenFilterSection(openFilterSection === 'categories' ? null : 'categories')}
                className="flex w-full items-center justify-between py-5 text-xl font-light tracking-[0.06em] text-white/70 transition hover:text-white"
              >
                <span>{isArabic ? 'الأقسام' : 'Categories'}</span>
                <ChevronRight size={24} strokeWidth={1.1} className={openFilterSection === 'categories' ? 'rotate-90 transition' : 'transition'} />
              </button>
              {openFilterSection === 'categories' && (
                <div className="grid grid-cols-2 gap-2 pb-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); setIsFilterOpen(false); }}
                      className={`border px-2 py-2 text-[9px] font-black uppercase tracking-[0.1em] transition active:scale-95 ${
                        activeCategory === cat.id
                          ? 'border-white bg-white text-black'
                          : 'border-white/10 text-white/45 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {isArabic ? cat.name.ar : cat.name.en}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 border-t border-white/10 bg-[#151515] px-7 py-5">
              <button
                onClick={() => { setSearchQuery(''); setAvailabilityFilter('all'); setSortBy('best'); }}
                className="text-base font-light tracking-[0.08em] text-white/70 underline underline-offset-4 transition hover:text-white"
              >
                {isArabic ? 'إزالة الفلاتر' : 'Remove all'}
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-white px-10 py-3 text-lg font-light tracking-[0.06em] text-black transition hover:bg-white/90"
              >
                {isArabic ? 'تطبيق' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};