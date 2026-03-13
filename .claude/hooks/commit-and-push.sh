#!/bin/bash
set -euo pipefail

# Manuel commit og push — kaldes KUN af Claude efter brugerbekræftelse
# Kræver: $1 = commit-besked

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR"

COMMIT_MSG="${1:-}"
if [ -z "$COMMIT_MSG" ]; then
  echo "Fejl: commit-besked mangler" >&2
  echo "Brug: $0 \"din commit-besked\"" >&2
  exit 1
fi

# Tjek om der er ændringer
if git diff --quiet && git diff --staged --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "Ingen ændringer at committe."
  exit 0
fi

# Stage alle ændringer
git add -A

# Commit med den medfølgende besked
git commit -m "${COMMIT_MSG}

https://claude.ai/code/session_01Tj9jfBDDYHy2yscwNakaPj"

# Push med retry-logik
BRANCH=$(git branch --show-current)
attempt=1
delays=(2 4 8 16)
while [ $attempt -le 4 ]; do
  if git push -u origin "$BRANCH"; then
    echo "Pushet til $BRANCH."
    exit 0
  fi
  if [ $attempt -lt 4 ]; then
    echo "Push fejlede (forsøg $attempt), prøver igen om ${delays[$((attempt-1))]}s..."
    sleep "${delays[$((attempt-1))]}"
  fi
  attempt=$((attempt + 1))
done

echo "Push fejlede efter 4 forsøg." >&2
exit 1
