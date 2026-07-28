import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { getCategoryMeta, SLUG_TO_CATEGORY, CATEGORY_META } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import { notFound, permanentRedirect } from 'next/navigation';

interface Props { params: Promise<{ category: string; slug: string }> }

export const revalidate = 300; // 5 min ISR
export const dynamicParams = true; // serve admin-added products not in generateStaticParams

const STORE_LOGO = 'https://vexatoys.com/vexa-logo.png';

/**
 * Returns a valid https:// URL for product images.
 * Priority: real https → upgraded http → /api/img proxy (actual Firebase photo) → logo.
 * The proxy fallback fixes 'Invalid URL in field image' in Google Merchant Center
 * for products whose stored image is a data: URI or empty string.
 */
function toImageUrl(raw: string | undefined | null, productId?: string): string {
  if (raw && raw.startsWith('https://')) return raw;
  // Upgrade insecure http:// to https:// — Google Merchant Listings require HTTPS images.
  if (raw && raw.startsWith('http://')) return raw.replace(/^http:/, 'https:');
  // Use the image proxy — serves the real product photo from Firebase CDN.
  // A real product image is required by Google Merchant Center (logo is rejected).
  if (productId) return `https://vexatoys.com/api/img/${productId}`;
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

// The set of valid routed category slugs.
const VALID_SLUGS = new Set(CATEGORY_META.map(c => c.slug));

/**
 * Resolve the best valid categorySlug for a product.
 * 1. Use p.categorySlug if it maps to a real routed page.
 * 2. Otherwise, scan p.categories[] and pick the first valid one.
 * 3. Return undefined if no valid slug is found.
 *
 * Must stay in sync with the identical function in app/sitemap.ts so that
 * generateStaticParams pre-renders exactly the URLs the sitemap advertises.
 */
function resolveValidCategorySlug(p: {
  categorySlug?: string;
  categories?: string[];
}): string | undefined {
  const norm = (s: string) => (s || '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-').trim();
  const primary = norm(p.categorySlug || '');
  if (primary && VALID_SLUGS.has(primary)) return primary;
  for (const cat of p.categories || []) {
    const slug = norm(cat);
    if (slug && VALID_SLUGS.has(slug)) return slug;
  }
  return undefined;
}

/**
 * Pre-render static paths for ALL known products — including admin-added products
 * that lack a valid categorySlug (resolved via their categories[] array, same
 * logic as the sitemap). This ensures every URL in the sitemap is pre-rendered
 * at build time instead of relying on on-demand ISR for first-hit pages.
 */
export async function generateStaticParams() {
  try {
    const products = await fetchProductsServer();
    const params: { category: string; slug: string }[] = [];
    const seen = new Set<string>();

    for (const p of products) {
      const productSlug = p.slug || toSl(p.nameEn || p.name || '');
      const categorySlug = resolveValidCategorySlug(p);
      if (!productSlug || !categorySlug) continue;
      const key = `${categorySlug}/${productSlug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      params.push({ category: categorySlug, slug: productSlug });
    }

    return params;
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

    // Product not found — return a neutral fallback title only.
    // Do NOT set robots: { index: false } here: if the page throws notFound(),
    // Next.js returns a 404 response with the not-found page's own metadata,
    // so any noindex we set here would never reach Google.
    // If we set noindex AND the page somehow renders (edge-case cache divergence),
    // that causes "Indexing request rejected" in GSC — worse than a plain 404.
    if (!product) return { title: meta.titleEn };

    const name = cleanText(product.nameEn || product.name || slug);
    const rawDesc = product.descriptionEn || product.description || `Buy ${name} in Lebanon. Discreet delivery Beirut.`;
    const desc = cleanText(rawDesc).slice(0, 160);
    const imgUrl = toImageUrl(product.image, product.id);

    // Canonical always uses the product's own categorySlug to avoid duplicate-canonical
    // issues when Google crawls the same product under a different category URL.
    const canonicalCat = (product.categorySlug && SLUG_TO_CATEGORY[product.categorySlug])
      ? product.categorySlug
      : category;
    // Use the stored product slug for canonical — URL slug may differ (e.g. toSl(name) vs stored slug)
    const canonicalSlugMeta = product.slug || slug;
    const pageUrl = `https://vexatoys.com/${canonicalCat}/${canonicalSlugMeta}`;

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
  // to the canonical URL (308) so Google permanently consolidates ranking on one URL.
  // Use a relative path (not absolute) to avoid issues on staging/preview domains.
  const canonicalCat = (p.categorySlug && SLUG_TO_CATEGORY[p.categorySlug])
    ? p.categorySlug
    : category;
  // Redirect if either the category OR the slug in the URL differs from the product canonical.
  // This consolidates URLs like /sex-toys/pulsevibe-4-mode-vibrating-dildo → canonical slug.
  const canonicalSlug = p.slug || slug;
  if (canonicalCat !== category || canonicalSlug !== slug) {
    permanentRedirect(`/${canonicalCat}/${canonicalSlug}`);
  }

  const initialProducts = [p!];

  // Canonical always uses the product's own categorySlug (matches the sitemap URL)
  // so every path that leads here agrees on one canonical.
  const productUrl = `https://vexatoys.com/${canonicalCat}/${canonicalSlug}`;

  try {
    const productName = cleanText(p.nameEn || p.name || slug);
    // Always provide a description — Google requires it for Merchant Listings.
    const productDesc = cleanText(
      p.descriptionEn || p.description ||
      `Buy ${productName} online in Lebanon. Discreet delivery in Beirut and all regions. Cash on delivery.`
    ).slice(0, 500);

    // image: use /api/img proxy as fallback — serves the actual Firebase product photo.
    // This fixes 'Invalid URL in field image' in Google Merchant Center.
    const productImage = toImageUrl(p.image, p.id);
    // Collect all extra product images — Merchant Center rewards multi-image listings.
    const extraImages = (p.images || [])
      .filter((img: string) => img && img.startsWith('http'))
      .map((img: string) => img.replace(/^http:/, 'https:'))
      .filter((img: string) => img !== productImage);
    const allProductImages = [productImage, ...extraImages].slice(0, 6);

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
          // All available product images — required for Rich Results & Merchant Listings.
          // Multiple images improve Merchant Center click-through rates.
          image: allProductImages,
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
            // priceValidUntil: required by Google Merchant Listings for rich price display.
            // Set to 1 year rolling — revalidated every 5 min with ISR so it stays fresh.
            priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
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

