import React from 'react';
import {useCurrentFrame} from 'remotion';
import {usePop, useIn, useLayout} from '../anim';
import {Bot} from '../components/Bot';
import {Headline, Scene} from '../components/ui';
import {BOTS, BotId, C} from '../theme';

const ORDER: BotId[] = ['scout', 'pin', 'quill', 'echo', 'concierge'];

const Member: React.FC<{id: BotId; delay: number; size: number; width: number}> = ({id, delay, size, width}) => {
	const p = usePop(delay);
	const t = useIn(delay + 12);
	const bot = BOTS[id];
	return (
		<div style={{width, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{transform: `scale(${p}) translateY(${(1 - p) * 40}px)`, opacity: Math.min(1, p * 2)}}>
				<Bot id={id} size={size} working />
			</div>
			<div style={{opacity: t, transform: `translateY(${(1 - t) * 16}px)`, textAlign: 'center', marginTop: 22}}>
				<div style={{fontSize: 38, fontWeight: 700, color: C.ink}}>{bot.name}</div>
				<div
					style={{
						marginTop: 10,
						display: 'inline-block',
						fontSize: width < 330 ? 19 : 22,
						whiteSpace: 'nowrap',
						fontWeight: 600,
						color: bot.color,
						background: bot.soft,
						padding: '8px 16px',
						borderRadius: 999,
					}}
				>
					{bot.job}
				</div>
			</div>
		</div>
	);
};

export const S3Crew: React.FC<{duration: number}> = ({duration}) => {
	const {square} = useLayout();
	const frame = useCurrentFrame();
	const line = useIn(40);
	const size = square ? 150 : 170;
	const w = square ? 320 : 340;
	return (
		<Scene duration={duration}>
			<Headline text="Meet your team: *five assistants,* working 24/7." delay={4} top={square ? 90 : 120} />
			{!square ? (
				<svg
					style={{position: 'absolute', left: 0, top: 0, opacity: line}}
					width={1920}
					height={1080}
				>
					<path
						d="M 280 470 L 1640 470"
						stroke={C.line}
						strokeWidth="4"
						strokeDasharray="4 16"
						strokeLinecap="round"
						strokeDashoffset={-frame * 1.2}
					/>
				</svg>
			) : null}
			<div
				style={{
					position: 'absolute',
					top: square ? 300 : 370,
					left: 0,
					right: 0,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					rowGap: 50,
				}}
			>
				{ORDER.map((id, i) => (
					<Member key={id} id={id} delay={36 + i * 16} size={size} width={w} />
				))}
			</div>
			<div
				style={{
					position: 'absolute',
					bottom: square ? 40 : 90,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontSize: 30,
					color: C.inkSoft,
					fontWeight: 500,
					opacity: useIn(190),
				}}
			>
				Each one does <b style={{color: C.teal}}>one job</b> — around the clock.
			</div>
		</Scene>
	);
};
