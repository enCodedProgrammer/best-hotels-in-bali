import React from 'react';
import {interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Check, CheckCircle2, Lock, Sparkles} from 'lucide-react';
import {clamp, easeInOut, useIn, useLayout, usePop} from '../anim';
import {Bot} from '../components/Bot';
import {SanurMap} from '../components/SanurMap';
import {Appear, BeatFade, Browser, Card, Chip, Cursor, Headline, Kicker, Scene, TypeText} from '../components/ui';
import {VillaArt} from '../components/VillaArt';
import {BOTS, C, FONT_SERIF, shadow} from '../theme';

const PINS = [
	{x: 330, y: 175},
	{x: 470, y: 210},
	{x: 420, y: 330},
	{x: 540, y: 165},
	{x: 300, y: 420},
	{x: 490, y: 440},
];
const TARGET = 2;

/** Map viewBox point → screen point for an 800×560 "slice"-fitted map. */
const mapToScreen = (mx: number, my: number, left: number, top: number, w: number, h: number) => {
	const s = Math.max(w / 800, h / 560);
	const ox = (w - 800 * s) / 2;
	const oy = (h - 560 * s) / 2;
	return {x: left + ox + mx * s, y: top + oy + my * s};
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------------- Beat 1+2: map → address ---------------- */

const MapBeat: React.FC = () => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const m = interpolate(frame, [330, 390], [0, 1], {...clamp, easing: easeInOut});

	const A = square ? {l: 60, t: 270, w: 960, h: 700} : {l: 360, t: 300, w: 1200, h: 640};
	const B = square ? {l: 60, t: 250, w: 960, h: 330} : {l: 110, t: 300, w: 900, h: 640};
	const mp = {l: lerp(A.l, B.l, m), t: lerp(A.t, B.t, m), w: lerp(A.w, B.w, m), h: lerp(A.h, B.h, m)};

	const pins = PINS.map((p, i) => ({...p, at: 70 + i * 26, hot: i === TARGET && frame > 300}));
	const found = Math.min(6, pins.filter((p) => frame >= p.at).length);

	const card = square ? {l: 60, t: 610, w: 960} : {l: 1060, t: 300, w: 750};
	const addrFound = frame >= 520;
	const searching = frame >= 440 && frame < 520;

	// connector: from pin to the card's address row
	const pinPt = mapToScreen(PINS[TARGET].x, PINS[TARGET].y - 36, B.l, B.t, B.w, B.h);
	const cardPt = square ? {x: card.l + 250, y: card.t} : {x: card.l, y: card.t + 510};
	const lineP = interpolate(frame, [440, 510], [0, 1], {...clamp, easing: easeInOut});

	return (
		<>
			<div style={{position: 'absolute', top: square ? 44 : 50, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<Kicker num="01" label="New listings" delay={0} />
			</div>
			<Headline
				text="Scout finds new villas *in your areas.*"
				delay={10}
				exitAt={315}
				top={square ? 120 : 130}
				size={square ? 60 : 72}
			/>
			<Headline
				text="Pin finds the *real address.*"
				delay={335}
				top={square ? 120 : 130}
				size={square ? 60 : 72}
				accent={BOTS.pin.color}
			/>

			<SanurMap
				width={mp.w}
				height={mp.h}
				pins={pins}
				radarAt={40}
				radarCenter={{x: 410, y: 280}}
				style={{position: 'absolute', left: mp.l, top: mp.t}}
			/>

			{/* Scout status tag on the map */}
			<Appear
				delay={24}
				style={{position: 'absolute', left: mp.l + 24, top: mp.t + 24}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 14,
						background: 'rgba(255,255,255,0.95)',
						borderRadius: 22,
						padding: '10px 22px 10px 12px',
						boxShadow: shadow.md,
					}}
				>
					<Bot id="scout" size={square ? 60 : 72} working={frame < 240} />
					<div>
						<div style={{fontSize: 24, fontWeight: 700}}>Scout</div>
						<div style={{fontSize: 20, fontWeight: 600, color: C.teal}}>
							{found < 6 ? `Scanning listing sites${'.'.repeat(1 + (Math.floor(frame / 15) % 3))}` : '6 new villas in Sanur'}
						</div>
					</div>
				</div>
			</Appear>

			{/* connector line */}
			{frame >= 440 ? (
				<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
					<path
						d={`M ${pinPt.x} ${pinPt.y} C ${pinPt.x + (square ? 0 : 160)} ${pinPt.y + (square ? 60 : 0)}, ${cardPt.x - (square ? 0 : 120)} ${cardPt.y - (square ? 60 : 0)}, ${cardPt.x} ${cardPt.y}`}
						stroke={BOTS.pin.color}
						strokeWidth={4}
						strokeDasharray="10 10"
						fill="none"
						pathLength={1}
						style={{strokeDasharray: `${lineP} 1`}}
					/>
				</svg>
			) : null}

			{/* listing card */}
			<Appear
				delay={360}
				x={square ? 0 : 60}
				y={square ? 60 : 0}
				style={{position: 'absolute', left: card.l, top: card.t, width: card.w}}
			>
				<Card pad={square ? 20 : 24} style={{display: 'flex', flexDirection: square ? 'row' : 'column', gap: square ? 24 : 0}}>
					<div style={{position: 'relative'}}>
						<VillaArt variant="day" width={square ? 400 : 700} height={square ? 290 : 290} radius={16} />
						<Chip color="#fff" bg={C.teal} style={{position: 'absolute', top: 14, left: 14, fontSize: 16, letterSpacing: '0.08em'}}>
							NEW LISTING FOUND
						</Chip>
					</div>
					<div style={{flex: 1, marginTop: square ? 0 : 20}}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexDirection: square ? 'column' : 'row', gap: 4}}>
							<div style={{fontSize: square ? 28 : 32, fontWeight: 700}}>3-bed pool villa, Sanur</div>
							<div style={{fontSize: square ? 28 : 32, fontWeight: 700, color: C.goldDeep}}>$850,000</div>
						</div>
						<div style={{fontSize: 21, color: C.muted, marginTop: 6}}>Listed by another agency</div>
						<div
							style={{
								marginTop: 18,
								padding: '14px 18px',
								borderRadius: 16,
								border: `2px solid ${addrFound ? C.green : C.line}`,
								background: addrFound ? C.greenSoft : C.bg,
								display: 'flex',
								alignItems: 'center',
								gap: 14,
							}}
						>
							{addrFound ? (
								<CheckCircle2 size={30} color={C.green} strokeWidth={2.4} />
							) : (
								<Lock size={28} color={C.muted} />
							)}
							<div style={{flex: 1}}>
								<div style={{fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', color: addrFound ? C.green : C.muted}}>
									{addrFound ? 'ADDRESS FOUND BY PIN' : searching ? 'PIN IS LOOKING…' : 'ADDRESS'}
								</div>
								<div style={{fontSize: square ? 22 : 25, fontWeight: 600, color: addrFound ? C.ink : C.muted, marginTop: 2}}>
									{addrFound ? <TypeText text="Jl. Pantai Sindhu 12, Sanur" start={520} cps={50} caret={false} /> : 'Not shown on the listing'}
								</div>
							</div>
							<Bot id="pin" size={56} badge={false} working={searching} />
						</div>
					</div>
				</Card>
			</Appear>

			{/* the why */}
			<Appear
				delay={585}
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: square ? 978 : 975,
					textAlign: 'center',
				}}
			>
				<div style={{fontSize: square ? 27 : 32, fontWeight: 500, color: C.inkSoft}}>
					Agent won&apos;t let you list it? <b style={{color: C.ink}}>Go straight to the owner.</b>
				</div>
			</Appear>
		</>
	);
};

/* ---------------- Beat 3: dashboard approve ---------------- */

const Row: React.FC<{
	variant: 'day' | 'dusk' | 'garden';
	title: string;
	price: string;
	addr: string;
	primary?: boolean;
	approvedAt?: number;
	delay: number;
	compact: boolean;
	children?: React.ReactNode;
}> = ({variant, title, price, addr, primary, approvedAt, delay, compact, children}) => {
	const frame = useCurrentFrame();
	const approved = approvedAt !== undefined && frame >= approvedAt;
	const pop = usePop(approvedAt ?? 99999);
	return (
		<Appear delay={delay} y={24}>
			<div
				style={{
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					gap: 22,
					padding: 16,
					borderRadius: 20,
					background: '#fff',
					border: `2px solid ${approved ? C.green : primary ? C.teal : C.line}`,
					boxShadow: primary ? shadow.md : 'none',
					opacity: primary ? 1 : 0.7,
				}}
			>
				<VillaArt variant={variant} width={compact ? 150 : 180} height={compact ? 104 : 116} radius={12} />
				<div style={{flex: 1}}>
					<div style={{fontSize: compact ? 23 : 26, fontWeight: 700}}>{title}</div>
					<div style={{fontSize: compact ? 19 : 21, color: C.goldDeep, fontWeight: 700, marginTop: 2}}>{price}</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: compact ? 17 : 19, color: C.inkSoft}}>
						<CheckCircle2 size={20} color={C.green} /> {addr}
					</div>
				</div>
				<div
					style={{
						padding: compact ? '14px 22px' : '16px 30px',
						borderRadius: 14,
						fontSize: compact ? 21 : 24,
						fontWeight: 700,
						color: '#fff',
						background: approved ? C.green : primary ? C.teal : C.muted,
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						transform: approved ? `scale(${0.9 + 0.1 * pop})` : undefined,
					}}
				>
					{approved ? (
						<>
							<Check size={24} strokeWidth={3} /> Approved
						</>
					) : (
						'Approve'
					)}
				</div>
				{children}
			</div>
		</Appear>
	);
};

const DashboardBeat: React.FC = () => {
	const {square} = useLayout();
	const W = square ? 980 : 1440;
	const H = square ? 690 : 700;
	const click = 190;
	const toast = useIn(click + 30);
	return (
		<>
			<Headline
				text="It lands on your dashboard. *You click Approve.*"
				delay={6}
				top={square ? 70 : 90}
				size={square ? 58 : 72}
				maxWidth={square ? 900 : 1600}
			/>
			<Appear delay={10} y={60} style={{position: 'absolute', left: (square ? 1080 : 1920) / 2 - W / 2, top: square ? 300 : 260}}>
				<Browser url="dashboard.bestbalirealty.com" width={W} height={H}>
					<div style={{display: 'flex', height: '100%'}}>
						{!square ? (
							<div style={{width: 250, background: '#FBF9F5', borderRight: `1px solid ${C.line}`, padding: '28px 18px'}}>
								<div style={{fontFamily: FONT_SERIF, fontSize: 30, padding: '0 12px 24px'}}>Best Bali</div>
								{[
									['New listings', '6', true],
									['Social posts', '', false],
									['Leads', '', false],
									['Performance', '', false],
								].map(([l, n, a]) => (
									<div
										key={l as string}
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											padding: '14px 14px',
											borderRadius: 12,
											fontSize: 21,
											fontWeight: 600,
											color: a ? C.teal : C.inkSoft,
											background: a ? C.tealSoft : 'transparent',
											marginBottom: 6,
										}}
									>
										{l}
										{n ? <span>{n}</span> : null}
									</div>
								))}
							</div>
						) : null}
						<div style={{flex: 1, padding: square ? 26 : 34, position: 'relative'}}>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22}}>
								<div style={{fontSize: 30, fontWeight: 700}}>New listings</div>
								<Chip>6 found today</Chip>
							</div>
							<div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
								<Row
									variant="day"
									title="3-bed pool villa, Sanur"
									price="$850,000"
									addr="Jl. Pantai Sindhu 12, Sanur"
									primary
									approvedAt={click}
									delay={30}
									compact={square}
								>
									<Cursor
										appear={60}
										path={[
											{x: square ? 500 : 700, y: 330, at: 70},
											{x: square ? 870 : 1075, y: 88, at: click - 10},
										]}
										clickAt={click}
									/>
								</Row>
								<Row variant="dusk" title="2-bed villa, Sanur" price="$520,000" addr="Jl. Danau Poso 41, Sanur" delay={44} compact={square} />
								<Row variant="garden" title="4-bed garden villa, Sanur" price="$1,250,000" addr="Jl. Tirta Nadi 7, Sanur" delay={58} compact={square} />
							</div>
						</div>
					</div>
				</Browser>
			</Appear>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: square ? 1000 : 985,
					display: 'flex',
					justifyContent: 'center',
					opacity: toast,
					transform: `translateY(${(1 - toast) * 20}px)`,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						fontSize: 26,
						fontWeight: 600,
						color: C.inkSoft,
					}}
				>
					<Sparkles size={26} color={BOTS.quill.color} /> That&apos;s your only step. Quill takes it from here.
				</div>
			</div>
		</>
	);
};

/* ---------------- Beat 4: website auto-publish ---------------- */

const DESCRIPTION =
	'Wake up to sunrise over your own infinity pool. This light-filled three-bedroom villa sits on a quiet lane in Sanur, a short walk from Sindhu Beach and the promenade. Open-plan living, a chef’s kitchen and lush tropical gardens.';

const Photo: React.FC<{variant: 'day' | 'sunrise' | 'dusk' | 'garden'; w: number; h: number; delay: number}> = ({variant, w, h, delay}) => {
	const p = usePop(delay);
	return (
		<div
			style={{
				opacity: Math.min(1, p * 1.5),
				transform: `translate(${(1 - p) * 220}px, ${(1 - p) * 120}px) scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * 6}deg)`,
			}}
		>
			<VillaArt variant={variant} width={w} height={h} radius={14} />
		</div>
	);
};

const WebsiteBeat: React.FC = () => {
	const {square} = useLayout();
	const W = square ? 980 : 1440;
	const H = square ? 720 : 700;
	const g = square
		? {big: [540, 258], small: [370, 80]}
		: {big: [760, 360], small: [245, 140]};
	const done = useIn(300);
	return (
		<>
			<Headline
				text="Quill puts it *live on your website.*"
				delay={6}
				top={square ? 90 : 100}
				size={square ? 60 : 72}
				accent={BOTS.quill.color}
			/>
			<Appear delay={8} y={60} style={{position: 'absolute', left: (square ? 1080 : 1920) / 2 - W / 2, top: square ? 220 : 240}}>
				<Browser url="bestbalirealty.com/villas/sanur-3-bed-pool-villa" width={W} height={H}>
					<div style={{padding: '18px 34px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.line}`}}>
						<div style={{fontSize: 18, fontWeight: 700, letterSpacing: '0.3em'}}>BEST BALI REAL ESTATE</div>
						<div style={{display: 'flex', gap: 28, fontSize: 18, color: C.inkSoft, fontWeight: 500}}>
							<span>Villas</span>
							<span>Sell with us</span>
							<span>Contact</span>
						</div>
					</div>
					<div style={{display: 'flex', flexDirection: square ? 'column' : 'row', gap: square ? 20 : 36, padding: square ? '22px 30px' : '30px 34px'}}>
						<div style={{display: 'flex', flexDirection: square ? 'row' : 'column', gap: 12}}>
							<Photo variant="sunrise" w={g.big[0]} h={g.big[1]} delay={30} />
							<div style={{display: 'flex', flexDirection: square ? 'column' : 'row', gap: 12}}>
								<Photo variant="day" w={g.small[0]} h={g.small[1]} delay={48} />
								<Photo variant="garden" w={g.small[0]} h={g.small[1]} delay={62} />
								<Photo variant="dusk" w={g.small[0]} h={g.small[1]} delay={76} />
							</div>
						</div>
						<div style={{flex: 1}}>
							<Appear delay={90} y={16}>
								<Chip color={C.goldDeep} bg={C.goldSoft}>Just listed</Chip>
								<div style={{fontFamily: FONT_SERIF, fontSize: square ? 40 : 48, lineHeight: 1.05, marginTop: 14}}>
									Modern 3-Bedroom Pool Villa, Sanur
								</div>
								<div style={{fontSize: square ? 26 : 30, fontWeight: 700, color: C.goldDeep, marginTop: 10}}>$850,000</div>
								<div style={{fontSize: 19, color: C.inkSoft, marginTop: 8, fontWeight: 500}}>3 bed · 3 bath · 5 min to the beach</div>
							</Appear>
							<div style={{fontSize: square ? 18 : 21, lineHeight: 1.5, color: C.inkSoft, marginTop: square ? 12 : 18}}>
								<TypeText text={DESCRIPTION} start={120} cps={75} />
							</div>
						</div>
					</div>
				</Browser>
			</Appear>
			{/* Quill badge */}
			<Appear
				delay={24}
				pop
				scale={0.6}
				style={{position: 'absolute', left: square ? 820 : 1560, top: square ? 150 : 170}}
			>
				<Bot id="quill" size={square ? 90 : 120} working />
			</Appear>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: square ? 978 : 975,
					textAlign: 'center',
					opacity: done,
					transform: `translateY(${(1 - done) * 16}px)`,
					fontSize: square ? 28 : 32,
					fontWeight: 600,
					color: C.ink,
				}}
			>
				Photos and description, done. <span style={{color: BOTS.quill.color}}>No typing. No uploading.</span>
			</div>
		</>
	);
};

export const S4Listings: React.FC<{duration: number}> = ({duration}) => {
	const b1 = 720;
	const b2 = 350;
	return (
		<Scene duration={duration}>
			<Sequence durationInFrames={b1} layout="none">
				<BeatFade len={b1}>
					<MapBeat />
				</BeatFade>
			</Sequence>
			<Sequence from={b1} durationInFrames={b2} layout="none">
				<BeatFade len={b2}>
					<DashboardBeat />
				</BeatFade>
			</Sequence>
			<Sequence from={b1 + b2} durationInFrames={duration - b1 - b2} layout="none">
				<BeatFade len={duration - b1 - b2} last>
					<WebsiteBeat />
				</BeatFade>
			</Sequence>
		</Scene>
	);
};

