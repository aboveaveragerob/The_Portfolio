<script>
  import { createEventDispatcher } from 'svelte';

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
  let pending   = null; // latest nav target that arrived mid-flip

  // Watch props for changes and trigger flip
  $: triggerFlip(view, chapter, pageIdx);

  function triggerFlip(newView, newChapter, newPageIdx) {
    if (
      newView    === displayedView    &&
      newChapter === displayedChapter &&
      newPageIdx === displayedPageIdx
    ) return;
    if (animating) {
      // A flip is in progress — remember the latest target and apply it after.
      pending = { newView, newChapter, newPageIdx };
      return;
    }
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

    if (pending) {
      const next = pending;
      pending = null;
      if (
        next.newView    !== displayedView    ||
        next.newChapter !== displayedChapter ||
        next.newPageIdx !== displayedPageIdx
      ) doFlip(next.newView, next.newChapter, next.newPageIdx);
    }
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
<div class="book-spread">

  <button class="close-btn" on:click={() => dispatch('close')} aria-label="Close the book">✕</button>

  <!-- Left page — front matter / endpaper -->
  <div class="page page-left">
    <div class="endpaper">
      <div class="ep-ornament" aria-hidden="true">
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="epGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#d9641a"/>
              <stop offset="52%" stop-color="#b3266e"/>
              <stop offset="100%" stop-color="#236fc9"/>
            </linearGradient>
          </defs>
          <circle cx="32" cy="40" r="22" fill="none" stroke="url(#epGrad)" stroke-width="0.9" opacity="0.6"/>
          <circle cx="48" cy="40" r="22" fill="none" stroke="url(#epGrad)" stroke-width="0.9" opacity="0.6"/>
          <circle cx="40" cy="40" r="14" fill="none" stroke="url(#epGrad)" stroke-width="0.7" opacity="0.4"/>
          <circle cx="40" cy="40" r="7"  fill="none" stroke="url(#epGrad)" stroke-width="0.7" opacity="0.3"/>
          <circle cx="40" cy="40" r="2"  fill="url(#epGrad)" opacity="0.5"/>
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
        <div class="toc">
          <div class="toc-head">
            <div>
              <h2 class="th-t">{book.title}</h2>
              <div class="th-s">{book.subtitle}</div>
            </div>
          </div>
          <div class="toc-h">Contents</div>

          {#if book.chapters.length === 0}
            <p class="toc-empty">This volume is still being written.</p>
          {:else}
            <ol class="toc-list">
              {#each book.chapters as ch, i (ch.id)}
                <li>
                  <button class="toc-item" on:click={() => dispatch('chapterclick', ch)}>
                    <span class="ch">{String(i + 1).padStart(2, '0')}</span>
                    <span class="tt">{ch.title}</span>
                    <span class="dots" aria-hidden="true"></span>
                    <span class="pg">{ch.pages.length}p</span>
                  </button>
                </li>
              {/each}
            </ol>
          {/if}
        </div>

      {:else if displayedView === 'reading' && currentPage}
        <div class="reading">
          <div class="ch-eyebrow">{book.title}</div>
          <h2 class="ch-title">{displayedChapter?.title}</h2>

          <div class="page-body">
            <div class="prose">{@html currentPage.content}</div>

            {#if currentPage.shots?.length}
              <div class="shots" class:one={currentPage.shots.length === 1}>
                {#each currentPage.shots as shot}
                  <figure class="shot" class:wide={shot.wide} class:cover={shot.cover}>
                    <img src={shot.src} alt={shot.cap} loading="lazy" />
                    <figcaption>{shot.cap}</figcaption>
                  </figure>
                {/each}
              </div>
            {/if}

            {#if currentPage.audio?.length}
              <div class="tracks">
                {#each currentPage.audio as track}
                  <figure class="track">
                    <figcaption>{track.title}</figcaption>
                    <audio controls src={track.src}></audio>
                  </figure>
                {/each}
              </div>
            {/if}
          </div>

          <div class="page-foot">
            <button class="pf-btn" on:click={() => dispatch('home')}>↑ Contents</button>
            <div class="pf-turn">
              <button on:click={() => dispatch('navigate', -1)} disabled={!hasPrev} aria-label="Previous page">‹ Prev</button>
              <span class="folio">{pageNum} / {pageTotal}</span>
              <button on:click={() => dispatch('navigate', 1)} disabled={!hasNext} aria-label="Next page">Next ›</button>
            </div>
          </div>
        </div>

      {:else}
        <div class="toc">
          <div class="toc-head">
            <div>
              <h2 class="th-t">{book.title}</h2>
              <div class="th-s">{book.subtitle}</div>
            </div>
          </div>
          <p class="toc-empty">This volume is still being written.</p>
        </div>
      {/if}

    </div>
  </div>

</div>

<style>
  .book-spread {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 7px 12px 12px 7px;
    background: #0d0a14;
    box-shadow: 0 40px 90px -30px #000, 0 0 0 1px #ffffff10;
    overflow: visible;
  }

  .close-btn {
    position: absolute;
    top: -16px;
    right: -6px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #140d22;
    border: 1px solid var(--line-2);
    color: var(--bone-1);
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: color .16s, border-color .16s;
  }
  .close-btn:hover { color: var(--bone-0); border-color: var(--violet); }

  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--paper);
  }

  .page-left {
    flex: 0 0 42%;
    border-radius: 7px 0 0 7px;
    background: linear-gradient(270deg, var(--paper-edge) 0 16px, var(--paper) 26px), var(--paper);
    box-shadow: inset -22px 0 36px -28px #00000055, inset 6px 0 14px -10px #00000022;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-right {
    border-radius: 0 12px 12px 0;
    background: linear-gradient(90deg, var(--paper-edge) 0 16px, var(--paper) 26px), var(--paper);
    box-shadow: inset 22px 0 36px -28px #00000055, inset -6px 0 14px -10px #00000022;
  }

  @media (max-width: 640px) {
    .page-left { display: none; }
    .book-spread { border-radius: 7px; }
    .page-right { border-radius: 7px; background: var(--paper); }
  }

  .endpaper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 24px;
    text-align: center;
  }
  .ep-ornament { width: 84px; height: 84px; opacity: .95; }
  .ep-ornament svg { width: 100%; height: 100%; display: block; }
  .ep-title {
    font-family: var(--serif);
    font-weight: 600;
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    line-height: 1.1;
    color: var(--ink);
    max-width: 18ch;
  }
  .ep-sub {
    font-family: var(--mono);
    font-size: .6rem;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--ink-3);
  }

  .content-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    transform-origin: left center;
  }
  @keyframes flip-out {
    from { transform: perspective(1200px) rotateY(0deg);   opacity: 1; }
    to   { transform: perspective(1200px) rotateY(-90deg); opacity: 0.4; }
  }
  @keyframes flip-in {
    from { transform: perspective(1200px) rotateY(90deg);  opacity: 0.4; }
    to   { transform: perspective(1200px) rotateY(0deg);   opacity: 1; }
  }
  .content-wrap.flip-out { animation: flip-out 300ms ease-in forwards; pointer-events: none; }
  .content-wrap.flip-in  { animation: flip-in  300ms ease-out forwards; }
  @media (prefers-reduced-motion: reduce) {
    .content-wrap.flip-out, .content-wrap.flip-in { animation: none; opacity: 1; transform: none; }
  }

  .toc { flex: 1; overflow-y: auto; padding: clamp(24px,5%,44px) clamp(22px,7%,48px); color: var(--ink); }
  .toc-head { border-bottom: 1px solid #0000001a; padding-bottom: 16px; margin-bottom: 14px; }
  .th-t { margin: 0; font-family: var(--serif); font-weight: 600; font-size: clamp(1.3rem,4vw,1.7rem); line-height: 1.05; color: var(--ink); }
  .th-s { font-family: var(--mono); font-size: .6rem; letter-spacing: .3em; text-transform: uppercase; color: var(--ink-3); margin-top: 7px; }
  .toc-h { font-family: var(--mono); font-size: .68rem; letter-spacing: .18em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 4px; }
  .toc-empty { font-family: var(--serif); font-style: italic; color: var(--ink-2); margin-top: 12px; }

  .toc-list { list-style: none; display: flex; flex-direction: column; }
  .toc-item {
    width: 100%;
    appearance: none;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 13px 2px;
    border-bottom: 1px solid #00000014;
    text-align: left;
    min-height: 46px;
  }
  .toc-item:hover .tt { color: #000; }
  .toc-item:hover .ch { color: var(--pink); }
  .toc-item .ch { font-family: var(--mono); font-size: .7rem; letter-spacing: .06em; color: var(--ink-3); flex: none; transition: color .16s; }
  .toc-item .tt { font-family: var(--serif); font-weight: 500; font-size: clamp(1rem,2.6vw,1.2rem); color: var(--ink); transition: color .16s; }
  .toc-item .dots { flex: 1; border-bottom: 1px dotted #00000040; transform: translateY(-4px); }
  .toc-item .pg { font-family: var(--mono); font-size: .72rem; color: var(--ink-3); flex: none; }

  .reading { flex: 1; display: flex; flex-direction: column; min-height: 0; padding: clamp(24px,5%,44px) clamp(22px,7%,48px) 0; }
  .ch-eyebrow { font-family: var(--mono); font-weight: 500; font-size: .68rem; letter-spacing: .18em; text-transform: uppercase; color: var(--ink-eyebrow); }
  .ch-title {
    font-family: var(--serif);
    font-weight: 600;
    font-size: clamp(1.5rem, 4.4vw, 2.1rem);
    line-height: 1.04;
    letter-spacing: -.015em;
    margin: .35rem 0 0;
    color: var(--ink);          /* solid fallback if background-clip:text is unsupported */
    background: var(--grad-ink);
    -webkit-background-clip: text;
    background-clip: text;
  }
  @supports ((-webkit-background-clip: text) or (background-clip: text)) {
    .ch-title { color: transparent; }
  }

  .page-body { flex: 1; overflow-y: auto; margin-top: 1.2rem; padding-right: 4px; scrollbar-width: thin; scrollbar-color: #0000002e transparent; }
  .prose { color: #3a322a; font-size: 1rem; line-height: 1.62; max-width: 60ch; }
  .prose :global(p + p) { margin-top: .8rem; }
  .prose :global(em) { font-style: italic; }

  .shots { margin-top: 1.2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .shots.one { grid-template-columns: 1fr; }
  .shot { margin: 0; }
  .shot.wide, .shots.one .shot { grid-column: 1 / -1; }
  .shot img { display: block; width: 100%; height: auto; border-radius: 9px; border: 1px solid #00000018; background: #00000006; image-orientation: from-image; }
  .shot.cover { max-width: 320px; margin-inline: auto; }
  .shot figcaption { margin-top: 7px; font-family: var(--mono); font-size: .58rem; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); text-align: center; }

  .tracks { margin-top: 1.2rem; display: flex; flex-direction: column; gap: 12px; }
  .track { margin: 0; }
  .track figcaption { font-family: var(--mono); font-size: .6rem; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 5px; }
  .track audio { width: 100%; height: 36px; }

  .page-foot {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 0 14px;
    margin-top: 6px;
    border-top: 1px solid #00000016;
  }
  .pf-btn, .pf-turn button {
    appearance: none;
    background: none;
    border: 1px solid #0000001f;
    color: var(--ink-2);
    cursor: pointer;
    font-family: var(--mono);
    font-size: .68rem;
    letter-spacing: .05em;
    padding: 8px 12px;
    border-radius: 6px;
    min-height: 38px;
  }
  .pf-btn:hover, .pf-turn button:hover:not([disabled]) { color: var(--ink); border-color: var(--pink); }
  .pf-turn { display: flex; align-items: center; gap: 10px; }
  .folio { font-family: var(--mono); font-size: .72rem; color: var(--ink-3); min-width: 4em; text-align: center; }
  button[disabled] { opacity: .35; cursor: default; }
</style>
