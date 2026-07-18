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

  /* ── Original design tokens ─────────────────────── */
  :global(:root) {
    --bg:      #0b0912;
    --line-2:  #ffffff22;

    --bone-0:  #f3eddf;
    --bone-1:  #d2cad9;
    --bone-2:  #938aa3;

    --paper:   #f3ecdd;
    --paper-edge: #d9d0bd;      /* page gutter shadow (was hardcoded in OpenBook) */
    --paper-line: #00000018;    /* hairline rules on the paper pages (OpenBook) */
    --ink:     #211b16;
    --ink-2:   #5b5247;
    --ink-3:   #6f6455;         /* darkened from #8a7f6c → clears WCAG AA on paper */
    --ink-eyebrow: #8a5a1f;     /* chapter kicker — clears AA (was #a06a2e) */

    --pink:    #ff2d78;
    --violet:  #b25cff;

    /* Cosmic surfaces — shared by shelves, spines, and the podium so the
       whole composition reads as one system (no separate wood/gold palette). */
    --surface-1: #241a33;
    --surface-2: #160f22;
    --ledge-hi:  #3c3552;
    --ledge-lo:  #191524;

    --grad:     linear-gradient(100deg,#ffb43d,#ff5a3d 26%,#ff2d78 50%,#b25cff 74%,#43b6ff);
    --grad-ink: linear-gradient(100deg,#d9641a,#d62f5a 30%,#b3266e 52%,#7b3fd6 76%,#236fc9);

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
    background:
      radial-gradient(60% 42% at 50% 62%, #2a153a4d 0%, #12081f00 60%),
      radial-gradient(46% 30% at 84% 16%, #22a7f01f 0%, #22a7f000 70%),
      radial-gradient(50% 34% at 12% 26%, #ff2d7817 0%, #ff2d7800 70%),
      radial-gradient(120% 80% at 50% 0%, #1c1330 0%, var(--bg) 55%);
    background-repeat: no-repeat;
    background-size: 150% 150%;
    animation: bg-drift 34s ease-in-out infinite alternate;
    color: var(--bone-1);
    font-family: var(--sans);
    line-height: 1.45;
    font-feature-settings: "kern" 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    overflow: hidden;
  }

  @keyframes bg-drift {
    0%   { background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%; }
    50%  { background-position: -9% 7%, 9% -6%, -6% 9%, 0% 0%; }
    100% { background-position: 8% -9%, -8% 9%, 9% -6%, 0% 0%; }
  }

  /* Aurora: a slow drifting colour bloom so the void reads as alive */
  :global(body::before) {
    content: "";
    position: fixed;
    inset: -25%;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(40% 34% at 32% 30%, #b25cff33 0%, transparent 68%),
      radial-gradient(38% 30% at 70% 58%, #22a7f02b 0%, transparent 68%),
      radial-gradient(34% 28% at 54% 82%, #ff2d7826 0%, transparent 68%);
    mix-blend-mode: screen;
    will-change: transform;
    animation: aurora 30s ease-in-out infinite alternate;
  }

  @keyframes aurora {
    0%   { transform: translate3d(-3%,-2%,0) rotate(-6deg) scale(1); }
    100% { transform: translate3d(4%,3%,0) rotate(8deg) scale(1.16); }
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
    outline: 2px solid var(--violet);
    outline-offset: 3px;
    border-radius: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(body), :global(body::before) { animation: none !important; }
  }
</style>
