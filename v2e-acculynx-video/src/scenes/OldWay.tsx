import React from 'react';
import {interpolate, Sequence, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, useIn, useLayout, useVideoTime} from '../anim';
import {newWatch, oldWatch} from '../clock';
import {BEFORE_LABEL} from '../config';
import {AccuScreen} from '../components/AccuScreen';
import {AppIcon} from '../components/AppIcon';
import {SpeedBadge} from '../components/SpeedBadge';
import {SideTag, SplitScreen} from '../components/SplitScreen';
import {Stopwatch} from '../components/Stopwatch';
import {Ost, Scene, StepLabel} from '../components/ui';
import {C, OLD_WAY_FILTER} from '../theme';
import {sceneStartFrame} from '../timeline';

/** Sub-step start frames, timed to the voiceover list. */
export const OLD_STEPS = {notes: 0, drive: 40, report: 80, wait: 130, type: 160};
const TYPE_LEN = 125;

const Notes: React.FC<{w: number; h: number}> = ({w, h}) => {
	const frame = useCurrentFrame();
	const lines = [0.8, 0.65, 0.9, 0.5, 0.75];
	return (
		<div style={{width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2A2D33'}}>
			<div style={{width: w * 0.62, padding: 30, borderRadius: 14, background: '#E9E6DC', transform: 'rotate(-4deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
				<div style={{height: 14, background: '#B9B4A6', borderRadius: 4, marginBottom: 22}} />
				{lines.map((l, i) => {
					const p = interpolate(frame, [i * 6, i * 6 + 10], [0, 1], clamp);
					return (
						<svg key={i} width="100%" height="34" viewBox="0 0 100 10" preserveAspectRatio="none">
							<path
								d={`M2 6 Q ${10 + i * 3} 1 20 6 T 40 6 T 60 5 T ${l * 100} 6`}
								fill="none"
								stroke="#333"
								strokeWidth="1.4"
								pathLength={1}
								strokeDasharray={1}
								strokeDashoffset={1 - p}
							/>
						</svg>
					);
				})}
			</div>
		</div>
	);
};

const Drive: React.FC<{w: number; h: number}> = ({w, h}) => {
	const frame = useCurrentFrame();
	const x = interpolate(frame, [0, 40], [-0.15, 1.05], clamp);
	return (
		<div style={{width: w, height: h, position: 'relative', background: '#2A2D33', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: h * 0.55, height: 110, background: '#3B3F47'}} />
			<div
				style={{
					position: 'absolute',
					left: -((frame * 14) % 80),
					right: 0,
					top: h * 0.55 + 52,
					height: 6,
					background: 'repeating-linear-gradient(90deg, #9AA0AA 0 40px, transparent 40px 80px)',
				}}
			/>
			<svg width="200" height="110" viewBox="0 0 64 34" style={{position: 'absolute', left: x * w - 100, top: h * 0.55 - 70}}>
				<path d="M4 24 V16 L12 15 L18 7 H40 L48 15 L60 17 V24 Z" fill="#C9CED8" />
				<path d="M20 9 H30 V15 H15 Z M32 9 H39 L45 15 H32 Z" fill="#5A606C" />
				<circle cx="16" cy="25" r="5" fill="#222" stroke="#888" strokeWidth="2" />
				<circle cx="48" cy="25" r="5" fill="#222" stroke="#888" strokeWidth="2" />
			</svg>
		</div>
	);
};

/** Typed line items under the builder clip, keyed to the voiceover list. */
const ITEMS = [
	{t: 'Tear-off', at: 38},
	{t: 'Underlayment', at: 56},
	{t: 'Ridge', at: 76},
	{t: 'Drip edge', at: 88},
	{t: 'Flashing…', at: 104},
];

const TypedItems: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center'}}>
			{ITEMS.map(({t, at}) => {
				const n = Math.max(0, Math.floor((frame - at) * 1.5));
				if (n === 0) return null;
				return (
					<div key={t} style={{padding: '8px 14px', borderRadius: 10, background: 'rgba(10,12,16,0.9)', border: '2px solid #4A5163', fontSize: 28, fontWeight: 800, color: '#D5D9E0', fontFamily: 'monospace'}}>
						{t.slice(0, n)}
						{n < t.length ? '▌' : ''}
					</div>
				);
			})}
		</div>
	);
};

/** Orange ring around the real "Measurement Providers" menu item (recording pixels). */
const MenuRing: React.FC = () => {
	const p = useIn(8);
	return (
		<div
			style={{
				position: 'absolute',
				left: 290,
				top: 501,
				width: 156,
				height: 28,
				borderRadius: 8,
				border: `3px solid ${C.orange}`,
				boxShadow: `0 0 0 4px rgba(255,122,26,0.25)`,
				opacity: p,
				transform: `scale(${1.3 - 0.3 * p})`,
			}}
		/>
	);
};

const Spinner: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{width: 120, height: 120, borderRadius: 999, border: '12px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', transform: `rotate(${frame * 18}deg)`}} />
	);
};

export const OldWay: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const t = useVideoTime(sceneStartFrame('oldway'));
	const {square} = useLayout();
	const frac = interpolate(frame, [0, 12], [0.5, 0.7], {...clamp, easing: easeInOut});
	const step = (from: number, to: number, children: React.ReactNode, text: string) => (
		<Sequence from={from} durationInFrames={to - from} layout="none">
			{children}
			<StepLabelIn text={text} />
		</Sequence>
	);
	return (
		<Scene duration={duration} fadeIn={false}>
			<Ost text={BEFORE_LABEL} color="#C9CED8" size={square ? 52 : 68} />
			<SplitScreen
				leftFrac={frac}
				rightOpacity={0.5}
				left={(w, h) => (
					<>
						<SideTag tone="old" />
						<div style={{position: 'absolute', inset: 0, filter: OLD_WAY_FILTER}}>
							{step(OLD_STEPS.notes, OLD_STEPS.drive, <Notes w={w} h={h} />, 'Scribble notes on the roof')}
							{step(OLD_STEPS.drive, OLD_STEPS.report, <Drive w={w} h={h} />, 'Drive back')}
							{step(
								OLD_STEPS.report,
								OLD_STEPS.wait,
								<AccuScreen
									width={w}
									height={h}
									still={{file: 'acculynx/02-measurement-menu.png', srcT: 4.0}}
									kb={[1, 1.25]}
									len={50}
									origin="55% 45%"
									alignX={0.45}
									radius={24}
								>
									<MenuRing />
								</AccuScreen>,
								'Order the measurement report',
							)}
							{step(
								OLD_STEPS.wait,
								OLD_STEPS.type,
								<>
									<AccuScreen width={w} height={h} clip={{from: 9.0, to: 10.0}} kb={[1, 1]} radius={24} />
									<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<Spinner />
									</div>
								</>,
								'Wait…',
							)}
							{step(
								OLD_STEPS.type,
								duration,
								<>
									<AccuScreen width={w} height={h} clip={{from: 20.0, to: 28.2, rate: 2}} kb={[1, 1.06]} len={TYPE_LEN} radius={24} />
									<SpeedBadge label="2x" style={{position: 'absolute', top: 16, right: 16}} />
									<div style={{position: 'absolute', left: 16, right: 16, bottom: 110}}>
										<TypedItems />
									</div>
								</>,
								'Type every line item',
							)}
						</div>
						<div style={{position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 25}}>
							<Stopwatch seconds={oldWatch(t)} tone="old" size={square ? 36 : 42} />
						</div>
					</>
				)}
				right={(w, h) => (
					<>
						<SideTag tone="new" size={20} />
						<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
							<AppIcon size={Math.min(110, w * 0.45)} />
							<div style={{fontSize: 24, fontWeight: 800, color: C.muted, textAlign: 'center'}}>Waiting its turn</div>
						</div>
						<div style={{position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
							<Stopwatch seconds={newWatch(t)} tone="new" size={square ? 22 : 26} />
						</div>
					</>
				)}
			/>
		</Scene>
	);
};

const StepLabelIn: React.FC<{text: string}> = ({text}) => {
	const p = useIn(0);
	return (
		<div style={{position: 'absolute', top: 70, left: 16, right: 16, zIndex: 22, opacity: p, transform: `translateY(${(1 - p) * -16}px)`}}>
			<StepLabel tone="old">{text}</StepLabel>
		</div>
	);
};
