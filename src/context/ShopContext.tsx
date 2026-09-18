'use client';
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Product, CartItem, Order, CustomerInfo, AdviceArticle } from '../types';
import { loadArCache, translateProducts, ArTranslation } from '../utils/translate';
import { cartItemKey, cartSubtotal } from '../utils/pricing';
import { isStorefrontReference, mergeOrderStatuses } from '../utils/order-status';
import { STORE_LOCALE_COOKIE, type StoreLocale } from '@/lib/storeLocaleShared';

type ViewType = 'shop' | 'checkout' | 'admin' | 'advice' | 'orders' | 'about' | 'product';

interface ShopContextType {
  language: 'en' | 'ar';
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  orderStatusSync: 'idle' | 'loading' | 'ready' | 'error';
  refreshOrderStatuses: () => Promise<void>;
  currentView: ViewType;
  selectedArticle: AdviceArticle | null;
  activeCategory: string;
  seoHeading?: string;
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
  removeFromCart: (productId: string, selectedVariants?: Record<string, string>) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  placeOrder: (customer: CustomerInfo) => Promise<Order | null>;
  deleteOrder: (orderId: string) => void;
  deleteOrderLocally: (orderId: string) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getDeliveryFee: () => number;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>, imagesModifiedByUser?: boolean) => Promise<void>;
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
  // NOTE: use `!== undefined` (not truthy) so an explicit "" override -
  // meaning "show every category" (used by full-catalog pages like the
  // homepage and /adult-toys), isn't silently discarded in favor of the
  // URL-based / default lookup below.
  if (override !== undefined) return override;
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

const DELIVERY_FEE = 5;

export const ShopProvider: React.FC<{
  children: React.ReactNode;
  initialProducts?: Product[];
  initialCategory?: string;
  initialView?: string;
  initialProductSlug?: string;
  seoHeading?: string;
  initialLocale?: StoreLocale;
}> = ({ children, initialProducts, initialCategory, initialView: initialViewProp, initialProductSlug, seoHeading, initialLocale = 'en' }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(DELIVERY_FEE);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersHydrated, setOrdersHydrated] = useState(false);
  const [orderStatusSync, setOrderStatusSync] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const ordersRef = useRef<Order[]>([]);
  const statusRequestInFlight = useRef(false);
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
  const [language, setLanguageState] = useState<'en' | 'ar'>(initialLocale);
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

  // The server endpoint reads the current Supabase catalog. Refresh after a
  // tab return so an already-open product page follows admin price edits.
  useEffect(() => {
    let cancelled = false;
    let request: AbortController | null = null;
    const refresh = () => {
      if (document.visibilityState !== 'visible') return;
      request?.abort();
      request = new AbortController();
      fetch('/api/products', { cache: 'no-store', signal: request.signal })
        .then(response => { if (!response.ok) throw new Error('Catalog unavailable'); return response.json(); })
        .then((fresh: Product[]) => {
          if (cancelled) return;
          setProducts(fresh);
          setSelectedProduct(current => current ? fresh.find(product => product.id === current.id) ?? null : null);
          setIsProductsLoading(false);
        })
        .catch(error => { if (!cancelled && error?.name !== 'AbortError') setIsProductsLoading(false); });
    };
    refresh();
    document.addEventListener('visibilitychange', refresh);
    return () => { cancelled = true; request?.abort(); document.removeEventListener('visibilitychange', refresh); };
  }, []);

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
    setCartHydrated(true);

    try {
      const storedOrders = localStorage.getItem('adult_store_orders');
      if (storedOrders) setOrders((JSON.parse(storedOrders) as Order[]).filter(order => order.id !== 'VX-LOCALTEST' && !order.isTestOrder));
    } catch { setOrders([]); }
    setOrdersHydrated(true);

    const storedAgeVerify = localStorage.getItem('adult_store_age_verified');
    if (storedAgeVerify === 'true') setIs18PlusVerified(true);

  }, []);

  const setLanguage = (newLanguage: 'en' | 'ar') => {
    setLanguageState(newLanguage);
    localStorage.setItem('vexa_store_language', newLanguage);
    document.cookie = `${STORE_LOCALE_COOKIE}=${newLanguage}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLanguage;
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    window.location.reload();
  };

  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');

  useEffect(() => {
    if (cartHydrated) localStorage.setItem('adult_store_cart', JSON.stringify(cart));
  }, [cart, cartHydrated]);

  useEffect(() => {
    if (!cartHydrated || products.length === 0) return;
    setCart(previous => {
      const productUsed = new Map<string, number>();
      const optionUsed = new Map<string, number>();
      return previous.flatMap(item => {
        const fresh = products.find(product => product.id === item.product.id || product.legacyId === item.product.id);
        if (!fresh || fresh.stock <= 0) return [];
        const selected = item.selectedVariant || {};
        const valid = (fresh.variants || []).every(variant => {
          const choice = selected[variant.nameEn] ?? selected[variant.name];
          return (!variant.isRequired || !!choice) && (!choice || variant.options.includes(choice));
        });
        if (!valid) return [];
        let available = fresh.stock - (productUsed.get(fresh.id) || 0);
        for (const variant of fresh.variants || []) {
          const choice = selected[variant.nameEn] ?? selected[variant.name];
          const stock = choice ? variant.optionStock?.[choice] : null;
          if (stock !== null && stock !== undefined) {
            available = Math.min(available, stock - (optionUsed.get(`${fresh.id}:${variant.nameEn}:${choice}`) || 0));
          }
        }
        const quantity = Math.min(item.quantity, Math.max(0, available));
        if (quantity <= 0) return [];
        productUsed.set(fresh.id, (productUsed.get(fresh.id) || 0) + quantity);
        for (const variant of fresh.variants || []) {
          const choice = selected[variant.nameEn] ?? selected[variant.name];
          if (choice) {
            const key = `${fresh.id}:${variant.nameEn}:${choice}`;
            optionUsed.set(key, (optionUsed.get(key) || 0) + quantity);
          }
        }
        return [{ ...item, product: fresh, quantity }];
      });
    });
  }, [products, cartHydrated]);

  useEffect(() => {
    fetch('/api/store-settings').then(response => response.ok ? response.json() : null)
      .then(settings => { if (settings) setDeliveryFee(Number(settings.delivery_fee)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    ordersRef.current = orders;
    if (ordersHydrated) localStorage.setItem('adult_store_orders', JSON.stringify(orders));
  }, [orders, ordersHydrated]);

  const refreshOrderStatuses = useCallback(async () => {
    if (statusRequestInFlight.current || document.visibilityState === 'hidden') return;
    const receipts = ordersRef.current.filter(order => isStorefrontReference(order.id)
      && !order.isTestOrder && typeof order.customer?.phone === 'string');
    if (!receipts.length) return;
    statusRequestInFlight.current = true;
    setOrderStatusSync('loading');
    try {
      const updates: { reference: string; status: unknown }[] = [];
      for (let offset = 0; offset < receipts.length; offset += 20) {
        const response = await fetch('/api/orders/status', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
          body: JSON.stringify({ orders: receipts.slice(offset, offset + 20)
            .map(order => ({ reference: order.id, phone: order.customer.phone })) }),
        });
        if (!response.ok) throw new Error(`Order status unavailable: ${response.status}`);
        const result = await response.json() as { orders: { reference: string; status: unknown }[] };
        updates.push(...result.orders);
      }
      setOrders(previous => mergeOrderStatuses(previous, updates));
      const matchedReferences = new Set(updates.map(item => item.reference));
      setOrderStatusSync(receipts.every(order => matchedReferences.has(order.id)) ? 'ready' : 'error');
    } catch {
      setOrderStatusSync('error');
    } finally {
      statusRequestInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    if (!ordersHydrated || !orders.length) return;
    void refreshOrderStatuses();
    const interval = window.setInterval(() => void refreshOrderStatuses(), 60_000);
    const onReturn = () => { if (document.visibilityState === 'visible') void refreshOrderStatuses(); };
    document.addEventListener('visibilitychange', onReturn);
    window.addEventListener('focus', onReturn);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onReturn);
      window.removeEventListener('focus', onReturn);
    };
  }, [ordersHydrated, orders.length, refreshOrderStatuses]);

  // Product administration now lives on the separate, protected admin host.
  const addProduct = async (_product: Omit<Product, 'id'>) => { throw new Error('Use admin.vexatoys.com'); };
  const updateProduct = async (_id: string, _product: Omit<Product, 'id'>) => { throw new Error('Use admin.vexatoys.com'); };
  const deleteProduct = async (_id: string) => { throw new Error('Use admin.vexatoys.com'); };
  const fetchProductImages = async (id: string) => products.find(product => product.id === id)?.images || [];
  const fetchAllOrdersFromFirebase = async (): Promise<Order[]> => [];

  const toSlugLocal = (n: string) => (n || '').toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      .replace(/^-+|-+$/, '').slice(0, 60) || 'product';

    const setView = (view: ViewType) => {
      setViewState(view);
      if (view !== 'advice') setSelectedArticleState(null);
      window.scrollTo(0, 0);
    };

    const navigateToProduct = (product: Product) => {
      // Strip trailing hyphens from the stored slug, legacy Firestore slugs may end
      // with '-' (truncation artefact). Using the clean slug prevents window.history
      // from pushing a redirect URL instead of the canonical 200 URL.
      const rawSlug = (product as Product & { slug?: string }).slug || toSlugLocal(product.nameEn || product.name || '');
      const pSlug = rawSlug.replace(/-+$/, '');
      // Normalize categorySlug before building URL, raw Firestore value may have
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

  const getDeliveryFee = () => deliveryFee;

  const addToCart = (product: Product, quantity: number = 1, selectedVariants?: Record<string, string>) => {
    setCart(prevCart => {
      const key = cartItemKey(product.id, selectedVariants);
      const existingItemIndex = prevCart.findIndex(item => cartItemKey(item.product.id, item.selectedVariant) === key);
      const currentProductQty = prevCart.filter(item => item.product.id === product.id)
        .reduce((total, item) => total + item.quantity, 0);
      const optionUnavailable = (product.variants || []).some(variant => {
        const value = selectedVariants?.[variant.nameEn] ?? selectedVariants?.[variant.name];
        const stock = value ? variant.optionStock?.[value] : null;
        if (stock === null || stock === undefined) return false;
        const used = prevCart.filter(item => item.product.id === product.id &&
          (item.selectedVariant?.[variant.nameEn] ?? item.selectedVariant?.[variant.name]) === value)
          .reduce((total, item) => total + item.quantity, 0);
        return used + quantity > stock;
      });
      if (currentProductQty + quantity > product.stock || optionUnavailable) {
        alert(`عذراً، الكمية المطلوبة غير متوفرة حالياً. الكمية المتبقية: ${product.stock}`);
        return prevCart;
      }
      if (existingItemIndex > -1) {
        return prevCart.map((item, index) => index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prevCart, {
        product, quantity,
        selectedVariant: selectedVariants && Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined
      }];
    });
  };

  const removeFromCart = (productId: string, selectedVariants?: Record<string, string>) => {
    const key = cartItemKey(productId, selectedVariants);
    setCart(prevCart => prevCart.filter(item => cartItemKey(item.product.id, item.selectedVariant) !== key));
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedVariants?: Record<string, string>) => {
    if (quantity <= 0) { removeFromCart(productId, selectedVariants); return; }
    const key = cartItemKey(productId, selectedVariants);
    setCart(prevCart =>
      prevCart.map(item => {
        if (cartItemKey(item.product.id, item.selectedVariant) === key) {
          const otherProductQty = prevCart.filter(other => other !== item && other.product.id === productId)
            .reduce((sum, other) => sum + other.quantity, 0);
          const optionUnavailable = (item.product.variants || []).some(variant => {
            const value = item.selectedVariant?.[variant.nameEn] ?? item.selectedVariant?.[variant.name];
            const stock = value ? variant.optionStock?.[value] : null;
            if (stock === null || stock === undefined) return false;
            const otherOptionQty = prevCart.filter(other => other !== item && other.product.id === productId &&
              (other.selectedVariant?.[variant.nameEn] ?? other.selectedVariant?.[variant.name]) === value)
              .reduce((sum, other) => sum + other.quantity, 0);
            return otherOptionQty + quantity > stock;
          });
          if (otherProductQty + quantity > item.product.stock || optionUnavailable) {
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
  const getCartTotal = () => cartSubtotal(cart);
  const getCartItemsCount = () => cart.reduce((c, i) => c + i.quantity, 0);

  const placeOrder = async (customer: CustomerInfo): Promise<Order | null> => {
    if (cart.length === 0) return null;
    const signature = JSON.stringify(cart.map(item => [item.product.id, item.quantity, item.selectedVariant || {}]));
    const pending = JSON.parse(sessionStorage.getItem('vexa_pending_order') || 'null');
    const idempotencyKey = pending?.signature === signature ? pending.key : crypto.randomUUID();
    sessionStorage.setItem('vexa_pending_order', JSON.stringify({ signature, key: idempotencyKey }));
    const response = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idempotencyKey, customer, locale: language,
        items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity, selectedOptions: item.selectedVariant || {} })) }),
    });
    if (!response.ok) throw new Error(`Order save failed: ${response.status}`);
    const saved = await response.json() as { id: string; reference: string; status: Order['status']; total: number; deliveryFee?: number | null; placedAt?: string | null; testMode?: boolean };
    const order: Order = {
      id: saved.reference, isTestOrder: saved.testMode === true, items: [...cart], customer, total: saved.total, deliveryFee: saved.deliveryFee ?? deliveryFee,
      date: new Date().toLocaleString(language === 'ar' ? 'ar-LB' : 'en-LB'),
      placedAt: saved.placedAt ?? new Date().toISOString(),
      dateKey: new Date().toISOString().slice(0, 10), status: saved.status,
    };
    sessionStorage.removeItem('vexa_pending_order');
    // Mock responses are only UI fixtures; they do not create admin orders or consume the cart.
    if (order.isTestOrder) return order;
    // Flush the receipt and cart before leaving for WhatsApp. React's effects may not run before navigation.
    localStorage.setItem('adult_store_orders', JSON.stringify([order, ...orders]));
    localStorage.setItem('adult_store_cart', '[]');
    setProducts(prev => prev.map(product => {
      const count = cart.filter(item => item.product.id === product.id).reduce((total, item) => total + item.quantity, 0);
      return count ? { ...product, stock: Math.max(0, product.stock - count) } : product;
    }));
    setOrders(prev => [order, ...prev]);
    clearCart();
    return order;
  };

  // Customer order history is a local receipt; customers cannot mutate store orders.
  const deleteOrderLocally = (orderId: string) => setOrders(prev => prev.filter(order => order.id !== orderId));
  const deleteOrder = (orderId: string) => deleteOrderLocally(orderId);

  return (
    <ShopContext.Provider
      value={{
        language, products, cart, orders, orderStatusSync, refreshOrderStatuses, currentView, selectedArticle,
        activeCategory, searchQuery, is18PlusVerified, isProductsLoading, arTranslations,
        seoHeading,
        setProducts, setLanguage, toggleLanguage, setView, setSelectedArticle,
        setActiveCategory: navigateToCategoryFn, setSearchQuery, verifyAge, addToCart, removeFromCart,
        updateCartQuantity, clearCart, placeOrder, deleteOrder,
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
