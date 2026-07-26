// SSR determinism gate: every route shape hard-loads with the seeded
// starfield rendered (>100 circles — the generated-markup anchor testids
// can't cover) and zero hydration warnings or console errors. Any module
// that drifts from the module-scope + toFixed rule trips this first.

import { test, expect } from '@playwright/test';
import { blockFonts, consoleGuard } from './helpers.js';

test.use({ viewport: { width: 1280, height: 800 } });

const ROUTES = ['/', '/library', '/library/brinker-capital', '/library/music-audio-production'];

for (const route of ROUTES) {
  test(`hard load ${route} — starfield renders, no hydration warnings`, async ({ page }) => {
    await blockFonts(page);
    const guard = consoleGuard(page);

    await page.goto(route);
    await expect(page.getByTestId('masthead')).toBeVisible();

    const starCount = await page.locator('.backdrop svg.stars circle').count();
    expect(starCount, 'seeded starfield rendered').toBeGreaterThan(100);

    // Give hydration a beat to log anything before asserting silence.
    await page.waitForTimeout(400);
    expect(guard.errors, 'console should stay clean').toEqual([]);
    expect(guard.hydration, 'no hydration warnings').toEqual([]);
  });
}
