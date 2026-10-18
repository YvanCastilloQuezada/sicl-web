#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="/home/ubuntu/ruleta-peru-online"
DELIVERABLES="/home/ubuntu/financial_deliverables"
STAMP="2026-08-24"
PACKAGE_ROOT="${DELIVERABLES}/auditoria_multi_juegos_peru_${STAMP}"
ZIP_FILE="${DELIVERABLES}/auditoria_multi_juegos_peru_${STAMP}.zip"

rm -rf "${PACKAGE_ROOT}" "${ZIP_FILE}"
mkdir -p "${PACKAGE_ROOT}/source" "${PACKAGE_ROOT}/financial" "${PACKAGE_ROOT}/presentation" "${PACKAGE_ROOT}/analysis" "${PACKAGE_ROOT}/manifests"

# Snapshot de código y documentos del proyecto. Se excluyen dependencias, controles de versión,
# registros temporales y potenciales archivos de entorno o secretos.
tar \
  --exclude='./node_modules' \
  --exclude='./.git' \
  --exclude='./.manus' \
  --exclude='./.manus-logs' \
  --exclude='./.env' \
  --exclude='./.env.*' \
  --exclude='./dist' \
  --exclude='./build' \
  -cf - -C "${PROJECT_ROOT}" . | tar -xf - -C "${PACKAGE_ROOT}/source"

cp "${DELIVERABLES}/modelo_tentativo_multi_juegos_peru.xlsx" "${PACKAGE_ROOT}/financial/"
cp "${PROJECT_ROOT}/docs/cuadro-tentativo-gastos-y-aporte-territorial.md" "${PACKAGE_ROOT}/financial/"
cp "${DELIVERABLES}/presentacion_ejecutiva_multi_juegos_peru.md" "${PACKAGE_ROOT}/presentation/"
cp -R "${DELIVERABLES}/multi-juegos-ejecutivo-slides" "${PACKAGE_ROOT}/presentation/slide-source-html"
cp "/home/ubuntu/regulatory_findings.md" "${PACKAGE_ROOT}/analysis/" 2>/dev/null || true
cp "/home/ubuntu/calcular_probabilidades_piloto.py" "${PACKAGE_ROOT}/analysis/" 2>/dev/null || true
cp "/home/ubuntu/calcular_cartas_y_mercados.py" "${PACKAGE_ROOT}/analysis/" 2>/dev/null || true
cp "/home/ubuntu/create_multi_juegos_financial_model.py" "${PACKAGE_ROOT}/analysis/"
cp "/home/ubuntu/validate_multi_juegos_financial_model.py" "${PACKAGE_ROOT}/analysis/"
cp "/home/ubuntu/create_audit_package.sh" "${PACKAGE_ROOT}/analysis/"

cat > "${PACKAGE_ROOT}/README_AUDITORIA.md" <<'EOF'
# Paquete de auditoría — Multi Juegos Perú

Este paquete contiene el código fuente, migraciones, pruebas, documentación funcional y regulatoria, modelo financiero editable y fuente HTML de la presentación ejecutiva disponibles al 24 de agosto de 2026.

## Alcance incluido

| Área | Ubicación |
|---|---|
| Aplicación React / Vite, servidor tRPC, Drizzle y pruebas | `source/` |
| Migraciones SQL y esquema | `source/drizzle/` |
| Documentación funcional, parámetros, RTP y regulación | `source/docs/` y `analysis/` |
| Modelo financiero editable y reporte de base | `financial/` |
| Fuente HTML y contenido de la presentación | `presentation/` |
| Scripts de cálculo, generación y validación | `analysis/` |
| Integridad del paquete | `manifests/SHA256SUMS.txt` |

## Exclusiones intencionales

No se incluyen `node_modules`, `.git`, registros de desarrollo, artefactos temporales, archivos `.env` ni secretos. Tampoco se redistribuye el XLSM legado de origen: fue identificado como contenedor potencial de macros, controles ActiveX, vínculos externos y datos personales; se mantiene separado para una revisión controlada.

Las imágenes obtenidas como referencias de búsqueda para la presentación no se redistribuyen dentro de este paquete. La fuente HTML documenta las rutas locales usadas durante la composición y el auditor debe sustituirlas por activos con licencia propia si desea reproducir la presentación.

## Revisión recomendada

1. Verificar integridad con `sha256sum -c manifests/SHA256SUMS.txt` desde la raíz del paquete.
2. Revisar `source/drizzle/schema.ts`, las migraciones SQL y los procedimientos en `source/server/`.
3. Ejecutar `pnpm install --frozen-lockfile`, luego `pnpm check` y `pnpm test` desde `source/` en un entorno aislado con configuración de base de datos de auditoría.
4. Validar las reglas de RNG, liquidación, reembolso y auditoría en `source/server/pilot.ts` y `source/server/pilot.test.ts`.
5. Revisar supuestos azules, fórmulas y notas de fuente del archivo financiero antes de adoptar cualquier presupuesto.

> El proyecto permanece en piloto gratuito. No se debe activar dinero real, pagos, retiros, pronósticos sensibles ni mensajes de aporte social sin autorización, certificación y revisión profesional aplicables.
EOF

(
  cd "${PACKAGE_ROOT}"
  find . -type f ! -path './manifests/SHA256SUMS.txt' -print0 | sort -z | xargs -0 sha256sum > "manifests/SHA256SUMS.txt"
  find . -type f -print | sort > "manifests/FILE_INVENTORY.txt"
)

(
  cd "${PACKAGE_ROOT}"
  zip -qr "${ZIP_FILE}" .
)

echo "${ZIP_FILE}"
