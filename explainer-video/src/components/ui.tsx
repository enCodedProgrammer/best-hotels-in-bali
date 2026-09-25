import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, easeInOut, useIn, useLayout, useOut} from '../anim';
import {C, FONT_SANS, FONT_SERIF, shadow} from '../theme';

/* ---------- Scene shell: soft background + whole-scene fade in/out ---------- */

export const Scene: React.FC<{
	duration: number;
	children: React.ReactNode;
	dark?: boolean;
	noFadeOut?: boolean;
}> = ({duration, children, dark, noFadeOut}) => {
	const frame = useCurrentFrame();
	const inO = interpolate(frame, [0, 14], [0, 1], clamp);
	const outO = noFadeOut
		? 1
		: interpolate(frame, [duration - 16, duration], [1, 0], {...clamp, easing: easeInOut});
	const outS = noFadeOut
		? 1
		: interpolate(frame, [duration - 16, duration], [1, 0.985], clamp);
	return (
		<AbsoluteFill
			style={{
				background: dark
					? `radial-gradient(120% 90% at 50% 40%, #16312E 0%, ${C.night} 70%)`
					: `radial-gradient(110% 80% at 50% 30%, #FBF8F2 0%, ${C.bg} 55%, ${C.bgDeep} 100%)`,
				fontFamily: FONT_SANS,
				color: dark ? '#fff' : C.ink,
			}}
		>
			<AbsoluteFill style={{opacity: inO * outO, transform: `scale(${outS})`}}>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* ---------- Headline: word-by-word reveal, *accent* words in italic teal ---------- */

export const Headline: React.FC<{
	text: string;
	delay?: number;
	exitAt?: number;
	size?: number;
	color?: string;
	accent?: string;
	top?: number;
	align?: 'center' | 'left';
	maxWidth?: number;
	stagger?: number;
	style?: React.CSSProperties;
}> = ({
	text,
	delay = 0,
	exitAt,
	size,
	color = C.ink,
	accent = C.teal,
	top,
	align = 'center',
	maxWidth,
	stagger = 4,
	style,
}) => {
	const {square} = useLayout();
	const frame = useCurrentFrame();
	const out = useOut(exitAt, 16);
	const fs = size ?? (square ? 64 : 76);
	const words = text.split(' ');
	let accentOn = false;
	return (
		<div
			style={{
				position: top === undefined ? 'relative' : 'absolute',
				top,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: align === 'center' ? 'center' : 'flex-start',
				opacity: out,
				transform: `translateY(${(1 - out) * -14}px)`,
				...style,
			}}
		>
			<div
				style={{
					fontFamily: FONT_SERIF,
					fontSize: fs,
					lineHeight: 1.08,
					letterSpacing: '-0.01em',
					color,
					textAlign: align,
					maxWidth: maxWidth ?? (square ? 940 : 1500),
					textWrap: 'balance',
				}}
			>
				{words.map((w, i) => {
					let word = w;
					const starts = word.startsWith('*');
					if (starts) {
						accentOn = true;
						word = word.slice(1);
					}
					const isAccent = accentOn;
					if (word.endsWith('*') || word.match(/\*[.,?!:]$/)) {
						accentOn = false;
						word = word.replace('*', '');
					}
					const p = interpolate(frame - delay - i * stagger, [0, 22], [0, 1], {
						...clamp,
						easing: ease,
					});
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								opacity: p,
								transform: `translateY(${(1 - p) * 0.45 * fs}px)`,
								filter: `blur(${(1 - p) * 8}px)`,
								fontStyle: isAccent ? 'italic' : 'normal',
								color: isAccent ? accent : color,
								marginRight: '0.24em',
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

/* ---------- Kicker: "01 · NEW LISTINGS" pill ---------- */

export const Kicker: React.FC<{
	num?: string;
	label: string;
	delay?: number;
	color?: string;
	style?: React.CSSProperties;
}> = ({num, label, delay = 0, color = C.teal, style}) => {
	const p = useIn(delay);
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 12,
				padding: '10px 20px 10px 12px',
				borderRadius: 999,
				background: C.card,
				boxShadow: shadow.sm,
				border: `1px solid ${C.line}`,
				fontSize: 22,
				fontWeight: 600,
				letterSpacing: '0.12em',
				textTransform: 'uppercase',
				color: C.inkSoft,
				opacity: p,
				transform: `translateY(${(1 - p) * 16}px)`,
				...style,
			}}
		>
			{num ? (
				<span
					style={{
						background: color,
						color: '#fff',
						borderRadius: 999,
						padding: '4px 12px',
						fontSize: 18,
						letterSpacing: '0.06em',
					}}
				>
					{num}
				</span>
			) : null}
			{label}
		</div>
	);
};

/* ---------- Card ---------- */

export const Card: React.FC<{
	children: React.ReactNode;
	style?: React.CSSProperties;
	pad?: number;
	radius?: number;
}> = ({children, style, pad = 24, radius = 24}) => (
	<div
		style={{
			background: C.card,
			borderRadius: radius,
			boxShadow: shadow.md,
			border: `1px solid ${C.line}`,
			padding: pad,
			...style,
		}}
	>
		{children}
	</div>
);

/* ---------- Browser frame ---------- */

export const Browser: React.FC<{
	url: string;
	width: number;
	height: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({url, width, height, children, style}) => (
	<div
		style={{
			width,
			height,
			borderRadius: 22,
			background: C.card,
			boxShadow: shadow.lg,
			border: `1px solid ${C.line}`,
			overflow: 'hidden',
			display: 'flex',
			flexDirection: 'column',
			...style,
		}}
	>
		<div
			style={{
				height: 54,
				flexShrink: 0,
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				padding: '0 20px',
				background: '#FBF9F5',
				borderBottom: `1px solid ${C.line}`,
			}}
		>
			{['#E8766A', '#E9BC5B', '#6CC17C'].map((c) => (
				<div key={c} style={{width: 13, height: 13, borderRadius: 99, background: c}} />
			))}
			<div
				style={{
					marginLeft: 18,
					flex: 1,
					maxWidth: 520,
					height: 32,
					borderRadius: 10,
					background: C.bgDeep,
					display: 'flex',
					alignItems: 'center',
					padding: '0 16px',
					fontSize: 17,
					color: C.inkSoft,
					fontWeight: 500,
				}}
			>
				{url}
			</div>
		</div>
		<div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>{children}</div>
	</div>
);

/* ---------- Phone frame ---------- */

export const Phone: React.FC<{
	width?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
	screen?: string;
}> = ({width = 400, children, style, screen = '#fff'}) => {
	const h = width * 2.05;
	return (
		<div
			style={{
				width,
				height: h,
				borderRadius: width * 0.15,
				background: '#101614',
				padding: width * 0.03,
				boxShadow: shadow.lg,
				position: 'relative',
				...style,
			}}
		>
			<div
				style={{
					width: '100%',
					height: '100%',
					borderRadius: width * 0.125,
					background: screen,
					overflow: 'hidden',
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: width * 0.03,
						left: '50%',
						transform: 'translateX(-50%)',
						width: width * 0.3,
						height: width * 0.075,
						borderRadius: 99,
						background: '#101614',
						zIndex: 10,
					}}
				/>
				{children}
			</div>
		</div>
	);
};

/* ---------- Typewriter ---------- */

export const TypeText: React.FC<{
	text: string;
	start: number;
	cps?: number;
	caret?: boolean;
	style?: React.CSSProperties;
}> = ({text, start, cps = 40, caret = true, style}) => {
	const frame = useCurrentFrame();
	const n = Math.max(0, Math.floor(((frame - start) / 60) * cps));
	const shown = text.slice(0, n);
	const done = n >= text.length;
	const blink = Math.floor(frame / 30) % 2 === 0;
	return (
		<span style={style}>
			{shown}
			{caret && frame >= start && (!done || blink) ? (
				<span
					style={{
						display: 'inline-block',
						width: 3,
						height: '1em',
						background: C.teal,
						marginLeft: 2,
						verticalAlign: '-0.12em',
						opacity: done ? (blink ? 1 : 0) : 1,
					}}
				/>
			) : null}
		</span>
	);
};

/* ---------- Animated cursor with click ripple ---------- */

export const Cursor: React.FC<{
	path: {x: number; y: number; at: number}[];
	clickAt?: number;
	appear?: number;
	hideAt?: number;
}> = ({path, clickAt, appear = 0, hideAt}) => {
	const frame = useCurrentFrame();
	let x = path[0].x;
	let y = path[0].y;
	for (let i = 0; i < path.length - 1; i++) {
		const a = path[i];
		const b = path[i + 1];
		if (frame >= a.at) {
			const t = interpolate(frame, [a.at, b.at], [0, 1], {...clamp, easing: easeInOut});
			x = a.x + (b.x - a.x) * t;
			y = a.y + (b.y - a.y) * t;
		}
	}
	const o =
		interpolate(frame, [appear, appear + 10], [0, 1], clamp) *
		(hideAt ? interpolate(frame, [hideAt, hideAt + 10], [1, 0], clamp) : 1);
	const press = clickAt ? interpolate(frame, [clickAt - 4, clickAt, clickAt + 8], [1, 0.82, 1], clamp) : 1;
	const ripple = clickAt ? interpolate(frame, [clickAt, clickAt + 26], [0, 1], clamp) : 0;
	return (
		<div style={{position: 'absolute', left: x, top: y, opacity: o, zIndex: 50, pointerEvents: 'none'}}>
			{clickAt && frame >= clickAt ? (
				<div
					style={{
						position: 'absolute',
						left: -40,
						top: -40,
						width: 80,
						height: 80,
						borderRadius: 99,
						border: `3px solid ${C.teal}`,
						transform: `scale(${0.3 + ripple})`,
						opacity: 1 - ripple,
					}}
				/>
			) : null}
			<svg
				width="44"
				height="44"
				viewBox="0 0 24 24"
				style={{transform: `scale(${press})`, transformOrigin: '4px 4px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))'}}
			>
				<path
					d="M4 2.5 L4 19 L8.6 14.9 L11.6 21.2 L14.4 19.9 L11.5 13.8 L17.6 13.8 Z"
					fill={C.ink}
					stroke="#fff"
					strokeWidth="1.5"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
};

/* ---------- Chip ---------- */

export const Chip: React.FC<{
	children: React.ReactNode;
	color?: string;
	bg?: string;
	style?: React.CSSProperties;
}> = ({children, color = C.teal, bg = C.tealSoft, style}) => (
	<span
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 8,
			padding: '7px 14px',
			borderRadius: 999,
			background: bg,
			color,
			fontSize: 18,
			fontWeight: 600,
			...style,
		}}
	>
		{children}
	</span>
);

/* ---------- Appear wrapper (fade + rise + optional scale) ---------- */

export const Appear: React.FC<{
	delay?: number;
	exitAt?: number;
	y?: number;
	x?: number;
	scale?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
	pop?: boolean;
}> = ({delay = 0, exitAt, y = 30, x = 0, scale = 1, children, style, pop}) => {
	const p = useIn(delay, pop ? 16 : 200);
	const out = useOut(exitAt, 16);
	const s = scale + (1 - scale) * p;
	return (
		<div
			style={{
				opacity: Math.min(1, p) * out,
				transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px) scale(${s})`,
				...style,
			}}
		>
			{children}
		</div>
	);
};

/* ---------- Beat cross-fade inside a scene ---------- */

export const BeatFade: React.FC<{len: number; children: React.ReactNode; last?: boolean; first?: boolean}> = ({
	len,
	children,
	last,
	first,
}) => {
	const frame = useCurrentFrame();
	const i = first ? 1 : interpolate(frame, [0, 12], [0, 1], clamp);
	const o = last ? 1 : interpolate(frame, [len - 14, len], [1, 0], clamp);
	return <div style={{position: 'absolute', inset: 0, opacity: i * o}}>{children}</div>;
};

