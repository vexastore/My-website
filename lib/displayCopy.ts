/**
 * Keep editorial punctuation and spacing consistent without changing stored
 * catalog data. Runs of spaces inside a line ("Dildo  in lebanon") collapse to
 * one; newlines are kept because descriptions use them for line breaks.
 */
export function displayCopy(value: string): string {
  return value
    .replace(/\s*—\s*/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
