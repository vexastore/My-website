import { unstable_cache } from 'next/cache';
import { STATIC_PRODUCTS } from './staticProducts';
import { Product } from '@/src/types';

const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT = 'vexa-store';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

type FsValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
};
type FsDoc = { name: string; fields?: Record<string, FsValue> };

function str(v?: FsValue): string { return v?.stringValue || ''; }
function num(v?: FsValue): number {
  if (v?.integerValue != null) return Number(v.integerValue);
  if (v?.doubleValue   != null) return v.doubleValue;
  return 0;
}
function bool(v?: FsValue): boolean { return v?.booleanValue || false; }
function strArr(v?: FsValue): string[] {
  return (v?.arrayValue?.values || []).map(i => i.stringValue || '').filter(Boolean);
}

function docToProduct(doc: FsDoc): Product {
  const f = doc.fields || {};
  const id = doc.name.split('/').pop()!;
  return {
    id,
    name:          str(f.name),
    nameEn:        str(f.nameEn),
    description:   str(f.description),
    descriptionEn: str(f.descriptionEn),
    price:         num(f.price),
    image:         str(f.image),
    images:        strArr(f.images),
    category:      str(f.category) as Product['category'],
    categories:    strArr(f.categories) as Product['category'][],
    rating:        num(f.rating) || 5,
    reviewsCount:  num(f.reviewsCount),
    stock:         num(f.stock),
    isNew:         bool(f.isNew),
    slug:          str(f.slug),
    categorySlug:  str(f.categorySlug).toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-').trim(),
    link:          str(f.link),
    variants: (f.variants?.arrayValue?.values || []).map(v => ({
      name:    v.mapValue?.fields?.name?.stringValue    || '',
      nameEn:  v.mapValue?.fields?.nameEn?.stringValue  || '',
      options: (v.mapValue?.fields?.options?.arrayValue?.values || [])
                 .map(o => o.stringValue || '').filter(Boolean),
    })),
  } as Product;
}

async function getIdToken(): Promise<string | null> {
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnSecureToken: true }) }
    );
    const data = await res.json() as { idToken?: string };
    return data.idToken || null;
  } catch { return null; }
}

async function fetchAllDocs(
  collection: string,
  headers: Record<string, string>,
  pageSize = 300,
): Promise<FsDoc[]> {
  const docs: FsDoc[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(`${BASE}/${collection}`);
    url.searchParams.set('pageSize', String(pageSize));
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) break;

    const data = await res.json() as { documents?: FsDoc[]; nextPageToken?: string };
    docs.push(...(data.documents || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return docs;
}

// Build a map of productId → { image, images[] } from the product_images gallery.
// product_images is the authoritative source: admin-uploaded photos go here first.
function buildGalleryMap(galleryDocs: FsDoc[]): Record<string, { image: string; images: string[] }> {
  const map: Record<string, { image: string; images: string[] }> = {};
  for (const d of galleryDocs) {
    const id = d.name.split('/').pop()!;
    const imgs = (d.fields?.images?.arrayValue?.values || [])
      .map((v: FsValue) => v.stringValue || '').filter(Boolean);
    if (imgs.length > 0) map[id] = { image: imgs[0], images: imgs };
  }
  return map;
}

async function _fetchProductsLive(): Promise<Product[]> {
  try {
    const idToken = await getIdToken();
    if (!idToken) return STATIC_PRODUCTS as Product[];

    const headers = { Authorization: `Bearer ${idToken}` };

    // Fetch products, deleted products, and gallery images in parallel.
    // product_images is the authoritative image source — no timeout race.
    // This function is wrapped in unstable_cache (5 min TTL), so Firebase
    // is only called once per cache window, not on every request. The old
    // 6-second race timeout was silently discarding all gallery images
    // whenever Firebase was slow, causing every product to render without
    // an image and fall back to /api/img/{id} on the CDN cold path.
    const [prodDocs, delDocs, galleryDocs] = await Promise.all([
      fetchAllDocs('products', headers, 300),
      fetchAllDocs('deleted_products', headers, 300),
      fetchAllDocs('product_images', headers, 300),
    ]);

    const deletedIds = new Set(delDocs.map(d => d.name.split('/').pop()!));
    const galleryMap = buildGalleryMap(galleryDocs);

    const fbProducts: Product[] = prodDocs
      .map(docToProduct)
      .filter(p => p.name || p.nameEn);

    const fbMap = new Map(fbProducts.map(p => [p.id, p]));
    const staticIds = new Set((STATIC_PRODUCTS as Product[]).map(p => p.id));

    const merged: Product[] = [
      ...(STATIC_PRODUCTS as Product[])
        .filter(p => !deletedIds.has(p.id))
        .map(p => {
          const fb = fbMap.get(p.id);
          const base = fb
            ? { ...fb, slug: fb.slug || p.slug, categorySlug: fb.categorySlug || p.categorySlug }
            : { ...p };
          // Gallery image takes priority over products/{id}.image which may be stale/empty
          const gallery = galleryMap[p.id];
          return gallery ? { ...base, image: gallery.image, images: gallery.images } : base;
        }),
      ...fbProducts
        .filter(p => !staticIds.has(p.id) && !deletedIds.has(p.id))
        .map(p => {
          const gallery = galleryMap[p.id];
          return gallery ? { ...p, image: gallery.image, images: gallery.images } : p;
        }),
    ];

    return merged.length > 0 ? merged : (STATIC_PRODUCTS as Product[]);
  } catch {
    return STATIC_PRODUCTS as Product[];
  }
}

// Cached for 5 minutes — new/edited/deleted products from admin panel
// appear on the site within 5 minutes, no redeploy needed.
// Falls back to static list if Firebase is unreachable.
export const fetchProductsServer = unstable_cache(
  _fetchProductsLive,
  ['vexa-products-live-v5'],
  { revalidate: 300 }
);
