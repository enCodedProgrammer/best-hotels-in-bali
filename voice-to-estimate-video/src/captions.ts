import {SceneId, sceneStart} from './timeline';

/** One caption word, times in seconds from the start of the video. */
export type CaptionWord = {text: string; start: number; end: number};

/**
 * Voiceover lines with estimated timing (~2.6 words/sec). `at` is seconds
 * into the scene, `dur` the spoken length. Caption text can differ from the
 * spoken words ("$21,500" is read as "twenty-one-thousand-five-hundred-dollar").
 *
 * Once the real voiceover exists, pass exact word timings from Whisper or
 * ElevenLabs instead: render with --props='{"captions": [...CaptionWord]}'.
 */
const LINES: {scene: SceneId; at: number; dur: number; text: string}[] = [
	{scene: 'hook', at: 0.3, dur: 4.6, text: 'Still writing roof estimates at night after a full day on site?'},
	{scene: 'pain', at: 0.3, dur: 6.2, text: "Pull the measurements, work out the materials, type every single line item. That's hours per job."},
	{scene: 'solution', at: 0.3, dur: 4.8, text: 'Voice-to-Estimate turns your roof walkthrough into a costed estimate automatically.'},
	{scene: 'talk', at: 0.3, dur: 5.8, text: 'Walk the roof and talk like you normally would: tear-off, shingle type, vents, problem areas.'},
	{scene: 'measure', at: 0.3, dur: 7.3, text: 'The system pulls an aerial roof measurement for the address, so squares, pitch, and linear feet come in automatically.'},
	{scene: 'estimate', at: 0.3, dur: 8.5, text: 'Then it builds the estimate using your own pricing, your own waste factor, even step flashing bundles, ready to review and send.'},
	{scene: 'proof', at: 0.3, dur: 10.4, text: 'We tested it on a real $21,500 job for a California roofer. The key numbers lined up with his hand-built estimate.'},
	{scene: 'cta', at: 0.3, dur: 7.3, text: "Want to try it on your next five jobs? Reply to this message and I'll set it up for you."},
];

/** Rough spoken length of a word; numbers read out take much longer than they look. */
const weight = (w: string) => {
	if (w.startsWith('$')) return 30;
	const pause = /[.?!]$/.test(w) ? 6 : /[,:]$/.test(w) ? 3 : 0;
	return w.replace(/[^A-Za-z0-9]/g, '').length + 3 + pause;
};

export const ESTIMATED_CAPTIONS: CaptionWord[] = LINES.flatMap((l) => {
	const words = l.text.split(' ');
	const total = words.reduce((a, w) => a + weight(w), 0);
	let t = sceneStart(l.scene) + l.at;
	return words.map((text) => {
		const d = (weight(text) / total) * l.dur;
		const word = {text, start: t, end: t + d};
		t += d;
		return word;
	});
});

export type CaptionChunk = {words: CaptionWord[]; start: number; end: number};

/** Groups words into 3–5 word chunks, breaking after punctuation where possible. */
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
		const punct = /[.,?!:]$/.test(w.text);
		if (gap > 0.35 || cur.length >= 5 || (punct && cur.length >= 3) || (/[.?!]$/.test(w.text) && cur.length >= 2)) flush();
	});
	flush();
	// Hold each chunk until the next one starts (or 0.6s past its last word).
	return chunks.map((c, i) => {
		const next = chunks[i + 1];
		const hold = c.end + 0.6;
		return {...c, end: next ? Math.min(next.start, Math.max(c.end, hold)) : hold};
	});
};
