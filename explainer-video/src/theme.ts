import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are self-hosted in public/fonts so renders never depend on the network.
export const FONT_SERIF = 'Instrument Serif';
export const FONT_SANS = 'Inter';

loadFont({family: FONT_SERIF, url: staticFile('fonts/InstrumentSerif-Regular.woff2'), style: 'normal', weight: '400'});
loadFont({family: FONT_SERIF, url: staticFile('fonts/InstrumentSerif-Italic.woff2'), style: 'italic', weight: '400'});
loadFont({family: FONT_SANS, url: staticFile('fonts/Inter-Variable.woff2'), weight: '100 900'});

export const FPS = 60;
export const sec = (s: number) => Math.round(s * FPS);

export const C = {
	bg: '#F7F3EC',
	bgDeep: '#EFE8DC',
	card: '#FFFFFF',
	ink: '#14201F',
	inkSoft: '#3B4745',
	muted: '#7A827E',
	line: '#E4DCCD',
	teal: '#0F6B66',
	tealSoft: '#D8EBE7',
	gold: '#D9A441',
	goldDeep: '#B7832A',
	goldSoft: '#F6E9CC',
	coral: '#E26D4F',
	coralSoft: '#FBE3DC',
	green: '#2E9A5E',
	greenSoft: '#DDF1E4',
	night: '#0E1716',
};

export const shadow = {
	sm: '0 1px 2px rgba(20,32,31,0.06), 0 2px 8px rgba(20,32,31,0.06)',
	md: '0 2px 4px rgba(20,32,31,0.05), 0 12px 32px rgba(20,32,31,0.10)',
	lg: '0 4px 8px rgba(20,32,31,0.05), 0 30px 70px rgba(20,32,31,0.16)',
};

export type BotId = 'scout' | 'pin' | 'quill' | 'echo' | 'concierge';

// Named after the Ghostbusters team: character names only, drawn as our own original bots.
export const BOTS: Record<
	BotId,
	{name: string; role: string; job: string; color: string; soft: string}
> = {
	scout: {name: 'Winston', role: 'The Scout', job: 'Finds new listings', color: '#D17A22', soft: '#F8E4CC'},
	pin: {name: 'Egon', role: 'The Architect', job: 'Finds the exact location', color: '#3C77B0', soft: '#DCE8F4'},
	concierge: {name: 'Venkman', role: 'The Closer', job: 'Handles messages & leads', color: '#C4573D', soft: '#F8DFD7'},
	quill: {name: 'Slimer', role: 'The Automator', job: 'Builds & posts listings', color: '#8466B3', soft: '#E9E1F4'},
	echo: {name: 'Ray', role: 'The Creator', job: 'Creates your social posts', color: '#3E8E4E', soft: '#DDEFE0'},
};

/** Order the team is introduced in (follows the listing workflow). */
export const BOT_ORDER: BotId[] = ['scout', 'pin', 'concierge', 'quill', 'echo'];
