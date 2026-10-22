# ARKI — Auditoría de antecedentes del Árbol Vivo (2026-10-14)

## Resultado de inspección estática

Fuente: `tools/maqueta-viva/assembly-registry.json` en `feat/arki-autonomy-orchestrator-20261013`, `updated_at=2026-10-07`.

- 24 ideas y 27 componentes: **51 elementos**.
- **0/51** incluyen un campo `dependencies` no vacío; de hecho, ninguno declara el campo.
- Fases declaradas: F1=12, F2=9, F3=8, F4=6, F6=3, F7=7, F8=1, F9=3, F10=1, UNASSIGNED=1. F5=0.
- El algoritmo `arki-arbol-vivo-auto.cjs` ordena precedencias cuando se proporcionan, pero el registro real no contiene esas relaciones.
- `arki-assembly-planner.cjs` detecta ciclos y dependencias inexistentes; `arki-capability-inventory.cjs` identifica archivos mediante heurísticas y produce propuestas sin aristas de dependencia verificadas.

## Corrección sin duplicar motor

Se añadió **un gate auxiliar** `arki-dependency-coverage.cjs` que inspecciona el registro y devuelve `BLOCKED_UNVERIFIED` cuando los antecedentes no están declarados. No inventa relaciones, no reorganiza fases y no modifica el registro canónico. Su salida no equivale a que ARKI haya aprendido o demostrado competencias.

Ejecutar en Node 22:

```bash
node --test tools/maqueta-viva/arki-dependency-coverage.test.cjs
node tools/maqueta-viva/arki-dependency-coverage.cjs
```

El segundo comando debe salir con código 2 mientras falte declarar cobertura de antecedentes; es un bloqueo esperado, **no** una prueba de fallo del algoritmo.

## Plan de cierre

1. Extraer relaciones explícitas de los contratos, tests, roadmap y documentación; cada arista debe tener procedencia, alcance y confianza.
2. Distinguir prerequisito obligatorio, recomendación, relación semántica y ciclo de retroalimentación. No convertir todas las conexiones en bloqueo.
3. Revisar los 51 elementos con el PO y reconciliar con inventario de los tres repositorios. Los 51 elementos son un registro histórico, **no todas las capacidades de ARKI**.
4. Propagar bloqueos transitivos por fase y actividad, respetando FROZEN y autorización ACE88.
5. Verificar con pruebas E2E antes de activar ordenamiento operativo en la UI.

Estado: `STATIC_AUDIT_COMPLETE / COVERAGE_GATE_IMPLEMENTED / LOCAL_TESTS_NOT_EXECUTED / CANONICAL_REGISTRY_UNCHANGED`.
