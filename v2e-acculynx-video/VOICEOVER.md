# Voiceover script: Voice-to-Estimate × AccuLynx

**Length:** 0:50 · **Voice:** American, bold, zero hesitation, like someone who knows this is the future and is doing you a favor by showing you. Read the old-way section faster and flatter. Energy lifts at "Now watch this" and stays high to the end.

## ElevenLabs settings

| Setting | Value |
|---|---|
| Model | **Eleven Multilingual v2** (supports `<break>` tags) |
| Voice | **Brian** (deep, confident American). Alternative: **Adam** |
| Speed | 1.05 |
| Stability | 45% (a little more energy) |
| Similarity | 75% |
| Style exaggeration | 10% |
| Speaker boost | On |

Export with **word-level timestamps** so the captions can sync exactly (see below).

## Paste this into ElevenLabs as one generation

```
You're still typing estimates into AccuLynx? <break time="0.65s" />
Same roof. Same AccuLynx. Two ways to estimate it. <break time="0.75s" />
Old way: notes on the roof, drive back, order the report, wait, then type every line item. Tear-off. Underlayment. Ridge. Drip edge. Flashing… <break time="1.05s" />
Now watch this. <break time="0.65s" />
New way: walk the roof and talk. Measurements come in automatically. The estimate builds itself, using your prices. <break time="2.25s" />
And it lands right inside the job in AccuLynx. Nothing to retype. <break time="1.85s" />
The roofer who gets the estimate to the homeowner first gets the first shot at the job. This industry is moving fast. Don't be the last one still typing. <break time="0.6s" />
I'm setting this up for five roofing companies this month. Comment "estimate" and grab a spot.
```

## Target timecodes (where each line must start)

| Start | Scene | Line |
|---|---|---|
| 0:00.2 | Hook | You're still typing… |
| 0:03.2 | Split setup | Same roof… |
| 0:07.2 | Old way | Old way: notes on the roof… |
| 0:17.0 | Pattern interrupt | Now watch this. |
| 0:18.7 | New way | New way: walk the roof… |
| 0:27.7 | AccuLynx payoff | And it lands right inside… |
| 0:33.7 | The shift | The roofer who gets… (slams at 0:33.7, 0:39.1, 0:41.1) |
| 0:44.2 | CTA | I'm setting this up… (video ends 0:50.5) |

## Adding it to the video

1. Save files as `public/audio/voiceover.mp3` and `public/audio/music.mp3` (minimal lo-fi/trap).
2. Check the line starts against the table. If a line is off, change that scene's length in `src/timeline.ts` and its `at`/`dur` in `src/captions.ts` (and the slam frames in `src/scenes/Shift.tsx` if the shift moves).
3. For exact captions, convert the word timestamps to `[{"text": "You're", "start": 0.18, "end": 0.4}, ...]` in seconds and add `"key": true` to the words to highlight (TYPING, AccuLynx, your prices, Nothing to retype…). Save as `captions.json` in the project root. The hook and "Now watch this" lines are already big on-screen text, so leave those words out.
4. Render:

```bash
P='{"voiceover":"audio/voiceover.mp3","music":"audio/music.mp3","musicVolume":0.08,"sfx":true,"captions":'"$(cat captions.json)"'}'
npx remotion render Vertical out/v2e-acculynx-vertical.mp4 --props="$P"
npx remotion render Square out/v2e-acculynx-square.mp4 --props="$P"
```

`musicVolume` 0.08 is about -22 dB under the voiceover. The music drops out for half a second at "Now watch this" automatically.
