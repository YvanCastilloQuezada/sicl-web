#!/bin/bash
set -uo pipefail
cd "$(dirname "$0")/.."

SHA=$(git rev-parse HEAD)
BR=$(git branch --show-current)
TS=$(date +%Y%m%d-%H%M%S)

echo "🚀 Certificación F1-F10 | SHA: ${SHA:0:8} | rama: $BR"
echo "   Timeout por fase: 5 minutos"
echo ""

mkdir -p artifacts/arki-phase-evidence "artifacts/_archive/run-$TS/pre"
[ -d artifacts/arki-phase-evidence ] && cp -a artifacts/arki-phase-evidence/. "artifacts/_archive/run-$TS/pre/" 2>/dev/null || true

PASS=0; FAIL=0; DETAILS=""

for P in F1 F2 F3 F4 F5 F6 F7 F8 F9 F10; do
  echo -n "▶️  $P... "
  L="artifacts/arki-phase-evidence/run-${P,,}.log"
  R="artifacts/arki-phase-evidence/receipt-${P,,}.json"
  
  # Ejecutar con timeout de 5 minutos
  timeout 300 bash -c "ARKI_PHASE='$P' node scripts/arki-phase-evidence-runner.mjs" > "$L" 2>&1
  RC=$?
  
  if [ $RC -eq 124 ]; then
    echo "⏱️  TIMEOUT (5 min)"
    DETAILS="$DETAILS $P(timeout)"
    FAIL=$((FAIL+1))
    continue
  fi
  
  if [ ! -f "$R" ]; then
    echo "❌ sin recibo"
    DETAILS="$DETAILS $P(no-recibo)"
    FAIL=$((FAIL+1))
    continue
  fi
  
  # Inyectar SHA
  if command -v jq >/dev/null 2>&1; then
    jq --arg s "$SHA" --arg b "$BR" '.sha=$s|.branch=$b|.repository="local"' "$R" > t.json 2>/dev/null && mv t.json "$R"
  else
    node -e "const fs=require('fs'),d=JSON.parse(fs.readFileSync('$R'));d.sha='$SHA';d.branch='$BR';d.repository='local';fs.writeFileSync('$R',JSON.stringify(d,null,2));"
  fi
  
  RS=$(jq -r '.sha' "$R" 2>/dev/null)
  ST=$(jq -r '.status' "$R" 2>/dev/null)
  
  if [ "$RS" != "$SHA" ]; then
    echo "❌ SHA inválido"
    DETAILS="$DETAILS $P(sha)"
    FAIL=$((FAIL+1))
    continue
  fi
  
  case "$ST" in
    PASS*) echo "✅ $ST"; PASS=$((PASS+1)) ;;
    *) echo "❌ status=$ST"; DETAILS="$DETAILS $P($ST)"; FAIL=$((FAIL+1)) ;;
  esac
done

echo ""
echo "=========================================="
echo "Resultado: PASS=$PASS/10  FAIL=$FAIL"
[ -n "$DETAILS" ] && echo "Detalles:$DETAILS"
echo "=========================================="

if [ "$PASS" -eq 10 ]; then
  echo "✅ CERTIFICACIÓN EXITOSA"
  exit 0
else
  echo "❌ CERTIFICACIÓN FALLIDA"
  exit 1
fi
