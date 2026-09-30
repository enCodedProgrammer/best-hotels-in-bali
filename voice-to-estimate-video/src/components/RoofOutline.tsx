import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease} from '../anim';
import {C} from '../theme';

/*
 * Generic illustrated L-shaped roof seen from above (not a real address).
 * Main block is a hip roof; the front wing is a gable, so we get ridge, hip,
 * valley, eave and rake lines. viewBox is 480 × 460.
 */

type Seg = [number, number, number, number];
export const LINE_COLORS = {
	ridge: C.orange,
	hip: '#FFC34D',
	valley: '#38BDF8',
	rake: '#C084FC',
	eave: C.white,
} as const;
export type LineKind = keyof typeof LINE_COLORS;

const LINES: Record<Exclude<LineKind, 'eave'>, Seg[]> = {
	ridge: [
		[160, 160, 320, 160],
		[310, 190, 310, 400],
	],
	hip: [
		[60, 60, 160, 160],
		[60, 260, 160, 160],
		[420, 60, 320, 160],
		[420, 260, 320, 160],
	],
	valley: [
		[240, 260, 310, 190],
		[380, 260, 310, 190],
	],
	rake: [
		[240, 400, 310, 400],
		[310, 400, 380, 400],
	],
};

const OUTLINE = 'M60 60 L420 60 L420 260 L380 260 L380 400 L240 400 L240 260 L60 260 Z';

const FACETS: {pts: string; shade: string}[] = [
	{pts: '60,60 420,60 320,160 160,160', shade: '#5B6B80'},
	{pts: '60,60 160,160 60,260', shade: '#6E7F95'},
	{pts: '420,60 420,260 320,160', shade: '#4A596D'},
	{pts: '60,260 160,160 320,160 420,260 380,260 310,190 240,260', shade: '#7D8DA2'},
	{pts: '240,260 310,190 310,400 240,400', shade: '#6E7F95'},
	{pts: '380,260 310,190 310,400 380,400', shade: '#4F5E73'},
];

/**
 * @param start frame the outline starts drawing
 * Draws outline (0–30), fills facets (24–40), then each line kind in turn.
 */
export const RoofOutline: React.FC<{start: number; size?: number}> = ({start, size = 480}) => {
	const frame = useCurrentFrame();
	const f = frame - start;
	const outline = interpolate(f, [0, 30], [0, 1], {...clamp, easing: ease});
	const fill = interpolate(f, [24, 40], [0, 1], clamp);
	const kinds = Object.keys(LINES) as (keyof typeof LINES)[];
	return (
		<svg width={size} height={(size * 460) / 480} viewBox="0 0 480 460" style={{overflow: 'visible'}}>
			<g opacity={fill}>
				{FACETS.map((fc, i) => (
					<polygon key={i} points={fc.pts} fill={fc.shade} />
				))}
				{/* shingle texture */}
				<clipPath id="roofclip">
					<path d={OUTLINE} />
				</clipPath>
				<g clipPath="url(#roofclip)" opacity={0.18}>
					{Array.from({length: 40}).map((_, i) => (
						<line key={i} x1={0} x2={480} y1={60 + i * 9} y2={60 + i * 9} stroke="#0F1B2D" strokeWidth={1} />
					))}
				</g>
			</g>
			{kinds.map((k, ki) => {
				const p = interpolate(f, [34 + ki * 10, 50 + ki * 10], [0, 1], {...clamp, easing: ease});
				return LINES[k].map(([x1, y1, x2, y2], i) => (
					<line
						key={`${k}${i}`}
						x1={x1}
						y1={y1}
						x2={x1 + (x2 - x1) * p}
						y2={y1 + (y2 - y1) * p}
						stroke={LINE_COLORS[k]}
						strokeWidth={6}
						strokeLinecap="round"
						opacity={p > 0 ? 1 : 0}
					/>
				));
			})}
			<path
				d={OUTLINE}
				fill="none"
				stroke={LINE_COLORS.eave}
				strokeWidth={6}
				strokeLinejoin="round"
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - outline}
			/>
		</svg>
	);
};
