import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../anim';
import {C, FONT_SANS} from '../theme';

export type MapPin = {x: number; y: number; at: number; hot?: boolean};

/** Stylised map of Sanur (coast on the east). ViewBox 800×560. */
export const SanurMap: React.FC<{
	width: number;
	height: number;
	pins: MapPin[];
	radarAt?: number;
	radarCenter?: {x: number; y: number};
	focus?: {x: number; y: number; at: number; zoom: number};
	style?: React.CSSProperties;
}> = ({width, height, pins, radarAt, radarCenter = {x: 380, y: 280}, focus, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const z = focus ? interpolate(frame, [focus.at, focus.at + 50], [1, focus.zoom], {...clamp}) : 1;
	const zp = focus ? interpolate(frame, [focus.at, focus.at + 50], [0, 1], clamp) : 0;
	const cx = focus ? 400 + (focus.x - 400) * zp : 400;
	const cy = focus ? 280 + (focus.y - 280) * zp : 280;
	const vw = 800 / z;
	const vh = 560 / z;
	const vb = `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`;
	return (
		<div
			style={{
				width,
				height,
				borderRadius: 26,
				overflow: 'hidden',
				boxShadow: '0 4px 8px rgba(20,32,31,0.05), 0 30px 70px rgba(20,32,31,0.14)',
				border: `1px solid ${C.line}`,
				...style,
			}}
		>
			<svg width="100%" height="100%" viewBox={vb} preserveAspectRatio="xMidYMid slice" style={{fontFamily: FONT_SANS}}>
				<rect x="-400" y="-400" width="1600" height="1400" fill="#F1EADD" />
				{/* sea */}
				<path
					d="M600 -400 C 580 60, 610 140, 575 230 C 548 300, 590 380, 560 460 C 540 520, 560 600, 540 1000 L1200 1000 L1200 -400 Z"
					fill="#CFE6E2"
				/>
				<path
					d="M600 -400 C 580 60, 610 140, 575 230 C 548 300, 590 380, 560 460 C 540 520, 560 600, 540 1000"
					stroke="#F7E6C4"
					strokeWidth="18"
					fill="none"
				/>
				{/* sea ripples */}
				{[120, 260, 400].map((y) => (
					<path key={y} d={`M660 ${y} q 20 -8 40 0 t 40 0`} stroke="#fff" strokeOpacity="0.8" strokeWidth="3" fill="none" strokeLinecap="round" />
				))}
				{/* parks */}
				<ellipse cx="200" cy="140" rx="90" ry="50" fill="#DDE7CC" />
				<ellipse cx="430" cy="470" rx="80" ry="40" fill="#DDE7CC" />
				{/* streets */}
				<g stroke="#fff" strokeLinecap="round" fill="none">
					<path d="M-100 520 C 150 420, 300 300, 360 -100" strokeWidth="22" />
					<path d="M-100 520 C 150 420, 300 300, 360 -100" strokeWidth="14" stroke="#F4D995" />
					{[60, 150, 240, 330, 420, 510].map((y) => (
						<path key={y} d={`M300 ${y} L ${600 - (y % 90)} ${y + 6}`} strokeWidth="8" />
					))}
					{[400, 470].map((x) => (
						<path key={x} d={`M${x} -50 L ${x + 20} 620`} strokeWidth="8" />
					))}
					<path d="M60 40 L 260 60 M40 300 L 250 320 M120 600 L 180 200" strokeWidth="7" />
				</g>
				{/* labels */}
				<text x="245" y="250" fontSize="30" fontWeight="700" letterSpacing="8" fill="#9A907F">SANUR</text>
				<text x="605" y="200" fontSize="15" fontWeight="600" fill="#6E9C96" letterSpacing="2" transform="rotate(-80 605 200)">SINDHU BEACH</text>
				<text x="630" y="330" fontSize="16" fontWeight="600" fill="#7FAEA8" letterSpacing="3">BADUNG STRAIT</text>
				<text x="150" y="145" fontSize="13" fontWeight="600" fill="#8FA27A">Park</text>

				{/* radar */}
				{radarAt !== undefined
					? [0, 40, 80].map((d) => {
							const t = ((frame - radarAt - d) % 120) / 120;
							if (frame < radarAt + d) return null;
							return (
								<circle
									key={d}
									cx={radarCenter.x}
									cy={radarCenter.y}
									r={40 + t * 340}
									fill="none"
									stroke={C.teal}
									strokeWidth={3}
									opacity={(1 - t) * 0.55}
								/>
							);
						})
					: null}

				{/* pins */}
				{pins.map((p, i) => {
					const s = spring({frame: frame - p.at, fps, config: {damping: 12, stiffness: 170}});
					if (frame < p.at) return null;
					const col = p.hot ? C.coral : C.teal;
					const pulse = p.hot ? ((frame - p.at) % 70) / 70 : 0;
					return (
						<g key={i} transform={`translate(${p.x} ${p.y})`}>
							<ellipse cx="0" cy="2" rx={10 * s} ry={4 * s} fill="#000" opacity="0.18" />
							{p.hot ? (
								<circle r={14 + pulse * 30} fill="none" stroke={C.coral} strokeWidth="3" opacity={1 - pulse} />
							) : null}
							<g transform={`translate(0 ${(1 - s) * -60}) scale(${Math.min(s, 1.15)})`}>
								<path d="M0 0 C -14 -20, -18 -28, -18 -36 A 18 18 0 1 1 18 -36 C 18 -28, 14 -20, 0 0 Z" fill={col} />
								<circle cx="0" cy="-36" r="7" fill="#fff" />
							</g>
						</g>
					);
				})}
			</svg>
		</div>
	);
};
