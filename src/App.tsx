import React, { lazy, Suspense, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';
import { ShieldCheck, Lock, Heart, Mail, Info } from 'lucide-react';
import { getCategorySeoTab } from './data/categories';

const Checkout = lazy(() => import('./components/Checkout').then(m => ({ default: m.Checkout })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const MyOrders = lazy(() => import('./components/MyOrders').then(m => ({ default: m.MyOrders })));
const FloatingWhatsApp = lazy(() => import('./components/FloatingWhatsApp').then(m => ({ default: m.FloatingWhatsApp })));
const VexaToast = lazy(() => import('./components/VexaToast').then(m => ({ default: m.VexaToast })));
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const ProductPage = lazy(() => import('./components/ProductPage').then(m => ({ default: m.ProductPage })));

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
  { id: 'Sex Toys',          slug: 'sex-toys',          ar: 'ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ ÃÂ²ÃÂÃÂ¬ÃÂÃÂ©',            en: 'Sex Toys' },
  { id: 'Vibrators',         slug: 'vibrators',         ar: 'ÃÂÃÂ²ÃÂ§ÃÂ²ÃÂ§ÃÂª',                  en: 'Vibrators' },
  { id: 'Dildos',            slug: 'dildos',            ar: 'ÃÂ¯ÃÂÃÂÃÂ¯ÃÂ',                   en: 'Dildos' },
  { id: 'Lingerie',          slug: 'lingerie',          ar: 'ÃÂÃÂ§ÃÂÃÂ¬ÃÂ±ÃÂ',                  en: 'Lingerie' },
  { id: 'Male Toys',         slug: 'male-toys',         ar: 'ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ ÃÂ±ÃÂ¬ÃÂ§ÃÂÃÂÃÂ©',            en: 'Male Toys' },
  { id: 'BDSM',              slug: 'bdsm',              ar: 'ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ ÃÂ§ÃÂÃÂÃÂÃÂ©',             en: 'BDSM' },
  { id: 'Butt Plugs',        slug: 'butt-plugs',        ar: 'ÃÂ³ÃÂ¯ÃÂ§ÃÂ¯ÃÂ© ÃÂ´ÃÂ±ÃÂ¬ÃÂÃÂ©',             en: 'Butt Plugs' },
  { id: 'Anal Toys',         slug: 'anal-toys',         ar: 'ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ ÃÂ§ÃÂÃÂ´ÃÂ±ÃÂ¬',             en: 'Anal Toys' },
  { id: 'Bondage',           slug: 'bondage',           ar: 'ÃÂ¹ÃÂ¨ÃÂÃÂ¯ÃÂÃÂ©',                  en: 'Bondage' },
  { id: 'Sex Dolls',         slug: 'sex-dolls',         ar: 'ÃÂ¯ÃÂÃÂ ÃÂ¬ÃÂÃÂ³ÃÂÃÂ©',              en: 'Sex Dolls' },
  { id: 'Strap Ons',         slug: 'strap-ons',         ar: 'ÃÂ£ÃÂ­ÃÂ²ÃÂÃÂ©',                   en: 'Strap-ons' },
  { id: 'Kegel Balls',       slug: 'kegel-balls',       ar: 'ÃÂÃÂ±ÃÂ§ÃÂª ÃÂÃÂÃÂ¬ÃÂ',               en: 'Kegel Balls' },
  { id: 'Sexual Enhancers',  slug: 'sexual-enhancers',  ar: 'ÃÂÃÂ¹ÃÂ²ÃÂ²ÃÂ§ÃÂª ÃÂ¬ÃÂÃÂ³ÃÂÃÂ©',            en: 'Sexual Enhancers' },
  { id: 'Penis Pumps',       slug: 'penis-pumps',       ar: 'ÃÂÃÂ¶ÃÂ®ÃÂ§ÃÂª ÃÂ§ÃÂÃÂÃÂ¶ÃÂÃÂ¨',            en: 'Penis Pumps' },
  { id: 'Cock Rings',        slug: 'cock-rings',        ar: 'ÃÂ­ÃÂÃÂÃÂ§ÃÂª ÃÂ§ÃÂÃÂÃÂ¶ÃÂÃÂ¨',            en: 'Cock Rings' },
  { id: 'Masturbators',      slug: 'masturbators',      ar: 'ÃÂ£ÃÂ¯ÃÂÃÂ§ÃÂª ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂÃÂ§ÃÂ¡',          en: 'Masturbators' },
  { id: 'Chastity',          slug: 'chastity',          ar: 'ÃÂ§ÃÂÃÂ¹ÃÂÃÂ©',                   en: 'Chastity' },
  { id: 'Sex Machines',      slug: 'sex-machines',      ar: 'ÃÂÃÂ§ÃÂÃÂÃÂÃÂ§ÃÂª ÃÂ§ÃÂÃÂ¬ÃÂÃÂ³',           en: 'Sex Machines' },
  { id: 'Lubricants',        slug: 'lubricants',        ar: 'ÃÂÃÂÃÂ§ÃÂ¯ ÃÂ§ÃÂÃÂªÃÂ´ÃÂ­ÃÂÃÂ',             en: 'Lubricants' },
  { id: 'Poppers',           slug: 'poppers',           ar: 'ÃÂ¨ÃÂÃÂ¨ÃÂ±ÃÂ²',                   en: 'Poppers' },
  { id: 'New Arrivals',      slug: 'new-arrivals',      ar: 'ÃÂÃÂµÃÂ ÃÂ­ÃÂ¯ÃÂÃÂ«ÃÂ§ÃÂ',              en: 'New Arrivals' },
  { id: 'Holiday Collection',slug: 'holiday-collection',ar: 'ÃÂÃÂ¬ÃÂÃÂÃÂ¹ÃÂ© ÃÂ§ÃÂÃÂ£ÃÂ¹ÃÂÃÂ§ÃÂ¯',           en: 'Holiday Collection' },
];

const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
  </div>
);

const AppContent: React.FC = () => {
  const { currentView, language, activeCategory, searchQuery, setView, setActiveCategory, selectedProduct } = useShop();
  const isArabic = language === 'ar';

  useEffect(() => {
    const lang = isArabic ? 'ar' : 'en';
    if (currentView === 'shop') {
      if (searchQuery) {
        document.title = isArabic
          ? `ÃÂÃÂªÃÂ§ÃÂ¦ÃÂ¬ ÃÂ§ÃÂÃÂ¨ÃÂ­ÃÂ«: ${searchQuery} | ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ`
          : `Search: ${searchQuery} | Vexa Store Lebanon`;
      } else {
        document.title = getCategorySeoTab(activeCategory, lang);
      }
    } else if (currentView === 'checkout') {
      document.title = isArabic ? 'ÃÂ¥ÃÂªÃÂÃÂ§ÃÂ ÃÂ§ÃÂÃÂ·ÃÂÃÂ¨ | ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ' : 'Checkout | Vexa Store Lebanon';
    } else if (currentView === 'about') {
      document.title = isArabic
        ? 'ÃÂ¹ÃÂ ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§ | ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ ÃÂ²ÃÂÃÂ¬ÃÂÃÂ© ÃÂÃÂÃÂ§ÃÂÃÂ¬ÃÂ±ÃÂ ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ'
        : 'About Vexa Store | Sex Toys & Lingerie Lebanon - Discreet Delivery';
    } else if (currentView === 'orders') {
      document.title = isArabic ? 'ÃÂ·ÃÂÃÂ¨ÃÂ§ÃÂªÃÂ | ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ' : 'My Orders | Vexa Store Lebanon';
    } else if (currentView === 'admin') {
      document.title = 'Admin Panel | Vexa Store';
    } else if (currentView === 'product' && selectedProduct) {
      document.title = `${selectedProduct.nameEn || selectedProduct.name} | Vexa Store Lebanon`;
    }
  }, [currentView, activeCategory, searchQuery, isArabic]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (currentView === 'about') {
      window.history.replaceState(null, '', '/about');
    } else if (currentView === 'product' && selectedProduct) {
      const prodSlug = (selectedProduct as typeof selectedProduct & { slug?: string }).slug ||
        (selectedProduct.nameEn || selectedProduct.name || '').toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60);
      const productPath = '/product/' + prodSlug;
      if (lastProductPathRef.current !== productPath) {
        lastProductPathRef.current = productPath;
        window.history.pushState(null, '', productPath);
      }
    } else if (currentView === 'shop') {
      const slug = CATEGORY_SLUGS[activeCategory] || activeCategory.toLowerCase().replace(/\s+/g, '-');
      window.history.replaceState(null, '', '/' + slug);
      lastProductPathRef.current = '';
    }
  }, [currentView, activeCategory, selectedProduct]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const catMeta: Record<string, string> = {
      'Sex Toys': 'ÃÂ§ÃÂ´ÃÂªÃÂ± ÃÂ£ÃÂÃÂ¶ÃÂ ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ ÃÂ²ÃÂÃÂ¬ÃÂÃÂ© ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂÃÂ²ÃÂ§ÃÂ²ÃÂ§ÃÂªÃÂ ÃÂ¯ÃÂÃÂÃÂ¯ÃÂÃÂ ÃÂÃÂ§ÃÂÃÂ¬ÃÂ±ÃÂ. ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂÃÂÃÂ³ ÃÂ§ÃÂÃÂÃÂÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂªÃÂ ÃÂ¯ÃÂÃÂ¹ ÃÂ¹ÃÂÃÂ¯ ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'Vibrators': 'ÃÂÃÂ²ÃÂ§ÃÂ²ÃÂ§ÃÂª ÃÂÃÂ§ÃÂ®ÃÂ±ÃÂ© ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ. ÃÂ§ÃÂ®ÃÂªÃÂ± ÃÂÃÂ ÃÂ£ÃÂÃÂ¶ÃÂ ÃÂ§ÃÂÃÂÃÂ§ÃÂ±ÃÂÃÂ§ÃÂª Ã¢ÂÂ ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂÃÂÃÂ³ ÃÂ§ÃÂÃÂÃÂÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂªÃÂ ÃÂ¯ÃÂÃÂ¹ ÃÂ¹ÃÂÃÂ¯ ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'Male Toys': 'ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ ÃÂ±ÃÂ¬ÃÂ§ÃÂÃÂÃÂ© ÃÂÃÂ§ÃÂ®ÃÂ±ÃÂ© ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ³ÃÂ±ÃÂÃÂ¹ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂª ÃÂÃÂ¬ÃÂÃÂÃÂ¹ ÃÂ§ÃÂÃÂÃÂÃÂ§ÃÂ·ÃÂ. ÃÂ¯ÃÂÃÂ¹ ÃÂ¹ÃÂÃÂ¯ ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'Dildos': 'ÃÂ¯ÃÂÃÂÃÂ¯ÃÂ ÃÂ¢ÃÂÃÂ ÃÂÃÂµÃÂÃÂÃÂ¹ ÃÂÃÂ ÃÂ§ÃÂÃÂ³ÃÂÃÂÃÂÃÂÃÂÃÂ ÃÂ§ÃÂÃÂ·ÃÂ¨ÃÂ Ã¢ÂÂ ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ ÃÂÃÂ ÃÂÃÂÃÂ³ ÃÂ§ÃÂÃÂÃÂÃÂÃÂ ÃÂ¯ÃÂÃÂ¹ ÃÂ¹ÃÂÃÂ¯ ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'Lingerie': 'ÃÂÃÂ§ÃÂÃÂ¬ÃÂ±ÃÂ ÃÂÃÂ§ÃÂ®ÃÂ± ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂ¯ÃÂ§ÃÂÃÂªÃÂÃÂÃÂ ÃÂ³ÃÂ§ÃÂªÃÂ§ÃÂÃÂ ÃÂÃÂ£ÃÂ·ÃÂÃÂ ÃÂ­ÃÂÃÂÃÂÃÂÃÂ©. ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ³ÃÂ±ÃÂÃÂ¹ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂª ÃÂÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'BDSM': 'ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ BDSM ÃÂ¢ÃÂÃÂÃÂ© ÃÂÃÂÃÂÃÂ¨ÃÂªÃÂ¯ÃÂ¦ÃÂÃÂ ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂÃÂÃÂÃÂ¯ÃÂ ÃÂ±ÃÂÃÂ´ÃÂ ÃÂ¹ÃÂµÃÂ§ÃÂ¨ÃÂ§ÃÂª ÃÂ¹ÃÂÃÂ. ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂª. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'Holiday Collection': 'ÃÂÃÂ¯ÃÂ§ÃÂÃÂ§ ÃÂ±ÃÂÃÂÃÂ§ÃÂÃÂ³ÃÂÃÂ© ÃÂÃÂ£ÃÂ·ÃÂÃÂ ÃÂÃÂÃÂÃÂ²ÃÂ© ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂÃÂ«ÃÂ§ÃÂÃÂÃÂ© ÃÂÃÂÃÂÃÂÃÂ§ÃÂ³ÃÂ¨ÃÂ§ÃÂª. ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂªÃÂ ÃÂ¯ÃÂÃÂ¹ ÃÂ¹ÃÂÃÂ¯ ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'New Arrivals': 'ÃÂ£ÃÂ­ÃÂ¯ÃÂ« ÃÂÃÂÃÂªÃÂ¬ÃÂ§ÃÂª ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§ ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ. ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂª ÃÂÃÂ¬ÃÂÃÂÃÂ¹ ÃÂ§ÃÂÃÂÃÂÃÂ§ÃÂ·ÃÂ ÃÂ®ÃÂÃÂ§ÃÂ 72 ÃÂ³ÃÂ§ÃÂ¹ÃÂ©.',
      'Butt Plugs': 'ÃÂ³ÃÂ¯ÃÂ§ÃÂ¯ÃÂ© ÃÂ´ÃÂ±ÃÂ¬ÃÂÃÂ© ÃÂ¢ÃÂÃÂÃÂ© ÃÂÃÂÃÂ±ÃÂÃÂ­ÃÂ© ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂªÃÂ ÃÂ¯ÃÂÃÂ¹ ÃÂ¹ÃÂÃÂ¯ ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'Anal Toys': 'ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ ÃÂ´ÃÂ±ÃÂ¬ÃÂÃÂ© ÃÂÃÂªÃÂÃÂÃÂ¹ÃÂ© ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂª ÃÂÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'Lubricants': 'ÃÂÃÂÃÂ§ÃÂ¯ ÃÂªÃÂ´ÃÂ­ÃÂÃÂ ÃÂÃÂ§ÃÂ¦ÃÂÃÂ© ÃÂ¢ÃÂÃÂÃÂ© ÃÂ¹ÃÂÃÂ ÃÂ§ÃÂÃÂ¨ÃÂ´ÃÂ±ÃÂ© ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂªÃÂ ÃÂ¯ÃÂÃÂ¹ ÃÂ¹ÃÂÃÂ¯ ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'Masturbators': 'ÃÂ£ÃÂ¯ÃÂÃÂ§ÃÂª ÃÂ§ÃÂ³ÃÂªÃÂÃÂÃÂ§ÃÂ¡ ÃÂ±ÃÂ¬ÃÂ§ÃÂÃÂÃÂ© ÃÂÃÂ§ÃÂ®ÃÂ±ÃÂ© ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂª. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
      'Cock Rings': 'ÃÂ­ÃÂÃÂÃÂ§ÃÂª ÃÂÃÂ¶ÃÂÃÂ¨ ÃÂ³ÃÂÃÂÃÂÃÂÃÂÃÂ ÃÂ·ÃÂ¨ÃÂ ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ Ã¢ÂÂ ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂª ÃÂÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ. ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§.',
    };
    const defaultDesc = 'ÃÂ£ÃÂÃÂ¶ÃÂ ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂ´ÃÂ±ÃÂ§ÃÂ¡ ÃÂ£ÃÂÃÂ¹ÃÂ§ÃÂ¨ ÃÂ²ÃÂÃÂ¬ÃÂÃÂ©ÃÂ ÃÂÃÂ²ÃÂ§ÃÂ²ÃÂ§ÃÂªÃÂ ÃÂÃÂÃÂ§ÃÂÃÂ¬ÃÂ±ÃÂ ÃÂÃÂ§ÃÂ®ÃÂ± ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ. ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂÃÂÃÂ³ ÃÂ§ÃÂÃÂÃÂÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂª ÃÂÃÂ®ÃÂÃÂ§ÃÂ 72 ÃÂ³ÃÂ§ÃÂ¹ÃÂ© ÃÂÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ. ÃÂ¯ÃÂÃÂ¹ ÃÂ¹ÃÂÃÂ¯ ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂ§ÃÂ. ÃÂªÃÂºÃÂÃÂÃÂ ÃÂ³ÃÂ±ÃÂ 100%.';
    const desc = currentView === 'about'
      ? 'ÃÂªÃÂ¹ÃÂ±ÃÂ ÃÂ¹ÃÂÃÂ ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§ Ã¢ÂÂ ÃÂ§ÃÂÃÂÃÂªÃÂ¬ÃÂ± ÃÂ§ÃÂÃÂ£ÃÂÃÂ«ÃÂ± ÃÂ£ÃÂÃÂ§ÃÂÃÂ§ÃÂ ÃÂÃÂ®ÃÂµÃÂÃÂµÃÂÃÂ© ÃÂÃÂÃÂÃÂÃÂªÃÂ¬ÃÂ§ÃÂª ÃÂ§ÃÂÃÂ²ÃÂÃÂ¬ÃÂÃÂ© ÃÂÃÂ§ÃÂÃÂÃÂ§ÃÂÃÂ¬ÃÂ±ÃÂ ÃÂÃÂ ÃÂÃÂ¨ÃÂÃÂ§ÃÂ. ÃÂªÃÂÃÂµÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ ÃÂ¨ÃÂÃÂ±ÃÂÃÂª.'
      : (catMeta[activeCategory] || defaultDesc);
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', window.location.href);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', window.location.href);
    // Ã¢ÂÂÃ¢ÂÂ Dynamic og:title + twitter tags per category/view Ã¢ÂÂÃ¢ÂÂ
      const ogTitle = document.title;
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', ogTitle);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', ogTitle);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', desc);
    }, [currentView, activeCategory, selectedProduct]);

  const handleCatLink = (e: React.MouseEvent, catId: string) => {
    e.preventDefault();
    setActiveCategory(catId);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentView) {
      case 'shop':     return <ProductList />;
      case 'checkout': return <Suspense fallback={<PageLoader />}><Checkout /></Suspense>;
      case 'admin':    return <Suspense fallback={<PageLoader />}><AdminPanel /></Suspense>;
      case 'orders':   return <Suspense fallback={<PageLoader />}><MyOrders /></Suspense>;
      case 'about':    return <Suspense fallback={<PageLoader />}><About /></Suspense>;
      case 'product':  return <Suspense fallback={<PageLoader />}><ProductPage /></Suspense>;
      default:         return <ProductList />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050101] text-stone-900 flex flex-col font-sans" dir={isArabic ? 'rtl' : 'ltr'}>
      <Navbar />
      <Suspense fallback={null}><FloatingWhatsApp /></Suspense>
      <Suspense fallback={null}><VexaToast /></Suspense>
      <main className="vexa-page-shell flex-grow">{renderView()}</main>

      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">

        {/* Ã¢ÂÂÃ¢ÂÂ Category Sitemap (SEO Internal Links) Ã¢ÂÂÃ¢ÂÂ */}
        <nav aria-label={isArabic ? 'ÃÂ§ÃÂÃÂªÃÂµÃÂÃÂÃÂÃÂ§ÃÂª' : 'Product Categories'}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 border-b border-stone-800">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-4">
            {isArabic ? 'ÃÂªÃÂµÃÂÃÂ­ ÃÂ§ÃÂÃÂªÃÂµÃÂÃÂÃÂÃÂ§ÃÂª' : 'Browse Categories'}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {FOOTER_CATEGORIES.map(cat => (
              <a
                key={cat.slug}
                href={`/${cat.slug}`}
                onClick={(e) => handleCatLink(e, cat.id)}
                className="text-xs text-stone-400 hover:text-white transition-colors"
              >
                {isArabic ? cat.ar : cat.en}
              </a>
            ))}
          </div>
        </nav>

        {/* Ã¢ÂÂÃ¢ÂÂ Main Footer Grid Ã¢ÂÂÃ¢ÂÂ */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-300 bg-clip-text text-transparent">
              VEXA STORE
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-medium">
              {isArabic
                ? 'ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§ (Vexa Store) ÃÂÃÂ ÃÂ§ÃÂÃÂÃÂªÃÂ¬ÃÂ± ÃÂ§ÃÂÃÂ±ÃÂ§ÃÂ¦ÃÂ¯ ÃÂÃÂ§ÃÂÃÂ£ÃÂÃÂ«ÃÂ± ÃÂ£ÃÂÃÂ§ÃÂÃÂ§ÃÂ ÃÂÃÂÃÂÃÂÃÂªÃÂ¬ÃÂ§ÃÂª ÃÂ§ÃÂÃÂ²ÃÂÃÂ¬ÃÂÃÂ©ÃÂ ÃÂ§ÃÂÃÂÃÂ§ÃÂÃÂ¬ÃÂ±ÃÂÃÂ ÃÂÃÂÃÂ³ÃÂªÃÂÃÂ²ÃÂÃÂ§ÃÂª ÃÂ§ÃÂÃÂ³ÃÂ¹ÃÂ§ÃÂ¯ÃÂ© ÃÂ§ÃÂÃÂ±ÃÂÃÂÃÂ§ÃÂÃÂ³ÃÂÃÂ© ÃÂ§ÃÂÃÂÃÂ§ÃÂ®ÃÂ±ÃÂ©. ÃÂÃÂ­ÃÂ ÃÂÃÂµÃÂÃÂ¹ ÃÂªÃÂ¬ÃÂ±ÃÂ¨ÃÂ© ÃÂªÃÂ³ÃÂÃÂ ÃÂÃÂ±ÃÂÃÂ¯ÃÂ© ÃÂÃÂÃÂ«ÃÂÃÂ±ÃÂ© ÃÂÃÂ ÃÂ¨ÃÂÃÂ¦ÃÂ© ÃÂ¢ÃÂÃÂÃÂ© ÃÂªÃÂ¶ÃÂÃÂ ÃÂ§ÃÂÃÂ®ÃÂµÃÂÃÂµÃÂÃÂ© ÃÂ§ÃÂÃÂÃÂ·ÃÂÃÂÃÂ©.'
                : 'Vexa Store is a discreet premium destination for couples products, lingerie, and romantic essentials. We create a private, secure, and elevated shopping experience with absolute confidentiality.'}
            </p>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs bg-stone-800/50 p-2.5 rounded-lg border border-stone-800 shadow-inner">
              <ShieldCheck size={18} className="text-indigo-400" />
              <span>{isArabic ? 'ÃÂ®ÃÂµÃÂÃÂµÃÂÃÂ© ÃÂÃÂ§ÃÂÃÂÃÂ© ÃÂÃÂªÃÂºÃÂÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂ­ÃÂÃÂ 100%' : 'Full privacy and 100% discreet packaging'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-stone-800 pb-2">
              <Heart size={14} className="text-rose-500" /> {isArabic ? 'ÃÂÃÂ¹ÃÂÃÂÃÂÃÂ§ÃÂª ÃÂªÃÂÃÂÃÂ' : 'Important Info'}
            </h4>
            <ul className="text-xs text-stone-400 space-y-2 font-medium">
              <li>{isArabic ? 'Ã¢ÂÂ¢ ÃÂ§ÃÂÃÂªÃÂÃÂµÃÂÃÂ ÃÂÃÂÃÂÃÂÃÂ²ÃÂ ÃÂ®ÃÂÃÂ§ÃÂ 24 - 48 ÃÂ³ÃÂ§ÃÂ¹ÃÂ© ÃÂÃÂ­ÃÂ¯ ÃÂ£ÃÂÃÂµÃÂ.' : 'Ã¢ÂÂ¢ Home delivery within 24 - 48 hours maximum.'}</li>
              <li>{isArabic ? 'Ã¢ÂÂ¢ ÃÂ§ÃÂÃÂ¯ÃÂÃÂ¹ ÃÂÃÂÃÂ¯ÃÂ§ÃÂ ÃÂ£ÃÂ ÃÂ¨ÃÂ§ÃÂÃÂ´ÃÂ¨ÃÂÃÂ© ÃÂ¹ÃÂÃÂ¯ ÃÂ§ÃÂ³ÃÂªÃÂÃÂ§ÃÂ ÃÂ·ÃÂÃÂ¨ÃÂ (COD).' : 'Ã¢ÂÂ¢ Cash or card payment on delivery (COD).'}</li>
              <li>{isArabic ? 'Ã¢ÂÂ¢ ÃÂÃÂ±ÃÂªÃÂÃÂ ÃÂ³ÃÂ±ÃÂ ÃÂÃÂºÃÂÃÂ ÃÂ¨ÃÂ§ÃÂÃÂÃÂ§ÃÂÃÂ ÃÂÃÂ§ ÃÂÃÂ­ÃÂªÃÂÃÂ ÃÂ¹ÃÂÃÂ ÃÂ§ÃÂ³ÃÂ ÃÂ§ÃÂÃÂÃÂ­ÃÂªÃÂÃÂ ÃÂ£ÃÂ ÃÂ§ÃÂÃÂÃÂªÃÂ¬ÃÂ±.' : 'Ã¢ÂÂ¢ Plain sealed box with no product or store name.'}</li>
              <li>{isArabic ? 'Ã¢ÂÂ¢ ÃÂÃÂÃÂªÃÂ¬ÃÂ§ÃÂª ÃÂ£ÃÂµÃÂÃÂÃÂ© 100% ÃÂÃÂÃÂµÃÂÃÂÃÂ¹ÃÂ© ÃÂÃÂ ÃÂÃÂÃÂ§ÃÂ¯ ÃÂ·ÃÂ¨ÃÂÃÂ© ÃÂ¢ÃÂÃÂÃÂ© ÃÂ¹ÃÂÃÂ ÃÂ§ÃÂÃÂ¨ÃÂ´ÃÂ±ÃÂ©.' : 'Ã¢ÂÂ¢ Original products made from body-safe materials.'}</li>
            </ul>
          </div>

          <div className="space-y-4">
            {(() => {
              const waText = isArabic
                ? encodeURIComponent('ÃÂÃÂ±ÃÂ­ÃÂ¨ÃÂ§ÃÂ ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§ÃÂ ÃÂ£ÃÂ±ÃÂºÃÂ¨ ÃÂÃÂ ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂÃÂ³ÃÂ§ÃÂ± ÃÂ¹ÃÂ ÃÂ§ÃÂÃÂÃÂÃÂªÃÂ¬ÃÂ§ÃÂª ÃÂ£ÃÂ ÃÂ§ÃÂÃÂÃÂ³ÃÂ§ÃÂ¹ÃÂ¯ÃÂ© ÃÂÃÂ ÃÂ·ÃÂÃÂ¨ÃÂ ÃÂ¨ÃÂÃÂ ÃÂ®ÃÂµÃÂÃÂµÃÂÃÂ©.')
                : encodeURIComponent('Hello Vexa Store, I would like to inquire about products or need assistance with an order with full privacy.');
              return (
                <>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-stone-800 pb-2">
                    <Mail size={14} className="text-purple-400" />
                    {isArabic ? 'ÃÂ®ÃÂ¯ÃÂÃÂ© ÃÂ§ÃÂÃÂ¯ÃÂ¹ÃÂ ÃÂ§ÃÂÃÂÃÂÃÂ Ã°ÂÂÂ' : 'Customer Support Ã°ÂÂÂ'}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-medium">
                    {isArabic
                      ? 'ÃÂÃÂ±ÃÂÃÂ ÃÂ§ÃÂÃÂ¯ÃÂ¹ÃÂ ÃÂ§ÃÂÃÂÃÂÃÂ ÃÂÃÂ ÃÂÃÂªÃÂ¬ÃÂ± ÃÂÃÂÃÂÃÂ³ÃÂ§ ÃÂÃÂªÃÂÃÂ§ÃÂ¬ÃÂ¯ ÃÂÃÂÃÂ³ÃÂ§ÃÂ¹ÃÂ¯ÃÂªÃÂÃÂ ÃÂÃÂ§ÃÂÃÂ¥ÃÂ¬ÃÂ§ÃÂ¨ÃÂ© ÃÂ¹ÃÂÃÂ ÃÂ£ÃÂ ÃÂ§ÃÂ³ÃÂªÃÂÃÂ³ÃÂ§ÃÂ±ÃÂ§ÃÂª ÃÂªÃÂªÃÂ¹ÃÂÃÂ ÃÂ¨ÃÂ§ÃÂÃÂÃÂÃÂªÃÂ¬ÃÂ§ÃÂªÃÂ ÃÂ§ÃÂÃÂ·ÃÂÃÂ¨ÃÂ§ÃÂªÃÂ ÃÂ£ÃÂ ÃÂ§ÃÂÃÂ´ÃÂ­ÃÂ ÃÂ¨ÃÂ³ÃÂ±ÃÂÃÂ© ÃÂªÃÂ§ÃÂÃÂ©.'
                      : 'Vexa Store support team is available to assist you with any inquiries regarding products, orders, or shipping with absolute privacy.'}
                  </p>
                  <div className="bg-stone-800/40 border border-stone-800 p-3 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-indigo-400 block">
                      {isArabic ? 'ÃÂ³ÃÂ§ÃÂ¹ÃÂ§ÃÂª ÃÂ§ÃÂÃÂ¹ÃÂÃÂ:' : 'Working Hours:'}
                    </span>
                    <span className="text-xs font-bold text-stone-200 block" dir={isArabic ? 'rtl' : 'ltr'}>
                      {isArabic ? 'ÃÂ§ÃÂÃÂ¥ÃÂ«ÃÂÃÂÃÂ ÃÂ¥ÃÂÃÂ ÃÂ§ÃÂÃÂ³ÃÂ¨ÃÂªÃÂ ÃÂ¨:ÃÂ ÃÂ  ÃÂµÃÂ¨ÃÂ§ÃÂ­ÃÂ§ÃÂ - ÃÂ¦:ÃÂ ÃÂ  ÃÂÃÂ³ÃÂ§ÃÂ¡ÃÂ' : 'Monday - Saturday, 8:00 AM - 6:00 PM'}
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/96176730767?text=${waText}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-md border border-emerald-500/20"
                    dir={isArabic ? 'rtl' : 'ltr'}
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.845-1.587-5.921.003-6.556 5.338-11.891 11.893-11.891 3.176.001 6.165 1.236 8.413 3.484 2.248 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.544.916 3.21 1.399 4.909 1.4 5.424 0 9.835-4.411 9.838-9.835.002-2.628-1.021-5.1-2.88-6.958-1.859-1.859-4.331-2.88-6.955-2.881-5.423 0-9.835 4.412-9.838 9.836-.001 1.79.491 3.535 1.425 5.047l-1.012 3.7 3.784-.993zm11.458-7.228c-.312-.156-1.847-.91-2.132-1.014-.285-.104-.492-.156-.7.156-.207.312-.802 1.014-.983 1.221-.181.208-.363.234-.675.078-.312-.156-1.317-.485-2.51-1.549-.928-.827-1.554-1.849-1.736-2.161-.182-.312-.02-.481.136-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.207.052-.39-.026-.546-.078-.156-.7-1.688-.959-2.311-.253-.61-.51-.527-.7-.537-.182-.01-.39-.01-.597-.01-.208 0-.545.078-.83.39-.285.312-1.089 1.065-1.089 2.597 0 1.533 1.115 3.013 1.271 3.221.156.208 2.193 3.349 5.313 4.699.742.32 1.32.512 1.77.654.745.237 1.423.204 1.959.124.597-.089 1.847-.754 2.108-1.442.261-.689.261-1.274.182-1.39-.078-.118-.285-.182-.597-.338z" />
                    </svg>
                    {isArabic ? 'ÃÂ§ÃÂÃÂ¯ÃÂ¹ÃÂ ÃÂ§ÃÂÃÂÃÂÃÂ ÃÂ¹ÃÂ¨ÃÂ± ÃÂÃÂ§ÃÂªÃÂ³ÃÂ§ÃÂ¨' : 'WhatsApp Live Chat'}
                  </a>
                  <div className="flex flex-col gap-1 pt-1 text-xs">
                    <a href="mailto:Vexastore72@gmail.com" className="hover:text-indigo-400 font-bold flex items-center gap-1 underline" dir="ltr">
                      Vexastore72@gmail.com
                    </a>
                    <span className="text-[10px] text-stone-500 block">
                      {isArabic
                        ? 'ÃÂªÃÂÃÂ¨ÃÂÃÂ: ÃÂÃÂ°ÃÂ§ ÃÂ§ÃÂÃÂÃÂÃÂÃÂ¹ ÃÂÃÂÃÂ£ÃÂ²ÃÂÃÂ§ÃÂ¬ ÃÂÃÂ§ÃÂÃÂ¨ÃÂ§ÃÂÃÂºÃÂÃÂ ÃÂÃÂÃÂ·. ÃÂ§ÃÂ³ÃÂªÃÂ®ÃÂ¯ÃÂ§ÃÂÃÂ ÃÂÃÂÃÂÃÂÃÂÃÂ¹ ÃÂÃÂÃÂ«ÃÂ ÃÂÃÂÃÂ§ÃÂÃÂÃÂªÃÂ ÃÂ¹ÃÂÃÂ ÃÂ´ÃÂ±ÃÂÃÂ· ÃÂ§ÃÂÃÂ®ÃÂµÃÂÃÂµÃÂÃÂ© ÃÂ§ÃÂÃÂªÃÂ§ÃÂÃÂ©.'
                        : 'Notice: This website is strictly for couples and adults (+18) only. Your use implies full agreement to our privacy terms.'}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Ã¢ÂÂÃ¢ÂÂ Bottom Bar Ã¢ÂÂÃ¢ÂÂ */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-stone-800 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-medium">
          <p>ÃÂ© {new Date().getFullYear()} Vexa Store Lebanon Ã¢ÂÂ <a href="/sitemap.xml" className="hover:text-stone-300 transition" rel="nofollow">Sitemap</a></p>
          <div className="flex items-center gap-4">
            <a
              href="/about"
              onClick={(e) => { e.preventDefault(); setView('about'); window.scrollTo({ top: 0 }); }}
              className="flex items-center gap-1 hover:text-stone-300 transition"
            >
              <Info size={12} />
              {isArabic ? 'ÃÂ¹ÃÂ ÃÂ§ÃÂÃÂÃÂªÃÂ¬ÃÂ±' : 'About Us'}
            </a>
            <span className="flex items-center gap-1">
              <Lock size={12} /> {isArabic ? 'ÃÂ³ÃÂÃÂ§ÃÂ³ÃÂ© ÃÂ§ÃÂÃÂ®ÃÂµÃÂÃÂµÃÂÃÂ© ÃÂ§ÃÂÃÂ³ÃÂ±ÃÂÃÂ©' : 'Privacy Policy'}
            </span>
            <span>{isArabic ? 'ÃÂ´ÃÂ±ÃÂÃÂ· ÃÂ§ÃÂÃÂ§ÃÂ³ÃÂªÃÂ®ÃÂ¯ÃÂ§ÃÂ' : 'Terms'}</span>
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
