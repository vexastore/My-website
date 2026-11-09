'use client';
import React, { lazy, Suspense, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { OpenInBrowserBanner } from './components/OpenInBrowserBanner';

import { ProductList } from './components/ProductList';
import { canonicalProductPath } from '@/lib/productSeo';
import { ProductPage } from './components/ProductPage';

const Checkout = lazy(() => import('./components/Checkout').then(m => ({ default: m.Checkout })));
const MyOrders = lazy(() => import('./components/MyOrders').then(m => ({ default: m.MyOrders })));
const FloatingWhatsApp = lazy(() => import('./components/FloatingWhatsApp').then(m => ({ default: m.FloatingWhatsApp })));
const VexaToast = lazy(() => import('./components/VexaToast').then(m => ({ default: m.VexaToast })));
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));

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

const FOOTER_CATEGORIES = [
  { id: 'Adult Toys',        slug: 'adult-toys',        ar: 'كل منتجات الكبار',        en: 'Adult Toys Lebanon' },
  { id: 'Sex Toys',          slug: 'sex-toys',          ar: 'ألعاب زوجية',            en: 'Sex Toys' },
  { id: 'Vibrators',         slug: 'vibrators',         ar: 'هزازات',                  en: 'Vibrators' },
  { id: 'Dildos',            slug: 'dildos',            ar: 'ديلدو',                   en: 'Dildos' },
  { id: 'Lingerie',          slug: 'lingerie',          ar: 'لانجري',                  en: 'Lingerie' },
  { id: 'Male Toys',         slug: 'male-toys',         ar: 'ألعاب رجالية',            en: 'Male Toys' },
  { id: 'BDSM',              slug: 'bdsm',              ar: 'ألعاب القوة',             en: 'BDSM' },
  { id: 'Butt Plugs',        slug: 'butt-plugs',        ar: 'سدادة شرجية',             en: 'Butt Plugs' },
  { id: 'Anal Toys',         slug: 'anal-toys',         ar: 'ألعاب الشرج',             en: 'Anal Toys' },
  { id: 'Bondage',           slug: 'bondage',           ar: 'عبودية',                  en: 'Bondage' },
  { id: 'Sex Dolls',         slug: 'sex-dolls',         ar: 'دمى جنسية',              en: 'Sex Dolls' },
  { id: 'Strap Ons',         slug: 'strap-ons',         ar: 'أحزمة',                   en: 'Strap-ons' },
  { id: 'Kegel Balls',       slug: 'kegel-balls',       ar: 'كرات كيجل',               en: 'Kegel Balls' },
  { id: 'Sexual Enhancers',  slug: 'sexual-enhancers',  ar: 'معززات جنسية',            en: 'Sexual Enhancers' },
  { id: 'Penis Pumps',       slug: 'penis-pumps',       ar: 'مضخات القضيب',            en: 'Penis Pumps' },
  { id: 'Cock Rings',        slug: 'cock-rings',        ar: 'حلقات القضيب',            en: 'Cock Rings' },
  { id: 'Masturbators',      slug: 'masturbators',      ar: 'أدوات الاستمناء',          en: 'Masturbators' },
  { id: 'Chastity',          slug: 'chastity',          ar: 'العفة',                   en: 'Chastity' },
  { id: 'Sex Machines',      slug: 'sex-machines',      ar: 'ماكينات الجنس',           en: 'Sex Machines' },
  { id: 'Lubricants',        slug: 'lubricants',        ar: 'مواد التشحيم',             en: 'Lubricants' },
  { id: 'Poppers',           slug: 'poppers',           ar: 'بوبرز',                   en: 'Poppers' },
  { id: 'New Arrivals',      slug: 'new-arrivals',      ar: 'وصل حديثاً',              en: 'New Arrivals' },
  { id: 'Holiday Collection',slug: 'holiday-collection',ar: 'مجموعة الأعياد',           en: 'Holiday Collection' },
];

const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
  </div>
);

export const AppContent: React.FC<{ seoContent?: React.ReactNode }> = ({ seoContent }) => {
  const { currentView, language, activeCategory, setView, setActiveCategory, selectedProduct } = useShop();
  const isArabic = language === 'ar';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (currentView === 'about') {
      window.history.replaceState(null, '', '/about');
    } else if (currentView === 'product' && selectedProduct) {
      const productPath = canonicalProductPath(selectedProduct);
      if (location.pathname !== productPath) {
        window.history.replaceState(null, '', productPath);
      }
    } else if (currentView === 'shop') {
      const pts = window.location.pathname.split('/').filter(Boolean);
      const SINGLE = ['about', 'checkout', 'orders', 'admin', 'advice', 'sitemap.xml', 'products', 'product'];
      const onProductPath = (pts.length === 2 && !SINGLE.includes(pts[0]))
        || window.location.pathname.startsWith('/products/')
        || window.location.pathname.startsWith('/product/');
      if (!onProductPath) {
        const slug = CATEGORY_SLUGS[activeCategory] || activeCategory.toLowerCase().replace(/\s+/g, '-');
        window.history.replaceState(null, '', '/' + slug);
      }
    }
  }, [currentView, activeCategory, selectedProduct]);

  const handleCatLink = (e: React.MouseEvent, catId: string) => {
    if (catId === 'Adult Toys') return;
    e.preventDefault();
    setActiveCategory(catId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentView) {
      case 'shop':     return <ProductList />;
      case 'checkout': return <Suspense fallback={<PageLoader />}><Checkout /></Suspense>;
      case 'admin':    return <a href="https://admin.vexatoys.com">Open administration</a>;
      case 'orders':   return <Suspense fallback={<PageLoader />}><MyOrders /></Suspense>;
      case 'about':    return <Suspense fallback={<PageLoader />}><About /></Suspense>;
      case 'product':  return <ProductPage />;
      default:         return <ProductList />;
    }
  };

  return (
    <div className="min-h-screen bg-vexa-ink text-white flex flex-col font-sans" dir={isArabic ? 'rtl' : 'ltr'}>
      <OpenInBrowserBanner />
      <Navbar />
      <Suspense fallback={null}><FloatingWhatsApp /></Suspense>
      <Suspense fallback={null}><VexaToast /></Suspense>
      <main className="vexa-page-shell flex-grow">{renderView()}</main>

      {seoContent}

      {/* ── FOOTER MATCHING CLIENT MOCKUP ──────────────────────────────────── */}
      <footer className="bg-vexa-ink text-stone-300 border-t border-white/10 mt-auto" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Row */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 pb-10 border-b border-white/10 text-center lg:text-start">
            {/* Left: Brand Identity */}
            <div className="flex flex-col items-center lg:items-start">
              <a href="/" onClick={(e) => { e.preventDefault(); setActiveCategory(''); }} className="flex flex-col select-none group">
                <span className="text-2xl font-black tracking-wider text-vexa-pink group-hover:brightness-110 transition leading-none">
                  VEXA
                </span>
                <span className="text-[10px] font-bold tracking-[0.32em] text-vexa-pink group-hover:brightness-110 transition mt-0.5 leading-none">
                  TOYS
                </span>
              </a>
              <a href="/" className="text-xs text-stone-400 mt-3 font-medium hover:text-white transition">
                {isArabic ? 'ألعاب ومنتجات للكبار في لبنان' : 'Sex Toys & Adult Toys in Lebanon'}
              </a>
            </div>

            {/* Right: verified contact only. Social icons return once real brand accounts exist. */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-start">
                <span className="text-[11px] font-semibold text-stone-400">{isArabic ? 'خدمة العملاء' : 'Customer care'}</span>
                <span className="text-xs text-stone-300">{isArabic ? 'واتساب فقط، بسرية تامة' : 'WhatsApp only, in confidence'}</span>
              </div>

              <a
                href="https://wa.me/96176730767"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-vexa-whatsapp hover:bg-[#20bd5a] text-black px-4 py-2.5 rounded-full transition-all shadow-lg active:scale-95"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-4 w-4 fill-black" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.845-1.587-5.921.003-6.556 5.338-11.891 11.893-11.891 3.176.001 6.165 1.236 8.413 3.484 2.248 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.544.916 3.21 1.399 4.909 1.4 5.424 0 9.835-4.411 9.838-9.835.002-2.628-1.021-5.1-2.88-6.958-1.859-1.859-4.331-2.88-6.955-2.881-5.423 0-9.835 4.412-9.838 9.836-.001 1.79.491 3.535 1.425 5.047l-1.012 3.7 3.784-.993zm11.458-7.228c-.312-.156-1.847-.91-2.132-1.014-.285-.104-.492-.156-.7.156-.207.312-.802 1.014-.983 1.221-.181.208-.363.234-.675.078-.312-.156-1.317-.485-2.51-1.549-.928-.827-1.554-1.849-1.736-2.161-.182-.312-.02-.481.136-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.207.052-.39-.026-.546-.078-.156-.7-1.688-.959-2.311-.253-.61-.51-.527-.7-.537-.182-.01-.39-.01-.597-.01-.208 0-.545.078-.83.39-.285.312-1.089 1.065-1.089 2.597 0 1.533 1.115 3.013 1.271 3.221.156.208 2.193 3.349 5.313 4.699.742.32 1.32.512 1.77.654.745.237 1.423.204 1.959.124.597-.089 1.847-.754 2.108-1.442.261-.689.261-1.274.182-1.39-.078-.118-.285-.182-.597-.338z"/>
                  </svg>
                </div>
                <div className="flex flex-col text-start leading-tight">
                  <span className="text-[10px] font-bold text-black/80">{isArabic ? 'واتساب فقط' : 'WhatsApp Only'}</span>
                  <span className="text-xs font-black text-black" dir="ltr">+961 76 730 767</span>
                </div>
              </a>
            </div>
          </div>

          {/* Category Internal Links (for SEO) */}
          <div className="py-6 border-b border-white/5">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-stone-400">
              {FOOTER_CATEGORIES.map(cat => (
                <a
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={(e) => handleCatLink(e, cat.id)}
                  className="hover:text-white transition-colors"
                >
                  {isArabic ? cat.ar : cat.en}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            <p>© {new Date().getFullYear()} Vexa Toys Lebanon. All rights reserved.</p>
            <div className="flex items-center gap-5 font-medium">
              <a
                href="/about"
                onClick={(e) => { e.preventDefault(); setView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition"
              >
                {isArabic ? 'عن المتجر' : 'About'}
              </a>
              <a
                href="https://wa.me/96176730767"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                {isArabic ? 'اتصل بنا' : 'Contact'}
              </a>
              <a
                href="/privacy"
                className="hover:text-white transition"
              >
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a
                href="/terms"
                className="hover:text-white transition"
              >
                {isArabic ? 'الشروط والأحكام' : 'Terms'}
              </a>
              <a
                href="/warranty"
                className="hover:text-white transition"
              >
                {isArabic ? 'الضمان' : 'Warranty'}
              </a>
              <a
                href="/delivery"
                className="hover:text-white transition"
              >
                {isArabic ? 'التوصيل' : 'Delivery'}
              </a>
              <a
                href="/returns"
                className="hover:text-white transition"
              >
                {isArabic ? 'سياسة الاسترجاع' : 'Returns'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
