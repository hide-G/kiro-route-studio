import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { normalizeConfig } from '../../src/core/config.mjs';

test('CP-05 設定標準化は冪等である', () => fc.assert(fc.property(fc.record({
  fps:fc.integer({min:1,max:60}), durationSeconds:fc.integer({min:1,max:20}), width:fc.integer({min:160,max:600}), height:fc.integer({min:240,max:1000})
}), (output) => { const first=normalizeConfig({output}); assert.deepEqual(normalizeConfig(first),first); }), {numRuns:100}));
