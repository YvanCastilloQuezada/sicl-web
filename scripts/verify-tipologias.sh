#!/usr/bin/env bash
# Verifica que TIPOLOGIAS y fixtures están sincronizados.
# Uso: ./scripts/verify-tipologias.sh

set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

echo "=== Verificando TIPOLOGIAS vs fixtures ==="

python3 - <<'PYEOF'
import re, pathlib, json, os

src = pathlib.Path("server/arkiGia.test.ts").read_text()
match = re.search(r'const TIPOLOGIAS = \[(.*?)\] as const;', src, re.DOTALL)
if not match:
    print("❌ TIPOLOGIAS no encontrado")
    exit(1)

tipologias = re.findall(r'"([^"]+)"', match.group(1))
fixtures_dir = "server/gia/fixtures"
fixtures_files = sorted([f.replace(".json", "") for f in os.listdir(fixtures_dir) if f.endswith(".json")])

tipologias_set = set(tipologias)
fixtures_set = set(fixtures_files)

en_tipologias_no_fixture = tipologias_set - fixtures_set
en_fixture_no_tipologias = fixtures_set - tipologias_set

if not en_tipologias_no_fixture and not en_fixture_no_tipologias:
    print(f"✅ {len(tipologias)} tipologías, {len(fixtures_files)} fixtures, sincronizados")
else:
    print("❌ DESINCRONIZACIÓN:")
    if en_tipologias_no_fixture:
        print(f"  - En TIPOLOGIAS pero sin fixture: {sorted(en_tipologias_no_fixture)}")
    if en_fixture_no_tipologias:
        print(f"  - En fixtures pero sin TIPOLOGIAS: {sorted(en_fixture_no_tipologias)}")
    exit(1)

# Verificar projectId único y formato
project_ids = {}
typologies = {}
errores = []
for f in fixtures_files:
    with open(f"{fixtures_dir}/{f}.json") as fh:
        data = json.load(fh)
    pid = data.get("projectId", "")
    typ = data.get("typology", "")
    if not re.match(r'^[A-Z]{3}-[A-Z]{3}-\d{3}-\d{3}$', pid):
        errores.append(f"{f}: projectId inválido '{pid}'")
    if pid in project_ids:
        errores.append(f"{f}: projectId duplicado '{pid}'")
    project_ids[pid] = f
    if typ in typologies:
        errores.append(f"{f}: typology duplicado '{typ}'")
    typologies[typ] = f

if errores:
    print("❌ ERRORES:")
    for e in errores:
        print(f"  - {e}")
    exit(1)
else:
    print(f"✅ {len(project_ids)} projectId únicos, {len(typologies)} typology únicos")
PYEOF
