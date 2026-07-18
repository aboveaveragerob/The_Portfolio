<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { DUR } from '$lib/motion.js';

  // Vesica iris-in: the incoming scene opens through a circular clip — the
  // Vesica Piscis cross-fade of the design brief, as a Svelte transition.
  function vesica(node, { duration, delay = 0 }) {
    return {
      delay,
      duration,
      css: (t) => `clip-path: circle(${(t * 125).toFixed(1)}% at 50% 50%); opacity: ${(0.3 + 0.7 * t).toFixed(3)}`,
    };
  }
  import Backdrop from '$lib/components/Backdrop.svelte';
  import CenterSun from '$lib/components/CenterSun.svelte';
  import CompassNav from '$lib/components/CompassNav.svelte';
  import AstrolabeWidget from '$lib/components/geometry/AstrolabeWidget.svelte';
  import MetatronCube from '$lib/components/geometry/MetatronCube.svelte';
  import StarCursor from '$lib/components/geometry/StarCursor.svelte';

  // The scene is keyed on the top-level section only, so opening a nested
  // detail route (/orbit/brinker, /archive/eddie-bauer) never re-renders the
  // scene behind its overlay.
  $: section = $page.url.pathname.split('/')[1] ?? '';

  let dur = DUR.view;
  onMount(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => (dur = mq.matches ? 0 : DUR.view);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#0b0912" />
</svelte:head>

<a class="skip-link" href="#view">Skip to content</a>

<div class="shell" data-section={section || 'home'}>
  <Backdrop />

  <!-- Scenes are absolutely positioned so an outgoing and incoming scene can
       overlap during the cross-fade without ever doubling layout height —
       the page must never scroll, transiently included. -->
  <main id="view" class="canvas" tabindex="-1">
    {#key section}
      <div class="scene" in:vesica={{ duration: dur, delay: dur }} out:fade={{ duration: dur }}>
        <slot />
      </div>
    {/key}
  </main>

  <CenterSun home={section === ''} />
  <CompassNav {section} emphasize={section === '' ? 'orbit' : ''} />
  <StarCursor />

  <footer class="atlas">
    <AstrolabeWidget corner="bl">
      <address class="coords">
        <span class="coords-k">Send a signal</span>
        <a data-testid="atlas-contact" href="mailto:rob.a.gregory@proton.me">rob.a.gregory@proton.me</a>
        <a href="https://alastairzeved.com/">alastairzeved.com</a>
      </address>
    </AstrolabeWidget>
    <AstrolabeWidget corner="br">
      <p class="colophon">
        <MetatronCube size={30} opacity={0.7} showCircles={false} />
        <span>The Cosmological Library</span>
      </p>
    </AstrolabeWidget>
  </footer>
</div>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── "Nebula Noir" design tokens ────────────────── */
  :global(:root) {
    --bg:      #0b0912;   /* deep space — base (unchanged) */
    --bg-2:    #110b1a;   /* dark indigo — cards, panels */
    --line-2:  #ffffff22;

    --text:    #f0eef3;   /* starlight white — body text (≈16.9:1 on --bg, AAA) */
    --text-2:  #9a8fa8;   /* cosmic gray — metadata/secondary only (≈6.4:1), never body */

    --sapphire:#4a7cf7;   /* links & interactive — always paired with underline/weight */
    --violet:  #8b5cf6;   /* section accents, ornament strokes */
    --rose:    #e8a87c;   /* key data, callouts (≈9.6:1) */
    --gold:    #fcd34d;   /* hover/active glow, selection (≈13.5:1) */

    /* Paper & ink — the reading surfaces inside folios and scrolls (AA-tuned) */
    --paper:   #f3ecdd;
    --paper-edge: #d9d0bd;      /* page gutter shadow */
    --paper-line: #00000018;    /* hairline rules on the paper pages */
    --ink:     #211b16;
    --ink-2:   #5b5247;
    --ink-3:   #6f6455;         /* darkened from #8a7f6c → clears WCAG AA on paper */
    --ink-eyebrow: #8a5a1f;     /* chapter kicker — clears AA (was #a06a2e) */

    /* Cosmic surfaces — shared by panels, spines, and ledges so the whole
       composition reads as one system. */
    --surface-1: #1d1530;
    --surface-2: #110b1a;
    --ledge-hi:  #342b4d;
    --ledge-lo:  #171126;

    --serif: 'Fraunces', Georgia, serif;
    --sans:  'Switzer', 'Helvetica Neue', system-ui, sans-serif;
    --mono:  'JetBrains Mono', ui-monospace, monospace;

    /* Shell metrics shared by scenes (stacked-variant safe areas) */
    --chip-h: 56px;
    --bar-h: 64px;
  }

  :global(html) {
    background: var(--bg);
    -webkit-text-size-adjust: 100%;
  }

  :global(body) {
    height: 100%;
    /* Static nebula bloom — the motion budget lives in chosen moments
       (spiral, cursor trail), not in an always-running background. */
    background:
      radial-gradient(58% 44% at 50% 56%, #17102844 0%, transparent 62%),
      radial-gradient(120% 80% at 50% 0%, var(--bg-2) 0%, var(--bg) 58%);
    background-repeat: no-repeat;
    color: var(--text);
    font-family: var(--sans);
    line-height: 1.45;
    font-feature-settings: "kern" 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    overflow: hidden;
  }

  /* Skip link — visually hidden until focused (keyboard/SR wayfinding) */
  :global(.skip-link) {
    position: absolute;
    left: 12px;
    top: -60px;
    z-index: 50;
    padding: 8px 14px;
    border-radius: 6px;
    background: var(--surface-1);
    color: var(--text);
    font-family: var(--mono);
    font-size: .72rem;
    letter-spacing: .08em;
    text-decoration: none;
    transition: top .18s ease;
  }
  :global(.skip-link:focus) { top: 12px; }

  :global(button) {
    font-family: var(--sans);
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
  }

  :global(:focus-visible) {
    outline: 2px solid var(--gold);
    outline-offset: 3px;
    border-radius: 3px;
  }

  /* ── Shell ──────────────────────────────────────── */
  .shell {
    position: relative;
    height: 100dvh;
    overflow: hidden;
  }

  /* The star cursor rides the open sky on fine pointers; controls keep their
     native cursors so they still look like controls. Reduced-motion users
     also keep the system cursor (the paired trail is motion). */
  @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .shell {
      cursor: url('/cursor-star.svg') 11 11, auto;
    }
  }

  .canvas {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;
    outline: none;
  }

  .scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  /* ── Atlas corners ──────────────────────────────── */
  .atlas {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 14px 18px;
    pointer-events: none;
  }
  .atlas :global(.astrolabe) { pointer-events: none; }

  .coords {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-style: normal;
    font-family: var(--mono);
    font-size: 0.68rem;
    letter-spacing: 0.04em;
  }
  .coords-k {
    color: var(--text-2);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 0.6rem;
  }
  .coords a {
    color: var(--sapphire);
    text-decoration: underline;
    text-underline-offset: 2px;
    padding: 2px 0;
  }
  .coords a:hover,
  .coords a:focus-visible { color: var(--gold); }

  .colophon {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 0.62rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-2);
  }

  /* Narrow / short viewports: corners compact into a slim line above the
     compass bar (footer stays — it is never hidden). */
  @media (max-width: 899px), (max-height: 559px) {
    .atlas {
      bottom: var(--bar-h);
      padding: 4px 12px;
      align-items: center;
    }
    .atlas :global(.aw-frame) { display: none; }
    .atlas :global(.astrolabe) { padding: 0; }
    .coords { flex-direction: row; gap: 10px; align-items: baseline; }
    .coords-k { display: none; }
    .coords a { font-size: 0.6rem; }
    .colophon span { display: none; }
  }
</style>
