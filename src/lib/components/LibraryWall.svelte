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

  // The building plan, fixed at every viewport: the Career wing is the main
  // hall across the top — the entrance a visitor faces first — with the four
  // craft wings paired off it: Workshop and Digital Atelier on one side of
  // the aisle, Greenhouse and Soundstage on the other.
  $: rows = [[shelves[0]], [shelves[1], shelves[2]], [shelves[3], shelves[4]]];

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
              class="wing"
              data-theme={s.theme}
              style="--wing-accent:{s.accent}; --grow:{s.books.length}"
              aria-label={s.title}
            >
              <div class="roofline" aria-hidden="true"></div>
              <div class="case">
                <div class="backpanel" aria-hidden="true"></div>
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
              </div>
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

  /* ── Wings: real architecture, one per discipline ─────────────────────
     Each wing is a roofline + a cased shelf with a themed back panel:
       career     → the marble main hall: flat lintel with a brass inlay
       workshop   → work-lamp bar over a pegboard back wall
       cyber      → rack rail with status lights over a circuit-trace panel
       greenhouse → glass conservatory arch over a planted trellis
       soundstage → proscenium with curtain swags over velvet folds
     Same construction (uprights, plank, base) in five materials. */
  .wing {
    flex: var(--grow) 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .roofline {
    height: clamp(10px, 1.9vh, 16px);
    background: linear-gradient(180deg, var(--case-hi), var(--case-lo));
    border-radius: 6px 6px 0 0;
    box-shadow: 0 3px 10px -4px #000, inset 0 1px 0 #ffffff1e;
  }

  .case {
    position: relative;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: 0 clamp(6px, 0.9vw, 12px);
    border-left: clamp(5px, 0.7vw, 9px) solid transparent;
    border-right: clamp(5px, 0.7vw, 9px) solid transparent;
    border-image: linear-gradient(180deg, var(--case-hi), var(--case-lo)) 1;
    background:
      linear-gradient(180deg, #ffffff06 0%, transparent 30%),
      color-mix(in srgb, var(--case-lo) 46%, transparent);
    box-shadow: var(--case-glow, none);
  }

  .backpanel {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: var(--panel, none);
    opacity: 0.55;
  }
  .plaque, .shelfrow { position: relative; }

  /* Sparse wings display their volumes like a curated exhibit — spread along
     the shelf rather than clumped mid-case. Dense shelves stay packed. */
  .wing[data-theme='career'] .shelfrow,
  .wing[data-theme='greenhouse'] .shelfrow,
  .wing[data-theme='soundstage'] .shelfrow {
    justify-content: space-evenly;
  }

  .plank {
    position: relative;
    height: clamp(6px, 1.1vh, 10px);
    margin-top: 2px;
    border-radius: 3px;
    background: linear-gradient(180deg, var(--case-hi), var(--case-lo));
    box-shadow: 0 10px 20px -8px #000;
  }

  .case-base {
    height: clamp(4px, 0.8vh, 7px);
    border-radius: 0 0 4px 4px;
    background: linear-gradient(180deg, var(--case-lo), #0e0a17);
    box-shadow: 0 12px 24px -8px #000;
  }

  /* Career — the main hall: warm marble, brass inlay line on the lintel. */
  .wing[data-theme='career'] {
    --case-hi: #5a3b2e;
    --case-lo: #291812;
    --panel: linear-gradient(180deg, #f3e6c408 0%, transparent 55%);
  }
  .wing[data-theme='career'] .roofline {
    background:
      linear-gradient(180deg, transparent 55%, #c9a24b66 55%, #c9a24b66 68%, transparent 68%),
      linear-gradient(180deg, #6a4a38, #2b1a12);
  }

  /* Workshop — pegboard wall, two warm work-lamp pools from the bar. */
  .wing[data-theme='workshop'] {
    --case-hi: #6b4a2b;
    --case-lo: #33220f;
    --panel:
      radial-gradient(40% 70% at 28% 0%, #ff8a2b1f 0%, transparent 70%),
      radial-gradient(40% 70% at 72% 0%, #ff8a2b1f 0%, transparent 70%),
      radial-gradient(#ffffff17 1px, transparent 1.4px);
  }
  .wing[data-theme='workshop'] .backpanel { background-size: auto, auto, 14px 14px; }

  /* Digital Atelier — rack rail with status lights, circuit-trace wall. */
  .wing[data-theme='cyber'] {
    --case-hi: #232338;
    --case-lo: #0d0d1c;
    --case-glow: inset 0 0 22px #4a7cf722;
    --panel:
      repeating-linear-gradient(90deg, transparent 0 26px, #4a7cf716 26px 27px),
      repeating-linear-gradient(0deg, transparent 0 22px, #4a7cf710 22px 23px);
  }
  .wing[data-theme='cyber'] .roofline {
    background:
      radial-gradient(3px 3px at 12% 50%, #4a7cf7cc 0%, transparent 100%),
      radial-gradient(3px 3px at 22% 50%, #5ef2a0aa 0%, transparent 100%),
      radial-gradient(3px 3px at 32% 50%, #4a7cf766 0%, transparent 100%),
      linear-gradient(180deg, #262640, #0d0d1c);
    border-radius: 3px 3px 0 0;
  }

  /* Greenhouse — a glass conservatory arch over a planted trellis. */
  .wing[data-theme='greenhouse'] {
    --case-hi: #2e4a33;
    --case-lo: #12241a;
    --panel:
      repeating-linear-gradient(45deg, transparent 0 17px, #5ef2a014 17px 18px),
      repeating-linear-gradient(-45deg, transparent 0 17px, #5ef2a014 17px 18px),
      radial-gradient(60% 40% at 50% 100%, #234030 0%, transparent 75%);
  }
  .wing[data-theme='greenhouse'] .roofline {
    height: clamp(16px, 3vh, 26px);
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    background:
      repeating-linear-gradient(90deg, transparent 0 20px, #d7fbe833 20px 22px),
      linear-gradient(180deg, #b8e6c92e 0%, #2e4a3355 100%);
    border: 1px solid #5ef2a03d;
    border-bottom: none;
    box-shadow: inset 0 4px 12px -6px #d7fbe833;
  }

  /* Soundstage — proscenium and curtain swags, warm stage light below. */
  .wing[data-theme='soundstage'] {
    --case-hi: #3c2440;
    --case-lo: #190f20;
    --case-glow: inset 0 -26px 44px -30px #ff8a2b2e;
    --panel:
      radial-gradient(120% 90% at 18% 0%, #57153055 0%, transparent 52%),
      radial-gradient(120% 90% at 82% 0%, #57153055 0%, transparent 52%),
      radial-gradient(45% 85% at 50% 0%, #fcd34d14 0%, transparent 75%),
      repeating-linear-gradient(90deg, transparent 0 24px, #00000033 24px 30px);
  }
  .wing[data-theme='soundstage'] .roofline {
    background:
      radial-gradient(60% 130% at 12% 100%, #6b1f3d 0%, transparent 62%),
      radial-gradient(60% 130% at 88% 100%, #6b1f3d 0%, transparent 62%),
      linear-gradient(180deg, #47204a, #190f20);
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
  .wing[data-theme='career'] .plaque {
    background: linear-gradient(180deg, #6e5424, #4a3714);
    border-color: #c9a24b66;
    color: #f3e6c4;
  }
  /* Stamped steel for the Workshop */
  .wing[data-theme='workshop'] .plaque {
    background: linear-gradient(180deg, #423c36, #2a2622);
    border-color: #8a7f6c55;
  }
  /* Etched glass for the Digital Atelier */
  .wing[data-theme='cyber'] .plaque {
    background: #101322;
    border-color: #4a7cf755;
    font-family: var(--mono);
    font-size: clamp(0.54rem, 1.3vmin, 0.74rem);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  /* Living green for the Greenhouse */
  .wing[data-theme='greenhouse'] .plaque {
    background: linear-gradient(180deg, #234030, #142a1e);
    border-color: #5ef2a04d;
  }
  /* Velvet for the Soundstage */
  .wing[data-theme='soundstage'] .plaque {
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
    --shelf-h: clamp(110px, 12.5vh, 150px);
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
