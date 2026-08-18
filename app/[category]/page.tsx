import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchProductsServer } from '@/lib/fetchProducts';
import {
  CATEGORY_META,
  getCategoryMeta,
  SLUG_TO_CATEGORY,
} from '@/lib/categoryMeta';
import { CATEGORY_CONTENT } from '@/lib/categoryContent';
import { ShopApp } from '@/src/ShopApp';

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

const RELATED_CATEGORIES: Record<
  string,
  Array<{
    slug: string;
    label: string;
  }>
> = {
  'sex-toys': [
    { slug: 'vibrators', label: 'Vibrators' },
    { slug: 'dildos', label: 'Dildos' },
    { slug: 'male-toys', label: 'Male Toys' },
    { slug: 'bdsm', label: 'BDSM' },
    { slug: 'lubricants', label: 'Lubricants' },
  ],

  vibrators: [
    { slug: 'sex-toys', label: 'All Sex Toys' },
    { slug: 'dildos', label: 'Dildos' },
    { slug: 'kegel-balls', label: 'Kegel Balls' },
    { slug: 'lubricants', label: 'Lubricants' },
  ],

  'male-toys': [
    { slug: 'cock-rings', label: 'Cock Rings' },
    { slug: 'masturbators', label: 'Masturbators' },
    { slug: 'penis-pumps', label: 'Penis Pumps' },
    { slug: 'lubricants', label: 'Lubricants' },
    {
      slug: 'sexual-enhancers',
      label: 'Sexual Enhancers',
    },
  ],

  dildos: [
    { slug: 'vibrators', label: 'Vibrators' },
    { slug: 'strap-ons', label: 'Strap-Ons' },
    { slug: 'lubricants', label: 'Lubricants' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  bdsm: [
    { slug: 'bondage', label: 'Bondage' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
    { slug: 'lingerie', label: 'Lingerie' },
  ],

  'anal-toys': [
    { slug: 'butt-plugs', label: 'Butt Plugs' },
    { slug: 'lubricants', label: 'Lubricants' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  'butt-plugs': [
    { slug: 'anal-toys', label: 'Anal Toys' },
    { slug: 'lubricants', label: 'Lubricants' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  lubricants: [
    { slug: 'vibrators', label: 'Vibrators' },
    { slug: 'anal-toys', label: 'Anal Toys' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
    {
      slug: 'sexual-enhancers',
      label: 'Sexual Enhancers',
    },
  ],

  lingerie: [
    { slug: 'bdsm', label: 'BDSM' },
    {
      slug: 'holiday-collection',
      label: 'Gift Sets',
    },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  bondage: [
    { slug: 'bdsm', label: 'BDSM' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  'strap-ons': [
    { slug: 'dildos', label: 'Dildos' },
    { slug: 'lubricants', label: 'Lubricants' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  'cock-rings': [
    { slug: 'male-toys', label: 'Male Toys' },
    {
      slug: 'sexual-enhancers',
      label: 'Sexual Enhancers',
    },
    { slug: 'lubricants', label: 'Lubricants' },
  ],

  masturbators: [
    { slug: 'male-toys', label: 'Male Toys' },
    { slug: 'cock-rings', label: 'Cock Rings' },
    { slug: 'lubricants', label: 'Lubricants' },
  ],

  'penis-pumps': [
    { slug: 'male-toys', label: 'Male Toys' },
    { slug: 'cock-rings', label: 'Cock Rings' },
    {
      slug: 'sexual-enhancers',
      label: 'Sexual Enhancers',
    },
  ],

  'kegel-balls': [
    { slug: 'vibrators', label: 'Vibrators' },
    { slug: 'lubricants', label: 'Lubricants' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  'sexual-enhancers': [
    { slug: 'lubricants', label: 'Lubricants' },
    { slug: 'male-toys', label: 'Male Toys' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  chastity: [
    { slug: 'bdsm', label: 'BDSM' },
    { slug: 'cock-rings', label: 'Cock Rings' },
    { slug: 'male-toys', label: 'Male Toys' },
  ],

  'sex-machines': [
    { slug: 'vibrators', label: 'Vibrators' },
    { slug: 'dildos', label: 'Dildos' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  'sex-dolls': [
    { slug: 'male-toys', label: 'Male Toys' },
    { slug: 'lubricants', label: 'Lubricants' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  'holiday-collection': [
    { slug: 'lingerie', label: 'Lingerie' },
    { slug: 'bdsm', label: 'BDSM' },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],

  'new-arrivals': [
    { slug: 'sex-toys', label: 'All Sex Toys' },
    { slug: 'vibrators', label: 'Vibrators' },
    { slug: 'male-toys', label: 'Male Toys' },
  ],

  poppers: [
    { slug: 'lubricants', label: 'Lubricants' },
    {
      slug: 'sexual-enhancers',
      label: 'Sexual Enhancers',
    },
    { slug: 'sex-toys', label: 'All Sex Toys' },
  ],
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { category: slug } = await params;

  const meta = getCategoryMeta(slug);

  const pageUrl = `${SITE_BASE_URL}/${slug}`;

  return {
    title: {
      absolute: meta.titleEn,
    },

    description: meta.descEn.slice(0, 160),

    openGraph: {
      title: meta.titleEn,
      description: meta.descEn,
      url: pageUrl,
      siteName: 'Vexa Store Lebanon',
      locale: 'ar_LB',
      type: 'website',

      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: meta.titleEn,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@vexastore',
      title: meta.titleEn,
      description: meta.descEn,
      images: [DEFAULT_OG_IMAGE],
    },

    alternates: {
      canonical: pageUrl,

      languages: {
        'ar-LB': pageUrl,
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
  const { category: slug } = await params;

  if (RESERVED.has(slug)) {
    notFound();
  }

  const categoryId = SLUG_TO_CATEGORY[slug];

  if (!categoryId) {
    notFound();
  }

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
        product.categorySlug === slug ||
        product.category === categoryId
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
  const jsonLdProducts =
    categoryProducts.slice(0, 8);

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
            name: meta.titleEn
              .split('|')[0]
              .trim(),
            item: `${SITE_BASE_URL}/${slug}`,
          },
        ],
      },

      {
        '@type': 'CollectionPage',

        name: meta.titleEn,

        description: meta.descEn,

        url: `${SITE_BASE_URL}/${slug}`,
      },

      ...(categoryProducts.length > 0
        ? [
            {
              '@type': 'ItemList',

              name: meta.titleEn,

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
                      product.nameEn ||
                      product.name,
                  })
                ),
            },
          ]
        : []),

      {
        '@type': 'FAQPage',

        mainEntity: [
          {
            '@type': 'Question',

            name:
              'Do you deliver discreetly in Lebanon?',

            acceptedAnswer: {
              '@type': 'Answer',

              text:
                'Yes. Plain sealed box, no logo, same-day delivery in Beirut.',
            },
          },

          {
            '@type': 'Question',

            name:
              'Can I pay cash on delivery?',

            acceptedAnswer: {
              '@type': 'Answer',

              text:
                'Yes. Cash on delivery (COD) is available. No online payment required.',
            },
          },

          {
            '@type': 'Question',

            name:
              'How fast is delivery?',

            acceptedAnswer: {
              '@type': 'Answer',

              text:
                'Same-day in Beirut, 48-72 hours for other regions.',
            },
          },
        ],
      },
    ],
  };

  const content = CATEGORY_CONTENT[slug];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <ShopApp
        initialProducts={productsWithImages}
        initialCategory={categoryId}
        initialView="shop"
        seoHeading={slug === 'dildos'
          ? 'Dildos in Lebanon | Premium Body-Safe Collection'
          : slug === 'sex-toys'
            ? 'Sex Toys in Lebanon | Vexa Store Collection'
            : undefined}
      />

      {content && (
        <section className="bg-[#050101] border-t border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-14 space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-4">
                Buying Guide
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <p className="text-stone-300 text-sm leading-[1.85] whitespace-pre-line">
                  {content.guide}
                </p>
              </div>
            </div>

            {content.faqs.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-4">
                  Frequently Asked Questions
                </p>

                <div className="space-y-3">
                  {content.faqs.map(
                    (faq, index) => (
                      <div
                        key={`${slug}-faq-${index}`}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                      >
                        <p className="font-black text-white text-sm mb-2 leading-snug">
                          {faq.q}
                        </p>

                        <p className="text-stone-400 text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-black text-white mb-1">
                  Not sure where to start?
                </p>

                <p className="text-stone-400 text-sm">
                  Take our 3-question quiz and get a
                  personalised recommendation.
                </p>
              </div>

              <a
                href="/quiz"
                className="shrink-0 inline-flex items-center gap-2 bg-white text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-stone-200 transition active:scale-[0.98]"
              >
                Find my product →
              </a>
            </div>
          </div>
        </section>
      )}

      {categoryProducts.length > 0 && (
        <nav
          aria-label={`All products in ${meta.titleEn
            .split('|')[0]
            .trim()}`}
          className="bg-[#050101] border-t border-white/5"
        >
          <div className="mx-auto max-w-5xl px-4 py-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600 mb-4">
              All Products
            </p>

            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {categoryProducts.map(
                (product) => (
                  <li key={product.id}>
                    <a
                      href={`${SITE_BASE_URL}${canonicalProductPath(
                        product
                      )}`}
                      className="text-stone-500 hover:text-stone-300 text-xs transition-colors"
                    >
                      {(
                        product.nameEn ||
                        product.name ||
                        ''
                      ).slice(0, 60)}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </nav>
      )}

      {RELATED_CATEGORIES[slug] && (
        <nav
          aria-label="Related categories"
          className="bg-[#050101] border-t border-white/5"
        >
          <div className="mx-auto max-w-5xl px-4 py-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600 mb-3">
              Related Categories
            </p>

            <ul className="flex flex-wrap gap-3">
              {RELATED_CATEGORIES[slug].map(
                (relatedCategory) => (
                  <li
                    key={relatedCategory.slug}
                  >
                    <a
                      href={`/${relatedCategory.slug}`}
                      className="text-xs font-bold text-stone-500 hover:text-stone-300 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {relatedCategory.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
