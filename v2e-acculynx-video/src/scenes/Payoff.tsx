import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, useIn, useLayout, usePop, useVideoTime} from '../anim';
import {NEW_STOP, newWatch, oldWatch} from '../clock';
import {AFTER_LABEL, ASSETS} from '../config';
import {AppIcon} from '../components/AppIcon';
import {FlyIntoDocs} from '../components/FlyIntoDocs';
import {Stopwatch} from '../components/Stopwatch';
import {Check, Ost, Scene} from '../components/ui';
import {C, sec} from '../theme';
import {sceneStart, sceneStartFrame} from '../timeline';
import {EstimateCard} from './NewWay';

const FLY_AT = 4;
const FLY_LEN = 30;
export const LOCK_AT = FLY_AT + FLY_LEN;

/**
 * Generic stand-in for the job's Documents tab, used until real AccuLynx
 * screenshots are supplied (config.ts → ASSETS). Deliberately not styled as
 * AccuLynx.
 */
const GENERIC_DOCS = ['Measurement report.pdf', 'Roof photos (24)', 'Inspection notes.pdf'];

const DocsCard: React.FC<{width: number}> = ({width}) => {
	const frame = useCurrentFrame();
	const row = usePop(LOCK_AT);
	const glow = interpolate(frame, [LOCK_AT, LOCK_AT + 8, LOCK_AT + 60], [0, 1, 0.55], clamp);
	return (
		<div style={{width, borderRadius: 26, background: C.surface, border: `2px solid ${C.line}`, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
			<div style={{padding: '22px 28px', borderBottom: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 14}}>
				<svg width="40" height="40" viewBox="0 0 24 24">
					<path d="M3 7 V19 H21 V9 H11 L9 7 Z" fill="none" stroke={C.muted} strokeWidth="2" strokeLinejoin="round" />
				</svg>
				<div style={{fontSize: 36, fontWeight: 900}}>Job · Documents</div>
			</div>
			<div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						padding: '16px 18px',
						borderRadius: 16,
						background: `rgba(34,197,94,${0.12 * glow + 0.04})`,
						border: `3px solid rgba(34,197,94,${glow})`,
						boxShadow: `0 0 ${50 * glow}px rgba(34,197,94,${0.5 * glow})`,
						opacity: Math.min(1, row),
						transform: `scale(${0.8 + 0.2 * Math.min(1.05, row)})`,
					}}
				>
					<AppIcon size={58} />
					<div style={{flex: 1}}>
						<div style={{fontSize: 30, fontWeight: 900}}>Estimate.pdf</div>
						<div style={{fontSize: 22, fontWeight: 700, color: C.muted}}>From Voice-to-Estimate · just now</div>
					</div>
					<Check size={48} />
				</div>
				{GENERIC_DOCS.map((d) => (
					<div key={d} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 14, background: C.card, opacity: 0.75}}>
						<div style={{width: 46, height: 56, borderRadius: 8, background: '#2E3A57'}} />
						<div style={{fontSize: 26, fontWeight: 700, color: C.text}}>{d}</div>
					</div>
				))}
			</div>
		</div>
	);
};

/** Real screenshots (if supplied): Documents tab, then crossfade to the one with the estimate. */
const RealDocs: React.FC<{width: number}> = ({width}) => {
	const frame = useCurrentFrame();
	const x = interpolate(frame, [LOCK_AT - 2, LOCK_AT + 8], [0, 1], clamp);
	const glow = interpolate(frame, [LOCK_AT, LOCK_AT + 8, LOCK_AT + 60], [0, 1, 0.6], clamp);
	return (
		<div style={{width, position: 'relative', borderRadius: 22, overflow: 'hidden', boxShadow: `0 0 ${60 * glow}px rgba(34,197,94,${0.7 * glow})`, border: `4px solid rgba(34,197,94,${glow})`}}>
			<Img src={staticFile(ASSETS.jobDocuments!)} style={{width, display: 'block'}} />
			<Img src={staticFile(ASSETS.jobWithEstimate!)} style={{width, position: 'absolute', left: 0, top: 0, opacity: x}} />
		</div>
	);
};

export const Payoff: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const t = useVideoTime(sceneStartFrame('payoff'));
	const {W, square, panels} = useLayout();
	const stopped = t >= NEW_STOP;
	const stopFrame = sec(NEW_STOP - sceneStart('payoff'));
	const stamp = usePop(stopFrame);
	const docsIn = useIn(0);
	const real = ASSETS.jobDocuments && ASSETS.jobWithEstimate;
	const docsW = square ? 680 : 900;
	const docsTop = square ? 300 : panels.top + 170;
	return (
		<Scene duration={duration} fadeIn={false}>
			<Ost text="Straight into your *AccuLynx* job." size={square ? 52 : 72} />
			{/* Old way: still ticking in the corner */}
			<div style={{position: 'absolute', left: 24, top: square ? 190 : panels.top + 10, opacity: 0.8, filter: 'grayscale(1)'}}>
				<Stopwatch seconds={oldWatch(t)} tone="old" size={square ? 22 : 28} />
			</div>
			<div style={{position: 'absolute', right: 24, top: square ? 178 : panels.top, transform: `scale(${stopped ? 0.95 + 0.05 * stamp : 1})`}}>
				<Stopwatch seconds={newWatch(t)} tone="new" size={square ? 34 : 44} done={stopped ? AFTER_LABEL : undefined} />
			</div>
			<div style={{position: 'absolute', left: (W - docsW) / 2, top: docsTop, opacity: docsIn, transform: `translateY(${(1 - docsIn) * 60}px)`}}>
				{real ? <RealDocs width={docsW} /> : <DocsCard width={docsW} />}
			</div>
			{frame < LOCK_AT + 2 ? (
				<FlyIntoDocs
					start={FLY_AT}
					len={FLY_LEN}
					from={{x: W * 0.62, y: square ? 620 : 1040, scale: square ? 0.6 : 0.8}}
					to={{x: W / 2, y: docsTop + 120, scale: 0.12}}
					arc={square ? 140 : 260}
				>
					<div style={{opacity: interpolate(frame, [LOCK_AT - 6, LOCK_AT], [1, 0], clamp)}}>
						<EstimateCard animate={false} />
					</div>
				</FlyIntoDocs>
			) : null}
			{/* green flash on lock-in */}
			<div style={{position: 'absolute', inset: 0, background: C.green, opacity: interpolate(frame, [LOCK_AT, LOCK_AT + 3, LOCK_AT + 12], [0, 0.18, 0], clamp), pointerEvents: 'none'}} />
		</Scene>
	);
};
