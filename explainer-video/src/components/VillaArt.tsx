import React from 'react';

type Variant = 'sunrise' | 'day' | 'dusk' | 'garden';

const PAL: Record<Variant, {sky: [string, string]; sun: string; win: string; sea: string; ground: string}> = {
	sunrise: {sky: ['#F7C9A4', '#FBE9D6'], sun: '#FFF1D6', win: '#2F5D63', sea: '#8FC7C3', ground: '#6E8F5E'},
	day: {sky: ['#9CCBE3', '#E4F2F4'], sun: '#FFF6DA', win: '#2B4F59', sea: '#5FB3B0', ground: '#5E8A4E'},
	dusk: {sky: ['#5C5A8C', '#F2A77E'], sun: '#FFD9A6', win: '#F5C46E', sea: '#4F7F8A', ground: '#3F5E40'},
	garden: {sky: ['#B8DCCB', '#EEF6EE'], sun: '#FFF6DA', win: '#2B4F59', sea: '#6DBAB2', ground: '#4E7F45'},
};

const Palm: React.FC<{x: number; y: number; s?: number; c: string}> = ({x, y, s = 1, c}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M0 0 C 4 -40, 10 -80, 6 -120" stroke="#6B5236" strokeWidth="6" fill="none" strokeLinecap="round" />
		{[-70, -30, 10, 50, 95, 140].map((r, i) => (
			<path
				key={i}
				d="M0 0 C 18 -10, 40 -8, 58 6 C 40 0, 20 2, 0 0 Z"
				fill={c}
				transform={`translate(6 -120) rotate(${r})`}
			/>
		))}
	</g>
);

export const VillaArt: React.FC<{
	variant?: Variant;
	width: number;
	height: number;
	radius?: number;
	style?: React.CSSProperties;
}> = ({variant = 'day', width, height, radius = 16, style}) => {
	const p = PAL[variant];
	const id = `v-${variant}`;
	const crop = variant === 'garden' ? '60 40 300 195' : '0 0 400 260';
	return (
		<div style={{width, height, borderRadius: radius, overflow: 'hidden', flexShrink: 0, ...style}}>
			<svg width="100%" height="100%" viewBox={crop} preserveAspectRatio="xMidYMid slice">
				<defs>
					<linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={p.sky[0]} />
						<stop offset="1" stopColor={p.sky[1]} />
					</linearGradient>
					<linearGradient id={`${id}-pool`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#7FD3D0" />
						<stop offset="1" stopColor="#2E9C9A" />
					</linearGradient>
				</defs>
				<rect width="400" height="260" fill={`url(#${id}-sky)`} />
				<circle cx="300" cy="78" r="30" fill={p.sun} opacity="0.95" />
				<rect y="150" width="400" height="30" fill={p.sea} />
				<path d="M0 170 C 80 160, 160 175, 240 165 S 360 160, 400 168 L400 260 L0 260 Z" fill={p.ground} />
				{/* villa */}
				<g>
					<rect x="92" y="96" width="210" height="90" fill="#F4EEE3" />
					<rect x="80" y="86" width="234" height="14" fill="#E3D8C6" />
					<rect x="150" y="60" width="130" height="36" fill="#F8F3EA" />
					<rect x="140" y="52" width="150" height="10" fill="#E3D8C6" />
					{/* timber slats */}
					{Array.from({length: 7}).map((_, i) => (
						<rect key={i} x={104 + i * 7} y="108" width="4" height="66" fill="#A77C52" />
					))}
					{/* glass */}
					<rect x="160" y="110" width="126" height="64" fill={p.win} />
					<rect x="163" y="66" width="104" height="24" fill={p.win} />
					<path d="M170 110 L200 110 L175 174 L160 174 Z" fill="#fff" opacity="0.14" />
					<rect x="222" y="110" width="3" height="64" fill="#E3D8C6" />
					<rect x="214" y="66" width="3" height="24" fill="#E3D8C6" />
				</g>
				{/* pool deck + pool */}
				<rect x="60" y="186" width="290" height="12" fill="#E9DFCC" />
				<rect x="70" y="198" width="270" height="34" fill={`url(#${id}-pool)`} />
				<path d="M90 208 h60 M180 218 h70 M110 224 h40 M270 210 h50" stroke="#fff" strokeOpacity="0.55" strokeWidth="2.5" strokeLinecap="round" />
				{/* plants */}
				<ellipse cx="48" cy="190" rx="36" ry="18" fill={p.ground} />
				<ellipse cx="352" cy="192" rx="40" ry="16" fill={p.ground} />
				<circle cx="40" cy="184" r="3.5" fill="#fff" />
				<circle cx="52" cy="180" r="3.5" fill="#FBE7A1" />
				<circle cx="360" cy="186" r="3.5" fill="#fff" />
				<Palm x={40} y={196} s={1} c="#3E6B3A" />
				<Palm x={356} y={200} s={0.85} c="#44743F" />
			</svg>
		</div>
	);
};
