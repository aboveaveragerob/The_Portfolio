# Handoff — Design implementation session (Robert Gregory / Alastair Zeved portfolio)

**Date prepared:** 2026-07-16
**Repo:** `aboveaveragerob/The_Portfolio` (old name `aboveaveragerob/alastair_zeved_designs`
still redirects; **GitHub MCP access is scoped to the old name** — use it for MCP calls)
**Stack:** SvelteKit + `adapter-static` (Svelte 5 / Vite 8, running in Svelte-5 compat mode),
deployed on Netlify (`moonlit-cobbler-0fa695`)
**Default branch:** `main`

---

## Purpose of the next session

**Implement the design fixes.** The audit and the owner's directives are already written down —
this session is the build. The source of truth is **`DESIGN_AUDIT.md`** on `main`/PR #31. Lead with
the four **owner-directed goals** in `DESIGN_AUDIT.md` §8; fold in the related polish items (§1–§7)
where they naturally belong. Nothing has been implemented yet — the prior session was audit-only.

Read `DESIGN_AUDIT.md` first, then this doc for the execution plan.

---

## What's already done (context)

- Security, SEO, a11y basics, headers, and the Svelte 5 / Vite 8 dependency upgrade are all merged
  (PRs #29, #30).
- **PR #31** added `DESIGN_AUDIT.md` — the full design audit (§1–§7 observations) plus **§8
  "Owner-directed design goals"**, which captures the four flaws the owner raised in the now-closed
  **PR #27 ("Broken Designs")**.
- PR #27 is **closed**; its findings live only in `DESIGN_AUDIT.md` §8 now.

---

## The four owner-directed goals (build these first)

From `DESIGN_AUDIT.md` §8. **Design 8.4 (no-scroll) first — it constrains the other three.** The
shelf, podium, and open book must be composed together to fit one fixed viewport at every breakpoint.

### 8.4 — The page must never scroll (High, do first)
**Current blocker:** `.stage` is `height:100dvh; overflow-y:auto` and vertically stacks shelves +
book, which forces scroll (`src/routes/+page.svelte:142–155`). The auto-`scrollIntoView` on open
(`+page.svelte:34–38`) exists precisely because content overflows.

**Approach:**
- Convert `.stage` to a fixed, non-scrolling viewport: `height:100dvh; overflow:hidden;` and lay it
  out as a grid/flex column with three regions — **shelf row (top)**, **podium + open book (center)**,
  and breathing room — sized with `minmax`/`fr` and `clamp()` so nothing overflows.
- The shelf already compacts when a book is open (`ShelfPanel.svelte:178–183`) — keep that; it frees
  vertical space for the centered book. The open book's `.book-area` currently
  `height: clamp(360px, 66vh, 620px)` (`+page.svelte:164–168`) will need to shrink to share the
  viewport with the shelf and podium.
- Remove/loosen the `scrollIntoView` logic once nothing scrolls.
- The **book's own inner content** (TOC list, reading prose) can still scroll *inside the page*
  (`.toc`/`.page-body` in `OpenBook.svelte` already do `overflow-y:auto`) — that's fine; it's the
  *page* that must not scroll.
- Validate at 390px (mobile), 768px, 1280px — this is the hardest constraint to satisfy on short
  mobile viewports; the single-page spread below 640px (`OpenBook.svelte:254–258`) helps.

### 8.1 — Land pre-staged with the Brinker volume pulled and ready to open (High)
**Book id:** `book-brinker` — the first book of the first shelf `shelf-professional`
(`src/lib/data.js:18`).

**Approach:**
- Replace the cold empty state ("Select a volume from the shelves", `+page.svelte:133–137`) with an
  inviting pre-staged view: the Brinker spine **pulled out** from the shelf (its `aria-current`
  raised-translateY treatment already exists, `ShelfPanel.svelte:138–141`) and a clear affordance to
  open it.
- **Confirmed state (owner):** Brinker lands *pulled forward and highlighted* (not auto-opened), with
  a **subtle animated hint** — a soft pulse and/or a small "Open" affordance — so it clearly reads as
  interactive. One click opens it onto the podium.
- Wire the staged state in `+page.svelte` init (`activeBookId = 'book-brinker'` staged, `currentBook`
  still `null` until opened) rather than in data. The animated hint should respect
  `prefers-reduced-motion` (reuse the pattern in `+page.svelte:21–31`).
- **Two scroll-free states to satisfy** for 8.4: the closed/staged landing *and* the book-open view
  must each fit one non-scrolling viewport.

### 8.2 — A podium for the open book to rest on (High)
An earlier branch already had this component — **restore and update it**. The removed file is
`src/lib/components/Podium.svelte` on branch `claude/with-love-math-portfolio-sxcvbm`. Its markup is
appended at the end of this doc for reference.

**Approach:**
- Reintroduce `Podium.svelte` and render it in `+page.svelte` directly beneath the open book so the
  book visually rests on it (the `.reader` block, `+page.svelte:114–138`).
- **Confirmed skin (owner): cosmic palette.** The old component references `--wood`, `--wood-lt`,
  `--wood-dk` and a `#D4AF37`/`#B89B5E` brass/gold palette that are **not** in the current token set
  (`+layout.svelte:15–39`). **Do not** add those tokens — instead re-skin the podium to the existing
  cosmic palette (`--violet`/`--pink`/`--bone-*`), keeping the sacred-geometry engraving, so it reads
  as one system. This also discharges §1 "two disconnected color systems."
- The podium must participate in the 8.4 no-scroll layout — size it with `clamp()` and let it
  collapse/hide on very short viewports if needed.

### 8.3 — Elevate the "Library of the Stars" aesthetic — professional, not childlike (Med–High)
Reshapes the backdrop (`DESIGN_AUDIT.md` §7). The current `Backdrop.svelte` is a hand-authored ~35 KB
SVG "colonnade" + starfield with `hue-rotate` + `mix-blend-mode: screen`.

**Approach (owner: deeper redesign, not just restraint):**
- Reshape the backdrop's **composition and depth**, not only its saturation — aim for a professional
  "Library of the Stars" (elegant depth, considered starfield, on-theme cosmology) rather than the
  current childlike colonnade. Reducing hue-cycling/saturation is table stakes, not the whole change.
- **Keep the constraints from §7/§6:** preserve the `prefers-reduced-motion` kill-switch
  (`Backdrop.svelte:59–61`) and watch GPU cost — the body gradient + aurora (`+layout.svelte:46–91`)
  already stack animated layers; don't add more blend-mode passes.
- This is the most subjective goal — **capture a before/after screenshot pair for the owner to sign
  off** before committing the rework.

---

## Fold-in polish (from §1–§7, do alongside the above where relevant)

- **§1 unify color systems** — the 15-color positional `PALETTE` in `ShelfPanel.svelte:7–11` and the
  hardcoded off-token colors (`#a06a2e`, `#3a322a`, `#d9d0bd`, and `--paper-2` defined-but-unused)
  should collapse into the `:root` tokens. The podium (8.2) and backdrop (8.3) work touches color
  anyway — unify as you go.
- **§4 breakpoints** — ShelfPanel uses 520px, OpenBook uses 640px. Introduce shared breakpoint
  values while you're rebuilding the layout for 8.4.
- **§3 contrast** — `--bone-2`/`--ink-3`/`ch-eyebrow`/`.ch-title` gradient text are the borderline
  cases; nudge them to pass AA if you retouch those surfaces.
- **§6 a11y** — add a visible heading/branding (the `<h1>` is screen-reader-only), a skip link, and
  landmark `<header>`/`<footer>`; the no-scroll rebuild is the moment to add these.

Full detail and `file:line` refs for each are in `DESIGN_AUDIT.md`.

---

## Branch handling

- Start from the latest `main` (PR #31 with the audit + §8 should be merged first, or rebase onto it
  so `DESIGN_AUDIT.md` is present).
- `git fetch origin main && git checkout -B <new-branch> origin/main` — use a **fresh branch** for the
  implementation (don't reuse the audit branch `claude/new-session-qf5im4` if its PR is merged; a
  merged PR is finished).
- Commit incrementally per goal (8.4 layout, 8.2 podium, 8.1 landing, 8.3 backdrop) so review is
  tractable. Open one PR for the redesign, ready for review.

---

## Verification

- `npm ci` (or reuse `node_modules`) → `npm run build` must stay clean.
- `npm run preview` (auto-picks a free port, e.g. 4173) + headless Chromium to drive and screenshot:
  - **No-scroll proof:** assert the document does not scroll (`document.scrollingElement.scrollHeight
    <= innerHeight`) at 390 / 768 / 1280 px, in both the landing state and with a book open.
  - **Landing:** Brinker spine is pulled/staged on load; one action opens it onto the podium.
  - **Podium:** the open book visually rests on the podium; nothing floats.
  - **Backdrop:** capture before/after for owner sign-off.
  - Re-run the existing functional flow (shelf → open → TOC → reading → page-flip → close) to confirm
    no regressions.
- Note the **sandbox font caveat:** external webfonts (Fraunces / Switzer / JetBrains Mono) are
  proxy-blocked in-sandbox, so screenshots render in fallback fonts — judge layout/spacing/color from
  them, not type; fonts load fine in production.

---

## Environment / access notes

- **Playwright** is available globally (`/opt/node22/lib/node_modules/playwright`, Chromium at
  `/opt/pw-browsers`, `PLAYWRIGHT_BROWSERS_PATH` set). Import as CommonJS default:
  `import pw from '.../playwright/index.js'; const { chromium } = pw;`. Do **not** run
  `playwright install`.
- **GitHub MCP** is scoped to the **old** repo name `aboveaveragerob/alastair_zeved_designs`
  (redirects to `The_Portfolio`); the canonical `The_Portfolio` name is rejected by the MCP scope.
- **Craft MCP** and some claude-code-remote tools require interactive OAuth/approval and are
  unavailable in automated sessions — not needed for this work.
- After pushing, open a PR (ready for review), then subscribe to its activity and let CI (Netlify
  deploy preview) confirm green.

---

## Reference — the removed `Podium.svelte` (for goal 8.2)

From `claude/with-love-math-portfolio-sxcvbm`. Restore and re-skin to the current palette (note the
`--wood*` / gold vars it needs, called out in 8.2 above):

```svelte
<div class="podium-wrap" aria-hidden="true">
  <!-- Top ledge -->
  <div class="podium-ledge"></div>

  <!-- Main body with sacred geometry SVG -->
  <div class="podium-body">
    <svg class="engraving" viewBox="0 0 600 80" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <!-- Flower of Life centered at (300, 40), radius 14, spacing 14 -->
      <g fill="none" stroke="#D4AF37" stroke-width="0.6" opacity="0.22" transform="translate(300,40)">
        <circle cx="0" cy="0" r="14"/>
        <circle cx="14" cy="0" r="14"/><circle cx="7" cy="12.1" r="14"/><circle cx="-7" cy="12.1" r="14"/>
        <circle cx="-14" cy="0" r="14"/><circle cx="-7" cy="-12.1" r="14"/><circle cx="7" cy="-12.1" r="14"/>
        <circle cx="28" cy="0" r="14"/><circle cx="21" cy="12.1" r="14"/><circle cx="14" cy="24.2" r="14"/>
        <circle cx="0" cy="24.2" r="14"/><circle cx="-14" cy="24.2" r="14"/><circle cx="-21" cy="12.1" r="14"/>
        <circle cx="-28" cy="0" r="14"/><circle cx="-21" cy="-12.1" r="14"/><circle cx="-14" cy="-24.2" r="14"/>
        <circle cx="0" cy="-24.2" r="14"/><circle cx="14" cy="-24.2" r="14"/><circle cx="21" cy="-12.1" r="14"/>
      </g>
      <!-- Brass rails -->
      <line x1="40" y1="4" x2="560" y2="4" stroke="#B89B5E" stroke-width="0.8" opacity="0.35"/>
      <line x1="40" y1="76" x2="560" y2="76" stroke="#B89B5E" stroke-width="0.8" opacity="0.35"/>
      <!-- Subtle wood-grain strokes -->
      <line x1="0" y1="25" x2="600" y2="25" stroke="#ffffff" stroke-width="0.4" opacity="0.04"/>
      <line x1="0" y1="45" x2="600" y2="45" stroke="#ffffff" stroke-width="0.4" opacity="0.04"/>
      <line x1="0" y1="60" x2="600" y2="60" stroke="#ffffff" stroke-width="0.4" opacity="0.04"/>
    </svg>
  </div>

  <!-- Shadow beneath -->
  <div class="podium-shadow"></div>
</div>

<style>
  .podium-wrap { width: 100%; max-width: 640px; display: flex; flex-direction: column; align-items: stretch; user-select: none; }
  .podium-ledge { height: 10px; background: linear-gradient(to bottom, #4A3020, var(--wood-lt)); border-radius: 4px 4px 0 0; box-shadow: 0 -1px 0 rgba(184,155,94,0.25); }
  .podium-body { height: 80px; background: linear-gradient(to bottom, var(--wood) 0%, var(--wood-dk) 100%); position: relative; overflow: hidden; }
  .engraving { width: 100%; height: 100%; display: block; }
  .podium-shadow { height: 12px; background: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent); border-radius: 0 0 4px 4px; }
</style>
```

---

## Owner decisions (confirmed — build to these)

These three were confirmed by the owner; they are no longer open. The goal sections above already
reflect them:

1. **8.1 landing** → **Pulled out + gentle hint.** Brinker lands pulled forward and highlighted on the
   shelf (not auto-opened), with a subtle animated cue (soft pulse and/or an "Open" affordance) so
   first-time visitors clearly read it as interactive. This means **two scroll-free layout states** to
   fit — closed/staged landing and book-open — both within one non-scrolling viewport.
2. **8.2 podium skin** → **Cosmic palette.** Re-skin the restored podium to the existing
   violet/pink/bone tokens (keep the sacred-geometry engraving), *not* the old wood/brass look — one
   coherent system. This also discharges §1 "two disconnected color systems." Do **not** add
   `--wood*`/gold tokens.
3. **8.3 backdrop** → **Deeper redesign.** Go beyond desaturation: reshape the backdrop's composition
   and depth toward a professional "Library of the Stars," not just calming the current colonnade.
   Still capture **before/after screenshots for owner sign-off** before committing, and keep the
   §6/§7 constraints (reduced-motion kill-switch; watch GPU cost — don't pile on blend-mode passes).
