<!-- Celestial archive backdrop — "Library of the Stars".
     A restrained, professional cosmology: a deep star-vault with a soft
     central glow, concentric astrolabe rings receding into depth, a pair of
     monochrome hall arches for the "grand library" recession, and distant,
     desaturated shelves at the margins. Everything is generated from a
     seeded PRNG so it's deterministic (SSR-safe) and maintainable — no
     hand-placed rects, no hue-cycling, no rainbow primaries.
     Decorative only: aria-hidden, pointer-events:none, reduced-motion aware. -->
<script>
  // Deterministic PRNG so server-rendered and hydrated markup match exactly.
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(20260716);
  const range = (a, b) => a + rnd() * (b - a);

  const W = 1440, H = 900;

  // ── Starfield: many faint stars, a third of them gently twinkling ──
  const stars = Array.from({ length: 210 }, (_, i) => ({
    x: +range(0, W).toFixed(1),
    y: +range(0, H).toFixed(1),
    r: +range(0.35, 1.6).toFixed(2),
    o: +range(0.14, 0.66).toFixed(2),
    tw: i % 3 === 0,
    dur: +range(3.6, 7.2).toFixed(1),
    delay: +(-range(0, 6)).toFixed(1),
  }));

  // ── Brighter "lantern" stars with a soft halo ──
  const brightStars = Array.from({ length: 11 }, () => ({
    x: +range(120, W - 120).toFixed(1),
    y: +range(80, H - 220).toFixed(1),
    r: +range(1.15, 2.0).toFixed(2),
    halo: +range(7, 12).toFixed(1),
    dur: +range(5, 9).toFixed(1),
    delay: +(-range(0, 5)).toFixed(1),
  }));

  // ── Distant, desaturated shelves at the far margins (deep indigo/violet) ──
  function shelfColumn(x0) {
    const rows = [];
    for (let row = 0; row < 6; row++) {
      const yTop = 150 + row * 108;
      let x = x0;
      const spines = [];
      while (x < x0 + 150) {
        const w = range(3.4, 7.4);
        spines.push({
          x: +x.toFixed(1),
          y: +(yTop + range(0, 22)).toFixed(1),
          w: +w.toFixed(1),
          h: +range(30, 62).toFixed(1),
          o: +range(0.06, 0.2).toFixed(2),
          hue: rnd() < 0.5 ? 'var(--violet)' : '#6f7cff',
        });
        x += w + range(2.2, 5.5);
      }
      rows.push({ spines });
    }
    return rows;
  }
  const leftShelf = shelfColumn(30);
  const rightShelf = shelfColumn(W - 180);

  // ── Concentric astrolabe rings around the central glow ──
  const cx = W / 2, cyy = 430;
  const rings = [70, 128, 196, 276].map((r, i) => ({
    r, o: +(0.16 - i * 0.03).toFixed(2), ticks: i === 2,
  }));
  // Tick marks on one ring for the alchemical-instrument feel.
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const r1 = 196, r2 = i % 4 === 0 ? 206 : 201;
    return {
      x1: +(cx + Math.cos(a) * r1).toFixed(1), y1: +(cyy + Math.sin(a) * r1).toFixed(1),
      x2: +(cx + Math.cos(a) * r2).toFixed(1), y2: +(cyy + Math.sin(a) * r2).toFixed(1),
    };
  });

  // ── A couple of quiet constellations (deliberate, elegant shapes),
  //    placed in open sky above the recession, clear of the margin shelves ──
  const constellations = [
    [[300, 150], [372, 132], [430, 176], [512, 158], [560, 214]],
    [[900, 200], [968, 158], [1030, 186], [1082, 140], [1150, 172]],
    [[610, 690], [680, 726], [742, 700], [800, 748], [772, 660]],
  ];
</script>

<div class="backdrop" aria-hidden="true">
  <svg class="vault" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="celestialGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stop-color="#ffe0ad" stop-opacity="0.42"/>
        <stop offset="30%" stop-color="#c77bff" stop-opacity="0.24"/>
        <stop offset="100%" stop-color="#7c5cff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="archStroke" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%"  stop-color="#7c5cff"/>
        <stop offset="100%" stop-color="#b6a0ff"/>
      </linearGradient>
    </defs>

    <!-- Soft celestial hearth (the depth toward which everything recedes) -->
    <circle cx={cx} cy={cyy} r="340" fill="url(#celestialGlow)"/>

    <!-- Grand hall: two monochrome arches receding, low opacity -->
    <g fill="none" stroke="url(#archStroke)" stroke-linecap="round">
      <path d="M283.9 779.3 L283.9 191.3 A436.1 436.1 0 0 1 1156.1 191.3 L1156.1 779.3" stroke-width="1.4" opacity="0.10"/>
      <path d="M414.7 681.1 L414.7 269.5 A305.3 305.3 0 0 1 1025.3 269.5 L1025.3 681.1" stroke-width="1.1" opacity="0.10"/>
    </g>

    <!-- Astrolabe rings around the glow -->
    <g class="astrolabe" fill="none" stroke="#c9b6ff">
      {#each rings as ring}
        <circle cx={cx} cy={cyy} r={ring.r} stroke-width="0.8" opacity={ring.o}/>
      {/each}
      {#each ticks as t}
        <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#d9c8a0" stroke-width="0.7" opacity="0.14"/>
      {/each}
    </g>

    <!-- Distant, desaturated shelves at the margins -->
    <g class="shelves-far">
      {#each [...leftShelf, ...rightShelf] as row}
        {#each row.spines as s}
          <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="1.2" fill={s.hue} opacity={s.o}/>
        {/each}
      {/each}
    </g>

    <!-- Quiet constellations -->
    <g class="constellations" fill="none" stroke="#b6c4ff" stroke-width="0.6" opacity="0.28">
      {#each constellations as pts}
        <polyline points={pts.map(p => p.join(',')).join(' ')}/>
        {#each pts as p}
          <circle cx={p[0]} cy={p[1]} r="1.1" fill="#dfe6ff" stroke="none" opacity="0.6"/>
        {/each}
      {/each}
    </g>
  </svg>

  <!-- Star-vault -->
  <svg class="stars" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    {#each stars as s}
      <circle
        cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o}
        class:tw={s.tw}
        style={s.tw ? `--d:${s.dur}s;--delay:${s.delay}s` : ''}
      />
    {/each}
    {#each brightStars as b}
      <circle cx={b.x} cy={b.y} r={b.halo} fill="#cbb6ff" opacity="0.05"/>
      <circle
        cx={b.x} cy={b.y} r={b.r} fill="#fff"
        class="bright" style={`--d:${b.dur}s;--delay:${b.delay}s`}
      />
    {/each}
  </svg>
</div>

<style>
  .backdrop { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

  .vault, .stars {
    position: absolute; top: 50%; left: 50%;
    width: max(1440px, 118vw); height: max(900px, 118vh);
    transform: translate(-50%, -50%);
  }

  /* Depth layer drifts slowly toward the viewer — one gentle motion, no hue shift */
  .vault {
    opacity: .9;
    mix-blend-mode: screen;
    animation: vault-drift 60s ease-in-out infinite alternate;
  }
  @keyframes vault-drift {
    from { transform: translate(-50%, -50%) scale(1); }
    to   { transform: translate(-50%, -51%) scale(1.04); }
  }
  .astrolabe { transform-box: view-box; transform-origin: 720px 430px; animation: astro-spin 220s linear infinite; }
  @keyframes astro-spin { to { transform: rotate(360deg); } }

  /* Stars sit above depth with no blend so they stay crisp and even */
  .stars { opacity: .9; }
  .stars .tw { animation: twinkle var(--d, 5s) ease-in-out infinite; animation-delay: var(--delay, 0s); }
  .stars .bright { animation: twinkle-bright var(--d, 6s) ease-in-out infinite; animation-delay: var(--delay, 0s); }
  @keyframes twinkle { 0%, 100% { opacity: .18; } 50% { opacity: .72; } }
  @keyframes twinkle-bright { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .vault, .astrolabe, .stars .tw, .stars .bright { animation: none; }
  }
</style>
