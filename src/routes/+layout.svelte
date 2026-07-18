<svelte:head>
  <meta name="theme-color" content="#0b0912" />
</svelte:head>

<slot />

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

    /* Legacy aliases — consumed by pre-overhaul components only; removed
       with their consumers in the Archive/Folio phase. */
    --bone-0:  var(--text);
    --bone-1:  var(--text);
    --bone-2:  var(--text-2);
    --pink:    var(--rose);

    --grad:     linear-gradient(100deg, var(--gold), var(--rose) 32%, var(--violet) 68%, var(--sapphire));
    --grad-ink: linear-gradient(100deg,#a97c14,#a35f2f 32%,#6d3fd6 68%,#2f5fd0);

    --serif: 'Fraunces', Georgia, serif;
    --sans:  'Switzer', 'Helvetica Neue', system-ui, sans-serif;
    --mono:  'JetBrains Mono', ui-monospace, monospace;
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

  :global(.gradtext) {
    color: var(--bone-0);            /* solid fallback if background-clip:text is unsupported */
    background: var(--grad);
    -webkit-background-clip: text;
    background-clip: text;
  }
  @supports ((-webkit-background-clip: text) or (background-clip: text)) {
    :global(.gradtext) { color: transparent; }
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
    color: var(--bone-0);
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
</style>
