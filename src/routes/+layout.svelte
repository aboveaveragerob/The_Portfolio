<svelte:head>
  <meta name="theme-color" content="#0E0F19" />
</svelte:head>

<slot />

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(:root) {
    --void:      #0E0F19;
    --wood:      #2C1E16;
    --wood-lt:   #3A2820;
    --wood-dk:   #1A0E0A;
    --brass:     #B89B5E;
    --parchment: #F4EFE6;
    --gold:      #D4AF37;
    --ink:       #2A2928;
    --ink-lt:    #5A5450;
    --font:      'Montserrat Alternates', system-ui, sans-serif;
  }

  :global(html, body) {
    height: 100%;
    background: var(--void);
    color: var(--parchment);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  :global(button) {
    font-family: var(--font);
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
  }

  :global(button:focus-visible) {
    outline: 2px solid var(--gold);
    outline-offset: 2px;
  }
</style>
