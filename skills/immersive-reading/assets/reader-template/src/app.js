import { getArticle } from './articles/index.js?v=1';
import { createFrontier } from './frontier.js?v=26';

const articleId = new URLSearchParams(location.search).get('article') || document.documentElement.dataset.article;
const ARTICLE = getArticle(articleId);
const DATA = ARTICLE.chapters;
const FOOT = ARTICLE.footnotes || {};
const BASE_LANG = ARTICLE.defaultLanguage || 'en';
const LANGUAGE_LIST = ARTICLE.languages || [{code: BASE_LANG, shortLabel: 'EN', label: 'English', primary: true}];
const PRIMARY_LANGUAGE = LANGUAGE_LIST.find(l => l.primary) || LANGUAGE_LIST.find(l => l.code === BASE_LANG) || LANGUAGE_LIST[0];
const TRANSLATION_LANGS = LANGUAGE_LIST.filter(l => l.code !== PRIMARY_LANGUAGE.code);
const LANGS = Object.fromEntries(LANGUAGE_LIST.map(l => [l.code, l]));
const WPM=115;
const textOf=(value,lang=BASE_LANG)=>{
  if(value==null)return '';
  if(typeof value==='string')return value;
  return value[lang] || value[BASE_LANG] || value[PRIMARY_LANGUAGE.code] || Object.values(value)[0] || '';
};
const translationEntries=value=>TRANSLATION_LANGS.map(lang=>[lang,textOf(value,lang.code)]).filter(([,text])=>text);
const fnWords=Object.values(FOOT).reduce((s,t)=>s+textOf(t).split(/\s+/).length,0);
const totalWords=DATA.reduce((s,c)=>s+c.words,0)+fnWords;
const $=s=>document.querySelector(s);
const ce=(t,c)=>{const e=document.createElement(t);if(c)e.className=c;return e;};
const mins=w=>Math.max(1,Math.round(w/WPM));
const pad=n=>String(n).padStart(2,'0');
/* Restraint: one cohesive warm-espresso palette (like Oryzo's 2-colour scheme), with only a whisper of warm drift across chapters — not a rainbow. */
function ovPalette(i){const t=DATA.length>1?i/(DATA.length-1):0;const h=Math.round(24+t*14);return{deep:`hsl(${h} 24% 6.5%)`,mid:`hsl(${h} 28% 9.5%)`,glow:`hsla(${h+6} 46% 22% / .82)`,glow2:`hsla(${h-2} 36% 16% / .75)`,tint:`hsl(${h} 14% 92.8%)`};}
const isPro=n=>n===0, MOVES=DATA.length-1;
const chBig=n=>isPro(n)?'·':pad(n);
const chTag=n=>isPro(n)?'Pro':pad(n);
const chKick=n=>isPro(n)?'Prologue · the opening':`Chapter ${pad(n)} · of ${MOVES}`;
const secNo=(n,i)=>isPro(n)?'Opening':`Section ${n}.${i+1}`;
const teaserNo=(n,i)=>isPro(n)?'':`${n}.${i+1}`;
const nowLabel=n=>n<0?'The Beginning':(isPro(n)?'Prologue':`${chTag(n)} · ${textOf(DATA[n].title)}`);
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const fnref=t=>t.replace(/\[(\d+)\]/g,'<sup class="fnref" data-n="$1" tabindex="0" role="button">$1</sup>');
const stripFn=t=>t.replace(/\[(\d+)\]/g,'');
const renderTranslations=value=>translationEntries(value).map(([lang,text])=>`<span class="tr lang-${lang.code}" data-lang="${lang.code}" lang="${lang.code}">${esc(text)}</span>`).join('');
const renderLocalized=value=>esc(textOf(value));
function heroTitleHTML(title){
  const words=title.trim().split(/\s+/);
  const split=Math.max(1,Math.ceil(words.length/2));
  const pre=words.slice(0,split).map((word,i)=>`<span class="title-word title-pre-word title-word-${i}">${esc(word)}</span>`).join(' ');
  const main=words.slice(split).map((word,i)=>`<span class="title-word title-main-word title-word-${i}">${esc(word)}</span>`).join(' ');
  return `<span class="title-line title-pre">${pre}</span> <span class="title-line title-main"><em>${main}</em></span>`;
}
const events={track(){},markSection(){},markChapter(){}};
function applyArticleChrome(){
  document.documentElement.dataset.article=ARTICLE.id;
  document.documentElement.lang=PRIMARY_LANGUAGE.code;
  document.title=`${textOf(ARTICLE.title)} · Immersive Reading`;
  const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=textOf(ARTICLE.description);
  const brand=$('.brand');if(brand)brand.textContent=textOf(ARTICLE.title);
  const door=$('#doorIntro');if(door)door.setAttribute('aria-label',ARTICLE.door?.ariaLabel||'Reading entrance');
  const video=$('#doorIntroVideo');if(video){video.src=ARTICLE.door?.video||video.src;video.poster=ARTICLE.door?.poster||video.poster;}
  const doorLabel=$('.door-intro-label');if(doorLabel)doorLabel.innerHTML=`<div>${esc(ARTICLE.source.label)} <span>${esc(ARTICLE.source.authorLine)}</span></div><div class="door-intro-purpose">${esc(ARTICLE.door?.purpose||'')}</div>`;
  const heroTitle=$('#heroTitle');if(heroTitle)heroTitle.setAttribute('aria-label',textOf(ARTICLE.title));
  const heroAuthor=$('.hero-author');if(heroAuthor)heroAuthor.innerHTML=`<span>By ${esc(ARTICLE.author)}</span><a class="hero-original-link" href="${esc(ARTICLE.source.url)}" target="_blank" rel="noopener" aria-label="${esc(ARTICLE.hero?.originalLinkLabel||'See original')}">See Original <span aria-hidden="true">↗</span></a>`;
  const heroNote=$('.hero-note');if(heroNote)heroNote.textContent=ARTICLE.hero?.note||'';
  const heroPrimary=$('#heroPrimary');if(heroPrimary)heroPrimary.textContent=ARTICLE.hero?.primaryAction||'Start reading';
  const scrollCue=$('.scroll-cue');if(scrollCue)scrollCue.innerHTML=`${esc(ARTICLE.hero?.scrollCue||'Scroll')}<span>↓</span>`;
  const doorCue=$('.door-intro-cue-text');if(doorCue)doorCue.textContent=ARTICLE.door?.cue||'Enter';
  const footerQuote=$('.foot .fq');if(footerQuote){const quote=textOf(ARTICLE.footer?.quote);const emphasis=ARTICLE.footer?.quoteEmphasis||'';footerQuote.innerHTML='“'+esc(emphasis?quote.replace(emphasis,''):quote)+(emphasis?` <b>${esc(emphasis)}</b>`:'')+'”';}
  const credit=$('.foot .credit');if(credit){const srcLabel=ARTICLE.source?.label||'Source material';const srcUrl=ARTICLE.source?.url||'';const srcUrlLabel=ARTICLE.source?.urlLabel||srcUrl||'Original source';const srcLine=srcUrl?`${esc(srcLabel)} — <a href="${esc(srcUrl)}" target="_blank" rel="noopener">${esc(srcUrlLabel)}</a>.`:esc(srcLabel);credit.innerHTML=`${srcLine}<br>${esc(ARTICLE.footer?.credit||'')}`;}
  const sourceLink=$('.util-src');if(sourceLink)sourceLink.href=ARTICLE.source.url;
  const heroOriginal=$('.hero-original-link');if(heroOriginal)heroOriginal.addEventListener('click',()=>events.track('original_link_click',{surface:'hero'}));
  if(sourceLink)sourceLink.addEventListener('click',()=>events.track('original_link_click',{surface:'contents'}));
  const hint=$('.se-hint span');if(hint){const languageNames=TRANSLATION_LANGS.map(l=>l.label).join(', ');hint.textContent=`Searches titles, text, all ${Object.keys(FOOT).length} footnotes${languageNames?` — and ${languageNames} when enabled`:''}.`;}
  renderLanguageMenu();
}
applyArticleChrome();
let AIREMOVED=new Set();
try{JSON.parse(localStorage.getItem('ir_ai_removed')||'[]').forEach(x=>AIREMOVED.add(x));}catch(e){}
function renderPara(raw,quote,aid){
  const i=(quote&&!AIREMOVED.has(aid))?raw.indexOf(quote):-1;
  if(i>=0)return fnref(raw.slice(0,i))+'<mark class="gl" data-ai="'+aid+'">'+fnref(quote)+'</mark>'+fnref(raw.slice(i+quote.length));
  return fnref(raw);
}

let seen=new Set();
try{JSON.parse(localStorage.getItem('ir_seen')||'[]').forEach(x=>seen.add(x));}catch(e){}

/* HERO */
$('#heroTitle').innerHTML=heroTitleHTML(textOf(ARTICLE.title));
const doorIntro=$('#doorIntro'), doorIntroVideo=$('#doorIntroVideo');
const DOOR_VIDEO_END=.76, DOOR_FALLBACK_DURATION=8;
if(doorIntro)document.body.style.setProperty('--frontier-opacity','0');
if(doorIntro)document.body.style.setProperty('--intro-spine','0');
if(doorIntro)document.body.classList.add('door-video-active');
const totMinEl=$('#totMin');if(totMinEl)totMinEl.textContent=mins(totalWords);
const movNEl=$('#movN');if(movNEl)movNEl.textContent=DATA.length-1;
document.body.dataset.paper='porcelain';
function applyTheme(light,options={}){
  document.body.classList.toggle('light',light);
  const btn=$('#themeBtn');if(btn)btn.textContent=light?'☀':'☾';
  try{localStorage.setItem('ir_theme',light?'light':'dark');}catch(e){}
  window.dispatchEvent(new CustomEvent('il-theme',{detail:{light}}));
  if(options.track)events.track('theme_change',{theme:light?'light':'dark'});
}
function toggleTheme(){applyTheme(!document.body.classList.contains('light'),{track:true});}
(function(){let t='light';try{t=localStorage.getItem('ir_theme')||'light';}catch(e){}applyTheme(t==='light');})();
(function typeHero(){
  const el=document.querySelector('.typed-hero');if(!el)return;
  const line=ARTICLE.hero?.typedLine || 'This source has a structure you can learn.';
  let i=0;
  function step(){el.textContent=line.slice(0,i++);if(i<=line.length){const ch=line[i-2]||'';setTimeout(step,/[—.,]/.test(ch)?170:42+Math.random()*34);}}
  setTimeout(step,1450);
})();

/* BUILD CHAPTERS */
const wrap=$('#chapters');
DATA.forEach((c,n)=>{
  const sec=ce('section','chapter');sec.id='ch-'+n;sec.dataset.ch=n;
  const movement=ce('div','movement');movement.id='mv-'+n;movement.dataset.ch=n;
  const lead=c.ideas[0];
  const essenceWords=esc(textOf(c.essence)).split(/\s+/).map(w=>`<span class="w">${w}</span>`).join(' ');
  movement.innerHTML=`<div class="ov-pin">
      <div class="ov-label">${chKick(n)}</div>
      <div class="ov-stage">
        <p class="ov-essence">${essenceWords}</p>
        <h2 class="ov-title">${renderLocalized(c.title)}</h2>
      </div>
      <div class="ov-meta"><span><b>${c.ideas.length}</b> ${c.ideas.length>1?'sections':'section'}</span><span><b>${mins(c.words)}</b> min</span><span>scroll to begin ↓</span></div>
    </div>`;
  sec.appendChild(movement);
  const bw=ce('div','body-wrap read');
  c.ideas.forEach((idea,i)=>{
    const art=ce('article',['sec',n===0&&i===0?'first':''].filter(Boolean).join(' '));art.id=`idea-${n}-${i}`;
    const paras=idea.paragraphs.map((paragraph,pi)=>{
      const base=textOf(paragraph.text);
      return `<p class="pp reveal" data-pid="${n}-${i}-${pi}"><span class="en">${renderPara(base,textOf(idea.quote),`${n}-${i}`)}</span>${renderTranslations(paragraph.text)}</p>`;
    }).join('');
    const notes=(idea.footnotes&&idea.footnotes.length)
      ? `<div class="fn-list reveal"><div class="fn-h">Notes</div>${idea.footnotes.map(f=>`<div class="fn" data-n="${f.n}"><span class="fn-n">${f.n}</span><span class="fn-t"><span class="en">${esc(textOf(f.text))}</span>${renderTranslations(f.text)}</span></div>`).join('')}</div>`
      : '';
    art.innerHTML=`<div class="sec-lead">
        <div class="sec-heading">
          <h3 class="sec-title reveal">${renderLocalized(idea.take)}</h3>
          <span class="sec-no reveal">${secNo(n,i)}</span>
        </div>
        <blockquote class="sec-quote reveal"><span class="qm">“</span>${renderLocalized(idea.quote)}</blockquote>
      </div>
      <div class="sec-prose">${paras}${notes}</div>`;
    art.querySelectorAll('.fnref').forEach(rf=>rf.addEventListener('click',()=>flashNote(art,rf.dataset.n)));
    bw.appendChild(art);
  });
  sec.appendChild(bw);
  wrap.appendChild(sec);
});
document.querySelectorAll('.ov-tz').forEach(b=>b.onclick=()=>{const g=b.dataset.go.split('-');scrollTo(document.getElementById('idea-'+g[0]+'-'+g[1]),-60);});
const leads=[...document.querySelectorAll('.sec-lead')];
const movementEls=[...document.querySelectorAll('.movement')];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
function flashNote(art,n){const fn=art.querySelector('.fn[data-n="'+n+'"]');if(fn){fn.scrollIntoView({block:'center',behavior:'smooth'});fn.classList.add('flash');setTimeout(()=>fn.classList.remove('flash'),1600);}}
function revealArticle(el){if(!el)return;el.querySelectorAll('.sec-lead,.sec-heading,.sec-prose').forEach(x=>x.classList.add('in'));}

/* SPINE */
const spine=$('#spine');
const rail=ce('div','rail');rail.innerHTML='<div class="bg"></div><div class="fill" id="spineFill"></div>';
spine.appendChild(rail);
DATA.forEach((c,n)=>{
  const node=ce('div','node');node.dataset.ch=n;node.style.top=(n/(DATA.length-1)*100)+'%';node.style.setProperty('--d',n);
  node.innerHTML=`<span class="dot"></span><span class="lab"><b>${chTag(n)}</b> ${renderLocalized(c.title)}</span>`;
  node.onclick=()=>scrollToCh(n);
  rail.appendChild(node);
});
let spinePeekTimer=null;
function setSpinePeek(){
  clearTimeout(spinePeekTimer);
  document.body.classList.add('peek-spine');
}
function clearSpinePeekSoon(delay=110){
  clearTimeout(spinePeekTimer);
  spinePeekTimer=setTimeout(()=>document.body.classList.remove('peek-spine'),delay);
}
function inSpineHotZone(e){
  if(e.pointerType==='touch')return false;
  const r=rail.getBoundingClientRect();
  const open=document.body.classList.contains('peek-spine');
  const right=open?Math.min(window.innerWidth*.2,240):86;
  const yPad=open?24:12;
  return e.clientX>=0&&e.clientX<=right&&e.clientY>=r.top-yPad&&e.clientY<=r.bottom+yPad;
}
spine.addEventListener('pointerenter',setSpinePeek);
spine.addEventListener('pointerleave',clearSpinePeekSoon);
window.addEventListener('pointermove',e=>{inSpineHotZone(e)?setSpinePeek():clearSpinePeekSoon();},{passive:true});
window.addEventListener('blur',()=>document.body.classList.remove('peek-spine'));

/* CONTENTS */
const coList=$('#coList');
DATA.forEach((c,n)=>{
  const row=ce('div','co-row');row.dataset.ch=n;
  row.innerHTML=`<div class="co-num">${chTag(n)}</div>
    <div class="co-main"><h4>${renderLocalized(c.title)}</h4><p>${renderLocalized(c.essence)}</p></div>
    <div class="co-meta">${c.ideas.length} sec · ${mins(c.words)} min<span class="co-dot"></span></div>`;
  row.onclick=()=>{toggleContents();setTimeout(()=>scrollToCh(n),120);};
  coList.appendChild(row);
});

/* SMOOTH SCROLL */
let lenis=null;
if(window.Lenis){lenis=new Lenis({lerp:.085,wheelMultiplier:.72,smoothWheel:true});function raf(t){lenis.raf(t);requestAnimationFrame(raf);}requestAnimationFrame(raf);}
function scrollTo(target,offset=0){if(lenis)lenis.scrollTo(target,{offset,duration:1.25});else(typeof target==='number'?window.scrollTo({top:target,behavior:'smooth'}):target.scrollIntoView({behavior:'smooth'}));}
function scrollToCh(n){scrollTo($('#ch-'+n),-4);}
function toTop(){scrollTo(0);}

/* REVEAL */
const typed=new WeakSet();
const OV_WORD_DELAY=118;
function showWords(m){if(m._wdone)return;m._wdone=true;m.querySelectorAll('.ov-essence .w').forEach(w=>w.classList.add('show'));}
function revealOv(m){
  if(typed.has(m))return;typed.add(m);m.classList.add('in');
  const ws=[...m.querySelectorAll('.ov-essence .w')];
  ws.forEach((w,k)=>setTimeout(()=>w.classList.add('show'),240+k*OV_WORD_DELAY));
  setTimeout(()=>{m._wdone=true;},240+ws.length*OV_WORD_DELAY+360);
}
const ovIO=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting)revealOv(e.target);});},{rootMargin:'-22% 0px -22% 0px',threshold:0});
movementEls.forEach(el=>ovIO.observe(el));
const rIO=new IntersectionObserver((es)=>{es.forEach(e=>e.target.classList.toggle('in',e.isIntersecting));},{rootMargin:'0px 0px -24% 0px',threshold:.1});
document.querySelectorAll('.read .reveal').forEach(el=>rIO.observe(el));
const secIO=new IntersectionObserver((entries)=>{entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const parts=(entry.target.id||'').replace('idea-','').split('-').map(Number);
  if(parts.length===2)events.markSection(parts[0],parts[1],{section_label:secNo(parts[0],parts[1])});
});},{rootMargin:'-22% 0px -42% 0px',threshold:.2});
document.querySelectorAll('.sec').forEach(el=>secIO.observe(el));

/* PROGRESS + ACTIVE */
const overtures=[...document.querySelectorAll('.chapter')];
let curCh=-1;
function markSeen(n){
  if(n>=0){
    events.markChapter(n,{chapter_number:n+1,title:textOf(DATA[n].title)});
    if(!seen.has(n)){seen.add(n);localStorage.setItem('ir_seen',JSON.stringify([...seen]));paintSeen();}
  }
}
function paintSeen(){document.querySelectorAll('.spine .node').forEach(nd=>nd.classList.toggle('seen',seen.has(+nd.dataset.ch)));document.querySelectorAll('.co-row').forEach(r=>r.classList.toggle('seen',seen.has(+r.dataset.ch)));}
function onScroll(){
  const st=window.scrollY||document.documentElement.scrollTop;
  const h=document.documentElement.scrollHeight-window.innerHeight;const p=h>0?st/h:0;
  $('#tprog').style.width=(p*100)+'%';$('#spineFill').style.height=(p*100)+'%';
  const vh=window.innerHeight;
  if(doorIntro){
    const r=doorIntro.getBoundingClientRect();
    const span=Math.max(1,doorIntro.offsetHeight-vh);
    const q=clamp(-r.top/span,0,1);
    const scrub=clamp(q/DOOR_VIDEO_END,0,1);
    if(doorIntroVideo){
      const d=Number.isFinite(doorIntroVideo.duration)&&doorIntroVideo.duration>0?doorIntroVideo.duration:DOOR_FALLBACK_DURATION;
      const target=Math.min(d-.04,scrub*d);
      try{if(Math.abs(doorIntroVideo.currentTime-target)>.04)doorIntroVideo.currentTime=target;}catch(e){}
    }
    const videoFade=clamp((q-.56)/.22,0,1);
    const washIn=clamp((q-.58)/.18,0,1);
    const sphere=clamp((q-.54)/.16,0,1);
    const wash=washIn*(1-sphere);
    const title=clamp((q-.60)/.15,0,1);
    const details=clamp((q-.70)/.13,0,1);
    doorIntro.style.setProperty('--door-video-opacity',(1-videoFade).toFixed(3));
    doorIntro.style.setProperty('--door-media',(1-videoFade).toFixed(3));
    doorIntro.style.setProperty('--door-wash',wash.toFixed(3));
    doorIntro.style.setProperty('--door-label',clamp(1-q*1.6,0,1).toFixed(3));
    doorIntro.style.setProperty('--door-cue',clamp(1-q*2.2,0,1).toFixed(3));
    doorIntro.style.setProperty('--door-hero',title.toFixed(3));
    doorIntro.style.setProperty('--door-details',details.toFixed(3));
    doorIntro.style.setProperty('--door-hero-scale',(1.16-title*.16).toFixed(3));
    doorIntro.style.setProperty('--door-hero-y',(24*(1-title)).toFixed(1)+'px');
    doorIntro.style.setProperty('--door-details-y',(12*(1-details)).toFixed(1)+'px');
    document.body.style.setProperty('--frontier-opacity',sphere.toFixed(3));
    const spine=clamp((q-.82)/.12,0,1);
    document.body.style.setProperty('--intro-spine',spine.toFixed(3));
    document.body.classList.toggle('door-video-active',spine<.98);
  }
  // Cinematic chapter timeline: the sticky pin stays fixed; scroll only scrubs --cmp/--ex/--em.
  for(const m of movementEls){
    const tr=m.getBoundingClientRect();
    const span=Math.max(1,tr.height-vh);
    const q=span>0?clamp(-tr.top/span,0,1):0;
    const cmp=clamp((q-0.12)/0.38,0,1), ttl=clamp((q-0.50)/0.18,0,1), ex=clamp((q-0.82)/0.14,0,1), em=clamp((q-0.91)/0.09,0,1), meta=cmp*.8*clamp((0.78-q)/0.14,0,1);
    m.style.setProperty('--cmp',cmp.toFixed(3));m.style.setProperty('--ttl',ttl.toFixed(3));m.style.setProperty('--ex',ex.toFixed(3));m.style.setProperty('--em',em.toFixed(3));m.style.setProperty('--meta',meta.toFixed(3));
    if(typed.has(m)&&!m._wdone&&ttl>0.05)showWords(m);
  }
  // Non-pinned section leads keep a quieter scroll reveal.
  for(const Ld of leads){const r=Ld.getBoundingClientRect();if(r.bottom<-50||r.top>vh+80)continue;
    if(Ld.closest('.pin-first'))continue;
    const c=r.top+r.height/2;const p=clamp((vh*0.5-c)/(vh*0.5),0,1);const e=clamp((r.top-vh*0.18)/(vh*0.62),0,1);
    Ld.style.setProperty('--p',p.toFixed(3));Ld.style.setProperty('--e',e.toFixed(3));}
  let cur=-1;for(let i=0;i<overtures.length;i++){if(overtures[i].getBoundingClientRect().top<=vh*0.4)cur=i;}
  if(cur!==curCh){curCh=cur;document.querySelectorAll('.spine .node').forEach(nd=>nd.classList.toggle('active',+nd.dataset.ch===cur));
    $('#now').textContent=nowLabel(cur);if(cur>=0){markSeen(cur);localStorage.setItem('ir_pos',cur);}}
}
if(lenis)lenis.on('scroll',onScroll);
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);requestAnimationFrame(onScroll);
if(doorIntroVideo)doorIntroVideo.addEventListener('loadedmetadata',onScroll);

/* LANGUAGE */
let langMenuOpen=false;
let searchReady=false;
function toggleLangMenu(e){e&&e.stopPropagation();langMenuOpen=!langMenuOpen;$('#langMenu').classList.toggle('on',langMenuOpen);}
function renderLanguageMenu(){
  const menu=$('#langMenu');if(!menu)return;
  menu.innerHTML='<div class="lm-h">Reading language</div>'+LANGUAGE_LIST.map(lang=>`<button class="lm" data-lang="${esc(lang.code)}" type="button"><b>${esc(lang.menuTitle||lang.label)}</b><span>${esc(lang.menuDescription||lang.label)}</span></button>`).join('');
  menu.querySelectorAll('.lm').forEach(btn=>btn.addEventListener('click',()=>setLang(btn.dataset.lang,{track:true})));
}
function setLang(l,options={}){
  if(l==='off')l=PRIMARY_LANGUAGE.code;
  const cfg=LANGS[l]||PRIMARY_LANGUAGE;
  l=cfg.code;
  LANGUAGE_LIST.forEach(lang=>document.body.classList.toggle(`lang-${lang.code}`,lang.code===l));
  document.body.dataset.readingLang=l;
  document.querySelectorAll('.tr').forEach(el=>el.classList.toggle('on',el.dataset.lang===l));
  document.querySelectorAll('#langMenu .lm').forEach(b=>b.classList.toggle('on',b.dataset.lang===l));
  $('#langLab').textContent=cfg.shortLabel||cfg.code.toUpperCase();
  localStorage.setItem('ir_lang',l);langMenuOpen=false;$('#langMenu').classList.remove('on');
  if(searchReady)runSearch();
  if(options.track)events.track('language_change',{lang:l});
}
document.addEventListener('click',e=>{if(langMenuOpen&&!e.target.closest('#langMenu')&&!e.target.closest('.lang-btn'))toggleLangMenu();});
(function(){let l=PRIMARY_LANGUAGE.code;try{l=localStorage.getItem('ir_lang')||PRIMARY_LANGUAGE.code;}catch(e){}setLang(l);})();

/* SKIM */
function toggleSkim(){const on=document.body.classList.toggle('skim');const b=$('#skimBtn');if(b)b.textContent=on?'Full reading view':'Skim view';}

/* OVERLAYS */
function toggleContents(){const c=$('#contents');const open=c.classList.toggle('on');document.body.classList.toggle('lock',open);if(open)events.track('contents_open');if(lenis){open?lenis.stop():lenis.start();}}

/* MOBILE NOTICE */
function closeMobileNotice(){
  const m=$('#mobileNotice');if(!m)return;
  m.classList.remove('on');
  document.body.classList.remove('mobile-notice-open');
  try{localStorage.setItem('ir_mobile_notice_v1','1');}catch(e){}
  events.track('mobile_notice_continue');
  if(lenis&&!document.querySelector('.ov-screen.on'))lenis.start();
}
(function initMobileNotice(){
  const m=$('#mobileNotice'), btn=$('#mobileNoticeClose');if(!m||!btn)return;
  let seenNotice=false;try{seenNotice=localStorage.getItem('ir_mobile_notice_v1')==='1';}catch(e){}
  const narrow=window.matchMedia('(max-width: 760px)').matches;
  const compactTouch=window.matchMedia('(pointer: coarse) and (max-width: 920px)').matches;
  if((narrow||compactTouch)&&!seenNotice){
    setTimeout(()=>{
      if(document.querySelector('.ov-screen.on'))return;
      m.classList.add('on');
      document.body.classList.add('mobile-notice-open');
      events.track('mobile_notice_seen',{viewport:'mobile'},{oncePerVisitor:true,onceKey:'v1'});
      if(lenis)lenis.stop();
      btn.focus({preventScroll:true});
    },900);
  }
  btn.addEventListener('click',closeMobileNotice);
  m.addEventListener('click',e=>{if(e.target===m)closeMobileNotice();});
})();

/* JUMP + SEARCH */
function jumpTo(rec){const el=rec.jump==='ch'?$('#ch-'+rec.ci):document.getElementById('idea-'+rec.ci+'-'+rec.ii);if(!el)return;revealArticle(el);const dest=rec.jump==='note'||rec.jump==='idea'?(el.querySelector('.sec-prose')||el):el;setTimeout(()=>{scrollTo(dest,-70);if(rec.jump==='note'&&rec.fn)setTimeout(()=>flashNote(el,rec.fn),520);},60);}
const INDEX=[];
DATA.forEach((c,ci)=>{
  INDEX.push({ci,ii:0,type:'Essence',text:textOf(c.essence),jump:'ch'});
  c.ideas.forEach((idea,ii)=>{
    INDEX.push({ci,ii,type:'Title',text:textOf(idea.take),jump:'idea'});
    idea.paragraphs.forEach(p=>{
      INDEX.push({ci,ii,type:'Passage',text:stripFn(textOf(p.text)),jump:'idea'});
      translationEntries(p.text).forEach(([lang,text])=>INDEX.push({ci,ii,type:lang.label,text,jump:'idea',translation:lang.code}));
    });
    (idea.footnotes||[]).forEach(f=>{
      INDEX.push({ci,ii,type:'Note '+f.n,text:textOf(f.text),jump:'note',fn:f.n});
      translationEntries(f.text).forEach(([lang,text])=>INDEX.push({ci,ii,type:`${lang.label} note ${f.n}`,text,jump:'note',fn:f.n,translation:lang.code}));
    });
  });
});
searchReady=true;
function snippet(text,q){const i=text.toLowerCase().indexOf(q);const a=Math.max(0,i-58),b=Math.min(text.length,i+q.length+90);let s=(a>0?'… ':'')+text.slice(a,b)+(b<text.length?' …':'');s=esc(s);const re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');return s.replace(re,'<mark>$1</mark>');}
let seHits=[];
function runSearch(){
  const q=$('#seInput').value.trim().toLowerCase();const box=$('#seResults');
  if(q.length<2){box.innerHTML='<div class="se-empty">Type at least two characters…</div>';seHits=[];return;}
  seHits=INDEX.filter(r=>r.text.toLowerCase().includes(q));
  const order={'Title':0,'Essence':1,'Passage':2};
  seHits.sort((a,b)=>(order[a.type]??4)-(order[b.type]??4));
  const shown=seHits.slice(0,40);
  if(!shown.length){box.innerHTML='<div class="se-empty">No matches for “'+esc(q)+'”.</div>';return;}
  box.innerHTML=shown.map((r,k)=>`<button class="se-res" data-k="${k}"><div class="se-where">${pad(r.ci+1)} · ${renderLocalized(DATA[r.ci].title)} <span class="tag">${esc(r.type)}</span></div><div class="se-snip${r.translation?' translation lang-'+r.translation:''}">${snippet(r.text,q)}</div></button>`).join('')
    +(seHits.length>40?`<div class="se-empty" style="padding:24px 0;font-size:14px">+ ${seHits.length-40} more — refine your search</div>`:'');
  box.querySelectorAll('.se-res').forEach(el=>el.onclick=()=>{const r=shown[+el.dataset.k];events.track('search_result_jump',{query_length:q.length,result_count:seHits.length,result_type:r.type});toggleSearch();setTimeout(()=>jumpTo(r),130);});
}
function toggleSearch(){const s=$('#search');const open=s.classList.toggle('on');document.body.classList.toggle('lock',open);if(open)events.track('search_open');if(lenis){open?lenis.stop():lenis.start();}if(open){setTimeout(()=>$('#seInput').focus(),60);runSearch();}}
$('#seInput').addEventListener('input',runSearch);

/* RESUME */
let pos=null;try{pos=localStorage.getItem('ir_pos');}catch(e){}
const resumeIndex=pos!==null?+pos:NaN;
const canResume=Number.isFinite(resumeIndex)&&resumeIndex>0&&resumeIndex<DATA.length;
function resume(){if(canResume)scrollToCh(resumeIndex);}
const heroPrimary=$('#heroPrimary');
if(heroPrimary){
  if(canResume){heroPrimary.textContent=`Resume · ${textOf(DATA[resumeIndex].title)}`;heroPrimary.onclick=()=>{events.track('resume_reading',{chapter:resumeIndex,title:textOf(DATA[resumeIndex].title)});resume();};}
  else{heroPrimary.textContent='Start reading';heroPrimary.onclick=()=>{events.track('start_reading',{target_chapter:0});scrollToCh(0);};}
}

paintSeen();

/* ============ HIGHLIGHTS ============ */
function toggleHighlights(){}
(function(){
  const supportsHL = ('highlights' in CSS) && typeof Highlight==='function';
  let USER=[]; try{USER=JSON.parse(localStorage.getItem('ir_user_hl')||'[]');}catch(e){}
  let NOTES=[]; try{NOTES=JSON.parse(localStorage.getItem('ir_notes')||'[]');}catch(e){}
  let uid=USER.reduce((m,h)=>Math.max(m,h.id||0),0);
  let nid=NOTES.reduce((m,n)=>Math.max(m,n.id||0),0);
  const saveUser=()=>localStorage.setItem('ir_user_hl',JSON.stringify(USER));
  const saveNotes=()=>localStorage.setItem('ir_notes',JSON.stringify(NOTES));
  const saveRemoved=()=>localStorage.setItem('ir_ai_removed',JSON.stringify([...AIREMOVED]));

  /* --- character-offset helpers within a .en root --- */
  function textNodes(root){const out=[];const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())out.push(n);return out;}
  function offsetOf(root,node,off){const r=document.createRange();r.selectNodeContents(root);try{r.setEnd(node,off);}catch(e){return 0;}return r.toString().length;}
  function rangeFromOffsets(root,start,end){
    const r=document.createRange();const nodes=textNodes(root);let acc=0,started=false;
    for(const t of nodes){const len=t.nodeValue.length;
      if(!started&&start<=acc+len){r.setStart(t,Math.max(0,start-acc));started=true;}
      if(end<=acc+len){r.setEnd(t,Math.max(0,end-acc));return r;}
      acc+=len;}
    if(!started)r.setStart(root,0);
    const last=nodes[nodes.length-1];if(last)r.setEnd(last,last.nodeValue.length);
    return r;
  }
  function enByPid(pid){const p=document.querySelector('.pp[data-pid="'+pid+'"]');return p?p.querySelector('.en'):null;}
  function closestEn(node){const el=node&&(node.nodeType===1?node:node.parentElement);return el?el.closest('.en'):null;}

  /* --- paint user highlights via CSS Custom Highlight API --- */
  const hl=supportsHL?new Highlight():null;
  function paint(){if(!hl)return;hl.clear();for(const h of USER){const en=enByPid(h.pid);if(!en)continue;try{hl.add(rangeFromOffsets(en,h.start,h.end));}catch(e){}}CSS.highlights.set('il-user',hl);}

  /* --- floating action bar on text selection --- */
  const fab=ce('div','hl-fab');
  fab.innerHTML='<button type="button" class="fab-hl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 4.5l3 3L8 19l-4 1 1-4 11.5-11.5z"/><path d="M14.5 6.5l3 3"/></svg>Highlight</button>'
    +'<button type="button" class="fab-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16M4 10h16M4 15h9"/><path d="M14 19l2-2 3 3-2 2h-3z"/></svg>Note</button>';
  document.body.appendChild(fab);
  let pending=null;
  const hideFab=()=>{fab.classList.remove('on');pending=null;};
  function onSelect(){
    if($('#highlights').classList.contains('on')){hideFab();return;}
    const sel=window.getSelection();
    if(!sel||sel.isCollapsed||!sel.rangeCount){hideFab();return;}
    const range=sel.getRangeAt(0);
    const en=closestEn(range.startContainer), enEnd=closestEn(range.endContainer);
    if(!en||en!==enEnd){hideFab();return;}
    const start=offsetOf(en,range.startContainer,range.startOffset);
    const end=offsetOf(en,range.endContainer,range.endOffset);
    if(end-start<2){hideFab();return;}
    pending={pid:en.closest('.pp').dataset.pid,start,end,text:sel.toString()};
    const rc=range.getBoundingClientRect();
    let top=rc.top-46;if(top<60)top=rc.bottom+12;
    fab.style.left=clamp(rc.left+rc.width/2,64,innerWidth-64)+'px';
    fab.style.top=top+'px';
    fab.classList.add('on');
  }
  document.addEventListener('mouseup',()=>setTimeout(onSelect,10));
  document.addEventListener('selectionchange',()=>{const s=window.getSelection();if(!s||s.isCollapsed)hideFab();});
  document.addEventListener('mousedown',e=>{if(!e.target.closest('.hl-fab'))hideFab();if(!e.target.closest('.remove-pop'))hideRemove();
    if(editingNote!=null&&wideEnough()&&!e.target.closest('.note-card')&&!e.target.closest('.hl-fab'))commitOpenEditor();});
  window.addEventListener('scroll',hideFab,{passive:true});
  if(lenis)lenis.on('scroll',hideFab);
  fab.querySelector('.fab-hl').addEventListener('click',()=>{if(!pending)return;events.track('highlight_created',{pid:pending.pid,length:pending.end-pending.start});USER.push({...pending,id:++uid});saveUser();paint();window.getSelection().removeAllRanges();hideFab();buildPanel();});
  fab.querySelector('.fab-note').addEventListener('click',()=>{if(!pending)return;const sel={...pending};events.track('note_created',{pid:sel.pid,length:sel.end-sel.start});window.getSelection().removeAllRanges();hideFab();addNote(sel);});

  /* --- collect active highlights in reading order --- */
  function gather(){
    const ai=[];
    DATA.forEach((c,ci)=>c.ideas.forEach((idea,ii)=>{const id=ci+'-'+ii;if(textOf(idea.quote)&&!AIREMOVED.has(id))ai.push({id,ci,ii,text:textOf(idea.quote)});}));
    return {ai,user:USER,notes:NOTES};
  }

  /* --- panel --- */
  const panel=$('#highlights'), body=$('#hlBody');
  const esc2=s=>esc(s);
  function item(kind,id,text,loc){return `<div class="hl-item ${kind}" data-kind="${kind}" data-id="${id}">`
    +`<button class="hl-jump" type="button"><span class="hl-txt">${esc2(text)}</span><span class="hl-loc">${esc2(loc)}</span></button>`
    +`<button class="hl-del" type="button" title="Remove highlight">&#10005;</button></div>`;}
  function locOfUser(u){const a=u.pid.split('-');return secNo(+a[0],+a[1]);}
  function noteItemHTML(n){
    const a=n.pid.split('-'), loc=secNo(+a[0],+a[1]);
    const src=esc2((n.text||'').slice(0,46))+((n.text||'').length>46?'…':'');
    return `<div class="hl-item note" data-kind="note" data-id="${n.id}">`
      +`<button class="hl-jump" type="button"><span class="hl-txt">${n.note?esc2(n.note):'<span class=\'note-ph\'>Empty note</span>'}</span><span class="hl-loc">“${src}” · ${loc}</span></button>`
      +`<button class="hl-del" type="button" title="Delete note">&#10005;</button></div>`;
  }
  let panelTab='all';
  function buildPanel(){
    const {ai,user,notes}=gather();
    const aiHtml=ai.length?ai.map(a=>item('ai',a.id,a.text,secNo(a.ci,a.ii))).join('')
      :'<div class="hl-empty">No AI picks left — you’ve removed them all.</div>';
    const userHtml=user.length?user.map(u=>item('user',u.id,u.text,locOfUser(u))).join('')
      :'<div class="hl-empty">Nothing yet. Select any passage and choose “Highlight”.</div>';
    const notesHtml=notes.length?notes.map(noteItemHTML).join('')
      :'<div class="hl-empty">No notes yet. Select text and choose “Note”.</div>';
    const counts={all:ai.length+user.length+notes.length,author:ai.length,mine:user.length,notes:notes.length};
    const TABS=[['all','All','All'],['author','AI picks','AI'],['mine','My highlights','Highlights'],['notes','My notes','Notes']];
    const tabsHtml='<div class="hl-tabs">'+TABS.map(t=>`<button class="hl-tab${panelTab===t[0]?' on':''}" type="button" data-tab="${t[0]}"><span class="t-full">${t[1]}</span><span class="t-min">${t[2]}</span><span class="tab-n">${counts[t[0]]}</span></button>`).join('')+'</div>';
    const all=panelTab==='all';
    const groups=[];
    if(all||panelTab==='author')groups.push(`<div class="hl-group">${all?'<div class="hl-gh">AI picks <span>· key lines from the essay</span></div>':''}${aiHtml}</div>`);
    if(all||panelTab==='mine')groups.push(`<div class="hl-group">${all?'<div class="hl-gh">My highlights</div>':''}${userHtml}</div>`);
    if(all||panelTab==='notes')groups.push(`<div class="hl-group">${all?'<div class="hl-gh">My notes</div>':''}${notesHtml}</div>`);
    body.innerHTML=tabsHtml
      +`<div class="hl-top"><span class="hl-count">Click a line to jump · ✕ to remove</span><button class="hl-copy" type="button" id="hlCopy">Copy all</button></div>`
      +groups.join('');
    $('#hlCopy').onclick=doCopy;
    body.querySelectorAll('.hl-tab').forEach(t=>t.onclick=()=>{panelTab=t.dataset.tab;buildPanel();});
    body.querySelectorAll('.hl-item').forEach(el=>{
      const k=el.dataset.kind, id=el.dataset.id;
      el.querySelector('.hl-jump').onclick=()=>{if(k==='note'){toggleHighlights();setTimeout(()=>openNote(+id),150);}else jumpToHL(k,id);};
      el.querySelector('.hl-del').onclick=ev=>{ev.stopPropagation();if(k==='note')deleteNote(+id);else delHL(k,id);};
    });
  }
  function doCopy(){
    const {ai,user,notes}=gather();
    const text=[...ai.map(a=>a.text),...user.map(u=>u.text),...notes.map(n=>n.text+(n.note?'\n— '+n.note:''))].join('\n\n');
    const done=()=>{const b=$('#hlCopy');if(b){b.textContent='Copied ✓';setTimeout(()=>b.textContent='Copy all',1400);}};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(done);
    else{const ta=ce('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(ta);done();}
  }
  function unwrap(m){const p=m.parentNode;if(!p)return;while(m.firstChild)p.insertBefore(m.firstChild,m);p.removeChild(m);if(p.normalize)p.normalize();}
  function delHL(kind,id){
    events.track('highlight_removed',{kind});
    if(kind==='ai'){AIREMOVED.add(id);saveRemoved();const m=document.querySelector('mark.gl[data-ai="'+id+'"]');if(m)unwrap(m);paint();}
    else{USER=USER.filter(h=>String(h.id)!==String(id));saveUser();paint();}
    buildPanel();
  }
  function jumpToHL(kind,id){
    toggleHighlights();
    setTimeout(()=>{
      if(kind==='ai'){const a=id.split('-');const el=document.getElementById('idea-'+a[0]+'-'+a[1]);
        if(el){revealArticle(el);scrollTo(el.querySelector('.sec-prose')||el,-72);}}
      else{const u=USER.find(h=>String(h.id)===String(id));if(u){const p=document.querySelector('.pp[data-pid="'+u.pid+'"]');
        if(p){revealArticle(p.closest('.sec'));scrollTo(p,-130);}}}
    },150);
  }
  toggleHighlights=function(){const open=panel.classList.toggle('on');document.body.classList.toggle('lock',open);if(open)events.track('highlights_open');if(lenis){open?lenis.stop():lenis.start();}if(open){hideFab();hideRemove();buildPanel();}};

  /* --- click a highlighted sentence to remove it inline --- */
  const pop=ce('button','remove-pop');pop.type='button';pop.innerHTML='Remove &#10005;';document.body.appendChild(pop);
  let popAction=null;
  const hideRemove=()=>{pop.classList.remove('on');popAction=null;};
  function showRemove(x,y,fn){popAction=fn;let top=y-46;if(top<60)top=y+18;pop.style.left=clamp(x,64,innerWidth-64)+'px';pop.style.top=top+'px';pop.classList.add('on');}
  pop.addEventListener('click',e=>{e.stopPropagation();const fn=popAction;hideRemove();if(fn)fn();});
  function caretOffset(root,x,y){
    let r=null;
    if(document.caretRangeFromPoint)r=document.caretRangeFromPoint(x,y);
    else if(document.caretPositionFromPoint){const c=document.caretPositionFromPoint(x,y);if(c){r=document.createRange();r.setStart(c.offsetNode,c.offset);}}
    return r?offsetOf(root,r.startContainer,r.startOffset):-1;
  }
  document.addEventListener('click',e=>{
    if($('#highlights').classList.contains('on'))return;
    if(e.target.closest('.remove-pop')||e.target.closest('.hl-fab')||e.target.closest('.note-card')||e.target.closest('.note-scrim'))return;
    if(e.target.closest('.fnref'))return;                       // let footnote clicks win
    const sel=window.getSelection();if(sel&&!sel.isCollapsed)return;   // mid text-selection
    const m=e.target.closest&&e.target.closest('mark.gl[data-ai]');
    if(m){showRemove(e.clientX,e.clientY,()=>delHL('ai',m.dataset.ai));return;}
    const en=closestEn(e.target);
    if(en){const p2=en.closest('.pp');const pid=p2&&p2.dataset.pid;const off=caretOffset(en,e.clientX,e.clientY);
      const hn=off>=0&&NOTES.find(h=>String(h.pid)===pid&&off>=h.start&&off<h.end);
      if(hn){openNote(hn.id);return;}
      const hit=off>=0&&USER.find(h=>String(h.pid)===pid&&off>=h.start&&off<h.end);
      if(hit){showRemove(e.clientX,e.clientY,()=>delHL('user',hit.id));return;}}
    hideRemove();
  });
  window.addEventListener('scroll',hideRemove,{passive:true});
  if(lenis)lenis.on('scroll',hideRemove);

  /* ============ MARGIN NOTES (Google-Docs-style comments) ============ */
  const noteHL=supportsHL?new Highlight():null;
  function paintNotes(){if(!noteHL)return;noteHL.clear();for(const n of NOTES){const en=enByPid(n.pid);if(!en)continue;try{noteHL.add(rangeFromOffsets(en,n.start,n.end));}catch(e){}}CSS.highlights.set('il-note',noteHL);}
  const rail=ce('div','note-rail');document.body.appendChild(rail);
  const scrim=ce('div','note-scrim');document.body.appendChild(scrim);
  let editingNote=null;
  scrim.addEventListener('click',commitOpenEditor);
  function railW(){return Math.min(252,(innerWidth-720)/2-44);}
  const wideEnough=()=>railW()>=150;
  function docTop(el){let y=0;while(el){y+=el.offsetTop;el=el.offsetParent;}return y;}
  function anchorY(n){const en=enByPid(n.pid);if(!en)return null;const pp=en.closest('.pp');if(!pp)return null;
    try{const rc=rangeFromOffsets(en,n.start,n.end).getBoundingClientRect();const pr=pp.getBoundingClientRect();return docTop(pp)+(rc.top-pr.top);}catch(e){return docTop(pp);}}
  function srcLine(n){return '“'+esc2((n.text||'').slice(0,60))+((n.text||'').length>60?'…':'')+'”';}
  function editorHTML(n){return '<div class="note-src">'+srcLine(n)+'</div><textarea class="note-ed" placeholder="Write your thought…">'+esc2(n.note||'')+'</textarea>'
    +'<div class="note-row"><button type="button" class="note-del">Delete</button><button type="button" class="note-save">Save</button></div>';}
  function viewHTML(n){return '<div class="note-src">'+srcLine(n)+'</div><div class="note-body">'+(n.note?esc2(n.note):'<span class="note-ph">Empty note</span>')+'</div>';}
  function wireCard(card,n){
    if(card.classList.contains('editing')){
      const ta=card.querySelector('.note-ed');
      const grow=()=>{ta.style.height='auto';ta.style.height=ta.scrollHeight+'px';if(!card.classList.contains('center'))layoutOnly();};
      requestAnimationFrame(()=>{grow();ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);});
      ta.addEventListener('input',grow);
      card.querySelector('.note-save').onclick=()=>saveNote(n.id,ta.value);
      card.querySelector('.note-del').onclick=()=>deleteNote(n.id);
    } else card.onclick=()=>{editingNote=n.id;renderNotes();};
  }
  function renderNotes(){
    rail.innerHTML='';
    const wide=wideEnough(), center=editingNote!=null&&!wide;
    scrim.classList.toggle('on',center);
    if(!wide){
      rail.style.display='none';
      if(center){const n=NOTES.find(x=>x.id===editingNote);
        if(n){rail.style.display='';const card=ce('div','note-card editing center');card.dataset.id=n.id;card.innerHTML=editorHTML(n);rail.appendChild(card);wireCard(card,n);}else editingNote=null;}
      return;
    }
    rail.style.display='';
    const w=railW(), left=(innerWidth+720)/2+24;
    for(const n of NOTES){const y=anchorY(n);if(y==null)continue;
      const editing=editingNote===n.id;
      const card=ce('div','note-card'+(editing?' editing':''));card.dataset.id=n.id;card.dataset.y=y;
      card.style.width=w+'px';card.style.left=left+'px';card.innerHTML=editing?editorHTML(n):viewHTML(n);
      rail.appendChild(card);wireCard(card,n);}
    layoutOnly();
  }
  function layoutOnly(){
    const cards=[...rail.querySelectorAll('.note-card')].filter(c=>!c.classList.contains('center'));
    cards.sort((a,b)=>(+a.dataset.y)-(+b.dataset.y));
    let prev=-1e9;
    for(const c of cards){const top=Math.max(+c.dataset.y,prev+12);c.style.top=top+'px';prev=top+c.offsetHeight;}
  }
  function addNote(sel){const n={id:++nid,pid:sel.pid,start:sel.start,end:sel.end,text:sel.text,note:''};NOTES.push(n);saveNotes();paintNotes();editingNote=n.id;renderNotes();}
  function saveNote(id,val){const n=NOTES.find(x=>x.id===id);if(!n)return;val=(val||'').trim();if(!val){deleteNote(id);return;}events.track('note_saved',{note_length:val.length});n.note=val;saveNotes();editingNote=null;renderNotes();buildPanel();}
  function deleteNote(id){events.track('note_deleted');NOTES=NOTES.filter(x=>x.id!==id);saveNotes();if(editingNote===id)editingNote=null;paintNotes();renderNotes();buildPanel();}
  function commitOpenEditor(){if(editingNote==null)return;const ta=rail.querySelector('.note-card.editing .note-ed');if(ta)saveNote(editingNote,ta.value);else{editingNote=null;renderNotes();}}
  function openNote(id){editingNote=id;const n=NOTES.find(x=>x.id===id);renderNotes();
    if(n){const p=document.querySelector('.pp[data-pid="'+n.pid+'"]');if(p){revealArticle(p.closest('.sec'));scrollTo(p,-130);}}}
  window.addEventListener('resize',renderNotes);

  paint();paintNotes();renderNotes();
  setTimeout(renderNotes,500);setTimeout(renderNotes,1600);
})();

Object.assign(window,{
  toTop,
  toggleTheme,
  toggleLangMenu,
  setLang,
  toggleSearch,
  toggleHighlights,
  toggleContents
});

createFrontier();
