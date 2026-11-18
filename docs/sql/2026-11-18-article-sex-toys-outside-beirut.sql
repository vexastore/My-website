-- Vexa Toys: new blog article, "Sex Toys Delivery Outside Beirut"
--
-- Why this topic: the blog already has seven articles on "sex toys in Lebanon"
-- and "where to buy" (sex-toys-in-lebanon-guide, sex-toys-lebanon-guide,
-- buy-sex-toys-lebanon-guide, where-to-buy-sex-toys-lebanon-trusted-store,
-- how-to-buy-sex-toys-online-lebanon, sex-toys-in-lebanon-faq,
-- sex-shop-beirut-vs-online). An eighth would compete with them and with the
-- home page. This one targets the city and region queries nobody covers
-- (Tripoli, Saida, Jounieh, Jbeil, Zahle, Tyre, Nabatieh, Baalbek) and links
-- the exact phrase "sex toys in Lebanon" to the home page.
--
-- Facts come from src/content/policies/delivery.ts, the returns policy and the
-- site FAQ: delivery across Lebanon 24/7, same-day in Beirut when in stock and
-- confirmed inside the window, 24 to 72 hours elsewhere, fee stated before
-- confirmation, cash on delivery in USD or LBP, plain sealed box, 7-day return
-- of unopened items, WhatsApp +961 76 730 767. No fee amounts, no stock counts.
--
-- Markdown matches lib/blogContent.ts and src/components/blog/ArticleBody.tsx:
-- "## " headings, "- " lists, [text](href) links, one table. The page strips a
-- leading "# Title" line, so none is included. Published under category Advice,
-- so the URL is /blog/advice/<slug> and /ar/blog/advice/<slug>.
--
-- Guarded: inserts nothing if the slug already exists. Safe to rerun.

BEGIN;

INSERT INTO public.articles (
  id, legacy_id, slug, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar,
  category_en, category_ar, read_time_minutes, read_time_seconds, status,
  seo_title_en, seo_title_ar, seo_description_en, seo_description_ar,
  published_at, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  'blog:sex-toys-delivery-outside-beirut',
  'sex-toys-delivery-outside-beirut',
  'Sex Toys Delivery Outside Beirut: Tripoli, Saida, Jounieh, Zahle and the Rest of Lebanon',
  'توصيل الألعاب الجنسية خارج بيروت: طرابلس وصيدا وجونيه وزحلة وباقي لبنان',
  'Living in Tripoli, Saida, Jounieh, Jbeil, Zahle or Tyre? How a sex toy order reaches you: delivery times by region, what the courier sees, cash on delivery and the details that avoid delays.',
  'تسكن في طرابلس أو صيدا أو جونيه أو جبيل أو زحلة أو صور؟ كيف يصلك طلب الألعاب الجنسية: مدة التوصيل حسب المنطقة، ما يراه الموزّع، الدفع عند الاستلام، والتفاصيل التي تمنع التأخير.',
  $en$Most guides about sex toys in Lebanon are written as if everyone lives in Beirut. If you are in Tripoli, Saida, Jounieh, Jbeil, Zahle or Tyre, the questions are different: will a courier actually reach my town, how long does it take, what does the parcel look like when a neighbour sees it, and do I have to pay by card. This article answers those questions for every region Vexa Toys delivers to, which is all of them.

Vexa Toys is an online store for [sex toys in Lebanon](/) with no shop to visit. Every order, wherever it goes, is packed the same way and paid for the same way. The only thing that changes outside Beirut is the time it takes to arrive.

## Which regions we deliver to

Delivery covers the whole country, every day of the week including weekends and holidays, subject to courier availability on your route. In practice that means:

- **North Lebanon**: Tripoli, El Mina, Zgharta, Koura, Batroun and the villages around them.
- **Mount Lebanon**: Jounieh, Jbeil (Byblos), Zouk, Antelias, Metn, Baabda, Aley and the Chouf.
- **South Lebanon**: Saida (Sidon), Tyre (Sour), Nabatieh and the coast between them.
- **Beqaa**: Zahle, Chtaura, Baalbek and the towns along the valley road.
- **Beirut and its close suburbs**: Hamra, Achrafieh, Dekwaneh, Hazmieh, Jnah and the rest of the city.

If your village is not on a main courier route, the order still goes out. It may take the longer end of the window below, and the confirmation message will tell you so before you commit.

## How long it takes, by area

| Area | Typical window after confirmation |
| --- | --- |
| Beirut and close suburbs | Same day, when the product is in stock and the order is confirmed inside the same-day window |
| Jounieh, Jbeil, Metn, Baabda, Aley | 24 to 72 hours, usually at the start of that range |
| Tripoli and the North | 24 to 72 hours |
| Saida, Tyre, Nabatieh | 24 to 72 hours |
| Zahle, Chtaura, Baalbek | 24 to 72 hours |

Two things decide where in that window your parcel lands: whether the product is in stock at the moment you order, and how quickly you reply to the confirmation message. An order confirmed in the morning usually leaves with that day's courier run.

## What the courier sees

The box is plain, sealed and unbranded. There is no logo, no store name, no product name and no description of the contents on the outside. The label carries your name, your phone number and the delivery address, nothing else. The courier knows they are carrying a parcel; they do not know what is in it, and they are not told.

Inside, the product sits in its own packaging with the invoice. Nothing on the outside of the box reveals what you bought, whether it is a [vibrator](/vibrators), a [dildo](/dildos), [lingerie](/lingerie) or a [male toy](/male-toys). This matters more in a small town than in Beirut, and it is the reason the packaging is the same for every order rather than a special request you have to make.

## Paying outside Beirut

Payment is cash on delivery, in US dollars or Lebanese pounds, everywhere in Lebanon. You do not enter card details online, and you pay only when the parcel is in your hands. The delivery fee depends on your location and is told to you before the order is confirmed, so the amount the courier asks for is the amount you agreed to.

If you want to check the product before paying, the box can be opened in front of the courier. Products are sealed inside, so you can see what arrived without breaking the hygiene seal.

## The confirmation message

After you order, you get a WhatsApp message on the number you entered. This is the moment to fix anything: the address, a landmark, the best time to deliver. Many Lebanese addresses outside Beirut have no street number, so a landmark saves a day: "the building next to the pharmacy facing the church", "second floor, blue door" or a shared live location all work. If you would rather receive the parcel somewhere other than home, give that address instead.

Keep the phone reachable on the delivery day. A courier who cannot call you will try again on the next run, which is the most common reason an order slips from 24 hours to 72.

## If something is wrong

Unopened items in their sealed packaging can be returned within 7 days of delivery. Faulty products are covered by the [warranty](/warranty). Both start with a WhatsApp message to +961 76 730 767, and both apply the same way in Tripoli or Tyre as they do in Beirut. The [returns policy](/returns) has the full conditions.

## Tips for a smooth delivery outside Beirut

- Check the stock status on the product page before ordering; in-stock items ship first.
- Reply to the confirmation message quickly, with a landmark if your street has no number.
- Choose a delivery address where you can answer the door and the phone.
- Order a water-based [lubricant](/lubricants) with a silicone toy in the same parcel, so you do not wait twice.
- Save the WhatsApp number, so the courier's call is a number you recognise.

## Where to start

If you have not chosen a product yet, the [beginner's guide](/blog/guides/best-sex-toys-for-beginners-lebanon) narrows the choice to a few safe first options, and the [three-question quiz](/quiz) does the same in half a minute. The [delivery policy](/delivery) has the formal conditions, and the full range of sex toys for Lebanon is on the [home page](/), ready to order from any town in the country.$en$,
  $ar$معظم ما كُتب عن الألعاب الجنسية في لبنان يفترض أن القارئ يسكن في بيروت. أما إذا كنت في طرابلس أو صيدا أو جونيه أو جبيل أو زحلة أو صور، فأسئلتك مختلفة: هل يصل الموزّع فعلاً إلى بلدتي، كم يستغرق الطلب، كيف يبدو الصندوق إذا رآه أحد الجيران، وهل يجب أن أدفع بالبطاقة. تجيب هذه المقالة عن تلك الأسئلة لكل منطقة يوصل إليها متجر فيكسا، أي كل لبنان.

فيكسا تويز متجر إلكتروني لبيع [الألعاب الجنسية في لبنان](/ar) من دون محل يمكن زيارته. كل طلب، أينما ذهب، يُغلَّف بالطريقة نفسها ويُدفع بالطريقة نفسها. الشيء الوحيد الذي يتغير خارج بيروت هو مدة الوصول.

## المناطق التي نوصل إليها

يشمل التوصيل كل لبنان، كل أيام الأسبوع بما فيها عطلة نهاية الأسبوع والأعياد، بحسب توفر شركة التوصيل على خطك. عملياً:

- **الشمال**: طرابلس والميناء وزغرتا والكورة والبترون والقرى المحيطة.
- **جبل لبنان**: جونيه وجبيل وذوق مصبح وأنطلياس والمتن وبعبدا وعاليه والشوف.
- **الجنوب**: صيدا وصور والنبطية والساحل بينها.
- **البقاع**: زحلة وشتورا وبعلبك وبلدات طريق الوادي.
- **بيروت وضواحيها القريبة**: الحمرا والأشرفية والدكوانة والحازمية والجناح وباقي المدينة.

إذا لم تكن قريتك على خط توصيل رئيسي، يخرج الطلب مع ذلك. قد يحتاج إلى الطرف الأبعد من المدة المذكورة أدناه، ورسالة التأكيد ستخبرك بذلك قبل أن تلتزم.

## المدة حسب المنطقة

| المنطقة | المدة المعتادة بعد التأكيد |
| --- | --- |
| بيروت وضواحيها القريبة | في اليوم نفسه، عندما يكون المنتج متوفراً ويُؤكَّد الطلب ضمن فترة التوصيل اليومي |
| جونيه وجبيل والمتن وبعبدا وعاليه | من 24 إلى 72 ساعة، وغالباً في بداية هذه المدة |
| طرابلس والشمال | من 24 إلى 72 ساعة |
| صيدا وصور والنبطية | من 24 إلى 72 ساعة |
| زحلة وشتورا وبعلبك | من 24 إلى 72 ساعة |

أمران يحددان موقع طلبك ضمن هذه المدة: هل المنتج متوفر لحظة الطلب، وكم تسرع في الرد على رسالة التأكيد. الطلب الذي يُؤكَّد صباحاً يخرج عادة مع جولة التوصيل في اليوم نفسه.

## ما الذي يراه الموزّع

الصندوق عادي ومغلق ومن دون أي علامة تجارية. لا شعار ولا اسم متجر ولا اسم منتج ولا وصف للمحتوى على الخارج. تحمل البطاقة اسمك ورقم هاتفك وعنوان التوصيل فقط. الموزّع يعرف أنه يحمل طرداً، ولا يعرف ما بداخله ولا يُخبَر به.

في الداخل، يوضع المنتج في تغليفه الخاص مع الفاتورة. لا شيء على الصندوق الخارجي يكشف ما اشتريته، سواء كان [هزازاً](/ar/vibrators) أو [ديلدو](/ar/dildos) أو [لانجري](/ar/lingerie) أو [لعبة رجالية](/ar/male-toys). هذا يهم في بلدة صغيرة أكثر مما يهم في بيروت، وهو السبب في أن التغليف واحد لكل الطلبات وليس خدمة خاصة تطلبها.

## الدفع خارج بيروت

الدفع عند الاستلام، بالدولار أو بالليرة اللبنانية، في كل لبنان. لا تُدخل بيانات بطاقة على الإنترنت، ولا تدفع إلا عندما يكون الطرد في يدك. رسوم التوصيل تعتمد على موقعك وتُبلَّغ بها قبل تأكيد الطلب، فالمبلغ الذي يطلبه الموزّع هو المبلغ الذي وافقت عليه.

إذا أردت التحقق من المنتج قبل الدفع، يمكن فتح الصندوق أمام الموزّع. المنتجات مغلقة في الداخل، فترى ما وصل من دون كسر ختم النظافة.

## رسالة التأكيد

بعد الطلب تصلك رسالة واتساب على الرقم الذي أدخلته. هذه لحظة تصحيح أي شيء: العنوان، معلم قريب، الوقت الأنسب للتوصيل. كثير من العناوين خارج بيروت بلا رقم شارع، فذكر معلم يوفّر يوماً كاملاً: "البناية بجانب الصيدلية مقابل الكنيسة"، "الطابق الثاني، الباب الأزرق"، أو مشاركة الموقع المباشر، كلها تنفع. وإذا كنت تفضّل استلام الطرد في مكان آخر غير المنزل، أعطِ ذلك العنوان.

أبقِ هاتفك متاحاً يوم التوصيل. الموزّع الذي لا يستطيع الاتصال بك يعيد المحاولة في الجولة التالية، وهذا أكثر سبب شائع لانزلاق الطلب من 24 ساعة إلى 72.

## إذا حدث خطأ

يمكن إرجاع المنتجات غير المفتوحة في تغليفها المختوم خلال 7 أيام من الاستلام. المنتجات المعيبة يغطيها [الضمان](/ar/warranty). الحالتان تبدآن برسالة واتساب إلى +961 76 730 767، وتطبَّقان في طرابلس وصور كما في بيروت. [سياسة الاسترجاع](/ar/returns) تضم الشروط الكاملة.

## نصائح لتوصيل سلس خارج بيروت

- تحقق من حالة التوفر في صفحة المنتج قبل الطلب؛ المنتجات المتوفرة تُشحن أولاً.
- رُدّ على رسالة التأكيد بسرعة، مع ذكر معلم إذا كان شارعك بلا رقم.
- اختر عنوان توصيل تستطيع فيه الرد على الباب والهاتف.
- اطلب [مزلقاً](/ar/lubricants) مائياً مع اللعبة السيليكونية في الطرد نفسه، حتى لا تنتظر مرتين.
- احفظ رقم الواتساب، فتكون مكالمة الموزّع من رقم تعرفه.

## من أين تبدأ

إذا لم تختر منتجاً بعد، يحصر [دليل المبتدئين](/ar/blog/guides/best-sex-toys-for-beginners-lebanon) الاختيار في بضعة خيارات آمنة أولى، ويفعل [اختبار الأسئلة الثلاثة](/ar/quiz) الشيء نفسه في نصف دقيقة. [سياسة التوصيل](/ar/delivery) تضم الشروط الرسمية، والتشكيلة الكاملة من الألعاب الجنسية للبنان في [الصفحة الرئيسية](/ar)، جاهزة للطلب من أي بلدة في البلاد.$ar$,
  'Advice',
  'نصائح',
  5,
  300,
  'published',
  'Sex Toys in Tripoli, Saida, Jounieh & Zahle: Delivery | Vexa Toys',
  'توصيل الألعاب الجنسية إلى طرابلس وصيدا وجونيه وزحلة | فيكسا',
  'How sex toy delivery works outside Beirut: times for Tripoli, Saida, Jounieh, Jbeil, Zahle and Tyre, the plain sealed box, cash on delivery and tips to avoid delays.',
  'كيف يعمل توصيل الألعاب الجنسية خارج بيروت: المدة إلى طرابلس وصيدا وجونيه وجبيل وزحلة وصور، الصندوق العادي المغلق، الدفع عند الاستلام ونصائح لتجنب التأخير.',
  now(), now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE slug = 'sex-toys-delivery-outside-beirut');

-- Verification: one published row, both languages filled, Advice category.
SELECT slug, status, category_en, length(content_en) AS en_chars, length(content_ar) AS ar_chars, published_at
FROM public.articles WHERE slug = 'sex-toys-delivery-outside-beirut';

COMMIT;
