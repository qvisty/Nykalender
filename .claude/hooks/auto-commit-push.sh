#!/bin/bash
set -euo pipefail

# Auto-commit and push when Claude finishes a task
# Triggered by the Stop hook in settings.json

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR"

# Exit if no changes to commit
if git diff --quiet && git diff --staged --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  exit 0
fi

# Stage all changes
git add -A

# Generate commit message from staged changes
CHANGED_FILES=$(git diff --staged --name-only | head -10 | tr '\n' ' ')
STATS=$(git diff --staged --shortstat)

# Build a concise commit message
MSG="Auto-commit: ${CHANGED_FILES}"
if [ ${#MSG} -gt 72 ]; then
  FILE_COUNT=$(git diff --staged --name-only | wc -l | tr -d ' ')
  MSG="Auto-commit: update ${FILE_COUNT} file(s)"
fi

# Commit
git commit -m "${MSG}

${STATS}

https://claude.ai/code/session_01Tj9jfBDDYHy2yscwNakaPj"

# Push current branch with retry logic
BRANCH=$(git branch --show-current)
push_with_retry() {
  local attempt=1
  local delays=(2 4 8 16)
  while [ $attempt -le 4 ]; do
    if git push -u origin "$BRANCH" 2>&1; then
      return 0
    fi
    if [ $attempt -lt 4 ]; then
      echo "Push failed (attempt $attempt), retrying in ${delays[$((attempt-1))]}s..."
      sleep "${delays[$((attempt-1))]}"
    fi
    attempt=$((attempt + 1))
  done
  echo "Push failed after 4 attempts" >&2
  return 1
}

push_with_retry

echo "Auto-commit and push completed: $BRANCH"
