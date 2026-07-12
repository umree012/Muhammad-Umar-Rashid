/* ═══════════════════════════════════════════════
   UMAR RASHID PORTFOLIO — script.js
   Cursor · Preloader · Nav · Reveal · 3D · Terminal
═══════════════════════════════════════════════ */

// ── PRELOADER ──────────────────────────────────
(function(){
  var fill = document.getElementById('preloader-fill');
  var num  = document.getElementById('preloader-num');
  var pl   = document.getElementById('preloader');
  var p = 0;
  var iv = setInterval(function(){
    p += Math.random() * 18;
    if(p >= 100){ p = 100; clearInterval(iv);
      setTimeout(function(){ pl.classList.add('done'); initAll(); }, 300);
    }
    fill.style.width = p + '%';
    num.textContent = Math.floor(p) + '%';
  }, 80);
})();

function initAll(){
  initCursor();
  initNav();
  initHeroCanvas();
  initScrollReveal();
  initCounters();
  initTerminal();
  init3D();
  initMagnetic();
}

// ── CUSTOM CURSOR ──────────────────────────────
function initCursor(){
  var c  = document.getElementById('cursor');
  var cf = document.getElementById('cursor-follower');
  var mx=0,my=0, fx=0,fy=0;
  document.addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    c.style.left = mx+'px'; c.style.top = my+'px';
  });
  function followCursor(){
    fx += (mx-fx)*.12; fy += (my-fy)*.12;
    cf.style.left = fx+'px'; cf.style.top = fy+'px';
    requestAnimationFrame(followCursor);
  }
  followCursor();
  var links = document.querySelectorAll('a,button,.magnetic,.cert-item,.project-row,.sk-card,.mun-card,.logo-item');
  links.forEach(function(el){
    el.addEventListener('mouseenter', function(){ c.classList.add('active'); cf.classList.add('active'); });
    el.addEventListener('mouseleave', function(){ c.classList.remove('active'); cf.classList.remove('active'); });
  });
}

// ── NAV ───────────────────────────────────────
function initNav(){
  var nav = document.getElementById('nav');
  var btn = document.getElementById('nav-menu-btn');
  var menu= document.getElementById('mobile-menu');
  var open= false;

  window.addEventListener('scroll', function(){
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  btn.addEventListener('click', function(){
    open = !open;
    menu.classList.toggle('open', open);
    btn.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(4px,4px)' : '';
    btn.querySelectorAll('span')[1].style.opacity   = open ? '0' : '1';
    btn.querySelectorAll('span')[2] && (btn.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.mm-link,.mm-cta').forEach(function(el){
    el.addEventListener('click', function(){ open=false; menu.classList.remove('open'); document.body.style.overflow=''; btn.querySelectorAll('span')[0].style.transform=''; btn.querySelectorAll('span')[1].style.opacity='1'; });
  });

  // Active nav highlight
  var sections = document.querySelectorAll('section[id]');
  var navLinks  = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', function(){
    var cur = '';
    sections.forEach(function(s){ if(window.scrollY >= s.offsetTop-100) cur=s.id; });
    navLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href')==='#'+cur); });
  });
}

// ── HERO CANVAS (particle field) ───────────────
function initHeroCanvas(){
  var canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W,H,particles=[];

  function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function Particle(){
    this.x = Math.random()*W;
    this.y = Math.random()*H;
    this.vx= (Math.random()-.5)*.4;
    this.vy= (Math.random()-.5)*.4;
    this.r = Math.random()*1.5+.5;
    this.a = Math.random()*.6+.1;
  }
  Particle.prototype.update = function(){
    this.x+=this.vx; this.y+=this.vy;
    if(this.x<0)this.x=W; if(this.x>W)this.x=0;
    if(this.y<0)this.y=H; if(this.y>H)this.y=0;
  };

  for(var i=0;i<90;i++) particles.push(new Particle());

  var mouse={x:-9999,y:-9999};
  document.addEventListener('mousemove',function(e){ mouse.x=e.clientX; mouse.y=e.clientY; });

  function draw(){
    ctx.clearRect(0,0,W,H);
    // Connections
    particles.forEach(function(p,i){
      particles.forEach(function(q,j){
        if(j<=i) return;
        var d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<120){
          ctx.beginPath();
          ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle='rgba(232,197,71,'+(1-d/120)*.15+')';
          ctx.lineWidth=.5;
          ctx.stroke();
        }
      });
      // Mouse connection
      var md=Math.hypot(p.x-mouse.x,p.y-mouse.y);
      if(md<180){
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y);
        ctx.strokeStyle='rgba(232,197,71,'+(1-md/180)*.3+')';
        ctx.lineWidth=.8; ctx.stroke();
      }
      // Dot
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(232,197,71,'+p.a+')';
      ctx.fill();
      p.update();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── SCROLL REVEAL ─────────────────────────────
function initScrollReveal(){
  // Split text
  document.querySelectorAll('.split-text').forEach(function(el){
    var html='';
    el.innerHTML.split(/<br\s*\/?>/).forEach(function(line,li){
      if(li>0) html+='<br/>';
      line.trim().split(' ').forEach(function(word){
        html+='<span class="word">';
        word.split('').forEach(function(ch){ html+='<span class="char">'+ch+'</span>'; });
        html+='</span> ';
      });
    });
    el.innerHTML=html;
  });

  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e,i){
      if(e.isIntersecting){
        setTimeout(function(){ e.target.classList.add('in'); }, i*60);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.15});

  document.querySelectorAll('.reveal-fade,.reveal-slide,.reveal-scale,.split-text').forEach(function(el){
    obs.observe(el);
  });
}

// ── COUNTERS ──────────────────────────────────
function initCounters(){
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target;
      var target = parseInt(el.getAttribute('data-target'));
      var start=0, dur=1400;
      var step = target/dur*16;
      var iv = setInterval(function(){
        start+=step;
        if(start>=target){ start=target; clearInterval(iv); }
        el.textContent=Math.floor(start);
      },16);
      obs.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('.stat-n').forEach(function(el){ obs.observe(el); });
}

// ── TERMINAL TYPER ────────────────────────────
function initTerminal(){
  var body = document.getElementById('terminal-body');
  if(!body) return;
  var lines = [
    {prompt:'$', cmd:'whoami', out:'Muhammad Umar Rashid'},
    {prompt:'$', cmd:'cat role.txt', out:'CS Student · Developer · Founder'},
    {prompt:'$', cmd:'cat location.txt', out:'Kamra, Punjab, Pakistan'},
    {prompt:'$', cmd:'cat internship.txt', out:'PAC Kamra — MRF Computer Centre'},
    {prompt:'$', cmd:'cat stack.txt', out:'Flutter · Node.js · Firebase · Cisco'},
    {prompt:'$', cmd:'cat github.txt', out:'github.com/umree012'},
  ];
  var i=0;

  function typeLine(){
    if(i>=lines.length){ i=0; setTimeout(function(){ body.innerHTML=''; typeLine(); },3000); return; }
    var l = lines[i++];
    var div = document.createElement('div');
    div.className='term-line';
    div.innerHTML='<span class="prompt">'+l.prompt+'</span>';
    body.appendChild(div);
    // Type command
    var ci=0;
    var iv = setInterval(function(){
      div.innerHTML='<span class="prompt">'+l.prompt+'</span> '+l.cmd.slice(0,ci)+'<span class="term-cursor"></span>';
      ci++;
      if(ci>l.cmd.length){ clearInterval(iv);
        setTimeout(function(){
          div.innerHTML='<span class="prompt">'+l.prompt+'</span> '+l.cmd;
          var out=document.createElement('div');
          out.className='term-line';
          out.innerHTML='<span class="out">'+l.out+'</span>';
          body.appendChild(out);
          body.scrollTop=body.scrollHeight;
          setTimeout(typeLine,600);
        },200);
      }
    },50);
  }

  var obs = new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){ typeLine(); obs.disconnect(); }
  },{threshold:.3});
  obs.observe(body);
}

// ── 3D MODELS ─────────────────────────────────
function init3D(){
  if(typeof THREE==='undefined') return;
  if(typeof THREE.GLTFLoader==='undefined') return;

  function makeScene(canvasId, modelPath, opts){
    opts=opts||{};
    var canvas=document.getElementById(canvasId);
    if(!canvas) return;
    var W=160,H=160;
    canvas.width=W; canvas.height=H;

    var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(W,H);

    var scene=new THREE.Scene();
    var camera=new THREE.PerspectiveCamera(45,1,0.01,1000);
    camera.position.set(0,opts.camY||0.5,opts.camZ||3);
    camera.lookAt(0,opts.lookY||0,0);

    scene.add(new THREE.AmbientLight(0xe8c547,.7));
    var d=new THREE.DirectionalLight(0xffffff,1.4);
    d.position.set(2,4,3); scene.add(d);
    var r=new THREE.DirectionalLight(0x4ade80,.3);
    r.position.set(-2,0,-2); scene.add(r);

    var targetY=0,currentY=0,autoRot=true;
    var wrap=canvas.parentElement;
    wrap.addEventListener('mousemove',function(e){
      var rect=wrap.getBoundingClientRect();
      targetY=((e.clientX-rect.left)/rect.width-.5)*Math.PI*.9;
      autoRot=false;
    });
    wrap.addEventListener('mouseleave',function(){ autoRot=true; });

    var loader=new THREE.GLTFLoader();
    loader.load(modelPath,function(gltf){
      var model=gltf.scene;
      var box=new THREE.Box3().setFromObject(model);
      var center=box.getCenter(new THREE.Vector3());
      var size=box.getSize(new THREE.Vector3());
      var scale=(opts.scale||2)/Math.max(size.x,size.y,size.z);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      model.position.y+=(opts.offsetY||0);
      scene.add(model);
      (function animate(){
        requestAnimationFrame(animate);
        if(autoRot) currentY+=.009;
        else currentY+=(targetY-currentY)*.06;
        model.rotation.y=currentY;
        renderer.render(scene,camera);
      })();
    },undefined,function(e){ console.warn('GLB fail:',e); });
  }

  makeScene('mustache-canvas','models/mustache.glb',{camZ:2.2,camY:.1,scale:1.6});
  makeScene('horse-canvas','models/horse.glb',{camZ:3.8,camY:1.0,lookY:.4,scale:2.5});
}

// ── MAGNETIC BUTTONS ──────────────────────────
function initMagnetic(){
  document.querySelectorAll('.magnetic').forEach(function(el){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect();
      var x=(e.clientX-r.left-r.width/2)*.25;
      var y=(e.clientY-r.top -r.height/2)*.25;
      el.style.transform='translate('+x+'px,'+y+'px)';
    });
    el.addEventListener('mouseleave',function(){
      el.style.transform='';
    });
  });
}

// ── LIGHTBOX ──────────────────────────────────
function openLightbox(src, cap){
  var lb=document.getElementById('lightbox');
  document.getElementById('lb-img').src=src;
  document.getElementById('lb-cap').textContent=cap||'';
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeLightbox(); });

// ── CONTACT FORM ──────────────────────────────
function handleForm(e){
  e.preventDefault();
  var name=document.getElementById('cf-name').value;
  var email=document.getElementById('cf-email').value;
  var msg=document.getElementById('cf-msg').value;
  var status=document.getElementById('form-status');
  var sub=encodeURIComponent('Portfolio Contact from '+name);
  var body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\n\nMessage:\n'+msg);
  window.location.href='mailto:umarrashid69180@gmail.com?subject='+sub+'&body='+body;
  status.textContent='✓ Opening your email client...';
}
