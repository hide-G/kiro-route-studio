#!/usr/bin/env bash
set -euo pipefail
APP_DIR="${1:-$HOME/kiro-route-studio}"
cd "$APP_DIR"
trap 'sudo shutdown -h now' EXIT
npm ci
npm test
npm run render:preview
npm run verify:video
