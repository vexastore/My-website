import assert from 'node:assert/strict';
import test from 'node:test';
import { orderWhatsAppUrl } from '../src/utils/whatsapp.ts';

test('the saved order opens the store chat with readable details', () => {
  const url = new URL(orderWhatsAppUrl({
    id: 'ORD-123',
    customer: { name: 'A & B', phone: '+961 03 123 456', city: 'Beirut', address: 'Street 1', notes: 'Call first' },
    items: [{ product: { name: 'Toy', price: 12.5 }, quantity: 2, selectedVariant: { Size: 'Large' } }],
    total: 28,
  }));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/96176730767');
  const message = url.searchParams.get('text');
  assert.match(message, /ORD-123/);
  assert.match(message, /A & B/);
  assert.match(message, /Size: Large/);
  assert.match(message, /Total: \$28\.00 USD/);
  assert.doesNotMatch(message, /<b>|&amp;/);
});

test('optional notes and variants can be omitted', () => {
  const url = new URL(orderWhatsAppUrl({
    id: 'ORD-456', customer: { name: 'Buyer', phone: '12345', city: 'Tripoli', address: 'Street 2', notes: '' },
    items: [{ product: { name: 'Item', price: 5 }, quantity: 1 }], total: 5,
  }));
  const message = url.searchParams.get('text');
  assert.doesNotMatch(message, /Notes:/);
  assert.match(message, /Item × 1/);
});

test('Arabic checkout produces an Arabic order message', () => {
  const url = new URL(orderWhatsAppUrl({
    id: 'ORD-789', customer: { name: 'ليلى', phone: '12345', city: 'بيروت', address: 'شارع', notes: '' },
    items: [{ product: { name: 'منتج', price: 5 }, quantity: 1 }], total: 5,
  }, 'ar'));
  assert.match(url.searchParams.get('text'), /المنتجات:\n• منتج × 1/);
});

test('selected size prices are included in the WhatsApp summary', () => {
  const url = new URL(orderWhatsAppUrl({
    id: 'VX-123', customer: { name: 'Buyer', phone: '12345', city: 'Beirut', address: 'Street 2' },
    items: [{ product: { name: 'Item', price: 10, variants: [{ nameEn: 'Size', options: ['Large'], optionPriceDeltas: { Large: 5 } }] }, quantity: 2, selectedVariant: { Size: 'Large' } }],
    total: 30,
  }));
  assert.match(url.searchParams.get('text'), /Item × 2 \(Size: Large\) — \$30\.00/);
});
