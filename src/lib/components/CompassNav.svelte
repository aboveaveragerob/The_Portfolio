<!-- The Celestial Compass — four FIXED cardinal points around the sun
     (ruled: fixed positions; the orbital feel lives in the ornament, never in
     a moving click target). N = Career Orbit, E = Constellations,
     S = Scrolls, W = Physical Archive. Every point is a real <a> with a
     visible text label; the active point glows gold behind a slowly rotating
     Metatron's Cube; inactive points carry a static low-opacity rune.
     On narrow/short viewports the compass docks as a 4-button bottom bar. -->
<script>
  import MetatronCube from './geometry/MetatronCube.svelte';

  export let section = '';
  export let emphasize = ''; // home marks Career Orbit as the primary CTA

  const POINTS = [
    { id: 'orbit', dir: 'n', arrow: '↑', label: 'Career Orbit', href: '/orbit' },
    { id: 'constellations', dir: 'e', arrow: '→', label: 'Constellations', href: '/constellations' },
    { id: 'scrolls', dir: 's', arrow: '↓', label: 'Scrolls', href: '/scrolls' },
    { id: 'archive', dir: 'w', arrow: '←', label: 'Archive', href: '/archive' },
  ];
</script>

<nav class="compass" aria-label="Views">
  {#each POINTS as p}
    {@const active = section === p.id}
    <a
      class="point {p.dir}"
      class:active
      class:primary={emphasize === p.id && !active}
      href={p.href}
      aria-current={active ? 'page' : undefined}
      data-testid="compass-{p.id}"
    >
      <span class="rune" aria-hidden="true">
        <MetatronCube
          size={68}
          rotate={active}
          stroke={active ? 'var(--gold)' : 'var(--violet)'}
          opacity={active ? 0.55 : 0.2}
          showCircles={false}
        />
      </span>
      <span class="arrow" aria-hidden="true">{p.arrow}</span>
      <span class="label">{p.label}</span>
      {#if emphasize === p.id && !active}
        <span class="hint">Begin here</span>
      {/if}
    </a>
  {/each}
</nav>

<style>
  .compass {
    position: fixed;
    inset: 0;
    z-index: 3;
    pointer-events: none;
  }

  .point {
    pointer-events: auto;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    min-width: 44px;
    min-height: 44px;
    padding: 10px 14px;
    border-radius: 12px;
    text-decoration: none;
    color: var(--text);
    background: color-mix(in srgb, var(--bg-2) 55%, transparent);
    border: 1px solid transparent;
    transition: border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
  }

  .n { left: 50%; top: calc(50% - 27vmin); transform: translate(-50%, -50%); }
  .s { left: 50%; top: calc(50% + 27vmin); transform: translate(-50%, -50%); }
  .e { left: calc(50% + 30vmin); top: 50%; transform: translate(-50%, -50%); }
  .w { left: calc(50% - 30vmin); top: 50%; transform: translate(-50%, -50%); }

  .rune {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }

  .arrow {
    font-size: 0.8rem;
    color: var(--text-2);
    line-height: 1;
  }

  .label {
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .hint {
    font-family: var(--serif);
    font-style: italic;
    font-size: 0.72rem;
    color: var(--gold);
  }

  .point:hover,
  .point:focus-visible {
    border-color: color-mix(in srgb, var(--gold) 55%, transparent);
    color: var(--gold);
    box-shadow: 0 0 22px #fcd34d1f;
  }

  .point.active {
    color: var(--gold);
    border-color: color-mix(in srgb, var(--gold) 45%, transparent);
  }
  .point.active .arrow { color: var(--gold); }

  .point.primary {
    border-color: color-mix(in srgb, var(--gold) 60%, transparent);
    box-shadow: 0 0 26px #fcd34d2a;
  }

  /* Narrow / short viewports: a fixed 4-button bottom bar with visible
     labels — every target ≥44px. */
  @media (max-width: 899px), (max-height: 559px) {
    .compass {
      inset: auto 0 0 0;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px));
      background: color-mix(in srgb, var(--bg) 82%, transparent);
      border-top: 1px solid var(--line-2);
      backdrop-filter: blur(6px);
      pointer-events: auto;
    }
    .point,
    .n, .e, .s, .w {
      position: static;
      transform: none;
      padding: 6px 4px;
      min-height: 48px;
      background: none;
    }
    .rune { display: none; }
    .hint { display: none; }
    .label { font-size: 0.58rem; white-space: normal; text-align: center; line-height: 1.15; }
    .point.active { border-color: color-mix(in srgb, var(--gold) 45%, transparent); }
  }
</style>
