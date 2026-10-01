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

/** Bouncy spring for pops and slams. */
export const usePop = (delay = 0) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 180, mass: 0.7}});
};

/**
 * Layout for both aspect ratios. Vertical keeps text out of the top 220px and
 * bottom 380px (Facebook/Reels UI). `panels` is the band the split screen
 * lives in, between the on-screen text and the captions.
 */
export const useLayout = () => {
	const {width, height} = useVideoConfig();
	const square = width === height;
	return square
		? {square, W: width, H: height, headTop: 26, headSize: 52, panels: {top: 150, bottom: 945}, capBottom: 28, capSize: 44, margin: 24}
		: {square, W: width, H: height, headTop: 236, headSize: 72, panels: {top: 470, bottom: 1400}, capBottom: 404, capSize: 56, margin: 24};
};

/** Seconds from the start of the whole video, from inside a scene. */
export const useVideoTime = (sceneStartFrame: number) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (frame + sceneStartFrame) / fps;
};
