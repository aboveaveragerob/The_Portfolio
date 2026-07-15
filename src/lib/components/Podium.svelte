<div class="podium-wrap" aria-hidden="true">
  <!-- Top ledge -->
  <div class="podium-ledge"></div>

  <!-- Main body with sacred geometry SVG -->
  <div class="podium-body">
    <svg
      class="engraving"
      viewBox="0 0 600 80"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Flower of Life centered at (300, 40), radius 14, spacing 14 -->
      <g fill="none" stroke="#D4AF37" stroke-width="0.6" opacity="0.22" transform="translate(300,40)">
        <!-- Center -->
        <circle cx="0"    cy="0"    r="14"/>
        <!-- Ring 1 — 6 circles -->
        <circle cx="14"   cy="0"    r="14"/>
        <circle cx="7"    cy="12.1" r="14"/>
        <circle cx="-7"   cy="12.1" r="14"/>
        <circle cx="-14"  cy="0"    r="14"/>
        <circle cx="-7"   cy="-12.1" r="14"/>
        <circle cx="7"    cy="-12.1" r="14"/>
        <!-- Ring 2 — 6 outer -->
        <circle cx="28"   cy="0"    r="14"/>
        <circle cx="21"   cy="12.1" r="14"/>
        <circle cx="14"   cy="24.2" r="14"/>
        <circle cx="0"    cy="24.2" r="14"/>
        <circle cx="-14"  cy="24.2" r="14"/>
        <circle cx="-21"  cy="12.1" r="14"/>
        <circle cx="-28"  cy="0"    r="14"/>
        <circle cx="-21"  cy="-12.1" r="14"/>
        <circle cx="-14"  cy="-24.2" r="14"/>
        <circle cx="0"    cy="-24.2" r="14"/>
        <circle cx="14"   cy="-24.2" r="14"/>
        <circle cx="21"   cy="-12.1" r="14"/>
      </g>

      <!-- Brass rails -->
      <line x1="40" y1="4"  x2="560" y2="4"  stroke="#B89B5E" stroke-width="0.8" opacity="0.35"/>
      <line x1="40" y1="76" x2="560" y2="76" stroke="#B89B5E" stroke-width="0.8" opacity="0.35"/>

      <!-- Subtle wood-grain strokes -->
      <line x1="0"  y1="25" x2="600" y2="25" stroke="#ffffff" stroke-width="0.4" opacity="0.04"/>
      <line x1="0"  y1="45" x2="600" y2="45" stroke="#ffffff" stroke-width="0.4" opacity="0.04"/>
      <line x1="0"  y1="60" x2="600" y2="60" stroke="#ffffff" stroke-width="0.4" opacity="0.04"/>
    </svg>
  </div>

  <!-- Shadow beneath -->
  <div class="podium-shadow"></div>
</div>

<style>
  .podium-wrap {
    width: 100%;
    max-width: 640px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    user-select: none;
  }

  .podium-ledge {
    height: 10px;
    background: linear-gradient(to bottom, #4A3020, var(--wood-lt));
    border-radius: 4px 4px 0 0;
    box-shadow: 0 -1px 0 rgba(184,155,94,0.25);
  }

  .podium-body {
    height: 80px;
    background: linear-gradient(to bottom, var(--wood) 0%, var(--wood-dk) 100%);
    position: relative;
    overflow: hidden;
  }

  .engraving {
    width: 100%;
    height: 100%;
    display: block;
  }

  .podium-shadow {
    height: 12px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent);
    border-radius: 0 0 4px 4px;
  }
</style>
