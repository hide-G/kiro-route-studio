import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { normalizeConfig } from '../../src/core/config.mjs';
import { renderFrame } from '../../src/render/scene-renderer.mjs';

const config = normalizeConfig({ output: { width: 160, height: 240, fps: 1, durationSeconds: 1 }, scene: { origin: { x: 80, y: 120 }, tileWidth: 24, tileHeight: 12, route: [{x:-1,y:0},{x:1,y:0}], buildings: [] } });

test('PNG描画は有効なシグネチャで決定論的である', () => {
  const a = renderFrame(config, 0, 1);
  const b = renderFrame(config, 0, 1);
  assert.deepEqual([...a.subarray(0, 8)], [137,80,78,71,13,10,26,10]);
  assert.equal(createHash('sha256').update(a).digest('hex'), createHash('sha256').update(b).digest('hex'));
});
