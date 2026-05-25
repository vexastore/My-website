import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ not found. Run vite build first.');
  process.exit(1);
}

const TODAY = new Date().toISOString().slice(0, 10);
const FIREBASE_API_KEY = 'AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8';
const FIREBASE_PROJECT  = 'vexa-store';

// ── Fetch all products from Firestore REST API (no browser APIs needed) ──────
async function fetchAllProducts() {
  const allDocs = [];
  let pageToken = null;
  try {
    do {
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/products?pageSize=100&key=${FIREBASE_API_KEY}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!resp.ok) { console.warn('⚠ Firestore returned', resp.status); break; }
      const data = await resp.json();
      if (data.documents) allDocs.push(...data.documents);
      pageToken = data.nextPageToken || null;
    } while (pageToken);
  } catch (err) {
    console.warn('⚠ Could not fetch products from Firebase:', err.message);
  }

  return allDocs.map(doc => {
    const id   = doc.name.split('/').pop();
    const f    = doc.fields || {};
    const str  = k => f[k]?.stringValue || '';
    const num  = k => parseFloat(f[k]?.doubleValue ?? f[k]?.integerValue ?? 0);
    const arr  = k => (f[k]?.arrayValue?.values || []).map(v => v.stringValue || '').filter(Boolean);
    return {
      id,
      nameEn:       str('nameEn') || str('name'),
      nameAr:       str('name'),
      descriptionEn:str('descriptionEn') || str('description'),
      descriptionAr:str('description'),
      price:        num('price'),
      rating:       num('rating') || 4.5,
      reviewsCount: Math.round(num('reviewsCount')),
      stock:        Math.round(num('stock')),
      image:        str('image'),
      category:     str('category'),
      categories:   arr('categories'),
    };
  }).filter(p => p.nameEn || p.nameAr);
}

// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { slug:'sex-toys',          name:'Sex Toys',          titleAr:'ألعاب زوجية في لبنان | متجر فيكسا',       titleEn:'Sex Toys in Lebanon | Vexa Store - Discreet Delivery Beirut',       descAr:'اشتر أفضل ألعاب زوجية في لبنان — هزازات، ديلدو، لانجري. توصيل سري في نفس اليوم في بيروت، دفع عند الاستلام.',       descEn:'Buy the best sex toys in Lebanon — vibrators, dildos, lingerie. Same-day discreet delivery in Beirut, cash on delivery.',       keywords:'sex toys Lebanon, ألعاب زوجية لبنان, adult toys Beirut, متجر ألعاب جنسية بيروت, discreet delivery Lebanon',           seoAr:'<h1>ألعاب زوجية في لبنان — متجر فيكسا</h1><p>متجر فيكسا هو الوجهة الأولى لشراء ألعاب زوجية فاخرة في لبنان. نوفر أكبر تشكيلة من المنتجات الحميمية — هزازات، ديلدو، لانجري، أدوات BDSM، معززات جنسية.</p><ul><li>توصيل سري في نفس اليوم — بيروت</li><li>توصيل 24-72 ساعة لكل لبنان</li><li>دفع نقداً عند الاستلام</li><li>تغليف سري محكم 100%</li></ul>',       seoEn:'<h2>Sex Toys in Lebanon — Vexa Store</h2><p>Vexa Store is Lebanon\'s premier destination for premium adult toys. We offer the widest selection of intimate products in Beirut and all Lebanese regions — vibrators, dildos, lingerie, BDSM gear, and sexual enhancers.</p><ul><li>Same-day discreet delivery — Beirut</li><li>24-72 hour delivery across Lebanon</li><li>Cash on delivery (COD)</li><li>100% plain sealed packaging</li></ul>',       related:['vibrators','dildos','lingerie','male-toys'], priority:'0.95' },
  { slug:'vibrators',         name:'Vibrators',         titleAr:'هزازات فاخرة في لبنان | متجر فيكسا',      titleEn:'Vibrators in Lebanon | Premium Vibrators Beirut - Vexa Store',      descAr:'هزازات فاخرة في لبنان من أفضل الماركات. توصيل سري في نفس اليوم في بيروت، دفع عند الاستلام.',      descEn:'Premium vibrators in Lebanon from top brands. Same-day discreet delivery in Beirut, cash on delivery.',      keywords:'vibrators Lebanon, هزازات لبنان, vibrators Beirut, هزازات بيروت, clitoral vibrator, G-spot vibrator Lebanon',      seoAr:'<h1>هزازات في لبنان — متجر فيكسا</h1><p>اكتشف أفضل مجموعة هزازات فاخرة في لبنان من متجر فيكسا. هزازات بظرية، نقطة G، مزدوجة، وتحكم عن بعد.</p><ul><li>هزازات بظرية — أقوى إحساس</li><li>هزازات نقطة G</li><li>هزازات تحكم عن بعد للأزواج</li><li>مضادة للماء وسهلة التنظيف</li></ul>',      seoEn:'<h2>Vibrators in Lebanon — Vexa Store</h2><p>Discover Lebanon\'s best collection of premium vibrators at Vexa Store. We carry clitoral vibrators, G-spot vibrators, dual-stimulation and remote-controlled options.</p><ul><li>Clitoral vibrators — intense pleasure</li><li>G-spot vibrators for deep stimulation</li><li>Remote-controlled couples vibrators</li><li>Waterproof and easy to clean</li></ul>',      related:['sex-toys','dildos','kegel-balls','sexual-enhancers'], priority:'0.95' },
  { slug:'lingerie',          name:'Lingerie',          titleAr:'لانجري فاخر في لبنان | متجر فيكسا',       titleEn:'Lingerie Lebanon | Sexy Lingerie Beirut - Vexa Store',              descAr:'أفضل لانجري فاخر في لبنان. توصيل سري وسريع في بيروت وجميع المناطق.',                                                        descEn:'Premium lingerie in Lebanon — wide collection at great prices. Fast discreet delivery in Beirut and all regions.',           keywords:'lingerie Lebanon, لانجري لبنان, sexy lingerie Beirut, لانجري بيروت, lace lingerie, lingerie shop Lebanon',               seoAr:'<h1>لانجري في لبنان — متجر فيكسا</h1><p>تسوقي أجمل لانجري فاخر في لبنان. تشكيلة واسعة من اللانجري الرومانسي والمثير — دانتيل، ساتان، كورسيه، تيدي، أطقم كاملة.</p><ul><li>لانجري دانتيل رومانسي فاخر</li><li>كورسيه وبوستيه مثير</li><li>أطقم لانجري كاملة للأزواج</li><li>مقاسات متعددة — S حتى XXXL</li></ul>',       seoEn:'<h2>Lingerie in Lebanon — Vexa Store</h2><p>Shop the finest lingerie in Lebanon at Vexa Store. Wide collection of romantic and sensual lingerie — lace, satin, corsets, teddies, and full sets.</p><ul><li>Romantic lace lingerie sets</li><li>Corsets and bustiers</li><li>Complete couples lingerie sets</li><li>Multiple sizes — S to XXXL</li></ul>',       related:['sex-toys','bondage','kegel-balls','new-arrivals'], priority:'0.90' },
  { slug:'male-toys',         name:'Male Toys',         titleAr:'ألعاب رجالية فاخرة في لبنان | متجر فيكسا',titleEn:'Male Toys Lebanon | Men Adult Toys Beirut - Vexa Store',             descAr:'أفضل ألعاب رجالية في لبنان. توصيل سري وسريع في بيروت وجميع المناطق.',                                                      descEn:'Best male adult toys in Lebanon. Fast discreet delivery in Beirut and all regions. Cash on delivery.',                      keywords:'male toys Lebanon, ألعاب رجالية لبنان, men sex toys Beirut, masturbators Lebanon, cock rings Beirut, penis pump Lebanon',  seoAr:'<h1>ألعاب رجالية في لبنان — متجر فيكسا</h1><p>تشكيلة كاملة من الألعاب الرجالية الفاخرة — مستمني، مضخات تكبير، حلقات قضيب.</p><ul><li>مستمني سيليكون واقعية</li><li>مضخات تكبير القضيب</li><li>حلقات قضيب للاستمرارية</li></ul>',                                                   seoEn:'<h2>Male Toys in Lebanon — Vexa Store</h2><p>Complete collection of premium male adult toys in Lebanon — masturbators, penis pumps, cock rings. All shipped in plain sealed packaging.</p><ul><li>Realistic silicone masturbators</li><li>Penis pumps and enlargers</li><li>Cock rings for stamina</li></ul>',                                                      related:['cock-rings','masturbators','penis-pumps','sexual-enhancers'], priority:'0.85' },
  { slug:'dildos',            name:'Dildos',            titleAr:'ديلدو سيليكون في لبنان | متجر فيكسا',    titleEn:'Dildos Lebanon | Premium Dildos Beirut - Vexa Store',               descAr:'ديلدو آمن مصنوع من السيليكون الطبي في لبنان. توصيل سري في نفس اليوم، دفع عند الاستلام.',                                   descEn:'Discover premium dildos in Lebanon. Medical-grade silicone, BPA-free. Same-day discreet delivery Beirut.',                  keywords:'dildos Lebanon, ديلدو لبنان, premium dildos Beirut, silicone dildo Lebanon, ديلدو سيليكون, adult toys Lebanon',          seoAr:'<h1>ديلدو في لبنان — متجر فيكسا</h1><p>اشترِ أفضل ديلدو سيليكون طبي في لبنان. تشكيلة واسعة بأحجام وأشكال متعددة. جميعها من السيليكون الطبي الخالي من BPA.</p><ul><li>سيليكون طبي خالٍ من BPA</li><li>أحجام متعددة للجميع</li><li>بساق شفط للاستخدام بدون يدين</li><li>مضاد للماء وسهل التنظيف</li></ul>',        seoEn:'<h2>Dildos in Lebanon — Vexa Store</h2><p>Buy the best silicone dildos in Lebanon. Wide selection of sizes — realistic, colorful, suction-cup, and double-ended. All BPA-free medical silicone. Rated 4.7/5 by our customers.</p><ul><li>BPA-free medical-grade silicone</li><li>Multiple sizes for all experience levels</li><li>Suction-cup base for hands-free use</li><li>Waterproof and easy to clean</li></ul>',       related:['vibrators','sex-toys','butt-plugs','anal-toys'], priority:'0.85' },
  { slug:'bdsm',              name:'BDSM',              titleAr:'منتجات BDSM في لبنان | متجر فيكسا',       titleEn:'BDSM Toys Lebanon | Bondage Gear Beirut - Vexa Store',              descAr:'أدوات وألعاب BDSM في لبنان. توصيل سري في بيروت. دفع عند الاستلام.',                                                        descEn:'BDSM toys and bondage gear in Lebanon — restraints, blindfolds, paddles. Discreet delivery in Beirut.',                    keywords:'BDSM Lebanon, bondage Lebanon, BDSM Beirut, restraints Lebanon, blindfold Lebanon, ألعاب BDSM لبنان',                    seoAr:'<h1>BDSM في لبنان — متجر فيكسا</h1><p>اكتشف عالم BDSM الآمن مع متجر فيكسا. أدوات للمبتدئين والمتقدمين — قيود مخملية، عصابات عين، سياط ناعمة، مشابك.</p>',                                                                                                                              seoEn:'<h2>BDSM in Lebanon — Vexa Store</h2><p>Explore the world of BDSM safely with Vexa Store Lebanon. Beginner and advanced BDSM gear — velvet restraints, blindfolds, soft paddles, and nipple clamps.</p>',                                                                                                                                                    related:['bondage','sex-toys','lingerie','strap-ons'], priority:'0.80' },
  { slug:'holiday-collection',name:'Holiday Collection',titleAr:'كوليكشن العطلات | متجر فيكسا لبنان',     titleEn:'Holiday Collection Lebanon | Romantic Gift Sets - Vexa Store',      descAr:'تشكيلة العطلات الخاصة من متجر فيكسا — هدايا رومانسية فاخرة في لبنان.',                                                    descEn:'Special holiday collection from Vexa Store — premium romantic gift sets in Lebanon. Discreet delivery.',                    keywords:'holiday gift sets Lebanon, romantic gifts Beirut, adult gift sets Lebanon, هدايا رومانسية لبنان',                        seoAr:'<h1>كوليكشن العطلات — متجر فيكسا لبنان</h1><p>تشكيلة العطلات الخاصة من متجر فيكسا — هدايا رومانسية فاخرة مثالية للمناسبات والأعياد في لبنان.</p>',                                                                                                                                seoEn:'<h2>Holiday Collection Lebanon — Vexa Store</h2><p>Vexa Store\'s exclusive holiday collection features premium romantic gift sets. Each set is elegantly packaged with full discretion.</p>',                                                                                                                                                              related:['lingerie','sex-toys','new-arrivals','vibrators'], priority:'0.75' },
  { slug:'new-arrivals',      name:'New Arrivals',      titleAr:'وصل حديثاً | متجر فيكسا لبنان',          titleEn:'New Arrivals Lebanon | Latest Adult Toys Beirut - Vexa Store',      descAr:'آخر المنتجات الجديدة في متجر فيكسا — ألعاب زوجية، هزازات، لانجري.',                                                       descEn:'Latest new products at Vexa Store Lebanon — sex toys, vibrators, lingerie. Discreet delivery across Lebanon.',             keywords:'new arrivals adult toys Lebanon, latest sex toys Beirut, وصل حديثاً لبنان, new vibrators Lebanon',                      seoAr:'<h1>وصل حديثاً — متجر فيكسا لبنان</h1><p>اكتشف أحدث الوافدات إلى متجر فيكسا في لبنان. نُضيف منتجات جديدة أسبوعياً.</p>',                                                                                                                                                        seoEn:'<h2>New Arrivals at Vexa Store Lebanon</h2><p>Discover the latest additions to Vexa Store Lebanon. We add new products weekly — vibrators, lingerie, couples toys.</p>',                                                                                                                                                                                     related:['sex-toys','vibrators','lingerie','dildos'], priority:'0.90' },
  { slug:'butt-plugs',        name:'Butt Plugs',        titleAr:'باط بلاغ سيليكون في لبنان | متجر فيكسا', titleEn:'Butt Plugs Lebanon | Anal Plugs Beirut - Vexa Store',                descAr:'أفضل باط بلاغ سيليكون في لبنان. توصيل سري في بيروت وجميع المناطق.',                                                       descEn:'Best butt plugs in Lebanon — silicone and stainless steel. Discreet delivery in Beirut. Cash on delivery.',                keywords:'butt plugs Lebanon, anal plugs Beirut, سدادة شرجية لبنان, silicone butt plug Lebanon',                                  seoAr:'<h1>باط بلاغ في لبنان — متجر فيكسا</h1><p>تشكيلة متنوعة من الباط بلاغ الآمن — سيليكون طبي أو ستانلس ستيل بأحجام متعددة.</p>',                                                                                                                                                  seoEn:'<h2>Butt Plugs in Lebanon — Vexa Store</h2><p>Safe butt plugs in Lebanon — medical silicone or stainless steel in multiple sizes for beginners and advanced users.</p>',                                                                                                                                                                                    related:['anal-toys','sex-toys','bondage','dildos'], priority:'0.70' },
  { slug:'anal-toys',         name:'Anal Toys',         titleAr:'ألعاب شرجية آمنة في لبنان | متجر فيكسا', titleEn:'Anal Toys Lebanon | Anal Beads & Prostate Massagers Beirut',        descAr:'أفضل ألعاب شرجية آمنة في لبنان. توصيل سري في بيروت.',                                                                     descEn:'Best safe anal toys in Lebanon — anal beads, prostate massagers. Discreet delivery in Beirut.',                            keywords:'anal toys Lebanon, ألعاب شرجية لبنان, anal beads Beirut, prostate massager Lebanon',                                    seoAr:'<h1>ألعاب شرجية في لبنان — متجر فيكسا</h1><p>تشكيلة آمنة ومتنوعة من الألعاب الشرجية — باط بلاغ، مدلكات بروستات، خرزات شرجية من مواد طبية آمنة.</p>',                                                                                                                           seoEn:'<h2>Anal Toys in Lebanon — Vexa Store</h2><p>Safe anal toy collection in Lebanon — butt plugs, prostate massagers, anal beads from 100% body-safe medical materials.</p>',                                                                                                                                                                                  related:['butt-plugs','male-toys','sex-toys','bondage'], priority:'0.70' },
  { slug:'bondage',           name:'Bondage',           titleAr:'أدوات بونداج في لبنان | متجر فيكسا',     titleEn:'Bondage Gear Lebanon | Restraints & Rope Beirut - Vexa Store',      descAr:'أدوات وألعاب بونداج في لبنان. توصيل سري في بيروت.',                                                                        descEn:'Bondage gear in Lebanon — restraints, rope, handcuffs. Discreet delivery in Beirut.',                                      keywords:'bondage Lebanon, restraints Lebanon, bondage gear Beirut, قيود لبنان, BDSM bondage Lebanon',                            seoAr:'<h1>بونداج في لبنان — متجر فيكسا</h1><p>أدوات البونداج الآمنة — قيود مخملية، حبال ناعمة، أصفاد جلدية.</p>',                                                                                                                                                                    seoEn:'<h2>Bondage in Lebanon — Vexa Store</h2><p>Safe bondage gear in Lebanon — velvet restraints, soft rope, leather cuffs for beginners and advanced players.</p>',                                                                                                                                                                                             related:['bdsm','sex-toys','lingerie','strap-ons'], priority:'0.70' },
  { slug:'sex-dolls',         name:'Sex Dolls',         titleAr:'دمى حميمة في لبنان | متجر فيكسا',        titleEn:'Sex Dolls Lebanon | Realistic Love Dolls Beirut - Vexa Store',      descAr:'أفضل دمى حميمة في لبنان. توصيل سري وسريع في بيروت.',                                                                      descEn:'Best sex dolls in Lebanon — realistic design, premium materials. Fast discreet delivery in Beirut.',                       keywords:'sex dolls Lebanon, love dolls Beirut, دمى جنسية لبنان, realistic sex doll Lebanon',                                    seoAr:'<h1>دمى حميمة في لبنان — متجر فيكسا</h1><p>دمى حميمة واقعية بأجسام مصنوعة من مواد عالية الجودة.</p>',                                                                                                                                                                           seoEn:'<h2>Sex Dolls in Lebanon — Vexa Store</h2><p>Realistic intimate dolls made from high-quality materials. Wide variety of partial and full-body options.</p>',                                                                                                                                                                                                  related:['male-toys','masturbators','sex-toys','anal-toys'], priority:'0.70' },
  { slug:'strap-ons',         name:'Strap Ons',         titleAr:'ستراب أون في لبنان | متجر فيكسا',        titleEn:'Strap-ons Lebanon | Harness & Dildo Sets Beirut - Vexa Store',      descAr:'أفضل ستراب أون في لبنان. توصيل سري في بيروت وجميع المناطق.',                                                              descEn:'Best strap-ons in Lebanon — adjustable harnesses and silicone dildos. Discreet delivery in Beirut.',                       keywords:'strap-ons Lebanon, strap-on harness Beirut, أحزمة لبنان, strap on dildo Lebanon',                                      seoAr:'<h1>ستراب أون في لبنان — متجر فيكسا</h1><p>ستراب أون فاخر للأزواج — أحزمة قابلة للتعديل وديلدو سيليكون آمن.</p>',                                                                                                                                                               seoEn:'<h2>Strap-ons in Lebanon — Vexa Store</h2><p>Premium strap-ons for couples in Lebanon. Adjustable harnesses with safe silicone dildos for versatile experiences.</p>',                                                                                                                                                                                    related:['bdsm','dildos','bondage','sex-toys'], priority:'0.70' },
  { slug:'kegel-balls',       name:'Kegel Balls',       titleAr:'كيغل بولز في لبنان | متجر فيكسا',        titleEn:'Kegel Balls Lebanon | Pelvic Floor Exercises Beirut - Vexa Store',  descAr:'كيغل بولز لتقوية عضلات قاع الحوض في لبنان. توصيل سري في بيروت.',                                                          descEn:'Kegel balls for pelvic floor strengthening in Lebanon — medical silicone. Discreet delivery Beirut.',                      keywords:'kegel balls Lebanon, كيغل لبنان, pelvic floor Lebanon, Ben Wa balls Lebanon',                                           seoAr:'<h1>كيغل بولز في لبنان — متجر فيكسا</h1><p>كيغل بولز لتقوية عضلات قاع الحوض من السيليكون الطبي الآمن.</p>',                                                                                                                                                                   seoEn:'<h2>Kegel Balls in Lebanon — Vexa Store</h2><p>Kegel balls for pelvic floor strengthening and improved intimate wellness. Made from safe medical silicone.</p>',                                                                                                                                                                                             related:['vibrators','sex-toys','lingerie','sexual-enhancers'], priority:'0.65' },
  { slug:'sexual-enhancers',  name:'Sexual Enhancers',  titleAr:'معززات جنسية في لبنان | متجر فيكسا',     titleEn:'Sexual Enhancers Lebanon | Delay & Performance Beirut - Vexa Store',descAr:'أفضل معززات جنسية في لبنان. توصيل سري في بيروت وجميع المناطق.',                                                            descEn:'Best sexual enhancers and delay products in Lebanon. Discreet delivery Beirut.',                                           keywords:'sexual enhancers Lebanon, delay spray Lebanon, معززات جنسية لبنان, performance enhancers Beirut',                       seoAr:'<h1>معززات جنسية في لبنان — متجر فيكسا</h1><p>معززات ومؤخرات جنسية — كريمات تقوية، مؤخرات، مكملات أداء.</p>',                                                                                                                                                                  seoEn:'<h2>Sexual Enhancers in Lebanon — Vexa Store</h2><p>Premium sexual enhancers and delay products — strengthening creams, delay sprays, performance supplements.</p>',                                                                                                                                                                                        related:['male-toys','vibrators','cock-rings','lubricants'], priority:'0.65' },
  { slug:'penis-pumps',       name:'Penis Pumps',       titleAr:'مضخات القضيب في لبنان | متجر فيكسا',     titleEn:'Penis Pumps Lebanon | Male Enhancement Beirut - Vexa Store',        descAr:'أفضل مضخات القضيب في لبنان. توصيل سري في بيروت وجميع المناطق.',                                                           descEn:'Best penis pumps and sleeves in Lebanon. Discreet delivery Beirut. Cash on delivery.',                                     keywords:'penis pump Lebanon, مضخة قضيب لبنان, male enhancement Lebanon, cock pump Lebanon',                                     seoAr:'<h1>مضخات القضيب في لبنان — متجر فيكسا</h1><p>مضخات وأكمام القضيب الفاخرة لتحسين الأداء والثقة الذاتية.</p>',                                                                                                                                                               seoEn:'<h2>Penis Pumps in Lebanon — Vexa Store</h2><p>Premium penis pumps and sleeves in Lebanon for improved performance and confidence.</p>',                                                                                                                                                                                                                    related:['male-toys','cock-rings','sexual-enhancers','masturbators'], priority:'0.65' },
  { slug:'cock-rings',        name:'Cock Rings',        titleAr:'حلقات القضيب في لبنان | متجر فيكسا',     titleEn:'Cock Rings Lebanon | Vibrating Cock Rings Beirut - Vexa Store',     descAr:'حلقات قضيب سيليكون طبي في لبنان. توصيل سري في بيروت وكل لبنان.',                                                          descEn:'Medical silicone cock rings in Lebanon — vibrating and non-vibrating. Discreet delivery Beirut.',                          keywords:'cock rings Lebanon, حلقات قضيب لبنان, vibrating cock ring Beirut, penis ring Lebanon',                                 seoAr:'<h1>حلقات القضيب في لبنان — متجر فيكسا</h1><p>حلقات قضيب سيليكون طبي — هزازة وغير هزازة لتجربة أطول وأكثر كثافة.</p>',                                                                                                                                                         seoEn:'<h2>Cock Rings in Lebanon — Vexa Store</h2><p>Medical silicone cock rings — vibrating and non-vibrating for longer, more intense experiences.</p>',                                                                                                                                                                                                         related:['male-toys','penis-pumps','sexual-enhancers','masturbators'], priority:'0.65' },
  { slug:'masturbators',      name:'Masturbators',      titleAr:'أدوات الاستمناء في لبنان | متجر فيكسا',  titleEn:'Masturbators Lebanon | Male Masturbators Beirut - Vexa Store',      descAr:'أدوات استمناء رجالية فاخرة في لبنان. توصيل سري في بيروت.',                                                                descEn:'Premium male masturbators in Lebanon — realistic textures, discreet delivery Beirut.',                                     keywords:'masturbators Lebanon, أدوات استمناء لبنان, male masturbator Beirut, pocket pussy Lebanon',                             seoAr:'<h1>أدوات الاستمناء في لبنان — متجر فيكسا</h1><p>أدوات استمناء رجالية فاخرة بملمس واقعي وأشكال متعددة للمتعة القصوى.</p>',                                                                                                                                                      seoEn:'<h2>Masturbators in Lebanon — Vexa Store</h2><p>Premium male masturbators in Lebanon with realistic textures and multiple designs for maximum pleasure.</p>',                                                                                                                                                                                               related:['male-toys','sex-dolls','cock-rings','sexual-enhancers'], priority:'0.65' },
  { slug:'chastity',          name:'Chastity',          titleAr:'أدوات العفة في لبنان | متجر فيكسا',      titleEn:'Chastity Devices Lebanon | Chastity Cages Beirut - Vexa Store',     descAr:'أدوات العفة في لبنان. توصيل سري في بيروت وكل لبنان.',                                                                     descEn:'Chastity devices and cages in Lebanon. Discreet delivery Beirut. Cash on delivery.',                                       keywords:'chastity Lebanon, chastity cage Beirut, أدوات العفة لبنان, male chastity Lebanon',                                     seoAr:'<h1>أدوات العفة في لبنان — متجر فيكسا</h1><p>أدوات العفة وأقفاص العفة للتحكم والمتعة بأحجام ومواد متنوعة.</p>',                                                                                                                                                               seoEn:'<h2>Chastity Devices in Lebanon — Vexa Store</h2><p>Chastity devices and cages in Lebanon for control and pleasure play. Various sizes and materials available.</p>',                                                                                                                                                                                      related:['bdsm','bondage','male-toys','cock-rings'], priority:'0.60' },
  { slug:'sex-machines',      name:'Sex Machines',      titleAr:'ماكينات الجنس في لبنان | متجر فيكسا',    titleEn:'Sex Machines Lebanon | Fucking Machines Beirut - Vexa Store',       descAr:'ماكينات الجنس الفاخرة في لبنان. توصيل سري في بيروت وجميع المناطق.',                                                       descEn:'Premium sex machines in Lebanon — powerful and versatile. Discreet delivery Beirut.',                                      keywords:'sex machines Lebanon, ماكينات جنس لبنان, fucking machine Beirut, automatic sex toy Lebanon',                           seoAr:'<h1>ماكينات الجنس في لبنان — متجر فيكسا</h1><p>ماكينات جنس فاخرة وقوية لتجربة فريدة مع توصيل سري في لبنان.</p>',                                                                                                                                                               seoEn:'<h2>Sex Machines in Lebanon — Vexa Store</h2><p>Premium and powerful sex machines in Lebanon for a unique experience. Discreet delivery to all Lebanese regions.</p>',                                                                                                                                                                                    related:['sex-toys','vibrators','dildos','strap-ons'], priority:'0.65' },
  { slug:'lubricants',        name:'Lubricants',        titleAr:'مواد التشحيم في لبنان | متجر فيكسا',     titleEn:'Lubricants Lebanon | Personal Lube Beirut - Vexa Store',             descAr:'مواد تشحيم مائية آمنة على البشرة في لبنان. توصيل سري في بيروت.',                                                          descEn:'Body-safe water-based lubricants in Lebanon. Discreet delivery Beirut. Cash on delivery.',                                 keywords:'lubricants Lebanon, personal lube Beirut, مواد تشحيم لبنان, water-based lube Lebanon',                                 seoAr:'<h1>مواد التشحيم في لبنان — متجر فيكسا</h1><p>مواد تشحيم مائية آمنة على البشرة بدون عطر، آمنة طبياً 100%.</p>',                                                                                                                                                               seoEn:'<h2>Lubricants in Lebanon — Vexa Store</h2><p>Body-safe water-based lubricants in Lebanon. Compatible with all toy types, fragrance-free, 100% medically safe.</p>',                                                                                                                                                                                      related:['sex-toys','anal-toys','dildos','sexual-enhancers'], priority:'0.65' },
  { slug:'poppers',           name:'Poppers',           titleAr:'بوبرز في لبنان | متجر فيكسا',            titleEn:'Poppers Lebanon | Buy Poppers Beirut - Vexa Store',                 descAr:'بوبرز في لبنان من أفضل الماركات. توصيل سري في بيروت وكل لبنان.',                                                          descEn:'Poppers in Lebanon from top brands. Discreet delivery Beirut. Cash on delivery.',                                          keywords:'poppers Lebanon, بوبرز لبنان, poppers Beirut, amyl nitrite Lebanon, buy poppers Lebanon',                               seoAr:'<h1>بوبرز في لبنان — متجر فيكسا</h1><p>بوبرز من أفضل الماركات العالمية متوفر الآن في لبنان عبر متجر فيكسا.</p>',                                                                                                                                                                 seoEn:'<h2>Poppers in Lebanon — Vexa Store</h2><p>Top-brand poppers now available in Lebanon through Vexa Store. Fast discreet delivery in Beirut and all Lebanese regions.</p>',                                                                                                                                                                                   related:['sexual-enhancers','bdsm','sex-toys','male-toys'], priority:'0.60' },
];

const SLUG_TO_NAME_AR = { 'sex-toys':'ألعاب زوجية','vibrators':'هزازات','dildos':'ديلدو','lingerie':'لانجري','male-toys':'ألعاب رجالية','bdsm':'BDSM','butt-plugs':'سدادة شرجية','anal-toys':'ألعاب الشرج','bondage':'عبودية','sex-dolls':'دمى جنسية','strap-ons':'ستراب أون','kegel-balls':'كيغل بولز','sexual-enhancers':'معززات جنسية','penis-pumps':'مضخات القضيب','cock-rings':'حلقات القضيب','masturbators':'مستمني','chastity':'العفة','sex-machines':'ماكينات الجنس','lubricants':'مواد التشحيم','poppers':'بوبرز','new-arrivals':'وصل حديثاً','holiday-collection':'مجموعة الأعياد' };
const SLUG_TO_NAME_EN  = { 'sex-toys':'Sex Toys','vibrators':'Vibrators','dildos':'Dildos','lingerie':'Lingerie','male-toys':'Male Toys','bdsm':'BDSM','butt-plugs':'Butt Plugs','anal-toys':'Anal Toys','bondage':'Bondage','sex-dolls':'Sex Dolls','strap-ons':'Strap-ons','kegel-balls':'Kegel Balls','sexual-enhancers':'Sexual Enhancers','penis-pumps':'Penis Pumps','cock-rings':'Cock Rings','masturbators':'Masturbators','chastity':'Chastity','sex-machines':'Sex Machines','lubricants':'Lubricants','poppers':'Poppers','new-arrivals':'New Arrivals','holiday-collection':'Holiday Collection' };

const SEO_STYLE = `<style id="seo-style">#seo-preamble{font-family:Arial,sans-serif;padding:14px 18px;background:#060606;color:#bbb;border-bottom:1px solid #1a1a1a;font-size:14px;line-height:1.65}#seo-preamble .seo-ar{direction:rtl;text-align:right}#seo-preamble .seo-en{direction:ltr;text-align:left;margin-top:12px;border-top:1px solid #1a1a1a;padding-top:12px}#seo-preamble h1,#seo-preamble h2{font-size:18px;font-weight:700;color:#ddd;margin:0 0 8px}#seo-preamble p{margin:0 0 8px;color:#999}#seo-preamble ul{margin:0;padding-inline-start:18px;color:#888}#seo-preamble li{margin-bottom:3px}#seo-related{font-family:Arial,sans-serif;padding:10px 18px 12px;background:#060606;border-bottom:1px solid #1a1a1a;font-size:12px;direction:rtl}#seo-related a{color:#666;text-decoration:none;margin:0 4px}#seo-related a:hover{color:#999}#seo-related span{color:#444}</style>`;

let base;
try {
  base = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
} catch (err) {
  console.error('❌ Could not read dist/index.html:', err.message);
  console.error('   distDir =', distDir);
  console.error('   Listing dist/:', fs.existsSync(distDir) ? fs.readdirSync(distDir).slice(0,10).join(', ') : 'NOT FOUND');
  process.exit(1);
}

function patchMeta(html, { title, canonical, descAr, descEn, keywords, ogTitle, ogUrl }) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,       `$1${descAr} ${descEn}$2`);
  html = html.replace(/(<meta name="keywords" content=")[^"]*(")/,           `$1${keywords}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,         `$1${canonical}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,       `$1${ogTitle || title}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,`$1${descAr}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,      `$1${ogTitle || title}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/,`$1${descAr}$2`);
  return html;
}

function buildRelated(slugs) {
  const ar = slugs.map(s => `<a href="https://vexatoys.com/${s}">${SLUG_TO_NAME_AR[s]||s}</a>`).join('<span> | </span>');
  const en = slugs.map(s => `<a href="https://vexatoys.com/${s}">${SLUG_TO_NAME_EN[s]||s}</a>`).join('<span> | </span>');
  return `<div id="seo-related"><span style="color:#555;margin-left:8px">ذات صلة:</span>${ar}&nbsp;&nbsp;<span style="direction:ltr;display:inline">Related: ${en}</span></div>`;
}

function generateCategoryPage(cat) {
  const jsonLd = JSON.stringify({
    '@context':'https://schema.org','@type':'CollectionPage',
    name: cat.titleEn, alternateName: cat.titleAr, description: cat.descEn,
    url: `https://vexatoys.com/${cat.slug}`,
    inLanguage: ['ar','en'],
    publisher: { '@type':'Organization', name:'Vexa Store Lebanon', url:'https://vexatoys.com', logo:{ '@type':'ImageObject', url:'https://vexatoys.com/vexa-logo.jpg' } },
    breadcrumb: { '@type':'BreadcrumbList', itemListElement: [
      { '@type':'ListItem', position:1, name:'Vexa Store Lebanon', item:'https://vexatoys.com/' },
      { '@type':'ListItem', position:2, name:cat.name, item:`https://vexatoys.com/${cat.slug}` },
    ]},
    isPartOf: { '@type':'WebSite', name:'Vexa Store Lebanon', url:'https://vexatoys.com' },
  });

  let html = patchMeta(base, {
    title: `${cat.titleAr} | ${cat.titleEn}`,
    canonical: `https://vexatoys.com/${cat.slug}`,
    descAr: cat.descAr, descEn: cat.descEn, keywords: cat.keywords,
    ogTitle: cat.titleAr,
  });
  const noscript = `<noscript><div style="font-family:sans-serif;padding:20px;direction:rtl"><h1>${cat.titleAr}</h1><p>${cat.descAr}</p><a href="https://vexatoys.com">vexatoys.com</a></div></noscript>`;
  html = html.replace('</head>', `<script type="application/ld+json">${jsonLd}</script>\n${SEO_STYLE}\n<script>window.__INITIAL_CATEGORY__="${cat.name}";</script>\n${noscript}\n</head>`);
  const content = `<div id="seo-preamble"><div class="seo-ar">${cat.seoAr}</div><div class="seo-en">${cat.seoEn}</div></div>\n${buildRelated(cat.related)}`;
  html = html.replace('<div id="root">', `${content}\n<div id="root">`);
  return html;
}

function generateProductPage(product) {
  const nameEn = product.nameEn || product.nameAr || 'Product';
  const nameAr = product.nameAr || product.nameEn || 'منتج';
  const descEn = product.descriptionEn || '';
  const descAr = product.descriptionAr || '';
  const price  = parseFloat(product.price) || 0;
  const oldPrice = Math.round(price * 1.23);
  const canonical = `https://vexatoys.com/product/${product.id}`;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: nameEn,
    alternateName: nameAr,
    description: descEn || descAr,
    image: product.image ? [product.image] : [],
    sku: product.id,
    brand: { '@type':'Brand', name:'Vexa Store Lebanon' },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: canonical,
      seller: { '@type':'Organization', name:'Vexa Store Lebanon', url:'https://vexatoys.com' },
      priceValidUntil: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0,10),
      shippingDetails: { '@type':'OfferShippingDetails', shippingRate:{ '@type':'MonetaryAmount', value:'0', currency:'USD' }, deliveryTime:{ '@type':'ShippingDeliveryTime', handlingTime:{ '@type':'QuantitativeValue', minValue:0, maxValue:1, unitCode:'DAY' } } },
    },
    ...(product.reviewsCount > 0 ? { aggregateRating: { '@type':'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewsCount, bestRating:5, worstRating:1 } } : {}),
    breadcrumb: { '@type':'BreadcrumbList', itemListElement: [
      { '@type':'ListItem', position:1, name:'Vexa Store Lebanon', item:'https://vexatoys.com/' },
      { '@type':'ListItem', position:2, name:nameEn, item:canonical },
    ]},
  });

  const starsHtml = (r) => '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r));
  const categorySlug = (product.categories?.[0] || product.category || 'sex-toys').toLowerCase().replace(/\s+/g,'-');
  const categoryNameAr = SLUG_TO_NAME_AR[categorySlug] || product.category || '';
  const categoryNameEn = SLUG_TO_NAME_EN[categorySlug] || product.category || '';

  const seoContent = `<div id="seo-preamble"><div class="seo-ar">
    <nav aria-label="Breadcrumb" style="font-size:12px;margin-bottom:8px">
      <a href="https://vexatoys.com" style="color:#666;text-decoration:none">فيكسا</a>
      <span style="color:#555;margin:0 6px">›</span>
      <a href="https://vexatoys.com/${categorySlug}" style="color:#666;text-decoration:none">${categoryNameAr}</a>
      <span style="color:#555;margin:0 6px">›</span>
      <span style="color:#999">${nameAr}</span>
    </nav>
    <h1>${nameAr} — متجر فيكسا لبنان</h1>
    <p style="color:#888;margin:4px 0 8px">
      <span style="color:#f59e0b">${starsHtml(product.rating)}</span>
      ${product.rating}/5 (${product.reviewsCount} تقييم) ·
      <strong style="color:#4ade80">${product.stock > 0 ? 'متوفر' : 'نفذ'}</strong> ·
      <strong style="color:#fff">$${price.toFixed(2)}</strong>
      <del style="color:#555;margin-right:8px">$${oldPrice.toFixed(2)}</del>
    </p>
    ${descAr ? `<p>${descAr}</p>` : ''}
    <ul>
      <li>توصيل سري في نفس اليوم — بيروت</li>
      <li>دفع عند الاستلام</li>
      <li>تغليف سري 100%</li>
    </ul>
  </div><div class="seo-en">
    <h2>${nameEn} — Vexa Store Lebanon</h2>
    <p>
      <span style="color:#f59e0b">${starsHtml(product.rating)}</span>
      ${product.rating}/5 (${product.reviewsCount} reviews) ·
      <strong style="color:#4ade80">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</strong> ·
      <strong style="color:#fff">$${price.toFixed(2)} USD</strong>
      <del style="color:#555;margin-left:8px">$${oldPrice.toFixed(2)}</del>
    </p>
    ${descEn ? `<p>${descEn}</p>` : ''}
    <ul>
      <li>Same-day discreet delivery — Beirut</li>
      <li>Cash on delivery (COD)</li>
      <li>100% plain sealed packaging</li>
    </ul>
    <p><strong>Category:</strong> <a href="https://vexatoys.com/${categorySlug}" style="color:#888">${categoryNameEn}</a></p>
  </div></div>`;

  const noscript = `<noscript><div style="font-family:sans-serif;padding:20px;direction:rtl"><h1>${nameAr}</h1><p>${descAr}</p><p>السعر: $${price.toFixed(2)} USD</p><a href="https://vexatoys.com/${categorySlug}">العودة إلى ${categoryNameAr}</a></div></noscript>`;

  let html = patchMeta(base, {
    title: `${nameAr} | ${nameEn} — متجر فيكسا لبنان | Vexa Store Lebanon`,
    canonical,
    descAr: `${nameAr} — $${price.toFixed(2)} — ${product.stock > 0 ? 'متوفر' : 'نفذ المخزون'}. ${descAr.slice(0,100)}`,
    descEn: `${nameEn} — $${price.toFixed(2)} USD — ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}. Rated ${product.rating}/5. Buy at Vexa Store Lebanon.`,
    keywords: `${nameEn} Lebanon, ${nameAr} لبنان, buy ${nameEn} Beirut, ${categoryNameEn} Lebanon, Vexa Store`,
    ogTitle: `${nameAr} | ${nameEn}`,
    ogUrl: canonical,
  });
  html = html.replace('</head>', `<script type="application/ld+json">${jsonLd}</script>\n${SEO_STYLE}\n<script>window.__INITIAL_PRODUCT_ID__="${product.id}";</script>\n${noscript}\n</head>`);
  html = html.replace('<div id="root">', `${seoContent}\n<div id="root">`);
  return html;
}

// ── MAIN (async) ─────────────────────────────────────────────────────────────
async function main() {
  // 1. Generate all category pages
  for (const cat of CATEGORIES) {
    fs.writeFileSync(path.join(distDir, `${cat.slug}.html`), generateCategoryPage(cat));
    console.log(`✓ ${cat.slug}.html`);
  }

  // 2. About page
  let aboutHtml = base;
  aboutHtml = aboutHtml.replace(/<title>[^<]*<\/title>/, `<title>عن متجر فيكسا | About Vexa Store Lebanon - Adult Toys & Lingerie</title>`);
  aboutHtml = aboutHtml.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="https://vexatoys.com/about" />`);
  aboutHtml = aboutHtml.replace(/(<meta name="description" content=")[^"]*(")/,    `$1تعرف على متجر فيكسا — المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية في لبنان. About Vexa Store — Lebanon's most discreet adult products store.$2`);
  aboutHtml = aboutHtml.replace(/(<meta name="keywords" content=")[^"]*(")/,        `$1Vexa Store Lebanon, متجر فيكسا, adult toys store Lebanon, sex toys shop Beirut$2`);
  aboutHtml = aboutHtml.replace(/(<meta property="og:url" content=")[^"]*(")/,      `$1https://vexatoys.com/about$2`);
  aboutHtml = aboutHtml.replace(/(<meta property="og:title" content=")[^"]*(")/,    `$1عن متجر فيكسا | Vexa Store Lebanon$2`);
  aboutHtml = aboutHtml.replace('</head>', `${SEO_STYLE}\n<script>window.__INITIAL_VIEW__="about";</script>\n</head>`);
  const aboutContent = `<div id="seo-preamble"><div class="seo-ar"><h1>عن متجر فيكسا — ألعاب زوجية ولانجري في لبنان</h1><p>متجر فيكسا هو المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية في لبنان.</p><ul><li>توصيل سري 100% في بيروت ولبنان</li><li>دفع عند الاستلام</li><li>منتجات أصلية وآمنة طبياً</li></ul></div><div class="seo-en"><h2>About Vexa Store Lebanon</h2><p>Vexa Store is Lebanon's most discreet and trusted adult products store.</p><ul><li>100% discreet delivery in Beirut and Lebanon</li><li>Cash on delivery</li><li>Original body-safe products</li></ul></div></div>`;
  aboutHtml = aboutHtml.replace('<div id="root">', `${aboutContent}\n<div id="root">`);
  fs.writeFileSync(path.join(distDir, 'about.html'), aboutHtml);
  console.log('✓ about.html');

  // 3. Fetch & generate product pages
  console.log('\n📦 Fetching products from Firebase...');
  const products = await fetchAllProducts();
  console.log(`   Found ${products.length} products`);

  const productUrls = [];
  const productDir = path.join(distDir, 'product');
  if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });

  for (const product of products) {
    const html = generateProductPage(product);
    fs.writeFileSync(path.join(distDir, `product-${product.id}.html`), html);
    productUrls.push(`https://vexatoys.com/product/${product.id}`);
    process.stdout.write('.');
  }
  if (products.length > 0) console.log(`\n✓ ${products.length} product pages generated`);

  // 4. Sitemap (categories + products — NO ?category= URLs)
  const categoryUrls = [
    `  <url>\n    <loc>https://vexatoys.com/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    `  <url>\n    <loc>https://vexatoys.com/about</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    ...CATEGORIES.map(c =>
      `  <url>\n    <loc>https://vexatoys.com/${c.slug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${c.priority}</priority>\n  </url>`
    ),
    ...productUrls.map(u =>
      `  <url>\n    <loc>${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    ),
  ];

  fs.writeFileSync(
    path.join(distDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${categoryUrls.join('\n')}\n</urlset>\n`
  );
  console.log(`✓ sitemap.xml — ${2 + CATEGORIES.length + productUrls.length} URLs total (clean URLs only)`);
  console.log(`\n✅ Pre-rendering complete: ${CATEGORIES.length} categories + ${products.length} products + sitemap`);
}

main().catch(err => { console.error('❌ Prerender failed:', err); console.warn('⚠ Continuing build with static sitemap fallback.'); });
