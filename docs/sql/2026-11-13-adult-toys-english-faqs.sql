-- Vexa Toys: English-only FAQs for the adult-toys category
--
-- The five English FAQs on category_editorial.faqs for adult-toys carried the
-- Arabic question and answer in front of the English text ("... / Do you
-- deliver ..."), added before faqs_ar existed. The Arabic page now has its own
-- faqs_ar, so the English list keeps only the English half of each pair. Same
-- five questions, same order, same facts.
--
-- Guarded by the current first question and the row count, so it does nothing
-- if the list was edited since.

BEGIN;

UPDATE public.category_editorial
SET faqs = $en$[
 {
  "q": "Do you deliver adult toys discreetly in Lebanon?",
  "a": "Yes. Every order ships in a plain sealed box — no logo, no branding, no indication of contents. Same-day delivery in Beirut."
 },
 {
  "q": "Is cash on delivery available for adult toys?",
  "a": "Yes. Cash on delivery (COD) is available for all adult toy orders across Lebanon. No online payment required."
 },
 {
  "q": "What is the best adult toy for beginners in Lebanon?",
  "a": "For beginners, we recommend a small bullet vibrator (women) or a basic masturbator (men). Both are easy to use, discreet in size, and available for same-day delivery in Beirut."
 },
 {
  "q": "Are adult toys body-safe?",
  "a": "Yes. All products use certified body-safe materials: medical-grade silicone, ABS plastic, borosilicate glass and stainless steel."
 },
 {
  "q": "How fast is adult toy delivery in Beirut?",
  "a": "Same-day in Beirut & suburbs. 24–72 hours for other Lebanese regions."
 }
]$en$::jsonb
WHERE slug = 'adult-toys'
  AND jsonb_array_length(faqs) = 5
  AND faqs->0->>'q' = 'هل توصلون ألعاب للكبار بشكل سري في لبنان؟ / Do you deliver adult toys discreetly in Lebanon?';

-- Verification: five questions, none containing Arabic script.
SELECT slug, jsonb_array_length(faqs) AS faqs_en, faqs::text ~ '[؀-ۿ]' AS still_has_arabic
FROM public.category_editorial WHERE slug = 'adult-toys';

COMMIT;
