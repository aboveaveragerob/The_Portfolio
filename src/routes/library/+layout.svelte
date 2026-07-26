<!-- The library scene — the wall lives in the layout so opening
     /library/[slug] lays the folio over it without re-rendering. -->
<script>
  import { page } from '$app/stores';
  import LibraryWall from '$lib/components/LibraryWall.svelte';

  $: activeSlug = $page.params.slug ?? null;
</script>

<div class="view" data-testid="view-library">
  <LibraryWall {activeSlug} />

  <slot />
</div>

<style>
  .view { position: absolute; inset: 0; }
</style>
