import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProductJsonLd, getOfferValidFrom } from '../lib/productSchema.ts';
import { getAggregateRating } from '../lib/productReviews.ts';
import { STATIC_PRODUCTS } from '../lib/staticProducts.ts';

test('getAggregateRating produces valid Schema.org AggregateRating for positive reviews', () => {
  const rating = getAggregateRating({ rating: 5, reviewsCount: 10 });
  assert.ok(rating);
  assert.equal(rating['@type'], 'AggregateRating');
  assert.equal(rating.ratingValue, 5);
  assert.equal(rating.reviewCount, 10);
  assert.equal(rating.bestRating, 5);
  assert.equal(rating.worstRating, 1);
});

test('getAggregateRating returns null when reviewsCount or rating is zero without fabricating fallback ratings', () => {
  const zeroRating = getAggregateRating({ rating: 0, reviewsCount: 0 });
  assert.equal(zeroRating, null, 'Must return null for 0 reviews');

  const negativeRating = getAggregateRating({ rating: -1, reviewsCount: 0 });
  assert.equal(negativeRating, null, 'Must return null for invalid rating');
});

test('generateProductJsonLd omits aggregateRating and review when product has no reviews', () => {
  const unreviewedProduct = {
    id: 'prod-unreviewed',
    slug: 'new-toy',
    categorySlug: 'male-toys',
    category: 'Male Toys',
    name: 'New Toy AR',
    nameEn: 'New Toy EN',
    description: 'Fresh product description',
    descriptionEn: 'Fresh product description EN',
    price: 35.0,
    stock: 5,
    rating: 0,
    reviewsCount: 0,
    image: 'https://vexatoys.com/sample.jpg',
  };

  const jsonLd = generateProductJsonLd(unreviewedProduct, {
    locale: 'en',
    canonicalUrl: 'https://vexatoys.com/male-toys/new-toy',
    catSlug: 'male-toys',
    categoryLabel: 'Male Toys',
  });

  const productEntity = jsonLd['@graph'].find((e) => e['@type'] === 'Product');
  assert.ok(productEntity);
  assert.equal(productEntity.aggregateRating, undefined, 'aggregateRating must be omitted when 0 reviews');
  assert.equal(productEntity.review, undefined, 'review array must be omitted when 0 reviews');
});

test('generateProductJsonLd includes valid aggregateRating and real reviews when approved reviews are supplied', () => {
  const reviewedProduct = {
    id: 'prod-reviewed',
    slug: 'popular-toy',
    categorySlug: 'male-toys',
    category: 'Male Toys',
    name: 'Popular Toy AR',
    nameEn: 'Popular Toy EN',
    description: 'Sample description AR',
    descriptionEn: 'Sample description EN',
    price: 29.99,
    stock: 15,
    rating: 4.8,
    reviewsCount: 3,
    image: 'https://vexatoys.com/sample.jpg',
  };

  const mockApprovedReviews = [
    {
      id: 'rev-1',
      productId: 'prod-reviewed',
      author: 'Ahmad S.',
      rating: 5,
      title: 'Top notch',
      body: 'Arrived fast in Beirut in a discreet box.',
      locale: 'en',
      verified: true,
      createdAt: '2026-09-10T12:00:00Z',
    },
    {
      id: 'rev-2',
      productId: 'prod-reviewed',
      author: 'Lina M.',
      rating: 4,
      title: 'Very good',
      body: 'High quality material, smooth cash on delivery.',
      locale: 'en',
      verified: true,
      createdAt: '2026-09-12T15:30:00Z',
    },
  ];

  const jsonLd = generateProductJsonLd(reviewedProduct, {
    locale: 'en',
    canonicalUrl: 'https://vexatoys.com/male-toys/popular-toy',
    catSlug: 'male-toys',
    categoryLabel: 'Male Toys',
    reviews: mockApprovedReviews,
  });

  const productEntity = jsonLd['@graph'].find((e) => e['@type'] === 'Product');
  assert.ok(productEntity, 'Product entity must exist in @graph');

  // aggregateRating check
  assert.ok(productEntity.aggregateRating, 'aggregateRating must be present');
  assert.equal(productEntity.aggregateRating['@type'], 'AggregateRating');
  assert.equal(productEntity.aggregateRating.ratingValue, 4.8);
  assert.equal(productEntity.aggregateRating.reviewCount, 3);

  // review check
  assert.ok(Array.isArray(productEntity.review), 'review array must be present');
  assert.equal(productEntity.review.length, 2);
  assert.equal(productEntity.review[0].author.name, 'Ahmad S.');
  assert.equal(productEntity.review[0].reviewRating.ratingValue, 5);
  assert.equal(productEntity.review[0].datePublished, '2026-09-10');
  assert.equal(productEntity.review[0].reviewBody, 'Arrived fast in Beirut in a discreet box.');
});

test('generateProductJsonLd respects canonicalUrlOverride on the product', () => {
  const overriddenProduct = {
    id: 'prod-override-1',
    slug: 'toy-standard',
    categorySlug: 'vibrators',
    category: 'Vibrators',
    name: 'Standard Toy',
    nameEn: 'Standard Toy',
    description: 'Desc',
    descriptionEn: 'Desc',
    price: 49.99,
    stock: 8,
    rating: 0,
    reviewsCount: 0,
    image: 'https://vexatoys.com/sample.jpg',
    canonicalUrlOverride: 'https://vexatoys.com/vibrators/toy-custom-canonical',
  };

  const jsonLd = generateProductJsonLd(overriddenProduct);
  const productEntity = jsonLd['@graph'].find((e) => e['@type'] === 'Product');
  assert.equal(productEntity.url, 'https://vexatoys.com/vibrators/toy-custom-canonical');
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

test('Merchant listings URLs pass validFrom and merchantReturnLink verification in offers', () => {
  const sampleSlugs = [
    'strap-on-harness-kit-with-silicone-dildo',
    'manual-penis-vacuum-pump-compact-hand-pump',
  ];

  for (const slug of sampleSlugs) {
    const product = STATIC_PRODUCTS.find((p) => p.slug === slug || (p.link && p.link.includes(slug)));
    if (!product) continue;

    const jsonLd = generateProductJsonLd(product, {
      locale: 'en',
    });

    const productEntity = jsonLd['@graph'].find((e) => e['@type'] === 'Product');
    assert.ok(productEntity, `Product entity for ${slug} must exist`);
    assert.ok(productEntity.offers, `Offers must exist for ${slug}`);
    assert.ok(productEntity.offers.validFrom, `validFrom must exist in offers for ${slug}`);
    assert.equal(
      productEntity.offers.hasMerchantReturnPolicy.merchantReturnLink,
      'https://vexatoys.com/returns'
    );
  }
});
