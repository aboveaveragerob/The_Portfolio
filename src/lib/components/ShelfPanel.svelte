<script>
  // Renders one group of Wings as a bookcase: upright book spines standing on
  // shelf planks, framed as part of a cosmic library. Used three times by
  // +page.svelte — the top career rail (orientation="horizontal") and the two
  // side columns (orientation="vertical"). Each spine stays a real <button>
  // carrying `title` + click, so the reading flow and its tests are unchanged;
  // only the visual skin turns "buttons" into books on shelves.
  export let wings = [];
  export let activeBookId = null;
  export let stagedBookId = null;  // pre-staged volume, held forward "ready to open"
  export let onBookClick = () => {};
  export let open = false;         // compact the rail while a book is open
  export let orientation = 'horizontal'; // 'horizontal' (top rail) | 'vertical' (side column)

  // Deterministic per-book variance so a shelf reads as a real run of books
  // (mixed heights + thicknesses) instead of a uniform tab strip — seeded from
  // the id so SSR and hydration agree.
  function hashId(id) {
    let h = 2166136261;
    for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function bookVars(book) {
    const h = hashId(book.id);
    const hf = (0.84 + ((h % 17) / 100)).toFixed(2);        // height factor 0.84–1.00
    const wf = (0.92 + (((h >>> 5) % 8) / 10)).toFixed(2);  // thickness factor 0.92–1.62
    return `--spine:${book.coverColor}; --hf:${hf}; --wf:${wf};`;
  }

  // Group a wing's books into shelf rows. The top rail is one long shelf; a
  // side column stacks short shelves (rows of up to 4 spines) into a bookcase.
  const PER_ROW = 4;
  function rowsFor(wing) {
    if (orientation === 'horizontal') return [wing.books];
    const out = [];
    for (let i = 0; i < wing.books.length; i += PER_ROW) out.push(wing.books.slice(i, i + PER_ROW));
    return out;
  }
</script>

<div class="bookcase {orientation}" class:open>
  {#each wings as wing (wing.id)}
    <section class="wing" data-theme={wing.theme} aria-label={wing.title} style="--wing-accent: {wing.accent}">
      {#if wing.theme === 'soundstage' || wing.theme === 'greenhouse' || wing.theme === 'cyber'}
        <div class="wing-decor" aria-hidden="true"></div>
      {/if}
      <div class="nameplate"><span>{wing.title}</span></div>

      <div class="stacks">
        {#each rowsFor(wing) as row, ri}
          <div class="shelf">
            <div class="books">
              {#each row as book (book.id)}
                <button
                  class="spine"
                  class:staged={book.id === stagedBookId}
                  style={bookVars(book)}
                  on:click={() => onBookClick(book)}
                  title="{book.title} · {book.subtitle}"
                  aria-label="{book.title} — {book.subtitle}"
                  aria-current={book.id === activeBookId ? 'true' : undefined}
                >
                  <span class="sp-cap" aria-hidden="true"></span>
                  <span class="sp-title">{book.title}</span>
                  <span class="sp-emblem" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="7" stroke="var(--wing-accent)" stroke-width="1.5" opacity="0.9"/>
                      <circle cx="12" cy="12" r="2.6" fill="var(--wing-accent)" opacity="0.7"/>
                    </svg>
                  </span>
                </button>
              {/each}
            </div>
            <div class="plank" aria-hidden="true"></div>
          </div>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .bookcase {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
  }

  /* ── Top rail (horizontal): one wide shelf of career volumes ─────────── */
  .bookcase.horizontal {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    gap: clamp(8px, 1.6vh, 16px);
    transition: gap .5s cubic-bezier(.2,.02,.12,1);
  }

  /* ── Side column (vertical): a stack of short shelves, scrolls internally
        so the page itself never scrolls ─────────────────────────────────── */
  .bookcase.vertical {
    width: clamp(150px, 16.5vw, 200px);
    height: 100%;
    gap: clamp(12px, 2.4vh, 22px);
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-right: 2px;
  }
  .bookcase.vertical::-webkit-scrollbar { display: none; }

  .wing {
    position: relative;
    --shelf-face: color-mix(in oklab, var(--wing-accent) 16%, #1a1230);
  }

  /* ── Nameplate (the wing's engraved shelf label) ─────────────────────── */
  .nameplate {
    font-family: var(--serif);
    font-style: italic;
    color: var(--bone-1);
    letter-spacing: .01em;
    line-height: 1.1;
    transition: opacity .3s;
  }
  .nameplate span {
    background: linear-gradient(180deg, var(--bone-0), color-mix(in oklab, var(--wing-accent) 55%, var(--bone-1)));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .bookcase.horizontal .nameplate {
    text-align: center;
    font-size: clamp(.92rem, 2.2vw, 1.15rem);
    margin-bottom: 4px;
  }
  .bookcase.vertical .nameplate {
    text-align: left;
    font-size: clamp(.82rem, 1.7vw, 1rem);
    padding: 0 2px 6px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--line-2);
  }

  .stacks { display: flex; flex-direction: column; gap: clamp(10px, 2vh, 18px); }

  /* ── A shelf = a row of spines + the plank they stand on ─────────────── */
  .shelf { position: relative; }

  .books {
    display: flex;
    align-items: flex-end;
    /* headroom so the staged lift + hover glow are never clipped by the row */
    padding-top: 22px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .books::-webkit-scrollbar { display: none; }
  .bookcase.horizontal .books {
    justify-content: center;
    gap: clamp(3px, 0.7vw, 7px);
    overflow-x: auto;
    padding-inline: 8px;
  }
  .bookcase.vertical .books {
    justify-content: center;
    gap: clamp(3px, 0.7vw, 6px);
  }

  /* The plank: a solid ledge with a lit top and a shadowed front face so the
     books read as standing on real shelving, not floating. */
  .plank {
    position: relative;
    height: clamp(9px, 1.4vh, 13px);
    margin-top: -3px;
    border-radius: 2px 2px 3px 3px;
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--wing-accent) 20%, var(--ledge-hi)) 0%,
        var(--ledge-lo) 100%);
    box-shadow:
      var(--shadow-fall) 14px 26px -10px #000,
      inset 0 1px 0 var(--edge-hi),
      inset 0 -2px 3px -1px var(--edge-lo);
  }
  .plank::after {
    /* front face — the plank's visible thickness */
    content: "";
    position: absolute;
    left: 3px; right: 3px; top: 100%;
    height: clamp(4px, 0.7vh, 7px);
    background: linear-gradient(180deg, var(--ledge-lo), #0c0916);
    border-radius: 0 0 3px 3px;
    box-shadow: var(--shadow-contact);
  }

  /* ── Spine (an upright hardback) ─────────────────────────────────────── */
  .spine {
    appearance: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
    flex: none;
    padding: 8px 2px 7px;
    border: none;
    border-top: 3px solid var(--wing-accent);
    border-radius: 3px 3px 1px 1px;
    color: var(--bone-0);
    background:
      /* left-edge sheen + right-edge gutter shadow for round-spine volume */
      linear-gradient(90deg, #ffffff24 0%, #ffffff00 16% 82%, #00000055 100%),
      linear-gradient(180deg,
        color-mix(in oklab, var(--spine, #241a33) 84%, #ffffff) 0%,
        var(--spine, #241a33) 20%,
        color-mix(in oklab, var(--spine, #241a33) 80%, #000000) 100%);
    box-shadow:
      var(--shadow-fall) 14px 22px -12px #000,
      inset 0 -6px 10px -8px #000000aa,
      inset 0 1px 0 #ffffff1f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    overflow: hidden;
    transition: transform .22s cubic-bezier(.3,.1,.2,1), box-shadow .22s, height .5s cubic-bezier(.2,.02,.12,1);
  }

  .bookcase.horizontal .spine {
    width: calc(var(--wf, 1) * clamp(33px, 4.8vw, 52px));
    height: calc(var(--hf, 1) * clamp(96px, 15.5vh, 176px));
  }
  .bookcase.vertical .spine {
    flex: 1 1 0;
    min-width: 24px;
    max-width: 58px;
    height: calc(var(--hf, 1) * clamp(94px, 15vh, 148px));
  }

  .spine:focus-visible { outline: 2px solid var(--violet); outline-offset: 3px; }

  .spine:hover { transform: translateY(-10px); box-shadow: var(--shadow-fall) 30px 32px -16px #000, inset 0 1px 0 #ffffff2e; }
  .spine[aria-current="true"] {
    transform: translateY(-13px);
    box-shadow: var(--shadow-fall) 30px 36px -14px #000, 0 0 0 1px var(--wing-accent) inset, 0 0 18px -4px var(--wing-accent);
  }

  /* Pre-staged volume: pulled forward with a soft held glow, marking its home
     slot on the shelf without competing with the closed book on the podium.
     The row's padding-top gives the lift clearance so nothing is clipped. */
  .spine.staged {
    transform: translateY(-16px);
    box-shadow:
      var(--shadow-fall) 34px 38px -14px #000,
      0 0 0 1px var(--wing-accent) inset,
      0 0 22px -4px var(--violet);
  }
  .spine.staged .sp-title,
  .spine[aria-current="true"] .sp-title { color: #fff; }

  /* Head cap — the cream page-block peeking above the boards */
  .sp-cap {
    flex: none;
    width: calc(100% - 6px);
    height: 4px;
    border-radius: 2px 2px 0 0;
    background: linear-gradient(180deg, #efe6d0, #cdbf9f);
    opacity: .85;
  }

  .sp-title {
    flex: 1;
    min-height: 0;
    writing-mode: vertical-rl;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: var(--serif);
    font-weight: 600;
    line-height: 1.12;
    letter-spacing: .01em;
    color: var(--bone-0);
    text-shadow: 0 1px 2px #0009;
    overflow: hidden;
    transition: color .18s;
  }
  .bookcase.horizontal .sp-title { font-size: clamp(.62rem, 1.4vw, .76rem); }
  .bookcase.vertical .sp-title { font-size: clamp(.6rem, 1.25vw, .72rem); }

  .sp-emblem { flex: none; width: 15px; height: 15px; opacity: .92; }
  .sp-emblem svg { width: 100%; height: 100%; display: block; }

  /* Per-wing decoration layer (posters / vines / circuitry). Absolutely placed
     so it never affects the no-scroll flow. */
  .wing-decor { position: absolute; pointer-events: none; z-index: 0; }

  /* ═══════════════ Per-Wing aesthetics ═══════════════════════════════════
     Each personal Wing keeps the same bookcase bones but wears its own skin,
     so the library reads as distinct rooms without breaking the whole. The
     career rail and Physical Archive keep the classic cosmic treatment. */

  /* ── Digital Atelier — a cyber / techno stack (issue #60) ─────────────── */
  .wing[data-theme="cyber"] .nameplate {
    font-family: var(--mono);
    font-style: normal;
    text-transform: uppercase;
    letter-spacing: .16em;
    font-size: clamp(.62rem, 1.3vw, .76rem);
  }
  .wing[data-theme="cyber"] .nameplate span {
    background: none;
    color: var(--wing-accent);
    text-shadow: 0 0 10px #43b6ff66;
  }
  .wing[data-theme="cyber"] .nameplate::before { content: "// "; opacity: .7; }
  .wing[data-theme="cyber"] .plank {
    background: linear-gradient(180deg, #123049 0%, #070d18 100%);
    box-shadow: 0 14px 26px -10px #000, inset 0 1px 0 var(--wing-accent), 0 0 14px -4px #43b6ff55;
  }
  .wing[data-theme="cyber"] .plank::after { background: linear-gradient(180deg, #070d18, #030509); }
  .wing[data-theme="cyber"] .spine {
    background:
      repeating-linear-gradient(0deg, #ffffff08 0 1px, transparent 1px 4px),
      linear-gradient(90deg, #ffffff20 0%, #ffffff00 16% 82%, #00000066 100%),
      linear-gradient(180deg,
        color-mix(in oklab, var(--spine) 78%, #0a1830) 0%,
        color-mix(in oklab, var(--spine) 88%, #061224) 60%,
        #060c18 100%);
    box-shadow: 0 14px 22px -12px #000, inset 0 1px 0 #ffffff1f, 0 0 12px -4px #43b6ff44;
  }
  .wing[data-theme="cyber"] .spine .sp-cap {
    background: linear-gradient(180deg, var(--wing-accent), #1b6fb0);
    box-shadow: 0 0 8px -1px #43b6ffaa;
  }
  .wing[data-theme="cyber"] .wing-decor {
    inset: -2px 0 auto 0;
    height: 100%;
    background:
      repeating-linear-gradient(90deg, #43b6ff10 0 1px, transparent 1px 26px);
    opacity: .5;
  }

  /* ── Cognitive Greenhouse — glasshouse of the mind (issue #59) ────────── */
  .wing[data-theme="greenhouse"] .nameplate span {
    background: linear-gradient(180deg, #d7ffe9, var(--wing-accent));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 12px #5ef2a033;
  }
  .wing[data-theme="greenhouse"] .plank {
    background: linear-gradient(180deg, #2b5a44 0%, #0f2419 100%);
    box-shadow: 0 14px 26px -10px #000, inset 0 1px 0 #b9ffdc55, 0 0 16px -6px #5ef2a044;
  }
  .wing[data-theme="greenhouse"] .plank::after { background: linear-gradient(180deg, #0f2419, #06120c); }
  .wing[data-theme="greenhouse"] .spine {
    background:
      /* glass sheen streak */
      linear-gradient(115deg, #ffffff00 30%, #ffffff2e 46%, #ffffff00 60%),
      linear-gradient(90deg, #ffffff22 0%, #ffffff00 18% 82%, #00000055 100%),
      linear-gradient(180deg,
        color-mix(in oklab, var(--spine) 74%, #7fe8b0) 0%,
        color-mix(in oklab, var(--spine) 86%, #1c5f3f) 55%,
        color-mix(in oklab, var(--spine) 82%, #061c10) 100%);
  }
  .wing[data-theme="greenhouse"] .spine .sp-cap {
    background: linear-gradient(180deg, #eafff2, #a9e6c4);
  }
  /* a soft trailing vine along the top of the wing */
  .wing[data-theme="greenhouse"] .wing-decor {
    inset: 2px 4px auto 4px;
    height: 12px;
    background:
      radial-gradient(4px 6px at 12% 60%, #5ef2a0aa 60%, transparent 62%),
      radial-gradient(4px 6px at 30% 30%, #5ef2a088 60%, transparent 62%),
      radial-gradient(4px 6px at 52% 70%, #5ef2a0aa 60%, transparent 62%),
      radial-gradient(4px 6px at 74% 34%, #5ef2a088 60%, transparent 62%),
      radial-gradient(4px 6px at 90% 62%, #5ef2a0aa 60%, transparent 62%),
      linear-gradient(90deg, transparent, #5ef2a04d 20% 80%, transparent);
    opacity: .55;
  }

  /* ── Social Soundstage — a music library of media, not books (issue #61) ─
     The volumes read as CD / media cases (glossy plastic, a disc peeking from
     the case, a play-head emblem) and the Wing pins an event poster. */
  .wing[data-theme="soundstage"] .nameplate span {
    background: linear-gradient(180deg, #ffd7e8, var(--wing-accent));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .wing[data-theme="soundstage"] .plank {
    background: linear-gradient(180deg, #2a0f22 0%, #10060d 100%);
    box-shadow: 0 14px 26px -10px #000, inset 0 1px 0 #ff2d7877, 0 0 16px -6px #ff2d7855;
  }
  .wing[data-theme="soundstage"] .plank::after { background: linear-gradient(180deg, #10060d, #070308); }
  /* CD / jewel-case body: glossy plastic with a bright vertical highlight */
  .wing[data-theme="soundstage"] .spine {
    border-top-width: 2px;
    border-radius: 2px 2px 1px 1px;
    background:
      linear-gradient(105deg, #ffffff00 34%, #ffffff3a 50%, #ffffff00 66%),
      linear-gradient(90deg, #ffffff2b 0 2px, #ffffff00 10% 88%, #00000066 100%),
      linear-gradient(180deg,
        color-mix(in oklab, var(--spine) 80%, #ff8bc0) 0%,
        var(--spine) 42%,
        color-mix(in oklab, var(--spine) 78%, #12040c) 100%);
    box-shadow: 0 14px 22px -12px #000, inset 0 1px 0 #ffffff33, 0 0 12px -5px #ff2d7855;
  }
  /* the disc edge peeking from the top of the case */
  .wing[data-theme="soundstage"] .spine .sp-cap {
    height: 8px;
    width: 8px;
    align-self: flex-end;
    margin-right: 2px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 50% 50%, #0a0a0a 0 22%, #d7d2dd 24%, #a89fc0 40%, #efe9f6 64%, #b7aecb 100%);
    box-shadow: 0 0 4px #000a;
  }
  /* play-head emblem instead of the reading disc */
  .wing[data-theme="soundstage"] .sp-emblem svg { display: none; }
  .wing[data-theme="soundstage"] .sp-emblem {
    position: relative;
    width: 0; height: 0;
    border-style: solid;
    border-width: 6px 0 6px 10px;
    border-color: transparent transparent transparent var(--wing-accent);
    opacity: .9;
  }
  /* a small tilted event poster pinned to the wing */
  .wing[data-theme="soundstage"] .wing-decor {
    top: -6px; right: 4px;
    width: 26px; height: 34px;
    transform: rotate(7deg);
    border-radius: 2px;
    background:
      linear-gradient(200deg, #ff2d78, #b25cff 60%, #22a7f0);
    box-shadow: 0 4px 10px -3px #000, inset 0 0 0 1px #ffffff33;
    opacity: .8;
  }
  .wing[data-theme="soundstage"] .wing-decor::before {
    content: "★";
    position: absolute;
    top: 3px; left: 0; right: 0;
    text-align: center;
    font-size: 9px;
    color: #fff;
    opacity: .9;
  }

  /* ── Compaction while a book is open (top rail only) ─────────────────── */
  .bookcase.horizontal.open { gap: 4px; }
  .bookcase.horizontal.open .nameplate { opacity: 0; pointer-events: none; height: 0; margin: 0; }
  .bookcase.horizontal.open .books { padding-top: 12px; }
  .bookcase.horizontal.open .spine { height: clamp(50px, 6.5vh, 74px); }
  .bookcase.horizontal.open .sp-title { font-size: clamp(.5rem, 1.1vw, .6rem); }

  /* ── Narrow (< 900px): the cross flattens into one column. Each side Wing's
        stacked shelf-rows lay out side-by-side into a single horizontal shelf
        that scrolls internally, so the whole library still fits one no-scroll
        screen without turning the books back into a flat list. ──────────── */
  @media (max-width: 899px) {
    .bookcase.vertical {
      width: 100%;
      height: auto;
      overflow-y: visible;
      gap: clamp(8px, 1.6vh, 15px);
    }
    .bookcase.vertical .nameplate { margin-bottom: 5px; padding-bottom: 4px; }
    /* rows → columns of a single scrolling shelf */
    .bookcase.vertical .stacks {
      flex-direction: row;
      align-items: flex-end;
      gap: 0;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .bookcase.vertical .stacks::-webkit-scrollbar { display: none; }
    .bookcase.vertical .shelf { flex: none; }
    .bookcase.vertical .books {
      padding-top: 10px;
      justify-content: flex-start;
      gap: clamp(4px, 1vw, 7px);
    }
    /* Face-out covers on the flattened layout: short volumes displayed cover-out
       with a horizontal, fully readable title — a real library display that fits
       five stacked shelves + the reader on one no-scroll screen. */
    .bookcase.horizontal .spine,
    .bookcase.vertical .spine {
      flex: none;
      min-width: 0;
      max-width: none;
      width: calc(var(--wf, 1) * clamp(66px, 18vw, 88px));
      height: clamp(60px, 9vh, 82px);
      padding: 6px;
      gap: 4px;
    }
    .bookcase.horizontal .sp-cap,
    .bookcase.vertical .sp-cap { width: 100%; height: 3px; }
    .bookcase.horizontal .sp-title,
    .bookcase.vertical .sp-title {
      writing-mode: horizontal-tb;
      font-size: clamp(.56rem, 2.6vw, .68rem);
      line-height: 1.1;
      align-items: center;
      padding: 0 1px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
    .bookcase.horizontal .sp-emblem,
    .bookcase.vertical .sp-emblem { width: 12px; height: 12px; }
    .bookcase.horizontal .books { padding-top: 12px; }
    .bookcase.horizontal.open .spine { height: clamp(42px, 6vh, 58px); }
    .bookcase.horizontal.open .sp-title { -webkit-line-clamp: 2; }
  }

  @media (max-width: 640px) {
    .bookcase.horizontal .books,
    .bookcase.vertical .books { justify-content: flex-start; }
    .bookcase.horizontal .spine,
    .bookcase.vertical .spine {
      width: calc(var(--wf, 1) * clamp(62px, 20vw, 82px));
      height: clamp(56px, 8.5vh, 76px);
    }
    .bookcase.horizontal .sp-title,
    .bookcase.vertical .sp-title { font-size: clamp(.54rem, 3vw, .66rem); }
  }
</style>
