# Audit — Leftover / Duplicate Files

**Date:** 2026-07-17
**Scope:** Tracked files at the repo root that are stale or duplicated elsewhere.
**Status:** Findings only. This PR deletes nothing — it documents the clutter and the
recommended removals so the owner can confirm before anything is deleted.

---

## Finding

Three tracked files at the repository root are dead weight: a legacy full-site copy and two
exact duplicates of files that already live in `static/`. Only `static/` is published
(`svelte.config.js` → `adapter-static`, publish dir `build`, populated from `static/`), so the
root copies are never served — they only add confusion and bytes to every clone.

| Path | Size | Status | Notes |
|---|---:|---|---|
| `index.html` (root) | 136 KB (136,025 B) | tracked, **stale** | Pre-SvelteKit single-file version of the whole site. Not part of the `build/` output, so never deployed. It carries a full, now-divergent copy of the content — a trap for anyone who edits it expecting it to be live. |
| `og-image.png` (root) | 723 KB (723,398 B) | tracked, **duplicate** | Byte-for-byte identical to `static/og-image.png` (verified with `cmp`). Only the `static/` copy ships; the meta tags reference `https://alastairzeved.com/og-image.png`, served from the build. |
| `robots.txt` (root) | 23 B | tracked, **duplicate** | Byte-for-byte identical to `static/robots.txt`. Only the `static/` copy ships. |

### Verified clean (no action)

- `build/` and `.svelte-kit/` exist on disk but are correctly listed in `.gitignore` and are
  **not tracked** (`git ls-files build .svelte-kit` → empty). No generated artifacts are
  committed.

---

## Recommendation (for a later PR — not done here)

1. **Delete the root `index.html`.** It is a stale pre-SvelteKit artifact, not referenced by the
   build. Before deleting, confirm nothing external links to `/index.html` at the repo root
   (nothing in-repo does) — the live site's `index.html` is generated into `build/` from the
   SvelteKit routes, independent of this file.
2. **Delete the root `og-image.png` and root `robots.txt`.** They are exact duplicates of the
   `static/` copies that actually ship; removing them leaves a single source of truth.

Net effect: ~860 KB removed from the tracked tree and one less way to accidentally edit the
"wrong" copy. No runtime behavior changes — none of these files are in the deploy.

### Why documented, not deleted

Per the audit-only scope of this work, deletions are left for an explicit follow-up so the owner
can confirm the legacy root `index.html` isn't wanted as a reference/archive before it's removed.

---

## Evidence

| Claim | Method |
|---|---|
| All three tracked at root | `git ls-files index.html og-image.png robots.txt` → all listed |
| `og-image.png` / `robots.txt` identical to `static/` copies | `cmp -s` → identical |
| Only `static/` ships | `svelte.config.js` (adapter-static, publish `build`); `netlify.toml` publish dir |
| `build/`, `.svelte-kit/` not tracked | `.gitignore` covers them; `git ls-files` → empty |
