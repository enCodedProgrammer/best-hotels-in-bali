import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, ease, useLayout} from '../anim';
import {CaptionWord, chunkCaptions} from '../captions';
import {C, FONT} from '../theme';

/** Burned-in kinetic captions: 2–4 words at a time, keywords orange with a scale-pop. */
export const KineticCaption: React.FC<{words: CaptionWord[]}> = ({words}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {capBottom, capSize, square} = useLayout();
	const chunks = useMemo(() => chunkCaptions(words), [words]);
	const t = frame / fps;
	const chunk = chunks.find((c) => t >= c.start && t < c.end);
	if (!chunk) return null;
	const p = interpolate(t - chunk.start, [0, 0.12], [0, 1], {...clamp, easing: ease});
	return (
		<div style={{position: 'absolute', left: 30, right: 30, bottom: capBottom, display: 'flex', justifyContent: 'center', zIndex: 100}}>
			<div
				style={{
					fontFamily: FONT,
					fontSize: capSize,
					fontWeight: 900,
					lineHeight: 1.15,
					letterSpacing: '-0.01em',
					color: C.white,
					background: 'rgba(3,6,14,0.84)',
					borderRadius: 22,
					padding: square ? '10px 24px' : '14px 30px',
					textAlign: 'center',
					maxWidth: 1000,
					opacity: p,
					transform: `scale(${0.92 + p * 0.08})`,
				}}
			>
				{chunk.words.map((w, i) => {
					const said = t >= w.start;
					const pop = w.key ? interpolate(t - w.start, [0, 0.08, 0.22], [1, 1.18, 1], clamp) : 1;
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								color: w.key ? C.orange : C.white,
								opacity: said ? 1 : 0.55,
								transform: `scale(${said ? pop : 1})`,
								marginRight: i < chunk.words.length - 1 ? '0.24em' : 0,
							}}
						>
							{w.text}
						</span>
					);
				})}
			</div>
		</div>
	);
};
