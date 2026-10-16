#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
command -v node >/dev/null || { echo 'NODE_NOT_AVAILABLE'; exit 10; }
echo "NODE=$(node --version)"
echo "STARTED_UTC=$(date -u +%FT%TZ)"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "SOURCE_GIT_HEAD=$(git rev-parse HEAD)"
  echo "SOURCE_PROVENANCE=GIT_WORKTREE"
else
  echo "SOURCE_GIT_HEAD=UNKNOWN_ZIP"
  echo "SOURCE_PROVENANCE=NOT_ATTESTED"
fi
paths=(
  experiments/arki-ideas/av036-smoke.test.cjs
  experiments/arki-ideas/av036-mo05-integration.test.cjs
  experiments/arki-ideas/REC-001/arki-live-systems-coordinator.test.cjs
  experiments/arki-ideas/REC-002/arki-relational-learning.test.cjs
  experiments/arki-ideas/REC-003/arki-twin-three-alternatives.test.cjs
  experiments/arki-ideas/REC-006/arki-live-pulse.test.cjs
)
for p in "${paths[@]}"; do
  test -f "$p" || { echo "MISSING_TEST=$p"; exit 11; }
done
node --test --test-reporter=tap "${paths[@]}"
echo "AV036_LOCAL_TESTS_PASS"
