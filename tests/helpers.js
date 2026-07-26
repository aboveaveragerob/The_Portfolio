// Shared helpers for the no-scroll / functional regression suite.
//
// The library keeps the site's headline invariant: "the page must never
// scroll" (DESIGN_AUDIT §8.4). Because <body> is overflow:hidden, a control
// pushed past the viewport is *clipped, not scrolled* — it fails silently.
// These helpers make that invariant, and the resume→library flows that
// depend on it, checkable from the outside.

import { expect } from '@playwright/test';
import { DUR } from '../src/lib/motion.js';

// ── The DESIGN_QA_HANDOFF §A viewport matrix ─────────────────────────────────
// Baseline widths, then the tight landscape/short-height budgets, then large
// desktops. The zoom rows simulate WCAG browser zoom as the reduced CSS
// viewport a real browser reports at that zoom on a 1280×800 window.
// Every row is supported — history in docs/audits/qa-test-coverage.md.
export const VIEWPORTS = [
  { name: '390x844 · mobile portrait', width: 390, height: 844 },
  { name: '768x1024 · tablet portrait', width: 768, height: 1024 },
  { name: '1280x800 · laptop', width: 1280, height: 800 },
  { name: '1440x900 · desktop', width: 1440, height: 900 },
  { name: '1920x1080 · large desktop', width: 1920, height: 1080 },
  { name: '1024x640 · 125% zoom @1280x800', width: 1024, height: 640 },
  { name: '740x360 · landscape short', width: 740, height: 360 },
  { name: '812x375 · landscape short', width: 812, height: 375 },
  { name: '900x450 · landscape (tightest budget)', width: 900, height: 450 },
  { name: '853x533 · 150% zoom @1280x800', width: 853, height: 533 },
  { name: '640x400 · 200% zoom @1280x800', width: 640, height: 400 },
];

// Wait window after a scene swap: outgoing fade + incoming iris (delayed by
// one fade) + margin. DUR is the same constant the shell animates with.
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

// Land on the resume: '/' loads with the Brinker folio already open.
export async function gotoResume(page) {
  await page.goto('/');
  await expect(page.getByTestId('folio')).toBeVisible();
  await expect(page.getByTestId('folio')).toContainText('Brinker Capital');
}

// Close whatever folio is open; lands on the revealed library wall.
export async function closeFolio(page) {
  const close = page.getByTestId('folio-close');
  await expect(async () => {
    if ((await page.getByTestId('folio').count()) > 0) await close.click();
    await expect(page).toHaveURL(/\/library$/, { timeout: 1200 });
    await expect(page.getByTestId('library-wall')).toBeVisible({ timeout: 1200 });
  }).toPass({ timeout: 12_000 });
  await page.waitForTimeout(SETTLE_MS);
}

// Open a volume's folio by clicking its spine — every spine is always
// visible on the one-view wall.
export async function openVolume(page, slug) {
  const spine = page.getByTestId(`spine-${slug}`);
  await expect(async () => {
    if (!new URL(page.url()).pathname.includes(`/library/${slug}`)) await spine.click();
    await expect(page.getByTestId('folio')).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 12_000 });
  await page.waitForTimeout(DUR.folioTurn + 150);
}

// Turn folio panels until the counter shows the expected prefix. Guarded so a
// click swallowed mid-render is retried, but a click that already landed is
// never doubled.
export async function turnFolio(page, buttonId, expectedPrefix) {
  const counter = page.getByTestId('folio-counter');
  await expect(async () => {
    const txt = ((await counter.textContent()) ?? '').trim();
    if (!txt.startsWith(expectedPrefix)) await page.getByTestId(buttonId).click();
    await expect(counter).toContainText(expectedPrefix, { timeout: 900 });
  }).toPass({ timeout: 8_000 });
}

// The five wings, in shelf order — every plaque must always be in view.
export const WINGS = [
  'wing-professional',
  'wing-physical',
  'wing-digital',
  'wing-cognitive',
  'wing-social',
];
