import type { Order } from '../types';

const STATUSES = new Set(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']);

export function isStorefrontReference(value: unknown): value is string {
  return typeof value === 'string' && /^VX-[A-F0-9]{12}$/.test(value);
}

export function isOrderStatus(value: unknown): value is Order['status'] {
  return typeof value === 'string' && STATUSES.has(value);
}

export function matchingOrderStatuses(
  rows: { reference: string; customer_phone: string; status: string }[],
  requested: Map<string, string>,
): { reference: string; status: Order['status'] }[] {
  return rows.filter((row) => requested.get(row.reference) === row.customer_phone && isOrderStatus(row.status))
    .map((row) => ({ reference: row.reference, status: row.status as Order['status'] }));
}

export function mergeOrderStatuses(orders: Order[], updates: { reference: string; status: unknown }[]): Order[] {
  const valid = new Map(updates.filter((item) => isStorefrontReference(item.reference) && isOrderStatus(item.status))
    .map((item) => [item.reference, item.status as Order['status']]));
  let changed = false;
  const merged = orders.map((order) => {
    const status = valid.get(order.id);
    if (!status || status === order.status) return order;
    changed = true;
    return { ...order, status };
  });
  return changed ? merged : orders;
}
