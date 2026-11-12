import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_CATEGORIES, getBlogCategory } from '@/lib/blogPosts';
import { fetchBlogPostsServer } from '@/lib/fetchArticles';
import type { StoreLocale } from '@/lib/storeLocaleShared';
import { localizePath, pageAlternates } from '@/lib/localePath';
import { SiteFrame } from '@/src/components/SiteFrame';
import { BlogCard } from '@/src/components/blog/BlogCard';
import { absoluteUrl, featuredImage } from '@/lib/blogContent';


export interface Props { params: Promise<{ blogCategory: string }> }

const SITE = 'https://vexatoys.com';

/** Category-specific titles that read like search results, not labels. */
const CATEGORY_SEO: Record<string, { title: string; titleAr: string; description: string; descriptionAr: string; shop: Array<{ href: string; en: string; ar: string }> }> = {
  guides: {
    title: 'Sex Toy Buying Guides for Lebanon | Vexa Toys Blog',
    titleAr: 'أدلة شراء الألعاب الجنسية في لبنان | مدونة فيكسا',
    description: 'Buying guides for vibrators, dildos, male toys, lingerie, BDSM and more in Lebanon: types, materials, sizes and what to check before you order.',
    descriptionAr: 'أدلة شراء الهزازات والديلدو والألعاب الرجالية واللانجري وBDSM في لبنان: الأنواع والمواد والأحجام وما تتحقق منه قبل الطلب.',
    shop: [{ href: '/vibrators', en: 'Vibrators in Lebanon', ar: 'هزازات في لبنان' }, { href: '/dildos', en: 'Dildos in Lebanon', ar: 'ديلدو في لبنان' }, { href: '/male-toys', en: 'Male toys in Lebanon', ar: 'ألعاب رجالية في لبنان' }, { href: '/lingerie', en: 'Lingerie in Lebanon', ar: 'لانجري في لبنان' }],
  },
  tips: {
    title: 'Sex Toy Care & Cleaning Tips | Vexa Toys Blog',
    titleAr: 'نصائح العناية بالألعاب وتنظيفها | مدونة فيكسا',
    description: 'How to clean, store and use intimate products safely, which lubricant to pair with which material, and how to buy privately in Lebanon.',
    descriptionAr: 'كيف تنظف المنتجات الحميمية وتحفظها وتستخدمها بأمان، وأي مزلق يناسب أي مادة، وكيف تشتري بخصوصية في لبنان.',
    shop: [{ href: '/lubricants', en: 'Lubricants in Lebanon', ar: 'مزلقات في لبنان' }, { href: '/sex-toys', en: 'All sex toys', ar: 'كل الألعاب الجنسية' }],
  },
  relationships: {
    title: 'Intimacy & Relationship Advice for Couples | Vexa Toys Blog',
    titleAr: 'نصائح الحميمية والعلاقات للأزواج | مدونة فيكسا',
    description: 'Honest, practical advice for couples in Lebanon on communication, intimacy and trying toys together for the first time.',
    descriptionAr: 'نصائح صادقة وعملية للأزواج في لبنان حول التواصل والحميمية وتجربة الألعاب معاً للمرة الأولى.',
    shop: [{ href: '/sex-toys', en: 'Couples toys', ar: 'ألعاب للأزواج' }, { href: '/lingerie', en: 'Lingerie', ar: 'لانجري' }, { href: '/holiday-collection', en: 'Gift sets', ar: 'أطقم هدايا' }],
  },
  advice: {
    title: 'Buying Sex Toys in Lebanon: Advice & FAQ | Vexa Toys Blog',
    titleAr: 'شراء الألعاب الجنسية في لبنان: نصائح وأسئلة | مدونة فيكسا',
    description: 'Where to buy sex toys in Lebanon, how discreet delivery and cash on delivery work, how to spot originals, and answers to common questions.',
    descriptionAr: 'أين تشتري الألعاب الجنسية في لبنان، كيف يعمل التوصيل السري والدفع عند الاستلام، كيف تميّز الأصلي، وإجابات عن الأسئلة الشائعة.',
    shop: [{ href: '/sex-toys', en: 'Online sex shop in Lebanon', ar: 'متجر جنسي أونلاين في لبنان' }, { href: '/delivery', en: 'Delivery policy', ar: 'سياسة التوصيل' }, { href: '/returns', en: 'Returns policy', ar: 'سياسة الاسترجاع' }],
  },
};

export function blogCategoryStaticParams() {
  return BLOG_CATEGORIES.map(c => ({ blogCategory: c.slug }));
}

export async function blogCategoryMetadata(locale: StoreLocale, { params }: Props): Promise<Metadata> {
  const ar = locale === 'ar';
  const { blogCategory } = await params;
  const cat = getBlogCategory(blogCategory);
  if (!cat) return { robots: { index: false, follow: false } };
  const seo = CATEGORY_SEO[blogCategory];
  const title = seo ? (ar ? seo.titleAr : seo.title) : `${ar ? cat.nameAr : cat.name} | Vexa Toys Blog`;
  const description = seo ? (ar ? seo.descriptionAr : seo.description) : (ar ? cat.descriptionAr : cat.description);
  const alternates = pageAlternates(`/blog/${blogCategory}`, locale);
  const pageUrl = alternates.canonical;
  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: { title, description, locale: ar ? 'ar_LB' : 'en_US', url: pageUrl, siteName: 'Vexa Toys Lebanon', type: 'website', images: [{ url: `${SITE}/opengraph.jpg`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', site: '@vexatoys', title, description, images: [`${SITE}/opengraph.jpg`] },
    robots: { index: true, follow: true },
  };
}

export async function BlogCategoryPage(locale: StoreLocale, { params }: Props) {
  const ar = locale === 'ar';
  const { blogCategory } = await params;
  const cat = getBlogCategory(blogCategory);
  if (!cat) notFound();
  const seo = CATEGORY_SEO[blogCategory];
  const pageUrl = `${SITE}${localizePath(`/blog/${blogCategory}`, locale)}`;

  const posts = (await fetchBlogPostsServer())
    .filter(post => post.categorySlug === blogCategory)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Vexa Toys', item: `${SITE}${localizePath('/', locale)}` },
          { '@type': 'ListItem', position: 2, name: ar ? 'المدونة' : 'Blog', item: `${SITE}${localizePath('/blog', locale)}` },
          { '@type': 'ListItem', position: 3, name: ar ? cat.nameAr : cat.name, item: pageUrl },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: seo ? (ar ? seo.titleAr : seo.title) : (ar ? cat.nameAr : cat.name),
        url: pageUrl,
        description: seo ? (ar ? seo.descriptionAr : seo.description) : (ar ? cat.descriptionAr : cat.description),
        inLanguage: locale,
        hasPart: posts.map(post => ({
          '@type': 'BlogPosting',
          headline: ar ? post.titleAr || post.title : post.title,
          url: `${SITE}${localizePath(`/blog/${post.categorySlug}/${post.slug}`, locale)}`,
          datePublished: new Date(post.publishedAt).toISOString(),
          image: absoluteUrl(featuredImage(post).src),
        })),
      },
    ],
  };

  return (
    <SiteFrame initialLocale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <div className="bg-vexa-ink text-white" dir={ar ? 'rtl' : 'ltr'}>
        <section className="border-b border-white/10">
          <div className="vexa-container py-12 sm:py-16">
            <nav aria-label="Breadcrumb" className="mb-5 text-xs text-stone-400">
              <a href={localizePath('/', locale)} className="transition hover:text-white">{ar ? 'المتجر' : 'Store'}</a>
              <span className="mx-2" aria-hidden="true">/</span>
              <a href={localizePath('/blog', locale)} className="transition hover:text-white">{ar ? 'المدونة' : 'Blog'}</a>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="text-stone-200">{ar ? cat.nameAr : cat.name}</span>
            </nav>
            <p className="vexa-eyebrow">{ar ? 'موضوع' : 'Topic'}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{ar ? cat.nameAr : cat.name}</h1>
            <p className="vexa-lead mt-4 max-w-2xl">{seo ? (ar ? seo.descriptionAr : seo.description) : (ar ? cat.descriptionAr : cat.description)}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map(c => (
                <a
                  key={c.slug}
                  href={localizePath(`/blog/${c.slug}`, locale)}
                  aria-current={c.slug === blogCategory ? 'page' : undefined}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${c.slug === blogCategory ? 'border-vexa-pink bg-vexa-pink/15 text-white' : 'border-white/15 bg-white/5 text-stone-300 hover:border-vexa-pink hover:text-vexa-pink'}`}
                >
                  {ar ? c.nameAr : c.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="vexa-container vexa-section border-b border-white/10">
          {posts.length === 0 ? (
            <div className="vexa-card p-10 text-center">
              <p className="font-bold text-white">{ar ? 'لا توجد مقالات في هذا الموضوع بعد.' : 'No articles in this topic yet.'}</p>
              <a href={localizePath('/blog', locale)} className="vexa-link mt-3 inline-block text-sm">{ar ? 'العودة إلى المدونة' : 'Back to the blog'}</a>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => <BlogCard key={post.id} post={post} isArabic={ar} priority={index < 3} />)}
            </div>
          )}
        </section>

        {seo && (
          <section className="vexa-container vexa-section">
            <p className="vexa-eyebrow">{ar ? 'تسوّق ما قرأت عنه' : 'Shop what you read about'}</p>
            <h2 className="vexa-h2 mt-2">{ar ? 'الفئات المرتبطة بهذا الموضوع' : 'Categories linked to this topic'}</h2>
            <div className="vexa-h2-bar" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {seo.shop.map(link => (
                <a key={link.href} href={localizePath(link.href, locale)} className="vexa-card vexa-card-interactive flex items-center justify-between gap-2 px-4 py-3.5 text-sm font-bold text-white">
                  {ar ? link.ar : link.en}
                  <span aria-hidden="true" className="text-vexa-pink">{ar ? '←' : '→'}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteFrame>
  );
}
