import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_CATEGORIES, getBlogCategory } from '@/lib/blogPosts';
import { fetchBlogPostsServer, fetchBlogPostServer } from '@/lib/fetchArticles';
import { getStoreLocale } from '@/lib/storeLocale';
import { BlogHeader } from '@/src/components/BlogHeader';

interface Props { params: Promise<{ blogCategory: string; slug: string }> }

export const revalidate = 300;

export function generateStaticParams() {
  return []; // Dynamic Supabase articles are resolved at request time.
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ar = await getStoreLocale() === 'ar';
  const { blogCategory, slug } = await params;
  const post = await fetchBlogPostServer(slug);
  if (!post || post.categorySlug !== blogCategory || !getBlogCategory(blogCategory)) return { robots: { index: false, follow: false } };

  const pageUrl = `https://vexatoys.com/blog/${blogCategory}/${slug}`;
  const title = (ar ? post.seoTitleAr : post.seoTitleEn) || `${ar ? post.titleAr || post.title : post.title} | ${ar ? 'متجر فيكسا' : 'Vexa Toys Lebanon'}`;
  const description = (ar ? post.seoDescriptionAr : post.seoDescriptionEn) || (ar ? post.excerptAr || post.excerpt : post.excerpt);
  const image = post.image || 'https://vexatoys.com/opengraph.jpg';
  return {
    title: { absolute: title },
    description,
    keywords: (ar ? post.keywordsAr : post.keywords)?.join(', '),
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      locale: ar ? 'ar_LB' : 'en_US',
      url: pageUrl,
      siteName: 'Vexa Toys Lebanon',
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt || post.publishedAt).toISOString(),
      authors: [post.author],
      images: [{ url: image, alt: ar ? post.titleAr || post.title : post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@vexatoys',
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

/** Renders simple Markdown-ish content (headers, bold, lists, tables, paragraphs) */
function renderContent(md: string): React.ReactNode {
  const lines = md.trim().split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  const inlineMd = (text: string) => {
    // Handle bold **text** and inline code `code`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={idx} className="font-black text-white">{part.slice(2, -2)}</strong>;
      if (part.startsWith('`') && part.endsWith('`'))
        return <code key={idx} className="text-purple-300 bg-white/5 px-1 rounded text-xs">{part.slice(1, -1)}</code>;
      return part;
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) { i++; continue; }

    // H2
    if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={i} className="text-lg sm:text-xl font-black text-white mt-8 mb-3 pt-4 border-t border-white/10">
          {line.slice(3)}
        </h2>
      );
      i++; continue;
    }

    // H3
    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={i} className="text-base font-black text-stone-200 mt-5 mb-2">
          {line.slice(4)}
        </h3>
      );
      i++; continue;
    }

    // Table (starts with |)
    if (line.startsWith('|')) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!lines[i].replace(/\|/g, '').replace(/-/g, '').trim()) { i++; continue; }
        tableRows.push(lines[i].split('|').filter(c => c.trim() !== '').map(c => c.trim()));
        i++;
      }
      if (tableRows.length > 0) {
        nodes.push(
          <div key={`table-${i}`} className="overflow-x-auto my-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  {tableRows[0].map((cell, ci) => (
                    <th key={ci} className="bg-white/10 text-white font-black px-3 py-2 text-left border border-white/10">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-b border-white/5">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-stone-300 border border-white/5">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="list-none space-y-1.5 my-3 pl-0">
          {listItems.map((item, li) => (
            <li key={li} className="text-stone-300 text-sm leading-relaxed flex gap-2">
              <span className="text-purple-400 mt-0.5 shrink-0">•</span>
              <span>{inlineMd(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="list-none space-y-1.5 my-3 pl-0">
          {listItems.map((item, li) => (
            <li key={li} className="text-stone-300 text-sm leading-relaxed flex gap-3">
              <span className="text-purple-400 font-black shrink-0 w-4">{li + 1}.</span>
              <span>{inlineMd(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Checkbox-style list (✅ ❌ ⚠️)
    if (/^[✅❌⚠️]/.test(line) || line.startsWith('- **')) {
      // Regular paragraph fallthrough
    }

    // Paragraph
    if (line.trim()) {
      nodes.push(
        <p key={i} className="text-stone-300 text-sm leading-relaxed mb-3">
          {inlineMd(line)}
        </p>
      );
    }
    i++;
  }

  return <>{nodes}</>;
}

export default async function BlogArticlePage({ params }: Props) {
  const locale = await getStoreLocale();
  const ar = locale === 'ar';
  const { blogCategory, slug } = await params;
  const post = await fetchBlogPostServer(slug);
  if (!post || post.categorySlug !== blogCategory) notFound();

  const cat = getBlogCategory(blogCategory);
  if (!cat) notFound(); // guard against stale static param with no matching category
  const pageUrl = `https://vexatoys.com/blog/${blogCategory}/${slug}`;

  // Related posts from same category
  const related = (await fetchBlogPostsServer())
    .filter(p => p.categorySlug === blogCategory && p.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Vexa Toys', item: 'https://vexatoys.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vexatoys.com/blog' },
          { '@type': 'ListItem', position: 3, name: ar ? cat.nameAr : cat.name, item: `https://vexatoys.com/blog/${blogCategory}` },
          { '@type': 'ListItem', position: 4, name: ar ? post.titleAr || post.title : post.title, item: pageUrl },
        ],
      },
      {
        '@type': 'Article',
        headline: ar ? post.titleAr || post.title : post.title,
        description: ar ? post.excerptAr || post.excerpt : post.excerpt,
        url: pageUrl,
        datePublished: new Date(post.publishedAt).toISOString(),
        dateModified: new Date(post.updatedAt || post.publishedAt).toISOString(),
        author: { '@type': 'Organization', name: post.author },
        publisher: {
          '@type': 'Organization',
          name: 'Vexa Toys Lebanon',
          url: 'https://vexatoys.com',
          logo: { '@type': 'ImageObject', url: 'https://vexatoys.com/vexa-logo.png' },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        ...(post.image ? { image: post.image } : {}),
        keywords: post.keywords?.join(', '),
        inLanguage: locale,
        isPartOf: {
          '@type': 'Blog',
          name: 'Vexa Toys Lebanon Blog',
          url: 'https://vexatoys.com/blog',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogHeader locale={locale} />
      <div className="min-h-screen bg-[#050101] text-white" dir={ar ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="border-b border-white/10 bg-black/40">
          <div className="mx-auto max-w-3xl px-4 pt-8 pb-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-6 flex-wrap">
              <Link href="/" className="hover:text-white transition">{ar ? 'المتجر' : 'Store'}</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition">{ar ? 'المدونة' : 'Blog'}</Link>
              <span>/</span>
              <Link href={`/blog/${blogCategory}`} className="hover:text-white transition">{ar ? cat?.nameAr : cat?.name}</Link>
              <span>/</span>
              <span className="text-stone-400 truncate max-w-[200px]">{ar ? post.titleAr || post.title : post.title}</span>
            </nav>

            {/* Category badge */}
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-full">
              {ar ? cat?.nameAr : cat?.name}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-4 mb-4 leading-tight">
              {ar ? post.titleAr || post.title : post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-3 text-[11px] text-stone-500 flex-wrap">
              <span>{ar ? 'بقلم' : 'By'} {post.author}</span>
              <span>·</span>
              <span>{new Date(post.publishedAt).toLocaleDateString(ar ? 'ar-LB' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>·</span>
              <span>{post.readingTime} {ar ? 'دقائق قراءة' : 'min read'}</span>
            </div>

            {/* Excerpt */}
            <p className="mt-5 text-stone-400 text-sm leading-relaxed border-l-2 border-purple-500/40 pl-4">
              {ar ? post.excerptAr || post.excerpt : post.excerpt}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 py-10">
          <article className="prose-custom">
            {renderContent(ar ? post.contentAr || post.content : post.content)}
          </article>

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 text-center">
            <p className="font-black text-white mb-2">{ar ? 'جاهز للتسوق؟' : 'Ready to shop?'}</p>
            <p className="text-stone-400 text-sm mb-4">{ar ? 'توصيل سري لكل لبنان مع الدفع عند الاستلام.' : 'Discreet delivery anywhere in Lebanon. Cash on delivery.'}</p>
            <Link
              href="/sex-toys"
              className="inline-flex items-center gap-2 bg-white text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-stone-200 transition active:scale-[0.98]"
            >
              {ar ? 'تصفح المنتجات ←' : 'Browse Products →'}
            </Link>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-stone-500 mb-5">{ar ? 'مقالات ذات صلة' : 'Related Articles'}</h2>
              <div className="space-y-3">
                {related.map(p => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.categorySlug}/${p.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-purple-500/30 hover:bg-white/8 transition"
                  >
                    <div className="flex-1">
                      <p className="font-black text-sm text-white group-hover:text-purple-200 transition leading-snug">{ar ? p.titleAr || p.title : p.title}</p>
                      <p className="text-xs text-stone-500 mt-1">{p.readingTime} {ar ? 'دقائق قراءة' : 'min read'}</p>
                    </div>
                    <span className="text-stone-600 group-hover:text-purple-400 transition text-xs shrink-0 mt-0.5">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <div className="mt-10">
            <Link href="/blog" className="text-xs font-bold text-stone-500 hover:text-white transition">
              {ar ? 'العودة إلى المدونة' : 'Back to Blog'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
