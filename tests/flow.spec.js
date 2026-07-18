// Functional flow at the laptop baseline: compass navigation reaches every
// view, the center sun resets to home, and the whole journey produces zero
// console errors and zero hydration warnings. (Deep per-view journeys — role
// panels, folios, tabs — are added alongside their views.)

import { test, expect } from '@playwright/test';
import {
  VIEWS,
  blockFonts,
  consoleGuard,
  gotoHome,
  gotoView,
  gotoHomeViaSun,
  openRole,
  openFolio,
  pageShelf,
} from './helpers.js';

test.use({ viewport: { width: 1280, height: 800 } });

// One long journey on purpose (view sweep + orbit deep-dive, each step riding
// out the shared motion durations) — give it double the default budget.
test.setTimeout(60_000);

const VIEW_HEADINGS = {
  orbit: /Career Orbit/,
  constellations: /Constellations/,
  scrolls: /Scrolls/,
  archive: /Archive/,
};

test('compass reaches every view and the sun returns home — no console errors', async ({ page }) => {
  await blockFonts(page);
  const guard = consoleGuard(page);

  await gotoHome(page);

  for (const v of VIEWS) {
    await gotoView(page, v);
    await expect(page.getByTestId(`view-${v}`).getByRole('heading', { level: 1 })).toHaveText(
      VIEW_HEADINGS[v]
    );
    // The active compass point announces itself.
    await expect(page.getByTestId(`compass-${v}`)).toHaveAttribute('aria-current', 'page');
  }

  // Career Orbit deep journey: open the present role, walk the timeline,
  // close back to the bare orbit.
  await gotoView(page, 'orbit');
  await openRole(page, 'brinker');
  const panel = page.getByTestId('role-panel');
  await expect(panel).toContainText('Brinker Capital');
  await expect(panel).toContainText('Present');

  await page.getByTestId('role-prev').click(); // earlier: PNC Wealth Management
  await expect(page).toHaveURL(/\/orbit\/pnc-wm$/);
  await expect(page.getByTestId('role-panel')).toContainText('PNC Wealth Management');

  await page.getByTestId('role-next').click(); // later: back to Brinker
  await expect(page).toHaveURL(/\/orbit\/brinker$/);

  await page.getByTestId('role-close').click();
  await expect(page).toHaveURL(/\/orbit$/);
  await expect(page.getByTestId('role-panel')).toHaveCount(0);

  // Escape also closes the panel. Retried like every interaction: a press
  // landing during mount/focus churn is otherwise silently swallowed.
  await openRole(page, 'eddie-bauer');
  await expect(async () => {
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/orbit$/, { timeout: 800 });
  }).toPass({ timeout: 8_000 });

  // Constellations: zoom Horticulture, its node labels (incl. the civic
  // bright stars) appear; Escape un-zooms.
  await gotoView(page, 'constellations');
  const hortHeader = page.getByTestId('constellation-hort');
  await expect(async () => {
    await hortHeader.click();
    await expect(hortHeader).toHaveAttribute('aria-pressed', 'true', { timeout: 800 });
  }).toPass({ timeout: 8_000 });
  await expect(page.getByText('PHS Flower Show')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(hortHeader).toHaveAttribute('aria-pressed', 'false');

  // Scrolls: tabs switch panels; facts are the real credentials.
  await gotoView(page, 'scrolls');
  await expect(page.getByTestId('scrolls-card')).toContainText('Bachelor of Science in Accounting');
  await page.getByTestId('tab-licenses').click();
  await expect(page.getByTestId('scrolls-card')).toContainText('Series 65');
  await page.getByTestId('tab-certificates').click();
  await expect(page.getByTestId('scrolls-card')).toContainText('Python in Excel');

  // Archive: open an image volume — the Eddie Bauer windows actually load.
  await gotoView(page, 'archive');
  await openFolio(page, 'eddie-bauer');
  const folio = page.getByTestId('folio');
  await expect(folio).toContainText('Contents');
  await folio.getByRole('button', { name: /Visual Merchandising/ }).click();
  await expect(folio.locator('.shots img').first()).toBeVisible();
  await expect
    .poll(async () =>
      folio.locator('.shots img').first().evaluate((img) => img.complete && img.naturalWidth > 0)
    )
    .toBe(true);

  // Turn pages and watch the counter move.
  await expect(page.getByTestId('folio-counter')).toContainText('2 /');
  await page.getByTestId('folio-next').click();
  await expect(page.getByTestId('folio-counter')).toContainText('3 /');
  await page.getByTestId('folio-prev').click();
  await expect(page.getByTestId('folio-counter')).toContainText('2 /');
  await page.getByTestId('folio-close').click();
  await expect(page).toHaveURL(/\/archive$/);

  // The audio volume lives on the Soundstage shelf: page across, open it,
  // and both mp3 teasers are present.
  for (let i = 0; i < 4; i++) await pageShelf(page, +1);
  await openFolio(page, 'music-audio-production');
  await page.getByTestId('folio').getByRole('button', { name: /Discography/ }).click();
  const tracks = page.getByTestId('folio').locator('.tracks audio');
  await expect(tracks).toHaveCount(2);
  for (const src of await tracks.evaluateAll((els) => els.map((el) => el.getAttribute('src')))) {
    expect(src).toMatch(/\.mp3$/);
  }

  // Escape closes the folio too.
  await expect(async () => {
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/archive$/, { timeout: 800 });
  }).toPass({ timeout: 8_000 });

  await gotoHomeViaSun(page);
  await expect(page).toHaveURL(/\/$/);

  expect(guard.errors, 'console should stay clean').toEqual([]);
  expect(guard.hydration, 'no hydration warnings').toEqual([]);
});
