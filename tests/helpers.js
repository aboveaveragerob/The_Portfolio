// Shared helpers for the no-scroll / functional regression suite.
//
// The Orrery Dashboard keeps the site's headline invariant: "the page must
// never scroll" (DESIGN_AUDIT §8.4). Because <body> is overflow:hidden, a
// control pushed past the viewport is *clipped, not scrolled* — it fails
// silently. These helpers make that invariant, and the view flows that depend
// on it, checkable from the outside.

import { expect } from '@playwright/test';
import { DUR } from '../src/lib/motion.js';

// ── The DESIGN_QA_HANDOFF §A viewport matrix ─────────────────────────────────
// Baseline widths, then the tight landscape/short-height budgets, then large
// desktops. The zoom rows simulate WCAG browser zoom as the reduced CSS
// viewport a real browser reports at that zoom on a 1280×800 window.
//
// `supported: false` rows run as `test.fixme` pending the stacked-variant
// audit (the dashboard's chip + bottom-bar layout is expected to promote at
// least the ≥450px-height rows) — see docs/audits/qa-test-coverage.md.
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
  'Short-height viewports (≤ ~533px) pending the stacked-variant fit audit. ' +
  'Tracked in docs/audits/qa-test-coverage.md.';

// The four compass views, in compass order (N, E, S, W).
export const VIEWS = ['orbit', 'constellations', 'scrolls', 'archive'];

// Wait window after a view swap: outgoing fade + incoming fade (delayed by one
// fade) + margin. DUR is the same constant the shell animates with.
export const SETTLE_MS = DUR.view * 2 + 200;

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
// On the dev server the SSR markup is visible *before* hydration wires the
// client router, so an early click can be a full-page navigation (fine) or be
// swallowed mid-transition. The helpers therefore retry via `toPass`, which
// doubles as a hydration gate — no fixed "wait for hydration" sleep.

export async function gotoHome(page) {
  await page.goto('/');
  await expect(page.getByTestId('center-sun')).toBeVisible();
  await expect(page.getByTestId('view-home')).toBeVisible();
}

// Navigate to a compass view by clicking its (fixed-position) compass point,
// then wait out the scene cross-fade so the next interaction isn't swallowed.
export async function gotoView(page, view) {
  const link = page.getByTestId(`compass-${view}`);
  await expect(async () => {
    if (!new URL(page.url()).pathname.startsWith(`/${view}`)) await link.click();
    await expect(page.getByTestId(`view-${view}`)).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 12_000 });
  await page.waitForTimeout(SETTLE_MS);
}

// Return to home via the center sun.
export async function gotoHomeViaSun(page) {
  const sun = page.getByTestId('center-sun');
  await expect(async () => {
    if (new URL(page.url()).pathname !== '/') await sun.click();
    await expect(page.getByTestId('view-home')).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 12_000 });
  await page.waitForTimeout(SETTLE_MS);
}
