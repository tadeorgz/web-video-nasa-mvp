import { CONFIG } from './config.js';
import { sources, supportingSources } from './content.js';

export const icon = (name, cls = '') => {
  const paths = {
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    play: '<path d="m9 5 11 7-11 7z"/>',
    weather: '<path d="M7 15a5 5 0 1 1 9-5 4 4 0 1 1 1 8H7"/><path d="m8 20-1 2m6-2-1 2m6-2-1 2M5 4 4 2m-1 8H1M9 2V0"/>',
    layers: '<path d="m12 3 10 6-10 6L2 9zM2 13l10 6 10-6M2 17l10 6 10-6"/>',
    rotation: '<path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5M4 16a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',
    leaf: '<path d="M20 3C9 2 3 8 5 15c2 7 15 7 15-12ZM4 21l12-13"/>',
    orbit: '<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="12" ry="4" transform="rotate(-35 12 12)"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};

export function nav(variant) {
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="#top" aria-label="juxtacrop home"><img src="./assets/logo.png" width="1518" height="353" alt="juxtacrop"></a><nav aria-label="Main navigation"><a href="#story">The story</a><a href="#approach">Our approach</a><a href="#team">The team</a></nav><div class="header-actions">${variant !== 'classic' ? '<button class="motion-toggle" type="button" aria-pressed="false" aria-label="Pause animation" title="Pause animation">' + icon('pause') + '</button>' : ''}<a class="button small" href="#film">Watch the film ${icon('play')}</a><button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">${icon('menu')}</button></div></header>`;
}

export function evidence() {
  return `<section class="evidence section" id="evidence"><div class="section-top"><div><span class="eyebrow">The science behind the idea</span><h2>Space gives us context.<br>Farmers give it meaning.</h2></div><p>Our proposed approach connects NASA Earth observations with soil information, regional agronomy and knowledge from the person who knows the field.</p></div><div class="source-grid">${sources.map((s, i) => `<article class="source"><span class="source-index">${icon(['weather','orbit','layers','leaf'][i])}<span>${s.agency}</span></span><h3><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a></h3><strong>${s.role}</strong><p>${s.body}</p><small>${s.limit}</small></article>`).join('')}</div><div class="ground-sources"><span class="ground-title">Grounded in local knowledge</span>${supportingSources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer"><strong>${s.name} ↗</strong><span>${s.body}</span><span class="sr-only">Opens in a new tab.</span></a>`).join('')}</div><p class="evidence-note">These are proposed data sources, not live integrations. Scenarios are assumptions to explore; they are not weather forecasts or validated yield predictions.</p></section>`;
}

export function film() {
  return `<section class="film section" id="film"><div class="section-top"><div><span class="eyebrow">See the idea take shape</span><h2>A field. A plan.<br>A different perspective.</h2></div><p>Follow the proposed journey: map a field, plan crops across seasons, explore changing conditions and ask why a comparison changes.</p></div><figure class="film-frame"><video controls playsinline preload="none" poster="${CONFIG.videoPoster}" aria-label="Early juxtacrop interface prototype" aria-describedby="video-note"><source src="${CONFIG.videoSrc}" type="video/mp4"><track kind="captions" src="${CONFIG.videoCaptions}" srclang="en" label="English scene descriptions" default><p>Your browser cannot play this video. <a href="${CONFIG.videoSrc}">Download the prototype film</a>.</p></video><figcaption><span>Interface concept film</span><span>1 min 50 sec <span aria-hidden="true">/</span> English scene captions available</span></figcaption></figure><p class="video-note" id="video-note">${CONFIG.videoNote}</p><p class="video-error" hidden>The video could not be loaded. <a href="${CONFIG.videoSrc}">Open the video file</a> or read the scene descriptions below.</p><details class="transcript"><summary>Read the film’s English scene descriptions ${icon('plus')}</summary><ol><li><time>0:00–0:10</time> Locate the field with coordinates.</li><li><time>0:10–0:43</time> Draw its boundary, then create and name the parcels.</li><li><time>0:43–1:08</time> Assign crops and add local information about irrigation, drainage and soil depth.</li><li><time>1:08–1:20</time> Plan the next season and explore a crop change.</li><li><time>1:20–1:36</time> Apply hypothetical dry and wet conditions and view the illustrative evaluation.</li><li><time>1:36–1:50</time> Read a prepared explanation that connects limited drainage with wetter conditions and identifies missing soil depth.</li></ol></details></section>`;
}

export function ending() {
  return `<section class="closing section"><img class="closing-symbol" src="./assets/symbol.png" width="418" height="353" alt=""><h2>The season is uncertain.<br>Your reasoning shouldn’t be.</h2><p>juxtacrop brings the field, the rotation and the assumptions into one conversation, so farmers can explore their options with a clearer view of what matters.</p><a class="text-link" href="#film">See the concept ${icon('play')}</a></section><section class="team section" id="team"><div class="team-heading"><span class="eyebrow">The people behind juxtacrop</span><h2>Built with curiosity.<br>Rooted in Uruguay.</h2><p>${CONFIG.teamDescription}</p></div><div class="team-list">${CONFIG.team.map((name,i)=>`<article><span class="team-initials" aria-hidden="true">${name.split(' ').map(x=>x[0]).join('')}</span><div><h3>${name}</h3><p>Software developer · UCU student</p></div></article>`).join('')}</div></section><footer class="site-footer"><a class="brand" href="#top" aria-label="Back to top"><img src="./assets/logo.png" width="1518" height="353" alt="juxtacrop"></a><p>A concept for NASA Space Apps 2026.<br>Independent student project. No NASA endorsement.</p><a href="${CONFIG.challengeUrl}" target="_blank" rel="noopener noreferrer">Explore the challenge ↗<span class="sr-only"> (opens in a new tab)</span></a><details class="credits"><summary>Media credits</summary><p>Original atlas texture from Natural Earth land polygons, public domain. Concept field illustrations and 3D landscapes: original, schematic and not measured parcels. Prototype aerial imagery: IDE Uruguay, Mosaico Nacional 2017–2018. Film music: “Dream Culture” by Kevin MacLeod (incompetech.com), <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>, excerpt and mix. Sound effects: Pixabay. Outfit typeface: SIL Open Font License. Three.js: MIT. <a href="./assets/VIDEO-CREDITS.md">Full film credits</a>.</p></details></footer>`;
}

export function comparison() {
  return `<div class="rotation-comparison"><div class="rotation-row"><span class="rotation-label">Usual sequence</span><span class="crop corn">Corn</span><span class="sequence-arrow" aria-hidden="true">→</span><span class="crop bare">Winter fallow</span><span class="sequence-arrow" aria-hidden="true">→</span><span class="crop soy">Soybeans</span></div><div class="rotation-row alternative"><span class="rotation-label">Alternative to explore</span><span class="crop corn">Corn</span><span class="sequence-arrow" aria-hidden="true">→</span><span class="crop rye">Rye cover crop</span><span class="sequence-arrow" aria-hidden="true">→</span><span class="crop soy">Soybeans</span></div></div>`;
}

export function scenarios() {
  return `<div class="scenario-pair"><article><span class="scenario-type dry">Drier conditions</span><h3>What becomes important?</h3><p>Soil moisture, cover crop establishment and termination timing become questions to examine with local guidance.</p></article><article><span class="scenario-type wet">Wetter conditions</span><h3>What changes in the picture?</h3><p>Declared drainage limitations and field access become questions to examine. Missing soil information remains visible.</p></article></div><p class="caption">Illustrative reasoning, not a computed assessment or a recommendation for a particular farm.</p>`;
}

export function initCommon() {
  const menu = document.querySelector('.menu-toggle');
  const filmLink=document.createElement('a');filmLink.className='mobile-film';filmLink.href='#film';filmLink.textContent='Watch the film';document.querySelector('.site-header nav')?.appendChild(filmLink);
  const header = document.querySelector('.site-header');
  const closeMenu = () => { header.classList.remove('menu-open'); menu?.setAttribute('aria-expanded', 'false'); menu?.setAttribute('aria-label', 'Open navigation'); };
  menu?.addEventListener('click', () => { const open = header.classList.toggle('menu-open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  document.querySelectorAll('.site-header nav a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closeMenu();});
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  let paused = reduce.matches;
  const updateMotion = () => {
    document.documentElement.classList.toggle('motion-paused', paused);
    if(toggle) { toggle.setAttribute('aria-pressed', String(paused)); toggle.setAttribute('aria-label', paused ? 'Enable animation' : 'Pause animation'); toggle.title = paused ? 'Enable animation' : 'Pause animation'; toggle.innerHTML = icon(paused ? 'play' : 'pause'); }
    window.dispatchEvent(new CustomEvent('motionchange', { detail: { paused } }));
  };
  toggle?.addEventListener('click',()=>{paused = !paused; updateMotion();});
  reduce.addEventListener('change',e=>{paused=e.matches; updateMotion();});
  updateMotion();
  const video = document.querySelector('video');
  if(video){
    const source=video.querySelector('source');
    if(source.getAttribute('src')!==CONFIG.videoSrc){source.src=CONFIG.videoSrc;video.load();}
    video.poster=CONFIG.videoPoster;
    const track=video.querySelector('track');
    if(track&&track.getAttribute('src')!==CONFIG.videoCaptions)track.src=CONFIG.videoCaptions;
    const note=document.querySelector('#video-note');if(note)note.textContent=CONFIG.videoNote;
    document.querySelectorAll('.video-error a,video p a').forEach(a=>a.href=CONFIG.videoSrc);
  }
  video?.addEventListener('error',()=>{document.querySelector('.video-error').hidden=false;});
  video?.querySelector('source')?.addEventListener('error',()=>{document.querySelector('.video-error').hidden=false;});
  document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>d.querySelector('summary')?.setAttribute('aria-expanded',String(d.open))));
  const indicator=document.querySelector('.reading-progress');
  const updateProgress=()=>{if(indicator) indicator.style.transform=`scaleX(${window.scrollY / Math.max(1,document.documentElement.scrollHeight-innerHeight)})`;};
  addEventListener('scroll',updateProgress,{passive:true});updateProgress();
}
