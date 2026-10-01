import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, useLayout} from '../anim';
import {BuilderLoop} from '../components/BuilderLoop';
import {Scene} from '../components/ui';
import {C} from '../theme';

const WORDS = [
	{w: "You're", at: 2},
	{w: 'still', at: 6},
	{w: 'TYPING', at: 13, key: true},
	{w: 'estimates', at: 30},
	{w: 'into', at: 36},
	{w: 'AccuLynx?', at: 42, key: true},
];
export const THUD_FRAME = 13;

/** Opening shot. The CTA fades back into this exact frame so the Reel loops. */
export const HookBackdrop: React.FC<{zoom: [number, number]; len: number}> = ({zoom, len}) => {
	const {square} = useLayout();
	return (
		<>
			<BuilderLoop zoom={zoom} len={len} />
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: square ? 360 : 820,
					bottom: 0,
					background: `linear-gradient(180deg, rgba(11,18,32,0) 0%, rgba(11,18,32,0.88) 22%, ${C.bg} 60%)`,
				}}
			/>
		</>
	);
};

export const Hook: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	// Small camera shake when TYPING slams in.
	const shake = interpolate(frame, [THUD_FRAME, THUD_FRAME + 3, THUD_FRAME + 6, THUD_FRAME + 9], [0, 10, -6, 0], clamp);
	const fs = square ? 92 : 112;
	return (
		<Scene duration={duration} fadeIn={false}>
			<div style={{position: 'absolute', inset: 0, transform: `translate(${shake}px, ${shake * 0.4}px)`}}>
				<HookBackdrop zoom={[1, 1.15]} len={duration} />
				<div
					style={{
						position: 'absolute',
						left: 50,
						right: 50,
						top: square ? 520 : 1000,
						textAlign: 'center',
						fontSize: fs,
						fontWeight: 900,
						lineHeight: 1.02,
						letterSpacing: '-0.03em',
						textWrap: 'balance',
					}}
				>
					{WORDS.map(({w, at, key}) => {
						const p = interpolate(frame - at, [0, key ? 5 : 7], [0, 1], {...clamp, easing: ease});
						const slam = key ? interpolate(frame - at, [0, 4, 9], [1.8, 0.94, 1], clamp) : 1;
						return (
							<span
								key={w}
								style={{
									display: 'inline-block',
									marginRight: '0.2em',
									opacity: p,
									color: key ? C.orange : C.white,
									transform: key ? `scale(${slam})` : `translateY(${(1 - p) * 30}px)`,
									fontSize: w === 'TYPING' ? fs * 1.35 : fs,
								}}
							>
								{w}
							</span>
						);
					})}
				</div>
			</div>
		</Scene>
	);
};
