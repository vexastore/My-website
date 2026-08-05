import { Metadata } from 'next';
import QuizShell from './QuizShell';
import Link from 'next/link';

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

const CATEGORIES = [
  { slug: 'vibrators',         label: 'Vibrators',         desc: 'Bullet, wand, rabbit & G-spot styles' },
  { slug: 'dildos',            label: 'Dildos',            desc: 'Body-safe silicone, realistic & glass' },
  { slug: 'male-toys',         label: 'Male Toys',         desc: 'Masturbators, pumps & cock rings' },
  { slug: 'bdsm',              label: 'BDSM',              desc: 'Restraints, blindfolds & couples kits' },
  { slug: 'lingerie',          label: 'Lingerie',          desc: 'Lace, satin & mesh intimate sets' },
  { slug: 'anal-toys',         label: 'Anal Toys',         desc: 'Beads, plugs & prostate massagers' },
  { slug: 'lubricants',        label: 'Lubricants',        desc: 'Water-based & silicone formulas' },
  { slug: 'sexual-enhancers',  label: 'Sexual Enhancers',  desc: 'Delay sprays, arousal gels & boosters' },
  { slug: 'butt-plugs',        label: 'Butt Plugs',        desc: 'Silicone, metal & vibrating styles' },
  { slug: 'sex-machines',      label: 'Sex Machines',      desc: 'Thrusting & riding machines' },
  { slug: 'strap-ons',         label: 'Strap-Ons',         desc: 'Harnesses & compatible dildos' },
  { slug: 'kegel-balls',       label: 'Kegel Balls',       desc: 'Pelvic floor training & pleasure' },
];

export default function QuizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Server-rendered H1 & intro (visible to Googlebot in static HTML) ── */}
      <div className="bg-[#050101] pt-10 pb-2 px-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 text-center">
            Find Your Perfect Toy
          </h1>
          <p className="text-stone-400 text-sm text-center leading-relaxed mb-2">
            Not sure where to start? Answer 3 quick questions and get a personalised recommendation
            from Lebanon&apos;s most complete adult store. All products ship in plain sealed packaging
            — same-day delivery in Beirut, cash on delivery anywhere in Lebanon.
          </p>
        </div>
      </div>

      {/* ── Interactive quiz (client-side) ── */}
      <QuizShell />

      {/* ── Server-rendered category links — visible to Googlebot, gives Ahrefs
           "outgoing links" signal and adds meaningful word count to the page ── */}
      <section className="bg-[#050101] border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-2">
            Or Browse by Category
          </p>
          <h2 className="text-xl font-black text-white mb-2">
            Shop All Categories
          </h2>
          <p className="text-stone-400 text-sm mb-8 max-w-2xl">
            Vexa Store Lebanon carries 500+ adult products across every category — vibrators, dildos,
            male toys, BDSM gear, lingerie, anal toys, lubricants, and more. Every order ships
            discreetly in a plain sealed box with no branding. Cash on delivery available across Lebanon.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${cat.slug}`}
                  className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-purple-500/40 hover:bg-white/[0.06] transition"
                >
                  <span className="font-black text-white text-sm group-hover:text-purple-200 transition">
                    {cat.label} in Lebanon
                  </span>
                  <span className="text-stone-500 text-xs">{cat.desc}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Additional internal links for SEO */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600 mb-4">
              Quick Links
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link href="/sex-toys"      className="text-stone-400 hover:text-white transition">All Sex Toys Lebanon</Link>
              <Link href="/about"         className="text-stone-400 hover:text-white transition">About Vexa Store</Link>
              <Link href="/blog"          className="text-stone-400 hover:text-white transition">Product Guides Blog</Link>
              <Link href="/new-arrivals"  className="text-stone-400 hover:text-white transition">New Arrivals</Link>
              <Link href="/blog/guides"   className="text-stone-400 hover:text-white transition">Buying Guides</Link>
              <Link href="/blog/tips"     className="text-stone-400 hover:text-white transition">Tips &amp; Care</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
