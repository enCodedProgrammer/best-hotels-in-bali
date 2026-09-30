import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Soft, no-overshoot spring starting at `delay` frames. */
export const useIn = (delay = 0, damping = 200) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping}});
};

/** Bouncy spring for pops (checkmarks, badges). */
export const usePop = (delay = 0) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 180, mass: 0.7}});
};

/** 0→1 over [from, to] frames with ease. */
export const useProgress = (from: number, to: number, easing = ease) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [from, to], [0, 1], {...clamp, easing});
};

/**
 * Layout for the two aspect ratios. Vertical keeps text out of the top 220px
 * and bottom 380px (Facebook/Reels UI). Every scene draws its visual on a
 * fixed 960×900 canvas, which <Stage> scales into `stage`.
 */
export const useLayout = () => {
	const {width, height} = useVideoConfig();
	const square = width === height;
	return square
		? {square, W: width, H: height, headTop: 44, headSize: 58, stage: {top: 262, height: 668}, capBottom: 40, capSize: 40}
		: {square, W: width, H: height, headTop: 250, headSize: 76, stage: {top: 560, height: 820}, capBottom: 410, capSize: 50};
};

export const CANVAS = {w: 960, h: 900};
