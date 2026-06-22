import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, Product, CategoryId, ProductVariant } from '../types';
import {
  Package, Truck, CheckCircle2, XCircle, Trash2, Phone, MapPin,
  Calendar, DollarSign, ClipboardList, Edit, Plus, X, Upload,
  LockKeyhole, LogOut, Loader2, ChevronUp, ChevronDown, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { CATEGORIES, getCategoryName, getProductCategories } from '../data/categories';
import { db } from '../firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

const ALL_CATEGORY_IDS: CategoryId[] = [
  'Sex Toys', 'Vibrators', 'Male Toys', 'Dildos', 'Lingerie',
  'BDSM', 'Holiday Collection', 'New Arrivals',
  'Butt Plugs', 'Anal Toys', 'Bondage', 'Sex Dolls',
  'Strap Ons', 'Kegel Balls', 'Sexual Enhancers', 'Penis Pumps',
  'Cock Rings', 'Masturbators', 'Chastity', 'Sex Machines',
  'Lubricants', 'Poppers'
];

export const AdminPanel: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateOrderStatus, deleteOrder, fetchProductImages, fetchAllOrdersFromFirebase } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => sessionStorage.getItem('vexa_admin_session') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [calOpen, setCalOpen] = useState(false);
  const [calNavYear, setCalNavYear] = useState(() => new Date().getFullYear());
  const [calNavMonth, setCalNavMonth] = useState(() => new Date().getMonth() + 1);

  // Firebase-sourced orders (all customers) — loaded when admin unlocks
  const [firebaseOrders, setFirebaseOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const all = await fetchAllOrdersFromFirebase();
      setFirebaseOrders(all);
    } catch { /* ignore */ }
    finally { setIsLoadingOrders(false); }
  };

  // Load orders when admin is already unlocked on mount, or after unlock
  useEffect(() => { if (isAdminUnlocked) loadOrders(); }, [isAdminUnlocked]); // eslint-disable-line

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  // Track whether the user actually changed images — prevents overwriting Firebase images on info-only edits
  const [imagesModifiedByUser, setImagesModifiedByUser] = useState(false);
  // Backup of Firebase images — protects against accidental deletion
  const loadedFirebaseImagesRef = useRef<string[]>([]);

  const [prodForm, setProdForm] = useState<{
    name: string;
    description: string;
    price: number;
    image: string;
    images: string[];
    categories: CategoryId[];
    variants: ProductVariant[];
    rating: number;
    reviewsCount: number;
    stock: number;
    isNew: boolean;
  }>({
    name: '', description: '', price: 0,
    image: '', images: [], categories: ['Sex Toys'],
    variants: [],
    rating: 5.0, reviewsCount: 1, stock: 10, isNew: false
  });

  const [newOptionInputs, setNewOptionInputs] = useState<Record<number, string>>({});

  const ADMIN_HASH = 'ea6a140ff34999b68233c4d393701f8b0ec1516571fe9a66d994e9c094aeb065';
  const syncAllToFirebase = async () => {
    const stored = localStorage.getItem('adult_store_products');
    if (!stored) { alert('لا توجد منتجات في المتصفح للرفع.'); return; }
    const localProducts: Product[] = JSON.parse(stored);
    if (!localProducts.length) { alert('لا توجد منتجات.'); return; }
    if (!window.confirm(`سيتم رفع ${localProducts.length} منتج لـ Firebase. متأكد?`)) return;
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const CHUNK = 400;
      let saved = 0;
      for (let i = 0; i < localProducts.length; i += CHUNK) {
        const batch = writeBatch(db);
        localProducts.slice(i, i + CHUNK).forEach(p => {
          batch.set(doc(collection(db, 'products'), p.id), p);
        });
        await batch.commit();
        saved += Math.min(CHUNK, localProducts.length - i);
      }
      setSyncResult(`✅ تم رفع ${saved} منتج لـ Firebase بنجاح!`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setSyncResult('❌ خطأ: ' + msg);
    } finally {
      setIsSyncing(false);
    }
  };

  const hashPassword = async (pwd: string): Promise<string> => {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(pwd));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const lockData = sessionStorage.getItem('vexa_admin_lockout');
      if (lockData) {
        const { until } = JSON.parse(lockData);
        if (Date.now() < until) {
          const mins = Math.ceil((until - Date.now()) / 60000);
          setLoginError('حساب مقفل. حاول بعد ' + mins + ' دقيقة.');
          return;
        }
      }
      try {
        const hash = await hashPassword(passwordInput.trim());
        if (hash === ADMIN_HASH) {
          sessionStorage.setItem('vexa_admin_session', 'true');
          sessionStorage.removeItem('vexa_admin_lockout');
          setIsAdminUnlocked(true);
          setPasswordInput('');
          setLoginError('');
        } else {
          const prevLock = lockData ? JSON.parse(lockData) : { attempts: 0 };
          const newAttempts = (prevLock.attempts || 0) + 1;
          if (newAttempts >= 3) {
            const until = Date.now() + 30 * 60 * 1000;
            sessionStorage.setItem('vexa_admin_lockout', JSON.stringify({ until, attempts: newAttempts }));
            setLoginError('3 محاولات خاطئة. الحساب مقفل لمدة 30 دقيقة.');
          } else {
            sessionStorage.setItem('vexa_admin_lockout', JSON.stringify({ until: 0, attempts: newAttempts }));
            setLoginError('كلمة المرور غير صحيحة. محاولة ' + newAttempts + '/3');
          }
        }
      } catch {
        setLoginError('حدث خطأ، حاول مرة أخرى.');
      }
    };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('vexa_admin_session');
    sessionStorage.removeItem('vexa_admin_lockout');
    setIsAdminUnlocked(false);
  };

  const getOrderDateKey = (order: Order) => {
    if (order.dateKey) return order.dateKey;
    const parsed = new Date(order.date);
    return !Number.isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : 'unknown';
  };

  const MONTH_AR = ['','يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const availableYears = Array.from(new Set(firebaseOrders.map(o => getOrderDateKey(o).slice(0,4)).filter(y => y.length === 4))).sort((a,b) => b.localeCompare(a));
  const availableMonths = selectedYear === 'all' ? [] : Array.from(new Set(firebaseOrders.filter(o => getOrderDateKey(o).startsWith(selectedYear)).map(o => getOrderDateKey(o).slice(5,7)).filter(Boolean))).sort();
  const availableDays = (selectedYear === 'all' || selectedMonth === 'all') ? [] : Array.from(new Set(firebaseOrders.filter(o => getOrderDateKey(o).startsWith(selectedYear + '-' + selectedMonth)).map(o => getOrderDateKey(o).slice(8,10)).filter(Boolean))).sort();
  const filteredOrders = firebaseOrders.filter(o => {
    const dk = getOrderDateKey(o);
    if (selectedYear !== 'all' && !dk.startsWith(selectedYear)) return false;
    if (selectedMonth !== 'all' && !dk.startsWith(selectedYear + '-' + selectedMonth)) return false;
    if (selectedDay !== 'all' && dk !== selectedYear + '-' + selectedMonth + '-' + selectedDay) return false;
    return true;
  });

  const totalSales = filteredOrders
    .filter(o => ['delivered', 'pending', 'shipping'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);
  // Calendar helpers
  const orderDaySet = new Set(firebaseOrders.map(o => getOrderDateKey(o)));
  const calFirstDay = new Date(calNavYear, calNavMonth - 1, 1).getDay();
  const calDaysCount = new Date(calNavYear, calNavMonth, 0).getDate();
  const calMonthStr = String(calNavMonth).padStart(2, '0');
  const calYearStr = String(calNavYear);
  const goCalPrev = () => { if (calNavMonth === 1) { setCalNavMonth(12); setCalNavYear(y => y-1); } else setCalNavMonth(m => m-1); };
  const goCalNext = () => { if (calNavMonth === 12) { setCalNavMonth(1); setCalNavYear(y => y+1); } else setCalNavMonth(m => m+1); };

  const getStatusBadge = (status: Order['status']) => ({
    pending:   <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 rounded-full text-[10px] font-bold"><Package size={12} className="animate-pulse" /> مراجعة</span>,
    shipping:  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 rounded-full text-[10px] font-bold"><Truck size={12} /> شحن</span>,
    delivered: <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 rounded-full text-[10px] font-bold"><CheckCircle2 size={12} /> استلم</span>,
    cancelled: <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2 rounded-full text-[10px] font-bold"><XCircle size={12} /> ملغي</span>,
  }[status]);

  const toggleCategory = (catId: CategoryId) => {
    setProdForm(prev => {
      const already = prev.categories.includes(catId);
      if (already && prev.categories.length === 1) return prev;
      const next = already
        ? prev.categories.filter(c => c !== catId)
        : [...prev.categories, catId];
      return { ...prev, categories: next };
    });
  };

  const addVariant = () => {
    setProdForm(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { name: '', nameEn: '', options: [] }]
    }));
  };

  const removeVariant = (idx: number) => {
    setProdForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
    setNewOptionInputs(prev => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  };

  const updateVariantName = (idx: number, val: string) => {
    setProdForm(prev => {
      const next = [...prev.variants];
      next[idx] = { ...next[idx], name: val, nameEn: val };
      return { ...prev, variants: next };
    });
  };

  const addOption = (vIdx: number) => {
    const val = (newOptionInputs[vIdx] || '').trim();
    if (!val) return;
    setProdForm(prev => {
      const next = [...prev.variants];
      if (next[vIdx].options.includes(val)) return prev;
      next[vIdx] = { ...next[vIdx], options: [...next[vIdx].options, val] };
      return { ...prev, variants: next };
    });
    setNewOptionInputs(prev => ({ ...prev, [vIdx]: '' }));
  };

  const removeOption = (vIdx: number, oIdx: number) => {
    setProdForm(prev => {
      const next = [...prev.variants];
      next[vIdx] = { ...next[vIdx], options: next[vIdx].options.filter((_, i) => i !== oIdx) };
      return { ...prev, variants: next };
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setNewOptionInputs({});
    setImagesModifiedByUser(false);
    setProdForm({ name: '', description: '', price: 0, image: '', images: [], categories: ['Sex Toys'], variants: [], rating: 5.0, reviewsCount: Math.floor(Math.random() * 10) + 1, stock: 10, isNew: true });
    setIsModalOpen(true);
  };

  const openEditModal = async (product: Product) => {
    setEditingProduct(product);
    setNewOptionInputs({});
    setImagesModifiedByUser(false);
    const cats = getProductCategories(product) as CategoryId[];
    const localImgs = product.image ? [product.image] : [];
    setProdForm({
      name: product.name || product.nameEn,
      description: product.description || product.descriptionEn,
      price: product.price, image: product.image,
      images: localImgs,
      categories: cats.length ? cats : [product.category],
      variants: product.variants || [],
      rating: product.rating, reviewsCount: product.reviewsCount,
      stock: product.stock, isNew: product.isNew || false
    });
    setIsModalOpen(true);
    setIsLoadingImages(true);
    try {
      const firebaseImgs = await fetchProductImages(product.id);
      if (firebaseImgs.length > 0) {
        loadedFirebaseImagesRef.current = firebaseImgs;
        setProdForm(prev => ({
          ...prev,
          images: firebaseImgs,
          image: firebaseImgs[0] || prev.image,
        }));
      } else {
        loadedFirebaseImagesRef.current = [];
      }
    } catch {
      loadedFirebaseImagesRef.current = [];
    }
    finally { setIsLoadingImages(false); }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProdForm(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProdForm(prev => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const compressImageFile = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const maxSize = 800;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = String(reader.result || '');
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (files.some(f => !f.type.startsWith('image/'))) { alert('يرجى اختيار ملفات صور فقط.'); return; }
    setIsUploadingImages(true);
    try {
      const compressed = await Promise.all(files.map(compressImageFile));
      setProdForm(prev => {
        const next = [...(prev.images || []), ...compressed].slice(0, 10);
        return { ...prev, images: next, image: prev.image || next[0] || '' };
      });
      setImagesModifiedByUser(true);
    } catch {
      alert('حدث خطأ في معالجة الصور. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (image: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الصورة؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setProdForm(prev => {
      const next = (prev.images || []).filter(i => i !== image);
      return { ...prev, images: next, image: prev.image === image ? (next[0] || '') : prev.image };
    });
    setImagesModifiedByUser(true);
  };

  const moveImageUp = (idx: number) => {
    if (idx === 0) return;
    setProdForm(prev => {
      const imgs = [...(prev.images || [])];
      [imgs[idx - 1], imgs[idx]] = [imgs[idx], imgs[idx - 1]];
      return { ...prev, images: imgs, image: imgs[0] || prev.image };
    });
    setImagesModifiedByUser(true);
  };

  const moveImageDown = (idx: number) => {
    setProdForm(prev => {
      const imgs = [...(prev.images || [])];
      if (idx >= imgs.length - 1) return prev;
      [imgs[idx + 1], imgs[idx]] = [imgs[idx], imgs[idx + 1]];
      return { ...prev, images: imgs, image: imgs[0] || prev.image };
    });
    setImagesModifiedByUser(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoadingImages) {
      alert('الصور لم تنتهِ من التحميل بعد. يرجى الانتظار قليلاً ثم الحفظ.');
      return;
    }

    if (!prodForm.name || !prodForm.price || !prodForm.image) {
      alert('يرجى ملء: الاسم، السعر، والصورة.');
      return;
    }

    if (imagesModifiedByUser) {
      const currentCount = prodForm.images?.length || 0;
      const originalCount = loadedFirebaseImagesRef.current.length;
      if (originalCount > currentCount) {
        const confirmed = window.confirm(
          `تحذير: عدد الصور سينخفض من ${originalCount} إلى ${currentCount}.\n\nهل أنت متأكد أنك تريد الحفظ بصور أقل؟`
        );
        if (!confirmed) return;
      }
    }

    const primaryCat = prodForm.categories[0] || 'Sex Toys';
    const cleanVariants = (prodForm.variants || [])
      .filter(v => v.name.trim() && v.options.length > 0);
    const productData: Omit<Product, 'id'> = {
      name: prodForm.name,
      nameEn: prodForm.name,
      description: prodForm.description,
      descriptionEn: prodForm.description,
      price: prodForm.price,
      image: prodForm.image || prodForm.images?.[0] || '',
      // Safety: if imagesModifiedByUser but form images are suspiciously empty, fall back to Firebase backup
      images: imagesModifiedByUser
        ? (prodForm.images?.length ? prodForm.images : (loadedFirebaseImagesRef.current.length ? loadedFirebaseImagesRef.current : (prodForm.image ? [prodForm.image] : [])))
        : (prodForm.images?.length ? prodForm.images : (prodForm.image ? [prodForm.image] : [])),
      category: primaryCat as CategoryId,
      categories: prodForm.categories,
      variants: cleanVariants.length > 0 ? cleanVariants : [],
      rating: prodForm.rating,
      reviewsCount: prodForm.reviewsCount,
      stock: prodForm.stock,
      isNew: prodForm.isNew
    };
    setIsSaving(true);
    try {
      if (editingProduct) {
        // Pass imagesModifiedByUser so we NEVER overwrite Firebase images unless user changed them
        await updateProduct(editingProduct.id, productData, imagesModifiedByUser);
        alert('تم تعديل المنتج بنجاح! ✅');
      } else {
        await addProduct(productData);
        alert('تم إضافة المنتج! 🎉');
      }
      setIsModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('400') || msg.toLowerCase().includes('too large') || msg.toLowerCase().includes('maximum')) {
        alert('الصور كبيرة جداً لحفظها في Firebase.\n\nالحل: احذف بعض الصور من القائمة أو استخدم رابط URL بدلاً من رفع الصور مباشرة.');
      } else if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('unauthorized')) {
        alert('خطأ في الصلاحيات. تأكد من إعدادات Firebase Security Rules.');
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('offline') || msg.toLowerCase().includes('unavailable')) {
        alert('لا يوجد اتصال بالإنترنت. تحقق من الاتصال وحاول مجدداً.');
      } else {
        alert(`حدث خطأ أثناء الحفظ:\n${msg}\n\nجرب تقليل عدد الصور إذا استمر الخطأ.`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف "${productName}"؟`)) return;
    setIsDeleting(productId);
    try { await deleteProduct(productId); }
    catch { alert('حدث خطأ أثناء الحذف.'); }
    finally { setIsDeleting(null); }
  };

  if (!isAdminUnlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-12 font-sans" dir="rtl">
        <form onSubmit={handleAdminLogin}
          className="w-full max-w-md border border-white/10 bg-[#0b0b0b] p-6 text-white shadow-2xl sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-950/30 text-red-300">
            <LockKeyhole size={26} />
          </div>
          <h1 className="text-center text-2xl font-black tracking-wide">لوحة التحكم</h1>
          <p className="mx-auto mt-2 max-w-sm text-center text-xs text-white/45">أدخل كلمة المرور للوصول</p>
          <div className="mt-6 space-y-2">
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)}
              placeholder="••••••••" autoFocus
              className="w-full border border-white/15 bg-white/5 px-4 py-3 text-center text-base font-bold tracking-[0.18em] text-white outline-none focus:border-red-400" />
            {loginError && <p className="text-center text-xs font-bold text-red-400">{loginError}</p>}
          </div>
          <button type="submit"
            className="mt-6 w-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.25em] text-black hover:bg-red-100 active:scale-[0.98]">
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">لوحة التحكم</h1>
          <p className="text-xs text-white/40 mt-1">المنتجات محفوظة على Firebase ✅</p>
          {syncResult && (
            <p className="text-xs font-bold mt-1 ${syncResult.startsWith('✅') ? 'text-green-400' : 'text-red-400'}">{syncResult}</p>
          )}
        </div>
        <button
          onClick={syncAllToFirebase}
          disabled={isSyncing}
          className="flex items-center gap-2 border border-amber-500/40 bg-amber-950/30 px-4 py-2 text-xs font-bold text-amber-300 hover:text-amber-200 rounded-lg transition disabled:opacity-50 ml-2"
        >
          {isSyncing ? <><Loader2 size={14} className="animate-spin" /> جاري الرفع...</> : '⬆️ رفع كل المنتجات لـ Firebase'}
        </button>
        <button onClick={handleAdminLogout}
          className="flex items-center gap-2 border border-white/15 px-4 py-2 text-xs font-bold text-white/60 hover:text-white rounded-lg transition">
          <LogOut size={14} /> خروج
        </button>
      </div>

      <div className="flex gap-1 mb-6 border-b border-white/10">
        {(['orders', 'products'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-black transition border-b-2 -mb-px flex items-center gap-2 ${activeTab === tab ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/70'}`}>
            {tab === 'orders' ? <><ClipboardList size={15} /> الطلبات</> : <><Package size={15} /> المنتجات</>}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-6">
          {isLoadingOrders && (
            <div className="flex items-center gap-2 text-white/40 text-xs py-2">
              <Loader2 size={14} className="animate-spin" /> جاري تحميل الطلبات من Firebase...
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'المبيعات', value: `$${totalSales.toFixed(0)}`, color: '' },
              { label: 'إجمالي الطلبات', value: filteredOrders.length, color: '' },
              { label: 'قيد المراجعة', value: filteredOrders.filter(o => o.status === 'pending').length, color: 'border-amber-500/20 text-amber-400' },
              { label: 'قيد الشحن', value: filteredOrders.filter(o => o.status === 'shipping').length, color: 'border-blue-500/20 text-blue-400' },
            ].map(s => (
              <div key={s.label} className={`bg-[#111] border ${s.color || 'border-white/10'} rounded-xl p-4`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${s.color || 'text-white/40'}`}>{s.label}</p>
                <p className={`text-xl font-black ${s.color || 'text-white'}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Calendar date filter */}
          <div className="flex items-center gap-3">
            <button onClick={() => setCalOpen(true)}
              className="flex items-center gap-2 bg-[#111] border border-white/15 hover:border-purple-500/50 px-4 py-2.5 rounded-xl text-sm font-black text-white transition">
              <Calendar size={16} className="text-purple-400" />
              {selectedDay !== "all" ? `${parseInt(selectedDay)} ${MONTH_AR[parseInt(selectedMonth)]} ${selectedYear}` : selectedMonth !== "all" ? `${MONTH_AR[parseInt(selectedMonth)]} ${selectedYear}` : selectedYear !== "all" ? selectedYear : "كل الطلبات"}
            </button>
            {(selectedYear !== "all") && (
              <button onClick={() => { setSelectedYear("all"); setSelectedMonth("all"); setSelectedDay("all"); }}
                className="text-[11px] text-red-400/70 hover:text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded-lg font-black transition">✕ مسح</button>
            )}
          </div>
          {/* Calendar popup */}
          {calOpen && (
            <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70" onClick={() => setCalOpen(false)}>
              <div className="w-full max-w-sm bg-[#141414] border border-white/10 rounded-t-3xl p-5 pb-8" onClick={e => e.stopPropagation()}>
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-5">
                  <button onClick={goCalPrev} className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition"><ChevronRight size={18} className="text-white" /></button>
                  <span className="font-black text-white text-base">{MONTH_AR[calNavMonth]} {calNavYear}</span>
                  <button onClick={goCalNext} className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition"><ChevronLeft size={18} className="text-white" /></button>
                </div>
                {/* Week day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {["ح","ن","ث","ر","خ","ج","س"].map(d => (
                    <div key={d} className="text-center text-[11px] text-white/30 font-black py-1">{d}</div>
                  ))}
                </div>
                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({length: calFirstDay}).map((_, i) => <div key={"e"+i} />)}
                  {Array.from({length: calDaysCount}, (_, i) => i + 1).map(day => {
                    const ds = String(day).padStart(2, "0");
                    const dk = calYearStr + "-" + calMonthStr + "-" + ds;
                    const hasOrder = orderDaySet.has(dk);
                    const isSel = selectedYear === calYearStr && selectedMonth === calMonthStr && selectedDay === ds;
                    return (
                      <button key={day} disabled={!hasOrder}
                        onClick={() => { setSelectedYear(calYearStr); setSelectedMonth(calMonthStr); setSelectedDay(ds); setCalOpen(false); }}
                        className={"h-10 w-full rounded-xl text-sm font-black transition " + (isSel ? "bg-purple-600 text-white" : hasOrder ? "bg-white/10 text-white hover:bg-purple-500/30" : "text-white/15 cursor-default")}>
                        {day}
                      </button>
                    );
                  })}
                </div>
                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  <button onClick={() => { setSelectedYear("all"); setSelectedMonth("all"); setSelectedDay("all"); setCalOpen(false); }}
                    className="flex-1 py-3 border border-white/10 text-white/60 hover:text-white rounded-2xl text-sm font-black transition">كل الطلبات</button>
                  <button onClick={() => setCalOpen(false)}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-sm font-black transition">إغلاق</button>
                </div>
              </div>
            </div>
          )}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-white/30 border border-white/10 rounded-xl">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">لا توجد طلبات</p>
            </div>
          ) : filteredOrders.map(order => (
            <div key={order.id} className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-white/30 font-mono">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                    <span className="flex items-center gap-1"><Calendar size={12} />{order.date}</span>
                    <span className="flex items-center gap-1"><DollarSign size={12} />${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={async () => { await deleteOrder(order.id); loadOrders(); }} className="text-red-500/60 hover:text-red-400 p-1.5 hover:bg-red-950/30 rounded-lg transition">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-2 py-1.5">
                    <div className="h-9 w-9 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                      {item.product.image
                        ? <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                        : <div className="h-full w-full bg-gradient-to-br from-purple-600 to-rose-600 flex items-center justify-center text-white text-[10px] font-black">V</div>
                      }
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-white/40">× {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/70">
                <p className="flex items-center gap-1"><Phone size={12} />{order.customer.name} — {order.customer.phone}</p>
                <p className="flex items-center gap-1"><MapPin size={12} />{order.customer.city}، {order.customer.address}</p>
              </div>

              <div className="flex gap-2 flex-wrap pt-1 border-t border-white/5">
                {(['pending', 'shipping', 'delivered', 'cancelled'] as Order['status'][]).map(s => (
                  <button key={s} onClick={() => {
                    updateOrderStatus(order.id, s);
                    // Optimistically update local state
                    setFirebaseOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: s } : o));
                  }}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-full transition ${order.status === s ? 'bg-white text-black' : 'border border-white/15 text-white/50 hover:text-white'}`}>
                    {s === 'pending' ? 'مراجعة' : s === 'shipping' ? 'شحن' : s === 'delivered' ? 'استلم' : 'ملغي'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/40">{products.length} منتج</p>
            <button onClick={openAddModal}
              className="flex items-center gap-2 bg-white text-black px-4 py-2.5 text-xs font-black rounded-xl hover:bg-stone-100 transition active:scale-[0.98]">
              <Plus size={16} /> إضافة منتج
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => {
              const cats = getProductCategories(product);
              return (
                <div key={product.id} className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-stone-900 relative">
                    {product.image
                      ? <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80" />
                      : <div className="w-full h-full bg-gradient-to-br from-purple-700 to-rose-600 flex items-center justify-center text-white font-black text-xl">V</div>
                    }
                    <div className="absolute top-2 right-2 flex flex-wrap gap-1">
                      {cats.slice(0, 2).map(catId => (
                        <span key={catId} className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {getCategoryName(catId, 'ar')}
                        </span>
                      ))}
                      {cats.length > 2 && (
                        <span className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">+{cats.length - 2}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-black text-white line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-emerald-400">${product.price}</span>
                      <span className={`font-bold ${product.stock <= 3 ? 'text-red-400' : 'text-white/40'}`}>مخزون: {product.stock}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => openEditModal(product)}
                        className="flex-1 flex items-center justify-center gap-1 border border-white/15 text-white/60 hover:text-white py-2 rounded-lg text-xs font-bold transition">
                        <Edit size={13} /> تعديل
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id, product.name)}
                        disabled={isDeleting === product.id}
                        className="flex items-center justify-center gap-1 border border-red-500/20 text-red-500/60 hover:text-red-400 py-2 px-3 rounded-lg text-xs font-bold transition disabled:opacity-50">
                        {isDeleting === product.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[10001] bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => !isSaving && !isLoadingImages && setIsModalOpen(false)}>
          <div className="bg-[#0d0d0d] border border-white/15 w-full max-w-xl max-h-[92vh] overflow-y-auto sm:rounded-2xl"
            onClick={e => e.stopPropagation()}>

            <div className="sticky top-0 bg-[#0d0d0d] border-b border-white/10 px-5 py-4 flex items-center justify-between z-10">
              <h2 className="text-base font-black text-white">
                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              <button onClick={() => !isSaving && !isLoadingImages && setIsModalOpen(false)} className="text-white/40 hover:text-white">
                <X size={22} />
              </button>
            </div>

            {/* Warning banner while images are loading */}
            {isLoadingImages && (
              <div className="mx-5 mt-4 flex items-center gap-2 bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold px-4 py-3 rounded-xl">
                <Loader2 size={14} className="animate-spin flex-shrink-0" />
                <span>جاري تحميل صور المنتج... انتظر حتى تكتمل قبل الحفظ</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="p-5 space-y-5">
              <div>
                <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">اسم المنتج *</label>
                <input name="name" value={prodForm.name} onChange={handleFormChange} required
                  placeholder="اكتب اسم المنتج..."
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition" />
              </div>

              <div>
                <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">الوصف</label>
                <textarea name="description" value={prodForm.description} onChange={handleFormChange} rows={3}
                  placeholder="وصف المنتج..."
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">السعر (USD) *</label>
                  <input name="price" type="number" min="0" step="0.01" value={prodForm.price} onChange={handleFormChange} required
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">المخزون</label>
                  <input name="stock" type="number" min="0" value={prodForm.stock} onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-white/50 mb-2 uppercase tracking-wider">
                  الفئات (اختر واحدة أو أكثر) *
                  <span className="text-white/30 font-normal mr-2">— الفئة الأولى هي الرئيسية</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_CATEGORY_IDS.map(catId => {
                    const cat = CATEGORIES.find(c => c.id === catId);
                    const isSelected = prodForm.categories.includes(catId);
                    const isFirst = prodForm.categories[0] === catId;
                    return (
                      <button
                        key={catId}
                        type="button"
                        onClick={() => toggleCategory(catId)}
                        className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border text-right text-xs font-bold transition ${
                          isSelected
                            ? 'border-white bg-white/10 text-white'
                            : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition ${isSelected ? 'bg-white border-white' : 'border-white/20'}`}>
                          {isSelected && <span className="text-black text-[10px] font-black">✓</span>}
                        </span>
                        <span className="flex-1">{cat?.name.ar || catId}</span>
                        {isFirst && isSelected && (
                          <span className="text-[8px] font-black bg-white/20 px-1 rounded">رئيسية</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">رابط الصورة الرئيسية *</label>
                <input value={prodForm.image} onChange={e => {
                  const val = e.target.value;
                  // Only update the cover reference — don't touch the images gallery or mark as modified
                  setProdForm(prev => ({ ...prev, image: val }));
                }} dir="ltr" placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition" />
              </div>

              <div>
                <label className="block text-[11px] font-black text-white/50 mb-2 uppercase tracking-wider">
                  ارفع صور إضافية (حتى 10 صور)
                </label>
                <label className={`flex items-center gap-2 border border-dashed px-4 py-3 rounded-xl text-sm font-bold transition ${isUploadingImages ? 'border-amber-500/50 text-amber-400 cursor-not-allowed' : 'border-white/20 hover:border-white/40 text-white/50 hover:text-white/70 cursor-pointer'}`}>
                  {isUploadingImages
                    ? <><Loader2 size={16} className="animate-spin flex-shrink-0" /> جاري معالجة الصور...</>
                    : <><Upload size={16} /> اختر صور من الجهاز</>}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={isUploadingImages} className="hidden" />
                </label>
              </div>

              {isLoadingImages && (
                <div className="flex items-center gap-2 text-amber-400/70 text-xs font-bold py-1">
                  <Loader2 size={14} className="animate-spin" /> جاري تحميل الصور من Firebase...
                </div>
              )}

              {!isLoadingImages && prodForm.images && prodForm.images.length > 0 && (
                <div>
                  <p className="text-[11px] font-black text-white/50 mb-2 uppercase tracking-wider">
                    ترتيب الصور — الأولى هي صورة الواجهة
                    {imagesModifiedByUser && <span className="text-amber-400 mr-2 normal-case font-bold">• تم التعديل</span>}
                  </p>
                  <div className="space-y-2">
                    {prodForm.images.map((img, idx) => (
                      <div key={idx} className={`flex items-center gap-3 rounded-xl border p-2 transition ${idx === 0 ? 'border-white/40 bg-white/5' : 'border-white/10'}`}>
                        <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {idx === 0 && <span className="text-[10px] font-black text-white bg-white/20 px-2 py-0.5 rounded-full">واجهة ⭐</span>}
                          <p className="text-[10px] text-white/40 mt-1">{idx + 1}/{prodForm.images!.length}</p>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <button type="button" onClick={() => moveImageUp(idx)} disabled={idx === 0}
                            className="p-1 text-white/40 hover:text-white disabled:opacity-20 transition">
                            <ChevronUp size={15} />
                          </button>
                          <button type="button" onClick={() => moveImageDown(idx)} disabled={idx === prodForm.images!.length - 1}
                            className="p-1 text-white/40 hover:text-white disabled:opacity-20 transition">
                            <ChevronDown size={15} />
                          </button>
                        </div>
                        <button type="button" onClick={() => handleRemoveImage(img)}
                          className="text-red-400/60 hover:text-red-400 p-1.5 hover:bg-red-950/20 rounded-lg transition">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-black text-white/50 uppercase tracking-wider">
                    خيارات المنتج (حجم / لون / غيره)
                  </label>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="text-[11px] font-bold text-white/60 hover:text-white border border-white/20 hover:border-white/50 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                  >
                    <Plus size={11} /> إضافة خيار
                  </button>
                </div>

                {(!prodForm.variants || prodForm.variants.length === 0) && (
                  <p className="text-[11px] text-white/25 italic py-2">
                    لا توجد خيارات. مثلاً: أضف "الحجم" بخيارات S / M / L أو "اللون" بخيارات أسود / وردي.
                  </p>
                )}

                <div className="space-y-4">
                  {(prodForm.variants || []).map((variant, vIdx) => (
                    <div key={vIdx} className="border border-white/10 rounded-xl p-3.5 space-y-3 bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={variant.name}
                          onChange={e => updateVariantName(vIdx, e.target.value)}
                          placeholder="اسم الخيار (مثال: الحجم، اللون، النوع)"
                          className="flex-1 bg-white/5 border border-white/10 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-white/30 transition"
                        />
                        <button type="button" onClick={() => removeVariant(vIdx)}
                          className="text-red-400/50 hover:text-red-400 p-1.5 hover:bg-red-950/30 rounded-lg transition flex-shrink-0">
                          <X size={15} />
                        </button>
                      </div>

                      {variant.options.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {variant.options.map((opt, oIdx) => (
                            <span key={oIdx} className="flex items-center gap-1 bg-white/10 text-white/80 text-[11px] font-bold px-3 py-1 rounded-full">
                              {opt}
                              <button type="button" onClick={() => removeOption(vIdx, oIdx)}
                                className="text-white/40 hover:text-red-400 transition ml-0.5">
                                <X size={9} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newOptionInputs[vIdx] || ''}
                          onChange={e => setNewOptionInputs(prev => ({ ...prev, [vIdx]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOption(vIdx); } }}
                          placeholder="مثال: 18cm - أسود، M، وردي..."
                          className="flex-1 bg-white/5 border border-white/10 text-white text-[11px] px-3 py-2 rounded-lg outline-none focus:border-white/30 transition"
                        />
                        <button
                          type="button"
                          onClick={() => addOption(vIdx)}
                          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-black transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isNew" checked={prodForm.isNew || false} onChange={handleCheckboxChange} className="w-4 h-4 rounded" />
                <span className="text-sm font-bold text-white/70">وضع علامة "جديد" على هذا المنتج</span>
              </label>

              {isLoadingImages && (
                <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-500/20 text-amber-400 text-xs font-bold px-4 py-3 rounded-xl">
                  <AlertTriangle size={14} className="flex-shrink-0" />
                  <span>يجب الانتظار حتى تكتمل الصور قبل الحفظ</span>
                </div>
              )}

              <button type="submit" disabled={isSaving || isLoadingImages || isUploadingImages}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-3.5 rounded-xl font-black text-sm hover:bg-stone-100 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition">
                {isSaving
                  ? <><Loader2 size={18} className="animate-spin" /> جاري الحفظ...</>
                  : isUploadingImages
                  ? <><Loader2 size={18} className="animate-spin" /> انتظر — جاري رفع الصور...</>
                  : isLoadingImages
                  ? <><Loader2 size={18} className="animate-spin" /> جاري تحميل الصور...</>
                  : <>{editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
