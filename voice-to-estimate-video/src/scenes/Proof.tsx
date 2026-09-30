import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, usePop} from '../anim';
import {AppIcon} from '../components/AppIcon';
import {CountUp} from '../components/CountUp';
import {Appear, Check, Headline, Scene, Stage} from '../components/ui';
import {C} from '../theme';

/** Only the numbers that actually matched on the real job. */
const ROWS = [
	{label: 'Ridge + hip', manual: '159.1 LF', ours: 158.7, decimals: 1, unit: ' LF', checkAt: 196},
	{label: 'Step flashing', manual: '2 bundles', ours: 2, decimals: 0, unit: ' bundles', checkAt: 222},
];

const Column: React.FC<{title: string; icon: React.ReactNode; accent?: boolean; delay: number; children: React.ReactNode}> = ({
	title,
	icon,
	accent,
	delay,
	children,
}) => (
	<Appear delay={delay} y={60} style={{width: 450}}>
		<div
			style={{
				borderRadius: 28,
				background: accent ? '#1F3150' : C.surface,
				border: `3px solid ${accent ? C.orange : C.line}`,
				padding: '26px 26px 10px',
				height: 480,
				boxShadow: accent ? '0 0 60px rgba(255,122,26,0.18)' : 'none',
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 16, height: 96}}>
				{icon}
				<div style={{fontSize: 32, fontWeight: 800, lineHeight: 1.15, color: accent ? C.white : C.text}}>{title}</div>
			</div>
			{children}
		</div>
	</Appear>
);

const Value: React.FC<{label: string; children: React.ReactNode; at: number; check?: number}> = ({label, children, at, check}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
	const c = usePop(check ?? 99999);
	return (
		<div style={{marginTop: 30, paddingTop: 26, borderTop: `2px solid ${C.line}`, opacity: o}}>
			<div style={{fontSize: 26, fontWeight: 700, color: C.muted}}>{label}</div>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6}}>
				<div style={{fontSize: 56, fontWeight: 800, color: C.white, fontVariantNumeric: 'tabular-nums'}}>{children}</div>
				{check !== undefined ? (
					<div style={{transform: `scale(${c})`, opacity: Math.min(1, c)}}>
						<Check size={62} />
					</div>
				) : null}
			</div>
		</div>
	);
};

const Pencil: React.FC = () => (
	<div style={{width: 72, height: 72, borderRadius: 18, background: C.card, border: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
		<svg width="40" height="40" viewBox="0 0 24 24">
			<path d="M4 20 L5 15 L16 4 L20 8 L9 19 Z M14 6 L18 10" fill="none" stroke={C.muted} strokeWidth="2" strokeLinejoin="round" />
		</svg>
	</div>
);

export const Proof: React.FC<{duration: number}> = ({duration}) => {
	const matched = usePop(250);
	return (
		<Scene duration={duration}>
			<Headline text="Tested on a real *$21,500* job" />
			<Stage>
				<Appear delay={10} y={-20} style={{position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
					<div style={{fontSize: 28, fontWeight: 700, color: C.muted, letterSpacing: '0.1em'}}>REAL JOB · CALIFORNIA ROOFER</div>
				</Appear>
				<div style={{position: 'absolute', top: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 30}}>
					<Column title="Contractor's manual estimate" icon={<Pencil />} delay={16}>
						{ROWS.map((r, i) => (
							<Value key={r.label} label={r.label} at={40 + i * 22}>
								{r.manual}
							</Value>
						))}
					</Column>
					<Column title="Voice-to-Estimate" icon={<AppIcon size={72} />} accent delay={30}>
						{ROWS.map((r, i) => (
							<Value key={r.label} label={r.label} at={96 + i * 22} check={r.checkAt}>
								<CountUp value={r.ours} start={96 + i * 22} len={30} decimals={r.decimals} suffix={r.unit} />
							</Value>
						))}
					</Column>
				</div>
				<div style={{position: 'absolute', top: 620, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							padding: '18px 36px',
							borderRadius: 999,
							background: C.greenSoft,
							border: `3px solid ${C.green}`,
							fontSize: 40,
							fontWeight: 800,
							color: C.white,
							opacity: Math.min(1, matched),
							transform: `scale(${0.6 + 0.4 * matched})`,
						}}
					>
						<Check size={48} />
						Key numbers lined up
					</div>
				</div>
			</Stage>
		</Scene>
	);
};
