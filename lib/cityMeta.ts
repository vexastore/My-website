export interface CityMeta {
  slug: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}

/**
 * CITY_META — canonical list of Lebanese cities/regions used for internal
 * SEO links on the homepage ("Sex toys in Beirut" -> /city/beirut) and,
 * once built, for dedicated city landing pages at app/city/[slug]/page.tsx.
 *
 * Each entry carries full bilingual SEO copy (title + meta description) in
 * the same high-end tone as CATEGORY_META, so city pages can reuse this
 * data for <title>, <meta description>, and OpenGraph tags without any
 * extra copywriting pass.
 *
 * NOTE: app/city/[slug]/page.tsx does not exist yet — the links on the
 * homepage currently point to /city/<slug>, which will 404 until that
 * route is added.
 */
export const CITY_META: CityMeta[] = [
  {
    slug: 'beirut',
    nameEn: 'Beirut',
    nameAr: 'بيروت',
    titleEn: 'Sex Toys in Beirut | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في بيروت | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Beirut, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Same-day discreet delivery across Beirut, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في بيروت — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري في نفس اليوم داخل بيروت، دفع عند الاستلام.',
  },
  {
    slug: 'tripoli',
    nameEn: 'Tripoli',
    nameAr: 'طرابلس',
    titleEn: 'Sex Toys in Tripoli | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في طرابلس | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Tripoli, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Fast discreet delivery to Tripoli, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في طرابلس — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري وسريع إلى طرابلس، دفع عند الاستلام.',
  },
  {
    slug: 'sidon',
    nameEn: 'Sidon',
    nameAr: 'صيدا',
    titleEn: 'Sex Toys in Sidon | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في صيدا | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Sidon, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Fast discreet delivery to Sidon, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في صيدا — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري وسريع إلى صيدا، دفع عند الاستلام.',
  },
  {
    slug: 'tyre',
    nameEn: 'Tyre',
    nameAr: 'صور',
    titleEn: 'Sex Toys in Tyre | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في صور | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Tyre, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Fast discreet delivery to Tyre, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في صور — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري وسريع إلى صور، دفع عند الاستلام.',
  },
  {
    slug: 'jounieh',
    nameEn: 'Jounieh',
    nameAr: 'جونية',
    titleEn: 'Sex Toys in Jounieh | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في جونية | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Jounieh, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Same-day discreet delivery to Jounieh, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في جونية — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري في نفس اليوم إلى جونية، دفع عند الاستلام.',
  },
  {
    slug: 'baabda',
    nameEn: 'Baabda',
    nameAr: 'بعبدا',
    titleEn: 'Sex Toys in Baabda | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في بعبدا | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Baabda, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Same-day discreet delivery to Baabda, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في بعبدا — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري في نفس اليوم إلى بعبدا، دفع عند الاستلام.',
  },
  {
    slug: 'zahle',
    nameEn: 'Zahle',
    nameAr: 'زحلة',
    titleEn: 'Sex Toys in Zahle | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في زحلة | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Zahle, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Fast discreet delivery to Zahle, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في زحلة — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري وسريع إلى زحلة، دفع عند الاستلام.',
  },
  {
    slug: 'byblos',
    nameEn: 'Byblos',
    nameAr: 'جبيل',
    titleEn: 'Sex Toys in Byblos | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في جبيل | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Byblos, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Same-day discreet delivery to Byblos, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في جبيل — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري في نفس اليوم إلى جبيل، دفع عند الاستلام.',
  },
  {
    slug: 'nabatieh',
    nameEn: 'Nabatieh',
    nameAr: 'النبطية',
    titleEn: 'Sex Toys in Nabatieh | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في النبطية | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Nabatieh, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Fast discreet delivery to Nabatieh, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في النبطية — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري وسريع إلى النبطية، دفع عند الاستلام.',
  },
  {
    slug: 'batroun',
    nameEn: 'Batroun',
    nameAr: 'البترون',
    titleEn: 'Sex Toys in Batroun | #1 Premium Store — Vexa Store',
    titleAr: 'ألعاب جنسية في البترون | متجر فيكسا الفاخر',
    descEn: 'Sex toys in Batroun, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Fast discreet delivery to Batroun, cash on delivery.',
    descAr: 'ألعاب جنسية فاخرة في البترون — هزازات، ديلدو، لانجري وأكثر. تقييم 4.9/5 من أكثر من 1,900 عميل. توصيل سري وسريع إلى البترون، دفع عند الاستلام.',
  },
];

export const SLUG_TO_CITY: Record<string, CityMeta> = Object.fromEntries(
  CITY_META.map(c => [c.slug, c])
);

export function getCityMeta(slug: string): CityMeta | undefined {
  return SLUG_TO_CITY[slug];
}
