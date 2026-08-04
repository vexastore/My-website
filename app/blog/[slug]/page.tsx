import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blogPosts';

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return { title: { absolute: 'Blog | Vexa Store Lebanon' } };

  const title = `${post.title} | Vexa Store Lebanon`;
  const description = post.excerpt.slice(0, 160);
  const pageUrl = `https://vexatoys.com/blog/${post.slug}`;
  const image = post.image || 'https://vexatoys.com/opengraph.jpg';

  return {
    title: { absolute: title },
    description,
    keywords: post.keywords?.join(', '),
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Vexa Store Lebanon',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@vexastore',
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `https://vexatoys.com/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Vexa Store Lebanon',
      url: 'https://vexatoys.com',
    },
    image: post.image || 'https://vexatoys.com/opengraph.jpg',
    keywords: post.keywords?.join(', '),
    inLanguage: 'en',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#050101] text-white">

        {/* Breadcrumb */}
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <nav className="flex items-center gap-2 text-xs text-stone-500">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition">Blog</Link>
              <span>/</span>
              <span className="text-stone-300 truncate max-w-[200px]">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article */}
        <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">

          {/* Header */}
          <header className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-purple-400 mb-3">
              Vexa Store Blog
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
              <span>{post.author}</span>
              <span>·</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-LB', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </header>

          {/* Arabic summary box */}
          {post.titleAr && (
            <div className="mb-8 p-5 rounded-2xl border border-white/10 bg-white/[0.03]" dir="rtl">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-purple-400 mb-2 text-right" dir="ltr">
                بالعربية
              </p>
              <h2 className="text-base font-black text-white mb-2">{post.titleAr}</h2>
              {post.excerptAr && (
                <p className="text-stone-400 text-sm leading-relaxed">{post.excerptAr}</p>
              )}
            </div>
          )}

          {/* English content */}
          <div className="text-stone-300 text-sm leading-[1.9] whitespace-pre-line mb-10">
            {post.content}
          </div>

          {/* Arabic content */}
          {post.contentAr && (
            <div className="mt-10 pt-10 border-t border-white/10" dir="rtl">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-purple-400 mb-6 text-right" dir="ltr">
                النسخة العربية الكاملة
              </p>
              <div className="text-stone-300 text-sm leading-[1.9] whitespace-pre-line">
                {post.contentAr}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-black text-white mb-1">Shop Discreetly in Lebanon</p>
              <p className="text-stone-400 text-sm">500+ products. Same-day delivery in Beirut. Cash on delivery.</p>
            </div>
            <Link
              href="/sex-toys"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-stone-200 transition active:scale-[0.98]"
            >
              Shop Now →
            </Link>
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link href="/blog" className="text-sm text-stone-500 hover:text-white transition">
              ← Back to all articles
            </Link>
          </div>

        </article>
      </div>
    </>
  );
}
