import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, useIn} from '../anim';
import {AppIcon} from '../components/AppIcon';
import {PhoneMockup} from '../components/PhoneMockup';
import {Headline, Scene, Stage, Tap} from '../components/ui';
import {C} from '../theme';

const PHONE_W = 420;
const PHONE_LEFT = (960 - PHONE_W) / 2;
const PHONE_TOP = 20;
const INSET = PHONE_W * 0.03;
const ICON = 76;
const COL = (PHONE_W - 2 * INSET - 40 - 4 * ICON) / 3;
const OUR = {row: 2, col: 1};
const iconPos = (row: number, col: number) => ({x: 20 + col * (ICON + COL), y: 96 + row * (ICON + 44)});

const GENERIC = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#64748B', '#EF4444', '#0EA5E9', '#84CC16', '#A855F7', '#F97316', '#06B6D4', '#6366F1', '#22C55E', '#EAB308'];
const LABELS = ['Mail', 'Maps', 'Photos', 'Camera', 'Music', 'Weather', 'Settings', 'Calendar', 'Files', 'Notes', 'Clock', 'Wallet', 'Phone', 'Messages', 'Sheets', 'News'];

const TAP_AT = 72;
const OPEN_AT = 78;

export const Solution: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const slide = useIn(0);
	const open = interpolate(frame, [OPEN_AT, OPEN_AT + 16], [0, 1], {...clamp, easing: ease});
	const our = iconPos(OUR.row, OUR.col);
	const screenW = PHONE_W - 2 * INSET;
	const screenH = PHONE_W * 2.05 - 2 * INSET;
	const splash = useIn(OPEN_AT + 10);
	return (
		<Scene duration={duration}>
			<Headline text="Just talk. *Get the estimate.*" />
			<Stage>
				<div style={{position: 'absolute', left: PHONE_LEFT, top: PHONE_TOP + (1 - slide) * 500, opacity: Math.min(1, slide * 1.5)}}>
					<PhoneMockup width={PHONE_W} screen="linear-gradient(170deg, #1E3A5F 0%, #0F1B2D 70%)">
						{Array.from({length: 16}).map((_, i) => {
							const row = Math.floor(i / 4);
							const col = i % 4;
							const {x, y} = iconPos(row, col);
							const isOurs = row === OUR.row && col === OUR.col;
							const press = isOurs ? interpolate(frame, [TAP_AT - 4, TAP_AT, TAP_AT + 5], [1, 0.86, 1], clamp) : 1;
							return (
								<div key={i} style={{position: 'absolute', left: x, top: y, width: ICON, textAlign: 'center', transform: `scale(${press})`}}>
									{isOurs ? (
										<AppIcon size={ICON} />
									) : (
										<div style={{width: ICON, height: ICON, borderRadius: ICON * 0.24, background: GENERIC[i], opacity: 0.55}} />
									)}
									<div style={{marginTop: 8, fontSize: 15, fontWeight: 600, color: isOurs ? C.white : C.muted, whiteSpace: 'nowrap', marginLeft: -12, marginRight: -12}}>
										{isOurs ? 'Estimate' : LABELS[i]}
									</div>
								</div>
							);
						})}
						{/* App opening: grows from the icon to full screen */}
						{frame >= OPEN_AT ? (
							<div
								style={{
									position: 'absolute',
									left: our.x * (1 - open),
									top: our.y * (1 - open),
									width: ICON + (screenW - ICON) * open,
									height: ICON + (screenH - ICON) * open,
									borderRadius: ICON * 0.24 * (1 - open) + 40 * open,
									background: C.bg,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 26,
									overflow: 'hidden',
									zIndex: 20,
								}}
							>
								<div style={{opacity: splash, transform: `translateY(${(1 - splash) * 30}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
									<AppIcon size={140} />
									<div style={{fontSize: 40, fontWeight: 800, textAlign: 'center', lineHeight: 1.1}}>
										Voice-to-
										<br />
										Estimate
									</div>
									<div
										style={{
											marginTop: 30,
											padding: '16px 34px',
											borderRadius: 999,
											background: C.orange,
											fontSize: 26,
											fontWeight: 800,
										}}
									>
										● Start walkthrough
									</div>
								</div>
							</div>
						) : null}
					</PhoneMockup>
				</div>
				<Tap x={PHONE_LEFT + INSET + our.x + ICON / 2} y={PHONE_TOP + INSET + our.y + ICON / 2} at={TAP_AT} />
			</Stage>
		</Scene>
	);
};
