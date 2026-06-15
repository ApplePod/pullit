# Pullit 풀잇 — 사이트 & 브랜드

> **Pull your weak spots. Three a day.**

## 🌐 배포 (GitHub + Vercel)

### 한 번에 배포

```bash
cd pullit-site
./deploy.sh
```

1. GitHub 브라우저 로그인 (device code)
2. `pullit-site` public 저장소 생성 & push
3. Vercel 로그인 & 프로덕션 배포

### 수동 배포

#### 1. GitHub

```bash
cd pullit-site
gh auth login          # GitHub 로그인
git branch -M main
git remote add origin https://github.com/ApplePod/pullit.git
git push -u origin main
```

#### 2. Vercel (CLI)

```bash
npm install -g vercel
vercel login
vercel --prod          # pullit-site 폴더에서 실행
```

#### 3. Vercel (대시보드 — 추천)

1. [vercel.com/new](https://vercel.com/new) 접속
2. GitHub `pullit-site` 저장소 Import
3. Framework: **Other** (정적 HTML)
4. Deploy 클릭

→ 이후 `main` push마다 자동 배포

#### 4. GitHub Actions (선택)

Vercel 대시보드 → Settings → Tokens 에서 토큰 발급 후  
GitHub 저장소 Secrets에 추가:

| Secret | 값 |
|--------|-----|
| `VERCEL_TOKEN` | Vercel API 토큰 |
| `VERCEL_ORG_ID` | `vercel project ls` 또는 대시보드 |
| `VERCEL_PROJECT_ID` | 프로젝트 Settings |

---

## 📁 구조

```
pullit-site/
├── index.html          ← 메인 랜딩
├── brand.html          ← 브랜드 가이드
├── brand/              ← 로고·에셋
├── vercel.json         ← Vercel 설정
├── deploy.sh           ← 배포 스크립트
└── .github/workflows/  ← CI/CD (선택)
```

## 🖥 로컬 미리보기

```bash
python3 -m http.server 8080
# http://localhost:8080
```

---
© 2026 Neuronsoft · Pullit
