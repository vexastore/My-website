-- Vexa Toys: last Arabic mention of the phrase in the /sex-toys guide (release 1.7.8)
--
-- After docs/sql/2026-11-20-sex-toys-guide-rewrite.sql, one sentence of the
-- Arabic guide still used "الألعاب الجنسية في لبنان" (the Arabic form of the
-- phrase the home page owns). Same meaning, worded as the online shop instead.
-- Exact-match guarded: rerunning or running after a hand edit does nothing.

BEGIN;

UPDATE public.category_editorial SET
guide_ar = replace(guide_ar,
  'لم يكن شراء الألعاب الجنسية في لبنان أسهل أو أكثر خصوصية:',
  'لم يكن الشراء من متجر جنسي أونلاين في لبنان أسهل أو أكثر خصوصية:')
WHERE slug = 'sex-toys'
  AND guide_ar LIKE '%لم يكن شراء الألعاب الجنسية في لبنان أسهل أو أكثر خصوصية:%';

-- Verification: 0 means the phrase is gone from the Arabic guide.
SELECT slug, position('الألعاب الجنسية في لبنان' in guide_ar) AS ar_phrase_pos, left(guide_ar, 80) AS ar_start
FROM public.category_editorial WHERE slug = 'sex-toys';

COMMIT;
