(()=>{
  const root=document.documentElement, menu=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav-links');
  const form=document.querySelector('#inquiry-form'), status=document.querySelector('#form-status');
  const texts={ko:{required:'필수 항목입니다.',email:'올바른 이메일 주소를 입력해 주세요.',pax:'인원은 1명 이상으로 입력해 주세요.',draft:'이메일 작성창을 열었습니다. 메일 앱에서 보내기를 완료해 주세요.',fallback:'메일 앱이 열리지 않으면 입력 내용 복사하기를 이용해 partnership@sayitgil.net으로 보내실 수 있습니다.',copy:'입력 내용 복사하기',copied:'입력 내용을 복사했습니다.'},en:{required:'This field is required.',email:'Enter a valid email address.',pax:'Enter at least one guest.',draft:'Your email draft is ready. Send it in your email app to deliver your inquiry.',fallback:'If your email app does not open, copy these details and email partnership@sayitgil.net.',copy:'Copy inquiry details',copied:'Inquiry details copied.'}};
  function setLang(l){root.lang=l;document.querySelectorAll('[data-set-lang]').forEach(b=>{const active=b.dataset.setLang===l;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false')});document.querySelectorAll('option[data-en]').forEach(o=>o.textContent=o.dataset[l]);document.title=l==='ko'?'사잇길부산 | 부산 자개 공예와 다도 체험':'SayItGil BUSAN | Mother-of-pearl craft & Korean tea in Busan';try{localStorage.setItem('preview-lang',l)}catch{}status.textContent='';form.querySelectorAll('.field-error').forEach(e=>e.remove());form.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'))}
  const q=new URLSearchParams(location.search).get('lang');const pageLang=location.pathname.startsWith('/en/')?'en':'ko';if(['ko','en'].includes(q)&&q!==pageLang){location.replace((q==='en'?'/en/':'/')+location.hash)}setLang(pageLang);
  document.querySelectorAll('[data-set-lang]').forEach(b=>b.addEventListener('click',e=>{if(b.dataset.setLang===root.lang){e.preventDefault();setLang(root.lang)}else{e.preventDefault();location.assign(b.getAttribute('href')+location.hash)}}));
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.classList.toggle('open',open)});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus()}});
  form.addEventListener('submit',e=>{e.preventDefault();const t=texts[root.lang];status.textContent='';form.querySelectorAll('.field-error').forEach(x=>x.remove());form.querySelectorAll('[aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));let first;
    for(const name of ['company','name','email','pax']){const f=form.elements[name];let error='';if(f.required&&!f.value.trim())error=t.required;else if(f.value&&!f.validity.valid)error=name==='email'?t.email:t.pax;if(error){f.setAttribute('aria-invalid','true');const span=document.createElement('span');span.className='field-error';span.id=name+'-error';span.textContent=error;f.setAttribute('aria-describedby',span.id);f.after(span);first ||= f}else f.removeAttribute('aria-describedby')}
    if(first){first.focus();return}if(form.elements._hp.value)return;
    const labels={company:'Company / 회사',name:'Name / 담당자',email:'Email',phone:'Phone / 연락처',type:'Partner type / 구분',market:'Nationality / 국적',date:'Date / 날짜',pax:'Guests / 인원',message:'Time, venue, requirements / 시간·장소·요청'};
    const body=Object.entries(labels).map(([k,v])=>v+': '+form.elements[k].value.trim()).join('\n');
    const href='mailto:partnership@sayitgil.net?subject='+encodeURIComponent('[Group inquiry] '+form.elements.company.value.trim())+'&body='+encodeURIComponent(body);
    const link=document.createElement('a');link.href=href;document.body.append(link);link.click();link.remove();status.textContent=t.draft+' '+t.fallback+' ';
    const copy=document.createElement('button');copy.type='button';copy.className='text-link';copy.textContent=t.copy;copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(body);copy.textContent=t.copied}catch{const area=document.createElement('textarea');area.value=body;status.append(area);area.focus();area.select()}});status.append(copy);
  });
})();
(()=>{
  const root=document.documentElement;
  const tabs=[...document.querySelectorAll('[data-product]')];
  function selectProduct(tab,focus=false){tabs.forEach(b=>{const active=b===tab;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=!active});if(focus)tab.focus()}
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectProduct(tab));tab.addEventListener('keydown',e=>{let i=index;if(e.key==='ArrowRight')i=(index+1)%tabs.length;else if(e.key==='ArrowLeft')i=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();selectProduct(tabs[i],true)})});
  document.querySelectorAll('.round-link').forEach(link=>link.addEventListener('click',()=>{const name=link.closest('.product-panel').querySelector('h3 [data-lang="'+root.lang+'"]').textContent;const message=document.querySelector('#message');const prefix=root.lang==='ko'?'희망 소품: ':'Preferred item: ';if(!message.value.trim())message.value=prefix+name}));
  const video=document.getElementById('hero-video'),button=document.getElementById('film-toggle'),motion=matchMedia('(prefers-reduced-motion: reduce)');
  const setLabel=()=>{const playing=!video.paused;button.setAttribute('aria-label',playing?'Pause video':'Play video');button.innerHTML=playing?'<span data-lang="ko">영상 일시정지</span><span data-lang="en">Pause film</span> <span aria-hidden="true">Ⅱ</span>':'<span data-lang="ko">영상 재생</span><span data-lang="en">Play film</span> <span aria-hidden="true">▶</span>';video.classList.toggle('playing',playing)};
  button.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>setLabel());else video.pause()});video.addEventListener('play',setLabel);video.addEventListener('pause',setLabel);video.addEventListener('error',()=>video.classList.remove('playing'));
  if(!motion.matches){video.play().catch(()=>setLabel())}
  motion.addEventListener('change',()=>{if(motion.matches)video.pause()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
  const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause()},{threshold:0});observer.observe(video);
})();


(()=>{const link=document.querySelector('.floating-inquiry'),hero=document.querySelector('.hero'),inquiry=document.querySelector('#inquiry'),collection=document.querySelector('#collection'),partners=document.querySelector('#partners'),nav=document.querySelector('.nav-links');let pending=false;function update(){pending=false;link.hidden=!(hero.getBoundingClientRect().bottom<innerHeight*.3&&inquiry.getBoundingClientRect().top>innerHeight*.85&&!nav.classList.contains('open')&&!(collection.getBoundingClientRect().top<innerHeight&&collection.getBoundingClientRect().bottom>0)&&!(partners.getBoundingClientRect().top<innerHeight&&partners.getBoundingClientRect().bottom>0))}function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);new MutationObserver(schedule).observe(nav,{attributes:true,attributeFilter:['class']});update()})();

// Visible item cards keep the chosen item in the inquiry draft.
document.querySelectorAll('.item-inquiry').forEach(a=>a.addEventListener('click',()=>{const en=document.documentElement.lang==='en';const input=document.querySelector('#message');if(!input.value.trim())input.value=(en?'Preferred item: ':'희망 소품: ')+(en?a.dataset.itemEn:a.dataset.itemKo)}));

(()=>{
 const gallery=document.querySelector('.experience-carousel'),slides=[...gallery.querySelectorAll('.slide')],dots=[...gallery.querySelectorAll('[data-slide-to]')],pause=gallery.querySelector('.carousel-pause'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,timer,paused=motion.matches,touchX,touchY;
 function show(n){index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==index);dots.forEach((d,i)=>d.setAttribute('aria-current',i===index?'true':'false'));}
 function schedule(){clearInterval(timer);if(!paused&&!motion.matches&&!document.hidden)timer=setInterval(()=>show(index+1),5500)}
 function label(){pause.setAttribute('aria-pressed',String(paused));pause.innerHTML=paused?'<span data-lang="ko">재생</span><span data-lang="en">Play</span>':'<span data-lang="ko">멈춤</span><span data-lang="en">Pause</span>'}
 function move(n){show(n);schedule()}
 gallery.querySelector('.carousel-prev').addEventListener('click',()=>move(index-1));gallery.querySelector('.carousel-next').addEventListener('click',()=>move(index+1));dots.forEach((d,i)=>d.addEventListener('click',()=>move(i)));
 pause.addEventListener('click',()=>{paused=!paused;label();schedule()});gallery.addEventListener('mouseenter',()=>clearInterval(timer));gallery.addEventListener('mouseleave',schedule);gallery.addEventListener('focusin',()=>clearInterval(timer));gallery.addEventListener('focusout',schedule);
 gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(index+(e.key==='ArrowRight'?1:-1))}});
 gallery.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY;clearInterval(timer)},{passive:true});gallery.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(index+(dx<0?1:-1));else schedule()},{passive:true});
 document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',()=>{paused=motion.matches;label();schedule()});label();schedule();
})();
