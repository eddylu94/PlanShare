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
