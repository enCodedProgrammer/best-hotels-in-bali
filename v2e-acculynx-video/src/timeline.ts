import {sec} from './theme';

/**
 * Scene lengths in seconds (50.5s total). The voiceover lines in captions.ts
 * and VOICEOVER.md are timed to these start points; once the real voiceover
 * is recorded, re-time both together.
 */
export const SCENES = [
	{id: 'hook', seconds: 3},
	{id: 'setup', seconds: 4},
	{id: 'oldway', seconds: 9.5},
	{id: 'interrupt', seconds: 2},
	{id: 'newway', seconds: 9},
	{id: 'payoff', seconds: 6},
	{id: 'shift', seconds: 10.5},
	{id: 'cta', seconds: 6.5},
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

export const sceneStartFrame = (id: SceneId) => sec(sceneStart(id));

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + sec(s.seconds), 0);
