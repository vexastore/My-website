import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blogPosts';

export const metadata: Metadata = {
  title: 'Blog – Sex Toys & Intimacy Guides Lebanon | Vexa Store',
  description: 'Expert guides, tips, and advice on intimate products, relationships, and sexual wellness in Lebanon. Vexa Store Blog.',
  alternates: { canonical: 'https://vexatoys.com/blog' },
  openGraph: {
    title: 'Blog – Intimacy Guides Lebanon | Vexa Store',
    description: 'Expert guides on intimate products, relationships, and sexual wellness in Lebanon.',
    url: 'https://vexatoys.com/blog',
    siteName: 'Vexa Store Lebanon',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Vexa Store Lebanon Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexastore',
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Vexa Store Lebanon Blog',
  url: 'https://vexatoys.com/blog',
  description: 'Expert guides, tips, and advice on intimate products, relationships, and sexual wellness in Lebanon.',
  publisher: {
    '@type': 'Organization',
    name: 'Vexa Store Lebanon',
    url: 'https://vexatoys.com',
  },
};

export default function BlogIndex() {
  const recentPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#050101] text-white">
        {/* Hero */}
        <div className="border-b border-white/10 bg-black/40">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-purple-400 mb-3">Vexa Store</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Blog & Guides
            </h1>
            <p className="text-stone-400 max-w-xl text-sm leading-relaxed">
              Expert advice on intimate products, relationships, and sexual wellness — helping you make confident, informed choices.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-10 space-y-12">
          {/* Categories */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-stone-500 mb-4">Browse by Topic</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BLOG_CATEGORIES.map(cat => {
                const count = BLOG_POSTS.filter(p => p.categorySlug === cat.slug).length;
                return (
                  <Link
                    key={cat.slug}
                    href={`/blog/${cat.slug}`}
                    className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-5 hover:border-purple-500/40 hover:bg-white/10 transition"
                  >
                    <span className="font-black text-white group-hover:text-purple-300 transition">{cat.name}</span>
                    <span className="text-xs text-stone-400">{cat.description}</span>
                    <span className="mt-1 text-[10px] font-bold text-purple-400">{count} article{count !== 1 ? 's' : ''}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* All Posts */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-stone-500 mb-6">All Articles</h2>
            <div className="space-y-4">
              {recentPosts.map(post => {
                const cat = BLOG_CATEGORIES.find(c => c.slug === post.categorySlug);
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.categorySlug}/${post.slug}`}
                    className="group flex flex-col sm:flex-row gap-4 rounded-xl border border-white/10 bg-white/5 p-5 hover:border-purple-500/30 hover:bg-white/8 transition"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">
                          {cat?.name}
                        </span>
                        <span className="text-[10px] text-stone-500">{post.readingTime} min read</span>
                      </div>
                      <h3 className="font-black text-white group-hover:text-purple-200 transition text-sm sm:text-base leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <p className="text-[10px] text-stone-600">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="sm:self-center shrink-0">
                      <span className="text-stone-600 group-hover:text-purple-400 transition text-xs font-bold">Read →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
