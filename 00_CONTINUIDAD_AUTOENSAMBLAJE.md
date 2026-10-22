# ARKI — continuidad de autoensamblaje

## Estado actual
- Rama: `feat/arbol-vivo-autoensamblaje-20261011`
- Base: `docs/av-ui-001-preparation-20261010` (Gemelo Digital experimental existente).
- Frontend preservado, sin modificaciones.
- Nuevo planificador: `tools/maqueta-viva/arki-assembly-planner.cjs`
- Pruebas: `tools/maqueta-viva/test-arki-assembly-planner.cjs`
- Workflow: `.github/workflows/arki-assembly-planner.yml`
- GitHub Actions run `38190972045`: FAILURE de infraestructura (runner no asignado; cero pasos ejecutados), **NO VERIFIED**.
- Ningún merge a main ni modificación de Core/ACS.
- Prueba local pendiente: `node tools/maqueta-viva/test-arki-assembly-planner.cjs`.
- Siguiente paso: comprobar el planificador, integrarlo con inventario real, comparar ramas, implementar tres propuestas ensayables en sandbox y enlazar resultados al Árbol Vivo y Gemelo Digital. No atribuirle ejecución autónoma todavía.

## Recuperación
Consultar además `00_INICIO_ARKI.md` en rama `audit/arbol-vivo-continuidad-20261011`; unificar los dos documentos al integrar las ramas, sin perder información.

## Decisiones de autoridad
El propietario autoriza desarrollo, pruebas e integración de correcciones verificadas, pero la selección de una de tres alternativas de mejora corresponde al propietario. No cambiar FROZEN ni promover geometría canónica automáticamente.

## Avance siguiente (2026-10-11)
- Inventario exacto de rutas en `tools/maqueta-viva/arki-repository-snapshot.json`: 1933 archivos de Web/Core/ACS, anclados a commits concretos (1326/379/228).
- `arki-discovery.cjs` reproduce clasificación conservadora; `arki-discovery-report.json` informa 460 rutas no clasificadas por heurística.
- `arki-capability-inventory.cjs` usa SHA-256 para IDs estables y sin colisión por normalización.
- `arki-assembly-strategies.cjs` propone A/B/C; no ejecuta ni selecciona alternativas.
- PR #56 abierto como DRAFT contra rama experimental, no main.
- CI sigue sin asignación de runner; no existe prueba verde verificable. Revisar estado antes de promover.
- No se ha integrado todavía la salida al HTML ni se han inspeccionado las dependencias reales a nivel código.
