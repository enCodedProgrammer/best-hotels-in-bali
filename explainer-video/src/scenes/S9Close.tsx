import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, ease, useIn, useLayout, usePop} from '../anim';
import {Bot} from '../components/Bot';
import {Headline, Scene} from '../components/ui';
import {BotId, C, FONT_SERIF} from '../theme';

const LOGO = staticFile('pixel-island-logo.png');
const ORDER: BotId[] = ['scout', 'pin', 'quill', 'echo', 'concierge'];

export const S9Close: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const logo = usePop(8);
	const word = useIn(40);
	const sub = useIn(62);
	const bots = useIn(150);
	const shine = interpolate(frame, [30, 90], [-0.6, 1.6], {...clamp, easing: ease});
	const glow = interpolate(frame, [0, 60], [0, 1], clamp);
	const L = square ? 250 : 270;
	const top = square ? 150 : 110;

	return (
		<Scene duration={duration} dark noFadeOut>
			{/* warm glow behind the logo */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: top + L / 2,
					width: 900,
					height: 900,
					marginLeft: -450,
					marginTop: -450,
					borderRadius: 999,
					background: `radial-gradient(circle, ${C.gold}40 0%, ${C.gold}10 35%, transparent 65%)`,
					opacity: glow,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top,
					width: L,
					height: L,
					marginLeft: -L / 2,
					transform: `scale(${0.6 + 0.4 * logo}) rotate(${(1 - logo) * -8}deg)`,
					opacity: Math.min(1, logo * 1.5),
				}}
			>
				<Img src={LOGO} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
				{/* shine sweep, masked to the logo shape */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						WebkitMaskImage: `url(${LOGO})`,
						WebkitMaskSize: 'contain',
						WebkitMaskRepeat: 'no-repeat',
						WebkitMaskPosition: 'center',
						background: `linear-gradient(115deg, transparent ${(shine - 0.2) * 100}%, rgba(255,255,255,0.85) ${shine * 100}%, transparent ${(shine + 0.2) * 100}%)`,
						mixBlendMode: 'screen',
					}}
				/>
			</div>

			<div
				style={{
					position: 'absolute',
					top: top + L + 40,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: FONT_SERIF,
					fontSize: square ? 104 : 120,
					lineHeight: 1,
					color: '#fff',
					opacity: word,
					transform: `translateY(${(1 - word) * 24}px)`,
					letterSpacing: '-0.01em',
				}}
			>
				Pixel Island
			</div>
			<div
				style={{
					position: 'absolute',
					top: top + L + (square ? 170 : 190),
					left: 0,
					right: 0,
					textAlign: 'center',
					fontSize: square ? 24 : 26,
					fontWeight: 600,
					letterSpacing: '0.3em',
					color: 'rgba(255,255,255,0.6)',
					opacity: sub,
				}}
			>
				FOR BEST BALI REAL ESTATE
			</div>
			<Headline
				text="*Let's get started.*"
				delay={95}
				top={top + L + (square ? 240 : 260)}
				size={square ? 76 : 84}
				color="#fff"
				accent={C.gold}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: square ? 36 : 44,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					gap: 30,
					opacity: bots * 0.9,
					transform: `translateY(${(1 - bots) * 20}px)`,
				}}
			>
				{ORDER.map((id) => (
					<Bot key={id} id={id} size={square ? 56 : 64} badge={false} />
				))}
			</div>
		</Scene>
	);
};
