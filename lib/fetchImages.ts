import { unstable_cache } from 'next/cache';

const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const PROJECT = 'vexa-store';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

type FsStringValue = { stringValue?: string };
type FsDoc = { name: string; fields?: Record<string, { stringValue?: string; arrayValue?: { values?: FsStringValue[] } }> };
type ImageMap = Record<string, { image: string; images: string[] }>;

// مستخدم anonymous واحد لكل Next.js process — يُجدَّد بـ refreshToken بدل إنشاء مستخدم جديد
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _imgFetchAuth: { token: string | null; expiry: number; refresh: string | null } =
  (globalThis as any).__vexa_fetchimages_auth
  ?? ((globalThis as any).__vexa_fetchimages_auth = { token: null, expiry: 0, refresh: null });

async function getIdToken(): Promise<string | null> {
  try {
    if (_imgFetchAuth.token && Date.now() < _imgFetchAuth.expiry) return _imgFetchAuth.token;

    if (_imgFetchAuth.refresh) {
      const r = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: _imgFetchAuth.refresh }) }
      );
      if (r.ok) {
        const d = await r.json() as { id_token: string; refresh_token: string; expires_in: string };
        _imgFetchAuth.token   = d.id_token;
        _imgFetchAuth.refresh = d.refresh_token;
        _imgFetchAuth.expiry  = Date.now() + (parseInt(d.expires_in, 10) - 60) * 1000;
        return _imgFetchAuth.token;
      }
    }

    const authRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) }
    );
    const d = await authRes.json() as { idToken?: string; refreshToken?: string; expiresIn?: string };
    if (!d.idToken) return null;
    _imgFetchAuth.token   = d.idToken;
    _imgFetchAuth.refresh = d.refreshToken ?? null;
    _imgFetchAuth.expiry  = Date.now() + (parseInt(d.expiresIn ?? '3600', 10) - 60) * 1000;
    return _imgFetchAuth.token;
  } catch { return null; }
}

async function fetchCollection(name: string, headers: Record<string, string>, pageSize = 300): Promise<FsDoc[]> {
  const docs: FsDoc[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL(`${BASE}/${name}`);
    url.searchParams.set('pageSize', String(pageSize));
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const res = await fetch(url.toString(), { headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) break;
    const data = await res.json() as { documents?: FsDoc[]; nextPageToken?: string };
    docs.push(...(data.documents || []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return docs;
}

async function _fetchImages(): Promise<ImageMap> {
  try {
    const idToken = await getIdToken();
    if (!idToken) return {};

    const headers = { Authorization: `Bearer ${idToken}` };

    // Fetch both collections in parallel — fully dynamic, no hardcoded IDs
    // New products appear automatically without any code changes
    const [productDocs, galleryDocs] = await Promise.all([
      fetchCollection('products', headers, 300),
      fetchCollection('product_images', headers, 300),
    ]);

    const imageMap: ImageMap = {};

    // Gallery (product_images) — authoritative source for admin-uploaded images
    for (const d of galleryDocs) {
      const id = d.name.split('/').pop()!;
      const imgs = (d.fields?.images?.arrayValue?.values || [])
        .map((v: FsStringValue) => v.stringValue || '').filter(Boolean);
      if (imgs.length > 0) {
        imageMap[id] = { image: imgs[0], images: imgs };
      }
    }

    // Products collection — fill images for products not in gallery
    for (const d of productDocs) {
      const id = d.name.split('/').pop()!;
      if (imageMap[id]) continue; // already has gallery image
      const img = d.fields?.image?.stringValue || '';
      const imgs = (d.fields?.images?.arrayValue?.values || [])
        .map((v: FsStringValue) => v.stringValue || '').filter(Boolean);
      const mainImg = imgs[0] || img;
      if (mainImg) {
        imageMap[id] = { image: mainImg, images: imgs.length ? imgs : (img ? [img] : []) };
      }
    }

    console.warn(
      `[VEXA_IMG] fetchImages: products=${productDocs.length} gallery=${galleryDocs.length} withImages=${Object.keys(imageMap).length}`
    );
    return imageMap;
  } catch (err) {
    console.error('[VEXA_IMG] fetchImages error:', err);
    return {};
  }
}

// Cached 24h. Invalidated instantly via revalidateTag('vexa-images') after any admin change.
export const fetchImages = unstable_cache(
  _fetchImages,
  ['vexa-product-images-v3'],
  { revalidate: 86400, tags: ['vexa-images'] }
);
