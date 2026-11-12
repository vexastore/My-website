import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogCategory } from '@/lib/blogPosts';
import { fetchBlogPostsServer, fetchBlogPostServer } from '@/lib/fetchArticles';
import type { StoreLocale } from '@/lib/storeLocaleShared';
import { localeAlternates, localizePath, pageAlternates } from '@/lib/localePath';
import { SiteFrame } from '@/src/components/SiteFrame';
import { ArticleBody } from '@/src/components/blog/ArticleBody';
import { BlogCard } from '@/src/components/blog/BlogCard';
import { SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { CATEGORIES } from '@/src/data/categories';
import {
  absoluteUrl,
  articleDescription,
  articleTitle,
  autoLinkCategories,
  externalSources,
  extractHeadings,
  featuredImage,
  formatDate,
  relatedCategorySlugs,
  stripLeadingH1,
  wordCount,
} from '@/lib/blogContent';


export interface Props { params: Promise<{ blogCategory: string; slug: string }> }

const SITE = 'https://vexatoys.com';

export function blogArticleStaticParams() {
  return []; // Supabase articles are resolved at request time.
}

export async function blogArticleMetadata(locale: StoreLocale, { params }: Props): Promise<Metadata> {
  const ar = locale === 'ar';
  const { blogCategory, slug } = await params;
  const post = await fetchBlogPostServer(slug);
  if (!post || post.categorySlug !== blogCategory || !getBlogCategory(blogCategory)) return { robots: { index: false, follow: false } };

  // An article without an Arabic body falls back to the English text, so its Arabic URL canonicalizes to the English page.
  const alternates = ar && !post.contentAr?.trim()
    ? { canonical: localeAlternates(`/blog/${blogCategory}/${slug}`).en }
    : pageAlternates(`/blog/${blogCategory}/${slug}`, locale);
  const pageUrl = alternates.canonical;
  const title = articleTitle(post, ar);
  const description = articleDescription(post, ar);
  const image = absoluteUrl(featuredImage(post).src);
  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: {
      title, description, locale: ar ? 'ar_LB' : 'en_US', url: pageUrl, siteName: 'Vexa Toys Lebanon', type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt || post.publishedAt).toISOString(),
      authors: ['Vexa Toys Editorial Team'],
      images: [{ url: image, width: 1376, height: 768, alt: ar ? post.titleAr || post.title : post.title }],
    },
    twitter: { card: 'summary_large_image', site: '@vexatoys', title, description, images: [image] },
    robots: { index: true, follow: true },
  };
}

function shopCategoryName(slug: string, ar: boolean): string {
  const def = CATEGORIES.find(category => category.id === SLUG_TO_CATEGORY[slug]);
  return def ? (ar ? def.name.ar : def.name.en) : slug.replace(/-/g, ' ');
}

export async function BlogArticlePage(locale: StoreLocale, { params }: Props) {
  const ar = locale === 'ar';
  const { blogCategory, slug } = await params;
  const post = await fetchBlogPostServer(slug);
  if (!post || post.categorySlug !== blogCategory) notFound();
  const cat = getBlogCategory(blogCategory);
  if (!cat) notFound();

  const pageUrl = `${SITE}${localizePath(`/blog/${blogCategory}/${slug}`, locale)}`;
  const title = ar ? post.titleAr || post.title : post.title;
  const excerpt = ar ? post.excerptAr || post.excerpt : post.excerpt;
  const rawMarkdown = ar ? post.contentAr || post.content : post.content;
  const markdown = autoLinkCategories(stripLeadingH1(rawMarkdown), locale);
  const headings = extractHeadings(markdown);
  const image = featuredImage(post);
  const shopSlugs = relatedCategorySlugs(post);
  const sources = externalSources(post);

  const allPosts = await fetchBlogPostsServer();
  const related = allPosts.filter(p => p.slug !== slug && p.categorySlug === blogCategory).slice(0, 3);
  const fallbackRelated = related.length < 3 ? allPosts.filter(p => p.slug !== slug && !related.includes(p)).slice(0, 3 - related.length) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Vexa Toys', item: `${SITE}${localizePath('/', locale)}` },
          { '@type': 'ListItem', position: 2, name: ar ? 'المدونة' : 'Blog', item: `${SITE}${localizePath('/blog', locale)}` },
          { '@type': 'ListItem', position: 3, name: ar ? cat.nameAr : cat.name, item: `${SITE}${localizePath(`/blog/${blogCategory}`, locale)}` },
          { '@type': 'ListItem', position: 4, name: title, item: pageUrl },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${pageUrl}#article`,
        headline: title,
        description: excerpt,
        url: pageUrl,
        image: absoluteUrl(image.src),
        datePublished: new Date(post.publishedAt).toISOString(),
        dateModified: new Date(post.updatedAt || post.publishedAt).toISOString(),
        author: { '@type': 'Organization', name: 'Vexa Toys Editorial Team', url: `${SITE}${localizePath('/about', locale)}` },
        publisher: { '@type': 'Organization', name: 'Vexa Toys Lebanon', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/vexa-logo.png` } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        articleSection: ar ? cat.nameAr : cat.name,
        wordCount: wordCount(markdown),
        inLanguage: locale,
        isPartOf: { '@type': 'Blog', '@id': `${SITE}/blog#blog`, name: 'Vexa Toys Lebanon Blog', url: `${SITE}${localizePath('/blog', locale)}` },
      },
    ],
  };

  return (
    <SiteFrame initialLocale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <article className="bg-vexa-ink text-white" dir={ar ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="vexa-container py-10 sm:py-14">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-400">
              <a href={localizePath('/', locale)} className="transition hover:text-white">{ar ? 'المتجر' : 'Store'}</a>
              <span aria-hidden="true">/</span>
              <a href={localizePath('/blog', locale)} className="transition hover:text-white">{ar ? 'المدونة' : 'Blog'}</a>
              <span aria-hidden="true">/</span>
              <a href={localizePath(`/blog/${blogCategory}`, locale)} className="transition hover:text-white">{ar ? cat.nameAr : cat.name}</a>
            </nav>

            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <a href={localizePath(`/blog/${blogCategory}`, locale)} className="vexa-eyebrow hover:text-vexa-pink-hover">{ar ? cat.nameAr : cat.name}</a>
                <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h1>
                <p className="vexa-lead mt-5 max-w-2xl">{excerpt}</p>
                <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-stone-400">
                  <span>{ar ? 'فريق تحرير فيكسا تويز' : 'Vexa Toys Editorial Team'}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={new Date(post.updatedAt || post.publishedAt).toISOString()}>
                    {ar ? 'آخر تحديث' : 'Updated'} {formatDate(post.updatedAt || post.publishedAt, ar)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} {ar ? 'دقائق قراءة' : 'min read'}</span>
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-vexa-raised">
                  <img
                    src={image.src}
                    alt={image.isFallback ? '' : title}
                    aria-hidden={image.isFallback ? 'true' : undefined}
                    width={1376}
                    height={768}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body + sidebar */}
        <div className="vexa-container py-10 sm:py-14">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ArticleBody markdown={markdown} />

              {/* Sources */}
              {sources.length > 0 && (
                <aside className="mt-12 rounded-2xl border border-white/10 bg-vexa-surface p-5">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-stone-400">{ar ? 'مصادر وقراءات إضافية' : 'Sources and further reading'}</h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {sources.map(source => (
                      <li key={source.href}>
                        <a href={source.href} target="_blank" rel="noopener noreferrer" className="vexa-link">{ar ? source.ar : source.en}</a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-6 text-stone-500">
                    {ar
                      ? 'مراجع صحية عامة. هذا المقال للمعلومات فقط وليس نصيحة طبية.'
                      : 'General health references. This article is for information only and is not medical advice.'}
                  </p>
                </aside>
              )}

              {/* Author */}
              <aside className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-vexa-surface p-5 sm:flex-row sm:items-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vexa-pink text-sm font-black text-white">VT</span>
                <div>
                  <p className="font-bold text-white">{ar ? 'فريق تحرير فيكسا تويز' : 'Vexa Toys Editorial Team'}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-400">
                    {ar
                      ? 'نكتب عن المنتجات التي نبيعها فعلاً في لبنان، من دون أرقام مبالغ فيها أو وعود طبية. '
                      : 'We write about the products we actually sell in Lebanon, without inflated numbers or medical promises. '}
                    <a href={localizePath('/about', locale)} className="vexa-link">{ar ? 'عن فيكسا تويز' : 'About Vexa Toys'}</a>
                  </p>
                </div>
              </aside>
            </div>

            <aside className="lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-28">
                {headings.length > 1 && (
                  <nav aria-label={ar ? 'محتويات المقال' : 'Article contents'} className="vexa-card p-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">{ar ? 'في هذا المقال' : 'In this article'}</p>
                    <ol className="mt-3 space-y-2 text-sm">
                      {headings.map(heading => (
                        <li key={heading.id}>
                          <a href={`#${heading.id}`} className="text-stone-300 transition hover:text-vexa-pink">{heading.text}</a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                <div className="vexa-card p-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">{ar ? 'تسوّق ما يتناوله المقال' : 'Shop what this covers'}</p>
                  <ul className="mt-3 space-y-2">
                    {shopSlugs.map(shopSlug => (
                      <li key={shopSlug}>
                        <a href={localizePath(`/${shopSlug}`, locale)} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-vexa-raised px-4 py-3 text-sm font-bold text-white transition hover:border-vexa-pink/60 hover:text-vexa-pink">
                          {ar ? `${shopCategoryName(shopSlug, true)} في لبنان` : `${shopCategoryName(shopSlug, false)} in Lebanon`}
                          <span aria-hidden="true" className="text-vexa-pink">{ar ? '←' : '→'}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-6 text-stone-400">
                    {ar ? 'تغليف عادي مغلق، توصيل إلى كل لبنان، والدفع عند الاستلام.' : 'Plain sealed packaging, delivery across Lebanon, cash on delivery.'}
                  </p>
                  <a href="https://wa.me/96176730767" target="_blank" rel="noopener noreferrer" className="vexa-btn-secondary mt-4 w-full">
                    {ar ? 'اسأل على واتساب' : 'Ask on WhatsApp'}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related */}
        <section className="border-t border-white/10">
          <div className="vexa-container vexa-section">
            <p className="vexa-eyebrow">{ar ? 'تابع القراءة' : 'Keep reading'}</p>
            <h2 className="vexa-h2 mt-2">{ar ? 'مقالات ذات صلة' : 'Related articles'}</h2>
            <div className="vexa-h2-bar" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...related, ...fallbackRelated].map(p => <BlogCard key={p.id} post={p} isArabic={ar} />)}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={localizePath(`/blog/${blogCategory}`, locale)} className="vexa-btn-secondary">{ar ? `كل مقالات ${cat.nameAr}` : `All ${cat.name} articles`}</a>
              <a href={localizePath('/blog', locale)} className="vexa-link self-center text-sm">{ar ? 'العودة إلى المدونة' : 'Back to the blog'}</a>
            </div>
          </div>
        </section>
      </article>
    </SiteFrame>
  );
}
