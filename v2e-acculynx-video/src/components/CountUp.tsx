import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease} from '../anim';

/** Number that counts up from 0 to `value` between frames `start` and `start + len`. */
export const CountUp: React.FC<{
	value: number;
	start: number;
	len?: number;
	decimals?: number;
	prefix?: string;
	suffix?: string;
	style?: React.CSSProperties;
}> = ({value, start, len = 24, decimals = 0, prefix = '', suffix = '', style}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [start, start + len], [0, value], {...clamp, easing: ease});
	const txt = v.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
	return (
		<span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
			{prefix}
			{txt}
			{suffix}
		</span>
	);
};
