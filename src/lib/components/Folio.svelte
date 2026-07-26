<!-- The Folio — a volume opened as a centered modal over the blurred shelf.
     Panel 0 is the Contents (the recruiter's map of the volume); every
     data.js page follows in chapter order as one panel. "Turn page" replaces
     scrollbars; panels cross-fade through a vesica clip-path (OpenBook's
     displayed-state-lag flip machine, re-skinned). Focus is trapped; Escape
     or ✕ closes back to the library. -->
<script>
  import { onMount } from 'svelte';
  import FlowerOfLife from './geometry/FlowerOfLife.svelte';
  import { goto } from '$app/navigation';
  import { trapFocus } from '$lib/actions/trapFocus.js';
  import { DUR } from '$lib/motion.js';

  export let book;
  export let wing;
  export let closeHref = '/library';

  // Flat panel sequence: contents first, then every page in chapter order.
  $: panels = [
    { kind: 'contents' },
    ...book.chapters.flatMap((ch, ci) =>
      ch.pages.map((pg, pi) => ({ kind: 'page', chapter: ch, chapterNo: ci + 1, page: pg, pi }))
    ),
  ];

  let panelIdx = 0;
  $: panelIdx = Math.min(panelIdx, panels.length - 1);

  // First panel index of a chapter — Contents jumps land here.
  function chapterStart(ch) {
    let idx = 1;
    for (const c of book.chapters) {
      if (c.id === ch.id) return idx;
      idx += c.pages.length;
    }
    return 0;
  }

  // ── Displayed state lags the target while the vesica turn plays ──
  let displayedIdx = 0;
  let phase = ''; // '' | 'out' | 'in'
  let animating = false;
  let pending = null;
  let halfMs = DUR.folioTurn / 2;

  $: turnTo(panelIdx);

  function turnTo(target) {
    if (target === displayedIdx) return;
    if (animating) {
      pending = target;
      return;
    }
    doTurn(target);
  }

  async function doTurn(target) {
    animating = true;
    if (halfMs > 0) {
      phase = 'out';
      await sleep(halfMs);
    }
    displayedIdx = target;
    if (halfMs > 0) {
      phase = 'in';
      await sleep(halfMs);
    }
    phase = '';
    animating = false;
    if (pending !== null) {
      const next = pending;
      pending = null;
      if (next !== displayedIdx) doTurn(next);
    }
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  $: current = panels[displayedIdx];
  $: hasPrev = panelIdx > 0;
  $: hasNext = panelIdx < panels.length - 1;

  let dialogEl;
  let headingEl;

  function onKeydown(e) {
    if (e.key === 'Escape') goto(closeHref);
  }

  onMount(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => (halfMs = mq.matches ? 0 : DUR.folioTurn / 2);
    apply();
    mq.addEventListener('change', apply);
    headingEl?.focus({ preventScroll: true });
    return () => mq.removeEventListener('change', apply);
  });
</script>

<svelte:window on:keydown={onKeydown} />

<div class="folio-layer">
  <a class="scrim" href={closeHref} tabindex="-1" aria-hidden="true"></a>

  <div
    class="folio"
    data-testid="folio"
    role="dialog"
    aria-modal="true"
    aria-labelledby="folio-title"
    bind:this={dialogEl}
    use:trapFocus
    style="--half:{halfMs}ms; --wing-accent:{wing.accent}"
  >
    <header class="fo-head">
      <div class="fo-titles">
        <p class="fo-eyebrow">{wing.title}</p>
        <h2 class="fo-title" id="folio-title" tabindex="-1" bind:this={headingEl}>{book.title}</h2>
        <p class="fo-sub">{book.subtitle}</p>
      </div>
      <a class="fo-close" href={closeHref} data-testid="folio-close" aria-label="Close this volume">✕</a>
    </header>

    <div
      class="fo-body"
      class:turn-out={phase === 'out'}
      class:turn-in={phase === 'in'}
    >
      {#if current.kind === 'contents'}
        <div class="contents">
          <span class="c-watermark" aria-hidden="true">
            <FlowerOfLife rings={3} size={300} stroke="var(--ink)" opacity={0.045} />
          </span>
          <p class="c-h">Contents</p>
          {#if book.chapters.length === 0}
            <p class="c-empty">This volume is still being written.</p>
          {:else}
            <ol class="c-list">
              {#each book.chapters as ch, i (ch.id)}
                <li>
                  <button class="c-item" on:click={() => (panelIdx = chapterStart(ch))}>
                    <span class="c-no">{String(i + 1).padStart(2, '0')}</span>
                    <span class="c-tt">{ch.title}</span>
                    <span class="c-dots" aria-hidden="true"></span>
                    <span class="c-pg">{ch.pages.length}p</span>
                  </button>
                </li>
              {/each}
            </ol>
          {/if}
        </div>
      {:else}
        <div class="reading">
          <p class="ch-eyebrow">{current.chapter.title}</p>
          <div class="prose">{@html current.page.content}</div>

          {#if current.page.shots?.length}
            <div class="shots" class:one={current.page.shots.length === 1}>
              {#each current.page.shots as shot}
                <figure class="shot" class:wide={shot.wide} class:cover={shot.cover}>
                  <img src={shot.src} alt={shot.cap} loading="lazy" />
                  <figcaption>{shot.cap}</figcaption>
                </figure>
              {/each}
            </div>
          {/if}

          {#if current.page.audio?.length}
            <div class="tracks">
              {#each current.page.audio as track}
                <figure class="track">
                  <figcaption>{track.title}</figcaption>
                  <audio controls src={track.src}></audio>
                </figure>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <footer class="fo-foot">
      <button class="fo-btn" on:click={() => (panelIdx = 0)} disabled={panelIdx === 0}>
        ↑ Contents
      </button>
      <div class="fo-turn">
        <button
          class="fo-btn"
          data-testid="folio-prev"
          on:click={() => (panelIdx = Math.max(0, panelIdx - 1))}
          disabled={!hasPrev}
          aria-label="Turn back a panel">‹ Turn back</button
        >
        <span class="fo-counter" data-testid="folio-counter">{panelIdx + 1} / {panels.length}</span>
        <button
          class="fo-btn"
          data-testid="folio-next"
          on:click={() => (panelIdx = Math.min(panels.length - 1, panelIdx + 1))}
          disabled={!hasNext}
          aria-label="Turn to the next panel">Turn page ›</button
        >
      </div>
      <span class="sr-live" aria-live="polite">Panel {panelIdx + 1} of {panels.length}</span>
    </footer>
  </div>
</div>

<style>
  .folio-layer {
    position: fixed;
    inset: 0;
    z-index: 5;
    display: grid;
    place-items: center;
    padding: clamp(10px, 3vh, 30px);
  }

  .scrim {
    position: absolute;
    inset: 0;
    background: #05030acc;
    backdrop-filter: blur(6px);
  }

  .folio {
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(94vw, 720px);
    /* Golden-ratio frame: height ≈ width / φ where the viewport allows */
    height: min(88vh, calc(min(94vw, 720px) / 1.618 + 180px));
    max-height: 92vh;
    background: linear-gradient(90deg, var(--paper-edge) 0 14px, var(--paper) 24px), var(--paper);
    border-radius: 10px 14px 14px 10px;
    box-shadow: 0 40px 90px -30px #000, 0 0 0 1px #ffffff10;
    color: var(--ink);
    overflow: hidden;
  }

  .fo-head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: clamp(14px, 3vh, 24px) clamp(18px, 4vw, 34px) 12px;
    border-bottom: 1px solid var(--paper-line);
  }
  .fo-titles { flex: 1 1 auto; min-width: 0; }
  .fo-eyebrow {
    font-family: var(--mono);
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .fo-title {
    font-family: var(--serif);
    font-weight: 600;
    font-size: clamp(1.2rem, 3.4vw, 1.6rem);
    line-height: 1.05;
    color: var(--ink);
    outline: none;
  }
  .fo-sub {
    font-family: var(--serif);
    font-style: italic;
    font-size: 0.85rem;
    color: var(--ink-2);
    margin-top: 2px;
  }
  .fo-close {
    display: grid;
    place-items: center;
    min-width: 40px;
    min-height: 40px;
    border-radius: 10px;
    border: 1px solid #0000001f;
    color: var(--ink-2);
    text-decoration: none;
    font-size: 0.85rem;
  }
  .fo-close:hover,
  .fo-close:focus-visible { color: var(--ink); border-color: var(--ink-eyebrow); }

  /* ── Vesica page turn ── */
  .fo-body {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  @keyframes vesica-out {
    from { clip-path: circle(125% at 50% 50%); opacity: 1; }
    to   { clip-path: circle(0% at 63% 50%);  opacity: 0.35; }
  }
  @keyframes vesica-in {
    from { clip-path: circle(0% at 37% 50%);  opacity: 0.35; }
    to   { clip-path: circle(125% at 50% 50%); opacity: 1; }
  }
  .fo-body.turn-out { animation: vesica-out var(--half) ease-in forwards; pointer-events: none; }
  .fo-body.turn-in  { animation: vesica-in  var(--half) ease-out forwards; }
  @media (prefers-reduced-motion: reduce) {
    .fo-body.turn-out, .fo-body.turn-in { animation: none; }
  }

  /* ── Contents panel ── */
  .contents {
    position: relative;
    flex: 1;
    overflow-y: auto;
    padding: clamp(16px, 4%, 30px) clamp(18px, 5%, 36px);
  }
  .c-watermark {
    position: absolute;
    right: -70px;
    bottom: -80px;
    pointer-events: none;
  }
  .c-h {
    font-family: var(--mono);
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-bottom: 4px;
  }
  .c-empty { font-family: var(--serif); font-style: italic; color: var(--ink-2); margin-top: 12px; }
  .c-list { list-style: none; display: flex; flex-direction: column; }
  .c-item {
    width: 100%;
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 12px 2px;
    border-bottom: 1px solid var(--paper-line);
    text-align: left;
    min-height: 46px;
  }
  .c-item:hover .c-tt, .c-item:focus-visible .c-tt { color: #000; }
  .c-item:hover .c-no, .c-item:focus-visible .c-no { color: var(--ink-eyebrow); }
  .c-no { font-family: var(--mono); font-size: 0.7rem; color: var(--ink-3); flex: none; }
  .c-tt { font-family: var(--serif); font-weight: 500; font-size: clamp(0.95rem, 2.4vw, 1.1rem); color: var(--ink); }
  .c-dots { flex: 1; border-bottom: 1px dotted #00000040; transform: translateY(-4px); }
  .c-pg { font-family: var(--mono); font-size: 0.7rem; color: var(--ink-3); flex: none; }

  /* ── Reading panel ── */
  .reading {
    flex: 1;
    overflow-y: auto; /* sanctioned last resort for the long field guides */
    min-height: 0;
    padding: clamp(16px, 4%, 30px) clamp(18px, 5%, 36px);
    scrollbar-width: thin;
    scrollbar-color: #0000002e transparent;
  }
  .ch-eyebrow {
    font-family: var(--mono);
    font-weight: 500;
    font-size: 0.66rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-eyebrow);
    margin-bottom: 0.6rem;
  }
  .prose { color: #3a322a; font-size: 0.98rem; line-height: 1.6; max-width: 60ch; }
  .prose :global(p + p) { margin-top: 0.8rem; }
  .prose :global(em) { font-style: italic; }

  .shots { margin-top: 1.1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .shots.one { grid-template-columns: 1fr; }
  .shot { margin: 0; }
  .shot.wide, .shots.one .shot { grid-column: 1 / -1; }
  .shot img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 9px;
    border: 1px solid var(--paper-line);
    background: #00000006;
    image-orientation: from-image;
  }
  .shot.cover { max-width: 320px; margin-inline: auto; }
  .shot figcaption {
    margin-top: 7px;
    font-family: var(--mono);
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-3);
    text-align: center;
  }

  .tracks { margin-top: 1.1rem; display: flex; flex-direction: column; gap: 12px; }
  .track { margin: 0; }
  .track figcaption {
    font-family: var(--mono);
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-bottom: 5px;
  }
  .track audio { width: 100%; height: 36px; }

  /* ── Footer ── */
  .fo-foot {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px clamp(18px, 5%, 36px) 14px;
    border-top: 1px solid var(--paper-line);
  }
  .fo-btn {
    border: 1px solid #0000001f;
    color: var(--ink-2);
    font-family: var(--mono);
    font-size: 0.66rem;
    letter-spacing: 0.05em;
    padding: 8px 12px;
    border-radius: 6px;
    min-height: 40px;
  }
  .fo-btn:hover:not([disabled]),
  .fo-btn:focus-visible:not([disabled]) { color: var(--ink); border-color: var(--ink-eyebrow); }
  .fo-btn[disabled] { opacity: 0.35; cursor: default; }
  .fo-turn { display: flex; align-items: center; gap: 8px; }
  .fo-counter {
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--ink-3);
    min-width: 4.5em;
    text-align: center;
  }

  .sr-live {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  @media (max-width: 899px), (max-height: 559px) {
    .folio-layer { padding: 8px; }
    .folio { width: 100%; height: calc(100dvh - var(--bar-h) - 20px); max-height: none; align-self: start; }
    .fo-foot { flex-wrap: wrap; }
  }
</style>
