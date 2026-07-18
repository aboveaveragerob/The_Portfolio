<svelte:head>
  <title>Scrolls — Robert Gregory</title>
  <meta name="description" content="Degrees, licenses, and certificates — B.S. Accounting magna cum laude, Series 65, Python in Excel." />
</svelte:head>

<div class="view" data-testid="view-scrolls">
  <header class="view-head">
    <h1>Scrolls</h1>
    <p class="view-sub">Education &amp; licensing</p>
  </header>
  <p class="stub">This chart is still being drawn.</p>
</div>

<style>
  .view { position: absolute; inset: 0; }
  .view-head {
    position: absolute;
    top: clamp(12px, 3vh, 28px);
    left: clamp(14px, 3vw, 32px);
  }
  h1 {
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(1.1rem, 2.8vmin, 1.6rem);
    color: var(--text);
  }
  .view-sub {
    font-family: var(--mono);
    font-size: 0.66rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-2);
  }
  .stub {
    position: absolute;
    left: clamp(14px, 3vw, 32px);
    bottom: clamp(70px, 12vh, 110px);
    font-family: var(--serif);
    font-style: italic;
    color: var(--text-2);
  }
  @media (max-width: 899px), (max-height: 559px) {
    .view-head { top: calc(var(--chip-h) + 8px); }
  }
</style>
