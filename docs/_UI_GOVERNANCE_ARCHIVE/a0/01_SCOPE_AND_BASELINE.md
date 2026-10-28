# A0 — Alcance y baseline

La fase A0 es una auditoría de gobernanza de interfaz. Su objetivo es conocer qué superficies existen, qué controles están declarados, qué acciones muestran una intención de operación y qué partes tienen evidencia suficiente para ser consideradas funcionales. Esta fase **no modifica componentes de producto, lógica de negocio, permisos, persistencia ni configuración de producción**.

El baseline fue capturado el 2026-09-24T21:42:27.219474+00:00. El repositorio auditado es `YvanCastilloQuezada/sicl-web`, en la rama `feature/arki-native-generator-v1`, con HEAD `d22e71ddba8d610ddca1f0a3ae38381ee5062de5`. El worktree no se limpió ni se sobrescribieron cambios previos. El estado observado contiene archivos no versionados de entregas anteriores; se conservan fuera del alcance de A0.

La inspección fuente encontró **38 rutas declaradas** y **1336 ocurrencias de controles o handlers**. Estos números son ocurrencias de código, no un conteo de botones únicos visibles después de renderizar. El inventario conserva la ruta, el componente y la línea de origen para permitir una reconciliación posterior.

## Referencias de baseline

- Entrada de rutas: `client/src/App.tsx:73-115`.
- Entrada React: `client/src/main.tsx:1-...`.
- Registro de controles: `06_UI_ACTION_REGISTRY.json`.
- Matriz legible: `05_UI_ACTION_MATRIX.md`.
- Script reproducible: `scripts/run_ui_governance_a0.py`.
