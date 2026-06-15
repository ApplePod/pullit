document.getElementById('navToggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('open');
});

const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

const phone = document.getElementById('phone3d');
const stage = document.getElementById('phoneStage');
if (phone && stage && window.matchMedia('(pointer: fine)').matches) {
  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    phone.style.transform = `rotateY(${-8 + x * 25}deg) rotateX(${5 - y * 20}deg) translateZ(20px)`;
  });
  stage.addEventListener('mouseleave', () => {
    phone.style.transform = 'rotateY(-8deg) rotateX(5deg) translateZ(0)';
  });
}

const mapEl = document.getElementById('weakMap3d');
if (mapEl) {
  const states = ['g','g','y','r','r','y','g','g','y','r','y','g','g','y','r','g','y','g','r','r','y','g','g','y','g','r','y'];
  states.forEach((s) => {
    const cell = document.createElement('div');
    cell.className = `map-cell ${s}`;
    mapEl.appendChild(cell);
  });
  setInterval(() => {
    const cells = mapEl.querySelectorAll('.map-cell');
    const i = Math.floor(Math.random() * cells.length);
    const c = cells[i];
    c.classList.add('r');
    c.style.transform = 'translateZ(20px)';
    setTimeout(() => { c.classList.remove('r'); c.style.transform = ''; }, 600);
  }, 1800);
}

const liveEl = document.getElementById('liveCount');
if (liveEl) {
  let n = 2847;
  setInterval(() => {
    n += Math.floor(Math.random() * 7) - 2;
    if (n < 2800) n = 2800;
    liveEl.textContent = n.toLocaleString();
  }, 2500);
}

document.querySelectorAll('.magnetic').forEach((btn) => {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.2}px, ${(e.clientY - rect.top - rect.height / 2) * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 50, rotateX: 15 }, {
      opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    });
  });
  gsap.from('.hero-content > *', { opacity: 0, y: 40, stagger: 0.12, duration: 1, ease: 'power3.out', delay: 0.3 });
  gsap.utils.toArray('.sc-num[data-count]').forEach((el) => {
    const target = +el.dataset.count;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to({ val: 0 }, {
        val: target, duration: 1.5, ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(this.targets()[0].val); },
      }),
    });
  });
  gsap.from('.pipe-sphere', {
    scale: 0, rotationY: 180, stagger: 0.2, duration: 1, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.pipeline-3d', start: 'top 75%' },
  });
}

const quizData = {
  math: {
    meta: '이차함수 · Lv.2',
    q: 'x² − 5x + 6 = 0 의 두 근의 합은?',
    options: [{ text: '3', correct: false }, { text: '5', correct: true }, { text: '6', correct: false }, { text: '−5', correct: false }],
    explain: '근과 계수의 관계 → 합 = 5', weak: '이차함수 › 판별식',
  },
  eng: {
    meta: '독해 · Lv.2',
    q: '"abundant"와 가장 가까운 뜻은?',
    options: [{ text: 'scarce', correct: false }, { text: 'plentiful', correct: true }, { text: 'narrow', correct: false }, { text: 'silent', correct: false }],
    explain: 'abundant = plentiful', weak: '어휘 › 동의어',
  },
};

function renderQuiz(subject) {
  const data = quizData[subject];
  const metaEl = document.getElementById('quizMeta');
  if (metaEl) metaEl.textContent = data.meta;
  document.getElementById('quizQ').textContent = data.q;
  const result = document.getElementById('quizResult');
  result.textContent = '';
  result.style.color = '';
  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  data.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt.text;
    btn.addEventListener('click', () => {
      opts.querySelectorAll('.quiz-opt').forEach((b) => { b.disabled = true; b.classList.remove('correct', 'wrong'); });
      if (opt.correct) {
        btn.classList.add('correct');
        result.textContent = `✓ 정답! ${data.explain}`;
        result.style.color = '#00E5A8';
        if (typeof gsap !== 'undefined') gsap.from(btn, { scale: 1.1, duration: 0.3 });
      } else {
        btn.classList.add('wrong');
        [...opts.children].find((b, i) => data.options[i].correct)?.classList.add('correct');
        result.textContent = `오답 → 약점 기록: ${data.weak} 🔴`;
        result.style.color = '#FF6B7A';
      }
    });
    opts.appendChild(btn);
  });
}

document.querySelectorAll('.demo-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.demo-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    renderQuiz(tab.dataset.subject);
  });
});
renderQuiz('math');

const track = document.querySelector('.review-track');
if (track) track.innerHTML += track.innerHTML;
