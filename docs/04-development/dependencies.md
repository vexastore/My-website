# Dependency installation

## Supported install

Install the storefront dependencies from the repository root with:

```bash
npm ci
```

The lockfile uses public `https://registry.npmjs.org/` tarball URLs and committed
integrity hashes. This keeps installations deterministic on local Fedora,
continuous integration, and Vercel rather than tying them to Replit's internal
package proxy.

Do not commit environment-specific registry hosts to `package-lock.json`. After
changing dependencies, verify that the lockfile contains no private/internal
registry URLs, run a clean `npm ci`, and run `npm run build`.

## Current security follow-up

The 15 September 2026 production-only audit reports five vulnerable dependency
chains: one critical, three high, and one moderate. The locked Next.js 15.5.23
is affected by critical advisories whose reported patched boundary begins at
15.5.24. `@vercel/blob` 0.27.3 also carries a vulnerable `undici` chain for
which npm proposes a major package upgrade.

Treat those upgrades as the dependency-security remediation slice. Upgrade in
small groups, review framework and Blob API changes, and rerun the production
build plus affected checkout, image, SEO, and API tests. The registry-host fix
does not claim to resolve the audit findings.
