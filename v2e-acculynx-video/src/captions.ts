import {SceneId, sceneStart} from './timeline';

/** One caption word, times in seconds from the start of the video. */
export type CaptionWord = {text: string; start: number; end: number; key?: boolean};

/**
 * Lines marked `ost` are already the big on-screen text, so they get no
 * caption (the hook and "Now watch this").
 *
 * Voiceover lines with estimated timing (~2.8 words/sec; the old-way list is
 * read faster). *Starred* words are keywords: orange with a scale-pop.
 *
 * Once the real voiceover exists, pass exact word timings instead:
 * render with --props='{"captions": [...CaptionWord]}' (set "key": true on keywords).
 */
const LINES: {scene: SceneId; at: number; dur: number; text: string; ost?: boolean}[] = [
	{scene: 'hook', at: 0.15, dur: 2.4, text: "You're still *TYPING* estimates into *AccuLynx?*", ost: true},
	{scene: 'setup', at: 0.2, dur: 3.2, text: 'Same roof. Same *AccuLynx.* Two ways to estimate it.'},
	{
		scene: 'oldway',
		at: 0.15,
		dur: 8.8,
		text: 'Old way: notes on the roof, drive back, order the report, wait, then type every line item. Tear-off. Underlayment. Ridge. Drip edge. Flashing…',
	},
	{scene: 'interrupt', at: 0.5, dur: 1.0, text: 'Now *watch* this.', ost: true},
	{scene: 'newway', at: 0.15, dur: 6.8, text: 'New way: walk the roof and *talk.* Measurements come in *automatically.* The estimate builds itself, using *your* *prices.*'},
	{scene: 'payoff', at: 0.2, dur: 4.1, text: 'And it lands right inside the job in *AccuLynx.* *Nothing* *to* *retype.*'},
	{
		scene: 'shift',
		at: 0.15,
		dur: 9.9,
		text: 'The roofer who gets the estimate to the homeowner *first* gets the *first* *shot* at the job. This industry is moving *fast.* Don’t be the last one still *typing.*',
	},
	{scene: 'cta', at: 0.15, dur: 5.2, text: "I'm setting this up for *five* roofing companies this month. Comment *“estimate”* and grab a spot."},
];

/** Rough spoken length of a word. */
const weight = (w: string) => {
	const pause = /[.?!…]$/.test(w) ? 5 : /[,:]$/.test(w) ? 2.5 : 0;
	return w.replace(/[^A-Za-z0-9]/g, '').length + 3 + pause;
};

export const ESTIMATED_CAPTIONS: CaptionWord[] = LINES.filter((l) => !l.ost).flatMap((l) => {
	const raw = l.text.split(' ');
	const total = raw.reduce((a, w) => a + weight(w.replace(/\*/g, '')), 0);
	let t = sceneStart(l.scene) + l.at;
	return raw.map((r) => {
		const key = r.includes('*');
		const text = r.replace(/\*/g, '');
		const d = (weight(text) / total) * l.dur;
		const word = {text, start: t, end: t + d, key};
		t += d;
		return word;
	});
});

export type CaptionChunk = {words: CaptionWord[]; start: number; end: number};

/** Kinetic chunks: 2–4 words, breaking after punctuation where possible. */
export const chunkCaptions = (words: CaptionWord[]): CaptionChunk[] => {
	const chunks: CaptionChunk[] = [];
	let cur: CaptionWord[] = [];
	const flush = () => {
		if (cur.length) chunks.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
		cur = [];
	};
	words.forEach((w, i) => {
		const next = words[i + 1];
		cur.push(w);
		const gap = next ? next.start - w.end : Infinity;
		const punct = /[.,?!:…]$/.test(w.text);
		if (gap > 0.3 || cur.length >= 4 || (punct && cur.length >= 2) || /[.?!…]$/.test(w.text)) flush();
	});
	flush();
	return chunks.map((c, i) => {
		const next = chunks[i + 1];
		const hold = c.end + 0.5;
		return {...c, end: next ? Math.min(next.start, Math.max(c.end, hold)) : hold};
	});
};
