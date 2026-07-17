# Audit — Design-Token & CSS Consistency

**Date:** 2026-07-17
**Scope:** CSS custom-property ("design token") usage across the layout and components.
**Status:** Findings only. This PR adds no code changes — it records where the token system
has drifted from the CSS so a future cleanup PR can consolidate it. **Low risk; no visual
change is intended by the eventual fix** (the recommendations resolve to the same rendered
colors, since the literals already equal the token values).

---

## Why this matters

The redesign deliberately introduced a shared "cosmic" palette so "the whole composition reads
as one system (no separate wood/gold palette)" — see the comment at `src/routes/+layout.svelte:35`.
That intent is undermined wherever a component hardcodes the literal hex instead of referencing
the token: the single source of truth silently forks, and a future palette tweak to the token
will *not* propagate to the hardcoded copies.

---

## Findings

### 1. Literal hex that duplicates existing tokens

The cosmic-surface tokens are defined once (`+layout.svelte:37-40`):

```css
--surface-1: #241a33;  --surface-2: #160f22;
--ledge-hi:  #3c3552;  --ledge-lo:  #191524;
```

`Podium.svelte` references them correctly via `var(...)`. But `ShelfPanel.svelte` re-types the
same literals:

| Location | Code | Duplicates |
|---|---|---|
| `ShelfPanel.svelte:127` | `linear-gradient(100deg, #241a33, #160f22)` | `--surface-1` / `--surface-2` |
| `ShelfPanel.svelte:108` | `linear-gradient(180deg, #3c3552, #191524)` | `--ledge-hi` / `--ledge-lo` |

So the two components that paint the *same* cosmic surfaces are inconsistent about how they get
the color. **Fix:** replace the literals in `ShelfPanel.svelte` with `var(--surface-1)` etc.

### 2. Raw ink/line values in `OpenBook.svelte` that bypass the ink/line tokens

`OpenBook.svelte` uses many one-off hex values instead of the `--ink*` / `--line*` tokens:

- `:206` `background: #0d0a14;` and `:218` `background: #140d22;` — bespoke near-black surfaces.
- `:356` `.prose { color: #3a322a; ... }` — a body-text ink that is neither `--ink` (`#211b16`)
  nor `--ink-2` (`#5b5247`).
- Numerous one-off translucent borders: `#ffffff10` (`:207`), `#00000014` (`:326`), `#0000001a`
  (`:309`), `#00000040` (`:334`), `#00000018` (`:364`), `#00000016` (`:381`), `#0000001f` (`:386`),
  plus inset-shadow alphas (`:242`, `:251`).

These are the same "hairline on paper / on void" role the `--line` / `--line-2` tokens exist for.
**Fix:** introduce (or reuse) tokens for the recurring paper-hairline and void-surface values and
reference them; keep genuinely one-off shadows inline but comment them.

### 3. Three uncoordinated color sources for a "book"

A book's accent color can come from three unrelated places:

1. `book.coverColor` in `src/lib/data.js` — defined on **all 16 books** (e.g. `data.js:21`
   `'#1A2A3A'`, `:61`, `:77` …) but **read by no component** (only referenced in the header
   doc-comment `data.js:5`). Dead data.
2. The 15-entry `PALETTE` array in `ShelfPanel.svelte:8-12`, assigned round-robin by book index —
   this is what actually renders the spine accent.
3. The root `--pink` / `--violet` / gradient tokens used elsewhere.

**Fix:** pick one source. Either delete the unused `coverColor` field, or make the spine accent
read `coverColor` (moving the palette decision into the content/data layer) and retire the
`PALETTE` array — but not keep both plus a dead field.

### 4. Dead / unusable tokens

- **Unused:** `--paper-2` (`:25`) and `--line` (`:17`) are defined but never referenced via
  `var()` anywhere in `src/` (only `--line-2` is used). Verified by grep.
- **Unusable as written:** `--bp-sm: 640px` (`:50`) and `--bp-md: 900px` (`:51`) are commented
  "used in media queries," but CSS `@media` queries **cannot read custom properties** — every
  `@media` in the codebase hardcodes the literal `640px`, and `--bp-md` (900px) is never
  referenced at all. The tokens document intent but can't be consumed.

**Fix:** remove `--paper-2` and `--line` if truly unused (or wire them up), and either drop the
`--bp-*` tokens or convert breakpoints to a build-time mechanism (SCSS variable / PostCSS) that
can actually inject them into `@media`.

---

## Evidence (all re-verified against current source at time of writing)

| # | Claim | Source |
|---|---|---|
| 1 | Token definitions | `+layout.svelte:37-40` |
| 1 | Hardcoded duplicates | `ShelfPanel.svelte:108`, `:127` |
| 1 | Correct `var()` usage for contrast | `Podium.svelte` |
| 2 | Raw ink/line values | `OpenBook.svelte:206,207,218,326,309,334,356,364,381,386` |
| 3 | Unused `coverColor` on every book | `data.js:5,21,61,77,…` (16 books); no component reads it |
| 3 | Active spine palette | `ShelfPanel.svelte:8-12` |
| 4 | `--paper-2`, `--line` unused | grep of `src/` for `var(--paper-2)` / `var(--line)` → none |
| 4 | `--bp-*` never consumed | grep for `var(--bp-` → none; only defs + one comment |

## Note

None of the above is a rendering bug today — the literals equal the token values, so the site
looks correct. These are maintainability findings: the value of consolidating is that a future
palette change happens in one place and can't half-apply.
