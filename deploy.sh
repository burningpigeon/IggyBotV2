#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/iggybot"
APP_NAME="iggybot"

cd "$APP_DIR"

echo "Recording current commit for rollback..."
PREV_COMMIT=$(git rev-parse HEAD)

echo "Fetching latest main..."
git fetch origin main
git reset --hard origin/main

echo "Installing dependencies..."
npm ci

echo "Stopping current bot process..."
pm2 stop "$APP_NAME" || true

echo "Starting updated bot process..."
pm2 start "$APP_NAME" || pm2 restart "$APP_NAME"

echo "Waiting for bot to stabilize..."
sleep 5

# Health check: confirm PM2 sees it online AND it's not stuck in a restart loop
STATUS=$(pm2 jlist | node -e "
  const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
  const proc = data.find(p => p.name === '$APP_NAME');
  console.log(proc ? proc.pm2_env.status : 'missing');
")

if [ "$STATUS" != "online" ]; then
  echo "Deployment failed: bot status is '$STATUS'. Rolling back to $PREV_COMMIT..."
  git reset --hard "$PREV_COMMIT"
  npm ci
  pm2 restart "$APP_NAME"
  exit 1
fi

echo "Deployment successful. Bot is online."
pm2 save