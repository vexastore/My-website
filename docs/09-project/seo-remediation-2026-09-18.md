# Storefront SEO audit and remediation, 18 September 2026

This is a technical indexability review of the public storefront. It does not report Search Console validation or confirmed Google indexing. Google chooses canonicals and controls crawl and indexing. Local checks establish only that pages are technically reachable with consistent signals.

## Audit findings and changes

| Area | Finding | Remediation |
| --- | --- | --- |
| Metadata | Product, category, and article SEO fields saved by admin were ignored; client navigation overwrote server titles. | Published Supabase SEO overrides now take precedence by locale, with content-derived fallbacks. Client-side title rewriting was removed. |
| Canonicals and stale slugs | Canonical product pages could render at a different category path; legacy product routes used temporary redirects; one remap collided with a second published product. | Keep existing canonical paths, permanently redirect aliases, and give the previously unreachable distinct product a unique canonical path. Exact canonical slug matching precedes name-derived matching. Existing historical Vercel redirect remains. |
| Sitemap | Bundled articles, rather than the 13 published Supabase articles, were listed. Product and category modification dates were replaced with today's date. | Generate canonical categories, products, and published articles from Supabase. Use row update timestamps and omit dates when no reliable timestamp exists. Include blog categories only when they have published articles. Sitemap generation fails visibly on data read errors rather than publishing a partial list. |
| Robots and utility URLs | Checkout was both robots-disallowed and `noindex`, so crawlers could not see the noindex tag. Query variants could multiply crawlable URLs. | Allow checkout crawling so its noindex can be observed. Permanently remove inactive search/filter/sort/page query parameters while retaining campaign parameters. Keep API/admin restrictions and the sitemap directive. |
| Structured data | Product markup asserted free shipping, return restrictions, fixed offer dates, brand ownership, and aggregate reviews without reliable evidence. Organization markup asserted hours, payment modes, ratings, and a nonfunctional search action. | Emit product name, real media, real SKU when present, database price/currency/stock, and canonical Offer URL. Keep only basic verified organization/site identity. Article and category markup follows the rendered locale. |
| Image text | Product images ignored `product_media.alt_en` and `alt_ar`. | Use admin-managed media alt text with product-name fallback; thumbnail controls have accessible labels. |
| Duplicate/thin pages | Imported products can share names/descriptions, sometimes with different prices and images. Some categories have very small inventories. | Distinguish duplicate fallback metadata using actual name and price while preserving editorial overrides and product names. Keep existing category URLs/indexability to avoid discarding ranking signals; content expansion and catalog cleanup require owner review. |
| Locale | English/Arabic currently share each canonical URL and vary by cookie. | Preserve English-default URL signals and Arabic RTL rendering. Do not emit invalid hreflang pairs pointing two languages to one URL. Separate Arabic URLs plus reciprocal hreflang remain a future routing project. |
| 404 and links | Unknown category/product/article routes must return real 404 responses; product links must match canonical paths. | Exact product lookup and canonical navigation were aligned; legacy redirects remain. Sitemapped URLs are tested for 200/self-canonical and one H1. |

Category guides are sections of the category pages, not separate URLs. Search, filter, and sort controls currently update client state without creating indexable routes. The old static `BLOG_POSTS` collection remains in source for other legacy uses but is no longer a sitemap source.

## Remaining decisions and verification limits

- Googlebot without the locale cookie gets English; Arabic content on the same URL is usable but has no independent indexable URL. Add dedicated Arabic routes only with reciprocal links, self-canonicals, and translated main content. Admin-managed category guide/FAQ data has no Arabic fields yet.
- A few category pages have one or no product listings. Their current editorial remains on the page, so they were not automatically noindexed. Review catalog data and Search Console performance before removing established URLs.
- Product reviews, shipping fees, return policy, business hours, and payment methods are intentionally omitted from JSON-LD until the owner supplies verifiable canonical data. Existing visible claims were not broadly rewritten in this SEO-only pass.
- Supabase row `updated_at` records any update, not necessarily a significant main-content edit; it is still more evidence-based than marking every URL modified today. If operational-only updates become frequent, track a dedicated content-modified timestamp.
- Local HTTP and markup validation are not the same as Google Rich Results Test, URL Inspection, or a Search Console index report. After deployment, inspect representative URLs and submit the sitemap/affected URLs in the verified Search Console property.

## Google reference basis

- [Canonical URL signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Localized URL and hreflang requirements](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Multilingual site URL guidance](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites)
- [Sitemap lastmod accuracy](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Product merchant listing data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Article data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Breadcrumb data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Noindex versus robots blocking](https://developers.google.com/search/docs/crawling-indexing/control-what-you-share)

## Local verification result

On 18 September 2026, lint exited successfully with 30 non-blocking warnings, TypeScript passed, all 12 unit tests passed, and the Next.js 15.5.24 production build passed. A local production HTTP crawl checked all 151 sitemap URLs and 16 representative English/Arabic page variants: zero missing pages, canonical mismatches, missing H1/title/description fields, or duplicate titles/descriptions. Checkout exposed `noindex` and robots.txt advertised the sitemap. This is local technical evidence only; production deployment verification and Search Console validation remain outstanding.
