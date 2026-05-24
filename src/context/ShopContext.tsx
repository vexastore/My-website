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

type ViewType = 'shop' | 'checkout' | 'admin' | 'advice' | 'orders' | 'about';

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
  setSelectedArticle: (article: AdviceArticle | null) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  verifyAge: () => void;
  addToCart: (product: Product, quantity?: number) => void;
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
    const w = window as typeof window & { __INITIAL_VIEW__?: string };
    if (w.__INITIAL_VIEW__ === 'about') return 'about';
    if (window.location.pathname === '/about') return 'about';
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

  // Load products from Firebase Firestore on mount
  useEffect(() => {
    const loadProducts = async () => {
      setIsProductsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));

        if (!snapshot.empty) {
          const firestoreProducts = snapshot.docs.map(docSnap => ({
            ...(docSnap.data() as Omit<Product, 'id'>),
            id: docSnap.id
          }));
          setProducts(firestoreProducts);
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
        console.error('Error loading products from Firestore:', error);
        const stored = localStorage.getItem('adult_store_products');
        setProducts(stored ? JSON.parse(stored) : MOCK_PRODUCTS);
      } finally {
        setIsProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

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
    const storedCart = localStorage.getItem('adult_store_cart');
    if (storedCart) setCart(JSON.parse(storedCart));

    const storedOrders = localStorage.getItem('adult_store_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));

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
      console.error('Error fetching orders from Firebase:', error);
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
      console.error('Error updating stock in Firestore:', error);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────

  const setView = (view: ViewType) => {
    setViewState(view);
    if (view !== 'advice') setSelectedArticleState(null);
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

  const addToCart = (product: Product, quantity: number = 1) => {
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
        return newCart;
      }
      return [...prevCart, { product, quantity }];
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
        setActiveCategory, setSearchQuery, verifyAge, addToCart, removeFromCart,
        updateCartQuantity, clearCart, placeOrder, updateOrderStatus, deleteOrder,
        deleteOrderLocally, getCartTotal, getCartItemsCount, getDeliveryFee,
        addProduct, updateProduct, deleteProduct, fetchProductImages, fetchAllOrdersFromFirebase
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
