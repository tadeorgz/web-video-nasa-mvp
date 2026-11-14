import * as THREE from './vendor/three.module.js';
import { sampleShot, SHOTS, clamp, mix, smooth } from './timeline.js';

const UP=new THREE.Vector3(0,1,0);
const terrainY=(x,z)=>.13+Math.sin(x*.29+z*.16)*.35+Math.cos(z*.47-x*.12)*.19;
function random(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const seeded=random(749);
function latLon(lon,lat,r=2.21){const p=THREE.MathUtils.degToRad(lat),t=THREE.MathUtils.degToRad(lon);return new THREE.Vector3(Math.cos(p)*Math.cos(t)*r,Math.sin(p)*r,-Math.cos(p)*Math.sin(t)*r);}
function material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.95,...extra});}
function fadeable(group){const list=new Set();group.traverse(object=>{if(object.material){for(const mat of Array.isArray(object.material)?object.material:[object.material]){if(!list.has(mat)){mat.userData.opacity=mat.opacity;mat.transparent=true;list.add(mat);}}}});return [...list];}
function opacity(group,materials,value){group.visible=value>.002;if(!group.visible)return;for(const mat of materials){mat.opacity=mat.userData.opacity*value;mat.depthWrite=value>.96&&mat.userData.opacity>.98;}}
function textureCanvas(draw,width=512,height=512){const c=document.createElement('canvas');c.width=width;c.height=height;draw(c.getContext('2d'),width,height);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;}
function planet(scene,mobile){
  const group=new THREE.Group();scene.add(group);
  const surfaceMat=material('#31576b',{roughness:1});
  const earth=new THREE.Mesh(new THREE.SphereGeometry(2.2,mobile?64:112,mobile?40:72),surfaceMat);group.add(earth);
  const loader=new THREE.TextureLoader();
  loader.load(mobile?'./assets/earth-mobile.jpg':'./assets/earth-nasa.jpg',texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;surfaceMat.map=texture;surfaceMat.color.set('#ffffff');surfaceMat.needsUpdate=true;},undefined,()=>{});
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(2.25,64,40),new THREE.ShaderMaterial({side:THREE.BackSide,transparent:true,depthWrite:false,uniforms:{intensity:{value:1}},vertexShader:'varying vec3 n;varying vec3 p;void main(){n=normalize(normalMatrix*normal);vec4 v=modelViewMatrix*vec4(position,1.);p=v.xyz;gl_Position=projectionMatrix*v;}',fragmentShader:'varying vec3 n;varying vec3 p;uniform float intensity;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(-p))),3.2);gl_FragColor=vec4(.28,.62,1.,f*.72*intensity);}'}));group.add(atmosphere);
  const cloudMap=textureCanvas((ctx,w,h)=>{for(let i=0;i<180;i++){const x=seeded()*w,y=seeded()*h,r=8+seeded()*26;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.42)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.save();ctx.translate(x,y);ctx.scale(2.5,.45);ctx.translate(-x,-y);ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();}},1024,512);
  const clouds=new THREE.Mesh(new THREE.SphereGeometry(2.215,64,40),new THREE.MeshStandardMaterial({map:cloudMap,transparent:true,opacity:.47,roughness:1,depthWrite:false}));group.add(clouds);
  const boundaries=new THREE.Group();group.add(boundaries);
  fetch('./assets/boundaries.json').then(r=>r.json()).then(data=>{
    for(const [name,geometry]of Object.entries(data)){
      const polygons=geometry.type==='MultiPolygon'?geometry.coordinates:[geometry.coordinates];
      for(const polygon of polygons){const points=polygon[0].map(([lon,lat])=>latLon(lon,lat,2.224));const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:name==='usa'?'#d7e6cc':'#e5d7a2',transparent:true,opacity:.9}));line.userData.boundary=name;boundaries.add(line);}
    }
  }).catch(()=>{});
  const marker=new THREE.Mesh(new THREE.SphereGeometry(.012,12,8),new THREE.MeshBasicMaterial({color:'#f1e2b0'}));marker.position.copy(latLon(-93.5,42,2.23));group.add(marker);
  const initial=new THREE.Quaternion().setFromEuler(new THREE.Euler(.12,-1.0,-.1));
  const target=new THREE.Quaternion().setFromUnitVectors(latLon(-93.5,42,1).normalize(),new THREE.Vector3(0,0,1));
  const satellite=new THREE.Group();satellite.add(new THREE.Mesh(new THREE.BoxGeometry(.13,.1,.12),material('#c9b586',{metalness:.6,roughness:.4})));
  for(const sign of [-1,1]){const panel=new THREE.Mesh(new THREE.BoxGeometry(.3,.012,.16),material('#365d85',{metalness:.4}));panel.position.x=sign*.23;satellite.add(panel);}scene.add(satellite);
  const starsGeometry=new THREE.BufferGeometry();const stars=[];for(let i=0;i<(mobile?160:450);i++){const angle=seeded()*Math.PI*2,r=13+seeded()*12;stars.push(Math.cos(angle)*r,(seeded()-.5)*25,-10-seeded()*20);}starsGeometry.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));
  const starField=new THREE.Points(starsGeometry,new THREE.PointsMaterial({color:'#bbcfd9',size:.026,transparent:true,opacity:.7,sizeAttenuation:true}));scene.add(starField);
  const mats=fadeable(group),satMats=fadeable(satellite);
  return {group,clouds,initial,target,marker,boundaries,mats,satellite,satMats,starField};
}

function regionalTerrain(scene){
  const geometry=new THREE.PlaneGeometry(22,14.3,1,1);geometry.rotateX(-Math.PI/2);const p=geometry.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,0);geometry.computeVertexNormals();
  const mat=material('#6c8460');new THREE.TextureLoader().load('./assets/iowa-aerial.jpg',t=>{t.colorSpace=THREE.SRGBColorSpace;mat.map=t;mat.color.set('#ffffff');mat.needsUpdate=true;},undefined,()=>{});
  const group=new THREE.Group();group.add(new THREE.Mesh(geometry,mat));scene.add(group);return {group,mats:fadeable(group)};
}

export function initOrbit(host){
  if(new URLSearchParams(location.search).get('view')==='static'){host.dataset.renderMode='static';return null;}
  const mobile=innerWidth<=680,reduced=matchMedia('(prefers-reduced-motion: reduce)');let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:!mobile,powerPreference:'low-power'});}catch{host.dataset.renderMode='static';return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.65));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  const canvas=renderer.domElement;host.prepend(canvas);canvas.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.02,110);
  const hemi=new THREE.HemisphereLight('#dbeaff','#7b7859',1.1);scene.add(hemi);
  const sun=new THREE.DirectionalLight('#fff5df',3.1);sun.position.set(-6,9,7);scene.add(sun);
  const fill=new THREE.DirectionalLight('#83b7e0',1.2);fill.position.set(5,-1,-5);scene.add(fill);
  const earth=planet(scene,mobile),region=regionalTerrain(scene);
  const spaceColor=new THREE.Color('#030b13'),paperColor=new THREE.Color('#f6f7f0'),background=new THREE.Color();
  const veil=host.querySelector('.cloud-veil'),vignette=host.querySelector('.stage-vignette');
  let paused=document.documentElement.classList.contains('motion-paused'),last=0,ambient=0,animation=0,dirty=true,visible=true,lastRender=0,frames=0,lost=false,current={index:0,progress:0};
  function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();dirty=true;schedule();}
  function render(now){
    if(lost)return;
    const s=sampleShot(current.index,reduced.matches?0:current.progress),compact=innerWidth<=680;
    background.copy(spaceColor).lerp(paperColor,s.light);host.style.background=background.getStyle();host.style.setProperty('--stage-background',background.getStyle());
    host.style.setProperty('--space',String(1-s.light));
    veil.style.opacity=String(s.veil);vignette.style.opacity=current.index>=3||compact?'0':'.94';
    vignette.style.background=s.light<.55?'linear-gradient(90deg,#030b13b8,transparent 68%)':'linear-gradient(90deg,#f6f7f0,transparent 60%)';
    host.dataset.camera=s.camera.map(v=>v.toFixed(4)).join(',');
    // No WebGL work continues behind the 2D field presentation.
    if(current.index>=3){canvas.style.opacity='0';canvas.hidden=true;host.classList.add('is-ready');host.dataset.renderMode='map-2d';dirty=false;last=0;return;}
    canvas.hidden=false;canvas.style.opacity=String(1-s.field);
    const delta=last?Math.min(.05,(now-last)/1000):0;last=now;if(!paused&&!reduced.matches)ambient+=delta;
    if(reduced.matches){s.camera=[0,.2,8.1];s.target=[0,0,0];s.orient=1;s.veil=0;}
    camera.position.fromArray(s.camera);camera.lookAt(new THREE.Vector3().fromArray(s.target));
    const size=renderer.getSize(new THREE.Vector2()),offset=compact?0:mix(-.17,-.03,smooth(s.orient))*s.earth;
    camera.setViewOffset(size.x,size.y,offset*size.x,0,size.x,size.y);renderer.setClearColor(background,1);
    opacity(earth.group,earth.mats,s.earth);earth.group.quaternion.slerpQuaternions(earth.initial,earth.target,smooth(s.orient));
    earth.clouds.rotation.y=ambient*.008;earth.marker.visible=s.orient>.65;earth.boundaries.visible=s.orient>.25;
    opacity(earth.satellite,earth.satMats,clamp(1-s.orient*1.4)*s.earth);
    const angle=.9+ambient*.08;earth.satellite.position.set(Math.cos(angle)*3.1,.4,Math.sin(angle)*3.1);earth.satellite.rotation.set(.2,-angle,.3);
    earth.starField.material.opacity=(1-s.light)*.7;opacity(region.group,region.mats,s.region*.9);
    renderer.render(scene,camera);host.classList.add('is-ready');host.dataset.renderMode='webgl';host.dataset.ambient=ambient.toFixed(3);host.dataset.frames=String(++frames);lastRender=now;dirty=false;
  }
  function loop(now){animation=0;if(document.hidden||!visible||lost)return;const active=!paused&&!reduced.matches&&current.index<3;if(dirty||active&&now-lastRender>=30)render(now);if(active||dirty)schedule();}
  function schedule(){if(!animation&&!document.hidden&&visible&&!lost)animation=requestAnimationFrame(loop);}
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=0;dirty=true;schedule();}else{cancelAnimationFrame(animation);animation=0;}}).observe(host);
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(animation);animation=0;last=0;if(!document.hidden){dirty=true;schedule();}});
  addEventListener('motionchange',event=>{paused=event.detail.paused;last=0;dirty=true;schedule();});reduced.addEventListener('change',()=>{dirty=true;schedule();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;cancelAnimationFrame(animation);host.classList.remove('is-ready');host.classList.add('no-webgl');host.dataset.renderMode='static';});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());resize();
  return(index,progress)=>{current={index,progress};host.classList.toggle('fallback-field-view',index>=3);dirty=true;if(index>=3)render(performance.now());else schedule();};
}
