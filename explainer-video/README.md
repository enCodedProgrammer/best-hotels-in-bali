# Best Bali Realty: client explainer video

A 1:48 motion-graphics explainer for Lawrence (bestbalirealty.com) to go with the Pixel Island proposal. It's built in [Remotion](https://www.remotion.dev) (React → MP4), so every frame is code and can be edited and re-rendered.

| Output | Size | Use |
|---|---|---|
| `out/best-bali-explainer-16x9-v2.mp4` | 1920×1080, 60fps | **Current.** Email, desktop, presentation |
| `out/best-bali-explainer-1x1-v2.mp4` | 1080×1080, 60fps | **Current.** WhatsApp, phone viewing |
| `out/best-bali-explainer-16x9.mp4`, `-1x1.mp4` | | v1, before his real website and logo were added |

v2 opens with Lawrence's own Best Bali Realty logo and, from 0:03 to 0:06, his real website: the homepage, then his For Sale listings page (`public/bbr-site-home.webp`, `public/bbr-site-listings.mp4`).

## Scenes

| Time | Scene | What it shows |
|---|---|---|
| 0:00 | Hook | His logo, then his real website at 0:03–0:06. "Lawrence, what if your business ran itself?" |
| 0:07 | Today | Manual listing search, photo uploads, posts, 10–15 emails per lead |
| 0:17 | Meet your team | The five assistants: Scout, Pin, Quill, Echo, Concierge |
| 0:26 | 01 · New listings | Scout finds villas on a Sanur map → Pin finds the real address → Lawrence clicks Approve → Quill publishes it to the website |
| 0:50 | 02 · Social media | Brand voice, auto-planned week, caption written for him → he reviews → it posts |
| 1:05 | 03 · Leads | Concierge answers email and website chat, qualifies budget and timing, and sends hot leads to WhatsApp |
| 1:24 | 04 · Dashboard | Performance, suggested change, hot leads |
| 1:33 | Your part | Two clicks: approve listings, review posts. Everything else is automated |
| 1:41 | Close | Pixel Island logo, "Let's get started." |

Pricing and who owns the system are deliberately left out, because that decision is still open.

## Working on it

```bash
npm install
npm run studio          # live preview + timeline scrubbing
npm run render:wide     # → out/best-bali-explainer-16x9-v2.mp4
npm run render:square   # → out/best-bali-explainer-1x1-v2.mp4
```

In a sandbox without Remotion's own Chrome, point it at an existing headless Chromium:
`REMOTION_BROWSER=/path/to/headless_shell npm run render:wide`.

Quick stills for review: `node scripts/stills.mjs Explainer-16x9 300 1810 2530` (frame numbers at 60fps).

## Voiceover and music

The script, timed to each scene, is in [VOICEOVER.md](./VOICEOVER.md). Drop the recorded file into `public/` and render with `--props` (instructions are in that file). Scene lengths live in `src/timeline.ts`. If you change them, re-time the script too.

## Structure

```
src/
  theme.ts          colours, fonts, bot roster (names, jobs, colours)
  timeline.ts       scene order and lengths
  Explainer.tsx     stitches the scenes + optional audio
  components/       Bot, SanurMap, VillaArt, Browser/Phone frames, text animation
  scenes/S1…S9      one file per scene (each adapts to 16:9 and 1:1)
public/
  pixel-island-logo.png
  fonts/            Instrument Serif + Inter, self-hosted
```

All names, prices, addresses and dashboard numbers are illustrative sample data. The dashboard is labelled "example data" on screen.
