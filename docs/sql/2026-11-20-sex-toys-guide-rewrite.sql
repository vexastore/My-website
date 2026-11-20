-- Vexa Toys: /sex-toys editorial guide, second pass of "one page for the phrase"
--
-- The home page owns "sex toys in Lebanon" (release 1.7.4). The /sex-toys guide
-- still used the exact phrase four times, plus "#1 destination" and "500+
-- products", claims the site makes nowhere else. This rewrite keeps every fact
-- (plain sealed box, cash on delivery, same-day Beirut, 48 to 72 hours elsewhere,
-- body-safe materials, WhatsApp) and the same length, but describes the page as
-- the online sex shop, which is its H1 since 1.7.4. The Arabic guide's opening
-- sentence loses the phrase the same way; the rest of the Arabic text is untouched.
--
-- Guarded by the md5 of the current English guide and by the exact Arabic
-- sentence, so rerunning or running after a hand edit does nothing.

BEGIN;

UPDATE public.category_editorial SET
guide = $g$Vexa Toys is an online sex shop for the whole of Lebanon. Every order ships in a plain sealed box with no branding, no receipt visible from outside and no indication of the contents, and you pay cash on delivery, so you never enter card details online. Delivery is same-day in Beirut when the item is in stock and the order is confirmed in time, and within 48 to 72 hours to every other region.

The range covers every category of intimate product: vibrators for solo or couple use, body-safe silicone dildos in every size, male masturbators, BDSM and bondage gear for couples, lingerie, anal toys, lubricants and more. Products come from established global brands in certified body-safe materials, silicone, ABS plastic, borosilicate glass and stainless steel, with no cheap rubber, jelly or PVC.

Shopping here is simple and private. Browse by category, add to cart and choose your delivery window. Our riders deliver to your door, and your purchase stays between you and Vexa Toys: customer data is never shared.

Whether it is your first purchase or an addition to a collection, the team answers on WhatsApp around the clock with personal recommendations. This page lists everything in the shop in one place; the category pages narrow it down by type, and each product page gives the material, the dimensions and the power source before you order.$g$
WHERE slug = 'sex-toys'
  AND md5(guide) = '34708dead2681a0ae9858dd89a765c93';

UPDATE public.category_editorial SET
guide_ar = replace(guide_ar, 'فيكسا تويز هو متجرك الأول للألعاب الجنسية في لبنان:', 'فيكسا تويز متجر جنسي أونلاين يخدم كل لبنان:')
WHERE slug = 'sex-toys'
  AND guide_ar LIKE '%فيكسا تويز هو متجرك الأول للألعاب الجنسية في لبنان:%';

-- Verification: phrase gone from both guides (0 = not found), length kept.
SELECT slug,
  position('sex toys in Lebanon' in guide) AS en_phrase_pos,
  position('الألعاب الجنسية في لبنان' in guide_ar) AS ar_phrase_pos,
  length(guide) AS en_chars, left(guide, 60) AS en_start, left(guide_ar, 60) AS ar_start
FROM public.category_editorial WHERE slug = 'sex-toys';

COMMIT;
