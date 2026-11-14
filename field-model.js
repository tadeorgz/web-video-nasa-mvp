import { clamp, smooth, mix, sampleShot } from './timeline.js';

export const CROPS={
  corn:{name:'Corn',color:'#c8ad56',ink:'#66551f',icon:'corn'},
  soy:{name:'Soybeans',color:'#8eaf78',ink:'#365331',icon:'leaf'},
  wheat:{name:'Wheat',color:'#d4bb82',ink:'#7b6035',icon:'wheat'},
  rye:{name:'Rye cover',color:'#64845b',ink:'#304d30',icon:'wheat'},
};
export const PARCELS=[
  {id:'north',name:'North',points:'514,38 1033,41 1037,287 577,291 515,278',center:[785,162],initial:'corn'},
  {id:'central',name:'Central',points:'581,303 1037,301 1043,553 517,557 516,370 578,368',center:[795,434],initial:'soy'},
  {id:'south',name:'South',points:'517,571 1044,569 1050,733 514,736',center:[790,650],initial:'corn'},
];
export const BOUNDARY='M514 38 L1033 41 L1050 733 L514 736 L517 370 L578 368 L581 303 L515 278 Z';
const ramp=(p,a,b)=>smooth((p-a)/(b-a));
const flight=(crop,parcel,p,a,b)=>({crop,parcel,progress:clamp((p-a)/(b-a)),visible:p>a&&p<b});

/** All map states depend on scroll alone, including simulated crop placement. */
export function sampleField(index,progress,reduced=false){
  const p=clamp(progress),s=sampleShot(index,p);
  const build=index<3?0:index>3?1:p;
  const state={opacity:s.field,angle:reduced?0:s.mapAngle,scale:reduced?1:s.mapScale,x:reduced?-9:s.mapX,y:reduced?0:s.mapY,
    boundary:ramp(build,.02,.16),catalog:ramp(build,.32,.43),timeline:ramp(build,.89,1),
    dry:s.dry,wet:s.rain,data:s.data,retreat:s.retreat,build,campaign:'2026/27',campaignIndex:0,
    label:'Field plan',status:'Place crops across the field',flights:[],parcels:[]};
  const drops=[[.43,.59],[.59,.75],[.75,.91]];
  state.parcels=PARCELS.map((parcel,i)=>({id:parcel.id,crop:parcel.initial,draw:ramp(build,.13+i*.055,.32+i*.055),name:ramp(build,.27,.37),assigned:ramp(build,drops[i][1]-.025,drops[i][1]+.025),highlight:build>drops[i][0]&&build<drops[i][1]?Math.sin(clamp((build-drops[i][0])/(drops[i][1]-drops[i][0]))*Math.PI):0}));
  if(index===3)state.flights=drops.map(([a,b],i)=>flight(PARCELS[i].initial,i,p,a,b));
  if(index===3)state.dry*=ramp(p,.94,1);
  if(index===4||index===5){state.status='Compare explicit assumptions';state.label=index===4?'Drier conditions':'Wetter conditions';}
  if(index===6){
    state.campaignIndex=ramp(p,.12,.8);state.label='Explore another sequence';state.status='Same parcels. Different crop plan.';
    if(p>.17&&p<.62){state.campaign='Winter cover';state.parcels[0].assigned=1-ramp(p,.17,.23);if(p>=.41){state.parcels[0].crop='rye';state.parcels[0].assigned=ramp(p,.40,.43);}}
    if(p>=.62){state.campaign='2027/28';state.parcels[0].crop=p<.82?'rye':'soy';state.parcels[0].assigned=p<.82?1-ramp(p,.62,.7):ramp(p,.81,.84);state.parcels[1].crop='corn';state.parcels[2].crop='soy';}
    state.flights=[flight('rye',0,p,.24,.42),flight('soy',0,p,.64,.83)];
    state.parcels[0].highlight=state.flights.some(f=>f.visible)?.8:0;
  }
  if(index>6){state.campaign='2027/28';state.campaignIndex=1;state.parcels.forEach((parcel,i)=>{parcel.crop=i===1?'corn':'soy';parcel.assigned=1;});state.label=index===7?'Connect the context':'A clearer plan';state.status='Illustrative plan · No live evaluation';}
  if(index<3){state.catalog=0;state.timeline=0;}
  if(reduced&&index===3){state.boundary=state.catalog=state.timeline=1;state.parcels.forEach(parcel=>{parcel.draw=parcel.name=parcel.assigned=1;});state.flights=[];}
  if(reduced&&index===6){state.campaign='2027/28';state.campaignIndex=1;state.parcels.forEach((parcel,i)=>{parcel.crop=i===1?'corn':'soy';parcel.assigned=1;});state.flights=[];}
  state.catalog*=1-state.retreat;state.timeline*=1-state.retreat;
  return state;
}

export function mapPoint(point,view,state){
  const rad=state.angle*Math.PI/180;
  const x=(point[0]/1200-.5)*view.width*state.scale,y=(point[1]/780-.5)*view.height*state.scale;
  return {x:view.left+view.width/2+state.x/100*view.width+x*Math.cos(rad)-y*Math.sin(rad),y:view.top+view.height/2+state.y/100*view.height+x*Math.sin(rad)+y*Math.cos(rad)};
}
export function flightPoint(start,end,progress){const t=smooth(progress);return{x:mix(start.x,end.x,t),y:mix(start.y,end.y,t)-Math.sin(t*Math.PI)*20};}
