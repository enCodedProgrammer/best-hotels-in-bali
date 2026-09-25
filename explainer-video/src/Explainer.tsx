import React from 'react';
import {AbsoluteFill, Audio, interpolate, Series, staticFile, useVideoConfig} from 'remotion';
import {S1Hook} from './scenes/S1Hook';
import {S2Today} from './scenes/S2Today';
import {S3Crew} from './scenes/S3Crew';
import {S4Listings} from './scenes/S4Listings';
import {S5Social} from './scenes/S5Social';
import {S6Leads} from './scenes/S6Leads';
import {S7Dashboard} from './scenes/S7Dashboard';
import {S8YourPart} from './scenes/S8YourPart';
import {S9Close} from './scenes/S9Close';
import {SCENES, SceneId} from './timeline';
import {C, sec} from './theme';

const COMPONENTS: Record<SceneId, React.FC<{duration: number}>> = {
	hook: S1Hook,
	today: S2Today,
	crew: S3Crew,
	listings: S4Listings,
	social: S5Social,
	leads: S6Leads,
	dashboard: S7Dashboard,
	yourpart: S8YourPart,
	close: S9Close,
};

export type ExplainerProps = {
	/** File in public/, e.g. "voiceover.mp3". Leave empty for a silent render. */
	voiceover: string;
	/** File in public/, e.g. "music.mp3". Ducked under the voiceover. */
	music: string;
	musicVolume: number;
};

export const Explainer: React.FC<ExplainerProps> = ({voiceover, music, musicVolume}) => {
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
			{voiceover ? <Audio src={staticFile(voiceover)} /> : null}
			{music ? (
				<Audio
					src={staticFile(music)}
					volume={(f) =>
						musicVolume *
						interpolate(f, [0, 30, durationInFrames - 90, durationInFrames], [0, 1, 1, 0], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						})
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};
