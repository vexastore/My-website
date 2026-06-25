const API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const BASE = 'https://firestore.googleapis.com/v1/projects/vexa-store/databases/(default)/documents/products';

function parseField(field) {
  if (!field) return null;
  if ('stringValue' in field) return field.stringValue;
  if ('integerValue' in field) return Number(field.integerValue);
  if ('doubleValue' in field) return field.doubleValue;
  if ('booleanValue' in field) return field.booleanValue;
  if ('nullValue' in field) return null;
  if ('arrayValue' in field) return (field.arrayValue.values || []).map(parseField);
  if ('mapValue' in field) {
    const obj = {};
    for (const [k, v] of Object.entries(field.mapValue.fields || {})) obj[k] = parseField(v);
    return obj;
  }
  return null;
}

function toSlug(n) {
  return (n || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60) || 'product';
}

export default async function handler(req, res) {
  // Cache for 5 minutes to allow fresh product data
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const allDocs = [];
  let pageToken = '';

  try {
    do {
      const url = `${BASE}?pageSize=300&key=${API_KEY}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        return res.status(resp.status).json({ error: err?.error?.message || 'Firebase error' });
      }
      const data = await resp.json();
      if (data.documents) allDocs.push(...data.documents);
      pageToken = data.nextPageToken || '';
    } while (pageToken);

    const products = allDocs.map(document => {
      const id = String(document.name).split('/').pop();
      const d = {};
      for (const [k, v] of Object.entries(document.fields || {})) d[k] = parseField(v);
      const slug = d.slug || toSlug(d.nameEn || d.name || id);
      const categorySlug = d.categorySlug || toSlug(d.category || '');
      return { ...d, id, slug, categorySlug };
    });

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
