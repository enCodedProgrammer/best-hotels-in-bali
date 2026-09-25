import React from 'react';
import {Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Flame, MapPin, Send} from 'lucide-react';
import {clamp, ease, easeInOut, useIn, useLayout} from '../anim';
import {Headline, Scene} from '../components/ui';
import {VillaArt} from '../components/VillaArt';
import {C, shadow} from '../theme';

// His real website appears from 3s to 6s of the video:
// homepage 3.0–4.5s, then his listings page 4.5–6.0s.
const SITE_IN = 180;
const SITE_SWITCH = 270;
const SITE_OUT = 360;

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
				background: 'rgba(255,255,255,0.97)',
				boxShadow: shadow.lg,
				fontSize: 24,
				fontWeight: 600,
				color: C.ink,
				opacity: Math.min(p, 1),
				transform: `translateY(${(1 - p) * 30 + float}px) scale(${0.85 + 0.15 * p})`,
				whiteSpace: 'nowrap',
				zIndex: 5,
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

/** His real website inside a browser frame: homepage, then his listings page scrolling. */
const SiteShot: React.FC<{w: number; h: number}> = ({w, h}) => {
	const frame = useCurrentFrame();
	const bar = 46;
	const vh = h - bar;
	// homepage: slow push down from the header into the hero villa
	const homeScroll = interpolate(frame, [SITE_IN, SITE_SWITCH + 16], [0, 1], {...clamp, easing: easeInOut});
		const recP = interpolate(frame, [SITE_SWITCH - 6, SITE_SWITCH + 12], [0, 1], {...clamp, easing: easeInOut});
	const url = frame < SITE_SWITCH + 3 ? 'bestbalirealty.com' : 'bestbalirealty.com/for-sale';
	return (
		<div style={{width: w, height: h, background: '#fff', display: 'flex', flexDirection: 'column'}}>
			<div
				style={{
					height: bar,
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					gap: 9,
					padding: '0 18px',
					background: '#FBF9F5',
					borderBottom: `1px solid ${C.line}`,
				}}
			>
				{['#E8766A', '#E9BC5B', '#6CC17C'].map((c) => (
					<div key={c} style={{width: 12, height: 12, borderRadius: 99, background: c}} />
				))}
				<div
					style={{
						marginLeft: 14,
						height: 28,
						borderRadius: 9,
						background: C.bgDeep,
						display: 'flex',
						alignItems: 'center',
						padding: '0 14px',
						fontSize: 16,
						fontWeight: 500,
						color: C.inkSoft,
					}}
				>
					{url}
				</div>
			</div>
			<div style={{flex: 1, overflow: 'hidden', position: 'relative', background: '#1F3A6B'}}>
				{/* homepage screenshot (1363×892) */}
				<Img
					src={staticFile('bbr-site-home.webp')}
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: '100%',
												transform: `translateY(${-homeScroll * (w * (892 / 1363) - vh) * 0.9}px)`,
						opacity: 1 - recP,
					}}
				/>
				{/* his listings page, from the screen recording */}
				{frame >= SITE_SWITCH - 8 ? (
					<Sequence from={SITE_SWITCH - 8} layout="none">
						<OffthreadVideo
							src={staticFile('bbr-site-listings.mp4')}
							muted
							playbackRate={0.8}
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								// crop into the centred content column of the page
								width: w * 1.25,
								transform: 'translate(-50%, -50%)',
								opacity: recP,
							}}
						/>
					</Sequence>
				) : null}
			</div>
		</div>
	);
};

export const S1Hook: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const reveal = interpolate(frame, [6, 60], [0, 1], {...clamp, easing: ease});
	const kb = interpolate(frame, [0, duration], [1.12, 1.0], clamp);
	const markP = useIn(4);

	// crossfade illustration → website, and back out at 6s
	const siteP =
		interpolate(frame, [SITE_IN - 12, SITE_IN + 10], [0, 1], {...clamp, easing: easeInOut}) *
		interpolate(frame, [SITE_OUT - 8, SITE_OUT + 14], [1, 0], {...clamp, easing: easeInOut});

	const imgW = square ? 940 : 1180;
	const imgH = square ? 520 : 540;
	const imgTop = square ? 200 : 190;
	const left = square ? 70 : 370;
	const logoH = square ? 120 : 140;

	// chips pop in as the site hands back to the illustration
	const c0 = SITE_OUT - 10;

	return (
		<Scene duration={duration}>
			{/* Best Bali Realty logo */}
			<div
				style={{
					position: 'absolute',
					top: square ? 42 : 30,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					opacity: markP,
					transform: `translateY(${(1 - markP) * 12}px)`,
				}}
			>
				<Img src={staticFile('bbr-logo.png')} style={{height: logoH}} />
			</div>

			{/* hero slot: illustration, then his real website */}
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
				<div style={{position: 'absolute', inset: 0, transform: `scale(${kb})`}}>
					<VillaArt variant="sunrise" width={imgW} height={imgH} radius={0} />
				</div>
				{siteP > 0 ? (
					<div
						style={{
							position: 'absolute',
							inset: 0,
							opacity: siteP,
							transform: `scale(${1.06 - 0.06 * siteP})`,
							filter: `blur(${(1 - siteP) * 6}px)`,
						}}
					>
						<SiteShot w={imgW} h={imgH} />
					</div>
				) : null}
			</div>

			{/* teaser chips */}
			<FloatChip
				delay={c0}
				x={square ? 30 : 230}
				y={square ? 250 : 250}
				tint={C.tealSoft}
				icon={<MapPin size={22} color={C.teal} strokeWidth={2.4} />}
				text="New villa found"
			/>
			<FloatChip
				delay={c0 + 12}
				x={square ? 610 : 1340}
				y={square ? 410 : 350}
				tint={C.goldSoft}
				icon={<Send size={20} color={C.goldDeep} strokeWidth={2.4} />}
				text="Post published"
			/>
			<FloatChip
				delay={c0 + 24}
				x={square ? 80 : 400}
				y={square ? 590 : 580}
				tint={C.coralSoft}
				icon={<Flame size={22} color={C.coral} strokeWidth={2.4} />}
				text="Hot lead → WhatsApp"
			/>

			<Headline
				text="Lawrence, what if your business *ran itself?*"
				delay={40}
				top={square ? 790 : 780}
				size={square ? 80 : 96}
				stagger={5}
			/>
		</Scene>
	);
};
