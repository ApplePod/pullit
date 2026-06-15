# Pullit 풀잇 — 사이트 & 브랜드 패키지

## 📁 구조

```
pullit-site/
├── index.html              ← 메인 랜딩 (학생 + B2G)
├── brand.html              ← 브랜드 가이드 시각화 페이지
├── styles.css              ← UI 스타일
├── app.js                  ← 체험 퀴즈 · 모바일 메뉴
├── export_assets.py        ← PNG보내기 (선택)
└── brand/
    ├── BRAND_GUIDE.md      ← 브랜드 가이드 문서
    ├── tokens.css          ← 디자인 토큰
    ├── logo-mark.svg       ← 앱 아이콘 · 파비콘
    ├── logo-full.svg       ← Pullit (Pull+it)
    ├── logo-full-ko.svg    ← Pullit 풀잇
    ├── favicon.svg
    └── og-image.svg        ← SNS 공유 1200×630
```

## 🎨 브랜드 요약

| 항목 | 내용 |
|------|------|
| **이름** | Pullit (풀잇) |
| **슬로건** | Pull your weak spots. Three a day. |
| **한 줄** | 매일 3문제, 약한 수학·영어만 |
| **로고** | 3색 막대(🔴🟡🟢) + → 화살표 |
| **메인 컬러** | Pull Indigo `#5B5BF0` · Mint `#00E5A8` |

## 🖥 미리보기

```bash
cd pullit-site
python3 -m http.server 8080
# http://localhost:8080          → 랜딩
# http://localhost:8080/brand.html → 브랜드 가이드
```

또는 `index.html` 더블클릭

## 📦 제출·배포 시

1. **앱스토어** → `brand/logo-mark.svg` (512px PNG 변환)
2. **웹 파비콘** → `brand/favicon.svg` (이미 연결됨)
3. **SNS 공유** → `brand/og-image.svg`
4. **B2G 제안서** → `brand/logo-full-ko.svg`
5. **IR·투자** → `brand/BRAND_GUIDE.md`

PNG 변환:
```bash
pip install cairosvg
python3 export_assets.py
```

## 🔗 페이지

| URL | 용도 |
|-----|------|
| `/` | 서비스 랜딩 |
| `/brand.html` | 로고·컬러·톤 가이드 |

---
© 2026 Neuronsoft · Pullit v1.0
