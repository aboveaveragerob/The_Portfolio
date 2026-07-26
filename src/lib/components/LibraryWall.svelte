<!-- The library wall — the whole collection in one view. One case, two fixed
     shelf rows, five permanent bays (Career · Physical | Digital · Greenhouse
     · Soundstage), each a labeled landmark with its plaque, rune, and accent.
     Nothing pages, nothing scrolls, nothing reorders: the composition is
     constant and only SCALES with the viewport (spatial memory holds — a
     volume lives in the same bay at every size, like a real wall seen from
     nearer or farther). Named tradeoff: at phone widths spines drop below
     the 44px touch floor and their printed titles — identity stays on
     aria-label/title, as with real spines viewed from across a room. -->
<script>
  import { tick } from 'svelte';
  import { shelves, slugFor } from '$lib/content/library.js';
  import BookSpine from './BookSpine.svelte';
  import PlatonicIcon from './geometry/PlatonicIcon.svelte';

  export let activeSlug = null;

  // Each wing's plaque carries a Platonic-solid rune — the sacred-geometry
  // accent surviving from the instruments, now in service of the library.
  const RUNES = {
    career: 'cube',
    workshop: 'tetra',
    cyber: 'octa',
    greenhouse: 'icosa',
    soundstage: 'dodeca',
  };

  // Fixed composition: wing order is data.js order; the split balances the
  // rows (14 / 16 spines) while keeping Career at top-left — the primary
  // position for the resume shelf.
  $: rows = [shelves.slice(0, 3), shelves.slice(3)];

  let root;

  // Remember the last open volume so its spine can take focus back when the
  // folio closes.
  let pendingRestore = null;
  $: if (activeSlug) {
    pendingRestore = activeSlug;
  } else if (pendingRestore) {
    restoreFocus(pendingRestore);
    pendingRestore = null;
  }

  async function restoreFocus(slug) {
    await tick();
    root?.querySelector(`[data-testid="spine-${slug}"]`)?.focus({ preventScroll: true });
  }
</script>

<div class="wall" data-testid="library-wall" bind:this={root}>
  <div class="case">
    <div class="pediment" aria-hidden="true"></div>

    {#each rows as row, ri}
      <div class="bay-row" class:first={ri === 0}>
        {#each row as s (s.wingId)}
          <section
            class="bay"
            style="--wing-accent:{s.accent}; --bay-grow:{s.books.length}"
            aria-label={s.title}
          >
            <h2 class="plaque" data-testid={s.wingId}>
              <span class="plaque-rune" aria-hidden="true">
                <PlatonicIcon kind={RUNES[s.theme] ?? 'cube'} size={14} strokeWidth={1.4} />
              </span>
              <span class="plaque-title">{s.title}</span>
            </h2>
            <div class="row">
              {#each s.books as book (book.id)}
                <BookSpine
                  {book}
                  wing={s}
                  slug={slugFor[book.id]}
                  active={slugFor[book.id] === activeSlug}
                />
              {/each}
            </div>
            <div class="plank" aria-hidden="true"></div>
          </section>
        {/each}
      </div>
    {/each}

    <div class="base" aria-hidden="true"></div>
  </div>
</div>

<style>
  .wall {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0 clamp(8px, 4vw, 70px) clamp(58px, 10vh, 92px);
  }

  .case {
    width: min(100%, 1240px);
    padding: 0 clamp(8px, 1.2vw, 16px);
    border-left: clamp(5px, 0.8vw, 10px) solid transparent;
    border-right: clamp(5px, 0.8vw, 10px) solid transparent;
    border-image: linear-gradient(180deg, var(--ledge-hi), var(--ledge-lo)) 1;
    background:
      linear-gradient(180deg, #ffffff05 0%, transparent 30%),
      color-mix(in srgb, var(--bg-2) 55%, transparent);
  }

  .pediment {
    height: clamp(7px, 1.4vh, 12px);
    margin: 0 calc(-1 * clamp(8px, 1.2vw, 16px));
    border-radius: 5px 5px 0 0;
    background: linear-gradient(180deg, var(--ledge-hi), var(--ledge-lo));
    box-shadow: 0 3px 10px -4px #000, inset 0 1px 0 #ffffff1e;
  }

  .base {
    height: clamp(5px, 1vh, 8px);
    margin: 0 calc(-1 * clamp(8px, 1.2vw, 16px));
    border-radius: 0 0 4px 4px;
    background: linear-gradient(180deg, var(--ledge-lo), #0e0a17);
    box-shadow: 0 12px 24px -8px #000;
  }

  .bay-row {
    display: flex;
    align-items: flex-end;
    gap: clamp(8px, 1.6vw, 26px);
    padding-top: clamp(6px, 1.4vh, 14px);
  }

  /* A bay's width share is its book count — spine rhythm stays even across
     bays, so the wall reads as one continuous run of shelving. */
  .bay {
    flex: var(--bay-grow) 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .plaque {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    align-self: center;
    max-width: 100%;
    padding: 3px clamp(6px, 1vw, 14px);
    margin-bottom: clamp(4px, 1vh, 10px);
    border-radius: 5px;
    background: var(--surface-1);
    border: 1px solid color-mix(in srgb, var(--wing-accent, var(--violet)) 35%, transparent);
    box-shadow: inset 0 1px 3px #00000066, 0 1px 0 #ffffff10;
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(0.56rem, 1.5vmin, 0.92rem);
    color: var(--text);
    white-space: nowrap;
  }
  .plaque-rune {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    color: color-mix(in srgb, var(--wing-accent, var(--violet)) 80%, var(--text));
  }
  .plaque-title {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: clamp(2px, 0.4vw, 7px);
    min-height: calc(var(--shelf-h) + 10px);
  }

  .plank {
    height: clamp(6px, 1.2vh, 10px);
    margin-top: 2px;
    border-radius: 3px;
    background: linear-gradient(180deg, var(--ledge-hi), var(--ledge-lo));
    box-shadow: 0 10px 20px -8px #000;
  }

  /* Shared shelf height — spines scale from it via their --hf variance. */
  .wall {
    --shelf-h: clamp(64px, 15vh, 168px);
  }

  @media (max-width: 899px), (max-height: 559px) {
    .wall {
      padding: 0 6px calc(var(--bar-h) + 14px);
    }
    .wall { --shelf-h: clamp(56px, 13vh, 120px); }
    .bay-row { gap: 6px; }
    .plaque {
      padding: 2px 6px;
      gap: 4px;
      margin-bottom: 4px;
    }
    .plaque-rune { display: none; }
  }
</style>
