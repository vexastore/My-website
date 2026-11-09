/**
 * Split a page heading into the two hero lines. Kept free of JSX so tests can
 * import it directly.
 *
 * "Sex Toys Lebanon | Discreet Adult Toys" -> SEX TOYS LEBANON / DISCREET ADULT TOYS
 * "Dildos in Lebanon | Vexa Toys"          -> DILDOS / IN LEBANON
 */
const BRAND_SUFFIXES = new Set(['vexa toys', 'vexa toys lebanon', 'متجر فيكسا', 'متجر فيكسا لبنان']);

function headingParts(heading: string): [string, string] {
  const parts = heading.split('|').map(part => part.trim()).filter(Boolean);
  return [parts[0] || '', parts[1] || ''];
}

export function splitHeroHeading(heading: string): { primary: string; secondary: string } {
  const [first, second] = headingParts(heading);

  if (second && !BRAND_SUFFIXES.has(second.toLowerCase())) {
    return { primary: first.toUpperCase(), secondary: second.toUpperCase() };
  }

  const locationMatch = first.match(/^(.*?)\s+in\s+Lebanon$/i);
  if (locationMatch) {
    return { primary: locationMatch[1].toUpperCase(), secondary: 'IN LEBANON' };
  }

  return { primary: first.toUpperCase(), secondary: '' };
}

export function splitArabicHeroHeading(heading: string): { primary: string; secondary: string } {
  const [first, second] = headingParts(heading);

  if (second && !BRAND_SUFFIXES.has(second.toLowerCase())) {
    return { primary: first, secondary: second };
  }

  const locationMatch = first.match(/^(.*?)\s+في\s+لبنان$/);
  if (locationMatch) {
    return { primary: locationMatch[1], secondary: 'في لبنان' };
  }

  return { primary: first, secondary: '' };
}
