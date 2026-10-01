import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, usePop, useLayout} from '../anim';
import {Appear, Scene} from '../components/ui';
import {C} from '../theme';
import {HookBackdrop} from './Hook';

/** Frames at the end that crossfade into the opening shot, so the Reel loops. */
export const LOOP_LEN = 12;

const Slot: React.FC<{at: number; size: number}> = ({at, size}) => {
	const p = usePop(at);
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: size * 0.22,
				border: `4px solid ${C.orange}`,
				background: C.orangeSoft,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				opacity: Math.min(1, p),
				transform: `scale(${p})`,
			}}
		>
			<svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
				<path d="M3 11 L12 4 L21 11 M6 9.5 V20 H18 V9.5" fill="none" stroke={C.orange} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
			</svg>
		</div>
	);
};

export const CTA: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const loop = interpolate(frame, [duration - LOOP_LEN, duration - 1], [0, 1], clamp);
	const slot = square ? 76 : 104;
	return (
		<Scene duration={duration} fadeIn={false}>
			<div
				style={{
					position: 'absolute',
					left: 50,
					right: 50,
					top: square ? 60 : 300,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: square ? 34 : 60,
					textAlign: 'center',
				}}
			>
				<Appear delay={0} y={40}>
					<div style={{fontSize: square ? 64 : 84, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', textWrap: 'balance'}}>
						Onboarding <span style={{color: C.orange}}>5</span> roofing companies this month.
					</div>
				</Appear>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
					<div style={{display: 'flex', gap: 16}}>
						{[0, 1, 2, 3, 4].map((i) => (
							<Slot key={i} at={14 + i * 5} size={slot} />
						))}
					</div>
					<Appear delay={40} y={10}>
						<div style={{fontSize: square ? 28 : 36, fontWeight: 900, letterSpacing: '0.16em', color: C.orange}}>5 SPOTS THIS MONTH</div>
					</Appear>
				</div>
				<Appear delay={70} pop scale={0.7} y={0}>
					<div style={{fontSize: square ? 60 : 78, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', textWrap: 'balance'}}>
						Comment{' '}
						<span style={{background: C.orange, color: C.white, padding: '0 18px', borderRadius: 16, display: 'inline-block'}}>ESTIMATE</span>
						<br />
						or DM me.
					</div>
				</Appear>
			</div>
			<Appear
				delay={80}
				y={10}
				style={{position: 'absolute', left: 0, right: 0, bottom: square ? 120 : 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<Img src={staticFile('pixel-island-logo.png')} style={{height: square ? 40 : 52}} />
					<span style={{fontSize: square ? 24 : 30, fontWeight: 800, color: C.muted}}>Pixel Island</span>
				</div>
				<div style={{fontSize: square ? 17 : 22, fontWeight: 600, color: C.muted}}>Not affiliated with or endorsed by AccuLynx.</div>
			</Appear>
			{/* Loop: fade into the opening frame (empty builder, blinking cursor) */}
			{loop > 0 ? (
				<div style={{position: 'absolute', inset: 0, opacity: loop, background: C.bg}}>
					<HookBackdrop zoom={[1, 1]} len={1} />
				</div>
			) : null}
		</Scene>
	);
};
