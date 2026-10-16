#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(git rev-parse --show-toplevel)"
if ! command -v node >/dev/null; then echo 'NODE_NOT_AVAILABLE'; exit 10; fi
echo "HEAD=$(git rev-parse HEAD)"
echo "NODE=$(node --version)"
echo "STARTED_UTC=$(date -u +%FT%TZ)"
paths=(
  experiments/arki-ideas/av036-smoke.test.cjs
  experiments/arki-ideas/REC-001/arki-live-systems-coordinator.test.cjs
  experiments/arki-ideas/REC-002/arki-relational-learning.test.cjs
  experiments/arki-ideas/REC-003/arki-twin-three-alternatives.test.cjs
  experiments/arki-ideas/REC-006/arki-live-pulse.test.cjs
)
for p in "${paths[@]}"; do
  test -f "$p" || { echo "MISSING_TEST=$p"; exit 11; }
done
node --test --test-reporter=tap "${paths[@]}"
echo "AV036_TESTS_PASS_FOR_HEAD=$(git rev-parse HEAD)"
