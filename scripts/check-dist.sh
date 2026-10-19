#!/usr/bin/env bash
# Rebuilds dist/ and fails if the result differs from what is staged, so the committed build output always matches src/.
set -euo pipefail

cd "$(dirname "$0")/.."

npm run --silent build

dirty=$(git status --porcelain --untracked-files=all -- dist | grep -v '^[MADRC] ' || true)

if [ -n "$dirty" ]; then
  echo "The dist folder is out of date with src. Stage the rebuilt files and commit again:" >&2
  echo "  git add dist" >&2
  echo >&2
  echo "$dirty" >&2
  exit 1
fi
