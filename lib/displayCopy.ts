/** Keep editorial punctuation consistent without changing stored catalog data. */
export function displayCopy(value: string): string {
  return value.replace(/\s*—\s*/g, ', ').replace(/,\s*,/g, ',').trim();
}
