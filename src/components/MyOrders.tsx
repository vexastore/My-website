
import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp, ArrowRight, ShoppingBag } from 'lucide-react';
import { Order } from '../types';

const STATUS_CONFIG: Record<Order['status'], { icon: React.ElementType; color: string; bg: string; border: string; label: string; labelEn: string }> = {
  pending:   { icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   label: 'قيد الانتظار', labelEn: 'Pending'   },
  shipping:  { icon: Truck,        color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    label: 'قيد الشحن',    labelEn: 'Shipping'  },
  delivered: { icon: CheckCircle,  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'تم التوصيل',   labelEn: 'Delivered' },
  cancelled: { icon: XCircle,      color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-200',     label: 'ملغى',         labelEn: 'Cancelled' },
};

export const MyOrders: React.FC = () => {
  const { orders, language, setView } = useShop();
  const isArabic = language === 'ar';
  const [expanded, setExpanded] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="h-20 w-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-200 text-stone-400">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">{isArabic ? 'لا يوجد طلبات بعد' : 'No orders yet'}</h2>
        <p className="text-stone-500 text-sm mb-8">{isArabic ? 'طلباتك ستظهر هنا بعد إتمام أول عملية شراء.' : 'Your orders will appear here after your first purchase.'}</p>
        <button onClick={() => setView('shop')}
          className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-stone-800 transition">
          {isArabic ? 'تصفح المنتجات' : 'Browse products'}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => setView('shop')}
          className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition">
          <ArrowRight size={14} className={isArabic ? 'ml-1' : 'mr-1 rotate-180'} />
          {isArabic ? 'المتجر' : 'Shop'}
        </button>
        <h1 className="text-xl font-black text-stone-900 flex items-center gap-2">
          <Package size={20} className="text-purple-600" />
          {isArabic ? 'طلباتي' : 'My Orders'}
        </h1>
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const StatusIcon = cfg.icon;
          const isOpen = expanded === order.id;
          const subtotal = order.total - 5;

          return (
            <div key={order.id} className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                className="w-full p-4 flex items-center gap-3 text-left hover:bg-stone-50 transition"
              >
                <div className={`h-10 w-10 rounded-xl ${cfg.bg} ${cfg.border} border flex items-center justify-center flex-shrink-0`}>
                  <StatusIcon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-stone-900 font-mono">{order.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                      {isArabic ? cfg.label : cfg.labelEn}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{order.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-stone-900">${order.total.toFixed(2)}</p>
                  <p className="text-[10px] text-stone-400">USD</p>
                </div>
                {isOpen
                  ? <ChevronUp size={18} className="text-stone-400 flex-shrink-0" />
                  : <ChevronDown size={18} className="text-stone-400 flex-shrink-0" />}
              </button>

              {isOpen && (
                <div className="border-t border-stone-100 p-4 space-y-4">
                  {/* Items */}
                  <div>
                    <p className="text-xs font-black text-stone-500 uppercase tracking-wide mb-2">{isArabic ? 'المنتجات' : 'Items'}</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                            {item.product.image
                              ? <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" loading="eager" />
                              : <div className="h-full w-full bg-gradient-to-br from-purple-600 to-rose-600 flex items-center justify-center text-white text-xs font-black">V</div>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-stone-800 truncate">
                              {isArabic ? item.product.name : (item.product.nameEn || item.product.name)}
                            </p>
                            {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
                              <p className="text-xs text-purple-600 font-medium">
                                {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                              </p>
                            )}
                            <p className="text-xs text-stone-500">× {item.quantity} — ${(item.product.price * item.quantity).toFixed(2)} USD</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 space-y-1.5">
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>{isArabic ? 'سعر المنتجات' : 'Products'}</span>
                      <span>${subtotal.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>{isArabic ? 'رسوم التوصيل' : 'Delivery fee'}</span>
                      <span>$5.00 USD</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-stone-200">
                      <span>{isArabic ? 'المجموع الكلي' : 'Total'}</span>
                      <span>${order.total.toFixed(2)} USD</span>
                    </div>
                  </div>

                  {/* Delivery info */}
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 space-y-1">
                    <p className="text-xs font-black text-stone-500 uppercase tracking-wide mb-1">{isArabic ? 'معلومات التوصيل' : 'Delivery info'}</p>
                    <p className="text-sm font-bold text-stone-800">{order.customer.name}</p>
                    <p className="text-xs text-stone-600" dir="ltr">{order.customer.phone}</p>
                    <p className="text-xs text-stone-600">{order.customer.city} — {order.customer.address}</p>
                    {order.customer.notes && <p className="text-xs text-stone-500 italic">{order.customer.notes}</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
