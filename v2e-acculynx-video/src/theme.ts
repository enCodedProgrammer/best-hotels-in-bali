import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Self-hosted so renders never depend on the network.
export const FONT = 'Inter';
loadFont({family: FONT, url: staticFile('fonts/Inter-Variable.woff2'), weight: '100 900'});

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

/** Style tokens from the spec (section 7), plus a few derived shades. */
export const C = {
	bg: '#0B1220',
	surface: '#141C2E',
	card: '#1B2640',
	line: '#2A3755',
	white: '#FFFFFF',
	text: '#E6EBF3',
	muted: '#8A94A6',
	orange: '#FF7A1A',
	orangeDeep: '#E5620A',
	orangeSoft: 'rgba(255,122,26,0.16)',
	green: '#22C55E',
	greenSoft: 'rgba(34,197,94,0.16)',
	paper: '#FFFFFF',
	paperLine: '#E6EAF0',
	ink: '#0B1220',
	inkSoft: '#4A5A70',
	// Kept from the first video so the shared components still work.
	bgDeep: '#070C16',
};

export const OLD_WAY_FILTER = 'grayscale(1) contrast(0.9) brightness(0.8)';

export const shadow = {
	md: '0 2px 6px rgba(0,0,0,0.25), 0 16px 40px rgba(0,0,0,0.35)',
	lg: '0 6px 12px rgba(0,0,0,0.3), 0 40px 90px rgba(0,0,0,0.5)',
};
