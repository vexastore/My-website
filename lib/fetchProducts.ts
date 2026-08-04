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

// مستخدم anonymous واحد لكل Next.js process — يُجدَّد بـ refreshToken بدل إنشاء مستخدم جديد
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _prodAuth: { token: string | null; expiry: number; refresh: string | null } =
  (globalThis as any).__vexa_fetchproducts_auth
  ?? ((globalThis as any).__vexa_fetchproducts_auth = { token: null, expiry: 0, refresh: null });

async function getIdToken(): Promise<string | null> {
  try {
    if (_prodAuth.token && Date.now() < _prodAuth.expiry) return _prodAuth.token;

    if (_prodAuth.refresh) {
      const r = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: _prodAuth.refresh }) }
      );
      if (r.ok) {
        const d = await r.json() as { id_token: string; refresh_token: string; expires_in: string };
        _prodAuth.token   = d.id_token;
        _prodAuth.refresh = d.refresh_token;
        _prodAuth.expiry  = Date.now() + (parseInt(d.expires_in, 10) - 60) * 1000;
        return _prodAuth.token;
      }
    }

    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnSecureToken: true }) }
    );
    const data = await res.json() as { idToken?: string; refreshToken?: string; expiresIn?: string };
    if (!data.idToken) return null;
    _prodAuth.token   = data.idToken;
    _prodAuth.refresh = data.refreshToken ?? null;
    _prodAuth.expiry  = Date.now() + (parseInt(data.expiresIn ?? '3600', 10) - 60) * 1000;
    return _prodAuth.token;
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

// Wrap a promise with a hard timeout. Resolves to `fallback` if it fires.
// Used to keep _fetchProductsLive within Vercel's function execution budget.
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms)),
  ]);
}

async function _fetchProductsLive(): Promise<Product[]> {
  try {
    const idToken = await getIdToken();
    if (!idToken) return STATIC_PRODUCTS as Product[];

    const headers = { Authorization: `Bearer ${idToken}` };

    // products + deleted_products are fetched without a timeout — they are
    // critical (no products = blank store) and are always fast (<1 s).
    //
    // product_images (gallery) has a 20-second timeout. This is much more
    // generous than the old 6-second race, giving Firebase time to respond
    // on cold starts, while still keeping us inside Vercel's 30-second
    // function limit. The old 6-second race was firing too often, causing
    // every product to land with image:"" and triggering the CDN cold-path
    // on /api/img/{id}. 20 s keeps the function safe without burning images.
    const [prodDocs, delDocs, galleryDocs] = await Promise.all([
      fetchAllDocs('products', headers, 300),
      fetchAllDocs('deleted_products', headers, 300),
      withTimeout(fetchAllDocs('product_images', headers, 300), 20_000, []),
    ]);

    const deletedIds = new Set(delDocs.map(d => d.name.split('/').pop()!));
    const galleryMap = buildGalleryMap(galleryDocs);

    // Diagnostic: shows in Vercel function logs so we can see if the gallery
    // fetch is producing images or timing out.
    const galleryHits = Object.keys(galleryMap).length;
    console.warn(`[VEXA_IMG] fetchProductsServer: gallery_docs=${galleryDocs.length} gallery_with_images=${galleryHits} timed_out=${galleryDocs.length === 0}`);

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

// Cached 24h — keeps Firestore reads well within the free-tier 50K/day limit.
// With a 1-hour TTL and ~5 Vercel instances, products alone burned ~18K reads/day.
// At 24h the same load costs ~750 reads/day, leaving ample headroom.
// Admin changes (add/edit/delete) call revalidateTag('vexa-products') to bust
// the cache instantly — so merchants see updates immediately, not after 24h.
// Falls back to static list if Firebase is unreachable.
export const fetchProductsServer = unstable_cache(
  _fetchProductsLive,
  ['vexa-products-live-v8'],
  { revalidate: 86400, tags: ['vexa-products'] }
);
