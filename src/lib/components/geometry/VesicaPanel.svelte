<!-- Vesica Piscis panel chrome — the overlay card used by the Career Orbit's
     role detail (and any future lens-shaped surface). The vesica emblem (two
     overlapping circles) marks the header; content is a plain readable card
     (--bg-2 surface), because the geometry is accent, not wallpaper. -->
<script>
  export let eyebrow = '';
  export let title = '';
  export let accent = 'var(--violet)';
</script>

<aside class="vesica-panel" style="--panel-accent:{accent}">
  <header class="vp-head">
    <svg class="vp-emblem" width="26" height="18" viewBox="0 0 26 18" aria-hidden="true">
      <g fill="none" stroke="var(--panel-accent)" stroke-width="1.1">
        <circle cx="9.5" cy="9" r="7.5" opacity="0.9" />
        <circle cx="16.5" cy="9" r="7.5" opacity="0.55" />
      </g>
    </svg>
    <div class="vp-titles">
      {#if eyebrow}<p class="vp-eyebrow">{eyebrow}</p>{/if}
      {#if title}<h2 class="vp-title">{title}</h2>{/if}
    </div>
    <slot name="actions" />
  </header>
  <div class="vp-body">
    <slot />
  </div>
</aside>

<style>
  .vesica-panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: color-mix(in oklab, var(--bg-2) 88%, var(--panel-accent) 12%);
    border: 1px solid color-mix(in oklab, var(--panel-accent) 45%, transparent);
    border-radius: 14px;
    box-shadow: 0 18px 50px #00000066, 0 0 0 1px #ffffff08 inset;
  }

  .vp-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: clamp(12px, 2vh, 18px) clamp(14px, 2vw, 22px) 10px;
    border-bottom: 1px solid var(--line-2);
  }

  .vp-emblem { flex: 0 0 auto; }

  .vp-titles { flex: 1 1 auto; min-width: 0; }

  .vp-eyebrow {
    font-family: var(--mono);
    font-size: 0.68rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-2);
  }

  .vp-title {
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(1.05rem, 2.4vh, 1.35rem);
    color: var(--text);
    line-height: 1.2;
  }

  .vp-body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    padding: clamp(12px, 2vh, 18px) clamp(14px, 2vw, 22px);
  }
</style>
