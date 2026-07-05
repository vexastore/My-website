import { permanentRedirect } from 'next/navigation';
import { CATEGORY_TO_SLUG } from '@/lib/categoryMeta';

// Case-insensitive lookup so old "?category=Sex+Machines" style links
// (and slug-ish variants like "sex machines" or "sex-machines") map to
// the correct category page instead of always falling back to /sex-toys.
const NORMALIZED_CATEGORY_TO_SLUG: Record<string, string> = {};
for (const [name, slug] of Object.entries(CATEGORY_TO_SLUG)) {
  NORMALIZED_CATEGORY_TO_SLUG[name.toLowerCase()] = slug;
  NORMALIZED_CATEGORY_TO_SLUG[slug] = slug;
  NORMALIZED_CATEGORY_TO_SLUG[name.toLowerCase().replace(/\s+/g, '-')] = slug;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const normalized = category?.trim().toLowerCase();
  const slug = (normalized && NORMALIZED_CATEGORY_TO_SLUG[normalized]) || 'sex-toys';
  permanentRedirect(`/${slug}`);
}
