import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { SLUG_TO_CATEGORY, getCategoryMeta } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import { Product } from '@/src/types';

/**
 * Shared slug normaliser.
 * Must match the logic in src/context/ShopContext.tsx.
 */
function toSl(n: string): string {
  return (n || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Slug remaps: old/legacy product slug → canonical slug.
 */
const SLUG_REMAPS: Record<string, string> = {
  'premium-anal-cleansing-douche-easy-comfortable-cleaning-310':
    'anal-cleansing-douche-easy-comfortable-cleaning',
};

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

const DEFAULT_OG_IMAGE = 'https://vexatoys.com/opengraph.jpg';

/**
 * Resolve a product from the merged static + Firebase catalog.
 *
 * Returns null when the slug matches no product — the page then
 * responds with a real HTTP 404 via notFound(), instead of the
 * previous soft-404 (HTTP 200 category page with the category
 * canonical) that Google flagged as Duplicate / Crawled-not-indexed.
 */
async function resolveProduct(
  rawSlug: string
): Promise<{ product: Product; canonicalSlug: string; products: Product[] } | null> {
  const slug = SLUG_REMAPS[rawSlug] ?? rawSlug;

  const products = await fetchProductsServer();

  const product = products.find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      toSl(p.nameEn || p.name || '') === slug
  );

  if (!product) return null;

  const canonicalSlug = (
    product.slug || toSl(product.nameEn || product.name || product.id)
  ).replace(/-+$/, '');

  return { product, canonicalSlug, products };
}

/**
 * Canonical category slug for a product: prefer the product's own
 * categorySlug when it maps to a known category, otherwise fall back
 * to the category segment from the URL.
 */
function canonicalCategoryFor(product: Product, urlCategory: string): string {
  const ps = (product.categorySlug || '').trim();
  if (ps && SLUG_TO_CATEGORY[ps]) return ps;
  if (SLUG_TO_CATEGORY[urlCategory]) return urlCategory;
  return ps || urlCategory;
}

/**
 * Product metadata — the page gets its OWN product canonical
 * (never the category canonical).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;

  const resolved = await resolveProduct(slug);

  if (!resolved) {
    // Page body calls notFound(); make sure nothing indexes this URL.
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  const { product, canonicalSlug } = resolved;
  const categorySlug = canonicalCategoryFor(product, category);
  const pageUrl = `https://vexatoys.com/${categorySlug}/${canonicalSlug}`;

  const title = product.nameEn || product.name || 'Product';
  const description = (product.descriptionEn || product.description || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  const image =
    product.image && !product.image.startsWith('data:')
      ? product.image
      : DEFAULT_OG_IMAGE;

  return {
    title: { absolute: `${title} | Vexa Store Lebanon` },
    description,

    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Vexa Store Lebanon',
      locale: 'ar_LB',
      type: 'website',
      images: [{ url: image, alt: title }],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@vexastore',
      title,
      description,
      images: [image],
    },

    alternates: {
      canonical: pageUrl,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Revalidate product pages every 5 minutes.
 */
export const revalidate = 300;

/**
 * Product page.
 */
export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;

  const resolved = await resolveProduct(slug);

  /**
   * Unknown slug → real HTTP 404.
   * (vercel.json redirects run before this route, so existing
   * 301s for legacy URLs still take priority.)
   */
  if (!resolved) {
    notFound();
  }

  const { product, canonicalSlug, products } = resolved;
  const categorySlug = canonicalCategoryFor(product, category);
  const pageUrl = `https://vexatoys.com/${categorySlug}/${canonicalSlug}`;

  /**
   * Remove Base64 images from server-rendered data.
   */
  const productsWithImages = products.map((p) => ({
    ...p,
    image: p.image && !p.image.startsWith('data:') ? p.image : '',
    images: (p.images || []).filter(
      (image) => image && !image.startsWith('data:')
    ),
  }));

  const image =
    product.image && !product.image.startsWith('data:')
      ? product.image
      : DEFAULT_OG_IMAGE;

  const categoryMeta = SLUG_TO_CATEGORY[categorySlug]
    ? getCategoryMeta(categorySlug)
    : null;

  /**
   * Schema.org structured data.
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
            name: 'Home',
            item: 'https://vexatoys.com',
          },
          ...(categoryMeta
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: categoryMeta.titleEn,
                  item: `https://vexatoys.com/${categorySlug}`,
                },
              ]
            : []),
          {
            '@type': 'ListItem',
            position: categoryMeta ? 3 : 2,
            name: product.nameEn || product.name,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'Product',
        name: product.nameEn || product.name,
        description: (product.descriptionEn || product.description || '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 500),
        image,
        url: pageUrl,
        ...(product.rating && product.reviewsCount
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewsCount,
              },
            }
          : {}),
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability:
            product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          url: pageUrl,
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Main shop application, opened on this product */}
      <ShopApp
        initialProducts={productsWithImages}
        initialCategory={SLUG_TO_CATEGORY[categorySlug]}
        initialView="product"
        initialProductSlug={canonicalSlug}
      />
    </>
  );
}
