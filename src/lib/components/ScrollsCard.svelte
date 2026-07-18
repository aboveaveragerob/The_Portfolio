<!-- The Scrolls — credentials on a single fixed parchment with three tabbed
     panels (Degrees / Licenses / Certificates). Proper tablist semantics with
     arrow-key roving focus; without JS the three sections render stacked and
     the tab rail hides. Flower of Life watermark at whisper opacity. -->
<script>
  import { scrolls, TABS } from '$lib/content/scrolls.js';
  import FlowerOfLife from './geometry/FlowerOfLife.svelte';

  let active = 'degrees';
  let tabEls = {};

  function onTabKeydown(e) {
    const idx = TABS.findIndex((t) => t.id === active);
    let next = null;
    if (e.key === 'ArrowRight') next = TABS[(idx + 1) % TABS.length];
    if (e.key === 'ArrowLeft') next = TABS[(idx - 1 + TABS.length) % TABS.length];
    if (e.key === 'Home') next = TABS[0];
    if (e.key === 'End') next = TABS[TABS.length - 1];
    if (next) {
      e.preventDefault();
      active = next.id;
      tabEls[next.id]?.focus();
    }
  }
</script>

<div class="scrolls-card" data-testid="scrolls-card">
  <span class="watermark" aria-hidden="true">
    <FlowerOfLife rings={3} size={340} stroke="var(--ink)" opacity={0.05} />
  </span>

  <div class="tabs" role="tablist" aria-label="Credential types">
    {#each TABS as t}
      <button
        role="tab"
        id="tab-{t.id}"
        aria-selected={active === t.id}
        aria-controls="panel-{t.id}"
        tabindex={active === t.id ? 0 : -1}
        data-testid="tab-{t.id}"
        bind:this={tabEls[t.id]}
        on:click={() => (active = t.id)}
        on:keydown={onTabKeydown}
      >
        {t.label}
      </button>
    {/each}
  </div>

  <div class="panels">
    <div
      class="panel"
      class:shown={active === 'degrees'}
      role="tabpanel"
      id="panel-degrees"
      aria-labelledby="tab-degrees"
    >
      <h2 class="no-js-h">Degrees</h2>
      {#each scrolls.degrees as d}
        <article class="entry">
          <h3>{d.credential}</h3>
          <p class="distinction">{d.distinction}</p>
          <p class="meta">{d.institution} · {d.place} · {d.date}</p>
          <p class="note">{d.note}</p>
        </article>
      {/each}
    </div>

    <div
      class="panel"
      class:shown={active === 'licenses'}
      role="tabpanel"
      id="panel-licenses"
      aria-labelledby="tab-licenses"
    >
      <h2 class="no-js-h">Licenses</h2>
      {#each scrolls.licenses as l}
        <article class="entry">
          <h3>{l.credential}</h3>
          <p class="meta">{l.detail}</p>
          <p class="note">{l.note}</p>
        </article>
      {/each}
    </div>

    <div
      class="panel"
      class:shown={active === 'certificates'}
      role="tabpanel"
      id="panel-certificates"
      aria-labelledby="tab-certificates"
    >
      <h2 class="no-js-h">Certificates</h2>
      {#each scrolls.certificates as c}
        <article class="entry">
          <h3>{c.credential}</h3>
          <p class="meta">{c.issuer}</p>
          <p class="note">{c.note}</p>
        </article>
      {/each}
    </div>
  </div>
</div>

<style>
  .scrolls-card {
    position: absolute;
    top: 50%;
    right: clamp(12px, 5vw, 72px);
    transform: translateY(-50%);
    width: min(44vw, 560px);
    max-height: min(76vh, 620px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background:
      linear-gradient(160deg, #ffffff10 0%, transparent 40%),
      var(--paper);
    border: 1px solid var(--paper-edge);
    border-radius: 12px;
    box-shadow: 0 20px 54px #00000070;
    color: var(--ink);
    z-index: 1;
  }

  .watermark {
    position: absolute;
    right: -60px;
    bottom: -70px;
    pointer-events: none;
  }

  .tabs {
    display: flex;
    gap: 4px;
    padding: 12px 16px 0;
    border-bottom: 1px solid var(--paper-line);
  }

  [role='tab'] {
    min-height: 44px;
    padding: 8px 16px;
    border-radius: 8px 8px 0 0;
    font-family: var(--serif);
    font-size: 0.92rem;
    color: var(--ink-2);
    border: 1px solid transparent;
    border-bottom: none;
    position: relative;
  }
  [role='tab']:hover { color: var(--ink); }
  [role='tab'][aria-selected='true'] {
    color: var(--ink);
    background: #ffffff55;
    border-color: var(--paper-line);
  }
  [role='tab'][aria-selected='true']::after {
    content: '';
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 6px;
    height: 2px;
    background: var(--ink-eyebrow);
  }

  .panels {
    position: relative;
    overflow-y: auto;
    min-height: 0;
    padding: 18px 22px 22px;
  }

  .panel { display: none; }
  .panel.shown { display: block; }

  .no-js-h {
    display: none;
    font-family: var(--serif);
    font-size: 1rem;
    color: var(--ink-eyebrow);
    margin: 14px 0 6px;
  }

  .entry { max-width: 65ch; }
  .entry + .entry { margin-top: 16px; }

  h3 {
    font-family: var(--serif);
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--ink);
  }

  .distinction {
    font-family: var(--serif);
    font-style: italic;
    color: var(--ink-eyebrow);
  }

  .meta {
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    color: var(--ink-3);
    margin: 3px 0 6px;
  }

  .note {
    font-size: 0.88rem;
    line-height: 1.45;
    color: var(--ink-2);
  }

  /* Without JS: no tab rail, all three sections stacked with headings. */
  :global(html.no-js) .tabs { display: none; }
  :global(html.no-js) .panel { display: block; }
  :global(html.no-js) .no-js-h { display: block; }

  @media (max-width: 899px), (max-height: 559px) {
    .scrolls-card {
      top: var(--chip-h);
      right: 8px;
      left: 8px;
      bottom: calc(var(--bar-h) + 30px);
      transform: none;
      width: auto;
      max-height: none;
    }
  }
</style>
