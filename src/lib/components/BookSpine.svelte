<!-- One volume's spine — a real link into /library/[slug]. Ports the
     deterministic per-book height/thickness variance from the old ShelfPanel
     (FNV-style hash of the id, so SSR and hydration agree) with the wing
     accent on cap and emblem. -->
<script>
  export let book;
  export let wing;
  export let slug;
  export let active = false;

  function hashId(id) {
    let h = 2166136261;
    for (let i = 0; i < id.length; i++) {
      h ^= id.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  $: h = hashId(book.id);
  $: hf = (0.84 + ((h % 17) / 100)).toFixed(2); // height factor 0.84–1.00
  $: wf = (0.92 + (((h >>> 5) % 8) / 10)).toFixed(2); // thickness factor 0.92–1.62
</script>

<a
  class="spine"
  class:active
  href="/library/{slug}"
  style="--spine:{book.coverColor}; --hf:{hf}; --wf:{wf}; --wing-accent:{wing.accent}"
  title="{book.title} · {book.subtitle}"
  aria-label="{book.title} — {book.subtitle}"
  aria-current={active ? 'page' : undefined}
  data-testid="spine-{slug}"
>
  <span class="sp-cap" aria-hidden="true"></span>
  <span class="sp-title">{book.title}</span>
  <span class="sp-emblem" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="7" stroke="var(--wing-accent)" stroke-width="1.5" opacity="0.9" />
      <circle cx="12" cy="12" r="2.6" fill="var(--wing-accent)" opacity="0.7" />
    </svg>
  </span>
</a>

<style>
  .spine {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    align-self: flex-end;
    /* Width is a flex share of the shelf row (thickness variance preserved
       as ratio), so the wall always fits — spines scale, never wrap. */
    flex: calc(var(--wf) * 100) 1 0;
    min-width: 0;
    max-width: calc(46px * var(--wf));
    height: calc(var(--shelf-h, 150px) * var(--hf));
    padding: 8px 3px 7px;
    border-radius: 4px 4px 2px 2px;
    background:
      linear-gradient(180deg, #ffffff14 0%, transparent 22%),
      linear-gradient(90deg, #00000042 0%, transparent 24%, transparent 76%, #00000058 100%),
      color-mix(in oklab, var(--spine) 78%, #1a1230);
    border: 1px solid #ffffff14;
    box-shadow: 0 8px 18px -10px #000;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .spine:hover,
  .spine:focus-visible {
    transform: translateY(-8px);
    box-shadow: 0 14px 26px -12px #000, 0 0 18px #fcd34d26;
  }
  .spine.active {
    transform: translateY(-10px);
    border-color: color-mix(in srgb, var(--gold) 60%, transparent);
    box-shadow: 0 14px 26px -12px #000, 0 0 22px #fcd34d33;
  }

  .sp-cap {
    width: 70%;
    height: 3px;
    border-radius: 2px;
    background: var(--wing-accent);
    opacity: 0.75;
  }

  .sp-title {
    flex: 1 1 auto;
    min-height: 0;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    overflow: hidden;
    font-family: var(--serif);
    font-size: clamp(0.62rem, 1.5vh, 0.78rem);
    line-height: 1.1;
    letter-spacing: 0.03em;
    color: var(--text);
    margin: 8px 0;
    text-align: center;
  }

  .sp-emblem {
    width: 16px;
    height: 16px;
    opacity: 0.9;
  }
  .sp-emblem svg { width: 100%; height: 100%; display: block; }

  /* Narrow viewports: the wall is seen "from across the room" — printed
     titles and emblems go with it; identity stays on aria-label/title. */
  @media (max-width: 639px) {
    .spine { padding: 5px 1px 4px; }
    .sp-title { display: none; }
    .sp-emblem { width: 9px; height: 9px; }
  }
  @media (min-width: 640px) and (max-width: 899px) {
    .sp-title { font-size: 0.55rem; }
  }
</style>
