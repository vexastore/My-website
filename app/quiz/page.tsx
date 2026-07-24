import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Use dynamic import with ssr:false to isolate this client-only component
// from the server render. This prevents any module-level code in QuizClient
// from causing a server-side error that Next.js would surface as a 404.
const QuizClient = dynamic(
  () => import('./QuizClient').then((mod) => ({ default: mod.QuizClient })),
  { ssr: false, loading: () => <div className="min-h-screen bg-[#050101]" /> }
);

export const metadata: Metadata = {
  title: 'Find Your Perfect Toy | Vexa Store Lebanon',
  description: 'Answer 3 quick questions and get a personalised product recommendation from Vexa Store Lebanon. Same-day discreet delivery in Beirut. Cash on delivery.',
  alternates: { canonical: 'https://vexatoys.com/quiz' },
  openGraph: {
    title: 'Find Your Perfect Toy | Vexa Store Lebanon',
    description: 'Answer 3 quick questions and get a personalised product recommendation. Discreet delivery across Lebanon.',
    url: 'https://vexatoys.com/quiz',
    siteName: 'Vexa Store Lebanon',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexastore',
    title: 'Find Your Perfect Toy | Vexa Store Lebanon',
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Find Your Perfect Toy — Vexa Store Lebanon',
  description: 'Interactive product recommendation quiz. Answer 3 questions to get personalised sex toy recommendations delivered discreetly in Lebanon.',
  url: 'https://vexatoys.com/quiz',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
      { '@type': 'ListItem', position: 2, name: 'Find Your Perfect Toy', item: 'https://vexatoys.com/quiz' },
    ],
  },
};

export default function QuizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QuizClient />
    </>
  );
}
