import {
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Soft, no-overshoot spring starting at `delay` frames. */
export const useIn = (delay = 0, damping = 200, durationInFrames?: number) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping}, durationInFrames});
};

/** Bouncy spring for pops. */
export const usePop = (delay = 0) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 160, mass: 0.8}});
};

/** 0→1 over [from, to] with ease. */
export const useProgress = (from: number, to: number, easing = ease) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [from, to], [0, 1], {...clamp, easing});
};

/** 1 until `at`, then fades to 0 over `len` frames. */
export const useOut = (at: number | undefined, len = 18) => {
	const frame = useCurrentFrame();
	if (at === undefined) return 1;
	return interpolate(frame, [at, at + len], [1, 0], {...clamp, easing: easeInOut});
};

export const useLayout = () => {
	const {width, height} = useVideoConfig();
	const square = width === height;
	return {square, W: width, H: height};
};
