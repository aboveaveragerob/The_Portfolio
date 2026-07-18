// Shared sacred-geometry math. Everything here is pure and deterministic —
// callers precompute coordinates at module scope (with toFixed rounding, the
// Backdrop house pattern) so server-rendered and hydrated markup match exactly.

export const PHI = 1.618033988749895;

// First n Fibonacci numbers, from 1, 1, 2, 3, 5…
export function fib(n) {
  const out = [1, 1];
  while (out.length < n) out.push(out[out.length - 1] + out[out.length - 2]);
  return out.slice(0, n);
}

// Point at angle `deg` (0° = +x, clockwise in SVG's y-down space) and radius r.
export function polar(cx, cy, r, deg) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
}

// Fit `n` ring radii between innerR and outerR with gaps proportioned to
// consecutive Fibonacci numbers (34 : 55 : 89 …) — Fibonacci *spacing* fitted
// to the available radius, since literal Fibonacci radii cannot fit a viewport.
export function fitFibGaps(innerR, outerR, n) {
  const gaps = fib(n + 7).slice(8, 8 + (n - 1)); // e.g. n=4 → [34, 55, 89]
  const total = gaps.reduce((a, b) => a + b, 0);
  const k = (outerR - innerR) / total;
  const radii = [innerR];
  for (const g of gaps) radii.push(radii[radii.length - 1] + g * k);
  return radii.map((r) => +r.toFixed(1));
}
