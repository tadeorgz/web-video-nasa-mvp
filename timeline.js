export const clamp=(x,min=0,max=1)=>Math.min(max,Math.max(min,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export const mix=(a,b,t)=>a+(b-a)*t;

const defaults={earth:0,orient:1,region:0,field:0,dry:0,rain:0,rotation:0,data:0,light:1,veil:0,retreat:0,mapAngle:0,mapScale:1,mapX:-9,mapY:0};
const pose=(id,label,camera,target,values)=>({id,label,camera,target,...defaults,...values});
export const SHOTS=[
  pose('orbit','Earth observation',[0,.2,8.1],[0,0,0],{earth:1,orient:0,light:0}),
  pose('country','United States',[0,0,4.7],[0,0,1.9],{earth:1,orient:.94,light:0}),
  pose('region','Iowa · 42° N, 93.5° W',[0,0,2.94],[0,0,2.2],{earth:1,light:0}),
  pose('field','Alex’s illustrative field',[0,20,.001],[0,0,0],{field:1,mapAngle:-2,mapScale:1.03}),
  pose('dry','Drier assumptions · Illustrative layer',[0,20,.001],[0,0,0],{field:1,dry:1,mapAngle:3.5,mapScale:1.1,mapX:-10,mapY:1}),
  pose('wet','Wetter assumptions · Illustrative layer',[0,20,.001],[0,0,0],{field:1,rain:1,mapAngle:-3,mapScale:1.06,mapX:-8,mapY:-1}),
  pose('rotation','The same field. Another sequence.',[0,20,.001],[0,0,0],{field:1,rotation:1,mapAngle:2,mapScale:1.03}),
  pose('data','Earth observations + local knowledge',[0,20,.001],[0,0,0],{field:1,rotation:1,data:1,mapScale:.99}),
  pose('film','The interface concept',[0,20,.001],[0,0,0],{field:.04,rotation:1,retreat:1,mapScale:.86}),
  pose('closing','A clearer view of the next season',[0,20,.001],[0,0,0],{field:.26,rotation:1,retreat:.7,mapScale:.94}),
  pose('team','The people behind juxtacrop',[0,20,.001],[0,0,0],{field:.1,rotation:1,retreat:.9,mapScale:.88}),
];

/** A pure, reversible mapping: time is never used to place the camera. */
export function sampleShot(index,progress){
  index=clamp(index,0,SHOTS.length-1);
  const a=SHOTS[index],b=SHOTS[Math.min(index+1,SHOTS.length-1)];
  const raw=clamp(progress);
  // Early Earth motion follows every gesture; reading scenes hold before handing off.
  const t=smooth(index<3?raw:clamp((raw-.38)/.62));
  const output={id:a.id,label:a.label,index,progress:raw};
  for(const key of Object.keys(defaults))output[key]=mix(a[key],b[key],t);
  output.camera=a.camera.map((value,i)=>mix(value,b.camera[i],t));
  output.target=a.target.map((value,i)=>mix(value,b.target[i],t));
  if(index===2){
    // Fade the global geography into a regional surface, then the conceptual field.
    output.veil=Math.sin(raw*Math.PI)**2*.93;
    output.earth=1-smooth(clamp(raw/.48));
    output.region=Math.sin(raw*Math.PI)**2;
    output.field=smooth(clamp((raw-.4)/.6));
    output.light=smooth(raw);
  }
  return output;
}

export function locateShot(scroll,anchors){
  let index=0;
  for(let i=0;i<anchors.length;i++)if(scroll>=anchors[i])index=i;
  const next=anchors[index+1];
  return {index,progress:next===undefined?0:clamp((scroll-anchors[index])/Math.max(1,next-anchors[index]))};
}
