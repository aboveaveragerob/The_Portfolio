<script>
  import { createEventDispatcher } from 'svelte';

  export let book;

  const dispatch = createEventDispatcher();

  function open() {
    dispatch('open');
  }
</script>

<div class="closed-book" style="--cover: {book.coverColor}">
  <div class="cover">
    <div class="cover-frame"></div>
    <div class="cover-inner">
      <div class="cv-top">Volume I</div>

      <div class="cv-mid">
        <div class="cv-name">{book.title}</div>
        <div class="cv-flourish" aria-hidden="true"></div>
        <div class="cv-sub">{book.subtitle}</div>
      </div>

      <div class="lock">
        <button
          class="keybtn"
          on:click={open}
          aria-label="Turn the key to open {book.title}"
          type="button"
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="cb-key-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"  stop-color="#F4EFE6"/>
                <stop offset="45%" stop-color="#D4AF37"/>
                <stop offset="100%" stop-color="#B89B5E"/>
              </linearGradient>
            </defs>
            <g fill="none" stroke="url(#cb-key-grad)" stroke-width="5"
               stroke-linecap="round" stroke-linejoin="round">
              <circle cx="50" cy="36" r="15"/>
              <path d="M57 23 A15 15 0 0 1 57 49 A11 11 0 0 0 57 23 Z" stroke-width="3"/>
              <path d="M50 51 L50 72 C50 81 56 83 62 79"/>
            </g>
            <circle cx="50" cy="36" r="2.8" fill="url(#cb-key-grad)"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .closed-book {
    position: relative;
    width: 100%;
    max-width: 360px;
    aspect-ratio: 3 / 4.2;
    margin: 0 auto;
  }

  .cover {
    position: absolute;
    inset: 0;
    border-radius: 4px 10px 10px 4px;
    background:
      radial-gradient(120% 80% at 50% 20%,
        color-mix(in srgb, var(--cover) 100%, white 8%) 0%,
        var(--cover) 55%,
        color-mix(in srgb, var(--cover) 70%, black 30%) 100%);
    box-shadow:
      /* spine crease on the left */
      inset 8px 0 18px rgba(0,0,0,0.55),
      inset -3px 0 8px rgba(0,0,0,0.35),
      /* subtle top-inner highlight */
      inset 0 1px 0 rgba(255,255,255,0.08),
      /* volume beneath */
      0 40px 80px -20px rgba(0,0,0,0.85),
      0 0 0 1px rgba(255,255,255,0.06);
    overflow: hidden;
  }

  .cover-frame {
    position: absolute;
    inset: 14px;
    border-radius: 3px;
    border: 1px solid rgba(212,175,55,0.28);
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.35);
    pointer-events: none;
  }

  .cover-frame::before {
    content: "";
    position: absolute;
    inset: 5px;
    border-radius: 2px;
    border: 1px solid rgba(212,175,55,0.12);
  }

  .cover-inner {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: clamp(32px, 8%, 52px) clamp(20px, 6%, 32px);
    text-align: center;
  }

  .cv-top {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.36em;
    text-transform: uppercase;
    color: var(--brass);
    opacity: 0.75;
    text-indent: 0.36em;
  }

  .cv-mid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-width: 90%;
  }

  .cv-name {
    font-size: clamp(1.4rem, 4.6vw, 1.9rem);
    font-weight: 700;
    letter-spacing: 0.02em;
    line-height: 1.15;
    color: var(--parchment);
  }

  .cv-flourish {
    width: 42px;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--gold) 50%,
      transparent 100%);
    opacity: 0.7;
  }

  .cv-sub {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--brass);
    opacity: 0.75;
  }

  .lock {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .keybtn {
    position: relative;
    width: clamp(72px, 22%, 96px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%,
      rgba(244,239,230,0.06) 0%,
      rgba(0,0,0,0.35) 65%,
      rgba(0,0,0,0.5) 100%);
    box-shadow:
      inset 0 0 22px rgba(0,0,0,0.55),
      0 0 0 1px rgba(212,175,55,0.28);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 500ms cubic-bezier(.3,.1,.2,1);
  }

  .keybtn::before {
    content: "";
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    background: conic-gradient(from 0deg,
      #D4AF37, #F4EFE6, #B89B5E, #D4AF37);
    opacity: 0.4;
    filter: blur(6px);
    z-index: -1;
    transition: opacity 300ms;
    animation: key-halo 14s linear infinite;
  }

  .keybtn:hover::before,
  .keybtn:focus-visible::before {
    opacity: 0.9;
  }

  .keybtn:hover {
    transform: rotate(-8deg);
  }

  .keybtn svg {
    width: 72%;
    height: 72%;
    display: block;
  }

  @keyframes key-halo {
    to { transform: rotate(1turn); }
  }

  @media (prefers-reduced-motion: reduce) {
    .keybtn::before { animation: none; }
    .keybtn:hover  { transform: none; }
  }

  @media (max-width: 600px) {
    .closed-book {
      max-width: 260px;
    }
    .cv-name { font-size: 1.35rem; }
    .cv-top, .cv-sub { font-size: 9px; letter-spacing: 0.3em; }
  }
</style>
