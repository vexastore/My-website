import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProductJsonLd } from '../lib/productSchema.ts';
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
  assert.deepEqual(productEntity.brand, { '@type': 'Brand', name: 'Vexa Store Lebanon' });
  assert.ok(productEntity.offers);
  assert.equal(productEntity.offers['@type'], 'Offer');
  assert.equal(productEntity.offers.priceCurrency, 'USD');
  assert.equal(productEntity.offers.price, '29.99');
  assert.equal(productEntity.offers.availability, 'https://schema.org/InStock');
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
