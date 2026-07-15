<script>
  import { fly, fade } from 'svelte/transition';
  import { quintOut, quintIn } from 'svelte/easing';
  import { tick, onMount } from 'svelte';

  import { shelves }   from '$lib/data.js';
  import Backdrop      from '$lib/components/Backdrop.svelte';
  import ShelfPanel    from '$lib/components/ShelfPanel.svelte';
  import OpenBook      from '$lib/components/OpenBook.svelte';

  // ── State ────────────────────────────────────────
  let currentBook    = null;   // the currently open book object
  let view           = 'toc';  // 'toc' | 'reading'
  let activeChapter  = null;
  let activePageIdx  = 0;
  let switching      = false;  // prevent rapid book-switches during animation
  let readerEl;                // the reader container, for scroll-into-view

  // Respect the user's motion preference for the JS-driven book transitions.
  let reduceMotion = false;
  onMount(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotion = mq.matches;
    const update = () => (reduceMotion = mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  });
  $: flyInDur   = reduceMotion ? 0 : 420;
  $: flyOutDur  = reduceMotion ? 0 : 340;
  $: fadeInDur  = reduceMotion ? 0 : 350;
  $: fadeOutDur = reduceMotion ? 0 : 180;

  // When a book opens, bring the reader into view under the compacted shelves.
  $: if (currentBook && readerEl) {
    tick().then(() => setTimeout(() => {
      readerEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120));
  }

  // ── Book open/close/switch ───────────────────────
  async function handleBookClick(book) {
    if (switching) return;
    switching = true;

    if (book.id === currentBook?.id) {
      currentBook = null;
      await sleep(380);
    } else {
      if (currentBook) {
        currentBook = null;
        await sleep(380);
      }
      currentBook   = book;
      view          = 'toc';
      activeChapter = null;
      activePageIdx = 0;
      await sleep(420);
    }

    switching = false;
  }

  // ── Chapter / page navigation ────────────────────
  function handleChapterClick(e) {
    activeChapter = e.detail;
    activePageIdx = 0;
    view = 'reading';
  }

  function handleNavigate(e) {
    const delta  = e.detail;
    const newIdx = activePageIdx + delta;
    if (!activeChapter) return;
    if (newIdx < 0 || newIdx >= activeChapter.pages.length) return;
    activePageIdx = newIdx;
  }

  function handleHome() {
    view          = 'toc';
    activeChapter = null;
    activePageIdx = 0;
  }

  async function handleClose() {
    if (switching) return;
    switching   = true;
    currentBook = null;
    await sleep(380);
    switching   = false;
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
</script>

<svelte:head>
  <title>Robert Gregory — Career &amp; Craft</title>
</svelte:head>

<Backdrop />

<main class="stage">
  <h1 class="vh">Robert Gregory — Career &amp; Craft</h1>

  <!-- Shelves across the top -->
  <ShelfPanel
    {shelves}
    activeBookId={currentBook?.id}
    onBookClick={handleBookClick}
    open={!!currentBook}
  />

  <!-- The open book, centered below -->
  <div class="reader" bind:this={readerEl}>
    {#if currentBook}
      <div
        class="book-area"
        in:fly={{ y: 44, duration: flyInDur, easing: quintOut }}
        out:fly={{ y: 44, duration: flyOutDur, easing: quintIn }}
      >
        <OpenBook
          book={currentBook}
          {view}
          chapter={activeChapter}
          pageIdx={activePageIdx}
          on:chapterclick={handleChapterClick}
          on:navigate={handleNavigate}
          on:home={handleHome}
          on:close={handleClose}
        />
      </div>
    {:else}
      <div class="stage-empty" in:fade={{ duration: fadeInDur, delay: 120 }} out:fade={{ duration: fadeOutDur }}>
        <p class="empty-text">Select a volume from the shelves</p>
      </div>
    {/if}
  </div>
</main>

<style>
  .stage {
    position: relative;
    z-index: 1;
    height: 100dvh;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(14px, 2.6vw, 30px);
    padding: clamp(16px, 3vw, 34px) 16px 60px;
    scrollbar-width: thin;
    scrollbar-color: var(--line-2) transparent;
  }

  .reader {
    width: 100%;
    display: flex;
    justify-content: center;
    perspective: 2400px;
  }

  .book-area {
    width: min(94vw, 760px);
    height: clamp(360px, 66vh, 620px);
    display: flex;
  }

  .book-area :global(.book-spread) {
    width: 100%;
    height: 100%;
  }

  .stage-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 180px;
  }

  .vh {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  .empty-text {
    font-family: var(--mono);
    font-size: .72rem;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--bone-2);
  }
</style>
