import React from 'react';
import {usePop} from '../anim';
import {CountUp} from '../components/CountUp';
import {EstimateLine} from '../components/EstimateLine';
import {Appear, Check, Headline, Scene, Stage} from '../components/ui';
import {C} from '../theme';

/** Sample prices only, not any client's rate card. Quantities follow the sample roof (28.4 SQ, 10% waste). */
export const LINES = [
	{item: 'Architectural shingles', qty: '31.3 SQ', price: 4695},
	{item: 'Synthetic underlayment', qty: '3 rolls', price: 405},
	{item: 'Ridge cap', qty: '158.7 LF', price: 525},
	{item: 'Drip edge', qty: '211 LF', price: 345},
	{item: 'Step flashing', qty: '2 bundles', price: 120},
	{item: 'Pipe boots', qty: '2', price: 90},
	{item: 'Labor, tear-off + install', qty: '28.4 SQ', price: 7100},
];
export const TOTAL = LINES.reduce((a, l) => a + l.price, 0);

const LINE_START = 34;
const LINE_GAP = 16;
const FLASHING_AT = 168;
const TOTAL_AT = 176;
const SEND_AT = 232;

const Pill: React.FC<{children: React.ReactNode; at: number}> = ({children, at}) => {
	const p = usePop(at);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				padding: '8px 16px 8px 8px',
				borderRadius: 999,
				background: 'rgba(34,197,94,0.12)',
				border: '2px solid rgba(34,197,94,0.45)',
				fontSize: 24,
				fontWeight: 800,
				color: '#15803D',
				opacity: Math.min(1, p),
				transform: `scale(${0.7 + 0.3 * p})`,
			}}
		>
			<Check size={30} />
			{children}
		</div>
	);
};

export const StepEstimate: React.FC<{duration: number}> = ({duration}) => {
	const send = usePop(SEND_AT);
	return (
		<Scene duration={duration}>
			<Headline text="Costed estimate using *YOUR prices*" step={3} />
			<Stage>
				<Appear delay={0} y={60} style={{position: 'absolute', left: 20, right: 20, top: 0}}>
					<div style={{borderRadius: 24, background: C.paper, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>
						<div style={{padding: '24px 26px 18px', borderBottom: `3px solid ${C.ink}`}}>
							<div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
								<div style={{fontSize: 44, fontWeight: 900, color: C.ink, letterSpacing: '-0.01em'}}>ESTIMATE</div>
								<div style={{fontSize: 24, fontWeight: 700, color: C.inkSoft}}>Sample job · sample prices</div>
							</div>
							<div style={{display: 'flex', gap: 12, marginTop: 14}}>
								<Pill at={52}>Your price list</Pill>
								<Pill at={100}>Your waste factor: 10%</Pill>
							</div>
						</div>
						{LINES.map((l, i) => (
							<EstimateLine
								key={l.item}
								{...l}
								at={LINE_START + i * LINE_GAP}
								highlightFrom={l.item === 'Step flashing' ? FLASHING_AT : undefined}
							/>
						))}
						<div style={{display: 'flex', alignItems: 'center', padding: '20px 26px', background: '#F4F6F9'}}>
							<div style={{flex: 1, fontSize: 36, fontWeight: 900, color: C.ink}}>TOTAL</div>
							<div style={{fontSize: 56, fontWeight: 900, color: C.orangeDeep}}>
								<CountUp value={TOTAL} start={TOTAL_AT} len={40} prefix="$" />
							</div>
						</div>
					</div>
				</Appear>
				<div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							padding: '20px 44px',
							borderRadius: 999,
							background: C.orange,
							fontSize: 38,
							fontWeight: 800,
							boxShadow: '0 10px 30px rgba(255,122,26,0.4)',
							opacity: Math.min(1, send),
							transform: `scale(${0.6 + 0.4 * send})`,
						}}
					>
						Review &amp; send
						<svg width="36" height="36" viewBox="0 0 24 24">
							<path d="M4 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
				</div>
			</Stage>
		</Scene>
	);
};
