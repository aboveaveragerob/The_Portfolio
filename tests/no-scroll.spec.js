// The §8.4 regression gate, Library edition: at every supported viewport,
// the resume landing (folio open), the revealed library, shelf paging, and
// an open volume must each fit one screen — no page scroll on either axis —
// with the folio controls, masthead, shelf controls, and the Atlas contact
// link fully inside the viewport (clipped-not-scrolled is the signature bug
// this suite exists to reveal).

import { test } from '@playwright/test';
import {
  VIEWPORTS,
  blockFonts,
  assertNoPageScroll,
  assertInViewport,
  gotoResume,
  closeFolio,
  openVolume,
  pageShelf,
} from './helpers.js';

for (const vp of VIEWPORTS) {
  test.describe(`no-scroll · ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    // The journey covers the resume, the reveal, shelf paging, and a second
    // volume, each riding out shared motion durations — double the budget.
    test.setTimeout(60_000);

    test('resume, reveal, and every library state fit one screen', async ({ page }) => {
      await blockFonts(page);

      // Landing: the resume lies open.
      await gotoResume(page);
      await assertNoPageScroll(page, 'resume landing');
      await assertInViewport(page, page.getByTestId('folio-close'), 'resume: folio close');
      await assertInViewport(page, page.getByTestId('folio-counter'), 'resume: folio counter');

      // The reveal: closing the resume shows the library among the stars.
      await closeFolio(page);
      await assertNoPageScroll(page, 'library reveal');
      await assertInViewport(page, page.getByTestId('masthead'), 'library: masthead');
      await assertInViewport(page, page.getByTestId('shelf-next'), 'library: next-shelf button');
      await assertInViewport(page, page.getByTestId('shelf-indicator'), 'library: shelf indicator');
      await assertInViewport(page, page.getByTestId('atlas-contact'), 'library: atlas contact');

      // Shelf paging stays on one screen.
      await pageShelf(page, +1);
      await assertNoPageScroll(page, 'library: shelf 2');
      await pageShelf(page, -1);

      // A second volume opens and closes without ever scrolling the page.
      await openVolume(page, 'eddie-bauer');
      await assertNoPageScroll(page, 'volume open');
      await assertInViewport(page, page.getByTestId('folio-close'), 'volume: folio close');
      await page.getByTestId('folio-close').click();
      await page.waitForTimeout(300);
      await assertNoPageScroll(page, 'volume closed');
    });
  });
}
