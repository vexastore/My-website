import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const PRODUCT_LIST_PATH = path.resolve('src/components/ProductList.tsx');
const SHOP_CONTEXT_PATH = path.resolve('src/context/ShopContext.tsx');

test('ProductList replaces native select with custom styled dropdown', () => {
  const code = fs.readFileSync(PRODUCT_LIST_PATH, 'utf8');

  // Verify that the native select element is no longer used for the category selector
  assert.equal(
    code.includes('<select'),
    false,
    'ProductList should not use native <select> elements which trigger OS picker wheels on mobile'
  );

  // Verify accessible combobox/listbox attributes
  assert.ok(code.includes('role="combobox"'), 'Custom category dropdown should have role="combobox"');
  assert.ok(code.includes('aria-haspopup="listbox"'), 'Custom category dropdown should declare aria-haspopup="listbox"');
  assert.ok(code.includes('role="listbox"'), 'Dropdown popover should have role="listbox"');
  assert.ok(code.includes('role="option"'), 'Dropdown items should have role="option"');
  assert.ok(code.includes('isCategoryDropdownOpen'), 'Dropdown state should track open/close');
  assert.ok(code.includes('categoryDropdownRef'), 'Dropdown should have ref for click-outside dismissal');
});

test('ProductList scrolls to products when a category is selected and has scroll-margin', () => {
  const code = fs.readFileSync(PRODUCT_LIST_PATH, 'utf8');

  // Verify products-grid has scroll-mt to prevent being obscured by sticky navbar
  assert.ok(
    code.includes('id="products-grid"') && code.includes('scroll-mt-'),
    'products-grid section must define scroll-mt to account for the sticky header height'
  );

  // Verify selecting a category in the dropdown invokes handleSelectCategory which calls scrollToProducts
  assert.ok(
    code.includes('handleSelectCategory(cat.id)'),
    'Selecting a category should invoke handleSelectCategory'
  );
  assert.ok(
    code.includes('scrollToProducts()'),
    'handleSelectCategory must trigger scrollToProducts()'
  );
});

test('ShopContext navigateToCategoryFn preserves scroll position when already in shop view', () => {
  const code = fs.readFileSync(SHOP_CONTEXT_PATH, 'utf8');

  // Verify that window.scrollTo(0, 0) is guarded and only triggered when navigating from another view
  assert.ok(
    code.includes("if (currentView !== 'shop') {\n        setViewState('shop');\n        window.scrollTo(0, 0);\n      }"),
    'navigateToCategoryFn must NOT scroll to (0, 0) if already on shop view, preventing jump to top'
  );
});

test('ShopContext keeps cart items from other categories until the full catalog has loaded (1.7.9)', () => {
  const code = fs.readFileSync(SHOP_CONTEXT_PATH, 'utf8');
  // Category pages seed `products` with one category only; the reconcile effect used to drop every
  // cart item missing from that list, so a cart could only ever hold one category's products.
  assert.ok(code.includes('const [catalogComplete, setCatalogComplete] = useState(false);'), 'catalogComplete flag exists');
  assert.ok(code.includes('setProducts(fresh);\n          setCatalogComplete(true);'), 'flag is set when /api/products answers');
  assert.ok(code.includes('if (!fresh) return catalogComplete ? [] : [item];'), 'missing items are kept while the list is partial');
  assert.ok(!code.includes('if (!fresh || fresh.stock <= 0) return [];'), 'old unconditional drop is gone');
  assert.ok(code.includes('}, [products, cartHydrated, catalogComplete]);'), 'effect re-runs when the catalog completes');
});
