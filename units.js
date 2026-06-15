/* Pullit 27단원 — 수능 수학 커리큘럼 기반 */
export const CURRICULUM = {
  math1: {
    label: '수학Ⅰ',
    sub: '공통 11문항',
    color: '#5B5BF0',
    units: [
      { id: 'm1-01', name: '지수와 로그', state: 'g' },
      { id: 'm1-02', name: '지수함수', state: 'g' },
      { id: 'm1-03', name: '로그함수', state: 'y' },
      { id: 'm1-04', name: '삼각함수', state: 'r' },
      { id: 'm1-05', name: '등차수열', state: 'g' },
      { id: 'm1-06', name: '등비수열', state: 'y' },
      { id: 'm1-07', name: '수열의 합', state: 'g' },
      { id: 'm1-08', name: '수학적 귀납법', state: 'y' },
      { id: 'm1-09', name: '수열 응용', state: 'g' },
    ],
  },
  math2: {
    label: '수학Ⅱ',
    sub: '공통 11문항',
    color: '#00E5A8',
    units: [
      { id: 'm2-01', name: '함수의 극한', state: 'y' },
      { id: 'm2-02', name: '함수의 연속', state: 'g' },
      { id: 'm2-03', name: '미분계수·도함수', state: 'r' },
      { id: 'm2-04', name: '도함수 활용', state: 'r' },
      { id: 'm2-05', name: '방정식·부등식', state: 'y' },
      { id: 'm2-06', name: '속도와 가속도', state: 'g' },
      { id: 'm2-07', name: '부정적분', state: 'y' },
      { id: 'm2-08', name: '정적분', state: 'g' },
      { id: 'm2-09', name: '넓이', state: 'y' },
      { id: 'm2-10', name: '속도와 거리', state: 'g' },
    ],
  },
};

export const ELECTIVES = {
  prob: {
    label: '확률과 통계',
    sub: '선택 8문항',
    color: '#FF6B7A',
    units: [
      { id: 'e-01', name: '순열과 조합', state: 'g' },
      { id: 'e-02', name: '확률', state: 'y' },
      { id: 'e-03', name: '조건부 확률', state: 'g' },
      { id: 'e-04', name: '이항분포', state: 'r' },
      { id: 'e-05', name: '정규분포', state: 'y' },
      { id: 'e-06', name: '표본조사', state: 'g' },
      { id: 'e-07', name: '모평균의 추정', state: 'y' },
      { id: 'e-08', name: '통계 종합', state: 'g' },
    ],
  },
  calc: {
    label: '미적분',
    sub: '선택 8문항',
    color: '#8B5CF6',
    units: [
      { id: 'e-01', name: '수열의 극한', state: 'y' },
      { id: 'e-02', name: '급수', state: 'g' },
      { id: 'e-03', name: '지수·로그 미분', state: 'g' },
      { id: 'e-04', name: '삼각함수 미분', state: 'r' },
      { id: 'e-05', name: '도함수 활용', state: 'y' },
      { id: 'e-06', name: '부정적분', state: 'g' },
      { id: 'e-07', name: '정적분', state: 'y' },
      { id: 'e-08', name: '적분 활용', state: 'g' },
    ],
  },
  geo: {
    label: '기하',
    sub: '선택 8문항',
    color: '#F59E0B',
    units: [
      { id: 'e-01', name: '이차곡선', state: 'r' },
      { id: 'e-02', name: '평면벡터 연산', state: 'y' },
      { id: 'e-03', name: '평면벡터 내적', state: 'g' },
      { id: 'e-04', name: '공간도형', state: 'g' },
      { id: 'e-05', name: '공간좌표', state: 'y' },
      { id: 'e-06', name: '벡터방정식', state: 'g' },
      { id: 'e-07', name: '공간벡터', state: 'g' },
      { id: 'e-08', name: '기하 종합', state: 'y' },
    ],
  },
};

export function getAllUnits(electiveKey = 'prob') {
  return [
    ...CURRICULUM.math1.units.map(u => ({ ...u, track: 'math1', trackLabel: '수학Ⅰ' })),
    ...CURRICULUM.math2.units.map(u => ({ ...u, track: 'math2', trackLabel: '수학Ⅱ' })),
    ...ELECTIVES[electiveKey].units.map(u => ({
      ...u,
      track: 'elective',
      trackLabel: ELECTIVES[electiveKey].label,
    })),
  ];
}
