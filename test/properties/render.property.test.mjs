import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fc from 'fast-check';
import { normalizeConfig } from '../../src/core/config.mjs';
import { renderFrame } from '../../src/render/scene-renderer.mjs';

test('CP-07 同じ設定・seed・frameのPNGハッシュは一致する', () => fc.assert(fc.property(fc.integer({min:0,max:19}), fc.integer({min:0,max:4294967295}), (index,seed) => {
  const config=normalizeConfig({output:{width:160,height:240,fps:2,durationSeconds:1},scene:{seed,origin:{x:80,y:120},tileWidth:24,tileHeight:12,route:[{x:-1,y:0},{x:1,y:0}],buildings:[]}});
  const hash=(buffer)=>createHash('sha256').update(buffer).digest('hex'); assert.equal(hash(renderFrame(config,index,20)),hash(renderFrame(config,index,20)));
}), {numRuns:20}));
