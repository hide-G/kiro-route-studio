import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { worldToScreen, screenToWorld } from '../../src/core/isometric.mjs';

const finite = fc.double({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true });
const positive = fc.double({ min: 0.1, max: 500, noNaN: true, noDefaultInfinity: true });

test('CP-01 投影の往復は元座標に一致する', () => fc.assert(fc.property(finite, finite, finite, finite, positive, positive, (x,y,ox,oy,tw,th) => {
  const options={tileWidth:tw,tileHeight:th,origin:{x:ox,y:oy}}; const actual=screenToWorld(worldToScreen({x,y},options),options);
  assert.ok(Math.abs(actual.x-x) < 1e-9); assert.ok(Math.abs(actual.y-y) < 1e-9);
}), { numRuns: 100 }));

test('CP-02 投影軸の単調性を保つ', () => fc.assert(fc.property(finite, finite, positive, positive, positive, (x,y,d,tw,th) => {
  const o={tileWidth:tw,tileHeight:th,origin:{x:0,y:0}}, p=worldToScreen({x,y},o), px=worldToScreen({x:x+d,y},o), py=worldToScreen({x,y:y+d},o);
  assert.ok(px.x>p.x && px.y>p.y && py.x<p.x && py.y>p.y);
}), { numRuns: 100 }));
