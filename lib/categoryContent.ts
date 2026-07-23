export interface CategoryContent {
  guide: string;
  faqs: Array<{ q: string; a: string }>;
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  'sex-toys': {
    guide: `Vexa Store Lebanon is your most trusted destination for adult toys — with 500+ products available for same-day discreet delivery across Beirut and all Lebanese regions. Every order ships in a plain sealed box with no branding, no receipts visible from outside, and no indication of the contents. We accept cash on delivery, so you never need to enter card details online.

Our collection spans every category of intimate products: vibrators for solo or couple use, body-safe silicone dildos in every size, male masturbators, BDSM and bondage gear for couples, luxury lingerie, anal toys, lubricants, and more. All products are sourced from reputable global brands using certified body-safe materials — silicone, ABS plastic, and stainless steel — with no cheap rubber or PVC.

Shopping for sex toys in Lebanon has never been simpler or more private. Browse by category, add to cart, and choose your delivery window. Our discreet riders deliver to your door in Beirut the same day, or within 48–72 hours to other regions. Your purchase stays completely between you and Vexa Store — we never share customer data.

Whether you're buying for the first time or adding to your collection, our team is available 24/7 via WhatsApp for personalised recommendations.`,
    faqs: [
      { q: 'Do you deliver sex toys discreetly in Lebanon?', a: 'Yes. Every order ships in a plain sealed box with no logos or labels. The delivery rider carries no indication of what is inside. Same-day delivery is available in Beirut.' },
      { q: 'Can I pay cash on delivery?', a: 'Absolutely. Cash on delivery (COD) is available for all orders across Lebanon. You pay the rider when you receive your package — no online payment required.' },
      { q: 'Are the products body-safe?', a: 'Yes. All products at Vexa Store use certified body-safe materials: medical-grade silicone, ABS plastic, borosilicate glass, and stainless steel. We do not carry PVC, rubber, or jelly toys.' },
    ],
  },

  'vibrators': {
    guide: `Vibrators are the most popular intimate product category worldwide — and for good reason. At Vexa Store Lebanon, we carry 100+ vibrator models to suit every preference, experience level, and budget. All ship discreetly to your door in Beirut or any Lebanese region.

The main types available are bullet vibrators (small, precise, ideal for beginners), wand vibrators (powerful, broad stimulation), rabbit vibrators (dual internal and external stimulation), G-spot vibrators (curved for targeted internal pleasure), and clitoral suction toys (air-pulse technology). Most models offer 7–20 vibration patterns and are fully rechargeable via USB.

When choosing, prioritise body-safe silicone over plastic — it's softer, non-porous, and hypoallergenic. Look for waterproof or IPX7-rated models for easy cleaning. Noise level matters for discretion: most quality models operate under 50 dB. If you're a first-time buyer, start with a mid-range bullet or rabbit vibrator before investing in a premium wand.

All vibrators at Vexa Store come in discreet packaging with no visible branding. Cash on delivery is available, and same-day shipping is offered in Beirut.`,
    faqs: [
      { q: 'What vibrator is best for beginners in Lebanon?', a: 'A small bullet vibrator or a simple rabbit vibrator is ideal for beginners. They are easy to control, quiet, and deliver strong results without being overwhelming. Vexa Store carries beginner-friendly options from $15 upward.' },
      { q: 'Are vibrators waterproof?', a: 'Most vibrators we carry are waterproof (IPX7 rated) or at minimum splashproof. This makes them safe to use in the shower and much easier to clean thoroughly after use.' },
      { q: 'How long does the battery last on a vibrator?', a: 'Rechargeable vibrators typically last 1–3 hours per charge depending on the intensity setting. Most charge fully in 60–90 minutes via USB. Battery-powered models depend on the battery type.' },
    ],
  },

  'male-toys': {
    guide: `Male sex toys have evolved dramatically — far beyond the basic options of ten years ago. Vexa Store Lebanon stocks a comprehensive range of male pleasure products including masturbators, penis pumps, cock rings, prostate massagers, and chastity devices. All ship in plain sealed packaging with cash on delivery available.

The most popular category is male masturbators — devices with realistic internal texture that simulate penetration. These range from simple sleeve designs to automatic, thrusting models with multiple speeds. For men interested in stamina, cock rings are an affordable entry point: they maintain stronger erections and delay climax. Penis pumps are used for erectile training and temporary size enhancement, and have a medical history of legitimate use.

Prostate massagers are a growing category — the prostate gland (also called the male G-spot) responds strongly to targeted vibration. Many men report prostate stimulation produces significantly more intense orgasms.

All male toys at Vexa Store are made from body-safe silicone, ABS plastic, or TPE (thermoplastic elastomer). We do not carry cheap rubber or latex products. Delivery across Lebanon is discreet, fast, and available with COD.`,
    faqs: [
      { q: 'Are male sex toys discreet to order in Lebanon?', a: 'Yes. All male toys ship in plain sealed boxes with no external labels, logos, or product names. The delivery rider has no idea what is in the package. Same-day Beirut delivery available.' },
      { q: 'What is the difference between a masturbator and a pocket pussy?', a: 'They are the same product category. A pocket pussy or masturbator is a handheld sleeve device with an internal textured channel designed for male stimulation. Different products vary by texture, tightness, and material.' },
      { q: 'Do cock rings actually work?', a: 'Yes — cock rings work by gently restricting blood flow out of the penis, helping maintain a stronger erection and often delaying orgasm. Silicone cock rings are the safest and most comfortable option for beginners.' },
    ],
  },

  'dildos': {
    guide: `Dildos are one of the oldest and most versatile categories of intimate products. Vexa Store Lebanon carries a wide selection — from slim beginner-friendly designs to realistic large-size options — all made from certified body-safe materials. Every order ships to any Lebanese address in a plain box with no exterior markings.

The two most popular materials are silicone and glass. Medical-grade silicone is soft, flexible, non-porous, and hypoallergenic — the gold standard for body-safe sex toys. Borosilicate glass is firm, smooth, non-porous, and compatible with any lubricant including silicone-based. Both are easy to sterilise and long-lasting.

Realistic dildos are modelled to simulate the look and feel of the real thing. Non-realistic dildos focus on function over aesthetics and often include ergonomic shapes, curves, or ridges for enhanced G-spot or P-spot stimulation. Vibrating dildos add motorised stimulation for a combined experience.

When choosing size, start conservatively if you are new to the category — you can always upgrade. Always use a water-based lubricant with silicone toys to preserve the material. Cash on delivery and discreet same-day shipping in Beirut is available for all orders.`,
    faqs: [
      { q: 'What is the safest material for a dildo?', a: 'Medical-grade silicone is the safest choice — it is non-porous, hypoallergenic, easy to clean, and holds no bacteria. Borosilicate glass and stainless steel are also excellent. Avoid rubber, jelly, or PVC products.' },
      { q: 'Can I use a dildo with a harness?', a: 'Yes — many dildos are harness-compatible (designed with a flat base). If you plan to use one with a strap-on harness, confirm the product has a flared base before purchasing.' },
      { q: 'What lubricant should I use with a silicone dildo?', a: 'Use water-based lubricant only. Silicone-based lubricant can degrade silicone toy surfaces over time. Water-based lubricants are safe with all materials and easy to clean up.' },
    ],
  },

  'lingerie': {
    guide: `Lingerie is one of the most powerful tools for intimacy — the right piece can transform confidence, set the mood, and create lasting memories. Vexa Store Lebanon carries a curated selection of luxury lingerie including lace bra-and-panty sets, satin babydolls, bodysuit styles, garter sets, and open-style pieces for couples. All ship in discreet plain packaging to any Lebanese address.

Our collection spans sizes XS through 3XL. The most popular fabrics are stretch lace (elegant, breathable, flattering on all body types), satin (smooth, cool, luxurious feel), and mesh (sheer, modern, versatile). Thicker structured pieces are better for photo occasions; lighter mesh and lace work best for everyday intimate wear.

When selecting lingerie, consider the occasion: a lace bra-and-panty set is a classic and universally appreciated gift, while a full bodysuit makes a bolder statement. Babydoll styles are flattering and easy to size. Garter sets add an element of theatre and work beautifully for special anniversaries.

All lingerie at Vexa Store is packaged in tissue paper inside a plain outer box — completely discreet. We offer same-day delivery in Beirut and COD for all orders.`,
    faqs: [
      { q: 'How do I choose the right lingerie size?', a: 'Most lingerie is sized by bra cup and waist measurement. Check the size chart on each product listing. If you are between sizes, size up for comfort. Stretch fabrics are generally forgiving across one size up or down.' },
      { q: 'Is lingerie from Vexa Store discreetly packaged?', a: 'Yes. All lingerie ships in a plain sealed outer box with no visible product name, store logo, or imagery. Safe to receive at home or at a pickup point.' },
      { q: 'Can I buy lingerie as a gift in Lebanon?', a: 'Absolutely. Lingerie makes an excellent intimate gift for anniversaries, Valentine\'s Day, and special occasions. Vexa Store ships to any Lebanese address with COD — the recipient can pay on delivery if needed.' },
    ],
  },

  'bdsm': {
    guide: `BDSM — Bondage, Discipline, Dominance, Submission, Sadism, and Masochism — encompasses a wide range of consensual power-play activities between adults. Vexa Store Lebanon carries a comprehensive selection of BDSM gear for beginners through experienced players: restraints, blindfolds, paddles, crops, feather ticklers, nipple clamps, ball gags, and complete beginner kits. All ship in discreet packaging with COD.

The most important principle in BDSM is SSC: Safe, Sane, and Consensual. Every activity should be agreed upon by all participants in advance, with a clear safe word in place. Start with soft restraints and blindfolds before moving to more advanced equipment — this builds trust and communication between partners.

For beginners, a starter kit is the easiest entry point. These typically include velcro or satin wrist cuffs, a soft blindfold, a feather tickler, and sometimes a short paddle or restraint set — everything needed to explore the basics without overwhelming investment.

Quality matters in BDSM equipment. Cheap materials can chafe, cause bruising, or break under tension. Vexa Store only carries products from reputable manufacturers using padded faux-leather, reinforced stitching, and body-safe materials.`,
    faqs: [
      { q: 'Is BDSM safe for beginners?', a: 'Yes, when practiced with consent, communication, and appropriate equipment. Start with soft restraints and a blindfold, establish a safe word, and never leave a restrained partner unattended. Beginner kits from Vexa Store include instructions.' },
      { q: 'What BDSM items are best to start with?', a: 'Wrist cuffs (velcro or satin), a soft blindfold, and a feather tickler are the ideal starting point. These add excitement with minimal risk. A beginner kit bundles everything together at a discounted price.' },
      { q: 'How are BDSM products delivered in Lebanon?', a: 'All BDSM products ship in a plain sealed outer box with no product description, imagery, or store branding visible. Same-day delivery in Beirut, 48–72 hours to other regions. Cash on delivery available.' },
    ],
  },

  'butt-plugs': {
    guide: `Butt plugs are one of the most popular anal toys for both beginners and experienced users. Vexa Store Lebanon stocks a wide range — from slim tapered starter plugs to vibrating premium models — all in certified body-safe materials. Discreet same-day delivery in Beirut, COD available.

The most important feature of any butt plug is a flared base. Unlike vaginal anatomy, the rectum has no natural stopping point — a flared base prevents the toy from being pulled inward. Never use a toy without a flared base anally. All butt plugs at Vexa Store have properly flared bases.

Materials matter: medical-grade silicone is soft, flexible, non-porous, and the most comfortable option for beginners. Stainless steel and glass are firm, smooth, and ideal for temperature play — warming or cooling them before use creates distinct sensations. Both are non-porous and easy to sterilise.

For first-time users, start with a slim tapered design under 3cm diameter. Use generous amounts of thick water-based lubricant — unlike vaginal tissue, the rectum does not self-lubricate. Go slowly, relax your muscles, and never force insertion. Vibrating butt plugs add an additional sensation layer once you are comfortable with the basic experience.`,
    faqs: [
      { q: 'What size butt plug is right for a beginner?', a: 'For first-time anal use, choose a slim tapered plug with a maximum diameter of 2.5–3cm. Look for a smooth tapered shape that gradually increases in width. Silicone material is the most comfortable for beginners.' },
      { q: 'What lubricant should I use with a butt plug?', a: 'Use a thick water-based anal lubricant. The rectum does not self-lubricate, so generous lubrication is essential. If your plug is silicone, avoid silicone-based lubricants — they can degrade the material.' },
      { q: 'Are butt plugs safe to use?', a: 'Yes, when used correctly with a flared base, appropriate lubricant, and gradual insertion. Never use toys without a flared base anally. Start small, go slowly, and stop if you feel sharp pain.' },
    ],
  },

  'anal-toys': {
    guide: `Anal toys cover a broader category than butt plugs alone — including anal beads, prostate massagers, anal vibrators, anal dildos, and training kits. Vexa Store Lebanon stocks all of these in body-safe materials with discreet delivery across Lebanon.

Anal beads are a popular entry point: a string of progressively larger beads designed for gradual insertion and removal. The sensation of removing beads during orgasm is intensely pleasurable for many users. They come in silicone (flexible, soft) and ABS plastic (firm, smooth) versions.

Prostate massagers are specifically curved to reach and stimulate the prostate gland — the walnut-sized gland located a few centimetres inside the rectum toward the belly button. For men, prostate stimulation often produces significantly more intense orgasms than penile stimulation alone. Many prostate massagers include external perineum stimulation for dual pleasure.

For anal training, beginner kits include 3 plugs of increasing size — allowing gradual expansion over time. Always use dedicated anal lubricant, go at your own pace, and ensure any toy used has a flared base. Start with the smallest size and only progress when fully comfortable.`,
    faqs: [
      { q: 'What is the difference between anal beads and a butt plug?', a: 'A butt plug is worn in place for continuous stimulation. Anal beads are designed for insertion and withdrawal — the sensation comes from the movement of each bead passing through the anal sphincter.' },
      { q: 'Do prostate massagers work for everyone?', a: 'Prostate massagers are designed for people with a prostate gland. When used correctly, most men find prostate stimulation intensely pleasurable. It may take a few sessions to find the right angle and pressure.' },
      { q: 'How do I clean anal toys properly?', a: 'Non-porous materials (silicone, glass, stainless steel) can be cleaned with warm water and mild soap, or boiled for full sterilisation. Porous materials like TPE should be used with a condom. Clean immediately after each use.' },
    ],
  },

  'bondage': {
    guide: `Bondage — the practice of restraining a partner for erotic pleasure — is one of the most widely practiced BDSM activities worldwide. Vexa Store Lebanon carries an extensive selection of bondage gear: wrist and ankle cuffs, under-bed restraint systems, rope, spreader bars, body harnesses, and combination kits. All ship in plain boxes with COD.

The key to safe bondage is preparation. Always establish a safe word before any session. Inspect restraints for comfort — cuffs should be snug but allow two fingers underneath. Never restrain circulation for more than 15–20 minutes. Keep safety scissors nearby when using rope or complex restraints.

For beginners, padded velcro or satin cuffs are the safest and most comfortable starting point. They are easy to remove quickly in an emergency, adjustable, and comfortable for extended wear. Under-bed restraint systems are an excellent step up — they attach under the mattress and allow full spread-eagle restraint without complex knot-tying.

Rope bondage (Shibari) is a more advanced practice with its own aesthetic and technique. If interested, start with smooth soft rope and simple wraps around the wrists — never around the neck or with slip knots. Vexa Store carries beginner bondage rope sets with safety instructions included.`,
    faqs: [
      { q: 'What bondage gear is safest for beginners?', a: 'Padded velcro or satin wrist cuffs are the safest and easiest starting point. They are adjustable, comfortable, and easy to remove instantly. Under-bed restraint systems are the next step and require no knot-tying skill.' },
      { q: 'How tight should restraints be?', a: 'Restraints should be firm enough to hold but loose enough to slip two fingers underneath. Restraints that are too tight can cut off circulation within minutes. Always check in with your partner regularly.' },
      { q: 'Is bondage delivered discreetly in Lebanon?', a: 'Yes. All bondage products from Vexa Store ship in plain sealed outer boxes with no product labelling or branding visible. Cash on delivery is available across all Lebanese regions.' },
    ],
  },

  'sex-dolls': {
    guide: `Sex dolls have become increasingly sophisticated — modern models use TPE (thermoplastic elastomer) or silicone to create realistic skin texture, weight, and warmth response. Vexa Store Lebanon carries a selection of sex dolls from torso models through full-body designs, all shipping discreetly with same-day Beirut delivery available.

TPE dolls are softer and more affordable, with a skin texture close to silicone at a lower price point. Full silicone dolls are firmer, more durable, and easier to sterilise but cost significantly more. Both materials are non-toxic and body-safe when sourced from reputable manufacturers.

Sex dolls require proper care to maintain their condition and hygiene. Clean all openings thoroughly after each use with warm water and antibacterial toy cleaner. Dry completely before storage — moisture left inside causes mold growth. Apply renewal powder periodically to maintain TPE skin texture. Store in a neutral position to avoid permanent deformation of joints or material.

All sex dolls at Vexa Store ship in unmarked outer boxes sized for the specific product. Delivery is handled by our trusted discreet riders in Beirut. For larger full-body models, delivery is arranged privately to ensure complete privacy.`,
    faqs: [
      { q: 'What is the difference between TPE and silicone sex dolls?', a: 'TPE (thermoplastic elastomer) is softer, more affordable, and has a realistic skin feel. Silicone is firmer, more durable, and easier to sterilise. Both are body-safe. TPE is the most common material for entry to mid-range dolls.' },
      { q: 'How do I clean a sex doll properly?', a: 'Use warm water and antibacterial toy cleaner for all openings after each use. Dry thoroughly — never store wet. Apply renewal (cornstarch or baby) powder to TPE skin monthly to maintain texture and prevent stickiness.' },
      { q: 'Are sex dolls shipped discreetly to Lebanon?', a: 'Yes. All sex dolls ship in plain outer cartons with no visible product description, images, or store branding. Delivery is handled by our discreet team. Cash on delivery is available.' },
    ],
  },

  'strap-ons': {
    guide: `Strap-ons are harness and dildo systems worn on the body, used by couples of all genders and orientations. Vexa Store Lebanon carries adjustable strap-on harnesses, compatible dildos, and complete combo sets. All ship discreetly with COD available.

There are three main harness styles: bikini-style (adjustable straps around the waist and thighs — the most popular and comfortable for beginners), jockstrap style (open-back design, preferred by some male users), and underwear style (built into briefs for a more comfortable fit). Most harnesses are adjustable to fit waist sizes 24"–52".

The dildo must be harness-compatible — meaning it has a flat, flared base that sits in the O-ring of the harness. O-ring size varies between harnesses (most standard O-rings are 1.5"–2"), so confirm compatibility when selecting. Many harnesses come with interchangeable O-rings to fit multiple dildo sizes.

Strapless strap-ons (also called feeldoe-style) are worn without a harness — one end is held internally by the wearer while the other penetrates the partner. These require practice and strong pelvic floor muscles. Vibrating strapless models are the most popular option as the vibration assists with retention.`,
    faqs: [
      { q: 'What strap-on harness is best for beginners?', a: 'A bikini-style adjustable harness is the best starting point. It is comfortable, easy to fit, compatible with most O-ring dildos, and available in one-size-fits-most adjustable designs. Pair it with a slim realistic dildo for first use.' },
      { q: 'Do strap-on dildos need to be special?', a: 'Yes — the dildo must have a flat flared base to sit in the harness O-ring. Standard dildos with a tapered or rounded base will not stay in place. Check that your chosen dildo is described as "harness compatible" or has a flared base.' },
      { q: 'Can same-sex couples use strap-ons?', a: 'Absolutely. Strap-ons are popular among lesbian, gay, and heterosexual couples alike. They allow penetration regardless of anatomy and are widely used for pegging (female partner penetrating male partner anally).' },
    ],
  },

  'kegel-balls': {
    guide: `Kegel balls — also called Ben Wa balls or geisha balls — are weighted spheres worn internally to strengthen the pelvic floor muscles. Vexa Store Lebanon carries silicone and ABS kegel ball sets in single and double designs, with and without vibration. All ship discreetly with COD.

The pelvic floor is a group of muscles that support the bladder, uterus, and rectum. Strengthening them through kegel exercise — or by wearing weighted kegel balls — reduces urinary incontinence, enhances sexual sensation, speeds postnatal recovery, and can significantly intensify orgasms. Many gynaecologists recommend kegel training as preventative pelvic floor care.

Kegel balls work by creating a gentle weight that the pelvic floor muscles must hold in place. This passive resistance strengthens muscles over time. Start with lighter single balls (25–35g) and progress to heavier dual-ball designs as strength improves. Standard beginner sessions last 15–30 minutes.

Vibrating kegel balls add a pleasurable element while training, and many remote-controlled designs are now available for discreet wear in public. All products at Vexa Store are made from body-safe silicone with a silicone retrieval cord. Do not use kegel balls if pregnant without medical approval.`,
    faqs: [
      { q: 'How long should I wear kegel balls?', a: 'Begin with 15–20 minutes per session. Over several weeks, gradually increase to 30–60 minutes as your pelvic floor strengthens. Do not wear them for more than a few hours at a time, especially when starting out.' },
      { q: 'Do kegel balls actually improve orgasms?', a: 'Yes — regular pelvic floor training strengthens the muscles that contract during orgasm. Stronger pelvic floor muscles are clinically associated with more intense and longer-lasting orgasms in people with vaginas.' },
      { q: 'What size kegel balls should I start with?', a: 'Beginners should start with a single ball of medium size (around 30g weight, 3–3.5cm diameter). As strength improves, progress to a dual-ball design. Heavier is not always better — form and control matter more than weight.' },
    ],
  },

  'sexual-enhancers': {
    guide: `Sexual enhancers include a wide range of products designed to intensify pleasure, improve performance, and increase desire. Vexa Store Lebanon carries delay sprays and creams for men, arousal gels for women, libido-boosting supplements, performance oils, and warming and tingling lubricants. All ship discreetly with COD available.

Delay sprays and creams contain mild local anaesthetics (typically lidocaine or benzocaine) that temporarily reduce penile sensitivity, helping men last longer. They are applied 10–15 minutes before intercourse and have worn off for the partner by the time penetration occurs. Start with a low-concentration spray and increase if needed.

Arousal gels for women contain ingredients like L-arginine or menthol that increase blood flow to the clitoris, heightening sensitivity and natural lubrication. They are applied directly and take effect within 2–5 minutes. Warming lubricants create a gentle heat sensation on contact that many find intensifies arousal.

Libido supplements typically contain herbal extracts like maca, ginseng, or horny goat weed that support hormonal balance and desire over time. Results with supplements are gradual (2–4 weeks) and vary by individual. All enhancers at Vexa Store are sourced from tested, regulated manufacturers.`,
    faqs: [
      { q: 'Do delay sprays affect my partner?', a: 'When used correctly, delay sprays have minimal effect on partners. Apply 10–15 minutes before intercourse and wipe off any excess before contact. Low-concentration lidocaine sprays (4–7.5%) are best for beginners and minimise partner numbing.' },
      { q: 'Are arousal gels safe for all women?', a: 'Most water-based arousal gels are safe for most women. Those with sensitive skin should choose fragrance-free, paraben-free formulations. Avoid internal use unless the product is specifically formulated for it. Test on a small area first.' },
      { q: 'Do libido supplements work?', a: 'Herbal libido supplements show mixed results in clinical research. Some people report meaningful improvement, others notice little effect. They work best alongside good sleep, diet, and stress management rather than as a standalone solution.' },
    ],
  },

  'penis-pumps': {
    guide: `Penis pumps — also called vacuum erection devices (VEDs) — use negative air pressure to draw blood into the penis, creating a stronger erection. Vexa Store Lebanon carries manual hand-pump models and electric battery-powered designs, with and without pressure gauges. All ship in plain boxes with COD.

Penis pumps have a legitimate medical background: they were originally developed as a non-pharmaceutical treatment for erectile dysfunction. Urologists prescribe them for men who cannot use oral ED medications or prefer a drug-free approach. Regular use is also associated with improved erection quality over time through increased penile tissue oxygenation.

To use safely: apply a small amount of water-based lubricant to the cylinder rim for an airtight seal. Insert the penis and pump slowly until you feel comfortable pressure. Do not exceed the recommended pressure (shown on the gauge if included). Session length should be 10–15 minutes maximum. Pumping beyond safe pressure or duration can cause temporary bruising or burst blood vessels — always follow the instructions.

For erection maintenance, combine pump use with a cock ring worn at the base of the penis immediately after pumping. This traps blood and maintains the erection for intercourse. Cock ring and pump combo kits are available at Vexa Store.`,
    faqs: [
      { q: 'Do penis pumps produce permanent results?', a: 'Penis pumps produce temporary results — erection enhancement that lasts for a session. There is no scientific evidence of permanent enlargement from pumping. Claims of permanent size increase should be treated with scepticism.' },
      { q: 'Is it safe to use a penis pump every day?', a: 'Daily use at moderate pressure for 10–15 minutes is considered safe by most urologists. Avoid excessive pressure or sessions longer than 20 minutes. If you experience pain, bruising, or cold numbness, stop immediately.' },
      { q: 'What is the difference between a manual and electric pump?', a: 'Manual pumps use a hand-operated squeeze bulb or piston to create suction — they are quieter and give more control. Electric pumps automate the suction with a motor and are more convenient, but slightly louder.' },
    ],
  },

  'cock-rings': {
    guide: `Cock rings are one of the most underrated and accessible male sex toys. Worn at the base of the penis (or penis and scrotum), they restrict blood flow out of the shaft — maintaining a harder, larger-feeling erection and often significantly delaying orgasm. Vexa Store Lebanon carries silicone, metal, and vibrating cock ring options with discreet COD delivery.

Stretchy silicone rings are the best starting point for beginners. They are comfortable, easy to put on and remove, and available in multiple diameter options. Start with a ring that is slightly snug but not tight — you should be able to slip two fingers alongside it easily. Never wear a cock ring for more than 20–30 minutes as reduced circulation can cause injury.

Adjustable cock rings are the safest beginner option as they can be loosened instantly. Fixed-diameter metal rings look aesthetically striking but require measuring your flaccid girth first and should not be worn by beginners. Vibrating cock rings add clitoral stimulation for the receiving partner during penetration — making them extremely popular for couples.

Triple-stimulation rings that encircle the penis and both testicles separately create a more complete sensation for many men. All rings at Vexa Store are made from body-safe materials with no chrome, nickel, or toxic coatings.`,
    faqs: [
      { q: 'How do I choose the right cock ring size?', a: 'Measure the circumference of your flaccid penis to find diameter: circumference divided by π (3.14) gives diameter. For beginners, a stretchy silicone ring is best as it fits a range of sizes and is easy to remove.' },
      { q: 'Can a cock ring get stuck?', a: 'A rigid metal ring that is too small can become stuck when the penis is erect, requiring medical removal. This is why metal rings require careful measurement before purchase, and why beginners should start with stretchy silicone.' },
      { q: 'Do vibrating cock rings work for both partners?', a: 'Yes. Vibrating cock rings are designed to stimulate the clitoris of the receiving partner during penetration while also adding sensation for the wearer. They are one of the most popular couples sex toys for this reason.' },
    ],
  },

  'masturbators': {
    guide: `Male masturbators — sometimes called pocket pussies, strokers, or sleeves — are handheld devices with a textured internal channel designed to simulate various sexual sensations. Vexa Store Lebanon carries manual sleeves, automatic thrusting models, and premium masturbation cups from leading global brands. All ship discreetly with COD.

The internal texture is the primary differentiator between masturbators. Tight ribbed textures create intense friction. Wavy or nub textures are gentler and better for extended sessions. Realistic oral, vaginal, or anal-shaped openings are popular for their familiar sensation. Premium models like the Fleshlight use SuperSkin material — a proprietary formula that closely mimics real skin texture.

Automatic masturbators do the work for you — motorised sleeves or thrusting devices with multiple speed and pattern settings. These are hands-free options ideal for solo sessions or as a couple's accessory. Heating features (some models warm the internal sleeve to body temperature) significantly enhance the experience.

Cleaning masturbators thoroughly after each use is critical. TPE and SuperSkin are porous materials — bacteria can grow inside the channel if not dried and cleaned properly. Rinse with warm water and dedicated toy cleaner, then allow to dry completely before storage. Never use silicone lubricant with TPE devices.`,
    faqs: [
      { q: 'What lubricant works best with masturbators?', a: 'Use water-based lubricant only. TPE and SuperSkin materials are degraded by silicone-based lubricants. Water-based lubricants are safe, easy to wash out, and available from Vexa Store alongside masturbators.' },
      { q: 'How do I clean a masturbator properly?', a: 'Rinse the internal channel thoroughly with warm (not hot) water after each use. Use a small amount of antibacterial toy cleaner, rinse again, and allow to dry completely inverted on a stand or cloth before storing.' },
      { q: 'What is the difference between a manual and automatic masturbator?', a: 'Manual masturbators are handheld sleeves that you control by hand. Automatic masturbators use a motor to thrust, vibrate, or rotate internally — they are hands-free and replicate more complex sensations without manual effort.' },
    ],
  },

  'chastity': {
    guide: `Chastity devices — also called cages — are worn over the penis to prevent erection and sexual stimulation, typically as part of a dominant/submissive power dynamic between couples. Vexa Store Lebanon carries plastic, silicone, and metal chastity cage options in multiple sizes. All ship in plain sealed packaging with COD.

The three main materials each offer distinct properties. Plastic cages (ABS or polycarbonate) are lightweight, body-safe, easy to clean, and ideal for beginners and long-term wear. They are not detectable by metal detectors. Silicone cages are flexible and comfortable but offer less secure containment. Metal (stainless steel) cages are the most secure and aesthetically popular but heavier and should not be worn through security screening.

Correct sizing is essential for both comfort and safety. A cage that is too tight restricts blood flow and can cause injury. Measure your flaccid length and girth carefully and compare against the size chart. Most reputable cages include multiple ring sizes to accommodate different body shapes.

Long-term wear requires additional hygiene considerations — a design that allows easy cleaning is essential. Many men wear chastity cages for extended periods under clothing. With proper sizing and cleaning habits, this is considered safe. All Vexa Store chastity products come with basic hygiene and sizing guidance.`,
    faqs: [
      { q: 'How do I choose the right chastity cage size?', a: 'Measure your flaccid penis length and girth accurately. Your cage length should accommodate you when completely flaccid. Most cages include multiple base ring sizes — try the largest first and size down for comfort.' },
      { q: 'Is it safe to wear a chastity cage long-term?', a: 'Short to medium-term wear (hours to a few days) is considered safe with proper sizing and hygiene. Remove and clean daily. Any sharp pain, discoloration, or numbness requires immediate removal and may indicate a fit problem.' },
      { q: 'Can chastity devices be worn discreetly under clothing?', a: 'Yes. Lightweight plastic cages in skin tones are nearly invisible under fitted clothing. Metal cages are more detectable and heavier. Many men wear lightweight cages under normal daily clothing without detection.' },
    ],
  },

  'sex-machines': {
    guide: `Sex machines are motorised devices designed for powerful, sustained penetration or stimulation — far beyond what is achievable manually. Vexa Store Lebanon carries thrusting machines, riding vibrators, and rotating models for solo and couples use. All ship in plain outer cartons with COD available.

The most popular sex machine type is the thrusting machine — a motorised arm that drives an attached dildo in a linear thrust motion at adjustable speeds (typically 20–300 strokes per minute). These are designed for vaginal or anal use with appropriate attachments. Most use a standard bolt attachment system compatible with common dildos.

Riding vibrators (also called sit-on or saddle vibrators) are designed for straddling — a large vibrating surface delivers powerful external stimulation. Wand vibrators with machine-grade motors fall into this category as well. These are popular for clitoral and perineum stimulation in both solo and partner settings.

Sex machines deliver consistent, tireless stimulation that many users find produces more intense orgasms than manual play alone. They require a power outlet and take up more storage space than handheld toys. Start at the lowest speed and increase gradually — the power of these machines can be overwhelming at full setting. All sex machines at Vexa Store come with complete setup instructions.`,
    faqs: [
      { q: 'How powerful are sex machines compared to regular vibrators?', a: 'Sex machines deliver significantly more power than handheld vibrators. A quality thrusting machine operates at up to 300 strokes per minute with adjustable depth and speed. Wand-style machines produce vibration levels not achievable with battery-powered toys.' },
      { q: 'Can sex machines be used by couples?', a: 'Yes. Many couples use sex machines during foreplay or intercourse — one partner controls the machine speed and depth while the other experiences it. Thrusting machines free up hands for other stimulation.' },
      { q: 'Are sex machines safe to use?', a: 'Yes, when used with appropriate attachments and starting at low settings. Always use compatible body-safe attachments. Never start at full speed — begin slow and increase gradually. Use generous lubricant with any insertable attachment.' },
    ],
  },

  'lubricants': {
    guide: `Lubricant is one of the most overlooked but most important accessories for any intimate activity. Using the right lubricant enhances sensation, reduces friction and discomfort, and extends the lifespan of your toys. Vexa Store Lebanon carries water-based, silicone-based, and hybrid lubricants from leading brands, all shipping discreetly with COD.

Water-based lubricants are the most versatile. They are safe with all toy materials including silicone, condom-compatible, easy to clean up, and available in thin (low viscosity, great for sensitive skin) and thick (high viscosity, better for anal use) formulations. They absorb into skin over time and may need reapplication during longer sessions.

Silicone-based lubricants last significantly longer than water-based — they do not absorb and require minimal reapplication. They are excellent for shower use as they are not washed away by water. However, silicone lubricant degrades silicone toy material — never use silicone lube with silicone toys. Safe with ABS plastic, glass, metal, and condoms.

Hybrid lubricants combine a silicone base with water-based components for a balance of longevity and cleanup ease. They generally have lower silicone content than pure silicone lubes and are safer (but not always fully safe) with silicone toys — check individual product specifications.`,
    faqs: [
      { q: 'Can I use silicone lubricant with silicone toys?', a: 'No. Silicone-based lubricant reacts with silicone toy material, causing the surface to become tacky, porous, and eventually unusable. Use water-based lubricant with all silicone toys.' },
      { q: 'What lubricant is best for anal sex?', a: 'A thick water-based anal lubricant is ideal. Look for formulations with higher viscosity (gel-like consistency) that provide cushioning and last longer than thin lubricants. Avoid numbing lubricants as pain is a useful signal for beginners.' },
      { q: 'Are lubricants safe to use with condoms?', a: 'Water-based and silicone-based lubricants are both condom-safe (latex and non-latex). Oil-based lubricants degrade latex condoms and should never be used with them. All lubricants sold at Vexa Store are condom-compatible.' },
    ],
  },

  'poppers': {
    guide: `Poppers are small bottles of alkyl nitrites — chemical compounds that produce an intense rush of warmth and relaxation when inhaled. They are popular worldwide in adult recreational settings, particularly for relaxing smooth muscle tissue which eases anal penetration and can intensify sexual sensation. Vexa Store Lebanon carries the leading international brands including Rush, Amsterdam Gold, and Jungle Juice.

The effects of poppers onset within seconds of inhalation and last 1–3 minutes. The experience includes a warm, dizzy head rush, a lowering of blood pressure, relaxation of the anal and vaginal sphincter muscles, and heightened sensitivity to touch. They are used recreationally in club settings and privately by couples and individuals.

Poppers must only be inhaled — never swallowed. Ingestion is potentially fatal. Keep away from flames — they are highly flammable. Do not use if you take PDE5 inhibitors (such as Viagra, Cialis, or Levitra) as the combination can cause dangerous blood pressure drops. Do not use if you have heart conditions, hypotension, or glaucoma.

Rush and Jungle Juice are the most popular brands globally. Amsterdam Gold is known for a slightly smoother, more prolonged effect. All poppers at Vexa Store are genuine branded products. Store in a cool, dark place with the cap sealed when not in use.`,
    faqs: [
      { q: 'Are poppers legal in Lebanon?', a: 'Poppers exist in a legal grey area in many countries. Vexa Store ships poppers discreetly and we recommend customers verify local regulations for their specific area. Orders ship in plain sealed packaging with no product labelling visible externally.' },
      { q: 'Can I use poppers with Viagra or other ED medication?', a: 'No. Combining poppers (alkyl nitrites) with PDE5 inhibitors like Viagra, Cialis, or Levitra can cause a dangerous and potentially fatal drop in blood pressure. This combination must be avoided entirely.' },
      { q: 'How long do poppers last once opened?', a: 'Once opened, a bottle of poppers typically remains at full strength for 1–2 weeks if properly sealed and stored in a cool, dark place. After this, potency degrades. Unopened bottles last 12–24 months from manufacture date.' },
    ],
  },

  'holiday-collection': {
    guide: `The Vexa Store Lebanon Holiday Collection brings together the best romantic and intimate gifts — curated for Valentine's Day, anniversaries, birthdays, and any occasion worth celebrating. All gift orders ship in discreet plain boxes with COD available across Lebanon.

Our holiday collection includes couples massage and sensation kits (combining oils, feathers, and light restraints), premium lingerie gift sets, vibrator and lubricant starter kits, BDSM beginner bundles, and special edition product packaging. Gift sets are curated to balance excitement with accessibility — perfect whether the recipient is experienced or entirely new to intimate products.

When choosing a gift, consider what you know about the recipient's preferences. Lingerie is an almost universally appreciated intimate gift — size is the main consideration. Couples kits work well for partners you know well and who have expressed curiosity about exploring together. Vibrator sets are ideal for a partner who has expressed interest in self-pleasure products.

All Vexa Store gift orders include discreet outer packaging. The product inside is wrapped in tissue paper and secured in the plain outer box. Nothing on the outside of the package indicates the nature of the contents. We also offer gift notes on request — contact us via WhatsApp before placing your order.`,
    faqs: [
      { q: 'Can I send a gift order directly to someone in Lebanon?', a: 'Yes. Enter the recipient\'s address as the delivery address when placing your order. The outer packaging will show no indication of the contents. Cash on delivery can be arranged so the recipient pays on receipt if preferred.' },
      { q: 'Are gift sets cheaper than buying products individually?', a: 'Yes — holiday and couples gift sets at Vexa Store are priced below the sum of their individual components. Bundle pricing gives you more value while providing a curated, gift-ready experience.' },
      { q: 'What is the best gift for a couple exploring together for the first time?', a: 'A couples sensation starter kit — typically including a couple\'s vibrator or wand, massage oil, a blindfold, and light restraints — is the ideal gift. It provides multiple elements to explore gradually rather than committing to one specific activity.' },
    ],
  },

  'new-arrivals': {
    guide: `The New Arrivals section at Vexa Store Lebanon is updated regularly with the latest products from the world's leading intimate goods manufacturers. We source new stock weekly — vibrators, dildos, male toys, BDSM gear, lingerie, and accessories — and make them available for same-day discreet delivery in Beirut the moment they arrive.

Shopping new arrivals is the best way to discover what is trending globally in the intimate products market before it becomes widely available in the region. Many of our newest products use technology not available in older product lines: app-controlled vibrators with Bluetooth, warming dildo technology, hands-free wearable vibrators, and new TPE formulations for more realistic feel.

New arrivals at Vexa Store are fully vetted before listing. Every new product undergoes material verification, instruction review, and quality check before it is made available for sale. We do not list unverified products regardless of how new or trending they are.

Signing up for WhatsApp updates from Vexa Store is the fastest way to be notified when new stock arrives. We announce new products via WhatsApp broadcast to subscribers first. All new arrivals are available with COD and discreet same-day delivery in Beirut.`,
    faqs: [
      { q: 'How often does Vexa Store receive new products?', a: 'We add new products to our inventory weekly. Major collection updates typically happen monthly. The New Arrivals page is updated each time new stock is received and available for immediate delivery.' },
      { q: 'Can I request a specific product that is not currently listed?', a: 'Yes. If you are looking for a specific product or brand not currently in our catalogue, contact us on WhatsApp. We source products on request when possible and will notify you when the item becomes available.' },
      { q: 'Are new arrivals available for same-day delivery in Beirut?', a: 'Yes. All products in the New Arrivals section are in stock and available for same-day delivery in Beirut. Products show their real-time stock status on the listing page.' },
    ],
  },
};
