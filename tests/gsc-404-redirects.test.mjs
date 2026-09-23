import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { findProduct, SLUG_REMAPS, canonicalProductSlug } from '../lib/productSeo.ts';
import { STATIC_PRODUCTS } from '../lib/staticProducts.ts';
import nextConfig from '../next.config.mjs';

const vercelJson = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));

const GSC_FAILED_SLUGS = [
  'premium-adjustable-strap-on-harness-with-interchangeable-rin',
  'silicone-vibrating-cock-ring-comfortable-adjustable-cock-rin',
  'silicone-strap-on-dildo-in-lebanon-',
  'penis-sleeve-reusable-silicone-extender-enhancer',
  'double-ended-flexible-silicone-intimate-wellness-toy-ultra-s',
];

test('SLUG_REMAPS contains all GSC legacy slugs and mappings', () => {
  assert.equal(
    SLUG_REMAPS['premium-adjustable-strap-on-harness-with-interchangeable-rin'],
    'premium-strap-on-harness-set-interchangeable-o-ring-system-f'
  );
  assert.equal(
    SLUG_REMAPS['silicone-vibrating-cock-ring-comfortable-adjustable-cock-rin'],
    'zoro-vibrating-cock-ring-delay-control-ring'
  );
  assert.equal(
    SLUG_REMAPS['silicone-strap-on-dildo-in-lebanon-'],
    'strap-on-harness-kit-with-silicone-dildo'
  );
  assert.equal(
    SLUG_REMAPS['silicone-strap-on-dildo-in-lebanon'],
    'strap-on-harness-kit-with-silicone-dildo'
  );
  assert.equal(
    SLUG_REMAPS['silicone-strap-on-dildo'],
    'strap-on-harness-kit-with-silicone-dildo'
  );
  assert.equal(
    SLUG_REMAPS['penis-sleeve-reusable-silicone-extender-enhancer'],
    'silicone-textured-enhancement-sleeve'
  );
  assert.equal(
    SLUG_REMAPS['double-ended-flexible-silicone-intimate-wellness-toy-ultra-s'],
    'beaded-dual-silicone-toy-lebanon'
  );
});

test('findProduct strips trailing hyphens and resolves remapped slugs', () => {
  const mockProducts = [
    {
      id: 'prod-strap',
      slug: 'strap-on-harness-kit-with-silicone-dildo',
      nameEn: 'Strap-On Harness Kit with Silicone Dildo',
      categorySlug: 'dildos',
    },
    {
      id: 'prod-harness',
      slug: 'premium-strap-on-harness-set-interchangeable-o-ring-system-f',
      nameEn: 'Premium Strap-On Harness Set',
      categorySlug: 'sex-toys',
    },
    {
      id: 'prod-zoro',
      slug: 'zoro-vibrating-cock-ring-delay-control-ring',
      nameEn: 'Zoro Vibrating Cock Ring',
      categorySlug: 'sex-toys',
    },
    {
      id: 'prod-sleeve',
      slug: 'silicone-textured-enhancement-sleeve',
      nameEn: 'Silicone Textured Enhancement Sleeve',
      categorySlug: 'sex-toys',
    },
    {
      id: 'prod-dual',
      slug: 'beaded-dual-silicone-toy-lebanon',
      nameEn: 'Beaded Dual Penetrator',
      categorySlug: 'male-toys',
    },
  ];

  for (const slug of GSC_FAILED_SLUGS) {
    const product = findProduct(mockProducts, slug);
    assert.ok(product, `Expected findProduct to match for slug: ${slug}`);
  }
});

test('next.config.mjs defines permanent 301 redirects for all 6 GSC routes', async () => {
  const redirects = await nextConfig.redirects();
  const redirectMap = new Map(redirects.map((r) => [r.source, r]));

  const requiredSources = [
    '/dildos/premium-adjustable-strap-on-harness-with-interchangeable-rin',
    '/sex-toys/premium-adjustable-strap-on-harness-with-interchangeable-rin',
    '/sex-toys/silicone-vibrating-cock-ring-comfortable-adjustable-cock-rin',
    '/dildos/silicone-strap-on-dildo-in-lebanon-',
    '/dildos/silicone-strap-on-dildo-in-lebanon',
    '/dildos/silicone-strap-on-dildo',
    '/sex-toys/penis-sleeve-reusable-silicone-extender-enhancer',
    '/sex-toys/double-ended-flexible-silicone-intimate-wellness-toy-ultra-s',
    '/sex-toys/lingerie-in-lebanon-luxury-sexy-lingerie-collection-vexa-sto',
  ];

  for (const source of requiredSources) {
    const entry = redirectMap.get(source);
    assert.ok(entry, `next.config.mjs must contain redirect for ${source}`);
    assert.equal(entry.permanent, true, `Redirect for ${source} must be permanent (301)`);
    assert.ok(entry.destination.startsWith('/'), `Destination for ${source} must be an absolute path`);
  }
});

test('vercel.json defines permanent 301 redirects for all 6 GSC routes and fixes broken targets', () => {
  const redirects = vercelJson.redirects;
  assert.ok(Array.isArray(redirects));

  const redirectMap = new Map(redirects.map((r) => [r.source, r]));

  const gscChecks = [
    {
      source: '/dildos/premium-adjustable-strap-on-harness-with-interchangeable-rin',
      expectedDest: 'https://vexatoys.com/sex-toys/premium-strap-on-harness-set-interchangeable-o-ring-system-f',
    },
    {
      source: '/sex-toys/silicone-vibrating-cock-ring-comfortable-adjustable-cock-rin',
      expectedDest: 'https://vexatoys.com/sex-toys/zoro-vibrating-cock-ring-delay-control-ring',
    },
    {
      source: '/dildos/silicone-strap-on-dildo-in-lebanon-',
      expectedDest: 'https://vexatoys.com/dildos/strap-on-harness-kit-with-silicone-dildo',
    },
    {
      source: '/sex-toys/penis-sleeve-reusable-silicone-extender-enhancer',
      expectedDest: 'https://vexatoys.com/sex-toys/silicone-textured-enhancement-sleeve',
    },
    {
      source: '/sex-toys/double-ended-flexible-silicone-intimate-wellness-toy-ultra-s',
      expectedDest: 'https://vexatoys.com/male-toys/beaded-dual-silicone-toy-lebanon',
    },
    {
      source: '/sex-toys/lingerie-in-lebanon-luxury-sexy-lingerie-collection-vexa-sto',
      expectedDest: 'https://vexatoys.com/lingerie',
    },
  ];

  for (const check of gscChecks) {
    const entry = redirectMap.get(check.source);
    assert.ok(entry, `vercel.json must contain redirect for ${check.source}`);
    assert.equal(entry.statusCode, 301, `vercel.json redirect for ${check.source} must be 301`);
    assert.equal(entry.destination, check.expectedDest);
  }

  // Verify repaired historical redirect targets in vercel.json
  const repairedChecks = [
    {
      source: '/sex-toys/realcock-premium-realistic-dildo-in-lebanon-hyper-realistic-',
      expectedDest: 'https://vexatoys.com/dildos/realcock-premium-realistic-dildo-in-lebanon-hyper-realistic',
    },
    {
      source: '/dildos/silicone-strap-on-dildo',
      expectedDest: 'https://vexatoys.com/dildos/strap-on-harness-kit-with-silicone-dildo',
    },
    {
      source: '/sex-toys/silicone-anal-plug-lebanon-smooth-beaded-plug-set',
      expectedDest: 'https://vexatoys.com/sex-toys/3-piece-anal-plug-set-s-m-l-anal-plugs-in-lebanon',
    },
    {
      source: '/sex-toys/dolphin-suction-vibrator-in-lebanon-rechargeable-clitoral-st',
      expectedDest: 'https://vexatoys.com/vibrators',
    },
    {
      source: '/male-toys/cock-ring-set-in-lebanon-4-piece-textured-silicone-enhanceme',
      expectedDest: 'https://vexatoys.com/sex-toys/textured-silicone-couples-enhancement-sleeve-with-beaded-des',
    },
  ];

  for (const check of repairedChecks) {
    const entry = redirectMap.get(check.source);
    assert.ok(entry, `vercel.json must contain repaired redirect for ${check.source}`);
    assert.equal(entry.statusCode, 301);
    assert.equal(entry.destination, check.expectedDest);
  }
});
