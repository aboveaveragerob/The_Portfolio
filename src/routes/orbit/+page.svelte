<!-- /orbit with no role selected — the orrery (rendered by the layout) is
     the whole scene; a quiet hint invites the first click. -->
<svelte:head>
  <title>Career Orbit — Robert Gregory</title>
  <meta name="description" content="Four roles across financial operations and retail leadership, charted as planets on Fibonacci-spaced orbital rings." />
</svelte:head>

<p class="hint">Choose a planet to open its record.</p>

<style>
  .hint {
    position: absolute;
    left: clamp(14px, 3vw, 32px);
    bottom: clamp(70px, 12vh, 110px);
    font-family: var(--serif);
    font-style: italic;
    font-size: 0.9rem;
    color: var(--text-2);
    z-index: 1;
  }

  @media (max-width: 899px), (max-height: 559px) {
    .hint { display: none; } /* the role list replaces the hint */
  }
</style>
