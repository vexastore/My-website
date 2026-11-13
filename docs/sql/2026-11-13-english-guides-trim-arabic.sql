-- Vexa Toys: trim the Arabic sentences out of the English category guides
--
-- Five English guides in category_editorial.guide open or close with an Arabic
-- paragraph (added for Arabic SEO before guide_ar existed). The storefront hides
-- a guide on the English page when it contains Arabic script, so these five
-- pages show no guide block at all: /adult-toys, /sex-toys, /dildos,
-- /male-toys, /masturbators. Each row now has a full Arabic guide in guide_ar,
-- so the Arabic paragraphs are removed and the English guide appears again.
--
-- Guarded by the md5 of the current text and by a non-empty guide_ar, so it
-- does nothing if the guide was edited since or the Arabic guide is missing.

BEGIN;

-- adult-toys: drops 2 Arabic paragraph(s), keeps 4 English
UPDATE public.category_editorial SET guide = $en$Vexa Store is Lebanon's #1 shop for adult toys in Lebanon — delivering 500+ products with 100% discreet packaging across Beirut and all Lebanese regions. When you order adult toys in Lebanon from Vexa Store, your package arrives in a plain sealed box with no logo, no branding, and zero indication of the contents. The delivery rider has no idea what is inside.

Our adult toy range covers every category: vibrators (bullet, wand, rabbit, G-spot, suction), body-safe silicone dildos in realistic and non-realistic styles, male masturbators and penis pumps, BDSM and bondage kits for couples, luxury lingerie, anal toys, lubricants, sexual enhancers, and more. All products use certified body-safe materials — medical-grade silicone, ABS plastic, borosilicate glass, and stainless steel.

Buying adult toys in Lebanon is now completely private and simple. Browse by category, add to cart, and place your order. Pay cash on delivery — no credit card, no PayPal, no online payment. We deliver same-day in Beirut and within 24–72 hours across Lebanon.

Our WhatsApp support team is available daily for private, judgment-free product recommendations. First-time buyer? We will guide you to the right adult toy based on your needs and experience level.$en$
WHERE slug = 'adult-toys' AND md5(guide) = '4045b9bea17a66be16635335bfb7c607' AND guide_ar <> '';

-- dildos: drops 1 Arabic paragraph(s), keeps 5 English
UPDATE public.category_editorial SET guide = $en$Dildos are one of the oldest and most versatile categories of intimate products. Vexa Store Lebanon carries a wide selection — from slim beginner-friendly designs to realistic large-size options — all made from certified body-safe materials. Every order ships to any Lebanese address in a plain box with no exterior markings.

The two most popular materials are silicone and glass. Medical-grade silicone is soft, flexible, non-porous, and hypoallergenic — the gold standard for body-safe sex toys. Borosilicate glass is firm, smooth, non-porous, and compatible with any lubricant including silicone-based. Both are easy to sterilise and long-lasting.

Realistic dildos are modelled to simulate the look and feel of the real thing. Non-realistic dildos focus on function over aesthetics and often include ergonomic shapes, curves, or ridges for enhanced G-spot or P-spot stimulation. Vibrating dildos add motorised stimulation for a combined experience.

When choosing size, start conservatively if you are new to the category — you can always upgrade. Always use a water-based lubricant with silicone toys to preserve the material. Cash on delivery and discreet same-day shipping in Beirut is available for all orders.

Looking for dildos in Lebanon? Vexa Store is the easiest place to buy a dildo in Lebanon online — with cash on delivery and plain packaging on every order.$en$
WHERE slug = 'dildos' AND md5(guide) = '234aa1fd9189a6646f9a4a2d97a5bcea' AND guide_ar <> '';

-- male-toys: drops 1 Arabic paragraph(s), keeps 5 English
UPDATE public.category_editorial SET guide = $en$Male sex toys have evolved dramatically — far beyond the basic options of ten years ago. Vexa Store Lebanon stocks a comprehensive range of male pleasure products including masturbators, penis pumps, cock rings, prostate massagers, and chastity devices. All ship in plain sealed packaging with cash on delivery available.

The most popular category is male masturbators — devices with realistic internal texture that simulate penetration. These range from simple sleeve designs to automatic, thrusting models with multiple speeds. For men interested in stamina, cock rings are an affordable entry point: they maintain stronger erections and delay climax. Penis pumps are used for erectile training and temporary size enhancement, and have a medical history of legitimate use.

Prostate massagers are a growing category — the prostate gland (also called the male G-spot) responds strongly to targeted vibration. Many men report prostate stimulation produces significantly more intense orgasms.

All male toys at Vexa Store are made from body-safe silicone, ABS plastic, or TPE (thermoplastic elastomer). We do not carry cheap rubber or latex products. Delivery across Lebanon is discreet, fast, and available with COD.

Vexa Store carries the widest range of male sex toys in Lebanon, all shipped in unmarked boxes.$en$
WHERE slug = 'male-toys' AND md5(guide) = '97b3b773e2ea6be606f12c2714635041' AND guide_ar <> '';

-- masturbators: drops 1 Arabic paragraph(s), keeps 4 English
UPDATE public.category_editorial SET guide = $en$Male masturbators — sometimes called pocket pussies, strokers, or sleeves — are handheld devices with a textured internal channel designed to simulate various sexual sensations. Vexa Store Lebanon carries manual sleeves, automatic thrusting models, and premium masturbation cups from leading global brands. All ship discreetly with COD.

The internal texture is the primary differentiator between masturbators. Tight ribbed textures create intense friction. Wavy or nub textures are gentler and better for extended sessions. Realistic oral, vaginal, or anal-shaped openings are popular for their familiar sensation. Premium models like the Fleshlight use SuperSkin material — a proprietary formula that closely mimics real skin texture.

Automatic masturbators do the work for you — motorised sleeves or thrusting devices with multiple speed and pattern settings. These are hands-free options ideal for solo sessions or as a couple's accessory. Heating features (some models warm the internal sleeve to body temperature) significantly enhance the experience.

Cleaning masturbators thoroughly after each use is critical. TPE and SuperSkin are porous materials — bacteria can grow inside the channel if not dried and cleaned properly. Rinse with warm water and dedicated toy cleaner, then allow to dry completely before storage. Never use silicone lubricant with TPE devices.$en$
WHERE slug = 'masturbators' AND md5(guide) = '6cc163610a96ba41e5017e7969f9c037' AND guide_ar <> '';

-- sex-toys: drops 1 Arabic paragraph(s), keeps 5 English
UPDATE public.category_editorial SET guide = $en$Vexa Store Lebanon is your #1 destination for sex toys in Lebanon and adult toys in Lebanon — 500+ products available for same-day discreet delivery across Beirut and all Lebanese regions. Every order ships in a plain sealed box with no branding, no receipts visible from outside, and no indication of the contents. We accept cash on delivery, so you never need to enter card details online.

Our collection spans every category of intimate products: vibrators for solo or couple use, body-safe silicone dildos in every size, male masturbators, BDSM and bondage gear for couples, luxury lingerie, anal toys, lubricants, and more. All products are sourced from reputable global brands using certified body-safe materials — silicone, ABS plastic, and stainless steel — with no cheap rubber or PVC.

Shopping for sex toys in Lebanon has never been simpler or more private. Browse by category, add to cart, and choose your delivery window. Our discreet riders deliver to your door in Beirut the same day, or within 48–72 hours to other regions. Your purchase stays completely between you and Vexa Store — we never share customer data.

Whether you're buying for the first time or adding to your collection, our team is available 24/7 via WhatsApp for personalised recommendations.

Whether you want to buy sex toys in Lebanon for solo play or are browsing couples sex toys in Lebanon for shared experiences, our range covers every level of experience. As a fully online sex shop in Lebanon, we make sex toys delivery in Lebanon simple: order today, and discreet sex toys packaging plus same-day sex toys delivery in Beirut keep your privacy fully protected.$en$
WHERE slug = 'sex-toys' AND md5(guide) = '869391d36582264388c9d5d1f8f0482b' AND guide_ar <> '';

-- Verification: no Arabic script should remain in any English guide.
SELECT slug, length(guide) AS guide_en_chars, guide ~ '[؀-ۿ]' AS still_has_arabic
FROM public.category_editorial ORDER BY slug;

COMMIT;
