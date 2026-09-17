# Changelog

All notable changes to this project are documented here. The project follows
[Semantic Versioning](https://semver.org/).

## [1.2.1] - 2026-09-17

### Deployment

- Deployed to `vexatoys.com` as Ready deployment `dpl_Em8cjndz81hETTeAKNjvGho14soY`; live status lookup privacy and validation checks, home, and catalog passed.

### Fixed

- Refresh browser-saved My Orders receipts from the confirmed Supabase status instead of keeping their initial pending state. Show confirmed distinctly in My Orders and the navbar order panel.
- Add a bounded, same-origin, read-only status lookup that requires each receipt reference and checkout phone and returns only matching statuses. Show a retry notice when refresh fails and provide a path from the navbar order panel to full order details.

## [1.2.0] - 2026-09-17

### Deployment

- Deployed to `vexatoys.com` as Ready deployment `dpl_7rZL6wKGcaH8GVcJHLzEebtzqhFP`; live catalog and safe checkout smoke checks passed.

### Changed

- Format English and Arabic WhatsApp order drafts with structured customer, product, SKU, date, and price sections requested by the store owner. Include a public image URL for each product when available; regular WhatsApp links cannot attach an image file.
- Read product and selected-option SKUs from Supabase and use the persisted order delivery fee and timestamp when constructing the receipt.

## [1.1.0] - 2026-09-17

### Deployment

- Deployed to `vexatoys.com` as Ready deployment `dpl_8g3gxnfiMydTGgGjiGNfHVt8TLuk`. Production catalog, article, settings, SEO, and safe checkout failure-path smoke checks passed; the first real customer transaction remains for the owner.

### Supabase storefront cutover

- Read products, categories, media references, articles, and store settings from Supabase in the storefront. Route `/admin` to the separate admin site.
- Send checkout writes through a server-only Supabase order RPC, with an idempotency key and a confirmation only after persistence. Preserve the cart on failure.
- Refresh catalog and sitemap pages every five minutes while preserving Vercel Blob image URLs.
- Retire the old Firebase-backed Vercel functions, in-repo admin component, Firebase client, and Firebase package from the runtime.

### Changed

- Checkout now opens a prepared customer-sent WhatsApp message only after the order write is confirmed. Removed public Telegram notification and diagnostic endpoints.


### Added

- Documented the current admin panel, its trust boundaries, privileged
  operations, and the target remediation architecture.
- Added a two-week implementation sequence and acceptance criteria for the
  agreed admin, order, Telegram, API security, and deployment work.
- Revised the target architecture for a separate `admin.vexatoys.com`
  repository with Supabase Database, Auth, Row Level Security, and Storage.
- Added ownership and remediation traceability for all 27 findings in the
  September 2026 technical audit.
- Documented the immediately executable remediation scope and the external
  access required for live Supabase, Vercel, DNS, Telegram, and Search Console
  completion.

### Fixed

- Replaced 166 environment-specific Replit package-proxy tarball URLs in
  `package-lock.json` with their equivalent public npm registry URLs, restoring
  deterministic `npm ci` installs outside Replit.

### Checkout behavior

- Automatically open WhatsApp after a confirmed order; keep a retry link and save the local receipt before navigation.
- Label simulated checkout responses and prevent mock orders from entering order history or opening WhatsApp; remove old `VX-LOCALTEST` receipts.
- Include selected-size price deltas in the message and receipt.

### Isolated staging checkout setup

- Add guarded staging startup and environment template so local order testing cannot target the live Supabase project by mistake.

### Security and deployment

- Upgrade Next.js to 15.5.24, pin patched PostCSS and Sharp, remove unused Vercel Blob client, and remove unused public IndexNow/revalidation endpoints.
- Configure production Supabase public and server-only keys; size-aware `create_order` migration was applied and rollback-tested in the admin repository.
- First real production checkout and WhatsApp Send remain manual verification steps.
