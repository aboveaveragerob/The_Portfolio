<script>
  import Folio from '$lib/components/Folio.svelte';

  export let data;
</script>

<svelte:head>
  <title>{data.book.title} — The Library — Robert Gregory</title>
  <meta name="description" content="{data.book.title} — {data.book.subtitle}. A volume from the {data.wing.title} wing." />
</svelte:head>

{#key data.book.id}
  <Folio book={data.book} wing={data.wing} />
{/key}
