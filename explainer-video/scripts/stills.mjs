// Usage: node scripts/stills.mjs <composition> <frame> [frame...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [, , compId, ...frames] = process.argv;
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: compId, browserExecutable});
for (const f of frames) {
	const output = `stills/${compId}-${String(f).padStart(5, '0')}.png`;
	await renderStill({composition, serveUrl, frame: Number(f), output, browserExecutable});
	console.log(output);
}
