<!-- Golden (logarithmic) spiral — the frame around the center sun.
     The path is a module-scope constant sampled from r = a·e^(bθ) with
     b = ln(φ)/(π/2), so growth per quarter-turn is exactly φ. Deterministic,
     SSR-safe, decorative only. `spin` adds the 60s rotation (1 rev/min —
     barely perceptible), disabled under prefers-reduced-motion. -->
<script context="module">
  const PHI = 1.618033988749895;
  const B = Math.log(PHI) / (Math.PI / 2);
  const TURNS = 3.5;
  const THETA_MAX = TURNS * 2 * Math.PI;
  const A = 100 / Math.exp(B * THETA_MAX); // outer radius lands on 100

  const pts = [];
  for (let deg = 0; deg <= TURNS * 360; deg += 6) {
    const t = (deg * Math.PI) / 180;
    const r = A * Math.exp(B * t);
    pts.push(`${+(Math.cos(t) * r).toFixed(2)} ${+(Math.sin(t) * r).toFixed(2)}`);
  }
  const PATH = 'M' + pts.join(' L');
</script>

<script>
  export let size = 280;
  export let stroke = 'var(--gold)';
  export let strokeWidth = 1.2;
  export let opacity = 0.55;
  export let spin = false;
</script>

<svg
  class="golden-spiral"
  class:spin
  width={size}
  height={size}
  viewBox="-110 -110 220 220"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d={PATH} fill="none" {stroke} stroke-width={strokeWidth} {opacity} stroke-linecap="round" />
</svg>

<style>
  .golden-spiral { display: block; }
  .spin {
    animation: spiral-rotate 60s linear infinite;
  }
  @keyframes spiral-rotate {
    to { transform: rotate(360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .spin { animation: none; }
  }
</style>
