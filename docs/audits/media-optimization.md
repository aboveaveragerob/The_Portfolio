# Audit — Media Optimization

**Date:** 2026-07-17
**Scope:** Static image and audio assets under `static/` and their delivery weight.
**Status:** Findings only. This PR changes no assets and no code — it documents the payload
and the recommended optimization so a future PR (or the owner's tooling) can act.

---

## Finding

`static/` totals **~25 MB**, dominated by a handful of unoptimized originals. These are shipped
as-is by `adapter-static`, so they are downloaded by real visitors and directly drive the
handoff's Core Web Vitals concern (`DESIGN_QA_HANDOFF.md` §F: CLS / LCP / "runs smoothly").

### Measured sizes (current `static/`)

| File | Size | Used on |
|---|---:|---|
| `static/audio/ps-im-home.mp3` | 4.89 MB (5,129,792 B) | Music book — audio teaser |
| `static/audio/with-love-math.mp3` | 4.06 MB (4,259,820 B) | Music book — audio teaser |
| `static/images/music/album-art.jpg` | 3.49 MB (3,656,756 B) | Music book — album cover |
| `static/images/eddiebauer/lifestyle-wall.jpeg` | 2.54 MB (2,666,712 B) | Eddie Bauer — visual merch |
| `static/images/eddiebauer/live-for-summer-window.jpeg` | 2.06 MB (2,155,503 B) | Eddie Bauer |
| `static/images/eddiebauer/guide-pro-window.jpeg` | 1.96 MB (2,054,938 B) | Eddie Bauer |
| `static/images/woodworking/powder-room-drywall.jpeg` | 1.87 MB (1,963,558 B) | Woodworking book |
| `static/images/eddiebauer/limited-edition-table.jpeg` | 1.77 MB (1,854,943 B) | Eddie Bauer |
| `static/images/eddiebauer/chase-the-horizon-window.jpeg` | 1.46 MB (1,528,358 B) | Eddie Bauer |
| **Images subtotal** | **~15.9 MB** | 7 files |
| **Audio subtotal** | **~9.0 MB** | 2 files |

A single 3.5 MB album cover and 1.5–2.6 MB merch photos are far larger than needed for their
on-screen size (a book page / thumbnail grid, `OpenBook.svelte` `.shots`). The two ~4–5 MB MP3s
are full-quality "teasers."

### Mitigating context

- The reader is lazy: `OpenBook.svelte` renders content images with `loading="lazy"`, so these
  only download when a visitor opens the specific book/page — the landing view is not blocked by
  them. Good.
- Audio uses `<audio controls>` and streams on demand, not on page load.
- So this is **payload/bandwidth and per-page LCP**, not a homepage-blocking regression.

---

## Recommendation (for a later PR — not done here)

1. **Recompress images** to web-appropriate quality/dimensions:
   - Cap the longest edge to the largest size actually rendered (the grid never needs full
     originals); re-encode JPEG at ~q80. Expect 5–10× reduction (multi-MB → 150–400 KB each).
   - Consider **AVIF/WebP with a JPEG fallback** via `<picture>`, and `srcset`/`sizes` for the
     merch grid so phones fetch smaller variants.
2. **Re-encode the audio teasers** — a lower CBR/VBR bitrate (e.g. 128 kbps) and/or trimming to a
   short excerpt would cut each MP3 substantially; if full tracks are intentional, that's a
   product call to record here.
3. Keep `loading="lazy"` (already present) and add explicit `width`/`height` (or `aspect-ratio`)
   on `<img>` to prevent layout shift as images load — directly addresses the §F CLS note.
4. Optionally move large originals out of the git repo (they inflate every clone); the deploy only
   needs the optimized variants.

### Not doing here

No assets are re-encoded or replaced in this PR — image optimization is a lossy, subjective
change (the owner may have quality requirements for the portfolio pieces), so it is documented
for an explicit follow-up rather than applied blindly.

---

## Evidence

All sizes measured directly from the working tree (`ls -la` / `du -sh static`) at time of writing;
usage confirmed in `src/lib/data.js` (Eddie Bauer merch page, Music discography page, Woodworking
drywall page) and `src/lib/components/OpenBook.svelte` (`.shots` grid + `<audio>` rendering,
`loading="lazy"`).
