'use client';
import React, { lazy, Suspense, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { OpenInBrowserBanner } from './components/OpenInBrowserBanner';
import { SiteFooter } from './components/SiteFooter';

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

const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
  </div>
);

export const AppContent: React.FC<{ seoContent?: React.ReactNode }> = ({ seoContent }) => {
  const { currentView, language, activeCategory, selectedProduct } = useShop();
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

      <SiteFooter />
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
