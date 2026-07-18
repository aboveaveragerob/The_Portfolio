<!-- Metatron's Cube — 13 Fruit-of-Life centers joined by every pairwise line.
     Module-scope constants (SSR-deterministic). `rotate` is the slow ornament
     spin used behind the active compass point; reduced-motion kills it. -->
<script context="module">
  const R = 30;
  const CENTERS = [{ x: 0, y: 0 }];
  for (const ring of [1, 2]) {
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 * Math.PI) / 180;
      CENTERS.push({
        x: +(Math.cos(a) * R * ring).toFixed(2),
        y: +(Math.sin(a) * R * ring).toFixed(2),
      });
    }
  }
  const LINES = [];
  for (let i = 0; i < CENTERS.length; i++) {
    for (let j = i + 1; j < CENTERS.length; j++) {
      LINES.push([CENTERS[i], CENTERS[j]]);
    }
  }
  const R_CIRCLE = 15;
</script>

<script>
  export let size = 120;
  export let stroke = 'var(--violet)';
  export let strokeWidth = 0.6;
  export let opacity = 0.5;
  export let showCircles = true;
  export let rotate = false;
</script>

<svg
  class="metatron"
  class:rotate
  width={size}
  height={size}
  viewBox="-78 -78 156 156"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
>
  <g fill="none" {stroke} stroke-width={strokeWidth} {opacity}>
    {#each LINES as [a, b]}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
    {/each}
    {#if showCircles}
      {#each CENTERS as c}
        <circle cx={c.x} cy={c.y} r={R_CIRCLE} opacity="0.7" />
      {/each}
    {/if}
  </g>
</svg>

<style>
  .metatron { display: block; }
  .rotate { animation: metatron-rotate 90s linear infinite; }
  @keyframes metatron-rotate {
    to { transform: rotate(360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .rotate { animation: none; }
  }
</style>
