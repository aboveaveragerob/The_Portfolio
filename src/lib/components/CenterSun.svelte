<!-- The center sun — Robert's anchor, permanently fixed at screen center on
     the radial dashboard (compact top-left chip on narrow/short viewports).
     The whole sun is the Home link: clicking it resets every overlay because
     overlays are routes. Monogram placeholder in the disc — a profile photo
     can drop into `.core` later without touching layout. -->
<script>
  import GoldenSpiral from './geometry/GoldenSpiral.svelte';

  export let home = false;
</script>

<a
  class="sun"
  class:home
  href="/"
  data-testid="center-sun"
  aria-label="Robert Gregory — return to the archive entry"
>
  <span class="disc" aria-hidden="true">
    <span class="spiral"><GoldenSpiral spin size={220} strokeWidth={1.3} /></span>
    <span class="core">RG</span>
  </span>
  <span class="idblock">
    {#if home}
      <h1 class="name">Robert Gregory</h1>
      <span class="role">Financial Operations &amp; Trading</span>
      <span class="tag">A career archived among the stars</span>
    {:else}
      <span class="name">Robert Gregory</span>
      <span class="role">Financial Operations &amp; Trading</span>
    {/if}
  </span>
</a>

<style>
  .sun {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(6px, 1.2vh, 12px);
    text-align: center;
    text-decoration: none;
    color: var(--text);
    max-width: 34vmin;
  }

  .disc {
    position: relative;
    width: clamp(84px, 13vmin, 150px);
    height: clamp(84px, 13vmin, 150px);
    display: grid;
    place-items: center;
  }
  .home .disc {
    width: clamp(104px, 17vmin, 190px);
    height: clamp(104px, 17vmin, 190px);
  }

  .spiral {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
  }
  .spiral :global(svg) {
    width: 100%;
    height: 100%;
  }

  .core {
    width: 58%;
    height: 58%;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(circle at 32% 28%, #241a3a, var(--bg-2) 70%);
    border: 1px solid color-mix(in oklab, var(--gold) 55%, transparent);
    box-shadow: 0 0 24px #fcd34d22, 0 6px 22px #00000066;
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(1.15rem, 3.4vmin, 2rem);
    letter-spacing: 0.04em;
    color: var(--gold);
  }

  .idblock {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .name {
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(1rem, 2.6vmin, 1.5rem);
    line-height: 1.15;
    color: var(--text);
  }
  .home .name {
    font-size: clamp(1.2rem, 3.2vmin, 1.9rem);
  }

  .role {
    font-family: var(--mono);
    font-size: clamp(0.58rem, 1.3vmin, 0.72rem);
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-2);
  }

  .tag {
    font-family: var(--serif);
    font-style: italic;
    font-size: clamp(0.78rem, 1.8vmin, 0.95rem);
    color: var(--rose);
  }

  .sun:hover .core,
  .sun:focus-visible .core {
    box-shadow: 0 0 34px #fcd34d44, 0 6px 22px #00000066;
    border-color: var(--gold);
  }

  /* Narrow / short viewports: the sun docks as a compact header chip. */
  @media (max-width: 899px), (max-height: 559px) {
    .sun {
      top: 0;
      left: 0;
      right: auto;
      transform: none;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      max-width: none;
      padding: 8px 12px;
      text-align: left;
    }
    .sun .disc,
    .home .disc {
      width: 40px;
      height: 40px;
    }
    .spiral { display: none; }
    .core { width: 100%; height: 100%; font-size: 0.95rem; }
    .idblock { gap: 0; align-items: flex-start; }
    .name, .home .name { font-size: 0.95rem; }
    .role { font-size: 0.55rem; }
    .tag { display: none; }
  }
</style>
