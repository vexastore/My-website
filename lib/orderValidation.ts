export const MIN_ORDER_ADDRESS_LENGTH = 4;

export function isValidOrderAddress(value: unknown): value is string {
  return typeof value === 'string'
    && value.trim().length >= MIN_ORDER_ADDRESS_LENGTH
    && value.trim().length <= 500;
}
