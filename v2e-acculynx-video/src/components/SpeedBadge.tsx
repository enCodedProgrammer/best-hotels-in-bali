import React from 'react';
import {C} from '../theme';

export const SpeedBadge: React.FC<{label: string; style?: React.CSSProperties}> = ({label, style}) => (
	<div
		style={{
			padding: '6px 14px',
			borderRadius: 10,
			background: 'rgba(5,9,18,0.85)',
			border: '2px solid #4A5163',
			color: C.white,
			fontSize: 28,
			fontWeight: 900,
			...style,
		}}
	>
		▶▶ {label}
	</div>
);
