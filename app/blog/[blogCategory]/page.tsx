import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_CATEGORIES, getBlogCategory } from '@/lib/blogPosts';
import { fetchBlogPostsServer } from '@/lib/fetchArticles';
import { getStoreLocale } from '@/lib/storeLocale';
import { BlogHeader } from '@/src/components/BlogHeader';

interface Props { params: Promise<{ blogCategory: string }> }

export function generateStaticParams() {
  return BLOG_CATEGORIES.map(c => ({ blogCategory: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ar = await getStoreLocale() === 'ar';
  const { blogCategory } = await params;
  const cat = getBlogCategory(blogCategory);
  if (!cat) return { title: { absolute: 'Blog | Vexa Store Lebanon' } };

  const pageUrl = `https://vexatoys.com/blog/${blogCategory}`;
  return {
    title: { absolute: `${ar ? cat.nameAr : cat.name} | ${ar ? 'مدونة فيكسا' : 'Vexa Store Lebanon Blog'}` },
    description: ar ? cat.descriptionAr : cat.description + '. Vexa Store Lebanon.',
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${ar ? cat.nameAr : cat.name} | ${ar ? 'مدونة فيكسا' : 'Vexa Store Lebanon Blog'}`,
      description: ar ? cat.descriptionAr : cat.description + '. Vexa Store Lebanon.',
      locale: ar ? 'ar_LB' : 'en_US',
      url: pageUrl,
      siteName: 'Vexa Store Lebanon',
      type: 'website',
      images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: `${cat.name} – Vexa Store Lebanon Blog` }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@vexastore',
      title: `${cat.name} | Vexa Store Lebanon Blog`,
      description: cat.description,
      images: ['https://vexatoys.com/opengraph.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const locale = await getStoreLocale();
  const ar = locale === 'ar';
  const { blogCategory } = await params;
  const cat = getBlogCategory(blogCategory);
  if (!cat) notFound();

  const posts = (await fetchBlogPostsServer()).filter(post => post.categorySlug === blogCategory).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} | Vexa Store Blog`,
    url: `https://vexatoys.com/blog/${blogCategory}`,
    description: cat.description,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vexatoys.com/blog' },
        { '@type': 'ListItem', position: 3, name: cat.name, item: `https://vexatoys.com/blog/${blogCategory}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogHeader locale={locale} />
      <div className="min-h-screen bg-[#050101] text-white" dir={ar ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="border-b border-white/10 bg-black/40">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
              <Link href="/blog" className="hover:text-white transition">{ar ? 'المدونة' : 'Blog'}</Link>
              <span>/</span>
              <span className="text-white">{ar ? cat.nameAr : cat.name}</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{ar ? cat.nameAr : cat.name}</h1>
            <p className="text-stone-400 text-sm">{ar ? cat.descriptionAr : cat.description}</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-stone-500">
              <p className="font-bold">{ar ? 'لا توجد مقالات في هذه الفئة بعد.' : 'No articles in this category yet.'}</p>
              <Link href="/blog" className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block">{ar ? 'العودة إلى المدونة' : 'Back to Blog'}</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.categorySlug}/${post.slug}`}
                  className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-5 hover:border-purple-500/30 hover:bg-white/8 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-500">{post.readingTime} {ar ? 'دقائق قراءة' : 'min read'}</span>
                    <span className="text-stone-700">·</span>
                    <span className="text-[10px] text-stone-500">
                      {new Date(post.publishedAt).toLocaleDateString(ar ? 'ar-LB' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="font-black text-white group-hover:text-purple-200 transition text-sm sm:text-base leading-snug">
                    {ar ? post.titleAr || post.title : post.title}
                  </h2>
                  <p className="text-xs text-stone-400 leading-relaxed">{ar ? post.excerptAr || post.excerpt : post.excerpt}</p>
                  <span className="text-xs font-bold text-purple-400 group-hover:text-purple-300 transition">{ar ? 'اقرأ المقال ←' : 'Read article →'}</span>
                </Link>
              ))}
            </div>
          )}

          {/* All categories link */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-500 mb-4">{ar ? 'مواضيع أخرى' : 'Other Topics'}</h3>
            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.filter(c => c.slug !== blogCategory).map(c => (
                <Link
                  key={c.slug}
                  href={`/blog/${c.slug}`}
                  className="text-xs font-bold text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition"
                >
                  {ar ? c.nameAr : c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
