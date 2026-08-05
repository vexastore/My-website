'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CustomerInfo, AdviceArticle } from '../types';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { loadArCache, translateProducts, ArTranslation } from '../utils/translate';

type ViewType = 'shop' | 'checkout' | 'admin' | 'advice' | 'orders' | 'about' | 'product';

interface ShopContextType {
  language: 'en' | 'ar';
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  currentView: ViewType;
  selectedArticle: AdviceArticle | null;
  activeCategory: string;
  searchQuery: string;
  is18PlusVerified: boolean;
  isProductsLoading: boolean;
  arTranslations: Record<string, ArTranslation>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setLanguage: (language: 'en' | 'ar') => void;
  toggleLanguage: () => void;
  setView: (view: ViewType) => void;
  navigateToProduct: (product: Product) => void;
  setSelectedArticle: (article: AdviceArticle | null) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  verifyAge: () => void;
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customer: CustomerInfo) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  deleteOrderLocally: (orderId: string) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getDeliveryFee: () => number;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  fetchProductImages: (productId: string) => Promise<string[]>;
  fetchAllOrdersFromFirebase: () => Promise<Order[]>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}


// ── URL slug → category mapping (for synchronous URL-based initialization) ──
const URL_SLUG_TO_CATEGORY: Record<string, string> = {
  'sex-toys': 'Sex Toys', 'vibrators': 'Vibrators', 'male-toys': 'Male Toys',
  'dildos': 'Dildos', 'lingerie': 'Lingerie', 'bdsm': 'BDSM',
  'holiday-collection': 'Holiday Collection', 'new-arrivals': 'New Arrivals',
  'butt-plugs': 'Butt Plugs', 'anal-toys': 'Anal Toys', 'bondage': 'Bondage',
  'sex-dolls': 'Sex Dolls', 'strap-ons': 'Strap Ons', 'kegel-balls': 'Kegel Balls',
  'sexual-enhancers': 'Sexual Enhancers', 'penis-pumps': 'Penis Pumps',
  'cock-rings': 'Cock Rings', 'masturbators': 'Masturbators', 'chastity': 'Chastity',
  'sex-machines': 'Sex Machines', 'lubricants': 'Lubricants', 'poppers': 'Poppers',
};

const CATEGORY_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(URL_SLUG_TO_CATEGORY).map(([slug, cat]) => [cat, slug])
);

function getInitialCategory(override?: string): string {
  if (override) return override;
  try {
    if (typeof window === 'undefined') return 'Sex Toys';
    const w = window as typeof window & { __INITIAL_CATEGORY__?: string };
    if (w.__INITIAL_CATEGORY__) return w.__INITIAL_CATEGORY__;
    const slug = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    const firstSeg = slug.split("/")[0];
    return URL_SLUG_TO_CATEGORY[slug] || URL_SLUG_TO_CATEGORY[firstSeg] || "Sex Toys";
  } catch { return 'Sex Toys'; }
}

function getInitialView(override?: string): ViewType {
    const VALID_VIEWS: ViewType[] = ["shop","checkout","admin","orders","about","product","advice"];
    if (override && VALID_VIEWS.includes(override as ViewType)) return override as ViewType;
    try {
      const w = window as typeof window & { __INITIAL_VIEW__?: string; __INITIAL_PRODUCT_SLUG__?: string };
      if (w.__INITIAL_VIEW__ === 'about') return 'about';
      const path = window.location.pathname;
      if (path === '/about') return 'about';
      // /products/:slug   primary product URL format
      if (path.startsWith('/products/')) return 'product';
      // Legacy /product/:slug format
      if (w.__INITIAL_PRODUCT_SLUG__ || path.startsWith('/product/')) return 'product';
      // Legacy /:categorySlug/:productSlug  (e.g. /dildos/rose-vibrator)
      const parts = path.split('/').filter(Boolean);
      const SINGLE_VIEWS = ['about', 'checkout', 'orders', 'admin', 'advice', 'sitemap.xml', 'products'];
      if (parts.length === 2 && !SINGLE_VIEWS.includes(parts[0])) return 'product';
    } catch {}
    return 'shop';
  }

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const IMAGES_COLLECTION = 'product_images';
const DELETED_PRODUCTS_COLLECTION = 'deleted_products';
const DELIVERY_FEE = 5;

export const ShopProvider: React.FC<{
  children: React.ReactNode;
  initialProducts?: Product[];
  initialCategory?: string;
  initialView?: string;
  initialProductSlug?: string;
}> = ({ children, initialProducts, initialCategory, initialView: initialViewProp, initialProductSlug }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentView, setViewState] = useState<ViewType>(() => getInitialView(initialViewProp));
  const [selectedArticle, setSelectedArticleState] = useState<AdviceArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(() => getInitialCategory(initialCategory));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [is18PlusVerified, setIs18PlusVerified] = useState<boolean>(() => {
      try {
        if (/bot|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|crawler|spider|robot|crawling|prerender|headless|lighthouse/i.test(navigator.userAgent)) return true;
        return localStorage.getItem('vexa_18plus') === 'true';
      } catch { return false; }
    });
  const [language, setLanguageState] = useState<'en' | 'ar'>('en');
  const [isProductsLoading, setIsProductsLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [arTranslations, setArTranslations] = useState<Record<string, ArTranslation>>(() => loadArCache());

  // ── Resolve selectedProduct synchronously on first render ─────────────────
  // When the server passes initialProducts + initialProductSlug (product page SSR),
  // set the product immediately so ProductPage never shows a loading flash.
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    if (initialProducts && initialProducts.length > 0 && initialProductSlug) {
      const toSl = (n: string) => (n || '').toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
        .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60);
      return initialProducts.find(p =>
        p.slug === initialProductSlug ||
        p.id === initialProductSlug ||
        toSl(p.nameEn || p.name || '') === initialProductSlug
      ) || null;
    }
    return null;
  });

  // Load products from Firebase Firestore on mount
    useEffect(() => {
      // Fetch Firebase products once per session to get new/deleted products from admin
        if (initialProducts && initialProducts.length > 0) {
          const SESSION_KEY = 'vexa_fb_products_v2';
          const SESSION_TS  = 'vexa_fb_products_v2_ts';
          const TTL = 5 * 60 * 1000; // re-fetch every 5 min max

          const cached = sessionStorage.getItem(SESSION_KEY);
          const ts     = Number(sessionStorage.getItem(SESSION_TS) || 0);

          // ⚠️ Firebase PRODUCTS_COLLECTION only holds admin-added/edited products —
          // it is NOT a mirror of the full static catalog. Never use "missing from
          // Firebase" as a signal that a static product was deleted (that broke
          // direct product-page links from Google, which pass a single static
          // product as initialProducts). Deletions are tracked explicitly instead.
          const applyFirebase = (fbProds: Product[], deletedIds: string[]) => {
            const staticIds = new Set(initialProducts.map((p: Product) => p.id));
            const deletedSet = new Set(deletedIds);

            const merged = [
              ...initialProducts.filter((p: Product) => !deletedSet.has(p.id)),
              ...fbProds.filter((p: Product) => !staticIds.has(p.id) && !deletedSet.has(p.id)),
            ];
            if (merged.length === 0) return;

            // Use a functional update so we can read the CURRENT products state
            // and preserve any images that were already loaded by the client-side
            // image effect (loadAllImages) or embedded from SSR (fetchImages).
            // The direct setProducts(merged) that was here before wiped images
            // because `merged` is built from initialProducts (all image:""),
            // clobbering whatever the parallel image fetch had applied.
            setProducts(prev => {
              const prevImages = new Map(
                prev.map(p => [p.id, { image: p.image, images: p.images }])
              );
              return merged.map(p => {
                const existing = prevImages.get(p.id);
                if (existing && existing.image && existing.image.length > 5) {
                  // Preserve the already-loaded image; use other fields from merged
                  return { ...p, image: existing.image, images: existing.images };
                }
                return p;
              });
            });
          };

          if (cached && Date.now() - ts < TTL) {
            try {
              const { products: fbProds, deletedIds } = JSON.parse(cached);
              applyFirebase(fbProds || [], deletedIds || []);
            } catch (_) {}
            return;
          }

          Promise.all([
            getDocs(collection(db, PRODUCTS_COLLECTION)),
            getDocs(collection(db, DELETED_PRODUCTS_COLLECTION)),
          ]).then(([prodSnap, delSnap]) => {
            const fbProds: Product[] = [];
            prodSnap.forEach(docSnap => fbProds.push({ id: docSnap.id, ...docSnap.data() } as Product));
            const deletedIds: string[] = [];
            delSnap.forEach(docSnap => deletedIds.push(docSnap.id));
            try {
              sessionStorage.setItem(SESSION_KEY, JSON.stringify({ products: fbProds, deletedIds }));
              sessionStorage.setItem(SESSION_TS, String(Date.now()));
            } catch (_) {}
            applyFirebase(fbProds, deletedIds);
          }).catch(() => {});
          return;
        }

      const CACHE_KEY = 'vexa_products_v2';
      const CACHE_TS_KEY = 'vexa_products_v2_ts';
      const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 ساعة بدل 5 دقائق
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      const cachedTs = Number(localStorage.getItem(CACHE_TS_KEY) || 0);

      if (cachedRaw) {
        try {
          const cached = JSON.parse(cachedRaw);
          if (Array.isArray(cached) && cached.length > 0 && cached[0].slug) {
            setProducts(cached);
            setIsProductsLoading(false);
            if (Date.now() - cachedTs < CACHE_TTL) return;
          }
        } catch (_) {
          localStorage.removeItem(CACHE_KEY);
        }
      }

      const fetchOnce = async (): Promise<Product[]> => {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 15000);
          try {
            // يجيب المنتجات الحقيقية من Vercel CDN — ممنوع إظهار أي منتج وهمي أبداً
            const resp = await fetch('/api/products', { signal: ctrl });
            if (!resp.ok) throw new Error(`API error ${resp.status}`);
            const products: Product[] = await resp.json();
            if (!Array.isArray(products) || products.length === 0) {
              throw new Error('Empty products response');
            }
            return products;
          } finally {
            clearTimeout(t);
          }
        };

        const loadProducts = async (attempt = 1) => {
          if (!cachedRaw) setIsProductsLoading(true);

          try {
            const products = await fetchOnce();

            setProducts(products);
            setIsProductsLoading(false);

            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify(products));
              localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
            } catch (_) {}

          } catch (err) {
            if (process.env.NODE_ENV === 'development') console.error(`Products load error (attempt ${attempt}):`, err);

            // أعد المحاولة حتى ينجح الطلب — ممنوع إظهار منتجات وهمية تحت أي ظرف
            if (attempt < 5) {
              const delay = Math.min(1000 * attempt, 4000);
              setTimeout(() => loadProducts(attempt + 1), delay);
            } else if (!cachedRaw) {
              setTimeout(() => loadProducts(1), 5000);
            }
          }
        };

        loadProducts();
    }, [])

  // ─── Client-side image loading removed ───────────────────────────────────
  //
  // All product images in Firestore are stored as base64 data URIs (~50-200 KB
  // each). Fetching them client-side via the Firebase SDK would cost 70 × 2 =
  // 140 Firestore reads per visitor. The base64 values also exceed the 5 MB
  // localStorage quota, so the localStorage cache write always silently fails —
  // meaning every visitor triggers 140 fresh reads. With ~300 visitors/day this
  // alone exhausts the Firestore free-tier limit (50,000 reads/day) by morning.
  //
  // Images are now served exclusively through the /api/img/{id} CDN proxy:
  //   • The proxy authenticates anonymously, fetches the Firestore document
  //     once, converts base64 → JPEG, and returns the image bytes.
  //   • Vercel CDN caches the response for 24 hours (s-maxage=86400).
  //   • After the first visitor triggers the CDN cold-fill, every subsequent
  //     visitor gets the image from cache with ZERO Firestore reads.
  //   • ProductCard retries up to 2× after CDN cold misses (65 s delay, which
  //     clears the 60 s failure cache) so a first-visit 404 is not permanent.
  //
  // ──────────────────────────────────────────────────────────────────────────

  // Resolve initial product page from URL slug after products load
    useEffect(() => {
      if (isProductsLoading || products.length === 0) return;
      if (currentView !== 'product' || selectedProduct) return;
      try {
        const w = window as typeof window & { __INITIAL_PRODUCT_SLUG__?: string };
        if (initialProductSlug) w.__INITIAL_PRODUCT_SLUG__ = initialProductSlug;
        const pathname = window.location.pathname;
        const parts = pathname.split('/').filter(Boolean);
        const toSl = (n: string) => (n||'').toLowerCase()
          .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-')
          .replace(/-+/g,'-').replace(/^-+|-+$/,'').slice(0,60);

        let slug = '';
        let catSlug = '';
        if (w.__INITIAL_PRODUCT_SLUG__) {
          slug = w.__INITIAL_PRODUCT_SLUG__;
        } else if (pathname.startsWith('/products/')) {
          slug = pathname.replace(/^\/products\//, '').replace(/\/$/, '');
        } else if (parts.length === 2) {
          catSlug = parts[0];
          slug = parts[1];
        } else {
          slug = pathname.replace(/^\/product\//, '').replace(/\/$/, '');
        }

        if (!slug) { setViewState('shop'); return; }

        const found = products.find(p => {
          const pSlug = (p as Product & { slug?: string }).slug || toSl(p.nameEn || p.name || '');
          const pCat  = (p as Product & { categorySlug?: string }).categorySlug || toSl(p.category || '');
          const slugOk = pSlug === slug || toSl(p.nameEn || p.name || '') === slug || p.id === slug;
          const catOk  = !catSlug || pCat === catSlug;
          return slugOk && catOk;
        });
        if (found) {
          setSelectedProduct(found);
        } else {
          // Only revert to shop if we're not currently on a product-style URL
          // /:catSlug/:pSlug pattern (2 path segments, not a known single view)
          const SINGLE_VIEWS_CHECK = ['about', 'checkout', 'orders', 'admin', 'advice', 'sitemap.xml', 'products', 'product'];
          const pts = window.location.pathname.split('/').filter(Boolean);
          const isProductPath = (
            pts.length === 2 && !SINGLE_VIEWS_CHECK.includes(pts[0])
          ) || window.location.pathname.startsWith('/products/') || window.location.pathname.startsWith('/product/');
          if (!isProductPath) {
            setViewState('shop');
          }
          // else: stay in 'product' view  ProductPage shows loading state
        }
      } catch { setViewState('shop'); }
    }, [isProductsLoading, products]); // eslint-disable-line

  // Handle browser back/forward buttons
  useEffect(() => {
    const toSl = (n: string) => (n||'').toLowerCase()
      .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-')
      .replace(/-+/g,'-').replace(/^-+|-+$/,'').slice(0,60);

    const handlePop = () => {
      const path = window.location.pathname;
      // /products/:slug  primary format
      if (path.startsWith('/products/')) {
        const slug = path.replace(/^\/products\//, '').replace(/\/$/, '');
        const found = products.find(p =>
          (p as Product & { slug?: string }).slug === slug ||
          toSl(p.nameEn || p.name || '') === slug ||
          p.id === slug
        );
        if (found) { setSelectedProduct(found); setViewState('product'); }
        else setViewState('shop');
      // Legacy /product/:slug
      } else if (path.startsWith('/product/')) {
        const slug = path.replace(/^\/product\//, '').replace(/\/$/, '');
        const found = products.find(p =>
          (p as Product & { slug?: string }).slug === slug ||
          toSl(p.nameEn || p.name || '') === slug ||
          p.id === slug
        );
        if (found) { setSelectedProduct(found); setViewState('product'); }
        else setViewState('shop');
      } else if (path === '/about') {
        setViewState('about');
        setSelectedProduct(null);
      } else {
        // Legacy /:catSlug/:pSlug
        const parts = path.split('/').filter(Boolean);
        if (parts.length === 2) {
          const slug = parts[1];
          const catSlug = parts[0];
          const found = products.find(p => {
            const pSlug = (p as Product & { slug?: string }).slug || toSl(p.nameEn || p.name || '');
            const pCat = (p as Product & { categorySlug?: string }).categorySlug || toSl(p.category || '');
            return (pSlug === slug || toSl(p.nameEn || p.name || '') === slug || p.id === slug) && (!catSlug || pCat === catSlug);
          });
          if (found) { setSelectedProduct(found); setViewState('product'); return; }
        }
        const catSlug = path.replace(/^\//, '').replace(/\/$/, '');
        const cat = URL_SLUG_TO_CATEGORY[catSlug];
        if (cat) setActiveCategory(cat);
        setViewState('shop');
        setSelectedProduct(null);
      }
      // Restore scroll position saved before navigating to a product
      try {
        const saved = sessionStorage.getItem('vexa_scroll_' + path);
        if (saved) {
          const y = parseInt(saved, 10);
          requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)));
        }
      } catch (_) {}
    };

    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [products]); // eslint-disable-line

  // Auto-translate English products to Arabic when language is Arabic
  useEffect(() => {
    if (language !== 'ar' || products.length === 0) return;
    const englishOnly = products.filter(p => !arTranslations[p.id]);
    if (englishOnly.length === 0) return;

    translateProducts(englishOnly, arTranslations, (updated) => {
      setArTranslations(updated);
    }).catch(() => {});
  }, [language, products]); // eslint-disable-line

  // Load cart, orders, age, language from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('adult_store_cart');
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch { setCart([]); }

    try {
      const storedOrders = localStorage.getItem('adult_store_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch { setOrders([]); }

    const storedAgeVerify = localStorage.getItem('adult_store_age_verified');
    if (storedAgeVerify === 'true') setIs18PlusVerified(true);

    const storedLanguage = localStorage.getItem('vexa_store_language') as 'en' | 'ar' | null;
    if (storedLanguage === 'en' || storedLanguage === 'ar') {
      setLanguageState(storedLanguage);
    } else if (navigator.language?.startsWith('ar')) {
      setLanguageState('ar');
    }
  }, []);

  const setLanguage = (newLanguage: 'en' | 'ar') => {
    setLanguageState(newLanguage);
    localStorage.setItem('vexa_store_language', newLanguage);
    document.documentElement.lang = newLanguage;
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');

  useEffect(() => {
    localStorage.setItem('adult_store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('adult_store_orders', JSON.stringify(orders));
  }, [orders]);

  // ─── Firestore product operations ─────────────────────────────────────────

  // ─── Cache invalidation after any product change ─────────────────────────
  const revalidateAfterProductChange = (opts: { categorySlug?: string; slug?: string } = {}) => {
    try { localStorage.removeItem('vexa_products_v2'); localStorage.removeItem('vexa_products_v2_ts'); } catch (_) {}
    // Revalidate ISR cache
    fetch('/revalidate?secret=vexa-reval-2026', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(opts),
    }).catch(() => {});
    // Notify Bing + IndexNow members immediately — fire-and-forget
    fetch('/api/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categorySlug: opts.categorySlug, slug: opts.slug }),
    }).catch(() => {});
  };

    const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = 'prod-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const toSlg = (s: string) => (s || '').toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
      .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60) || newId;
    const CAT_SLUG: Record<string, string> = {
      'Sex Toys': 'sex-toys', 'Vibrators': 'vibrators', 'Male Toys': 'male-toys',
      'Dildos': 'dildos', 'Lingerie': 'lingerie', 'BDSM': 'bdsm',
      'Holiday Collection': 'holiday-collection', 'New Arrivals': 'new-arrivals',
      'Butt Plugs': 'butt-plugs', 'Anal Toys': 'anal-toys', 'Bondage': 'bondage',
      'Sex Dolls': 'sex-dolls', 'Strap Ons': 'strap-ons', 'Kegel Balls': 'kegel-balls',
      'Sexual Enhancers': 'sexual-enhancers', 'Penis Pumps': 'penis-pumps',
      'Cock Rings': 'cock-rings', 'Masturbators': 'masturbators', 'Chastity': 'chastity',
      'Sex Machines': 'sex-machines', 'Lubricants': 'lubricants', 'Poppers': 'poppers',
    };
    const slug = productData.slug || toSlg(productData.nameEn || productData.name || newId);
    const categorySlug = productData.categorySlug || CAT_SLUG[productData.category] || toSlg(productData.category || 'sex-toys');
    const newProduct: Product = { ...productData, id: newId, slug, categorySlug };
    await setDoc(doc(db, PRODUCTS_COLLECTION, newId), newProduct);
    setProducts(prev => [newProduct, ...prev]);
    revalidateAfterProductChange({ categorySlug, slug });
  };

  const updateProduct = async (id: string, productData: Omit<Product, 'id'>) => {
    const toSlg = (s: string) => (s || '').toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
      .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60) || id;
    const CAT_SLUG_U: Record<string, string> = {
      'Sex Toys': 'sex-toys', 'Vibrators': 'vibrators', 'Male Toys': 'male-toys',
      'Dildos': 'dildos', 'Lingerie': 'lingerie', 'BDSM': 'bdsm',
      'Holiday Collection': 'holiday-collection', 'New Arrivals': 'new-arrivals',
      'Butt Plugs': 'butt-plugs', 'Anal Toys': 'anal-toys', 'Bondage': 'bondage',
      'Sex Dolls': 'sex-dolls', 'Strap Ons': 'strap-ons', 'Kegel Balls': 'kegel-balls',
      'Sexual Enhancers': 'sexual-enhancers', 'Penis Pumps': 'penis-pumps',
      'Cock Rings': 'cock-rings', 'Masturbators': 'masturbators', 'Chastity': 'chastity',
      'Sex Machines': 'sex-machines', 'Lubricants': 'lubricants', 'Poppers': 'poppers',
    };
    const slug = productData.slug || toSlg(productData.nameEn || productData.name || id);
    const categorySlug = productData.categorySlug || CAT_SLUG_U[productData.category] || toSlg(productData.category || 'sex-toys');
    const updated: Product = { ...productData, id, slug, categorySlug };
    await setDoc(doc(db, PRODUCTS_COLLECTION, id), updated);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    revalidateAfterProductChange({ categorySlug, slug });
  };

  const deleteProduct = async (productId: string) => {
    // Write an explicit tombstone so static (non-Firebase) products can be
    // hidden too — absence from PRODUCTS_COLLECTION is NOT a delete signal.
    await Promise.all([
      deleteDoc(doc(db, PRODUCTS_COLLECTION, productId)).catch(() => {}),
      setDoc(doc(db, DELETED_PRODUCTS_COLLECTION, productId), { deletedAt: Date.now() }),
    ]);
    setProducts(prev => prev.filter(p => p.id !== productId));
    revalidateAfterProductChange();
  };

  const fetchProductImages = async (productId: string): Promise<string[]> => {
    try {
      const [gallerySnap, productSnap] = await Promise.all([
        getDoc(doc(db, IMAGES_COLLECTION, productId)),
        getDoc(doc(db, PRODUCTS_COLLECTION, productId)),
      ]);
      const galleryImgs: string[] = gallerySnap.exists()
        ? (gallerySnap.data().images as string[]) || []
        : [];
      const productData = productSnap.exists() ? productSnap.data() : null;
      const productImgs: string[] = productData ? (productData.images as string[] || []) : [];
      const bestImgs = galleryImgs.length >= productImgs.length ? galleryImgs : productImgs;
      if (bestImgs.length > 0) return bestImgs;
      return productData?.image ? [productData.image as string] : [];
    } catch {
      return [];
    }
  };

  const fetchAllOrdersFromFirebase = async (): Promise<Order[]> => {
    try {
      const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
      if (!snapshot.empty) {
        return snapshot.docs.map(docSnap => ({
          ...(docSnap.data() as Omit<Order, 'id'>),
          id: docSnap.id
        }));
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Firestore orders error:', error);
    }
    return orders;
  };

  const updateStockInFirestore = async (updatedProducts: Product[]) => {
    try {
      const batch = writeBatch(db);
      updatedProducts.forEach(product => {
        batch.set(doc(db, PRODUCTS_COLLECTION, product.id), product);
      });
      await batch.commit();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Firestore stock error:', error);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────

  const toSlugLocal = (n: string) => (n || '').toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      .replace(/^-+|-+$/, '').slice(0, 60) || 'product';

    const setView = (view: ViewType) => {
      setViewState(view);
      if (view !== 'advice') setSelectedArticleState(null);
      window.scrollTo(0, 0);
    };

    const navigateToProduct = (product: Product) => {
      // Strip trailing hyphens from the stored slug — legacy Firestore slugs may end
      // with '-' (truncation artefact). Using the clean slug prevents window.history
      // from pushing a redirect URL instead of the canonical 200 URL.
      const rawSlug = (product as Product & { slug?: string }).slug || toSlugLocal(product.nameEn || product.name || '');
      const pSlug = rawSlug.replace(/-+$/, '');
      // Normalize categorySlug before building URL — raw Firestore value may have
      // spaces or uppercase (e.g. "Male Toys") which would produce a broken URL.
      const rawCat = (product as Product & { categorySlug?: string }).categorySlug || toSlugLocal(product.category || 'sex-toys');
      const catSlug = rawCat.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-').trim() || 'sex-toys';
      const productPath = `/${catSlug}/${pSlug}`;
      // Save current scroll position so we can restore it when the user goes back
      try { sessionStorage.setItem('vexa_scroll_' + window.location.pathname, String(Math.round(window.scrollY))); } catch (_) {}
      window.history.pushState(null, '', productPath);
      setSelectedProduct(product);
      setViewState('product');
      window.scrollTo(0, 0);
    };

    const navigateToCategoryFn = (category: string) => {
      const slug = CATEGORY_TO_SLUG[category] || category.toLowerCase().replace(/\s+/g, '-');
      const catPath = `/${slug}`;
      if (window.location.pathname !== catPath) {
        window.history.pushState(null, '', catPath);
      }
      setActiveCategory(category);
      setSelectedProduct(null);
      setViewState('shop');
      window.scrollTo(0, 0);
    };

  const setSelectedArticle = (article: AdviceArticle | null) => {
    setSelectedArticleState(article);
    if (article) setViewState('advice');
    window.scrollTo(0, 0);
  };

  const verifyAge = () => {
    setIs18PlusVerified(true);
    localStorage.setItem('adult_store_age_verified', 'true');
  };

  const getDeliveryFee = () => DELIVERY_FEE;

  const addToCart = (product: Product, quantity: number = 1, selectedVariants?: Record<string, string>) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      const currentCartQty = existingItemIndex > -1 ? prevCart[existingItemIndex].quantity : 0;
      if (currentCartQty + quantity > product.stock) {
        alert(`عذراً، الكمية المطلوبة غير متوفرة حالياً. الكمية المتبقية: ${product.stock}`);
        return prevCart;
      }
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        if (selectedVariants && Object.keys(selectedVariants).length > 0) {
          newCart[existingItemIndex].selectedVariant = selectedVariants;
        }
        return newCart;
      }
      return [...prevCart, {
        product, quantity,
        selectedVariant: selectedVariants && Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            alert(`عذراً، الكمية المتوفرة هي ${item.product.stock} فقط.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);
  const getCartTotal = () => cart.reduce((t, i) => t + i.product.price * i.quantity, 0);
  const getCartItemsCount = () => cart.reduce((c, i) => c + i.quantity, 0);

  const placeOrder = (customer: CustomerInfo): Order | null => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((t, i) => t + i.product.price * i.quantity, 0);
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...cart],
      customer,
      total: subtotal + DELIVERY_FEE,
      date: new Date().toLocaleString('ar-EG'),
      dateKey: new Date().toISOString().slice(0, 10),
      status: 'pending'
    };

    const updatedProducts = products.map(prod => {
      const cartItem = cart.find(item => item.product.id === prod.id);
      return cartItem ? { ...prod, stock: prod.stock - cartItem.quantity } : prod;
    });

    setProducts(updatedProducts);
    updateStockInFirestore(updatedProducts);
    setOrders(prev => [newOrder, ...prev]);
    setDoc(doc(db, ORDERS_COLLECTION, newOrder.id), newOrder).catch(error => {
      if (process.env.NODE_ENV === 'development') console.error('Firestore save order error:', error);
    });
    clearCart();
    // Navigation handled by Checkout via setOrderComplete — do NOT call setView here.
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setDoc(doc(db, ORDERS_COLLECTION, orderId), { status }, { merge: true }).catch(error => {
      if (process.env.NODE_ENV === 'development') console.error('Firestore update order status error:', error);
    });
  };

  const deleteOrderLocally = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    deleteDoc(doc(db, ORDERS_COLLECTION, orderId)).catch(error => {
      if (process.env.NODE_ENV === 'development') console.error('Firestore delete order error:', error);
    });
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟')) {
      deleteOrderLocally(orderId);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        language, products, cart, orders, currentView, selectedArticle,
        activeCategory, searchQuery, is18PlusVerified, isProductsLoading, arTranslations,
        setProducts, setLanguage, toggleLanguage, setView, setSelectedArticle,
        setActiveCategory: navigateToCategoryFn, setSearchQuery, verifyAge, addToCart, removeFromCart,
        updateCartQuantity, clearCart, placeOrder, updateOrderStatus, deleteOrder,
        deleteOrderLocally, getCartTotal, getCartItemsCount, getDeliveryFee,
        navigateToProduct,
        addProduct, updateProduct, deleteProduct, fetchProductImages, fetchAllOrdersFromFirebase,
        selectedProduct, setSelectedProduct
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
