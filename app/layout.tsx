import type { Metadata } from 'next';
import './globals.css';
import MetaPixel from '@/src/components/MetaPixel';
import { Analytics } from '@vercel/analytics/next';
import { getStoreLocale } from '@/lib/storeLocale';

export const metadata: Metadata = {
  metadataBase: new URL('https://vexatoys.com'),
  title: {
    default: 'Luxury Sex Toys in Lebanon | Vexa Store',
    template: '%s | Vexa Store Lebanon',
  },
  description: 'Luxury sex toys in Lebanon, curated for quality. Premium vibrators, dildos & lingerie. Discreet same-day delivery, cash on delivery.',
  keywords: 'luxury sex toys lebanon, sex toys in lebanon, premium vibrators lebanon, high-end adult toys lebanon, designer lingerie beirut, luxury intimacy lebanon, curated sex toys lebanon, premium dildos lebanon, vexa store, ألعاب جنسية فاخرة لبنان, لانجري فاخر بيروت',
  authors: [{ name: 'Vexa Store Lebanon' }],
  creator: 'Vexa Store',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_LB',
    url: 'https://vexatoys.com',
    siteName: 'Vexa Store Lebanon',
    title: 'Luxury Sex Toys in Lebanon | Vexa Store',
    description: 'Luxury sex toys in Lebanon, curated for quality. Premium vibrators, dildos & lingerie. Discreet same-day delivery, cash on delivery.',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Vexa Store Lebanon, Sex Toys & Lingerie' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexastore',
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: { rating: 'adult' },
};

const BASE = 'https://vexatoys.com';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'Vexa Store Lebanon', url: BASE,
      logo: `${BASE}/vexa-logo.png` },
    { '@type': 'WebSite', '@id': `${BASE}/#website`, name: 'Vexa Store Lebanon', url: BASE,
      publisher: { '@id': `${BASE}/#organization` } },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getStoreLocale();
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
