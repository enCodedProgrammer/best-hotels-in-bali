# Voice-to-Estimate: explainer video

A 1:12 motion-graphics explainer for owners of small US roofing companies, sent as a Facebook DM or posted in roofing groups. It's built in [Remotion](https://www.remotion.dev) (React → MP4), so every frame is code and can be edited and re-rendered.

| Output | Size | Use |
|---|---|---|
| `out/v2e-vertical.mp4` | 1080×1920, 30fps | DMs, Reels, phone viewing |
| `out/v2e-square.mp4` | 1080×1080, 30fps | Group feed posts |

The current renders are **silent**, with burned-in captions at estimated timings. Add the voiceover and music as described in [VOICEOVER.md](./VOICEOVER.md).

## Scenes

| Time | Scene | On-screen text | What it shows |
|---|---|---|---|
| 0:00 | Hook | Still writing estimates at 11 PM? | Clock ticks to 10:47 PM while line items get typed into a spreadsheet |
| 0:05.5 | The pain | Measure → calculate → type every line item | Measurement PDF → calculator → endless spreadsheet, then "Hours per job" |
| 0:13 | The solution | Just talk. Get the estimate. | Phone slides in, tap the app on the home screen, it opens |
| 0:19 | Step 1 | Walk the roof and talk | Record screen with live transcript; tear-off, shingles, pipe boots, ridge vent and rot get picked up |
| 0:30 | Step 2 | Measurements pulled automatically | Illustrated roof draws itself; squares, pitch, ridge, hip, valley, eave, rake |
| 0:39.5 | Step 3 | Costed estimate using YOUR prices | Estimate builds line by line, step flashing in bundles, total counts up |
| 0:50.5 | Proof | Tested on a real $21,500 job | Manual vs Voice-to-Estimate: ridge + hip 159.1 vs 158.7 LF ✓, step flashing 2 vs 2 bundles ✓ |
| 1:02.5 | Call to action | Try it on your next 5 jobs. Reply to this message. | Finished estimate on the phone, orange reply button, Pixel Island logo |

## Privacy and accuracy

- No homeowner name, address or job name. The job is "Sample job" and the aerial view says "Sample address".
- The roof is a generic illustration, not a satellite image.
- No client name or logo. The proof scene says only "California roofer".
- The proof scene shows only the two numbers that matched, and says "Key numbers lined up", not "matched to the dollar".
- Estimate prices are sample prices and are labelled that way. Ridge cap and drip edge quantities follow the sample roof's measurements.

## Working on it

```bash
npm install
npm run studio            # live preview + timeline scrubbing
npm run render:vertical   # → out/v2e-vertical.mp4
npm run render:square     # → out/v2e-square.mp4
```

In a sandbox without Remotion's own Chrome, point it at an existing headless Chromium:
`REMOTION_BROWSER=/path/to/headless_shell npm run render:vertical`.

Quick stills for review: `node scripts/stills.mjs Vertical 120 830 1470` (frame numbers at 30fps).

## Using real app footage

Real screen recordings build more trust than the recreated UI. Drop them in `public/` and replace the screen contents inside `<PhoneMockup>` in `src/scenes/Solution.tsx`, `StepTalk.tsx` and `CTA.tsx` with `<OffthreadVideo src={staticFile('...')} />`.

## Structure

```
src/
  Root.tsx              registers Vertical (1080×1920) and Square (1080×1080)
  Video.tsx             <Series> of scenes + captions + optional audio
  timeline.ts           scene order and lengths
  captions.ts           voiceover lines, estimated word timings, caption chunking
  theme.ts              palette and font (spec section 3)
  anim.ts               springs, easing, and the per-aspect layout
  scenes/               Hook, Pain, Solution, StepTalk, StepMeasure, StepEstimate, Proof, CTA
  components/
    PhoneMockup.tsx
    Caption.tsx         burned-in captions, 3–5 words, current word in orange
    CountUp.tsx         animated numbers
    RoofOutline.tsx     SVG roof that draws itself
    EstimateLine.tsx
    AppIcon.tsx
    ui.tsx              Scene, Headline, Stage, Appear, Check, Tap
public/
  fonts/Inter-Variable.woff2
  pixel-island-logo.png
```

Each scene draws on a fixed 960×900 canvas that `<Stage>` scales into the space between the headline and the captions. In the vertical version, text stays out of the top 220px and bottom 380px so the Facebook and Reels UI doesn't cover it.
