import { initCommon } from './common.js';
import { locateShot, sampleShot, SHOTS } from './timeline.js';
import { initFieldMap } from './field-map.js';
initCommon();
const sections=[...document.querySelectorAll('[data-chapter]')];
const stage=document.querySelector('#world-stage');
const paintMap=initFieldMap(stage);
let anchors=[],renderScene=null,queued=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const measure=()=>{anchors=sections.map(section=>section.getBoundingClientRect().top+scrollY-(innerWidth<=680?100:Math.max(105,innerHeight*.2)));anchors[0]=0;};
function update(){
  queued=false;
  const location=locateShot(scrollY,anchors);
  const shot=SHOTS[location.index];
  document.body.dataset.chapter=shot.id;
  document.body.classList.toggle('is-space',sampleShot(location.index,reduced.matches?0:location.progress).light<.55);
  document.body.classList.toggle('is-reading',location.index>=8);
  stage.dataset.shot=shot.id;
  paintMap(location.index,location.progress,reduced.matches);
  if(location.index>=3){stage.style.background='#f6f7f0';stage.style.setProperty('--stage-background','#f6f7f0');}
  document.querySelector('.location-name').textContent=shot.label;
  document.querySelectorAll('.chapter-nav a').forEach((link,i)=>{if(i===location.index)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
  document.querySelectorAll('.chapter-inner').forEach((copy,i)=>{copy.style.setProperty('--chapter-focus',i===location.index?'1':'.78');});
  if(renderScene)renderScene(location.index,location.progress);
  else stage.classList.toggle('fallback-field-view',location.index>=3);
}
const requestUpdate=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
measure();update();
addEventListener('scroll',requestUpdate,{passive:true});
addEventListener('resize',()=>{measure();requestUpdate();});
addEventListener('hashchange',requestUpdate);
new ResizeObserver(()=>{measure();requestUpdate();}).observe(document.querySelector('.journey-content'));
reduced.addEventListener('change',requestUpdate);
document.fonts.ready.then(()=>{measure();requestUpdate();});
import('./scene.js').then(({initOrbit})=>{
  renderScene=initOrbit(stage,()=>{const p=locateShot(scrollY,anchors);return p;});
  stage.classList.toggle('no-webgl',!renderScene);requestUpdate();
}).catch(error=>{stage.classList.add('no-webgl');console.warn('Using the accessible static journey.',error);});
