# Admin remediation plan

## Audit basis

This plan is reconciled against `audit/AUDIT.md`, `audit/AUDIT-EVIDENCE.md`, and
`audit/REMEDIATION-PLAN.md`, audited at revision `269689e` on 10 September 2026.
The audit remains the evidence baseline. Its Firebase-specific implementation
recommendations are superseded by the confirmed Supabase migration and separate
`admin-vexatoys` repository; the risks and acceptance criteria remain applicable.

See [audit finding traceability](audit-traceability.md) for ownership of every
finding.

## Scope

This plan translates the agreed two-week remediation into implementation units.
The admin UI is built in the separate `admin-vexatoys` repository and deployed
to `admin.vexatoys.com`. Supabase replaces Firebase as the shared system of
record. The scope does not add unrelated ecommerce features or redesign the
storefront. SEO work can ship first while the data and admin work continues.

## Delivery sequence

P0 containment and the critical framework patch must ship before or with the
first SEO deployment. This preserves the client-agreed early SEO work without
leaving known unauthenticated mutation, deployment, and Telegram surfaces open
during the two-week project.

| Phase | Work | Evidence of completion |
| --- | --- | --- |
| 1. Baseline and routing | Capture current production responses; identify which duplicate API implementation Vercel serves; inventory Firebase data/rules and both Vercel projects | Route matrix, redacted configuration checklist, baseline tests |
| 2. SEO early deployment | Correct redirects, canonical URLs, sitemap timestamps, robots/noindex behavior, metadata conflicts, 404 handling, and priority URLs | Build passes; URL/canonical assertions pass; deployment verified; sitemap submitted and Search Console validations started where available |
| 3. Supabase foundation | Define normalized schema, constraints, explicit grants, RLS, Storage policies, migration scripts, and database policy tests | Local migrations replay cleanly; `supabase test db` proves public/admin allow-and-deny cases |
| 4. Administrator application | Scaffold the maintained Next.js admin app; add Supabase SSR Auth; verify the admin role from `app_metadata`; protect pages and actions; deploy to the admin subdomain | `401`/`403`/success matrix plus authenticated admin E2E smoke test |
| 5. Data migration and API consolidation | Migrate and verify Firebase data/media; remove duplicate notification, IndexNow, revalidation, upload, migration, and deployment handlers; retire storefront `/admin` | Count/checksum reconciliation; one handler per URL; Firebase retained until rollback window ends |
| 6. Order transaction | Move order creation to a validated storefront endpoint; use a Supabase/Postgres transaction for order and stock; add idempotency; wait for commit before success | Persistence failure, insufficient stock, concurrent stock, retry, and duplicate-submit tests |
| 7. Telegram workflow | Generate notification content from committed server data; remove the public test path; record send state and bounded retries | Relay-abuse test fails closed; no pre-commit send; bounded retry is visible in admin |
| 8. Production verification | Upgrade vulnerable dependencies; test both repositories; deploy and verify SEO, checkout, admin, Supabase policies, APIs, and Telegram | Audits reviewed; build/test suites pass; production smoke-test and rollback record |

## Suggested first implementation slice

The safest vertical slice is the Supabase foundation plus administrator order
read access:

1. Create the initial Supabase schema migration, grants, RLS policies, and policy
   tests.
2. Scaffold Supabase SSR Auth in `admin-vexatoys` and add the real sign-in screen.
3. Protect order reads with the `app_metadata` admin role and deny public access
   to order and customer data.
4. Add integration tests for missing, invalid, expired, non-admin, and admin
   sessions.

This proves the authorization pattern before applying it to product, article,
storage, migration, deployment, and revalidation mutations.

## Decisions needed during implementation

- Which Supabase Auth account will receive the server-controlled administrator
  role in `app_metadata`. This must be performed without committing credentials.
- Whether the deployment button is required for routine catalog edits. Normal
  product changes should use cache revalidation and should not need a full site
  deployment.
- Whether order deletion should become archival or remain a permanent delete.
  Archival is preferable for customer support and auditability.
- The retention period for order/customer information and admin audit records.
- The DNS/Vercel project ownership and production environment mapping for
  `admin.vexatoys.com`.

## Definition of done

The admin portion is complete when the acceptance criteria in the
[admin architecture map](../02-architecture/components/admin-panel.md) pass in
the test environment and the same critical paths are smoke-tested after
production deployment. Search Console completion means the repaired issues are
submitted or placed into validation where Google offers that action; it does not
mean a ranking position or processing date is guaranteed.

## Implementation readiness — 15 September 2026

Approximately two-thirds to three-quarters of the remediation can be developed
locally before production credentials or dashboard access are required.

Available now:

- Node.js 22, npm 10, Git, authenticated GitHub CLI, and Podman.
- A reproducible storefront dependency install and passing production build.
- Both repositories, the complete audit/evidence set, and the approved
  storefront/admin/Supabase boundary.

Executable without external access:

- Patch the critical Next.js dependency and retest the storefront.
- Disable/remove exposed migration, upload, deployment, Telegram test/relay,
  and public revalidation behavior; add negative API tests.
- Add typecheck, lint, unit/API test, E2E, and CI foundations.
- Scaffold the separate Next.js admin app, protected layouts, page shell,
  validation, error states, and test harness.
- Create Supabase schema migrations, constraints, grants, RLS/Storage policies,
  seed fixtures, database policy tests, and Firebase import/reconciliation
  scripts.
- Implement storefront Supabase repositories and transactional checkout behind
  environment adapters and mocks.
- Implement source-backed SEO fixes and automated route/canonical/sitemap tests.

Requires external access or configuration for completion:

- Supabase project URL/keys, linked CLI access, live migrations, Auth account and
  server-controlled admin role assignment.
- Firebase export/data access for actual migration and reconciliation.
- Vercel projects/environment variables and `admin.vexatoys.com` DNS ownership.
- Telegram bot/chat configuration for a live post-commit notification test.
- Search Console access for live issue inspection, sitemap submission, and
  validation actions.
- Production smoke tests, monitoring, backup/restore evidence, and rollback.

The local host currently lacks Supabase CLI and Vercel CLI. Podman may provide a
Docker-compatible runtime after explicit setup, but local Supabase database tests
must be proven rather than assumed to work through it.

## Notification-channel revision — 16 September 2026

The client selected the regular WhatsApp app rather than an outbound API provider. The customer opens a prefilled store chat after checkout persistence and presses Send. This supersedes the Telegram worker and bot-configuration tasks above; the automatic administrator alert remains the separate PWA Web Push flow. The current storefront code is not yet deployed.
