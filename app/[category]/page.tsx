import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';

import { fetchProductsServer } from '@/lib/fetchProducts';
import {
  CATEGORY_META,
  getCategoryMeta,
  SLUG_TO_CATEGORY,
} from '@/lib/categoryMeta';
import { fetchCategoriesServer } from '@/lib/fetchCategories';
import { ShopApp } from '@/src/ShopApp';
import { getStoreLocale } from '@/lib/storeLocale';
import { productMatchesCategory } from '@/src/data/categories';

import {
  canonicalProductPath,
  canonicalProductSlug,
  resolveProductCategorySlug,
  SITE_BASE_URL,
  SLUG_REMAPS,
} from '@/lib/productSeo';

interface Props {
  params: Promise<{
    category: string;
  }>;
}

const DEFAULT_OG_IMAGE =
  'https://vexatoys.com/opengraph.jpg';

const RESERVED = new Set([
  'about',
  'checkout',
  'admin',
  'orders',
  'advice',
  'sitemap.xml',
  'robots.txt',
  'blog',
  'quiz',
]);

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const locale = await getStoreLocale();
  const { category: slug } = await params;
  if (slug.includes('.') || RESERVED.has(slug)) return { robots: { index: false, follow: false } };

  const meta = getCategoryMeta(slug);
  const category = (await fetchCategoriesServer()).find(item => item.slug === slug);
  if (!SLUG_TO_CATEGORY[slug] || !category) return { robots: { index: false, follow: false } };
  const title = (locale === 'ar' ? category.seoTitleAr : category.seoTitleEn) ||
    (locale === 'ar' ? meta.titleAr : meta.titleEn);
  const description = (locale === 'ar' ? category.seoDescriptionAr : category.seoDescriptionEn) ||
    (locale === 'ar' ? category.descriptionAr : category.descriptionEn) ||
    (locale === 'ar' ? meta.descAr : meta.descEn);

  const pageUrl = `${SITE_BASE_URL}/${slug}`;

  return {
    title: {
      absolute: title,
    },

    description: description.slice(0, 300),

    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Vexa Toys Lebanon',
      locale: locale === 'ar' ? 'ar_LB' : 'en_US',
      type: 'website',

      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@vexatoys',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },

    alternates: { canonical: pageUrl },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export const revalidate = 300;

export function generateStaticParams(): Array<{
  category: string;
}> {
  return CATEGORY_META.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: Props) {
  const locale = await getStoreLocale();
  const { category: slug } = await params;

  if (slug.includes('.') || RESERVED.has(slug)) {
    notFound();
  }

  const categoryId = SLUG_TO_CATEGORY[slug];

  if (!categoryId) {
    notFound();
  }
  const categoryRow = (await fetchCategoriesServer()).find(item => item.slug === slug);
  if (!categoryRow) notFound();

  const meta = getCategoryMeta(slug);

  const allProducts = await fetchProductsServer();

  const productsWithImages = allProducts.map(
    (product) => ({
      ...product,

      image:
        product.image &&
        !product.image.startsWith('data:')
          ? product.image
          : '',

      images: (product.images || []).filter(
        (image) =>
          image &&
          !image.startsWith('data:')
      ),
    })
  );

  /**
   * Only products belonging to this category.
   *
   * Canonical category + canonical product slug
   * are resolved through productSeo.ts so the
   * category page and product page use exactly
   * the same URL logic.
   */
  const categoryProducts = productsWithImages
    .filter(
      (product) =>
        productMatchesCategory(product, categoryId)
    )
    .map((product) => {
      const canonicalCategorySlug =
        resolveProductCategorySlug(
          product,
          slug
        );

      const canonicalSlug =
        canonicalProductSlug(product);

      const remappedSlug =
        SLUG_REMAPS[canonicalSlug] ??
        canonicalSlug;

      return {
        ...product,
        canonicalCategorySlug,
        canonicalSlug: remappedSlug,
      };
    })
    .filter(
      (product) =>
        Boolean(product.canonicalCategorySlug) &&
        Boolean(product.canonicalSlug)
    );

  /**
   * Product data used in structured data.
   *
   * Keep this limited to the first 8 products
   * to avoid unnecessarily large JSON-LD.
   */
  const jsonLd = {
    '@context': 'https://schema.org',

    '@graph': [
      {
        '@type': 'BreadcrumbList',

        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Vexa Toys',
            item: SITE_BASE_URL,
          },

          {
            '@type': 'ListItem',
            position: 2,
            name: (locale === 'ar' ? meta.titleAr : meta.titleEn)
              .split('|')[0]
              .trim(),
            item: `${SITE_BASE_URL}/${slug}`,
          },
        ],
      },

      {
        '@type': 'CollectionPage',

        name: locale === 'ar' ? meta.titleAr : meta.titleEn,

        description: locale === 'ar' ? meta.descAr : meta.descEn,

        url: `${SITE_BASE_URL}/${slug}`,
      },

      ...(categoryProducts.length > 0
        ? [
            {
              '@type': 'ItemList',

              name: locale === 'ar' ? meta.titleAr : meta.titleEn,

              url: `${SITE_BASE_URL}/${slug}`,

              numberOfItems:
                categoryProducts.length,

              itemListElement:
                categoryProducts.map(
                  (product, index) => ({
                    '@type': 'ListItem',

                    position: index + 1,

                    url: `${SITE_BASE_URL}${canonicalProductPath(
                      product
                    )}`,

                    name:
                      (locale === 'ar' ? product.name : product.nameEn) || product.name,
                  })
                ),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <ShopApp
        initialLocale={locale}
        initialProducts={productsWithImages}
        initialCategory={categoryId}
        initialView="shop"
      />
    </>
  );
}
