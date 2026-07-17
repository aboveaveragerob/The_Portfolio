<script>
  import { fly, fade } from 'svelte/transition';
  import { quintOut, quintIn } from 'svelte/easing';
  import { onMount } from 'svelte';

  import { wings }      from '$lib/data.js';
  import Backdrop      from '$lib/components/Backdrop.svelte';
  import ShelfPanel    from '$lib/components/ShelfPanel.svelte';
  import OpenBook      from '$lib/components/OpenBook.svelte';
  import Podium        from '$lib/components/Podium.svelte';

  // The volume the site lands pre-staged on: pulled from the shelf, ready to open.
  const STAGED_BOOK_ID = 'book-brinker';

  // Wings arrange into a cross around the centred reader: the career/civic rail
  // across the top, the four personal Wings split down the left and right sides.
  const topWings   = wings.filter(w => w.position === 'top');
  const leftWings  = wings.filter(w => w.position === 'left');
  const rightWings = wings.filter(w => w.position === 'right');

  // ── State ────────────────────────────────────────
  let currentBook    = null;   // the currently open book object
  let view           = 'toc';  // 'toc' | 'reading'
  let activeChapter  = null;
  let activePageIdx  = 0;
  let switching      = false;  // prevent rapid book-switches during animation

  // While nothing is open, highlight the staged volume so the shelf reads as
  // "ready to open" rather than a cold, inert rail.
  $: stagedBookId = currentBook ? null : STAGED_BOOK_ID;

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

  // Open the staged volume from the landing hint. Search every Wing so the
  // CTA keeps working wherever the staged volume lives (the spine highlight
  // already matches across all Wings).
  function openStaged() {
    const book = wings.flatMap(w => w.books).find(b => b.id === STAGED_BOOK_ID);
    if (book) handleBookClick(book);
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

<a class="skip-link" href="#reader">Skip to the reading area</a>

<Backdrop />

<main class="stage">
  <!-- Visible wordmark / identity (was screen-reader-only) -->
  <header class="masthead">
    <h1 class="wordmark">Robert Gregory</h1>
    <p class="tagline">Career &amp; Craft — a library</p>
  </header>

  <!-- Career & civic Wing: a rail across the top, always visible "upstairs" -->
  <div class="rail-top">
    <ShelfPanel
      wings={topWings}
      orientation="horizontal"
      activeBookId={currentBook?.id}
      {stagedBookId}
      onBookClick={handleBookClick}
      open={!!currentBook}
    />
  </div>

  <!-- Personal Wings flank the reader: Physical + Digital left, Cognitive + Social right -->
  <div class="wing-col wing-left">
    <ShelfPanel
      wings={leftWings}
      orientation="vertical"
      activeBookId={currentBook?.id}
      {stagedBookId}
      onBookClick={handleBookClick}
      open={!!currentBook}
    />
  </div>

  <!-- The open book rests on the podium, centered between the Wings -->
  <div class="reader" id="reader" tabindex="-1">
    <div class="book-dock">
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
          <p class="empty-kicker">Ready to open</p>
          <p class="empty-lead">
            <strong>Brinker Capital</strong> is pulled from the shelf and waiting.
          </p>
          <button class="empty-open" on:click={openStaged}>Open the volume</button>
          <p class="empty-hint">or pick any spine from the shelves above</p>
        </div>
      {/if}
    </div>

    <Podium />
  </div>

  <div class="wing-col wing-right">
    <ShelfPanel
      wings={rightWings}
      orientation="vertical"
      activeBookId={currentBook?.id}
      {stagedBookId}
      onBookClick={handleBookClick}
      open={!!currentBook}
    />
  </div>

  <footer class="colophon">
    <span>Robert Gregory</span>
    <span aria-hidden="true">·</span>
    <span>Career &amp; Craft</span>
  </footer>
</main>

<style>
  .stage {
    position: relative;
    z-index: 1;
    height: 100dvh;
    overflow: hidden;
    display: grid;
    /* A cross around the centred reader: masthead / top rail / [left | reader |
       right] / footer. The side columns take their content width; the reader
       gets the rest. Row heights: everything is auto except the reader row,
       which absorbs the free space — so the book-dock fills it and nothing
       scrolls the page. */
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "masthead masthead masthead"
      "topwing  topwing  topwing"
      "left     reader   right"
      "footer   footer   footer";
    /* items stretch to fill their rows (default) so the reader row's free
       space flows into the book-dock — do not set align-items:start here. */
    gap: clamp(6px, 1.4vh, 16px) clamp(10px, 1.8vw, 22px);
    padding: clamp(8px, 1.8vh, 22px) 16px clamp(8px, 1.6vh, 18px);
  }

  .masthead  { grid-area: masthead; }
  .rail-top  { grid-area: topwing; min-width: 0; }
  .wing-left { grid-area: left; }
  .reader    { grid-area: reader; }
  .wing-right{ grid-area: right; }
  .colophon  { grid-area: footer; }

  /* Side Wing columns: establish a height/width context so the vertical
     ShelfPanel can fill the reader row and scroll internally without ever
     growing the page. */
  .wing-col {
    min-height: 0;
    min-width: 0;
    display: flex;
    align-self: stretch;
  }

  /* ── Masthead ─────────────────────────────────── */
  .masthead {
    text-align: center;
    line-height: 1;
  }
  .wordmark {
    margin: 0;
    font-family: var(--serif);
    font-weight: 600;
    font-size: clamp(1.15rem, 3.2vw, 1.7rem);
    letter-spacing: -.01em;
    color: var(--bone-0);
  }
  .tagline {
    margin: 4px 0 0;
    font-family: var(--mono);
    font-size: clamp(.52rem, 1.5vw, .64rem);
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--bone-2);
  }

  /* ── Reader region (book + podium) ─────────────── */
  .reader {
    min-height: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
    perspective: 2400px;
  }
  .reader:focus { outline: none; }

  .book-dock {
    flex: 1;
    min-height: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding-top: 18px;   /* clearance for the close button that sits above the book */
  }

  /* flex:1 1 0 + min-height:0 forces the book to the region's height reliably
     (percentage height doesn't resolve through this flex chain); the book's
     own TOC / page-body scroll internally, so the page itself never scrolls. */
  .book-area {
    flex: 1 1 0;
    min-height: 0;
    width: min(94vw, 760px);
    display: flex;
  }

  .book-area :global(.book-spread) {
    width: 100%;
    height: 100%;
  }

  /* ── Landing hint (nothing open) ───────────────── */
  .stage-empty {
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
    padding: 0 16px;
  }
  .empty-kicker {
    margin: 0;
    font-family: var(--mono);
    font-size: .62rem;
    letter-spacing: .3em;
    text-transform: uppercase;
    color: var(--pink);
  }
  .empty-lead {
    margin: 0;
    font-family: var(--serif);
    font-size: clamp(1rem, 2.6vw, 1.35rem);
    color: var(--bone-0);
  }
  .empty-lead strong { font-weight: 600; }
  .empty-open {
    margin-top: 4px;
    padding: 10px 22px;
    border-radius: 999px;
    border: 1px solid var(--violet);
    background: #b25cff1a;
    color: var(--bone-0);
    font-family: var(--mono);
    font-size: .68rem;
    letter-spacing: .16em;
    text-transform: uppercase;
    transition: background .18s, border-color .18s, transform .18s;
  }
  .empty-open:hover { background: #b25cff33; transform: translateY(-2px); }
  .empty-hint {
    margin: 2px 0 0;
    font-family: var(--mono);
    font-size: .58rem;
    letter-spacing: .12em;
    color: var(--bone-2);
  }

  /* ── Colophon ─────────────────────────────────── */
  .colophon {
    display: flex;
    justify-content: center;
    gap: 10px;
    font-family: var(--mono);
    font-size: .54rem;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--bone-2);
  }

  /* ── Narrow (< --bp-md 900px): the cross flattens into a single column —
        the top rail, then both side Wings (now full-width horizontal rails),
        then the reader, then the footer. Everything still fits one screen;
        each rail scrolls sideways internally. ─────────────────────────── */
  @media (max-width: 899px) {
    .stage {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto auto minmax(0, 1fr) auto;
      grid-template-areas:
        "masthead"
        "topwing"
        "left"
        "right"
        "reader"
        "footer";
    }
    .wing-col { align-self: auto; }
  }

  @media (max-width: 640px) {
    .book-area { width: 94vw; }
  }
</style>
