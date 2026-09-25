import React from 'react';
import {Composition} from 'remotion';
import {Explainer, ExplainerProps} from './Explainer';
import {FPS} from './theme';
import {TOTAL_FRAMES} from './timeline';

const defaults: ExplainerProps = {voiceover: '', music: '', musicVolume: 0.18};

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="Explainer-16x9"
			component={Explainer}
			durationInFrames={TOTAL_FRAMES}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={defaults}
		/>
		<Composition
			id="Explainer-1x1"
			component={Explainer}
			durationInFrames={TOTAL_FRAMES}
			fps={FPS}
			width={1080}
			height={1080}
			defaultProps={defaults}
		/>
	</>
);
