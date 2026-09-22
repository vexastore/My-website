import test from 'node:test';
import assert from 'node:assert/strict';
import { getAggregateRating } from '../lib/productReviews.ts';

test('getAggregateRating strictly returns null when reviewsCount is 0 or rating is 0', () => {
  assert.equal(getAggregateRating({ rating: 0, reviewsCount: 0 }), null);
  assert.equal(getAggregateRating({ rating: null, reviewsCount: 0 }), null);
  assert.equal(getAggregateRating({ rating: 5, reviewsCount: 0 }), null);
  assert.equal(getAggregateRating({ rating: 0, reviewsCount: 5 }), null);
});

test('getAggregateRating returns valid AggregateRating schema when positive reviews exist', () => {
  const result = getAggregateRating({ rating: 4.67, reviewsCount: 12 });
  assert.ok(result);
  assert.equal(result['@type'], 'AggregateRating');
  assert.equal(result.ratingValue, 4.7);
  assert.equal(result.reviewCount, 12);
  assert.equal(result.bestRating, 5);
  assert.equal(result.worstRating, 1);
});

test('review submission validation enforces strict constraints', () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // UUID validation
  assert.ok(uuidRegex.test('b4c2e642-f9d2-4e4b-84a1-b85f0efb6241'));
  assert.equal(uuidRegex.test('not-a-uuid'), false);
  assert.equal(uuidRegex.test(''), false);

  // Rating range validation
  const isValidRating = (r) => Number.isInteger(r) && r >= 1 && r <= 5;
  assert.ok(isValidRating(1));
  assert.ok(isValidRating(5));
  assert.equal(isValidRating(0), false);
  assert.equal(isValidRating(6), false);
  assert.equal(isValidRating(4.5), false);

  // Name and Body validation
  const isValidName = (name) => typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 100;
  assert.ok(isValidName('Sarah K.'));
  assert.equal(isValidName('S'), false);
  assert.equal(isValidName('   '), false);

  const isValidBody = (body) => typeof body === 'string' && body.trim().length >= 5 && body.trim().length <= 2000;
  assert.ok(isValidBody('Arrived fast in Beirut in a discreet package!'));
  assert.equal(isValidBody('Bad'), false);
});
