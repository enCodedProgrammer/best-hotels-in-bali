import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut} from '../anim';

type Pt = {x: number; y: number; scale: number};

/** Moves its child from `from` to `to` along an arc (scene 6 money shot). */
export const FlyIntoDocs: React.FC<{start: number; len: number; from: Pt; to: Pt; arc?: number; children: React.ReactNode}> = ({
	start,
	len,
	from,
	to,
	arc = 160,
	children,
}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [start, start + len], [0, 1], {...clamp, easing: easeInOut});
	const x = from.x + (to.x - from.x) * p;
	const y = from.y + (to.y - from.y) * p - Math.sin(p * Math.PI) * arc;
	const s = from.scale + (to.scale - from.scale) * p;
	const rot = Math.sin(p * Math.PI) * -6;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`, zIndex: 30}}>
			{children}
		</div>
	);
};
