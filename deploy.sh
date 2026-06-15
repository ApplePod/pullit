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
REPO_URL="${1:-https://github.com/ApplePod/pullit.git}"
if ! git remote get-url origin &>/dev/null; then
  git remote add origin "$REPO_URL"
fi
git remote set-url origin "$REPO_URL"
echo "GitHub push: $REPO_URL"
git push -u origin main

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
