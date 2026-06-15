/* ─── LOADER ─── */
import { CURRICULUM, ELECTIVES, getAllUnits } from './units.js';

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
  gsap.from('.impact-sub, .impact-subjects, .impact-actions', { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, delay: 0.7 });
  gsap.from('.impact-footer > *', { opacity: 0, y: 20, stagger: 0.12, duration: 0.7, delay: 0.95 });

  gsap.to('.l-front', {
    rotateY: 8, rotateX: -5, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1,
  });
}

/* ─── GALAXY / CURRICULUM MAP ─── */
const RING = { math1: 27, math2: 37, elective: 47 };
const STATE_LABEL = { r: '약함', y: '보통', g: '마스터' };

let currentElective = 'prob';
let nodes = [];
let revealedCount = 0;

const galaxyNodes = document.getElementById('galaxyNodes');

function placeOnRing(count, index, radiusPct) {
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + Math.cos(angle) * radiusPct,
    y: 50 + Math.sin(angle) * radiusPct,
  };
}

function createMapNode(unit, pos) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `g-node ${unit.state} hidden`;
  el.style.left = pos.x + '%';
  el.style.top = pos.y + '%';
  el.dataset.id = unit.id;
  el.dataset.track = unit.track;
  el.innerHTML = `<span class="g-dot"></span><span class="g-label">${unit.name}</span>`;
  el.addEventListener('mouseenter', () => highlightUnit(unit.id));
  el.addEventListener('focus', () => highlightUnit(unit.id));
  el.addEventListener('mouseleave', () => clearHighlight());
  el.addEventListener('blur', () => clearHighlight());
  el.addEventListener('click', () => showUnitAlert(unit));
  return el;
}

function buildMapNodes() {
  if (!galaxyNodes) return;
  galaxyNodes.innerHTML = '';
  nodes = [];

  const all = getAllUnits(currentElective);
  const groups = [
    { key: 'math1', items: all.filter(u => u.track === 'math1'), r: RING.math1 },
    { key: 'math2', items: all.filter(u => u.track === 'math2'), r: RING.math2 },
    { key: 'elective', items: all.filter(u => u.track === 'elective'), r: RING.elective },
  ];

  groups.forEach(({ items, r }) => {
    items.forEach((unit, i) => {
      const pos = placeOnRing(items.length, i, r);
      const el = createMapNode(unit, pos);
      galaxyNodes.appendChild(el);
      nodes.push({ el, ...unit, state: unit.state });
    });
  });

  applyReveal(revealedCount);
  updateHud();
  syncListHighlights();
}

function renderUnitList(containerId, units) {
  const list = document.getElementById(containerId);
  if (!list) return;
  list.innerHTML = '';
  units.forEach((unit) => {
    const li = document.createElement('li');
    li.className = `unit-item ${unit.state}`;
    li.dataset.id = unit.id;
    li.innerHTML = `
      <span class="ui-dot"></span>
      <span class="ui-name">${unit.name}</span>
      <span class="ui-state">${STATE_LABEL[unit.state]}</span>
    `;
    li.addEventListener('mouseenter', () => highlightUnit(unit.id));
    li.addEventListener('mouseleave', () => clearHighlight());
    li.addEventListener('click', () => showUnitAlert({ ...unit, trackLabel: containerId === 'listElective' ? ELECTIVES[currentElective].label : containerId === 'listMath1' ? '수학Ⅰ' : '수학Ⅱ' }));
    list.appendChild(li);
  });
}

function renderSidebar() {
  renderUnitList('listMath1', CURRICULUM.math1.units);
  renderUnitList('listMath2', CURRICULUM.math2.units);
  renderUnitList('listElective', ELECTIVES[currentElective].units);
  const zoneLabel = document.getElementById('electiveZoneLabel');
  if (zoneLabel) zoneLabel.textContent = ELECTIVES[currentElective].label;
  const zone = document.getElementById('electiveZone');
  if (zone) zone.style.setProperty('--el-color', ELECTIVES[currentElective].color || '#FF6B7A');
}

function applyReveal(count) {
  revealedCount = count;
  nodes.forEach((n, i) => {
    n.el.classList.toggle('hidden', i >= count);
  });
  document.querySelectorAll('.unit-item').forEach((li, i) => {
    li.classList.toggle('hidden-item', i >= count);
  });
  updateHud();
}

function updateHud() {
  const visible = nodes.filter(n => !n.el.classList.contains('hidden'));
  const r = visible.filter(n => n.state === 'r').length;
  const y = visible.filter(n => n.state === 'y').length;
  const g = visible.filter(n => n.state === 'g').length;
  document.getElementById('hudRed').textContent = r;
  document.getElementById('hudYellow').textContent = y;
  document.getElementById('hudGreen').textContent = g;
  const total = document.getElementById('hudTotal');
  if (total) total.textContent = visible.length;
}

function highlightUnit(id) {
  document.querySelectorAll('.g-node, .unit-item').forEach(el => {
    el.classList.toggle('highlight', el.dataset.id === id);
  });
}

function clearHighlight() {
  document.querySelectorAll('.g-node.highlight, .unit-item.highlight').forEach(el => {
    el.classList.remove('highlight');
  });
}

function syncListHighlights() {
  /* lists already wired */
}

function showUnitAlert(unit) {
  const alert = document.getElementById('galaxyAlert');
  const concept = document.getElementById('alertConcept');
  const hint = document.getElementById('alertHint');
  const track = unit.trackLabel || (unit.track === 'math1' ? '수학Ⅰ' : unit.track === 'math2' ? '수학Ⅱ' : ELECTIVES[currentElective].label);
  if (concept) concept.textContent = `${track} › ${unit.name}`;
  if (hint) {
    hint.textContent = unit.state === 'r'
      ? '내일 3문제 중 1개로 추천됩니다'
      : unit.state === 'y'
        ? '복습 주기에 포함됩니다'
        : '1등급 궤도 유지 중';
  }
  alert?.classList.add('show');
}

function switchElective(key) {
  currentElective = key;
  document.querySelectorAll('.el-tab').forEach(t => t.classList.toggle('active', t.dataset.el === key));
  buildMapNodes();
  renderSidebar();
  if (typeof gsap !== 'undefined') {
    gsap.from('#listElective .unit-item:not(.hidden-item)', { opacity: 0, x: 12, stagger: 0.04, duration: 0.4 });
    gsap.from('.g-node:not(.hidden)', { scale: 0, stagger: 0.03, duration: 0.35, ease: 'back.out(2)' });
  }
}

document.querySelectorAll('.el-tab').forEach(tab => {
  tab.addEventListener('click', () => switchElective(tab.dataset.el));
});

buildMapNodes();
renderSidebar();

/* first weak unit for default alert */
const defaultWeak = getAllUnits('prob').find(u => u.state === 'r');
if (defaultWeak) {
  setTimeout(() => showUnitAlert({ ...defaultWeak, trackLabel: defaultWeak.track === 'math2' ? '수학Ⅱ' : '수학Ⅰ' }), 500);
}

/* ─── TUNNEL TEXT ─── */
const tunnelWords = ['수학Ⅰ', '수학Ⅱ', '확통', '미적', '기하', '27단원', '1등급', '3문제', '매일', '분석', 'Pullit'];
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
        const revealCount = Math.min(27, Math.floor(self.progress * 27) + 1);
        applyReveal(revealCount);
        if (self.progress > 0.65) {
          const weak = nodes.find(n => n.state === 'r' && !n.el.classList.contains('hidden'));
          if (weak) showUnitAlert(weak);
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
    meta: '수학Ⅱ · 도함수 활용',
    q: '함수 f(x) = x³ − 3x + 1 이 극대를 갖는 x 값은?',
    options: [
      { text: '−1', correct: false },
      { text: '0', correct: false },
      { text: '1', correct: true },
      { text: '2', correct: false },
    ],
    explain: "f'(x) = 3x² − 3 = 0 → x = ±1, 극대는 x = 1",
    weak: '수학Ⅱ › 도함수 활용',
  },
  eng: {
    meta: '영어 · 빈칸 추론',
    q: '"abundant"와 가장 가까운 뜻은?',
    options: [
      { text: 'scarce', correct: false },
      { text: 'plentiful', correct: true },
      { text: 'narrow', correct: false },
      { text: 'silent', correct: false },
    ],
    explain: 'abundant = plentiful (풍부한)',
    weak: '영어 › 어휘',
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
        result.textContent = `약점 단원 기록 → ${data.weak}`;
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
