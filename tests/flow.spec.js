// Functional flow at the laptop baseline: compass navigation reaches every
// view, the center sun resets to home, and the whole journey produces zero
// console errors and zero hydration warnings. (Deep per-view journeys — role
// panels, folios, tabs — are added alongside their views.)

import { test, expect } from '@playwright/test';
import { VIEWS, blockFonts, consoleGuard, gotoHome, gotoView, gotoHomeViaSun } from './helpers.js';

test.use({ viewport: { width: 1280, height: 800 } });

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

  await gotoHomeViaSun(page);
  await expect(page).toHaveURL(/\/$/);

  expect(guard.errors, 'console should stay clean').toEqual([]);
  expect(guard.hydration, 'no hydration warnings').toEqual([]);
});
