import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';
import { getStoreLocale } from '@/lib/storeLocale';

const baseMetadata: Metadata = {
  title: 'About Vexa Toys | Intimate Wellness Lebanon',
  description: 'Learn about Vexa Toys in Lebanon, its product categories, discreet packaging, and cash on delivery.',
  alternates: { canonical: 'https://vexatoys.com/about' },
  openGraph: {
    title: 'About Vexa Toys | Intimate Wellness Lebanon',
    description: 'Learn about Vexa Toys in Lebanon, its product categories, discreet packaging, and cash on delivery.',
    url: 'https://vexatoys.com/about',
    siteName: 'Vexa Toys Lebanon',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export async function generateMetadata(): Promise<Metadata> {
  if (await getStoreLocale() === 'en') return baseMetadata;
  const title = 'عن متجر فيكسا لبنان';
  const description = 'تعرف على متجر فيكسا للمنتجات الزوجية في لبنان. توصيل سري ودفع عند الاستلام.';
  return { ...baseMetadata, title: { absolute: title }, description, openGraph: { ...baseMetadata.openGraph, title, description, locale: 'ar_LB' } };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Vexa Toys Lebanon',
  url: 'https://vexatoys.com/about',
  description: 'About Vexa Toys in Lebanon, its product categories and ordering options.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Vexa Toys', item: 'https://vexatoys.com' },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://vexatoys.com/about' },
    ],
  },
};

export default async function AboutPage() {
  const locale = await getStoreLocale();

  return (
    <>
      <link rel="preload" as="image" href="/images/mockup/about-hero-bg.webp" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Client-side interactive app (user-facing) */}
      <ShopApp initialLocale={locale} initialCategory="Sex Toys" initialView="about" />
    </>
  );
}

