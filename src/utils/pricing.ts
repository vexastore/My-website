import type { CartItem, Product } from '../types';

export function selectedUnitPrice(product: Product, selected: Record<string, string> = {}): number {
  const delta = (product.variants || []).reduce((sum, variant) => {
    const choice = selected[variant.nameEn] ?? selected[variant.name];
    return sum + (choice ? variant.optionPriceDeltas?.[choice] ?? 0 : 0);
  }, 0);
  return Math.round((product.price + delta) * 100) / 100;
}

export function cartItemKey(productId: string, selected: Record<string, string> = {}): string {
  return `${productId}:${JSON.stringify(Object.entries(selected).sort(([a], [b]) => a.localeCompare(b)))}`;
}

export function cartSubtotal(items: CartItem[]): number {
  return Math.round(items.reduce((sum, item) =>
    sum + selectedUnitPrice(item.product, item.selectedVariant) * item.quantity, 0) * 100) / 100;
}
