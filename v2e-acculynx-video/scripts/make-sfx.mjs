// Generates simple synthesized sound effects into public/audio/sfx/ (16-bit mono WAV).
// Usage: node scripts/make-sfx.mjs
// Swap any of these for library sounds with the same file name.
import fs from 'node:fs';

const SR = 44100;
const out = 'public/audio/sfx';
fs.mkdirSync(out, {recursive: true});

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

const write = (name, samples) => {
	const n = samples.length;
	const buf = Buffer.alloc(44 + n * 2);
	buf.write('RIFF', 0);
	buf.writeUInt32LE(36 + n * 2, 4);
	buf.write('WAVEfmt ', 8);
	buf.writeUInt32LE(16, 16);
	buf.writeUInt16LE(1, 20);
	buf.writeUInt16LE(1, 22);
	buf.writeUInt32LE(SR, 24);
	buf.writeUInt32LE(SR * 2, 28);
	buf.writeUInt16LE(2, 32);
	buf.writeUInt16LE(16, 34);
	buf.write('data', 36);
	buf.writeUInt32LE(n * 2, 40);
	for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32000), 44 + i * 2);
	fs.writeFileSync(`${out}/${name}.wav`, buf);
	console.log(`${out}/${name}.wav`);
};

const make = (dur, fn) => Array.from({length: Math.round(dur * SR)}, (_, i) => fn(i / SR, i));
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));

// Clock tick: short bright click.
write('tick', make(0.06, (t) => env(t, 0.001, 0.008) * (0.6 * Math.sin(2 * Math.PI * 3200 * t) + 0.4 * rnd()) * 0.7));

// Keyboard clatter: irregular key clicks over 1.2s.
{
	const hits = [];
	let at = 0.02;
	while (at < 1.15) {
		hits.push([at, 1800 + Math.abs(rnd()) * 1600, 0.5 + Math.abs(rnd()) * 0.5]);
		at += 0.05 + Math.abs(rnd()) * 0.09;
	}
	write(
		'keys',
		make(1.2, (t) => {
			let v = 0;
			for (const [h, f, a] of hits) if (t >= h && t < h + 0.04) v += a * env(t - h, 0.0008, 0.006) * (0.5 * rnd() + 0.5 * Math.sin(2 * Math.PI * f * (t - h)));
			return v * 0.55;
		}),
	);
}

// Whoosh: noise through a sweeping one-pole low-pass, swelling then fading.
{
	let y = 0;
	write(
		'whoosh',
		make(0.7, (t) => {
			const cut = 300 + 5000 * Math.sin(Math.PI * Math.min(1, t / 0.7));
			const a = 1 - Math.exp((-2 * Math.PI * cut) / SR);
			y += a * (rnd() - y);
			return y * Math.sin(Math.PI * (t / 0.7)) ** 2 * 1.6;
		}),
	);
}

// Pop: quick downward sine blip.
{
	let ph = 0;
	write(
		'pop',
		make(0.12, (t) => {
			ph += (2 * Math.PI * (900 - 2600 * t)) / SR;
			return Math.sin(ph) * env(t, 0.002, 0.03) * 0.7;
		}),
	);
}

// Thud / bass hit: low sine sweep with a click on top.
const bass = (dur, f0, f1, d, click) => {
	let ph = 0;
	return make(dur, (t) => {
		ph += (2 * Math.PI * (f1 + (f0 - f1) * Math.exp(-t / 0.08))) / SR;
		const body = Math.tanh(2.2 * Math.sin(ph)) * env(t, 0.003, d);
		return 0.85 * body + click * env(t, 0.0005, 0.004) * rnd();
	});
};
write('thud', bass(0.45, 140, 48, 0.12, 0.5));
write('bass', bass(0.9, 110, 42, 0.3, 0.25));

// Bass drop: longer falling boom for "Now watch this".
write('drop', bass(1.4, 160, 32, 0.55, 0.2));

// Cha-ching: register click, then two bell tones.
{
	const bell = (t, f) => Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.76 * t) + 0.25 * Math.sin(2 * Math.PI * f * 5.4 * t);
	write(
		'chaching',
		make(1.1, (t) => {
			let v = 0.5 * env(t, 0.0005, 0.01) * rnd();
			if (t > 0.08) v += 0.3 * bell(t - 0.08, 1568) * env(t - 0.08, 0.002, 0.25);
			if (t > 0.2) v += 0.35 * bell(t - 0.2, 2093) * env(t - 0.2, 0.002, 0.35);
			return v * 0.6;
		}),
	);
}

// Lock-in: two firm clicks and a short confirm chime.
write(
	'lockin',
	make(0.6, (t) => {
		let v = 0;
		for (const h of [0, 0.06]) if (t >= h) v += 0.7 * env(t - h, 0.0005, 0.006) * (rnd() * 0.5 + 0.5 * Math.sin(2 * Math.PI * 1400 * (t - h)));
		if (t > 0.1) v += 0.3 * (Math.sin(2 * Math.PI * 880 * t) + Math.sin(2 * Math.PI * 1320 * t)) * env(t - 0.1, 0.004, 0.14);
		return v * 0.7;
	}),
);
