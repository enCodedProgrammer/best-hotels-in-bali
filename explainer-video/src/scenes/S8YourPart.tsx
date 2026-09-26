import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Check} from 'lucide-react';
import {useIn, useLayout, usePop} from '../anim';
import {Bot} from '../components/Bot';
import {Appear, Headline, Scene} from '../components/ui';
import {BOTS, BotId, C, shadow} from '../theme';

const Task: React.FC<{text: string; sub: string; delay: number; tickAt: number; w: number}> = ({text, sub, delay, tickAt, w}) => {
	const frame = useCurrentFrame();
	const tick = usePop(tickAt);
	const done = frame >= tickAt;
	return (
		<Appear delay={delay} y={30}>
			<div
				style={{
					width: w,
					display: 'flex',
					alignItems: 'center',
					gap: 24,
					padding: '26px 30px',
					borderRadius: 26,
					background: '#fff',
					border: `2px solid ${done ? C.teal : C.line}`,
					boxShadow: shadow.md,
				}}
			>
				<div
					style={{
						width: 64,
						height: 64,
						flexShrink: 0,
						borderRadius: 18,
						border: `3px solid ${done ? C.teal : C.line}`,
						background: done ? C.teal : '#fff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{done ? (
						<div style={{transform: `scale(${tick})`}}>
							<Check size={40} color="#fff" strokeWidth={3.5} />
						</div>
					) : null}
				</div>
				<div>
					<div style={{fontSize: 32, fontWeight: 700}}>{text}</div>
					<div style={{fontSize: 21, color: C.muted, marginTop: 2}}>{sub}</div>
				</div>
			</div>
		</Appear>
	);
};

const DONE: {id: BotId; task: string}[] = [
	{id: 'scout', task: 'Finding listings'},
	{id: 'pin', task: 'Finding locations'},
	{id: 'concierge', task: 'Asking permission'},
	{id: 'quill', task: 'Building listings'},
	{id: 'echo', task: 'Creating posts'},
];

const Helper: React.FC<{id: BotId; task: string; delay: number; size: number}> = ({id, task, delay, size}) => {
	const p = usePop(delay);
	const c = usePop(delay + 16);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: size < 90 ? 200 : 300}}>
			<div style={{transform: `scale(${p})`, opacity: Math.min(1, p * 2)}}>
				<Bot id={id} size={size} badge={false} working />
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 6,
					fontSize: size < 90 ? 17 : 20,
					fontWeight: 700,
					color: BOTS[id].color,
					background: BOTS[id].soft,
					padding: '7px 12px',
					borderRadius: 999,
					whiteSpace: 'nowrap',
					transform: `scale(${c})`,
					opacity: Math.min(1, c * 2),
				}}
			>
				<Check size={18} strokeWidth={3} /> {task}
			</div>
		</div>
	);
};

export const S8YourPart: React.FC<{duration: number}> = ({duration}) => {
	const {square} = useLayout();
	const label = useIn(200);
	const size = square ? 78 : 110;
	return (
		<Scene duration={duration}>
			<Headline text="Your team's part: *a few clicks.*" delay={4} top={square ? 90 : 110} size={square ? 70 : 84} />
			<div
				style={{
					position: 'absolute',
					top: square ? 220 : 320,
					left: 0,
					right: 0,
					display: 'flex',
					flexDirection: square ? 'column' : 'row',
					alignItems: 'center',
					justifyContent: 'center',
					gap: square ? 14 : 28,
				}}
			>
				<Task text="Permission received" sub="When the agent or owner says yes" delay={20} tickAt={70} w={square ? 900 : 540} />
				<Task text="Approve" sub="To put the listing live" delay={34} tickAt={115} w={square ? 900 : 540} />
				<Task text="Review posts" sub="A quick look before they go out" delay={48} tickAt={160} w={square ? 900 : 540} />
			</div>
			<div
				style={{
					position: 'absolute',
					top: square ? 650 : 610,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontSize: square ? 30 : 34,
					fontWeight: 600,
					color: C.inkSoft,
					opacity: label,
					transform: `translateY(${(1 - label) * 16}px)`,
				}}
			>
				Everything else is <span style={{color: C.teal}}>done for you:</span>
			</div>
			<div
				style={{
					position: 'absolute',
					top: square ? 720 : 700,
					left: 0,
					right: 0,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					gap: square ? '26px 10px' : 10,
				}}
			>
				{DONE.map((d, i) => (
					<Helper key={d.id} {...d} delay={220 + i * 12} size={size} />
				))}
			</div>
		</Scene>
	);
};
