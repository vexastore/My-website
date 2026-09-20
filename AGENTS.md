Global development rules

1. Always document every completed task.

2. Every completed task must update:
   - README.md (if user-facing behavior changes)
   - CHANGELOG.md (following semantic versioning)
   - Relevant documentation pages
   - docs/worklogs/worklog-dd-mm-yyyy.md

3. Store all worklogs inside:

docs/
│
├── index.md
│
├── glossary.md
│
├── faq.md
│
├── changelog.md
│
│
├── 01-getting-started/
│   ├── index.md
│   ├── overview.md
│   ├── features.md
│   ├── requirements.md
│   ├── installation.md
│   ├── configuration.md
│   ├── quick-start.md
│   └── first-deployment.md
│
├── 02-architecture/
│   ├── index.md
│   ├── system-overview.md
│   ├── design-principles.md
│   │
│   ├── components/
│   │   ├── index.md
│   │   ├── frontend.md
│   │   ├── backend.md
│   │   ├── workers.md
│   │   ├── database.md
│   │   ├── cache.md
│   │   └── storage.md
│   │
│   ├── data/
│   │   ├── index.md
│   │   ├── data-model.md
│   │   ├── database-schema.md
│   │   ├── erd.md
│   │   ├── migrations.md
│   │   └── data-lifecycle.md
│   │
│   ├── flows/
│   │   ├── authentication.md
│   │   ├── authorization.md
│   │   ├── request-lifecycle.md
│   │   ├── background-jobs.md
│   │   └── event-flow.md
│   │
│   ├── infrastructure/
│   │   ├── topology.md
│   │   ├── networking.md
│   │   ├── storage.md
│   │   ├── containers.md
│   │   └── external-services.md
│   │
│   └── diagrams/
│       ├── system-context.md
│       ├── container-diagram.md
│       ├── deployment-diagram.md
│       ├── data-flow.md
│       └── sequence-diagrams.md
│
├── 03-api-reference/
│   ├── index.md
│   ├── overview.md
│   ├── authentication.md
│   ├── authorization.md
│   ├── errors.md
│   ├── pagination.md
│   ├── rate-limits.md
│   ├── versioning.md
│   │
│   ├── endpoints/
│   │   ├── auth.md
│   │   ├── users.md
│   │   ├── projects.md
│   │   ├── files.md
│   │   └── admin.md
│   │
│   ├── webhooks/
│   │   ├── overview.md
│   │   ├── events.md
│   │   ├── signatures.md
│   │   └── retries.md
│   │
│   └── examples/
│       ├── curl.md
│       ├── javascript.md
│       └── python.md
│
├── 04-development/
│   ├── index.md
│   ├── development-setup.md
│   ├── repository-structure.md
│   ├── coding-standards.md
│   ├── conventions.md
│   ├── dependencies.md
│   │
│   ├── workflows/
│   │   ├── branching.md
│   │   ├── commits.md
│   │   ├── pull-requests.md
│   │   ├── code-review.md
│   │   └── releases.md
│   │
│   ├── testing/
│   │   ├── index.md
│   │   ├── strategy.md
│   │   ├── unit-tests.md
│   │   ├── integration-tests.md
│   │   ├── e2e-tests.md
│   │   ├── performance-tests.md
│   │   ├── security-tests.md
│   │   ├── fixtures.md
│   │   └── coverage.md
│   │
│   ├── debugging/
│   │   ├── index.md
│   │   ├── backend.md
│   │   ├── frontend.md
│   │   ├── database.md
│   │   └── networking.md
│   │
│   └── tooling/
│       ├── linting.md
│       ├── formatting.md
│       ├── scripts.md
│       └── local-tools.md
│
├── 05-security/
│   ├── index.md
│   ├── security-model.md
│   ├── threat-model.md
│   ├── authentication.md
│   ├── authorization.md
│   ├── secrets-management.md
│   ├── encryption.md
│   ├── network-security.md
│   ├── data-protection.md
│   ├── dependency-security.md
│   ├── vulnerability-management.md
│   ├── security-testing.md
│   ├── incident-response.md
│   ├── disclosure-policy.md
│   └── security-checklist.md
│
├── 06-deployment/
│   ├── index.md
│   ├── environments.md
│   ├── configuration.md
│   ├── build.md
│   ├── ci-cd.md
│   ├── deployment.md
│   ├── rollback.md
│   ├── migrations.md
│   ├── secrets.md
│   │
│   └── environments/
│       ├── development.md
│       ├── staging.md
│       └── production.md
│
├── 07-operations/
│   ├── index.md
│   ├── operations-overview.md
│   │
│   ├── monitoring/
│   │   ├── index.md
│   │   ├── health-checks.md
│   │   ├── metrics.md
│   │   ├── logging.md
│   │   ├── tracing.md
│   │   ├── dashboards.md
│   │   └── alerting.md
│   │
│   ├── backups/
│   │   ├── index.md
│   │   ├── strategy.md
│   │   ├── database-backups.md
│   │   ├── file-backups.md
│   │   ├── retention.md
│   │   └── restore.md
│   │
│   ├── disaster-recovery/
│   │   ├── index.md
│   │   ├── recovery-plan.md
│   │   ├── database-recovery.md
│   │   ├── storage-recovery.md
│   │   ├── service-recovery.md
│   │   └── restore-drills.md
│   │
│   ├── runbooks/
│   │   ├── index.md
│   │   ├── service-down.md
│   │   ├── database-down.md
│   │   ├── high-cpu.md
│   │   ├── high-memory.md
│   │   ├── disk-full.md
│   │   ├── degraded-storage.md
│   │   ├── certificate-expiry.md
│   │   └── rollback.md
│   │
│   ├── maintenance/
│   │   ├── index.md
│   │   ├── routine-maintenance.md
│   │   ├── database-maintenance.md
│   │   ├── storage-maintenance.md
│   │   ├── dependency-updates.md
│   │   └── upgrade-procedure.md
│   │
│   └── troubleshooting/
│       ├── index.md
│       ├── application.md
│       ├── database.md
│       ├── networking.md
│       ├── storage.md
│       └── common-errors.md
│
├── 08-performance/
│   ├── index.md
│   ├── performance-model.md
│   ├── benchmarks.md
│   ├── profiling.md
│   ├── database-performance.md
│   ├── caching.md
│   ├── scaling.md
│   ├── capacity-planning.md
│   └── known-bottlenecks.md
│
├── 09-project/
│   ├── index.md
│   ├── roadmap.md
│   ├── milestones.md
│   ├── releases.md
│   ├── compatibility.md
│   ├── known-issues.md
│   ├── technical-debt.md
│   └── deprecations.md
│
├── 10-governance/
│   ├── index.md
│   ├── contributing.md
│   ├── code-of-conduct.md
│   ├── ownership.md
│   ├── support-policy.md
│   ├── versioning-policy.md
│   ├── release-policy.md
│   └── lifecycle-policy.md
│
├── adr/
│   ├── index.md
│   ├── template.md
│   ├── 0001-example-decision.md
│   ├── 0002-example-decision.md
│   └── ...
│
├── rfc/
│   ├── index.md
│   ├── template.md
│   ├── 0001-example-proposal.md
│   └── ...
│
├── incidents/
│   ├── index.md
│   ├── template.md
│   ├── 2026/
│   │   └── yyyy-mm-dd-incident-name.md
│   └── ...
│
├── worklogs/
│   ├── index.md
│   ├── 2026/
│   │   ├── 09/
│   │   │   ├── worklog-01-09-2026.md
│   │   │   ├── worklog-02-09-2026.md
│   │   │   └── ...
│   │   └── ...
│   └── ...
│
├── archive/
│   ├── deprecated/
│   ├── superseded/
│   └── legacy/
│
└── assets/
    ├── diagrams/
    ├── images/
    ├── screenshots/
    └── examples/

4. If a worklog already exists for the current date, append the new work instead of creating another file.

5. Every worklog entry must contain:

## Summary

A high-level summary of the completed work.

## Why

Reason for implementing the feature.

## How

Technical implementation details.

## When

Timestamp or session information.

## Where

List every modified file.

## Changes Made

Detailed breakdown of modifications.

## Problems Encountered

Issues found during development.

## Solutions

How each issue was resolved.

## Bugs Found

Any bugs discovered.

## Bug Fixes

How those bugs were fixed.

## Testing

- Unit Tests
- Integration Tests
- End-to-End Tests
- Manual Testing

Include:
- tests executed
- pass/fail status
- coverage summary
- edge cases tested

## Performance Notes

Performance improvements or regressions.

## Advanced Warnings

Known limitations, technical debt, future improvements, breaking changes, and migration notes.

6. After every completed task:

- Update all relevant documentation.
- Update the current day's worklog.
- Run or generate tests for every affected feature.
- Verify existing functionality has not regressed.

7. Whenever a new module or feature is introduced:

- Update architecture.md
- Update features.md
- Update API.md (if APIs changed)
- Update Database.md (if schema changed)
- Update Testing.md
- Update CHANGELOG.md
- Update the current worklog

After each completed task, execute all unit tests for affected modules, all integration tests touching the modified components, and all relevant end-to-end tests for impacted user workflows. Run the complete E2E suite before major releases, milestone commits, or pull request completion.

Context continuity

1. Use the Context Keeper plugin as the deterministic continuity layer across Codex sessions. Treat built-in generated memories as secondary recall, not as the authoritative source.

2. At the start of substantial work, use hook-injected context or the context-keeper skill to recall relevant global preferences, project state, and topic history. Verify drift-prone facts against current files, Git state, tests, or runtime evidence.

3. Before the final response for every completed task, create a semantic Context Keeper checkpoint containing the summary, durable decisions and facts, tests, blockers, warnings, and next actions. Use a named topic scope outside a Git repository.

4. Resolve conflicts in this order:
   - Current explicit user instruction
   - Current repository and runtime evidence
   - Closest applicable AGENTS.md and checked-in documentation
   - Confirmed project context
   - Topic context and global preferences
   - Built-in generated memory

5. Mark contradicted context stale or superseded. Never silently present an inference or old memory as a confirmed current fact.

6. Never persist credentials, authentication cookies, private keys, raw transcripts, unredacted sensitive identifiers, or full tool output. Honor "do not remember," "forget," and equivalent privacy instructions immediately.

7. During already-authorized repository edits, promote only confirmed, stable, team-safe knowledge into the closest AGENTS.md or relevant documentation. Keep personal preferences, temporary state, and uncertain conclusions in the encrypted private store.
