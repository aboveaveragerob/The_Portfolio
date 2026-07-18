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

  await gotoHomeViaSun(page);
  await expect(page).toHaveURL(/\/$/);

  expect(guard.errors, 'console should stay clean').toEqual([]);
  expect(guard.hydration, 'no hydration warnings').toEqual([]);
});
