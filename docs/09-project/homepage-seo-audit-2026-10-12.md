# Homepage SEO prioritization audit, 12 October 2026

This audit answers why Google can prefer a category page, including `/sex-dolls`, over the homepage for broad queries such as `sex toys lebanon`. It compares current repository logic, production HTML, rendered browser output, and externally visible search-crawl evidence. It does not claim a stable Google ranking position: results vary by time, location, device, personalization, and query wording. Search Console Performance and URL Inspection remain the authoritative property-level sources.

## Outcome

The homepage is indexable and technically healthy, but its page-level targeting is weaker and less distinct than the category pages. The storefront also gives Google overlapping signals about which page represents the broad `sex toys in Lebanon` topic.

The reported product-image indexing state is separate from this page-selection issue. Product images can remain crawled but not indexed without preventing the homepage from ranking.

## Production comparison

| Signal | `/` | `/sex-toys` | `/sex-dolls` |
| --- | --- | --- | --- |
| HTTP/rendering | Loads normally | Loads normally | Loads normally |
| Canonical | Self-canonical | Self-canonical | Self-canonical |
| Robots | `index, follow, nocache` | `index, follow` | `index, follow` |
| Browser title | `Premium Intimate Wellness & Couples Care \| Vexa Toys Lebanon` | `Sex Toys Lebanon \| Sex Toys in Lebanon – Vexa Store` | `Sex Dolls in Lebanon \| Vexa Store` |
| H1 | `SEX TOYS IN LEBANON` | `SEX TOYS IN LEBANON` | `SEX TOYS IN LEBANON` |
| Page-specific catalog heading | `Sex Toys in Lebanon \| Vexa Toys` | `Sex Toys in Lebanon \| Vexa Toys` | `Sex Dolls in Lebanon \| Vexa Toys` |
| Direct homepage link | N/A | One visible footer link | One visible footer link |
| Initial homepage link to `/adult-toys` | N/A | N/A | N/A |

## Findings

### 1. The homepage title does not lead with the target query

The homepage H1 targets `Sex Toys in Lebanon`, but the title and description lead with euphemistic wording such as `Premium Intimate Wellness`, `personal massagers`, and `couples essentials`. In contrast, `/sex-toys` puts both `Sex Toys Lebanon` and `Sex Toys in Lebanon` in its title. The category page therefore sends a clearer exact-topic signal for the commercial query.

Google says title links are influenced by the title element, visible main title, headings, and other prominent text. The current mismatch makes the homepage less explicit than `/sex-toys`.

### 2. Category pages reuse the homepage H1 and hero

`HeroSection` is rendered by `ProductList` on the homepage and every category route. As a result, `/sex-toys`, `/sex-dolls`, and the homepage all expose the same primary H1: `SEX TOYS IN LEBANON`. Page-specific category wording is demoted to an H2.

This is not a canonical-tag error: all three pages declare self-canonicals. It is a content-distinction problem. The shared hero makes categories look like variants of the same broad landing page and weakens the intended homepage-versus-category hierarchy.

### 3. Live category SEO overrides still use the old brand

The direct production titles for `/sex-toys` and `/sex-dolls` say `Vexa Store`, although the current code fallback and visible storefront say `Vexa Toys`. `app/[category]/page.tsx` gives published Supabase SEO fields precedence over code fallbacks, so the live result is evidence that old admin-managed category overrides remain published.

The externally visible search crawl also showed an older `/sex-toys` result with `Vexa Store`, while the homepage fetched on 12 October showed the current `Vexa Toys` content. Google therefore has crawl history containing inconsistent branding and page versions.

### 4. `/adult-toys` lacks an initially rendered internal link

The homepage has visible crawlable footer links to `/sex-toys` and `/sex-dolls`, but no initially rendered anchor to `/adult-toys`. The desktop `All Products` link appears only after a user opens a JavaScript dropdown, and its click handler prevents navigation and opens the homepage state instead.

`/adult-toys` is in the sitemap, but Google describes sitemaps as a weaker signal than normal crawlable internal links. A page intended to target `adult toys Lebanon` should be linked from the homepage with descriptive anchor text.

### 5. Client-side category navigation leaves stale head metadata

Clicking the visible homepage `Sex Toys` link changes the browser URL to `/sex-toys` through `history.pushState`, but the rendered document retains the homepage title and canonical until a full page request. Direct requests to `/sex-toys` return the correct category-specific head, so normal URL crawling still sees the server metadata. The stale client state is nevertheless an avoidable inconsistency for users, browser history, sharing, and any renderer observing the soft-navigation state.

### 6. The reported exact rank was not independently confirmed

The audit found indexed/crawled evidence for `/sex-toys` and `/sex-dolls`, but did not claim that `/sex-dolls` is currently position 8 for every user. That position must be checked in Search Console Performance with country, device, date, and exact-query filters, or reproduced in the same signed-out Lebanon search context.

## Recommended remediation order

1. Choose one broad-query hierarchy and document it. If the homepage must own `sex toys Lebanon` and `adult toys Lebanon`, make that wording explicit in its title, description, H1, opening copy, and descriptive internal anchors. Keep category pages specific to their inventory.
2. Stop rendering the generic homepage hero/H1 on category routes. Each category should have one category-specific H1, such as `Sex Dolls in Lebanon`, while the homepage keeps the broad H1.
3. Replace the published Supabase category SEO overrides still branded `Vexa Store` with reviewed `Vexa Toys` titles and descriptions. Do not rely only on code fallbacks while database overrides take precedence.
4. Add an always-rendered homepage anchor to `/adult-toys` using descriptive text such as `Adult Toys in Lebanon`. Make the desktop and mobile navigation destination match the anchor's URL.
5. Make client-side category navigation perform a real Next.js route transition, or update title, description, canonical, and relevant Open Graph state in sync with the URL. Prefer a real route transition so server and client metadata have one source of truth.
6. Preserve existing category URLs and self-canonicals during the first pass. Do not redirect or canonicalize a ranking category to the homepage without Search Console query/page evidence, because that could discard useful category relevance.
7. After deployment, inspect and request indexing for `/`, `/sex-toys`, `/adult-toys`, and `/sex-dolls`. Compare Search Console query-to-page performance after recrawl before making consolidation decisions.

## Verification performed

- Fetched live HTML for `/`, `/sex-toys`, and `/sex-dolls` and compared titles, descriptions, canonicals, robots directives, headings, and content.
- Rendered the homepage and both category pages in headless Google Chrome at 1440x1000; rendered the homepage again at 390x844.
- Confirmed meaningful content, no framework overlay, no page exception, no failed request, and one known Meta Pixel availability warning.
- Counted initially rendered direct category anchors and confirmed `/adult-toys` is absent.
- Clicked the visible `/sex-toys` link and confirmed the URL changes while the homepage title remains in the client document.
- Reviewed `app/page.tsx`, `app/[category]/page.tsx`, `src/components/HeroSection.tsx`, `src/components/ProductList.tsx`, `src/components/Navbar.tsx`, `src/context/ShopContext.tsx`, `src/App.tsx`, `app/sitemap.ts`, and category metadata/fetching code.

## Cache and release note

The audit began as a diagnostic pass and was implemented in release 1.5.15 after owner approval. The homepage now owns the broad-query title/H1, category pages render unique H1s, `/adult-toys` has persistent links, category navigation performs real Next.js route transitions, and the public category reader normalizes legacy `Vexa Store` overrides. Because the implementation changed metadata, navigation/static content, and category data mapping, `lib/cacheVersion.ts` and the package version were bumped to `v1.5.15` / `1.5.15`.

## Google reference basis

- [Title-link guidance](https://developers.google.com/search/docs/appearance/title-link)
- [Crawlable links and internal anchor text](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Canonical URL signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Canonical troubleshooting and sufficiently distinct pages](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting)
