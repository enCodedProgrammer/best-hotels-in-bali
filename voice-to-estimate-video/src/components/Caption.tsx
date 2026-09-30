import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, ease, useLayout} from '../anim';
import {CaptionWord, chunkCaptions} from '../captions';
import {C, FONT} from '../theme';

/** Burned-in captions: 3–5 words at a time on a dark pill, current word in orange. */
export const Caption: React.FC<{words: CaptionWord[]}> = ({words}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {capBottom, capSize, square} = useLayout();
	const chunks = useMemo(() => chunkCaptions(words), [words]);
	const t = frame / fps;
	const chunk = chunks.find((c) => t >= c.start && t < c.end);
	if (!chunk) return null;
	const p = interpolate(t - chunk.start, [0, 0.15], [0, 1], {...clamp, easing: ease});
	return (
		<div
			style={{
				position: 'absolute',
				left: 40,
				right: 40,
				bottom: capBottom,
				display: 'flex',
				justifyContent: 'center',
				zIndex: 100,
			}}
		>
			<div
				style={{
					fontFamily: FONT,
					fontSize: capSize,
					fontWeight: 800,
					lineHeight: 1.2,
					color: C.white,
					background: 'rgba(4,9,18,0.82)',
					border: '1px solid rgba(255,255,255,0.08)',
					borderRadius: 22,
					padding: square ? '10px 24px' : '14px 30px',
					textAlign: 'center',
					maxWidth: square ? 960 : 980,
					opacity: p,
					transform: `translateY(${(1 - p) * 12}px) scale(${0.96 + p * 0.04})`,
				}}
			>
				{chunk.words.map((w, i) => {
					const active = t >= w.start && t < w.end + 0.05;
					return (
						<span key={i} style={{color: active ? C.orange : C.white, marginRight: i < chunk.words.length - 1 ? '0.26em' : 0}}>
							{w.text}
						</span>
					);
				})}
			</div>
		</div>
	);
};
