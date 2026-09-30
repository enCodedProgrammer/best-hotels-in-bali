import React from 'react';
import {AbsoluteFill, Audio, interpolate, Series, staticFile, useVideoConfig} from 'remotion';
import {CaptionWord, ESTIMATED_CAPTIONS} from './captions';
import {Caption} from './components/Caption';
import {CTA} from './scenes/CTA';
import {Hook} from './scenes/Hook';
import {Pain} from './scenes/Pain';
import {Proof} from './scenes/Proof';
import {Solution} from './scenes/Solution';
import {StepEstimate} from './scenes/StepEstimate';
import {StepMeasure} from './scenes/StepMeasure';
import {StepTalk} from './scenes/StepTalk';
import {C, sec} from './theme';
import {SCENES, SceneId} from './timeline';

const COMPONENTS: Record<SceneId, React.FC<{duration: number}>> = {
	hook: Hook,
	pain: Pain,
	solution: Solution,
	talk: StepTalk,
	measure: StepMeasure,
	estimate: StepEstimate,
	proof: Proof,
	cta: CTA,
};

export type VideoProps = {
	/** File in public/, e.g. "voiceover.mp3". Leave empty for a silent render. */
	voiceover: string;
	/** File in public/, e.g. "music.mp3". Sits about -20 dB under the voiceover. */
	music: string;
	/** Linear gain for the music bed. 0.1 ≈ -20 dB. */
	musicVolume: number;
	/** Exact word timings from Whisper/ElevenLabs. Empty = estimated timings from captions.ts. */
	captions: CaptionWord[];
};

export const Video: React.FC<VideoProps> = ({voiceover, music, musicVolume, captions}) => {
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<Series>
				{SCENES.map((s) => {
					const Comp = COMPONENTS[s.id];
					const d = sec(s.seconds);
					return (
						<Series.Sequence key={s.id} durationInFrames={d} name={s.id}>
							<Comp duration={d} />
						</Series.Sequence>
					);
				})}
			</Series>
			<Caption words={captions.length ? captions : ESTIMATED_CAPTIONS} />
			{voiceover ? <Audio src={staticFile(voiceover)} /> : null}
			{music ? (
				<Audio
					src={staticFile(music)}
					volume={(f) =>
						musicVolume *
						interpolate(f, [0, 15, durationInFrames - 45, durationInFrames], [0, 1, 1, 0], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						})
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};
