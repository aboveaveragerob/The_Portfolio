import { defineConfig } from '@playwright/test';

// Port the tests drive; the dev server is started for us via `webServer` below.
const PORT = 4173;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  // Fail the CI build if a `test.only` was left in the source.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // A single dev server backs every worker, and the flow/internal-scroll specs
  // are animation-timing sensitive; cap concurrency so they don't contend.
  workers: process.env.CI ? 1 : 4,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    // Keep device-pixel-ratio at 1 so the viewport sizes in the no-scroll
    // matrix map 1:1 to CSS pixels (the unit the layout is written in).
    deviceScaleFactor: 1,
  },

  // A single Chromium project using Playwright's bundled browser (no `channel`,
  // so it resolves to the revision under PLAYWRIGHT_BROWSERS_PATH). Per-test
  // viewports are set inside the specs from the DESIGN_QA_HANDOFF §A matrix.
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } },
    },
  ],

  // Run against `vite dev`, not the production preview, on purpose:
  //  • the dev server surfaces Svelte hydration / a11y console warnings that
  //    the production build strips — that is what the hydration test asserts on;
  //  • it always serves current source (no stale-build measurements, the exact
  //    trap DESIGN_QA_HANDOFF flags for manual preview runs);
  //  • the no-scroll CSS geometry is identical dev vs prod here.
  // The production build is still gated separately by `npm run build` in CI.
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
