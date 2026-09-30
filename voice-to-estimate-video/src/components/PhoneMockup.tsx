import React from 'react';
import {C, shadow} from '../theme';

/**
 * Phone frame. Children fill the screen (absolute positioning inside works).
 * Real screen captures of the app can go straight in here as <OffthreadVideo>.
 */
export const PhoneMockup: React.FC<{
	width?: number;
	children: React.ReactNode;
	screen?: string;
	style?: React.CSSProperties;
}> = ({width = 420, children, screen = C.bg, style}) => {
	const h = width * 2.05;
	return (
		<div
			style={{
				width,
				height: h,
				borderRadius: width * 0.15,
				background: '#05080E',
				padding: width * 0.03,
				boxShadow: `${shadow.lg}, inset 0 0 0 2px #3A4F70`,
				position: 'relative',
				...style,
			}}
		>
			<div
				style={{
					width: '100%',
					height: '100%',
					borderRadius: width * 0.125,
					background: screen,
					overflow: 'hidden',
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: width * 0.035,
						left: width * 0.09,
						right: width * 0.09,
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: width * 0.04,
						fontWeight: 700,
						color: C.white,
						zIndex: 9,
					}}
				>
					<span>9:41</span>
					<span style={{letterSpacing: 2}}>●●● ▮</span>
				</div>
				<div
					style={{
						position: 'absolute',
						top: width * 0.028,
						left: '50%',
						transform: 'translateX(-50%)',
						width: width * 0.3,
						height: width * 0.075,
						borderRadius: 99,
						background: '#05080E',
						zIndex: 10,
					}}
				/>
				{children}
			</div>
		</div>
	);
};
