# Audit — Dependabot Alerts vs. `npm audit`

**Date:** 2026-07-17
**Scope:** The dependency-vulnerability alerts GitHub reports for this repository.
**Status:** Findings only. This PR changes no dependencies, the lockfile, or any config — it
records a discrepancy and how to reconcile it. **The authoritative list of the individual
alerts is the repository's Dependabot page** (see "How to enumerate" below); it could not be
retrieved from the build environment, so this doc does not invent specific CVE identifiers.

---

## Finding

There is a **conflict between two vulnerability sources**:

- **GitHub Dependabot** reports **11 vulnerabilities on the default branch — 1 high, 9
  moderate, 1 low.** (Surfaced in the `git push` server output on every branch push.)
- **`npm audit`**, run in this environment against the committed `package-lock.json`
  (`lockfileVersion: 3`, 82 resolved packages), reports **0 vulnerabilities** of any severity.

`npm audit` was verified to be running **online**, not returning a silent offline zero:
`registry.npmjs.org` responded `HTTP 200`, and the audit report metadata came back with
`auditReportVersion: 2` and an all-zero severity table.

### Blast radius is small regardless of which count is "right"

This matters less than the raw "1 high" makes it sound, because of what these packages are:

- **Zero production dependencies.** `npm ls --omit=dev` resolves to *empty* — every entry in the
  tree is `devDependencies` / build toolchain. The site is `adapter-static` + `prerender`, so
  **none of this code ships to a visitor's browser**; it only runs at build time on trusted CI /
  the maintainer's machine.
- The manifest already carries a security pin: `overrides: { "cookie": "^0.7.2" }`
  (`package.json`), and `cookie` resolves to `0.7.2` in the lockfile — a deliberate prior
  remediation.
- Resolved toolchain versions are current: `vite 8.1.5`, `svelte 5.56.5`, `@sveltejs/kit
  2.69.3`, `@sveltejs/adapter-static 3.0.10`, `@sveltejs/vite-plugin-svelte 7.2.0`, plus
  transitives such as `postcss 8.5.19`, `nanoid 3.3.16`, `cookie 0.7.2`.

So even a genuine "high" here is a **build-time / developer-machine** exposure (e.g. a dev-server
or bundler advisory), not a runtime exposure to site visitors.

### Why the two numbers can legitimately differ

Common, non-alarming reasons Dependabot (11) and `npm audit` (0) disagree:

1. **Different databases.** Dependabot uses the **GitHub Advisory Database**, which is a superset
   of npm's audit source and often lists dev-tooling advisories (bundlers, dev servers) that
   `npm audit` either doesn't carry or resolves as non-applicable to the installed version.
2. **Stale alerts on the default branch.** Dependabot alerts are not auto-closed until a fix
   lands on the default branch *and* Dependabot re-scans; alerts can linger from an earlier
   lockfile state even after the resolved versions were bumped.
3. **Applicability / range scoring.** Dependabot flags a manifest whose declared range *could*
   resolve to a vulnerable version; `npm audit` evaluates the *actually resolved* version in the
   lockfile, which may already be patched.

None of these is evidence of a problem in the shipped site; they're accounting differences.

---

## How to enumerate the 11 (owner action — not possible from this environment)

The individual advisories were **not retrievable here**: there is no MCP tool to list Dependabot
alerts, and a private repo's alerts require an authenticated GitHub token this environment
doesn't hold. To see the actual list, the owner should:

1. Open **`https://github.com/aboveaveragerob/The_Portfolio/security/dependabot`** — the
   canonical list, with each advisory's package, severity, affected/patched ranges, and whether a
   safe upgrade exists.
2. Cross-check against a local `npm audit` (currently clean) to see which are already resolved in
   the lockfile vs. genuinely open.

## Recommendation (for a later PR — not done here)

1. **Triage on the Dependabot page.** For each alert, note package, severity, and whether it's
   runtime or build-only (expected: all build-only here).
2. **For anything genuinely open**, apply the minimal fix — `npm audit fix`, a targeted
   `overrides` pin (as already done for `cookie`), or a devDependency bump — and commit the
   updated `package-lock.json`. Pushing the fix to the default branch is also what clears stale
   Dependabot alerts.
3. **Consider enabling Dependabot security updates** (auto-PRs) so these are proposed and kept
   current without manual polling — appropriate given the build-only, low-blast-radius profile.
4. This pairs naturally with the CI recommendation in `docs/audits/qa-test-coverage.md`: a
   workflow that runs `npm audit` (or `--audit-level=high`) on PRs would surface regressions
   automatically.

### Not doing here

No dependency, lockfile, or config change is made in this PR. Bumping build toolchain versions
can shift build output and belongs in an explicit, testable PR — especially since there is
currently no CI to catch a resulting break (see `docs/audits/qa-test-coverage.md`).

---

## Evidence

| Claim | Method |
|---|---|
| Dependabot: 11 (1 high / 9 moderate / 1 low) | GitHub server message on `git push` |
| `npm audit`: 0 vulnerabilities | `npm audit` / `npm audit --json` metadata (`auditReportVersion: 2`) |
| Audit ran online, not offline-zero | `curl` → `registry.npmjs.org` `HTTP 200` |
| Zero production dependencies | `npm ls --omit=dev --all` → empty |
| `cookie` pinned to 0.7.2 | `package.json` `overrides`; lockfile resolved version |
| Toolchain versions | `package-lock.json` (`lockfileVersion: 3`, 82 packages) |
