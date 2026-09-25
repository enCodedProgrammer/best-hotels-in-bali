import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Mail, PenLine, Search, Upload} from 'lucide-react';
import {clamp, useLayout} from '../anim';
import {Appear, Card, Headline, Scene, TypeText} from '../components/ui';
import {C} from '../theme';

const IconBubble: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div
		style={{
			width: 64,
			height: 64,
			borderRadius: 20,
			background: C.coralSoft,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		{children}
	</div>
);

const Title: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{fontSize: 30, fontWeight: 700, lineHeight: 1.2, marginTop: 22, color: C.ink}}>{children}</div>
);

const Mini: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div
		style={{
			marginTop: 22,
			height: 110,
			borderRadius: 16,
			background: C.bg,
			border: `1px solid ${C.line}`,
			padding: 18,
			position: 'relative',
			overflow: 'hidden',
		}}
	>
		{children}
	</div>
);

export const S2Today: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const cardW = square ? 440 : 380;
	const upload = interpolate(frame, [120, duration], [0.04, 0.27], clamp);
	const emails = Math.min(15, Math.max(1, Math.floor(interpolate(frame, [150, 460], [1, 15.99], clamp))));

	const cards = [
		{
			icon: <Search size={32} color={C.coral} strokeWidth={2.2} />,
			title: 'Searching for new listings',
			mini: (
				<div
					style={{
						height: 50,
						borderRadius: 12,
						background: '#fff',
						border: `1px solid ${C.line}`,
						display: 'flex',
						alignItems: 'center',
						padding: '0 16px',
						gap: 10,
						fontSize: 21,
						color: C.inkSoft,
					}}
				>
					<Search size={20} color={C.muted} />
					<TypeText text="villa sanur 3 bed…" start={90} cps={14} />
				</div>
			),
		},
		{
			icon: <Upload size={32} color={C.coral} strokeWidth={2.2} />,
			title: 'Uploading photos, one by one',
			mini: (
				<>
					<div style={{fontSize: 20, color: C.inkSoft, fontWeight: 500}}>
						photo_{String(Math.floor(upload * 60)).padStart(3, '0')}.jpg
					</div>
					<div style={{marginTop: 16, height: 12, borderRadius: 99, background: C.line}}>
						<div style={{width: `${upload * 100}%`, height: '100%', borderRadius: 99, background: C.coral}} />
					</div>
					<div style={{marginTop: 10, fontSize: 17, color: C.muted}}>{Math.round(upload * 100)}% uploaded…</div>
				</>
			),
		},
		{
			icon: <PenLine size={32} color={C.coral} strokeWidth={2.2} />,
			title: 'Writing every post yourself',
			mini: (
				<div style={{fontSize: 21, color: C.muted}}>
					Caption:
					<span style={{color: C.inkSoft}}>
						{' '}
						<TypeText text="Beautiful villa…" start={200} cps={5} />
					</span>
				</div>
			),
		},
		{
			icon: <Mail size={32} color={C.coral} strokeWidth={2.2} />,
			title: '10–15 emails for every lead',
			mini: (
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<div style={{fontSize: 64, fontWeight: 700, color: C.coral, lineHeight: 1, width: 80}}>{emails}</div>
					<div style={{fontSize: 20, color: C.inkSoft, lineHeight: 1.3}}>
						emails back and forth
						<br />
						<span style={{color: C.muted}}>…for one buyer</span>
					</div>
				</div>
			),
		},
	];

	return (
		<Scene duration={duration}>
			<Headline text="Today, every step is *done by hand.*" delay={6} top={square ? 90 : 110} accent={C.coral} />
			<div
				style={{
					position: 'absolute',
					top: square ? 260 : 330,
					left: 0,
					right: 0,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					gap: square ? 28 : 32,
					padding: square ? '0 60px' : 0,
				}}
			>
				{cards.map((c, i) => (
					<Appear key={i} delay={40 + i * 16} y={50}>
						<Card style={{width: cardW, height: square ? 340 : 370}} pad={30}>
							<IconBubble>{c.icon}</IconBubble>
							<Title>{c.title}</Title>
							<Mini>{c.mini}</Mini>
						</Card>
					</Appear>
				))}
			</div>
			{!square ? (
				<Appear delay={330} style={{position: 'absolute', top: 800, left: 0, right: 0, textAlign: 'center'}}>
					<div style={{fontSize: 34, color: C.inkSoft, fontWeight: 500}}>
						Hours of manual work, <span style={{color: C.coral, fontWeight: 700}}>every single week.</span>
					</div>
				</Appear>
			) : null}
		</Scene>
	);
};
