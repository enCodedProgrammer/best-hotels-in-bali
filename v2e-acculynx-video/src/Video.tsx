import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, Series, staticFile, useVideoConfig} from 'remotion';
import {CaptionWord, ESTIMATED_CAPTIONS} from './captions';
import {KineticCaption} from './components/KineticCaption';
import {CTA} from './scenes/CTA';
import {Hook, THUD_FRAME} from './scenes/Hook';
import {BLACK_END, FREEZE, Interrupt} from './scenes/Interrupt';
import {NewWay, NEW_STEPS, LINES as EST_LINES, LINE_GAP, LINE_START, TOTAL_AT} from './scenes/NewWay';
import {OldWay, OLD_STEPS} from './scenes/OldWay';
import {LOCK_AT, Payoff} from './scenes/Payoff';
import {Setup} from './scenes/Setup';
import {Shift, SLAMS} from './scenes/Shift';
import {C, sec} from './theme';
import {SCENES, SceneId, sceneStartFrame} from './timeline';

const COMPONENTS: Record<SceneId, React.FC<{duration: number}>> = {
	hook: Hook,
	setup: Setup,
	oldway: OldWay,
	interrupt: Interrupt,
	newway: NewWay,
	payoff: Payoff,
	shift: Shift,
	cta: CTA,
};

export type VideoProps = {
	/** File in public/, e.g. "audio/voiceover.mp3". Empty = no voiceover. */
	voiceover: string;
	/** File in public/, e.g. "audio/music.mp3". */
	music: string;
	/** Linear gain for the music bed. 0.08 ≈ -22 dB. */
	musicVolume: number;
	/** Sound effects from public/audio/sfx/. */
	sfx: boolean;
	/** Exact word timings from Whisper/ElevenLabs. Empty = estimated timings from captions.ts. */
	captions: CaptionWord[];
};

type Cue = {file: string; at: number; volume: number};

/** Every sound effect, in frames from the start of the video. */
const sfxCues = (): Cue[] => {
	const s = sceneStartFrame;
	const cues: Cue[] = [{file: 'thud', at: THUD_FRAME, volume: 0.9}];
	// Old-way clock: ticks every second, faster once the old way drags on, fading out last in the shift.
	const tickStart = s('setup') + sec(0.6);
	const fastFrom = s('oldway') + sec(5);
	const end = s('cta');
	for (let f = tickStart; f < end; ) {
		const fade = interpolate(f, [s('shift'), end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		cues.push({file: 'tick', at: f, volume: 0.35 * fade});
		f += f >= fastFrom && f < s('interrupt') ? 12 : f >= s('interrupt') ? 20 : 30;
	}
	cues.push({file: 'keys', at: s('oldway') + OLD_STEPS.type, volume: 0.55});
	cues.push({file: 'keys', at: s('oldway') + OLD_STEPS.type + 36, volume: 0.55});
	cues.push({file: 'keys', at: s('oldway') + OLD_STEPS.type + 72, volume: 0.55});
	for (const at of [s('setup'), s('interrupt') + FREEZE - 4, s('newway'), s('shift')]) cues.push({file: 'whoosh', at, volume: 0.5});
	cues.push({file: 'drop', at: s('interrupt') + BLACK_END, volume: 0.9});
	EST_LINES.forEach((_, i) => cues.push({file: 'pop', at: s('newway') + NEW_STEPS.estimate + LINE_START + i * LINE_GAP, volume: 0.6}));
	cues.push({file: 'chaching', at: s('newway') + NEW_STEPS.estimate + TOTAL_AT + 28, volume: 0.6});
	cues.push({file: 'lockin', at: s('payoff') + LOCK_AT, volume: 0.9});
	SLAMS.forEach((at) => cues.push({file: 'bass', at: s('shift') + at, volume: 0.8}));
	return cues.filter((c) => c.volume > 0.01);
};

export const Video: React.FC<VideoProps> = ({voiceover, music, musicVolume, sfx, captions}) => {
	const {durationInFrames} = useVideoConfig();
	const dropFrom = sceneStartFrame('interrupt') + FREEZE;
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
			<KineticCaption words={captions.length ? captions : ESTIMATED_CAPTIONS} />
			{sfx
				? sfxCues().map((c, i) => (
						<Sequence key={i} from={c.at} durationInFrames={sec(1.5)} name={`sfx-${c.file}`}>
							<Audio src={staticFile(`audio/sfx/${c.file}.wav`)} volume={c.volume} />
						</Sequence>
					))
				: null}
			{voiceover ? <Audio src={staticFile(voiceover)} /> : null}
			{music ? (
				<Audio
					src={staticFile(music)}
					volume={(f) =>
						musicVolume *
						interpolate(f, [0, 6, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) *
						// Music drops out for "Now watch this" (spec §6).
						interpolate(f, [dropFrom - 2, dropFrom, dropFrom + 15, dropFrom + 18], [1, 0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};

