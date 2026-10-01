import React from 'react';
import {interpolate, Sequence, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, ease, useIn, usePop, useLayout, useVideoTime} from '../anim';
import {newWatch, oldWatch} from '../clock';
import {AccuScreen} from '../components/AccuScreen';
import {CountUp} from '../components/CountUp';
import {EstimateLine} from '../components/EstimateLine';
import {LINE_COLORS, LineKind, RoofOutline} from '../components/RoofOutline';
import {SideTag, SplitScreen} from '../components/SplitScreen';
import {Stopwatch} from '../components/Stopwatch';
import {Ost, Scene, StepLabel} from '../components/ui';
import {C, OLD_WAY_FILTER} from '../theme';
import {sceneStartFrame} from '../timeline';

export const NEW_STEPS = {talk: 0, measure: 85, estimate: 165};

/** Design canvas for the right panel; scaled to fit. */
const DW = 700;
const DH = 880;

/** Sample estimate: sample prices, quantities from the sample roof. */
export const LINES = [
	{item: 'Tear-off, 1 layer', qty: '28.4 SQ', price: 2272},
	{item: 'Architectural shingles', qty: '31.3 SQ', price: 4695},
	{item: 'Underlayment', qty: '3 rolls', price: 405},
	{item: 'Ridge cap', qty: '158.7 LF', price: 525},
	{item: 'Drip edge', qty: '211 LF', price: 345},
	{item: 'Step flashing', qty: '2 bundles', price: 120},
];
export const TOTAL = LINES.reduce((a, l) => a + l.price, 0);
export const LINE_START = 10;
export const LINE_GAP = 8;
export const TOTAL_AT = LINE_START + LINES.length * LINE_GAP + 6;

const TRANSCRIPT = 'Full tear-off… architectural shingles… two pipe boots… new ridge vent…'.split(' ');
const HOT = new Set([1, 3, 5, 6, 7, 9, 10]);

const Talk: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', inset: 0, padding: '130px 40px 40px', display: 'flex', flexDirection: 'column', gap: 30}}>
			<div style={{borderRadius: 26, background: C.card, border: `2px solid ${C.line}`, padding: 30, minHeight: 330, fontSize: 46, fontWeight: 800, lineHeight: 1.25}}>
				{TRANSCRIPT.map((w, i) => {
					const at = 6 + i * 6;
					if (frame < at) return null;
					const pop = interpolate(frame - at, [0, 3, 7], [1.25, 0.97, 1], clamp);
					return (
						<span key={i} style={{display: 'inline-block', marginRight: 14, color: HOT.has(i) ? C.orange : C.text, transform: `scale(${pop})`}}>
							{w}
						</span>
					);
				})}
			</div>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 90}}>
				{Array.from({length: 30}).map((_, i) => (
					<div key={i} style={{width: 9, borderRadius: 5, background: i % 2 ? C.orange : '#FFA863', height: 14 + Math.abs(Math.sin(frame * 0.4 + i) * Math.cos(frame * 0.15 + i * 0.5)) * 76}} />
				))}
			</div>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<div style={{position: 'relative', width: 150, height: 150}}>
					{[0, 15].map((o) => {
						const tt = ((frame + o) % 30) / 30;
						return <div key={o} style={{position: 'absolute', inset: 0, borderRadius: 999, border: `5px solid ${C.orange}`, transform: `scale(${1 + tt * 0.6})`, opacity: 1 - tt}} />;
					})}
					<div style={{position: 'absolute', inset: 0, borderRadius: 999, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px rgba(255,122,26,0.6)'}}>
						<div style={{width: 46, height: 46, borderRadius: 10, background: '#fff'}} />
					</div>
				</div>
			</div>
		</div>
	);
};

const MEASURES: {kind: LineKind | 'sq' | 'pitch'; label: string; value: string}[] = [
	{kind: 'sq', label: 'Squares', value: '28.4'},
	{kind: 'pitch', label: 'Pitch', value: '6/12'},
	{kind: 'ridge', label: 'Ridge', value: '61.9 LF'},
	{kind: 'hip', label: 'Hip', value: '96.8 LF'},
	{kind: 'valley', label: 'Valley', value: '19.8 LF'},
];

const Measure: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, padding: '130px 30px 30px'}}>
		<div style={{borderRadius: 26, background: 'radial-gradient(90% 80% at 40% 40%, #2F4A3A 0%, #1A2A22 100%)', height: 470, position: 'relative', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 110, top: 20}}>
				<RoofOutline start={0} size={440} />
			</div>
		</div>
		<div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 18}}>
			{MEASURES.map((m, i) => (
				<MeasureChip key={m.label} {...m} at={30 + i * 6} />
			))}
		</div>
	</div>
);

const MeasureChip: React.FC<{kind: string; label: string; value: string; at: number}> = ({kind, label, value, at}) => {
	const p = usePop(at);
	const color = kind in LINE_COLORS ? LINE_COLORS[kind as LineKind] : C.orange;
	return (
		<div
			style={{
				width: kind === 'sq' || kind === 'pitch' ? 314 : 205,
				padding: '12px 16px',
				borderRadius: 18,
				background: C.card,
				borderTop: `6px solid ${color}`,
				opacity: Math.min(1, p),
				transform: `scale(${0.7 + 0.3 * p})`,
			}}
		>
			<div style={{fontSize: 24, fontWeight: 700, color: C.muted}}>{label}</div>
			<div style={{fontSize: 40, fontWeight: 900}}>{value}</div>
		</div>
	);
};

/** The finished estimate card. Also used by the payoff scene as the card that flies in. */
export const EstimateCard: React.FC<{animate?: boolean}> = ({animate = true}) => (
	<div style={{width: 640, borderRadius: 22, background: C.paper, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
		<div style={{padding: '18px 22px', borderBottom: `3px solid ${C.ink}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
			<div style={{fontSize: 36, fontWeight: 900, color: C.ink}}>ESTIMATE</div>
			<div style={{fontSize: 20, fontWeight: 700, color: C.inkSoft}}>Sample job · sample prices</div>
		</div>
		{LINES.map((l, i) => (
			<EstimateLine key={l.item} {...l} at={animate ? LINE_START + i * LINE_GAP : -100} />
		))}
		<div style={{display: 'flex', alignItems: 'center', padding: '16px 22px', background: '#F4F6F9'}}>
			<div style={{flex: 1, fontSize: 30, fontWeight: 900, color: C.ink}}>TOTAL</div>
			<div style={{fontSize: 48, fontWeight: 900, color: C.orangeDeep}}>
				{animate ? <CountUp value={TOTAL} start={TOTAL_AT} len={30} prefix="$" /> : `$${TOTAL.toLocaleString('en-US')}`}
			</div>
		</div>
	</div>
);

const Estimate: React.FC = () => {
	const p = useIn(0);
	return (
		<div style={{position: 'absolute', left: 30, top: 130, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
			<EstimateCard />
		</div>
	);
};

const NewStep: React.FC<{text: React.ReactNode}> = ({text}) => {
	const p = usePop(0);
	return (
		<div style={{position: 'absolute', top: 40, left: 30, right: 30, zIndex: 5, opacity: Math.min(1, p), transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: 'left center'}}>
			<StepLabel tone="new" size={40}>
				{text}
			</StepLabel>
		</div>
	);
};

export const NewWay: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const t = useVideoTime(sceneStartFrame('newway'));
	const {square} = useLayout();
	const frac = interpolate(frame, [0, 14], [0.7, 0.3], {...clamp, easing: easeInOut});
	const glow = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: ease});
	return (
		<Scene duration={duration} fadeIn={false}>
			<Ost text="With *Voice-to-Estimate*" size={square ? 52 : 68} />
			<SplitScreen
				leftFrac={frac}
				left={(w, h) => (
					<>
						<AccuScreen width={w} height={h} still={{file: 'acculynx/builder-empty.png', srcT: 27.9}} filter={OLD_WAY_FILTER} kb={[1.06, 1.06]} radius={24} />
						<div style={{position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
							<Stopwatch seconds={oldWatch(t)} tone="old" size={square ? 22 : 26} />
						</div>
					</>
				)}
				right={(w, h) => {
					const s = Math.min(w / DW, h / DH);
					return (
						<div style={{position: 'absolute', inset: 0, background: `radial-gradient(100% 70% at 50% 30%, rgba(255,122,26,${0.12 * glow}) 0%, transparent 70%)`}}>
							<SideTag tone="new" />
							<div style={{position: 'absolute', left: (w - DW * s) / 2, top: (h - DH * s) / 2 + 20 * s, width: DW, height: DH, transform: `scale(${s})`, transformOrigin: '0 0'}}>
								<Sequence from={NEW_STEPS.talk} durationInFrames={NEW_STEPS.measure - NEW_STEPS.talk} layout="none">
									<NewStep text="1. Walk & talk" />
									<Talk />
								</Sequence>
								<Sequence from={NEW_STEPS.measure} durationInFrames={NEW_STEPS.estimate - NEW_STEPS.measure} layout="none">
									<NewStep text="2. Measurements pulled automatically" />
									<Measure />
								</Sequence>
								<Sequence from={NEW_STEPS.estimate} layout="none">
									<NewStep text="3. Built with YOUR prices" />
									<Estimate />
								</Sequence>
							</div>
							<div style={{position: 'absolute', bottom: 20, right: 20}}>
								<Stopwatch seconds={newWatch(t)} tone="new" size={square ? 34 : 40} />
							</div>
						</div>
					);
				}}
			/>
		</Scene>
	);
};
