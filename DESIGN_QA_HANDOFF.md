# Handoff — Design & UI/UX QA plan (next session)

**Date:** 2026-07-16
**Repo:** `aboveaveragerob/The_Portfolio` (GitHub MCP scope: `aboveaveragerob/the_portfolio`)
**State:** The redesign (PR #31) is **merged to `main`** — see `REDESIGN_SESSION_HANDOFF.md` for the
full implementation record and broader next-steps. **This doc is the QA/verification playbook** for the
next session: confirm each requested correction actually landed, looks right on real hardware/fonts, and
performs smoothly.
**Live to check:** production Netlify site (`moonlit-cobbler-0fa695`) once `main` deploys.

---

## 1. What was requested this session

Four owner-directed design goals (from `DESIGN_AUDIT.md` §8, originally raised in PR #27), with three
decisions the owner confirmed before the build:

| # | Request | Confirmed decision |
|---|---|---|
| 8.4 | **The page must never scroll** — every component fits one screen, rearranging if needed. | — |
| 8.1 | **Land pre-staged** with the Brinker Capital volume pulled from the shelf, ready to open. | Pulled out **+ gentle animated hint** (not auto-opened). |
| 8.2 | **A podium** for the open book to rest on. | Re-skin to the **cosmic palette** (no wood/gold). |
| 8.3 | **Elevate the "Library of the Stars"** backdrop — professional, not childlike. | **Deeper redesign**; shipped the **"richer"** variant after sign-off. |

Plus: fold in the high-leverage polish (a11y landmarks/skip link, WCAG-AA contrast, shared tokens,
spine-subtitle truncation, unified breakpoint).

## 2. What was completed this session

All four goals + the polish, merged to `main`. Files: `src/routes/+page.svelte` (no-scroll grid,
header/footer/skip link, staged state), `src/routes/+layout.svelte` (tokens, contrast, fallbacks),
`src/lib/components/Podium.svelte` (new), `ShelfPanel.svelte` (staged/pulsing spine, truncation,
breakpoint), `OpenBook.svelte` (eyebrow/gutter/gradient fallback), `Backdrop.svelte` (full redesign).

**In-session verification already done:** `npm run build` clean; headless Chromium asserted no page
scroll at 390/768/1280 px in landing/open/reading; book-rests-on-podium confirmed by measured boxes;
backdrop before/after signed off. **Caveat:** webfonts are proxy-blocked in-sandbox, so nothing about
*type* (FOUT, real font metrics, final spacing) was verified — that is explicitly deferred to next
session on real hardware.

## 3. Recommended audit steps for the next session

Goal: independently confirm the corrections hold, look right with **real fonts on real displays**, and
run **smoothly** (no jank, good Core Web Vitals). Work top-down.

### A. No-scroll (8.4) — the hardest constraint, re-verify broadly
- Re-run the headless assertion `document.scrollingElement.scrollHeight <= innerHeight` at **390 / 768 /
  1280**, in **landing, open, and reading** — then **extend** to cases not yet covered:
  - **Landscape mobile / very short heights** (e.g. 740×360, 812×375, 900×450) — the shelf+podium+book
    budget is tightest here.
  - **Large/tall desktop** (1440×900, 1920×1080) — confirm nothing floats awkwardly or over-stretches.
  - **Browser zoom 125–150%** and **200%** (WCAG reflow) — the `vh`/`clamp` sizing should hold.
- **Watch for clipped-not-scrolled content:** `overflow:hidden` can hide overflow instead of scrolling
  it. Assert the **CTA button, podium, and book footer are actually within the viewport** (visible
  bounding boxes), not merely that the page doesn't scroll. (This was the subtle bug caught mid-build.)
- Confirm the book's **internal** scroll (long chapters, the multi-page Music/Woodworking books) works
  and the page still doesn't scroll.

### B. Staged landing (8.1)
- On load: Brinker spine is raised, glowing, and gently pulsing; "Open the volume" opens it onto the
  podium; the pulse and the shelf accents read clearly with **real fonts**.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, the pulse and backdrop animation stop and
  the staged state still reads as "ready" (static highlight).
- Discoverability check with a fresh eye: is it obvious the shelves are interactive?

### C. Podium (8.2)
- The open book **visually rests** on the podium at every breakpoint (no float, no overlap, no gap) —
  re-check after any font swap, since type changes the book's intrinsic height.
- The podium reads as **one system** with the shelves/backdrop (cosmic palette), not a bolt-on.

### D. Backdrop (8.3) — judge on a real display
- Confirm the "richer" version reads **professional, not childlike** with true color and the webfonts
  present. Dials live at the top of `Backdrop.svelte` (star count, glow stops, ring opacity, drift/spin
  speeds) if tuning is wanted.
- **No hydration mismatch:** open the console on a hard load — the seeded starfield must render
  identically server/client (no Svelte hydration warning).
- Reduced-motion: drift, astrolabe spin, and twinkle all stop.

### E. Accessibility pass
- **Keyboard:** skip link works and lands focus in the reader; full tab order through shelves → open →
  TOC → reading → close is logical; visible focus ring everywhere.
- **Screen reader:** the `<h1>`/wordmark, `<nav>` shelves, and staged button announce sensibly.
- **Contrast on the new surfaces** over the animated backdrop: `empty-open` button, `empty-kicker`,
  `empty-hint`, `colophon` — re-measure against the brightest backdrop regions (the audit cleared the
  base tokens; these compositions are new).
- **Forced-colors / Windows High Contrast:** the gradient headline (solid fallback added) and alpha-hex
  hairlines don't vanish.

### F. Performance / "runs smoothly"
- **Lighthouse** (mobile + desktop) on the deploy/prod URL — capture Performance, Accessibility, Best
  Practices; note **CLS** (font swap + images) and **LCP**.
- **Animation smoothness:** DevTools Performance capture / FPS meter, especially on a **mid/low-end
  mobile** — the backdrop still runs a `mix-blend-mode: screen` layer over the body gradient + aurora.
  Confirm no sustained jank; if a low-end device struggles, consider dropping the blend there (audit
  §7.1).
- **Font loading:** verify FOUT/observed layout shift is acceptable now that real fonts load; the audit
  (§2.1) flagged the three render-blocking font stylesheets as a single point of failure — consider
  `preload` + `font-display` if shift is visible.
- **Bundle/asset check:** `Backdrop.svelte` is the largest component (now generated, but still a big
  inline SVG); confirm build size is reasonable and images use lazy loading (they do).

### G. Functional regression
- Full flow with no console errors: shelf → open → switch books → TOC → chapter → page-flip (prev/next)
  → Contents → close. Include a book with **images** (Eddie Bauer) and **audio** (Music) to exercise
  those page types.

### Tooling notes
- Playwright is global (Chromium at `/opt/pw-browsers`; do **not** run `playwright install`).
- `npm run preview` serves the built `build/` dir — **rebuild and restart** the preview between runs
  (a stale server serves the old build and yields incoherent measurements).
- A ready starting point for the no-scroll assertion + flow drive exists from this session; committing
  it as a **Playwright regression test** would make item A automatic going forward (see
  `REDESIGN_SESSION_HANDOFF.md` → Code stability).

---

## Exit criteria for sign-off
- No page scroll (and no clipped controls) across the breakpoint/zoom/orientation matrix in A.
- Staged landing, podium rest, and backdrop all read correctly **with real fonts on a real display**.
- Reduced-motion and keyboard/SR paths pass.
- Lighthouse Performance + Accessibility acceptable; no sustained animation jank on mid-range mobile.
- Full functional flow clean, no console errors/hydration warnings.
