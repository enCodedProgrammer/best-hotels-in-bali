import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, usePop, useLayout, useVideoTime} from '../anim';
import {oldWatch} from '../clock';
import {AccuScreen} from '../components/AccuScreen';
import {SplitScreen} from '../components/SplitScreen';
import {Stopwatch} from '../components/Stopwatch';
import {Scene} from '../components/ui';
import {C, OLD_WAY_FILTER} from '../theme';
import {sceneStartFrame} from '../timeline';

/** Slam frames, timed to the voiceover. */
export const SLAMS = [6, 168, 228];
const LINES = [
	<>
		First estimate in = <span style={{color: C.orange}}>first shot at the job.</span>
	</>,
	<>The roofing industry is moving fast.</>,
	<>
		Don&rsquo;t be the last one <span style={{color: C.orange}}>typing.</span>
	</>,
];

const Slam: React.FC<{at: number; size: number; children: React.ReactNode}> = ({at, size, children}) => {
	const p = usePop(at);
	const frame = useCurrentFrame();
	if (frame < at) return null;
	return (
		<div
			style={{
				fontSize: size,
				fontWeight: 900,
				lineHeight: 1.08,
				letterSpacing: '-0.03em',
				textAlign: 'center',
				textWrap: 'balance',
				opacity: Math.min(1, p * 1.5),
				transform: `scale(${1.6 - 0.6 * Math.min(1.08, p)})`,
			}}
		>
			{children}
		</div>
	);
};

/** The old way shrinks and goes dark (still ticking) while the new way takes the screen. */
export const Shift: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const t = useVideoTime(sceneStartFrame('shift'));
	const {square, panels} = useLayout();
	const frac = interpolate(frame, [0, 200], [0.3, 0], {...clamp, easing: easeInOut});
	const dark = interpolate(frame, [0, 180], [0.8, 0.15], clamp);
	return (
		<Scene duration={duration} fadeIn={false}>
			<SplitScreen
				leftFrac={frac}
				top={square ? 40 : panels.top - 200}
				leftOpacity={interpolate(frame, [120, 200], [1, 0], clamp)}
				left={(w, h) => (
					<>
						<AccuScreen width={w} height={h} still={{file: 'acculynx/builder-empty.png', srcT: 27.9}} filter={`${OLD_WAY_FILTER} brightness(${dark})`} kb={[1.06, 1.06]} radius={24} />
						<div style={{position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
							<Stopwatch seconds={oldWatch(t)} tone="old" size={square ? 20 : 24} />
						</div>
					</>
				)}
				right={(w, h) => (
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: 'radial-gradient(90% 60% at 50% 45%, rgba(255,122,26,0.16) 0%, transparent 70%)',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: square ? 34 : 60,
							padding: '0 36px',
						}}
					>
						{LINES.map((l, i) => (
							<Slam key={i} at={SLAMS[i]} size={(square ? 52 : 70) * (i === 2 ? 1.2 : 1) * Math.min(1, w / 700 + 0.2)}>
								{l}
							</Slam>
						))}
					</div>
				)}
			/>
		</Scene>
	);
};
