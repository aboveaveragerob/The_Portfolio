<!-- Podium — the slim reading stand the staged book rests on.
     Reworked from the old wide engraved slab (which read as a stray banner
     beneath the book — issue #58) into a compact cosmic pedestal that sits
     directly under the volume. It recedes to a thin base while a book is open
     so nothing banner-like shows under the reading spread. All surfaces come
     from the shared cosmic tokens so shelves, spines, book, and stand read as
     one system. -->
<script>
  export let open = false;   // recede to a thin base while a book is open
</script>

<div class="podium-wrap" class:open aria-hidden="true">
  <!-- Top ledge the book sits on -->
  <div class="podium-ledge"></div>
  <!-- Tapered pedestal body -->
  <div class="podium-body"></div>
  <!-- Contact shadow beneath -->
  <div class="podium-shadow"></div>
</div>

<style>
  .podium-wrap {
    width: clamp(200px, 46vw, 340px);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    user-select: none;
    pointer-events: none;
    transition: opacity .4s ease, width .4s cubic-bezier(.2,.02,.12,1);
  }

  .podium-ledge {
    height: clamp(7px, 1.3vh, 11px);
    border-radius: 5px 5px 0 0;
    background: linear-gradient(to bottom, var(--ledge-hi), var(--ledge-lo));
    box-shadow:
      0 -1px 0 #b25cff55,
      inset 0 1px 0 #ffffff3a,
      0 10px 20px -8px #000;
  }

  /* Tapered pedestal — narrower at the base so it reads as a stand, not a bar */
  .podium-body {
    height: clamp(26px, 4.6vh, 44px);
    margin: 0 auto;
    width: 86%;
    background: linear-gradient(to bottom, var(--surface-1) 0%, var(--surface-2) 100%);
    clip-path: polygon(0 0, 100% 0, 92% 100%, 8% 100%);
    border-left: 1px solid #ffffff10;
    border-right: 1px solid #ffffff10;
    box-shadow: inset 0 1px 0 #ffffff12;
  }

  .podium-shadow {
    height: clamp(7px, 1.4vh, 12px);
    margin: 0 auto;
    width: 70%;
    background: radial-gradient(60% 100% at 50% 0%, #000000aa, transparent 72%);
  }

  /* While a book is open, collapse to a thin base so no slab shows under it */
  .podium-wrap.open {
    width: clamp(150px, 30vw, 240px);
    opacity: .5;
  }
  .podium-wrap.open .podium-body { height: clamp(10px, 1.8vh, 16px); }

  @media (max-width: 640px) {
    .podium-body { height: clamp(20px, 3.6vh, 34px); }
  }
</style>
