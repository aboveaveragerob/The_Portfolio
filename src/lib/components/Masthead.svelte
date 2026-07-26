<!-- The masthead — the library's nameplate. Identity lives here now (the
     dashboard's center sun retired with the instruments): a small spinning
     golden-spiral mark, the wordmark, and the concept line. Fixed top-left;
     compacts to a slim chip row on narrow/short viewports. -->
<script>
  import GoldenSpiral from './geometry/GoldenSpiral.svelte';
</script>

<header class="masthead" data-testid="masthead">
  <span class="mark" aria-hidden="true">
    <GoldenSpiral spin size={44} strokeWidth={2.2} opacity={0.7} />
  </span>
  <div class="mh-text">
    <h1 class="wordmark">Robert Gregory</h1>
    <p class="mh-role">Financial Operations &amp; Trading</p>
    <p class="mh-tag">A library among the stars</p>
  </div>
</header>

<style>
  .masthead {
    position: fixed;
    top: clamp(10px, 2.4vh, 22px);
    left: clamp(14px, 3vw, 32px);
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mark {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
  }

  .mh-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .wordmark {
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(1.05rem, 2.4vmin, 1.4rem);
    line-height: 1.1;
    color: var(--text);
  }

  .mh-role {
    font-family: var(--mono);
    font-size: 0.6rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-2);
  }

  .mh-tag {
    font-family: var(--serif);
    font-style: italic;
    font-size: 0.78rem;
    color: var(--rose);
  }

  @media (max-width: 899px), (max-height: 559px) {
    .masthead {
      top: 0;
      left: 0;
      right: 0;
      height: var(--chip-h);
      padding: 0 12px;
      gap: 10px;
      background: color-mix(in srgb, var(--bg) 78%, transparent);
      border-bottom: 1px solid var(--line-2);
      backdrop-filter: blur(6px);
    }
    .mark { width: 30px; height: 30px; }
    .mark :global(svg) { width: 30px; height: 30px; }
    .wordmark { font-size: 0.95rem; }
    .mh-role { font-size: 0.52rem; }
    .mh-tag { display: none; }
  }
</style>
