-- Vexa Toys: product name cleanup (release 1.7.1, 12 November 2026)
--
-- Fixes 13 published product names (misspellings, truncated words, old SEO
-- keyword padding, "Vexa Store" branding, a stray asterisk) and corrects the
-- two URL slugs that carried a typo. Hand-written SEO titles are not touched.
--
-- Run in the Supabase SQL editor as one transaction. The two slug changes are
-- paired with permanent redirects in the website release; deploy that release
-- within a few minutes of running this file so the old URLs keep working.
--
-- Rows are matched by id; the WHERE clauses also check the current name so the
-- script is safe to re-run and does nothing if a row was already changed.
-- Some stored names carry leading, trailing or doubled spaces that the site
-- trims away, so the name check compares a whitespace-normalised value.

BEGIN;

-- 1. Spelling mistakes and broken words --------------------------------------

UPDATE products SET
  name_en = 'Chastity Cage – Metal, 3 Ring Sizes',
  slug    = 'metal-chastity-cage-3-ring-sizes'
WHERE id = '7e61979b-018d-5f1a-a27b-c347ddb232b1'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'Chasity cage in lebanon';

UPDATE products SET
  name_en = 'Remote Control Wearable Prostate Massager – Purple Silicone',
  slug    = 'remote-control-wearable-prostate-massager-purple-silicone'
WHERE id = '71cd5919-8cbb-5c96-b13d-372ac995fc75'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'Remote Contro dildo Wearable Prostate Massager - Purple Silicone Dual Stimulation Device';

UPDATE products SET
  name_en = 'Portable Rechargeable 3-Speed Wand Massager'
WHERE id = '81e1f1dd-6bf0-502f-8ae1-40c89ec676b0'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'Portable Rechargeable vibration 3-Speed Wand Massager*';

-- 2. Old SEO keyword padding pasted into the name ----------------------------

UPDATE products SET
  name_en = 'Poppers – Intimate Relaxation Aroma'
WHERE id = 'bf79fb40-0e2b-5c1d-8833-bc8282b7087a'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'Poppers in Lebanon | Intimate Relaxation Products - Vexa Store';

UPDATE products SET
  name_en = '3-Piece Anal Plug Set – S, M & L'
WHERE id = '5b181083-5c09-56fd-bd56-9e185b9428bb'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = '3-Piece Anal Plug Set – S, M & L | Anal Plugs in Lebanon';

UPDATE products SET
  name_en = 'The Heaven 6-in-1 Dildo – Heating, Thrusting & Vibrating, Remote Control'
WHERE id = '1235f96a-db80-58b1-a124-f0fd112052a1'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'THE HEAVEN 6-IN-1 Dildo in lebanon – Heating, Thrusting & Vibrating (Remote Control)';

UPDATE products SET
  name_en = 'BDSM Bed Restraint Set – 10 Pieces, Leather Straps'
WHERE id = '769bd4a9-d612-5f59-b611-4cc4fddc50ab'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'BDSM Bed Restraint Set of 10 pcs – Leather Strap bdsm in lebanon';

UPDATE products SET
  name_en = 'Manual Dual-Layer Silicone Dildo'
WHERE id = '4fa4d0c3-755b-54d7-803f-c0bb53cc400a'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'Manual Dual-Layer Silicone Dildo in lebanon';

-- 3. Names that did not describe the product ---------------------------------

UPDATE products SET
  name_en = 'BDSM Beginner Set – 7 Pieces'
WHERE id = 'ccaf7383-4a28-5252-b557-3b78404cc591'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'Set of bdsm 7 pcs';

UPDATE products SET
  name_en = 'Realistic Thrusting Dildo – 2026 Edition, Suction Base'
WHERE id = 'ae05789a-4a91-564a-bf9b-191fc9d815be'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = '2026 upgraded realistic dildo thrusting intimate';

UPDATE products SET
  name_en = 'Ultra Grip Textured Silicone Dildo with Cock Ring'
WHERE id = 'd8d74bd3-0f7a-5311-88a6-0295e39a413d'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'Cock ring manual Ultra Grip Textured Dildo';

UPDATE products SET
  name_en = 'Durex Lubricant – 50 ml',
  name_ar = 'مزلق ديوريكس – 50 مل'
WHERE id = '3fe72370-92f3-596d-943c-a91d9c831d32'
  AND regexp_replace(btrim(name_en), '\s+', ' ', 'g') = 'Lubricants durex 50 ml';

-- 4. Verification: every row below should show its new name --------------------

SELECT id, name_en, name_ar, slug
FROM products
WHERE id IN (
  '7e61979b-018d-5f1a-a27b-c347ddb232b1', '71cd5919-8cbb-5c96-b13d-372ac995fc75',
  '81e1f1dd-6bf0-502f-8ae1-40c89ec676b0', 'bf79fb40-0e2b-5c1d-8833-bc8282b7087a',
  '5b181083-5c09-56fd-bd56-9e185b9428bb', '1235f96a-db80-58b1-a124-f0fd112052a1',
  '769bd4a9-d612-5f59-b611-4cc4fddc50ab', '4fa4d0c3-755b-54d7-803f-c0bb53cc400a',
  'ccaf7383-4a28-5252-b557-3b78404cc591', 'ae05789a-4a91-564a-bf9b-191fc9d815be',
  'd8d74bd3-0f7a-5311-88a6-0295e39a413d', '3fe72370-92f3-596d-943c-a91d9c831d32'
)
ORDER BY name_en;

COMMIT;
