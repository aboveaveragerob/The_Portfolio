<!-- One volume's spine, designed BY its contents — a real link into
     /library/[slug]:
       · thickness grows with the volume's actual page count
       · raised binding bands mark its chapter count (real bookbinding form)
       · the full title is always lettered and never clipped — the spine
         widens to fit its wrapped title, exactly like a real book
       · unwritten volumes are ghost bindings: present on the shelf,
         faint-lettered, awaiting their text
     Everything is derived from data.js at render time — deterministic, so
     SSR and hydration agree. -->
<script>
  export let book;
  export let wing;
  export let slug;
  export let active = false;

  $: pages = book.chapters.reduce((n, ch) => n + ch.pages.length, 0);
  $: chapters = book.chapters.length;
  $: empty = chapters === 0;

  // Thickness: a slim 12-page volume ≈ 22px floor, the 34-page Music tome
  // ≈ 54px — plus whatever width the wrapped title itself demands.
  $: thickness = Math.min(54, 22 + pages * 1.1).toFixed(1);

  // Height: fuller volumes stand a little taller on the shelf (86%–100% of
  // the shelf opening), ghost bindings shortest.
  $: hvar = (0.86 + Math.min(chapters, 10) * 0.014).toFixed(3);
</script>

<a
  class="spine"
  class:active
  class:empty
  href="/library/{slug}"
  style="--spine:{book.coverColor}; --wing-accent:{wing.accent}; --thick:{thickness}px; --bands:{Math.min(chapters, 6)}; --hvar:{hvar}"
  title="{book.title} · {book.subtitle}"
  aria-label="{book.title} — {empty ? 'a volume still being written' : book.subtitle}"
  aria-current={active ? 'page' : undefined}
  data-testid="spine-{slug}"
>
  {#if !empty}
    <span class="sp-bands" aria-hidden="true"></span>
  {/if}
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
    justify-content: flex-start;
    align-self: flex-end;
    /* Width = content thickness, then grows if the wrapped title needs more.
       The title is never clipped: the book is as wide as its lettering. */
    min-width: var(--thick);
    width: auto;
    flex: 0 0 auto;
    height: calc(var(--shelf-h, 150px) * var(--hvar));
    padding: 9px 3px 6px;
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

  /* Raised binding bands — one ridge per chapter (capped at six), spaced
     down the spine the way sewn cords sit on a real binding. */
  .sp-bands {
    position: absolute;
    inset: 14% 0 18% 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      180deg,
      transparent 0,
      transparent calc(100% / var(--bands) - 3px),
      #00000038 calc(100% / var(--bands) - 3px),
      #ffffff22 calc(100% / var(--bands) - 1.5px),
      transparent calc(100% / var(--bands))
    );
  }

  .sp-cap {
    width: 70%;
    height: 3px;
    border-radius: 2px;
    background: var(--wing-accent);
    opacity: 0.75;
    flex: 0 0 auto;
  }

  /* The lettering: vertical like a real spine, wrapping to a second (or
     third) line when the title is long — widening the book, never clipping. */
  .sp-title {
    flex: 1 1 auto;
    min-height: 0;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    white-space: normal;
    font-family: var(--serif);
    font-size: clamp(0.58rem, 1.35vh, 0.74rem);
    line-height: 1.25;
    letter-spacing: 0.02em;
    color: var(--text);
    margin: 7px 0 6px;
    text-align: center;
    z-index: 1;
  }

  .sp-emblem {
    width: 15px;
    height: 15px;
    opacity: 0.9;
    flex: 0 0 auto;
  }
  .sp-emblem svg { width: 100%; height: 100%; display: block; }

  /* Ghost bindings — volumes still being written stand faint on the shelf,
     lettered but unfilled, with no bands (no chapters yet) and no emblem. */
  .spine.empty {
    background:
      linear-gradient(180deg, #ffffff08 0%, transparent 22%),
      color-mix(in oklab, var(--spine) 40%, #14101f);
    border-style: dashed;
    border-color: #ffffff1c;
    box-shadow: none;
  }
  .spine.empty .sp-title { color: var(--text-2); font-style: italic; }
  .spine.empty .sp-cap { opacity: 0.3; }
  .spine.empty .sp-emblem { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .spine { transition: none; }
  }
</style>
