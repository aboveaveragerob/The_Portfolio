// Precomputed Career Orbit layout. All coordinates are module-scope constants
// derived from roles.js — deterministic, SSR-safe, positions permanent.
//
// Geometry rulings encoded here:
//  · 4 employment roles on 4 rings, period (civic work lives in the Archive
//    and Constellations instead).
//  · Ring radii use Fibonacci-proportioned gaps (34:55:89) fitted between the
//    sun's clearance and the canvas edge — literal Fibonacci radii can't fit.
//  · Planet AREA ∝ tenure (r ∝ √months), with clamp bounds that hold the
//    diameter spread to at most 2× so no role visually drowns another.
import { roles, tenureMonths } from './roles.js';
import { fitFibGaps, polar } from './geometry.js';

export const VIEW = 1000;           // square viewBox
export const CX = 500, CY = 500;
export const SUN_CLEAR = 150;       // radius kept visually empty for the sun

const INNER_R = 195, OUTER_R = 460;
export const RING_RADII = fitFibGaps(INNER_R, OUTER_R, roles.length);

// At the minimum supported width (390px) the 1000-unit viewBox renders at
// ~375px, so 1 unit ≈ 0.375px — a 44px touch target needs a ≥59-unit radius.
export const HIT_R = 60;

// Hand-picked angles (0° = east, clockwise in SVG's y-down space), kept off
// the compass cardinals so planets never stack under the N/E/S/W nav points.
const ANGLES = { brinker: 205, 'pnc-wm': 331, 'pnc-bank': 55, 'eddie-bauer': 148 };

function planetR(months) {
  return Math.min(34, Math.max(17, 4 * Math.sqrt(months)));
}

export const PLANETS = roles.map((role, i) => {
  const ring = RING_RADII[i]; // roles are ordered by recency; ring 1 = present
  const angle = ANGLES[role.id];
  const { x, y } = polar(CX, CY, ring, angle);
  const pr = planetR(tenureMonths(role));

  // Label sits radially outward from the planet, anchored by quadrant.
  const cos = Math.cos((angle * Math.PI) / 180);
  const sin = Math.sin((angle * Math.PI) / 180);
  const lp = polar(CX, CY, ring + pr + 18, angle);
  const anchor = cos > 0.35 ? 'start' : cos < -0.35 ? 'end' : 'middle';
  const baseline = sin > 0.35 ? 'hanging' : sin < -0.35 ? 'auto' : 'middle';

  return {
    roleId: role.id,
    org: role.org,
    title: role.title,
    dates: role.dates,
    present: role.end === null,
    ring: +ring.toFixed(1),
    x: +x.toFixed(1),
    y: +y.toFixed(1),
    r: +pr.toFixed(1),
    label: { x: +lp.x.toFixed(1), y: +lp.y.toFixed(1), anchor, baseline },
  };
});
