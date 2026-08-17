import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchProductsServer } from '@/lib/fetchProducts';
import { SLUG_TO_CATEGORY, getCategoryMeta } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import type { Product } from '@/src/types';

import {
  canonicalProductPath,
  canonicalProductSlug,
  resolveProductCategorySlug,
  SITE_BASE_URL,
  SLUG_REMAPS,
  toProductSlug,
} from '@/lib/productSeo';

const DEFAULT_OG_IMAGE = 'https://vexatoys.com/opengraph.jpg';

const OFFER_VALID_FROM = '2026-01-01';
const OFFER_PRICE_VALID_UNTIL = '2027-12-31';

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

/**
 * Returns a valid HTTPS image URL for Schema.org / Open Graph.
 */
function schemaImageUrl(product: Product): string {
  const candidates = [product.image, ...(product.images || [])];

  for (const candidate of candidates) {
    if (!candidate || candidate.startsWith('data:')) {
      continue;
    }

    try {
      const url = new URL(candidate, SITE_BASE_URL);

      if (url.protocol === 'http:') {
        url.protocol = 'https:';
      }

      if (url.protocol === 'https:') {
        return url.toString();
      }
    } catch {
      // Ignore invalid image URLs.
    }
  }

  return DEFAULT_OG_IMAGE;
}

/**
 * Finds a product using the canonical slug, old slug remaps,
 * product name slug, or product ID.
 */
function findProduct(
  products: Product[],
  rawSlug: string
): Product | undefined {
  const remappedSlug = SLUG_REMAPS[rawSlug] ?? rawSlug;

  const slug = remappedSlug.replace(/-+$/, '');

  return products.find((product) => {
    const storedSlug = canonicalProductSlug(product);

    if (storedSlug && storedSlug === slug) {
      return true;
    }

    const nameSlug = toProductSlug(
      product.nameEn || product.name || ''
    );

    if (nameSlug === slug) {
      return true;
    }

    return product.id === slug;
  });
}

/**
 * Returns the main product image.
 */
function productImage(product: Product): string {
  return schemaImageUrl(product);
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { category, slug } = await params;

  const products = await fetchProductsServer();
  const product = findProduct(products, slug);

  if (!product) {
    return {
      title: 'Product Not Found | Vexa Store',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const name = (
    product.nameEn ||
    product.name ||
    ''
  ).trim();

  const productCategorySlug =
    product.categorySlug &&
    SLUG_TO_CATEGORY[product.categorySlug]
      ? product.categorySlug
      : category;

  const catMeta = getCategoryMeta(productCategorySlug);

  const categoryLabel = catMeta.titleEn
    .split('|')[0]
    .trim();

  const title = `${name} | ${categoryLabel} | Vexa Store Lebanon`;

  const description = (
    (product.descriptionEn ||
      product.description ||
      '')
      .replace(/\s+/g, ' ')
      .trim() ||
    `Buy ${name} in Lebanon. Discreet same-day delivery in Beirut, cash on delivery.`
  ).slice(0, 158);

  const canonical = `${SITE_BASE_URL}${canonicalProductPath(
    product
  )}`;

  const image = productImage(product);

  return {
    title: {
      absolute: title,
    },

    description,

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Vexa Store Lebanon',
      locale: 'ar_LB',
      type: 'website',
      images: [
        {
          url: image,
          alt: name,
          width: 800,
          height: 800,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@vexastore',
      title,
      description,
      images: [image],
    },

    alternates: {
      canonical,

      languages: {
        'ar-LB': canonical,
        'x-default': SITE_BASE_URL,
      },
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export const revalidate = 3600;

export const dynamicParams = true;

export async function generateStaticParams(): Promise<
  Array<{
    category: string;
    slug: string;
  }>
> {
  const products = await fetchProductsServer();

  const seen = new Set<string>();

  return products.flatMap((product) => {
    const category = resolveProductCategorySlug(product);
    const slug = canonicalProductSlug(product);

    if (!category || !slug) {
      return [];
    }

    const key = `${category}/${slug}`;

    if (seen.has(key)) {
      return [];
    }

    seen.add(key);

    return [
      {
        category,
        slug,
      },
    ];
  });
}

export default async function ProductPage({
  params,
}: Props) {
  const { category, slug } = await params;

  /**
   * Only allow valid category slugs.
   */
  if (!SLUG_TO_CATEGORY[category]) {
    notFound();
  }

  const allProducts = await fetchProductsServer();

  const product = findProduct(allProducts, slug);

  if (!product) {
    notFound();
  }

  const name = (
    product.nameEn ||
    product.name ||
    ''
  ).trim();

  const canonicalPath = canonicalProductPath(product);

  const canonicalUrl = `${SITE_BASE_URL}${canonicalPath}`;

  const image = productImage(product);

  /**
   * Resolve the real category from the product first.
   */
  const catSlug = resolveProductCategorySlug(
    product,
    category
  );

  const catMeta = getCategoryMeta(catSlug);

  const categoryLabel = catMeta.titleEn
    .split('|')[0]
    .trim();

  const description = (
    product.descriptionEn ||
    product.description ||
    ''
  )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000);

  /**
   * Remove Base64 images before sending products
   * to the client.
   */
  const productsWithImages = allProducts.map(
    (currentProduct) => ({
      ...currentProduct,

      image:
        currentProduct.image &&
        !currentProduct.image.startsWith('data:')
          ? currentProduct.image
          : '',

      images: (currentProduct.images || []).filter(
        (currentImage) =>
          currentImage &&
          !currentImage.startsWith('data:')
      ),
    })
  );

  const images = [image];

  const inStock = (product.stock ?? 0) > 0;

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
            name: 'Vexa Store',
            item: SITE_BASE_URL,
          },

          {
            '@type': 'ListItem',
            position: 2,
            name: categoryLabel,
            item: `${SITE_BASE_URL}/${catSlug}`,
          },

          {
            '@type': 'ListItem',
            position: 3,
            name,
            item: canonicalUrl,
          },
        ],
      },

      {
        '@type': 'Product',

        name,

        description,

        image:
          images.length > 0
            ? images
            : [DEFAULT_OG_IMAGE],

        url: canonicalUrl,

        sku: product.id,

        brand: {
          '@type': 'Brand',
          name: 'Vexa Store',
        },

        hasAdultConsideration:
          'https://schema.org/SexualContentConsideration',

        ...(product.rating &&
        product.reviewsCount
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

          url: canonicalUrl,

          priceCurrency: 'USD',

          price: product.price,

          validFrom: OFFER_VALID_FROM,

          priceValidUntil:
            OFFER_PRICE_VALID_UNTIL,

          availability: inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',

          itemCondition:
            'https://schema.org/NewCondition',

          shippingDetails: {
            '@type': 'OfferShippingDetails',

            shippingRate: {
              '@type': 'MonetaryAmount',
              value: 0,
              currency: 'USD',
            },

            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'LB',
            },

            deliveryTime: {
              '@type': 'ShippingDeliveryTime',

              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 1,
                unitCode: 'DAY',
              },

              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 3,
                unitCode: 'DAY',
              },
            },
          },

          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',

            applicableCountry: 'LB',

            returnPolicyCategory:
              'https://schema.org/MerchantReturnNotPermitted',

            merchantReturnMethod:
              'https://schema.org/ReturnByMail',

            returnFees:
              'https://schema.org/ReturnShippingFees',
          },
        },
      },
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

      <div className="sr-only">
        <h1>{name}</h1>

        <p>{description.slice(0, 300)}</p>

        <p>
          {categoryLabel} — ${product.price} —{' '}
          {inStock ? 'In stock' : 'Out of stock'} —
          Discreet delivery across Lebanon, cash on
          delivery.
        </p>
      </div>

      <ShopApp
        initialProducts={productsWithImages}
        initialCategory={
          catMeta
            ? SLUG_TO_CATEGORY[catSlug]
            : undefined
        }
        initialView="product"
        initialProductSlug={slug}
      />
    </>
  );
          }
