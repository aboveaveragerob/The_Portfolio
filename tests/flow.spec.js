// Functional flow at the laptop baseline: the resume lands open, closing it
// reveals the library, the shelves browse to an image volume and an audio
// volume, pages turn, Escape closes — with zero console errors and zero
// hydration warnings across the whole journey.

import { test, expect } from '@playwright/test';
import {
  blockFonts,
  consoleGuard,
  gotoResume,
  closeFolio,
  openVolume,
  pageShelf,
  turnFolio,
} from './helpers.js';

test.use({ viewport: { width: 1280, height: 800 } });

// One long journey on purpose — give it double the default budget.
test.setTimeout(60_000);

test('resume opens, the library reveals, volumes read — no console errors', async ({ page }) => {
  await blockFonts(page);
  const guard = consoleGuard(page);

  // Landing: the Brinker resume, open at its contents.
  await gotoResume(page);
  const folio = page.getByTestId('folio');
  await expect(folio).toContainText('Contents');
  await expect(folio).toContainText('Workflow Design & Process Automation');

  // Read into a chapter (retried — this is the page's first interaction, so
  // the click doubles as the hydration gate), then turn a page.
  await expect(async () => {
    await folio.getByRole('button', { name: /Trade Execution & Risk Control/ }).click();
    await expect(page.getByTestId('folio-counter')).toContainText('4 /', { timeout: 900 });
  }).toPass({ timeout: 12_000 });
  await expect(folio).toContainText('multi-sleeve UMA portfolios');
  await turnFolio(page, 'folio-next', '5 /');

  // The reveal: close the resume, the library appears at /library.
  await closeFolio(page);
  await expect(page.getByTestId('view-library')).toBeVisible();
  await expect(page.getByTestId('shelf-indicator')).toContainText('Shelf 1 of 5');

  // An image volume: the Eddie Bauer windows actually load.
  await openVolume(page, 'eddie-bauer');
  await folio.getByRole('button', { name: /Visual Merchandising/ }).click();
  await expect(folio.locator('.shots img').first()).toBeVisible();
  await expect
    .poll(async () =>
      folio.locator('.shots img').first().evaluate((img) => img.complete && img.naturalWidth > 0)
    )
    .toBe(true);
  await page.getByTestId('folio-close').click();
  await expect(page).toHaveURL(/\/library$/);

  // The audio volume lives on the Soundstage shelf: page across, open it,
  // and both mp3 teasers are present.
  for (let i = 0; i < 4; i++) await pageShelf(page, +1);
  await openVolume(page, 'music-audio-production');
  await folio.getByRole('button', { name: /Discography/ }).click();
  const tracks = folio.locator('.tracks audio');
  await expect(tracks).toHaveCount(2);
  for (const src of await tracks.evaluateAll((els) => els.map((el) => el.getAttribute('src')))) {
    expect(src).toMatch(/\.mp3$/);
  }

  // Escape closes the folio too.
  await expect(async () => {
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/library$/, { timeout: 800 });
  }).toPass({ timeout: 8_000 });

  expect(guard.errors, 'console should stay clean').toEqual([]);
  expect(guard.hydration, 'no hydration warnings').toEqual([]);
});
