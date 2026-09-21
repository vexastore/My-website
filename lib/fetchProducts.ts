import { unstable_cache } from 'next/cache';
import { CACHE_KEYS, CACHE_TAGS } from './cacheVersion';
import type { Product, ProductVariant } from '@/src/types';
import { displayCopy } from './displayCopy';
import { SLUG_TO_CATEGORY } from './categoryMeta';

type Category = { slug: string; name_en: string };
type Media = { source_url: string | null; storage_path: string | null; position: number; is_primary: boolean; is_active: boolean; alt_en: string; alt_ar: string };
type Option = { value_en: string; price_delta: number; stock: number | null; sku: string | null; position: number; is_active: boolean };
type Variant = { name_en: string; name_ar: string; is_required: boolean; position: number; is_active: boolean; product_variant_options: Option[] };
type Row = {
  id: string; legacy_id: string | null; slug: string; sku: string | null; name_en: string; name_ar: string;
  description_en: string; description_ar: string; price: number; stock: number; currency: string; updated_at: string;
  seo_title_en: string | null; seo_title_ar: string | null;
  seo_description_en: string | null; seo_description_ar: string | null;
  rating: number; reviews_count: number; is_new: boolean;
  canonical_category: Category | null;
  product_categories: { categories: Category | null }[];
  product_media: Media[]; product_variants: Variant[];
};

const select = [
  'id,legacy_id,slug,sku,name_en,name_ar,description_en,description_ar,price,stock,currency,updated_at,seo_title_en,seo_title_ar,seo_description_en,seo_description_ar,rating,reviews_count,is_new',
  'canonical_category:categories!products_canonical_category_id_fkey(slug,name_en)',
  'product_categories(categories(slug,name_en))',
  'product_media(source_url,storage_path,position,is_primary,is_active,alt_en,alt_ar)',
  'product_variants(name_en,name_ar,is_required,position,is_active,product_variant_options(value_en,price_delta,stock,sku,position,is_active))',
].join(',');

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase storefront configuration is missing');
  return { url, key };
}

function mediaUrl(media: Media, base: string): string {
  if (media.storage_path) return `${base}/storage/v1/object/public/store-media/${media.storage_path.split('/').map(encodeURIComponent).join('/')}`;
  return media.source_url?.startsWith('https://') ? media.source_url : '';
}

export function mapProduct(row: Row, base: string): Product {
  const categories = row.product_categories.map(link => link.categories &&
    (SLUG_TO_CATEGORY[link.categories.slug] || link.categories.name_en)
  ).filter((name): name is string => !!name);
  const media = row.product_media.filter(item => item.is_active)
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position)
    .map(item => ({ url: mediaUrl(item, base), altEn: displayCopy(item.alt_en), altAr: displayCopy(item.alt_ar) }))
    .filter(item => item.url);
  const variants: ProductVariant[] = row.product_variants.filter(item => item.is_active)
    .sort((a, b) => a.position - b.position).map(item => {
      const options = item.product_variant_options.filter(option => option.is_active)
        .sort((a, b) => a.position - b.position);
      return {
        name: displayCopy(item.name_ar), nameEn: displayCopy(item.name_en), isRequired: item.is_required,
        options: options.map(option => option.value_en),
        optionPriceDeltas: Object.fromEntries(options.map(option => [option.value_en, Number(option.price_delta)])),
        optionStock: Object.fromEntries(options.map(option => [option.value_en, option.stock])),
        optionSkus: Object.fromEntries(options.map(option => [option.value_en, option.sku])),
      };
    });
  return {
    id: row.id, legacyId: row.legacy_id || undefined, slug: row.slug, sku: row.sku || undefined,
    currency: row.currency, updatedAt: row.updated_at,
    seoTitleEn: row.seo_title_en?.trim() || undefined, seoTitleAr: row.seo_title_ar?.trim() || undefined,
    seoDescriptionEn: row.seo_description_en?.trim() || undefined, seoDescriptionAr: row.seo_description_ar?.trim() || undefined,
    categorySlug: row.canonical_category?.slug || '',
    name: displayCopy(row.name_ar), nameEn: displayCopy(row.name_en),
    description: displayCopy(row.description_ar), descriptionEn: displayCopy(row.description_en),
    price: Number(row.price), stock: row.stock, rating: Number(row.rating),
    reviewsCount: row.reviews_count, isNew: row.is_new,
    category: (row.canonical_category && (SLUG_TO_CATEGORY[row.canonical_category.slug] || row.canonical_category.name_en) || categories[0] || 'Sex Toys') as Product['category'],
    categories: categories as Product['categories'], image: media[0]?.url || '', images: media.map(item => item.url),
    imageAltsEn: media.map(item => item.altEn), imageAltsAr: media.map(item => item.altAr), variants,
  };
}

export async function fetchPublishedProducts(): Promise<Product[]> {
  const { url, key } = config();
  const endpoint = new URL(`${url}/rest/v1/products`);
  endpoint.searchParams.set('select', select);
  endpoint.searchParams.set('status', 'eq.published');
  endpoint.searchParams.set('order', 'created_at.asc');
  endpoint.searchParams.set('limit', '1000');
  const response = await fetch(endpoint, { headers: { apikey: key }, cache: 'no-store' });
  if (!response.ok) throw new Error(`Supabase catalog read failed: ${response.status}`);
  return ((await response.json()) as Row[]).map(row => mapProduct(row, url));
}

// An unavailable database must never resurrect an archived product from static data.
export const fetchProductsServer = unstable_cache(fetchPublishedProducts, [CACHE_KEYS.PRODUCTS], {
  revalidate: 300, tags: [CACHE_TAGS.PRODUCTS],
});
