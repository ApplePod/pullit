// Nav
document.getElementById('navToggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('open');
});

// 27단원 약점 지도 (데모)
const mapEl = document.getElementById('weakMap');
if (mapEl) {
  const states = ['g','g','y','r','r','y','g','g','y','r','y','g','g','y','r','g','y','g','r','r','y','g','g','y','g','r','y'];
  states.forEach((s) => {
    const cell = document.createElement('div');
    cell.className = `weak-cell ${s}`;
    mapEl.appendChild(cell);
  });
  // 주기적으로 랜덤 셀 깜빡임
  setInterval(() => {
    const cells = mapEl.querySelectorAll('.weak-cell');
    const i = Math.floor(Math.random() * cells.length);
    cells[i]?.classList.toggle('r');
    setTimeout(() => cells[i]?.classList.toggle('r'), 400);
  }, 2000);
}

// 라이브 카운터 (바이럴 느낌)
const liveEl = document.getElementById('liveCount');
if (liveEl) {
  let n = 2847;
  setInterval(() => {
    n += Math.floor(Math.random() * 5) - 1;
    if (n < 2800) n = 2800;
    liveEl.textContent = n.toLocaleString();
  }, 3000);
}

// Demo quiz
const quizData = {
  math: {
    meta: '이차함수 · 난이도 2',
    q: 'x² − 5x + 6 = 0 의 두 근의 합은?',
    options: [
      { text: '3', correct: false },
      { text: '5', correct: true },
      { text: '6', correct: false },
      { text: '−5', correct: false },
    ],
    explain: '근과 계수의 관계 → 합 = 5',
    weak: '이차함수 › 판별식',
  },
  eng: {
    meta: '독해 · 난이도 2',
    q: '"abundant"와 가장 가까운 뜻은?',
    options: [
      { text: 'scarce', correct: false },
      { text: 'plentiful', correct: true },
      { text: 'narrow', correct: false },
      { text: 'silent', correct: false },
    ],
    explain: 'abundant = plentiful',
    weak: '어휘 › 동의어',
  },
};

function renderQuiz(subject) {
  const data = quizData[subject];
  document.querySelector('.quiz-meta').textContent = data.meta;
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
      opts.querySelectorAll('.quiz-opt').forEach((b) => {
        b.disabled = true;
        b.classList.remove('correct', 'wrong');
      });
      if (opt.correct) {
        btn.classList.add('correct');
        result.textContent = `✓ 정답! ${data.explain}`;
        result.style.color = '#00E5A8';
      } else {
        btn.classList.add('wrong');
        const correctBtn = [...opts.children].find((b, i) => data.options[i].correct);
        correctBtn?.classList.add('correct');
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
