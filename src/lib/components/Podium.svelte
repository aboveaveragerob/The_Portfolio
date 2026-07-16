<!-- Podium — the surface the open book rests on.
     Re-skinned from the original wood/brass lectern to the site's cosmic
     palette (violet/pink/bone over dark surfaces) so shelves, spines, book,
     and podium all read as one system. The engraving keeps the original
     "flower of life" sacred geometry, stroked in the accent tokens. -->
<div class="podium-wrap" aria-hidden="true">
  <!-- Top ledge the book sits on -->
  <div class="podium-ledge"></div>

  <!-- Main body with sacred-geometry engraving -->
  <div class="podium-body">
    <svg class="engraving" viewBox="0 0 600 80" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <!-- Flower of Life centered at (300, 40), radius 14, spacing 14 -->
      <g fill="none" stroke="var(--violet)" stroke-width="0.6" opacity="0.28" transform="translate(300,40)">
        <circle cx="0" cy="0" r="14"/>
        <circle cx="14" cy="0" r="14"/><circle cx="7" cy="12.1" r="14"/><circle cx="-7" cy="12.1" r="14"/>
        <circle cx="-14" cy="0" r="14"/><circle cx="-7" cy="-12.1" r="14"/><circle cx="7" cy="-12.1" r="14"/>
        <circle cx="28" cy="0" r="14"/><circle cx="21" cy="12.1" r="14"/><circle cx="14" cy="24.2" r="14"/>
        <circle cx="0" cy="24.2" r="14"/><circle cx="-14" cy="24.2" r="14"/><circle cx="-21" cy="12.1" r="14"/>
        <circle cx="-28" cy="0" r="14"/><circle cx="-21" cy="-12.1" r="14"/><circle cx="-14" cy="-24.2" r="14"/>
        <circle cx="0" cy="-24.2" r="14"/><circle cx="14" cy="-24.2" r="14"/><circle cx="21" cy="-12.1" r="14"/>
      </g>
      <!-- Accent rails -->
      <line x1="40" y1="4" x2="560" y2="4" stroke="var(--pink)" stroke-width="0.8" opacity="0.4"/>
      <line x1="40" y1="76" x2="560" y2="76" stroke="var(--pink)" stroke-width="0.8" opacity="0.4"/>
      <!-- Subtle grain strokes -->
      <line x1="0" y1="25" x2="600" y2="25" stroke="#ffffff" stroke-width="0.4" opacity="0.05"/>
      <line x1="0" y1="45" x2="600" y2="45" stroke="#ffffff" stroke-width="0.4" opacity="0.05"/>
      <line x1="0" y1="60" x2="600" y2="60" stroke="#ffffff" stroke-width="0.4" opacity="0.05"/>
    </svg>
  </div>

  <!-- Shadow beneath -->
  <div class="podium-shadow"></div>
</div>

<style>
  .podium-wrap {
    width: min(94vw, 760px);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    user-select: none;
    pointer-events: none;
  }
  .podium-ledge {
    height: clamp(6px, 1.3vh, 10px);
    background: linear-gradient(to bottom, var(--ledge-hi), var(--ledge-lo));
    border-radius: 4px 4px 0 0;
    box-shadow: 0 -1px 0 #b25cff40, inset 0 1px 0 #ffffff2e;
  }
  .podium-body {
    height: clamp(44px, 8.5vh, 78px);
    background: linear-gradient(to bottom, var(--surface-1) 0%, var(--surface-2) 100%);
    position: relative;
    overflow: hidden;
    border-left: 1px solid #ffffff0f;
    border-right: 1px solid #ffffff0f;
  }
  .engraving { width: 100%; height: 100%; display: block; }
  .podium-shadow {
    height: clamp(8px, 1.6vh, 14px);
    background: linear-gradient(to bottom, #00000073, transparent);
    border-radius: 0 0 6px 6px;
  }

  @media (max-width: 640px) {
    .podium-body { height: clamp(38px, 7vh, 60px); }
  }
</style>
