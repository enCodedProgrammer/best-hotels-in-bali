import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, usePop} from '../anim';
import {PhoneMockup} from '../components/PhoneMockup';
import {Headline, Scene, Stage} from '../components/ui';
import {C} from '../theme';

const TRANSCRIPT =
	'Full tear-off, one layer. Architectural shingles, charcoal. Replace two pipe boots, new ridge vent, some rot on the back side near the valley…'.split(
		' ',
	);
const WORD_START = 20;
const PER_WORD = 10;
const wordAt = (i: number) => WORD_START + i * PER_WORD;

/** What the app picks out of the talk, keyed to the word that triggers it. */
const PICKED: {label: string; detail: string; word: number}[] = [
	{label: 'Tear-off', detail: '1 layer', word: 2},
	{label: 'Shingles', detail: 'Architectural, charcoal', word: 6},
	{label: 'Pipe boots', detail: 'Replace 2', word: 10},
	{label: 'Ridge vent', detail: 'New', word: 13},
	{label: 'Rot repair', detail: 'Back side, near valley', word: 22},
];

const Waveform: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 70}}>
			{Array.from({length: 26}).map((_, i) => {
				const h = 10 + Math.abs(Math.sin(frame * 0.35 + i * 0.9) * Math.cos(frame * 0.13 + i * 0.4)) * 56;
				return <div key={i} style={{width: 7, height: h, borderRadius: 4, background: i % 2 ? C.orange : '#FFA863'}} />;
			})}
		</div>
	);
};

const RecordButton: React.FC = () => {
	const frame = useCurrentFrame();
	const rings = [0, 20];
	return (
		<div style={{position: 'relative', width: 128, height: 128}}>
			{rings.map((o) => {
				const t = ((frame + o) % 40) / 40;
				return (
					<div
						key={o}
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: 999,
							border: `4px solid ${C.orange}`,
							transform: `scale(${1 + t * 0.7})`,
							opacity: 1 - t,
						}}
					/>
				);
			})}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 999,
					background: C.orange,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${1 + Math.sin(frame * 0.3) * 0.03})`,
					boxShadow: '0 0 40px rgba(255,122,26,0.55)',
				}}
			>
				<div style={{width: 38, height: 38, borderRadius: 8, background: '#fff'}} />
			</div>
		</div>
	);
};

const PickedChip: React.FC<{label: string; detail: string; at: number}> = ({label, detail, at}) => {
	const p = usePop(at);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				padding: '18px 22px',
				borderRadius: 20,
				background: C.card,
				border: `2px solid ${C.line}`,
				opacity: Math.min(1, p),
				transform: `translateX(${(1 - Math.min(1, p)) * 40}px) scale(${0.8 + 0.2 * p})`,
			}}
		>
			<div style={{width: 14, height: 14, borderRadius: 99, background: C.orange, flexShrink: 0}} />
			<div>
				<div style={{fontSize: 32, fontWeight: 800, color: C.white, lineHeight: 1.1}}>{label}</div>
				<div style={{fontSize: 25, fontWeight: 600, color: C.muted, marginTop: 4}}>{detail}</div>
			</div>
		</div>
	);
};

export const StepTalk: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const seconds = Math.max(0, Math.floor((frame - 10) / 30));
	const shown = TRANSCRIPT.filter((_, i) => frame >= wordAt(i)).length;
	const headerIn = interpolate(frame, [250, 262], [0, 1], clamp);
	return (
		<Scene duration={duration}>
			<Headline text="Walk the roof and *talk*" step={1} />
			<Stage>
				<div style={{position: 'absolute', left: 20, top: 18}}>
					<PhoneMockup width={420}>
						<div style={{position: 'absolute', top: 64, left: 30, right: 30}}>
							<div style={{fontSize: 20, fontWeight: 700, color: C.muted, letterSpacing: '0.08em'}}>SAMPLE JOB</div>
							<div style={{fontSize: 32, fontWeight: 800, marginTop: 4}}>Roof walkthrough</div>
						</div>
						<div
							style={{
								position: 'absolute',
								top: 156,
								left: 22,
								right: 22,
								height: 350,
								borderRadius: 22,
								background: C.surface,
								border: `2px solid ${C.line}`,
								padding: '22px 22px',
								fontSize: 29,
								fontWeight: 600,
								lineHeight: 1.36,
								color: C.text,
							}}
						>
							{TRANSCRIPT.slice(0, shown).map((w, i) => {
								const fresh = frame - wordAt(i) < 8;
								return (
									<span key={i} style={{color: fresh ? C.orange : C.text}}>
										{w}{' '}
									</span>
								);
							})}
							{shown < TRANSCRIPT.length ? (
								<span style={{display: 'inline-block', width: 3, height: 30, background: C.orange, verticalAlign: -5, opacity: Math.floor(frame / 8) % 2}} />
							) : null}
						</div>
						<div style={{position: 'absolute', top: 524, left: 0, right: 0, textAlign: 'center', fontSize: 26, fontWeight: 700, color: C.orange, fontVariantNumeric: 'tabular-nums'}}>
							● REC 0:{String(seconds + 3).padStart(2, '0')}
						</div>
						<div style={{position: 'absolute', top: 560, left: 0, right: 0}}>
							<Waveform />
						</div>
						<div style={{position: 'absolute', top: 652, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
							<RecordButton />
						</div>
					</PhoneMockup>
				</div>
				<div style={{position: 'absolute', left: 480, right: 10, top: 40, display: 'flex', flexDirection: 'column', gap: 16}}>
					<div style={{fontSize: 26, fontWeight: 800, letterSpacing: '0.12em', color: C.muted, opacity: interpolate(frame, [30, 40], [0, 1], clamp)}}>
						PICKED UP
					</div>
					{PICKED.map((p) => (
						<PickedChip key={p.label} label={p.label} detail={p.detail} at={wordAt(p.word) + 4} />
					))}
					<div style={{opacity: headerIn, fontSize: 26, fontWeight: 700, color: C.green, marginTop: 6}}>✓ Nothing typed</div>
				</div>
			</Stage>
		</Scene>
	);
};
