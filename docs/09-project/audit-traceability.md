# Audit finding traceability

## Baseline and interpretation

The authoritative evidence baseline is the 10 September 2026 audit of revision
`269689e`:

- `audit/AUDIT.md` — complete technical review and findings register.
- `audit/AUDIT-EVIDENCE.md` — source locations, Git history, endpoint matrix,
  configuration inventory, and static checks.
- `audit/CLIENT-AUDIT.md` — client-facing summary.
- `audit/REMEDIATION-PLAN.md` — original P0-P3 ordering.
- `audit/AUDIT_REPORT.md` — earlier SEO-focused Arabic report; useful historical
  evidence, but narrower than the complete audit.

The move to Supabase and a separate `admin.vexatoys.com` repository does not
invalidate the findings. It changes where several fixes are implemented. The
Firebase-specific recommendations are migration-source guidance; Supabase Auth,
Postgres constraints/transactions, explicit grants, RLS, and Storage policies
are the target controls.

## Finding ownership

| Finding | Concern | Primary owner | Target remediation |
| --- | --- | --- | --- |
| F-01 Critical | Browser-only admin authorization | `admin-vexatoys` + Supabase | Supabase Auth, server-validated `app_metadata` admin role, host-only session, grants and RLS; remove storefront admin |
| F-02 Critical | Public image migration mutation | Storefront cutover | Disable immediately; migrate through a temporary authenticated/offline job; delete route after reconciliation |
| F-03 High | Public Blob upload | `admin-vexatoys` + Supabase Storage | Authenticated media workflow, magic-byte/size/dimension validation, generated paths, quotas and cleanup |
| F-04 High | Public deployment trigger | Storefront cutover | Remove; retain only as a restricted audited admin operation if operationally necessary |
| F-05 High | Success before durable order | Storefront + Supabase | Validated server order endpoint; acknowledge only after atomic database commit |
| F-06 Critical | Vulnerable Next.js/dependency chain | Storefront | Upgrade patched supported versions and regression-test images, routes, ISR, APIs and checkout |
| F-07 High | Telegram relay and side-effecting diagnostic | Storefront | Remove diagnostic; build message from committed order; bounded durable delivery/retry state |
| F-08 Medium | Public duplicated revalidation secret | Storefront + admin | One server-internal allowlisted revalidation path; no client/query-string secret |
| F-09 High | Sensitive order data and no retention model | Shared governance + Supabase | Minimize copies/fields, RLS, retention/deletion workflow, approved policy, Telegram minimization |
| F-10 High | Race-prone stock/order updates | Storefront + Supabase | One idempotent Postgres transaction with non-negative stock constraints |
| F-11 Medium | Missing schemas, throttles and request controls | Both applications | Shared validation rules, body limits, rate limits, same-origin/CSRF controls and stable errors |
| F-12 High | Disabled/absent quality gates | Both repositories | Typecheck, lint, unit, integration, database-policy and E2E commands enforced in CI |
| F-13 High | Duplicate route implementations | Storefront | Select one Next routing model, remove shadows, test deployed route ownership |
| F-14 Medium | Missing CSP/isolation headers | Both applications | Report-only then enforced nonce/hash CSP; minimal per-host origin allowlists |
| F-15 Medium | Synthetic sitemap freshness | Storefront + Supabase | Store source timestamps and emit real `updated_at` or omit unknown dates |
| F-16 Medium | Client/server metadata and unsupported claims | Storefront | Server-only metadata; evidence owner for ratings, payment, materials, returns and opening-hours claims |
| F-17 Low | Homepage canonical/indexing inconsistency | Storefront | One route inventory shared by sitemap, redirects and IndexNow |
| F-18 Low | Empty SVG favicons | Storefront | Replace/remove invalid SVG and keep one optimized authoritative asset set |
| F-19 Medium | Masked failures | Both applications | Structured safe errors, request IDs, visible retry/partial-failure states and monitoring |
| F-20 Medium | Uneven query timeouts and cost | Storefront + Supabase | Indexed point/filter queries, cancellation, bounded retries and measured budgets |
| F-21 Medium | Oversized mixed-responsibility modules | Both repositories | Separate public domains from admin; split services/components and centralize schemas/slugs |
| F-22 High | Missing documentation/operational readiness | Both repositories | Setup, environment ownership, architecture, API, database, deployment, recovery, privacy, testing and incident docs |
| F-23 Medium | Sensitive/raw logging and errors | Both applications | Redaction, stable public error codes, access-controlled provider diagnostics; no PII bodies in logs |
| F-24 Low | Potential Host-header SSRF | Storefront | Remove legacy handler or use a constant canonical origin; hostile-header regression test |
| F-25 Medium | Anonymous IndexNow abuse | Storefront | Trigger only from validated mutations/queue; catalog allowlist, batching and rate limits |
| F-26 High | Missing backup/restore/rollback proof | Shared operations + Supabase | Automated backups, retention, migration snapshots, restore drill, RPO/RTO and deployment rollback |
| F-27 Medium | Dependency/lockfile governance | Both repositories | Public portable lockfiles, pinned Node/package manager, reviewed updates and verified dead-code removal |

## Delivery gates

### Gate 1 — Immediate containment

- F-02, F-03, F-04, F-07 diagnostics/relay, and F-08 public invalidation cannot
  be invoked anonymously.
- F-06 patched dependencies build and pass affected smoke tests.
- Evidence includes negative HTTP tests and production route verification.

### Gate 2 — Supabase and admin foundation

- F-01, F-09, F-10, and F-11 are represented in migrations, grants, RLS,
  Storage policies, transaction constraints, and automated policy tests.
- `admin.vexatoys.com` rejects missing and non-admin sessions at page, action,
  API, database, and Storage layers.

### Gate 3 — Reliable cutover

- F-05 order failure/retry/concurrency cases pass.
- F-13 has one implementation per production URL.
- F-19 and F-23 failures are visible to operators without exposing PII.
- F-26 migration counts/checksums, restore, rollback, and production smoke-test
  evidence are retained.

### Gate 4 — SEO, quality and operations completion

- F-12 quality gates run in CI.
- F-14 through F-18 and F-20 pass their route, security-header, asset, metadata,
  sitemap, performance, and Search Console checks.
- F-21, F-22, F-25, and F-27 have documented ownership and maintainable code or
  operational controls.

## Current status

The audit has now been reviewed and mapped. Documentation and lockfile registry
portability work are in progress in the working tree. Runtime remediation,
Supabase migrations, admin implementation, production containment, live account
verification, and Search Console validation are not yet complete.


## Notification-channel decision — 16 September 2026

F-07 is now addressed by removing the public Telegram relay and test routes and offering a customer-sent WhatsApp link only after an acknowledged order write. No automated WhatsApp notification or delivery claim is made. The separate admin PWA Web Push outbox remains the automatic order alert. The current Firebase checkout implementation is local and still requires production deployment and browser verification; the Supabase cutover must preserve the same boundary.
