<!-- The library — a ROOM, not a void. Five standalone bookcases share one
     construction language (uprights, pediment, plank, base) but each wing
     wears its own material: mahogany-and-brass for the Career, raw workbench
     oak for the Workshop, edge-lit near-black for the Digital Atelier,
     verdant timber for the Greenhouse, velvet-and-stagelight for the
     Soundstage. The cases stand on a floor that catches starlight, under a
     soft lamp wash, beneath the open sky (Backdrop).

     Bay order and grouping never change across breakpoints (neighborhood
     memory holds); a case may gain a second shelf when its titled books need
     the width — as real bookcases do. Where a viewport is too short for
     thirty legible titles at once, the ROOM scrolls internally (standing
     close to a tall wall, looking up and down); the page itself never
     scrolls. -->
<script>
  import { tick } from 'svelte';
  import { shelves, slugFor } from '$lib/content/library.js';
  import BookSpine from './BookSpine.svelte';
  import PlatonicIcon from './geometry/PlatonicIcon.svelte';

  export let activeSlug = null;

  // Each wing's plaque carries a Platonic-solid rune — sacred geometry in
  // service of wayfinding.
  const RUNES = {
    career: 'cube',
    workshop: 'tetra',
    cyber: 'octa',
    greenhouse: 'icosa',
    soundstage: 'dodeca',
  };

  // Fixed composition, data.js order: Career leads row 1 with the Workshop
  // and Digital Atelier beside it; Greenhouse and Soundstage hold row 2.
  $: rows = [shelves.slice(0, 3), shelves.slice(3)];

  let root;

  // Remember the last open volume so its spine takes focus back when the
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
  <div class="room">
    <div class="lamp" aria-hidden="true"></div>

    <div class="cases">
      {#each rows as row}
        <div class="case-row">
          {#each row as s (s.wingId)}
            <section
              class="case"
              data-theme={s.theme}
              style="--wing-accent:{s.accent}; --grow:{s.books.length}"
              aria-label={s.title}
            >
              <div class="pediment" aria-hidden="true"></div>
              <h2 class="plaque" data-testid={s.wingId}>
                <span class="plaque-rune" aria-hidden="true">
                  <PlatonicIcon kind={RUNES[s.theme] ?? 'cube'} size={13} strokeWidth={1.4} />
                </span>
                <span class="plaque-title">{s.title}</span>
              </h2>
              <div class="shelfrow">
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
              <div class="case-base" aria-hidden="true"></div>
            </section>
          {/each}
        </div>
      {/each}
    </div>

    <div class="floor" aria-hidden="true"></div>
  </div>
</div>

<style>
  .wall {
    position: absolute;
    inset: 0;
  }

  /* The room: content bottom-anchored above the floor; becomes the
     internally scrolling space only when the wall is genuinely taller than
     the screen (close-up viewing) — the page never scrolls either way. */
  .room {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #ffffff22 transparent;
    padding: 84px clamp(8px, 3vw, 48px) clamp(50px, 8vh, 76px);
  }

  .lamp {
    position: fixed;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(70% 50% at 50% 38%, #fcd34d0a 0%, transparent 65%);
  }

  .floor {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: clamp(44px, 7vh, 66px);
    pointer-events: none;
    background:
      linear-gradient(180deg, #ffffff10 0%, transparent 6%),
      linear-gradient(180deg, #171126ee 0%, #0b0912 80%);
    box-shadow: 0 -1px 0 #ffffff14;
  }
  /* Starlight catches the polished floor */
  .floor::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(2px 6px at 18% 40%, #f0eef366 0%, transparent 100%),
      radial-gradient(2px 7px at 37% 55%, #a78bfa55 0%, transparent 100%),
      radial-gradient(2px 6px at 58% 35%, #f0eef34d 0%, transparent 100%),
      radial-gradient(2px 8px at 79% 50%, #93b0f955 0%, transparent 100%),
      radial-gradient(1.5px 5px at 91% 42%, #fcd34d4d 0%, transparent 100%);
    opacity: 0.5;
  }

  .cases {
    width: min(100%, 1240px);
    margin-inline: auto;
    /* Bottom-anchor when the wall fits the room; when it doesn't, the room
       scrolls from the TOP — the Career case greets the eye first.
       (justify-content: flex-end would strand overflow above the scroll.) */
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 2vh, 24px);
  }

  .case-row {
    display: flex;
    align-items: flex-end;
    gap: clamp(10px, 1.6vw, 26px);
  }

  /* ── One construction language, five materials ── */
  .case {
    flex: var(--grow) 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding: 0 clamp(6px, 0.9vw, 12px);
    border-left: clamp(5px, 0.7vw, 9px) solid transparent;
    border-right: clamp(5px, 0.7vw, 9px) solid transparent;
    border-image: linear-gradient(180deg, var(--case-hi), var(--case-lo)) 1;
    background:
      linear-gradient(180deg, #ffffff06 0%, transparent 30%),
      color-mix(in srgb, var(--case-lo) 42%, transparent);
    box-shadow: var(--case-glow, none);
  }

  .pediment {
    height: clamp(7px, 1.3vh, 11px);
    margin: 0 calc(-1 * clamp(6px, 0.9vw, 12px));
    border-radius: 5px 5px 0 0;
    background: linear-gradient(180deg, var(--case-hi), var(--case-lo));
    box-shadow: 0 3px 10px -4px #000, inset 0 1px 0 #ffffff1e;
  }

  .plank {
    height: clamp(6px, 1.1vh, 10px);
    margin-top: 2px;
    border-radius: 3px;
    background: linear-gradient(180deg, var(--case-hi), var(--case-lo));
    box-shadow: 0 10px 20px -8px #000;
  }

  .case-base {
    height: clamp(4px, 0.8vh, 7px);
    margin: 0 calc(-1 * clamp(6px, 0.9vw, 12px));
    border-radius: 0 0 4px 4px;
    background: linear-gradient(180deg, var(--case-lo), #0e0a17);
    box-shadow: 0 12px 24px -8px #000;
  }

  /* Wing materials — tinted timber within Nebula Noir, never new palettes. */
  .case[data-theme='career'] {
    --case-hi: #5a3b2e;
    --case-lo: #291812;
  }
  .case[data-theme='workshop'] {
    --case-hi: #6b4a2b;
    --case-lo: #33220f;
  }
  .case[data-theme='cyber'] {
    --case-hi: #232338;
    --case-lo: #0d0d1c;
    --case-glow: inset 0 0 22px #4a7cf722;
  }
  .case[data-theme='greenhouse'] {
    --case-hi: #2e4a33;
    --case-lo: #12241a;
  }
  .case[data-theme='soundstage'] {
    --case-hi: #3c2440;
    --case-lo: #190f20;
    --case-glow: inset 0 -26px 44px -30px #ff8a2b2e;
  }

  /* ── Plaques: engraved nameplates in each wing's material ── */
  .plaque {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    align-self: center;
    max-width: 100%;
    padding: 3px clamp(7px, 1vw, 14px);
    margin: clamp(4px, 0.9vh, 9px) 0;
    border-radius: 5px;
    box-shadow: inset 0 1px 3px #00000066, 0 1px 0 #ffffff10;
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(0.6rem, 1.5vmin, 0.9rem);
    color: var(--text);
    white-space: nowrap;
    background: var(--surface-1);
    border: 1px solid color-mix(in srgb, var(--wing-accent) 35%, transparent);
  }
  /* Brass for the Career wing */
  .case[data-theme='career'] .plaque {
    background: linear-gradient(180deg, #6e5424, #4a3714);
    border-color: #c9a24b66;
    color: #f3e6c4;
  }
  /* Stamped steel for the Workshop */
  .case[data-theme='workshop'] .plaque {
    background: linear-gradient(180deg, #423c36, #2a2622);
    border-color: #8a7f6c55;
  }
  /* Etched glass for the Digital Atelier */
  .case[data-theme='cyber'] .plaque {
    background: #101322;
    border-color: #4a7cf755;
    font-family: var(--mono);
    font-size: clamp(0.54rem, 1.3vmin, 0.74rem);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  /* Living green for the Greenhouse */
  .case[data-theme='greenhouse'] .plaque {
    background: linear-gradient(180deg, #234030, #142a1e);
    border-color: #5ef2a04d;
  }
  /* Velvet for the Soundstage */
  .case[data-theme='soundstage'] .plaque {
    background: linear-gradient(180deg, #351d3c, #221228);
    border-color: #e58fb166;
    font-style: italic;
  }
  .plaque-rune {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    color: color-mix(in srgb, var(--wing-accent) 80%, var(--text));
  }
  .plaque-title {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── The shelf run: titled books stand shoulder to shoulder; a case
        gains a second shelf when its books need the width. ── */
  .shelfrow {
    --shelf-h: clamp(112px, 19vh, 182px);
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    gap: 10px clamp(3px, 0.4vw, 7px);
  }

  @media (max-width: 899px) {
    .room { padding: calc(var(--chip-h) + 44px) 8px calc(var(--bar-h) + 40px); }
    .cases { gap: 12px; }
    .case-row {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    .shelfrow { --shelf-h: clamp(96px, 14vh, 130px); }
    .floor { height: 40px; }
  }

  @media (max-height: 559px) {
    .room { padding-top: calc(var(--chip-h) + 8px); }
    .shelfrow { --shelf-h: 108px; }
  }
</style>
