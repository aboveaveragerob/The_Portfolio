<!-- Readable role index for narrow/short viewports, where the orrery's SVG
     labels would render below legible size. Same four links as the planets —
     a recruiter finds the employers in seconds either way. -->
<script>
  import { roles } from '$lib/content/roles.js';

  export let activeRole = null;
</script>

<ol class="role-list" data-testid="role-list">
  {#each roles as r}
    <li>
      <a
        href="/orbit/{r.id}"
        aria-current={activeRole === r.id ? 'page' : undefined}
        style="--accent:{r.accent}"
      >
        <span class="dot" aria-hidden="true"></span>
        <span class="org">{r.org}</span>
        <span class="dates">{r.dates}</span>
      </a>
    </li>
  {/each}
</ol>

<style>
  .role-list {
    display: none;
    list-style: none;
  }

  @media (max-width: 899px), (max-height: 559px) {
    .role-list {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: calc(var(--bar-h) + 34px);
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 1;
    }
  }

  a {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 4px 12px;
    border-radius: 10px;
    border: 1px solid var(--line-2);
    background: color-mix(in srgb, var(--bg-2) 72%, transparent);
    text-decoration: none;
    color: var(--text);
  }
  a[aria-current='page'] {
    border-color: color-mix(in srgb, var(--gold) 50%, transparent);
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    flex: 0 0 auto;
  }

  .org {
    font-family: var(--serif);
    font-size: 0.9rem;
    flex: 1 1 auto;
  }

  .dates {
    font-family: var(--mono);
    font-size: 0.62rem;
    letter-spacing: 0.05em;
    color: var(--text-2);
  }
</style>
