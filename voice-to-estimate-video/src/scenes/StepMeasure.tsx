import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, usePop} from '../anim';
import {CountUp} from '../components/CountUp';
import {LINE_COLORS, LineKind, RoofOutline} from '../components/RoofOutline';
import {Appear, Headline, Scene, Stage} from '../components/ui';
import {C} from '../theme';

/** Sample measurements. Ridge + hip = 158.7 LF, the figure used in the proof scene. */
const LF: {kind: LineKind; label: string; value: number}[] = [
	{kind: 'ridge', label: 'Ridge', value: 61.9},
	{kind: 'hip', label: 'Hip', value: 96.8},
	{kind: 'valley', label: 'Valley', value: 19.8},
	{kind: 'eave', label: 'Eave', value: 186.4},
	{kind: 'rake', label: 'Rake', value: 24.6},
];

const ROOF_START = 14;
const CHIPS_AT = 96;

const Aerial: React.FC = () => {
	const frame = useCurrentFrame();
	const scan = interpolate(frame, [4, 44], [0, 1], clamp);
	return (
		<div
			style={{
				width: 580,
				height: 540,
				borderRadius: 28,
				overflow: 'hidden',
				position: 'relative',
				background: 'radial-gradient(90% 80% at 40% 40%, #2F4A3A 0%, #22362B 70%, #1A2A22 100%)',
				border: `2px solid ${C.line}`,
				boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
			}}
		>
			{/* stylised lot: street, driveway, trees */}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 56, background: '#3A4250'}} />
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 26, height: 4, background: 'repeating-linear-gradient(90deg, #C9CED6 0 26px, transparent 26px 50px)'}} />
			<div style={{position: 'absolute', left: 430, bottom: 56, width: 70, height: 104, background: '#5A6272'}} />
			{[
				[40, 40, 70],
				[500, 70, 56],
				[30, 380, 60],
				[520, 330, 44],
			].map(([x, y, r], i) => (
				<div key={i} style={{position: 'absolute', left: x - r / 2, top: y - r / 2, width: r, height: r, borderRadius: 99, background: '#2A5A36', boxShadow: 'inset -6px -6px 0 rgba(0,0,0,0.2)'}} />
			))}
			<div style={{position: 'absolute', left: 50, top: 12}}>
				<RoofOutline start={ROOF_START} size={480} />
			</div>
			{/* scan sweep */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: scan * 540 - 40,
					height: 40,
					background: 'linear-gradient(180deg, transparent, rgba(255,122,26,0.35))',
					borderBottom: `3px solid ${C.orange}`,
					opacity: scan < 1 ? 1 : 0,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 18,
					top: 18,
					padding: '8px 16px',
					borderRadius: 999,
					background: 'rgba(5,10,20,0.75)',
					fontSize: 22,
					fontWeight: 700,
					color: C.text,
					display: 'flex',
					alignItems: 'center',
					gap: 8,
				}}
			>
				<svg width="22" height="22" viewBox="0 0 24 24">
					<path d="M12 22 C12 22 4 14 4 9 a8 8 0 0 1 16 0 C20 14 12 22 12 22 Z" fill={C.orange} />
					<circle cx="12" cy="9" r="3" fill="#fff" />
				</svg>
				Sample address
			</div>
		</div>
	);
};

const Stat: React.FC<{label: string; at: number; children: React.ReactNode}> = ({label, at, children}) => (
	<Appear delay={at} x={30} y={0}>
		<div style={{padding: '22px 26px', borderRadius: 24, background: C.card, border: `2px solid ${C.line}`}}>
			<div style={{fontSize: 24, fontWeight: 800, letterSpacing: '0.12em', color: C.muted}}>{label}</div>
			<div style={{fontSize: 68, fontWeight: 800, color: C.orange, lineHeight: 1.1, marginTop: 4}}>{children}</div>
		</div>
	</Appear>
);

const LfChip: React.FC<{kind: LineKind; label: string; value: number; at: number}> = ({kind, label, value, at}) => {
	const p = usePop(at);
	return (
		<div
			style={{
				flex: 1,
				padding: '16px 10px',
				borderRadius: 20,
				background: C.card,
				border: `2px solid ${C.line}`,
				borderTop: `6px solid ${LINE_COLORS[kind]}`,
				textAlign: 'center',
				opacity: Math.min(1, p),
				transform: `translateY(${(1 - Math.min(1, p)) * 30}px) scale(${0.85 + 0.15 * p})`,
			}}
		>
			<div style={{fontSize: 24, fontWeight: 700, color: C.muted}}>{label}</div>
			<div style={{fontSize: 34, fontWeight: 800, color: C.white, marginTop: 2}}>
				<CountUp value={value} start={at} len={20} decimals={1} />
			</div>
			<div style={{fontSize: 20, fontWeight: 700, color: C.muted}}>LF</div>
		</div>
	);
};

export const StepMeasure: React.FC<{duration: number}> = ({duration}) => (
	<Scene duration={duration}>
		<Headline text="Measurements pulled *automatically*" step={2} />
		<Stage>
			<Appear delay={0} scale={0.94} y={20} style={{position: 'absolute', left: 0, top: 20}}>
				<Aerial />
			</Appear>
			<div style={{position: 'absolute', left: 610, right: 0, top: 20, display: 'flex', flexDirection: 'column', gap: 20}}>
				<Stat label="SQUARES" at={60}>
					<CountUp value={28.4} start={64} len={26} decimals={1} />
				</Stat>
				<Stat label="PITCH" at={74}>
					6/12
				</Stat>
				<Appear delay={84} x={30} y={0}>
					<div style={{fontSize: 24, fontWeight: 700, color: C.green, lineHeight: 1.3, paddingLeft: 6}}>
						✓ Aerial report
						<br />✓ No tape measure
					</div>
				</Appear>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', gap: 12}}>
				{LF.map((l, i) => (
					<LfChip key={l.kind} {...l} at={CHIPS_AT + i * 10} />
				))}
			</div>
		</Stage>
	</Scene>
);
