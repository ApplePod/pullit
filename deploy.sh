#!/bin/bash
# Pullit 사이트 — GitHub + Vercel 배포 스크립트
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "=== Pullit 배포 ==="

# 1. GitHub CLI 로그인 확인
if ! gh auth status &>/dev/null; then
  echo ""
  echo "GitHub 로그인이 필요합니다. 브라우저가 열리면 승인해주세요."
  gh auth login --hostname github.com --git-protocol https --web
fi

# 2. GitHub 저장소 생성 & 푸시
REPO_NAME="${1:-pullit-site}"
if ! git remote get-url origin &>/dev/null; then
  echo "GitHub 저장소 생성: $REPO_NAME"
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push --description "Pullit 풀잇 — 매일 3문제 학습 앱 랜딩"
else
  echo "기존 remote push"
  git push -u origin HEAD
fi

echo ""
echo "GitHub: $(gh repo view --json url -q .url)"

# 3. Vercel 배포
if ! command -v vercel &>/dev/null; then
  echo "Vercel CLI 설치 중..."
  npm install -g vercel
fi

if [ ! -f "$HOME/.vercel/auth.json" ] && [ ! -f "$HOME/Library/Application Support/com.vercel.cli/auth.json" ]; then
  echo ""
  echo "Vercel 로그인이 필요합니다."
  vercel login
fi

echo "Vercel 프로덕션 배포 중..."
vercel --prod --yes

echo ""
echo "✅ 배포 완료!"
echo "   GitHub: $(gh repo view --json url -q .url)"
echo "   Vercel: vercel ls 로 URL 확인"
