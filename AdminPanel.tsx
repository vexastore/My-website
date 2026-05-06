import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, Product } from '../types';
import { 
  Package, Truck, CheckCircle2, XCircle, Trash2, Phone, MapPin, 
  Calendar, DollarSign, ClipboardList, RefreshCw, Edit, Plus, X, Image, Tag, Warehouse, Sparkles, Upload,
  LockKeyhole, LogOut
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { orders, products, setProducts, updateOrderStatus, deleteOrder } = useShop();
  
  // Tab State: 'orders' or 'products'
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => localStorage.getItem('vexa_admin_session') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const todayKey = new Date().toISOString().slice(0, 10);
  const [selectedOrderDate, setSelectedOrderDate] = useState<string>('all');
  
  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State for Adding/Editing Products
  const [prodForm, setProdForm] = useState<Omit<Product, 'id'>>({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    price: 0,
    image: '',
    images: [],
    category: 'Sex Toys',
    rating: 5.0,
    reviewsCount: 1,
    stock: 10,
    isNew: false
  });

  const getAdminPassword = () => localStorage.getItem('vexa_admin_password') || 'jojoxxjjlljjll';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === getAdminPassword()) {
      localStorage.setItem('vexa_admin_session', 'true');
      setIsAdminUnlocked(true);
      setPasswordInput('');
      setLoginError('');
      return;
    }

    setLoginError('كلمة المرور غير صحيحة. حاول مرة أخرى.');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('vexa_admin_session');
    setIsAdminUnlocked(false);
  };

  const getOrderDateKey = (order: Order) => {
    if (order.dateKey) return order.dateKey;
    const parsed = new Date(order.date);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
    return 'unknown';
  };

  const availableOrderDates = Array.from(new Set(orders.map(getOrderDateKey)))
    .filter((date) => date !== 'unknown')
    .sort((a, b) => b.localeCompare(a));

  const filteredOrders = selectedOrderDate === 'all'
    ? orders
    : orders.filter((order) => getOrderDateKey(order) === selectedOrderDate);

  // Statistics
  const totalSales = filteredOrders
    .filter((o) => o.status === 'delivered' || o.status === 'pending' || o.status === 'shipping')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = filteredOrders.filter((o) => o.status === 'pending');
  const shippingOrders = filteredOrders.filter((o) => o.status === 'shipping');
  
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 rounded-full text-[10px] font-bold"><Package size={12} className="animate-pulse" /> مراجعة</span>;
      case 'shipping':
        return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 rounded-full text-[10px] font-bold"><Truck size={12} /> شحن</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 rounded-full text-[10px] font-bold"><CheckCircle2 size={12} /> استلم</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-150 px-2 rounded-full text-[10px] font-bold"><XCircle size={12} /> ملغي</span>;
    }
  };

  const getCategoryNameAr = (catId: string) => {
    const map: Record<string, string> = {
      'Sex Toys': 'ألعاب زوجية',
      'Vibrators': 'هزازات (Vibrators)',
      'Male Toys': 'ألعاب رجالية',
      'Dildos': 'ديلدو (Dildos)',
      'Lingerie': 'لانجري',
      'BDSM': 'ألعاب القوة (BDSM)',
      'Holiday Collection': 'مجموعة الأعياد',
      'New Arrivals': 'وصل حديثاً'
    };
    return map[catId] || catId;
  };

  // --- PRODUCT MANAGEMENT ACTIONS ---
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      price: 0,
      image: '',
      images: [],
      category: 'Sex Toys',
      rating: 5.0,
      reviewsCount: Math.floor(Math.random() * 10) + 1,
      stock: 10,
      isNew: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setProdForm({
      name: product.name,
      nameEn: product.nameEn,
      description: product.description,
      descriptionEn: product.descriptionEn,
      price: product.price,
      image: product.image,
      images: product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : [],
      category: product.category,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      stock: product.stock,
      isNew: product.isNew || false
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'image') {
      setProdForm(prev => ({
        ...prev,
        image: value,
        images: value ? [value, ...(prev.images || []).filter(img => img !== value)] : (prev.images || [])
      }));
      return;
    }
    
    setProdForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProdForm(prev => ({ ...prev, [name]: checked }));
  };

  const compressImageFile = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new window.Image();

      image.onload = () => {
        const maxSize = 900;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas is not supported'));
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };

      image.onerror = () => reject(new Error('Could not load selected image'));
      image.src = String(reader.result || '');
    };

    reader.onerror = () => reject(new Error('Could not read selected image'));
    reader.readAsDataURL(file);
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFile = files.find(file => !file.type.startsWith('image/'));
    if (invalidFile) {
      alert('يرجى اختيار ملفات صور فقط من المعرض.');
      return;
    }

    try {
      const uploadedImages = await Promise.all(files.map(compressImageFile));
      setProdForm(prev => {
        const nextImages = [...(prev.images || []), ...uploadedImages].slice(0, 8);
        return {
          ...prev,
          images: nextImages,
          image: prev.image || nextImages[0] || ''
        };
      });
    } catch (error) {
      console.error('Image upload error:', error);
      alert('حدث خطأ أثناء قراءة الصور. جرّب صور أخرى.');
    } finally {
      e.target.value = '';
    }
  };

  const handleSetMainImage = (image: string) => {
    setProdForm(prev => ({
      ...prev,
      image,
      images: [image, ...(prev.images || []).filter(img => img !== image)]
    }));
  };

  const handleRemoveGalleryImage = (image: string) => {
    setProdForm(prev => {
      const nextImages = (prev.images || []).filter(img => img !== image);
      return {
        ...prev,
        images: nextImages,
        image: prev.image === image ? (nextImages[0] || '') : prev.image
      };
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prodForm.name || !prodForm.price || !prodForm.image) {
      alert('يرجى ملء الحقول الأساسية: الاسم، السعر، ورابط الصورة!');
      return;
    }

    const normalizedForm = {
      ...prodForm,
      images: prodForm.images && prodForm.images.length > 0 ? prodForm.images : prodForm.image ? [prodForm.image] : [],
      image: prodForm.image || prodForm.images?.[0] || ''
    };

    try {
      const previewProducts = editingProduct
        ? products.map(p => p.id === editingProduct.id ? { ...normalizedForm, id: editingProduct.id } : p)
        : [{ ...normalizedForm, id: 'preview' }, ...products];
      localStorage.setItem('adult_store_products', JSON.stringify(previewProducts));
    } catch (error) {
      console.error('Product save preview failed:', error);
      alert('لم يتم الحفظ لأن الصور كبيرة أو كثيرة جداً. جرّب حذف بعض الصور أو اختيار صور أصغر.');
      return;
    }

    if (editingProduct) {
      // Edit Existing Product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? { ...normalizedForm, id: editingProduct.id } : p
      );
      setProducts(updatedProducts);
      alert('تم تعديل المنتج بنجاح! 💾');
    } else {
      // Add New Product
      const newProduct: Product = {
        ...normalizedForm,
        id: 'prod-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      };
      setProducts([newProduct, ...products]);
      alert('تم إضافة المنتج الجديد بنجاح! 🎉');
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف المنتج: "${productName}" نهائياً من المتجر؟`)) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  if (!isAdminUnlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-12 font-sans" dir="rtl">
        <form
          onSubmit={handleAdminLogin}
          className="w-full max-w-md border border-white/10 bg-[#0b0b0b] p-6 text-white shadow-2xl shadow-black/40 sm:p-8"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-950/30 text-red-300">
            <LockKeyhole size={26} />
          </div>

          <h1 className="text-center text-2xl font-black tracking-wide">حماية لوحة التحكم</h1>
          <p className="mx-auto mt-2 max-w-sm text-center text-xs leading-6 text-white/45">
            هذه الصفحة خاصة بصاحب المتجر فقط. أدخل كلمة المرور لإدارة الطلبات والمنتجات والأسعار.
          </p>

          <div className="mt-6 space-y-2">
            <label className="block text-xs font-black uppercase tracking-[0.25em] text-white/45">Admin password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-white/15 bg-white/5 px-4 py-3 text-center text-base font-bold tracking-[0.18em] text-white outline-none transition placeholder:text-white/20 focus:border-red-400"
              autoFocus
            />
            {loginError && <p className="text-center text-xs font-bold text-red-400">{loginError}</p>}
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.25em] text-black transition hover:bg-red-100 active:scale-[0.98]"
          >
            دخول الإدارة
          </button>

          <p className="mt-4 text-center text-[10px] leading-5 text-white/30">
            كلمة المرور الخاصة بك تم تحديثها. احتفظ بها ولا تشاركها مع الزبائن.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="mb-6 border-b border-stone-200 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <ClipboardList className="text-purple-600 h-6 w-6" />
            لوحة الإدارة الشاملة (لصاحب المتجر)
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            تحكم كامل في مبيعاتك وبضاعتك: تتبع الطلبيات، غيّر الحالات، عدّل الأسعار، تحكم بالكميات، أو أضف منتجات جديدة للمخزن.
          </p>
        </div>

        <div className="flex flex-col gap-2 self-start md:self-center">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-stone-200 rounded-xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'orders'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📊 إدارة الطلبيات ({filteredOrders.length}/{orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'products'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📦 إدارة بضاعة المتجر ({products.length})
            </button>
          </div>
          <button
            onClick={handleAdminLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
          >
            <LogOut size={14} />
            تسجيل خروج من الإدارة
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="mb-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-black text-stone-900">فلترة الطلبيات حسب التاريخ</h2>
              <p className="mt-1 text-[11px] font-medium text-stone-500">
                اختر أي يوم لتشاهد طلبات هذا التاريخ فقط. طلبات اليوم تظهر بزر سريع.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedOrderDate('all')}
                className={`rounded-lg border px-3 py-2 text-xs font-black transition ${selectedOrderDate === 'all' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'}`}
              >
                كل التواريخ
              </button>
              <button
                onClick={() => setSelectedOrderDate(todayKey)}
                className={`rounded-lg border px-3 py-2 text-xs font-black transition ${selectedOrderDate === todayKey ? 'border-purple-700 bg-purple-700 text-white' : 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
              >
                طلبات اليوم
              </button>
              <input
                type="date"
                value={selectedOrderDate === 'all' ? todayKey : selectedOrderDate}
                onChange={(e) => setSelectedOrderDate(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-black text-stone-700 outline-none focus:border-purple-500"
              />
              {availableOrderDates.length > 0 && (
                <select
                  value={selectedOrderDate}
                  onChange={(e) => setSelectedOrderDate(e.target.value)}
                  className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-black text-stone-700 outline-none focus:border-purple-500"
                >
                  <option value="all">كل الأيام المسجلة</option>
                  {availableOrderDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid (Shows across both tabs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Sales */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 block mb-1">إيرادات الطلبيات المؤكدة</span>
            <span className="text-lg sm:text-xl font-black text-purple-700">${totalSales.toFixed(2)} USD</span>
          </div>
          <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 block mb-1">طلبات جديدة ناطرة الشحن</span>
            <span className="text-lg sm:text-xl font-black text-amber-600">{pendingOrders.length} طلب</span>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>

        {/* Shipping Orders */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 block mb-1">طلبات جاري شحنها</span>
            <span className="text-lg sm:text-xl font-black text-blue-600">{shippingOrders.length} طلب</span>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Truck size={20} />
          </div>
        </div>

        {/* Total Products in stock */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 block mb-1">إجمالي المنتجات بالمخزن</span>
            <span className="text-lg sm:text-xl font-black text-stone-800">{products.length} صنف</span>
          </div>
          <div className="h-10 w-10 bg-stone-100 text-stone-600 rounded-lg flex items-center justify-center">
            <Warehouse size={20} />
          </div>
        </div>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-100 flex items-center justify-between">
            <h2 className="font-bold text-stone-800 text-sm flex items-center gap-1">
              <ClipboardList size={16} className="text-stone-600" /> قائمة الطلبيات الواردة ({filteredOrders.length})
            </h2>
            <span className="text-[10px] text-stone-400 font-medium">الطلبات محفوظة بذاكرة المتصفح للخصوصية.</span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-stone-400">
              <ClipboardList size={40} className="mx-auto mb-3 text-stone-300" />
              <h3 className="text-xs font-bold text-stone-600 mb-1">لا توجد طلبات لهذا التاريخ</h3>
              <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                اختر تاريخاً آخر أو اضغط على كل التواريخ لعرض جميع الطلبات.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 overflow-x-auto">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-stone-50/50 transition flex flex-col lg:flex-row gap-4">
                  
                  {/* Client Info */}
                  <div className="lg:w-1/3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="text-xs text-stone-800">
                      <h3 className="font-black text-sm text-purple-900 mb-0.5">{order.customer.name}</h3>
                      
                      <div className="flex items-center gap-1 font-bold text-stone-600 mb-0.5">
                        <Phone size={12} className="text-stone-400" />
                        <a href={`tel:${order.customer.phone}`} dir="ltr" className="hover:text-purple-600 underline">
                          {order.customer.phone}
                        </a>
                      </div>

                      <div className="flex items-start gap-1 text-stone-500">
                        <MapPin size={12} className="text-stone-400 mt-0.5 flex-shrink-0" />
                        <span>{order.customer.city} - {order.customer.address}</span>
                      </div>

                      {order.customer.notes && (
                        <div className="mt-1.5 text-[10px] bg-amber-50 border-r-2 border-amber-400 p-1.5 rounded rounded-r-none text-amber-800 font-medium">
                          **ملاحظة الزبون:** {order.customer.notes}
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-[9px] text-stone-400 mt-2">
                        <Calendar size={10} />
                        <span>تاريخ الطلب: {order.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items Ordered */}
                  <div className="lg:w-5/12 bg-stone-50 p-3 rounded-lg border border-stone-150">
                    <span className="text-[9px] font-bold text-stone-400 block mb-2">المنتجات المطلوبة:</span>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] bg-white p-1.5 rounded-lg border border-stone-100 shadow-sm">
                          <img src={item.product.image} alt={item.product.name} className="h-8 w-8 object-cover rounded border" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-stone-800 line-clamp-1">{item.product.name}</h5>
                            <span className="text-[9px] font-medium text-stone-400 block">{getCategoryNameAr(item.product.category)}</span>
                          </div>
                          <div className="text-left font-extrabold text-stone-700 flex-shrink-0">
                            {item.quantity} × ${item.product.price.toFixed(2)} USD
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 pt-1 border-t border-dashed border-stone-200 flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-500">الحساب الإجمالي (دفع عند الاستلام):</span>
                      <span className="font-black text-sm text-purple-700">${order.total.toFixed(2)} USD</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:w-1/4 flex flex-row lg:flex-col justify-end lg:justify-start gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 lg:border-r lg:border-stone-200 lg:pr-3">
                    <span className="text-[9px] font-bold text-stone-400 hidden lg:block mb-1">تحديث حالة الطلب:</span>
                    
                    <div className="relative flex-1 lg:flex-none">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="w-full text-[11px] font-bold p-2 bg-white border border-stone-200 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                      >
                        <option value="pending">قيد المراجعة (جديد)</option>
                        <option value="shipping">جاري الشحن مع المندوب</option>
                        <option value="delivered">تم التوصيل بنجاح</option>
                        <option value="cancelled">إلغاء الطلب</option>
                      </select>
                      <RefreshCw size={10} className="absolute left-2 top-3 text-stone-400 pointer-events-none" />
                    </div>

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-150 transition flex items-center justify-center gap-1 text-[11px] font-bold flex-shrink-0"
                    >
                      <Trash2 size={12} />
                      <span>حذف سجل الطلب</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-100 flex items-center justify-between">
            <h2 className="font-bold text-stone-800 text-sm flex items-center gap-1">
              <Package size={16} className="text-stone-600" /> مخزن بضاعة المتجر ({products.length} صنف متوفر)
            </h2>
            <button
              onClick={handleOpenAddModal}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-700 to-rose-600 hover:from-purple-800 hover:to-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1 active:scale-95"
            >
              <Plus size={14} />
              <span>إضافة منتج جديد للمتجر</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="px-4 py-2.5">المنتج</th>
                  <th className="px-4 py-2.5">القسم</th>
                  <th className="px-4 py-2.5">السعر</th>
                  <th className="px-4 py-2.5">المخزون (الكمية)</th>
                  <th className="px-4 py-2.5">الحالة</th>
                  <th className="px-4 py-2.5 text-center">التحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition">
                    {/* Name & Image */}
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded border border-stone-150 overflow-hidden flex-shrink-0 bg-stone-100">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-800 line-clamp-1">{product.name}</h4>
                        <span className="text-[10px] text-stone-400 block font-mono" dir="ltr">{product.id}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full text-[10px]">
                        {getCategoryNameAr(product.category)}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-extrabold text-stone-800">
                      ${product.price.toFixed(2)} USD
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span className={`font-extrabold ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {product.stock} حبة
                      </span>
                    </td>

                    {/* Badge Status */}
                    <td className="px-4 py-3">
                      {product.stock === 0 ? (
                        <span className="text-[9px] font-bold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded">نفذت الكمية</span>
                      ) : product.isNew ? (
                        <span className="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded animate-pulse">جديد ✨</span>
                      ) : (
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded">نشط</span>
                      )}
                    </td>

                    {/* Control Buttons */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-100 transition"
                          title="تعديل بيانات المنتج"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-100 transition"
                          title="حذف المنتج من المتجر"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT PRODUCT MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 bg-stone-100 flex items-center justify-between flex-shrink-0">
              <h3 className="font-black text-sm text-stone-800 flex items-center gap-1">
                {editingProduct ? <Edit size={16} className="text-blue-600" /> : <Plus size={16} className="text-purple-600" />}
                {editingProduct ? `تعديل منتج: ${editingProduct.name.substring(0, 20)}...` : 'إضافة منتج جديد لمتجر فيكسا'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-stone-200 text-stone-500 rounded-lg transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-4 space-y-3 flex-1 overflow-y-auto">
              
              {/* Image URL & Preview */}
              <div className="flex gap-4 items-end bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                    <Image size={12} /> رابط صورة المنتج (URL) *
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={prodForm.image}
                    onChange={handleFormChange}
                    placeholder="ضع رابط صورة المنتج من جوجل أو Unsplash"
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded bg-white focus:outline-none focus:border-purple-500"
                    required
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      id="product-gallery-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="product-gallery-upload"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-[10px] font-black text-purple-700 transition hover:bg-purple-100"
                    >
                      <Upload size={12} />
                      اختيار عدة صور من Gallery
                    </label>
                    <span className="text-[9px] font-medium text-stone-400">تقدر تختار أكثر من صورة دفعة واحدة.</span>
                  </div>
                </div>
                <div className="h-14 w-14 rounded border border-stone-150 overflow-hidden bg-stone-100 flex-shrink-0">
                  {prodForm.image ? (
                    <img src={prodForm.image} alt="معاينة" className="h-full w-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80'}} />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-stone-300"><Image size={16} /></div>
                  )}
                </div>
              </div>

              {/* Gallery Preview */}
              {(prodForm.images || []).length > 0 && (
                <div className="rounded-lg border border-stone-200 bg-white p-2.5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-black text-stone-600">معرض صور المنتج ({(prodForm.images || []).length})</span>
                    <span className="text-[9px] font-bold text-stone-400">اضغط "رئيسية" لتغيير أول صورة</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {(prodForm.images || []).map((img, idx) => (
                      <div key={`${img}-${idx}`} className={`relative overflow-hidden rounded-lg border ${prodForm.image === img ? 'border-purple-600 ring-2 ring-purple-100' : 'border-stone-200'}`}>
                        <img src={img} alt={`صورة ${idx + 1}`} className="h-16 w-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 flex bg-black/65 text-[8px] font-black text-white">
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(img)}
                            className="flex-1 py-1 hover:bg-purple-700"
                          >
                            رئيسية
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(img)}
                            className="w-6 border-r border-white/20 hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Name (Arabic & English) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-1">اسم المنتج (بالعربي) *</label>
                  <input
                    type="text"
                    name="name"
                    value={prodForm.name}
                    onChange={handleFormChange}
                    placeholder="مثال: هزاز الوردة الذكي"
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-1">اسم المنتج (بالإنكليزي) *</label>
                  <input
                    type="text"
                    name="nameEn"
                    dir="ltr"
                    value={prodForm.nameEn}
                    onChange={handleFormChange}
                    placeholder="Example: Smart Rose Vibrator"
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded focus:outline-none focus:border-purple-500 text-right"
                    required
                  />
                </div>
              </div>

              {/* Price & Stock & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                    <DollarSign size={12} /> السعر (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={prodForm.price || ''}
                    onChange={handleFormChange}
                    placeholder="السعر"
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded focus:outline-none focus:border-purple-500 font-bold"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                    <Warehouse size={12} /> المخزون (الكمية) *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={prodForm.stock === 0 ? 0 : (prodForm.stock || '')}
                    onChange={handleFormChange}
                    placeholder="الكمية"
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded focus:outline-none focus:border-purple-500 font-bold"
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                    <Tag size={12} /> قسم الصنف *
                  </label>
                  <select
                    name="category"
                    value={prodForm.category}
                    onChange={handleFormChange}
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded bg-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="Sex Toys">ألعاب زوجية</option>
                    <option value="Vibrators">هزازات</option>
                    <option value="Male Toys">ألعاب رجالية</option>
                    <option value="Dildos">ديلدو (Dildos)</option>
                    <option value="Lingerie">لانجري</option>
                    <option value="BDSM">ألعاب القوة (BDSM)</option>
                    <option value="Holiday Collection">مجموعة الأعياد</option>
                    <option value="New Arrivals">وصل حديثاً</option>
                  </select>
                </div>
              </div>

              {/* Description (Arabic) */}
              <div>
                <label className="block text-[10px] font-bold text-stone-600 mb-1">وصف المنتج (بالعربي) *</label>
                <textarea
                  name="description"
                  value={prodForm.description}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="اكتب وصفاً جذاباً يشرح ميزات المنتج ومواده الطبية وطريقة استخدامه..."
                  className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded focus:outline-none focus:border-purple-500 resize-none leading-normal"
                  required
                />
              </div>

              {/* Description (English) */}
              <div>
                <label className="block text-[10px] font-bold text-stone-600 mb-1">وصف المنتج (بالإنكليزي) *</label>
                <textarea
                  name="descriptionEn"
                  dir="ltr"
                  value={prodForm.descriptionEn}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Write a clear English description for search engines and billing..."
                  className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded focus:outline-none focus:border-purple-500 resize-none text-left"
                  required
                />
              </div>

              {/* Checkbox: Is New Product */}
              <div className="flex items-center gap-2 bg-purple-50 p-2 rounded border border-purple-100">
                <input
                  type="checkbox"
                  id="isNew"
                  name="isNew"
                  checked={prodForm.isNew}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-stone-300 rounded cursor-pointer"
                />
                <label htmlFor="isNew" className="text-xs font-bold text-purple-800 cursor-pointer flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-500 animate-pulse" /> وضع علامة "جديد ✨" على هذا المنتج لعرضه بقسم وصل حديثاً!
                </label>
              </div>

              {/* Modal Footer (Save Button) */}
              <div className="pt-3 border-t border-stone-200 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-purple-700 to-rose-600 hover:from-purple-800 hover:to-rose-700 text-white text-xs font-bold rounded-lg shadow-md transition active:scale-95 flex items-center justify-center gap-1"
                >
                  <RefreshCw size={14} className="animate-spin-slow" />
                  حفظ وتأكيد تعديلات الصنف
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold rounded-lg border border-stone-200 transition"
                >
                  إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
