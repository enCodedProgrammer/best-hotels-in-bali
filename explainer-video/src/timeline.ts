import {sec} from './theme';

/**
 * Scene lengths in seconds. The voiceover script (VOICEOVER.md) is timed to
 * these exact start points, so change both together.
 */
export const SCENES = [
	{id: 'hook', seconds: 7},
	{id: 'today', seconds: 10},
	{id: 'crew', seconds: 9},
	{id: 'listings', seconds: 24},
	{id: 'social', seconds: 15},
	{id: 'leads', seconds: 19},
	{id: 'dashboard', seconds: 9},
	{id: 'yourpart', seconds: 8},
	{id: 'close', seconds: 7},
] as const;

export type SceneId = (typeof SCENES)[number]['id'];

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + sec(s.seconds), 0);
