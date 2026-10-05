import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { frameName, progressPercent } from '../../src/core/timeline.mjs';

test('CP-06 フレーム名は0始まりで連続し重複しない', () => fc.assert(fc.property(fc.integer({min:1,max:500}), (count) => {
  const names=Array.from({length:count},(_,i)=>frameName(i)); assert.equal(new Set(names).size,count); assert.equal(names[0],'frame-000000.png');
}), {numRuns:100}));

test('CP-08 進捗は範囲内で単調非減少し末尾100になる', () => fc.assert(fc.property(fc.integer({min:2,max:500}), (count) => {
  const values=Array.from({length:count},(_,i)=>progressPercent(i,count)); assert.equal(values[0],0); assert.equal(values.at(-1),100); for(let i=1;i<count;i+=1) assert.ok(values[i]>=values[i-1]);
}), {numRuns:100}));
