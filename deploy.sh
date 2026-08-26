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
GITHUB_SSH_URL="git@github.com:eddylu94/PlanShare.git"
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

GITHUB_KEY="$HOME/.ssh/planshare_github"
SSH_CONFIG="$HOME/.ssh/config"
SSH_CONFIG_MARKER="# PlanShare GitHub deploy key"

mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"

# Never use ~/.ssh/id_rsa (that key has a passphrase). GitHub gets a
# dedicated passphrase-less deploy key, and IdentitiesOnly/BatchMode
# prevent ssh from offering other keys or prompting.
if [[ ! -f "$GITHUB_KEY" ]]; then
  echo "==> Creating passphrase-less GitHub deploy key at $GITHUB_KEY"
  ssh-keygen -t ed25519 -C "planshare-droplet" -f "$GITHUB_KEY" -N ""
fi

if ! ssh-keygen -y -f "$GITHUB_KEY" -P "" >/dev/null 2>&1; then
  cat <<EOF
ERROR: $GITHUB_KEY is encrypted with a passphrase, so git will keep prompting.

Recreate it with no passphrase:

  ssh-keygen -t ed25519 -C "planshare-droplet" -f $GITHUB_KEY -N ""
  cat ${GITHUB_KEY}.pub

Add the new public key at https://github.com/eddylu94/PlanShare/settings/keys
then re-run ./deploy.sh.
EOF
  exit 1
fi

export GIT_SSH_COMMAND="ssh -i $GITHUB_KEY -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=accept-new"

if [[ ! -f "$SSH_CONFIG" ]] || ! grep -qF "$SSH_CONFIG_MARKER" "$SSH_CONFIG"; then
  tmp="$(mktemp)"
  cat > "$tmp" <<EOF
$SSH_CONFIG_MARKER
Host github.com
  HostName github.com
  User git
  IdentityFile $GITHUB_KEY
  IdentitiesOnly yes

EOF
  if [[ -f "$SSH_CONFIG" ]]; then
    cat "$SSH_CONFIG" >> "$tmp"
  fi
  mv "$tmp" "$SSH_CONFIG"
  chmod 600 "$SSH_CONFIG"
  echo "==> Wrote ~/.ssh/config so github.com uses $GITHUB_KEY (not id_rsa)"
fi

origin_url="$(git remote get-url origin 2>/dev/null || true)"
if [[ "$origin_url" == *dev.azure.com* || "$origin_url" == *visualstudio.com* ]]; then
  echo "==> Switching origin from Azure DevOps to GitHub"
  git remote set-url origin "$GITHUB_SSH_URL"
  origin_url="$GITHUB_SSH_URL"
fi

ssh_auth="$(ssh -i "$GITHUB_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=accept-new -T git@github.com 2>&1 || true)"
if ! grep -qi "successfully authenticated" <<<"$ssh_auth"; then
  cat <<EOF
GitHub rejected $GITHUB_KEY. Add this public key as a deploy key, then re-run ./deploy.sh:

  https://github.com/eddylu94/PlanShare/settings/keys

$(cat "${GITHUB_KEY}.pub")

ssh said:
$ssh_auth
EOF
  exit 1
fi

echo "==> Pulling latest from origin/${BRANCH} ($origin_url)"
if ! git fetch origin "$BRANCH"; then
  cat <<'EOF'
git fetch failed.

The droplet clone is a private GitHub repo (github.com/eddylu94/PlanShare).
Point origin at GitHub and add the deploy key printed above, then:

  git remote set-url origin git@github.com:eddylu94/PlanShare.git
  ./deploy.sh
EOF
  exit 1
fi
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

if ! command -v yarn >/dev/null 2>&1; then
  echo "ERROR: yarn is not on PATH. Source nvm (or install yarn) before deploying."
  exit 1
fi

YARN_BIN="$(command -v yarn)"
NODE_BIN="$(command -v node)"
NODE_DIR="$(dirname "$NODE_BIN")"
SERVE_BIN="$(command -v serve || true)"
echo "==> node: $NODE_BIN ($("$NODE_BIN" -v))"
echo "==> yarn: $YARN_BIN"
if [[ -z "$SERVE_BIN" ]]; then
  echo "ERROR: serve is not on PATH. Install it with: npm i -g serve"
  exit 1
fi

# INSIGHTS_SECRET and friends must be in the process env.
set -a
if [[ -f "$ROOT/.env" ]]; then
  # shellcheck disable=SC1091
  . "$ROOT/.env"
fi
if [[ -f "$ROOT/server/.env" ]]; then
  # shellcheck disable=SC1091
  . "$ROOT/server/.env"
fi
set +a

echo "==> Restarting services"
if command -v pm2 >/dev/null 2>&1; then
  pm2 delete planshare-server >/dev/null 2>&1 || true
  pm2 delete planshare-client >/dev/null 2>&1 || true
fi
fuser -k "${SERVER_PORT}/tcp" >/dev/null 2>&1 || true
fuser -k "${CLIENT_PORT}/tcp" >/dev/null 2>&1 || true
sleep 1

# Capture nvm's node/yarn here. pm2/screen do not load .bashrc, so a bare
# `yarn start` in those sessions often exits immediately (client still works
# because `serve` is typically installed globally).
export PATH="${NODE_DIR}:${PATH}"

start_server_cmd="export PATH='${NODE_DIR}:'\$PATH TS_NODE_TRANSPILE_ONLY=1; cd '${ROOT}/server' && exec '${YARN_BIN}' start"
start_client_cmd="export PATH='${NODE_DIR}:'\$PATH; cd '${ROOT}/client' && exec '${SERVE_BIN}' -l ${CLIENT_PORT} -s build"

if command -v pm2 >/dev/null 2>&1; then
  echo "==> Starting server with pm2"
  (cd "$ROOT/server" && pm2 start bash --name planshare-server --update-env --exp-backoff-restart-delay 1000 -- -c "$start_server_cmd")
  echo "==> Starting client with pm2"
  (cd "$ROOT/client" && pm2 start bash --name planshare-client --update-env --exp-backoff-restart-delay 1000 -- -c "$start_client_cmd")
  pm2 save >/dev/null 2>&1 || true
else
  echo "==> Starting server with screen"
  screen -dm bash -c "$start_server_cmd"
  echo "==> Starting client with screen"
  screen -dm bash -c "$start_client_cmd"
fi

wait_for_http() {
  local url="$1"
  local label="$2"
  local port="$3"
  local i
  for i in $(seq 1 30); do
    if command -v curl >/dev/null 2>&1; then
      if curl -sf "$url" >/dev/null 2>&1; then
        echo "==> ${label} is up (${url})"
        return 0
      fi
    elif fuser "${port}/tcp" >/dev/null 2>&1; then
      echo "==> ${label} is listening on ${port}"
      return 0
    fi
    sleep 1
  done
  return 1
}

echo "==> Waiting for backend on port ${SERVER_PORT}"
if ! wait_for_http "http://127.0.0.1:${SERVER_PORT}/marco" "API" "${SERVER_PORT}"; then
  echo "ERROR: backend did not start on port ${SERVER_PORT}."
  if command -v pm2 >/dev/null 2>&1; then
    pm2 ls || true
    pm2 logs planshare-server --lines 80 --nostream || true
  else
    echo "Check the screen session: screen -ls && screen -r"
  fi
  echo "Manual start: cd ${ROOT}/server && yarn start"
  exit 1
fi

echo "==> Waiting for client on port ${CLIENT_PORT}"
if ! wait_for_http "http://127.0.0.1:${CLIENT_PORT}/" "client" "${CLIENT_PORT}"; then
  echo "ERROR: client did not start on port ${CLIENT_PORT}."
  if command -v pm2 >/dev/null 2>&1; then
    pm2 ls || true
    pm2 logs planshare-client --lines 40 --nostream || true
  fi
  exit 1
fi

end_time="$(date +%s)"
echo "Application deployed"
echo "Execution time: $((end_time - start_time)) seconds"
