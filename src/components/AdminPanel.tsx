import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, Product, CategoryId, ProductVariant } from '../types';
import {
  Package, Truck, CheckCircle2, XCircle, Trash2, Phone, MapPin,
  Calendar, DollarSign, ClipboardList, Edit, Plus, X, Upload,
  LockKeyhole, LogOut, Loader2, ChevronUp, ChevronDown
} from 'lucide-react';
import { CATEGORIES, getCategoryName, getProductCategories } from '../data/categories';

const ALL_CATEGORY_IDS: CategoryId[] = [
  'Sex Toys', 'Vibrators', 'Male Toys', 'Dildos', 'Lingerie',
  'BDSM', 'Holiday Collection', 'New Arrivals',
  'Butt Plugs', 'Anal Toys', 'Bondage', 'Sex Dolls',
  'Strap Ons', 'Kegel Balls', 'Sexual Enhancers', 'Penis Pumps',
  'Cock Rings', 'Masturbators', 'Chastity', 'Sex Machines',
  'Lubricants', 'Poppers'
];

export const AdminPanel: React.FC = () => {
  const { orders, products, addProduct, updateProduct, deleteProduct, updateOrderStatus, deleteOrder, fetchProductImages } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => localStorage.getItem('vexa_admin_session') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const todayKey = new Date().toISOString().slice(0, 10);
  const [selectedOrderDate, setSelectedOrderDate] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

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

  const getAdminPassword = () => localStorage.getItem('vexa_admin_password') || 'Jojoxxjjlljjll';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === getAdminPassword()) {
      localStorage.setItem('vexa_admin_session', 'true');
      setIsAdminUnlocked(true);
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('كلمة المرور غير صحيحة. حاول مرة أخرى.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('vexa_admin_session');
    setIsAdminUnlocked(false);
  };

  const getOrderDateKey = (order: Order) => {
    if (order.dateKey) return order.dateKey;
    const parsed = new Date(order.date);
    return !Number.isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : 'unknown';
  };

  const availableOrderDates = Array.from(new Set(orders.map(getOrderDateKey)))
    .filter(d => d !== 'unknown').sort((a, b) => b.localeCompare(a));

  const filteredOrders = selectedOrderDate === 'all'
    ? orders : orders.filter(o => getOrderDateKey(o) === selectedOrderDate);

  const totalSales = filteredOrders
    .filter(o => ['delivered', 'pending', 'shipping'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

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
    setProdForm({ name: '', description: '', price: 0, image: '', images: [], categories: ['Sex Toys'], variants: [], rating: 5.0, reviewsCount: Math.floor(Math.random() * 10) + 1, stock: 10, isNew: true });
    setIsModalOpen(true);
  };

  const openEditModal = async (product: Product) => {
    setEditingProduct(product);
    setNewOptionInputs({});
    const cats = getProductCategories(product) as CategoryId[];
    // Start with what we have locally, open modal immediately
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
    // Fetch the real full images list from Firebase
    setIsLoadingImages(true);
    try {
      const firebaseImgs = await fetchProductImages(product.id);
      if (firebaseImgs.length > 0) {
        setProdForm(prev => ({
          ...prev,
          images: firebaseImgs,
          image: firebaseImgs[0] || prev.image,
        }));
      }
    } catch { /* keep local fallback */ }
    finally { setIsLoadingImages(false); }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProdForm(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProdForm(prev => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const compressImageFile = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const maxSize = 240;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.25));
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
    try {
      const uploaded = await Promise.all(files.map(compressImageFile));
      setProdForm(prev => {
        const next = [...(prev.images || []), ...uploaded].slice(0, 20);
        return { ...prev, images: next, image: prev.image || next[0] || '' };
      });
    } catch { alert('حدث خطأ في قراءة الصور.'); }
    finally { e.target.value = ''; }
  };

  const handleRemoveImage = (image: string) => {
    setProdForm(prev => {
      const next = (prev.images || []).filter(i => i !== image);
      return { ...prev, images: next, image: prev.image === image ? (next[0] || '') : prev.image };
    });
  };

  const moveImageUp = (idx: number) => {
    if (idx === 0) return;
    setProdForm(prev => {
      const imgs = [...(prev.images || [])];
      [imgs[idx - 1], imgs[idx]] = [imgs[idx], imgs[idx - 1]];
      return { ...prev, images: imgs, image: imgs[0] || prev.image };
    });
  };

  const moveImageDown = (idx: number) => {
    setProdForm(prev => {
      const imgs = [...(prev.images || [])];
      if (idx >= imgs.length - 1) return prev;
      [imgs[idx + 1], imgs[idx]] = [imgs[idx], imgs[idx + 1]];
      return { ...prev, images: imgs, image: imgs[0] || prev.image };
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price || !prodForm.image) {
      alert('يرجى ملء: الاسم، السعر، والصورة.');
      return;
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
      images: prodForm.images?.length ? prodForm.images : prodForm.image ? [prodForm.image] : [],
      category: primaryCat as CategoryId,
      categories: prodForm.categories,
      variants: cleanVariants.length > 0 ? cleanVariants : undefined,
      rating: prodForm.rating,
      reviewsCount: prodForm.reviewsCount,
      stock: prodForm.stock,
      isNew: prodForm.isNew
    };
    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        alert('تم تعديل المنتج بنجاح! ✅');
      } else {
        await addProduct(productData);
        alert('تم إضافة المنتج! 🎉');
      }
      setIsModalOpen(false);
    } catch {
      alert('حدث خطأ أثناء الحفظ. تأكد من اتصالك بالإنترنت.');
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
        </div>
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

          <div className="flex items-center gap-3">
            <label className="text-xs text-white/50 font-bold">التاريخ:</label>
            <select value={selectedOrderDate} onChange={e => setSelectedOrderDate(e.target.value)}
              className="border border-white/15 bg-[#111] text-white text-xs px-3 py-2 rounded-lg outline-none">
              <option value="all">كل الطلبات</option>
              <option value={todayKey}>اليوم</option>
              {availableOrderDates.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

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
                <button onClick={() => deleteOrder(order.id)} className="text-red-500/60 hover:text-red-400 p-1.5 hover:bg-red-950/30 rounded-lg transition">
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
                  <button key={s} onClick={() => updateOrderStatus(order.id, s)}
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
          onClick={() => !isSaving && setIsModalOpen(false)}>
          <div className="bg-[#0d0d0d] border border-white/15 w-full max-w-xl max-h-[92vh] overflow-y-auto sm:rounded-2xl"
            onClick={e => e.stopPropagation()}>

            <div className="sticky top-0 bg-[#0d0d0d] border-b border-white/10 px-5 py-4 flex items-center justify-between z-10">
              <h2 className="text-base font-black text-white">
                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              <button onClick={() => !isSaving && setIsModalOpen(false)} className="text-white/40 hover:text-white">
                <X size={22} />
              </button>
            </div>

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
                  setProdForm(prev => ({
                    ...prev, image: val,
                    images: val ? [val, ...(prev.images || []).filter(i => i !== val)] : (prev.images || [])
                  }));
                }} dir="ltr" placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition" />
              </div>

              <div>
                <label className="block text-[11px] font-black text-white/50 mb-2 uppercase tracking-wider">
                  ارفع صور إضافية (حتى 20 صور)
                </label>
                <label className="flex items-center gap-2 border border-dashed border-white/20 hover:border-white/40 text-white/50 hover:text-white/70 px-4 py-3 rounded-xl cursor-pointer transition text-sm font-bold">
                  <Upload size={16} /> اختر صور من الجهاز
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {isLoadingImages && (
                <div className="flex items-center gap-2 text-white/40 text-xs font-bold py-2">
                  <Loader2 size={14} className="animate-spin" /> جاري تحميل الصور من الخادم...
                </div>
              )}

              {!isLoadingImages && prodForm.images && prodForm.images.length > 0 && (
                <div>
                  <p className="text-[11px] font-black text-white/50 mb-2 uppercase tracking-wider">
                    ترتيب الصور — الأولى هي صورة الواجهة
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

              <button type="submit" disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-3.5 rounded-xl font-black text-sm hover:bg-stone-100 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition">
                {isSaving
                  ? <><Loader2 size={18} className="animate-spin" /> جاري الحفظ...</>
                  : <>{editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
