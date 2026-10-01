# Voice-to-Estimate × AccuLynx: before/after explainer

A 50-second split-screen video for roofing owners who already use AccuLynx: the old way (typing the estimate into AccuLynx) against Voice-to-Estimate, with two stopwatches. Built in [Remotion](https://www.remotion.dev) from the spec, using the supplied AccuLynx screen recording.

| Output | Size | Use |
|---|---|---|
| `out/v2e-acculynx-vertical.mp4` | 1080×1920, 30fps | Reels, DMs |
| `out/v2e-acculynx-square.mp4` | 1080×1080, 30fps | Group feed posts |

The current renders have **sound effects but no voiceover or music**. Captions use estimated timings. See [VOICEOVER.md](./VOICEOVER.md).

## Before sending (spec §9)

- [ ] **The AccuLynx payoff scene uses a generic "Job · Documents" card**, because no real screenshot of the estimate inside an AccuLynx job was supplied. Capture `04-job-documents.png` and `05-job-with-estimate.png` from a job where the integration actually ran, put them in `public/acculynx/`, and set their paths in `src/config.ts` → `ASSETS`. Only do this if the integration really does that today.
- [ ] **`BEFORE_TIME` / `AFTER_TIME`** in `src/config.ts` are empty, so the screen shows "Old way: still going…" and "Done." Fill them with real measured times if you have them. The stopwatch digits are illustrative.
- [ ] **Voice-to-Estimate app screens are recreated UI.** Real recordings (`v2e-record.mp4`, `v2e-estimate.mp4`) would build more trust.
- [ ] Watch it muted on a phone.

## What's real and what's blurred

Everything AccuLynx on screen comes from the supplied recording (`public/acculynx/accu-recording.mp4`) or stills taken from it: the dashboard, the Track menu with Measurement Providers, the job page, Estimates → New Estimate, and the empty "New Section" builder. Nothing AccuLynx-looking was recreated.

Privacy blurs (`src/components/AccuScreen.tsx`) cover the company name, user name, pipeline dollar totals, the activity feed (homeowner names), and on the job page the contact name, assignee, phone number and address. The estimate in the new-way scene is a sample job with sample prices, and the roof is an illustration.

The end card says "Not affiliated with or endorsed by AccuLynx."

## Scenes

| Time | Scene | What happens |
|---|---|---|
| 0:00 | Hook | Hard cut on the empty AccuLynx builder, cursor blinking, fast push-in. "You're still TYPING estimates into AccuLynx?" with a thud |
| 0:03 | Setup | Screen splits: OLD WAY (grey) vs NEW WAY. Both stopwatches start |
| 0:07 | Old way | Notes → drive back (clock jumps) → measurement report menu → wait (clock jumps) → New Estimate in the builder at 2x, with keyboard clatter |
| 0:16.5 | Interrupt | Old side freezes and drains, flash to black, "Now watch this." with a bass drop |
| 0:18.5 | New way | Right side takes 70%: walk & talk transcript → roof measurements → estimate builds with your prices, pops and a cha-ching |
| 0:27.5 | Payoff | The estimate flies into the job's documents, lock-in click, new-way watch stops on "Done." while the old one keeps ticking |
| 0:33.5 | The shift | Old way shrinks and goes dark; three lines slam in with bass hits |
| 0:44 | CTA | "Onboarding 5 roofing companies this month", 5 spot slots, "Comment ESTIMATE or DM me", Pixel Island logo, disclaimer. Last frames fade back into the opening shot so the Reel loops |

## Working on it

```bash
npm install
npm run studio            # live preview
npm run render:vertical   # → out/v2e-acculynx-vertical.mp4
npm run render:square     # → out/v2e-acculynx-square.mp4
node scripts/make-sfx.mjs # regenerate the synthesized sound effects
```

In a sandbox without Remotion's own Chrome: `REMOTION_BROWSER=/path/to/headless_shell npm run render:vertical`.
Quick stills: `node scripts/stills.mjs Vertical 40 320 820` (frames at 30fps).

The sound effects in `public/audio/sfx/` are simple synthesized placeholders. Swap in library sounds with the same file names for a more polished mix, or render with `--props='{"sfx":false}'` to turn them off.

## Structure

```
src/
  Root.tsx            Vertical (1080×1920) + Square (1080×1080)
  Video.tsx           <Series> of scenes, captions, voiceover/music, every sound-effect cue
  timeline.ts         scene lengths
  captions.ts         voiceover lines, estimated word timings, keyword marks
  clock.ts            the two stopwatches (continuous across scenes)
  config.ts           BEFORE_TIME / AFTER_TIME and optional real assets
  theme.ts            spec §7 style tokens
  scenes/             Hook, Setup, OldWay, Interrupt, NewWay, Payoff, Shift, CTA
  components/
    AccuScreen.tsx    recording clip or still + privacy blurs
    BlurRegion.tsx
    SplitScreen.tsx   animated left/right panels, grain on the old side
    Stopwatch.tsx
    KineticCaption.tsx
    ScreenFrame.tsx   rounded frame with Ken Burns push-in
    FlyIntoDocs.tsx
    SpeedBadge.tsx
    BuilderLoop.tsx   the empty-builder shot that opens and closes the video
    RoofOutline.tsx, EstimateLine.tsx, AppIcon.tsx, CountUp.tsx
public/
  acculynx/           supplied recording + stills taken from it
  audio/sfx/          tick, keys, whoosh, pop, thud, bass, drop, chaching, lockin
```
