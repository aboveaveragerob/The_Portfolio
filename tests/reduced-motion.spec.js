// prefers-reduced-motion is a hard requirement: with it set, nothing animates
// — not the starfield twinkle, the spiral, the astrolabe, the cursor trail,
// the scene cross-fade, or the folio turn — and every flow still works.

import { test, expect } from '@playwright/test';
import { blockFonts, gotoHome, gotoView, openFolio, turnFolio } from './helpers.js';

test.use({ viewport: { width: 1280, height: 800 } });

async function assertNoRunningAnimations(page, label) {
  const running = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.playState === 'running')
      .map((a) => `${a.constructor.name}:${a.animationName ?? a.id ?? ''}`)
  );
  expect(running, `${label}: no running animations under reduced motion`).toEqual([]);
}

test('reduced motion: zero running animations, flows intact', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await blockFonts(page);

  await gotoHome(page);
  await page.waitForTimeout(400);
  await assertNoRunningAnimations(page, 'home');

  // View swaps still function (durations drop to zero).
  await gotoView(page, 'orbit');
  await assertNoRunningAnimations(page, 'orbit');

  // A folio opens, turns, and stays motion-free.
  await gotoView(page, 'archive');
  await openFolio(page, 'brinker-capital');
  await turnFolio(page, 'folio-next', '2 /');
  await page.waitForTimeout(300);
  await assertNoRunningAnimations(page, 'folio open');

  // The cursor-trail overlay must not mount at all under reduced motion.
  await page.mouse.move(400, 400);
  await page.waitForTimeout(200);
  expect(await page.locator('.trail').count(), 'no cursor trail').toBe(0);
});
