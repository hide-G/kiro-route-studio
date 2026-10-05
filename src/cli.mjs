#!/usr/bin/env node
import { loadConfig } from './core/config.mjs';
import { render } from './render/render-service.mjs';

function parseArgs(args) {
  const result = { framesOnly: false };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--frames-only') result.framesOnly = true;
    else if (args[i] === '--config') result.config = args[++i];
    else if (args[i] === '--preset') {
      const name = args[++i];
      if (name !== 'halloween-neon') throw new Error(`未知のプリセットです: ${name}`);
      result.config = 'scenes/halloween-neon.json';
    } else throw new Error(`未知の引数です: ${args[i]}`);
  }
  return result;
}

try {
  const options = parseArgs(process.argv.slice(2));
  const config = await loadConfig(options.config);
  let last = -1;
  const result = await render(config, { framesOnly: options.framesOnly, onProgress: ({ completed, total, percent }) => {
    if (percent >= last + 10 || completed === total) { console.log(`生成中: ${completed}/${total} (${percent}%)`); last = percent; }
  }});
  console.log(result.framesOnly ? `PNG生成完了: ${result.frameCount}枚${result.reason ? `（${result.reason}）` : ''}` : `動画生成完了: ${result.videoPath}`);
} catch (error) {
  console.error(`エラー: ${error.message}`);
  process.exitCode = 1;
}
