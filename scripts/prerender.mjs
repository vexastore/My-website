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
const OFFER_VALID_FROM = '2026-01-01';
const OFFER_PRICE_VALID_UNTIL = '2027-12-31';
const DEFAULT_OG_IMAGE = 'https://vexatoys.com/opengraph.jpg';

function schemaImageUrl(value) {
  if (!value || String(value).startsWith('data:')) return DEFAULT_OG_IMAGE;
  try {
    const url = new URL(String(value), 'https://vexatoys.com');
    if (url.protocol === 'http:') url.protocol = 'https:';
    return url.protocol === 'https:' ? url.toString() : DEFAULT_OG_IMAGE;
  } catch {
    return DEFAULT_OG_IMAGE;
  }
}

// ── URL-friendly slug from English product name ───────────────────────────
function toSlug(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/, '')
    .slice(0, 60) || 'product';
}

// ── Fallback product data (used when Firebase returns 0 products) ─────────────
const FALLBACK_PRODUCTS = [
  { id:'st-1', nameEn:'Luxury Couple Massage Set', nameAr:'مجموعة التدليك الزوجية الفاخرة', descriptionEn:'A luxury set containing natural oils and massage tools designed to enhance intimacy and relaxation. 100% body-safe.', descriptionAr:'مجموعة فاخرة تحتوي على زيوت طبيعية وأدوات تدليك مصممة لزيادة القرب بين الزوجين.', price:349, rating:4.8, reviewsCount:124, stock:15, category:'Sex Toys', image:'https://images.unsplash.com/photo-1601924991987-3976334a1d5d?q=80&w=500&auto=format&fit=crop' },
  { id:'st-2', nameEn:'Dual Pulse Stimulation Device', nameAr:'جهاز التحفيز النبضي المزدوج', descriptionEn:'Dual-action stimulation device with gentle pulse technology, made of high-quality medical silicone. Waterproof and USB rechargeable.', descriptionAr:'جهاز تحفيز ثنائي المفعول بتقنية النبضات اللطيفة، مريح ومصنوع من السيليكون الطبي.', price:499, rating:4.5, reviewsCount:89, stock:8, category:'Sex Toys', image:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop' },
  { id:'st-3', nameEn:'Ultra-Smooth Water-Based Lubricant 200ml', nameAr:'جل مائي مرطب فائق النعومة 200 مل', descriptionEn:'Natural water-based lubricant, hypoallergenic, easy to clean, and provides long-lasting smoothness.', descriptionAr:'مزلق طبيعي ذو أساس مائي، لا يسبب الحساسية، سهل التنظيف.', price:95, rating:4.9, reviewsCount:312, stock:45, category:'Sex Toys', image:'https://images.unsplash.com/photo-1556228578-8c7c2e43809f?q=80&w=500&auto=format&fit=crop' },
  { id:'vib-1', nameEn:'Upgraded Smart Rose Vibrator', nameAr:'هزاز الوردة الذكي المطور', descriptionEn:'The famous rose vibrator using gentle air suction technology and multi-speed pulses. Ultra-quiet. USB rechargeable and waterproof.', descriptionAr:'الهزاز الأكثر شهرة بتصميم الوردة الأنيق، يعمل بتقنية شفط الهواء اللطيفة.', price:280, rating:4.7, reviewsCount:215, stock:22, category:'Vibrators', image:'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?q=80&w=500&auto=format&fit=crop' },
  { id:'vib-2', nameEn:'Wand Massager for Muscle and Intimate Use', nameAr:'جهاز المساج الاهتزازي للعضلات والمناطق الحساسة', descriptionEn:'Powerful wireless wand massager with a flexible medical silicone head, offering 10 deep vibration levels.', descriptionAr:'جهاز تدليك لاسلكي قوي برأس مرن من السيليكون الناعم.', price:410, rating:4.6, reviewsCount:142, stock:10, category:'Vibrators', image:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&auto=format&fit=crop' },
  { id:'vib-3', nameEn:'Mini Wireless Bullet Vibrator', nameAr:'هزاز الرصاصة اللاسلكي الصغير', descriptionEn:'Compact and discreet yet powerful bullet vibrator, remote controllable. Covered in silky-smooth silicone.', descriptionAr:'هزاز صغير الحجم وسري للغاية ولكنه قوي، يمكن التحكم به عن بعد.', price:150, rating:4.3, reviewsCount:76, stock:30, category:'Vibrators', image:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop' },
  { id:'male-1', nameEn:'Smart Male Masturbator & Stimulator', nameAr:'جهاز الاندماج والتحفيز الذكي للرجال', descriptionEn:'Advanced automatic male device with innovative internal textures. Features automatic warming and multi-speed vibration.', descriptionAr:'جهاز آلي متطور للرجال بتصميم هندسي داخلي مبتكر.', price:550, rating:4.4, reviewsCount:94, stock:6, category:'Male Toys', image:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500&auto=format&fit=crop' },
  { id:'male-2', nameEn:'Flexible Silicone Men Rings (Set of 3)', nameAr:'حلقات السيليكون المرنة للرجال (طقم 3 قطع)', descriptionEn:'Set of 3 different sized rings made of high-stretch medical silicone. Designed to increase stamina safely.', descriptionAr:'مجموعة من 3 حلقات بأحجام مختلفة مصنوعة من السيليكون الطبي.', price:120, rating:4.2, reviewsCount:118, stock:25, category:'Male Toys', image:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop' },
  { id:'male-3', nameEn:'Ribbed Automatic Stimulation Sleeve', nameAr:'كم التحفيز التلقائي المضلع', descriptionEn:'Sleeve made of ultra-soft and stretchy TPE, featuring ribbed internal textures for stimulation. Easy to clean.', descriptionAr:'كم مصنوع من مادة TPE فائقة النعومة والمرونة.', price:195, rating:4.5, reviewsCount:63, stock:14, category:'Male Toys', image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop' },
  { id:'dil-1', nameEn:'Realistic Silicone Dildo with Suction Cup', nameAr:'ديلدو السيليكون الواقعي مع قاعدة تثبيت', descriptionEn:'Highly realistic dildo made of dual-density silicone with firm core and soft skin-like outer layer. BPA-free.', descriptionAr:'ديلدو واقعي للغاية مصنوع من سيليكون مزدوج الكثافة.', price:290, rating:4.6, reviewsCount:52, stock:5, category:'Dildos', image:'https://images.unsplash.com/photo-1600857062141-984d9902f3cb?q=80&w=500&auto=format&fit=crop' },
  { id:'dil-2', nameEn:'Luxury Glass Dildo for Temperature Play', nameAr:'ديلدو زجاجي فاخر للعلاج بالحرارة والبرودة', descriptionEn:'Handmade from shatterproof and body-safe borosilicate glass. For exciting temperature play.', descriptionAr:'مصنوع يدوياً من زجاج البورسليكات المقاوم للصدمات والآمن تماماً.', price:260, rating:4.8, reviewsCount:41, stock:7, category:'Dildos', image:'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop' },
  { id:'dil-3', nameEn:'Flexible Curved G-Spot Dildo', nameAr:'ديلدو جي-سبوت المرن المنحني', descriptionEn:'Ergonomic design with a precisely engineered curve for direct G-spot reach. Silky-smooth silicone.', descriptionAr:'تصميم مريح بانحناءة مدروسة للوصول المباشر.', price:180, rating:4.5, reviewsCount:88, stock:18, category:'Dildos', image:'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500&auto=format&fit=crop' },
  { id:'ling-1', nameEn:'Luxury Black Lace Babydoll', nameAr:'بيبي دول الدانتيل الأسود الفاخر', descriptionEn:'Classic luxury babydoll in soft lace and sheer chiffon, comes with a matching thong.', descriptionAr:'قطعة لانجري كلاسيكية فاخرة من الدانتيل الناعم والشيفون الشفاف.', price:210, rating:4.8, reviewsCount:167, stock:20, category:'Lingerie', image:'https://images.unsplash.com/photo-1618333244973-f8e43420a16e?q=80&w=500&auto=format&fit=crop' },
  { id:'ling-2', nameEn:'Crimson Red Satin Bodysuit', nameAr:'طقم بودي سوت ساتان أحمر قرمزي', descriptionEn:'Attractive bodysuit made of premium glossy satin and ornate lace. Adjustable straps, open back design.', descriptionAr:'بودي سوت جذاب مصنوع من الساتان الفاخر اللامع والدانتيل المزخرف.', price:185, rating:4.6, reviewsCount:95, stock:12, category:'Lingerie', image:'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=500&auto=format&fit=crop' },
  { id:'ling-3', nameEn:'Soft Silk Kimono Robe', nameAr:'رداء كيمونو من الحرير الناعم', descriptionEn:'Long robe in ultra-soft faux silk, adorned with lace trim on sleeves and a wide waist belt. Elegant and comfortable.', descriptionAr:'رداء طويل من الحرير الصناعي فائق النعومة.', price:240, rating:4.7, reviewsCount:134, stock:16, category:'Lingerie', image:'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop' },
  { id:'bdsm-1', nameEn:'Soft Leather Restraints Starter Kit', nameAr:'طقم القيود الجلدية الناعمة للمبتدئين', descriptionEn:'Wrist and ankle restraints set made of faux leather lined with soft neoprene. Easy to adjust and safe.', descriptionAr:'مجموعة قيود للمعصم والكاحل مصنوعة من الجلد الصناعي المبطن بالنيوبرين.', price:180, rating:4.4, reviewsCount:58, stock:9, category:'BDSM', image:'https://images.unsplash.com/photo-1602810318383-e55f89a3df12?q=80&w=500&auto=format&fit=crop' },
  { id:'bdsm-2', nameEn:'Luxury Silk Blindfold with Tickler Feather', nameAr:'عصابة العينين الحريرية الفاخرة مع ريشة مداعبة', descriptionEn:'Natural silk blindfold to block light and heighten touch sensitivity, comes with a soft tickler feather.', descriptionAr:'عصابة عين من الحرير الطبيعي لحجب الضوء وزيادة الحساسية.', price:85, rating:4.7, reviewsCount:112, stock:35, category:'BDSM', image:'https://images.unsplash.com/photo-1520006403993-47400cad67c5?q=80&w=500&auto=format&fit=crop' },
  { id:'bdsm-3', nameEn:'Short Leather Flogger / Crop', nameAr:'سوط المداعبة الجلدي القصير', descriptionEn:'Classic flogger made of soft leather falls with a comfortable braided handle for thrilling sensations.', descriptionAr:'سوط كلاسيكي مصنوع من شرائح الجلد الناعم بمقبض مريح.', price:130, rating:4.5, reviewsCount:47, stock:11, category:'BDSM', image:'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop' },
  { id:'hol-1', nameEn:'24 Days of Romance Advent Calendar', nameAr:'تقويم المفاجآت الرومانسية (24 يوماً)', descriptionEn:'Luxury gift box containing 24 special surprises for couples — mini toys, aromatic oils, romantic accessories.', descriptionAr:'صندوق هدايا فاخر يحتوي على 24 مفاجأة مميزة للأزواج.', price:799, rating:4.9, reviewsCount:34, stock:4, category:'Holiday Collection', image:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop' },
  { id:'hol-2', nameEn:'Sexy Santa Cosplay Lingerie Set', nameAr:'طقم لانجري بابا نويل التنكري المثير', descriptionEn:'Red velvet cosplay set with soft white faux fur trim. Includes mini dress, holiday hat, and wide black waist belt.', descriptionAr:'طقم تنكري مخملي أحمر بأطراف فرو بيضاء ناعمة.', price:225, rating:4.5, reviewsCount:78, stock:14, category:'Holiday Collection', image:'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=500&auto=format&fit=crop' },
  { id:'hol-3', nameEn:'Luxury Massage Candle - Vanilla & Oud', nameAr:'شمعة المساج العطرية الفاخرة - برائحة الفانيليا والعود', descriptionEn:'Candle made from shea butter and natural coconut oil. Melts into a warm, nourishing massage oil.', descriptionAr:'شمعة مصنوعة من زبدة الشيا وزيت جوز الهند. تتحول إلى زيت مساج دافئ.', price:110, rating:4.8, reviewsCount:143, stock:28, category:'Holiday Collection', image:'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500&auto=format&fit=crop' },
  { id:'new-1', nameEn:'Smart Interactive Audio Massager', nameAr:'جهاز المساج الصوتي التفاعلي الذكي', descriptionEn:'Smart vibrator that interacts with music or your partner\'s voice via Bluetooth and mobile app.', descriptionAr:'جهاز اهتزازي ذكي يتفاعل مع الموسيقى عبر البلوتوث وتطبيق الهاتف.', price:620, rating:5.0, reviewsCount:12, stock:6, category:'New Arrivals', image:'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=500&auto=format&fit=crop' },
  { id:'new-2', nameEn:'Luxury Gold Lace Lingerie 2-Piece Set', nameAr:'لانجري الدانتيل الذهبي الفاخر قطعتين', descriptionEn:'Stunning lingerie set merging soft black chiffon with shiny golden lace threads. Modern and bold design.', descriptionAr:'طقم لانجري يدمج بين الشيفون الأسود الناعم وخيوط الدانتيل الذهبية اللامعة.', price:270, rating:4.9, reviewsCount:18, stock:8, category:'New Arrivals', image:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500&auto=format&fit=crop' },
  { id:'new-3', nameEn:'Organic Essential Oils Set (Arousal & Deep Sleep)', nameAr:'طقم الزيوت العطرية العضوية', descriptionEn:'100% natural organic essential oils — lavender for relaxation, ylang-ylang and jasmine to enhance mood.', descriptionAr:'مجموعة مركزة من الزيوت العطرية العضوية الطبيعية 100%.', price:140, rating:4.7, reviewsCount:22, stock:20, category:'New Arrivals', image:'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500&auto=format&fit=crop' },
  { id:'lube-1', nameEn:'Premium Water-Based Lubricant 100ml', nameAr:'مزلق مائي فاخر 100 مل', descriptionEn:'Body-safe water-based lubricant. Fragrance-free, compatible with all toy materials and condoms.', descriptionAr:'مزلق مائي آمن على البشرة بدون عطر، متوافق مع جميع أنواع الألعاب.', price:75, rating:4.8, reviewsCount:201, stock:60, category:'Lubricants', image:'https://images.unsplash.com/photo-1556228578-8c7c2e43809f?q=80&w=500&auto=format&fit=crop' },
  { id:'lube-2', nameEn:'Silicone-Based Long-Lasting Lubricant 50ml', nameAr:'مزلق سيليكون طويل الأمد 50 مل', descriptionEn:'Premium silicone-based lubricant for long-lasting smoothness. Ideal for extended sessions.', descriptionAr:'مزلق سيليكون فاخر للحصول على نعومة طويلة الأمد.', price:120, rating:4.6, reviewsCount:87, stock:35, category:'Lubricants', image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop' },
  { id:'pop-1', nameEn:'Rush Original Poppers 10ml', nameAr:'بوبرز راش الأصلي 10 مل', descriptionEn:'Rush Original — the most popular poppers brand worldwide. 10ml bottle, fast-acting, premium quality.', descriptionAr:'راش الأصلي — أشهر ماركة بوبرز في العالم.', price:45, rating:4.7, reviewsCount:189, stock:50, category:'Poppers', image:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop' },
  { id:'ring-1', nameEn:'Vibrating Cock Ring with Remote Control', nameAr:'حلقة قضيب هزازة مع تحكم عن بعد', descriptionEn:'Vibrating cock ring with wireless remote control. Medical silicone, stretchy, waterproof. 10 vibration modes.', descriptionAr:'حلقة قضيب هزازة مع جهاز تحكم عن بعد. سيليكون طبي ومرن ومضاد للماء.', price:185, rating:4.5, reviewsCount:76, stock:20, category:'Cock Rings', image:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop' },
  { id:'mast-1', nameEn:'Pocket Stroker Masturbator - Tight Texture', nameAr:'جهاز استمناء جيبي - ملمس ضيق', descriptionEn:'Compact pocket masturbator with tight realistic texture. Made from ultra-soft TPE. Discreet and reusable.', descriptionAr:'جهاز استمناء جيبي بملمس ضيق وواقعي. مصنوع من TPE فائق النعومة.', price:165, rating:4.4, reviewsCount:92, stock:18, category:'Masturbators', image:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500&auto=format&fit=crop' },
  { id:'pump-1', nameEn:'Beginner Penis Pump with Gauge', nameAr:'مضخة القضيب للمبتدئين مع مقياس ضغط', descriptionEn:'Easy-to-use penis pump for beginners with a pressure gauge for safety. Strong vacuum seal.', descriptionAr:'مضخة قضيب سهلة الاستخدام للمبتدئين مع مقياس ضغط للسلامة.', price:220, rating:4.3, reviewsCount:54, stock:12, category:'Penis Pumps', image:'https://images.unsplash.com/photo-1563473213013-de1fa25b9bbd?q=80&w=500&auto=format&fit=crop' },
  { id:'butt-1', nameEn:'Tapered Silicone Butt Plug - Small', nameAr:'سدادة شرجية سيليكون مدببة - صغيرة', descriptionEn:'Smooth tapered silicone butt plug for beginners. Medical-grade silicone, flared base for safety.', descriptionAr:'سدادة شرجية سيليكون ناعمة للمبتدئين. سيليكون طبي مع قاعدة آمنة.', price:85, rating:4.5, reviewsCount:110, stock:25, category:'Butt Plugs', image:'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop' },
  { id:'anal-1', nameEn:'Anal Beads with Loop - 5 Beads', nameAr:'خرزات شرجية مع حلقة - 5 خرزات', descriptionEn:'5-bead silicone anal beads with graduated sizes and a retrieval loop. Medical silicone, waterproof.', descriptionAr:'خرزات شرجية سيليكون بأحجام متدرجة وحلقة استعادة.', price:95, rating:4.4, reviewsCount:67, stock:22, category:'Anal Toys', image:'https://images.unsplash.com/photo-1600857062141-984d9902f3cb?q=80&w=500&auto=format&fit=crop' },
  { id:'bond-1', nameEn:'Velvet Wrist Restraints - Adjustable', nameAr:'قيود معصم مخملية - قابلة للتعديل', descriptionEn:'Soft velvet wrist restraints with adjustable buckles and D-rings. Beginner-friendly, comfortable, and secure.', descriptionAr:'قيود معصم ناعمة بأبزيم قابل للتعديل وحلقات D.', price:120, rating:4.6, reviewsCount:83, stock:30, category:'Bondage', image:'https://images.unsplash.com/photo-1602810318383-e55f89a3df12?q=80&w=500&auto=format&fit=crop' },
  { id:'kegel-1', nameEn:'Kegel Ball Set - 3 Weights', nameAr:'طقم كيغل بولز - 3 أوزان', descriptionEn:'Set of 3 kegel balls in different weights for progressive pelvic floor training. Medical silicone.', descriptionAr:'طقم من 3 كيغل بولز بأوزان مختلفة لتمرين عضلات قاع الحوض.', price:140, rating:4.7, reviewsCount:129, stock:19, category:'Kegel Balls', image:'https://images.unsplash.com/photo-1556228578-8c7c2e43809f?q=80&w=500&auto=format&fit=crop' },
  { id:'enh-1', nameEn:'Delay Spray for Men - 10ml', nameAr:'بخاخ التأخير للرجال - 10 مل', descriptionEn:'Clinically tested delay spray for men. Mild desensitizing formula for prolonged performance. Odorless.', descriptionAr:'بخاخ تأخير إكلينيكي للرجال. تركيبة خفيفة لتمديد وقت الأداء.', price:65, rating:4.5, reviewsCount:245, stock:55, category:'Sexual Enhancers', image:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop' },
  { id:'doll-1', nameEn:'Premium Silicone Torso - Realistic Feel', nameAr:'جذع سيليكون فاخر - ملمس واقعي', descriptionEn:'Premium silicone torso with ultra-realistic texture and weight. Made from body-safe platinum silicone.', descriptionAr:'جذع سيليكون فاخر بملمس ووزن واقعي للغاية.', price:1200, rating:4.6, reviewsCount:28, stock:5, category:'Sex Dolls', image:'https://images.unsplash.com/photo-1563473213013-de1fa25b9bbd?q=80&w=500&auto=format&fit=crop' },
  { id:'strap-1', nameEn:'Adjustable Strap-On Harness with Silicone Dildo', nameAr:'حزام ستراب أون قابل للتعديل مع ديلدو سيليكون', descriptionEn:'Adjustable strap-on harness with O-ring attachment. Compatible with most dildos. Easy to clean.', descriptionAr:'حزام ستراب أون قابل للتعديل مع حلقة O.', price:320, rating:4.5, reviewsCount:41, stock:10, category:'Strap Ons', image:'https://images.unsplash.com/photo-1600857062141-984d9902f3cb?q=80&w=500&auto=format&fit=crop' },
  { id:'chast-1', nameEn:'Beginner Silicone Chastity Cage', nameAr:'قفص عفة سيليكون للمبتدئين', descriptionEn:'Lightweight silicone chastity cage for beginners. Comfortable fit, easy to put on and remove.', descriptionAr:'قفص عفة سيليكون خفيف الوزن للمبتدئين.', price:150, rating:4.3, reviewsCount:62, stock:15, category:'Chastity', image:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop' },
  { id:'mach-1', nameEn:'Automatic Thrusting Sex Machine', nameAr:'ماكينة جنس نابضة تلقائية', descriptionEn:'Powerful automatic thrusting sex machine with adjustable speed and depth. Compatible with most attachments.', descriptionAr:'ماكينة جنس نابضة تلقائية قوية مع سرعة وعمق قابلين للتعديل.', price:1500, rating:4.7, reviewsCount:19, stock:3, category:'Sex Machines', image:'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=500&auto=format&fit=crop' },
];

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

  const mapped = allDocs.map(doc => {
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

  if (mapped.length === 0) {
    console.warn('⚠ Firebase returned 0 products — using built-in fallback product data for schema generation.');
    return FALLBACK_PRODUCTS;
  }
  return mapped;
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
const SEO_STYLE = ''; // SEO data handled via JSON-LD + meta tags only
let base;
try {
  base = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
} catch (err) {
  console.error('❌ Could not read dist/index.html:', err.message);
  console.error('   distDir =', distDir);
  console.error('   Listing dist/:', fs.existsSync(distDir) ? fs.readdirSync(distDir).slice(0,10).join(', ') : 'NOT FOUND');
  process.exit(1);
}

function patchMeta(html, { title, canonical, descAr, descEn, keywords, ogTitle, ogUrl, ogImage }) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,       `$1${descAr} ${descEn}$2`);
  html = html.replace(/(<meta name="keywords" content=")[^"]*(")/,           `$1${keywords}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,         `$1${canonical}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,       `$1${ogTitle || title}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,`$1${descAr}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,      `$1${ogTitle || title}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/,`$1${descAr}$2`);
  if (ogImage) {
    html = html.replace(/(<meta property="og:image" content=")[^"]*(")/,      `$1${ogImage}$2`);
    html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/,      `$1${ogImage}$2`);
    html = html.replace(/(<meta property="og:image:alt" content=")[^"]*(")/,  `$1${ogTitle || title}$2`);
    html = html.replace(/(<meta name="twitter:image:alt" content=")[^"]*(")/,  `$1${ogTitle || title}$2`);
  }
  return html;
}

function buildRelated(slugs, hidden = false) {
    const ar = slugs.map(s => `<a href="https://vexatoys.com/${s}">${SLUG_TO_NAME_AR[s]||s}</a>`).join('<span> | </span>');
    const en = slugs.map(s => `<a href="https://vexatoys.com/${s}">${SLUG_TO_NAME_EN[s]||s}</a>`).join(' | ');
    const style = '';
    return `<div id="seo-related"${style}><span dir="rtl">ذات صلة: ${ar}</span><br><span dir="ltr">${en}</span></div>`;
  }

function generateCategoryPage(cat, catProducts = []) {
    // Build ItemList of Products with offers — required by Google Product rich results
    const priceValidUntil = new Date(Date.now() + 60*24*60*60*1000).toISOString().slice(0,10);
    const itemListElements = catProducts.slice(0, 20).map((p, i) => {
      const price = parseFloat(p.price) || 0;
      const prod = {
        '@type': 'Product',
        name: p.nameEn || p.nameAr || p.name || cat.name,
        alternateName: p.nameAr || p.nameEn || '',
        image: (p.image && !p.image.startsWith('data:')) ? [p.image] : [],
        sku: p.id,
        brand: { '@type': 'Brand', name: 'Vexa Store Lebanon' },
        offers: {
          '@type': 'Offer',
          price: price.toFixed(2),
          priceCurrency: 'USD',
          availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: `https://vexatoys.com/product/${toSlug(p.nameEn || p.nameAr || p.name || '') || p.id}`,
          seller: { '@type': 'Organization', name: 'Vexa Store Lebanon', url: 'https://vexatoys.com' },
          priceValidUntil,
        },
      };
      if (p.rating) {
        prod.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: parseFloat(p.rating).toFixed(1),
          reviewCount: Math.max(1, parseInt(p.reviewsCount) || 5),
          bestRating: 5, worstRating: 1,
        };
      }
      return { '@type': 'ListItem', position: i + 1, item: prod };
    });

    const schemaObj = {
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
    };
    if (itemListElements.length > 0) {
      schemaObj.mainEntity = { '@type':'ItemList', numberOfItems: itemListElements.length, itemListElement: itemListElements };
    }
    const jsonLd = JSON.stringify(schemaObj);

    let html = patchMeta(base, {
      title: `${cat.titleAr} | ${cat.titleEn}`,
      canonical: `https://vexatoys.com/${cat.slug}`,
      descAr: cat.descAr, descEn: cat.descEn, keywords: cat.keywords,
      ogTitle: cat.titleAr,
    });
    const productLinksHtml = catProducts.slice(0, 40).map(p => {
      const slug = p.slug || toSlug(p.nameEn || p.nameAr || p.name || '') || p.id;
      const label = (p.nameEn || p.nameAr || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const price = parseFloat(p.price || 0).toFixed(2);
      return `<li><a href="/product/${slug}">${label}</a> — $${price} USD</li>`;
    }).join('');
    const noscript = `<noscript><div style="font-family:sans-serif;padding:20px;direction:rtl"><h1>${cat.titleAr}</h1><p>${cat.descAr}</p>${productLinksHtml ? `<ul style="list-style:none;padding:0">${productLinksHtml}</ul>` : ''}<p><a href="https://vexatoys.com">vexatoys.com</a></p></div></noscript>`;
    html = html.replace('</head>', `<script type="application/ld+json">${jsonLd}</script>\n${SEO_STYLE}\n<script>window.__INITIAL_CATEGORY__="${cat.name}";</script>\n${noscript}\n</head>`);
    return html;
  }
  
function generateProductPage(product, catSlugOverride) {
  const nameEn = product.nameEn || product.nameAr || 'Product';
  const nameAr = product.nameAr || product.nameEn || 'منتج';
  const descEn = product.descriptionEn || '';
  const descAr = product.descriptionAr || '';
  const price  = parseFloat(product.price) || 0;
  const slug   = product.slug || toSlug(nameEn);
  // ─ Canonical must match the SPA navigation URL (/{catSlug}/{pSlug})
  const categorySlug = catSlugOverride
    || (product.categorySlug || (product.categories?.[0] || product.category || 'sex-toys'))
        .toLowerCase().replace(/\s+/g,'-').replace(/_/g,'-').trim() || 'sex-toys';
  const canonical = `https://vexatoys.com/${categorySlug}/${slug}`;
  const categoryNameAr = SLUG_TO_NAME_AR[categorySlug] || product.category || '';
  const categoryNameEn = SLUG_TO_NAME_EN[categorySlug] || product.category || '';

  // Use @graph so BreadcrumbList is a separate top-level entity (matches client JSON-LD)
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type':'ListItem', position:1, name:'Vexa Store Lebanon', item:'https://vexatoys.com/' },
          { '@type':'ListItem', position:2, name:categoryNameEn || categorySlug, item:`https://vexatoys.com/${categorySlug}` },
          { '@type':'ListItem', position:3, name:nameEn, item:canonical },
        ],
      },
      {
        '@type': 'Product',
        name: nameEn,
        alternateName: nameAr,
        description: descEn || descAr,
        image: [schemaImageUrl(product.image)],
        sku: product.id,
        brand: { '@type':'Brand', name:'Vexa Store Lebanon' },
        offers: {
          '@type': 'Offer',
          price: price.toFixed(2),
          priceCurrency: 'USD',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: canonical,
          seller: { '@type':'Organization', name:'Vexa Store Lebanon', url:'https://vexatoys.com' },
           validFrom: OFFER_VALID_FROM,
           priceValidUntil: OFFER_PRICE_VALID_UNTIL,
          shippingDetails: {
            '@type':'OfferShippingDetails',
            shippingRate:{ '@type':'MonetaryAmount', value:'3.00', currency:'USD' },
            shippingDestination:{ '@type':'DefinedRegion', addressCountry:'LB' },
            deliveryTime:{ '@type':'ShippingDeliveryTime',
              handlingTime:{ '@type':'QuantitativeValue', minValue:0, maxValue:1, unitCode:'DAY' },
              transitTime:{ '@type':'QuantitativeValue', minValue:1, maxValue:2, unitCode:'DAY' } },
          },
          hasMerchantReturnPolicy: {
            '@type':'MerchantReturnPolicy',
            applicableCountry:'LB',
             returnPolicyCategory:'https://schema.org/MerchantReturnNotPermitted',
             merchantReturnMethod:'https://schema.org/ReturnByMail',
             returnFees:'https://schema.org/ReturnShippingFees',
          },
        },
        ...(product.reviewsCount > 0 ? { aggregateRating: { '@type':'AggregateRating', ratingValue: product.rating || 4.5, reviewCount: Math.max(1, product.reviewsCount || 1), bestRating:5, worstRating:1 } } : {}),
      },
    ],
  });

  const noscript = `<noscript><div style="font-family:sans-serif;padding:20px;direction:rtl"><h1>${nameAr}</h1><p>${descAr}</p><p>السعر: $${price.toFixed(2)} USD</p><a href="https://vexatoys.com/${categorySlug}">العودة إلى ${categoryNameAr}</a></div></noscript>`;

  let html = patchMeta(base, {
    title: `${nameEn} | Vexa Store Lebanon`,
    canonical,
    descAr: `${nameAr} — $${price.toFixed(2)} — ${product.stock > 0 ? 'متوفر' : 'نفذ المخزون'}. ${descAr.slice(0,100)}`,
    descEn: `${nameEn} — $${price.toFixed(2)} USD — ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}. Rated ${product.rating}/5. Buy at Vexa Store Lebanon.`,
    keywords: `${nameEn} Lebanon, ${nameAr} لبنان, buy ${nameEn} Beirut, ${categoryNameEn} Lebanon, Vexa Store`,
    ogTitle: nameEn,
    ogUrl: canonical,
    ogImage: (product.image && !product.image.startsWith('data:')) ? product.image : '',
  });
  const preloadImg = (product.image && !product.image.startsWith('data:')) ? `<link rel="preload" as="image" href="${product.image}" fetchpriority="high">` : '';
  html = html.replace('</head>', `<script type="application/ld+json">${jsonLd}</script>\n${SEO_STYLE}\n${preloadImg}\n<script>window.__INITIAL_PRODUCT_ID__="${product.id}";window.__INITIAL_PRODUCT_SLUG__="${slug}";</script>\n${noscript}\n</head>`);
  return html;
}


// ── MAIN (async) ─────────────────────────────────────────────────────────────
async function main() {
  // 1. Generate all category pages (fetch products for schema)
    const allProducts = await fetchAllProducts();
    console.log(`   Loaded ${allProducts.length} products for category schemas`);

  for (const cat of CATEGORIES) {
      const catName = cat.name.toLowerCase();
      const catProds = allProducts.filter(p => {
        const pCat  = (p.category  || '').toLowerCase();
        const pCats = (p.categories || []).map(x => x.toLowerCase());
        return pCat === catName || pCat === cat.slug ||
               pCats.includes(catName) || pCats.includes(cat.slug);
      });
      fs.writeFileSync(path.join(distDir, `${cat.slug}.html`), generateCategoryPage(cat, catProds));
      console.log(`✓ ${cat.slug}.html (${catProds.length} products in schema)`);
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
  // SEO content for about page is handled by JSON-LD and meta tags only
  fs.writeFileSync(path.join(distDir, 'about.html'), aboutHtml);
  console.log('✓ about.html');

  // 3. Fetch & generate product pages
  console.log('\n📦 Fetching products from Firebase...');
  const products = await fetchAllProducts();
  console.log(`   Found ${products.length} products`);

  const productUrls = [];
  // catSlug → Set of pSlugs (to avoid same slug in same category)
  const slugSetByCat = {};

  for (const product of products) {
    // ── Derive catSlug (same logic as navigateToProduct in SPA) ──────────────
    const rawCat = (product.categorySlug || product.categories?.[0] || product.category || 'sex-toys');
    const catSlug = rawCat.toLowerCase().replace(/\s+/g,'-').replace(/_/g,'-').trim() || 'sex-toys';
    if (!slugSetByCat[catSlug]) slugSetByCat[catSlug] = new Set();

    // ── Build unique product slug ──────────────────────────────────────────
    const rawSlug = toSlug(product.nameEn || product.nameAr || '');
    let slug = rawSlug;
    if (!slug || slugSetByCat[catSlug].has(slug)) {
      const base_ = rawSlug || toSlug(product.id) || 'product';
      let i = 2; slug = base_;
      while (slugSetByCat[catSlug].has(slug)) { slug = base_ + '-' + i; i++; }
    }
    slugSetByCat[catSlug].add(slug);
    product.slug = slug;

    // ── Write prerendered HTML to dist/{catSlug}/{pSlug}.html ─────────────
    // This makes Vercel serve the page at /{catSlug}/{pSlug} — matching the
    // SPA navigation URL and the client-side canonical exactly.
    const catDir = path.join(distDir, catSlug);
    if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });
    const html = generateProductPage(product, catSlug);
    fs.writeFileSync(path.join(catDir, `${slug}.html`), html);

    // ── Backward-compat redirect: /product/{slug} → /{catSlug}/{slug} ────
    // Preserves any old URLs already indexed by Google.
    const newUrl = `https://vexatoys.com/${catSlug}/${slug}`;
    const rHtml = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8">
<title>${product.nameEn || product.nameAr || 'Product'} | Vexa Store Lebanon</title>
<link rel="canonical" href="${newUrl}">
<meta http-equiv="refresh" content="0;url=${newUrl}">
<script>window.location.replace('${newUrl}');</script>
</head><body><a href="${newUrl}">View product</a></body></html>`;
    // Write at product-{slug}.html (served at /product-{slug}) for SPA fallback compat
    fs.writeFileSync(path.join(distDir, `product-${slug}.html`), rHtml);
    // Also write at product/{slug}.html (served at /product/{slug}) for old GSC indexed URLs
    const productDir2 = path.join(distDir, 'product');
    if (!fs.existsSync(productDir2)) fs.mkdirSync(productDir2, { recursive: true });
    fs.writeFileSync(path.join(productDir2, `${slug}.html`), rHtml);

    productUrls.push(newUrl);
    process.stdout.write('.');
  }
  if (products.length > 0) console.log(`\n✓ ${products.length} product pages generated at /{catSlug}/{pSlug}`);

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
  console.log(`✓ sitemap.xml — ${2 + CATEGORIES.length + productUrls.length} URLs total (clean URLs only, no duplicates)`);
  console.log(`\n✅ Pre-rendering complete: ${CATEGORIES.length} categories + ${products.length} products + sitemap`);

  // 5. IndexNow — instant notification to Bing, Yandex, Seznam, Naver + partners
  const INDEXNOW_KEY = 'a1b2c3d4e5f6789012345678901234ab';
  const allIndexNowUrls = [
    'https://vexatoys.com/',
    'https://vexatoys.com/about',
    ...CATEGORIES.map(c => `https://vexatoys.com/${c.slug}`),
    ...productUrls,
  ];
  try {
    const inRes = await fetch('https://api.indexnow.org/indexnow', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body:    JSON.stringify({
        host:        'vexatoys.com',
        key:         INDEXNOW_KEY,
        keyLocation: `https://vexatoys.com/${INDEXNOW_KEY}.txt`,
        urlList:     allIndexNowUrls,
      }),
      signal: AbortSignal.timeout(10000),
    });
    console.log(`✓ IndexNow: ${inRes.status} — submitted ${allIndexNowUrls.length} URLs to search engines`);
  } catch (e) {
    console.warn('⚠ IndexNow submit failed (non-critical):', e.message);
  }
  try {
    await fetch(
      'https://www.bing.com/ping?sitemap=https%3A%2F%2Fvexatoys.com%2Fsitemap.xml',
      { signal: AbortSignal.timeout(5000) }
    );
    console.log('✓ Bing sitemap ping sent');
  } catch {}
}

main().catch(err => { console.error('❌ Prerender failed:', err); console.warn('⚠ Continuing build with static sitemap fallback.'); });
