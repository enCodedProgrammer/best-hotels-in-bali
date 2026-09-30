import {sec} from './theme';

/**
 * Scene lengths in seconds (72s total). The voiceover lines in captions.ts and
 * VOICEOVER.md are timed to these start points, so change them together once
 * the real voiceover is recorded.
 */
export const SCENES = [
	{id: 'hook', seconds: 5.5},
	{id: 'pain', seconds: 7.5},
	{id: 'solution', seconds: 6},
	{id: 'talk', seconds: 11},
	{id: 'measure', seconds: 9.5},
	{id: 'estimate', seconds: 11},
	{id: 'proof', seconds: 12},
	{id: 'cta', seconds: 9.5},
] as const;

export type SceneId = (typeof SCENES)[number]['id'];

export const sceneStart = (id: SceneId) => {
	let t = 0;
	for (const s of SCENES) {
		if (s.id === id) return t;
		t += s.seconds;
	}
	throw new Error(`Unknown scene ${id}`);
};

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + sec(s.seconds), 0);
