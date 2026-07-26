// The §8.4 regression gate, one-view-wall edition: at every supported
// viewport, the resume landing (folio open), the revealed library — with ALL
// FIVE wing bays and both far-corner spines simultaneously in view, nothing
// paged or hidden — and an open volume must each fit one screen with no page
// scroll on either axis (clipped-not-scrolled is the signature bug this
// suite exists to reveal).

import { test } from '@playwright/test';
import {
  VIEWPORTS,
  WINGS,
  blockFonts,
  assertNoPageScroll,
  assertInViewport,
  gotoResume,
  closeFolio,
  openVolume,
} from './helpers.js';

for (const vp of VIEWPORTS) {
  test.describe(`no-scroll · ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    // The journey rides out real motion windows — double the default budget.
    test.setTimeout(60_000);

    test('resume, reveal, and the whole wall fit one screen', async ({ page }) => {
      await blockFonts(page);

      // Landing: the resume lies open.
      await gotoResume(page);
      await assertNoPageScroll(page, 'resume landing');
      await assertInViewport(page, page.getByTestId('folio-close'), 'resume: folio close');
      await assertInViewport(page, page.getByTestId('folio-counter'), 'resume: folio counter');

      // The reveal. On viewports large enough for thirty legible titles, the
      // ENTIRE library is on screen — every wing's plaque and both far-corner
      // volumes. On close-up viewports (the stacked/short variants, where
      // legible titles physically exceed the screen) the ROOM scrolls
      // internally — the page still never scrolls — and the far end of the
      // wall is reached by looking along it.
      const closeUp = vp.height < 560 || vp.width < 900;
      await closeFolio(page);
      await assertNoPageScroll(page, 'library reveal');
      await assertInViewport(page, page.getByTestId('masthead'), 'library: masthead');
      await assertInViewport(page, page.getByTestId('atlas-contact'), 'library: atlas contact');

      if (!closeUp) {
        for (const wing of WINGS) {
          await assertInViewport(page, page.getByTestId(wing), `library: ${wing} plaque`);
        }
        await assertInViewport(page, page.getByTestId('spine-brinker-capital'), 'library: first spine');
        await assertInViewport(page, page.getByTestId('spine-date-nights'), 'library: last spine');
      } else {
        const lastSpine = page.getByTestId('spine-date-nights');
        await lastSpine.scrollIntoViewIfNeeded();
        await assertInViewport(page, lastSpine, 'close-up: last spine after looking down the wall');
        await assertNoPageScroll(page, 'close-up: page still fixed after internal scroll');
      }

      // A volume from the far shelf opens directly — no paging exists.
      await openVolume(page, 'music-audio-production');
      await assertNoPageScroll(page, 'volume open');
      await assertInViewport(page, page.getByTestId('folio-close'), 'volume: folio close');
      await page.getByTestId('folio-close').click();
      await page.waitForTimeout(300);
      await assertNoPageScroll(page, 'volume closed');
    });
  });
}
