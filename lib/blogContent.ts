import { localizePath } from './localePath';
import type { StoreLocale } from './storeLocaleShared';
import type { BlogPost } from './blogPosts';
import { SITE_BASE_URL } from './productSeo';

/**
 * Server-safe helpers for the blog: heading extraction, automatic internal
 * links to category pages, related categories, external sources, featured
 * image fallbacks and SEO titles. No React, no DOM.
 */

export interface Heading {
  id: string;
  text: string;
}

/** Articles start with their own "# Title" line; the page renders the H1, so drop it. */
export function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\s*#\s+[^\n]+\n+/, '');
}

export function slugifyHeading(text: string): string {
  const ascii = text.toLowerCase().replace(/[^a-z0-9؀-ۿ\s-]/g, '').trim().replace(/\s+/g, '-');
  return ascii || 'section';
}

/** H2 headings for the table of contents, with the ids ArticleBody assigns. */
export function extractHeadings(markdown: string): Heading[] {
  const seen = new Map<string, number>();
  return markdown.split('\n').filter(line => line.startsWith('## ')).map(line => {
    const text = line.slice(3).trim();
    const base = slugifyHeading(text);
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return { id: count ? `${base}-${count + 1}` : base, text };
  });
}

/** Category keywords -> route. Longer phrases first so "sex toys" does not shadow "male sex toys". */
const CATEGORY_LINKS: Array<{ pattern: RegExp; href: string; slug: string }> = [
  { pattern: /\bmale sex toys?\b/i, href: '/male-toys', slug: 'male-toys' },
  { pattern: /\bmale toys?\b/i, href: '/male-toys', slug: 'male-toys' },
  { pattern: /\bsex toys?\b/i, href: '/sex-toys', slug: 'sex-toys' },
  { pattern: /\badult toys?\b/i, href: '/adult-toys', slug: 'adult-toys' },
  { pattern: /\bvibrators?\b/i, href: '/vibrators', slug: 'vibrators' },
  { pattern: /\bdildos?\b/i, href: '/dildos', slug: 'dildos' },
  { pattern: /\blingerie\b/i, href: '/lingerie', slug: 'lingerie' },
  { pattern: /\bBDSM\b/, href: '/bdsm', slug: 'bdsm' },
  { pattern: /\bbondage\b/i, href: '/bondage', slug: 'bondage' },
  { pattern: /\bbutt plugs?\b/i, href: '/butt-plugs', slug: 'butt-plugs' },
  { pattern: /\banal (?:toys?|beads|plugs?)\b/i, href: '/anal-toys', slug: 'anal-toys' },
  { pattern: /\bcock rings?\b/i, href: '/cock-rings', slug: 'cock-rings' },
  { pattern: /\bpenis pumps?\b/i, href: '/penis-pumps', slug: 'penis-pumps' },
  { pattern: /\bmasturbators?\b|\bstrokers?\b/i, href: '/masturbators', slug: 'masturbators' },
  { pattern: /\blubricants?\b|\blube\b/i, href: '/lubricants', slug: 'lubricants' },
  { pattern: /\bkegel balls\b/i, href: '/kegel-balls', slug: 'kegel-balls' },
  { pattern: /\bstrap-ons?\b/i, href: '/strap-ons', slug: 'strap-ons' },
  { pattern: /\bsex dolls?\b/i, href: '/sex-dolls', slug: 'sex-dolls' },
  { pattern: /\bchastity\b/i, href: '/chastity', slug: 'chastity' },
  { pattern: /\bsex machines?\b/i, href: '/sex-machines', slug: 'sex-machines' },
  { pattern: /\bdelay sprays?\b/i, href: '/sexual-enhancers', slug: 'sexual-enhancers' },
  { pattern: /الهزازات|هزاز/, href: '/vibrators', slug: 'vibrators' },
  { pattern: /الديلدو|ديلدو/, href: '/dildos', slug: 'dildos' },
  { pattern: /اللانجري|لانجري/, href: '/lingerie', slug: 'lingerie' },
  { pattern: /المزلق|مزلق/, href: '/lubricants', slug: 'lubricants' },
  { pattern: /الألعاب الجنسية|ألعاب جنسية|الألعاب الزوجية/, href: '/sex-toys', slug: 'sex-toys' },
];

const MAX_AUTO_LINKS = 8;

/**
 * Link the first mention of each category keyword in body text to its
 * category page. Headings, existing links, bold markers and tables are left
 * alone, and at most eight links are added so the article stays readable.
 */
export function autoLinkCategories(markdown: string, locale: StoreLocale = 'en'): string {
  const used = new Set<string>();
  let added = 0;
  return markdown.split('\n').map(line => {
    if (!line.trim() || line.startsWith('#') || line.startsWith('|') || line.startsWith('![') || added >= MAX_AUTO_LINKS) return line;
    let out = line;
    for (const link of CATEGORY_LINKS) {
      if (used.has(link.slug) || added >= MAX_AUTO_LINKS) continue;
      // Split around existing markdown links so we never nest a link inside one.
      const segments = out.split(/(\[[^\]]*\]\([^)]*\))/);
      for (let i = 0; i < segments.length; i += 2) {
        const match = segments[i].match(link.pattern);
        if (!match || match.index === undefined) continue;
        const start = match.index;
        const end = start + match[0].length;
        segments[i] = `${segments[i].slice(0, start)}[${match[0]}](${localizePath(link.href, locale)})${segments[i].slice(end)}`;
        used.add(link.slug);
        added += 1;
        break;
      }
      out = segments.join('');
    }
    return out;
  }).join('\n');
}

/** Category routes this article should point readers to, from its slug, title and body. */
export function relatedCategorySlugs(post: BlogPost, max = 4): string[] {
  const haystack = `${post.slug} ${post.title} ${post.excerpt} ${post.content.slice(0, 4000)}`;
  const counts = new Map<string, number>();
  for (const link of CATEGORY_LINKS) {
    const matches = haystack.match(new RegExp(link.pattern.source, link.pattern.flags.includes('g') ? link.pattern.flags : link.pattern.flags + 'g'));
    if (matches) counts.set(link.slug, (counts.get(link.slug) || 0) + matches.length);
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([slug]) => slug).filter(slug => slug !== 'adult-toys');
  const picked = ranked.slice(0, max);
  if (picked.length === 0) picked.push('sex-toys');
  return picked;
}

export interface ExternalSource {
  href: string;
  en: string;
  ar: string;
}

/** Authoritative, non-commercial references shown under every article. */
export function externalSources(post: BlogPost): ExternalSource[] {
  const text = `${post.title} ${post.content}`.toLowerCase();
  const sources: ExternalSource[] = [];
  if (/clean|hygiene|wash|lubric|condom|silicone|material|safe/.test(text)) {
    sources.push({ href: 'https://www.nhs.uk/live-well/sexual-health/', en: 'NHS: Sexual health', ar: 'هيئة الصحة البريطانية NHS: الصحة الجنسية' });
  }
  sources.push({ href: 'https://www.who.int/health-topics/sexual-health', en: 'World Health Organization: Sexual health', ar: 'منظمة الصحة العالمية: الصحة الجنسية' });
  return sources.slice(0, 2);
}

/** Featured image when the article has none. Large brand photos, one per topic. */
export function fallbackImage(categorySlug: string): string {
  switch (categorySlug) {
    case 'guides': return '/images/mockup/guide-bg-center.webp';
    case 'tips': return '/images/mockup/hero-bg-right.webp';
    case 'relationships': return '/images/mockup/about-hero-bg.webp';
    default: return '/images/mockup/guide-bg-center.webp';
  }
}

export function featuredImage(post: BlogPost): { src: string; isFallback: boolean } {
  if (post.image) return { src: post.image, isFallback: false };
  return { src: fallbackImage(post.categorySlug), isFallback: true };
}

export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_BASE_URL}${path}`;
}

/** `<title>` for an article: the stored SEO title, else the headline trimmed to fit with the brand. */
export function articleTitle(post: BlogPost, isArabic: boolean): string {
  const stored = (isArabic ? post.seoTitleAr : post.seoTitleEn)?.trim();
  if (stored && stored.length <= 70) return stored;
  const headline = (isArabic ? post.titleAr || post.title : post.title).replace(/\s+/g, ' ').trim();
  const brand = isArabic ? ' | متجر فيكسا' : ' | Vexa Toys';
  // Google shows roughly 60 characters but indexes the whole title, so a
  // complete headline up to 75 beats a headline cut mid-phrase.
  if (headline.length + brand.length <= 75) return `${headline}${brand}`;
  // Prefer the part before a colon ("Complete Vibrator Guide: How to ..." -> "Complete Vibrator Guide").
  const beforeColon = headline.split(/[:|]/)[0].trim();
  if (beforeColon.length >= 25 && beforeColon.length + brand.length <= 65) return `${beforeColon}${brand}`;
  const room = 65 - brand.length;
  const cut = headline.slice(0, room + 1);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = (lastSpace > room * 0.6 ? cut.slice(0, lastSpace) : headline.slice(0, room))
    .replace(/[\s,:;-]+$/, '')
    .replace(/\s+(?:in|a|an|the|to|for|and|or|of|with|on)$/i, '');
  return `${trimmed}${brand}`;
}

export function articleDescription(post: BlogPost, isArabic: boolean): string {
  const stored = (isArabic ? post.seoDescriptionAr : post.seoDescriptionEn)?.trim();
  const text = (stored || (isArabic ? post.excerptAr || post.excerpt : post.excerpt)).replace(/\s+/g, ' ').trim();
  if (text.length <= 158) return text;
  const cut = text.slice(0, 156);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export function wordCount(markdown: string): number {
  return markdown.replace(/[#*`|>-]/g, ' ').split(/\s+/).filter(Boolean).length;
}

export function formatDate(iso: string, isArabic: boolean): string {
  return new Date(iso).toLocaleDateString(isArabic ? 'ar-LB' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}
