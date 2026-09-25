
import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { CustomerInfo, Order } from '../types';
import { selectedUnitPrice } from '../utils/pricing';
import { Trash2, Plus, Minus, ShoppingBag, Truck, CheckCircle2, ArrowRight, Zap, ChevronDown } from 'lucide-react';
import { orderWhatsAppUrl } from '../utils/whatsapp';
import { MIN_ORDER_ADDRESS_LENGTH } from '@/lib/orderValidation';

// Synchronous guard, prevents double-submissions caused by React's async state
// batching. Two rapid taps can both see isSubmitting===false before the first
// setIsSubmitting(true) re-render lands, so we need a ref that updates instantly.
const _submitting = { current: false };

const LEBANESE_CITIES_AR = [
  'بيروت', 'طرابلس', 'صيدا', 'صور', 'جونية', 'زحلة', 'النبطية', 'بعلبك', 'جبيل', 'عاليه',
  'بشري', 'بنت جبيل', 'مرجعيون', 'كسروان', 'راشيا', 'الشوف', 'المتن', 'بعبدا', 'الضاحية الجنوبية'
];
const LEBANESE_CITIES_EN = [
  'Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Jounieh', 'Zahle', 'Nabatieh', 'Baalbek', 'Byblos', 'Aley',
  'Bcharre', 'Bint Jbeil', 'Marjayoun', 'Kesrwan', 'Rashaya', 'Chouf', 'Metn', 'Baabda', 'South Suburb'
];

const COUNTRY_CODES = [
  { code: '+961', flag: '🇱🇧', label: 'Lebanon' },
  { code: '+1', flag: '🇺🇸', label: 'USA/Canada' },
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+971', flag: '🇦🇪', label: 'UAE' },
  { code: '+966', flag: '🇸🇦', label: 'Saudi Arabia' },
  { code: '+962', flag: '🇯🇴', label: 'Jordan' },
  { code: '+965', flag: '🇰🇼', label: 'Kuwait' },
  { code: '+974', flag: '🇶🇦', label: 'Qatar' },
  { code: '+970', flag: '🇵🇸', label: 'Palestine' },
  { code: '+963', flag: '🇸🇾', label: 'Syria' },
  { code: '+20', flag: '🇪🇬', label: 'Egypt' },
  { code: '+49', flag: '🇩🇪', label: 'Germany' },
  { code: '+33', flag: '🇫🇷', label: 'France' },
  { code: '+61', flag: '🇦🇺', label: 'Australia' },
];

export const Checkout: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, getDeliveryFee, getCartItemsCount, placeOrder, setView, language } = useShop();
  const isArabic = language === 'ar';
  const deliveryFee = getDeliveryFee();

  const [form, setForm] = useState<CustomerInfo & { countryCode: string }>({
    name: '', phone: '', countryCode: '+961', city: '', address: '', notes: ''
  });
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationBanner, setValidationBanner] = useState<string | null>(null);

  // Refs for scrolling to the first invalid field on mobile
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLSelectElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!form.name.trim()) newErrors.name = isArabic ? 'الاسم الكامل مطلوب.' : 'Full name is required.';
    if (!form.phone.trim()) {
      newErrors.phone = isArabic ? 'رقم الهاتف مطلوب.' : 'Phone number is required.';
    } else if (!/^[\d\s\-]{5,15}$/.test(form.phone.trim())) {
      newErrors.phone = isArabic ? 'رقم الهاتف غير صحيح.' : 'Invalid phone number.';
    }
    if (!form.city.trim()) newErrors.city = isArabic ? 'يرجى اختيار المدينة.' : 'Please select a city.';
    if (form.address.trim().length < MIN_ORDER_ADDRESS_LENGTH) {
      newErrors.address = isArabic
        ? `يرجى كتابة عنوان من ${MIN_ORDER_ADDRESS_LENGTH} أحرف على الأقل.`
        : `Address must be at least ${MIN_ORDER_ADDRESS_LENGTH} characters.`;
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to + focus the FIRST invalid field so mobile users see the error
      // even when it's above the fold (e.g. name field scrolled off screen).
      const firstRef =
        newErrors.name ? nameRef :
        newErrors.phone ? phoneRef :
        newErrors.city ? cityRef :
        newErrors.address ? addressRef : null;
      if (firstRef?.current) {
        firstRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => firstRef.current?.focus(), 350);
      }
      setValidationBanner(
        isArabic
          ? '⚠️ يرجى تعبئة جميع الحقول الإلزامية المُشار إليها بالأحمر أعلاه.'
          : '⚠️ Please fill in the required fields highlighted above.'
      );
      return false;
    }
    setValidationBanner(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (_submitting.current || isSubmitting || !validateForm()) return;
    _submitting.current = true;
    setValidationBanner(null);
    setIsSubmitting(true);

    // ── WHY this await exists ──────────────────────────────────────────────
    // React 18 automatic batching: when everything below is synchronous,
    // setIsSubmitting(true) and setIsSubmitting(false) are batched into the
    // SAME render, so the spinner never appears and the button looks frozen.
    // A zero-delay setTimeout creates a microtask boundary that forces React
    // to flush setIsSubmitting(true) first, render the spinner, then continue.
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const fullPhone = `${form.countryCode} ${form.phone}`.trim();

      const customerInfo: CustomerInfo = {
        name: form.name,
        phone: fullPhone,
        countryCode: form.countryCode,
        city: form.city,
        address: form.address,
        notes: form.notes,
      };

      // The WhatsApp action is available only after Supabase confirms the order.
      const placed = await placeOrder(customerInfo);
      if (!placed) return; // cart was empty, guard only, shouldn't happen
      setOrderComplete(placed);
      if (!placed.isTestOrder) {
        try { window.location.assign(orderWhatsAppUrl(placed, language)); } catch { /* The fallback link stays on the receipt. */ }
      }
    } catch (error) {
      console.error('[Checkout] order save failed:', error);
      const unavailableItem = error instanceof Error && error.message === 'An item or customer detail is invalid or unavailable';
      setValidationBanner(unavailableItem
        ? (isArabic
            ? 'أحد المنتجات أو الخيارات لم يعد متاحاً. يرجى تحديث السلة والمحاولة مجدداً.'
            : 'An item or option is no longer available. Please refresh your cart and try again.')
        : (isArabic
            ? 'تعذر حفظ الطلب. لم يتم إرسال رسالة. يرجى المحاولة مجدداً.'
            : 'Could not save your order. No message was sent. Please try again.'));
    } finally {
      // Guarantees spinner stops even if something throws unexpectedly.
      _submitting.current = false;
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="bg-black text-white mx-auto w-full max-w-7xl px-4 py-14 text-center sm:px-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="h-20 w-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-white/30">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{isArabic ? 'سلتك فارغة!' : 'Your cart is empty!'}</h2>
        <p className="text-white/50 text-sm max-w-sm mx-auto mb-8">{isArabic ? 'لم تضف أي منتجات بعد.' : 'You have not added any products yet.'}</p>
        <button onClick={() => setView('shop')} className="px-6 py-3 bg-[#ff2d78] text-white font-black rounded-xl transition hover:bg-[#e11d48]">
          {isArabic ? 'تصفح المنتجات' : 'Browse products'}
        </button>
      </div>
    );
  }

  if (orderComplete) {
    const subtotal = orderComplete.total - (orderComplete.deliveryFee ?? deliveryFee);
    return (
      <div className="bg-black text-white mx-auto w-full max-w-2xl px-4 py-12 text-center sm:px-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            {orderComplete.isTestOrder ? (isArabic ? 'محاكاة طلب محلي' : 'Local checkout simulation') : (isArabic ? 'تم استلام طلبك بنجاح!' : 'Order placed successfully!')}
          </h2>
          <p className="text-emerald-400 font-medium text-sm mb-4 bg-emerald-500/10 border border-emerald-500/30 py-1.5 px-3 rounded-full inline-block">
            {isArabic ? 'رقم الطلب:' : 'Order ID:'} {orderComplete.id}
          </p>
          <p className="text-sm text-white/60 mb-4" role={orderComplete.isTestOrder ? 'alert' : undefined}>
            {orderComplete.isTestOrder
              ? (isArabic ? 'هذا اختبار محلي فقط. لم يُحفظ الطلب في قاعدة البيانات، ولن يظهر في لوحة الإدارة أو يفتح واتساب. سلتك محفوظة.' : 'This was a local mock test. No order was saved in Supabase or the admin, WhatsApp will not open, and your cart is still available.')
              : (isArabic ? 'تم حفظ الطلب. سيتم فتح واتساب برسالة جاهزة؛ اضغط إرسال داخل واتساب لمشاركتها مع المتجر.' : 'Your order is saved. WhatsApp will open with a prepared message; tap Send there to share it with the store.')}
          </p>
          {!orderComplete.isTestOrder && <a href={orderWhatsAppUrl(orderComplete, language)} target="_blank" rel="noopener noreferrer"
            className="w-full mb-5 py-3.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isArabic ? 'فتح واتساب مجدداً' : 'Open WhatsApp again'}
          </a>}

          <div className="flex items-center justify-center gap-2 mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 mx-auto max-w-xs">
            <Zap size={15} className="text-emerald-400 flex-shrink-0" />
            <p className="text-xs font-black text-emerald-300">
              {isArabic ? 'توصيل في نفس اليوم في بيروت' : 'Same day delivery in Beirut'}
            </p>
          </div>


          <div className="text-right border-t border-b border-white/10 py-4 mb-6 space-y-3">
            {orderComplete.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                  {item.product.image
                    ? <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    : <div className="h-full w-full bg-gradient-to-br from-purple-600 to-rose-600 flex items-center justify-center text-white text-xs font-black">V</div>
                  }
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold text-white">{isArabic ? item.product.name : (item.product.nameEn || item.product.name)}</p>
                  <p className="text-xs text-white/50">× {item.quantity}, ${(selectedUnitPrice(item.product, item.selectedVariant) * item.quantity).toFixed(2)} USD</p>
                </div>
              </div>
            ))}
            <div className="space-y-1.5 pt-3 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">{isArabic ? 'سعر المنتجات' : 'Products'}</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">{isArabic ? 'رسوم التوصيل' : 'Delivery'}</span>
                <span className="font-bold text-white">${deliveryFee.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-white/10">
                <span className="font-black text-white/50">{isArabic ? 'المجموع:' : 'Total:'}</span>
                <span className="font-black text-[#ff2d78] text-lg">${orderComplete.total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6 flex items-start gap-3 text-right">
            <Truck className="text-white/50 h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-white/50 leading-relaxed">
              {isArabic
                ? 'سيتواصل معك فريقنا خلال ساعات لتنسيق التوصيل. تغليف سري بالكامل وبدون اسم المحتوى.'
                : 'Our team will contact you within hours to coordinate delivery. Fully discreet packaging.'}
            </p>
          </div>

          <button onClick={() => { setOrderComplete(null); setView('shop'); }}
            className="w-full py-3.5 bg-white text-black font-black rounded-xl hover:bg-stone-100 flex items-center justify-center gap-2 active:scale-[0.98] transition">
            <ArrowRight size={16} />
            {isArabic ? 'العودة للمتجر' : 'Back to shop'}
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;
  const selectedCountry = COUNTRY_CODES.find(c => c.code === form.countryCode) || COUNTRY_CODES[0];

  return (
    <div className="bg-black text-white mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <button onClick={() => setView('shop')}
          className="text-xs font-bold text-white/60 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-xl transition">
          <ArrowRight size={14} className={isArabic ? '' : 'rotate-180'} />
          {isArabic ? 'العودة للتسوق' : 'Continue shopping'}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5">
        <Zap size={15} className="text-emerald-400 flex-shrink-0" />
        <p className="text-xs font-black text-emerald-400">
          {isArabic ? 'توصيل في نفس اليوم في بيروت' : 'Same day delivery in Beirut'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg font-black text-white mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
              <ShoppingBag className="text-white h-5 w-5" />
              {isArabic ? `السلة (${getCartItemsCount()})` : `Cart (${getCartItemsCount()})`}
            </h2>
            <div className="divide-y divide-white/10">
              {cart.map(item => (
                <div key={item.product.id + JSON.stringify(item.selectedVariant)} className="py-4 flex items-center gap-4 first:pt-0">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                    {item.product.image
                      ? <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      : <div className="h-full w-full bg-gradient-to-br from-purple-600 to-rose-600 flex items-center justify-center text-white font-black text-sm">V</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-2">
                      {isArabic ? item.product.name : (item.product.nameEn || item.product.name)}
                    </h4>
                    {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
                      <p className="text-[10px] font-bold text-[#ff2d78] mt-0.5">
                        {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                      </p>
                    )}
                    <div className="text-xs font-extrabold text-white/80 mt-1">${selectedUnitPrice(item.product, item.selectedVariant).toFixed(2)} USD</div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                    <div className="flex items-center border border-white/20 rounded-lg bg-transparent">
                      <button type="button" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                        className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-r-lg border-l border-white/20 transition">
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-xs font-bold text-white min-w-6 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                        className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-l-lg border-r border-white/20 transition">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">{isArabic ? 'سعر المنتجات:' : 'Products:'}</span>
                <span className="text-sm font-bold text-white">${subtotal.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50 flex items-center gap-1">
                  <Truck size={13} className="text-white/50" />
                  {isArabic ? 'رسوم التوصيل:' : 'Delivery:'}
                </span>
                <span className="text-sm font-bold text-white">${deliveryFee.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-base font-black text-white/50">{isArabic ? 'المجموع:' : 'Total:'}</span>
                <span className="text-2xl font-black text-white">${total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Truck className="text-white h-5 w-5" />
              {isArabic ? 'بيانات الشحن' : 'Delivery details'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">{isArabic ? 'الاسم الكامل *' : 'Full name *'}</label>
              <input ref={nameRef} type="text" name="name" value={form.name} onChange={handleInputChange}
                placeholder={isArabic ? 'اسمك الكامل' : 'Your full name'}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#ff2d78] focus:border-[#ff2d78] transition ${errors.name ? 'border-red-500/60 bg-red-500/10' : 'border-white/15 bg-white/5'}`} />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">{isArabic ? 'رقم الهاتف *' : 'Phone number *'}</label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleInputChange}
                    className="appearance-none h-full border border-white/15 rounded-xl pl-3 pr-7 py-3 text-sm text-white bg-white/5 outline-none focus:ring-1 focus:ring-[#ff2d78] focus:border-[#ff2d78] min-w-[90px] cursor-pointer transition"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
                <input ref={phoneRef} type="tel" name="phone" value={form.phone} onChange={handleInputChange} dir="ltr"
                  placeholder={form.countryCode === '+961' ? '03 123 456' : '555 1234'}
                  className={`flex-1 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#ff2d78] focus:border-[#ff2d78] transition ${errors.phone ? 'border-red-500/60 bg-red-500/10' : 'border-white/15 bg-white/5'}`} />
              </div>
              <p className="text-[10px] text-white/40 mt-1">
                {isArabic ? `الرقم الكامل: ${selectedCountry.flag} ${form.countryCode} ${form.phone}` : `Full number: ${selectedCountry.flag} ${form.countryCode} ${form.phone}`}
              </p>
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">{isArabic ? 'المدينة *' : 'City *'}</label>
              <select ref={cityRef} name="city" value={form.city} onChange={handleInputChange}
                className={`appearance-none w-full border rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#ff2d78] focus:border-[#ff2d78] transition ${errors.city ? 'border-red-500/60 bg-red-500/10' : 'border-white/15 bg-white/5'}`}>
                <option value="">{isArabic ? '- اختر المدينة -' : '- Select city -'}</option>
                {(isArabic ? LEBANESE_CITIES_AR : LEBANESE_CITIES_EN).map((city, idx) => { const val = LEBANESE_CITIES_AR[idx]; return <option key={val} value={val}>{city}</option>; })}
                <option value="أخرى">{isArabic ? 'أخرى...' : 'Other...'}</option>
              </select>
              {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">{isArabic ? 'العنوان بالتفصيل *' : 'Full address *'}</label>
              <input ref={addressRef} type="text" name="address" value={form.address} onChange={handleInputChange}
                placeholder={isArabic ? 'الحي، الشارع، رقم المبنى...' : 'Street, building, floor...'}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#ff2d78] focus:border-[#ff2d78] transition ${errors.address ? 'border-red-500/60 bg-red-500/10' : 'border-white/15 bg-white/5'}`} />
              {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">{isArabic ? 'ملاحظات (اختياري)' : 'Notes (optional)'}</label>
              <textarea name="notes" value={form.notes} onChange={handleInputChange} rows={2}
                placeholder={isArabic ? 'أي تعليمات للتوصيل...' : 'Any delivery instructions...'}
                className="w-full border border-white/15 bg-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#ff2d78] focus:border-[#ff2d78] resize-none transition" />
            </div>

            {/* Validation banner, appears above the button when required fields are missing.
                This ensures mobile users who have scrolled down past the name/phone fields
                get visible feedback right next to the button they just tapped. */}
            {validationBanner && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-300 text-center">
                {validationBanner}
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full py-4 bg-[#ff2d78] hover:bg-[#e11d48] text-white font-black text-sm rounded-xl transition active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting
                ? <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />{isArabic ? 'جاري الإرسال...' : 'Placing order...'}</>
                : <>{isArabic ? `تأكيد الطلب, $${total.toFixed(2)} USD` : `Place order, $${total.toFixed(2)} USD`}</>}
            </button>

            <p className="text-center text-[10px] text-white/30">
              {isArabic ? 'الدفع عند الاستلام, تغليف سري ومحكم' : 'Cash on delivery, fully discreet packaging'}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
