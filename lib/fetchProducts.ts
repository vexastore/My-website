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
    categorySlug:  str(f.categorySlug),
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

async function _fetchProductsLive(): Promise<Product[]> {
  try {
    const idToken = await getIdToken();
    if (!idToken) return STATIC_PRODUCTS as Product[];

    const headers = { Authorization: `Bearer ${idToken}` };

    const [prodRes, delRes] = await Promise.all([
      fetch(`${BASE}/products?pageSize=300`, { headers }),
      fetch(`${BASE}/deleted_products?pageSize=500`, { headers }),
    ]);

    const [prodData, delData] = await Promise.all([
      prodRes.ok ? prodRes.json() as Promise<{ documents?: FsDoc[] }> : Promise.resolve({ documents: [] as FsDoc[] }),
      delRes.ok  ? delRes.json()  as Promise<{ documents?: FsDoc[] }> : Promise.resolve({ documents: [] as FsDoc[] }),
    ]);

    const deletedIds = new Set(
      (delData.documents || []).map(d => d.name.split('/').pop()!)
    );

    const fbProducts: Product[] = (prodData.documents || [])
      .map(docToProduct)
      .filter(p => p.name || p.nameEn);

    const fbMap = new Map(fbProducts.map(p => [p.id, p]));
    const staticIds = new Set((STATIC_PRODUCTS as Product[]).map(p => p.id));

    const merged: Product[] = [
      // Static products — use Firebase version if admin edited them, skip if deleted
      ...(STATIC_PRODUCTS as Product[])
        .filter(p => !deletedIds.has(p.id))
        .map(p => fbMap.get(p.id) || p),
      // New products added by admin (not in static list)
      ...fbProducts.filter(p => !staticIds.has(p.id) && !deletedIds.has(p.id)),
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
  ['vexa-products-live-v3'],
  { revalidate: 300 }
);
