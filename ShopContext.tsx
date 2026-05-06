import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CustomerInfo, AdviceArticle } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

interface ShopContextType {
  language: 'en' | 'ar';
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  currentView: 'shop' | 'checkout' | 'admin' | 'advice';
  selectedArticle: AdviceArticle | null;
  activeCategory: string;
  searchQuery: string;
  is18PlusVerified: boolean;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setLanguage: (language: 'en' | 'ar') => void;
  toggleLanguage: () => void;
  setView: (view: 'shop' | 'checkout' | 'admin' | 'advice') => void;
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
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentView, setViewState] = useState<'shop' | 'checkout' | 'admin' | 'advice'>('shop');
  const [selectedArticle, setSelectedArticleState] = useState<AdviceArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Sex Toys');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [is18PlusVerified, setIs18PlusVerified] = useState<boolean>(false);
  const [language, setLanguageState] = useState<'en' | 'ar'>('en');

  // Load initial data from localStorage or mock data
  useEffect(() => {
    const storedProducts = localStorage.getItem('adult_store_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(MOCK_PRODUCTS);
      localStorage.setItem('adult_store_products', JSON.stringify(MOCK_PRODUCTS));
    }

    const storedCart = localStorage.getItem('adult_store_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    const storedOrders = localStorage.getItem('adult_store_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    const storedAgeVerify = localStorage.getItem('adult_store_age_verified');
    if (storedAgeVerify === 'true') {
      setIs18PlusVerified(true);
    }

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

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Sync cart to localstorage
  useEffect(() => {
    localStorage.setItem('adult_store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Sync products to localstorage
  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem('adult_store_products', JSON.stringify(products));
      } catch (error) {
        console.error('Could not save products to localStorage:', error);
        alert('لم يتم حفظ تعديلات المنتجات لأن مساحة التخزين امتلأت. حاول تقليل عدد الصور أو حجمها.');
      }
    }
  }, [products]);

  // Sync orders to localstorage
  useEffect(() => {
    localStorage.setItem('adult_store_orders', JSON.stringify(orders));
  }, [orders]);

  const setView = (view: 'shop' | 'checkout' | 'admin' | 'advice') => {
    setViewState(view);
    if (view !== 'advice') {
      setSelectedArticleState(null);
    }
    window.scrollTo(0, 0);
  };

  const setSelectedArticle = (article: AdviceArticle | null) => {
    setSelectedArticleState(article);
    if (article) {
      setViewState('advice');
    }
    window.scrollTo(0, 0);
  };

  const verifyAge = () => {
    setIs18PlusVerified(true);
    localStorage.setItem('adult_store_age_verified', 'true');
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.product.id === product.id);

      // Check stock
      const currentCartQty = existingItemIndex > -1 ? prevCart[existingItemIndex].quantity : 0;
      if (currentCartQty + quantity > product.stock) {
        alert(`عذراً، الكمية المطلوبة غير متوفرة حالياً في المخزن. الكمية المتبقية: ${product.stock}`);
        return prevCart;
      }

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId) {
          // Check stock
          if (quantity > item.product.stock) {
            alert(`عذراً، الكمية المتوفرة في المخزن هي ${item.product.stock} فقط.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const placeOrder = (customer: CustomerInfo): Order | null => {
    if (cart.length === 0) return null;

    const total = getCartTotal();
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...cart],
      customer,
      total,
      date: new Date().toLocaleString('ar-EG'),
      dateKey: new Date().toISOString().slice(0, 10),
      status: 'pending'
    };

    // Update products stock
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((item) => item.product.id === prod.id);
      if (cartItem) {
        return {
          ...prod,
          stock: prod.stock - cartItem.quantity
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    localStorage.setItem('adult_store_products', JSON.stringify(updatedProducts));

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    setView('shop');
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟')) {
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    }
  };

  return (
    <ShopContext.Provider
      value={{
        language,
        products,
        cart,
        orders,
        currentView,
        selectedArticle,
        activeCategory,
        searchQuery,
        is18PlusVerified,
        setProducts,
        setLanguage,
        toggleLanguage,
        setView,
        setSelectedArticle,
        setActiveCategory,
        setSearchQuery,
        verifyAge,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        getCartTotal,
        getCartItemsCount
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
