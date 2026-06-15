import { CURRICULUM, ELECTIVES, getAllUnits } from '/units.js';

const STORAGE_KEY = 'pullit-demo-v1';
const SCORE = { r: 35, y: 55, g: 80 };

let questions = [];
let state = null;
let solvingIndex = null;

const $ = (sel) => document.querySelector(sel);

function defaultScores(elective = 'prob') {
  const scores = {};
  getAllUnits(elective).forEach((u) => {
    scores[u.id] = SCORE[u.state] ?? 50;
  });
  scores['eng-vocab'] = 45;
  scores['eng-blank'] = 52;
  return scores;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    elective: 'prob',
    streak: 3,
    scores: defaultScores('prob'),
    today: null,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function scoreToLevel(s) {
  if (s < 45) return 'r';
  if (s < 70) return 'y';
  return 'g';
}

function getWeakestMathIds(n = 5) {
  return getAllUnits(state.elective)
    .map((u) => ({
      id: u.id,
      name: u.name,
      trackLabel: u.trackLabel,
      score: state.scores[u.id] ?? 50,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, n);
}

function pickQuestion(subject, unitId, used) {
  const pool = questions.filter((q) => q.subject === subject && !used.has(q.id));
  if (unitId) {
    const match = pool.find((q) => q.unitId === unitId);
    if (match) return match;
  }
  return pool[Math.floor(Math.random() * pool.length)] || questions.find((q) => q.subject === subject);
}

function buildToday() {
  const weak = getWeakestMathIds(4);
  const used = new Set();
  const slots = [];

  const m1 = pickQuestion('math', weak[0]?.id, used);
  if (m1) { used.add(m1.id); slots.push({ q: m1, reason: '어제 약점 단원' }); }

  const eng = pickQuestion('eng', null, used);
  if (eng) { used.add(eng.id); slots.push({ q: eng, reason: '영어 약점 케어' }); }

  const m2 = pickQuestion('math', weak[1]?.id, used);
  if (m2) { used.add(m2.id); slots.push({ q: m2, reason: '복습 추천' }); }

  return {
    date: todayKey(),
    slots: slots.map((s) => ({
      qId: s.q.id,
      reason: s.reason,
      done: false,
      correct: null,
    })),
  };
}

function ensureToday() {
  if (!state.today || state.today.date !== todayKey()) {
    state.today = buildToday();
    saveState();
  }
}

function getTomorrowPreview() {
  const weak = getWeakestMathIds(3);
  const labels = weak.map((w) => w.name);
  labels.push('영어 · 빈칸추론');
  return labels.slice(0, 3);
}

function showView(name) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  const id = name === 'home' ? 'viewHome' : name === 'solve' ? 'viewSolve' : 'viewMap';
  document.getElementById(id)?.classList.add('active');
  document.querySelectorAll('.tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.go === name);
  });
  const tabHome = document.getElementById('tabHome');
  if (tabHome) tabHome.style.display = name === 'home' ? 'flex' : 'none';
  if (name === 'map') renderMap();
  if (name === 'home') renderHome();
}

function renderHome() {
  ensureToday();
  const { slots } = state.today;
  const done = slots.filter((s) => s.done).length;
  const allDone = done === slots.length;

  $('#streak').textContent = `🔥 ${state.streak}일`;
  $('#dayProgress').style.width = `${(done / 3) * 100}%`;
  $('#progressLabel').textContent = `${done} / 3`;
  $('#homeSub').textContent = allDone
    ? '오늘 완료! 내일 새 문제가 준비돼요'
    : '수학 2 · 영어 1 · 약 10분';

  const list = $('#dailyList');
  list.innerHTML = '';
  const nextIdx = slots.findIndex((s) => !s.done);

  slots.forEach((slot, i) => {
    const q = questions.find((x) => x.id === slot.qId);
    if (!q) return;
    const isNext = i === nextIdx;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'daily-card';
    if (slot.done) btn.classList.add('done');
    else if (isNext) btn.classList.add('active');
    if (!isNext && !slot.done) btn.disabled = true;

    const subj = q.subject === 'eng' ? 'eng' : 'math';
    btn.innerHTML = `
      <span class="daily-num">${slot.done ? '✓' : i + 1}</span>
      <div class="daily-info">
        <span class="daily-badge ai">AI 추천</span>
        <span class="daily-badge ${subj}">${subj === 'eng' ? '영어' : '수학'}</span>
        <span class="daily-unit">${q.unitLabel}</span>
        <span class="daily-reason">${slot.reason}</span>
      </div>
      <span class="daily-status ${slot.done ? 'ok' : isNext ? 'go' : 'lock'}">
        ${slot.done ? (slot.correct ? '정답' : '복습') : isNext ? '풀기 →' : '대기'}
      </span>
    `;
    if (isNext) btn.addEventListener('click', () => openSolve(i));
    list.appendChild(btn);
  });

  const weak = getWeakestMathIds(4);
  const chips = $('#weakChips');
  chips.innerHTML = '';
  weak.forEach((w) => {
    const el = document.createElement('span');
    el.className = `chip ${scoreToLevel(w.score)}`;
    el.textContent = w.name;
    chips.appendChild(el);
  });

  if ((state.scores['eng-vocab'] ?? 50) < 50) {
    const el = document.createElement('span');
    el.className = 'chip y';
    el.textContent = '영어 · 어휘';
    chips.appendChild(el);
  }

  const tomorrowBox = $('#tomorrowBox');
  tomorrowBox.hidden = !allDone;
  if (allDone) {
    const tc = $('#tomorrowChips');
    tc.innerHTML = '';
    getTomorrowPreview().forEach((label) => {
      const el = document.createElement('span');
      el.className = 'chip';
      el.style.borderColor = 'rgba(0,229,168,.25)';
      el.style.color = 'var(--pull-mint)';
      el.textContent = label;
      tc.appendChild(el);
    });
  }
}

function openSolve(index) {
  solvingIndex = index;
  const slot = state.today.slots[index];
  const q = questions.find((x) => x.id === slot.qId);
  if (!q) return;

  $('#solveMeta').textContent = q.unitLabel;
  $('#solveCount').textContent = `${index + 1} / 3`;
  $('#solveQ').textContent = q.q;
  $('#solveFeedback').hidden = true;

  const opts = $('#solveOpts');
  opts.innerHTML = '';
  q.options.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'solve-opt';
    btn.textContent = text;
    btn.addEventListener('click', () => answer(i, q));
    opts.appendChild(btn);
  });

  showView('solve');
}

function answer(choice, q) {
  const correct = choice === q.answer;
  const opts = $('#solveOpts').querySelectorAll('.solve-opt');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    if (i === choice && !correct) btn.classList.add('wrong');
  });

  const uid = q.unitId;
  if (state.scores[uid] != null) {
    state.scores[uid] = correct
      ? Math.min(100, state.scores[uid] + 8)
      : Math.max(0, state.scores[uid] - 12);
  }

  const slot = state.today.slots[solvingIndex];
  slot.done = true;
  slot.correct = correct;
  saveState();

  const fb = $('#solveFeedback');
  fb.hidden = false;
  fb.className = `solve-feedback ${correct ? 'ok' : 'no'}`;
  fb.textContent = correct
    ? `✓ ${q.explain}`
    : `약점 기록 · ${q.unitLabel}`;

  setTimeout(() => {
    showView('home');
    solvingIndex = null;
  }, correct ? 1200 : 1800);
}

function renderMap() {
  const units = getAllUnits(state.elective);
  let r = 0, y = 0, g = 0;
  units.forEach((u) => {
    const lv = scoreToLevel(state.scores[u.id] ?? 50);
    if (lv === 'r') r++;
    else if (lv === 'y') y++;
    else g++;
  });

  $('#mapStats').innerHTML = `
    <div class="map-stat r"><span>${r}</span><small>약함</small></div>
    <div class="map-stat y"><span>${y}</span><small>보통</small></div>
    <div class="map-stat g"><span>${g}</span><small>마스터</small></div>
  `;

  const tracks = $('#mapTracks');
  tracks.innerHTML = '';

  [
    { key: 'math1', label: '수학Ⅰ' },
    { key: 'math2', label: '수학Ⅱ' },
    { key: 'elective', label: ELECTIVES[state.elective].label },
  ].forEach(({ key, label }) => {
    const block = document.createElement('div');
    block.className = 'map-track';
    block.innerHTML = `<div class="map-track-head">${label}</div>`;
    const list = key === 'elective'
      ? ELECTIVES[state.elective].units
      : CURRICULUM[key].units;
    list.forEach((u) => {
      const sc = state.scores[u.id] ?? 50;
      const lv = scoreToLevel(sc);
      const row = document.createElement('div');
      row.className = `map-unit ${lv}`;
      row.innerHTML = `
        <span class="map-dot"></span>
        <span class="map-unit-name">${u.name}</span>
        <span class="map-unit-score">${sc}%</span>
      `;
      block.appendChild(row);
    });
    tracks.appendChild(block);
  });
}

function nextDay() {
  state.streak += 1;
  state.today = buildToday();
  saveState();
  renderHome();
}

async function init() {
  if (new URLSearchParams(location.search).has('reset')) {
    localStorage.removeItem(STORAGE_KEY);
    location.href = '/demo/';
    return;
  }

  try {
    const res = await fetch('/demo/data/questions.json');
    if (!res.ok) throw new Error('questions load failed');
    questions = await res.json();
    state = loadState();
    ensureToday();
    renderHome();

    document.querySelectorAll('[data-go]').forEach((el) => {
      el.addEventListener('click', () => showView(el.dataset.go));
    });
    $('#btnBack')?.addEventListener('click', () => showView('home'));
    $('#btnNextDay')?.addEventListener('click', nextDay);
  } catch (err) {
    console.error(err);
    const list = $('#dailyList');
    if (list) {
      list.innerHTML = '<p style="color:#ff6b7a;padding:20px;text-align:center">데이터를 불러오지 못했습니다.<br><a href="/demo/?reset=1" style="color:#00e5a8">새로고침</a></p>';
    }
  }
}

init();
