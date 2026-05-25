// Dynamic sitemap generator — pulls products from Firestore REST API
  // Deployed at /api/sitemap → vercel.json rewrites /sitemap.xml here

  const FIREBASE_PROJECT = 'vexa-store';
  const FIREBASE_API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';

  const STATIC_URLS = [
    { loc: 'https://vexatoys.com/', changefreq: 'daily',   priority: '1.0' },
    { loc: 'https://vexatoys.com/about', changefreq: 'monthly', priority: '0.7' },
    { loc: 'https://vexatoys.com/sex-toys',          changefreq: 'weekly', priority: '0.95' },
    { loc: 'https://vexatoys.com/vibrators',         changefreq: 'weekly', priority: '0.95' },
    { loc: 'https://vexatoys.com/lingerie',          changefreq: 'weekly', priority: '0.90' },
    { loc: 'https://vexatoys.com/new-arrivals',      changefreq: 'daily',  priority: '0.90' },
    { loc: 'https://vexatoys.com/male-toys',         changefreq: 'weekly', priority: '0.85' },
    { loc: 'https://vexatoys.com/dildos',            changefreq: 'weekly', priority: '0.85' },
    { loc: 'https://vexatoys.com/bdsm',              changefreq: 'weekly', priority: '0.80' },
    { loc: 'https://vexatoys.com/holiday-collection',changefreq: 'weekly', priority: '0.75' },
    { loc: 'https://vexatoys.com/lubricants',        changefreq: 'weekly', priority: '0.75' },
    { loc: 'https://vexatoys.com/masturbators',      changefreq: 'weekly', priority: '0.75' },
    { loc: 'https://vexatoys.com/cock-rings',        changefreq: 'weekly', priority: '0.70' },
    { loc: 'https://vexatoys.com/butt-plugs',        changefreq: 'weekly', priority: '0.70' },
    { loc: 'https://vexatoys.com/anal-toys',         changefreq: 'weekly', priority: '0.70' },
    { loc: 'https://vexatoys.com/bondage',           changefreq: 'weekly', priority: '0.70' },
    { loc: 'https://vexatoys.com/sex-dolls',         changefreq: 'weekly', priority: '0.70' },
    { loc: 'https://vexatoys.com/strap-ons',         changefreq: 'weekly', priority: '0.70' },
    { loc: 'https://vexatoys.com/kegel-balls',       changefreq: 'weekly', priority: '0.65' },
    { loc: 'https://vexatoys.com/sexual-enhancers',  changefreq: 'weekly', priority: '0.65' },
    { loc: 'https://vexatoys.com/penis-pumps',       changefreq: 'weekly', priority: '0.65' },
    { loc: 'https://vexatoys.com/chastity',          changefreq: 'weekly', priority: '0.60' },
    { loc: 'https://vexatoys.com/sex-machines',      changefreq: 'weekly', priority: '0.60' },
    { loc: 'https://vexatoys.com/poppers',           changefreq: 'weekly', priority: '0.60' },
  ];

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function buildUrl(entry) {
    return `  <url>
      <loc>${entry.loc}</loc>
      <lastmod>${today()}</lastmod>
      <changefreq>${entry.changefreq}</changefreq>
      <priority>${entry.priority}</priority>
      <xhtml:link rel="alternate" hreflang="ar" href="${entry.loc}"/>
      <xhtml:link rel="alternate" hreflang="en" href="${entry.loc}"/>
      <xhtml:link rel="alternate" hreflang="x-default" href="${entry.loc}"/>
    </url>`;
  }

  export default async function handler(req, res) {
    // 1. Fetch all products from Firestore REST API
    let productUrls = [];
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/products?key=${FIREBASE_API_KEY}&pageSize=200`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (response.ok) {
        const data = await response.json();
        const docs = data.documents || [];
        productUrls = docs.map(doc => {
          const fields = doc.fields || {};
          const nameEn = fields.nameEn?.stringValue || fields.name?.stringValue || '';
          const id = doc.name.split('/').pop();
          const slug = nameEn
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 60);
          const loc = `https://vexatoys.com/product/${slug || id}`;
          return `  <url>
      <loc>${loc}</loc>
      <lastmod>${today()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.80</priority>
    </url>`;
        });
      }
    } catch {
      // If Firestore is unavailable, serve static sitemap only
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">

  ${STATIC_URLS.map(buildUrl).join('\n\n')}

  ${productUrls.join('\n')}

  </urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
  }
  