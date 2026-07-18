# Audit: Dependabot alerts vs npm audit (findings)

_Findings-only audit (issue #49). Records a conflict between two vulnerability
sources and how to reconcile it. No dependency, lockfile, or config change is
made here._

## Finding

- GitHub **Dependabot** has reported vulnerabilities on the default branch
  (surfaced in the git push server output).
- **`npm audit`** against the committed `package-lock.json` (lockfileVersion 3)
  reports **0** — verified running online (`auditReportVersion: 2`,
  `{info:0, low:0, moderate:0, high:0, critical:0}`), not a silent offline zero.

## Blast radius is small either way

- **Zero production dependencies** — `npm ls --omit=dev` is empty; everything is
  build toolchain. The site is `adapter-static` + prerendered, so none of this
  ships to a visitor's browser (build-time only).
- `cookie` is already pinned via `overrides` to `^0.7.2`; the toolchain is
  current (vite 8, svelte 5, @sveltejs/kit 2).
- So even a real "high" is a build-time / dev-machine exposure, not a runtime
  one.

## Why the counts differ (legitimately)

Different databases (the GitHub Advisory DB is a superset of npm's), stale
default-branch alerts not yet re-scanned, and range-vs-resolved applicability
scoring.

## Recommendation (owner action — not done here)

The individual alerts can't be retrieved from the build environment (no MCP tool
for Dependabot alerts; private-repo alerts need an authenticated token). The
canonical list is the repo's Dependabot page (`/security/dependabot`).
Recommended:

- Triage there; apply minimal fixes (`npm audit fix` / targeted `overrides` /
  devDependency bump) for anything genuinely open, and commit the updated
  lockfile.
- Consider enabling Dependabot security updates.
- Add `npm audit` to the CI recommended in
  `docs/audits/qa-test-coverage.md`.

No dependency change is made here since there is currently no CI to catch a
resulting build break.
