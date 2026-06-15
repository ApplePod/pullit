// Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

// Demo quiz
const quizData = {
  math: {
    meta: '[수학] 이차함수 · 난이도 2',
    q: '이차방정식 x² − 5x + 6 = 0의 두 근의 합은?',
    options: [
      { text: '3', correct: false },
      { text: '5', correct: true },
      { text: '6', correct: false },
      { text: '−5', correct: false },
    ],
    explain: '근과 계수의 관계: 두 근의 합 = 5',
  },
  eng: {
    meta: '[영어] 독해 · 난이도 2',
    q: 'Choose the word closest in meaning to "abundant".',
    options: [
      { text: 'scarce', correct: false },
      { text: 'plentiful', correct: true },
      { text: 'narrow', correct: false },
      { text: 'silent', correct: false },
    ],
    explain: 'abundant = plentiful (풍부한)',
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
        result.textContent = '✓ 정답! ' + data.explain;
        result.style.color = '#3dd68c';
      } else {
        btn.classList.add('wrong');
        const correctBtn = [...opts.children].find((b, i) => data.options[i].correct);
        correctBtn?.classList.add('correct');
        result.textContent = '오답 — 약점 지도에 기록됨 (데모)';
        result.style.color = '#ff6b7a';
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
