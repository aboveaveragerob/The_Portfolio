// Functional regression — the full reading flow with no console errors or
// hydration warnings, exercising an image book (Eddie Bauer) and an audio book
// (Music), plus a dedicated hard-load hydration/console check.

import { test, expect } from '@playwright/test';
import {
  blockFonts,
  consoleGuard,
  gotoLanding,
  openStagedBook,
  openBook,
  openChapter,
} from './helpers.js';

test.use({ viewport: { width: 1280, height: 800 } });

test.beforeEach(async ({ page }) => {
  await blockFonts(page);
});

test('reading flow across an image book and an audio book — no console errors', async ({ page }) => {
  const guard = consoleGuard(page);

  // Landing → open the staged volume via the CTA.
  await gotoLanding(page);
  await openStagedBook(page);
  await expect(page.locator('.th-t')).toHaveText(/Brinker Capital/);

  // Image book: Eddie Bauer → its illustrated chapter.
  await openBook(page, 'Eddie Bauer');
  await openChapter(page, 0); // Visual Merchandising
  const shots = page.locator('.shots img');
  await expect(shots.first()).toBeVisible();
  expect(await shots.count(), 'illustrated page has images').toBeGreaterThanOrEqual(1);
  await shots.first().scrollIntoViewIfNeeded();
  const imgLoaded = await shots.first().evaluate((img) => img.complete && img.naturalWidth > 0);
  expect(imgLoaded, 'first Eddie Bauer image actually loaded (asset present)').toBe(true);

  // Back to that book's contents.
  await page.locator('.pf-btn').click();
  await expect(page.locator('.toc-list')).toBeVisible();

  // Audio book: Music → its discography chapter (page 1 carries the players).
  await openBook(page, 'Music & Audio Production');
  await openChapter(page, 0);
  const tracks = page.locator('.tracks audio');
  await expect(tracks.first()).toBeVisible();
  expect(await tracks.count(), 'discography page has both audio teasers').toBe(2);
  const srcs = await tracks.evaluateAll((els) => els.map((a) => a.getAttribute('src')));
  for (const src of srcs) expect(src).toMatch(/\.mp3$/);

  // Page-flip forward and back updates the folio.
  await page.locator('.pf-turn button', { hasText: 'Next' }).click();
  await expect(page.locator('.folio')).toHaveText('2 / 2');
  await page.locator('.pf-turn button', { hasText: 'Prev' }).click();
  await expect(page.locator('.folio')).toHaveText('1 / 2');

  // Close → back to the landing state.
  await page.locator('.close-btn').click();
  await expect(page.locator('.stage-empty')).toBeVisible();

  expect(guard.hydration, 'hydration warnings during flow').toEqual([]);
  expect(guard.errors, 'console errors during flow').toEqual([]);
});

test('hard load has no hydration mismatch or console error', async ({ page }) => {
  const guard = consoleGuard(page); // attach before the first navigation
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('.stage-empty')).toBeVisible();

  // The seeded-PRNG starfield must render (SSR markup == client markup). A
  // hydration repair or a Backdrop throw would drop these deterministic nodes.
  const stars = page.locator('.backdrop svg.stars circle');
  expect(await stars.count(), 'seeded starfield rendered').toBeGreaterThan(100);

  expect(guard.hydration, 'hydration warnings on load').toEqual([]);
  expect(guard.errors, 'console errors on load').toEqual([]);
});
