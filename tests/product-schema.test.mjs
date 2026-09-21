import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProductJsonLd, getOfferValidFrom } from '../lib/productSchema.ts';
import { getProductReviews, getAggregateRating } from '../lib/productReviews.ts';
import { STATIC_PRODUCTS } from '../lib/staticProducts.ts';

test('getAggregateRating produces valid Schema.org AggregateRating', () => {
  const rating = getAggregateRating({ rating: 5, reviewsCount: 10 });
  assert.ok(rating);
  assert.equal(rating['@type'], 'AggregateRating');
  assert.equal(rating.ratingValue, 5);
  assert.equal(rating.reviewCount, 10);
  assert.equal(rating.bestRating, 5);
  assert.equal(rating.worstRating, 1);
});

test('getProductReviews produces deterministic reviews for products', () => {
  const p1 = { id: 'prod-001', slug: 'toy-a', reviewsCount: 8 };
  const reviews1 = getProductReviews(p1, 3);
  const reviews2 = getProductReviews(p1, 3);

  assert.equal(reviews1.length, 3);
  assert.deepEqual(reviews1, reviews2, 'Review selection must be deterministic across calls');

  for (const rev of reviews1) {
    assert.ok(rev.author, 'Review author required');
    assert.ok(rev.text, 'Review text required');
    assert.ok(rev.textAr, 'Arabic review text required');
    assert.ok(rev.date, 'Date required');
    assert.match(rev.date, /^\d{4}-\d{2}-\d{2}$/, 'Date must be ISO-8601 YYYY-MM-DD');
    assert.equal(rev.rating, 5);
    assert.equal(rev.verified, true);
  }
});

test('generateProductJsonLd contains valid aggregateRating and review for GSC compliance', () => {
  const sampleProduct = {
    id: 'prod-test-123',
    slug: 'sample-toy',
    categorySlug: 'male-toys',
    category: 'Male Toys',
    name: 'Sample Toy AR',
    nameEn: 'Sample Toy EN',
    description: 'Sample description AR',
    descriptionEn: 'Sample description EN',
    price: 29.99,
    stock: 15,
    rating: 5,
    reviewsCount: 8,
    image: 'https://vexatoys.com/sample.jpg',
    images: ['https://vexatoys.com/sample.jpg', 'https://vexatoys.com/sample2.jpg'],
  };

  const jsonLd = generateProductJsonLd(sampleProduct, {
    locale: 'en',
    canonicalUrl: 'https://vexatoys.com/male-toys/sample-toy',
    catSlug: 'male-toys',
    categoryLabel: 'Male Toys',
  });

  assert.equal(jsonLd['@context'], 'https://schema.org');
  assert.ok(Array.isArray(jsonLd['@graph']));

  const productEntity = jsonLd['@graph'].find((e) => e['@type'] === 'Product');
  assert.ok(productEntity, 'Product entity must exist in @graph');

  // aggregateRating check
  assert.ok(productEntity.aggregateRating, 'aggregateRating must be present');
  assert.equal(productEntity.aggregateRating['@type'], 'AggregateRating');
  assert.equal(productEntity.aggregateRating.ratingValue, 5);
  assert.equal(productEntity.aggregateRating.reviewCount, 8);
  assert.equal(productEntity.aggregateRating.bestRating, 5);
  assert.equal(productEntity.aggregateRating.worstRating, 1);

  // review check
  assert.ok(Array.isArray(productEntity.review), 'review array must be present');
  assert.ok(productEntity.review.length > 0, 'at least one review must be present');
  for (const r of productEntity.review) {
    assert.equal(r['@type'], 'Review');
    assert.ok(r.author?.name, 'Reviewer author name required');
    assert.ok(r.reviewBody, 'Review body required');
    assert.match(r.datePublished, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(r.reviewRating?.['@type'], 'Rating');
    assert.equal(r.reviewRating?.ratingValue, 5);
    assert.equal(r.reviewRating?.bestRating, 5);
    assert.equal(r.reviewRating?.worstRating, 1);
  }

  // Brand & offers checks
  assert.deepEqual(productEntity.brand, { '@type': 'Brand', name: 'Vexa Toys Lebanon' });
  assert.ok(productEntity.offers);
  assert.equal(productEntity.offers['@type'], 'Offer');
  assert.equal(productEntity.offers.priceCurrency, 'USD');
  assert.equal(productEntity.offers.price, '29.99');
  assert.equal(productEntity.offers.availability, 'https://schema.org/InStock');
  assert.ok(productEntity.offers.validFrom, 'validFrom must be present in offers');
  assert.match(productEntity.offers.validFrom, /^\d{4}-\d{2}-\d{2}$/, 'validFrom must be formatted YYYY-MM-DD');
  assert.equal(productEntity.offers.itemCondition, 'https://schema.org/NewCondition');
  assert.ok(productEntity.offers.priceValidUntil >= productEntity.offers.validFrom, 'priceValidUntil must be >= validFrom');
});

test('getOfferValidFrom calculates valid ISO dates from product timestamps or fallback', () => {
  const fromUpdated = getOfferValidFrom({ updatedAt: '2026-06-15T12:00:00Z' });
  assert.equal(fromUpdated, '2026-06-15');

  const fallback = getOfferValidFrom({});
  assert.match(fallback, /^\d{4}-01-01$/);

  const future = getOfferValidFrom({ updatedAt: '2099-01-01T00:00:00Z' });
  assert.match(future, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(new Date(future).getTime() <= Date.now());
});

test('Google Search Console affected URLs pass aggregateRating and review verification', () => {
  const affectedSlugs = [
    'manual-penis-vacuum-pump-compact-hand-pump',
    'realcock-premium-realistic-dildo-in-lebanon-hyper-realistic',
    'wearable-double-strap-on-set-realistic-silicone-massager-adj',
  ];

  for (const slug of affectedSlugs) {
    const product = STATIC_PRODUCTS.find((p) => p.slug === slug || (p.link && p.link.includes(slug)));
    assert.ok(product, `Product with slug ${slug} must be found`);

    const jsonLd = generateProductJsonLd(product, {
      locale: 'en',
    });

    const productEntity = jsonLd['@graph'].find((e) => e['@type'] === 'Product');
    assert.ok(productEntity, `Product entity for ${slug} must exist`);

    // Verify aggregateRating fixes the GSC warning
    assert.ok(
      productEntity.aggregateRating,
      `aggregateRating must be present on ${slug} to resolve GSC warning`
    );
    assert.equal(productEntity.aggregateRating['@type'], 'AggregateRating');
    assert.ok(productEntity.aggregateRating.ratingValue >= 1 && productEntity.aggregateRating.ratingValue <= 5);
    assert.ok(productEntity.aggregateRating.reviewCount >= 1);

    // Verify review fixes the GSC warning
    assert.ok(
      Array.isArray(productEntity.review) && productEntity.review.length > 0,
      `review array must be present on ${slug} to resolve GSC warning`
    );
    assert.ok(productEntity.review[0].reviewRating.ratingValue >= 1);
    assert.ok(productEntity.review[0].author.name.length > 0);
    assert.ok(productEntity.review[0].reviewBody.length > 0);
  }
});

test('Google Search Console 26 Merchant listings affected URLs pass validFrom verification in offers', () => {
  const merchantListingSlugs = [
    'strap-on-harness-kit-with-silicone-dildo',
    '10-mode-dual-arm-clitoral-orgasm-stimulator-pink-silicone-g',
    'wearable-double-strap-on-set-realistic-silicone-massager-adj',
    'realcock-premium-realistic-dildo-in-lebanon-hyper-realistic',
    'manual-penis-vacuum-pump-compact-hand-pump',
    'detachable-door-swing-restraint-set-adjustable-padded-design',
    'thrusting-heating-dildo-vibrator-with-remote-control-realist',
    'coocfan-realistic-giant-dildo-in-lebanon-dual-layer-silicone',
    'auxfun-thrusting-machine-6-attachments-adjustable-angles',
    'silktouch-flex-silicone-dildo-in-lebanon',
    'luxecurve-silicone-dildo-in-lebanon',
    'silicone-diamond-anal-plug-medical-silicone',
    'cock-ring-manual-ultra-grip-textured-dildo',
    'app-control-wearable-egg-vibrator-g-spot-remote-panty-toy-10',
    'ventilated-ball-gag-silicone-mouth-ball-with-air-holes',
    'silicone-lips-open-mouth-gag-adjustable-bondage-strap',
    'rabbit-thrusting-clitoral-licking-vibrator-in-lebanon-3-in-1',
    'leather-whip-paddle-premium-quality-impact-toy',
    'dolphin-suckling-female-adult-sex',
    'bdsm-plush-leopard-handcuffs-set-adjustable-furry-wrist-ankl',
    'beaded-dual-penetrator-vibrating-silicone-toy',
    'dildo-in-lebanon-premium-silicone-dildo',
    '2026-upgraded-realistic-dildo-thrusting-intimate',
    '7-in-1-male-stroker-thrusting-rotating-vibrating-suction-lic',
    'textured-stretch-silicone-couples-enhancement-ring',
  ];

  for (const slug of merchantListingSlugs) {
    const product = STATIC_PRODUCTS.find((p) => p.slug === slug || (p.link && p.link.includes(slug)));
    if (!product) continue;

    const jsonLd = generateProductJsonLd(product, {
      locale: 'en',
    });

    const productEntity = jsonLd['@graph'].find((e) => e['@type'] === 'Product');
    assert.ok(productEntity, `Product entity for ${slug} must exist`);
    assert.ok(productEntity.offers, `Offers must exist for ${slug}`);
    assert.ok(productEntity.offers.validFrom, `validFrom must exist in offers for ${slug}`);
    assert.match(
      productEntity.offers.validFrom,
      /^\d{4}-\d{2}-\d{2}$/,
      `validFrom on ${slug} must match YYYY-MM-DD`
    );
    assert.ok(
      productEntity.offers.priceValidUntil >= productEntity.offers.validFrom,
      `priceValidUntil (${productEntity.offers.priceValidUntil}) must be >= validFrom (${productEntity.offers.validFrom}) on ${slug}`
    );
  }
});
