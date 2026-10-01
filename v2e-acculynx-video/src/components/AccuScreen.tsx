import React from 'react';
import {Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BlurRegion} from './BlurRegion';
import {ScreenFrame} from './ScreenFrame';

/** Size of the supplied AccuLynx screen recording. */
export const SRC = {w: 698, h: 942};
export const RECORDING = 'acculynx/accu-recording.mp4';

type Rect = {x: number; y: number; w: number; h: number};

/*
 * Privacy blurs (spec §3) in recording pixels, by what's on screen at that
 * point in the recording: company and user names, the activity feed's
 * homeowner names, pipeline dollar totals, and the job's contact name,
 * assignee, phone number and address.
 */
const ALWAYS: Rect[] = [
	{x: 150, y: 6, w: 205, h: 28},
	{x: 598, y: 42, w: 100, h: 26},
];
const DASHBOARD: Rect[] = [
	{x: 14, y: 398, w: 390, h: 36},
	{x: 462, y: 345, w: 236, h: 597},
];
const JOB: Rect[] = [
	{x: 86, y: 112, w: 132, h: 30},
	{x: 545, y: 118, w: 153, h: 42},
	{x: 88, y: 582, w: 340, h: 190},
	{x: 88, y: 838, w: 330, h: 64},
	{x: 0, y: 922, w: 240, h: 20},
];

/** Job header (title + assignee) stays on the Estimates page; the contact details don't. */
const JOB_HEADER = JOB.slice(0, 2);

export const blursAt = (srcT: number): Rect[] => [
	// From 27.2s the builder dialog covers the header, so nothing to blur there.
	...(srcT < 27.2 ? ALWAYS : []),
	...(srcT < 9.2 ? DASHBOARD : []),
	...(srcT >= 10.3 && srcT < 20.0 ? JOB : []),
	...(srcT >= 20.0 && srcT < 27.2 ? JOB_HEADER : []),
];

/**
 * A piece of the real AccuLynx recording (or a still from it) in a screen
 * frame, scaled to `width` and cropped to `height`, with privacy blurs.
 * Children are drawn in recording pixels on top (e.g. a highlight ring).
 */
export const AccuScreen: React.FC<{
	width: number;
	height: number;
	/** Still image in public/ plus the recording time it was taken at (for the blurs). */
	still?: {file: string; srcT: number};
	/** Segment of the recording, in seconds. */
	clip?: {from: number; to: number; rate?: number};
	kb?: [number, number];
	len?: number;
	origin?: string;
	filter?: string;
	/** Shift the screen up (in recording pixels) to show a lower part of it. */
	offsetY?: number;
	radius?: number;
	/** 'cover' fills the frame (cropping the sides); 'width' fits the width and crops the bottom. */
	fit?: 'cover' | 'width';
	/** With 'cover': which part to keep when cropping sides (0 = left edge, 0.5 = centre). */
	alignX?: number;
	children?: React.ReactNode;
}> = ({width, height, still, clip, kb, len, origin, filter, offsetY = 0, radius, fit = 'cover', alignX = 0, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const k = fit === 'cover' ? Math.max(width / SRC.w, height / SRC.h) : width / SRC.w;
	const left = -(SRC.w * k - width) * alignX;
	const srcT = clip ? clip.from + (frame / fps) * (clip.rate ?? 1) : (still?.srcT ?? 0);
	return (
		<ScreenFrame width={width} height={height} kb={kb} len={len} origin={origin} filter={filter} radius={radius}>
			<div
				style={{
					position: 'absolute',
					left,
					top: -offsetY * k,
					width: SRC.w,
					height: SRC.h,
					transform: `scale(${k})`,
					transformOrigin: '0 0',
				}}
			>
				{clip ? (
					<OffthreadVideo
						src={staticFile(RECORDING)}
						startFrom={Math.round(clip.from * fps)}
						endAt={Math.round(clip.to * fps)}
						playbackRate={clip.rate ?? 1}
						muted
						style={{width: SRC.w, height: SRC.h}}
					/>
				) : still ? (
					<Img src={staticFile(still.file)} style={{width: SRC.w, height: SRC.h}} />
				) : null}
				{blursAt(srcT).map((r, i) => (
					<BlurRegion key={i} {...r} />
				))}
				{children}
			</div>
		</ScreenFrame>
	);
};
