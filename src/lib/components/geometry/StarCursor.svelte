<!-- Star-trail cursor overlay. The cursor glyph itself is a native CSS cursor
     (static/cursor-star.svg — zero latency); this component renders only the
     trailing sparkles. Mounted content appears ONLY after onMount gates pass
     (fine pointer, no reduced-motion preference), so SSR markup is empty and
     hydration can never mismatch. pointer-events:none throughout. -->
<script>
  import { onMount } from 'svelte';

  const N = 5; // trailing sparkles
  let enabled = false;
  let stars = Array.from({ length: N }, () => ({ x: -100, y: -100 }));
  let raf = 0;
  let target = { x: -100, y: -100 };
  let seen = false;

  function onMove(e) {
    target = { x: e.clientX, y: e.clientY };
    seen = true;
  }

  function tick() {
    let prev = target;
    stars = stars.map((s, i) => {
      const ease = 0.32 - i * 0.045; // each sparkle lags the one before it
      const nx = s.x + (prev.x - s.x) * ease;
      const ny = s.y + (prev.y - s.y) * ease;
      prev = { x: nx, y: ny };
      return { x: nx, y: ny };
    });
    raf = requestAnimationFrame(tick);
  }

  onMount(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    enabled = true;
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  });
</script>

{#if enabled && seen}
  <div class="trail" aria-hidden="true">
    {#each stars as s, i}
      <svg
        class="sparkle"
        style="transform: translate({s.x}px, {s.y}px) scale({1 - i * 0.16})"
        width="10"
        height="10"
        viewBox="-5 -5 10 10"
      >
        <path
          d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z"
          fill="var(--gold)"
          opacity={0.5 - i * 0.08}
        />
      </svg>
    {/each}
  </div>
{/if}

<style>
  .trail {
    position: fixed;
    inset: 0;
    z-index: 40;
    pointer-events: none;
    overflow: hidden;
  }
  .sparkle {
    position: absolute;
    top: -5px;
    left: -5px;
    will-change: transform;
  }
</style>
