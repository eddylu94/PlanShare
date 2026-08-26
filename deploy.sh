#!/usr/bin/env bash
# Deploy PlanShare on the production droplet.
# Usage (from the repo root):
#   ./deploy.sh
#   ./deploy.sh --clean    # wipe node_modules and client/build before install
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

BRANCH="${DEPLOY_BRANCH:-master}"
CLIENT_PORT="${CLIENT_PORT:-36321}"
SERVER_PORT="${SERVER_PORT:-36322}"
CLEAN=0
if [[ "${1:-}" == "--clean" ]]; then
  CLEAN=1
fi

start_time="$(date +%s)"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  if [[ -f "$ROOT/.nvmrc" ]]; then
    nvm use
  fi
fi

echo "==> Pulling latest from origin/${BRANCH}"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/${BRANCH}"

if [[ "$CLEAN" -eq 1 ]]; then
  echo "==> Cleaning node_modules and client build"
  rm -rf "$ROOT/server/node_modules" "$ROOT/client/node_modules" "$ROOT/client/build"
fi

echo "==> Installing server dependencies"
(cd "$ROOT/server" && yarn install)

echo "==> Installing client dependencies"
(cd "$ROOT/client" && yarn install)

echo "==> Building client"
(cd "$ROOT/client" && yarn build)

echo "==> Restarting services"
if command -v pm2 >/dev/null 2>&1; then
  pm2 delete planshare-server >/dev/null 2>&1 || true
  pm2 delete planshare-client >/dev/null 2>&1 || true
fi
fuser -k "${SERVER_PORT}/tcp" >/dev/null 2>&1 || true
fuser -k "${CLIENT_PORT}/tcp" >/dev/null 2>&1 || true
sleep 1

if command -v pm2 >/dev/null 2>&1; then
  echo "==> Starting server with pm2"
  (cd "$ROOT/server" && pm2 start sh --name planshare-server -- -c "yarn start")
  echo "==> Starting client with pm2"
  (cd "$ROOT/client" && pm2 start sh --name planshare-client -- -c "serve -l ${CLIENT_PORT} -s build")
  pm2 save >/dev/null 2>&1 || true
else
  echo "==> Starting server with screen"
  screen -dm bash -c "cd '$ROOT/server' && yarn start"
  echo "==> Starting client with screen"
  screen -dm bash -c "cd '$ROOT/client' && serve -l ${CLIENT_PORT} -s build"
fi

end_time="$(date +%s)"
echo "Application deployed"
echo "Execution time: $((end_time - start_time)) seconds"
