import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'متجر فيكسا | رقم 1 في لبنان للألعاب الزوجية واللانجري | Vexa Store Lebanon',
  description: 'متجر فيكسا – الأكثر خصوصية وأماناً لشراء ألعاب زوجية، هزازات، لانجري في لبنان. توصيل سري في نفس اليوم في بيروت. دفع عند الاستلام. تغليف سري 100%.',
  keywords: 'ألعاب زوجية لبنان, هزازات, لانجري, sex toys lebanon, vibrators, lingerie beirut',
  openGraph: {
    title: 'متجر فيكسا | ألعاب زوجية ولانجري في لبنان',
    description: 'توصيل سري في نفس اليوم. دفع عند الاستلام. تغليف سري.',
    url: 'https://vexatoys.com',
    siteName: 'Vexa Store',
    locale: 'ar_LB',
    type: 'website',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://vexatoys.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#050101]">
        {children}
      </body>
    </html>
  );
}
