import { unstable_cache } from 'next/cache';
import type { Product, ProductVariant } from '@/src/types';

type Category = { slug: string; name_en: string };
type Media = { source_url: string | null; storage_path: string | null; position: number; is_primary: boolean; is_active: boolean };
type Option = { value_en: string; price_delta: number; stock: number | null; position: number; is_active: boolean };
type Variant = { name_en: string; name_ar: string; is_required: boolean; position: number; is_active: boolean; product_variant_options: Option[] };
type Row = {
  id: string; legacy_id: string | null; slug: string; name_en: string; name_ar: string;
  description_en: string; description_ar: string; price: number; stock: number;
  rating: number; reviews_count: number; is_new: boolean;
  canonical_category: Category | null;
  product_categories: { categories: Category | null }[];
  product_media: Media[]; product_variants: Variant[];
};

const select = [
  'id,legacy_id,slug,name_en,name_ar,description_en,description_ar,price,stock,rating,reviews_count,is_new',
  'canonical_category:categories!products_canonical_category_id_fkey(slug,name_en)',
  'product_categories(categories(slug,name_en))',
  'product_media(source_url,storage_path,position,is_primary,is_active)',
  'product_variants(name_en,name_ar,is_required,position,is_active,product_variant_options(value_en,price_delta,stock,position,is_active))',
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
  const categories = row.product_categories.map(link => link.categories?.name_en).filter((name): name is string => !!name);
  const media = row.product_media.filter(item => item.is_active)
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position)
    .map(item => mediaUrl(item, base)).filter(Boolean);
  const variants: ProductVariant[] = row.product_variants.filter(item => item.is_active)
    .sort((a, b) => a.position - b.position).map(item => {
      const options = item.product_variant_options.filter(option => option.is_active)
        .sort((a, b) => a.position - b.position);
      return {
        name: item.name_ar, nameEn: item.name_en, isRequired: item.is_required,
        options: options.map(option => option.value_en),
        optionPriceDeltas: Object.fromEntries(options.map(option => [option.value_en, Number(option.price_delta)])),
        optionStock: Object.fromEntries(options.map(option => [option.value_en, option.stock])),
      };
    });
  return {
    id: row.id, legacyId: row.legacy_id || undefined, slug: row.slug,
    categorySlug: row.canonical_category?.slug || '',
    name: row.name_ar, nameEn: row.name_en,
    description: row.description_ar, descriptionEn: row.description_en,
    price: Number(row.price), stock: row.stock, rating: Number(row.rating),
    reviewsCount: row.reviews_count, isNew: row.is_new,
    category: (row.canonical_category?.name_en || categories[0] || 'Sex Toys') as Product['category'],
    categories: categories as Product['categories'], image: media[0] || '', images: media, variants,
  };
}

async function fetchPublishedProducts(): Promise<Product[]> {
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
export const fetchProductsServer = unstable_cache(fetchPublishedProducts, ['supabase-products-v1'], {
  revalidate: 300, tags: ['vexa-products'],
});
