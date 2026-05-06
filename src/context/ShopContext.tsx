
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
  writeBatch
} from 'firebase/firestore';

const DELIVERY_FEE = 5;
const PRODUCTS_COLLECTION = 'products';

interface ShopContextType {
  language: 'en' | 'ar';
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  currentView: 'shop' | 'checkout' | 'admin' | 'advice' | 'orders';
  selectedArticle: AdviceArticle | null;
  activeCategory: string;
  searchQuery: string;
  is18PlusVerified: boolean;
  isProductsLoading: boolean;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setLanguage: (language: 'en' | 'ar') => void;
  toggleLanguage: () => void;
  setView: (view: 'shop' | 'checkout' | 'admin' | 'advice' | 'orders') => void;
  setSelectedArticle: (article: AdviceArticle | null) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  verifyAge: () => void;
  addToCart: (product: Product, quantity?: number, variant?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customer: CustomerInfo) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  getCartTotal: () => number;
  getDeliveryFee: () => number;
  getCartItemsCount: () => number;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentView, setViewState] = useState<'shop' | 'checkout' | 'admin' | 'advice' | 'orders'>('shop');
  const [selectedArticle, setSelectedArticleState] = useState<AdviceArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Sex Toys');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [is18PlusVerified, setIs18PlusVerified] = useState<boolean>(false);
  const [language, setLanguageState] = useState<'en' | 'ar'>('en');
  const [isProductsLoading, setIsProductsLoading] = useState(true);

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
      } catch {
        const stored = localStorage.getItem('adult_store_products');
        setProducts(stored ? JSON.parse(stored) : MOCK_PRODUCTS);
      } finally {
        setIsProductsLoading(false);
      }
    };
    loadProducts();
  }, []);

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

  useEffect(() => { localStorage.setItem('adult_store_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  useEffect(() => { localStorage.setItem('adult_store_orders', JSON.stringify(orders)); }, [orders]);

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

  const updateStockInFirestore = async (updatedProducts: Product[]) => {
    try {
      const batch = writeBatch(db);
      updatedProducts.forEach(product => {
        batch.set(doc(db, PRODUCTS_COLLECTION, product.id), product);
      });
      await batch.commit();
    } catch { /* silent */ }
  };

  const setView = (view: 'shop' | 'checkout' | 'admin' | 'advice' | 'orders') => {
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

  const addToCart = (product: Product, quantity: number = 1, variant?: Record<string, string>) => {
    setCart(prevCart => {
      const variantKey = JSON.stringify(variant || {});
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id &&
          JSON.stringify(item.selectedVariant || {}) === variantKey
      );
      const currentCartQty = existingItemIndex > -1 ? prevCart[existingItemIndex].quantity : 0;
      if (currentCartQty + quantity > product.stock) {
        alert(`عذراً، الكمية المطلوبة غير متوفرة حالياً. الكمية المتبقية: ${product.stock}`);
        return prevCart;
      }
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = { ...newCart[existingItemIndex], quantity: newCart[existingItemIndex].quantity + quantity };
        return newCart;
      }
      return [...prevCart, { product, quantity, selectedVariant: variant }];
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
  const getDeliveryFee = () => DELIVERY_FEE;
  const getCartItemsCount = () => cart.reduce((c, i) => c + i.quantity, 0);

  const placeOrder = (customer: CustomerInfo): Order | null => {
    if (cart.length === 0) return null;
    const subtotal = getCartTotal();
    const total = subtotal + DELIVERY_FEE;
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...cart],
      customer,
      total,
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

  const deleteOrder = (orderId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟')) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  return (
    <ShopContext.Provider value={{
      language, products, cart, orders, currentView, selectedArticle,
      activeCategory, searchQuery, is18PlusVerified, isProductsLoading,
      setProducts, setLanguage, toggleLanguage, setView, setSelectedArticle,
      setActiveCategory, setSearchQuery, verifyAge, addToCart, removeFromCart,
      updateCartQuantity, clearCart, placeOrder, updateOrderStatus, deleteOrder,
      getCartTotal, getDeliveryFee, getCartItemsCount, addProduct, updateProduct, deleteProduct
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
