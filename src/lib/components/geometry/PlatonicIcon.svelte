<!-- Platonic solid wireframes, 24×24 — skill-category glyphs. Always rendered
     BESIDE a visible text label (never bare); the svg itself is decorative. -->
<script context="module">
  // Hand-authored 2D orthographic wireframe projections.
  export const SOLIDS = {
    tetra: 'M12 3 L3 21 L21 21 Z M12 3 L12 15 M3 21 L12 15 M21 21 L12 15',
    cube: 'M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z M3 7 L12 12 L21 7 M12 12 L12 22',
    octa: 'M12 2 L22 12 L12 22 L2 12 Z M2 12 L22 12 M12 2 L12 22',
    dodeca:
      'M12 2 L21.5 9.1 L17.9 20.1 L6.1 20.1 L2.5 9.1 Z ' +
      'M14.9 8 L16.8 13.6 L12 17 L7.2 13.6 L9.1 8 Z ' +
      'M12 2 L12 6.9 M21.5 9.1 L16.8 13.6 M17.9 20.1 L12 17 M6.1 20.1 L7.2 13.6 M2.5 9.1 L9.1 8',
    icosa:
      'M12 2 L20.7 7 L20.7 17 L12 22 L3.3 17 L3.3 7 Z ' +
      'M12 7 L16.3 14.5 L7.7 14.5 Z ' +
      'M12 2 L12 7 M20.7 7 L16.3 14.5 M20.7 17 L16.3 14.5 M12 22 L7.7 14.5 M12 22 L16.3 14.5 M3.3 17 L7.7 14.5 M3.3 7 L12 7 M20.7 7 L12 7 M3.3 17 L7.7 14.5',
  };
</script>

<script>
  export let kind = 'cube'; // 'tetra' | 'cube' | 'octa' | 'dodeca' | 'icosa'
  export let size = 24;
  export let stroke = 'currentColor';
  export let strokeWidth = 1.1;
</script>

<svg
  class="platonic"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d={SOLIDS[kind] ?? SOLIDS.cube} fill="none" {stroke} stroke-width={strokeWidth} stroke-linejoin="round" />
</svg>

<style>
  .platonic { display: block; flex: 0 0 auto; }
</style>
