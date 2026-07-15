<script>
  export let shelves = [];
  export let activeBookId = null;
  export let onBookClick = () => {};
  export let open = false;   // compact the shelves while a book is open

  const PALETTE = [
    '#5ef2e8', '#3b82f6', '#4f7bff', '#7c5cff', '#9b7cff',
    '#b25cff', '#22a7f0', '#43b6ff', '#5ef2a0', '#22d3ee',
    '#ff8a2b', '#ff5a3d', '#ff2d78', '#ffb43d', '#8b5e3c'
  ];

  $: accentFor = (() => {
    const map = {};
    let i = 0;
    for (const shelf of shelves) {
      for (const book of shelf.books) {
        map[book.id] = PALETTE[i % PALETTE.length];
        i++;
      }
    }
    return map;
  })();
</script>

<div class="shelves" class:open>
  {#each shelves as shelf (shelf.id)}
    <nav class="shelf-rail" aria-label={shelf.title}>
      <div class="shelf-head">{shelf.title}</div>
      <div class="shelf-books">
        {#each shelf.books as book (book.id)}
          <button
            class="spine"
            style="--sp-accent: {accentFor[book.id]}"
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
    width: 100%;
    max-width: 920px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: clamp(12px, 2.4vw, 22px);
    transition: gap .5s cubic-bezier(.2,.02,.12,1);
  }

  .shelf-rail {
    position: relative;
    padding: 24px 14px 20px;
    transition: padding .5s cubic-bezier(.2,.02,.12,1);
  }

  .shelf-head {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-family: var(--serif);
    font-style: italic;
    font-size: clamp(.84rem, 2.2vw, 1.05rem);
    color: var(--bone-1);
    transition: opacity .3s;
  }

  .shelf-books {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    justify-content: center;
    gap: clamp(5px, 1.1vw, 9px);
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .shelf-books::-webkit-scrollbar { display: none; }

  .shelf-rail::after {
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
    width: clamp(36px, 5vw, 48px);
    height: clamp(122px, 19vw, 178px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    padding: 9px 3px 8px;
    color: var(--bone-1);
    background: linear-gradient(100deg, #241a33, #160f22);
    border: 1px solid #ffffff1a;
    border-top: 3px solid var(--sp-accent, #ffffff40);
    border-radius: 3px 3px 2px 2px;
    box-shadow:
      0 14px 22px -12px #000,
      inset 0 0 0 1px #ffffff0a,
      inset -8px 0 16px -10px #00000099,
      inset 7px 0 10px -8px #ffffff18;
    transition: transform .22s cubic-bezier(.3,.1,.2,1), box-shadow .22s, height .5s cubic-bezier(.2,.02,.12,1);
  }
  .spine:hover { transform: translateY(-12px); box-shadow: 0 26px 30px -14px #000; }
  .spine:focus-visible { outline: 2px solid var(--violet); outline-offset: 3px; }
  .spine[aria-current="true"] {
    transform: translateY(-14px);
    box-shadow: 0 28px 34px -14px #000, 0 0 0 1px var(--sp-accent) inset;
  }
  .spine[aria-current="true"] .sp-title { color: var(--bone-0); }

  .sp-emblem { width: 17px; height: 17px; flex: none; opacity: .92; }
  .sp-emblem svg { width: 100%; height: 100%; display: block; }

  .sp-title {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    writing-mode: vertical-rl;
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(.6rem, 1.4vw, .74rem);
    line-height: 1.15;
    letter-spacing: .01em;
    white-space: normal;
    overflow: hidden;
    text-align: center;
    color: var(--bone-1);
    transition: color .18s;
  }

  .sp-year {
    flex: none;
    writing-mode: vertical-rl;
    font-family: var(--mono);
    font-size: .5rem;
    letter-spacing: .06em;
    color: var(--bone-2);
    white-space: nowrap;
    max-height: 74px;
    overflow: hidden;
  }

  .shelves.open { gap: 4px; }
  .shelves.open .shelf-rail { padding: 8px 14px 16px; }
  .shelves.open .shelf-head { opacity: 0; pointer-events: none; }
  .shelves.open .spine { height: clamp(64px, 9vw, 84px); justify-content: center; gap: 0; }
  .shelves.open .sp-title,
  .shelves.open .sp-year { display: none; }

  @media (max-width: 520px) {
    .shelf-books { justify-content: flex-start; }
    .spine { width: clamp(32px, 9vw, 42px); height: clamp(126px, 38vw, 158px); }
    .sp-year { display: none; }
    .sp-title { font-size: clamp(.58rem, 2.6vw, .72rem); }
  }
</style>
