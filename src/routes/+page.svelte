<!-- Home — the archive entry / master star chart. Deliberately light: the
     center sun (name, role) and the Celestial Compass carry this view, with
     Career Orbit emphasized as the single primary CTA. -->
<svelte:head>
  <title>Robert Gregory — The Cosmological Library</title>
  <meta
    name="description"
    content="Robert Gregory — financial operations and trading, charted as an orrery: a career orbit, skill constellations, credential scrolls, and an archive of craft."
  />
</svelte:head>

<div class="home" data-testid="view-home">
  <p class="sr-only">
    An archive of Robert Gregory’s career and craft, in four views:
    <a href="/orbit">Career Orbit</a> — employment history;
    <a href="/constellations">Constellations</a> — skills;
    <a href="/scrolls">Scrolls</a> — education and licensing;
    <a href="/archive">Archive</a> — projects and field guides.
  </p>
</div>

<style>
  .home {
    position: absolute;
    inset: 0;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
</style>
