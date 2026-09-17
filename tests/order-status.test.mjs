import assert from 'node:assert/strict';
import test from 'node:test';
import { isOrderStatus, isStorefrontReference, matchingOrderStatuses, mergeOrderStatuses } from '../src/utils/order-status.ts';

const receipt = (id, status) => ({ id, status, customer: { phone: '+961 03 258 963' }, items: [], total: 0 });

test('a confirmed database status replaces the cached pending receipt', () => {
  const orders = [receipt('VX-ABCDEF123456', 'pending'), receipt('VX-111111111111', 'shipping')];
  const updated = mergeOrderStatuses(orders, [
    { reference: 'VX-ABCDEF123456', status: 'confirmed' },
  ]);
  assert.equal(updated[0].status, 'confirmed');
  assert.equal(updated[1].status, 'shipping');
  assert.equal(orders[0].status, 'pending');
});

test('unknown statuses and unrelated references cannot change a receipt', () => {
  const orders = [receipt('VX-ABCDEF123456', 'pending')];
  assert.equal(mergeOrderStatuses(orders, [
    { reference: 'VX-ABCDEF123456', status: 'admin' },
    { reference: 'VX-000000000000', status: 'delivered' },
  ]), orders);
  assert.equal(isOrderStatus('confirmed'), true);
  assert.equal(isOrderStatus('admin'), false);
});

test('only storefront reference format is eligible for a status lookup', () => {
  assert.equal(isStorefrontReference('VX-ABCDEF123456'), true);
  assert.equal(isStorefrontReference('ORD-QNGU5VI1D'), false);
  assert.equal(isStorefrontReference('VX-ABCDEF12345Z'), false);
});

test('status lookup reveals no status when the saved phone does not match', () => {
  const rows = [{ reference: 'VX-ABCDEF123456', customer_phone: '+961 03 258 963', status: 'confirmed' }];
  assert.deepEqual(matchingOrderStatuses(rows, new Map([['VX-ABCDEF123456', 'wrong phone']])), []);
  assert.deepEqual(matchingOrderStatuses(rows, new Map([['VX-ABCDEF123456', '+961 03 258 963']])), [
    { reference: 'VX-ABCDEF123456', status: 'confirmed' },
  ]);
});
