<!-- The library wall — one bookcase page per wing, slid by labeled buttons
     (transform-based; nothing scrolls). The shelf indicator announces paging
     politely; deep links auto-page to the wing holding the open volume, and
     closing a folio returns focus to its spine. Without JS the pages stack
     as labeled sections inside an internally scrolling region — every
     volume stays reachable. -->
<script>
  import { tick } from 'svelte';
  import { shelves, slugFor } from '$lib/content/library.js';
  import BookSpine from './BookSpine.svelte';

  export let activeSlug = null;

  let pageIdx = 0;
  let root;

  // Deep links open on the right wing; remember the last open volume so its
  // spine can take focus back when the folio closes.
  let pendingRestore = null;
  $: if (activeSlug) {
    const i = shelves.findIndex((s) => s.books.some((b) => slugFor[b.id] === activeSlug));
    if (i !== -1) pageIdx = i;
    pendingRestore = activeSlug;
  } else if (pendingRestore) {
    restoreFocus(pendingRestore);
    pendingRestore = null;
  }

  async function restoreFocus(slug) {
    await tick();
    root?.querySelector(`[data-testid="spine-${slug}"]`)?.focus({ preventScroll: true });
  }

  $: shelf = shelves[pageIdx];
</script>

<div class="archive" data-testid="library-wall" bind:this={root}>
  <div class="band">
    <div class="track" style="transform: translateX({-100 * pageIdx}%)">
      {#each shelves as s, i}
        <section class="shelf-page" aria-label={s.title} aria-hidden={i !== pageIdx ? 'true' : undefined}>
          <h2 class="nameplate">{s.title}</h2>
          <div class="row" class:inert-page={i !== pageIdx}>
            {#each s.books as book (book.id)}
              <BookSpine
                {book}
                wing={s}
                slug={slugFor[book.id]}
                active={slugFor[book.id] === activeSlug}
              />
            {/each}
          </div>
          <div class="plank" aria-hidden="true"></div>
        </section>
      {/each}
    </div>
  </div>

  <div class="controls">
    <button
      class="page-btn"
      data-testid="shelf-prev"
      on:click={() => (pageIdx = Math.max(0, pageIdx - 1))}
      disabled={pageIdx === 0}
    >
      ‹ Previous shelf
    </button>
    <p class="indicator" data-testid="shelf-indicator" aria-live="polite">
      Shelf {pageIdx + 1} of {shelves.length} — {shelf.title}
    </p>
    <button
      class="page-btn"
      data-testid="shelf-next"
      on:click={() => (pageIdx = Math.min(shelves.length - 1, pageIdx + 1))}
      disabled={pageIdx === shelves.length - 1}
    >
      Next shelf ›
    </button>
  </div>
</div>

<style>
  .archive {
    position: absolute;
    inset: 0;
  }

  .band {
    position: absolute;
    left: clamp(10px, 6vw, 90px);
    right: clamp(10px, 6vw, 90px);
    bottom: clamp(120px, 20vh, 190px);
    overflow: hidden;
  }

  .track {
    display: flex;
    transition: transform 0.45s ease;
  }

  .shelf-page {
    flex: 0 0 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nameplate {
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(0.9rem, 2.2vmin, 1.15rem);
    color: var(--text);
    margin-bottom: 12px;
  }

  .row {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: clamp(6px, 1vw, 12px);
    min-height: clamp(130px, 26vh, 210px);
    padding: 0 8px;
  }
  /* Off-screen pages must not catch tab stops. */
  .inert-page { visibility: hidden; }

  .plank {
    width: min(100%, 760px);
    height: 10px;
    margin-top: 2px;
    border-radius: 3px;
    background: linear-gradient(180deg, var(--ledge-hi), var(--ledge-lo));
    box-shadow: 0 10px 20px -8px #000;
  }

  .controls {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: clamp(64px, 11vh, 100px);
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .page-btn {
    min-height: 44px;
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid var(--line-2);
    background: color-mix(in srgb, var(--bg-2) 70%, transparent);
    color: var(--text);
    font-family: var(--mono);
    font-size: 0.66rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
  .page-btn:hover:not([disabled]),
  .page-btn:focus-visible:not([disabled]) {
    color: var(--gold);
    border-color: color-mix(in srgb, var(--gold) 55%, transparent);
  }
  .page-btn[disabled] { opacity: 0.35; cursor: default; }

  .indicator {
    font-family: var(--mono);
    font-size: 0.66rem;
    letter-spacing: 0.05em;
    color: var(--text-2);
    min-width: 20ch;
    text-align: center;
  }

  /* Without JS: every shelf stacks in an internally scrolling region. */
  :global(html.no-js) .band { top: 60px; bottom: 100px; overflow-y: auto; }
  :global(html.no-js) .track { flex-direction: column; gap: 28px; transform: none !important; }
  :global(html.no-js) .inert-page { visibility: visible; }
  :global(html.no-js) .controls { display: none; }

  @media (max-width: 899px), (max-height: 559px) {
    .band {
      left: 6px;
      right: 6px;
      bottom: calc(var(--bar-h) + 96px);
    }
    .row {
      min-height: clamp(110px, 22vh, 170px);
      flex-wrap: wrap;
      align-content: flex-end;
    }
    .controls {
      bottom: calc(var(--bar-h) + 34px);
      width: calc(100% - 16px);
      justify-content: space-between;
    }
    .indicator { min-width: 0; font-size: 0.56rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .track { transition: none; }
  }
</style>
