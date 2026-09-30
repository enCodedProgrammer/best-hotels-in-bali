# Voiceover script: Voice-to-Estimate explainer

**Length:** 1:12 · **Voice:** calm, confident, American English, mid-30s to 40s. Talk like a contractor, not an ad. Pick a grounded voice, not a hype voice.

## ElevenLabs settings

| Setting | Value |
|---|---|
| Model | **Eleven Multilingual v2** (supports `<break>` tags; v3 does not) |
| Voice | **Brian** (deep, calm American). Alternative: **Chris** (casual, down-to-earth) |
| Speed | 1.0 |
| Stability | 55% |
| Similarity | 75% |
| Style exaggeration | 0% |
| Speaker boost | On |

## Paste this into ElevenLabs as one generation

Each `<break>` fills the gap to the next scene, so every line should start close to its timecode below. ElevenLabs caps each break at 3 seconds, so the long pause after Step 1 is two breaks.

```
Still writing roof estimates at night after a full day on site? <break time="0.9s" />
Pull the measurements, work out the materials, type every single line item. That's hours per job. <break time="1.3s" />
Voice-to-Estimate turns your roof walkthrough into a costed estimate automatically. <break time="1.2s" />
Walk the roof and talk like you normally would: tear-off, shingle type, vents, problem areas. <break time="3s" /> <break time="2.2s" />
The system pulls an aerial roof measurement for the address, so squares, pitch, and linear feet come in automatically. <break time="2.2s" />
Then it builds the estimate using your own pricing, your own waste factor, even step flashing bundles, ready to review and send. <break time="2.5s" />
We tested it on a real twenty-one-thousand-five-hundred-dollar job for a California roofer. The key numbers lined up with his hand-built estimate. <break time="1.6s" />
Want to try it on your next five jobs? Reply to this message and I'll set it up for you.
```

## Target timecodes (where each line must start)

| Start | Scene | Line |
|---|---|---|
| 0:00.3 | Hook | Still writing roof estimates… |
| 0:05.8 | The pain | Pull the measurements… |
| 0:13.3 | The solution | Voice-to-Estimate turns… |
| 0:19.3 | Step 1: talk | Walk the roof and talk… |
| 0:30.3 | Step 2: auto-measure | The system pulls an aerial… |
| 0:39.8 | Step 3: the estimate | Then it builds the estimate… |
| 0:50.8 | Proof | We tested it on a real… |
| 1:02.8 | Call to action | Want to try it… (ends ~1:10, video ends 1:12) |

## Adding it to the video

1. Save the voiceover as `public/voiceover.mp3` and a music bed as `public/music.mp3`.
2. Check the line starts against the table. If a line lands late or early, change that scene's length in `src/timeline.ts` and its `at`/`dur` in `src/captions.ts`.
3. For exact captions, get word timestamps (ElevenLabs "timestamps" export, or `whisper voiceover.mp3 --word_timestamps True --output_format json`) and convert them to `[{"text": "Still", "start": 0.31, "end": 0.52}, ...]` in seconds. Save that as `captions.json` in the project root.
4. Render:

```bash
npx remotion render Vertical out/v2e-vertical.mp4 --props='{"voiceover":"voiceover.mp3","music":"music.mp3","musicVolume":0.1,"captions":'"$(cat captions.json)"'}'
npx remotion render Square out/v2e-square.mp4 --props='{"voiceover":"voiceover.mp3","music":"music.mp3","musicVolume":0.1,"captions":'"$(cat captions.json)"'}'
```

Leave out `"captions"` to keep the estimated timings. `musicVolume` 0.1 puts the music about 20 dB under the voiceover.

Caption text follows the word timestamps you pass in, so correct any spelling there (for example, write the price as `$21,500` rather than the spoken words).
