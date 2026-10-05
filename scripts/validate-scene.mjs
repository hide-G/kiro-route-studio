import { loadConfig } from '../src/core/config.mjs';
import { frameCount } from '../src/core/timeline.mjs';
const config = await loadConfig('scenes/halloween-neon.json');
if (config.scene.buildings.length < 5) throw new Error('建物が不足しています');
if (config.scene.route.length < 4) throw new Error('経路点が不足しています');
if (frameCount(config) !== 288) throw new Error('既定フレーム数が288ではありません');
console.log(`シーン検証成功: 建物${config.scene.buildings.length}件、経路${config.scene.route.length}点、${frameCount(config)}フレーム`);
