(function(){
  var root=document.documentElement;
  function setLang(l){
    root.lang=l;
    document.querySelectorAll('[data-set-lang]').forEach(function(b){b.classList.toggle('active',b.dataset.setLang===l)});
    try{localStorage.setItem('lang',l)}catch(e){}
  }
  var saved=null;try{saved=localStorage.getItem('lang')}catch(e){}
  var q=new URLSearchParams(location.search).get('lang');
  setLang(q==='ko'||q==='en'?q:(saved||((navigator.language||'').toLowerCase().indexOf('ko')===0?'ko':'en')));
  document.querySelectorAll('[data-set-lang]').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.setLang)})});

  var header=document.querySelector('.site-header');
  function onScroll(){header.classList.toggle('scrolled',window.scrollY>40)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Inquiry form. FORM_ENDPOINT is set at deploy time; until then the form opens a pre-filled email.
  var FORM_ENDPOINT='';
  var form=document.getElementById('inquiry-form'),status=document.getElementById('form-status');
  var msg={
    en:{req:'Please fill in company, name and a valid email.',sending:'Sending…',ok:'Thank you. We have received your inquiry and will reply by email.',err:'Sending failed. Please email partnership@sayitgil.net directly.'},
    ko:{req:'회사명, 담당자, 올바른 이메일을 입력해 주세요.',sending:'보내는 중…',ok:'문의가 접수되었습니다. 이메일로 회신드리겠습니다.',err:'전송에 실패했습니다. partnership@sayitgil.net으로 직접 보내 주세요.'}
  };
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var t=msg[root.lang]||msg.en, d=new FormData(form);
    if(d.get('_hp'))return;
    var email=String(d.get('email')||'');
    if(!d.get('company')||!d.get('name')||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){status.textContent=t.req;return}
    var lines=['company','name','email','phone','type','market','date','pax','message'].map(function(k){return k+': '+(d.get(k)||'')});
    if(!FORM_ENDPOINT){
      location.href='mailto:partnership@sayitgil.net?subject='+encodeURIComponent('[Group inquiry] '+d.get('company'))+'&body='+encodeURIComponent(lines.join('\n'));
      return;
    }
    status.textContent=t.sending;
    var body={};d.forEach(function(v,k){if(k!=='_hp')body[k]=v});body.lang=root.lang;body.page=location.href;
    fetch(FORM_ENDPOINT,{method:'POST',body:JSON.stringify(body),headers:{'Content-Type':'text/plain;charset=utf-8'}})
      .then(function(r){if(!r.ok)throw 0;status.textContent=t.ok;form.reset()})
      .catch(function(){status.textContent=t.err});
  });
})();
