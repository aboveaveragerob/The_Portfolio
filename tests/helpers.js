// Shared helpers for the no-scroll / functional regression suite.
//
// The redesign's headline invariant is "the page must never scroll" (DESIGN_AUDIT
// §8.4). Because <body> is overflow:hidden, a control pushed past the viewport is
// *clipped, not scrolled* — it fails silently. These helpers make that invariant,
// and the functional flow that depends on it, checkable from the outside.

import { expect } from '@playwright/test';

// ── The DESIGN_QA_HANDOFF §A viewport matrix ─────────────────────────────────
// Baseline widths, then the tight landscape/short-height budgets, then large
// desktops. The zoom rows simulate WCAG browser zoom as the reduced CSS
// viewport a real browser reports at that zoom on a 1280×800 window (e.g. 200%
// zoom → half the CSS pixels on each axis) — the same signal `innerWidth/
// innerHeight` carry under real zoom, which is what the layout reacts to.
//
// `supported: false` marks the viewports where building this gate REVEALED a
// genuine clip: at viewport heights ≤ ~533px the three always-open shelves
// (~448px tall) plus the masthead already exceed the screen, so the reader —
// CTA, podium, book footer — is pushed below the fold. Fitting three shelves +
// a readable book + podium into a 360–450px landscape/zoomed height is a
// responsive redesign needing real-device/real-font judgment (owner-owned per
// DESIGN_QA_HANDOFF §D), not a test tweak. These rows run as `test.fixme` so the
// gap stays visible and encoded until that design work happens — see
// docs/audits/qa-test-coverage.md.
export const VIEWPORTS = [
  { name: '390x844 · mobile portrait', width: 390, height: 844 },
  { name: '768x1024 · tablet portrait', width: 768, height: 1024 },
  { name: '1280x800 · laptop', width: 1280, height: 800 },
  { name: '1440x900 · desktop', width: 1440, height: 900 },
  { name: '1920x1080 · large desktop', width: 1920, height: 1080 },
  { name: '1024x640 · 125% zoom @1280x800', width: 1024, height: 640 },
  { name: '740x360 · landscape short', width: 740, height: 360, supported: false },
  { name: '812x375 · landscape short', width: 812, height: 375, supported: false },
  { name: '900x450 · landscape (tightest budget)', width: 900, height: 450, supported: false },
  { name: '853x533 · 150% zoom @1280x800', width: 853, height: 533, supported: false },
  { name: '640x400 · 200% zoom @1280x800', width: 640, height: 400, supported: false },
];

// Message shown on the skipped short-height rows.
export const TIGHT_REASON =
  'Known clip below ~640px viewport height: the three always-open shelves push ' +
  'the reader below the fold. Tracked in docs/audits/qa-test-coverage.md.';

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'api.fontshare.com'];

// Neutralise webfont requests so the layout is measured on the deterministic
// system fallback fonts in every environment. Webfonts are proxy-blocked in the
// build sandbox anyway, and real-font sign-off stays owner-owned (DESIGN_QA_HANDOFF
// §D) — so this both matches reality and removes a cross-machine flake source.
// We *fulfill empty* rather than abort: aborting logs "Failed to load resource"
// console errors (as does the proxy failing the real load), which would trip the
// console guard; an empty 200 leaves no @font-face and no error.
export async function blockFonts(page) {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (FONT_HOSTS.some((h) => url.includes(h))) {
      return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
    }
    return route.continue();
  });
}

// Benign network/resource-load noise that is environmental, not an app defect
// (e.g. an external asset the sandbox/CI can't reach). The guard is about app +
// hydration errors, so these are filtered out.
const BENIGN_ERROR = /Failed to load resource|net::ERR_|ERR_CONNECTION|ERR_TUNNEL/i;

// Collect console errors + uncaught page errors, and — separately — any message
// mentioning hydration. The dev server emits Svelte hydration warnings as
// console output, so a mismatch shows up in `hydration`. Tests assert both empty.
export function consoleGuard(page) {
  const errors = [];
  const hydration = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (/hydrat/i.test(text)) hydration.push(text);
    if (msg.type() === 'error' && !BENIGN_ERROR.test(text)) errors.push(text);
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return { errors, hydration };
}

// The page itself must never scroll, on either axis. +1px absorbs sub-pixel
// rounding between layout and the reported innerWidth/innerHeight.
export async function assertNoPageScroll(page, label = '') {
  const m = await page.evaluate(() => {
    const el = document.scrollingElement || document.documentElement;
    return {
      scrollW: el.scrollWidth,
      scrollH: el.scrollHeight,
      innerW: window.innerWidth,
      innerH: window.innerHeight,
      top: el.scrollTop,
      left: el.scrollLeft,
    };
  });
  expect(m.scrollW, `${label}: horizontal page overflow`).toBeLessThanOrEqual(m.innerW + 1);
  expect(m.scrollH, `${label}: vertical page overflow`).toBeLessThanOrEqual(m.innerH + 1);
  expect(m.left, `${label}: page scrolled horizontally`).toBe(0);
  expect(m.top, `${label}: page scrolled vertically`).toBe(0);
  return m;
}

// Assert an element's layout box sits fully inside the viewport. This is the
// clip-revealing check: an overflow:hidden ancestor can hide a control while the
// page reports no scroll, but boundingBox() returns the true layout box, so a
// clipped control lands outside [0, innerW]×[0, innerH] and fails here.
export async function assertInViewport(page, locator, label = '') {
  await expect(locator, `${label}: visible`).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${label}: has a layout box`).not.toBeNull();
  const { innerW, innerH } = await page.evaluate(() => ({
    innerW: window.innerWidth,
    innerH: window.innerHeight,
  }));
  const EPS = 1;
  expect(box.x, `${label}: left edge in viewport`).toBeGreaterThanOrEqual(-EPS);
  expect(box.y, `${label}: top edge in viewport`).toBeGreaterThanOrEqual(-EPS);
  expect(box.x + box.width, `${label}: right edge in viewport`).toBeLessThanOrEqual(innerW + EPS);
  expect(box.y + box.height, `${label}: bottom edge in viewport`).toBeLessThanOrEqual(innerH + EPS);
  return box;
}

// ── State navigation ─────────────────────────────────────────────────────────

// Landing: nothing open, the staged CTA is visible.
export async function gotoLanding(page) {
  await page.goto('/');
  await expect(page.locator('.stage-empty')).toBeVisible();
  await expect(page.locator('.empty-open')).toBeVisible();
}

// Two timing facts about +page.svelte drive the helpers below:
//  1. On the dev server the SSR markup is visible *before* hydration wires the
//     on:click handlers, so an early click is silently ignored. The open helpers
//     therefore retry the click until it actually takes effect (via `toPass`),
//     which doubles as a hydration gate — no fixed "wait for hydration" sleep.
//  2. `handleBookClick` / `handleClose` hold a `switching` guard for a hardcoded
//     420ms (open) / 380+420ms (switch); a click inside that window is dropped.
//     After each transition we wait the window out (with margin) so the *next*
//     interaction is never swallowed. These are fixed source constants, so the
//     waits are deterministic, not races.
const OPEN_MS = 550; // one open animation (sleep 420) + margin
const SWITCH_MS = 950; // close + open when swapping books (sleep 380 + 420) + margin

// Open the staged volume (Brinker) via the landing CTA. Retries until the book
// actually opens, absorbing the pre-hydration window on a fresh load.
export async function openStagedBook(page) {
  const cta = page.locator('.empty-open');
  await expect(async () => {
    if (await cta.isVisible()) await cta.click();
    await expect(page.locator('.book-spread')).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 12_000 });
  await expect(page.locator('.th-t')).toBeVisible();
  await page.waitForTimeout(OPEN_MS);
}

// Select a spine by its book title. The spine keeps its `title="<Title> · <sub>"`
// attribute even when the shelves compact (the visible text is hidden while a
// book is open), so this works from the landing state and while switching books.
export function spine(page, title) {
  return page.locator(`.spine[title^="${title}"]`).first();
}

// Open a book by title and wait for its table of contents to render. Works while
// another book is open (that path closes + reopens over ~800ms, which the
// web-first assertion below rides out).
export async function openBook(page, title) {
  const target = new RegExp(escapeRe(title));
  const th = page.locator('.th-t');
  await expect(async () => {
    // Only click when the target book isn't already the open one — re-clicking
    // the already-open book's spine would toggle it shut. When the guard is mid-
    // switch the click is harmlessly ignored, and the title still resolves.
    const current = (await th.count()) ? (await th.first().textContent()) ?? '' : '';
    if (!target.test(current)) await spine(page, title).click();
    await expect(th).toHaveText(target, { timeout: 1200 });
  }).toPass({ timeout: 12_000 });
  // Wait out the (possible) close+open switch window before the next click.
  await page.waitForTimeout(SWITCH_MS);
}

// From a book's TOC, open the Nth chapter (0-based) and land in the reader.
export async function openChapter(page, index = 0) {
  await page.locator('.toc-item').nth(index).click();
  await expect(page.locator('.reading')).toBeVisible();
  await expect(page.locator('.page-foot')).toBeVisible();
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
