/* Shared language behavior. Copy kept identical in both repositories. */
(() => {
  'use strict';
  const config = window.SAYITGIL_LOCALES;
  const kind = location.pathname.endsWith('/booking.html') ? 'booking' : config.kind;
  const locales = ['ko','en','ja','zh-hant','zh-hans','fr'];
  const names = {ko:'🇰🇷 한국어',en:'🌐 English',ja:'🇯🇵 日本語','zh-hant':'繁體中文','zh-hans':'简体中文',fr:'🇫🇷 Français'};
  const flagIcons={"ko": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSItNzIgLTQ4IDE0NCA5NiI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTS03Mi00OHY5Nkg3MnYtOTZ6Ii8+PGcgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjQiPjxwYXRoIGQ9Ik0tMzQuOTQ2LTM3LjcyLTQ4LjI2LTE3Ljc1bTQuOTkyIDMuMzI4IDEzLjMxMy0xOS45N200Ljk5MiAzLjMyOS0xMy4zMTIgMTkuOTY5bTYzLjIzNiA0Mi4xNTcgNi4xMDEtOS4xNTJtMS4xMS0xLjY2NCA2LjEwMS05LjE1M200Ljk5MyAzLjMyOC02LjEwMiA5LjE1M20tMS4xMSAxLjY2NC02LjEwMSA5LjE1Mm00Ljk5MiAzLjMyOSA2LjEwMi05LjE1M20xLjExLTEuNjY0IDYuMS05LjE1M00tNDguMjU5IDE3Ljc1bDEzLjMxMyAxOS45N200Ljk5Mi0zLjMyOS02LjEwMi05LjE1Mm0tMS4xMDktMS42NjQtNi4xMDItOS4xNTNtNC45OTMtMy4zMjggMTMuMzEyIDE5Ljk3bTYzLjIzNi00Mi4xNTgtNi4xMDEtOS4xNTNtLTEuMTEtMS42NjQtNi4xMDEtOS4xNTJtNC45OTItMy4zMjggMTMuMzEzIDE5Ljk2OW00Ljk5Mi0zLjMyOC02LjEwMi05LjE1M20tMS4xMS0xLjY2NC02LjEtOS4xNTMiLz48L2c+PHBhdGggZmlsbD0iI2NkMmUzYSIgZD0iTTkuOTg1IDYuNjU2QTE4IDE4IDAgMSAxLTE5Ljk3LTEzLjMxM2EyNCAyNCAwIDEgMSAzOS45MzggMjYuNjI2Ii8+PHBhdGggZmlsbD0iIzAwNDdhMCIgZD0iTTAgMGExMiAxMiAwIDEgMSAxOS45NyAxMy4zMTMgMjQgMjQgMCAxIDEtMzkuOTQtMjYuNjI2QTEyIDEyIDAgMSAwIDAgMCIvPjwvc3ZnPg==", "ja": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MDAiIGhlaWdodD0iNjAwIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDkwMHY2MDBIMHoiLz48Y2lyY2xlIGZpbGw9IiNiYzAwMmQiIGN4PSI0NTAiIGN5PSIzMDAiIHI9IjE4MCIvPjwvc3ZnPg==", "fr": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MDAiIGhlaWdodD0iNjAwIj48cGF0aCBmaWxsPSIjQ0UxMTI2IiBkPSJNMCAwaDkwMHY2MDBIMCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoNjAwdjYwMEgwIi8+PHBhdGggZmlsbD0iIzAwMjY1NCIgZD0iTTAgMGgzMDB2NjAwSDAiLz48L3N2Zz4="};
  const key = 'sayitgil-language';
  const params = new URLSearchParams(location.search);
  function normalize(value) {
    const s = String(value || '').toLowerCase().replaceAll('_','-');
    if (/^zh-(hans|cn|sg)(-|$)/.test(s)) return 'zh-hans';
    if (/^zh($|-)/.test(s)) return 'zh-hant';
    const first = s.split('-')[0];
    return locales.includes(first) ? first : null;
  }
  function stored(){try{return normalize(localStorage.getItem(key))}catch{return null}}
  const explicit = normalize(params.get('lang'));
  const pathLocale = config.kind === 'main' ? locales.find(l=>l!=='ko'&&location.pathname.startsWith('/'+l+'/')) : null;
  const requested = explicit || pathLocale || stored() || (navigator.languages || [navigator.language]).map(normalize).find(Boolean) || 'en';
  // Incomplete catalogs are a release concern, never a customer-facing notice.
  const effective = config.complete.includes(requested) ? requested : 'en';
  const pack = config.messages[effective] || {};
  const t = (text) => typeof pack[text] === 'string' && pack[text].trim() ? pack[text] : text;
  const mainPath = l=>l==='ko'?'/':'/'+l+'/';
  function route(l){
    const u = new URL(location.href);
    if(kind==='main')u.pathname=mainPath(l);
    u.searchParams.set('lang',l);
    return u.pathname+u.search+u.hash;
  }
  if(kind==='main' && location.pathname==='/' && requested!=='ko'){location.replace(route(requested));return;}
  const original = new WeakMap();
  function translate(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(node.parentElement?.closest('script,style,[data-lang="ko"],[lang="ko"]:not(html),.language-nav,textarea,input'))return;
      const old=original.get(node);
      const source=old && node.nodeValue===old.rendered ? old.source : node.nodeValue;
      const trim=source.trim();if(!trim)return;
      const rendered=source.replace(trim,t(trim));
      original.set(node,{source,rendered});
      if(node.nodeValue!==rendered)node.nodeValue=rendered;
    });
    root.querySelectorAll?.('[alt],[title],[placeholder],[aria-label]').forEach(el=>{
      if(el.closest('.language-nav,[data-lang="ko"],[lang="ko"]:not(html)'))return;
      for(const attr of ['alt','title','placeholder','aria-label'])if(el.hasAttribute(attr)){
        const name='data-source-'+attr;
        if(!el.hasAttribute(name))el.setAttribute(name,el.getAttribute(attr));
        const value=t(el.getAttribute(name));if(el.getAttribute(attr)!==value)el.setAttribute(attr,value);
      }
    });
  }
  window.SayitgilLanguage={locale:requested,effective,t,normalize,route,mainPath,translate};
  function boot(){
    document.documentElement.lang=effective;
    document.documentElement.dataset.locale=requested;
    document.title=t(document.title);
    document.querySelectorAll('meta[name=description],meta[property="og:title"],meta[property="og:description"]').forEach(el=>el.content=t(el.content));
    document.querySelectorAll('.language-nav').forEach(nav=>{
      nav.replaceChildren(...locales.map(l=>{
        const a=document.createElement('a');a.href=route(l);a.textContent=names[l];a.lang=l;
        if(flagIcons[l]){a.textContent=names[l].replace(/^\S+\s+/,'');const icon=document.createElement('img');icon.src=flagIcons[l];icon.alt='';icon.className='language-flag';a.prepend(icon);}
        if(l==='en'){a.textContent='English';const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.classList.add('language-globe');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');icon.innerHTML='<g fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/></g>';a.prepend(icon);}
        a.dataset.locale=l;a.setAttribute('aria-label',names[l]);
        if(l===requested)a.setAttribute('aria-current','page');
        a.addEventListener('click',()=>{try{localStorage.setItem(key,l)}catch{}});
        return a;
      }));
    });
    document.querySelectorAll('a[href]').forEach(a=>{
      if(a.closest('.language-nav'))return;
      const u=new URL(a.href,location.href);
      if(u.pathname.endsWith('/booking.html') || u.hostname==='partnership-sayitgil.github.io'&&u.pathname.includes('/yongho-food-guide')){
        u.searchParams.set('lang',requested);a.href=u.href;
      }
      if(config.kind==='food'&&u.hostname==='www.sayitgil.net' && ['/', '/en/'].includes(u.pathname)){
        u.pathname=mainPath(requested);u.searchParams.set('lang',requested);a.href=u.href;
      }
    });
    if(config.kind==='food' || effective!=='ko')translate(document.body);
    if(config.kind==='food' || effective!=='ko'){
      const observer=new MutationObserver(records=>{
        const roots=new Set(records.map(r=>r.target.nodeType===3?r.target.parentElement:r.target));
        roots.forEach(translate);
      });
      observer.observe(document.body,{childList:true,characterData:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
