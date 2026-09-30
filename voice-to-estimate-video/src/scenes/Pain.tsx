import React from 'react';
import {useCurrentFrame} from 'remotion';
import {usePop} from '../anim';
import {Appear, Headline, Scene, Stage} from '../components/ui';
import {C} from '../theme';

const Tile: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
		<div
			style={{
				width: 262,
				height: 330,
				borderRadius: 26,
				background: C.card,
				border: `2px solid ${C.line}`,
				boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
				overflow: 'hidden',
				position: 'relative',
			}}
		>
			{children}
		</div>
		<div style={{fontSize: 32, fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: 1.15}}>{label}</div>
	</div>
);

const Pdf: React.FC = () => (
	<div style={{position: 'absolute', inset: 22, borderRadius: 10, background: C.paper, padding: 18}}>
		<div style={{display: 'inline-block', padding: '4px 12px', borderRadius: 6, background: C.red, color: '#fff', fontSize: 20, fontWeight: 800}}>PDF</div>
		<svg width="100%" height="120" viewBox="0 0 180 110" style={{marginTop: 12}}>
			<path d="M20 20 L160 20 L160 70 L130 70 L130 100 L80 100 L80 70 L20 70 Z" fill="none" stroke={C.inkSoft} strokeWidth="3" />
			<path d="M20 20 L50 45 L130 45 L160 20 M20 70 L50 45 M160 70 L130 45 M105 55 L105 100" fill="none" stroke={C.inkSoft} strokeWidth="2" />
		</svg>
		{[1, 0.8, 0.9, 0.6].map((w, i) => (
			<div key={i} style={{height: 9, width: `${w * 100}%`, borderRadius: 4, background: C.paperLine, marginTop: 10}} />
		))}
	</div>
);

const Calculator: React.FC = () => {
	const frame = useCurrentFrame();
	const keys = ['7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '%', '='];
	const pressed = Math.floor(frame / 5) % keys.length;
	return (
		<div style={{position: 'absolute', inset: 22, borderRadius: 14, background: '#0B1422', padding: 14}}>
			<div
				style={{
					height: 58,
					borderRadius: 8,
					background: '#1B2A1F',
					color: '#A7F3C0',
					fontSize: 28,
					fontWeight: 700,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-end',
					padding: '0 12px',
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				28.4×1.1=
			</div>
			<div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12}}>
				{keys.map((k, i) => (
					<div
						key={k}
						style={{
							height: 44,
							borderRadius: 8,
							background: i === pressed ? C.orange : i % 4 === 3 ? '#2B4163' : '#1C2E48',
							color: '#fff',
							fontSize: 22,
							fontWeight: 700,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{k}
					</div>
				))}
			</div>
		</div>
	);
};

const Spreadsheet: React.FC = () => {
	const frame = useCurrentFrame();
	// Endless rows scrolling up: there's always another line item.
	const offset = (frame * 2.2) % 34;
	return (
		<div style={{position: 'absolute', inset: 22, borderRadius: 10, background: C.paper, overflow: 'hidden'}}>
			<div style={{transform: `translateY(${-offset}px)`}}>
				{Array.from({length: 14}).map((_, i) => (
					<div key={i} style={{display: 'flex', gap: 6, height: 34, alignItems: 'center', padding: '0 10px', borderBottom: `1px solid ${C.paperLine}`}}>
						<div style={{height: 9, flex: 1 + ((i * 7) % 5) / 5, borderRadius: 4, background: '#CBD5E1'}} />
						<div style={{height: 9, width: 34, borderRadius: 4, background: '#CBD5E1'}} />
						<div style={{height: 9, width: 42, borderRadius: 4, background: i % 3 === 0 ? '#FDBA74' : '#CBD5E1'}} />
					</div>
				))}
			</div>
		</div>
	);
};

const Arrow: React.FC<{delay: number}> = ({delay}) => (
	<Appear delay={delay} x={-20} y={0} style={{alignSelf: 'center', marginTop: -60}}>
		<svg width="44" height="44" viewBox="0 0 24 24">
			<path d="M4 12 H19 M13 6 L19 12 L13 18" fill="none" stroke={C.orange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	</Appear>
);

export const Pain: React.FC<{duration: number}> = ({duration}) => {
	const tag = usePop(150);
	return (
		<Scene duration={duration}>
			<Headline text="Measure → calculate → *type every line item*" />
			<Stage>
				<div style={{position: 'absolute', top: 90, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12}}>
					<Appear delay={8} y={80}>
						<Tile label="Measurements">
							<Pdf />
						</Tile>
					</Appear>
					<Arrow delay={46} />
					<Appear delay={52} y={80}>
						<Tile label="Materials math">
							<Calculator />
						</Tile>
					</Appear>
					<Arrow delay={86} />
					<Appear delay={92} y={80}>
						<Tile label="Every line item">
							<Spreadsheet />
						</Tile>
					</Appear>
				</div>
				<div style={{position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 18,
							padding: '20px 40px',
							borderRadius: 999,
							border: `3px solid ${C.orange}`,
							background: C.orangeSoft,
							fontSize: 48,
							fontWeight: 800,
							color: C.white,
							opacity: Math.min(1, tag),
							transform: `scale(${0.6 + 0.4 * tag}) rotate(${(1 - tag) * -4}deg)`,
						}}
					>
						<svg width="52" height="52" viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="9" fill="none" stroke={C.orange} strokeWidth="2.5" />
							<path d="M12 7 V12 L15.5 14" fill="none" stroke={C.orange} strokeWidth="2.5" strokeLinecap="round" />
						</svg>
						Hours per job
					</div>
				</div>
			</Stage>
		</Scene>
	);
};
