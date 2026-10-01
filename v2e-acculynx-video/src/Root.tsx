import React from 'react';
import {Composition} from 'remotion';
import {FPS} from './theme';
import {TOTAL_FRAMES} from './timeline';
import {Video, VideoProps} from './Video';

const defaults: VideoProps = {voiceover: '', music: '', musicVolume: 0.08, sfx: true, captions: []};

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="Vertical" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={defaults} />
		<Composition id="Square" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1080} defaultProps={defaults} />
	</>
);
