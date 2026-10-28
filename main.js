(()=>{
  const root=document.documentElement, menu=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav-links');
  const form=document.querySelector('#inquiry-form'), status=document.querySelector('#form-status');
  const texts={ko:{required:'필수 항목입니다.',email:'올바른 이메일 주소를 입력해 주세요.',pax:'인원은 1명 이상 10,000명 이하로 입력해 주세요.',consent:'문의 응대를 위한 개인정보 수집·이용에 동의해 주세요.',sending:'문의를 접수하고 있습니다…',success:'문의가 접수되었습니다. 남겨주신 연락처로 안내하겠습니다. 접수번호: ',failed:'접수 완료를 확인하지 못했습니다. 입력 내용은 유지됩니다. 다시 접수를 누르거나 051-711-0819로 문의해 주세요.',rate:'잠시 후 다시 시도해 주세요. 급한 문의는 051-711-0819로 연락하실 수 있습니다.'},en:{required:'This field is required.',email:'Enter a valid email address.',pax:'Enter between 1 and 10,000 guests.',consent:'Please agree to the use of your details to respond to this inquiry.',sending:'Submitting your inquiry…',success:'Your inquiry has been received. We will contact you using the details provided. Reference: ',failed:'We could not confirm receipt. Your details have been kept. Try submitting again or call +82-51-711-0819.',rate:'Please try again later, or call +82-51-711-0819 for urgent inquiries.'}};
  let submitting=false,requestId='',lastPayload='';
  function setLang(l){root.lang=l;document.querySelectorAll('[data-set-lang]').forEach(b=>{const active=b.dataset.setLang===l;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false')});document.querySelectorAll('option[data-en]').forEach(o=>o.textContent=o.dataset[l]);document.title=l==='ko'?'사잇길부산 | 부산 자개 공예와 다도 체험':'SayItGil BUSAN | Mother-of-pearl craft & Korean tea in Busan';try{localStorage.setItem('preview-lang',l)}catch{}status.textContent='';form.querySelectorAll('.field-error').forEach(e=>e.remove());form.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'))}
  const q=new URLSearchParams(location.search).get('lang');const pageLang=location.pathname.startsWith('/en/')?'en':'ko';if(['ko','en'].includes(q)&&q!==pageLang){location.replace((q==='en'?'/en/':'/')+location.hash)}setLang(pageLang);
  document.querySelectorAll('[data-set-lang]').forEach(b=>b.addEventListener('click',e=>{if(b.dataset.setLang===root.lang){e.preventDefault();setLang(root.lang)}else{e.preventDefault();location.assign(b.getAttribute('href')+location.hash)}}));
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.classList.toggle('open',open)});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus()}});
  form.addEventListener('submit',async e=>{e.preventDefault();if(submitting)return;const t=texts[root.lang];status.textContent='';form.querySelectorAll('.field-error').forEach(x=>x.remove());form.querySelectorAll('[aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));let first;
    for(const name of ['company','name','email','phone','market','date','pax','message','consent']){const f=form.elements[name];let error='';if(name==='consent'&&!f.checked)error=t.consent;else if(f.required&&!f.value.trim())error=t.required;else if(f.value&&!f.validity.valid)error=name==='email'?t.email:name==='pax'?t.pax:t.required;if(error){f.setAttribute('aria-invalid','true');const span=document.createElement('span');span.className='field-error';span.id=name+'-error';span.textContent=error;f.setAttribute('aria-describedby',span.id);(name==='consent'?f.closest('label'):f).after(span);first ||= f}else f.removeAttribute('aria-describedby')}
    if(first){first.focus();return}if(form.elements._hp.value)return;
    const payload={};for(const key of ['company','name','email','phone','type','market','date','pax','message','_hp'])payload[key]=form.elements[key].value.trim();payload.lang=root.lang;payload.consent=form.elements.consent.checked;
    const signature=JSON.stringify(payload);if(signature!==lastPayload){requestId=crypto.randomUUID();lastPayload=signature}payload.requestId=requestId;
    const button=form.querySelector('[type="submit"]'),controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),45000);
    submitting=true;button.disabled=true;form.setAttribute('aria-busy','true');status.textContent=t.sending;
    try{
      const response=await fetch("https://script.google.com/macros/s/AKfycbyoK6tMz2WPCsJp4CIc-LcvBnHaDFk-1gC463C6EmW8zsxKOMotPc0dcNCwGKR6ie6ong/exec",{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit'});
      const result=await response.json();if(!response.ok||!result.ok||!/^INQ-[0-9]{8}-[A-F0-9]{8}$/.test(result.id||''))throw Error(result.error||'UNAVAILABLE');
      status.textContent=t.success+result.id;form.reset();requestId='';lastPayload='';
    }catch(error){status.textContent=error.message==='RATE_LIMIT'?t.rate:t.failed}
    finally{clearTimeout(timeout);submitting=false;button.disabled=false;form.removeAttribute('aria-busy')}
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
