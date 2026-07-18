<!-- The Career Orbit orrery — four employment roles as planets on
     Fibonacci-fitted rings, every position a precomputed constant from
     content/orbit.js (deterministic, permanent). Each planet is a real SVG
     <a> with an invisible ≥60-unit hit circle (≈44px at the minimum
     supported width) and an always-visible org/dates label. On narrow
     viewports the SVG labels hide and RoleList provides the readable
     equivalent alongside the scaled orrery. -->
<script>
  import { RING_RADII, PLANETS, VIEW, CX, CY, HIT_R } from '$lib/content/orbit.js';

  export let activeRole = null;
</script>

<div class="orrery-wrap">
  <svg
    class="orrery"
    viewBox="0 0 {VIEW} {VIEW}"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g class="rings" fill="none" stroke="var(--text-2)" aria-hidden="true">
      {#each RING_RADII as r}
        <circle cx={CX} cy={CY} r={r} stroke-width="1" opacity="0.22" />
      {/each}
    </g>

    {#each PLANETS as p}
      <a
        class="planet"
        class:active={activeRole === p.roleId}
        href="/orbit/{p.roleId}"
        data-testid="planet-{p.roleId}"
        aria-label="{p.org} — {p.title}, {p.dates}"
        aria-current={activeRole === p.roleId ? 'page' : undefined}
        style="--accent:{p.accent}"
      >
        <circle class="hit" cx={p.x} cy={p.y} r={HIT_R} />
        <circle class="glow" cx={p.x} cy={p.y} r={p.r + 8} />
        <circle class="body" cx={p.x} cy={p.y} r={p.r} />
        {#if p.present}
          <text class="badge" x={p.x} y={p.y - p.r - 12} text-anchor="middle">Present</text>
        {/if}
        <text
          class="lbl-org"
          x={p.label.x}
          y={p.label.y}
          text-anchor={p.label.anchor}
          dominant-baseline={p.label.baseline}>{p.org}</text
        >
        <text
          class="lbl-dates"
          x={p.label.x}
          y={p.label.y}
          dy="24"
          text-anchor={p.label.anchor}
          dominant-baseline={p.label.baseline}>{p.dates}</text
        >
      </a>
    {/each}
  </svg>
</div>

<style>
  .orrery-wrap {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none; /* only the planets take the pointer */
  }

  .orrery {
    width: min(96vmin, 100%);
    height: min(96vmin, 100%);
    overflow: visible;
  }

  .planet {
    pointer-events: auto;
    outline: none;
    cursor: pointer;
  }

  .hit {
    fill: transparent;
    stroke: none;
  }

  .body {
    fill: color-mix(in srgb, var(--accent) 72%, var(--bg-2));
    stroke: var(--accent);
    stroke-width: 1.6;
    transition: transform 0.25s ease;
    transform-box: fill-box;
    transform-origin: center;
  }

  .glow {
    fill: var(--accent);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .planet:hover .glow,
  .planet:focus-visible .glow {
    opacity: 0.16;
    fill: var(--gold);
  }
  .planet.active .glow {
    opacity: 0.22;
    fill: var(--gold);
  }
  .planet.active .body {
    transform: scale(1.22);
    stroke: var(--gold);
  }
  .planet:focus-visible .body {
    stroke: var(--gold);
    stroke-width: 2.4;
  }

  .badge {
    font-family: var(--mono);
    font-size: 15px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    fill: var(--rose);
  }

  .lbl-org {
    font-family: var(--serif);
    font-size: 23px;
    fill: var(--text);
  }

  .lbl-dates {
    font-family: var(--mono);
    font-size: 15px;
    letter-spacing: 0.05em;
    fill: var(--text-2);
  }

  /* Narrow/short: the orrery compresses into the upper canvas as a visual
     index (labels off — RoleList carries the text at readable size). */
  @media (max-width: 899px), (max-height: 559px) {
    .orrery-wrap {
      inset: var(--chip-h) 0 46% 0;
    }
    .orrery {
      width: min(88vmin, 100%);
      height: 100%;
    }
    .lbl-org,
    .lbl-dates,
    .badge {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .body, .glow { transition: none; }
  }
</style>
