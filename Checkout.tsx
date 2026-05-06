import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CustomerInfo, Order } from '../types';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, Truck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const Checkout: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
    placeOrder,
    setView
  } = useShop();

  const [form, setForm] = useState<CustomerInfo>({
    name: '',
    phone: '',
    city: '',
    address: '',
    notes: ''
  });

  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!form.name.trim()) newErrors.name = 'الإسم بالكامل مطلوب لطباعة الفاتورة والبوليسة.';
    if (!form.phone.trim()) {
      newErrors.phone = 'رقم الجوال مطلوب للتأكيد وخدمة التوصيل.';
    } else if (!/^(\+?\d{8,15})$/.test(form.phone.trim().replace(/\s/g, ''))) {
      newErrors.phone = 'يرجى إدخال رقم جوال صحيح (مثال: 0501234567).';
    }
    if (!form.city.trim()) newErrors.city = 'يرجى اختيار أو كتابة المدينة.';
    if (!form.address.trim()) newErrors.address = 'يرجى كتابة العنوان بالتفصيل (الحي، الشارع، رقم المبنى).';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (validateForm()) {
      setIsSubmitting(true);
      
      // Generate a temporary order object to send to the sheet
      const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const total = getCartTotal();
      const itemsString = cart.map(item => `${item.product.name} (عدد: ${item.quantity})`).join(' | ');
      
      const orderData = {
        orderId: orderId,
        date: new Date().toLocaleString('ar-EG'),
        customerName: form.name,
        customerPhone: form.phone,
        customerCity: form.city,
        customerAddress: form.address,
        customerNotes: form.notes || 'لا يوجد',
        products: itemsString,
        totalPrice: total + ' USD',
        status: 'جديد'
      };

      try {
        // REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-VEXA_STORE_PLACEHOLDER_URL/exec';
        
        // We use 'no-cors' mode because Google Script redirects can cause CORS issues in browsers,
        // but the data still successfully reaches the Google Sheet!
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });

        // Small delay for natural feel
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.error('Error submitting order to sheet:', error);
        // We don't block the user if the network fails. We still place the order locally!
      } finally {
        // Now finalize the order in our application state
        const placed = placeOrder(form);
        setIsSubmitting(false);
        if (placed) {
          // Sync ID if possible, but placeOrder generates its own. We just show success screen
          setOrderComplete(placed);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof CustomerInfo]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // If cart is empty and no order completed, show empty state
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8" dir="rtl">
        <div className="h-20 w-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-200 text-stone-400">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">سلة مشترياتك فارغة!</h2>
        <p className="text-stone-500 text-sm max-w-sm mx-auto mb-8">
          يبدو أنك لم تقم بإضافة أي منتج إلى سلة مشترياتك بعد. تصفح أقسامنا المميزة واختر ما يناسبك.
        </p>
        <button
          onClick={() => setView('shop')}
          className="px-6 py-3 bg-gradient-to-r from-purple-700 to-rose-600 hover:from-purple-800 hover:to-rose-700 text-white font-bold rounded-lg shadow-md transition"
        >
          تصفح المنتجات الآن
        </button>
      </div>
    );
  }

  // If order successfully placed, show Confirmation Screen
  if (orderComplete) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8" dir="rtl">
        <div className="bg-white border border-emerald-100 shadow-lg rounded-2xl p-6 sm:p-8">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-800 mb-2">تم استلام طلبك بنجاح!</h2>
          <p className="text-emerald-700 font-medium text-sm mb-6 bg-emerald-50 py-1.5 px-3 rounded-full inline-block">
            رقم الطلب: {orderComplete.id}
          </p>

          <div className="text-right border-t border-b border-stone-100 py-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">اسم المستلم:</span>
              <span className="font-bold text-stone-800">{orderComplete.customer.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">رقم الجوال:</span>
              <span className="font-bold text-stone-800" dir="ltr">{orderComplete.customer.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">العنوان:</span>
              <span className="font-bold text-stone-800">{orderComplete.customer.city}، {orderComplete.customer.address}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-dashed border-stone-200 mt-2">
              <span className="font-bold text-stone-700">المجموع النهائي (الدفع عند الاستلام):</span>
              <span className="font-extrabold text-purple-700 text-base">${orderComplete.total.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 mb-6 flex items-start gap-3 border border-stone-200 text-right">
            <Truck className="text-purple-600 h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-stone-800">ما الخطوة التالية؟</h4>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                سيقوم فريق الدعم الفني بمراجعة طلبك وتجهيزه وتغليفه **بتغليف سري ومحكم بالكامل** خالٍ من أي شعارات أو معلومات تدل على المحتوى. سيتم الاتصال بك من قبل مندوب شركة الشحن خلال 24 - 48 ساعة للتنسيق وتوصيل الشحنة لباب منزلك.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setOrderComplete(null);
              setView('shop');
            }}
            className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-rose-600 hover:from-purple-800 hover:to-rose-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-purple-500/20 mb-3 active:scale-[0.98]"
          >
            <ArrowRight size={16} />
            العودة للمتجر والتسوق مجدداً
          </button>
        </div>
      </div>
    );
  }

  // Normal Checkout & Cart View
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" dir="rtl">
      <div className="mb-6">
        <button
          onClick={() => setView('shop')}
          className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition"
        >
          <ArrowRight size={14} className="ml-1" /> العودة لمواصلة التسوق
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT COLUMN: Products Review (Cart) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-black text-stone-800 mb-4 pb-3 border-b border-stone-100 flex items-center gap-2">
              <ShoppingBag className="text-purple-600 h-5 w-5" />
              مراجعة المنتجات في سلتك ({getCartItemsCount()} منتجات)
            </h2>

            <div className="divide-y divide-stone-100">
              {cart.map((item) => (
                <div key={item.product.id} className="py-4 flex items-center gap-4 first:pt-0">
                  {/* Image */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-150 flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-800 text-xs sm:text-sm line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] font-medium text-purple-600 mt-0.5">{item.product.category}</p>
                    <div className="text-xs font-extrabold text-stone-700 mt-1">
                      ${item.product.price.toFixed(2)} USD <span className="text-[10px] font-normal text-stone-400">للقطعة</span>
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-r-lg border-l border-stone-200 transition"
                      >
                        <Minus size={14} />
                      </button>
                      
                      <span className="px-3 text-xs font-bold text-stone-800 min-w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-l-lg border-r border-stone-200 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="حذف من السلة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="border-t border-stone-200 mt-4 pt-4 flex items-center justify-between">
              <span className="text-sm font-bold text-stone-500">المجموع الإجمالي:</span>
              <span className="text-xl font-black bg-gradient-to-r from-purple-700 to-rose-600 bg-clip-text text-transparent">
                ${getCartTotal().toFixed(2)} USD
              </span>
            </div>
            
            <div className="text-left">
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                + شحن مجاني وتغليف سري لجميع الطلبات
              </span>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Customer & Payment Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-stone-800 flex items-center gap-2 pb-3 border-b border-stone-100">
              <Truck className="text-purple-600 h-5 w-5" />
              بيانات العميل ومكان الشحن
            </h3>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">الإسم بالكامل *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="مثال: محمد أحمد العتيبي"
                className={`w-full px-3 py-2 text-sm border bg-stone-50 focus:bg-white rounded-lg focus:outline-none focus:border-purple-500 transition ${
                  errors.name ? 'border-red-300 bg-red-50/10' : 'border-stone-200'
                }`}
              />
              {errors.name && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><AlertTriangle size={12} /> {errors.name}</p>}
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">رقم الجوال *</label>
              <input
                type="text"
                name="phone"
                dir="ltr"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="050XXXXXXXX"
                className={`w-full px-3 py-2 text-sm border bg-stone-50 focus:bg-white rounded-lg focus:outline-none focus:border-purple-500 text-right transition ${
                  errors.phone ? 'border-red-300 bg-red-50/10' : 'border-stone-200'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><AlertTriangle size={12} /> {errors.phone}</p>}
              <p className="text-[10px] text-stone-400 mt-0.5">هام جداً للتنسيق المسبق وتوصيل الشحنة لبابك.</p>
            </div>

            {/* City Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">المدينة *</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleInputChange}
                placeholder="مثال: الرياض، جدة، الدمام..."
                className={`w-full px-3 py-2 text-sm border bg-stone-50 focus:bg-white rounded-lg focus:outline-none focus:border-purple-500 transition ${
                  errors.city ? 'border-red-300 bg-red-50/10' : 'border-stone-200'
                }`}
              />
              {errors.city && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><AlertTriangle size={12} /> {errors.city}</p>}
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">العنوان بالتفصيل *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleInputChange}
                rows={2}
                placeholder="مثال: حي النرجس، شارع العليا، فيلا رقم 14 (أو شقة رقم 3)"
                className={`w-full px-3 py-2 text-sm border bg-stone-50 focus:bg-white rounded-lg focus:outline-none focus:border-purple-500 transition resize-none ${
                  errors.address ? 'border-red-300 bg-red-50/10' : 'border-stone-200'
                }`}
              />
              {errors.address && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><AlertTriangle size={12} /> {errors.address}</p>}
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">ملاحظات إضافية للمندوب (اختياري)</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleInputChange}
                rows={2}
                placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة، أو تسليم الشحنة عند الباب..."
                className="w-full px-3 py-2 text-sm border border-stone-200 bg-stone-50 focus:bg-white rounded-lg focus:outline-none focus:border-purple-500 transition resize-none"
              />
            </div>

            {/* Strictly Cash on Delivery Payment Display */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
              <CreditCard className="text-amber-600 h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-800">الدفع عند الاستلام فقط (COD)</h4>
                <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                  **لا يوجد دفع إلكتروني بالموقع.** لضمان أمانكم وثقتكم التامة، ستدفع قيمة طلبك فقط **نقداً أو ببطاقة مدى** لمندوب التوصيل يداً بيد عند استلام شحنتك المغلقة أمام باب بيتك. لا توجد أي رسوم إضافية مخفية!
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 text-white font-bold rounded-lg shadow-lg transition flex items-center justify-center gap-2 text-sm ${
                isSubmitting
                  ? 'bg-stone-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-purple-700 to-rose-600 hover:from-purple-800 hover:to-rose-700 hover:shadow-purple-500/20 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري إرسال طلبك السرّي بأمان...
                </>
              ) : (
                <>
                  تأكيد الطلب - الدفع ${getCartTotal().toFixed(2)} USD عند الاستلام
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
