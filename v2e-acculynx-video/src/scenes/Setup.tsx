import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, useLayout, useVideoTime} from '../anim';
import {newWatch, oldWatch} from '../clock';
import {AccuScreen} from '../components/AccuScreen';
import {SideTag, SplitScreen} from '../components/SplitScreen';
import {Stopwatch} from '../components/Stopwatch';
import {Appear, Ost, Scene} from '../components/ui';
import {OLD_WAY_FILTER} from '../theme';
import {sceneStartFrame} from '../timeline';

const DASH = {file: 'acculynx/01-job-dashboard.png', srcT: 0.5};

export const Setup: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const t = useVideoTime(sceneStartFrame('setup'));
	const {square} = useLayout();
	// Screen splits: panels slide apart from the middle.
	const open = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: easeInOut});
	const sw = square ? 34 : 40;
	return (
		<Scene duration={duration} fadeIn={false}>
			<Ost text="Same roof. Same AccuLynx. *Watch.*" delay={4} />
			<div style={{position: 'absolute', inset: 0, opacity: open, transform: `scaleX(${0.9 + 0.1 * open})`}}>
				<SplitScreen
					leftFrac={0.5}
					left={(w, h) => (
						<>
							<SideTag tone="old" />
							<AccuScreen width={w} height={h} still={DASH} filter={OLD_WAY_FILTER} kb={[1.02, 1.1]} len={duration} radius={24} />
							<Appear delay={14} pop style={{position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
								<Stopwatch seconds={oldWatch(t)} tone="old" size={sw} />
							</Appear>
						</>
					)}
					right={(w, h) => (
						<>
							<SideTag tone="new" />
							<AccuScreen width={w} height={h} still={DASH} kb={[1.02, 1.1]} len={duration} radius={24} />
							<Appear delay={14} pop style={{position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
								<Stopwatch seconds={newWatch(t)} tone="new" size={sw} />
							</Appear>
						</>
					)}
				/>
			</div>
		</Scene>
	);
};
