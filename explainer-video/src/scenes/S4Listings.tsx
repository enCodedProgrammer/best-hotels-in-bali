import React from 'react';
import {interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Camera, Check, CheckCircle2, Handshake, Lock, Mail, MapPin, Phone, Send, Footprints} from 'lucide-react';
import {clamp, easeInOut, useIn, useLayout, usePop} from '../anim';
import {Bot} from '../components/Bot';
import {SanurMap} from '../components/SanurMap';
import {Appear, BeatFade, Browser, Card, Chip, Cursor, Headline, Kicker, Scene, TypeText} from '../components/ui';
import {VillaArt} from '../components/VillaArt';
import {BOTS, C, FONT_SERIF, shadow} from '../theme';

const SCOUT = BOTS.scout;
const PIN = BOTS.pin;
const CONCIERGE = BOTS.concierge;
const QUILL = BOTS.quill;

const ADDRESS = 'Jl. Pantai Sindhu 12, Sanur';
const AGENT_EMAIL = 'agent@villa-agency.com';

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

const KickerRow: React.FC = () => {
	const {square} = useLayout();
	return (
		<div style={{position: 'absolute', top: square ? 44 : 50, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
			<Kicker num="01" label="New listings" delay={0} color={C.teal} />
		</div>
	);
};

/* ---------------- Beat 1: Scout finds → Pin locates ---------------- */

const MapBeat: React.FC = () => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const m = interpolate(frame, [320, 380], [0, 1], {...clamp, easing: easeInOut});

	const A = square ? {l: 60, t: 270, w: 960, h: 700} : {l: 360, t: 300, w: 1200, h: 640};
	const B = square ? {l: 60, t: 250, w: 960, h: 330} : {l: 110, t: 300, w: 900, h: 640};
	const mp = {l: lerp(A.l, B.l, m), t: lerp(A.t, B.t, m), w: lerp(A.w, B.w, m), h: lerp(A.h, B.h, m)};

	const pins = PINS.map((p, i) => ({...p, at: 70 + i * 26, hot: i === TARGET && frame > 290}));
	const found = Math.min(6, pins.filter((p) => frame >= p.at).length);

	const card = square ? {l: 60, t: 610, w: 960} : {l: 1060, t: 300, w: 750};
	const addrFound = frame >= 490;
	const searching = frame >= 420 && frame < 490;

	const pinPt = mapToScreen(PINS[TARGET].x, PINS[TARGET].y - 36, B.l, B.t, B.w, B.h);
	const cardPt = square ? {x: card.l + 250, y: card.t} : {x: card.l, y: card.t + 510};
	const lineP = interpolate(frame, [420, 485], [0, 1], {...clamp, easing: easeInOut});

	return (
		<>
			<Headline
				text={`${SCOUT.name} finds new villas *in your areas.*`}
				delay={10}
				exitAt={300}
				top={square ? 120 : 130}
				size={square ? 60 : 72}
				accent={SCOUT.color}
			/>
			<Headline
				text={`${PIN.name} finds the *exact location.*`}
				delay={320}
				top={square ? 120 : 130}
				size={square ? 60 : 72}
				accent={PIN.color}
			/>

			<SanurMap
				width={mp.w}
				height={mp.h}
				pins={pins}
				radarAt={40}
				radarCenter={{x: 410, y: 280}}
				style={{position: 'absolute', left: mp.l, top: mp.t}}
			/>

			<Appear delay={24} style={{position: 'absolute', left: mp.l + 24, top: mp.t + 24}}>
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
						<div style={{fontSize: 24, fontWeight: 700}}>{SCOUT.name}</div>
						<div style={{fontSize: 20, fontWeight: 600, color: SCOUT.color}}>
							{found < 6 ? `Scanning listing sites${'.'.repeat(1 + (Math.floor(frame / 15) % 3))}` : '6 new villas in Sanur'}
						</div>
					</div>
				</div>
			</Appear>

			{frame >= 420 ? (
				<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
					<path
						d={`M ${pinPt.x} ${pinPt.y} C ${pinPt.x + (square ? 0 : 160)} ${pinPt.y + (square ? 60 : 0)}, ${cardPt.x - (square ? 0 : 120)} ${cardPt.y - (square ? 60 : 0)}, ${cardPt.x} ${cardPt.y}`}
						stroke={PIN.color}
						strokeWidth={4}
						fill="none"
						pathLength={1}
						style={{strokeDasharray: `${lineP} 1`}}
					/>
				</svg>
			) : null}

			<Appear
				delay={345}
				x={square ? 0 : 60}
				y={square ? 60 : 0}
				style={{position: 'absolute', left: card.l, top: card.t, width: card.w}}
			>
				<Card pad={square ? 20 : 24} style={{display: 'flex', flexDirection: square ? 'row' : 'column', gap: square ? 24 : 0}}>
					<div style={{position: 'relative'}}>
						<VillaArt variant="day" width={square ? 400 : 700} height={290} radius={16} />
						<Chip color="#fff" bg={C.teal} style={{position: 'absolute', top: 14, left: 14, fontSize: 16, letterSpacing: '0.08em'}}>
							NEW LISTING FOUND
						</Chip>
					</div>
					<div style={{flex: 1, marginTop: square ? 0 : 20}}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexDirection: square ? 'column' : 'row', gap: 4}}>
							<div style={{fontSize: square ? 28 : 32, fontWeight: 700}}>3-bed pool villa, Sanur</div>
							<div style={{fontSize: square ? 28 : 32, fontWeight: 700, color: C.goldDeep}}>$850,000</div>
						</div>
						<div style={{fontSize: 21, color: C.muted, marginTop: 6}}>Listed by another agent</div>
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
							{addrFound ? <CheckCircle2 size={30} color={C.green} strokeWidth={2.4} /> : <Lock size={28} color={C.muted} />}
							<div style={{flex: 1}}>
								<div style={{fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', color: addrFound ? C.green : C.muted}}>
									{addrFound ? `EXACT LOCATION FOUND BY ${PIN.name.toUpperCase()}` : searching ? `${PIN.name.toUpperCase()} IS LOOKING…` : 'ADDRESS'}
								</div>
								<div style={{fontSize: square ? 22 : 25, fontWeight: 600, color: addrFound ? C.ink : C.muted, marginTop: 2}}>
									{addrFound ? <TypeText text={ADDRESS} start={490} cps={50} caret={false} /> : 'Not shown on the listing'}
								</div>
							</div>
							<Bot id="pin" size={56} badge={false} working={searching} />
						</div>
					</div>
				</Card>
			</Appear>
		</>
	);
};

/* ---------------- Beat 2: Concierge asks the agent for permission ---------------- */

const EMAIL_BODY =
	'Hi, we have buyers looking in Sanur. Would you be happy for Best Bali Realty to list your 3-bed pool villa too?';

const AskBeat: React.FC = () => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const sent = frame >= 330;
	const sentP = usePop(330);
	const contactHi = usePop(70);

	const listing = square ? {l: 60, t: 250, w: 960} : {l: 150, t: 290, w: 640};
	const mail = square ? {l: 60, t: 560, w: 960} : {l: 850, t: 290, w: 920};

	return (
		<>
			<Headline
				text={`${CONCIERGE.name} asks the agent *for permission to list.*`}
				delay={6}
				top={square ? 110 : 130}
				size={square ? 56 : 72}
				accent={CONCIERGE.color}
				maxWidth={square ? 940 : 1700}
			/>

			{/* the listing, with the contact details found on it */}
			<Appear delay={8} x={-40} y={0} style={{position: 'absolute', left: listing.l, top: listing.t, width: listing.w}}>
				<Card pad={square ? 18 : 24} style={{display: 'flex', flexDirection: square ? 'row' : 'column', gap: square ? 22 : 0}}>
					<VillaArt variant="day" width={square ? 300 : 592} height={square ? 230 : 250} radius={14} />
					<div style={{flex: 1, marginTop: square ? 0 : 18}}>
						<div style={{fontSize: square ? 26 : 28, fontWeight: 700}}>3-bed pool villa, Sanur</div>
						<div style={{fontSize: 19, color: C.muted, marginTop: 4}}>Listed by another agent</div>
						<div
							style={{
								marginTop: 16,
								padding: '14px 16px',
								borderRadius: 16,
								background: CONCIERGE.soft,
								border: `2px solid ${CONCIERGE.color}`,
								transform: `scale(${0.96 + 0.04 * contactHi})`,
							}}
						>
							<div style={{fontSize: 15, fontWeight: 800, letterSpacing: '0.1em', color: CONCIERGE.color}}>CONTACT FOUND ON THE LISTING</div>
							<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, fontSize: square ? 19 : 21, fontWeight: 600}}>
								<Mail size={20} color={CONCIERGE.color} /> {AGENT_EMAIL}
							</div>
							<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, fontSize: square ? 19 : 21, fontWeight: 600}}>
								<Phone size={20} color={CONCIERGE.color} /> +62 812 •••• 4471
							</div>
						</div>
					</div>
				</Card>
			</Appear>

			{/* the message Concierge writes */}
			<Appear delay={40} x={40} y={0} style={{position: 'absolute', left: mail.l, top: mail.t, width: mail.w}}>
				<Card pad={0} style={{overflow: 'hidden'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', background: CONCIERGE.color, color: '#fff'}}>
						<div style={{background: '#fff', borderRadius: 99, padding: 4}}>
							<Bot id="concierge" size={40} badge={false} working={!sent} />
						</div>
						<div style={{fontSize: 22, fontWeight: 700}}>New message · written by {CONCIERGE.name}</div>
					</div>
					<div style={{padding: square ? '16px 24px' : '22px 30px', fontSize: square ? 20 : 23}}>
						<div style={{display: 'flex', gap: 12, paddingBottom: 12, borderBottom: `1px solid ${C.line}`}}>
							<span style={{color: C.muted, width: 90}}>To</span>
							<b>{AGENT_EMAIL}</b>
						</div>
						<div style={{display: 'flex', gap: 12, padding: '12px 0', borderBottom: `1px solid ${C.line}`}}>
							<span style={{color: C.muted, width: 90}}>Subject</span>
							<b>Your 3-bed villa in Sanur</b>
						</div>
						<div style={{padding: '18px 0', lineHeight: 1.5, color: C.ink, fontSize: square ? 22 : 27, minHeight: square ? 110 : 200}}>
							<TypeText text={EMAIL_BODY} start={90} cps={55} caret={!sent} />
						</div>
						<div style={{display: 'flex', justifyContent: 'flex-end'}}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 10,
									padding: '14px 26px',
									borderRadius: 14,
									background: sent ? C.green : CONCIERGE.color,
									color: '#fff',
									fontWeight: 700,
									fontSize: 22,
									transform: sent ? `scale(${0.92 + 0.08 * sentP})` : undefined,
								}}
							>
								{sent ? <Check size={22} strokeWidth={3} /> : <Send size={20} />} {sent ? 'Sent' : 'Send'}
							</div>
						</div>
					</div>
				</Card>
			</Appear>
		</>
	);
};

/* ---------------- Beat 3: yes → click, no → visit the owner ---------------- */

const Bubble: React.FC<{text: string; at: number; fs: number}> = ({text, at, fs}) => {
	const p = useIn(at, 18);
	return (
		<div
			style={{
				alignSelf: 'flex-start',
				padding: '12px 18px',
				borderRadius: 18,
				borderBottomLeftRadius: 6,
				background: C.bgDeep,
				fontSize: fs,
				fontWeight: 500,
				opacity: p,
				transform: `translateY(${(1 - p) * 14}px)`,
			}}
		>
			<span style={{fontSize: fs * 0.75, fontWeight: 700, color: C.muted, display: 'block'}}>Agent replied</span>
			{text}
		</div>
	);
};

const PermissionButton: React.FC<{clickAt: number; compact: boolean; cursorFrom: {x: number; y: number; at: number}; cursorAt: number}> = ({
	clickAt,
	compact,
	cursorFrom,
	cursorAt,
}) => {
	const frame = useCurrentFrame();
	const done = frame >= clickAt;
	const pop = usePop(clickAt);
	return (
		<div style={{position: 'relative', alignSelf: 'flex-start'}}>
			<div
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 10,
					padding: compact ? '14px 22px' : '16px 28px',
					borderRadius: 14,
					background: done ? C.green : C.teal,
					color: '#fff',
					fontWeight: 700,
					fontSize: compact ? 21 : 24,
					transform: done ? `scale(${0.92 + 0.08 * pop})` : undefined,
					boxShadow: shadow.md,
				}}
			>
				{done ? <Check size={24} strokeWidth={3} /> : null} Permission received
			</div>
			<Cursor appear={cursorAt} path={[cursorFrom, {x: compact ? 200 : 230, y: 34, at: clickAt - 8}]} clickAt={clickAt} hideAt={clickAt + 40} />
		</div>
	);
};

const Step: React.FC<{icon: React.ReactNode; text: string; at: number; fs: number}> = ({icon, text, at, fs}) => {
	const p = usePop(at);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * -20}px)`}}>
			<div
				style={{
					width: 46,
					height: 46,
					borderRadius: 14,
					background: PIN.soft,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
				}}
			>
				{icon}
			</div>
			<div style={{fontSize: fs, fontWeight: 600}}>{text}</div>
		</div>
	);
};

const PathCard: React.FC<{
	tone: 'yes' | 'no';
	active: boolean;
	w: number;
	h: number;
	compact: boolean;
	children: React.ReactNode;
}> = ({tone, active, w, h, compact, children}) => {
	const col = tone === 'yes' ? C.green : C.coral;
	return (
		<div
			style={{
				width: w,
				height: h,
				boxSizing: 'border-box',
				borderRadius: 26,
				background: '#fff',
				border: `2px solid ${active ? col : C.line}`,
				boxShadow: active ? shadow.lg : shadow.sm,
				opacity: active ? 1 : 0.42,
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div
				style={{
					padding: compact ? '14px 22px' : '18px 28px',
					background: tone === 'yes' ? C.greenSoft : C.coralSoft,
					color: col,
					fontSize: compact ? 20 : 22,
					fontWeight: 800,
					letterSpacing: '0.1em',
				}}
			>
				{tone === 'yes' ? 'IF THE AGENT SAYS YES' : 'IF THE AGENT SAYS NO'}
			</div>
			<div style={{padding: compact ? 22 : 28, display: 'flex', flexDirection: 'column', gap: compact ? 16 : 20, flex: 1}}>{children}</div>
		</div>
	);
};

const NO_AT = 270;

const OutcomeBeat: React.FC = () => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const noActive = frame >= NO_AT;
	const fs = square ? 24 : 27;
	const w = square ? 960 : 800;
	const h = square ? 660 : 600;

	const yesCard = (
		<PathCard tone="yes" active={!noActive} w={w} h={h} compact={square}>
			<Bubble text="Yes, happy for you to list it!" at={20} fs={fs} />
			<div style={{fontSize: fs, color: C.inkSoft, lineHeight: 1.4}}>
				Your team clicks <b style={{color: C.ink}}>Permission received</b> on the dashboard.
			</div>
			<PermissionButton clickAt={170} compact={square} cursorFrom={{x: 420, y: 160, at: 90}} cursorAt={80} />
			<Appear delay={200} style={{marginTop: 'auto'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: fs, fontWeight: 600, color: QUILL.color}}>
					<Bot id="quill" size={60} badge={false} working /> {QUILL.name} takes it from here.
				</div>
			</Appear>
		</PathCard>
	);

	const noCard = (
		<PathCard tone="no" active={noActive} w={w} h={h} compact={square}>
			{frame >= NO_AT - 10 ? <Bubble text="Sorry, we're keeping this one." at={NO_AT + 10} fs={fs} /> : <div style={{height: fs * 2.6}} />}
			<Step icon={<MapPin size={24} color={PIN.color} />} text={`You have the exact address: ${ADDRESS}`} at={NO_AT + 70} fs={fs} />
			<Step icon={<Footprints size={24} color={PIN.color} />} text="Your team visits the owner directly" at={NO_AT + 120} fs={fs} />
			<Step icon={<Handshake size={24} color={PIN.color} />} text="The owner gives permission" at={NO_AT + 170} fs={fs} />
			<Step icon={<Camera size={24} color={PIN.color} />} text="Your team takes the photos" at={NO_AT + 220} fs={fs} />
			{frame >= NO_AT + 250 ? (
				<PermissionButton clickAt={NO_AT + 330} compact={square} cursorFrom={{x: 460, y: 120, at: NO_AT + 270}} cursorAt={NO_AT + 262} />
			) : null}
		</PathCard>
	);

	return (
		<>
			<Headline
				text="Agent says yes? *Click Permission received.*"
				delay={6}
				exitAt={NO_AT - 14}
				top={square ? 120 : 130}
				size={square ? 54 : 70}
				accent={C.green}
				maxWidth={square ? 940 : 1700}
			/>
			<Headline
				text="Agent says no? *Visit the owner directly.*"
				delay={NO_AT + 4}
				top={square ? 120 : 130}
				size={square ? 54 : 70}
				accent={C.coral}
				maxWidth={square ? 940 : 1700}
			/>
			{square ? (
				<>
					<div style={{position: 'absolute', left: 60, top: 280, opacity: interpolate(frame, [NO_AT - 16, NO_AT], [1, 0], clamp)}}>
						<Appear delay={4}>{yesCard}</Appear>
					</div>
					{frame >= NO_AT - 16 ? (
						<div style={{position: 'absolute', left: 60, top: 280, opacity: interpolate(frame, [NO_AT - 8, NO_AT + 8], [0, 1], clamp)}}>
							{noCard}
						</div>
					) : null}
				</>
			) : (
				<div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40}}>
					<Appear delay={4} x={-40} y={0}>
						{yesCard}
					</Appear>
					<Appear delay={14} x={40} y={0}>
						{noCard}
					</Appear>
				</div>
			)}
		</>
	);
};

/* ---------------- Beat 4: Quill builds a draft → you approve → live ---------------- */

const DESCRIPTION =
	'Wake up to sunrise over your own infinity pool. This light-filled three-bedroom villa sits on a quiet lane in Sanur, a short walk from Sindhu Beach and the promenade. Open-plan living, a chef’s kitchen and lush tropical gardens.';

const APPROVE_AT = 300;

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

const DraftBeat: React.FC = () => {
	const frame = useCurrentFrame();
	const {square} = useLayout();
	const W = square ? 980 : 1440;
	const H = square ? 740 : 690;
	const g = square ? {big: [540, 236], small: [370, 72]} : {big: [760, 360], small: [245, 132]};
	const live = frame >= APPROVE_AT;
	const liveP = usePop(APPROVE_AT);
	return (
		<>
			<Headline
				text={`${QUILL.name} builds the listing *and saves a draft.*`}
				delay={6}
				exitAt={APPROVE_AT - 30}
				top={square ? 120 : 130}
				size={square ? 56 : 72}
				accent={QUILL.color}
				maxWidth={square ? 940 : 1700}
			/>
			<Headline
				text="You click Approve. *It's live.*"
				delay={APPROVE_AT - 12}
				top={square ? 120 : 130}
				size={square ? 56 : 72}
				accent={C.green}
			/>
			<Appear delay={8} y={60} style={{position: 'absolute', left: (square ? 1080 : 1920) / 2 - W / 2, top: square ? 250 : 250}}>
				<Browser url="bestbalirealty.com/villas/sanur-3-bed-pool-villa" width={W} height={H}>
					{/* draft / live status bar */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '12px 30px',
							background: live ? C.greenSoft : C.goldSoft,
							borderBottom: `1px solid ${live ? C.green : C.gold}`,
							position: 'relative',
						}}
					>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 800, letterSpacing: '0.08em', color: live ? C.green : C.goldDeep}}>
							{live ? <CheckCircle2 size={22} /> : null}
							{live ? 'LIVE ON BESTBALIREALTY.COM' : 'DRAFT · WAITING FOR YOUR APPROVAL'}
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								padding: '10px 24px',
								borderRadius: 12,
								background: live ? C.green : C.teal,
								color: '#fff',
								fontWeight: 700,
								fontSize: 20,
								transform: live ? `scale(${0.92 + 0.08 * liveP})` : undefined,
								position: 'relative',
							}}
						>
							{live ? <Check size={20} strokeWidth={3} /> : null}
							{live ? 'Approved' : 'Approve'}
							<Cursor appear={200} path={[{x: -300, y: 200, at: 210}, {x: 70, y: 24, at: APPROVE_AT - 8}]} clickAt={APPROVE_AT} hideAt={APPROVE_AT + 40} />
						</div>
					</div>
					<div style={{display: 'flex', flexDirection: square ? 'column' : 'row', gap: square ? 18 : 36, padding: square ? '18px 30px' : '26px 34px'}}>
						<div style={{display: 'flex', flexDirection: square ? 'row' : 'column', gap: 12, position: 'relative'}}>
							<Photo variant="sunrise" w={g.big[0]} h={g.big[1]} delay={30} />
							<div style={{display: 'flex', flexDirection: square ? 'column' : 'row', gap: 12}}>
								<Photo variant="day" w={g.small[0]} h={g.small[1]} delay={48} />
								<Photo variant="garden" w={g.small[0]} h={g.small[1]} delay={62} />
								<Photo variant="dusk" w={g.small[0]} h={g.small[1]} delay={76} />
							</div>
							<Appear delay={60} style={{position: 'absolute', top: 12, left: 12}}>
								<Chip color="#fff" bg="rgba(20,32,31,0.72)" style={{fontSize: 16}}>
									<Camera size={16} /> Photos from the listing
								</Chip>
							</Appear>
						</div>
						<div style={{flex: 1}}>
							<Appear delay={90} y={16}>
								<Chip color={live ? C.green : C.goldDeep} bg={live ? C.greenSoft : C.goldSoft}>
									{live ? 'Just listed' : 'Draft'}
								</Chip>
								<div style={{fontFamily: FONT_SERIF, fontSize: square ? 38 : 46, lineHeight: 1.05, marginTop: 12}}>
									Modern 3-Bedroom Pool Villa, Sanur
								</div>
								<div style={{fontSize: square ? 25 : 29, fontWeight: 700, color: C.goldDeep, marginTop: 8}}>$850,000</div>
								<div style={{fontSize: 19, color: C.inkSoft, marginTop: 6, fontWeight: 500}}>3 bed · 3 bath · 5 min to the beach</div>
							</Appear>
							<div style={{fontSize: square ? 18 : 20, lineHeight: 1.5, color: C.inkSoft, marginTop: square ? 10 : 16}}>
								<TypeText text={DESCRIPTION} start={110} cps={80} caret={frame < 250} />
							</div>
						</div>
					</div>
				</Browser>
			</Appear>
			<Appear delay={24} pop scale={0.6} style={{position: 'absolute', left: square ? 850 : 1580, top: square ? 176 : 176}}>
				<Bot id="quill" size={square ? 84 : 110} working={!live} />
			</Appear>
		</>
	);
};

/* ---------------- Scene ---------------- */

const B1 = 660; // Scout + Pin
const B2 = 420; // Concierge asks
const B3 = 720; // yes / no paths

export const S4Listings: React.FC<{duration: number}> = ({duration}) => {
	const b4 = duration - B1 - B2 - B3;
	return (
		<Scene duration={duration}>
			<KickerRow />
			<Sequence durationInFrames={B1} layout="none">
				<BeatFade len={B1} first>
					<MapBeat />
				</BeatFade>
			</Sequence>
			<Sequence from={B1} durationInFrames={B2} layout="none">
				<BeatFade len={B2}>
					<AskBeat />
				</BeatFade>
			</Sequence>
			<Sequence from={B1 + B2} durationInFrames={B3} layout="none">
				<BeatFade len={B3}>
					<OutcomeBeat />
				</BeatFade>
			</Sequence>
			<Sequence from={B1 + B2 + B3} durationInFrames={b4} layout="none">
				<BeatFade len={b4} last>
					<DraftBeat />
				</BeatFade>
			</Sequence>
		</Scene>
	);
};
