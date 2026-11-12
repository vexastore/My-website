import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { fetchProductsServer } from '@/lib/fetchProducts';
import { SLUG_TO_CATEGORY, getCategoryMeta } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import type { StoreLocale } from '@/lib/storeLocaleShared';
import { localizePath, pageAlternates } from '@/lib/localePath';
import type { Product } from '@/src/types';

import {
  buildProductDescription,
  buildProductTitle,
  canonicalProductPath,
  canonicalProductSlug,
  findProduct,
  resolveProductCategorySlug,
  shortProductName,
  SITE_BASE_URL,
} from '@/lib/productSeo';
import { toCardProduct, toClientProduct } from '@/lib/storefrontPayload';
import { productMatchesCategory } from '@/src/data/categories';
import { generateProductJsonLd } from '@/lib/productSchema';
import { fetchProductReviewsServer } from '@/lib/productReviews';

const DEFAULT_OG_IMAGE = 'https://vexatoys.com/opengraph.jpg';

export interface Props {
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
 * Returns the main product image.
 */
function productImage(product: Product): string {
  return schemaImageUrl(product);
}

export async function productMetadata(locale: StoreLocale, {
  params,
}: Props): Promise<Metadata> {
  const { category, slug } = await params;

  const products = await fetchProductsServer();
  const product = findProduct(products, slug);

  if (!product) {
    return {
      title: 'Product Not Found | Vexa Toys',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const name = (
    (locale === 'ar' ? product.name : product.nameEn) ||
    product.name ||
    ''
  ).trim();

  const productCategorySlug =
    product.categorySlug &&
    SLUG_TO_CATEGORY[product.categorySlug]
      ? product.categorySlug
      : category;

  const catMeta = getCategoryMeta(productCategorySlug);

  const categoryLabel = (locale === 'ar' ? catMeta.titleAr : catMeta.titleEn)
    .split('|')[0]
    .trim();

  const sameNameCount = products.filter(item => (locale === 'ar' ? item.name : item.nameEn) === name).length;
  const brand = locale === 'ar' ? 'متجر فيكسا لبنان' : 'Vexa Toys Lebanon';

  // A hand-written SEO title wins when it is a sensible length; otherwise build
  // `<short name> | Vexa Toys Lebanon` (plus the category only to tell two
  // products with the same name apart). Never the old triple-suffix form.
  const storedTitle = ((locale === 'ar' ? product.seoTitleAr : product.seoTitleEn) || '').replace(/\s+/g, ' ').trim();
  const title = storedTitle && storedTitle.length <= 70
    ? storedTitle
    : buildProductTitle(name, brand, sameNameCount > 1 ? categoryLabel : undefined);

  const sourceDescription = ((locale === 'ar' ? product.description : product.descriptionEn) || product.description || '').replace(/\s+/g, ' ').trim();
  const storedDescription = ((locale === 'ar' ? product.seoDescriptionAr : product.seoDescriptionEn) || '').replace(/\s+/g, ' ').trim();
  const shortName = shortProductName(name);
  const description = storedDescription && storedDescription.length <= 170
    ? storedDescription
    : buildProductDescription(
        locale === 'ar' ? `تسوق ${shortName} في لبنان من متجر فيكسا.` : `Buy ${shortName} in Lebanon from Vexa Toys.`,
        sourceDescription,
        locale === 'ar' ? 'توصيل سري ودفع عند الاستلام.' : 'Discreet delivery across Lebanon, cash on delivery.',
      );

  const alternates = pageAlternates(product.canonicalUrlOverride || canonicalProductPath(product), locale);
  const canonical = alternates.canonical;

  const image = product.ogImageUrl || productImage(product);

  return {
    title: {
      absolute: title,
    },

    description,

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Vexa Toys Lebanon',
      locale: locale === 'ar' ? 'ar_LB' : 'en_US',
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
      site: '@vexatoys',
      title,
      description,
      images: [image],
    },

    alternates,

    robots: {
      index: true,
      follow: true,
    },
  };
}



export async function productStaticParams(): Promise<
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

export async function ProductPage(locale: StoreLocale, {
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
    (locale === 'ar' ? product.name : product.nameEn) ||
    product.name ||
    ''
  ).trim();

  const canonicalPath = canonicalProductPath(product);
  if (`/${category}/${slug}` !== canonicalPath) permanentRedirect(localizePath(canonicalPath, locale));

  const canonicalUrl = pageAlternates(product.canonicalUrlOverride || canonicalPath, locale).canonical;

  /**
   * Resolve the real category from the product first.
   */
  const catSlug = resolveProductCategorySlug(
    product,
    category
  );

  const catMeta = getCategoryMeta(catSlug);

  const categoryLabel = (locale === 'ar' ? catMeta.titleAr : catMeta.titleEn)
    .split('|')[0]
    .trim();

  const description = (
    (locale === 'ar' ? product.description : product.descriptionEn) ||
    product.description ||
    ''
  )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000);

  /**
   * Only this product (in full) plus a few same-category cards go into the
   * server-rendered HTML. The client refreshes the whole catalog from
   * /api/products after hydration, so shipping all 78 products here only
   * made every product page ~300 KB.
   */
  const relatedCards = allProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        productMatchesCategory(candidate, SLUG_TO_CATEGORY[catSlug])
    )
    .slice(0, 8)
    .map(toCardProduct);

  const initialProducts = [toClientProduct(product), ...relatedCards];

  const images = [...new Set((product.images || []).filter(value => /^https:\/\//.test(value)))];

  const inStock = (product.stock ?? 0) > 0;

  /**
   * Schema.org structured data using real approved reviews from database.
   */
  const approvedReviews = await fetchProductReviewsServer(product.id);
  const jsonLd = generateProductJsonLd(product, {
    locale,
    canonicalUrl,
    catSlug,
    categoryLabel,
    name,
    description,
    images,
    reviews: approvedReviews,
  });

  return (
    <>
      <script
        id="vexa-product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <ShopApp
        initialLocale={locale}
        initialProducts={initialProducts}
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
