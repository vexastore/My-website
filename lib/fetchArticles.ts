import { unstable_cache } from 'next/cache';
import type { BlogPost } from './blogPosts';
import type { AdviceArticle } from '@/src/types';
import { displayCopy } from './displayCopy';

type Row = {
  id: string; slug: string; title_en: string; title_ar: string;
  excerpt_en: string; excerpt_ar: string; content_en: string; content_ar: string;
  category_en: string; category_ar: string; read_time_seconds: number;
  image_path: string | null; source_image_url: string | null;
  published_at: string | null; updated_at: string;
  seo_title_en: string | null; seo_title_ar: string | null;
  seo_description_en: string | null; seo_description_ar: string | null;
};

const categories: Record<string, string> = {
  'Product Guides': 'guides', 'Relationships & Intimacy': 'relationships',
  'Tips & Care': 'tips', Advice: 'advice',
};

function imageUrl(row: Row, base: string) {
  if (row.image_path) return `${base}/storage/v1/object/public/store-media/${row.image_path.split('/').map(encodeURIComponent).join('/')}`;
  return row.source_image_url?.startsWith('https://') ? row.source_image_url : undefined;
}

async function readArticles(): Promise<BlogPost[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) throw new Error('Supabase storefront configuration is missing');
  const endpoint = new URL(`${base}/rest/v1/articles`);
  endpoint.searchParams.set('select', 'id,slug,title_en,title_ar,excerpt_en,excerpt_ar,content_en,content_ar,category_en,category_ar,read_time_seconds,image_path,source_image_url,published_at,updated_at,seo_title_en,seo_title_ar,seo_description_en,seo_description_ar');
  endpoint.searchParams.set('status', 'eq.published');
  endpoint.searchParams.set('order', 'published_at.desc');
  endpoint.searchParams.set('limit', '1000');
  const response = await fetch(endpoint, { headers: { apikey: key }, cache: 'no-store' });
  if (!response.ok) throw new Error(`Supabase article read failed: ${response.status}`);
  return ((await response.json()) as Row[]).map(row => ({
    id: row.id, slug: row.slug, categorySlug: categories[row.category_en] || 'advice',
    title: displayCopy(row.title_en), titleAr: displayCopy(row.title_ar),
    excerpt: displayCopy(row.excerpt_en || row.content_en.slice(0, 180)),
    excerptAr: displayCopy(row.excerpt_ar || row.content_ar.slice(0, 180)),
    content: displayCopy(row.content_en), contentAr: displayCopy(row.content_ar),
    publishedAt: row.published_at || row.updated_at, updatedAt: row.updated_at,
    author: 'Vexa Store Team', readingTime: Math.max(1, Math.ceil(row.read_time_seconds / 60)),
    image: imageUrl(row, base),
    seoTitleEn: row.seo_title_en?.trim() || undefined, seoTitleAr: row.seo_title_ar?.trim() || undefined,
    seoDescriptionEn: row.seo_description_en?.trim() || undefined, seoDescriptionAr: row.seo_description_ar?.trim() || undefined,
  }));
}

export const fetchBlogPostsServer = unstable_cache(readArticles, ['supabase-articles-v1'], {
  revalidate: 300, tags: ['vexa-articles'],
});

export async function fetchBlogPostServer(slug: string) {
  return (await fetchBlogPostsServer()).find(post => post.slug === slug);
}

export async function fetchAdviceArticles(): Promise<AdviceArticle[]> {
  return (await fetchBlogPostsServer()).filter(post => post.categorySlug === 'advice').map(post => ({
    id: post.id, title: post.titleAr, titleEn: post.title,
    content: post.contentAr, contentEn: post.content,
    readTime: `${post.readingTime} min`, category: 'Advice',
    image: post.image || '', date: post.publishedAt,
  }));
}
