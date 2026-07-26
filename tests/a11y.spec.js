// Keyboard and assistive-tech behaviors that svelte-check can't verify:
// the folio's focus trap and focus return, the Scrolls tablist's roving
// arrow keys, and compass points reachable by Tab with the active one
// announced.

import { test, expect } from '@playwright/test';
import { blockFonts, gotoHome, gotoView, openFolio } from './helpers.js';

test.use({ viewport: { width: 1280, height: 800 } });

test('folio traps focus, Escape closes and returns focus to the spine', async ({ page }) => {
  await blockFonts(page);
  await gotoHome(page);
  await gotoView(page, 'archive');
  await openFolio(page, 'brinker-capital');

  // Focus lands on the folio heading when the volume opens.
  await expect(page.getByTestId('folio').getByRole('heading')).toBeFocused();

  // Tab far enough to lap every focusable control — focus must stay inside.
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() =>
      !!document.activeElement?.closest('[data-testid="folio"]')
    );
    expect(inside, `Tab press ${i + 1} stays inside the folio`).toBe(true);
  }

  // Escape closes; the originating spine takes focus back.
  await expect(async () => {
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/archive$/, { timeout: 800 });
  }).toPass({ timeout: 8_000 });
  await expect(page.getByTestId('spine-brinker-capital')).toBeFocused();
});

test('scrolls tablist roves with arrow keys', async ({ page }) => {
  await blockFonts(page);
  await gotoHome(page);
  await gotoView(page, 'scrolls');

  const degrees = page.getByTestId('tab-degrees');
  const licenses = page.getByTestId('tab-licenses');
  const certs = page.getByTestId('tab-certificates');

  // One guarded rove step: press the arrow until the target tab is selected
  // and focused. The tablist advances one step per press from whichever tab
  // is active, so a keypress swallowed by CPU-contention render churn is
  // safely retried and the sequence always converges — while a press that
  // landed is never doubled past its target.
  async function rove(key, target) {
    await expect(async () => {
      if ((await target.getAttribute('aria-selected')) !== 'true') {
        await page.getByRole('tab', { selected: true }).focus();
        await page.keyboard.press(key);
      }
      await expect(target).toHaveAttribute('aria-selected', 'true', { timeout: 700 });
      await expect(target).toBeFocused({ timeout: 700 });
    }).toPass({ timeout: 10_000 });
  }

  await expect(async () => {
    await degrees.click();
    await expect(degrees).toHaveAttribute('aria-selected', 'true', { timeout: 800 });
  }).toPass({ timeout: 8_000 });

  await rove('ArrowRight', licenses);
  await rove('ArrowRight', certs);
  // Wraps around, and ArrowLeft walks back.
  await rove('ArrowRight', degrees);
  await rove('ArrowLeft', certs);
});

test('every compass point is Tab-reachable and the active one is announced', async ({ page }) => {
  await blockFonts(page);
  await gotoHome(page);

  // Tab through the page and collect which compass points receive focus.
  const seen = new Set();
  for (let i = 0; i < 20 && seen.size < 4; i++) {
    await page.keyboard.press('Tab');
    const id = await page.evaluate(
      () => document.activeElement?.getAttribute('data-testid') ?? ''
    );
    if (id.startsWith('compass-')) seen.add(id);
  }
  expect([...seen].sort()).toEqual([
    'compass-archive',
    'compass-constellations',
    'compass-orbit',
    'compass-scrolls',
  ]);

  await gotoView(page, 'scrolls');
  await expect(page.getByTestId('compass-scrolls')).toHaveAttribute('aria-current', 'page');
});
