-- Vexa Toys: Arabic guide and FAQ columns on category_editorial (release 1.7.2)
--
-- Adds two columns next to the English ones. Both default to empty, so every
-- existing row keeps working and the storefront falls back to the bilingual
-- code content for a category until its Arabic fields are filled in.
--
--   guide_ar  text   : the Arabic buying guide (plain text, paragraphs separated by blank lines)
--   faqs_ar   jsonb  : an array of {"q": "...", "a": "..."} objects, same shape as faqs
--
-- Run once in the Supabase SQL editor. RLS is unchanged: anonymous read,
-- admin-only write, because the policies are on the table, not the columns.

BEGIN;

ALTER TABLE public.category_editorial
  ADD COLUMN IF NOT EXISTS guide_ar text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS faqs_ar jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.category_editorial
  DROP CONSTRAINT IF EXISTS category_editorial_faqs_ar_is_array,
  ADD CONSTRAINT category_editorial_faqs_ar_is_array CHECK (jsonb_typeof(faqs_ar) = 'array');

COMMENT ON COLUMN public.category_editorial.guide_ar IS 'Arabic buying guide shown on /ar/<category>; empty means use the code fallback.';
COMMENT ON COLUMN public.category_editorial.faqs_ar IS 'Arabic FAQ list [{"q","a"}] shown on /ar/<category>; empty means use the code fallback.';

-- Verification: every row, with the new columns present and empty.
SELECT slug, length(guide) AS guide_en_chars, jsonb_array_length(faqs) AS faqs_en,
       length(guide_ar) AS guide_ar_chars, jsonb_array_length(faqs_ar) AS faqs_ar
FROM public.category_editorial
ORDER BY slug;

COMMIT;
