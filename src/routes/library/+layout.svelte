<!-- The library scene — the wall lives in the layout so opening
     /library/[slug] lays the folio over it without re-rendering. -->
<script>
  import { page } from '$app/stores';
  import LibraryWall from '$lib/components/LibraryWall.svelte';

  $: activeSlug = $page.params.slug ?? null;
</script>

<div class="view" data-testid="view-library">
  <header class="view-head">
    <h2>The Library</h2>
    <p class="view-sub">Career &amp; craft, shelved by wing</p>
  </header>

  <LibraryWall {activeSlug} />

  <slot />
</div>

<style>
  .view { position: absolute; inset: 0; }

  .view-head {
    position: absolute;
    top: clamp(64px, 12vh, 96px);
    left: clamp(14px, 3vw, 32px);
    z-index: 1;
  }
  h2 {
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(1rem, 2.4vmin, 1.35rem);
    color: var(--text);
  }
  .view-sub {
    font-family: var(--mono);
    font-size: 0.64rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-2);
  }

  @media (max-width: 899px), (max-height: 559px) {
    .view-head { top: calc(var(--chip-h) + 8px); }
  }
</style>
