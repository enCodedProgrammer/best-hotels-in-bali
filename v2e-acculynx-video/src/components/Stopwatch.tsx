import React from 'react';
import {C} from '../theme';
import {fmt} from '../clock';
import {Check} from './ui';

/**
 * Stopwatch pill. Values come from clock.ts (seconds of video time, so the
 * watch stays continuous across scenes). `done` swaps the digits for a label.
 */
export const Stopwatch: React.FC<{seconds: number; tone: 'old' | 'new'; done?: string; size?: number; style?: React.CSSProperties}> = ({
	seconds,
	tone,
	done,
	size = 44,
	style,
}) => {
	const color = tone === 'new' ? C.orange : '#C9CED8';
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: size * 0.3,
				padding: `${size * 0.22}px ${size * 0.45}px`,
				borderRadius: 999,
				background: 'rgba(5,9,18,0.9)',
				border: `3px solid ${done ? C.green : tone === 'new' ? C.orange : '#4A5163'}`,
				boxShadow: done ? '0 0 40px rgba(34,197,94,0.45)' : '0 10px 30px rgba(0,0,0,0.45)',
				fontVariantNumeric: 'tabular-nums',
				...style,
			}}
		>
			{done ? (
				<Check size={size * 0.95} />
			) : (
				<svg width={size * 0.9} height={size * 0.9} viewBox="0 0 24 24">
					<circle cx="12" cy="13.5" r="8" fill="none" stroke={color} strokeWidth="2.4" />
					<path d="M12 13.5 L12 9" stroke={color} strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${(seconds * 30) % 360} 12 13.5)`} />
					<path d="M10 3 H14 M12 3 V5.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
				</svg>
			)}
			<span style={{fontSize: size, fontWeight: 900, color: done ? C.white : color, letterSpacing: '-0.01em'}}>{done ?? fmt(seconds)}</span>
		</div>
	);
};
