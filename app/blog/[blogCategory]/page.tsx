import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, BLOG_CATEGORIES, getBlogCategory, getBlogPostsByCategory } from '@/lib/blogPosts';

interface Props { params: Promise<{ blogCategory: string }> }

export function generateStaticParams() {
  return BLOG_CATEGORIES.map(c => ({ blogCategory: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogCategory } = await params;
  const cat = getBlogCategory(blogCategory);
  if (!cat) return { title: 'Blog | Vexa Store Lebanon' };

  const pageUrl = `https://vexatoys.com/blog/${blogCategory}`;
  return {
    title: `${cat.name} | Vexa Store Lebanon Blog`,
    description: cat.description + ' – Vexa Store Lebanon.',
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${cat.name} | Vexa Store Lebanon Blog`,
      description: cat.description,
      url: pageUrl,
      siteName: 'Vexa Store Lebanon',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { blogCategory } = await params;
  const cat = getBlogCategory(blogCategory);
  if (!cat) notFound();

  const posts = getBlogPostsByCategory(blogCategory).sort(
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
      <div className="min-h-screen bg-[#050101] text-white">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/40">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
              <Link href="/blog" className="hover:text-white transition">Blog</Link>
              <span>/</span>
              <span className="text-white">{cat.name}</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{cat.name}</h1>
            <p className="text-stone-400 text-sm">{cat.description}</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-stone-500">
              <p className="font-bold">No articles in this category yet.</p>
              <Link href="/blog" className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block">← Back to Blog</Link>
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
                    <span className="text-[10px] text-stone-500">{post.readingTime} min read</span>
                    <span className="text-stone-700">·</span>
                    <span className="text-[10px] text-stone-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="font-black text-white group-hover:text-purple-200 transition text-sm sm:text-base leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs text-stone-400 leading-relaxed">{post.excerpt}</p>
                  <span className="text-xs font-bold text-purple-400 group-hover:text-purple-300 transition">Read article →</span>
                </Link>
              ))}
            </div>
          )}

          {/* All categories link */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-500 mb-4">Other Topics</h3>
            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.filter(c => c.slug !== blogCategory).map(c => (
                <Link
                  key={c.slug}
                  href={`/blog/${c.slug}`}
                  className="text-xs font-bold text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
