import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Flame, MapPin, Send} from 'lucide-react';
import {clamp, ease, useIn, useLayout} from '../anim';
import {Headline, Scene} from '../components/ui';
import {VillaArt} from '../components/VillaArt';
import {C, shadow} from '../theme';

const FloatChip: React.FC<{
	delay: number;
	icon: React.ReactNode;
	text: string;
	x: number;
	y: number;
	tint: string;
}> = ({delay, icon, text, x, y, tint}) => {
	const frame = useCurrentFrame();
	const p = useIn(delay, 14);
	const float = Math.sin((frame + delay * 3) / 40) * 5;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				padding: '14px 22px 14px 14px',
				borderRadius: 999,
				background: 'rgba(255,255,255,0.96)',
				boxShadow: shadow.lg,
				fontSize: 24,
				fontWeight: 600,
				color: C.ink,
				opacity: Math.min(p, 1),
				transform: `translateY(${(1 - p) * 30 + float}px) scale(${0.85 + 0.15 * p})`,
				whiteSpace: 'nowrap',
			}}
		>
			<div
				style={{
					width: 40,
					height: 40,
					borderRadius: 99,
					background: tint,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{icon}
			</div>
			{text}
		</div>
	);
};

export const S1Hook: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const reveal = interpolate(frame, [6, 60], [0, 1], {...clamp, easing: ease});
	const kb = interpolate(frame, [0, duration], [1.12, 1.0], clamp);
	const markP = useIn(4);

	const imgW = square ? 940 : 1180;
	const imgH = square ? 520 : 540;
	const imgTop = square ? 170 : 150;
	const left = square ? 70 : 370;

	return (
		<Scene duration={duration}>
			{/* wordmark */}
			<div
				style={{
					position: 'absolute',
					top: square ? 78 : 64,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontSize: 22,
					fontWeight: 600,
					letterSpacing: '0.42em',
					color: C.inkSoft,
					opacity: markP,
					transform: `translateY(${(1 - markP) * 12}px)`,
				}}
			>
				BEST BALI REAL ESTATE
			</div>

			{/* hero image with inset reveal */}
			<div
				style={{
					position: 'absolute',
					left,
					top: imgTop,
					width: imgW,
					height: imgH,
					borderRadius: 32,
					overflow: 'hidden',
					boxShadow: shadow.lg,
					clipPath: `inset(${(1 - reveal) * 45}% ${(1 - reveal) * 30}% round 32px)`,
				}}
			>
				<div style={{width: '100%', height: '100%', transform: `scale(${kb})`}}>
					<VillaArt variant="sunrise" width={imgW} height={imgH} radius={0} />
				</div>
			</div>

			{/* teaser chips */}
			<FloatChip
				delay={70}
				x={square ? 40 : 250}
				y={square ? 230 : 230}
				tint={C.tealSoft}
				icon={<MapPin size={22} color={C.teal} strokeWidth={2.4} />}
				text="New villa found"
			/>
			<FloatChip
				delay={95}
				x={square ? 600 : 1330}
				y={square ? 390 : 330}
				tint={C.goldSoft}
				icon={<Send size={20} color={C.goldDeep} strokeWidth={2.4} />}
				text="Post published"
			/>
			<FloatChip
				delay={120}
				x={square ? 90 : 420}
				y={square ? 560 : 560}
				tint={C.coralSoft}
				icon={<Flame size={22} color={C.coral} strokeWidth={2.4} />}
				text="Hot lead → WhatsApp"
			/>

			<Headline
				text="Lawrence, what if your business *ran itself?*"
				delay={40}
				top={square ? 760 : 750}
				size={square ? 80 : 96}
				stagger={5}
			/>
		</Scene>
	);
};
