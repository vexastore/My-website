import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CustomerInfo, AdviceArticle } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  getDoc
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


// Ã¢ÂÂÃ¢ÂÂ URL slug Ã¢ÂÂ category mapping (for synchronous URL-based initialization) Ã¢ÂÂÃ¢ÂÂ
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

function getInitialCategory(): string {
  try {
    const w = window as typeof window & { __INITIAL_CATEGORY__?: string };
    if (w.__INITIAL_CATEGORY__) return w.__INITIAL_CATEGORY__;
    const slug = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    return URL_SLUG_TO_CATEGORY[slug] || 'Sex Toys';
  } catch { return 'Sex Toys'; }
}

function getInitialView(): ViewType {
    try {
      const w = window as typeof window & { __INITIAL_VIEW__?: string; __INITIAL_PRODUCT_SLUG__?: string };
      if (w.__INITIAL_VIEW__ === 'about') return 'about';
      if (window.location.pathname === '/about') return 'about';
      if (w.__INITIAL_PRODUCT_SLUG__ || window.location.pathname.startsWith('/product/')) return 'product';
      // Detect /:categorySlug/:productSlug  (e.g. /dildos/rose-vibrator)
      const parts = window.location.pathname.split('/').filter(Boolean);
      const SINGLE_VIEWS = ['about', 'checkout', 'orders', 'admin', 'advice', 'sitemap.xml'];
      if (parts.length === 2 && !SINGLE_VIEWS.includes(parts[0])) return 'product';
    } catch {}
    return 'shop';
  }

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const IMAGES_COLLECTION = 'product_images';
const DELIVERY_FEE = 5;

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentView, setViewState] = useState<ViewType>(getInitialView);
  const [selectedArticle, setSelectedArticleState] = useState<AdviceArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(getInitialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [is18PlusVerified, setIs18PlusVerified] = useState<boolean>(false);
  const [language, setLanguageState] = useState<'en' | 'ar'>('en');
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [arTranslations, setArTranslations] = useState<Record<string, ArTranslation>>(() => loadArCache());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load products from Firebase Firestore on mount
  useEffect(() => {
    const loadProducts = async () => {
      setIsProductsLoading(true);
      try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout')), 8000)
          );
          const snapshot = await Promise.race([
            getDocs(collection(db, PRODUCTS_COLLECTION)),
            timeoutPromise
          ]) as Awaited<ReturnType<typeof getDocs>>;

        if (!snapshot.empty) {
          const toBackfill: Array<{ id: string; slug: string; categorySlug: string }> = [];
            const firestoreProducts = snapshot.docs.map(docSnap => {
              const data = docSnap.data() as Omit<Product, 'id'> & { slug?: string; categorySlug?: string; link?: string };
              const pSlug = data.slug || toSlugLocal(data.nameEn || data.name || docSnap.id);
              const catSlug = data.categorySlug || toSlugLocal(data.category || '');
              if (!data.slug || !data.categorySlug) {
                toBackfill.push({ id: docSnap.id, slug: pSlug, categorySlug: catSlug });
              }
              return {
                ...data, id: docSnap.id, slug: pSlug, categorySlug: catSlug,
                link: data.link || `https://www.vexatoys.com/${catSlug}/${pSlug}`
              };
            });
            setProducts(firestoreProducts);
            // Persist missing slug/categorySlug back to Firestore
            if (toBackfill.length > 0) {
              try {
                const batchUpd = writeBatch(db);
                toBackfill.forEach(({ id, slug, categorySlug }) => {
                  batchUpd.update(doc(db, PRODUCTS_COLLECTION, id), { slug, categorySlug });
                });
                await batchUpd.commit();
              } catch (_) { /* silent — non-blocking */ }
            }
        } else {
          const batch = writeBatch(db);
          MOCK_PRODUCTS.forEach(product => {
            const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
            batch.set(docRef, product);
          });
          await batch.commit();
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Firestore load error:', error);
        const stored = localStorage.getItem('adult_store_products');
        setProducts(stored ? JSON.parse(stored) : MOCK_PRODUCTS);
      } finally {
        setIsProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Resolve initial product page from URL slug after products load
    useEffect(() => {
      if (isProductsLoading || products.length === 0) return;
      if (currentView !== 'product' || selectedProduct) return;
      try {
        const w = window as typeof window & { __INITIAL_PRODUCT_SLUG__?: string };
        const pathname = window.location.pathname;
        const parts = pathname.split('/').filter(Boolean);
        const toSl = (n: string) => (n||'').toLowerCase()
          .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-')
          .replace(/-+/g,'-').replace(/^-+|-+$/,'').slice(0,60);

        let slug = '';
        let catSlug = '';
        if (w.__INITIAL_PRODUCT_SLUG__) {
          slug = w.__INITIAL_PRODUCT_SLUG__;
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
        if (found) setSelectedProduct(found);
        else setViewState('shop');
      } catch { setViewState('shop'); }
    }, [isProductsLoading, products]); // eslint-disable-line

  // Handle browser back/forward buttons
  useEffect(() => {
    const toSl = (n: string) => (n||'').toLowerCase()
      .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-')
      .replace(/-+/g,'-').replace(/^-+|-+$/,'').slice(0,60);

    const handlePop = () => {
      const path = window.location.pathname;
      if (path.startsWith('/product/')) {
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
        const slug = path.replace(/^\//, '').replace(/\/$/, '');
        const cat = URL_SLUG_TO_CATEGORY[slug];
        if (cat) setActiveCategory(cat);
        setViewState('shop');
        setSelectedProduct(null);
      }
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

  // Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ Firestore product operations Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = 'prod-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newProduct: Product = { ...productData, id: newId };
    await setDoc(doc(db, PRODUCTS_COLLECTION, newId), newProduct);
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = async (id: string, productData: Omit<Product, 'id'>) => {
    const updated: Product = { ...productData, id };
    await setDoc(doc(db, PRODUCTS_COLLECTION, id), updated);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
  };

  const deleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    setProducts(prev => prev.filter(p => p.id !== productId));
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

  // Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ

  const toSlugLocal = (n: string) => (n || '').toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      .replace(/^-+|-+$/, '').slice(0, 60) || 'product';

    const setView = (view: ViewType) => {
      setViewState(view);
      if (view !== 'advice') setSelectedArticleState(null);
      window.scrollTo(0, 0);
    };

    const navigateToProduct = (product: Product) => {
      const pSlug = (product as Product & { slug?: string }).slug || toSlugLocal(product.nameEn || product.name || '');
      const catSlug = (product as Product & { categorySlug?: string }).categorySlug || toSlugLocal(product.category || '');
      window.location.href = `/${catSlug}/${pSlug}`;
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
        alert(`ÃÂ¹ÃÂ°ÃÂ±ÃÂ§ÃÂÃÂ ÃÂ§ÃÂÃÂÃÂÃÂÃÂ© ÃÂ§ÃÂÃÂÃÂ·ÃÂÃÂÃÂ¨ÃÂ© ÃÂºÃÂÃÂ± ÃÂÃÂªÃÂÃÂÃÂ±ÃÂ© ÃÂ­ÃÂ§ÃÂÃÂÃÂ§ÃÂ. ÃÂ§ÃÂÃÂÃÂÃÂÃÂ© ÃÂ§ÃÂÃÂÃÂªÃÂ¨ÃÂÃÂÃÂ©: ${product.stock}`);
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
            alert(`ÃÂ¹ÃÂ°ÃÂ±ÃÂ§ÃÂÃÂ ÃÂ§ÃÂÃÂÃÂÃÂÃÂ© ÃÂ§ÃÂÃÂÃÂªÃÂÃÂÃÂ±ÃÂ© ÃÂÃÂ ${item.product.stock} ÃÂÃÂÃÂ·.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);
  const getCartTotal = () => cart.reduce((t, i) => t + i.product.price * i.quantity, 0) + DELIVERY_FEE;
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
    clearCart();
    setView('shop');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const deleteOrderLocally = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('ÃÂÃÂ ÃÂ£ÃÂÃÂª ÃÂÃÂªÃÂ£ÃÂÃÂ¯ ÃÂÃÂ ÃÂ±ÃÂºÃÂ¨ÃÂªÃÂ ÃÂÃÂ ÃÂ­ÃÂ°ÃÂ ÃÂÃÂ°ÃÂ§ ÃÂ§ÃÂÃÂ·ÃÂÃÂ¨ ÃÂÃÂÃÂ§ÃÂ¦ÃÂÃÂ§ÃÂÃÂ')) {
      deleteOrderLocally(orderId);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        language, products, cart, orders, currentView, selectedArticle,
        activeCategory, searchQuery, is18PlusVerified, isProductsLoading, arTranslations,
        setProducts, setLanguage, toggleLanguage, setView, setSelectedArticle,
        setActiveCategory, setSearchQuery, verifyAge, addToCart, removeFromCart,
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
