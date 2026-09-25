# Voiceover script: Best Bali Realty explainer

**Length:** 1:48 · **Voice:** warm, mature, unhurried. Lawrence is the only listener, so speak to him directly.

## ElevenLabs settings

| Setting | Value |
|---|---|
| Model | **Eleven Multilingual v2** (supports `<break>` tags; v3 does not) |
| Voice | **George**: warm, mature British storyteller. Alternative: **Brian**, a deep, calm American voice |
| Speed | 0.95 |
| Stability | 55% |
| Similarity | 75% |
| Style exaggeration | 0% |
| Speaker boost | On |

## Paste this into ElevenLabs as one generation

Each `<break>` fills the rest of that scene's time slot, so every line starts on its scene's timecode. ElevenLabs caps each break at 3 seconds.

```
Lawrence, what if Best Bali Realty could run itself... while you stay in charge? <break time="0.6s" />
Right now, everything is done by hand. Finding listings. Uploading photos. Writing posts. And ten to fifteen emails for every buyer. <break time="0.8s" />
So we've built you a team of five digital assistants. Each one does one job, and they never stop working. <break time="0.7s" />
Every day, Scout finds new villas in your areas. <break time="1.4s" />
Pin finds the real address, so you can go straight to the owner. <break time="1.5s" />
It lands on your dashboard, and you click Approve. <break time="2.2s" />
Then Quill puts it live on your website. No typing. No uploading. <break time="0.6s" />
Echo runs your social media. It writes in your brand's voice, and plans your whole week. <break time="1.1s" />
You take a quick look... and it posts for you. <break time="2.6s" />
Concierge answers every email and website chat, day or night. It checks budget and timing, and filters out the time-wasters. <break time="0.9s" />
When a serious buyer comes in, you get a WhatsApp message with their name, what they want, and their budget. <break time="1.4s" />
And one simple dashboard shows you what's working, what to change, and your hottest leads. <break time="2.6s" />
Your part? Approve listings, and review posts. That's it. We handle everything else. <break time="1.8s" />
Pixel Island, for Best Bali Realty. Let's get started.
```

## Target timecodes (where each line must start)

| Start | Scene | Line |
|---|---|---|
| 0:00 | Hook | Lawrence, what if… |
| 0:07 | Today | Right now, everything is done by hand… |
| 0:17 | Meet your team | So we've built you a team… |
| 0:26 | Scout | Every day, Scout finds… |
| 0:31 | Pin | Pin finds the real address… |
| 0:38 | Dashboard approve | It lands on your dashboard… |
| 0:44 | Quill | Then Quill puts it live… |
| 0:50 | Echo | Echo runs your social media… |
| 0:58 | Review | You take a quick look… |
| 1:05 | Concierge | Concierge answers every email… |
| 1:14 | WhatsApp | When a serious buyer comes in… |
| 1:24 | Dashboard | And one simple dashboard… |
| 1:33 | Your part | Your part? Approve listings… |
| 1:41 | Close | Pixel Island, for Best Bali Realty… |

The break lengths assume about 150 words per minute. A voice that reads faster or slower drifts a little over the video. To get an exact match, use the finished MP3: the silence between lines makes it easy to cut the take into 14 clips and place each one on its start time above.

**Pronunciation:** *Sanur* = "sa-NOOR". It doesn't appear in the script, but if ElevenLabs is used for other copy, add it to a pronunciation dictionary.

## Adding the voiceover (and music) to the video

1. Put the file in `explainer-video/public/`, for example `public/voiceover.mp3`. Music goes in the same folder, for example `public/music.mp3`.
2. Render with the audio props:

```bash
npx remotion render Explainer-16x9 out/best-bali-explainer-16x9.mp4 \
  --props='{"voiceover":"voiceover.mp3","music":"music.mp3","musicVolume":0.15}'
npx remotion render Explainer-1x1 out/best-bali-explainer-1x1.mp4 \
  --props='{"voiceover":"voiceover.mp3","music":"music.mp3","musicVolume":0.15}'
```

Music fades in over the first half-second and out over the last 1.5 seconds. Keep `musicVolume` around 0.12–0.18 so the voice stays clear.
