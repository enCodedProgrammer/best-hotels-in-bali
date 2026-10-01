import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, easeInOut, useIn, useLayout} from '../anim';
import {C, FONT} from '../theme';

/* ---------- Scene shell. No fade from black at the very start (spec §6). ---------- */

export const Scene: React.FC<{duration: number; children: React.ReactNode; fadeIn?: boolean; fadeOut?: boolean}> = ({
	duration,
	children,
	fadeIn = true,
	fadeOut = false,
}) => {
	const frame = useCurrentFrame();
	const inO = fadeIn ? interpolate(frame, [0, 5], [0, 1], clamp) : 1;
	const outO = fadeOut ? interpolate(frame, [duration - 6, duration], [1, 0], {...clamp, easing: easeInOut}) : 1;
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(120% 70% at 50% 45%, #13203A 0%, ${C.bg} 62%, #070C16 100%)`,
				fontFamily: FONT,
				color: C.white,
			}}
		>
			<AbsoluteFill style={{opacity: inO * outO}}>{children}</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* ---------- On-screen text: word-by-word, *accent* words in orange ---------- */

export const Ost: React.FC<{text: string; delay?: number; size?: number; top?: number; stagger?: number; color?: string}> = ({
	text,
	delay = 0,
	size,
	top,
	stagger = 2.5,
	color = C.white,
}) => {
	const {headTop, headSize} = useLayout();
	const frame = useCurrentFrame();
	const fs = size ?? headSize;
	let accentOn = false;
	return (
		<div style={{position: 'absolute', top: top ?? headTop, left: 50, right: 50, display: 'flex', justifyContent: 'center'}}>
			<div style={{fontSize: fs, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.025em', textAlign: 'center', textWrap: 'balance'}}>
				{text.split(' ').map((w, i) => {
					let word = w;
					if (word.startsWith('*')) {
						accentOn = true;
						word = word.slice(1);
					}
					const isAccent = accentOn;
					if (word.includes('*')) {
						accentOn = false;
						word = word.replace('*', '');
					}
					const p = interpolate(frame - delay - i * stagger, [0, 9], [0, 1], {...clamp, easing: ease});
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								opacity: p,
								transform: `translateY(${(1 - p) * 0.35 * fs}px) scale(${0.9 + 0.1 * p})`,
								color: isAccent ? C.orange : color,
								marginRight: '0.22em',
							}}
						>
							{word}
						</span>
					);
				})}
			</div>
		</div>
	);
};

/* ---------- Appear: fade + slide (optionally a springy pop) ---------- */

export const Appear: React.FC<{
	delay?: number;
	y?: number;
	x?: number;
	scale?: number;
	pop?: boolean;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({delay = 0, y = 30, x = 0, scale = 1, pop, children, style}) => {
	const p = useIn(delay, pop ? 14 : 200);
	const s = scale + (1 - scale) * p;
	return (
		<div
			style={{
				opacity: Math.min(1, Math.max(0, p)),
				transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px) scale(${s})`,
				...style,
			}}
		>
			{children}
		</div>
	);
};

/* ---------- Green check ---------- */

export const Check: React.FC<{size?: number; color?: string}> = ({size = 40, color = C.green}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: 999,
			background: color,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexShrink: 0,
		}}
	>
		<svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
			<path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	</div>
);

/* ---------- Step label pill (old-way steps, new-way steps) ---------- */

export const StepLabel: React.FC<{children: React.ReactNode; tone: 'old' | 'new'; size?: number}> = ({children, tone, size = 34}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 12,
			padding: '12px 22px',
			borderRadius: 16,
			background: tone === 'new' ? C.orange : 'rgba(20,24,32,0.88)',
			border: tone === 'new' ? 'none' : '2px solid #3A4152',
			color: C.white,
			fontSize: size,
			fontWeight: 800,
			lineHeight: 1.15,
			boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
		}}
	>
		{children}
	</div>
);
