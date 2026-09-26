# Voiceover script: Best Bali Realty explainer (v4)

**Length:** 2:03 · **Voice:** warm, mature, unhurried. Lawrence is the only listener, so speak to him directly.

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
Lawrence, what if Best Bali Realty could run itself... while you stay in charge? <break time="0.8s" />
Right now, everything is done by hand. Finding listings. Uploading photos. Writing posts. And ten to fifteen emails for every buyer. <break time="0.8s" />
So we've built you a team of five digital assistants. Each one does one job, around the clock. <break time="1.5s" />
Every day, Scout finds new villas in your areas. <break time="1.5s" />
Then Pin finds each villa's exact location. <break time="2.4s" />
Concierge writes to the agent on the listing, and asks for permission to list it. <break time="0.6s" />
If they say yes, your team clicks Permission Received. <break time="0.7s" />
If they say no, your team visits the owner directly, gets permission, and takes the photos. <break time="1.2s" />
Quill writes the listing and saves it as a draft. <break time="0.8s" />
You click Approve. It's live. <break time="0.7s" />
Echo runs your social media. It writes in your brand's voice, and plans your whole week. <break time="1.3s" />
You take a quick look... and it posts for you. <break time="2.5s" />
Concierge answers every email and website chat, day or night. It checks budget and timing, and filters out the time-wasters. <break time="0.8s" />
When a serious buyer comes in, you get a WhatsApp message with their name, what they want, and their budget. <break time="1.1s" />
And one simple dashboard shows you what's working, what to change, and your hottest leads. <break time="2.6s" />
Your team's part? A few clicks: permission received, approve, and a quick look at posts. We do the rest. <break time="1.0s" />
Pixel Island, for Best Bali Realty. Let's get started.
```

## Target timecodes (where each line must start)

| Start | Scene | Line |
|---|---|---|
| 0:00 | Hook (his website shows at 0:03–0:06) | Lawrence, what if… |
| 0:07 | Today | Right now, everything is done by hand… |
| 0:17 | Meet your team | So we've built you a team of five… |
| 0:26 | Scout | Every day, Scout finds… |
| 0:31 | Pin | Then Pin finds… |
| 0:37 | Concierge asks permission | Concierge writes to the agent… |
| 0:44 | Agent says yes | If they say yes… |
| 0:48.5 | Agent says no | If they say no… |
| 0:56 | Quill drafts | Quill writes the listing… |
| 1:01 | Approve | You click Approve. It's live. |
| 1:04 | Echo: social media | Echo runs your social media… |
| 1:12 | Review posts | You take a quick look… |
| 1:19 | Concierge: leads | Concierge answers every email… |
| 1:28 | WhatsApp | When a serious buyer comes in… |
| 1:38 | Dashboard | And one simple dashboard… |
| 1:47 | Your team's part | Your team's part? A few clicks… |
| 1:56 | Close | Pixel Island, for Best Bali Realty… |

The break lengths assume about 150 words per minute. A voice that reads faster or slower drifts a little over the video. To get an exact match, send the finished MP3: the silence between lines makes it easy to cut the take into 17 clips and place each one on its start time above.

**Pronunciation:** say the names clearly (*Scout*, *Pin*, *Concierge*, *Quill*, *Echo*). Lawrence should hear each name as it appears on screen.

## Adding the voiceover (and music) to the video

1. Put the file in `explainer-video/public/`, for example `public/voiceover.mp3`. Music goes in the same folder, for example `public/music.mp3`.
2. Render with the audio props:

```bash
npx remotion render Explainer-16x9 out/best-bali-explainer-16x9-v4.mp4 \
  --props='{"voiceover":"voiceover.mp3","music":"music.mp3","musicVolume":0.15}'
npx remotion render Explainer-1x1 out/best-bali-explainer-1x1-v4.mp4 \
  --props='{"voiceover":"voiceover.mp3","music":"music.mp3","musicVolume":0.15}'
```

Music fades in over the first half-second and out over the last 1.5 seconds. Keep `musicVolume` around 0.12–0.18 so the voice stays clear.
