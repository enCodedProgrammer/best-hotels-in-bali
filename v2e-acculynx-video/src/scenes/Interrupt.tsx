import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, useLayout, useVideoTime} from '../anim';
import {oldWatch} from '../clock';
import {AccuScreen} from '../components/AccuScreen';
import {SideTag, SplitScreen} from '../components/SplitScreen';
import {Stopwatch} from '../components/Stopwatch';
import {Scene} from '../components/ui';
import {C} from '../theme';
import {sceneStartFrame} from '../timeline';

export const FREEZE = 10;
export const BLACK_END = FREEZE + 6;

/** Freeze the old way, drain its color, flash to black, then "Now watch this." */
export const Interrupt: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const t = useVideoTime(sceneStartFrame('interrupt'));
	const {square} = useLayout();
	const drain = interpolate(frame, [0, FREEZE], [0.8, 0.35], clamp);
	const text = interpolate(frame, [BLACK_END, BLACK_END + 5], [0, 1], clamp);
	const punch = interpolate(frame, [BLACK_END, BLACK_END + 5, BLACK_END + 10], [1.5, 0.96, 1], clamp);
	const zoom = interpolate(frame, [BLACK_END, duration], [1, 1.08], clamp);
	return (
		<Scene duration={duration} fadeIn={false}>
			{frame < FREEZE ? (
				<SplitScreen
					leftFrac={0.7}
					rightOpacity={0.5}
					left={(w, h) => (
						<>
							<SideTag tone="old" />
							<AccuScreen width={w} height={h} still={{file: 'acculynx/builder-empty.png', srcT: 27.9}} filter={`grayscale(1) brightness(${drain})`} kb={[1.06, 1.06]} radius={24} />
							<div style={{position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
								<Stopwatch seconds={oldWatch(t)} tone="old" size={square ? 36 : 42} />
							</div>
						</>
					)}
					right={() => null}
				/>
			) : null}
			{frame >= FREEZE ? <AbsoluteFill style={{background: '#000'}} /> : null}
			{frame >= BLACK_END ? (
				<AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${zoom})`}}>
					<div
						style={{
							fontSize: square ? 120 : 150,
							fontWeight: 900,
							letterSpacing: '-0.035em',
							lineHeight: 1,
							textAlign: 'center',
							opacity: text,
							transform: `scale(${punch})`,
						}}
					>
						Now <span style={{color: C.orange}}>watch</span>
						<br />
						this.
					</div>
				</AbsoluteFill>
			) : null}
		</Scene>
	);
};
