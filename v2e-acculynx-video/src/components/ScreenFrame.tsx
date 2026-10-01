import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../anim';
import {shadow} from '../theme';

/**
 * Rounded screen frame with a slow Ken Burns push-in, so screenshots are
 * never fully still. `kb` is [startScale, endScale] over `len` frames.
 */
export const ScreenFrame: React.FC<{
	width: number;
	height: number;
	children: React.ReactNode;
	kb?: [number, number];
	len?: number;
	origin?: string;
	filter?: string;
	radius?: number;
	style?: React.CSSProperties;
}> = ({width, height, children, kb = [1, 1.06], len = 150, origin = '50% 30%', filter, radius = 22, style}) => {
	const frame = useCurrentFrame();
	const s = interpolate(frame, [0, len], kb, clamp);
	return (
		<div
			style={{
				width,
				height,
				borderRadius: radius,
				overflow: 'hidden',
				position: 'relative',
				boxShadow: shadow.lg,
				background: '#E8EAEE',
				filter,
				...style,
			}}
		>
			<div style={{position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: origin}}>{children}</div>
		</div>
	);
};
