import React from 'react';

/** Privacy blur over a rectangle, in the coordinates of the element it sits in. */
export const BlurRegion: React.FC<{x: number; y: number; w: number; h: number; radius?: number}> = ({x, y, w, h, radius = 16}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			width: w,
			height: h,
			backdropFilter: `blur(${radius}px)`,
			WebkitBackdropFilter: `blur(${radius}px)`,
			background: 'rgba(200,205,215,0.12)',
			borderRadius: 6,
		}}
	/>
);
