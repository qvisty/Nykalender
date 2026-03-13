#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Node.js / npm
if [ -f "$PROJECT_DIR/package.json" ]; then
  echo "Installing npm dependencies..."
  cd "$PROJECT_DIR"
  npm install
fi

# Python / pip
if [ -f "$PROJECT_DIR/requirements.txt" ]; then
  echo "Installing pip dependencies..."
  pip install -r "$PROJECT_DIR/requirements.txt"
fi

# Python / pyproject.toml (Poetry or PEP 517)
if [ -f "$PROJECT_DIR/pyproject.toml" ]; then
  if command -v poetry &>/dev/null; then
    echo "Installing Poetry dependencies..."
    cd "$PROJECT_DIR"
    poetry install --no-interaction
  else
    echo "Installing pip dependencies from pyproject.toml..."
    pip install -e "$PROJECT_DIR"
  fi
fi

echo "Session start hook completed successfully."
