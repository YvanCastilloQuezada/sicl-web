#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
TS=$(date +%Y%m%d-%H%M%S)
ARCH="artifacts/_archive/$TS"
mkdir -p "$ARCH"

echo "[ARKI] Preservando evidencias previas → $ARCH/pre"
[ -d artifacts/arki-phase-evidence ] && cp -a artifacts/arki-phase-evidence "$ARCH/pre" || true

echo "[ARKI] Corriendo F1..F10 (web evidence, archivo por fase)"
for P in F1 F2 F3 F4 F5 F6 F7 F8 F9 F10; do
  echo "== $P =="
  ARKI_PHASE="$P" node scripts/arki-phase-evidence-runner.mjs 2>&1 | tee "$ARCH/run-$P.log" || true
  cp -a "artifacts/arki-phase-evidence/receipt-${P,,}.json" "$ARCH/" 2>/dev/null || true
done

echo "[ARKI] Indexando geometría (.ifc/.glb/.gltf/.obj/.step/.stp)"
find . -maxdepth 8 -type f \( \
    -iname "*.ifc" -o -iname "*.glb" -o -iname "*.gltf" -o \
    -iname "*.obj" -o -iname "*.step" -o -iname "*.stp" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/artifacts/_archive/*" \
  -print | sed 's|^\./||' > "$ARCH/geometry-index.txt" || true

echo "[ARKI] Listo → $ARCH"
