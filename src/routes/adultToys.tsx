/**
 * /adult-toys, Standalone static page.
 *
 * Named static route takes ABSOLUTE priority over app/[category]/page.tsx.
 * This guarantees Next.js always resolves /adult-toys to this file.
 *
 * IMPORTANT: This page shows ALL products across all categories, making it
 * a true "all adult toys" catalog page, not a duplicate of /sex-toys.
 *
 * Target keywords: "adult toys in Lebanon", "adult toys Lebanon",
 *                  "العاب جنسيه في لبنان", "ألعاب للكبار في لبنان"
 */
import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { fetchCategoryEditorial } from '@/lib/fetchCategoryEditorial';
import { buildFaqPageSchema, selectCategoryFaqs } from '@/lib/categoryFaq';
import { getCategoryContent } from '@/src/data/categoryContent';
import { ShopApp } from '@/src/ShopApp';
import type { StoreLocale } from '@/lib/storeLocaleShared';
import { localizePath, pageAlternates, SITE_BASE_URL } from '@/lib/localePath';



const baseMetadata: Metadata = {
  title: { absolute: 'Adult Toys in Lebanon | All Categories | Vexa Toys' },
  description: 'Shop adult toys in Lebanon across our current categories. Discreet packaging and cash on delivery.',
  openGraph: {
    title: 'Adult Toys in Lebanon | All Categories | Vexa Toys',
    description: 'Shop adult toys in Lebanon across our current categories. Discreet packaging and cash on delivery.',
    url: 'https://vexatoys.com/adult-toys',
    siteName: 'Vexa Toys Lebanon',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Adult Toys Lebanon, Vexa Toys' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexatoys',
    title: 'Adult Toys in Lebanon | All Categories | Vexa Toys',
    description: 'Shop adult toys in Lebanon across our current categories.',
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: { index: true, follow: true },
};

export async function adultToysMetadata(locale: StoreLocale): Promise<Metadata> {
  const alternates = pageAlternates('/adult-toys', locale);
  if (locale === 'en') return { ...baseMetadata, alternates };
  const title = 'منتجات للكبار في لبنان | متجر فيكسا';
  const description = 'تصفح منتجات متجر فيكسا لجميع الفئات مع تغليف سري ودفع عند الاستلام في لبنان.';
  return { ...baseMetadata, alternates, title: { absolute: title }, description, openGraph: { ...baseMetadata.openGraph, url: alternates.canonical, title, description, locale: 'ar_LB' }, twitter: { ...baseMetadata.twitter, title, description } };
}

const buildJsonLd = (locale: StoreLocale) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Vexa Toys', item: `${SITE_BASE_URL}${localizePath('/', locale)}` },
        { '@type': 'ListItem', position: 2, name: 'Adult Toys Lebanon', item: `${SITE_BASE_URL}${localizePath('/adult-toys', locale)}` },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Adult Toys in Lebanon, All Categories | Vexa Toys',
      description: 'Browse adult toys in Lebanon across the currently published categories.',
      url: `${SITE_BASE_URL}${localizePath('/adult-toys', locale)}`,
    },
  ],
});

export async function AdultToysPage(locale: StoreLocale) {
  const jsonLd = buildJsonLd(locale);
  const content = await fetchCategoryEditorial('adult-toys');
  const faqSchema = buildFaqPageSchema(selectCategoryFaqs(locale === 'ar' ? 'ar' : 'en', content, getCategoryContent('adult-toys')));
  const localizedJsonLd = {
    ...jsonLd,
    '@graph': [
      ...jsonLd['@graph'],
      ...(faqSchema ? [faqSchema] : []),
    ],
  };
  const allProducts = await fetchProductsServer();

  // /adult-toys shows products from all categories EXCEPT the core 'Sex Toys' category.
  // This prevents content duplication with /sex-toys which targets the 'Sex Toys' category.
  // Unique product set = unique page = no 'Duplicate canonical' issues in Google Search Console.
  const NON_SEX_TOY_CATEGORIES = new Set([
    'Vibrators', 'Male Toys', 'Dildos', 'Lingerie', 'BDSM', 'Anal Toys',
    'Butt Plugs', 'New Arrivals', 'Sexual Enhancers', 'Penis Pumps', 'Cock Rings',
    'Masturbators', 'Chastity', 'Sex Machines', 'Lubricants', 'Poppers',
    'Holiday Collection',
  ]);

  const adultToysProducts = allProducts.filter(p => {
    const cat = (p.category || '').trim();
    const slug = (p.categorySlug || '').trim();
    // Exclude products that are ONLY in the 'Sex Toys' category
    if (cat === 'Sex Toys' && slug === 'sex-toys') return false;
    // Include everything else, cross-category and non-sex-toys products
    const extraCats = (p.categories || []);
    if (extraCats.length > 0 && extraCats.some((c: string) => NON_SEX_TOY_CATEGORIES.has(c))) return true;
    return cat !== 'Sex Toys';
  });

  const productsWithImages = adultToysProducts.map(p => ({
    ...p,
    image:  (p.image  && !p.image.startsWith('data:'))  ? p.image  : '',
    images: (p.images || []).filter((s: string) => s && !s.startsWith('data:')),
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localizedJsonLd) }} />

      {/* Interactive shop, all categories, no pre-filter */}
      <ShopApp
        initialLocale={locale}
        initialProducts={productsWithImages}
        initialCategory=""
        initialCategorySlug="adult-toys"
        categoryEditorial={content}
        initialView="shop"
        seoHeading={locale === 'ar' ? 'منتجات للكبار في لبنان | كل الفئات' : 'Adult Toys in Lebanon | All Categories'}
      />
    </>
  );
}
