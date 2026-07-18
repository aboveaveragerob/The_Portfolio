<!-- ClosedBook — the staged volume resting on the podium.
     A hardback rendered in CSS 3D: front cover + spine + a hint of the page
     block behind them. The whole thing is one <button>: clicking, tapping,
     or Enter/Space anywhere on the book opens it. The site's cosmic palette
     (violet glow, bone type, serif titles) carries through so it reads as
     the same object as the shelf spines it was pulled from. -->
<script>
  export let title;
  export let subtitle;
  export let coverColor = '#1A2A3A';
  export let accent     = '#5ef2e8';
</script>

<button
  class="closed-book"
  style="--cover: {coverColor}; --accent: {accent};"
  aria-label="Open {title} — {subtitle}"
  on:click
>
  <span class="cb-body">
    <!-- Spine — the left face, angled toward the viewer -->
    <span class="cb-spine">
      <span class="cb-spine-title">{title}</span>
    </span>

    <!-- Cover — the front face -->
    <span class="cb-cover">
      <span class="cb-emblem" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="var(--accent)" stroke-width="1.4" opacity="0.9"/>
          <circle cx="12" cy="12" r="3" fill="var(--accent)" opacity="0.65"/>
        </svg>
      </span>
      <span class="cb-title">{title}</span>
      <span class="cb-rule" aria-hidden="true"></span>
      <span class="cb-sub">{subtitle}</span>
    </span>

    <!-- Page-block hint: the top edge + fore-edge cream strips behind the cover -->
    <span class="cb-pages cb-pages-top"    aria-hidden="true"></span>
    <span class="cb-pages cb-pages-fore"   aria-hidden="true"></span>
    <span class="cb-pages cb-pages-bottom" aria-hidden="true"></span>
  </span>
</button>

<style>
  .closed-book {
    /* Reset button chrome — the whole book IS the button */
    all: unset;
    box-sizing: border-box;
    display: inline-block;
    cursor: pointer;
    /* Own 3D context so faces stack correctly regardless of parent perspective */
    perspective: 1400px;
    padding: 24px 34px 28px;  /* room for the glow and the tilted-out spine */
  }
  .closed-book:focus-visible {
    outline: 2px solid var(--violet);
    outline-offset: 6px;
    border-radius: 8px;
  }

  .cb-body {
    --depth: 22px;
    --tilt-y: -22deg;
    --tilt-x: -4deg;

    position: relative;
    display: block;
    /* Size against height so the book scales with the reader row and never
       gets so tall it crowds the podium out on shorter viewports. */
    height: clamp(190px, 32vh, 340px);
    aspect-ratio: 0.72 / 1;
    transform-style: preserve-3d;
    transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
    transition: transform .28s cubic-bezier(.2,.02,.12,1),
                filter    .28s cubic-bezier(.2,.02,.12,1);
    /* Idle breathe — a slower cadence than the shelf's old pulse so the book
       reads as its own object, not a copy of the spine highlight. */
    animation: cb-breathe 3.8s ease-in-out infinite;
    filter:
      drop-shadow(0 24px 28px #000000a6)
      drop-shadow(0 0 16px #b25cff3d);
  }

  /* Front cover, spine, and page-block edges share this base */
  .cb-cover,
  .cb-spine,
  .cb-pages {
    position: absolute;
    backface-visibility: hidden;
  }

  /* ── Front cover ─────────────────────────────────────── */
  .cb-cover {
    inset: 0;
    transform: translateZ(calc(var(--depth) / 2));
    background:
      /* soft top-left sheen */
      linear-gradient(155deg, #ffffff1a 0%, #ffffff00 42%),
      /* main cover gradient — lighter at the top, darker at the bottom */
      linear-gradient(180deg,
        color-mix(in oklab, var(--cover) 88%, #ffffff) 0%,
        var(--cover) 44%,
        color-mix(in oklab, var(--cover) 82%, #000000) 100%);
    border: 1px solid #ffffff1f;
    border-radius: 3px 7px 7px 3px;
    box-shadow:
      inset 6px 0 14px -8px #00000099,   /* gutter shadow near spine */
      inset -3px 0 10px -6px #00000055,   /* subtle fore-edge shadow */
      inset 0 1px 0 #ffffff1a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(6px, 1.2vh, 12px);
    padding: 18px 16px 22px 22px;
    text-align: center;
    color: var(--bone-0);
  }
  .cb-emblem {
    width: clamp(22px, 3vh, 30px);
    height: clamp(22px, 3vh, 30px);
    opacity: .95;
  }
  .cb-emblem svg { width: 100%; height: 100%; display: block; }

  .cb-title {
    font-family: var(--serif);
    font-weight: 600;
    font-size: clamp(1rem, 2.4vh, 1.35rem);
    line-height: 1.08;
    letter-spacing: -.005em;
    max-width: 16ch;
  }
  .cb-rule {
    width: 34px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: .7;
  }
  .cb-sub {
    font-family: var(--mono);
    font-size: clamp(.5rem, 1.2vh, .6rem);
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--bone-1);
  }

  /* ── Spine (left face) ───────────────────────────────── */
  .cb-spine {
    top: 0;
    left: 0;
    width: var(--depth);
    height: 100%;
    transform-origin: right center;
    transform: rotateY(90deg) translateX(calc(var(--depth) / -2));
    background: linear-gradient(90deg,
      color-mix(in oklab, var(--cover) 62%, #000) 0%,
      color-mix(in oklab, var(--cover) 78%, #000) 50%,
      color-mix(in oklab, var(--cover) 62%, #000) 100%);
    border-top: 3px solid var(--accent);
    border-radius: 3px 0 0 3px;
    box-shadow: inset 0 1px 0 #ffffff1a, inset 0 -1px 0 #00000066;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .cb-spine-title {
    writing-mode: vertical-rl;
    font-family: var(--serif);
    font-weight: 500;
    font-size: .58rem;
    letter-spacing: .08em;
    color: var(--bone-0);
    white-space: nowrap;
    padding: 12px 0;
  }

  /* ── Page-block edges: the cream sliver of pages between the boards ── */
  .cb-pages {
    background: linear-gradient(180deg, #ede2ce 0%, #cfc1a8 100%);
    box-shadow: inset 0 0 0 1px #00000012;
  }
  /* Top edge — thin strip along the top, sitting inside the boards */
  .cb-pages-top {
    top: 0;
    left: 2px;
    right: 2px;
    height: calc(var(--depth) - 2px);
    transform-origin: center top;
    transform: rotateX(-90deg) translateY(-1px);
    border-radius: 2px 2px 0 0;
  }
  /* Bottom edge — same on the bottom */
  .cb-pages-bottom {
    bottom: 0;
    left: 2px;
    right: 2px;
    height: calc(var(--depth) - 2px);
    transform-origin: center bottom;
    transform: rotateX(90deg) translateY(1px);
    border-radius: 0 0 2px 2px;
  }
  /* Fore-edge — thin right face, opposite the spine */
  .cb-pages-fore {
    top: 2px;
    right: 0;
    bottom: 2px;
    width: calc(var(--depth) - 2px);
    transform-origin: right center;
    transform: rotateY(-90deg) translateX(1px);
    border-radius: 0 2px 2px 0;
  }

  /* ── Idle breathe ──────────────────────────────────── */
  @keyframes cb-breathe {
    0%, 100% {
      transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateY(0);
    }
    50% {
      transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateY(-2px);
    }
  }

  /* ── Hover / focus — lift + strengthen the glow ──────── */
  .closed-book:hover .cb-body,
  .closed-book:focus-visible .cb-body {
    animation: none;
    transform: rotateX(-6deg) rotateY(-20deg) translateY(-6px);
    filter:
      drop-shadow(0 34px 42px #000000cc)
      drop-shadow(0 0 26px #b25cff80);
  }
  .closed-book:active .cb-body {
    transform: rotateX(-3deg) rotateY(-22deg) translateY(-1px);
    filter:
      drop-shadow(0 22px 26px #000000a6)
      drop-shadow(0 0 14px #b25cff66);
  }

  /* ── Reduced motion: keep the shape, lose the movement ── */
  @media (prefers-reduced-motion: reduce) {
    .cb-body { animation: none; }
    .closed-book:hover .cb-body,
    .closed-book:focus-visible .cb-body {
      transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
      filter:
        drop-shadow(0 24px 28px #000000a6)
        drop-shadow(0 0 24px #b25cff77);
    }
  }

  /* ── Narrow viewports — smaller book so the whole library + reader still
        fit one no-scroll screen above the podium (issue #56). ──────────── */
  @media (max-width: 899px) {
    .closed-book { padding: 16px 24px 18px; }
    .cb-body { height: clamp(132px, 21vh, 196px); }
    .cb-title { font-size: clamp(.9rem, 2vh, 1.15rem); }
  }
  @media (max-width: 640px) {
    .closed-book { padding: 12px 22px 14px; }
    .cb-body { height: clamp(104px, 16vh, 148px); }
  }
</style>
