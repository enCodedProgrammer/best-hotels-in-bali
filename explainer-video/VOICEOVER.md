# Voiceover script: Best Bali Real Estate explainer

**Length:** 1:48 · **About 230 words** · **Pace:** calm and unhurried, roughly 140 words per minute
**Voice:** warm, confident, conversational. Think a trusted advisor talking across the table, not a salesperson. Lawrence is the only listener, so speak to him directly.

Every line is timed to the scene on screen. Each timecode is when the line should **start**. A line can finish a little early. It should never run into the next line's start time.

---

### 0:00 · Hook
> Lawrence, what if Best Bali Real Estate could run itself… while you stay in charge?

### 0:07 · Today
> Right now, everything is done by hand. Finding listings. Uploading photos. Writing posts. And ten to fifteen emails… for every single buyer.

*(Short pause after each item. The cards appear one by one.)*

### 0:17 · Meet your team
> So we've built you a team of five digital assistants. Each one does one job, and they never stop working.

### 0:26 · Scout finds listings
> Every day, Scout finds new villas in your areas.

### 0:31 · Pin finds the address
> Pin finds the real address. So if another agent won't let you list it, you can go straight to the owner.

### 0:38 · You approve
> It all lands on your dashboard. You click Approve. That's your only step.

### 0:44 · Quill publishes
> Then Quill puts it live on your website: photos, description, everything. No typing. No uploading.

### 0:50 · Echo runs social media
> Echo runs your social media. It writes in your brand's voice, uses photos from your website, and plans your whole week.

### 0:58 · You review
> You take a quick look… and it posts for you.

### 1:05 · Concierge answers leads
> Concierge answers every email and every website chat, day or night. It asks about budget and timing, and filters out the time-wasters.

### 1:14 · Hot leads to WhatsApp
> When a serious buyer, or a new seller, comes in, you get a WhatsApp message with their name, what they want, and their budget.

### 1:24 · Dashboard
> And one simple dashboard shows you what's working, what to change, and your hottest leads.

### 1:33 · Your part
> Your part? Approve listings, and review posts. That's it. We handle everything else.

### 1:41 · Close
> Pixel Island, for Best Bali Real Estate. Let's get started.

---

## Recording notes

- **Say the names clearly:** *Scout*, *Pin*, *Quill*, *Echo*, *Concierge*. They are the bot names on screen, so Lawrence should hear and see each one at the same moment.
- **Pronunciation:** *Sanur* = "sa-NOOR".
- Record in a quiet room, or use an AI voice tool such as ElevenLabs with a mature, warm voice. Export a single **MP3 or WAV** that starts at 0:00.
- If a line runs long, trim words rather than speaking faster. The pace is part of the message.

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
