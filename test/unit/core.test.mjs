import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeConfig } from '../../src/core/config.mjs';
import { worldToScreen, screenToWorld } from '../../src/core/isometric.mjs';
import { interpolateRoute } from '../../src/core/route.mjs';
import { frameCount, frameName, progressPercent } from '../../src/core/timeline.mjs';
import { resolveOutput } from '../../src/render/frame-writer.mjs';

test('設定標準化は既定値を補い冪等である', () => {
  const first = normalizeConfig({});
  assert.deepEqual(normalizeConfig(first), first);
  assert.equal(frameCount(first), 288);
});

test('投影と逆投影が一致する', () => {
  const options = { tileWidth: 92, tileHeight: 46, origin: { x: 540, y: 900 } };
  const point = { x: 2.5, y: -3.25 };
  const restored = screenToWorld(worldToScreen(point, options), options);
  assert.ok(Math.abs(restored.x - point.x) < 1e-9);
  assert.ok(Math.abs(restored.y - point.y) < 1e-9);
});

test('経路端点、フレーム名、進捗を満たす', () => {
  const route = [{ x: 0, y: 0 }, { x: 2, y: 0 }];
  assert.deepEqual(interpolateRoute(route, 0), route[0]);
  assert.deepEqual(interpolateRoute(route, 1), route[1]);
  assert.equal(frameName(12), 'frame-000012.png');
  assert.equal(progressPercent(9, 10), 100);
});

test('output外の削除対象を拒否する', () => {
  assert.throws(() => resolveOutput('../danger'), /output\/ 配下/);
});
