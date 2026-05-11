import React, { useState } from 'react';
  import { useShop } from '../context/ShopContext';
  import {
    Package, Clock, Truck, CheckCircle, XCircle,
    ArrowRight, ShoppingBag, Trash2, MapPin, Phone,
    User, CalendarDays, ReceiptText, AlertTriangle
  } from 'lucide-react';
  import { Order } from '../types';

  const STATUS_CONFIG: Record<Order['status'], {
    icon: React.ElementType; color: string; bg: string;
    border: string; label: string; dot: string;
  }> = {
    pending:   { icon: Clock,        color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   label: 'قيد المراجعة', dot: 'bg-amber-400'   },
    shipping:  { icon: Truck,        color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    label: 'قيد الشحن',    dot: 'bg-blue-400'    },
    delivered: { icon: CheckCircle,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'تم التوصيل',   dot: 'bg-emerald-400' },
    cancelled: { icon: XCircle,      color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     label: 'ملغى',         dot: 'bg-red-400'     },
  };

  export const MyOrders: React.FC = () => {
    const { orders, setView, language, deleteOrderLocally } = useShop();
    const isArabic = language === 'ar';
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const confirmDelete = (orderId: string) => {
      deleteOrderLocally(orderId);
      setDeletingId(null);
    };

    if (orders.length === 0) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center" dir="rtl">
          <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-white/20" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">لا يوجد طلبات بعد</h2>
          <p className="text-white/40 text-sm mb-8 max-w-xs">طلباتك ستظهر هنا بعد إتمام أول عملية شراء.</p>
          <button onClick={() => setView('shop')}
            className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-stone-100 transition active:scale-95">
            تصفح المنتجات
          </button>
        </div>
      );
    }

    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6" dir="rtl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition">
            <ArrowRight size={14} />
            المتجر
          </button>
          <div className="flex items-center gap-2">
            <Package size={20} className="text-purple-400" />
            <h1 className="text-xl font-black text-white">طلباتي</h1>
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </div>
        </div>

        {/* Orders — all fully visible */}
        <div className="space-y-6">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;
            const subtotal = order.total - 5;
            const isConfirmingDelete = deletingId === order.id;

            return (
              <div key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">

                {/* Order header */}
                <div className="px-4 py-4 flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-xl ${cfg.bg} ${cfg.border} border flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon size={20} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-black text-white font-mono tracking-wide">{order.id}</span>
                      <span className={`flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-white/40">
                      <span className="flex items-center gap-1"><CalendarDays size={11} />{order.date}</span>
                      <span>•</span>
                      <span>{order.items.length} منتج</span>
                      <span>•</span>
                      <span className="font-black text-white/60">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Products — always visible */}
                <div className="border-t border-white/10 p-4 space-y-3">
                  <p className="text-[11px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                    <ReceiptText size={12} /> المنتجات المطلوبة
                  </p>

                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3">
                      {/* Large product image */}
                      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-white/5">
                        {item.product.image
                          ? <img src={item.product.image} alt={item.product.name}
                              className="h-full w-full object-cover" loading="eager" />
                          : <div className="h-full w-full bg-gradient-to-br from-purple-700 to-rose-700 flex items-center justify-center text-white text-xl font-black">V</div>
                        }
                      </div>
                      {/* Product info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <p className="text-sm font-black text-white leading-tight mb-1">
                            {isArabic ? item.product.name : (item.product.nameEn || item.product.name)}
                          </p>
                          {item.product.description && (
                            <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 mb-1">
                              {isArabic ? item.product.description : (item.product.descriptionEn || item.product.description)}
                            </p>
                          )}
                          {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
                            <p className="text-[11px] text-purple-400 font-bold">
                              {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-white/40 font-bold">
                            الكمية: <span className="text-white/70">{item.quantity}</span>
                          </span>
                          <span className="text-base font-black text-white">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price summary */}
                <div className="px-4 pb-3">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-white/50">
                      <span>المنتجات</span>
                      <span>${subtotal.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/50">
                      <span className="flex items-center gap-1"><Truck size={13} /> رسوم التوصيل</span>
                      <span>$5.00 USD</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="font-black text-white">المجموع الكلي</span>
                      <span className="text-lg font-black text-purple-300">${order.total.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="px-4 pb-3">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 space-y-2.5">
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-widest">معلومات التوصيل</p>
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-white/30 flex-shrink-0" />
                      <span className="font-bold text-white">{order.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" dir="ltr">
                      <Phone size={14} className="text-white/30 flex-shrink-0" />
                      <span className="text-white/70 font-bold">{order.customer.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={14} className="text-white/30 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70">{order.customer.city} — {order.customer.address}</span>
                    </div>
                    {order.customer.notes && (
                      <p className="text-xs text-white/40 italic pr-5">{order.customer.notes}</p>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <div className="px-4 pb-4">
                  {isConfirmingDelete ? (
                    <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle size={16} />
                        <p className="text-sm font-black">هل تريد حذف هذا الطلب من سجلاتك؟</p>
                      </div>
                      <p className="text-xs text-white/40">سيُحذف الطلب من جهازك فقط. لن يؤثر هذا على طلبك الفعلي.</p>
                      <div className="flex gap-2">
                        <button onClick={() => confirmDelete(order.id)}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs transition active:scale-95">
                          نعم، احذف
                        </button>
                        <button onClick={() => setDeletingId(null)}
                          className="flex-1 py-2 border border-white/15 text-white/60 hover:text-white font-black rounded-xl text-xs transition">
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setDeletingId(order.id)}
                      className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-red-500/30 text-white/30 hover:text-red-400 py-2.5 rounded-xl text-xs font-bold transition">
                      <Trash2 size={14} />
                      حذف هذا الطلب من سجلاتي
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  