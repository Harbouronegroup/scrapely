/* Smoke & Taco site behaviour. Content lives in content.js. */
(function(){
const SITE=window.SITE, page=document.body.dataset.page;
document.documentElement.classList.add("js");
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const on=(s,fn)=>{const el=$(s);if(el)fn(el);};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
const arr='<span class="arr"><svg width="12" height="12"><use href="#arr"/></svg></span>';
const ph=n=>"assets/photos/"+n+".jpg";

/* nav state */
const cur={"public":"book","private":"book"}[page]||page;
$$(".nav a[data-nav]").forEach(a=>{if(a.dataset.nav===cur)a.setAttribute("aria-current","page");});
on("#menu",m=>m.addEventListener("click",()=>{const o=$("#nav").classList.toggle("open");m.setAttribute("aria-expanded",o);}));

/* tiles */
const Y="var(--yellow)",P="var(--pink)",O="var(--orange)",M="var(--mint)",B="var(--burg)";
const PATTERN=[[P,"star",Y],[O,"palm",Y,P],[Y,"pot",P],[M,"logo"],[B,"taco",P],[O,"flame",B],[M,"star",Y],[B,"palm",Y,P],[O,"taco",B],[P,"sun",Y],[B,"flame",P],[M,"palm",Y,P],[P,"palm",B,Y],[Y,"sun",O],[O,"flame",B],[B,"pot",P]];
function tile(i){const[bg,m,a,b]=PATTERN[i%PATTERN.length],live=i%3===0?" live":"";
  const inner=m==="logo"?'<img src="assets/logo.png" alt="">':m==="flame"?'<div class="flm"></div>':`<svg viewBox="0 0 100 100"><use href="#m-${m}"/></svg>`;
  return `<div class="tile${live}" style="--bg:${bg};--a:${a||B};--b:${b||a||B}">${inner}</div>`;}
$$("[data-tiles]").forEach(el=>{el.innerHTML=Array.from({length:+el.dataset.tiles},(_,i)=>tile(i+(+el.dataset.off))).join("");});

/* marquees */
$$("[data-mq]").forEach(el=>{const items=el.dataset.mq.split("|").map(t=>`<span>${esc(t)}</span>`).join("");el.innerHTML=items+items+items+items;});

/* home: food reel + statement */
on("#htrack",tr=>{tr.innerHTML=SITE.photos.map(([n,alt],i)=>`<figure class="dish" style="margin:0"><img src="${ph(n)}" alt="${esc(alt)}" loading="lazy"><figcaption><small>Smoke & Taco</small><span>${esc(alt)}</span></figcaption></figure>`).join("");$("#hreel").style.setProperty("--n",SITE.photos.length);});
$$("[data-statement]").forEach(el=>{const hot=/birria|smoked|festivals|parties/i;el.innerHTML=el.textContent.trim().split(/\s+/).map(w=>`<span class="w${hot.test(w)?" hot":""}">${esc(w)}</span>`).join(" ");});

/* food page */
on("[data-foodbento]",el=>{const fb=[["c-7 tall",0],["c-5 tall",1],["c-4",2],["c-4",3],["c-4",4],["c-6 tall",5],["c-6 tall",6],["c-12 tall",7]];
  el.innerHTML=fb.map(([c,i])=>{const[n,alt]=SITE.photos[i];return `<figure class="cell ${c}" style="margin:0" data-tilt><img class="bg" src="${ph(n)}" alt="${esc(alt)}" loading="lazy"><div class="shade"></div><figcaption style="font-weight:700">${esc(alt)}</figcaption></figure>`}).join("");});
on("#dishlist",el=>el.innerHTML=SITE.dishes.map(d=>`<li><h3 style="align-self:center">${esc(d)}</h3></li>`).join(""));

/* proof */
function proof(stack){const c=stack?["c-12","c-12","c-12"]:["c-5","c-4","c-3"];
  return `<div class="cell ${c[0]}" data-tilt><div class="badge-img"><img src="assets/badges/hygiene.jpg" alt="Food Standards Agency Food Hygiene Rating: 5, very good" loading="lazy"></div><h3>Food Hygiene Rating: 5</h3><p class="small">Very good. The top score under the Food Standards Agency scheme.</p></div>
  <div class="cell ${c[1]}" data-tilt><div class="badge-img"><img src="assets/badges/finalist.jpg" alt="New Milton Advertiser and Lymington Times Food and Drink Awards 2026 finalist" loading="lazy"></div><h3>Food & Drink Awards 2026 finalist</h3><p class="small">New Milton Advertiser & Lymington Times, in partnership with Harvest Fine Foods.</p></div>
  <a class="cell ${c[2]}" href="${SITE.facebook}" target="_blank" rel="noopener" style="text-decoration:none" data-tilt><div class="badge-img" style="background:#3B5998"><img src="assets/badges/facebook.jpg" alt="Facebook" loading="lazy"></div><span class="big">100%</span><h3>Recommended on Facebook</h3></a>`;}
$$("[data-proof]").forEach(el=>el.innerHTML=proof(el.dataset.proof==="stack"));

/* reels */
$$("[data-reels]").forEach(el=>el.innerHTML=SITE.reels.map(r=>`<a class="reel" href="${r.url}" target="_blank" rel="noopener"><img src="${ph(r.poster)}" alt="" loading="lazy"><span class="play" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#120806"/></svg></span><h3>${esc(r.title)}</h3><span>${esc(r.text)}</span><small>Watch on Facebook</small></a>`).join(""));

/* events */
const today=new Date();today.setHours(0,0,0,0);
const dated=SITE.events.filter(e=>e.date&&new Date(e.date+"T23:59:59")>=today&&e.status!=="draft").sort((a,b)=>a.date.localeCompare(b.date));
const board=SITE.events.filter(e=>!e.date);
const maps=e=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(e.venue+", "+e.town);
function evCard(e){const d=e.date?new Date(e.date+"T12:00:00"):null;
  const box=d?`<div class="d">${d.getDate()}<small>${d.toLocaleDateString("en-GB",{weekday:"short",month:"short"})}</small></div>`:`<div class="d" style="background:var(--yellow)">?<small>Month to confirm</small></div>`;
  const tag=e.status==="cancelled"?'<span class="tag warn">Cancelled</span>':d?'<span class="tag">Confirmed</span>':'<span class="tag warn">Date to confirm</span>';
  return `<article class="ev">${box}<div class="w">${tag}<h3>${esc(e.venue)}, ${esc(e.town)}</h3><span>${esc(d?e.time:e.day+", "+e.time)}</span></div><a href="${maps(e)}" target="_blank" rel="noopener">Directions &#8599;</a></article>`;}
const empty=`<div class="empty"><h3>No confirmed public dates right now</h3><p>New dates go up on Instagram and Facebook first. Or skip the queue and bring the tacos to you.</p><div class="row"><a class="btn" href="${SITE.instagram}" target="_blank" rel="noopener">Check Instagram ${arr}</a><a class="btn ghost" href="private-catering.html">Book a private event</a></div></div>`;
$$("[data-events]").forEach(el=>{const k=el.dataset.events,list=k==="board"?board:k==="home"?dated.filter(e=>e.featured).slice(0,3):dated;el.innerHTML=list.length?list.map(evCard).join(""):(k==="board"?"<p>Nothing waiting for a date.</p>":empty);});
$$("[data-past]").forEach(el=>el.innerHTML=SITE.past.slice(0,+el.dataset.past).map(e=>`<article class="ev"><div class="d" style="background:var(--mint);font-size:1.4rem">${e[0]||"&#9733;"}<small>${e[0]?"2026":"First"}</small></div><div class="w"><h3>${esc(e[1])}</h3><span>${esc(e[2])}</span></div></article>`).join(""));

/* partners */
const lg=p=>`<div class="lg" style="--c:${p[2]}"><img src="assets/partners/${p[1]}" alt="${esc(p[0])} logo"></div>`;
$$("[data-logos]").forEach(el=>{el.innerHTML=SITE.partners.map(p=>`<figure>${lg(p)}<figcaption>${esc(p[0])}</figcaption></figure>`).join("");});
on("#partner-grid",el=>el.innerHTML=SITE.partners.map(p=>`<figure>${lg(p)}<figcaption>${esc(p[0])}</figcaption></figure>`).join(""));
$$("[data-partners]").forEach(el=>{el.dataset.count=SITE.partners.length;el.textContent=SITE.partners.length;});
$$("[data-reviews]").forEach(el=>el.remove());

/* social, contact, footer */
const soc=[["Instagram","@smokeandtaco",SITE.instagram,"var(--pink)","festival"],["Facebook","Smoke & Taco",SITE.facebook,"var(--mint)","counter"]];
$$("[data-social]").forEach(el=>el.innerHTML=soc.map(s=>`<a class="door" href="${s[2]}" target="_blank" rel="noopener" style="--tint:rgba(18,8,6,.95);min-height:280px"><img src="${ph(s[4])}" alt="" loading="lazy"><span class="kicker" style="color:${s[3]}">${s[1]}</span><h2>${s[0]}</h2><span class="btn sm" style="justify-self:start">Follow us ${arr}</span></a>`).join(""));
on("#foot-social",el=>el.innerHTML=soc.map(s=>`<li><a href="${s[2]}" target="_blank" rel="noopener">${s[0]}</a></li>`).join(""));
$$("[data-email]").forEach(el=>el.textContent=SITE.email);
on("#contact-list",el=>el.innerHTML=[["Email",esc(SITE.email)],["Telephone",esc(SITE.phone)],["Where we trade",esc(SITE.area)],["Instagram",`<a href="${SITE.instagram}" target="_blank" rel="noopener">@smokeandtaco</a>`],["Facebook",`<a href="${SITE.facebook}" target="_blank" rel="noopener">Smoke & Taco</a>`]].filter(r=>r[1]).map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join(""));
on("#copy",el=>el.innerHTML='&copy; <a href="https://www.anchor-digital.co.uk" target="_blank" rel="noopener">Anchor Digital Solutions</a>. All Rights Reserved.');

/* forms */
const sets=["Indoor","Outdoor","Both","Not sure yet"];
const FORMS={
  public:[["name","Full name","text",1],["email","Email address","email",1],["tel","Telephone number","tel",1],["org","Event or organisation name","text",1],["type","Event type","select",1,["Food festival","Music festival","Community event","Market","Pub or brewery event","Corporate event","Something else"]],["date","Event date","date",1],["start","Start time, if known","time",0],["end","Finish time, if known","time",0],["venue","Venue name","text",1],["size","Expected attendance","number",0],["addr","Venue address","textarea",1,0,1],["setting","Indoor or outdoor setting","select",1,sets],["pref","Preferred contact method","select",1,["Email","Phone"]],["fac","Catering facilities on site, such as power, water and pitch size","textarea",0,0,1],["info","Additional information","textarea",0,0,1]],
  private:[["name","Full name","text",1],["email","Email","email",1],["tel","Telephone","tel",1],["type","Event type","select",1,["Wedding","Birthday party","Private celebration","Corporate event","Staff party","Garden party","Venue function","Something else"]],["date","Event date","date",1],["start","Start time","time",0],["end","Finish time","time",0],["guests","Estimated guest numbers","number",1],["addr","Venue and address","textarea",1,0,1],["setting","Indoor or outdoor setting","select",1,sets],["budget","Budget range","text",0],["cater","Catering requirements","textarea",0,0,1],["diet","Dietary or allergen information","textarea",0,0,1],["info","Additional details","textarea",0,0,1]],
  contact:[["name","Name","text",1,0,1],["email","Email","email",1,0,1],["tel","Telephone","tel",0,0,1],["reason","Reason for enquiry","select",1,["General question","Public event booking","Private catering","Press or collaboration","Something else"],1],["msg","Message","textarea",1,0,1]]
};
Object.entries(FORMS).forEach(([key,fields])=>{
  const form=$("#form-"+key);if(!form)return;
  form.innerHTML=`<input type="hidden" name="form" value="${key}">`+fields.map(([id,label,type,req,opts,wide])=>{const fid=key+"-"+id,at=`id="${fid}" name="${id}" ${req?"required":""} aria-describedby="${fid}-e"`;
    const ctl=type==="select"?`<select ${at}><option value="">Choose one</option>${opts.map(o=>`<option>${o}</option>`).join("")}</select>`:type==="textarea"?`<textarea ${at}></textarea>`:`<input type="${type}" ${at} ${type==="number"?'min="1" inputmode="numeric"':""} ${type==="email"?'autocomplete="email"':type==="tel"?'autocomplete="tel"':id==="name"?'autocomplete="name"':""}>`;
    return `<div class="f${wide?" wide":""}"><label for="${fid}">${label}${req?"":" <i>(optional)</i>"}</label>${ctl}<div class="err" id="${fid}-e" role="alert"></div></div>`;}).join("")
  +`<div class="hp" aria-hidden="true"><label for="${key}-website">Leave this empty</label><input id="${key}-website" name="website" tabindex="-1" autocomplete="off"></div><p class="wide small">We use these details only to reply to your enquiry. See our <a href="privacy.html">privacy policy</a>.</p><div class="wide"><button class="btn" type="submit">Send enquiry ${arr}</button></div><div class="status wide" id="${key}-status" role="status" hidden></div>`;
  form.addEventListener("submit",async ev=>{ev.preventDefault();let first=null;
    fields.forEach(([id,label,type,req])=>{const el=$("#"+key+"-"+id),v=el.value.trim();let m="";
      if(req&&!v)m="Please fill in: "+label.toLowerCase()+".";
      else if(type==="email"&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))m="That email address does not look right. Check for typos.";
      else if(type==="tel"&&v&&v.replace(/\D/g,"").length<9)m="Enter a full phone number, including the area code.";
      else if(type==="date"&&v&&new Date(v+"T23:59:59")<today)m="That date has already passed. Pick a future date.";
      else if(type==="number"&&v&&+v<1)m="Enter a number of 1 or more.";
      $("#"+key+"-"+id+"-e").textContent=m;el.setAttribute("aria-invalid",m?"true":"false");if(m&&!first)first=el;});
    const st=$("#"+key+"-status");if(first){st.hidden=true;first.focus();return;}
    if($("#"+key+"-website").value)return;
    const btn=form.querySelector("button[type=submit]");btn.disabled=true;st.hidden=false;st.textContent="Sending...";
    let ok=false,msg="";
    if(location.protocol.startsWith("http")){
      try{const r=await fetch("send.php",{method:"POST",body:new FormData(form),headers:{"Accept":"application/json"}});const j=await r.json();ok=!!j.ok;msg=j.message||"";}catch(e){}
    }
    btn.disabled=false;
    if(ok){st.textContent="Thank you. Your enquiry has been sent and we will be in touch soon. Nothing is booked until we confirm it with you.";form.reset();}
    else st.textContent=msg||"We could not send this right now. Please email us at "+SITE.email+" and we will get back to you.";
  });
});

/* page transition curtain */
const curtain=$("#curtain");
try{if(sessionStorage.getItem("st-curtain")){sessionStorage.removeItem("st-curtain");if(!still&&curtain){curtain.classList.add("leave");}}}catch(e){}
document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a||still||!curtain)return;
  const href=a.getAttribute("href");if(a.target==="_blank"||e.metaKey||e.ctrlKey||e.shiftKey||!/^[\w-]+\.html$/.test(href))return;
  e.preventDefault();curtain.classList.add("enter");try{sessionStorage.setItem("st-curtain","1");}catch(x){}setTimeout(()=>location.href=href,380);});
addEventListener("pageshow",e=>{if(e.persisted&&curtain)curtain.classList.remove("enter");});

/* header */
const head=$("#head");
const setHH=()=>document.documentElement.style.setProperty("--hh",head.offsetHeight+"px");setHH();addEventListener("resize",setHH);

/* scroll effects */
const rails=$$(".rail>div");let tick=false;
function onScroll(){const y=scrollY;head.classList.toggle("solid",y>30||page!=="home");
  if(still)return;
  rails.forEach((r,i)=>{const t=r.firstElementChild?.offsetHeight||56,period=t*PATTERN.length;r.style.transform=`translateY(${-((y*(i?0.09:0.05))%period)}px)`;});
  const hr=$("#hreel");if(hr&&innerWidth>899){const r=hr.getBoundingClientRect(),tr=$("#htrack"),max=tr.scrollWidth-tr.clientWidth;const p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));tr.style.transform=`translateX(${-p*Math.max(0,max)}px)`;$("#hprog").style.setProperty("--p",p);}
  $$("[data-statement]").forEach(el=>{const r=el.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height+innerHeight*.35))),ws=el.children,n=Math.round(p*ws.length);for(let i=0;i<ws.length;i++)ws[i].classList.toggle("lit",i<n);});
}
addEventListener("scroll",()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{onScroll();tick=false;});},{passive:true});
addEventListener("resize",onScroll);onScroll();

/* reveal + counters */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add("in");
  $$("[data-count]",e.target).forEach(b=>{if(still||b.dataset.done)return;b.dataset.done=1;const end=+b.dataset.count,suf=b.dataset.suffix||"",t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1400),v=Math.round(end*(1-Math.pow(1-k,3)));b.textContent=v+suf;if(k<1)requestAnimationFrame(f);};requestAnimationFrame(f);});
  io.unobserve(e.target);}),{threshold:.2});
$$(".rv").forEach(el=>io.observe(el));

/* pointer effects */
if(!still&&matchMedia("(pointer:fine)").matches){
  on("#hero",hero=>hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$$("#plates [data-depth]").forEach(p=>{const d=+p.dataset.depth;p.style.transform=`translate(${x*d}px,${y*d}px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`+(p.classList.contains("c")?" rotate(-8deg)":"");});}));
  document.addEventListener("pointermove",e=>{const c=e.target.closest&&e.target.closest("[data-tilt]");if(!c)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;});
  document.addEventListener("pointerout",e=>{const c=e.target.closest&&e.target.closest("[data-tilt]");if(c&&!c.contains(e.relatedTarget))c.style.transform="";});
  $$(".mag").forEach(b=>{b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.3}px)`;});b.addEventListener("pointerleave",()=>b.style.transform="");});
}

/* ember smoke shader (home hero) */
on("#smoke",cv=>{const gl=cv.getContext("webgl",{antialias:false});if(!gl)return;
  const vs="attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const fs=`precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
  void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*2.2;
    vec2 q=vec2(fbm(p+vec2(0.,-t*.12)),fbm(p+vec2(5.2,1.3-t*.1)));
    float s=fbm(p+2.4*q+vec2(m.x*.4,-t*.18));
    float heat=smoothstep(1.05,-.1,uv.y+(s-.5)*.6-m.y*.08);
    vec3 c=mix(vec3(.07,.03,.024),vec3(.36,.09,.03),smoothstep(.25,.75,s)*heat);
    c=mix(c,vec3(.96,.5,.13),smoothstep(.62,.95,s*heat*1.35)*.9);
    c+=vec3(.9,.35,.08)*pow(heat,6.)*.25;
    float e=step(.985,h(floor(gl_FragCoord.xy/3.)+floor(t*6.)))*heat*.7;c+=vec3(1.,.6,.2)*e;
    float vig=smoothstep(1.3,.3,length(uv-vec2(.6,.4)));gl_FragColor=vec4(c*mix(.55,1.,vig),1.);}`;
  const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;gl.useProgram(pr);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const ur=gl.getUniformLocation(pr,"r"),ut=gl.getUniformLocation(pr,"t"),um=gl.getUniformLocation(pr,"m");let mx=0,my=0,tx=0,ty=0;
  addEventListener("pointermove",e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;},{passive:true});
  const size=()=>{cv.width=Math.max(1,cv.clientWidth*.5|0);cv.height=Math.max(1,cv.clientHeight*.5|0);gl.viewport(0,0,cv.width,cv.height);};size();addEventListener("resize",size);
  let vis=true;new IntersectionObserver(es=>vis=es[0].isIntersecting).observe(cv);
  const t0=performance.now();const draw=now=>{if(vis){mx+=(tx-mx)*.05;my+=(ty-my)*.05;gl.uniform2f(ur,cv.width,cv.height);gl.uniform1f(ut,(now-t0)/1000);gl.uniform2f(um,mx,my);gl.drawArrays(gl.TRIANGLES,0,3);}if(!still)requestAnimationFrame(draw);};requestAnimationFrame(draw);
});
})();
