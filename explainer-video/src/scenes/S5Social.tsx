import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Bookmark, CheckCircle2, Heart, MessageCircle, Send} from 'lucide-react';
import {clamp, useIn, useLayout, usePop} from '../anim';
import {Bot} from '../components/Bot';
import {Appear, Card, Chip, Headline, Kicker, Phone, Scene, TypeText} from '../components/ui';
import {VillaArt} from '../components/VillaArt';
import {BOTS, C, FONT_SERIF, shadow} from '../theme';

const CAPTION =
	'Sunrise from your own infinity pool. This 3-bed villa in Sanur is five minutes from the beach. Message us for a private viewing.';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const KINDS = ['Reel', 'Photo', 'Reel', 'Story', 'Photo', 'Reel', 'Story'];
const VARS = ['sunrise', 'day', 'dusk', 'garden', 'day', 'sunrise', 'dusk'] as const;

const ToneChip: React.FC<{label: string; delay: number}> = ({label, delay}) => {
	const p = usePop(delay);
	return (
		<span style={{display: 'inline-block', transform: `scale(${p})`, opacity: Math.min(1, p * 2)}}>
			<Chip color={BOTS.echo.color} bg={BOTS.echo.soft} style={{fontSize: 20}}>
				{label}
			</Chip>
		</span>
	);
};

const DayCell: React.FC<{i: number; w: number}> = ({i, w}) => {
	const p = usePop(110 + i * 14);
	return (
		<div style={{width: w, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
			<div style={{fontSize: 18, fontWeight: 600, color: C.muted}}>{DAYS[i]}</div>
			<div
				style={{
					width: w,
					height: w * 1.35,
					borderRadius: 12,
					background: C.bg,
					border: `1.5px dashed ${C.line}`,
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<div style={{position: 'absolute', inset: 0, transform: `scale(${p})`, opacity: Math.min(1, p * 2)}}>
					<VillaArt variant={VARS[i]} width={w} height={w * 1.35} radius={12} />
				</div>
			</div>
			<div style={{fontSize: 15, fontWeight: 700, color: BOTS.echo.color, opacity: Math.min(1, p)}}>{KINDS[i]}</div>
		</div>
	);
};

const PostScreen: React.FC<{w: number}> = ({w}) => {
	const frame = useCurrentFrame();
	const inner = w * 0.94;
	const sheet = useIn(500);
	const tapAt = 600;
	const posted = frame >= tapAt + 8;
	const postedP = useIn(tapAt + 8);
	const likes = Math.round(interpolate(frame, [tapAt + 30, 880], [0, 186], clamp));
	const tap = interpolate(frame, [tapAt - 6, tapAt + 22], [0, 1], clamp);
	const imgIn = useIn(60);
	return (
		<div style={{position: 'absolute', inset: 0, paddingTop: w * 0.14, fontSize: 17}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 12px'}}>
				<div
					style={{
						width: 38,
						height: 38,
						borderRadius: 99,
						background: `linear-gradient(135deg, ${C.gold}, ${C.coral})`,
						padding: 2,
					}}
				>
					<div
						style={{
							width: '100%',
							height: '100%',
							borderRadius: 99,
							background: '#fff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONT_SERIF,
							fontSize: 16,
						}}
					>
						BB
					</div>
				</div>
				<div style={{fontWeight: 700, fontSize: 17}}>bestbalirealty</div>
			</div>
			<div style={{position: 'relative', opacity: imgIn, transform: `scale(${0.94 + 0.06 * imgIn})`}}>
				<VillaArt variant="sunrise" width={inner} height={inner} radius={0} />
				<div style={{position: 'absolute', top: 12, left: 12}}>
					<Chip color="#fff" bg="rgba(20,32,31,0.72)" style={{fontSize: 14}}>
						Photo from your website
					</Chip>
				</div>
			</div>
			<div style={{display: 'flex', gap: 16, padding: '12px 16px 6px', alignItems: 'center'}}>
				<Heart size={26} color={posted ? C.coral : C.ink} fill={posted ? C.coral : 'none'} />
				<MessageCircle size={26} />
				<Send size={26} />
				<div style={{flex: 1}} />
				<Bookmark size={26} />
			</div>
			<div style={{padding: '0 16px', fontWeight: 700, fontSize: 16, height: 22}}>
				{posted ? `${likes} likes` : ''}
			</div>
			<div style={{padding: '4px 16px', lineHeight: 1.4, color: C.ink, fontSize: w < 360 ? 15 : 17}}>
				<b>bestbalirealty </b>
				<TypeText text={CAPTION} start={150} cps={48} caret={frame < 480} />
			</div>

			{/* review sheet */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					padding: '22px 20px 30px',
					background: '#fff',
					borderTopLeftRadius: 26,
					borderTopRightRadius: 26,
					boxShadow: '0 -10px 40px rgba(0,0,0,0.14)',
					transform: `translateY(${(1 - sheet) * 110 + postedP * 110}%)`,
				}}
			>
				<div style={{fontSize: 15, fontWeight: 700, letterSpacing: '0.08em', color: C.muted}}>READY TO POST · TUE 9:00</div>
				<div style={{display: 'flex', gap: 12, marginTop: 14}}>
					<div
						style={{
							flex: 1,
							textAlign: 'center',
							padding: '14px 0',
							borderRadius: 14,
							border: `1.5px solid ${C.line}`,
							fontWeight: 700,
							fontSize: 18,
						}}
					>
						Edit
					</div>
					<div
						style={{
							flex: 1.4,
							textAlign: 'center',
							padding: '14px 0',
							borderRadius: 14,
							background: C.teal,
							color: '#fff',
							fontWeight: 700,
							fontSize: 18,
							position: 'relative',
						}}
					>
						Looks good ✓
						{frame >= tapAt - 6 ? (
							<div
								style={{
									position: 'absolute',
									left: '50%',
									top: '50%',
									width: 70,
									height: 70,
									marginLeft: -35,
									marginTop: -35,
									borderRadius: 99,
									background: 'rgba(255,255,255,0.5)',
									transform: `scale(${0.4 + tap * 1.6})`,
									opacity: 1 - tap,
								}}
							/>
						) : null}
					</div>
				</div>
			</div>

			{/* posted toast */}
			<div
				style={{
					position: 'absolute',
					left: 16,
					right: 16,
					top: w * 0.16,
					padding: '14px 16px',
					borderRadius: 16,
					background: C.green,
					color: '#fff',
					fontWeight: 700,
					fontSize: 17,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					boxShadow: shadow.md,
					opacity: postedP * interpolate(frame, [820, 850], [1, 0], clamp),
					transform: `translateY(${(1 - postedP) * -30}px)`,
				}}
			>
				<CheckCircle2 size={22} /> Posted to all your channels
			</div>
		</div>
	);
};

export const S5Social: React.FC<{duration: number}> = ({duration}) => {
	const {square} = useLayout();
	const colW = square ? 540 : 800;
	const phoneW = square ? 340 : 390;
	const left = square ? 60 : 200;
	const phoneLeft = square ? 660 : 1160;
	const cellW = square ? 62 : 92;
	return (
		<Scene duration={duration}>
			<div style={{position: 'absolute', top: square ? 44 : 50, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<Kicker num="02" label="Social media" color={BOTS.echo.color} />
			</div>
			<Headline
				text="Ray posts every day, *in your brand's voice.*"
				delay={10}
				exitAt={470}
				top={square ? 120 : 130}
				size={square ? 56 : 72}
				accent={BOTS.echo.color}
			/>
			<Headline
				text="You take a quick look. *It posts.*"
				delay={485}
				top={square ? 120 : 130}
				size={square ? 56 : 72}
				accent={BOTS.echo.color}
			/>

			<Appear delay={20} x={-40} y={0} style={{position: 'absolute', left, top: square ? 290 : 300, width: colW}}>
				<Card pad={square ? 22 : 28}>
					<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
						<Bot id="echo" size={square ? 70 : 84} working />
						<div>
							<div style={{fontSize: square ? 26 : 30, fontWeight: 700}}>Your brand voice</div>
							<div style={{fontSize: square ? 17 : 20, color: C.muted, marginTop: 2}}>Learned from bestbalirealty.com</div>
						</div>
					</div>
					<div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18}}>
						<ToneChip label="Warm" delay={50} />
						<ToneChip label="Elegant" delay={60} />
						<ToneChip label="Local expert" delay={70} />
						<ToneChip label="Never pushy" delay={80} />
					</div>
				</Card>
			</Appear>

			<Appear delay={90} x={-40} y={0} style={{position: 'absolute', left, top: square ? 560 : 580, width: colW}}>
				<Card pad={square ? 20 : 28}>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
						<div style={{fontSize: square ? 24 : 28, fontWeight: 700}}>This week&apos;s posts</div>
						<Chip color={C.green} bg={C.greenSoft} style={{fontSize: 16}}>
							Planned automatically
						</Chip>
					</div>
					<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 18}}>
						{DAYS.map((d, i) => (
							<DayCell key={d} i={i} w={cellW} />
						))}
					</div>
				</Card>
			</Appear>

			<Appear delay={40} y={80} style={{position: 'absolute', left: phoneLeft, top: square ? 270 : 240}}>
				<Phone width={phoneW}>
					<PostScreen w={phoneW} />
				</Phone>
			</Appear>
		</Scene>
	);
};
