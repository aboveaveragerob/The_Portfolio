// prefers-reduced-motion is a hard requirement: with it set, nothing animates
// — not the starfield twinkle, the masthead spiral, the shelf slide, the
// cursor trail, or the folio turn — and every flow still works.

import { test, expect } from '@playwright/test';
import { blockFonts, gotoResume, closeFolio, turnFolio, openVolume } from './helpers.js';

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

  // The resume lands open, turns pages, and stays motion-free.
  await gotoResume(page);
  await page.waitForTimeout(400);
  await assertNoRunningAnimations(page, 'resume landing');
  await turnFolio(page, 'folio-next', '2 /');
  await page.waitForTimeout(300);
  await assertNoRunningAnimations(page, 'resume mid-read');

  // The reveal still functions (durations drop to zero) and stays still.
  await closeFolio(page);
  await assertNoRunningAnimations(page, 'library reveal');

  // Opening a volume works and remains motion-free.
  await openVolume(page, 'education-licensing');
  await assertNoRunningAnimations(page, 'volume open');

  // The cursor-trail overlay must not mount at all under reduced motion.
  await page.mouse.move(400, 400);
  await page.waitForTimeout(200);
  expect(await page.locator('.trail').count(), 'no cursor trail').toBe(0);
});
