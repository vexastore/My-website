import type { Metadata } from 'next';
import MetaPixel from '@/src/components/MetaPixel';
import { Analytics } from '@vercel/analytics/next';
import type { StoreLocale } from '@/lib/storeLocaleShared';

/**
 * The `<html>` document shared by the two root layouts.
 *
 * English pages live under `app/(en)` and Arabic pages under `app/(ar)/ar`.
 * Each route group has its own root layout so the server can emit the right
 * `lang` and `dir` on `<html>` from the URL alone; no page reads a cookie,
 * which keeps every public page static and CDN-cacheable.
 */

const BASE = 'https://vexatoys.com';

const baseMetadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Luxury Sex Toys in Lebanon | Vexa Toys',
    template: '%s | Vexa Toys Lebanon',
  },
  description: 'Luxury sex toys in Lebanon, curated for quality. Premium vibrators, dildos & lingerie. Discreet same-day delivery, cash on delivery.',
  keywords: 'luxury sex toys lebanon, sex toys in lebanon, premium vibrators lebanon, high-end adult toys lebanon, designer lingerie beirut, luxury intimacy lebanon, curated sex toys lebanon, premium dildos lebanon, vexa toys, ألعاب جنسية فاخرة لبنان, لانجري فاخر بيروت',
  authors: [{ name: 'Vexa Toys Lebanon' }],
  creator: 'Vexa Toys',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_LB',
    url: BASE,
    siteName: 'Vexa Toys Lebanon',
    title: 'Luxury Sex Toys in Lebanon | Vexa Toys',
    description: 'Luxury sex toys in Lebanon, curated for quality. Premium vibrators, dildos & lingerie. Discreet same-day delivery, cash on delivery.',
    images: [{ url: `${BASE}/opengraph.jpg`, width: 1200, height: 630, alt: 'Vexa Toys Lebanon, Sex Toys & Lingerie' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexatoys',
    images: [`${BASE}/opengraph.jpg`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: { rating: 'adult' },
};

export function rootMetadata(locale: StoreLocale): Metadata {
  if (locale === 'en') return baseMetadata;
  return {
    ...baseMetadata,
    title: { default: 'متجر ألعاب زوجية في لبنان | Vexa Toys', template: '%s | متجر فيكسا لبنان' },
    openGraph: { ...baseMetadata.openGraph, locale: 'ar_LB', alternateLocale: 'en_US', url: `${BASE}/ar` },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'Vexa Toys Lebanon', url: BASE,
      logo: `${BASE}/vexa-logo.png` },
    { '@type': 'WebSite', '@id': `${BASE}/#website`, name: 'Vexa Toys Lebanon', url: BASE,
      publisher: { '@id': `${BASE}/#organization` } },
  ],
};

export function RootDocument({ locale, children }: { locale: StoreLocale; children: React.ReactNode }) {
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} /> : null}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#050101]">
        {children}
        <MetaPixel />
        <Analytics />
      </body>
    </html>
  );
}
