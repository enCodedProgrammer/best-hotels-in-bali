import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, useIn} from '../anim';
import {C} from '../theme';
import {CountUp} from './CountUp';

/** One line item on the estimate document: slides in, then its price counts up. */
export const EstimateLine: React.FC<{
	item: string;
	qty: string;
	price: number;
	at: number;
	/** Frame at which the line gets an orange highlight (when the voiceover mentions it). */
	highlightFrom?: number;
}> = ({item, qty, price, at, highlightFrom}) => {
	const p = useIn(at);
	const frame = useCurrentFrame();
	const hl = highlightFrom === undefined ? 0 : interpolate(frame, [highlightFrom, highlightFrom + 8], [0, 1], clamp);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				padding: '14px 22px',
				borderBottom: `2px solid ${C.paperLine}`,
				background: `rgba(255,122,26,${0.16 * hl})`,
				boxShadow: `inset 6px 0 0 rgba(255,122,26,${hl})`,
				opacity: Math.min(1, p),
				transform: `translateX(${(1 - p) * 40}px)`,
			}}
		>
			<div style={{flex: 1, fontSize: 28, fontWeight: 700, color: C.ink, lineHeight: 1.15}}>{item}</div>
			<div style={{width: 140, fontSize: 24, fontWeight: 600, color: C.inkSoft}}>{qty}</div>
			<div style={{width: 150, textAlign: 'right', fontSize: 32, fontWeight: 800, color: C.orangeDeep}}>
				<CountUp value={price} start={at + 4} len={18} prefix="$" />
			</div>
		</div>
	);
};
