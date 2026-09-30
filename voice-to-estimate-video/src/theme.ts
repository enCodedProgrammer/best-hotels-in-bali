import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Self-hosted so renders never depend on the network.
export const FONT = 'Inter';
loadFont({family: FONT, url: staticFile('fonts/Inter-Variable.woff2'), weight: '100 900'});

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

/** Palette from the spec (section 3), plus a few navy steps for surfaces. */
export const C = {
	bg: '#0F1B2D',
	bgDeep: '#0A1321',
	surface: '#16253B',
	card: '#1C2E48',
	line: '#2B4163',
	white: '#FFFFFF',
	text: '#E8EEF6',
	muted: '#8FA1BA',
	orange: '#FF7A1A',
	orangeDeep: '#E5620A',
	orangeSoft: 'rgba(255,122,26,0.16)',
	green: '#22C55E',
	greenSoft: 'rgba(34,197,94,0.16)',
	red: '#EF4444',
	paper: '#FFFFFF',
	paperLine: '#E6EAF0',
	ink: '#0F1B2D',
	inkSoft: '#4A5A70',
};

export const shadow = {
	md: '0 2px 6px rgba(0,0,0,0.25), 0 16px 40px rgba(0,0,0,0.35)',
	lg: '0 6px 12px rgba(0,0,0,0.3), 0 40px 90px rgba(0,0,0,0.5)',
};
