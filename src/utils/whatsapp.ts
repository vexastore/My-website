import type { CartItem, Order } from '../types';
import { selectedUnitPrice } from './pricing.ts';

// The public support number is the store's existing WhatsApp destination.
const STORE_WHATSAPP_NUMBER = '96176730767';

function orderDate(order: Order): string {
  const date = order.placedAt ? new Date(order.placedAt) : new Date(order.date);
  if (Number.isNaN(date.getTime())) return order.date;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Beirut', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: string) => parts.find(part => part.type === type)?.value ?? '';
  return `${value('day')}/${value('month')}/${value('year')} — ${value('hour')}:${value('minute')}`;
}

function itemSku(item: CartItem): string | undefined {
  for (const variant of item.product.variants ?? []) {
    const selected = item.selectedVariant?.[variant.nameEn] ?? item.selectedVariant?.[variant.name];
    const sku = selected && variant.optionSkus?.[selected];
    if (sku?.trim()) return sku.trim();
  }
  return item.product.sku?.trim() || undefined;
}

function imageLink(image: string | undefined): string | undefined {
  if (!image) return undefined;
  try {
    const url = new URL(image);
    return url.protocol === 'https:' ? url.href : undefined;
  } catch { return undefined; }
}

function itemLines(item: CartItem, arabic: boolean): string[] {
  const options = Object.entries(item.selectedVariant ?? {});
  const labels = options.map(([key, value]) => `${arabic && key.toLowerCase() === 'size' ? 'الحجم' : key}: ${value}`);
  const quantity = `${arabic ? 'الكمية' : 'Qty'}: ${item.quantity}`;
  const lineTotal = `$${(selectedUnitPrice(item.product, item.selectedVariant) * item.quantity).toFixed(2)}`;
  const sku = itemSku(item);
  const image = imageLink(item.product.image);
  return [
    item.product.nameEn || item.product.name,
    [...labels, quantity, lineTotal].join(' · '),
    ...(sku ? [`${arabic ? 'رمز المنتج' : 'SKU'}: ${sku}`] : []),
    ...(image ? [`${arabic ? 'الصورة' : 'Image'}: ${image}`] : []),
  ];
}

export function orderWhatsAppUrl(order: Order, locale: 'en' | 'ar' = 'en'): string {
  const arabic = locale === 'ar';
  const money = (amount: number) => `$${amount.toFixed(2)} USD`;
  const delivery = order.deliveryFee ?? 0;
  const items = order.items.map(item => itemLines(item, arabic).join('\n')).join('\n\n');
  const message = arabic ? [
    'طلب جديد — Vexa Store', '',
    `رقم الطلب: ${order.id}`,
    `التاريخ: ${orderDate(order)}`, '',
    'العميل',
    `الاسم: ${order.customer.name}`,
    `الهاتف: ${order.customer.phone}`,
    `المدينة: ${order.customer.city}`,
    `العنوان: ${order.customer.address}`,
    `الملاحظات: ${order.customer.notes?.trim() || '—'}`, '',
    'المنتجات', items, '',
    'ملخص الطلب',
    `سعر المنتجات: ${money(order.total - delivery)}`,
    `التوصيل: ${money(delivery)}`,
    `المجموع: ${money(order.total)}`,
  ] : [
    'New Order — Vexa Store', '',
    `Order: ${order.id}`,
    `Date: ${orderDate(order)}`, '',
    'Customer',
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `City: ${order.customer.city}`,
    `Address: ${order.customer.address}`,
    `Notes: ${order.customer.notes?.trim() || '—'}`, '',
    'Products', items, '',
    'Order Summary',
    `Subtotal: ${money(order.total - delivery)}`,
    `Delivery: ${money(delivery)}`,
    `Total: ${money(order.total)}`,
  ];
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message.join('\n'))}`;
}
