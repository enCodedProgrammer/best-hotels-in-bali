import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, useLayout} from '../anim';
import {C} from '../theme';
import {AccuScreen, SRC} from './AccuScreen';

/**
 * The empty AccuLynx estimate builder ("New Section", empty Trade field) with
 * a blinking cursor. Opens the video and closes it, so the Reel loops.
 * `zoom` is [from, to] over `len` frames, pushing in on the empty field.
 */
export const BuilderLoop: React.FC<{zoom?: [number, number]; len?: number; filter?: string}> = ({zoom = [1, 1.15], len = 90, filter}) => {
	const frame = useCurrentFrame();
	const {W, square} = useLayout();
	const width = W - 48;
	const k = width / SRC.w;
	const height = square ? 1032 : 1440;
	const caretOn = Math.floor(frame / 8) % 2 === 0;
	const s = interpolate(frame, [0, len], zoom, clamp);
	return (
		<div style={{position: 'absolute', left: 24, top: square ? 24 : 230, width, height, transform: `scale(${s})`, transformOrigin: '50% 8%'}}>
			<AccuScreen width={width} height={height} still={{file: 'acculynx/builder-empty.png', srcT: 27.9}} kb={[1, 1]} filter={filter} fit="width" />
			{/* blinking cursor in the empty Trade field */}
			<div
				style={{
					position: 'absolute',
					left: 52 * k,
					top: 124 * k,
					width: 3 * k,
					height: 17 * k,
					background: C.ink,
					opacity: caretOn ? 1 : 0,
				}}
			/>
		</div>
	);
};
