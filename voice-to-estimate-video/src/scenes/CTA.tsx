import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {usePop} from '../anim';
import {AppIcon} from '../components/AppIcon';
import {PhoneMockup} from '../components/PhoneMockup';
import {Appear, Check, Headline, Scene, Stage} from '../components/ui';
import {C} from '../theme';
import {TOTAL} from './StepEstimate';

const PHONE_W = 300;

export const CTA: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const btn = usePop(40);
	const pulse = frame > 60 ? 1 + Math.sin((frame - 60) * 0.18) * 0.03 : 1;
	return (
		<Scene duration={duration} noFadeOut>
			<Headline text="Try it on your next 5 jobs. *Reply to this message.*" />
			<Stage>
				<Appear delay={0} y={80} style={{position: 'absolute', left: (960 - PHONE_W) / 2, top: 0}}>
					<PhoneMockup width={PHONE_W}>
						<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24}}>
							<AppIcon size={84} />
							<div style={{fontSize: 26, fontWeight: 800, textAlign: 'center'}}>Estimate ready</div>
							<div style={{fontSize: 48, fontWeight: 900, color: C.orange}}>${TOTAL.toLocaleString('en-US')}</div>
							<div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: C.green}}>
								<Check size={24} /> 7 line items
							</div>
							<div style={{marginTop: 10, padding: '12px 22px', borderRadius: 999, background: C.card, border: `2px solid ${C.line}`, fontSize: 18, fontWeight: 800}}>
								Send to homeowner
							</div>
						</div>
					</PhoneMockup>
				</Appear>
				<div style={{position: 'absolute', top: 650, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 18,
							padding: '26px 56px',
							borderRadius: 999,
							background: C.orange,
							fontSize: 50,
							fontWeight: 900,
							boxShadow: '0 14px 40px rgba(255,122,26,0.45)',
							opacity: Math.min(1, btn),
							transform: `scale(${(0.6 + 0.4 * btn) * pulse})`,
						}}
					>
						<svg width="50" height="50" viewBox="0 0 24 24">
							<path d="M4 5 H20 V16 H9 L4 20 Z" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
						</svg>
						Reply &amp; I'll set it up
					</div>
				</div>
				<Appear delay={70} y={20} style={{position: 'absolute', top: 810, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14}}>
					<Img src={staticFile('pixel-island-logo.png')} style={{height: 54}} />
					<span style={{fontSize: 30, fontWeight: 800, color: C.muted}}>Pixel Island</span>
				</Appear>
			</Stage>
		</Scene>
	);
};
