<!-- Flower of Life — overlapping circles on a hexagonal lattice. Used as the
     Scrolls watermark and for section ornaments. Pure function of `rings`,
     identical on server and client. Decorative only. -->
<script>
  export let rings = 2;
  export let size = 160;
  export let stroke = 'currentColor';
  export let strokeWidth = 1;
  export let opacity = 0.06;

  const R = 30; // lattice pitch = circle radius (classic construction)

  function centers(n) {
    const out = [];
    for (let q = -n; q <= n; q++) {
      for (let r = Math.max(-n, -q - n); r <= Math.min(n, -q + n); r++) {
        out.push({
          x: +(R * (q + r / 2)).toFixed(2),
          y: +(R * r * (Math.sqrt(3) / 2)).toFixed(2),
        });
      }
    }
    return out;
  }

  $: pts = centers(rings);
  $: extent = R * (rings + 1) + 4;
</script>

<svg
  class="flower"
  width={size}
  height={size}
  viewBox="{-extent} {-extent} {extent * 2} {extent * 2}"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
>
  <g fill="none" {stroke} stroke-width={strokeWidth} {opacity}>
    {#each pts as p}
      <circle cx={p.x} cy={p.y} r={R} />
    {/each}
    <circle cx="0" cy="0" r={R * rings + R} opacity="0.6" />
  </g>
</svg>

<style>
  .flower { display: block; }
</style>
