<script>
  export let shelves = [];
  export let activeBookId = null;
  export let onBookClick = () => {};
</script>

<aside class="shelf-panel">
  {#each shelves as shelf (shelf.id)}
    <div class="shelf" aria-label={shelf.title}>
      <div class="shelf-label">
        <span>{shelf.title}</span>
      </div>

      <div class="books-row">
        {#each shelf.books as book (book.id)}
          <button
            class="book-spine"
            class:is-active={book.id === activeBookId}
            style="--cover: {book.coverColor}"
            on:click={() => onBookClick(book)}
            title="{book.title} · {book.subtitle}"
            aria-pressed={book.id === activeBookId}
          >
            <span class="spine-inner">
              <span class="spine-title">{book.title}</span>
              <span class="spine-sub">{book.subtitle}</span>
            </span>
          </button>
        {/each}
      </div>

      <div class="shelf-plank" role="presentation">
        <div class="plank-face"></div>
        <div class="plank-bottom"></div>
      </div>
    </div>
  {/each}
</aside>

<style>
  .shelf-panel {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 16px 12px 8px;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--wood-lt) transparent;
  }

  .shelf {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
    min-height: 140px;
  }

  .shelf-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--brass);
    padding: 0 4px 6px;
    opacity: 0.8;
  }

  .books-row {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    padding: 0 4px;
    flex: 1;
  }

  /* ── Book spine ─────────────────────────────────── */

  .book-spine {
    position: relative;
    width: 36px;
    min-height: 80px;
    max-height: 120px;
    flex: 0 0 36px;
    background: var(--cover);
    border-radius: 2px 5px 5px 2px;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
    transition: transform 220ms cubic-bezier(.2,.8,.4,1),
                box-shadow 220ms ease;
    box-shadow:
      inset -4px 0 10px rgba(0,0,0,0.45),
      3px 0 0 rgba(0,0,0,0.25),
      -1px 0 0 rgba(255,255,255,0.06);
    align-self: flex-end;
    cursor: pointer;
  }

  .book-spine::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba(255,255,255,0.08) 0 4px,
      transparent 4px
    );
  }

  .book-spine:hover {
    transform: translateY(-10px);
    box-shadow:
      inset -4px 0 10px rgba(0,0,0,0.45),
      3px 0 0 rgba(0,0,0,0.25),
      0 10px 24px rgba(0,0,0,0.6);
  }

  .book-spine.is-active {
    transform: translateY(-14px);
    box-shadow:
      inset -4px 0 10px rgba(0,0,0,0.35),
      3px 0 0 rgba(0,0,0,0.2),
      0 14px 32px rgba(0,0,0,0.7),
      0 0 0 1px rgba(212,175,55,0.45);
  }

  .spine-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    padding: 8px 0;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    pointer-events: none;
  }

  .spine-title {
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brass);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 80px;
  }

  .spine-sub {
    font-size: 7px;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: rgba(184,155,94,0.6);
    white-space: nowrap;
  }

  /* ── Shelf plank ────────────────────────────────── */

  .shelf-plank {
    margin-top: 2px;
  }

  .plank-face {
    height: 14px;
    background: linear-gradient(to bottom, #4A3020, var(--wood));
    border-radius: 2px;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.06);
    position: relative;
  }

  .plank-face::after {
    content: '';
    position: absolute;
    inset: 0;
    border-top: 1px solid rgba(184,155,94,0.2);
    border-radius: 2px;
  }

  .plank-bottom {
    height: 5px;
    background: var(--wood-dk);
    margin: 0 4px;
    border-radius: 0 0 2px 2px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.5);
  }

  /* ── Mobile: horizontal layout ──────────────────── */

  @media (max-width: 720px) {
    .shelf-panel {
      flex-direction: row;
      height: auto;
      padding: 8px 12px 0;
      overflow-x: auto;
      overflow-y: hidden;
    }

    .shelf {
      flex: 0 0 auto;
      min-width: 120px;
      min-height: auto;
    }

    .books-row {
      flex-direction: row;
      align-items: flex-end;
    }

    .book-spine {
      min-height: 64px;
      max-height: 90px;
    }

    .shelf-label {
      font-size: 9px;
    }
  }
</style>
