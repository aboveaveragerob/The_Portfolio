<!-- Volume detail — placeholder card listing the volume's chapters.
     The full Folio reader (paged panels, vesica turns) replaces this body
     in the Archive phase; the route, slugs, and links are already final. -->
<script>
  export let data;
</script>

<svelte:head>
  <title>{data.book.title} — Archive — Robert Gregory</title>
  <meta name="description" content="{data.book.title} — {data.book.subtitle}. A volume from the {data.wing.title} wing." />
</svelte:head>

<section class="volume" data-testid="folio" aria-label="{data.book.title} — volume">
  <header class="vol-head">
    <p class="vol-eyebrow">{data.wing.title}</p>
    <h2 class="vol-title">{data.book.title}</h2>
    <p class="vol-sub">{data.book.subtitle}</p>
    <a class="vol-close" href="/archive" data-testid="folio-close" aria-label="Close volume">✕</a>
  </header>
  <div class="vol-body">
    {#if data.book.chapters.length}
      <ol class="vol-toc">
        {#each data.book.chapters as ch}
          <li>{ch.title}</li>
        {/each}
      </ol>
    {:else}
      <p class="vol-empty">This volume is still being written.</p>
    {/if}
  </div>
</section>

<style>
  .volume {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: min(92vw, 560px);
    max-height: min(78vh, 600px);
    display: flex;
    flex-direction: column;
    background: var(--bg-2);
    border: 1px solid var(--line-2);
    border-radius: 14px;
    box-shadow: 0 18px 50px #00000066;
  }

  .vol-head {
    position: relative;
    padding: 16px 56px 12px 20px;
    border-bottom: 1px solid var(--line-2);
  }
  .vol-eyebrow {
    font-family: var(--mono);
    font-size: 0.62rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-2);
  }
  .vol-title {
    font-family: var(--serif);
    font-weight: 500;
    font-size: 1.25rem;
    color: var(--text);
  }
  .vol-sub {
    font-family: var(--serif);
    font-style: italic;
    font-size: 0.85rem;
    color: var(--text-2);
  }
  .vol-close {
    position: absolute;
    top: 12px;
    right: 12px;
    display: grid;
    place-items: center;
    min-width: 40px;
    min-height: 40px;
    border-radius: 10px;
    border: 1px solid var(--line-2);
    color: var(--text-2);
    text-decoration: none;
    font-size: 0.85rem;
  }
  .vol-close:hover,
  .vol-close:focus-visible {
    color: var(--gold);
    border-color: color-mix(in srgb, var(--gold) 55%, transparent);
  }

  .vol-body {
    overflow-y: auto;
    min-height: 0;
    padding: 14px 20px 18px;
  }
  .vol-toc {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 0.9rem;
  }
  .vol-empty {
    font-family: var(--serif);
    font-style: italic;
    color: var(--text-2);
  }

  @media (max-width: 899px), (max-height: 559px) {
    .volume {
      top: auto;
      bottom: calc(var(--bar-h) + 30px);
      transform: translateX(-50%);
      max-height: min(60vh, 480px);
    }
  }
</style>
