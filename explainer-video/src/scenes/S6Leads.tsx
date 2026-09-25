import React from 'react';
import {interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Check, Flame, Home, Mail, MessageCircle} from 'lucide-react';
import {clamp, useIn, useLayout, usePop} from '../anim';
import {Bot} from '../components/Bot';
import {Appear, BeatFade, Card, Chip, Headline, Kicker, Phone, Scene} from '../components/ui';
import {BOTS, C, FONT_SERIF} from '../theme';

const CON = BOTS.concierge;

/* ---------------- Beat 1: Concierge answers ---------------- */

const EMAILS = [
	{from: 'James T.', subject: 'Is the Sanur villa still available?'},
	{from: 'Anna K.', subject: 'I would like to sell my villa'},
	{from: 'Mark D.', subject: 'Price for the 3-bed?'},
	{from: 'Priya S.', subject: 'Can I view it this weekend?'},
];

const EmailRow: React.FC<{i: number; from: string; subject: string}> = ({i, from, subject}) => {
	const frame = useCurrentFrame();
	const at = 30 + i * 22;
	const repliedAt = 150 + i * 40;
	const replied = frame >= repliedAt;
	const pop = usePop(repliedAt);
	return (
		<Appear delay={at} y={20}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					padding: '16px 18px',
					borderRadius: 16,
					background: replied ? '#fff' : C.bg,
					border: `1px solid ${C.line}`,
				}}
			>
				<div
					style={{
						width: 46,
						height: 46,
						borderRadius: 99,
						background: C.bgDeep,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontWeight: 700,
						color: C.inkSoft,
						fontSize: 18,
					}}
				>
					{from[0]}
				</div>
				<div style={{flex: 1, minWidth: 0}}>
					<div style={{fontSize: 21, fontWeight: 700}}>{from}</div>
					<div style={{fontSize: 19, color: C.inkSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{subject}</div>
				</div>
				{replied ? (
					<div style={{transform: `scale(${pop})`}}>
						<Chip color={CON.color} bg={CON.soft} style={{fontSize: 16}}>
							<Check size={16} strokeWidth={3} /> Replied
						</Chip>
					</div>
				) : null}
			</div>
		</Appear>
	);
};

const CHAT: {who: 'v' | 'c'; text: string; at: number}[] = [
	{who: 'v', text: "Hi! I'm looking for a villa in Sanur.", at: 50},
	{who: 'c', text: 'Wonderful! What budget do you have in mind?', at: 110},
	{who: 'v', text: 'Around $1.2 million.', at: 170},
	{who: 'c', text: 'And when are you hoping to buy?', at: 230},
	{who: 'v', text: 'Within the next 3 months.', at: 290},
];

const Bubble: React.FC<{who: 'v' | 'c'; text: string; at: number; fs: number}> = ({who, text, at, fs}) => {
	const frame = useCurrentFrame();
	const typing = who === 'c' && frame >= at - 30 && frame < at;
	const p = useIn(at, 18);
	if (frame < at - (who === 'c' ? 30 : 0)) return null;
	const mine = who === 'v';
	return (
		<div style={{display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 10}}>
			{!mine ? <Bot id="concierge" size={40} badge={false} /> : null}
			<div
				style={{
					maxWidth: '78%',
					padding: typing ? '16px 20px' : '13px 18px',
					borderRadius: 20,
					borderBottomRightRadius: mine ? 6 : 20,
					borderBottomLeftRadius: mine ? 20 : 6,
					background: mine ? C.ink : CON.soft,
					color: mine ? '#fff' : C.ink,
					fontSize: fs,
					lineHeight: 1.35,
					opacity: typing ? 1 : p,
					transform: typing ? undefined : `translateY(${(1 - p) * 14}px) scale(${0.96 + 0.04 * p})`,
					transformOrigin: mine ? 'right bottom' : 'left bottom',
				}}
			>
				{typing ? (
					<div style={{display: 'flex', gap: 6}}>
						{[0, 1, 2].map((d) => (
							<div
								key={d}
								style={{
									width: 9,
									height: 9,
									borderRadius: 99,
									background: CON.color,
									opacity: 0.35 + 0.65 * Math.abs(Math.sin((frame - d * 6) / 8)),
								}}
							/>
						))}
					</div>
				) : (
					text
				)}
			</div>
		</div>
	);
};

const Qual: React.FC<{label: string; value: string; at: number}> = ({label, value, at}) => {
	const p = usePop(at);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 8,
				padding: '10px 16px',
				borderRadius: 14,
				background: C.greenSoft,
				color: C.green,
				fontWeight: 700,
				fontSize: 19,
				transform: `scale(${p})`,
				opacity: Math.min(1, p * 2),
			}}
		>
			<Check size={20} strokeWidth={3} /> {label}: <span style={{color: C.ink}}>{value}</span>
		</div>
	);
};

const AnswerBeat: React.FC = () => {
	const {square} = useLayout();
	const frame = useCurrentFrame();
	const stamp = usePop(430);
	const chat = square ? {l: 70, t: 280, w: 940, h: 700} : {l: 960, t: 290, w: 790, h: 640};
	return (
		<>
			<div style={{position: 'absolute', top: square ? 44 : 50, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<Kicker num="03" label="Leads" color={CON.color} />
			</div>
			<Headline
				text="Concierge answers *every inquiry,* day or night."
				delay={10}
				top={square ? 120 : 130}
				size={square ? 56 : 72}
				accent={CON.color}
			/>

			{!square ? (
				<Appear delay={16} x={-40} y={0} style={{position: 'absolute', left: 170, top: 290, width: 740}}>
					<Card pad={26} style={{height: 640}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
							<Mail size={28} color={C.inkSoft} />
							<div style={{fontSize: 28, fontWeight: 700}}>Your inbox</div>
						</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
							{EMAILS.map((e, i) => (
								<EmailRow key={i} i={i} {...e} />
							))}
						</div>
						<Appear delay={330} style={{marginTop: 22}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, fontWeight: 600, color: CON.color}}>
								<Bot id="concierge" size={52} badge={false} working />
								Every email answered in minutes.
							</div>
						</Appear>
					</Card>
				</Appear>
			) : null}

			<Appear delay={24} y={60} style={{position: 'absolute', left: chat.l, top: chat.t, width: chat.w}}>
				<Card pad={0} style={{height: chat.h, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							padding: '16px 22px',
							background: CON.color,
							color: '#fff',
						}}
					>
						<div style={{background: '#fff', borderRadius: 99, padding: 4}}>
							<Bot id="concierge" size={40} badge={false} />
						</div>
						<div>
							<div style={{fontSize: 21, fontWeight: 700}}>Chat on bestbalirealty.com</div>
							<div style={{fontSize: 16, opacity: 0.85}}>Concierge · replies instantly</div>
						</div>
					</div>
					<div style={{flex: 1, padding: '22px 22px 0', display: 'flex', flexDirection: 'column', gap: 14}}>
						{CHAT.map((m, i) => (
							<Bubble key={i} {...m} fs={square ? 21 : 21} />
						))}
					</div>
					<div
						style={{
							padding: '16px 22px 20px',
							borderTop: `1px solid ${C.line}`,
							background: '#FBF9F5',
							display: 'flex',
							flexWrap: 'wrap',
							gap: 10,
							alignItems: 'center',
							opacity: interpolate(frame, [330, 345], [0, 1], clamp),
						}}
					>
						<Qual label="Budget" value="$1.2M" at={345} />
						<Qual label="Timing" value="3 months" at={370} />
						<Qual label="Serious" value="Yes" at={395} />
						<div
							style={{
								marginLeft: 'auto',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								padding: '10px 18px',
								borderRadius: 14,
								background: C.coral,
								color: '#fff',
								fontWeight: 800,
								fontSize: 19,
								letterSpacing: '0.08em',
								transform: `scale(${stamp}) rotate(${(1 - stamp) * -10}deg)`,
								opacity: Math.min(1, stamp * 2),
								boxShadow: `0 8px 24px ${C.coral}55`,
							}}
						>
							<Flame size={20} /> HOT LEAD
						</div>
					</div>
				</Card>
			</Appear>
		</>
	);
};

/* ---------------- Beat 2: filter + WhatsApp ---------------- */

const LEADS: {name: string; detail: string; hot?: 'buyer' | 'seller'}[] = [
	{name: 'Tom B.', detail: 'Just browsing'},
	{name: 'Sarah M.', detail: '3-bed villa · $1.2M · 3 months', hot: 'buyer'},
	{name: 'Leo R.', detail: 'Looking for a 1-week rental'},
	{name: 'Anna K.', detail: 'Wants to sell her villa in Sanur', hot: 'seller'},
	{name: 'Unknown', detail: 'No budget, no reply'},
];

const LeadRow: React.FC<{i: number; name: string; detail: string; hot?: 'buyer' | 'seller'; compact: boolean}> = ({
	i,
	name,
	detail,
	hot,
	compact,
}) => {
	const frame = useCurrentFrame();
	const sort = interpolate(frame, [110, 150], [0, 1], clamp);
	const glow = hot ? 0.5 + 0.5 * Math.sin(frame / 10) : 0;
	const col = hot === 'buyer' ? C.coral : hot === 'seller' ? C.goldDeep : C.muted;
	return (
		<Appear delay={16 + i * 12} x={-30} y={0}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					padding: compact ? '14px 16px' : '18px 22px',
					borderRadius: 18,
					background: '#fff',
					border: `2px solid ${hot ? interpolateColor(sort, C.line, col) : C.line}`,
					boxShadow: hot && sort > 0 ? `0 10px 30px ${col}${Math.round(40 + glow * 40).toString(16)}` : 'none',
					opacity: hot ? 1 : 1 - sort * 0.6,
					transform: `translateX(${hot ? sort * 20 : sort * -10}px)`,
				}}
			>
				<div
					style={{
						width: 14,
						height: 14,
						borderRadius: 99,
						background: hot ? col : C.line,
						flexShrink: 0,
					}}
				/>
				<div style={{flex: 1}}>
					<div style={{fontSize: compact ? 21 : 24, fontWeight: 700, textDecoration: !hot && sort > 0.5 ? 'line-through' : 'none'}}>{name}</div>
					<div style={{fontSize: compact ? 17 : 19, color: C.inkSoft}}>{detail}</div>
				</div>
				{sort > 0.3 ? (
					hot ? (
						<Chip color="#fff" bg={col} style={{fontSize: compact ? 14 : 16, opacity: sort}}>
							{hot === 'buyer' ? <Flame size={16} /> : <Home size={16} />} {hot === 'buyer' ? 'Hot buyer' : 'Seller'}
						</Chip>
					) : (
						<Chip color={C.muted} bg={C.bgDeep} style={{fontSize: compact ? 14 : 16, opacity: sort}}>
							Filtered out
						</Chip>
					)
				) : null}
			</div>
		</Appear>
	);
};

const interpolateColor = (t: number, a: string, b: string) => (t > 0.5 ? b : a);

const Notification: React.FC<{at: number; title: string; lines: string[]; accent: string; w: number}> = ({at, title, lines, accent, w}) => {
	const p = useIn(at, 16);
	const frame = useCurrentFrame();
	if (frame < at) return null;
	return (
		<div
			style={{
				margin: '0 12px 12px',
				padding: '16px 16px',
				borderRadius: 22,
				background: 'rgba(255,255,255,0.93)',
				boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
				transform: `translateY(${(1 - p) * -80}px) scale(${0.9 + 0.1 * p})`,
				opacity: p,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.muted, fontWeight: 600}}>
				<div
					style={{
						width: 26,
						height: 26,
						borderRadius: 7,
						background: '#25D366',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<MessageCircle size={17} color="#fff" fill="#fff" />
				</div>
				WHATSAPP
				<span style={{marginLeft: 'auto'}}>now</span>
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: w < 360 ? 18 : 20, fontWeight: 800, color: C.ink}}>
				<Flame size={20} color={accent} /> {title}
			</div>
			{lines.map((l) => (
				<div key={l} style={{fontSize: w < 360 ? 16 : 18, color: C.inkSoft, marginTop: 4, lineHeight: 1.3}}>
					{l}
				</div>
			))}
		</div>
	);
};

const WhatsAppBeat: React.FC = () => {
	const {square} = useLayout();
	const phoneW = square ? 350 : 390;
	const listW = square ? 560 : 760;
	const left = square ? 40 : 230;
	const phoneLeft = square ? 660 : 1180;
	const last = useIn(420);
	return (
		<>
			<Headline
				text="Serious buyers go *straight to your WhatsApp.*"
				delay={6}
				top={square ? 90 : 110}
				size={square ? 56 : 72}
				accent={C.coral}
				maxWidth={square ? 900 : 1600}
			/>
			<div style={{position: 'absolute', left, top: square ? 300 : 300, width: listW}}>
				<Appear delay={10}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18}}>
						<Bot id="concierge" size={square ? 56 : 64} working />
						<div style={{fontSize: square ? 23 : 27, fontWeight: 700}}>Concierge sorts every lead</div>
					</div>
				</Appear>
				<div style={{display: 'flex', flexDirection: 'column', gap: square ? 10 : 14}}>
					{LEADS.map((l, i) => (
						<LeadRow key={i} i={i} {...l} compact={square} />
					))}
				</div>
			</div>
			<Appear delay={30} y={80} style={{position: 'absolute', left: phoneLeft, top: square ? 250 : 230}}>
				<Phone width={phoneW} screen="linear-gradient(170deg, #1E4D4A 0%, #0F2A28 55%, #2A1E1A 100%)">
					<div style={{textAlign: 'center', color: '#fff', paddingTop: phoneW * 0.2}}>
						<div style={{fontSize: 18, opacity: 0.8, fontWeight: 500}}>Tuesday, 14 October</div>
						<div style={{fontSize: phoneW * 0.24, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1}}>9:41</div>
					</div>
					<div style={{marginTop: 24}}>
						<Notification
							at={190}
							accent={C.coral}
							title="Hot lead: Sarah M."
							lines={['Wants a 3-bed villa in Sanur', '$1.2M · buying within 3 months']}
							w={phoneW}
						/>
						<Notification
							at={300}
							accent={C.goldDeep}
							title="New seller: Anna K."
							lines={['Wants to list her villa in Sanur']}
							w={phoneW}
						/>
					</div>
				</Phone>
			</Appear>
			<div
				style={{
					position: 'absolute',
					top: square ? 1002 : 935,
					left: square ? 0 : 230,
					right: square ? 0 : undefined,
					textAlign: square ? 'center' : 'left',
					fontSize: square ? 26 : 32,
					fontWeight: 600,
					color: C.inkSoft,
					opacity: last,
					transform: `translateY(${(1 - last) * 16}px)`,
				}}
			>
				Name. What they want. Budget. <span style={{color: C.coral, fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: square ? 34 : 42, fontWeight: 400}}>Ready for your call.</span>
			</div>
		</>
	);
};

export const S6Leads: React.FC<{duration: number}> = ({duration}) => {
	const b1 = 560;
	return (
		<Scene duration={duration}>
			<Sequence durationInFrames={b1} layout="none">
				<BeatFade len={b1} first>
					<AnswerBeat />
				</BeatFade>
			</Sequence>
			<Sequence from={b1} durationInFrames={duration - b1} layout="none">
				<BeatFade len={duration - b1} last>
					<WhatsAppBeat />
				</BeatFade>
			</Sequence>
		</Scene>
	);
};

