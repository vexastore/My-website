import assert from 'node:assert/strict';
import test from 'node:test';
import { orderWhatsAppUrl } from '../src/utils/whatsapp.ts';

const sampleOrder = {
  id: 'ORD-QNGU5VI1D',
  placedAt: '2026-09-16T07:40:00.000Z',
  date: '16/09/2026, 10:40',
  customer: {
    name: 'Charbel', phone: '+961 03 258 963', city: 'Bsharri',
    address: 'Awl shee3 yd2ele', notes: '',
  },
  items: [{
    product: {
      name: 'سدادة شرجية من السيليكون',
      nameEn: 'Silicone Diamond Anal Plug – Medical Silicone',
      price: 10, sku: 'VX-BASE', image: 'https://example.com/product.webp',
      variants: [{ name: 'الحجم', nameEn: 'Size', options: ['S'],
        optionPriceDeltas: { S: 5 }, optionSkus: { S: 'VX-XXXX' } }],
    },
    quantity: 1, selectedVariant: { Size: 'S' },
  }],
  total: 20, deliveryFee: 5,
};

function message(order, locale = 'en') {
  const url = new URL(orderWhatsAppUrl(order, locale));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/96176730767');
  return url.searchParams.get('text');
}

test('English message follows the owner template with option SKU, image link, and totals', () => {
  assert.equal(message(sampleOrder), [
    'New Order — Vexa Toys', '',
    'Order: ORD-QNGU5VI1D',
    'Date: 16/09/2026 — 10:40', '',
    'Customer', 'Name: Charbel', 'Phone: +961 03 258 963',
    'City: Bsharri', 'Address: Awl shee3 yd2ele', 'Notes: —', '',
    'Products', 'Silicone Diamond Anal Plug – Medical Silicone',
    'Size: S · Qty: 1 · $15.00', 'SKU: VX-XXXX',
    'Image: https://example.com/product.webp', '',
    'Order Summary', 'Subtotal: $15.00 USD',
    'Delivery: $5.00 USD', 'Total: $20.00 USD',
  ].join('\n'));
});

test('Arabic message uses matching sections and the same product reference', () => {
  assert.equal(message(sampleOrder, 'ar'), [
    'طلب جديد — Vexa Toys', '',
    'رقم الطلب: ORD-QNGU5VI1D',
    'التاريخ: 16/09/2026 — 10:40', '',
    'العميل', 'الاسم: Charbel', 'الهاتف: +961 03 258 963',
    'المدينة: Bsharri', 'العنوان: Awl shee3 yd2ele', 'الملاحظات: —', '',
    'المنتجات', 'Silicone Diamond Anal Plug – Medical Silicone',
    'الحجم: S · الكمية: 1 · $15.00', 'رمز المنتج: VX-XXXX',
    'الصورة: https://example.com/product.webp', '',
    'ملخص الطلب', 'سعر المنتجات: $15.00 USD',
    'التوصيل: $5.00 USD', 'المجموع: $20.00 USD',
  ].join('\n'));
});

test('multiple products keep separate blocks and unavailable image or SKU is omitted', () => {
  const order = {
    ...sampleOrder,
    items: [...sampleOrder.items, { product: { name: 'Second item', price: 5, image: 'javascript:bad' }, quantity: 2 }],
    total: 30,
  };
  const text = message(order);
  assert.match(text, /Image: https:\/\/example.com\/product.webp\n\nSecond item\nQty: 2 · \$10.00/);
  assert.equal((text.match(/SKU:/g) ?? []).length, 1);
  assert.equal((text.match(/Image:/g) ?? []).length, 1);
  assert.match(text, /Subtotal: \$25.00 USD/);
});

test('product SKU is used when no option SKU exists', () => {
  const order = { ...sampleOrder, items: [{ product: { name: 'Item', price: 5, sku: 'VX-BASE' }, quantity: 1 }], total: 5, deliveryFee: 0 };
  assert.match(message(order), /SKU: VX-BASE/);
});
