import fs   from 'fs';
import path from 'path';

// ── Constants ──────────────────────────────────────────────────────────────────
const FIREBASE_PROJECT = 'vexa-store';
const FIREBASE_API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';

const CATEGORY_LABELS = {
  'vibrators':          { ar: 'هزازات',           en: 'Vibrators' },
  'dildos':             { ar: 'دايلدو',            en: 'Dildos' },
  'lingerie':           { ar: 'لانجري',            en: 'Lingerie' },
  'male-toys':          { ar: 'ألعاب رجالية',      en: 'Male Toys' },
  'bdsm':               { ar: 'BDSM',              en: 'BDSM' },
  'anal-toys':          { ar: 'ألعاب شرجية',       en: 'Anal Toys' },
  'butt-plugs':         { ar: 'Butt Plugs',        en: 'Butt Plugs' },
  'bondage':            { ar: 'Bondage',           en: 'Bondage' },
  'sex-toys':           { ar: 'ألعاب جنسية',       en: 'Sex Toys' },
  'sex-dolls':          { ar: 'دمى جنسية',         en: 'Sex Dolls' },
  'strap-ons':          { ar: 'أحزمة',             en: 'Strap-Ons' },
  'kegel-balls':        { ar: 'كيغل بولز',         en: 'Kegel Balls' },
  'sexual-enhancers':   { ar: 'معززات جنسية',      en: 'Sexual Enhancers' },
  'penis-pumps':        { ar: 'مضخات القضيب',      en: 'Penis Pumps' },
  'cock-rings':         { ar: 'حلقات قضيب',        en: 'Cock Rings' },
  'masturbators':       { ar: 'أدوات استمناء',     en: 'Masturbators' },
  'chastity':           { ar: 'العفة',             en: 'Chastity' },
  'sex-machines':       { ar: 'ماكينات الجنس',     en: 'Sex Machines' },
  'lubricants':         { ar: 'مزلّقات',           en: 'Lubricants' },
  'poppers':            { ar: 'بوبرز',             en: 'Poppers' },
  'holiday-collection': { ar: 'كولكشن الأعياد',   en: 'Holiday Collection' },
  'new-arrivals':       { ar: 'وصل حديثاً',        en: 'New Arrivals' },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function toSlug(str) {
  return (str || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60);
}

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function smartTrunc(str, max) {
  if (!str) return '';
  const clean = str.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

// ── Read the actual built index.html (has correct hashed asset paths) ─────────
// includeFiles in vercel.json ensures dist/index.html is bundled with this function.
function readIndexHtml() {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf-8');
  } catch {
    return null;
  }
}

// Cache the index.html in memory for the lifetime of the function instance
const BASE_HTML = readIndexHtml();

// ── Inject product SEO into the real index.html ────────────────────────────────
function patchHtml(html, product, slug) {
  const url      = `https://vexatoys.com/product/${slug}`;
  const price    = Number(product.price  || 0).toFixed(2);
  const inStock  = (product.stock || 0) > 0;
  const image    = (product.image && !product.image.startsWith('data:'))
                     ? product.image : 'https://vexatoys.com/opengraph.jpg';
  const rating      = Number(product.rating       || 4.5).toFixed(1);
  const reviewCount = Number(product.reviewsCount || 1);
  const catSlug  = (product.category || 'sex-toys').toLowerCase().replace(/\s+/g, '-');
  const catLabel = CATEGORY_LABELS[catSlug] || { ar: catSlug, en: catSlug };
  const catUrl   = `https://vexatoys.com/${catSlug}`;

  const titleAr  = `${escHtml(product.name)} | اشتري في لبنان | فيكسا`;
  const titleEn  = `${escHtml(product.nameEn)} | Buy in Lebanon | Vexa Store`;
  const descAr   = escHtml(smartTrunc(product.description,   155));
  const descEn   = escHtml(smartTrunc(product.descriptionEn, 155));
  const keywords = `${escHtml(product.nameEn)} Lebanon, ${escHtml(product.name)} لبنان, buy ${escHtml(product.nameEn)} Beirut, ${catLabel.en} Lebanon, Vexa Store`;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.nameEn || product.name,
        alternateName: product.name || product.nameEn,
        description: product.descriptionEn || product.description,
        image: [image],
        sku: product.id || slug,
        brand: { '@type': 'Brand', name: 'Vexa Store Lebanon' },
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: 'USD',
          price: price,
          availability: inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'Vexa Store Lebanon', url: 'https://vexatoys.com/' },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
              transitTime:  { '@type': 'QuantitativeValue', minValue: 0, maxValue: 3, unitCode: 'DAY' },
            },
            shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'LB' },
          },
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating,
          reviewCount: String(reviewCount),
          bestRating:  '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'متجر فيكسا | Vexa Store', item: 'https://vexatoys.com/' },
          { '@type': 'ListItem', position: 2, name: `${catLabel.ar} | ${catLabel.en}`, item: catUrl },
          { '@type': 'ListItem', position: 3, name: product.nameEn || product.name },
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://vexatoys.com/#business',
        name: 'Vexa Store Lebanon',
        url: 'https://vexatoys.com/',
        image: 'https://vexatoys.com/opengraph.jpg',
        description: 'متجر ألعاب زوجية في لبنان | Adult toys & lingerie store in Lebanon',
        address: { '@type': 'PostalAddress', addressLocality: 'Beirut', addressCountry: 'LB' },
        areaServed: { '@type': 'Country', name: 'Lebanon' },
        priceRange: '$$',
        paymentAccepted: 'Cash on Delivery',
        currenciesAccepted: 'USD, LBP',
      },
    ],
  });

  // Use same regex approach as prerender.mjs — patches existing tags in the built index.html
  html = html.replace(/<title>[^<]*<\/title>/,                                    `<title>${titleAr}</title>`);
  html = html.replace(/<link rel="canonical"[^>]*>/,                             `<link rel="canonical" href="${url}" />`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,            `$1${descAr} ${descEn}$2`);
  html = html.replace(/(<meta name="keywords" content=")[^"]*(")/,               `$1${keywords}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,             `$1${url}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,           `$1${titleAr}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,     `$1${descAr}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,          `$1${titleAr}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/,    `$1${descAr}$2`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(")/,           `$1${image}$2`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/,          `$1${image}$2`);
  html = html.replace(/(<meta property="og:image:alt" content=")[^"]*(")/,       `$1${titleAr}$2`);
  html = html.replace(/(<meta name="twitter:image:alt" content=")[^"]*(")/,      `$1${titleAr}$2`);

  // Inject JSON-LD + initial product slug (so React mounts on the right product instantly)
  const injection = [
    `<script type="application/ld+json">${jsonLd}</script>`,
    `<script>window.__INITIAL_PRODUCT_SLUG__="${slug}";${product.id ? `window.__INITIAL_PRODUCT_ID__="${product.id}";` : ''}</script>`,
  ].join('\n');

  return html.replace('</head>', `${injection}\n</head>`);
}

// ── Main handler ───────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const slug = (req.query.slug || '').trim();
  if (!slug) return res.status(400).send('Missing product slug');

  // 1. Get base index.html (from filesystem cache — never redirects)
  let indexHtml = BASE_HTML;

  if (!indexHtml) {
    // Filesystem read failed — fetch from the CDN as a one-time fallback
    try {
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const host  = req.headers.host || 'vexatoys.com';
      const r = await fetch(`${proto}://${host}/`, {
        signal: AbortSignal.timeout(3000),
        headers: { Accept: 'text/html' },
      });
      if (r.ok) indexHtml = await r.text();
    } catch {}
  }

  // 2. Fetch product from Firestore REST API
  let foundProduct = null;
  try {
    const fsUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/products?key=${FIREBASE_API_KEY}&pageSize=300`;
    const response = await fetch(fsUrl, { signal: AbortSignal.timeout(5000) });
    if (response.ok) {
      const data = await response.json();
      for (const doc of (data.documents || [])) {
        const fields   = doc.fields || {};
        const nameEn   = fields.nameEn?.stringValue || fields.name?.stringValue || '';
        const docSlug  = fields.slug?.stringValue || toSlug(nameEn);
        if (docSlug === slug) {
          foundProduct = {
            id:            doc.name.split('/').pop(),
            name:          fields.name?.stringValue        || '',
            nameEn,
            description:   fields.description?.stringValue  || '',
            descriptionEn: fields.descriptionEn?.stringValue || '',
            price:         parseFloat(fields.price?.doubleValue  || fields.price?.integerValue  || 0),
            image:         fields.image?.stringValue        || '',
            category:      (fields.categorySlug?.stringValue || fields.category?.stringValue || 'sex-toys')
                             .toLowerCase().replace(/\s+/g, '-'),
            rating:        parseFloat(fields.rating?.doubleValue || fields.rating?.integerValue || 4.5),
            reviewsCount:  parseInt(fields.reviewsCount?.integerValue || 1),
            stock:         parseInt(fields.stock?.integerValue || 0),
          };
          break;
        }
      }
    }
  } catch {
    // Firestore unavailable — still serve index.html, React will load the product
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // 3. Build and return the final HTML — NEVER redirect to /
  if (!indexHtml) {
    // Last-resort: bare-minimum page that loads the app via client-side navigation
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(
      `<!DOCTYPE html><html lang="ar"><head><meta charset="UTF-8">` +
      `<meta name="viewport" content="width=device-width,initial-scale=1">` +
      `<script>window.__INITIAL_PRODUCT_SLUG__="${slug}";</script>` +
      `</head><body><script>window.location.replace('/');</script></body></html>`
    );
  }

  const html = foundProduct
    ? patchHtml(indexHtml, foundProduct, slug)
    : indexHtml.replace(
        '</head>',
        `<script>window.__INITIAL_PRODUCT_SLUG__="${slug}";</script>\n</head>`
      );

  res.setHeader(
    'Cache-Control',
    foundProduct
      ? 'public, s-maxage=3600, stale-while-revalidate=86400'
      : 'public, max-age=0, must-revalidate'
  );
  return res.status(200).send(html);
}
