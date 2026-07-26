// Keyboard and assistive-tech behaviors that svelte-check can't verify:
// the landing resume takes focus, the folio traps focus and hands it back
// to the originating spine, and the shelf controls are Tab-reachable.

import { test, expect } from '@playwright/test';
import { blockFonts, gotoResume, closeFolio, openVolume } from './helpers.js';

test.use({ viewport: { width: 1280, height: 800 } });

test('the landing resume takes focus and traps it', async ({ page }) => {
  await blockFonts(page);
  await gotoResume(page);

  // Focus lands on the folio heading when the resume opens.
  await expect(page.getByTestId('folio').getByRole('heading')).toBeFocused();

  // Tab far enough to lap every focusable control — focus must stay inside.
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() =>
      !!document.activeElement?.closest('[data-testid="folio"]')
    );
    expect(inside, `Tab press ${i + 1} stays inside the folio`).toBe(true);
  }
});

test('closing a volume returns focus to its spine', async ({ page }) => {
  await blockFonts(page);
  await gotoResume(page);
  await closeFolio(page);

  await openVolume(page, 'brinker-capital');
  await expect(page.getByTestId('folio').getByRole('heading')).toBeFocused();

  await expect(async () => {
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/library$/, { timeout: 800 });
  }).toPass({ timeout: 8_000 });
  await expect(page.getByTestId('spine-brinker-capital')).toBeFocused();
});

test('spines across the whole wall are Tab-reachable', async ({ page }) => {
  await blockFonts(page);
  await gotoResume(page);
  await closeFolio(page);

  // Scan from the top of the document: the first spine of the first bay and
  // the last spine of the last bay must both take keyboard focus — the whole
  // collection is one uninterrupted tab run, no paging in between.
  await page.evaluate(() => document.activeElement?.blur?.());

  const seen = new Set();
  for (let i = 0; i < 80 && seen.size < 2; i++) {
    await page.keyboard.press('Tab');
    const id = await page.evaluate(
      () => document.activeElement?.getAttribute('data-testid') ?? ''
    );
    if (id === 'spine-brinker-capital' || id === 'spine-date-nights') seen.add(id);
  }
  expect([...seen].sort()).toEqual(['spine-brinker-capital', 'spine-date-nights']);
});
