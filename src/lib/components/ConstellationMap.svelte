<!-- The Constellation Map — five skill areas as star clusters on Platonic
     frames. Zoom happens INSIDE the SVG (a transformed <g>): the svg clips
     its content, so scaling can never create page overflow. Cluster headers
     are HTML toggle buttons (hover previews, click zooms — works for touch
     and keyboard, not just hover); Escape or a second click un-zooms.
     Without JS every node label renders visible at small size. -->
<script>
  import { constellations, crossLinks, centroids, nodeByPath, MAP_W, MAP_H, ZOOM_SCALE } from '$lib/content/skills.js';
  import { slugFor } from '$lib/content/archive.js';
  import PlatonicIcon from './geometry/PlatonicIcon.svelte';

  let zoomedId = null;

  function toggle(id) {
    zoomedId = zoomedId === id ? null : id;
  }

  function onKeydown(e) {
    if (e.key === 'Escape' && zoomedId) zoomedId = null;
  }

  // Zoom transform: scale about origin, then translate the cluster centroid
  // to the viewBox center. CSS px on SVG children = user units, so this is
  // resolution-independent.
  $: world = zoomedId
    ? `translate(${(MAP_W / 2 - ZOOM_SCALE * centroids[zoomedId].x).toFixed(1)}px, ${(MAP_H / 2 - ZOOM_SCALE * centroids[zoomedId].y).toFixed(1)}px) scale(${ZOOM_SCALE})`
    : 'translate(0px, 0px) scale(1)';

  function nodeById(c, id) {
    return c.nodes.find((n) => n.id === id);
  }
</script>

<svelte:window on:keydown={onKeydown} />

<div class="map-wrap" class:zoomed={!!zoomedId}>
  <svg
    class="skymap"
    viewBox="0 0 {MAP_W} {MAP_H}"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g class="world" style="transform: {world}">
      <!-- Cross-disciplinary ties (legend explains the dashes — never color alone) -->
      <g class="ties" aria-hidden="true">
        {#each crossLinks as link}
          {@const a = nodeByPath(link.from)}
          {@const b = nodeByPath(link.to)}
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
        {/each}
      </g>

      {#each constellations as c}
        {@const dimmed = zoomedId && zoomedId !== c.id}
        <g class="cluster" class:dimmed style="--c-accent:{c.accent}">
          <g class="edges" aria-hidden="true">
            {#each c.edges as [from, to]}
              {@const a = nodeById(c, from)}
              {@const b = nodeById(c, to)}
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            {/each}
          </g>
          {#each c.nodes as n}
            {@const slug = n.bookId ? slugFor[n.bookId] : null}
            {#if slug}
              <a
                class="node"
                class:bright={n.bright}
                href="/archive/{slug}"
                aria-label="{n.label} — open the {c.label} volume"
                tabindex={zoomedId === c.id ? 0 : -1}
              >
                <circle class="hit" cx={n.x} cy={n.y} r="40" />
                {#if n.bright}<circle class="halo" cx={n.x} cy={n.y} r="20" />{/if}
                <circle class="star" cx={n.x} cy={n.y} r={n.bright ? 11 : 7.5} />
                <text class="node-lbl" x={n.x} y={n.y - (n.bright ? 24 : 18)} text-anchor="middle">{n.label}</text>
              </a>
            {:else}
              <g class="node static" class:bright={n.bright}>
                <circle class="star" cx={n.x} cy={n.y} r={n.bright ? 11 : 7.5} />
                <text class="node-lbl" x={n.x} y={n.y - 18} text-anchor="middle">{n.label}</text>
              </g>
            {/if}
          {/each}
        </g>
      {/each}
    </g>
  </svg>

  <!-- Cluster headers: HTML toggle buttons over the map (a wrapped chip row
       on narrow screens, where centroid-anchored pills would clip). -->
  <div class="headers">
    {#each constellations as c}
      {@const cx = centroids[c.id]}
      <button
        class="header"
        class:on={zoomedId === c.id}
        style="left: {(cx.x / MAP_W) * 100}%; top: {(cx.y / MAP_H) * 100}%; --c-accent:{c.accent}"
        aria-pressed={zoomedId === c.id}
        data-testid="constellation-{c.id}"
        on:click={() => toggle(c.id)}
      >
        <PlatonicIcon kind={c.solid} size={18} />
        <span>{c.label}</span>
      </button>
    {/each}
  </div>

  <p class="legend">
    <svg width="26" height="6" viewBox="0 0 26 6" aria-hidden="true"><line x1="0" y1="3" x2="26" y2="3" stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="4 4" /></svg>
    dashed gold ties cross disciplines · press a constellation to zoom
  </p>
</div>

<style>
  .map-wrap {
    position: absolute;
    inset: 0;
  }

  .skymap {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .world {
    transition: transform 0.5s ease;
    will-change: transform;
  }

  .ties line {
    stroke: var(--gold);
    stroke-width: 1.6;
    stroke-dasharray: 6 7;
    opacity: 0.4;
  }

  .cluster { transition: opacity 0.4s ease; }
  .cluster.dimmed { opacity: 0.22; }

  .edges line {
    stroke: var(--c-accent);
    stroke-width: 1.2;
    opacity: 0.45;
  }

  .node { outline: none; }
  .hit { fill: transparent; }

  .star {
    fill: var(--text);
    stroke: var(--c-accent);
    stroke-width: 2;
    transition: fill 0.2s ease;
  }
  .bright .star {
    fill: var(--gold);
    stroke: var(--gold);
  }
  .halo {
    fill: var(--gold);
    opacity: 0.14;
  }

  a.node:hover .star,
  a.node:focus-visible .star {
    fill: var(--gold);
  }

  .node-lbl {
    font-family: var(--mono);
    font-size: 21px;
    fill: var(--text);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  .bright .node-lbl { fill: var(--gold); }

  /* Labels appear when the cluster is zoomed — or always, without JS. */
  .zoomed .cluster:not(.dimmed) .node-lbl { opacity: 1; }
  :global(html.no-js) .node-lbl { opacity: 1; }

  /* ── Cluster headers ── */
  .headers { display: contents; }

  .header {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 44px;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--c-accent) 55%, transparent);
    background: color-mix(in srgb, var(--bg-2) 80%, transparent);
    color: var(--text);
    font-family: var(--mono);
    font-size: 0.66rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    transition: box-shadow 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
  .header:hover,
  .header:focus-visible {
    color: var(--gold);
    border-color: color-mix(in srgb, var(--gold) 60%, transparent);
    box-shadow: 0 0 22px #fcd34d22;
  }
  .header.on {
    color: var(--gold);
    border-color: var(--gold);
    box-shadow: 0 0 26px #fcd34d2e;
  }

  .legend {
    position: absolute;
    left: clamp(14px, 3vw, 32px);
    bottom: clamp(64px, 11vh, 100px);
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 0.62rem;
    letter-spacing: 0.05em;
    color: var(--text-2);
  }
  :global(html.no-js) .legend { display: none; }

  @media (max-width: 899px), (max-height: 559px) {
    .map-wrap { inset: var(--chip-h) 0 calc(var(--bar-h) + 30px) 0; }
    .headers {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      position: absolute;
      top: 34px;
      left: 8px;
      right: 8px;
      z-index: 2;
    }
    .header {
      position: static;
      transform: none;
      min-height: 40px;
      padding: 6px 10px;
      font-size: 0.56rem;
    }
    .legend { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .world, .cluster, .node-lbl { transition: none; }
  }
</style>
