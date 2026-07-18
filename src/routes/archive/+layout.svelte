<!-- Archive scene — the shelf lives in the layout so opening
     /archive/[slug] lays the folio over it without re-rendering. -->
<script>
  import { page } from '$app/stores';
  import ArchiveShelf from '$lib/components/ArchiveShelf.svelte';

  $: activeSlug = $page.params.slug ?? null;
</script>

<div class="view" data-testid="view-archive">
  <header class="view-head">
    <h1>Archive</h1>
    <p class="view-sub">Projects &amp; volumes</p>
  </header>

  <ArchiveShelf {activeSlug} />

  <slot />
</div>

<style>
  .view { position: absolute; inset: 0; }

  .view-head {
    position: absolute;
    top: clamp(12px, 3vh, 28px);
    left: clamp(14px, 3vw, 32px);
    z-index: 1;
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

  @media (max-width: 899px), (max-height: 559px) {
    .view-head { top: calc(var(--chip-h) + 8px); }
  }
</style>
