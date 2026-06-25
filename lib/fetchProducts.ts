import { Product } from '@/src/types';

const FIREBASE_API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const FIREBASE_PROJECT = 'vexa-store';

function parseField(field: any): any {
  if (!field) return null;
  if ('stringValue' in field) return field.stringValue;
  if ('integerValue' in field) return Number(field.integerValue);
  if ('doubleValue' in field) return field.doubleValue;
  if ('booleanValue' in field) return field.booleanValue;
  if ('nullValue' in field) return null;
  if ('arrayValue' in field) return (field.arrayValue.values || []).map(parseField);
  if ('mapValue' in field) {
    const obj: any = {};
    for (const [k, v] of Object.entries(field.mapValue.fields || {})) obj[k] = parseField(v);
    return obj;
  }
  return null;
}

function toSlug(n: string): string {
  return (n || '').toLowerCase().replace(/[^a-z0-9s-]/g, '').replace(/s+/g, '-')
    .replace(/-+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'product';
}

// Reads from Firebase ONCE at build time. Zero reads in production.
// To refresh products: redeploy on Vercel (Deployments → Redeploy).
export async function fetchProductsServer(): Promise<Product[]> {
  const docs: any[] = [];
  let pageToken = '';
  try {
    do {
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/products?pageSize=300&key=${FIREBASE_API_KEY}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
      // force-cache = cached forever at build time, never re-fetched in production
      const resp = await fetch(url, { cache: 'force-cache' });
      if (!resp.ok) break;
      const data = await resp.json();
      if (data.documents) docs.push(...data.documents);
      pageToken = data.nextPageToken || '';
    } while (pageToken);

    if (docs.length === 0) return [];

    return docs.map((document: any) => {
      const id = String(document.name).split('/').pop() as string;
      const data: any = {};
      for (const [k, v] of Object.entries(document.fields || {})) data[k] = parseField(v);
      const slug = data.slug || toSlug(data.nameEn || data.name || id);
      const categorySlug = data.categorySlug || toSlug(data.category || '');
      return { ...data, id, slug, categorySlug } as Product;
    });
  } catch {
    return [];
  }
}
