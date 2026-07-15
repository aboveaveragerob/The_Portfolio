<script>
  import { fly, fade } from 'svelte/transition';
  import { quintOut, quintIn } from 'svelte/easing';

  import { shelves }   from '$lib/data.js';
  import ShelfPanel    from '$lib/components/ShelfPanel.svelte';
  import OpenBook      from '$lib/components/OpenBook.svelte';
  import Podium        from '$lib/components/Podium.svelte';

  // ── State ────────────────────────────────────────
  let currentBook    = null;   // the currently open book object
  let view           = 'toc';  // 'toc' | 'reading'
  let activeChapter  = null;
  let activePageIdx  = 0;
  let switching      = false;  // prevent rapid book-switches during animation

  // ── Book open/close/switch ───────────────────────
  async function handleBookClick(book) {
    if (switching) return;
    switching = true;

    if (book.id === currentBook?.id) {
      // Close the open book
      currentBook = null;
      await sleep(380);
    } else {
      // Slide old book down first, then open new one
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
  <title>Alastair Zeved — Library of Creation</title>
</svelte:head>

<div class="library">

  <!-- ── Left column: shelves ────────────────────── -->
  <div class="shelf-col">
    <ShelfPanel
      {shelves}
      activeBookId={currentBook?.id}
      onBookClick={handleBookClick}
    />
  </div>

  <!-- ── Right area: reading stage ───────────────── -->
  <main class="stage" aria-label="Reading stage">

    {#if currentBook}
      <!-- Book + podium — fly in from below when opened, fly out when closed -->
      <div
        class="stage-content"
        in:fly={{ y: 44, duration: 420, easing: quintOut }}
        out:fly={{ y: 44, duration: 340, easing: quintIn }}
      >
        <div class="book-area">
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
        <div class="podium-area">
          <Podium />
        </div>
      </div>

    {:else}
      <!-- Empty state while no book is open -->
      <div
        class="stage-empty"
        in:fade={{ duration: 350, delay: 120 }}
        out:fade={{ duration: 180 }}
      >
        <div class="empty-inner">
          <svg class="empty-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 10 Q12 6 16 6 L32 6 L32 58 L16 58 Q12 58 12 54 Z" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.4"/>
            <path d="M32 6 L48 6 Q52 6 52 10 L52 54 Q52 58 48 58 L32 58 Z" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.4"/>
            <line x1="32" y1="6" x2="32" y2="58" stroke="currentColor" stroke-width="0.8" opacity="0.25"/>
          </svg>
          <p class="empty-text">Select a volume from the shelves</p>
        </div>
      </div>
    {/if}

  </main>
</div>

<style>
  /* ── Root layout ────────────────────────────────── */

  .library {
    display: grid;
    grid-template-columns: 250px 1fr;
    grid-template-rows: 100dvh;
    height: 100dvh;
    overflow: hidden;
  }

  /* ── Shelf column ───────────────────────────────── */

  .shelf-col {
    grid-column: 1;
    overflow: hidden;
    border-right: 1px solid rgba(255,255,255,0.05);
    background: linear-gradient(to right, #170F0B, var(--void));
  }

  /* ── Reading stage ──────────────────────────────── */

  .stage {
    grid-column: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 24px 20px;
    position: relative;
    overflow: hidden;
  }

  .stage-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 740px;
  }

  /* ── Book area: fills available height ──────────── */

  .book-area {
    width: 100%;
    /* Let the book take up a comfortable portion of the stage height */
    height: clamp(320px, 56vh, 520px);
    display: flex;
    align-items: stretch;
  }

  /* Propagate full height into OpenBook */
  .book-area :global(.book-spread) {
    height: 100%;
    width: 100%;
  }

  .podium-area {
    width: 90%;
    max-width: 640px;
  }

  /* ── Empty state ────────────────────────────────── */

  .stage-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .empty-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    opacity: 0.35;
  }

  .empty-icon {
    width: 56px;
    height: 56px;
    color: var(--brass);
  }

  .empty-text {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brass);
  }

  /* ── Mobile layout ──────────────────────────────── */

  @media (max-width: 720px) {
    .library {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
      height: 100dvh;
    }

    .shelf-col {
      grid-column: 1;
      grid-row: 2;
      border-right: none;
      border-top: 1px solid rgba(255,255,255,0.05);
      background: linear-gradient(to top, #170F0B, var(--void));
      max-height: 180px;
      overflow-x: auto;
      overflow-y: hidden;
    }

    .stage {
      grid-column: 1;
      grid-row: 1;
      padding: 16px 12px 8px;
    }

    .book-area {
      height: clamp(280px, 55vw, 400px);
    }
  }

  /* ── Narrow desktop (between 720–900px) ─────────── */

  @media (min-width: 721px) and (max-width: 900px) {
    .library {
      grid-template-columns: 200px 1fr;
    }
  }
</style>
