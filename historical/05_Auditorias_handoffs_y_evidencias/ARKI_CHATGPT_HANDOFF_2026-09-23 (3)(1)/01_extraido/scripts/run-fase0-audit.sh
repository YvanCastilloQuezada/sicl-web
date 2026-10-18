#!/usr/bin/env bash
set -u
cd "$(dirname "$0")/.."
REPORT="FASE_0_AUDITORIA_REAL_2026-09-23.md"
exec > >(tee "$REPORT") 2>&1
printf '# Archi — Fase 0: auditoría real del repositorio\n\n'
printf '**Fecha:** 2026-09-23\n\n'
printf '## 1. Identidad del árbol\n\n```text\n'
printf '$ git rev-parse HEAD\n'; git rev-parse HEAD || true
printf '$ git status --porcelain\n'; git status --porcelain || true
printf '$ git log --oneline -10\n'; git log --oneline -10 || true
printf '$ git diff c62183a --stat\n'; git diff c62183a --stat || true
printf '$ git diff c62183a --name-only\n'; git diff c62183a --name-only || true
printf '```\n\n'
printf '## 2. Hashes de árboles y configuración\n\n```text\n'
for target in shared client/src package.json pnpm-lock.yaml tsconfig.json; do
  if [ -d "$target" ]; then
    hash=$(find "$target" -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | awk '{print $1}')
  elif [ -f "$target" ]; then
    hash=$(sha256sum "$target" | awk '{print $1}')
  else
    hash='NOT_FOUND'
  fi
  printf '%s %s\n' "$target" "$hash"
done
printf '```\n\n'
printf '## 3. Pruebas base\n\n'
run_test() {
  name="$1"; shift
  printf '### %s\n\n```text\n$ %s\n' "$name" "$*"
  set +e
  "$@"
  status=$?
  set -e
  printf 'exit=%s\n```\n\n' "$status"
}
set -e
run_test 'pnpm check' pnpm check
run_test 'pnpm build' pnpm build
for test in test-constructive test-serialization test-wall-coherence test-wall-door-canvas test-bim-selection; do
  if [ -f "scripts/$test.ts" ]; then
    run_test "$test" pnpm tsx "scripts/$test.ts"
  else
    printf '### %s\n\n`NO ENCONTRADA`\n\n' "$test"
  fi
done
printf '## 4. Inventario de contratos y duplicación potencial\n\n```text\n'
rg -n 'ArchiElementId|GlobalId|elementId|globalId|ProjectSnapshot|Snapshot|interface Project|interface Version|interface Session|FamilyDefinition|ArkiParametricFamily|FamilyInstance|PriceBook|APU|TechnicalDossier|ConstructionModel|class Muro|StructuralElement|BimSelection|ContextPanelState' shared client scripts --glob '*.{ts,tsx}' || true
printf '```\n\n'
printf '## 5. Capacidades clave y límites observados\n\n'
printf -- '- La clasificación final debe contrastarse con el código y los outputs anteriores.\n- Este informe no promueve capacidades profesionales no verificadas.\n- La Fase 0 no implementa E1-E8 y no activa integraciones externas.\n'
