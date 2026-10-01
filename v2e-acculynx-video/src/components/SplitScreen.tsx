import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useLayout} from '../anim';
import {C} from '../theme';

const GAP = 18;

/** Film grain for the old-way side (spec §6: desaturated grey with slight grain). */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.12}) => {
	const frame = useCurrentFrame();
	return (
		<svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
			<filter id={`grain${frame % 4}`}>
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 4} />
			</filter>
			<rect width="100%" height="100%" filter={`url(#grain${frame % 4})`} />
		</svg>
	);
};

export type PanelRender = (w: number, h: number) => React.ReactNode;

/**
 * Left/right panels in the band between the on-screen text and captions.
 * `leftFrac` is the left panel's share of the width (0–1); the divider
 * animates when it changes. A panel narrower than 4px isn't drawn.
 */
export const SplitScreen: React.FC<{
	leftFrac: number;
	left: PanelRender;
	right: PanelRender;
	leftOpacity?: number;
	rightOpacity?: number;
	top?: number;
	bottom?: number;
}> = ({leftFrac, left, right, leftOpacity = 1, rightOpacity = 1, top, bottom}) => {
	const {W, panels, margin} = useLayout();
	const t = top ?? panels.top;
	const b = bottom ?? panels.bottom;
	const h = b - t;
	const usable = W - 2 * margin - GAP;
	const lw = Math.max(0, usable * leftFrac);
	const rw = Math.max(0, usable - lw);
	const panelStyle = (x: number, w: number, o: number, old: boolean): React.CSSProperties => ({
		position: 'absolute',
		left: x,
		top: t,
		width: w,
		height: h,
		borderRadius: 28,
		overflow: 'hidden',
		background: old ? '#1A1D24' : C.surface,
		border: `3px solid ${old ? '#3A4152' : 'rgba(255,122,26,0.7)'}`,
		opacity: o,
	});
	return (
		<>
			{lw > 4 ? (
				<div style={panelStyle(margin, lw, leftOpacity, true)}>
					{left(lw - 6, h - 6)}
					<Grain />
				</div>
			) : null}
			{rw > 4 ? (
				<div style={panelStyle(margin + (lw > 4 ? lw + GAP : 0), lw > 4 ? rw : usable + GAP, rightOpacity, false)}>
					{right((lw > 4 ? rw : usable + GAP) - 6, h - 6)}
				</div>
			) : null}
		</>
	);
};

/** "OLD WAY" / "NEW WAY" tag pinned to a panel's top-left. */
export const SideTag: React.FC<{tone: 'old' | 'new'; size?: number}> = ({tone, size = 26}) => (
	<div
		style={{
			position: 'absolute',
			top: 16,
			left: 16,
			zIndex: 20,
			padding: '6px 14px',
			borderRadius: 10,
			background: tone === 'new' ? C.orange : '#3A4152',
			color: C.white,
			fontSize: size,
			fontWeight: 900,
			letterSpacing: '0.12em',
		}}
	>
		{tone === 'new' ? 'NEW WAY' : 'OLD WAY'}
	</div>
);
