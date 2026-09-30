import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../anim';
import {Appear, Headline, Scene, Stage} from '../components/ui';
import {C} from '../theme';

const ROWS = [
	['Tear-off, 1 layer', '28.4', 'SQ'],
	['Shingles', '31.3', 'SQ'],
	['Underlayment', '3', 'RL'],
	['Drip edge', '23', 'PC'],
	['Ridge cap', '7', 'BD'],
	['Step flashing', '?', ''],
	['Pipe boots', '', ''],
];

const Clock: React.FC = () => {
	const frame = useCurrentFrame();
	// Ticks 10:44 → 10:47 PM over the first three seconds.
	const minute = 44 + Math.min(3, Math.floor(frame / 30));
	const flip = interpolate(frame % 30, [0, 6], [0.6, 1], clamp);
	const colon = Math.floor(frame / 15) % 2 === 0 ? 1 : 0.25;
	return (
		<div
			style={{
				padding: '22px 34px',
				borderRadius: 26,
				background: '#070D18',
				border: `2px solid ${C.line}`,
				boxShadow: '0 0 60px rgba(255,122,26,0.18)',
				display: 'flex',
				alignItems: 'baseline',
				gap: 14,
				fontVariantNumeric: 'tabular-nums',
			}}
		>
			<span style={{fontSize: 96, fontWeight: 800, color: C.orange, letterSpacing: '-0.02em'}}>
				10<span style={{opacity: colon}}>:</span>
				<span style={{display: 'inline-block', opacity: frame < 90 ? flip : 1}}>{minute}</span>
			</span>
			<span style={{fontSize: 40, fontWeight: 800, color: C.orange}}>PM</span>
		</div>
	);
};

const Sheet: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				width: 820,
				borderRadius: 22,
				background: '#101B2C',
				border: `2px solid ${C.line}`,
				overflow: 'hidden',
				boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '16px 22px', background: '#0B1422', borderBottom: `2px solid ${C.line}`}}>
				{['#EF4444', '#F59E0B', '#22C55E'].map((c) => (
					<div key={c} style={{width: 14, height: 14, borderRadius: 99, background: c, opacity: 0.7}} />
				))}
				<span style={{marginLeft: 12, fontSize: 24, color: C.muted, fontWeight: 600}}>estimate_FINAL_v3.xlsx</span>
			</div>
			<div style={{display: 'flex', padding: '10px 22px', fontSize: 22, fontWeight: 700, color: C.muted, borderBottom: `2px solid ${C.line}`}}>
				<span style={{flex: 1}}>ITEM</span>
				<span style={{width: 130}}>QTY</span>
				<span style={{width: 90}}>UNIT</span>
			</div>
			{ROWS.map(([item, qty, unit], i) => {
				const start = 6 + i * 16;
				const n = Math.max(0, Math.floor((frame - start) * 1.4));
				const typed = (item + '|' + qty + '|' + unit).slice(0, n).split('|');
				const typing = n > 0 && n < item.length + qty.length + unit.length + 2;
				return (
					<div
						key={i}
						style={{
							display: 'flex',
							padding: '12px 22px',
							fontSize: 30,
							fontWeight: 600,
							color: C.text,
							borderBottom: `1px solid rgba(43,65,99,0.6)`,
							background: typing ? 'rgba(255,122,26,0.08)' : 'transparent',
							height: 60,
						}}
					>
						<span style={{flex: 1}}>
							{typed[0]}
							{typing && typed.length === 1 ? <Caret /> : null}
						</span>
						<span style={{width: 130, color: typed[1] === '?' ? C.orange : C.text}}>{typed[1] ?? ''}</span>
						<span style={{width: 90, color: C.muted}}>{typed[2] ?? ''}</span>
					</div>
				);
			})}
		</div>
	);
};

const Caret: React.FC = () => (
	<span style={{display: 'inline-block', width: 3, height: 30, background: C.orange, marginLeft: 3, verticalAlign: -4}} />
);

export const Hook: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	// Slow push-in for a tired, late-night feel.
	const zoom = interpolate(frame, [0, duration], [1, 1.05]);
	return (
		<Scene duration={duration}>
			<Headline text="Still writing estimates at *11 PM?*" delay={2} />
			<Stage>
				<div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`}}>
					<Appear delay={0} y={60} style={{position: 'absolute', left: 70, top: 230}}>
						<Sheet />
					</Appear>
					<Appear delay={4} y={-30} scale={0.9} style={{position: 'absolute', right: 40, top: 40}}>
						<Clock />
					</Appear>
				</div>
			</Stage>
		</Scene>
	);
};

