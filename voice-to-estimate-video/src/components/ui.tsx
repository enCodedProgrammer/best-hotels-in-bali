import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CANVAS, clamp, ease, easeInOut, useIn, useLayout} from '../anim';
import {C, FONT} from '../theme';

/* ---------- Scene shell: navy background + whole-scene fade in/out ---------- */

export const Scene: React.FC<{duration: number; children: React.ReactNode; noFadeOut?: boolean; dim?: number}> = ({
	duration,
	children,
	noFadeOut,
	dim = 0,
}) => {
	const frame = useCurrentFrame();
	const inO = interpolate(frame, [0, 8], [0, 1], clamp);
	const outO = noFadeOut ? 1 : interpolate(frame, [duration - 8, duration], [1, 0], {...clamp, easing: easeInOut});
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(120% 70% at 50% 42%, #17294A 0%, ${C.bg} 60%, ${C.bgDeep} 100%)`,
				fontFamily: FONT,
				color: C.white,
			}}
		>
			<AbsoluteFill style={{opacity: inO * outO}}>{children}</AbsoluteFill>
			{dim ? <AbsoluteFill style={{background: `rgba(3,7,14,${dim})`}} /> : null}
		</AbsoluteFill>
	);
};

/* ---------- Headline: one per scene, word-by-word slide up, *accent* words in orange ---------- */

export const Headline: React.FC<{text: string; step?: number; delay?: number}> = ({text, step, delay = 4}) => {
	const {headTop, headSize, square} = useLayout();
	const frame = useCurrentFrame();
	const badge = useIn(delay - 2);
	let accentOn = false;
	return (
		<div
			style={{
				position: 'absolute',
				top: headTop,
				left: 60,
				right: 60,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: square ? 14 : 22,
			}}
		>
			{step ? (
				<div
					style={{
						padding: square ? '6px 20px' : '8px 24px',
						borderRadius: 999,
						background: C.orange,
						color: C.white,
						fontSize: square ? 26 : 32,
						fontWeight: 800,
						letterSpacing: '0.14em',
						opacity: badge,
						transform: `translateY(${(1 - badge) * 20}px)`,
					}}
				>
					STEP {step}
				</div>
			) : null}
			<div
				style={{
					fontSize: headSize,
					fontWeight: 800,
					lineHeight: 1.1,
					letterSpacing: '-0.02em',
					textAlign: 'center',
					textWrap: 'balance',
				}}
			>
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
					const p = interpolate(frame - delay - i * 2.5, [0, 12], [0, 1], {...clamp, easing: ease});
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								opacity: p,
								transform: `translateY(${(1 - p) * 0.4 * headSize}px)`,
								color: isAccent ? C.orange : C.white,
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

/* ---------- Stage: scales the fixed 960×900 scene canvas into the layout's stage area ---------- */

export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => {
	const {W, stage} = useLayout();
	const s = Math.min(W / CANVAS.w, stage.height / CANVAS.h);
	return (
		<div
			style={{
				position: 'absolute',
				top: stage.top + (stage.height - CANVAS.h * s) / 2,
				left: (W - CANVAS.w * s) / 2,
				width: CANVAS.w,
				height: CANVAS.h,
				transform: `scale(${s})`,
				transformOrigin: '0 0',
			}}
		>
			{children}
		</div>
	);
};

/* ---------- Appear: fade + slide up (optionally a springy pop) ---------- */

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

/* ---------- Green "matched" checkmark ---------- */

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

/* ---------- Tap ripple (for a finger tap on the phone) ---------- */

export const Tap: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
	const frame = useCurrentFrame();
	if (frame < at - 8) return null;
	const dot = interpolate(frame, [at - 8, at, at + 6, at + 14], [0, 1, 1, 0], clamp);
	const ring = interpolate(frame, [at, at + 18], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: x, top: y, zIndex: 40, pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: -50,
					top: -50,
					width: 100,
					height: 100,
					borderRadius: 999,
					border: '4px solid rgba(255,255,255,0.9)',
					transform: `scale(${0.3 + ring * 0.9})`,
					opacity: frame >= at ? 1 - ring : 0,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: -26,
					top: -26,
					width: 52,
					height: 52,
					borderRadius: 999,
					background: 'rgba(255,255,255,0.55)',
					opacity: dot,
					transform: `scale(${0.8 + dot * 0.2})`,
				}}
			/>
		</div>
	);
};
