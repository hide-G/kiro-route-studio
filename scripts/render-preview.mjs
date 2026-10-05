import { loadConfig, normalizeConfig } from '../src/core/config.mjs';
import { render } from '../src/render/render-service.mjs';

const base = await loadConfig('scenes/halloween-neon.json');
const config = normalizeConfig({ ...base, output: { ...base.output, fps: 12, durationSeconds: 1, framesDir: 'output/preview-frames', videoPath: 'output/preview.mp4' } });
const framesOnly = process.argv.includes('--frames-only');
const result = await render(config, { framesOnly, onProgress: ({ completed, total, percent }) => console.log(`プレビュー: ${completed}/${total} (${percent}%)`) });
console.log(JSON.stringify(result, null, 2));
