import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const checkout = readFileSync(new URL('../src/components/Checkout.tsx', import.meta.url), 'utf8');

test('checkout uses styled accessible dropdowns instead of native selects', () => {
  assert.doesNotMatch(checkout, /<select\b/);
  assert.match(checkout, /role="combobox"/);
  assert.match(checkout, /role="listbox"/);
  assert.match(checkout, /role="option"/);
  assert.match(checkout, /aria-activedescendant/);
  assert.match(checkout, /Country calling code/);
  assert.match(checkout, /ariaLabel=\{isArabic \? 'المدينة' : 'City'\}/);
});
