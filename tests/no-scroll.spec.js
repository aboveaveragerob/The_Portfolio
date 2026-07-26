// The §8.4 regression gate, Orrery Dashboard edition: at every supported
// viewport, the home star chart and all four compass views must each fit one
// screen — no page scroll on either axis — with the sun, every compass point,
// and the Atlas contact link fully inside the viewport (clipped-not-scrolled
// is the signature bug this suite exists to reveal).

import { test } from '@playwright/test';
import {
  VIEWPORTS,
  VIEWS,
  blockFonts,
  assertNoPageScroll,
  assertInViewport,
  gotoHome,
  gotoView,
  openRole,
  openFolio,
  pageShelf,
} from './helpers.js';

for (const vp of VIEWPORTS) {
  test.describe(`no-scroll · ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    // The journey covers all four views plus role/tab/shelf/folio states,
    // each riding out shared motion durations — double the default budget.
    test.setTimeout(60_000);

    test('home and every view fit one screen', async ({ page }) => {
      await blockFonts(page);
      await gotoHome(page);

      await assertNoPageScroll(page, 'home');
      await assertInViewport(page, page.getByTestId('center-sun'), 'home: center sun');
      for (const v of VIEWS) {
        await assertInViewport(page, page.getByTestId(`compass-${v}`), `home: compass ${v}`);
      }
      await assertInViewport(page, page.getByTestId('atlas-contact'), 'home: atlas contact');

      for (const v of VIEWS) {
        await gotoView(page, v);
        await assertNoPageScroll(page, v);
        await assertInViewport(page, page.getByTestId('center-sun'), `${v}: center sun`);
        await assertInViewport(page, page.getByTestId(`compass-${v}`), `${v}: active compass point`);
        await assertInViewport(page, page.getByTestId('atlas-contact'), `${v}: atlas contact`);

        if (v === 'orbit') {
          // Open a role panel: still one screen, panel controls reachable.
          await openRole(page, 'brinker');
          await assertNoPageScroll(page, 'orbit: role open');
          await assertInViewport(page, page.getByTestId('role-panel'), 'orbit: role panel');
          await assertInViewport(page, page.getByTestId('role-close'), 'orbit: role close');
          await assertInViewport(page, page.getByTestId('role-prev'), 'orbit: earlier-role link');
        }

        if (v === 'constellations') {
          // Zooming a cluster is SVG-internal — it must never create overflow.
          await assertInViewport(page, page.getByTestId('constellation-finops'), 'constellations: finops header');
          await page.getByTestId('constellation-hort').click();
          await page.waitForTimeout(650); // zoom transition
          await assertNoPageScroll(page, 'constellations: zoomed');
          await page.keyboard.press('Escape');
        }

        if (v === 'scrolls') {
          await assertInViewport(page, page.getByTestId('tab-degrees'), 'scrolls: degrees tab');
          await page.getByTestId('tab-certificates').click();
          await assertNoPageScroll(page, 'scrolls: certificates tab');
        }

        if (v === 'archive') {
          // Shelf paging and an open folio must both keep to one screen.
          await assertInViewport(page, page.getByTestId('shelf-next'), 'archive: next-shelf button');
          await pageShelf(page, +1);
          await assertNoPageScroll(page, 'archive: shelf 2');
          await pageShelf(page, -1);

          await openFolio(page, 'brinker-capital');
          await assertNoPageScroll(page, 'archive: folio open');
          await assertInViewport(page, page.getByTestId('folio-close'), 'archive: folio close');
          await assertInViewport(page, page.getByTestId('folio-counter'), 'archive: folio counter');
          await page.getByTestId('folio-close').click();
          await page.waitForTimeout(300);
          await assertNoPageScroll(page, 'archive: folio closed');
        }
      }
    });
  });
}
