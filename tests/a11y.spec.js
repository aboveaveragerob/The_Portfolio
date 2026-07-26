// Keyboard and assistive-tech behaviors that svelte-check can't verify:
// the landing resume takes focus, the folio traps focus and hands it back
// to the originating spine, and the shelf controls are Tab-reachable.

import { test, expect } from '@playwright/test';
import { blockFonts, gotoResume, closeFolio, openVolume, pageShelf } from './helpers.js';

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

test('shelf controls are Tab-reachable on the library wall', async ({ page }) => {
  await blockFonts(page);
  await gotoResume(page);
  await closeFolio(page);

  // On shelf 2 both paging buttons are enabled (disabled buttons are
  // rightly unfocusable on the end shelves).
  await pageShelf(page, +1);

  // Scan from the top of the document — after the button click, forward-Tab
  // would never revisit controls earlier in the DOM.
  await page.evaluate(() => document.activeElement?.blur?.());

  const seen = new Set();
  for (let i = 0; i < 60 && seen.size < 2; i++) {
    await page.keyboard.press('Tab');
    const id = await page.evaluate(
      () => document.activeElement?.getAttribute('data-testid') ?? ''
    );
    if (id === 'shelf-prev' || id === 'shelf-next') seen.add(id);
  }
  expect([...seen].sort()).toEqual(['shelf-next', 'shelf-prev']);
});
