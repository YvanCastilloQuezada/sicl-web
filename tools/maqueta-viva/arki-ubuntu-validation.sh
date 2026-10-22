#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
EXPECTED="${1:?Uso: bash tools/maqueta-viva/arki-ubuntu-validation.sh SHA_EXACTO}"
ACTUAL="$(git rev-parse HEAD)"
if [[ "$ACTUAL" != "$EXPECTED" ]]; then
  printf 'FAIL SHA esperado=%s actual=%s\n' "$EXPECTED" "$ACTUAL" >&2
  exit 2
fi
command -v node >/dev/null || { echo "FAIL: Node no instalado"; exit 3; }
node tools/maqueta-viva/arki-continuity-local-verify.cjs "$EXPECTED"
echo "RESULTADO: $ROOT/ARKI_CONTINUITY_LOCAL_VALIDATION.txt"
