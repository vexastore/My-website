import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, Product } from '../types';
import { 
  Package, Truck, CheckCircle2, XCircle, Trash2, Phone, MapPin, 
  Calendar, DollarSign, ClipboardList, Edit, Plus, X, Upload,
  LockKeyhole, LogOut, Loader2
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { orders, products, addProduct, updateProduct, deleteProduct, updateOrderStatus, deleteOrder } = useShop();
  
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
  
  const [prodForm, setProdForm] = useState<Omit<Product, 'id'>>({
    name: '', nameEn: '', description: '', descriptionEn: '',
    price: 0, image: '', images: [], category: 'Sex Toys',
    rating: 5.0, reviewsCount: 1, stock: 10, isNew: false
  });

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
    .filter(o => ['delivered','pending','shipping'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  const getStatusBadge = (status: Order['status']) => {
    const map = {
      pending:   <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 rounded-full text-[10px] font-bold"><Package size={12} className="animate-pulse" /> مراجعة</span>,
      shipping:  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 rounded-full text-[10px] font-bold"><Truck size={12} /> شحن</span>,
      delivered: <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 rounded-full text-[10px] font-bold"><CheckCircle2 size={12} /> استلم</span>,
      cancelled: <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2 rounded-full text-[10px] font-bold"><XCircle size={12} /> ملغي</span>,
    };
    return map[status];
  };

  const getCategoryNameAr = (catId: string) => ({
    'Sex Toys': 'ألعاب زوجية', 'Vibrators': 'هزازات', 'Male Toys': 'ألعاب رجالية',
    'Dildos': 'ديلدو', 'Lingerie': 'لانجري', 'BDSM': 'ألعاب القوة',
    'Holiday Collection': 'مجموعة الأعياد', 'New Arrivals': 'وصل حديثاً'
  }[catId] || catId);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdForm({ name: '', nameEn: '', description: '', descriptionEn: '', price: 0,
      image: '', images: [], category: 'Sex Toys', rating: 5.0,
      reviewsCount: Math.floor(Math.random() * 10) + 1, stock: 10, isNew: true });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setProdForm({
      name: product.name, nameEn: product.nameEn, description: product.description,
      descriptionEn: product.descriptionEn, price: product.price, image: product.image,
      images: product.images?.length ? product.images : product.image ? [product.image] : [],
      category: product.category, rating: product.rating, reviewsCount: product.reviewsCount,
      stock: product.stock, isNew: product.isNew || false
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'image') {
      setProdForm(prev => ({ ...prev, image: value,
        images: value ? [value, ...(prev.images || []).filter(i => i !== value)] : (prev.images || []) }));
      return;
    }
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
        const maxSize = 500;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.55));
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
        const next = [...(prev.images || []), ...uploaded].slice(0, 6);
        return { ...prev, images: next, image: prev.image || next[0] || '' };
      });
    } catch { alert('حدث خطأ في قراءة الصور.'); }
    finally { e.target.value = ''; }
  };

  const handleSetMainImage = (image: string) => {
    setProdForm(prev => ({ ...prev, image, images: [image, ...(prev.images || []).filter(i => i !== image)] }));
  };

  const handleRemoveGalleryImage = (image: string) => {
    setProdForm(prev => {
      const next = (prev.images || []).filter(i => i !== image);
      return { ...prev, images: next, image: prev.image === image ? (next[0] || '') : prev.image };
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price || !prodForm.image) {
      alert('يرجى ملء الحقول الأساسية: الاسم، السعر، ورابط الصورة!');
      return;
    }
    const normalized = {
      ...prodForm,
      images: prodForm.images?.length ? prodForm.images : prodForm.image ? [prodForm.image] : [],
      image: prodForm.image || prodForm.images?.[0] || ''
    };
    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, normalized);
        alert('تم تعديل المنتج بنجاح! ✅');
      } else {
        await addProduct(normalized);
        alert('تم إضافة المنتج الجديد بنجاح! 🎉');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف "${productName}" نهائياً؟`)) return;
    setIsDeleting(productId);
    try { await deleteProduct(productId); }
    catch { alert('حدث خطأ أثناء الحذف.'); }
    finally { setIsDeleting(null); }
  };

  // ─── Login Screen ──────────────────────────────────────────────────────────
  if (!isAdminUnlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-12 font-sans" dir="rtl">
        <form onSubmit={handleAdminLogin}
          className="w-full max-w-md border border-white/10 bg-[#0b0b0b] p-6 text-white shadow-2xl sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-950/30 text-red-300">
            <LockKeyhole size={26} />
          </div>
          <h1 className="text-center text-2xl font-black tracking-wide">حماية لوحة التحكم</h1>
          <p className="mx-auto mt-2 max-w-sm text-center text-xs leading-6 text-white/45">
            هذه الصفحة خاصة بصاحب المتجر فقط. أدخل كلمة المرور لإدارة الطلبات والمنتجات.
          </p>
          <div className="mt-6 space-y-2">
            <label className="block text-xs font-black uppercase tracking-[0.25em] text-white/45">Admin password</label>
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)}
              placeholder="••••••••" autoFocus
              className="w-full border border-white/15 bg-white/5 px-4 py-3 text-center text-base font-bold tracking-[0.18em] text-white outline-none focus:border-red-400" />
            {loginError && <p className="text-center text-xs font-bold text-red-400">{loginError}</p>}
          </div>
          <button type="submit"
            className="mt-6 w-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.25em] text-black hover:bg-red-100 active:scale-[0.98]">
            دخول الإدارة
          </button>
        </form>
      </div>
    );
  }

  // ─── Main Admin Panel ──────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">لوحة تحكم المتجر</h1>
          <p className="text-xs text-white/40 mt-1">المنتجات محفوظة على Firebase ✅</p>
        </div>
        <button onClick={handleAdminLogout}
          className="flex items-center gap-2 border border-white/15 px-4 py-2 text-xs font-bold text-white/60 hover:text-white rounded-lg transition">
          <LogOut size={14} /> خروج
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/10">
        {(['orders','products'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-black transition border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === tab ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/70'}`}>
            {tab === 'orders' ? <><ClipboardList size={15} /> الطلبات</> : <><Package size={15} /> المنتجات</>}
          </button>
        ))}
      </div>

      {/* ── ORDERS TAB ────────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'المبيعات', value: `$${totalSales.toFixed(0)}`, color: '' },
              { label: 'إجمالي الطلبات', value: filteredOrders.length, color: '' },
              { label: 'قيد المراجعة', value: filteredOrders.filter(o=>o.status==='pending').length, color: 'border-amber-500/20 text-amber-400' },
              { label: 'قيد الشحن', value: filteredOrders.filter(o=>o.status==='shipping').length, color: 'border-blue-500/20 text-blue-400' },
            ].map(s => (
              <div key={s.label} className={`bg-[#111] border ${s.color || 'border-white/10'} rounded-xl p-4`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${s.color ? s.color : 'text-white/40'}`}>{s.label}</p>
                <p className={`text-xl font-black ${s.color ? s.color : 'text-white'}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-white/50 font-bold">فلتر التاريخ:</label>
            <select value={selectedOrderDate} onChange={e => setSelectedOrderDate(e.target.value)}
              className="border border-white/15 bg-[#111] text-white text-xs px-3 py-2 rounded-lg outline-none">
              <option value="all">كل الطلبات</option>
              <option value={todayKey}>اليوم</option>
              {availableOrderDates.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Orders */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/70">
                <div className="space-y-1">
                  <p className="flex items-center gap-1"><Phone size={12} />{order.customer.name} — {order.customer.phone}</p>
                  <p className="flex items-center gap-1"><MapPin size={12} />{order.customer.city}، {order.customer.address}</p>
                </div>
                <div>{order.items.map((item, i) => (
                  <p key={i} className="text-white/50 text-[11px]">• {item.product.name} × {item.quantity}</p>
                ))}</div>
              </div>
              <div className="flex gap-2 flex-wrap pt-1 border-t border-white/5">
                {(['pending','shipping','delivered','cancelled'] as Order['status'][]).map(s => (
                  <button key={s} onClick={() => updateOrderStatus(order.id, s)}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-full transition ${
                      order.status === s ? 'bg-white text-black' : 'border border-white/15 text-white/50 hover:text-white'}`}>
                    {s==='pending'?'مراجعة':s==='shipping'?'شحن':s==='delivered'?'استلم':'ملغي'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PRODUCTS TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/40">{products.length} منتج في المتجر</p>
            <button onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-white text-black px-4 py-2.5 text-xs font-black rounded-xl hover:bg-stone-100 transition active:scale-[0.98]">
              <Plus size={16} /> إضافة منتج جديد
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden">
                <div className="aspect-video bg-stone-900 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80" />
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {getCategoryNameAr(product.category)}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-black text-white line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-emerald-400">${product.price}</span>
                    <span className={`font-bold ${product.stock <= 3 ? 'text-red-400' : 'text-white/40'}`}>
                      مخزون: {product.stock}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleOpenEditModal(product)}
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
            ))}
          </div>
        </div>
      )}

      {/* ── PRODUCT MODAL ─────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10001] bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => !isSaving && setIsModalOpen(false)}>
          <div className="bg-[#0d0d0d] border border-white/15 w-full max-w-2xl max-h-[92vh] overflow-y-auto sm:rounded-2xl"
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
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">الاسم بالعربي *</label>
                  <input name="name" value={prodForm.name} onChange={handleFormChange} required
                    placeholder="اسم المنتج بالعربي"
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">Name in English</label>
                  <input name="nameEn" value={prodForm.nameEn} onChange={handleFormChange} dir="ltr"
                    placeholder="Product name in English"
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition" />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">الوصف بالعربي</label>
                  <textarea name="description" value={prodForm.description} onChange={handleFormChange} rows={3}
                    placeholder="وصف المنتج..."
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition resize-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">Description EN</label>
                  <textarea name="descriptionEn" value={prodForm.descriptionEn} onChange={handleFormChange} rows={3} dir="ltr"
                    placeholder="Product description..."
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition resize-none" />
                </div>
              </div>

              {/* Price / Stock / Category */}
              <div className="grid grid-cols-3 gap-3">
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
                <div>
                  <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">الفئة</label>
                  <select name="category" value={prodForm.category} onChange={handleFormChange}
                    className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition">
                    {['Sex Toys','Vibrators','Male Toys','Dildos','Lingerie','BDSM','Holiday Collection','New Arrivals'].map(cat => (
                      <option key={cat} value={cat}>{getCategoryNameAr(cat)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-[11px] font-black text-white/50 mb-1.5 uppercase tracking-wider">رابط الصورة الرئيسية *</label>
                <input name="image" value={prodForm.image} onChange={handleFormChange} dir="ltr"
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/30 transition" />
              </div>

              {/* Upload */}
              <div>
                <label className="block text-[11px] font-black text-white/50 mb-2 uppercase tracking-wider">أو ارفع صورة من جهازك</label>
                <label className="flex items-center gap-2 border border-dashed border-white/20 hover:border-white/40 text-white/50 hover:text-white/70 px-4 py-3 rounded-xl cursor-pointer transition text-sm font-bold">
                  <Upload size={16} /> اختر صور من الجهاز
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                {prodForm.images && prodForm.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {prodForm.images.map((img, idx) => (
                      <div key={idx} className={`relative rounded-xl overflow-hidden border-2 transition ${prodForm.image === img ? 'border-white' : 'border-transparent'}`}>
                        <img src={img} alt="" className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 hover:opacity-100 transition bg-black/60">
                          <button type="button" onClick={() => handleSetMainImage(img)} className="text-[10px] font-black text-white bg-black/70 px-2 py-0.5 rounded-full">رئيسية</button>
                          <button type="button" onClick={() => handleRemoveGalleryImage(img)} className="text-red-400"><X size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Is New */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isNew" checked={prodForm.isNew || false} onChange={handleCheckboxChange} className="w-4 h-4 rounded" />
                <span className="text-sm font-bold text-white/70">وضع علامة "جديد" على هذا المنتج</span>
              </label>

              {/* Save Button */}
              <button type="submit" disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-3.5 rounded-xl font-black text-sm hover:bg-stone-100 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition">
                {isSaving
                  ? <><Loader2 size={18} className="animate-spin" /> جاري الحفظ على Firebase...</>
                  : <>{editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج للمتجر'}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
