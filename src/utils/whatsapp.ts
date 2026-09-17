import type { Order } from '../types';
import { selectedUnitPrice } from './pricing.ts';

// The public support number is the store's existing WhatsApp destination.
const STORE_WHATSAPP_NUMBER = '96176730767';

export function orderWhatsAppUrl(order: Order, locale: 'en' | 'ar' = 'en'): string {
  const arabic = locale === 'ar';
  const items = order.items.map(item => {
    const options = item.selectedVariant && Object.keys(item.selectedVariant).length
      ? ` (${Object.entries(item.selectedVariant).map(([key, value]) => `${key}: ${value}`).join(', ')})`
      : '';
    const name = arabic ? item.product.name : (item.product.nameEn || item.product.name);
    return `• ${name} × ${item.quantity}${options} — $${(selectedUnitPrice(item.product, item.selectedVariant) * item.quantity).toFixed(2)}`;
  }).join('\n');
  const message = arabic ? [
    `طلب جديد من Vexa Store ${order.id}`,
    `الاسم: ${order.customer.name}`,
    `الهاتف: ${order.customer.phone}`,
    `المدينة: ${order.customer.city}`,
    `العنوان: ${order.customer.address}`,
    order.customer.notes ? `ملاحظات: ${order.customer.notes}` : '',
    `المنتجات:\n${items}`,
    `المجموع: $${order.total.toFixed(2)} USD`,
  ] : [
    `New Vexa Store order ${order.id}`,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `City: ${order.customer.city}`,
    `Address: ${order.customer.address}`,
    order.customer.notes ? `Notes: ${order.customer.notes}` : '',
    `Items:\n${items}`,
    `Total: $${order.total.toFixed(2)} USD`,
  ];
  const text = message.filter(Boolean).join('\n\n');
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
