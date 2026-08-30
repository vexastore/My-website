export interface CityMeta {
  slug: string;
  nameEn: string;
  nameAr: string;
}

/**
 * CITY_META — list of Lebanese cities/regions used for internal SEO links
 * (e.g. "Sex toys in Beirut" -> /city/beirut).
 *
 * NOTE: there are currently no app/city/[slug]/page.tsx routes generated
 * from this data — the links on the homepage point to /city/<slug>, which
 * will 404 until such a route is added. Add one under app/city/[slug]/
 * if/when city landing pages are built.
 */
export const CITY_META: CityMeta[] = [
  { slug: 'beirut', nameEn: 'Beirut', nameAr: 'بيروت' },
  { slug: 'tripoli', nameEn: 'Tripoli', nameAr: 'طرابلس' },
  { slug: 'sidon', nameEn: 'Sidon', nameAr: 'صيدا' },
  { slug: 'tyre', nameEn: 'Tyre', nameAr: 'صور' },
  { slug: 'jounieh', nameEn: 'Jounieh', nameAr: 'جونية' },
  { slug: 'baabda', nameEn: 'Baabda', nameAr: 'بعبدا' },
  { slug: 'zahle', nameEn: 'Zahle', nameAr: 'زحلة' },
  { slug: 'byblos', nameEn: 'Byblos', nameAr: 'جبيل' },
  { slug: 'nabatieh', nameEn: 'Nabatieh', nameAr: 'النبطية' },
  { slug: 'batroun', nameEn: 'Batroun', nameAr: 'البترون' },
];

export const SLUG_TO_CITY: Record<string, CityMeta> = Object.fromEntries(
  CITY_META.map(c => [c.slug, c])
);

export function getCityMeta(slug: string): CityMeta | undefined {
  return SLUG_TO_CITY[slug];
}
