import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { interpolateRoute, routeLength } from '../../src/core/route.mjs';

const point=fc.record({x:fc.integer({min:-100,max:100}),y:fc.integer({min:-100,max:100})});
const routes=fc.array(point,{minLength:2,maxLength:12});

test('CP-03 経路補間は始点と終点に一致する', () => fc.assert(fc.property(routes, (route) => {
  const start=interpolateRoute(route,0), end=interpolateRoute(route,1), expectedEnd=routeLength(route)===0?route[0]:route.at(-1);
  assert.equal(start.x,route[0].x); assert.equal(start.y,route[0].y); assert.equal(end.x,expectedEnd.x); assert.equal(end.y,expectedEnd.y);
}), {numRuns:100}));

test('CP-04 距離基準補間の移動量は経路長×進捗差以下である', () => fc.assert(fc.property(routes, fc.double({min:0,max:0.99,noNaN:true}), fc.double({min:0.000001,max:0.01,noNaN:true}), (route,t,delta) => {
  const a=interpolateRoute(route,t), b=interpolateRoute(route,Math.min(1,t+delta));
  assert.ok(Math.hypot(b.x-a.x,b.y-a.y) <= routeLength(route)*delta + 1e-7);
}), {numRuns:100}));
