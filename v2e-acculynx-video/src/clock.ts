import {interpolate} from 'remotion';
import {clamp, easeInOut} from './anim';
import {sceneStart} from './timeline';

/*
 * The two stopwatches run on video time (seconds from the start of the
 * video), so they stay continuous across scenes.
 */

const START = sceneStart('setup') + 0.6;
const OLD = sceneStart('oldway');

/** Old way: ticks, then jumps forward on "drive back" and "wait", then speeds up. */
export const oldWatch = (t: number) => {
	if (t < START) return 0;
	const base = t - START;
	const drive = interpolate(t, [OLD + 1.4, OLD + 1.9], [0, 23 * 60], {...clamp, easing: easeInOut});
	const wait = interpolate(t, [OLD + 4.4, OLD + 5.0], [0, 52 * 60], {...clamp, easing: easeInOut});
	// After the jumps, keep running at 40x so it visibly races.
	const race = Math.max(0, t - (OLD + 5)) * 40;
	return base + drive + wait + race;
};

/** New way: plain real time until it stops at the AccuLynx payoff. */
export const NEW_STOP = sceneStart('payoff') + 1.4;
export const newWatch = (t: number) => (t < START ? 0 : Math.min(t, NEW_STOP) - START);

export const fmt = (s: number) => {
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const ss = Math.floor(s % 60);
	const p = (n: number) => String(n).padStart(2, '0');
	return h > 0 ? `${h}:${p(m)}:${p(ss)}` : `${p(m)}:${p(ss)}`;
};
