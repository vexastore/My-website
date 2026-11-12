import React from 'react';
import type { BlogPost } from '@/lib/blogPosts';
import { BLOG_CATEGORIES } from '@/lib/blogPosts';
import { featuredImage, formatDate } from '@/lib/blogContent';
import { localizePath } from '@/lib/localePath';

interface BlogCardProps {
  post: BlogPost;
  isArabic: boolean;
  /** Large layout for the newest article. */
  featured?: boolean;
  /** Eager-load the image when the card is above the fold. */
  priority?: boolean;
}

export function BlogCard({ post, isArabic, featured = false, priority = false }: BlogCardProps) {
  const category = BLOG_CATEGORIES.find(item => item.slug === post.categorySlug);
  const title = isArabic ? post.titleAr || post.title : post.title;
  const excerpt = isArabic ? post.excerptAr || post.excerpt : post.excerpt;
  const image = featuredImage(post);
  const href = localizePath(`/blog/${post.categorySlug}/${post.slug}`, isArabic ? 'ar' : 'en');

  return (
    <a
      href={href}
      className={`vexa-card vexa-card-interactive group flex overflow-hidden ${featured ? 'flex-col lg:flex-row' : 'flex-col'}`}
    >
      <div className={`relative overflow-hidden bg-vexa-raised ${featured ? 'aspect-[16/9] lg:aspect-auto lg:w-1/2' : 'aspect-[16/10]'}`}>
        <img
          src={image.src}
          alt={image.isFallback ? '' : title}
          aria-hidden={image.isFallback ? 'true' : undefined}
          width={1376}
          height={768}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vexa-surface/90 via-transparent to-transparent" />
        {category && (
          <span className="absolute start-4 top-4 rounded-full bg-vexa-pink px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
            {isArabic ? category.nameAr : category.name}
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col p-5 ${featured ? 'justify-center lg:p-8' : ''}`}>
        {featured ? (
          <h2 className="text-2xl font-black leading-tight text-white transition-colors group-hover:text-vexa-pink sm:text-3xl">{title}</h2>
        ) : (
          <h3 className="text-base font-bold leading-snug text-white transition-colors group-hover:text-vexa-pink sm:text-lg">{title}</h3>
        )}
        <p className={`mt-3 text-sm leading-7 text-stone-400 ${featured ? 'line-clamp-4' : 'line-clamp-3'}`}>{excerpt}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-stone-500">
          <span>{formatDate(post.publishedAt, isArabic)}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime} {isArabic ? 'دقائق قراءة' : 'min read'}</span>
        </p>
      </div>
    </a>
  );
}
