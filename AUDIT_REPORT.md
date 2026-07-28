# 🔍 تقرير الفحص التقني الشامل — vexatoys.com
**تاريخ الفحص:** 2026-07-28  
**الأدوات المستخدمة:** curl، قراءة كود GitHub، فحص مباشر على الموقع

---

## ✅ ما يعمل بشكل صحيح

| الفحص | النتيجة |
|---|---|
| HTTPS على جميع الصفحات | ✅ |
| www → canonical 301 redirect (single hop) | ✅ |
| /sex-toys, /adult-toys, /vibrators → 200 OK | ✅ |
| /nonexistent → 404 صحيح | ✅ |
| /adult-toys/nonexistent → 404 (بدون redirect loop) | ✅ |
| HSTS (max-age=63072000; includeSubDomains; preload) | ✅ |
| X-Content-Type-Options: nosniff | ✅ |
| X-Frame-Options: DENY | ✅ |
| Vercel CDN caching (HIT) | ✅ |
| Mixed content (http:// في src) | ✅ 0 مشكلة |
| Canonical صحيح على / | ✅ https://vexatoys.com |
| Canonical صحيح على /sex-toys | ✅ https://vexatoys.com/sex-toys |
| Canonical صحيح على /sex-toys/dildo | ✅ https://vexatoys.com/sex-toys/dildo |
| Schema: Product, Organization, BreadcrumbList | ✅ |
| Schema: Offer, MerchantReturnPolicy, ShippingDetails | ✅ |
| Schema: AggregateRating, SearchAction, Store, WebSite | ✅ |
| robots.txt: /admin, /checkout محجوبان (صحيح) | ✅ |
| Sitemap: 128 URL تشمل المنتجات والمدونة | ✅ |
| X-Powered-By header مُزال | ✅ |

---

## 🔴 مشاكل حقيقية تحتاج إصلاح فوري

### 1. BUG: `/?category=Sex+Toys` → 308 مع query param غير محذوف
**الدليل:** `curl -sI "https://vexatoys.com/?category=Sex+Toys"` يُرجع:
```
HTTP/2 308
location: https://vexatoys.com/sex-toys?category=Sex%20Toys
```
**المشكلة:** 
- يجب أن يكون 301 وليس 308
- يجب أن يذهب إلى `/sex-toys` بدون query param
- الكود في middleware يحاول حذف الـ search لكن `req.nextUrl.clone()` لا يعمل بشكل صحيح في Next.js 15
- النتيجة: Google يرى `/sex-toys?category=Sex%20Toys` كـ URL منفصل → duplicate content

**الإصلاح:** في `middleware.ts` استخدام `new URL()` بدل `clone()`:
```typescript
// بدل: const clean = req.nextUrl.clone(); clean.search = '';
const target = new URL('/sex-toys', `https://${CANONICAL_HOST}`);
return NextResponse.redirect(target, 301);
```
**تأثير SEO:** متوسط — يخلق duplicate content URLs في ذاكرة Google

---

## 🟠 مشاكل تحتاج مراقبة (لا تعديل)

### 2. Missing Content-Security-Policy header
**الدليل:** curl -sI لا يُرجع CSP header  
**التأثير على SEO:** لا تأثير مباشر — لكن Google يُفضل المواقع الآمنة  
**الإصلاح:** يحتاج إعداد في Vercel headers أو middleware — خطر عالي بكسر الموقع بسببه، أنصح بتركه الآن

### 3. 38 Redirect Error في GSC (من URLs قديمة)
**السبب:** Google لديه في ذاكرته URLs قديمة من `/adult-toys/product-slug` كانت تُعيد توجيه  
**الحالة الآن:** الكود صحيح — هذه الـ URLs تُرجع 404 وليس redirect  
**يحتاج:** انتظار إعادة زحف Google فقط (2-4 أسابيع)

### 4. `/sex-toys?category=Sex%20Toys` يُرجع 200 بدل redirect
**السبب:** هذا URL وصل إليه Google عبر الـ 308 المعطوب  
**الإصلاح:** يُحل تلقائياً بعد إصلاح المشكلة #1 أعلاه

---

## 🟡 تحسينات مقترحة (ليست أخطاء)

### 5. بعض المنتجات تحت /sex-toys/ وليس /dildos/ إلخ
**مثال:** `https://vexatoys.com/sex-toys/dildo` موجود في الـ sitemap  
**السبب:** هذه المنتجات محفوظة في Firebase بـ `categorySlug: 'sex-toys'`  
**التأثير:** يقلل كثافة الكلمات المفتاحية في صفحات الفئات الفرعية  
**الإصلاح:** من لوحة الإدارة تحديث `categorySlug` لكل منتج للفئة الصحيحة

### 6. Crawl Budget — 5 صفحات "Crawled not indexed"
**السبب:** صفحات ذات محتوى ضعيف أو مشابه  
**يحتاج:** انتظار + تحسين محتوى صفحات الفئات

---

## 📊 ملخص سرعة الموقع

| المقياس | القيمة | التقييم |
|---|---|---|
| وقت الاستجابة (TTFB) | ~1.0s من الـ origin | مقبول (Vercel CDN يُحسّنه) |
| Vercel CDN | HIT على معظم الصفحات | ✅ |
| AVIF/WebP | مُفعّل (من آخر commit) | ✅ |
| HSTS + HTTPS | ✅ | |
| preconnect hints | مُضاف (من آخر commit) | ✅ |
| X-Powered-By مُزال | ✅ | |
| Core Web Vitals (LCP/INP/CLS) | غير قابل للقياس من server-side | يحتاج PageSpeed Insights |

---

## ✅ ملخص Merchant Center

| الحقل | الحالة |
|---|---|
| validFrom | ✅ موجود (2024-01-01) |
| priceValidUntil | ✅ موجود (rolling 1 year) |
| hasMerchantReturnPolicy | ✅ موجود |
| shippingDetails | ✅ موجود |
| image (proxy fallback) | ✅ مُصلح في آخر commit |
| description | ✅ موجود مع fallback |

---

## خلاصة التعديلات المطلوبة

| # | التعديل | الأولوية | الملف |
|---|---|---|---|
| 1 | إصلاح 308→301 وحذف query param | 🔴 عالية | middleware.ts |
| 2 | إضافة أقسام الصفحة الرئيسية | 🟠 متوسطة | app/page.tsx |
