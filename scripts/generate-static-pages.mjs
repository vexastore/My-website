/**
 * generate-static-pages.mjs
 * Generates public/ category HTML pages with full Product ItemList JSON-LD schema.
 * Run standalone: node scripts/generate-static-pages.mjs
 * No dist/ or Firebase needed.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const TODAY = new Date().toISOString().slice(0, 10);
const PRICE_VALID_UNTIL = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

// ── Fallback product data (mirrors mockData.ts) ────────────────────────────
const FALLBACK_PRODUCTS = [
  { id:'st-1', nameEn:'Luxury Couple Massage Set', nameAr:'مجموعة التدليك الزوجية الفاخرة', descEn:'A luxury set containing natural oils and massage tools designed to enhance intimacy and relaxation. 100% body-safe and long-lasting.', descAr:'مجموعة فاخرة تحتوي على زيوت طبيعية وأدوات تدليك مصممة لزيادة القرب وتحسين تجربة الاسترخاء بين الزوجين.', price:349, rating:4.8, reviewsCount:124, stock:15, category:'Sex Toys', image:'https://images.unsplash.com/photo-1601924991987-3976334a1d5d?q=80&w=500&auto=format&fit=crop' },
  { id:'st-2', nameEn:'Dual Pulse Stimulation Device', nameAr:'جهاز التحفيز النبضي المزدوج', descEn:'Dual-action stimulation device with gentle pulse technology, made of high-quality medical silicone. Waterproof and USB rechargeable.', descAr:'جهاز تحفيز ثنائي المفعول بتقنية النبضات اللطيفة، مريح ومصنوع من السيليكون الطبي عالي الجودة.', price:499, rating:4.5, reviewsCount:89, stock:8, category:'Sex Toys', image:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop' },
  { id:'st-3', nameEn:'Ultra-Smooth Water-Based Lubricant 200ml', nameAr:'جل مائي مرطب فائق النعومة 200 مل', descEn:'Natural water-based lubricant, hypoallergenic, easy to clean, and provides long-lasting smoothness. Compatible with all toys and condoms.', descAr:'مزلق طبيعي ذو أساس مائي، لا يسبب الحساسية، سهل التنظيف ويوفر نعومة فائقة.', price:95, rating:4.9, reviewsCount:312, stock:45, category:'Sex Toys', image:'https://images.unsplash.com/photo-1556228578-8c7c2e43809f?q=80&w=500&auto=format&fit=crop' },
  { id:'vib-1', nameEn:'Upgraded Smart Rose Vibrator', nameAr:'هزاز الوردة الذكي المطور', descEn:'The famous rose vibrator using gentle air suction technology and multi-speed pulses. Ultra-quiet. USB rechargeable and waterproof.', descAr:'الهزاز الأكثر شهرة بتصميم الوردة الأنيق، يعمل بتقنية شفط الهواء اللطيفة ونبضات متعددة السرعات.', price:280, rating:4.7, reviewsCount:215, stock:22, category:'Vibrators', image:'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?q=80&w=500&auto=format&fit=crop' },
  { id:'vib-2', nameEn:'Wand Massager for Muscle and Intimate Use', nameAr:'جهاز المساج الاهتزازي للعضلات والمناطق الحساسة', descEn:'Powerful wireless wand massager with a flexible medical silicone head, offering 10 deep vibration levels. Rechargeable and waterproof.', descAr:'جهاز تدليك لاسلكي قوي برأس مرن مصنوع من السيليكون الناعم، يوفر 10 مستويات من الاهتزاز العميق.', price:410, rating:4.6, reviewsCount:142, stock:10, category:'Vibrators', image:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&auto=format&fit=crop' },
  { id:'vib-3', nameEn:'Mini Wireless Bullet Vibrator', nameAr:'هزاز الرصاصة اللاسلكي الصغير', descEn:'Compact and discreet yet powerful bullet vibrator, remote controllable, ideal for solo or couples play. Covered in silky-smooth silicone.', descAr:'هزاز صغير الحجم وسري للغاية ولكنه قوي، يمكن التحكم به عن بعد.', price:150, rating:4.3, reviewsCount:76, stock:30, category:'Vibrators', image:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop' },
  { id:'male-1', nameEn:'Smart Male Masturbator & Stimulator', nameAr:'جهاز الاندماج والتحفيز الذكي للرجال', descEn:'Advanced automatic male device with innovative internal textures. Features automatic warming and multi-speed vibration. Made from body-safe materials.', descAr:'جهاز آلي متطور للرجال بتصميم هندسي داخلي مبتكر يمنح شعوراً طبيعياً بالكامل.', price:550, rating:4.4, reviewsCount:94, stock:6, category:'Male Toys', image:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500&auto=format&fit=crop' },
  { id:'male-2', nameEn:'Flexible Silicone Men Rings (Set of 3)', nameAr:'حلقات السيليكون المرنة للرجال (طقم 3 قطع)', descEn:'Set of 3 different sized rings made of high-stretch medical silicone. Designed to increase stamina and enhance performance safely.', descAr:'مجموعة من 3 حلقات بأحجام مختلفة مصنوعة من السيليكون الطبي عالي المرونة.', price:120, rating:4.2, reviewsCount:118, stock:25, category:'Male Toys', image:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop' },
  { id:'male-3', nameEn:'Ribbed Automatic Stimulation Sleeve', nameAr:'كم التحفيز التلقائي المضلع', descEn:'Sleeve made of ultra-soft and stretchy TPE, featuring ribbed internal textures for stimulation. Easy to clean, reusable, and comfortable.', descAr:'كم مصنوع من مادة TPE فائقة النعومة والمرونة، يتميز بتصميم مضلع داخلي لزيادة التحفيز.', price:195, rating:4.5, reviewsCount:63, stock:14, category:'Male Toys', image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop' },
  { id:'dil-1', nameEn:'Realistic Silicone Dildo with Suction Cup', nameAr:'ديلدو السيليكون الواقعي مع قاعدة تثبيت', descEn:'Highly realistic dildo made of dual-density silicone with firm core and soft skin-like outer layer. Strong suction cup base. BPA-free.', descAr:'ديلدو واقعي للغاية مصنوع من سيليكون مزدوج الكثافة. مزود بقاعدة شفط قوية للتثبيت.', price:290, rating:4.6, reviewsCount:52, stock:5, category:'Dildos', image:'https://images.unsplash.com/photo-1600857062141-984d9902f3cb?q=80&w=500&auto=format&fit=crop' },
  { id:'dil-2', nameEn:'Luxury Glass Dildo for Temperature Play', nameAr:'ديلدو زجاجي فاخر للعلاج بالحرارة والبرودة', descEn:'Handmade from shatterproof and body-safe borosilicate glass. Can be placed in warm or cold water for exciting temperature play.', descAr:'مصنوع يدوياً من زجاج البورسليكات المقاوم للصدمات والآمن تماماً.', price:260, rating:4.8, reviewsCount:41, stock:7, category:'Dildos', image:'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop' },
  { id:'dil-3', nameEn:'Flexible Curved G-Spot Dildo', nameAr:'ديلدو جي-سبوت المرن المنحني', descEn:'Ergonomic design with a precisely engineered curve for direct G-spot reach. Silky-smooth silicone. Flexible to adapt to the body.', descAr:'تصميم مريح بانحناءة مدروسة بدقة للوصول المباشر وملمس حريري ناعم من السيليكون.', price:180, rating:4.5, reviewsCount:88, stock:18, category:'Dildos', image:'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500&auto=format&fit=crop' },
  { id:'ling-1', nameEn:'Luxury Black Lace Babydoll', nameAr:'بيبي دول الدانتيل الأسود الفاخر', descEn:'Classic luxury babydoll in soft lace and sheer chiffon, comes with a matching thong. Enhances confidence and femininity.', descAr:'قطعة لانجري كلاسيكية فاخرة من الدانتيل الناعم والشيفون الشفاف، تأتي مع سروال داخلي مطابق.', price:210, rating:4.8, reviewsCount:167, stock:20, category:'Lingerie', image:'https://images.unsplash.com/photo-1618333244973-f8e43420a16e?q=80&w=500&auto=format&fit=crop' },
  { id:'ling-2', nameEn:'Crimson Red Satin Bodysuit', nameAr:'طقم بودي سوت ساتان أحمر قرمزي', descEn:'Attractive bodysuit made of premium glossy satin and ornate lace. Adjustable straps for a perfect fit, and open back design.', descAr:'بودي سوت جذاب مصنوع من الساتان الفاخر اللامع والدانتيل المزخرف.', price:185, rating:4.6, reviewsCount:95, stock:12, category:'Lingerie', image:'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=500&auto=format&fit=crop' },
  { id:'ling-3', nameEn:'Soft Silk Kimono Robe', nameAr:'رداء كيمونو من الحرير الناعم', descEn:'Long, loose robe in ultra-soft faux silk, adorned with lace trim on sleeves and a wide waist belt. Elegant and comfortable.', descAr:'رداء طويل وفضفاض من الحرير الصناعي فائق النعومة، مزين بأطراف من الدانتيل.', price:240, rating:4.7, reviewsCount:134, stock:16, category:'Lingerie', image:'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop' },
  { id:'bdsm-1', nameEn:'Soft Leather Restraints Starter Kit', nameAr:'طقم القيود الجلدية الناعمة للمبتدئين', descEn:'Wrist and ankle restraints set made of faux leather lined with soft neoprene to protect the skin. Easy to adjust and completely safe.', descAr:'مجموعة قيود للمعصم والكاحل مصنوعة من الجلد الصناعي المبطن بالنيوبرين الناعم.', price:180, rating:4.4, reviewsCount:58, stock:9, category:'BDSM', image:'https://images.unsplash.com/photo-1602810318383-e55f89a3df12?q=80&w=500&auto=format&fit=crop' },
  { id:'bdsm-2', nameEn:'Luxury Silk Blindfold with Tickler Feather', nameAr:'عصابة العينين الحريرية الفاخرة مع ريشة مداعبة', descEn:'Natural silk blindfold to completely block light and heighten touch sensitivity, comes with a soft tickler feather for sensory play.', descAr:'عصابة عين من الحرير الطبيعي لحجب الضوء تماماً وزيادة الحساسية للمس.', price:85, rating:4.7, reviewsCount:112, stock:35, category:'BDSM', image:'https://images.unsplash.com/photo-1520006403993-47400cad67c5?q=80&w=500&auto=format&fit=crop' },
  { id:'bdsm-3', nameEn:'Short Leather Flogger / Crop', nameAr:'سوط المداعبة الجلدي القصير', descEn:'Classic flogger made of soft leather falls with a comfortable braided handle. Designed to deliver light, thrilling sensations.', descAr:'سوط كلاسيكي مصنوع من شرائح الجلد الناعم بمقبض مريح ومضفر.', price:130, rating:4.5, reviewsCount:47, stock:11, category:'BDSM', image:'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop' },
  { id:'hol-1', nameEn:'24 Days of Romance Advent Calendar', nameAr:'تقويم المفاجآت الرومانسية (24 يوماً)', descEn:'Luxury gift box containing 24 special surprises for couples — mini toys, aromatic oils, ties, and romantic accessories. Beautifully packaged.', descAr:'صندوق هدايا فاخر يحتوي على 24 مفاجأة مميزة للأزواج.', price:799, rating:4.9, reviewsCount:34, stock:4, category:'Holiday Collection', image:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop' },
  { id:'hol-2', nameEn:'Sexy Santa Cosplay Lingerie Set', nameAr:'طقم لانجري بابا نويل التنكري المثير', descEn:'Red velvet cosplay set with soft white faux fur trim. Includes mini dress, holiday hat, and wide black waist belt.', descAr:'طقم تنكري مخملي أحمر بأطراف فرو بيضاء ناعمة.', price:225, rating:4.5, reviewsCount:78, stock:14, category:'Holiday Collection', image:'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=500&auto=format&fit=crop' },
  { id:'hol-3', nameEn:'Luxury Massage Candle - Vanilla & Oud', nameAr:'شمعة المساج العطرية الفاخرة - برائحة الفانيليا والعود', descEn:'Candle made from shea butter and natural coconut oil. Melts into a warm, nourishing massage oil with an enchanting scent.', descAr:'شمعة مصنوعة من زبدة الشيا وزيت جوز الهند الطبيعي. تتحول إلى زيت مساج دافئ.', price:110, rating:4.8, reviewsCount:143, stock:28, category:'Holiday Collection', image:'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500&auto=format&fit=crop' },
  { id:'new-1', nameEn:'Smart Interactive Audio Massager', nameAr:'جهاز المساج الصوتي التفاعلي الذكي', descEn:'Smart vibrator that interacts with music or your partner\'s voice via Bluetooth and mobile app. App-controlled and whisper-quiet.', descAr:'أحدث صيحة في عالم الألعاب الزوجية! جهاز اهتزازي ذكي يتفاعل مع الموسيقى عبر البلوتوث.', price:620, rating:5.0, reviewsCount:12, stock:6, category:'New Arrivals', image:'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=500&auto=format&fit=crop' },
  { id:'new-2', nameEn:'Luxury Gold Lace Lingerie 2-Piece Set', nameAr:'لانجري الدانتيل الذهبي الفاخر قطعتين', descEn:'Stunning lingerie set merging soft black chiffon with shiny golden lace threads. Modern and bold design with a royal appeal.', descAr:'طقم لانجري مذهل يدمج بين الشيفون الأسود الناعم وخيوط الدانتيل الذهبية اللامعة.', price:270, rating:4.9, reviewsCount:18, stock:8, category:'New Arrivals', image:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500&auto=format&fit=crop' },
  { id:'new-3', nameEn:'Organic Essential Oils Set (Arousal & Deep Sleep)', nameAr:'طقم الزيوت العطرية العضوية (إثارة ونوم عميق)', descEn:'100% natural organic essential oils set. Includes lavender for relaxation, ylang-ylang and jasmine to enhance mood and intimacy.', descAr:'مجموعة مركزة من الزيوت العطرية العضوية الطبيعية 100%.', price:140, rating:4.7, reviewsCount:22, stock:20, category:'New Arrivals', image:'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500&auto=format&fit=crop' },
  { id:'lube-1', nameEn:'Premium Water-Based Lubricant 100ml', nameAr:'مزلق مائي فاخر 100 مل', descEn:'Body-safe water-based lubricant. Fragrance-free, compatible with all toy materials and condoms. Long-lasting formula.', descAr:'مزلق مائي آمن على البشرة بدون عطر، متوافق مع جميع أنواع الألعاب والواقيات.', price:75, rating:4.8, reviewsCount:201, stock:60, category:'Lubricants', image:'https://images.unsplash.com/photo-1556228578-8c7c2e43809f?q=80&w=500&auto=format&fit=crop' },
  { id:'lube-2', nameEn:'Silicone-Based Long-Lasting Lubricant 50ml', nameAr:'مزلق سيليكون طويل الأمد 50 مل', descEn:'Premium silicone-based lubricant for long-lasting smoothness. Ideal for extended sessions. Not compatible with silicone toys.', descAr:'مزلق سيليكون فاخر للحصول على نعومة طويلة الأمد. مثالي للجلسات الطويلة.', price:120, rating:4.6, reviewsCount:87, stock:35, category:'Lubricants', image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop' },
  { id:'pop-1', nameEn:'Rush Original Poppers 10ml', nameAr:'بوبرز راش الأصلي 10 مل', descEn:'Rush Original — the most popular poppers brand worldwide. 10ml bottle, fast-acting, premium quality. Discreet delivery in Lebanon.', descAr:'راش الأصلي — أشهر ماركة بوبرز في العالم. زجاجة 10 مل، سريع المفعول.', price:45, rating:4.7, reviewsCount:189, stock:50, category:'Poppers', image:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop' },
  { id:'ring-1', nameEn:'Vibrating Cock Ring with Remote Control', nameAr:'حلقة قضيب هزازة مع تحكم عن بعد', descEn:'Vibrating cock ring with wireless remote control. Medical silicone, stretchy, waterproof. 10 vibration modes for couples pleasure.', descAr:'حلقة قضيب هزازة مع جهاز تحكم عن بعد. سيليكون طبي ومرن ومضاد للماء.', price:185, rating:4.5, reviewsCount:76, stock:20, category:'Cock Rings', image:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop' },
  { id:'mast-1', nameEn:'Pocket Stroker Masturbator - Tight Texture', nameAr:'جهاز استمناء جيبي - ملمس ضيق', descEn:'Compact pocket masturbator with tight realistic texture. Made from ultra-soft TPE. Discreet, easy to clean, and reusable.', descAr:'جهاز استمناء جيبي بملمس ضيق وواقعي. مصنوع من TPE فائق النعومة.', price:165, rating:4.4, reviewsCount:92, stock:18, category:'Masturbators', image:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500&auto=format&fit=crop' },
  { id:'pump-1', nameEn:'Beginner Penis Pump with Gauge', nameAr:'مضخة القضيب للمبتدئين مع مقياس ضغط', descEn:'Easy-to-use penis pump for beginners with a pressure gauge for safety. Strong vacuum seal, comfortable cylinder, manual pump.', descAr:'مضخة قضيب سهلة الاستخدام للمبتدئين مع مقياس ضغط للسلامة.', price:220, rating:4.3, reviewsCount:54, stock:12, category:'Penis Pumps', image:'https://images.unsplash.com/photo-1563473213013-de1fa25b9bbd?q=80&w=500&auto=format&fit=crop' },
  { id:'butt-1', nameEn:'Tapered Silicone Butt Plug - Small', nameAr:'سدادة شرجية سيليكون مدببة - صغيرة', descEn:'Smooth tapered silicone butt plug for beginners. Medical-grade silicone, flared base for safety, easy to insert and remove.', descAr:'سدادة شرجية سيليكون ناعمة للمبتدئين. سيليكون طبي مع قاعدة آمنة.', price:85, rating:4.5, reviewsCount:110, stock:25, category:'Butt Plugs', image:'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop' },
  { id:'anal-1', nameEn:'Anal Beads with Loop - 5 Beads', nameAr:'خرزات شرجية مع حلقة - 5 خرزات', descEn:'5-bead silicone anal beads with graduated sizes and a retrieval loop. Medical silicone, smooth finish, waterproof.', descAr:'خرزات شرجية سيليكون بأحجام متدرجة وحلقة استعادة. آمنة ومضادة للماء.', price:95, rating:4.4, reviewsCount:67, stock:22, category:'Anal Toys', image:'https://images.unsplash.com/photo-1600857062141-984d9902f3cb?q=80&w=500&auto=format&fit=crop' },
  { id:'bond-1', nameEn:'Velvet Wrist Restraints - Adjustable', nameAr:'قيود معصم مخملية - قابلة للتعديل', descEn:'Soft velvet wrist restraints with adjustable buckles and D-rings. Beginner-friendly, comfortable, and secure hold.', descAr:'قيود معصم ناعمة بأبزيم قابل للتعديل وحلقات D. مريحة وآمنة للمبتدئين.', price:120, rating:4.6, reviewsCount:83, stock:30, category:'Bondage', image:'https://images.unsplash.com/photo-1602810318383-e55f89a3df12?q=80&w=500&auto=format&fit=crop' },
  { id:'kegel-1', nameEn:'Kegel Ball Set - 3 Weights', nameAr:'طقم كيغل بولز - 3 أوزان', descEn:'Set of 3 kegel balls in different weights for progressive pelvic floor training. Medical silicone, retrieval cord included.', descAr:'طقم من 3 كيغل بولز بأوزان مختلفة لتمرين عضلات قاع الحوض بشكل تدريجي.', price:140, rating:4.7, reviewsCount:129, stock:19, category:'Kegel Balls', image:'https://images.unsplash.com/photo-1556228578-8c7c2e43809f?q=80&w=500&auto=format&fit=crop' },
  { id:'enh-1', nameEn:'Delay Spray for Men - 10ml', nameAr:'بخاخ التأخير للرجال - 10 مل', descEn:'Clinically tested delay spray for men. Mild desensitizing formula for prolonged performance. Odorless and easy to apply.', descAr:'بخاخ تأخير إكلينيكي للرجال. تركيبة خفيفة لتمديد وقت الأداء. بدون رائحة.', price:65, rating:4.5, reviewsCount:245, stock:55, category:'Sexual Enhancers', image:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop' },
  { id:'doll-1', nameEn:'Premium Silicone Torso - Realistic Feel', nameAr:'جذع سيليكون فاخر - ملمس واقعي', descEn:'Premium silicone torso with ultra-realistic texture and weight. Made from body-safe platinum silicone. Discreet shipping.', descAr:'جذع سيليكون فاخر بملمس ووزن واقعي للغاية. مصنوع من سيليكون البلاتينيوم الآمن.', price:1200, rating:4.6, reviewsCount:28, stock:5, category:'Sex Dolls', image:'https://images.unsplash.com/photo-1563473213013-de1fa25b9bbd?q=80&w=500&auto=format&fit=crop' },
  { id:'strap-1', nameEn:'Adjustable Strap-On Harness with Silicone Dildo', nameAr:'حزام ستراب أون قابل للتعديل مع ديلدو سيليكون', descEn:'Adjustable strap-on harness with O-ring attachment. Compatible with most dildos. Includes a medium silicone dildo. Easy to clean.', descAr:'حزام ستراب أون قابل للتعديل مع حلقة O. يتوافق مع معظم الديلدو.', price:320, rating:4.5, reviewsCount:41, stock:10, category:'Strap Ons', image:'https://images.unsplash.com/photo-1600857062141-984d9902f3cb?q=80&w=500&auto=format&fit=crop' },
  { id:'chast-1', nameEn:'Beginner Silicone Chastity Cage', nameAr:'قفص عفة سيليكون للمبتدئين', descEn:'Lightweight silicone chastity cage for beginners. Comfortable fit, easy to put on and remove. Includes 3 ring sizes and lock.', descAr:'قفص عفة سيليكون خفيف الوزن للمبتدئين. مريح وسهل التركيب والإزالة.', price:150, rating:4.3, reviewsCount:62, stock:15, category:'Chastity', image:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop' },
  { id:'mach-1', nameEn:'Automatic Thrusting Sex Machine', nameAr:'ماكينة جنس نابضة تلقائية', descEn:'Powerful automatic thrusting sex machine with adjustable speed and depth. Compatible with most attachments. Quiet motor.', descAr:'ماكينة جنس نابضة تلقائية قوية مع سرعة وعمق قابلين للتعديل.', price:1500, rating:4.7, reviewsCount:19, stock:3, category:'Sex Machines', image:'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=500&auto=format&fit=crop' },
];

// ── Category definitions ────────────────────────────────────────────────────
const CATEGORIES = [
  { slug:'sex-toys', name:'Sex Toys', titleAr:'ألعاب زوجية في لبنان | متجر فيكسا', titleEn:'Sex Toys Lebanon | Vexa Store - Discreet Delivery Beirut', descAr:'أفضل متجر لشراء ألعاب زوجية، هزازات، ولانجري فاخر في لبنان. توصيل سري في نفس اليوم في بيروت وخلال 72 ساعة لكل لبنان. دفع عند الاستلام. تغليف سري 100%.', descEn:'Buy the best sex toys in Lebanon — vibrators, dildos, lingerie. Same-day discreet delivery in Beirut, cash on delivery.', keywords:'sex toys Lebanon, ألعاب زوجية لبنان, adult toys Beirut, متجر ألعاب جنسية بيروت, discreet delivery Lebanon', h1Ar:'ألعاب زوجية في لبنان — متجر فيكسا', h1En:'Sex Toys in Lebanon — Vexa Store', bodyAr:'<p>متجر فيكسا هو الوجهة الأولى لشراء ألعاب زوجية فاخرة في لبنان. نوفر أكبر تشكيلة من المنتجات الحميمية — هزازات، ديلدو، لانجري، أدوات BDSM، معززات جنسية.</p><ul><li>توصيل سري في نفس اليوم — بيروت</li><li>توصيل 24-72 ساعة لكل لبنان</li><li>دفع نقداً عند الاستلام</li><li>تغليف سري محكم 100%</li></ul>', bodyEn:'<p>Vexa Store is Lebanon\'s premier destination for premium adult toys. We offer the widest selection — vibrators, dildos, lingerie, BDSM gear, and sexual enhancers.</p><ul><li>Same-day discreet delivery — Beirut</li><li>24-72 hour delivery across Lebanon</li><li>Cash on delivery (COD)</li><li>100% plain sealed packaging</li></ul>', related:['vibrators','dildos','lingerie','male-toys'], priority:'0.95' },
  { slug:'vibrators', name:'Vibrators', titleAr:'هزازات فاخرة في لبنان | متجر فيكسا', titleEn:'Vibrators in Lebanon | Premium Vibrators Beirut - Vexa Store', descAr:'أفضل مجموعة هزازات فاخرة في لبنان. هزازات بظرية، نقطة G، مزدوجة، وتحكم عن بعد. توصيل سري في نفس اليوم في بيروت.', descEn:'Premium vibrators in Lebanon from top brands. Clitoral, G-spot, dual-stimulation, remote-controlled. Same-day discreet delivery in Beirut.', keywords:'vibrators Lebanon, هزازات لبنان, vibrators Beirut, هزازات بيروت, clitoral vibrator, G-spot vibrator Lebanon', h1Ar:'هزازات في لبنان — متجر فيكسا', h1En:'Vibrators in Lebanon — Vexa Store', bodyAr:'<p>اكتشف أفضل مجموعة هزازات فاخرة في لبنان من متجر فيكسا.</p><ul><li>هزازات بظرية — أقوى إحساس</li><li>هزازات نقطة G</li><li>هزازات تحكم عن بعد للأزواج</li><li>مضادة للماء وسهلة التنظيف</li></ul>', bodyEn:'<p>Discover Lebanon\'s best collection of premium vibrators at Vexa Store.</p><ul><li>Clitoral vibrators — intense pleasure</li><li>G-spot vibrators for deep stimulation</li><li>Remote-controlled couples vibrators</li><li>Waterproof and easy to clean</li></ul>', related:['sex-toys','dildos','kegel-balls','sexual-enhancers'], priority:'0.95' },
  { slug:'lingerie', name:'Lingerie', titleAr:'لانجري فاخر في لبنان | متجر فيكسا', titleEn:'Lingerie Lebanon | Sexy Lingerie Beirut - Vexa Store', descAr:'أفضل لانجري فاخر في لبنان. تشكيلة واسعة من اللانجري الرومانسي والمثير — دانتيل، ساتان، كورسيه، تيدي. توصيل سري وسريع.', descEn:'Premium lingerie in Lebanon — wide collection at great prices. Lace, satin, corsets, teddies. Fast discreet delivery in Beirut.', keywords:'lingerie Lebanon, لانجري لبنان, sexy lingerie Beirut, لانجري بيروت, lace lingerie, lingerie shop Lebanon', h1Ar:'لانجري في لبنان — متجر فيكسا', h1En:'Lingerie in Lebanon — Vexa Store', bodyAr:'<p>تسوقي أجمل لانجري فاخر في لبنان.</p><ul><li>لانجري دانتيل رومانسي فاخر</li><li>كورسيه وبوستيه مثير</li><li>أطقم لانجري كاملة للأزواج</li><li>مقاسات متعددة — S حتى XXXL</li></ul>', bodyEn:'<p>Shop the finest lingerie in Lebanon at Vexa Store.</p><ul><li>Romantic lace lingerie sets</li><li>Corsets and bustiers</li><li>Complete couples lingerie sets</li><li>Multiple sizes — S to XXXL</li></ul>', related:['sex-toys','bondage','kegel-balls','new-arrivals'], priority:'0.90' },
  { slug:'male-toys', name:'Male Toys', titleAr:'ألعاب رجالية فاخرة في لبنان | متجر فيكسا', titleEn:'Male Toys Lebanon | Men Adult Toys Beirut - Vexa Store', descAr:'أفضل ألعاب رجالية في لبنان. مستمني، مضخات تكبير، حلقات قضيب. توصيل سري وسريع في بيروت وجميع المناطق.', descEn:'Best male adult toys in Lebanon — masturbators, penis pumps, cock rings. Fast discreet delivery in Beirut. Cash on delivery.', keywords:'male toys Lebanon, ألعاب رجالية لبنان, men sex toys Beirut, masturbators Lebanon, cock rings Beirut', h1Ar:'ألعاب رجالية في لبنان — متجر فيكسا', h1En:'Male Toys in Lebanon — Vexa Store', bodyAr:'<p>تشكيلة كاملة من الألعاب الرجالية الفاخرة.</p><ul><li>مستمني سيليكون واقعية</li><li>مضخات تكبير القضيب</li><li>حلقات قضيب للاستمرارية</li></ul>', bodyEn:'<p>Complete collection of premium male adult toys in Lebanon.</p><ul><li>Realistic silicone masturbators</li><li>Penis pumps and enlargers</li><li>Cock rings for stamina</li></ul>', related:['cock-rings','masturbators','penis-pumps','sexual-enhancers'], priority:'0.85' },
  { slug:'dildos', name:'Dildos', titleAr:'ديلدو سيليكون في لبنان | متجر فيكسا', titleEn:'Dildos Lebanon | Premium Dildos Beirut - Vexa Store', descAr:'ديلدو آمن مصنوع من السيليكون الطبي في لبنان. تشكيلة واسعة بأحجام وأشكال متعددة. توصيل سري في نفس اليوم.', descEn:'Premium dildos in Lebanon. Medical-grade silicone, BPA-free. Realistic, colorful, suction-cup designs. Same-day discreet delivery Beirut.', keywords:'dildos Lebanon, ديلدو لبنان, premium dildos Beirut, silicone dildo Lebanon', h1Ar:'ديلدو في لبنان — متجر فيكسا', h1En:'Dildos in Lebanon — Vexa Store', bodyAr:'<p>اشترِ أفضل ديلدو سيليكون طبي في لبنان.</p><ul><li>سيليكون طبي خالٍ من BPA</li><li>أحجام متعددة للجميع</li><li>بساق شفط للاستخدام بدون يدين</li><li>مضاد للماء وسهل التنظيف</li></ul>', bodyEn:'<p>Buy the best silicone dildos in Lebanon.</p><ul><li>BPA-free medical-grade silicone</li><li>Multiple sizes for all experience levels</li><li>Suction-cup base for hands-free use</li><li>Waterproof and easy to clean</li></ul>', related:['vibrators','sex-toys','butt-plugs','anal-toys'], priority:'0.85' },
  { slug:'bdsm', name:'BDSM', titleAr:'منتجات BDSM في لبنان | متجر فيكسا', titleEn:'BDSM Toys Lebanon | Bondage Gear Beirut - Vexa Store', descAr:'أدوات وألعاب BDSM في لبنان. قيود مخملية، عصابات عين، سياط ناعمة. توصيل سري في بيروت. دفع عند الاستلام.', descEn:'BDSM toys and bondage gear in Lebanon — restraints, blindfolds, paddles. Discreet delivery in Beirut.', keywords:'BDSM Lebanon, bondage Lebanon, BDSM Beirut, restraints Lebanon', h1Ar:'BDSM في لبنان — متجر فيكسا', h1En:'BDSM in Lebanon — Vexa Store', bodyAr:'<p>اكتشف عالم BDSM الآمن مع متجر فيكسا.</p>', bodyEn:'<p>Explore the world of BDSM safely with Vexa Store Lebanon.</p>', related:['bondage','sex-toys','lingerie','strap-ons'], priority:'0.80' },
  { slug:'holiday-collection', name:'Holiday Collection', titleAr:'كوليكشن العطلات | متجر فيكسا لبنان', titleEn:'Holiday Collection Lebanon | Romantic Gift Sets - Vexa Store', descAr:'تشكيلة العطلات الخاصة من متجر فيكسا — هدايا رومانسية فاخرة مثالية للمناسبات والأعياد في لبنان.', descEn:'Special holiday collection from Vexa Store — premium romantic gift sets in Lebanon. Discreet delivery.', keywords:'holiday gift sets Lebanon, romantic gifts Beirut, adult gift sets Lebanon, هدايا رومانسية لبنان', h1Ar:'كوليكشن العطلات — متجر فيكسا لبنان', h1En:'Holiday Collection Lebanon — Vexa Store', bodyAr:'<p>تشكيلة العطلات الخاصة من متجر فيكسا — هدايا رومانسية فاخرة.</p>', bodyEn:'<p>Vexa Store\'s exclusive holiday collection features premium romantic gift sets.</p>', related:['lingerie','sex-toys','new-arrivals','vibrators'], priority:'0.75' },
  { slug:'new-arrivals', name:'New Arrivals', titleAr:'وصل حديثاً | متجر فيكسا لبنان', titleEn:'New Arrivals Lebanon | Latest Adult Toys Beirut - Vexa Store', descAr:'آخر المنتجات الجديدة في متجر فيكسا — ألعاب زوجية، هزازات، لانجري. نُضيف منتجات جديدة أسبوعياً.', descEn:'Latest new products at Vexa Store Lebanon — sex toys, vibrators, lingerie. We add new products weekly. Discreet delivery.', keywords:'new arrivals adult toys Lebanon, latest sex toys Beirut, وصل حديثاً لبنان, new vibrators Lebanon', h1Ar:'وصل حديثاً — متجر فيكسا لبنان', h1En:'New Arrivals at Vexa Store Lebanon', bodyAr:'<p>اكتشف أحدث الوافدات إلى متجر فيكسا في لبنان. نُضيف منتجات جديدة أسبوعياً.</p>', bodyEn:'<p>Discover the latest additions to Vexa Store Lebanon. We add new products weekly.</p>', related:['sex-toys','vibrators','lingerie','dildos'], priority:'0.90' },
  { slug:'butt-plugs', name:'Butt Plugs', titleAr:'باط بلاغ سيليكون في لبنان | متجر فيكسا', titleEn:'Butt Plugs Lebanon | Anal Plugs Beirut - Vexa Store', descAr:'أفضل باط بلاغ سيليكون وستانلس ستيل في لبنان. أحجام متعددة للمبتدئين والمحترفين. توصيل سري في بيروت.', descEn:'Best butt plugs in Lebanon — silicone and stainless steel, multiple sizes for beginners and advanced. Discreet delivery in Beirut.', keywords:'butt plugs Lebanon, anal plugs Beirut, سدادة شرجية لبنان, silicone butt plug Lebanon', h1Ar:'باط بلاغ في لبنان — متجر فيكسا', h1En:'Butt Plugs in Lebanon — Vexa Store', bodyAr:'<p>تشكيلة متنوعة من الباط بلاغ الآمن — سيليكون طبي أو ستانلس ستيل.</p>', bodyEn:'<p>Safe butt plugs in Lebanon — medical silicone or stainless steel in multiple sizes.</p>', related:['anal-toys','sex-toys','bondage','dildos'], priority:'0.70' },
  { slug:'anal-toys', name:'Anal Toys', titleAr:'ألعاب شرجية آمنة في لبنان | متجر فيكسا', titleEn:'Anal Toys Lebanon | Anal Beads & Prostate Massagers Beirut', descAr:'أفضل ألعاب شرجية آمنة في لبنان — باط بلاغ، مدلكات بروستات، خرزات شرجية. توصيل سري في بيروت.', descEn:'Best safe anal toys in Lebanon — anal beads, prostate massagers, butt plugs. Made from body-safe medical materials.', keywords:'anal toys Lebanon, ألعاب شرجية لبنان, anal beads Beirut, prostate massager Lebanon', h1Ar:'ألعاب شرجية في لبنان — متجر فيكسا', h1En:'Anal Toys in Lebanon — Vexa Store', bodyAr:'<p>تشكيلة آمنة ومتنوعة من الألعاب الشرجية من مواد طبية آمنة.</p>', bodyEn:'<p>Safe anal toy collection in Lebanon from 100% body-safe medical materials.</p>', related:['butt-plugs','male-toys','sex-toys','bondage'], priority:'0.70' },
  { slug:'bondage', name:'Bondage', titleAr:'أدوات بونداج في لبنان | متجر فيكسا', titleEn:'Bondage Gear Lebanon | Restraints & Rope Beirut - Vexa Store', descAr:'أدوات وألعاب بونداج في لبنان — قيود مخملية، حبال ناعمة، أصفاد جلدية. توصيل سري في بيروت.', descEn:'Bondage gear in Lebanon — restraints, rope, handcuffs. Discreet delivery in Beirut.', keywords:'bondage Lebanon, restraints Lebanon, bondage gear Beirut, BDSM bondage Lebanon', h1Ar:'بونداج في لبنان — متجر فيكسا', h1En:'Bondage in Lebanon — Vexa Store', bodyAr:'<p>أدوات البونداج الآمنة — قيود مخملية، حبال ناعمة، أصفاد جلدية.</p>', bodyEn:'<p>Safe bondage gear in Lebanon — velvet restraints, soft rope, leather cuffs.</p>', related:['bdsm','sex-toys','lingerie','strap-ons'], priority:'0.70' },
  { slug:'sex-dolls', name:'Sex Dolls', titleAr:'دمى حميمة في لبنان | متجر فيكسا', titleEn:'Sex Dolls Lebanon | Realistic Love Dolls Beirut - Vexa Store', descAr:'أفضل دمى حميمة في لبنان. دمى واقعية بأجسام مصنوعة من مواد عالية الجودة. توصيل سري وسريع.', descEn:'Best sex dolls in Lebanon — realistic design, premium materials. Fast discreet delivery in Beirut.', keywords:'sex dolls Lebanon, love dolls Beirut, دمى جنسية لبنان, realistic sex doll Lebanon', h1Ar:'دمى حميمة في لبنان — متجر فيكسا', h1En:'Sex Dolls in Lebanon — Vexa Store', bodyAr:'<p>دمى حميمة واقعية بأجسام مصنوعة من مواد عالية الجودة.</p>', bodyEn:'<p>Realistic intimate dolls made from high-quality materials.</p>', related:['male-toys','masturbators','sex-toys','anal-toys'], priority:'0.70' },
  { slug:'strap-ons', name:'Strap Ons', titleAr:'ستراب أون في لبنان | متجر فيكسا', titleEn:'Strap-ons Lebanon | Harness & Dildo Sets Beirut - Vexa Store', descAr:'أفضل ستراب أون في لبنان. أحزمة قابلة للتعديل وديلدو سيليكون آمن. توصيل سري في بيروت.', descEn:'Best strap-ons in Lebanon — adjustable harnesses and silicone dildos. Discreet delivery in Beirut.', keywords:'strap-ons Lebanon, strap-on harness Beirut, أحزمة لبنان', h1Ar:'ستراب أون في لبنان — متجر فيكسا', h1En:'Strap-ons in Lebanon — Vexa Store', bodyAr:'<p>ستراب أون فاخر للأزواج — أحزمة قابلة للتعديل وديلدو سيليكون آمن.</p>', bodyEn:'<p>Premium strap-ons for couples in Lebanon. Adjustable harnesses with safe silicone dildos.</p>', related:['bdsm','dildos','bondage','sex-toys'], priority:'0.70' },
  { slug:'kegel-balls', name:'Kegel Balls', titleAr:'كيغل بولز في لبنان | متجر فيكسا', titleEn:'Kegel Balls Lebanon | Pelvic Floor Exercises Beirut - Vexa Store', descAr:'كيغل بولز لتقوية عضلات قاع الحوض في لبنان. سيليكون طبي آمن. توصيل سري في بيروت.', descEn:'Kegel balls for pelvic floor strengthening in Lebanon — medical silicone. Discreet delivery Beirut.', keywords:'kegel balls Lebanon, كيغل لبنان, pelvic floor Lebanon, Ben Wa balls Lebanon', h1Ar:'كيغل بولز في لبنان — متجر فيكسا', h1En:'Kegel Balls in Lebanon — Vexa Store', bodyAr:'<p>كيغل بولز لتقوية عضلات قاع الحوض من السيليكون الطبي الآمن.</p>', bodyEn:'<p>Kegel balls for pelvic floor strengthening. Made from safe medical silicone.</p>', related:['vibrators','sex-toys','lingerie','sexual-enhancers'], priority:'0.65' },
  { slug:'sexual-enhancers', name:'Sexual Enhancers', titleAr:'معززات جنسية في لبنان | متجر فيكسا', titleEn:'Sexual Enhancers Lebanon | Delay & Performance Beirut - Vexa Store', descAr:'أفضل معززات جنسية ومؤخرات في لبنان. بخاخات تأخير، كريمات تقوية، مكملات أداء. توصيل سري.', descEn:'Best sexual enhancers and delay products in Lebanon — delay sprays, strengthening creams, performance supplements.', keywords:'sexual enhancers Lebanon, delay spray Lebanon, معززات جنسية لبنان, performance enhancers Beirut', h1Ar:'معززات جنسية في لبنان — متجر فيكسا', h1En:'Sexual Enhancers in Lebanon — Vexa Store', bodyAr:'<p>معززات ومؤخرات جنسية — كريمات تقوية، مؤخرات، مكملات أداء.</p>', bodyEn:'<p>Premium sexual enhancers and delay products — strengthening creams, delay sprays, performance supplements.</p>', related:['male-toys','vibrators','cock-rings','lubricants'], priority:'0.65' },
  { slug:'penis-pumps', name:'Penis Pumps', titleAr:'مضخات القضيب في لبنان | متجر فيكسا', titleEn:'Penis Pumps Lebanon | Male Enhancement Beirut - Vexa Store', descAr:'أفضل مضخات القضيب في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.', descEn:'Best penis pumps and sleeves in Lebanon. Discreet delivery Beirut. Cash on delivery.', keywords:'penis pump Lebanon, مضخة قضيب لبنان, male enhancement Lebanon', h1Ar:'مضخات القضيب في لبنان — متجر فيكسا', h1En:'Penis Pumps in Lebanon — Vexa Store', bodyAr:'<p>مضخات وأكمام القضيب الفاخرة لتحسين الأداء والثقة الذاتية.</p>', bodyEn:'<p>Premium penis pumps and sleeves in Lebanon for improved performance and confidence.</p>', related:['male-toys','cock-rings','sexual-enhancers','masturbators'], priority:'0.65' },
  { slug:'cock-rings', name:'Cock Rings', titleAr:'حلقات القضيب في لبنان | متجر فيكسا', titleEn:'Cock Rings Lebanon | Vibrating Cock Rings Beirut - Vexa Store', descAr:'حلقات قضيب سيليكون طبي في لبنان — هزازة وغير هزازة. توصيل سري في بيروت وكل لبنان.', descEn:'Medical silicone cock rings in Lebanon — vibrating and non-vibrating. Discreet delivery Beirut.', keywords:'cock rings Lebanon, حلقات قضيب لبنان, vibrating cock ring Beirut', h1Ar:'حلقات القضيب في لبنان — متجر فيكسا', h1En:'Cock Rings in Lebanon — Vexa Store', bodyAr:'<p>حلقات قضيب سيليكون طبي — هزازة وغير هزازة لتجربة أطول وأكثر كثافة.</p>', bodyEn:'<p>Medical silicone cock rings — vibrating and non-vibrating for longer, more intense experiences.</p>', related:['male-toys','penis-pumps','sexual-enhancers','masturbators'], priority:'0.65' },
  { slug:'masturbators', name:'Masturbators', titleAr:'أدوات الاستمناء في لبنان | متجر فيكسا', titleEn:'Masturbators Lebanon | Male Masturbators Beirut - Vexa Store', descAr:'أدوات استمناء رجالية فاخرة في لبنان بملمس واقعي وأشكال متعددة. توصيل سري في بيروت.', descEn:'Premium male masturbators in Lebanon — realistic textures, discreet delivery Beirut.', keywords:'masturbators Lebanon, أدوات استمناء لبنان, male masturbator Beirut', h1Ar:'أدوات الاستمناء في لبنان — متجر فيكسا', h1En:'Masturbators in Lebanon — Vexa Store', bodyAr:'<p>أدوات استمناء رجالية فاخرة بملمس واقعي وأشكال متعددة للمتعة القصوى.</p>', bodyEn:'<p>Premium male masturbators in Lebanon with realistic textures and multiple designs.</p>', related:['male-toys','sex-dolls','cock-rings','sexual-enhancers'], priority:'0.65' },
  { slug:'chastity', name:'Chastity', titleAr:'أدوات العفة في لبنان | متجر فيكسا', titleEn:'Chastity Devices Lebanon | Chastity Cages Beirut - Vexa Store', descAr:'أدوات العفة وأقفاص العفة للتحكم والمتعة بأحجام ومواد متنوعة. توصيل سري في بيروت.', descEn:'Chastity devices and cages in Lebanon. Discreet delivery Beirut. Cash on delivery.', keywords:'chastity Lebanon, chastity cage Beirut, أدوات العفة لبنان', h1Ar:'أدوات العفة في لبنان — متجر فيكسا', h1En:'Chastity Devices in Lebanon — Vexa Store', bodyAr:'<p>أدوات العفة وأقفاص العفة للتحكم والمتعة بأحجام ومواد متنوعة.</p>', bodyEn:'<p>Chastity devices and cages in Lebanon for control and pleasure play.</p>', related:['bdsm','bondage','male-toys','cock-rings'], priority:'0.60' },
  { slug:'sex-machines', name:'Sex Machines', titleAr:'ماكينات الجنس في لبنان | متجر فيكسا', titleEn:'Sex Machines Lebanon | Fucking Machines Beirut - Vexa Store', descAr:'ماكينات الجنس الفاخرة القوية في لبنان. توصيل سري في بيروت وجميع المناطق.', descEn:'Premium sex machines in Lebanon — powerful and versatile. Discreet delivery Beirut.', keywords:'sex machines Lebanon, ماكينات جنس لبنان, fucking machine Beirut', h1Ar:'ماكينات الجنس في لبنان — متجر فيكسا', h1En:'Sex Machines in Lebanon — Vexa Store', bodyAr:'<p>ماكينات جنس فاخرة وقوية لتجربة فريدة مع توصيل سري في لبنان.</p>', bodyEn:'<p>Premium and powerful sex machines in Lebanon for a unique experience.</p>', related:['sex-toys','vibrators','dildos','strap-ons'], priority:'0.65' },
  { slug:'lubricants', name:'Lubricants', titleAr:'مواد التشحيم في لبنان | متجر فيكسا', titleEn:'Lubricants Lebanon | Personal Lube Beirut - Vexa Store', descAr:'مواد تشحيم مائية آمنة على البشرة في لبنان. بدون عطر، آمنة طبياً 100%. توصيل سري في بيروت.', descEn:'Body-safe water-based lubricants in Lebanon. Fragrance-free, 100% medically safe. Discreet delivery Beirut.', keywords:'lubricants Lebanon, personal lube Beirut, مواد تشحيم لبنان, water-based lube Lebanon', h1Ar:'مواد التشحيم في لبنان — متجر فيكسا', h1En:'Lubricants in Lebanon — Vexa Store', bodyAr:'<p>مواد تشحيم مائية آمنة على البشرة بدون عطر، آمنة طبياً 100%.</p>', bodyEn:'<p>Body-safe water-based lubricants in Lebanon. Compatible with all toy types, fragrance-free.</p>', related:['sex-toys','anal-toys','dildos','sexual-enhancers'], priority:'0.65' },
  { slug:'poppers', name:'Poppers', titleAr:'بوبرز في لبنان | متجر فيكسا', titleEn:'Poppers Lebanon | Buy Poppers Beirut - Vexa Store', descAr:'بوبرز من أفضل الماركات العالمية متوفر الآن في لبنان عبر متجر فيكسا. توصيل سري في بيروت.', descEn:'Top-brand poppers now available in Lebanon through Vexa Store. Fast discreet delivery in Beirut.', keywords:'poppers Lebanon, بوبرز لبنان, poppers Beirut, buy poppers Lebanon', h1Ar:'بوبرز في لبنان — متجر فيكسا', h1En:'Poppers in Lebanon — Vexa Store', bodyAr:'<p>بوبرز من أفضل الماركات العالمية متوفر الآن في لبنان عبر متجر فيكسا.</p>', bodyEn:'<p>Top-brand poppers now available in Lebanon through Vexa Store.</p>', related:['sexual-enhancers','bdsm','sex-toys','male-toys'], priority:'0.60' },
];

const SLUG_TO_NAME_AR = { 'sex-toys':'ألعاب زوجية','vibrators':'هزازات','dildos':'ديلدو','lingerie':'لانجري','male-toys':'ألعاب رجالية','bdsm':'BDSM','butt-plugs':'سدادة شرجية','anal-toys':'ألعاب الشرج','bondage':'بونداج','sex-dolls':'دمى حميمة','strap-ons':'ستراب أون','kegel-balls':'كيغل بولز','sexual-enhancers':'معززات جنسية','penis-pumps':'مضخات القضيب','cock-rings':'حلقات القضيب','masturbators':'مستمني','chastity':'أدوات العفة','sex-machines':'ماكينات الجنس','lubricants':'مواد التشحيم','poppers':'بوبرز','new-arrivals':'وصل حديثاً','holiday-collection':'كوليكشن العطلات' };

function toSlug(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/, '').slice(0, 60) || 'product';
}

function buildItemList(products) {
  return products.slice(0, 15).map((p, i) => {
    const price = parseFloat(p.price) || 0;
    const slug = toSlug(p.nameEn || p.nameAr || '');
    const prod = {
      '@type': 'Product',
      name: p.nameEn,
      alternateName: p.nameAr,
      description: p.descEn || p.descAr,
      image: p.image ? [p.image] : [],
      sku: p.id,
      brand: { '@type': 'Brand', name: 'Vexa Store Lebanon' },
      offers: {
        '@type': 'Offer',
        price: price.toFixed(2),
        priceCurrency: 'USD',
        availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `https://vexatoys.com/product/${slug}`,
        seller: { '@type': 'Organization', name: 'Vexa Store Lebanon', url: 'https://vexatoys.com' },
        priceValidUntil: PRICE_VALID_UNTIL,
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
          deliveryTime: { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 2, unitCode: 'DAY' } }
        }
      },
    };
    if (p.rating && p.reviewsCount) {
      prod.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: parseFloat(p.rating).toFixed(1),
        reviewCount: Math.max(1, parseInt(p.reviewsCount) || 5),
        bestRating: 5, worstRating: 1,
      };
    }
    return { '@type': 'ListItem', position: i + 1, item: prod };
  });
}

function generateCategoryHTML(cat) {
  const catName = cat.name.toLowerCase();
  const catProds = FALLBACK_PRODUCTS.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    return pCat === catName || pCat === cat.slug || pCat.replace(/\s+/g, '-') === cat.slug;
  });

  const itemListElements = buildItemList(catProds);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cat.titleEn,
    alternateName: cat.titleAr,
    description: cat.descEn,
    url: `https://vexatoys.com/${cat.slug}`,
    inLanguage: ['ar', 'en'],
    dateModified: TODAY,
    publisher: {
      '@type': 'Organization',
      name: 'Vexa Store Lebanon',
      url: 'https://vexatoys.com',
      logo: { '@type': 'ImageObject', url: 'https://vexatoys.com/vexa-logo.jpg' },
      contactPoint: { '@type': 'ContactPoint', telephone: '+96176730767', contactType: 'customer service', areaServed: 'LB', availableLanguage: ['Arabic', 'English'] }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Vexa Store Lebanon', item: 'https://vexatoys.com/' },
        { '@type': 'ListItem', position: 2, name: cat.name, item: `https://vexatoys.com/${cat.slug}` },
      ]
    },
    isPartOf: { '@type': 'WebSite', name: 'Vexa Store Lebanon', url: 'https://vexatoys.com' },
  };
  if (itemListElements.length > 0) {
    schema.mainEntity = { '@type': 'ItemList', numberOfItems: itemListElements.length, itemListElement: itemListElements };
  }

  const relatedLinks = cat.related.map(s => `<a href="https://vexatoys.com/${s}" style="color:#818cf8;text-decoration:none;margin-left:8px">${SLUG_TO_NAME_AR[s] || s}</a>`).join(' | ');

  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${cat.titleAr} | ${cat.titleEn}</title>
    <meta name="description" content="${cat.descAr} ${cat.descEn}" />
    <meta name="keywords" content="${cat.keywords}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="rating" content="adult" />
    <meta name="geo.region" content="LB" />
    <meta name="geo.placename" content="Beirut, Lebanon" />
    <meta name="theme-color" content="#050101" />
    <meta name="author" content="Vexa Store Lebanon" />
    <meta property="og:title" content="${cat.titleAr}" />
    <meta property="og:description" content="${cat.descAr}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://vexatoys.com/${cat.slug}" />
    <meta property="og:image" content="https://vexatoys.com/opengraph.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="ar_LB" />
    <meta property="og:locale:alternate" content="en_LB" />
    <meta property="og:site_name" content="Vexa Store Lebanon" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${cat.titleAr}" />
    <meta name="twitter:description" content="${cat.descAr}" />
    <meta name="twitter:image" content="https://vexatoys.com/opengraph.jpg" />
    <link rel="canonical" href="https://vexatoys.com/${cat.slug}" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preconnect" href="https://firestore.googleapis.com" />
    <link rel="preconnect" href="https://firebase.googleapis.com" />
    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
    <style>
      body { margin: 0; background: #050101; color: #e7e5e4; font-family: sans-serif; }
      #root { min-height: 100vh; }
      #seo-content { padding: 24px; max-width: 900px; margin: 0 auto; direction: rtl; }
      #seo-content h1 { color: #a78bfa; font-size: 1.5rem; margin-bottom: 12px; }
      #seo-content h2 { color: #c4b5fd; font-size: 1.1rem; margin-top: 24px; }
      #seo-content p, #seo-content li { color: #a8a29e; line-height: 1.7; }
      #seo-content a { color: #818cf8; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      <div id="seo-content">
        <h1>${cat.h1Ar}</h1>
        ${cat.bodyAr}
        <h2>${cat.h1En}</h2>
        ${cat.bodyEn}
        <p style="margin-top:16px">ذات صلة: ${relatedLinks}</p>
        <p><a href="https://vexatoys.com" style="color:#818cf8">← العودة إلى متجر فيكسا</a></p>
      </div>
    </noscript>
    <script>window.__INITIAL_CATEGORY__="${cat.name}";</script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
console.log('🚀 Generating static category pages with Product schema...\n');
let count = 0;
for (const cat of CATEGORIES) {
  const html = generateCategoryHTML(cat);
  const outPath = path.join(publicDir, `${cat.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  const catProds = FALLBACK_PRODUCTS.filter(p => p.category.toLowerCase() === cat.name.toLowerCase() || p.category.toLowerCase().replace(/\s+/g,'-') === cat.slug);
  console.log(`✓ public/${cat.slug}.html (${catProds.length} products in schema)`);
  count++;
}
console.log(`\n✅ Generated ${count} category pages in public/`);
