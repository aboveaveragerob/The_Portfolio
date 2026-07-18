<!-- Corner astrolabe — the Atlas footer widgets pinned to the bottom corners.
     The arc frame is decorative; the slotted content (contact links, colophon)
     is real, reachable HTML. `corner` mirrors the arcs toward the viewport
     corner it sits in. -->
<script context="module">
  // Quarter-arc frame with tick marks, authored for a bottom-left corner and
  // mirrored via CSS transform for bottom-right.
  const TICKS = Array.from({ length: 9 }, (_, i) => {
    const a = ((i / 8) * 80 + 5) * (Math.PI / 180); // 5°–85°
    const r1 = 54, r2 = i % 2 === 0 ? 62 : 58;
    return {
      x1: +(Math.cos(a) * r1).toFixed(1),
      y1: +(-Math.sin(a) * r1).toFixed(1),
      x2: +(Math.cos(a) * r2).toFixed(1),
      y2: +(-Math.sin(a) * r2).toFixed(1),
    };
  });
  export { TICKS };
</script>

<script>
  export let corner = 'bl'; // 'bl' | 'br'
</script>

<div class="astrolabe {corner}">
  <svg class="aw-frame" width="72" height="72" viewBox="0 -72 72 72" aria-hidden="true">
    <g fill="none" stroke="var(--violet)">
      <path d="M 66 0 A 66 66 0 0 0 0 -66" stroke-width="1" opacity="0.4" />
      <path d="M 46 0 A 46 46 0 0 0 0 -46" stroke-width="0.8" opacity="0.28" />
      {#each TICKS as t}
        <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--gold)" stroke-width="0.8" opacity="0.4" />
      {/each}
    </g>
  </svg>
  <div class="aw-content">
    <slot />
  </div>
</div>

<style>
  .astrolabe {
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    pointer-events: none; /* the frame ignores the pointer… */
  }
  .aw-content { pointer-events: auto; } /* …the content does not */

  .aw-frame {
    position: absolute;
    bottom: -6px;
    opacity: 0.9;
  }
  .bl .aw-frame { left: -10px; }
  .br .aw-frame { right: -10px; transform: scaleX(-1); }

  .bl { padding-left: 18px; }
  .br { padding-right: 18px; justify-content: flex-end; }
</style>
