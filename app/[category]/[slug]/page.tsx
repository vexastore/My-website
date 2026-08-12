import { Metadata } from 'next';
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

/**
 * Shared slug normaliser — must match ShopContext client logic.
 */
const DEFAULT_OG_IMAGE = 'https://vexatoys.com/opengraph.jpg';
const OFFER_VALID_FROM = '2026-01-01';
const OFFER_PRICE_VALID_UNTIL = '2027-12-31';

function schemaImageUrl(product: Product): string {
  const candidates = [product.image, ...(product.images || [])];
  for (const candidate of candidates) {
    if (!candidate || candidate.startsWith('data:')) continue;
    try {
      const url = new URL(candidate, 'https://vexatoys.com');
      if (url.protocol === 'http:') url.protocol = 'https:';
      if (url.protocol === 'https:') return url.toString();
    } catch {
      // Ignore malformed product image URLs and use the site fallback.
    }
  }
  return DEFAULT_OG_IMAGE;
}

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

/**
 * Find a product by URL slug.
 * Matches stored slug, normalised name, or product id.
 */
function findProduct(products: Product[], rawSlug: string): Product | undefined {
  const slug = (SLUG_REMAPS[rawSlug] ?? rawSlug).replace(/-+$/, '');

  return products.find((p) => {
    const stored = canonicalProductSlug(p);
    if (stored && stored === slug) return true;
    if (toProductSlug(p.nameEn || p.name || '') === slug) return true;
    return p.id === slug;
  });
}

/**
 * First non-base64 product image.
 */
function productImage(product: Product): string {
  return schemaImageUrl(product);
}

/**
 * Product-specific metadata (title, description, canonical, OG, Twitter).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;

  const products = await fetchProductsServer();
  const product = findProduct(products, slug);

  if (!product) {
    // Will 404 in the page component; emit noindex to be safe.
    return {
      title: 'Product Not Found | Vexa Store',
      robots: { index: false, follow: false },
    };
  }

  const name = (product.nameEn || product.name || '').trim();
  const catMeta = getCategoryMeta(
    product.categorySlug && SLUG_TO_CATEGORY[product.categorySlug]
      ? product.categorySlug
      : category
  );
  const categoryLabel = catMeta.titleEn.split('|')[0].trim();

  const title = `${name} | ${categoryLabel} | Vexa Store Lebanon`;

  const description = (
    (product.descriptionEn || product.description || '')
      .replace(/\s+/g, ' ')
      .trim() ||
    `Buy ${name} in Lebanon. Discreet same-day delivery in Beirut, cash on delivery.`
  ).slice(0, 158);

  const canonical = `${SITE_BASE_URL}${canonicalProductPath(product)}`;
  const image = productImage(product);

  return {
    title: { absolute: title },
    description,

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Vexa Store Lebanon',
      locale: 'ar_LB',
      type: 'website',
      images: [{ url: image, alt: name, width: 800, height: 800 }],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@vexastore',
      title,
      description,
      images: [image],
    },

    alternates: { canonical },

    robots: { index: true, follow: true },
  };
}

/**
 * Revalidate product pages every hour (cost-efficient ISR).
 */
export const revalidate = 3600;
export const dynamicParams = true;

/**
 * Pre-render every currently known product at build time. New products remain
 * eligible for on-demand ISR because dynamicParams stays enabled.
 */
export async function generateStaticParams(): Promise<Array<{ category: string; slug: string }>> {
  const products = await fetchProductsServer();
  const seen = new Set<string>();

  return products.flatMap((product) => {
    const category = resolveProductCategorySlug(product);
    const slug = canonicalProductSlug(product);
    const key = `${category}/${slug}`;
    if (!slug || seen.has(key)) return [];
    seen.add(key);
    return [{ category, slug }];
  });
}

/**
 * Product detail page — server-rendered with Product JSON-LD.
 */
export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;

  // Unknown categories 404 immediately.
  if (!SLUG_TO_CATEGORY[category]) {
    notFound();
  }

  const allProducts = await fetchProductsServer();
  const product = findProduct(allProducts, slug);

  /**
   * Unknown product slug → real 404 (no more soft-404 category
   * pages that Google flags as duplicates / redirect errors).
   */
  if (!product) {
    notFound();
  }

  const name = (product.nameEn || product.name || '').trim();
  const canonicalPath = canonicalProductPath(product);
  const canonicalUrl = `${SITE_BASE_URL}${canonicalPath}`;
  const image = productImage(product);

  const catSlug = resolveProductCategorySlug(product, category);
  const catMeta = getCategoryMeta(catSlug);
  const categoryLabel = catMeta.titleEn.split('|')[0].trim();

  const description = (
    (product.descriptionEn || product.description || '')
      .replace(/\s+/g, ' ')
      .trim()
  ).slice(0, 5000);

  /**
   * Strip Base64 images from the serialised initial payload.
   */
  const productsWithImages = allProducts.map((p) => ({
    ...p,
    image: p.image && !p.image.startsWith('data:') ? p.image : '',
    images: (p.images || []).filter((i) => i && !i.startsWith('data:')),
  }));

  const images = [schemaImageUrl(product)];

  const inStock = (product.stock ?? 0) > 0;

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
            item: 'https://vexatoys.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: categoryLabel,
            item: `https://vexatoys.com/${catSlug}`,
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
        image: images.length > 0 ? images : [DEFAULT_OG_IMAGE],
        url: canonicalUrl,
        sku: product.id,
        brand: { '@type': 'Brand', name: 'Vexa Store' },
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
          url: canonicalUrl,
          priceCurrency: 'USD',
          price: product.price,
          validFrom: OFFER_VALID_FROM,
          priceValidUntil: OFFER_PRICE_VALID_UNTIL,
          availability: inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
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
            returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
            merchantReturnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/ReturnShippingFees',
          },
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Server-rendered product summary for crawlers */}
      <div className="sr-only">
        <h1>{name}</h1>
        <p>{description.slice(0, 300)}</p>
        <p>
          {categoryLabel} — ${product.price} — {inStock ? 'In stock' : 'Out of stock'} —
          Discreet delivery across Lebanon, cash on delivery.
        </p>
      </div>

      {/* Main shop application, opened on this product */}
      <ShopApp
        initialProducts={productsWithImages}
        initialCategory={catMeta ? SLUG_TO_CATEGORY[catSlug] : undefined}
        initialView="product"
        initialProductSlug={slug}
      />
    </>
  );
}
