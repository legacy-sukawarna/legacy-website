#!/usr/bin/env bash
# Commit as Ken in every Claude Code session. Cloud containers default the
# global git identity to Claude, so pin it in this repo's local config.
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

git config user.name "Kenneth Ezekiel"
git config user.email "ken35kiel@gmail.com"
