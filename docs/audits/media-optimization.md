# Audit: Static media optimization (findings)

_Findings-only audit (issue #48). Records the static-media payload and the
recommended optimization. No assets or code are changed here — image
re-encoding is lossy and subjective for portfolio pieces, so it is left for an
explicit follow-up._

## Finding

`static/` totals **~25 MB**, dominated by unoptimized originals (measured
directly with `du` / `find`):

| File | Size |
| --- | --- |
| `static/audio/ps-im-home.mp3` | 4.89 MB |
| `static/audio/with-love-math.mp3` | 4.06 MB |
| `static/images/music/album-art.jpg` | 3.49 MB |
| `static/images/eddiebauer/lifestyle-wall.jpeg` | 2.54 MB |
| `static/images/eddiebauer/live-for-summer-window.jpeg` | 2.06 MB |
| `static/images/eddiebauer/guide-pro-window.jpeg` | 1.96 MB |
| `static/images/woodworking/powder-room-drywall.jpeg` | 1.87 MB |
| `static/images/eddiebauer/limited-edition-table.jpeg` | 1.77 MB |
| `static/images/eddiebauer/chase-the-horizon-window.jpeg` | 1.46 MB |

Images subtotal ~15.9 MB, audio ~9.0 MB. These ship as-is via
`adapter-static`.

**Mitigating context:** `OpenBook.svelte` renders every page image with
`loading="lazy"` and audio streams on demand, so the landing view isn't
blocked — this is per-page payload / LCP, not a homepage regression. The
redesigned bookcase landing loads no page media at all until a volume is
opened.

## Recommendation (for a later PR — not done here)

- Recompress / resize images: cap the longest edge to the rendered size at
  ~q80; consider AVIF/WebP with `<picture>` and `srcset`/`sizes` for the Eddie
  Bauer merch grid.
- Re-encode / trim the audio teasers (they are full-length; a 30–45s teaser at
  a lower bitrate would cut the two files by an order of magnitude).
- Add explicit `width`/`height` (or `aspect-ratio`) on `<img>` in
  `OpenBook.svelte` to prevent layout shift (CLS).

Left for an explicit follow-up because re-encoding is lossy and the acceptable
quality bar for portfolio imagery is the owner's call.
