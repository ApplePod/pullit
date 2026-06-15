/* ─── LOADER ─── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const tag = document.getElementById('loaderTag');
  if (!loader) return;

  const words = ['PULL FOR GRADE 1', '27 UNITS IN SPACE', 'MATH · ENG · 3 A DAY', 'PULLIT'];
  let w = 0;
  const wordInterval = setInterval(() => {
    w = (w + 1) % words.length;
    if (tag) tag.textContent = words[w];
  }, 400);

  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18 + 4;
    if (p >= 100) {
      p = 100;
      clearInterval(tick);
      clearInterval(wordInterval);
      setTimeout(() => {
        loader.classList.add('done');
        if (typeof gsap !== 'undefined') {
          gsap.to('#nav', { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
        }
        startHero();
      }, 300);
    }
    if (bar) bar.style.width = p + '%';
  }, 80);
})();

/* ─── NAV ─── */
document.getElementById('navToggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('open');
});

/* ─── CUSTOM CURSOR ─── */
const ring = document.getElementById('cursorRing');
const dot = document.getElementById('cursorDot');
if (ring && dot && window.matchMedia('(pointer: fine)').matches) {
  let rx = 0, ry = 0, dx = 0, dy = 0;
  window.addEventListener('mousemove', (e) => {
    dx = e.clientX; dy = e.clientY;
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
  });
  (function cursorLoop() {
    rx += (dx - rx) * 0.15;
    ry += (dy - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(cursorLoop);
  })();
}

/* ─── MAGNETIC ─── */
document.querySelectorAll('.magnetic').forEach((el) => {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ─── LIVE COUNTER ─── */
const liveEl = document.getElementById('liveCount');
if (liveEl) {
  let n = 3104;
  setInterval(() => {
    n += Math.floor(Math.random() * 9) - 3;
    if (n < 3000) n = 3000;
    liveEl.textContent = n.toLocaleString();
  }, 2200);
}

/* ─── TICKER DUPLICATE ─── */
const ticker = document.getElementById('tickerTrack');
if (ticker) ticker.innerHTML += ticker.innerHTML;

/* ─── TEXT SCRAMBLE ─── */
function scramble(el) {
  const orig = el.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ가나다라마바사0123';
  let frame = 0;
  const id = setInterval(() => {
    el.textContent = orig.split('').map((c, i) =>
      i < frame ? c : chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    frame++;
    if (frame > orig.length) { clearInterval(id); el.textContent = orig; }
  }, 35);
}
document.querySelectorAll('[data-scramble]').forEach((el) => {
  setTimeout(() => scramble(el), 1200);
});

/* ─── HERO 3 PARALLAX ─── */
const impact3 = document.getElementById('impact3');
if (impact3 && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    impact3.querySelectorAll('.layer').forEach((layer, i) => {
      const depth = (i + 1) * 8;
      layer.style.transform = `translate(calc(-50% + ${x * depth}px), calc(-50% + ${y * depth}px)) translateZ(${i * -20}px)`;
    });
  });
}

function startHero() {
  if (typeof gsap === 'undefined') return;

  gsap.from('.impact-badge', { opacity: 0, y: 30, duration: 0.8 });
  gsap.from('.impact-3 .layer', { opacity: 0, z: -200, stagger: 0.1, duration: 1.2, ease: 'power4.out' });
  gsap.from('.hl-row', { opacity: 0, y: 60, rotateX: 40, stagger: 0.15, duration: 1, ease: 'power3.out', delay: 0.3 });
  gsap.from('.impact-sub, .impact-actions, .impact-live', { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, delay: 0.7 });
  gsap.from('.scroll-cue', { opacity: 0, duration: 1, delay: 1.2 });

  gsap.to('.l-front', {
    rotateY: 8, rotateX: -5, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1,
  });
}

/* ─── GALAXY NODES ─── */
const CONCEPTS = [
  '다항식', '방정식', '도형', '함수', '수열', '지수', '로그', '삼각', '벡터',
  '확률', '통계', '미분', '적분', '극한', '행렬', '복소', '집합', '명제',
  '도형방정식', '이차함수', '지수함수', '로그함수', '수열극한', '미분법', '적분법', '확률분포', '통계추정',
];
const STATES = ['g','g','y','r','r','y','g','g','y','r','y','g','g','y','r','g','y','g','r','r','y','g','g','y','g','r','y'];

const galaxyNodes = document.getElementById('galaxyNodes');
const nodes = [];
if (galaxyNodes) {
  CONCEPTS.forEach((name, i) => {
    const angle = (i / 27) * Math.PI * 2 - Math.PI / 2;
    const radius = 38 + (i % 3) * 4;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    const node = document.createElement('div');
    node.className = `g-node ${STATES[i]} hidden`;
    node.style.left = x + '%';
    node.style.top = y + '%';
    node.title = name;
    galaxyNodes.appendChild(node);
    nodes.push({ el: node, state: STATES[i], name });
  });
}

function updateHud() {
  const visible = nodes.filter(n => !n.el.classList.contains('hidden'));
  const r = visible.filter(n => n.el.classList.contains('r')).length;
  const y = visible.filter(n => n.el.classList.contains('y')).length;
  const g = visible.filter(n => n.el.classList.contains('g')).length;
  const hudR = document.getElementById('hudRed');
  const hudY = document.getElementById('hudYellow');
  const hudG = document.getElementById('hudGreen');
  if (hudR) hudR.textContent = r;
  if (hudY) hudY.textContent = y;
  if (hudG) hudG.textContent = g;
}

/* ─── TUNNEL TEXT ─── */
const tunnelWords = ['1등급', '27', '수학', '영어', '3', '우주', '단원', '매일', '별', 'Pullit', '성장', '10분'];
['tunnel1', 'tunnel2'].forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    s.textContent = tunnelWords[i % tunnelWords.length];
    el.appendChild(s);
  }
});

/* ─── VOICES DUPLICATE ─── */
const voices = document.getElementById('voicesTrack');
if (voices) voices.innerHTML += voices.innerHTML;

/* ─── SINGULARITY PARTICLES ─── */
const singP = document.getElementById('singParticles');
if (singP) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;width:4px;height:4px;border-radius:50%;
      background:${['#00E5A8','#5B5BF0','#FF6B7A'][i % 3]};
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      animation: singFloat ${3 + Math.random() * 4}s ease-in-out infinite;
      animation-delay:${Math.random() * 2}s;opacity:.6;
    `;
    singP.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes singFloat{0%,100%{transform:translate(0,0)}50%{transform:translate(${(Math.random() - 0.5) * 40}px,${(Math.random() - 0.5) * 40}px)}}`;
  document.head.appendChild(style);
}

/* ─── GSAP SCROLL CHOREOGRAPHY ─── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      window.dispatchEvent(new CustomEvent('pullit-scroll', { detail: { intensity: self.progress } }));
    },
  });

  const ritualCards = gsap.utils.toArray('.rit-card');
  const ritualTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.act-ritual',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      pin: '.ritual-pin',
    },
  });

  ritualTL
    .to('#ritualProgress', { width: '33%', duration: 1 })
    .to(ritualCards[0], { scale: 1.1, z: 80, rotateY: -10, duration: 1 }, 0);
  ritualTL
    .to('#ritualProgress', { width: '66%', duration: 1 })
    .to(ritualCards[0], { scale: 1, opacity: 0.6, duration: 0.5 })
    .to(ritualCards[1], { scale: 1.15, z: 100, rotateY: 0, duration: 1 }, '-=0.5');
  ritualTL
    .to('#ritualProgress', { width: '100%', duration: 1 })
    .to(ritualCards[1], { scale: 1, opacity: 0.6, duration: 0.5 })
    .to(ritualCards[2], { scale: 1.15, z: 100, rotateY: 10, duration: 1 }, '-=0.5')
    .to('.orbit-core', { scale: 1.1, duration: 0.5 });

  gsap.timeline({
    scrollTrigger: {
      trigger: '.act-galaxy',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      pin: '.galaxy-pin',
      onUpdate: (self) => {
        const revealCount = Math.floor(self.progress * 27);
        nodes.forEach((n, i) => {
          if (i < revealCount) n.el.classList.remove('hidden');
        });
        updateHud();
        if (self.progress > 0.7) {
          document.getElementById('galaxyAlert')?.classList.add('show');
          const weak = nodes.find(n => n.state === 'r' && !n.el.classList.contains('hidden'));
          const alertEl = document.getElementById('alertConcept');
          if (weak && alertEl) alertEl.textContent = weak.name;
        }
      },
    },
  })
    .from('.galaxy-ring', { scale: 0.5, opacity: 0, stagger: 0.2, duration: 1 })
    .from('.galaxy-core', { scale: 0, rotation: 180, duration: 1 }, 0);

  gsap.to('.tl1', {
    rotateZ: 360, z: -200,
    scrollTrigger: { trigger: '.act-tunnel', start: 'top bottom', end: 'bottom top', scrub: 2 },
  });
  gsap.to('.tl2', {
    rotateZ: -360, z: -400,
    scrollTrigger: { trigger: '.act-tunnel', start: 'top bottom', end: 'bottom top', scrub: 2 },
  });
  gsap.from('.tunnel-center', {
    scale: 0.5, opacity: 0,
    scrollTrigger: { trigger: '.act-tunnel', start: 'top 70%', end: 'center center', scrub: 1 },
  });

  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 60, rotateX: 20 }, {
      opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    });
  });

  gsap.utils.toArray('.stat-num[data-count]').forEach((el) => {
    const target = +el.dataset.count;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to({ v: 0 }, {
        v: target, duration: 1.8, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].v); },
      }),
    });
  });

  gsap.to('#pulseArena', {
    rotateY: 5, rotateX: -3,
    scrollTrigger: { trigger: '.act-pulse', start: 'top 80%', end: 'bottom 20%', scrub: 1 },
  });

  gsap.to('#singularityHole', {
    scale: 1.5, opacity: 0.8,
    scrollTrigger: { trigger: '.act-singularity', start: 'top bottom', end: 'bottom top', scrub: 1 },
  });
}

setInterval(() => {
  const visible = nodes.filter(n => !n.el.classList.contains('hidden'));
  if (!visible.length) return;
  const n = visible[Math.floor(Math.random() * visible.length)];
  n.el.classList.add('pulse');
  setTimeout(() => n.el.classList.remove('pulse'), 600);
}, 2000);

const quizData = {
  math: {
    meta: '이차함수 · Lv.2',
    q: 'x² − 5x + 6 = 0 의 두 근의 합은?',
    options: [
      { text: '3', correct: false },
      { text: '5', correct: true },
      { text: '6', correct: false },
      { text: '−5', correct: false },
    ],
    explain: '근과 계수의 관계 → 두 근의 합 = 5',
    weak: '이차함수 › 판별식',
  },
  eng: {
    meta: '독해 · Lv.2',
    q: '"abundant"와 가장 가까운 뜻은?',
    options: [
      { text: 'scarce', correct: false },
      { text: 'plentiful', correct: true },
      { text: 'narrow', correct: false },
      { text: 'silent', correct: false },
    ],
    explain: 'abundant = plentiful (풍부한)',
    weak: '어휘 › 동의어',
  },
};

function renderQuiz(subject) {
  const data = quizData[subject];
  document.getElementById('quizMeta').textContent = data.meta;
  document.getElementById('quizQ').textContent = data.q;
  const result = document.getElementById('quizResult');
  const burst = document.getElementById('weakBurst');
  result.textContent = '';
  result.style.color = '';
  burst?.classList.remove('active');

  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  data.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'pulse-opt';
    btn.textContent = opt.text;
    btn.addEventListener('click', () => {
      opts.querySelectorAll('.pulse-opt').forEach((b) => { b.disabled = true; b.classList.remove('correct', 'wrong'); });
      if (opt.correct) {
        btn.classList.add('correct');
        result.textContent = `✓ 정답! ${data.explain} — 1등급 궤도 +1`;
        result.style.color = '#00E5A8';
        if (typeof gsap !== 'undefined') {
          gsap.from(btn, { scale: 1.15, duration: 0.4, ease: 'back.out(3)' });
        }
      } else {
        btn.classList.add('wrong');
        [...opts.children].forEach((b, i) => { if (data.options[i].correct) b.classList.add('correct'); });
        result.textContent = `약한 별 발견 → ${data.weak}`;
        result.style.color = '#FF6B7A';
        burst?.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.from('#pulseArena', { x: -8, duration: 0.05, repeat: 5, yoyo: true });
        }
        setTimeout(() => burst?.classList.remove('active'), 1000);
      }
    });
    opts.appendChild(btn);
  });
}

document.querySelectorAll('.pulse-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pulse-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    renderQuiz(tab.dataset.subject);
    if (typeof gsap !== 'undefined') gsap.from('#pulseArena', { rotateY: 10, duration: 0.5, ease: 'power2.out' });
  });
});
renderQuiz('math');

document.getElementById('ctaBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (typeof gsap === 'undefined') return;
  gsap.to('#singularityHole', { scale: 3, opacity: 0, duration: 1, ease: 'power2.in' });
  gsap.from('.sing-logo', { scale: 2, rotation: 360, duration: 0.8, ease: 'back.out(2)' });
});
