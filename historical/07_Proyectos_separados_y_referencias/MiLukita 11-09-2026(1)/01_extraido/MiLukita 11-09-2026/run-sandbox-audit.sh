#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$ROOT_DIR/audit-package"
LOG_DIR="$PACKAGE_DIR/logs"
REPORT_DIR="$PACKAGE_DIR/reports"

rm -rf "$PACKAGE_DIR"
mkdir -p "$LOG_DIR" "$REPORT_DIR"

run_logged() {
  local name="$1"
  shift
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" | tee "$LOG_DIR/${name}.log"
  "$@" 2>&1 | tee -a "$LOG_DIR/${name}.log"
}

cd "$ROOT_DIR"
printf 'project=%s\ncreated_at_utc=%s\n' "ruleta-peru-online" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$PACKAGE_DIR/manifest.txt"
run_logged pnpm-check pnpm check
run_logged loteria-inspection pnpm inspect:loteria
run_logged api-e2e pnpm test:e2e
run_logged pnpm-test pnpm test
run_logged simulator-full pnpm simulate:full

cp .simulation-results/simulation-report-full.json "$REPORT_DIR/"
if [[ -f .simulation-results/simulation-report-loteria-v101.json ]]; then
  cp .simulation-results/simulation-report-loteria-v101.json "$REPORT_DIR/"
fi
cp docs/reporte-cierre-loteria-api-e2e-2026-08-24.md "$REPORT_DIR/"
cp docs/resultados-simulador-aislado-2026-08-24.md "$REPORT_DIR/"

(
  cd "$ROOT_DIR"
  find audit-package -type f ! -name SHA256SUMS.txt -printf '%p\0' | sort -z | while IFS= read -r -d '' file; do
    sha256sum "$file"
  done
) > "$PACKAGE_DIR/SHA256SUMS.txt"

echo "Paquete de auditoría generado: $PACKAGE_DIR"
