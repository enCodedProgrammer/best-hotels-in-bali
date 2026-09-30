import React from 'react';
import {C} from '../theme';

/** Voice-to-Estimate app icon: a roof line over a microphone. */
export const AppIcon: React.FC<{size?: number; radius?: number}> = ({size = 100, radius}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: radius ?? size * 0.24,
			background: `linear-gradient(145deg, #FF9442 0%, ${C.orange} 45%, ${C.orangeDeep} 100%)`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			boxShadow: '0 6px 18px rgba(255,122,26,0.35)',
			flexShrink: 0,
		}}
	>
		<svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100">
			<path d="M10 46 L50 14 L90 46" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
			<rect x="39" y="34" width="22" height="36" rx="11" fill="#fff" />
			<path d="M29 58 a21 21 0 0 0 42 0" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
			<path d="M50 79 L50 88" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
		</svg>
	</div>
);
