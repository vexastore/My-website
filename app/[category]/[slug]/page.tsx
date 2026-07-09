import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { getCategoryMeta, SLUG_TO_CATEGORY, CATEGORY_META } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import { notFound, redirect } from 'next/navigation';

interface Props { params: Promise<{ category: string; slug: string }> }

export const revalidate = 300; // 5 min ISR
export const dynamicParams = true; // serve admin-added products not in generateStaticParams

const STORE_LOGO = 'https://vexatoys.com/vexa-logo.png';

/** Returns a valid https:// URL. Falls back to the store logo for base64 data URIs or empty values. */
function toImageUrl(raw: string | undefined | null): string {
  if (raw && (raw.startsWith('http://') || raw.startsWith('https://'))) return raw;
  return STORE_LOGO;
}

/** Strips newlines and collapses whitespace — safe for og:description / twitter:description. */
function cleanText(raw: string): string {
  return raw.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Single shared slug normalizer — used identically by generateStaticParams,
 * generateMetadata, and the page render so all three resolve the same product.
 */
function toSl(n: string): string {
  return (n || '').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60);
}

/**
 * Finds a product by URL slug using the same three-way match used everywhere:
 * stored slug → product ID → name-derived slug.
 */
function findProductBySlug(products: Awaited<ReturnType<typeof import('@/lib/fetchProducts').fetchProductsServer>>, slug: string) {
  return products.find(p =>
    p.slug === slug ||
    p.id === slug ||
    toSl(p.nameEn || p.name || '') === slug
  );
}

// Generates static paths for all known products (including admin-added ones without a slug).
export async function generateStaticParams() {
  try {
    const products = await fetchProductsServer();
    return products
      .filter(p => p.categorySlug && (p.slug || p.nameEn || p.name))
      .map(p => ({
        category: p.categorySlug,
        slug: p.slug || toSl(p.nameEn || p.name || p.id),
      }));
  } catch {
    return CATEGORY_META.map(c => ({ category: c.slug, slug: 'placeholder' }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const meta = getCategoryMeta(category);

  try {
    const products = await fetchProductsServer();
    // Use same three-way match as page render — slug / id / nameEn-derived slug
    const product = findProductBySlug(products, slug);
    if (!product) return { title: meta.titleEn, robots: { index: false, follow: false } };

    const name = cleanText(product.nameEn || product.name || slug);
    const rawDesc = product.descriptionEn || product.description || `Buy ${name} in Lebanon. Discreet delivery Beirut.`;
    const desc = cleanText(rawDesc).slice(0, 160);
    const imgUrl = toImageUrl(product.image);

    // Canonical always uses the product's own categorySlug to avoid duplicate-canonical
    // issues when Google crawls the same product under a different category URL.
    const canonicalCat = (product.categorySlug && SLUG_TO_CATEGORY[product.categorySlug])
      ? product.categorySlug
      : category;
    const pageUrl = `https://vexatoys.com/${canonicalCat}/${slug}`;

    return {
      title: `${name} | Vexa Store Lebanon`,
      description: desc,
      openGraph: {
        title: `${name} | Vexa Store Lebanon`,
        description: desc,
        url: pageUrl,
        siteName: 'Vexa Store Lebanon',
        images: [{ url: imgUrl, alt: name, width: 800, height: 800 }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} | Vexa Store Lebanon`,
        description: desc,
        images: [imgUrl],
      },
      alternates: { canonical: pageUrl },
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: meta.titleEn };
  }
}

export default async function ProductPage({ params }: Props) {
  const { category: rawCategory, slug } = await params;
  // Normalize URL category segment — handles URL-decoded "Male Toys" vs "male-toys"
  const category = rawCategory.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-').trim();
  const categoryId = SLUG_TO_CATEGORY[category];
  if (!categoryId) notFound();

  const meta = getCategoryMeta(category);
  const categoryLabel = meta.titleEn.split('|')[0].trim();

  let jsonLd = null;
  let serverProducts: Awaited<ReturnType<typeof fetchProductsServer>> = [];
  try {
    serverProducts = await fetchProductsServer();
  } catch { /* non-blocking — fall back to empty */ }

  // Uses the shared findProductBySlug helper (same logic as generateMetadata & generateStaticParams).
  const p = findProductBySlug(serverProducts, slug);

  // Product not found under any slug variation → genuine 404
  if (!p) notFound();

  // If the URL category doesn't match the product's canonical category, redirect
  // to the canonical URL (301) so Google consolidates ranking on one URL.
  // Use a relative path (not absolute) to avoid issues on staging/preview domains.
  const canonicalCat = (p.categorySlug && SLUG_TO_CATEGORY[p.categorySlug])
    ? p.categorySlug
    : category;
  if (canonicalCat !== category) {
    redirect(`/${canonicalCat}/${slug}`);
  }

  const initialProducts = [p!];

  // Canonical always uses the product's own categorySlug (matches the sitemap URL)
  // so every path that leads here agrees on one canonical.
  const productUrl = `https://vexatoys.com/${canonicalCat}/${slug}`;

  try {
    const productName = cleanText(p.nameEn || p.name || slug);
    // Always provide a description — Google requires it for Merchant Listings.
    const productDesc = cleanText(
      p.descriptionEn || p.description ||
      `Buy ${productName} online in Lebanon. Discreet delivery in Beirut and all regions. Cash on delivery.`
    ).slice(0, 500);

    // image: always present — fall back to store logo so Google never sees "missing image".
    // 31 products had no real-URL image and were failing the Product rich-result validation.
    const productImage = toImageUrl(p.image);

    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
            { '@type': 'ListItem', position: 2, name: categoryLabel, item: `https://vexatoys.com/${canonicalCat}` },
            { '@type': 'ListItem', position: 3, name: productName, item: productUrl },
          ],
        },
        {
          '@type': 'Product',
          name: productName,
          url: productUrl,
          description: productDesc,
          // image is always a real https:// URL — required for Rich Results & Merchant Listings
          image: [productImage],
          sku: p.id,
          mpn: p.id,
          brand: { '@type': 'Brand', name: 'Vexa Store Lebanon' },
          offers: {
            '@type': 'Offer',
            url: productUrl,
            price: p.price,
            priceCurrency: 'USD',
            // validFrom tells Google when this price became valid — required for Merchant Listings
            validFrom: '2024-01-01',
            availability: p.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
              '@type': 'Organization',
              name: 'Vexa Store Lebanon',
              url: 'https://vexatoys.com',
            },
            // ── shippingDetails — required for Merchant Listings ──────────────
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
            // ── hasMerchantReturnPolicy — required for Merchant Listings ─────
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'LB',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 7,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/FreeReturn',
            },
          },
          ...({
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: Number((p.rating > 0 ? p.rating : 5.0).toFixed(1)),
              reviewCount: p.reviewsCount > 0 ? p.reviewsCount : 1,
              bestRating: 5,
              worstRating: 1,
            },
          }),
        },
      ],
    };
  } catch { /* non-blocking */ }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ShopApp
        initialProducts={initialProducts}
        initialCategory={categoryId}
        initialView="product"
        initialProductSlug={slug}
      />
    </>
  );
}
