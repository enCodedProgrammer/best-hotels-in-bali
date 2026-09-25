import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Flame, Lightbulb} from 'lucide-react';
import {clamp, ease, useLayout} from '../anim';
import {Appear, Browser, Chip, Headline, Kicker, Scene} from '../components/ui';
import {C, FONT_SERIF} from '../theme';

const Count: React.FC<{to: number; start: number}> = ({to, start}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [start, start + 50], [0, to], {...clamp, easing: ease});
	return <>{Math.round(v)}</>;
};

const Kpi: React.FC<{label: string; value: number; color: string; delay: number; compact: boolean}> = ({
	label,
	value,
	color,
	delay,
	compact,
}) => (
	<Appear delay={delay} y={20} style={{flex: 1}}>
		<div
			style={{
				padding: compact ? '16px 20px' : '20px 26px',
				borderRadius: 18,
				border: `1px solid ${C.line}`,
				background: '#fff',
			}}
		>
			<div style={{fontSize: compact ? 17 : 19, color: C.muted, fontWeight: 600}}>{label}</div>
			<div style={{fontSize: compact ? 48 : 60, fontWeight: 700, color, lineHeight: 1.1, marginTop: 4}}>
				<Count to={value} start={delay + 10} />
			</div>
		</div>
	</Appear>
);

const BARS = [
	{label: 'Villa tour reels', v: 0.92, c: C.teal},
	{label: 'Photo posts', v: 0.61, c: C.teal},
	{label: 'Stories', v: 0.38, c: C.teal},
	{label: 'Website visits', v: 0.7, c: C.gold},
];

const Bars: React.FC<{compact: boolean}> = ({compact}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: compact ? 14 : 20}}>
			{BARS.map((b, i) => {
				const p = interpolate(frame, [70 + i * 10, 130 + i * 10], [0, 1], {...clamp, easing: ease});
				return (
					<div key={b.label}>
						<div style={{display: 'flex', justifyContent: 'space-between', fontSize: compact ? 17 : 19, fontWeight: 600, color: C.inkSoft}}>
							<span>{b.label}</span>
							<span style={{color: C.ink}}>{Math.round(b.v * p * 100)}</span>
						</div>
						<div style={{marginTop: 8, height: compact ? 12 : 14, borderRadius: 99, background: C.bgDeep}}>
							<div style={{width: `${b.v * p * 100}%`, height: '100%', borderRadius: 99, background: b.c}} />
						</div>
					</div>
				);
			})}
		</div>
	);
};

const HOT = [
	{name: 'Sarah M.', what: '3-bed villa', budget: '$1.2M'},
	{name: 'David L.', what: 'Beachfront villa', budget: '$2.4M'},
	{name: 'Anna K.', what: 'Wants to sell', budget: 'Seller'},
];

export const S7Dashboard: React.FC<{duration: number}> = ({duration}) => {
	const {square} = useLayout();
	const W = square ? 980 : 1480;
	const H = square ? 740 : 720;
	const pad = square ? 24 : 34;
	return (
		<Scene duration={duration}>
			<div style={{position: 'absolute', top: square ? 44 : 50, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<Kicker num="04" label="Your dashboard" color={C.goldDeep} />
			</div>
			<Headline
				text="One simple screen. *Everything that matters.*"
				delay={10}
				top={square ? 120 : 130}
				size={square ? 56 : 72}
				accent={C.goldDeep}
			/>
			<Appear delay={16} y={70} style={{position: 'absolute', left: (square ? 1080 : 1920) / 2 - W / 2, top: square ? 300 : 290}}>
				<Browser url="dashboard.bestbalirealty.com" width={W} height={H}>
					<div style={{padding: pad, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: square ? 16 : 22}}>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
							<div style={{fontFamily: FONT_SERIF, fontSize: square ? 36 : 42}}>Good morning, Lawrence</div>
							<Chip color={C.inkSoft} bg={C.bgDeep} style={{fontSize: 16}}>
								This week · example data
							</Chip>
						</div>
						<div style={{display: 'flex', gap: square ? 12 : 18}}>
							<Kpi label="New listings found" value={12} color={C.teal} delay={30} compact={square} />
							<Kpi label="Posts published" value={21} color={C.goldDeep} delay={40} compact={square} />
							<Kpi label="Hot leads" value={4} color={C.coral} delay={50} compact={square} />
						</div>
						<div style={{display: 'flex', gap: square ? 14 : 22, flex: 1, minHeight: 0}}>
							<Appear delay={60} y={20} style={{flex: 1.15}}>
								<div style={{height: '100%', boxSizing: 'border-box', padding: square ? 18 : 24, borderRadius: 18, border: `1px solid ${C.line}`}}>
									<div style={{fontSize: square ? 20 : 23, fontWeight: 700, marginBottom: square ? 14 : 20}}>What&apos;s working</div>
									<Bars compact={square} />
								</div>
							</Appear>
							<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: square ? 12 : 18}}>
								<Appear delay={150} y={20} x={30}>
									<div
										style={{
											padding: square ? 16 : 22,
											borderRadius: 18,
											background: C.goldSoft,
											border: `1.5px solid ${C.gold}`,
											display: 'flex',
											gap: 14,
										}}
									>
										<Lightbulb size={30} color={C.goldDeep} style={{flexShrink: 0}} />
										<div>
											<div style={{fontSize: 15, fontWeight: 800, letterSpacing: '0.1em', color: C.goldDeep}}>SUGGESTED CHANGE</div>
											<div style={{fontSize: square ? 18 : 21, fontWeight: 600, marginTop: 4, lineHeight: 1.35}}>
												Villa tour reels get the most views. Post two more this week.
											</div>
										</div>
									</div>
								</Appear>
								<Appear delay={190} y={20} x={30} style={{flex: 1}}>
									<div style={{padding: square ? 16 : 20, borderRadius: 18, border: `1px solid ${C.line}`, height: '100%', boxSizing: 'border-box'}}>
										<div style={{fontSize: square ? 18 : 21, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8}}>
											<Flame size={22} color={C.coral} /> Hot leads
										</div>
										{HOT.map((h, i) => (
											<Appear key={h.name} delay={205 + i * 12} y={10}>
												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														padding: square ? '8px 0' : '11px 0',
														borderBottom: i < 2 ? `1px solid ${C.line}` : 'none',
														fontSize: square ? 17 : 19,
													}}
												>
													<span>
														<b>{h.name}</b> <span style={{color: C.muted}}>· {h.what}</span>
													</span>
													<b style={{color: h.budget === 'Seller' ? C.goldDeep : C.coral}}>{h.budget}</b>
												</div>
											</Appear>
										))}
									</div>
								</Appear>
							</div>
						</div>
					</div>
				</Browser>
			</Appear>
		</Scene>
	);
};
