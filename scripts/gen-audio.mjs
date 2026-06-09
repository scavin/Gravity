// Generate ElevenLabs narration MP3s for every tour slide, in EN and PL.
//
//   ELEVENLABS_API_KEY=sk_... ELEVEN_VOICE_ID=xxxx node scripts/gen-audio.mjs
//
// Output: public/audio/<slide-id>.<en|pl>.mp3  (skips files that already exist).
// The API key is read from the environment and never written to disk.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = process.env.ELEVEN_VOICE_ID;
const MODEL = process.env.ELEVEN_MODEL || 'eleven_multilingual_v2';
if (!KEY || !VOICE) { console.error('Set ELEVENLABS_API_KEY and ELEVEN_VOICE_ID'); process.exit(1); }

// Transpile tour.ts (type-only imports → elided) and pull out the slide text.
const tmp = resolve(root, 'scripts/.tour.tmp.mjs');
const out = ts.transpileModule(readFileSync(resolve(root, 'src/ui/tour.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
writeFileSync(tmp, out);
const { STEPS, PL } = await import(pathToFileURL(tmp).href);

const outDir = resolve(root, 'public/audio');
mkdirSync(outDir, { recursive: true });

// Strip a few symbols that read badly aloud; keep it light.
const clean = (s) => s.replace(/·/g, ' ').replace(/—/g, ', ').replace(/\s+/g, ' ').trim();

async function tts(text, file) {
  if (existsSync(file)) { console.log('skip', file); return; }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: { stability: 0.4, similarity_boost: 0.75 } }),
  });
  if (!res.ok) { console.error(`\nHTTP ${res.status} for ${file}:`, await res.text()); process.exit(1); }
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log('wrote', file);
}

for (const step of STEPS) {
  const en = `${step.title}. ${step.body}`;
  const pl = PL[step.id] ? `${PL[step.id].title}. ${PL[step.id].body}` : en;
  await tts(clean(en), resolve(outDir, `${step.id}.en.mp3`));
  await tts(clean(pl), resolve(outDir, `${step.id}.pl.mp3`));
}
console.log('\nDone:', STEPS.length, 'slides ×2 languages.');
