// Pre-rendered product page for Google rich snippets
  // Route: /product/:slug (via vercel.json rewrite → /api/product/:slug)

  const FIREBASE_PROJECT = 'vexa-store';
  const FIREBASE_API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';

  function toSlug(str) {
    return (str || '')
      .toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
  }

  function escHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildProductHtml(product, slug) {
    const url = `https://vexatoys.com/product/${slug}`;
    const price = Number(product.price || 0).toFixed(2);
    const inStock = (product.stock || 0) > 0;
    const image = product.image || 'https://vexatoys.com/opengraph.jpg';
    const images = product.images && product.images.length > 1
      ? product.images : [image];
    const rating = Number(product.rating || 4.5).toFixed(1);
    const reviewCount = Number(product.reviewsCount || 1);
    const isNew = product.isNew ? 'New' : '';

    const titleAr = `${escHtml(product.name)} | متجر فيكسا لبنان`;
    const titleEn = `${escHtml(product.nameEn)} | Vexa Store Lebanon`;
    const descAr = escHtml(product.description?.slice(0, 155) || '');
    const descEn = escHtml(product.descriptionEn?.slice(0, 155) || '');

    const imagesJson = JSON.stringify(images);
    const variantsText = product.variants
      ? product.variants.map(v => v.nameEn + ': ' + v.options.join(', ')).join(' | ')
      : '';

    return `<!doctype html>
  <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${titleAr}</title>
      <meta name="description" content="${descAr}" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="rating" content="adult" />
      <meta name="geo.region" content="LB" />
      <meta property="og:title" content="${titleAr}" />
      <meta property="og:description" content="${descAr}" />
      <meta property="og:type" content="product" />
      <meta property="og:url" content="${url}" />
      <meta property="og:image" content="${escHtml(image)}" />
      <meta property="og:image:alt" content="${escHtml(product.name)}" />
      <meta property="og:site_name" content="Vexa Store Lebanon" />
      <meta property="product:price:amount" content="${price}" />
      <meta property="product:price:currency" content="USD" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${titleAr}" />
      <meta name="twitter:description" content="${descAr}" />
      <meta name="twitter:image" content="${escHtml(image)}" />
      <link rel="canonical" href="${url}" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="preconnect" href="https://firestore.googleapis.com" />
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": ${JSON.stringify(product.nameEn || product.name)},
        "description": ${JSON.stringify(product.descriptionEn || product.description)},
        "image": ${imagesJson},
        "sku": ${JSON.stringify(product.id || slug)},
        "brand": {
          "@type": "Brand",
          "name": "Vexa Store Lebanon"
        },
        "offers": {
          "@type": "Offer",
          "url": "${url}",
          "priceCurrency": "USD",
          "price": "${price}",
          "availability": "${inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}",
          "seller": {
            "@type": "Organization",
            "name": "Vexa Store Lebanon",
            "url": "https://vexatoys.com/"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" },
              "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 3, "unitCode": "DAY" }
            },
            "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "LB" }
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "${rating}",
          "reviewCount": "${reviewCount}",
          "bestRating": "5",
          "worstRating": "1"
        },
        "additionalProperty": [
          { "@type": "PropertyValue", "name": "Delivery", "value": "Same-day discreet delivery in Beirut" },
          { "@type": "PropertyValue", "name": "Payment", "value": "Cash on delivery" }
          ${variantsText ? ', { "@type": "PropertyValue", "name": "Variants", "value": ' + JSON.stringify(variantsText) + ' }' : ''}
        ]
      }
      </script>
      <style>
        body { margin:0; background:#050101; color:#fff; font-family:Arial,sans-serif; }
        .seo { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; }
        #root { min-height:100vh; }
      </style>
    </head>
    <body>
      <div class="seo" aria-hidden="true">
        <h1>${escHtml(product.name)} - ${escHtml(product.nameEn)}</h1>
        <p>${descAr}</p>
        <p>${descEn}</p>
        <p>السعر: ${price} دولار | Price: $${price} USD</p>
        <p>${inStock ? 'متوفر في المخزون | In Stock' : 'غير متوفر | Out of Stock'}</p>
        <p>متجر فيكسا لبنان | Vexa Store Lebanon | توصيل سري بيروت | Discreet Delivery Beirut</p>
        ${isNew ? '<span>منتج جديد | New Arrival</span>' : ''}
      </div>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>`;
  }

  export default async function handler(req, res) {
    const slug = req.query.slug || '';

    if (!slug) {
      return res.status(400).send('Missing product slug');
    }

    try {
      // Fetch all products from Firestore REST API and find by slug
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/products?key=${FIREBASE_API_KEY}&pageSize=300`;

      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

      if (!response.ok) {
        // Firestore unavailable — fall back to index.html
        res.setHeader('Location', '/');
        return res.status(302).send('Redirecting...');
      }

      const data = await response.json();
      const docs = data.documents || [];

      // Find product whose nameEn slug matches
      let foundProduct = null;
      for (const doc of docs) {
        const fields = doc.fields || {};
        const nameEn = fields.nameEn?.stringValue || fields.name?.stringValue || '';
        const docSlug = nameEn
          .toLowerCase().trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 80);

        if (docSlug === slug) {
          foundProduct = {
            id: doc.name.split('/').pop(),
            name: fields.name?.stringValue || '',
            nameEn: nameEn,
            description: fields.description?.stringValue || '',
            descriptionEn: fields.descriptionEn?.stringValue || '',
            price: parseFloat(fields.price?.doubleValue || fields.price?.integerValue || 0),
            image: fields.image?.stringValue || '',
            images: (fields.images?.arrayValue?.values || []).map(v => v.stringValue).filter(Boolean),
            category: fields.category?.stringValue || '',
            rating: parseFloat(fields.rating?.doubleValue || fields.rating?.integerValue || 4.5),
            reviewsCount: parseInt(fields.reviewsCount?.integerValue || 1),
            stock: parseInt(fields.stock?.integerValue || 0),
            isNew: fields.isNew?.booleanValue || false,
            variants: (fields.variants?.arrayValue?.values || []).map(v => {
              const vm = v.mapValue?.fields || {};
              return {
                nameEn: vm.nameEn?.stringValue || '',
                options: (vm.options?.arrayValue?.values || []).map(o => o.stringValue)
              };
            })
          };
          break;
        }
      }

      if (!foundProduct) {
        // Product not found — redirect to home
        res.setHeader('Location', '/');
        return res.status(302).send('Product not found');
      }

      const html = buildProductHtml(foundProduct, slug);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).send(html);

    } catch (err) {
      // Timeout or other error — serve React app fallback
      res.setHeader('Location', '/');
      return res.status(302).send('Server error, redirecting...');
    }
  }
  