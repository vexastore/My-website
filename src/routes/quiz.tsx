import { Metadata } from 'next';
import QuizShell from '@/src/components/quiz/QuizShell';
import Link from 'next/link';
import type { StoreLocale } from '@/lib/storeLocaleShared';
import { localizePath, pageAlternates, SITE_BASE_URL } from '@/lib/localePath';
import { SiteFrame } from '@/src/components/SiteFrame';
import { CATEGORY_META as STORE_CATEGORIES } from '@/lib/categoryMeta';

const baseMetadata: Metadata = {
  // `absolute` stops the root layout template appending "| Vexa Toys Lebanon" a second time.
  title: { absolute: 'Find Your Perfect Toy | Vexa Toys Lebanon' },
  description: 'Answer 3 quick questions and get a personalised product recommendation from Vexa Toys Lebanon. Same-day discreet delivery in Beirut. Cash on delivery.',
  openGraph: {
    title: 'Find Your Perfect Toy | Vexa Toys Lebanon',
    description: 'Answer 3 quick questions and get a personalised product recommendation. Discreet delivery across Lebanon.',
    url: 'https://vexatoys.com/quiz',
    siteName: 'Vexa Toys Lebanon',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexatoys',
    title: 'Find Your Perfect Toy | Vexa Toys Lebanon',
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: { index: true, follow: true },
};

export async function quizMetadata(locale: StoreLocale): Promise<Metadata> {
  const alternates = pageAlternates('/quiz', locale);
  if (locale === 'en') return { ...baseMetadata, alternates };
  const title = 'اعثر على المنتج المناسب لك | متجر فيكسا';
  const description = 'أجب عن ثلاثة أسئلة قصيرة لتحصل على اقتراح مناسب من متجر فيكسا في لبنان.';
  return { ...baseMetadata, alternates, title: { absolute: title }, description, openGraph: { ...baseMetadata.openGraph, url: alternates.canonical, title, description, locale: 'ar_LB' } };
}

const buildJsonLd = (locale: StoreLocale) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Find Your Perfect Toy, Vexa Toys Lebanon',
  description: 'Interactive product recommendation quiz. Answer 3 questions to get personalised sex toy recommendations delivered discreetly in Lebanon.',
  url: `${SITE_BASE_URL}${localizePath('/quiz', locale)}`,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Vexa Toys', item: `${SITE_BASE_URL}${localizePath('/', locale)}` },
      { '@type': 'ListItem', position: 2, name: 'Find Your Perfect Toy', item: `${SITE_BASE_URL}${localizePath('/quiz', locale)}` },
    ],
  },
});

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

export async function QuizPage(locale: StoreLocale) {
  const ar = locale === 'ar';
  const jsonLd = buildJsonLd(locale);
  return (
    <SiteFrame initialLocale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Server-rendered H1 & intro (visible to Googlebot in static HTML) ── */}
      <div className="bg-vexa-ink pt-10 pb-2 px-4" dir={ar ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 text-center">
            {ar ? 'اعثر على المنتج المناسب لك' : 'Find Your Perfect Toy'}
          </h1>
          <p className="text-stone-400 text-sm text-center leading-relaxed mb-2">
            {ar ? 'لا تعرف من أين تبدأ؟ أجب عن ثلاثة أسئلة قصيرة لتحصل على اقتراح مناسب. توصيل سري ودفع عند الاستلام في جميع أنحاء لبنان.' : 'Not sure where to start? Answer 3 quick questions and get a personalised recommendation. All products ship in plain sealed packaging, with same-day delivery in Beirut and cash on delivery across Lebanon.'}
          </p>
        </div>
      </div>

      {/* ── Interactive quiz (client-side) ── */}
      <QuizShell locale={locale} />

      {/* ── Server-rendered category links, visible to Googlebot, gives Ahrefs
           "outgoing links" signal and adds meaningful word count to the page ── */}
      <section className="bg-vexa-ink border-t border-white/10" dir={ar ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-2">
            {ar ? 'أو تصفح حسب الفئة' : 'Or Browse by Category'}
          </p>
          <h2 className="text-xl font-black text-white mb-2">
            {ar ? 'تسوق جميع الفئات' : 'Shop All Categories'}
          </h2>
          <p className="text-stone-400 text-sm mb-8 max-w-2xl">
            {ar ? 'يقدم متجر فيكسا مجموعة واسعة من المنتجات في فئات متعددة. يصل كل طلب في صندوق عادي مغلق دون علامة تجارية، مع الدفع عند الاستلام في جميع أنحاء لبنان.' : 'Vexa Toys Lebanon carries 500+ adult products across every category, including vibrators, dildos, male toys, lingerie, and more. Every order ships discreetly in a plain sealed box with no branding. Cash on delivery is available across Lebanon.'}
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={localizePath(`/${cat.slug}`, locale)}
                  className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-purple-500/40 hover:bg-white/[0.06] transition"
                >
                  <span className="font-black text-white text-sm group-hover:text-purple-200 transition">
                    {ar ? STORE_CATEGORIES.find(c => c.slug === cat.slug)?.titleAr.split('|')[0].trim() || cat.label : `${cat.label} in Lebanon`}
                  </span>
                  <span className="text-stone-500 text-xs">{ar ? 'تصفح المنتجات المتاحة في هذه الفئة' : cat.desc}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Additional internal links for SEO */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600 mb-4">
              {ar ? 'روابط سريعة' : 'Quick Links'}
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link href={localizePath('/sex-toys', locale)}      className="text-stone-400 hover:text-white transition">{ar ? 'كل المنتجات' : 'All Sex Toys Lebanon'}</Link>
              <Link href={localizePath('/about', locale)}         className="text-stone-400 hover:text-white transition">{ar ? 'عن متجر فيكسا' : 'About Vexa Toys'}</Link>
              <Link href={localizePath('/blog', locale)}          className="text-stone-400 hover:text-white transition">{ar ? 'المدونة' : 'Product Guides Blog'}</Link>
              <Link href={localizePath('/new-arrivals', locale)}  className="text-stone-400 hover:text-white transition">{ar ? 'وصل حديثاً' : 'New Arrivals'}</Link>
              <Link href={localizePath('/blog/guides', locale)}   className="text-stone-400 hover:text-white transition">{ar ? 'أدلة الشراء' : 'Buying Guides'}</Link>
              <Link href={localizePath('/blog/tips', locale)}     className="text-stone-400 hover:text-white transition">{ar ? 'نصائح وعناية' : 'Tips & Care'}</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
