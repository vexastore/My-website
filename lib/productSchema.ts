import type { Product } from '@/src/types';
import { SITE_BASE_URL, canonicalProductPath } from './productSeo.ts';
import { getAggregateRating, getProductReviews } from './productReviews.ts';

export interface GenerateProductJsonLdParams {
  locale?: string;
  canonicalUrl?: string;
  catSlug?: string;
  categoryLabel?: string;
  name?: string;
  description?: string;
  images?: string[];
}

export function generateProductJsonLd(
  product: Product,
  params: GenerateProductJsonLdParams = {}
) {
  const isArabic = params.locale === 'ar';
  const canonicalUrl = params.canonicalUrl || `${SITE_BASE_URL}${canonicalProductPath(product)}`;
  const catSlug = params.catSlug || product.categorySlug || 'sex-toys';
  const categoryLabel = params.categoryLabel || (isArabic ? 'ألعاب جنسية' : 'Sex Toys');

  const productName = (
    params.name ||
    (isArabic ? product.name : product.nameEn) ||
    product.name ||
    product.nameEn ||
    ''
  ).trim();

  const alternateName = (
    (isArabic ? product.nameEn : product.name) ||
    ''
  ).trim();

  const productDescription = (
    params.description ||
    (isArabic ? product.description : product.descriptionEn) ||
    product.description ||
    product.descriptionEn ||
    `Shop ${productName} in Lebanon at Vexa Store. Discreet packaging & cash on delivery.`
  )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000);

  const images = params.images || [
    ...new Set(
      [product.image, ...(product.images || [])]
        .filter((val): val is string => Boolean(val && /^https:\/\//.test(val) && !val.startsWith('data:')))
    ),
  ];

  const inStock = (product.stock ?? 0) > 0;
  const sku = (product.sku || product.id || '').trim();

  const aggregateRating = getAggregateRating(product);
  const reviews = getProductReviews(product, 3);

  const productNode: Record<string, unknown> = {
    '@type': 'Product',
    name: productName,
    ...(alternateName && alternateName !== productName ? { alternateName } : {}),
    description: productDescription,
    ...(images.length ? { image: images } : {}),
    url: canonicalUrl,
    ...(sku ? { sku } : {}),
    brand: {
      '@type': 'Brand',
      name: 'Vexa Store Lebanon',
    },
    hasAdultConsideration: 'https://schema.org/SexualContentConsideration',
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(reviews.length
      ? {
          review: reviews.map((r) => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: r.author,
            },
            datePublished: r.date,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: isArabic ? r.textAr : r.text,
          })),
        }
      : {}),
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: product.currency || 'USD',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Vexa Store Lebanon',
        url: SITE_BASE_URL,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '3.00',
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
            maxValue: 2,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'LB',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };

  return {
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
            name: productName,
            item: canonicalUrl,
          },
        ],
      },
      productNode,
    ],
  };
}
