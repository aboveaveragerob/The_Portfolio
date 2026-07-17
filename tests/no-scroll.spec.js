// No-scroll regression — the redesign's headline invariant (DESIGN_AUDIT §8.4):
// the page must fit one screen in every state, across the full DESIGN_QA_HANDOFF
// §A matrix, and the key controls must be *within* the viewport (not merely
// un-scrolled — an overflow:hidden ancestor can clip a control silently).

import { test } from '@playwright/test';
import {
  VIEWPORTS,
  TIGHT_REASON,
  blockFonts,
  gotoLanding,
  openStagedBook,
  openChapter,
  openBook,
  assertNoPageScroll,
  assertInViewport,
} from './helpers.js';

test.beforeEach(async ({ page }) => {
  await blockFonts(page);
});

for (const vp of VIEWPORTS) {
  test.describe(`no-scroll · ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('landing, open, and reading each fit one screen', async ({ page }) => {
      // Short-height / high-zoom rows are a known, documented clip — skip with a
      // reason rather than assert (they'd fail on the below-the-fold controls).
      if (vp.supported === false) test.fixme(true, TIGHT_REASON);

      // ── Landing ──────────────────────────────────────────────
      await gotoLanding(page);
      await assertNoPageScroll(page, `${vp.name} · landing`);
      await assertInViewport(page, page.locator('.empty-open'), `${vp.name} · CTA`);
      await assertInViewport(page, page.locator('.podium-wrap'), `${vp.name} · podium (landing)`);

      // ── Open (table of contents) ─────────────────────────────
      await openStagedBook(page);
      await assertNoPageScroll(page, `${vp.name} · open`);
      await assertInViewport(page, page.locator('.podium-wrap'), `${vp.name} · podium (open)`);

      // ── Reading (a chapter open) ─────────────────────────────
      await openChapter(page, 0);
      await assertNoPageScroll(page, `${vp.name} · reading`);
      await assertInViewport(page, page.locator('.page-foot'), `${vp.name} · book footer`);
    });
  });
}

test.describe('internal scroll · 1024x640', () => {
  // A supported but short viewport: the reader region is small enough that a
  // long illustrated chapter overflows it and must scroll internally.
  test.use({ viewport: { width: 1024, height: 640 } });

  test('a long chapter scrolls inside the reader while the page stays fixed', async ({ page }) => {
    await gotoLanding(page);
    // Music → Discography: prose + album art + two audio players — reliably
    // taller than the reader region at this short height.
    await openBook(page, 'Music & Audio Production');
    await openChapter(page, 0);

    const body = page.locator('.page-body');
    await test.expect(body).toBeVisible();

    const overflows = await body.evaluate((el) => el.scrollHeight > el.clientHeight + 1);
    test.expect(overflows, 'reader content overflows and can scroll internally').toBe(true);

    await body.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    const scrolled = await body.evaluate((el) => el.scrollTop);
    test.expect(scrolled, 'reader scrolled internally').toBeGreaterThan(0);

    // The internal scroll must not have moved the page.
    await assertNoPageScroll(page, '1024x640 · reading after internal scroll');
  });
});
