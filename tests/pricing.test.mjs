import test from 'node:test';
import assert from 'node:assert/strict';
import { cartItemKey, cartSubtotal, selectedUnitPrice } from '../src/utils/pricing.ts';

const product = {
  id: 'product-1', price: 25,
  variants: [{ name: 'الحجم', nameEn: 'Size', options: ['Small', 'Large'],
    optionPriceDeltas: { Small: 0, Large: 5 } }],
};

test('selected size changes the displayed unit price and cart subtotal', () => {
  assert.equal(selectedUnitPrice(product, { Size: 'Large' }), 30);
  assert.equal(selectedUnitPrice(product, { Size: 'Small' }), 25);
  assert.equal(cartSubtotal([
    { product, quantity: 2, selectedVariant: { Size: 'Large' } },
    { product, quantity: 1, selectedVariant: { Size: 'Small' } },
  ]), 85);
});

test('cart keys keep sizes separate regardless of option key order', () => {
  assert.notEqual(cartItemKey(product.id, { Size: 'Large' }), cartItemKey(product.id, { Size: 'Small' }));
  assert.equal(cartItemKey(product.id, { Size: 'Large', Color: 'Red' }),
    cartItemKey(product.id, { Color: 'Red', Size: 'Large' }));
});
