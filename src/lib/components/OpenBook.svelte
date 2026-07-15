<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';

  export let book;
  export let view = 'toc';
  export let chapter = null;
  export let pageIdx = 0;

  const dispatch = createEventDispatcher();

  // ── Displayed state lags behind props during flip animation ──
  let displayedView    = view;
  let displayedChapter = chapter;
  let displayedPageIdx = pageIdx;

  // ── Flip animation state ──
  let flipPhase = ''; // '' | 'out' | 'in'
  let animating = false;

  // Watch props for changes and trigger flip
  $: triggerFlip(view, chapter, pageIdx);

  function triggerFlip(newView, newChapter, newPageIdx) {
    if (
      newView    === displayedView    &&
      newChapter === displayedChapter &&
      newPageIdx === displayedPageIdx
    ) return;
    if (animating) return;
    doFlip(newView, newChapter, newPageIdx);
  }

  async function doFlip(newView, newChapter, newPageIdx) {
    animating = true;
    flipPhase = 'out';
    await sleep(300);

    displayedView    = newView;
    displayedChapter = newChapter;
    displayedPageIdx = newPageIdx;

    flipPhase = 'in';
    await sleep(300);

    flipPhase = '';
    animating = false;
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // ── Derived ──
  $: currentPage = displayedChapter?.pages?.[displayedPageIdx];
  $: hasPrev     = displayedChapter && displayedPageIdx > 0;
  $: hasNext     = displayedChapter && displayedPageIdx < (displayedChapter.pages.length - 1);
  $: pageNum     = displayedPageIdx + 1;
  $: pageTotal   = displayedChapter?.pages?.length ?? 0;
</script>

<!-- ── Book spread container ─────────────────────── -->
<div class="book-spread" style="--cover: {book.coverColor}">

  <!-- Close button -->
  <button class="close-btn" on:click={() => dispatch('close')} aria-label="Close book">
    ✕
  </button>

  <!-- Left page — cover endpaper -->
  <div class="page page-left">
    <div class="endpaper">
      <div class="ep-ornament">
        <!-- Vesica Piscis ornament in cover colour -->
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="40" r="22" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
          <circle cx="48" cy="40" r="22" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
          <circle cx="40" cy="40" r="14" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.35"/>
          <circle cx="40" cy="40" r="7"  fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.25"/>
          <circle cx="40" cy="40" r="2"  fill="currentColor" opacity="0.4"/>
        </svg>
      </div>
      <div class="ep-title">{book.title}</div>
      <div class="ep-sub">{book.subtitle}</div>
    </div>
  </div>

  <!-- Right page — content with flip animation -->
  <div class="page page-right">
    <div
      class="content-wrap"
      class:flip-out={flipPhase === 'out'}
      class:flip-in={flipPhase === 'in'}
    >

      {#if displayedView === 'toc'}
        <!-- ── Table of Contents ───────────────────── -->
        <div class="toc">
          <div class="page-header">
            <div class="ph-title">{book.title}</div>
            <div class="ph-sub">{book.subtitle}</div>
          </div>
          <hr class="rule" />
          <div class="toc-label">Contents</div>

          {#if book.chapters.length === 0}
            <p class="toc-empty">This volume is still being written.</p>
          {:else}
            <ol class="chapter-list">
              {#each book.chapters as ch, i (ch.id)}
                <li class="chapter-entry">
                  <button
                    class="chapter-link"
                    on:click={() => dispatch('chapterclick', ch)}
                  >
                    <span class="ch-title">{ch.title}</span>
                    <span class="ch-dots" aria-hidden="true"></span>
                    <span class="ch-num">{i + 1}</span>
                  </button>
                </li>
              {/each}
            </ol>
          {/if}
        </div>

      {:else if displayedView === 'reading' && currentPage}
        <!-- ── Reading view ─────────────────────────── -->
        <div class="reading">
          <div class="page-header">
            <div class="ph-chapter">{displayedChapter?.title}</div>
            <div class="ph-pager">p. {pageNum} / {pageTotal}</div>
          </div>
          <hr class="rule" />
          <div class="page-body">
            <p class="page-text">{@html currentPage.content}</p>

            {#if currentPage.shots?.length}
              <div class="shots-grid" class:shots-wide={currentPage.shots.some(s => s.wide)}>
                {#each currentPage.shots as shot}
                  <figure class="shot" class:shot-wide={shot.wide}>
                    <img src={shot.src} alt={shot.cap} loading="lazy" />
                    <figcaption>{shot.cap}</figcaption>
                  </figure>
                {/each}
              </div>
            {/if}

            {#if currentPage.audio?.length}
              <div class="audio-tracks">
                {#each currentPage.audio as track}
                  <div class="audio-track">
                    <span class="audio-label">{track.title}</span>
                    <audio controls src={track.src}></audio>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
          <hr class="rule rule-bottom" />
          <div class="page-nav">
            {#if hasPrev}
              <button class="nav-btn" on:click={() => dispatch('navigate', -1)}>← Prev</button>
            {:else}
              <span class="nav-spacer"></span>
            {/if}

            <button class="nav-btn nav-home" on:click={() => dispatch('home')}>Home</button>

            {#if hasNext}
              <button class="nav-btn" on:click={() => dispatch('navigate', 1)}>Next →</button>
            {:else}
              <span class="nav-spacer"></span>
            {/if}
          </div>
        </div>

      {:else}
        <!-- Empty/no-content state -->
        <div class="toc">
          <div class="page-header">
            <div class="ph-title">{book.title}</div>
            <div class="ph-sub">{book.subtitle}</div>
          </div>
          <hr class="rule" />
          <p class="toc-empty">This volume is still being written.</p>
        </div>
      {/if}

    </div><!-- /content-wrap -->
  </div><!-- /page-right -->

</div><!-- /book-spread -->

<style>
  /* ── Spread ─────────────────────────────────────── */

  .book-spread {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 740px;
    height: 100%;
    max-height: 520px;
    border-radius: 6px 12px 12px 6px;
    box-shadow:
      0 40px 80px -20px rgba(0,0,0,0.85),
      0 0 0 1px rgba(255,255,255,0.06);
    overflow: visible;
  }

  /* ── Close button ───────────────────────────────── */

  .close-btn {
    position: absolute;
    top: -18px;
    right: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--wood);
    border: 1px solid rgba(184,155,94,0.3);
    color: var(--brass);
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: background 150ms, color 150ms;
  }

  .close-btn:hover {
    background: var(--wood-lt);
    color: var(--gold);
  }

  /* ── Pages ──────────────────────────────────────── */

  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--parchment);
    overflow: hidden;
  }

  .page-left {
    border-radius: 6px 0 0 6px;
    background: color-mix(in srgb, var(--cover) 70%, var(--parchment) 30%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset -6px 0 20px rgba(0,0,0,0.18), inset -1px 0 0 rgba(0,0,0,0.12);
  }

  /* Hide left page on small screens — book stays single-paged */
  @media (max-width: 600px) {
    .page-left { display: none; }
    .book-spread { border-radius: 6px; }
  }

  .page-right {
    border-radius: 0 12px 12px 0;
    background:
      linear-gradient(90deg, #ddd5c4 0 18px, var(--parchment) 28px),
      var(--parchment);
    box-shadow:
      inset 6px 0 20px rgba(0,0,0,0.08),
      inset -4px 0 10px rgba(0,0,0,0.04);
  }

  /* ── Endpaper (left page interior) ─────────────── */

  .endpaper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 24px;
    text-align: center;
    color: rgba(244,239,230,0.85);
  }

  .ep-ornament {
    width: 72px;
    height: 72px;
    color: rgba(244,239,230,0.7);
    margin-bottom: 4px;
  }

  .ep-ornament svg { width: 100%; height: 100%; }

  .ep-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    line-height: 1.3;
  }

  .ep-sub {
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.06em;
    opacity: 0.7;
  }

  /* ── Content wrap + flip animation ─────────────── */

  .content-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform-origin: center center;
  }

  @keyframes flip-out {
    from { transform: perspective(1200px) rotateY(0deg);   opacity: 1; }
    to   { transform: perspective(1200px) rotateY(-90deg); opacity: 0.4; }
  }

  @keyframes flip-in {
    from { transform: perspective(1200px) rotateY(90deg); opacity: 0.4; }
    to   { transform: perspective(1200px) rotateY(0deg);  opacity: 1; }
  }

  .content-wrap.flip-out {
    animation: flip-out 300ms ease-in forwards;
    pointer-events: none;
  }

  .content-wrap.flip-in {
    animation: flip-in 300ms ease-out forwards;
  }

  /* ── TOC ────────────────────────────────────────── */

  .toc, .reading {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 28px 28px 20px 36px;
    overflow: hidden;
  }

  .page-header { margin-bottom: 2px; }

  .ph-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.04em;
    line-height: 1.3;
  }

  .ph-sub {
    font-size: 11px;
    font-weight: 400;
    color: var(--ink-lt);
    letter-spacing: 0.04em;
    margin-top: 2px;
  }

  .ph-chapter {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: 0.03em;
    line-height: 1.4;
  }

  .ph-pager {
    font-size: 10px;
    color: var(--ink-lt);
    margin-top: 2px;
    letter-spacing: 0.04em;
  }

  .rule {
    border: none;
    border-top: 1px solid rgba(42,41,40,0.2);
    margin: 10px 0;
  }

  .rule-bottom {
    margin-top: auto;
    margin-bottom: 0;
  }

  .toc-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--ink-lt);
    margin-bottom: 10px;
  }

  .toc-empty {
    font-size: 13px;
    color: var(--ink-lt);
    font-style: italic;
    line-height: 1.6;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .chapter-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    overflow-y: auto;
  }

  .chapter-entry { display: block; }

  .chapter-link {
    display: flex;
    align-items: baseline;
    gap: 0;
    width: 100%;
    padding: 6px 0;
    text-align: left;
    color: var(--ink);
    font-size: 12.5px;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.4;
    border-bottom: 1px solid transparent;
    transition: color 150ms;
  }

  .chapter-link:hover {
    color: var(--wood-dk);
  }

  .chapter-link:hover .ch-title {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .ch-title { flex: 0 1 auto; }

  .ch-dots {
    flex: 1;
    border-bottom: 1.5px dotted rgba(42,41,40,0.25);
    margin: 0 6px 3px;
    min-width: 12px;
  }

  .ch-num {
    flex: 0 0 auto;
    font-size: 11px;
    color: var(--ink-lt);
    font-weight: 400;
  }

  /* ── Reading ────────────────────────────────────── */

  .page-body {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: rgba(42,41,40,0.2) transparent;
  }

  .page-text {
    font-size: 13px;
    color: var(--ink);
    line-height: 1.75;
    letter-spacing: 0.01em;
  }

  /* ── Inline photos ──────────────────────────────── */

  .shots-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 14px;
  }

  .shots-grid.shots-wide {
    grid-template-columns: 1fr;
  }

  .shot {
    margin: 0;
  }

  .shot-wide {
    grid-column: 1 / -1;
  }

  .shot img {
    width: 100%;
    border-radius: 4px;
    display: block;
  }

  .shot figcaption {
    font-size: 11px;
    color: var(--ink-lt);
    margin-top: 4px;
    font-style: italic;
  }

  /* ── Audio players ──────────────────────────────── */

  .audio-tracks {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .audio-label {
    display: block;
    font-size: 11px;
    color: var(--ink-lt);
    margin-bottom: 4px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  audio {
    width: 100%;
    height: 36px;
  }

  /* ── Navigation ─────────────────────────────────── */

  .page-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
  }

  .nav-btn {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink);
    padding: 4px 8px;
    border-radius: 3px;
    transition: color 150ms, background 150ms;
  }

  .nav-btn:hover {
    color: var(--wood-dk);
    background: rgba(42,41,40,0.07);
  }

  .nav-home {
    color: var(--ink-lt);
  }

  .nav-spacer {
    width: 56px; /* keeps Home centred */
    display: block;
  }
</style>
