import type { Metadata } from 'next';
import { BLOG_CATEGORIES } from '@/lib/blogPosts';
import { fetchBlogPostsServer } from '@/lib/fetchArticles';
import type { StoreLocale } from '@/lib/storeLocaleShared';
import { localizePath, pageAlternates } from '@/lib/localePath';
import { SiteFrame } from '@/src/components/SiteFrame';
import { BlogCard } from '@/src/components/blog/BlogCard';
import { absoluteUrl, featuredImage } from '@/lib/blogContent';


const SITE = 'https://vexatoys.com';
const TITLE_EN = 'Sex Toy Guides & Advice for Lebanon | Vexa Toys Blog';
const DESC_EN = 'Buying guides, care tips and honest advice on sex toys in Lebanon: how to choose, how to order discreetly, and how to look after what you buy.';
const TITLE_AR = 'أدلة ونصائح الألعاب الجنسية في لبنان | مدونة فيكسا';
const DESC_AR = 'أدلة شراء ونصائح عناية ومقالات صادقة عن الألعاب الجنسية في لبنان: كيف تختار، كيف تطلب بسرية، وكيف تعتني بما تشتريه.';

export async function blogIndexMetadata(locale: StoreLocale): Promise<Metadata> {
  const ar = locale === 'ar';
  const title = ar ? TITLE_AR : TITLE_EN;
  const description = ar ? DESC_AR : DESC_EN;
  const alternates = pageAlternates('/blog', locale);
  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: {
      title, description, url: alternates.canonical, siteName: 'Vexa Toys Lebanon', type: 'website', locale: ar ? 'ar_LB' : 'en_US',
      images: [{ url: `${SITE}/opengraph.jpg`, width: 1200, height: 630, alt: 'Vexa Toys Lebanon Blog' }],
    },
    twitter: { card: 'summary_large_image', site: '@vexatoys', title, description, images: [`${SITE}/opengraph.jpg`] },
    robots: { index: true, follow: true },
  };
}

/** Shop categories each blog topic naturally sends readers to. */
const TOPIC_SHOP_LINKS: Record<string, Array<{ href: string; en: string; ar: string }>> = {
  guides: [
    { href: '/vibrators', en: 'Vibrators', ar: 'هزازات' },
    { href: '/dildos', en: 'Dildos', ar: 'ديلدو' },
    { href: '/male-toys', en: 'Male toys', ar: 'ألعاب رجالية' },
  ],
  tips: [
    { href: '/lubricants', en: 'Lubricants', ar: 'مزلقات' },
    { href: '/sex-toys', en: 'All sex toys', ar: 'كل الألعاب' },
  ],
  relationships: [
    { href: '/sex-toys', en: 'Couples toys', ar: 'ألعاب للأزواج' },
    { href: '/lingerie', en: 'Lingerie', ar: 'لانجري' },
  ],
  advice: [
    { href: '/sex-toys', en: 'Shop sex toys', ar: 'تسوّق الألعاب' },
    { href: '/delivery', en: 'Delivery policy', ar: 'سياسة التوصيل' },
  ],
};

export async function BlogIndexPage(locale: StoreLocale) {
  const ar = locale === 'ar';
  const posts = [...(await fetchBlogPostsServer())].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const [latest, ...rest] = posts;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE}/blog#blog`,
    name: ar ? 'مدونة فيكسا تويز لبنان' : 'Vexa Toys Lebanon Blog',
    url: `${SITE}${localizePath('/blog', locale)}`,
    description: ar ? DESC_AR : DESC_EN,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: 'Vexa Toys Lebanon', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/vexa-logo.png` } },
    blogPost: posts.slice(0, 12).map(post => ({
      '@type': 'BlogPosting',
      headline: ar ? post.titleAr || post.title : post.title,
      url: `${SITE}${localizePath(`/blog/${post.categorySlug}/${post.slug}`, locale)}`,
      datePublished: new Date(post.publishedAt).toISOString(),
      image: absoluteUrl(featuredImage(post).src),
    })),
  };

  return (
    <SiteFrame initialLocale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <div className="bg-vexa-ink text-white" dir={ar ? 'rtl' : 'ltr'}>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 z-0">
            <img src="/images/mockup/guide-bg-center.webp" alt="" aria-hidden="true" width={1376} height={768} className="h-full w-full object-cover opacity-30" loading="eager" fetchPriority="high" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-b from-vexa-ink/60 via-vexa-ink/80 to-vexa-ink" />
          </div>
          <div className="vexa-container relative z-10 py-14 sm:py-20">
            <nav aria-label="Breadcrumb" className="mb-5 text-xs text-stone-400">
              <a href={localizePath('/', locale)} className="transition hover:text-white">{ar ? 'المتجر' : 'Store'}</a>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="text-stone-200">{ar ? 'المدونة' : 'Blog'}</span>
            </nav>
            <p className="vexa-eyebrow">{ar ? 'مدونة فيكسا تويز' : 'Vexa Toys Blog'}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl">
              {ar ? 'أدلة ونصائح الألعاب الجنسية في لبنان' : 'Sex Toy Guides & Advice for Lebanon'}
            </h1>
            <p className="vexa-lead mt-5 max-w-2xl">
              {ar
                ? 'كيف تختار منتجك الأول، كيف تطلب بسرية في لبنان، وكيف تعتني بما تشتريه. مقالات عملية بلا مبالغة، مكتوبة للمتسوقين في بيروت وكل المناطق.'
                : 'How to choose your first toy, how to order discreetly in Lebanon, and how to care for what you buy. Practical articles without hype, written for shoppers in Beirut and every region.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map(cat => {
                const count = posts.filter(p => p.categorySlug === cat.slug).length;
                return (
                  <a key={cat.slug} href={localizePath(`/blog/${cat.slug}`, locale)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-stone-200 transition hover:border-vexa-pink hover:text-vexa-pink">
                    {ar ? cat.nameAr : cat.name}
                    <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-stone-300">{count}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest */}
        {latest && (
          <section className="vexa-container vexa-section border-b border-white/10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="vexa-eyebrow">{ar ? 'الأحدث' : 'Latest'}</p>
                <h2 className="vexa-h2 mt-2">{ar ? 'أحدث مقال' : 'Newest article'}</h2>
                <div className="vexa-h2-bar" />
              </div>
            </div>
            <BlogCard post={latest} isArabic={ar} featured priority />
          </section>
        )}

        {/* All articles */}
        <section className="vexa-container vexa-section border-b border-white/10">
          <div className="mb-8">
            <p className="vexa-eyebrow">{ar ? 'كل المقالات' : 'All articles'}</p>
            <h2 className="vexa-h2 mt-2">{ar ? 'تصفّح كل الأدلة' : 'Browse every guide'}</h2>
            <div className="vexa-h2-bar" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map(post => <BlogCard key={post.id} post={post} isArabic={ar} />)}
          </div>
        </section>

        {/* Topic to shop bridge */}
        <section className="vexa-container vexa-section">
          <div className="mb-8 max-w-2xl">
            <p className="vexa-eyebrow">{ar ? 'من القراءة إلى التسوق' : 'From reading to shopping'}</p>
            <h2 className="vexa-h2 mt-2">{ar ? 'جاهز لاختيار منتج؟' : 'Ready to pick a product?'}</h2>
            <div className="vexa-h2-bar" />
            <p className="vexa-lead mt-5">
              {ar
                ? 'كل دليل يرتبط بفئة في المتجر. التوصيل سري إلى كل لبنان والدفع عند الاستلام.'
                : 'Every guide maps to a shop category. Delivery is discreet across Lebanon, and you pay cash on delivery.'}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BLOG_CATEGORIES.map(cat => (
              <div key={cat.slug} className="vexa-card p-5">
                <h3 className="font-bold text-white">{ar ? cat.nameAr : cat.name}</h3>
                <p className="mt-2 text-xs leading-6 text-stone-400">{ar ? cat.descriptionAr : cat.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {(TOPIC_SHOP_LINKS[cat.slug] || []).map(link => (
                    <li key={link.href}><a href={localizePath(link.href, locale)} className="vexa-link text-sm">{ar ? link.ar : link.en}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteFrame>
  );
}
