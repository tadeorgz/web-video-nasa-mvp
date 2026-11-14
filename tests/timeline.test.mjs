import assert from 'node:assert/strict';
import { SHOTS, sampleShot, locateShot } from '../timeline.js';

let samples=0;
for(let i=0;i<SHOTS.length;i++)for(let j=0;j<=100;j++){
  const p=j/100,state=sampleShot(i,p);
  assert(state.camera.every(Number.isFinite)&&state.target.every(Number.isFinite));
  for(const key of ['earth','region','field','dry','rain','rotation','data','light','veil','retreat'])assert(state[key]>=0&&state[key]<=1,`${i}:${p} ${key}`);
  assert.deepEqual(state,sampleShot(i,p),'Revisiting a scroll position must reconstruct the same state');samples++;
}
for(let i=0;i<SHOTS.length-1;i++){
  const a=sampleShot(i,1),b=sampleShot(i+1,0);
  assert(a.camera.every((value,j)=>Math.abs(value-b.camera[j])<1e-8),`Camera continuity at ${SHOTS[i+1].id}`);
  for(const key of ['earth','region','field','dry','rain','rotation','data','light','veil','retreat'])assert(Math.abs(a[key]-b[key])<1e-8,`${key} continuity at ${SHOTS[i+1].id}`);
}
const anchors=[0,800,1600,2400,3200,4000,4800,5600,6800,8000,9200];
assert.deepEqual(locateShot(-200,anchors),{index:0,progress:0});
assert.deepEqual(locateShot(3600,anchors),{index:4,progress:.5});
assert.deepEqual(locateShot(99999,anchors),{index:10,progress:0});
assert.equal(sampleShot(4,0).dry,1);
assert.equal(sampleShot(5,0).rain,1);
assert.equal(sampleShot(6,0).rotation,1);
assert.equal(sampleShot(7,0).data,1);
assert.equal(sampleShot(8,0).rain,0);
assert(sampleShot(2,.5).veil>.9,'Cloud cover should conceal the change of geographic scale');
console.log(`PASS Orbit timeline: ${samples} deterministic samples, 10 continuous camera handoffs, weather/rotation/data states and direct jumps.`);
