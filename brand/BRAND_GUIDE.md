# Pullit 풀잇 — Brand Identity Guide v1.0

> **Pull your weak spots. Three a day.**  
> 매일 3문제, 약한 수학·영어만

---

## 1. 브랜드 정의

| 항목 | 내용 |
|------|------|
| **브랜드명** | Pullit (풀잇) |
| **법인** | 주식회사 뉴런소프트 |
| **카테고리** | 수능형 학습 · 문제풀이 앱 |
| **한 줄** | 매일 3문제, 약한 수학·영어만 |
| **영문 슬로건** | Pull your weak spots. Three a day. |

### 브랜드 포지션
- **아닌 것**: 기출 무한 회독 앱, 매일 등급 보여주는 입시 앱, 학원용 모의고사
- **맞는 것**: 하루 3문제 습관 앱, 27단원 약점 진단 앱, MZ 톤의 풀이 앱

### 브랜드 퍼스널리티
| 키워드 | 설명 |
|--------|------|
| **Light** | 부담 없음 — 10분, 3문제 |
| **Honest** | 약점을 숨기지 않음 |
| **Smart** | Pass AI 검증, 데이터 기반 추천 |
| **Young** | MZ 말투, 친근한 UI (B2G는 별도 톤) |

---

## 2. 로고 시스템

### 로고 컨셉
**「3개의 막대 + 당기는 화살표」**
- 🔴🟡🟢 세 줄 = 하루 3문제 + 27단원 약점 지도 (취약→보통→숙련)
- → 화살표 = Pull it — 약점을 끌어올린다

### 파일
| 파일 | 용도 |
|------|------|
| `logo-mark.svg` | 앱 아이콘, 파비콘, SNS 프로필 |
| `logo-full.svg` | Pull**it** 워드마크 (영문) |
| `logo-full-ko.svg` | Pullit 풀잇 (한·영 병기) |
| `favicon.svg` | 웹 파비콘 32px |
| `og-image.svg` | SNS·링크 공유 1200×630 |

### 사용 규칙
- ✅ 최소 여백: 마크 높이의 25% 이상
- ✅ 배경: 다크 `#0B0D12` 또는 화이트 `#FFFFFF`
- ❌ 마크 비율 변경, 그라데이션 임의 변경
- ❌ 막대 색상 순서 변경 (빨→노→초 고정)
- ❌ "Pullit"을 "Pull It" / "풀 잇"으로 분리 표기 (워드마크 제외)

### 최소 크기
- 디지털 마크: 24px 이상
- 인쇄 마크: 10mm 이상

---

## 3. 컬러

### Primary
| 이름 | HEX | 용도 |
|------|-----|------|
| **Pull Indigo** | `#5B5BF0` | CTA, 브랜드 그라데이션 시작 |
| **Pull Violet** | `#8B5CF6` | 그라데이션 끝, 포인트 |

### Accent
| 이름 | HEX | 용도 |
|------|-----|------|
| **Pull Mint** | `#00E5A8` | "it" 워드마크, 성공, 개선 |
| **Pull Mint Dim** | `#22D3A6` | 보조 액센트 |

### Weakness Map (로고·앱 UI 고정)
| 이름 | HEX | 의미 |
|------|-----|------|
| **Weak Red** | `#FF6B7A` | 취약 개념 |
| **Mid Yellow** | `#FFC857` | 보통 |
| **Strong Green** | `#3DD68C` | 숙련 |

### Neutral (Dark UI 기본)
| 이름 | HEX | 용도 |
|------|-----|------|
| **BG Deep** | `#0B0D12` | 페이지 배경 |
| **BG Card** | `#1A1F2B` | 카드 |
| **Text Primary** | `#F4F6FB` | 본문 |
| **Text Muted** | `#9AA3B5` | 보조 |

### 그라데이션
```css
--gradient-brand: linear-gradient(135deg, #5B5BF0 0%, #8B5CF6 100%);
--gradient-hero: linear-gradient(135deg, #7DA0FF, #B794FF, #00E5A8);
```

---

## 4. 타이포그래피

| 용도 | 폰트 | 굵기 |
|------|------|------|
| 한·영 본문 | **Pretendard** | 400–600 |
| 헤드라인 | Pretendard | 700–800 |
| 영문 로고 | Pretendard | 800 |
| 숫자·통계 | Pretendard | 800 |

### 카피 톤
**학생-facing (앱·SNS)**
- 짧게, 행동 유도: "오늘 3개만 ㄱㄱ", "Let's go"
- 부담 제거: "10분이면 끝"

**B2G-facing (제안서·관리자)**
- 정중·명확: "매일 3문항 맞춤 학습", "취약 단원 리포트"

---

## 5. UI 컴포넌트

### 버튼
- **Primary**: Indigo→Violet 그라데이션, 흰 텍스트, radius 12px
- **Ghost**: border 1px rgba(255,255,255,.15)
- **Light** (B2G): white bg, dark text

### 카드
- 배경 `#1A1F2B`, border `rgba(255,255,255,.06)`, radius 16px

### 앱 UI 시그니처
- 오늘의 3문제 카드 스택
- 약점 배너 (🔴 요즘 제일 약한 곳)
- Streak 🔥

---

## 6. 보이스 & 메시지

### 핵심 메시지
1. 하루 3문제면 충분하다
2. 약한 단원·개념이 보인다
3. 풀면 풀수록 추천이 정교해진다
4. 수능 시즌에만 등급을 본다

### 금지 메시지 (일상)
- "1등급 보장"
- "AI가 문제 다 만듦" (→ "검증된 AI 문항")
- "모의고사 무제한"

---

## 7. 적용 예시

| 채널 | 로고 | 톤 |
|------|------|-----|
| 앱스토어 | logo-mark.svg | 학생 MZ |
| 웹사이트 | logo-full-ko.svg | 학생 + B2G |
| 자치구 제안서 | logo-full-ko (인쇄) | 공식 |
| SNS | og-image.svg | 캐주얼 |

---

## 8. 제품 패밀리

```
뉴런소프트 (Neuronsoft)
├── Pass AI      — B2B 문항 엔진 (기술)
├── PassNote     — 필기 데이터
└── Pullit 풀잇   — B2C/B2G 학생 앱 (브랜드)
```

**Pullit** = 학생이 만지는 유일한 브랜드. Pass는 뒤에서.

---

*© 2026 Neuronsoft Inc. — Internal brand guide*
