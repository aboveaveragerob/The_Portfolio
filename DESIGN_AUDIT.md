# Design Audit — Robert Gregory / Alastair Zeved Portfolio

**Date:** 2026-07-16
**Scope:** Visual/UX design review only. No source changes were made — every finding is a
recommendation for a future implementation session.
**Method:** Static review of the SvelteKit source + design tokens, WCAG contrast math on the
palette, and a live visual pass (`npm run preview` driven by headless Chromium at 1280px
desktop and 390px mobile, capturing the shelf, open-book TOC, reading, image, and audio views).

> **Sandbox caveat:** external webfonts (Fraunces / Switzer / JetBrains Mono) are proxy-blocked
> in the audit sandbox, so the captured screenshots render in fallback fonts. Typography
> *appearance* findings are therefore driven by the source; screenshots were used to judge
> layout, spacing, color, truncation, and responsive behavior — none of which depend on the font.

Every finding cites `file:line` so it can be acted on directly. Severity is **High** (hurts
usability, accessibility, or credibility for real visitors), **Medium** (noticeable polish gap),
or **Low** (nice-to-have / maintainability).

---

## Summary

The site is a genuinely distinctive piece of design: a "library" metaphor where a career and a
maker practice are shelved as books, opened into a two-page spread, and read with a CSS page-flip.
The typographic system (Fraunces display serif + Switzer body + JetBrains Mono metadata), the
cream-paper-on-cosmic-dark contrast, and the restrained motion are all working well. The bones are
strong — this audit is about polish, consistency, and a few real accessibility/legibility gaps, not
a redesign.

> **Owner-directed goals:** Beyond the observations below, the site owner raised four explicit
> design goals in PR #27 ("Broken Designs"). Those are captured in [§8](#8-owner-directed-design-goals-from-pr-27) —
> they are *direction-setting requirements* (what the design should become) and should anchor the
> next implementation pass, whereas §1–§7 are audit observations.

**Top 5 highest-leverage fixes:**

1. **Desktop spine subtitles are truncated mid-word** — "Feb 2021 – Pre", "The credential…",
   "Tending the ur…". The dates/taglines are clipped into nonsense on the primary desktop view.
   (High — [§4](#4-layout--spacing), [§5](#5-the-bookshelf-ux))
2. **`--ink-3` metadata text fails WCAG AA** (3.35:1) — it's the color of nearly all the small mono
   captions, folios, page counts, and dates on the cream page. (High — [§3](#3-color--contrast))
3. **`.ch-eyebrow` orange (`#a06a2e`) fails AA** (3.88:1) for the per-chapter kicker label.
   (Medium — [§3](#3-color--contrast))
4. **Two disconnected color systems** — the `:root` design tokens vs. a separate 15-color
   positional `PALETTE` in `ShelfPanel`, plus a scatter of off-token hardcoded hexes. Makes the
   palette hard to reason about and evolve. (Medium — [§1](#1-design-system--tokens))
5. **Vast horizontal dead space on wide desktop** — content lives in a ~40%-wide center column while
   the decorative colonnade fills the sides; the layout doesn't earn the full viewport.
   (Medium — [§4](#4-layout--spacing))

---

## 1. Design system & tokens

The token block in `src/routes/+layout.svelte:15–39` is a good foundation — semantic names
(`--ink`, `--bone-*`, `--paper`), a display gradient, and font-family vars. The problems are around
it, not in it.

| # | Severity | Finding | Where |
|---|---|---|---|
| 1.1 | Medium | **Two parallel color systems.** Spine accents come from a hardcoded 15-hex `PALETTE` that lives only in the component and is **assigned by global book position** (`i % 15`), not by meaning. Adding or reordering a book reshuffles every downstream accent, and none of these 15 colors are represented in the `:root` tokens. | `ShelfPanel.svelte:7–23` |
| 1.2 | Medium | **Off-token hardcoded colors** bypass the system: `.ch-eyebrow` `#a06a2e`, `.prose` `#3a322a`, the page-gutter `#d9d0bd` (twice), and many alpha literals (`#000000xx`, `#ffffffxx`) for borders/shadows. A future palette change can't reach them. | `OpenBook.svelte:241,250,338,353` + borders at `309,326,334,361,378,383`; `ShelfPanel.svelte:107,127,132–133` |
| 1.3 | Low | **`--paper-2` (`#e9e0cd`) is defined but never used** — the page gutters hardcode `#d9d0bd` instead. Either wire the token in or drop it. | `+layout.svelte:25` vs `OpenBook.svelte:241,250` |
| 1.4 | Low | **No spacing/radius/breakpoint scale.** Spacing is ad-hoc `clamp()` calls and raw px per component; border-radii range `2px–12px` with no rhythm. A small set of `--space-*` / `--radius-*` tokens would make spacing decisions consistent and reviewable. | throughout |

**Recommendation:** Promote the spine palette into tokens (`--accent-1..n` or, better, assign a
*fixed* accent per shelf/domain so color carries meaning). Replace the scattered hex/alpha literals
with tokens (add `--line-ink`, `--paper-edge`, `--ink-eyebrow`). Introduce a minimal spacing/radius
scale.

---

## 2. Typography

The three-family system is well-chosen and consistently applied: **Fraunces** for display/titles
(incl. italic shelf headers), **Switzer** for body prose, **JetBrains Mono** for all-caps metadata,
folios, and eyebrows. Fluid `clamp()` sizing scales cleanly from mobile to desktop.

| # | Severity | Finding | Where |
|---|---|---|---|
| 2.1 | Medium | **External fonts are a single point of failure with no graceful path.** Three render-blocking `<link>` stylesheets (Google Fonts ×2 + Fontshare) load the *entire* type system; the only fallbacks are Georgia / system-ui. If Fontshare or Google Fonts is slow or blocked, the whole typographic identity collapses. Consider self-hosting (or at least `<link rel="preload">` + a tuned fallback stack with `size-adjust` to cut FOUT/layout shift). | `app.html:21–25` |
| 2.2 | Low | **Some mono sizes are very small.** `.sp-year` at `.5rem` and figcaptions at `.58rem` are near the floor of comfortable legibility, and they're paired with the low-contrast colors flagged in §3 — the two problems compound. | `ShelfPanel.svelte:172`; `OpenBook.svelte:363` |
| 2.3 | Low | **Body prose line length is well-tuned** (`max-width: 60ch`, `line-height: 1.62`) — no change needed; noted as a positive to preserve. | `OpenBook.svelte:353` |

---

## 3. Color & contrast

Contrast was computed against the base backgrounds (`--bg` `#0b0912`, `--paper` `#f3ecdd`, spine
`~#1e1529`). Values are the WCAG 2.1 contrast ratio; **AA** requires 4.5:1 for normal text, 3.0:1
for large/bold (≥24px, or ≥18.66px bold).

**This corrects a prior assumption:** `--bone-2` muted text is *fine* — it clears AA on both the
page background (6.03:1) and the spine (5.36:1). The real failures are on the cream page.

| # | Severity | Pair | Ratio | Verdict |
|---|---|---|---|---|
| 3.1 | **High** | `--ink-3` `#8a7f6c` on `--paper` — used for **captions, folios, page counts (`Np`), the `FEB 2021 — PRESENT` sub-line, `CONTENTS` label, endpaper sub** | **3.35:1** | **Fails AA** for normal text (all these are small, normal-weight) |
| 3.2 | Medium | `.ch-eyebrow` `#a06a2e` on `--paper` — the per-chapter kicker (e.g. "BRINKER CAPITAL") | **3.88:1** | **Fails AA** for normal text |
| 3.3 | Low | `.ch-title` gradient (`--grad-ink`) as `background-clip:text` transparent text on paper | 3.08–5.22:1 across stops | Passes AA-large (barely, at the orange stop), but see 3.4 |
| 3.4 | Medium | **Gradient headline is `color: transparent`** — if `background-clip:text` isn't honored (older engines, some forced-colors / Windows High Contrast modes, and print) the title becomes **invisible**. No solid `color` fallback is set. | `OpenBook.svelte:344–350`, `+layout.svelte:93–98` |
| 3.5 | Low | Spine accent hues `#8b5e3c` (3.15:1) and `#7c5cff` (4.05:1) are low against the dark spine, but they're **decorative** (3px top-border + emblem, non-text) so this is minor — noted for completeness. | `ShelfPanel.svelte:7–11` |
| 3.6 | ✅ | `--ink` (14.5:1), `--ink-2` (6.5:1), `--prose #3a322a` (10.7:1), `--bone-0/1/2` on dark all **pass** — the primary reading text is solid. | — |

**Recommendation:** Darken `--ink-3` to ~`#6f6455` (≈4.5:1) so the small metadata clears AA, and
darken the eyebrow to ~`#8a5a1f`. For 3.4, add a solid `color` fallback on `.ch-title`/`.gradtext`
(e.g. `color: var(--ink)` before the `background-clip` override, or a `@supports` guard) so the
headline never vanishes.

---

## 4. Layout & spacing

| # | Severity | Finding | Where |
|---|---|---|---|
| 4.1 | **High** | **Desktop spine subtitles truncate mid-word.** The vertical `.sp-year` is clipped by `max-height:74px; overflow:hidden`, so on desktop the shelf shows garbled fragments — "Feb 2021 – Pre", "2019 – 2021" ok but "The credential…", "The skills beh…", "Tending the ur…", "Growing with i…". This is the *first thing a desktop visitor reads* and it looks broken. (Mobile sidesteps it by hiding `.sp-year` entirely below 520px — which is why mobile actually reads cleaner.) | `ShelfPanel.svelte:166–176` (`sp-year`), `188` |
| 4.2 | Medium | **Large horizontal dead space on wide desktop.** The shelves + book cap at `max-width: 920px`/`760px` and sit centered; on a ≥1280px screen the outer ~40% is just the decorative colonnade. The composition reads as a narrow strip floating in a lot of emptiness rather than a designed full-bleed layout. | `+page.svelte:165`, `ShelfPanel.svelte:59` |
| 4.3 | Medium | **Inconsistent breakpoints.** `ShelfPanel` switches at `520px`, `OpenBook` at `640px`. There are no shared breakpoint tokens, so responsive behavior changes at two different widths for no principled reason. | `ShelfPanel.svelte:185` vs `OpenBook.svelte:254` |
| 4.4 | Medium | **Static left endpaper eats 42% of the open spread.** During *reading*, the left page never changes — it permanently shows the book title/ornament while all content is crammed into the right 58%. On desktop this is a lot of prime real estate spent on a fixed decoration, and it makes short chapters feel cramped on the right while the left sits empty. | `OpenBook.svelte:238–246`, `82–103` |
| 4.5 | Low | **Short pages leave a large empty cream void.** `.page-body { flex:1 }` pushes the footer to the bottom, so a 2-sentence page shows a big blank paper area above the nav. Consider centering short content or capping the page height to content. | `OpenBook.svelte:352`, `337` |
| 4.6 | Low | **Close button (`✕`) is positioned outside the book** at `top:-16px; right:-6px`. It clears the compacted shelves in the captures, but with a different shelf count / zoom it risks overlapping the spine row above. Worth a sanity check at more breakpoints. | `OpenBook.svelte:211–214` |

**Recommendation:** For 4.1, drop the `max-height` clip and either let the subtitle size to the spine
or truncate deliberately with an ellipsis / show it only on hover/active. For 4.2/4.4, consider a
wider `max-width` and/or letting the reading view expand toward a single wide page on large screens
so content uses the space the decoration currently occupies. Unify breakpoints on shared tokens.

---

## 5. The bookshelf UX

The core interaction — shelf → open two-page book → chapter TOC → page-flip reading — is
**genuinely delightful and reads clearly** in the captures. The compaction of the shelves when a book
opens, the scroll-into-view, and the 300ms flip all feel intentional. Refinements:

| # | Severity | Finding | Where |
|---|---|---|---|
| 5.1 | Medium | **No scroll affordance on the shelf rail.** `.shelf-books` is `overflow-x:auto` with the scrollbar hidden (`scrollbar-width:none`). When a shelf has more books than fit (e.g. the 6-book Professional shelf on a narrow window), there's no visual cue that more books exist to the right. | `ShelfPanel.svelte:92–96` |
| 5.2 | Medium | **Opening a book hides all other titles.** In the compacted state the spines collapse to color emblems only (`.sp-title`/`.sp-year` set to `display:none`), so while reading you lose all wayfinding to the other books — you can see *that* there are others, but not *which*. Consider keeping a tiny label or a tooltip-on-hover in the compact state. | `ShelfPanel.svelte:181–183` |
| 5.3 | Low | **Empty state is quiet.** The initial "Select a volume from the shelves" is a single low-emphasis mono line (`--bone-2`, `.72rem`) far below the shelves; a first-time visitor may not register the shelves are interactive. A little more invitation (a subtle hint or a pre-opened first book) would aid discoverability. | `+page.svelte:135,192–198` |
| 5.4 | Low | **Duplicated animation magic numbers.** The fly/fade durations in `+page.svelte` exist twice — once as Svelte transition props (`flyInDur` etc.) and again as hand-matched `sleep()` values (`380`/`420`). They must be kept in sync by hand or the state machine desyncs from the visible animation. Derive one from the other. | `+page.svelte:28–31,47,57,88` |

---

## 6. Motion & accessibility

Motion handling is a strength: `prefers-reduced-motion` is respected in **four** places — the body
gradient/aurora (`+layout.svelte:114`), the book flip (`OpenBook.svelte:304`), the backdrop
(`Backdrop.svelte:59`), and the JS fly/fade durations (`+page.svelte:21–31`). Focus styling exists
globally (`:focus-visible` violet ring, `+layout.svelte:108`) and `aria-current` marks the open
book. Gaps:

| # | Severity | Finding | Where |
|---|---|---|---|
| 6.1 | Medium | **No visible page heading or branding.** The only `<h1>` ("Robert Gregory — Career & Craft") is visually hidden (`.vh`). A sighted visitor lands on shelves with **no name, logo, or title** anywhere on screen — for a personal portfolio that's a lost identity/credibility cue. | `+page.svelte:104,182–190` |
| 6.2 | Medium | **No landmarks or skip link.** There's no `<header>`/`<footer>`, and no skip-to-content link. Screen-reader and keyboard users get a flat structure. (Each shelf is a `<nav>`, which is good, but there's no top-level page structure around them.) | `+page.svelte:103–139` |
| 6.3 | Low | **Spine subtitle is only in a `title` attribute.** The date/tagline is exposed via `title="…"` (hover tooltip), which is unreliable for keyboard and touch users. Given §4.1 already clips the visible subtitle on desktop, the info is effectively inaccessible to several user groups. | `ShelfPanel.svelte:36` |
| 6.4 | Low | **Forced-colors mode.** The gradient-clipped transparent headline (§3.4) and the alpha-hex hairline borders can disappear under Windows High Contrast / `forced-colors`. A `@media (forced-colors: active)` pass would harden it. | `OpenBook.svelte:344–350` |

---

## 7. The animated backdrop

`Backdrop.svelte` (the largest component, ~35 KB) is a hand-authored inline SVG "colonnade" — arches,
a perspective floor, two side bookshelves of ~120 tiny colored `<rect>` spines — plus a starfield with
per-`nth-child` twinkle. It's decorative-only (`aria-hidden`, `pointer-events:none`) and reduced-motion
disables it. In the captures it reads as an atmospheric, on-theme "grand library."

| # | Severity | Finding | Where |
|---|---|---|---|
| 7.1 | Medium | **GPU cost on low-end mobile.** The backdrop runs `hue-rotate` + `mix-blend-mode: screen` on a large surface, *on top of* the body's animated multi-radial gradient and the `body::before` aurora (also `mix-blend-mode: screen`). Three simultaneous animated blend/gradient layers is a lot of continuous compositing for a phone. Worth profiling on a mid/low device and considering dropping the blend modes there. | `Backdrop.svelte:53–57`; `+layout.svelte:46–86` |
| 7.2 | Low | **Unmaintainable by hand.** All ~120 spine rects and their colors are hardcoded coordinates; the star twinkle uses `nth-child` selectors that silently break if node order changes. If the backdrop is ever iterated on, it should be generated (a small `{#each}` loop over data) rather than hand-edited. | `Backdrop.svelte` (whole) |
| 7.3 | Low | **Competes for attention at wide widths.** Because the content column is narrow (§4.2), the animated backdrop occupies more of the screen than the content on large desktops. If §4.2 is addressed, this eases automatically. | — |

---

## 8. Owner-directed design goals (from PR #27)

These four items were raised by the site owner in PR #27 ("Broken Designs") as flaws in the current
live design. Unlike §1–§7 (observations), these are the owner's **explicit intent** — captured here
so the audit is the single source of truth, with PR #27 closed in favor of this record. They are
larger, redesign-scale efforts and should be the primary driver of the next implementation session.

> Context: an earlier redesign branch (`claude/with-love-math-portfolio-sxcvbm`) already contained a
> `Podium.svelte` component (~89 lines) that current `main` dropped — directly relevant to 8.2, and a
> useful reference when reintroducing it.

| # | Severity | Goal | Relation to this audit / current state |
|---|---|---|---|
| 8.1 | High | **Land with the Brinker Capital volume already pulled from the shelf and ready to open** — the site should open in an inviting, pre-staged state, not a cold shelf. | Extends §5.3 (quiet empty state / discoverability). Today the landing state is the low-emphasis "Select a volume from the shelves" with no book staged (`+page.svelte:133–137`). |
| 8.2 | High | **Add a "podium" for the opened book to rest on** — the book needs to land somewhere and sit on top of something, not float in space. | New compositional element. Reference the removed `Podium.svelte` from the `claude/with-love-math-portfolio-sxcvbm` branch. Interacts with the shelf→book layout (`+page.svelte:114–138`). |
| 8.3 | Med–High | **Improve the "Alchemical Cosmology Library of the Stars" aesthetic** in the background and star components — richer and more on-theme, but **professional, not childlike**. | Directly reshapes §7 (the backdrop). Any rework must keep the reduced-motion coverage (§6) and the GPU-cost constraints (§7.1) in mind — the current triple animated blend-layer stack is already heavy. |
| 8.4 | High | **The page must never scroll** — every component should always fit on screen at once, rearranging the layout if necessary. | Conflicts with the current design: `.stage` is `height:100dvh; overflow-y:auto` and stacks shelves + book vertically, which forces scroll (§4.2, §4.4). No-scroll likely means the compacted shelves, a smaller/repositioned book, and the 8.2 podium share one fixed viewport. This also subsumes the "reclaim horizontal space" idea in §4.2. |

**Note:** 8.4 (no-scroll) is the most structurally demanding — it constrains 8.1, 8.2, and the whole
layout at once, so it should be designed first, with the shelf, podium, and book composed together to
fit a single viewport across breakpoints.

---

## Prioritized recommendations

Ranked by impact ÷ effort (do the top rows first). All are suggestions for a future implementation
session — nothing here was changed.

The **owner-directed goals (§8)** sit outside this ranking: they are larger, redesign-scale efforts
and are the owner's stated priority for the next pass, so tackle them as a coordinated design task
(lead with 8.4 no-scroll, which constrains the rest) rather than as isolated quick fixes. Several of
the polish items below fold naturally into that work — e.g. §4.2 horizontal space into 8.4, §5.3
empty state into 8.1, and §7 backdrop into 8.3.

| Priority | Fix | Sev | Effort | Refs |
|---|---|---|---|---|
| A (owner) | No-scroll: fit shelf + podium + book in one fixed viewport across breakpoints | High | L | 8.4 |
| B (owner) | Land pre-staged with the Brinker volume pulled and ready to open | High | M | 8.1 |
| C (owner) | Reintroduce a podium for the open book to rest on | High | M | 8.2 |
| D (owner) | Elevate the "Library of the Stars" backdrop/star aesthetic — professional, not childlike | Med–High | M | 8.3 |
| 1 | Fix desktop spine subtitle truncation (remove `max-height` clip / ellipsis / hover) | High | S | 4.1 |
| 2 | Darken `--ink-3` → ~`#6f6455` to clear AA for all small metadata | High | S | 3.1 |
| 3 | Add solid `color` fallback to gradient headline so it never vanishes | Med | S | 3.4 |
| 4 | Darken `.ch-eyebrow` → ~`#8a5a1f` to clear AA | Med | S | 3.2 |
| 5 | Add a visible name/wordmark (surface the `<h1>`) + a `<header>` landmark | Med | S | 6.1, 6.2 |
| 6 | Add scroll affordance (fade/edge cue) to overflowing shelf rails | Med | S | 5.1 |
| 7 | Unify breakpoints on shared tokens (`--bp-sm`, `--bp-md`) | Med | S | 4.3 |
| 8 | Replace off-token hex/alpha literals with tokens; wire in `--paper-2` | Med | M | 1.2, 1.3 |
| 9 | Make spine accents semantic (per-shelf) + promote `PALETTE` into tokens | Med | M | 1.1 |
| 10 | Derive `sleep()` durations from the transition-duration constants | Low | S | 5.4 |
| 11 | Reclaim desktop horizontal space (wider max-width / expand reading page) | Med | M | 4.2, 4.4 |
| 12 | Self-host or preload fonts + tuned fallback stack to kill the SPOF/FOUT | Med | M | 2.1 |
| 13 | Profile the triple animated-blend backdrop on low-end mobile; drop blend there | Med | M | 7.1 |
| 14 | Keep a wayfinding label in the compacted-shelf state | Low | M | 5.2 |
| 15 | Center/short-page layout so sparse chapters don't show a cream void | Low | S | 4.5 |

**What's already good (leave alone):** the reading typography and measure (§2.3), the primary text
contrast (§3.6), the reduced-motion coverage (§6), the core shelf→book→flip interaction (§5), and the
`aria-current`/`<nav>` semantics.
