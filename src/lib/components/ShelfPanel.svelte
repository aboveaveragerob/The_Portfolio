<script>
  // Renders one group of Wings as book spines. Used three times by +page.svelte:
  // the top career/civic rail (orientation="horizontal") and the two side
  // columns (orientation="vertical"). Accent colour is fixed per Wing (from
  // data), so colour carries domain meaning instead of shuffling by index.
  export let wings = [];
  export let activeBookId = null;
  export let stagedBookId = null;  // pre-staged volume, highlighted "ready to open"
  export let onBookClick = () => {};
  export let open = false;         // compact the rail while a book is open
  export let orientation = 'horizontal'; // 'horizontal' (top rail) | 'vertical' (side column)
</script>

<div class="shelves {orientation}" class:open>
  {#each wings as wing (wing.id)}
    <nav class="shelf-rail" aria-label={wing.title} style="--wing-accent: {wing.accent}">
      <div class="shelf-head">{wing.title}</div>
      <div class="shelf-books">
        {#each wing.books as book (book.id)}
          <button
            class="spine"
            class:staged={book.id === stagedBookId}
            style="--sp-accent: {wing.accent}"
            on:click={() => onBookClick(book)}
            title="{book.title} · {book.subtitle}"
            aria-current={book.id === activeBookId ? 'true' : undefined}
          >
            <span class="sp-emblem" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="var(--sp-accent)" stroke-width="1.4" opacity="0.9"/>
                <circle cx="12" cy="12" r="3" fill="var(--sp-accent)" opacity="0.65"/>
              </svg>
            </span>
            <span class="sp-title">{book.title}</span>
            <span class="sp-year">{book.subtitle}</span>
          </button>
        {/each}
      </div>
    </nav>
  {/each}
</div>

<style>
  .shelves {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
  }

  /* ── Top rail (horizontal): wings stack, books run in a row ─────────── */
  .shelves.horizontal {
    width: 100%;
    max-width: 920px;
    margin: 0 auto;
    gap: clamp(8px, 1.6vh, 16px);
    transition: gap .5s cubic-bezier(.2,.02,.12,1);
  }

  /* ── Side column (vertical): wings stack, books run down a column, and
        the whole column scrolls internally so the page never scrolls ──── */
  .shelves.vertical {
    width: clamp(122px, 15vw, 182px);
    height: 100%;
    gap: clamp(10px, 2vh, 20px);
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .shelves.vertical::-webkit-scrollbar { display: none; }

  .shelf-rail {
    position: relative;
    transition: padding .5s cubic-bezier(.2,.02,.12,1);
  }
  .shelves.horizontal .shelf-rail { padding: clamp(16px, 2.4vh, 24px) 14px clamp(12px, 1.8vh, 18px); }
  .shelves.vertical   .shelf-rail { padding: 0; }

  .shelf-head {
    font-family: var(--serif);
    font-style: italic;
    color: var(--bone-1);
    transition: opacity .3s;
  }
  .shelves.horizontal .shelf-head {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: clamp(.84rem, 2.2vw, 1.05rem);
  }
  .shelves.vertical .shelf-head {
    position: static;
    text-align: left;
    font-size: clamp(.78rem, 1.6vw, .96rem);
    padding: 0 2px 7px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 8px;
  }

  .shelf-books {
    display: flex;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .shelf-books::-webkit-scrollbar { display: none; }
  .shelves.horizontal .shelf-books {
    flex-flow: row nowrap;
    align-items: flex-end;
    justify-content: center;
    gap: clamp(5px, 1.1vw, 9px);
    overflow-x: auto;
  }
  .shelves.vertical .shelf-books {
    flex-flow: column nowrap;
    align-items: stretch;
    gap: 6px;
  }

  /* Horizontal shelf ledge under the row of spines */
  .shelves.horizontal .shelf-rail::after {
    content: "";
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 8px;
    height: 9px;
    border-radius: 2px;
    background: linear-gradient(180deg, #3c3552, #191524);
    box-shadow: 0 10px 22px -6px #000, inset 0 1px 0 #ffffff2e, inset 0 -1px 0 #00000073;
  }

  .spine {
    appearance: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
    flex: none;
    color: var(--bone-1);
    background: linear-gradient(100deg, #241a33, #160f22);
    border: 1px solid #ffffff1a;
    box-shadow:
      0 14px 22px -12px #000,
      inset 0 0 0 1px #ffffff0a,
      inset -8px 0 16px -10px #00000099,
      inset 7px 0 10px -8px #ffffff18;
    transition: transform .22s cubic-bezier(.3,.1,.2,1), box-shadow .22s, height .5s cubic-bezier(.2,.02,.12,1);
  }

  /* Vertical "book edge" tab: colour on the left edge, title reads across */
  .shelves.horizontal .spine {
    width: clamp(36px, 5vw, 48px);
    height: clamp(58px, 8.5vh, 100px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    padding: 9px 3px 8px;
    border-top: 3px solid var(--sp-accent, #ffffff40);
    border-radius: 3px 3px 2px 2px;
  }
  .shelves.vertical .spine {
    width: 100%;
    min-height: 42px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 9px;
    padding: 8px 10px;
    border-left: 3px solid var(--sp-accent, #ffffff40);
    border-radius: 2px 4px 4px 2px;
  }

  .spine:focus-visible { outline: 2px solid var(--violet); outline-offset: 3px; }

  .shelves.horizontal .spine:hover { transform: translateY(-12px); box-shadow: 0 26px 30px -14px #000; }
  .shelves.horizontal .spine[aria-current="true"] {
    transform: translateY(-14px);
    box-shadow: 0 28px 34px -14px #000, 0 0 0 1px var(--sp-accent) inset;
  }
  .shelves.vertical .spine:hover { transform: translateX(4px); box-shadow: 0 18px 26px -14px #000; }
  .shelves.vertical .spine[aria-current="true"] {
    transform: translateX(4px);
    box-shadow: 0 18px 26px -14px #000, 0 0 0 1px var(--sp-accent) inset;
  }
  .spine[aria-current="true"] .sp-title { color: var(--bone-0); }

  /* Pre-staged volume: pulled forward with a soft held glow so the shelf
     still marks the volume's home slot without competing with the closed
     book on the podium (which now carries the active center-stage signal). */
  .spine.staged {
    box-shadow:
      0 30px 36px -14px #000,
      0 0 0 1px var(--sp-accent) inset,
      0 0 20px -4px var(--violet);
  }
  .shelves.horizontal .spine.staged { transform: translateY(-16px); }
  .shelves.vertical   .spine.staged { transform: translateX(4px); }
  .spine.staged .sp-title { color: var(--bone-0); }

  .sp-emblem { width: 17px; height: 17px; flex: none; opacity: .92; }
  .sp-emblem svg { width: 100%; height: 100%; display: block; }

  .sp-title {
    font-family: var(--serif);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: .01em;
    overflow: hidden;
    color: var(--bone-1);
    transition: color .18s;
  }
  .shelves.horizontal .sp-title {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    writing-mode: vertical-rl;
    font-size: clamp(.6rem, 1.4vw, .74rem);
    white-space: normal;
    text-align: center;
  }
  .shelves.vertical .sp-title {
    flex: 1;
    writing-mode: horizontal-tb;
    font-size: clamp(.62rem, 1vw, .74rem);
    text-align: left;
  }

  .sp-year {
    flex: none;
    font-family: var(--mono);
    font-size: .5rem;
    letter-spacing: .06em;
    color: var(--bone-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;   /* deliberate … instead of a mid-word cut (§4.1) */
  }
  .shelves.horizontal .sp-year { writing-mode: vertical-rl; max-height: 74px; }
  .shelves.vertical   .sp-year { display: none; }  /* subtitle stays in title attr */

  /* ── Compaction while a book is open (top rail only) ─────────────────── */
  .shelves.horizontal.open { gap: 4px; }
  .shelves.horizontal.open .shelf-rail { padding: clamp(6px, 1vh, 10px) 14px clamp(10px, 1.4vh, 14px); }
  .shelves.horizontal.open .shelf-head { opacity: 0; pointer-events: none; }
  .shelves.horizontal.open .spine { height: clamp(42px, 5.5vh, 62px); justify-content: center; gap: 0; }
  .shelves.horizontal.open .sp-title,
  .shelves.horizontal.open .sp-year { display: none; }

  /* ── Narrow (< --bp-md 900px): side columns collapse into full-width
        horizontal rails so everything still stacks into one no-scroll
        screen; each rail scrolls sideways internally. ─────────────────── */
  @media (max-width: 899px) {
    .shelves.vertical {
      width: 100%;
      height: auto;
      overflow-y: visible;
      gap: clamp(8px, 1.6vh, 16px);
    }
    .shelves.vertical .shelf-books {
      flex-flow: row nowrap;
      align-items: stretch;
      justify-content: flex-start;
      overflow-x: auto;
      gap: clamp(5px, 1.1vw, 9px);
    }
    .shelves.vertical .spine {
      width: auto;
      min-width: 124px;
      flex: 0 0 auto;
    }
    .shelves.vertical .sp-title { white-space: nowrap; text-overflow: ellipsis; }
  }

  /* Unified breakpoint (shared --bp-sm: 640px). */
  @media (max-width: 640px) {
    .shelves.horizontal .shelf-books { justify-content: flex-start; }
    .shelves.horizontal .spine { width: clamp(32px, 9vw, 42px); height: clamp(78px, 12vh, 140px); }
    .shelves.horizontal .sp-year { display: none; }
    .shelves.horizontal .sp-title { font-size: clamp(.58rem, 2.6vw, .72rem); }
  }
</style>
