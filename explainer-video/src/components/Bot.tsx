import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Feather, MapPin, Megaphone, MessageCircleHeart, Search} from 'lucide-react';
import {BOTS, BotId, C} from '../theme';

const ICONS: Record<BotId, React.FC<{size?: number; color?: string; strokeWidth?: number}>> = {
	scout: Search,
	pin: MapPin,
	quill: Feather,
	echo: Megaphone,
	concierge: MessageCircleHeart,
};

const PHASE: Record<BotId, number> = {scout: 0, pin: 37, quill: 74, echo: 111, concierge: 148};

export const Bot: React.FC<{
	id: BotId;
	size?: number;
	working?: boolean;
	badge?: boolean;
	style?: React.CSSProperties;
}> = ({id, size = 120, working, badge = true, style}) => {
	const frame = useCurrentFrame();
	const bot = BOTS[id];
	const ph = PHASE[id];
	const bob = Math.sin(((frame + ph) / 60) * Math.PI * 0.9) * 4;
	const cyc = (frame + ph * 3) % 200;
	const blink = cyc > 190 ? 0.12 : 1;
	const look = working ? Math.sin((frame / 60) * Math.PI * 1.6) * 4 : 0;
	const glow = 0.55 + 0.45 * Math.sin(((frame + ph) / 60) * Math.PI * 1.5);
	const Icon = ICONS[id];
	const s = size / 120;
	return (
		<div style={{width: size, height: size * 1.12, position: 'relative', ...style}}>
			<div style={{position: 'absolute', inset: 0, transform: `translateY(${bob * s}px)`}}>
				<svg width={size} height={size * 1.12} viewBox="0 0 120 134">
					<defs>
						<linearGradient id={`body-${id}`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor={bot.color} stopOpacity="0.88" />
							<stop offset="1" stopColor={bot.color} />
						</linearGradient>
					</defs>
					{/* antenna */}
					<line x1="60" y1="30" x2="60" y2="13" stroke={bot.color} strokeWidth="4" strokeLinecap="round" />
					<circle cx="60" cy="10" r={9} fill={C.gold} opacity={0.25 * glow} />
					<circle cx="60" cy="10" r="5.5" fill={C.gold} />
					{/* ears */}
					<rect x="3" y="62" width="12" height="28" rx="6" fill={bot.color} />
					<rect x="105" y="62" width="12" height="28" rx="6" fill={bot.color} />
					{/* body */}
					<rect x="10" y="28" width="100" height="100" rx="34" fill={`url(#body-${id})`} />
					<rect x="10" y="28" width="100" height="50" rx="34" fill="#fff" opacity="0.08" />
					{/* face screen */}
					<rect x="22" y="44" width="76" height="56" rx="22" fill={C.night} />
					{/* eyes */}
					<g transform={`translate(${look} 0)`}>
						<rect x="40" y={72 - 10 * blink} width="11" height={20 * blink} rx="5.5" fill="#fff" />
						<rect x="69" y={72 - 10 * blink} width="11" height={20 * blink} rx="5.5" fill="#fff" />
					</g>
					{/* cheeks */}
					<circle cx="32" cy="88" r="4" fill={bot.color} opacity="0.7" />
					<circle cx="88" cy="88" r="4" fill={bot.color} opacity="0.7" />
					{/* belly light */}
					<rect x="46" y="110" width="28" height="6" rx="3" fill="#fff" opacity={0.35 + 0.35 * glow} />
				</svg>
				{badge ? (
					<div
						style={{
							position: 'absolute',
							right: -6 * s,
							bottom: 0,
							width: 44 * s,
							height: 44 * s,
							borderRadius: 99,
							background: '#fff',
							border: `${3 * s}px solid ${bot.color}`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
						}}
					>
						<Icon size={22 * s} color={bot.color} strokeWidth={2.4} />
					</div>
				) : null}
			</div>
		</div>
	);
};

/** Bot with a name tag beside it — used as a scene "who's doing this" marker. */
export const BotTag: React.FC<{id: BotId; size?: number; line?: string; working?: boolean}> = ({
	id,
	size = 84,
	line,
	working,
}) => {
	const bot = BOTS[id];
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
			<Bot id={id} size={size} working={working} />
			<div>
				<div style={{fontSize: 30, fontWeight: 700, color: C.ink}}>{bot.name}</div>
				<div style={{fontSize: 21, fontWeight: 500, color: bot.color}}>{line ?? bot.job}</div>
			</div>
		</div>
	);
};
