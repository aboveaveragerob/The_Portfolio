<!-- Role detail overlay — the Vesica Piscis panel that opens beside the
     orrery when a planet is chosen. Non-modal by design (the orrery stays
     interactive); Escape or the close link returns to /orbit. Prev/next
     links walk the timeline without leaving the panel. -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import VesicaPanel from './geometry/VesicaPanel.svelte';
  import { tenureMonths } from '$lib/content/roles.js';
  import { slugFor } from '$lib/content/archive.js';

  export let role;
  export let prev; // earlier role (or null at the oldest)
  export let next; // later role (or null at the most recent)

  let panelEl;

  $: months = tenureMonths(role);
  $: tenure =
    Math.floor(months / 12) > 0
      ? `${Math.floor(months / 12)} yr${Math.floor(months / 12) > 1 ? 's' : ''}${months % 12 ? ` ${months % 12} mo` : ''}`
      : `${months} mo`;

  function onKeydown(e) {
    if (e.key === 'Escape') goto('/orbit');
  }

  // Move keyboard/SR focus into the panel when a role opens; the planet keeps
  // aria-current so the way back is clear.
  onMount(() => {
    panelEl?.focus({ preventScroll: true });
  });
</script>

<svelte:window on:keydown={onKeydown} />

<section
  class="role-panel"
  data-testid="role-panel"
  bind:this={panelEl}
  tabindex="-1"
  aria-label="{role.org} — role detail"
>
  <VesicaPanel eyebrow="{role.dates} · {tenure}" title={role.org} accent={role.accent}>
    <svelte:fragment slot="actions">
      <a class="close" href="/orbit" data-testid="role-close" aria-label="Close role detail">✕</a>
    </svelte:fragment>

    <div class="rp-scroll">
      <p class="rp-role">{role.title}</p>
      {#each role.summary as block}
        <p class="rp-block">{block}</p>
      {/each}
      <p class="rp-volume">
        <a href="/archive/{slugFor[role.bookId]}">Read the full volume →</a>
      </p>
    </div>

    <nav class="rp-nav" aria-label="Adjacent roles">
      {#if prev}
        <a class="rp-step" href="/orbit/{prev.id}" data-testid="role-prev">
          <span class="rp-dir">‹ Earlier</span>
          <span class="rp-org">{prev.org}</span>
        </a>
      {:else}
        <span class="rp-step rp-end">Start of the record</span>
      {/if}
      {#if next}
        <a class="rp-step rp-right" href="/orbit/{next.id}" data-testid="role-next">
          <span class="rp-dir">Later ›</span>
          <span class="rp-org">{next.org}</span>
        </a>
      {:else}
        <span class="rp-step rp-right rp-end">Present day</span>
      {/if}
    </nav>
  </VesicaPanel>
</section>

<style>
  .role-panel {
    position: absolute;
    top: 50%;
    right: clamp(12px, 3vw, 40px);
    transform: translateY(-50%);
    width: min(38vw, 500px);
    max-height: min(78vh, 640px);
    display: flex;
    z-index: 2;
    outline: none;
  }
  .role-panel :global(.vesica-panel) {
    width: 100%;
    max-height: 100%;
  }

  .close {
    display: grid;
    place-items: center;
    min-width: 40px;
    min-height: 40px;
    border-radius: 10px;
    border: 1px solid var(--line-2);
    color: var(--text-2);
    text-decoration: none;
    font-size: 0.85rem;
  }
  .close:hover,
  .close:focus-visible {
    color: var(--gold);
    border-color: color-mix(in srgb, var(--gold) 55%, transparent);
  }

  .rp-scroll {
    flex: 1 1 auto;
    overflow-y: auto;
    min-height: 0;
    max-width: 65ch;
    padding-right: 4px;
  }

  .rp-nav {
    flex: 0 0 auto;
  }

  .rp-role {
    font-family: var(--mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--rose);
    margin-bottom: 10px;
  }

  .rp-block {
    font-size: 0.92rem;
    line-height: 1.45;
    color: var(--text);
    margin-bottom: 10px;
  }

  .rp-volume {
    margin-top: 14px;
  }
  .rp-volume a {
    color: var(--sapphire);
    text-decoration: underline;
    text-underline-offset: 2px;
    font-weight: 500;
    font-size: 0.9rem;
    padding: 6px 0;
  }
  .rp-volume a:hover,
  .rp-volume a:focus-visible { color: var(--gold); }

  .rp-nav {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid var(--line-2);
  }

  .rp-step {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-height: 44px;
    justify-content: center;
    padding: 4px 10px;
    border-radius: 10px;
    border: 1px solid var(--line-2);
    text-decoration: none;
    color: var(--text);
  }
  .rp-right { text-align: right; }
  a.rp-step:hover,
  a.rp-step:focus-visible {
    border-color: color-mix(in srgb, var(--gold) 55%, transparent);
    color: var(--gold);
  }
  .rp-end {
    border-color: transparent;
    color: var(--text-2);
    font-family: var(--serif);
    font-style: italic;
    font-size: 0.78rem;
  }

  .rp-dir {
    font-family: var(--mono);
    font-size: 0.6rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-2);
  }

  .rp-org {
    font-family: var(--serif);
    font-size: 0.85rem;
  }

  /* Narrow/short: bottom sheet above the role list would crowd — the sheet
     replaces the list area instead (the orrery stays as the index above). */
  @media (max-width: 899px), (max-height: 559px) {
    .role-panel {
      top: auto;
      right: 8px;
      left: 8px;
      bottom: calc(var(--bar-h) + 30px);
      transform: none;
      width: auto;
      max-height: min(52vh, 420px);
    }
  }
</style>
