import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidOrderAddress, MIN_ORDER_ADDRESS_LENGTH } from '../lib/orderValidation.ts';

test('checkout address validation matches the API minimum', () => {
  assert.equal(MIN_ORDER_ADDRESS_LENGTH, 4);
  assert.equal(isValidOrderAddress('Sss'), false);
  assert.equal(isValidOrderAddress('Ssss'), true);
  assert.equal(isValidOrderAddress('  Main Street  '), true);
});

test('checkout address validation rejects non-strings and oversized input', () => {
  assert.equal(isValidOrderAddress(null), false);
  assert.equal(isValidOrderAddress('x'.repeat(501)), false);
});
