import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CustomerInfo, Order } from '../types';
import { Trash2, Plus, Minus, ShoppingBag, Truck, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

const LEBANESE_CITIES = [
  'بيروت', 'طرابلس', 'صيدا', 'صور', 'جونيه', 'زحلة', 'النبطية',
  'بعلبك', 'جبيل', 'عاليه', 'ضبيه', 'بعبدا', 'المتن', 'كسروان',
  'الشوف', 'عكار', 'بنت جبيل', 'مرجعيون', 'راشيا', 'البقاع الغربي'
];

export const Checkout: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, getCartItemsCount, placeOrder, setView, language } = useShop();
  const isArabic = language === 'ar';

  const [form, setForm] = useState<CustomerInfo>({ name: '', phone: '', city: '', address: '', notes: '' });
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!form.name.trim()) newErrors.name = isArabic ? 'الاسم الكامل مطلوب.' : 'Full name is required.';
    if (!form.phone.trim()) {
      newErrors.phone = isArabic ? 'رقم الهاتف مطلوب.' : 'Phone number is required.';
    } else if (!/^(\+?961|0)?[\s-]?[0-9]{7,8}$/.test(form.phone.trim().replace(/\s|-/g, ''))) {
      newErrors.phone = isArabic ? 'رقم لبناني غير صحيح (مثال: 03 123 456).' : 'Invalid Lebanese number (e.g. 03 123 456).';
    }
    if (!form.city.trim()) newErrors.city = isArabic ? 'يرجى اختيار المدينة.' : 'Please select a city.';
    if (!form.address.trim()) newErrors.address = isArabic ? 'يرجى كتابة العنوان بالتفصيل.' : 'Please enter your full address.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validateForm()) return;
    setIsSubmitting(true);

    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const itemsString = cart.map(i => `${i.product.name} (x${i.quantity})`).join(' | ');
    const orderData = {
      orderId, date: new Date().toLocaleString('ar-LB'),
      customerName: form.name, customerPhone: form.phone,
      customerCity: form.city, customerAddress: form.address,
      customerNotes: form.notes || '—',
      products: itemsString,
      totalPrice: getCartTotal() + ' USD', status: 'جديد'
    };

    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-VEXA_STORE_PLACEHOLDER_URL/exec';
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      await new Promise(r => setTimeout(r, 600));
    } catch { /* silent fail — local state still works */ } finally {
      const placed = placeOrder(form);
      setIsSubmitting(false);
      if (placed) setOrderComplete(placed);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerInfo]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-14 text-center sm:px-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="h-20 w-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-200 text-stone-400">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">{isArabic ? 'سلتك فارغة!' : 'Your cart is empty!'}</h2>
        <p className="text-stone-500 text-sm max-w-sm mx-auto mb-8">
          {isArabic ? 'لم تضف أي منتج بعد.' : 'You have not added any products yet.'}
        </p>
        <button onClick={() => setView('shop')}
          className="px-6 py-3 bg-black text-white font-bold rounded-xl transition hover:bg-stone-800">
          {isArabic ? 'تصفح المنتجات' : 'Browse products'}
        </button>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12 text-center sm:px-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="bg-white border border-emerald-100 shadow-lg rounded-2xl p-6 sm:p-8">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-800 mb-2">
            {isArabic ? 'تم استلام طلبك بنجاح!' : 'Order placed successfully!'}
          </h2>
          <p className="text-emerald-700 font-medium text-sm mb-1 bg-emerald-50 py-1.5 px-3 rounded-full inline-block">
            {isArabic ? 'رقم الطلب:' : 'Order ID:'} {orderComplete.id}
          </p>

          {/* Same day delivery badge */}
          <div className="flex items-center justify-center gap-2 mt-4 mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 mx-auto max-w-xs">
            <Zap size={15} className="text-emerald-600 flex-shrink-0" />
            <p className="text-xs font-black text-emerald-700">
              {isArabic ? 'توصيل في نفس اليوم في بيروت' : 'Same day delivery in Beirut'}
            </p>
          </div>

          <div className="text-right border-t border-b border-stone-100 py-4 mb-6 space-y-2">
            {/* Order items with images */}
            <div className="space-y-3 mb-4">
              {orderComplete.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                    {item.product.image
                      ? <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      : <div className="h-full w-full bg-gradient-to-br from-purple-600 to-rose-600 flex items-center justify-center text-white text-xs font-black">V</div>
                    }
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-bold text-stone-800">{isArabic ? item.product.name : (item.product.nameEn || item.product.name)}</p>
                    <p className="text-xs text-stone-500">× {item.quantity} — ${(item.product.price * item.quantity).toFixed(2)} USD</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm pt-2 border-t border-stone-100">
              <span className="text-stone-500">{isArabic ? 'الاسم:' : 'Name:'}</span>
              <span className="font-bold text-stone-800">{orderComplete.customer.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">{isArabic ? 'الهاتف:' : 'Phone:'}</span>
              <span className="font-bold text-stone-800" dir="ltr">{orderComplete.customer.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">{isArabic ? 'العنوان:' : 'Address:'}</span>
              <span className="font-bold text-stone-800">{orderComplete.customer.city}، {orderComplete.customer.address}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-dashed border-stone-200 mt-2">
              <span className="font-bold text-stone-700">{isArabic ? 'المجموع (دفع عند الاستلام):' : 'Total (Cash on delivery):'}</span>
              <span className="font-extrabold text-purple-700 text-base">${orderComplete.total.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 mb-6 flex items-start gap-3 border border-stone-200 text-right">
            <Truck className="text-purple-600 h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-stone-500 leading-relaxed">
              {isArabic
                ? 'سيتواصل معك فريقنا خلال ساعات لتنسيق التوصيل. التغليف سري ومحكم بالكامل.'
                : 'Our team will contact you within hours to coordinate delivery. Fully discreet packaging.'}
            </p>
          </div>

          <button onClick={() => { setOrderComplete(null); setView('shop'); }}
            className="w-full py-3.5 bg-black text-white font-bold rounded-xl transition hover:bg-stone-800 flex items-center justify-center gap-2 active:scale-[0.98]">
            <ArrowRight size={16} />
            {isArabic ? 'العودة للمتجر' : 'Back to shop'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <button onClick={() => setView('shop')}
          className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition">
          <ArrowRight size={14} className={isArabic ? 'ml-1' : 'mr-1 rotate-180'} />
          {isArabic ? 'العودة للتسوق' : 'Continue shopping'}
        </button>
      </div>

      {/* Same day delivery notice */}
      <div className="flex items-center gap-2 mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5">
        <Zap size={15} className="text-emerald-600 flex-shrink-0" />
        <p className="text-xs font-black text-emerald-700">
          {isArabic ? 'توصيل في نفس اليوم في بيروت' : 'Same day delivery in Beirut'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-black text-stone-800 mb-4 pb-3 border-b border-stone-100 flex items-center gap-2">
              <ShoppingBag className="text-purple-600 h-5 w-5" />
              {isArabic ? `سلة مشترياتك (${getCartItemsCount()})` : `Your cart (${getCartItemsCount()})`}
            </h2>
            <div className="divide-y divide-stone-100">
              {cart.map(item => (
                <div key={item.product.id} className="py-4 flex items-center gap-4 first:pt-0">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-stone-100 border flex-shrink-0">
                    {item.product.image
                      ? <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      : <div className="h-full w-full bg-gradient-to-br from-purple-600 to-rose-600 flex items-center justify-center text-white font-black text-sm">V</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-800 text-xs sm:text-sm line-clamp-1">
                      {isArabic ? item.product.name : (item.product.nameEn || item.product.name)}
                    </h4>
                    <p className="text-[10px] font-medium text-purple-600 mt-0.5">{item.product.category}</p>
                    <div className="text-xs font-extrabold text-stone-700 mt-1">${item.product.price.toFixed(2)} USD</div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button type="button" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-r-lg border-l border-stone-200 transition">
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-xs font-bold text-stone-800 min-w-6 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-l-lg border-r border-stone-200 transition">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-200 mt-4 pt-4 flex items-center justify-between">
              <span className="text-sm font-bold text-stone-500">{isArabic ? 'المجموع:' : 'Total:'}</span>
              <span className="text-xl font-black text-stone-900">${getCartTotal().toFixed(2)} USD</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">
              {isArabic ? '+ شحن مجاني وتغليف سري' : '+ Free discreet shipping'}
            </p>
          </div>
        </div>

        {/* Order form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-stone-800 flex items-center gap-2 pb-3 border-b border-stone-100">
              <Truck className="text-purple-600 h-5 w-5" />
              {isArabic ? 'بيانات الشحن' : 'Delivery details'}
            </h3>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">{isArabic ? 'الاسم الكامل *' : 'Full name *'}</label>
              <input type="text" name="name" value={form.name} onChange={handleInputChange}
                placeholder={isArabic ? 'محمد علي' : 'Your full name'}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-purple-300 ${errors.name ? 'border-red-400 bg-red-50' : 'border-stone-200'}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">{isArabic ? 'رقم الهاتف (لبناني) *' : 'Phone (Lebanese) *'}</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleInputChange} dir="ltr"
                placeholder="03 123 456"
                className={`w-full border rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-purple-300 ${errors.phone ? 'border-red-400 bg-red-50' : 'border-stone-200'}`} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* City dropdown */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">{isArabic ? 'المدينة *' : 'City *'}</label>
              <select name="city" value={form.city} onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-purple-300 bg-white ${errors.city ? 'border-red-400 bg-red-50' : 'border-stone-200'}`}>
                <option value="">{isArabic ? '— اختر المدينة —' : '— Select city —'}</option>
                {LEBANESE_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="أخرى">{isArabic ? 'أخرى...' : 'Other...'}</option>
              </select>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">{isArabic ? 'العنوان بالتفصيل *' : 'Full address *'}</label>
              <input type="text" name="address" value={form.address} onChange={handleInputChange}
                placeholder={isArabic ? 'الحي، الشارع، رقم المبنى...' : 'Street, building, floor...'}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-purple-300 ${errors.address ? 'border-red-400 bg-red-50' : 'border-stone-200'}`} />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">{isArabic ? 'ملاحظات (اختياري)' : 'Notes (optional)'}</label>
              <textarea name="notes" value={form.notes} onChange={handleInputChange} rows={2}
                placeholder={isArabic ? 'أي تعليمات للتوصيل...' : 'Any delivery instructions...'}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-4 bg-black text-white font-black text-sm rounded-xl hover:bg-stone-800 transition active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting
                ? <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />{isArabic ? 'جاري الإرسال...' : 'Placing order...'}</>
                : <>{isArabic ? `تأكيد الطلب — $${getCartTotal().toFixed(2)} USD` : `Place order — $${getCartTotal().toFixed(2)} USD`}</>}
            </button>

            <p className="text-center text-[10px] text-stone-400">
              {isArabic ? 'الدفع عند الاستلام — تغليف سري ومحكم' : 'Cash on delivery — fully discreet packaging'}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
