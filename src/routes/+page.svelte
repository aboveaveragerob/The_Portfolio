<!-- The landing — the resume, open on arrival. The Brinker volume lies open
     over the library wall (shelves and stars dimly visible around it);
     closing it reveals the library among the stars. -->
<script>
  import LibraryWall from '$lib/components/LibraryWall.svelte';
  import Folio from '$lib/components/Folio.svelte';
  import { bookBySlug } from '$lib/content/library.js';

  const { wing, book } = bookBySlug('brinker-capital');
</script>

<svelte:head>
  <title>Robert Gregory — A Library Among the Stars</title>
  <meta
    name="description"
    content="Robert Gregory’s resume, shelved in a library among the stars — UMA trading and financial operations at Brinker Capital, with volumes of music, horticulture, technology, and craft."
  />
</svelte:head>

<div class="landing" data-testid="view-home">
  <LibraryWall activeSlug="brinker-capital" />
  <Folio {book} {wing} closeHref="/library" />
</div>

<style>
  .landing {
    position: absolute;
    inset: 0;
  }
</style>
