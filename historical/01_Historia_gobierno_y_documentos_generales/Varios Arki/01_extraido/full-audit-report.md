# Informe forense de auditoría — ARKI Core v1.0 y Bridge alpha8

**Fecha de auditoría:** 2026-09-27  
**Alcance:** inspección estructural, seguridad read-only, suites focales, persistencia SQLite, conectividad real Bridge → Core y verificación de no mutación.  
**Regla aplicada:** no modificar el Core congelado, no ejecutar providers externos, no exponer secretos.

## 1. Veredicto ejecutivo

- **Core v1.0:** integridad confirmada en `5533bd8eb1e3b81c37d089bd30b424f2a4c1e231`.
- **H-001 a H-004:** código presente; las suites focales ejecutadas pasan.
- **Bridge alpha8:** conexión HTTP real read-only comprobada mediante `/arki/query`.
- **REAL_ARKI_CORE_REACHED:** `YES`.
- **ARKI_HEAD_OBSERVED:** `5533bd8eb1e3b81c37d089bd30b424f2a4c1e231`.
- **Providers externos:** no usados durante los canarios ni la auditoría.
- **Mutación del Core:** no hubo cambios rastreados por la auditoría. El checkout aparece dirty únicamente por `?? docs/orders/`, un directorio no rastreado preexistente/de la orden, no por cambios en H-001–H-004.
- **Estado de datos:** la SQLite real contiene proyectos y eventos básicos, pero **cero `DERIVATION_RECORDED`**. Por tanto, la conectividad real está probada; el comportamiento H-001–H-004 sobre datos persistidos reales queda **no demostrable con el dataset actual**.

## 2. Baseline e integridad

| Elemento | Resultado |
|---|---|
| Repositorio | `/home/ubuntu/sicl-core` |
| Rama | `feat/h001-examen-11-rt-a-rt-d` |
| HEAD | `5533bd8eb1e3b81c37d089bd30b424f2a4c1e231` |
| Commit | `fix(H-004): RT-88 blocked dependency cascade + Freeze v1.0 manifests` |
| Archivos tocados por el commit | 4: `docs/ARKI_CORE_FROZEN_v1.0.md`, `docs/ARKI_KNOWN_LIMITATIONS_v1.0.md`, `src/sicl/reaction.py`, `tests/test_reaction.py` |
| Cambios rastreados después de la auditoría | 0 |
| Estado no limpio | Solo `?? docs/orders/` |

### Hashes de módulos relevantes

| Archivo | SHA-256 |
|---|---|
| `src/sicl/derivation.py` | `50db5bcaf2274393befb80251c8dfd324122d03dc0b34e33fef5bbc77d30c450` |
| `src/sicl/impact.py` | `0e2765a6e285d86eaf61afe4e942b558521309b0e0aa6686fcd60678124aa9b0` |
| `src/sicl/validity.py` | `2282cbd22a5a4a8ee3bb04f75c44ccb0728f8cc58cce890410e76e54a48b324b` |
| `src/sicl/reaction.py` | `5e544df8e4579f871dfd092ff70059b7cec8340397f4e134dfc0b635d82b0d4d` |
| `tests/test_reaction.py` | `3c497e96e8c600a13ad63e72a54067ee7528643649e6d8a22ffcd122c5dc7cf7` |

## 3. Pruebas ejecutadas

### Suites focales

| Suite | Resultado |
|---|---:|
| `tests/test_derivation.py` | **20 passed** |
| `tests/test_impact.py` + adversarial importado por la ejecución focal | **35 passed** |
| `tests/test_validity.py` | **11 passed** |
| `tests/test_reaction.py` | **13 passed** |
| Total focal H-001–H-004 | **79 passed** |
| `tests/test_multiscale_wall_move_e2e.py` | **5 passed** |

La prueba RT-88 `test_h004_blocked_dependency_cascades_to_dependents` está presente y pasa. Verifica que un artefacto `B` dependiente de un artefacto `A` bloqueado se marque como `BLOCKED`, con `ActionType.ESCALATE` y `blocked_by=(A,)`.

La evidencia global capturada muestra **449 indicadores de progreso de pytest** y no contiene líneas de fallo/error; sí contiene warnings:

1. `StarletteDeprecationWarning` relacionado con `httpx`/`TestClient`.
2. `PytestUnraisableExceptionWarning` de IfcOpenShell al destruir un archivo inválido.

`compileall.txt` existe pero tiene **0 bytes**, lo que es compatible con `compileall -q` exitoso; el archivo no es evidencia suficiente por sí solo para demostrar el código de retorno. Las suites focales y el canario de importación sí confirmaron que los módulos cargan.

## 4. Persistencia real SQLite

La consulta se realizó con `mode=ro`.

| Consulta | Resultado |
|---|---:|
| Proyectos | 76 |
| Eventos `PROJECT_CREATED` | 76 |
| Eventos `SPATIAL_LOCATION_CONFIRMED` | 38 |
| Eventos totales | 114 |
| Eventos `DERIVATION_RECORDED` | **0** |
| `bim_model_snapshots` | 0 |
| `generated_alternatives` | 0 |
| `simulations` | 0 |
| `evaluations` | 0 |
| `decisions` | 0 |
| `recommendations` | 0 |

### Implicación

El binding read-only del Bridge puede abrir la SQLite real y consultar la tabla `events`, pero no existe material persistido para ejecutar una demostración real de `DerivationLedger.list/why/explain`, `ImpactAnalyzer` o `ValidityAnalyzer` sobre una cadena de derivaciones almacenada. Las suites H-001–H-004 prueban esas capacidades con stores de prueba en memoria.

## 5. Auditoría estructural del Core

### H-001 — Derivation Ledger

- Implementa `list`, `record`, `why`, `explain`, `dependency_checks` e `integrity_checks`.
- Registra derivaciones como eventos `DERIVATION_RECORDED`.
- Soporta múltiples derivaciones por salida.
- Las comprobaciones distinguen dependencia ausente, mismatch de versión, identidad no verificable, identidad incierta y mismatch de hash.
- No aparece conectado a un caller de producción del CLI/API; las referencias encontradas están en los propios módulos y tests.

### H-002 — Impact Analysis

- Implementa análisis de dependencia y cambio.
- Propaga impactos transitivos, conserva cobertura y fail-closed en ciclos/límites.
- La prueba multiescala construye manualmente una cadena de ocho escalas en memoria; no la obtiene de la SQLite real.

### H-003 — Validity / Invalidation

- Implementa validez por derivación y agregación por artefacto.
- Respeta `FULLY_STALE=False` como política de recomputación sin autoridad humana adicional cuando todas las derivaciones están stale.
- `INVALID`/`UNCERTAIN` escalan a revisión humana.

### H-004 — Reaction Planning

- Implementa acciones read-only.
- RT-88 propaga `BLOCKED_DEPENDENCY` a dependientes.
- RT-77 bloquea ciclos y RT-87 comprueba determinismo de los reportes.
- No se encontró escritura al ledger desde el planificador.

## 6. Bridge alpha8 — conexión y seguridad

### Endpoint comprobado

- `GET /health` respondió `{"ok":true,"bridge":"ARKI Agent Bridge","version":"0.2a"}`.
- `POST /arki/query` exigió `x-bridge-auth`.
- El secreto no se imprimió ni se incluyó en este informe.
- El proceso se cerró al terminar la auditoría.

### Canary 1 — `repository_identity`

Resultado real:

- `ok=true`
- `branch=feat/h001-examen-11-rt-a-rt-d`
- `head=5533bd8eb1e3b81c37d089bd30b424f2a4c1e231`
- `provenance.source=sicl-core`
- `provenance.read_only=true`

### Canary 2 — `capability_status`

Resultado real:

- `ok=true`
- `provenance.source=sicl-core`
- `provenance.read_only=true`
- `DerivationLedger`: `IMPLEMENTED`, sin métodos faltantes.
- `ImpactAnalyzer`: `IMPLEMENTED`, sin métodos faltantes.
- `ValidityAnalyzer`: `IMPLEMENTED`, sin métodos faltantes.
- EventStore binding: `AVAILABLE`.
- El propio resultado declara `behavior_verified=false` e `importable_is_not_verified=true`; por ello este canario demuestra identidad/importación controlada, no una prueba de comportamiento H sobre datos persistidos.

### Límite de configuración

`BRIDGE_INTERNAL_SECRET` no está exportado en el entorno global de la shell. El canario funcionó porque el proceso fue iniciado con el secreto local configurado de forma explícita, sin revelar su valor. Para despliegue permanente se debe configurar el secreto en el runtime del servicio, no depender de un archivo local de auditoría.

## 7. Superficie del Core y capacidades superiores

La API FastAPI expone `/health`, proyectos, comandos y una superficie `/v1` amplia para BIM/IFC, GIS, conocimiento de diseño, regulaciones, simulaciones, generaciones, agentes, memoria, escalas, variables y multiobjetivo. La CLI expone comandos de proyectos, escenarios, memoria, generación, simulación, regulación, escalas, Pareto y otros.

Se encontraron módulos de:

- BIM/IFC y contratos de exportación con revisión humana.
- GIS y consulta OGC.
- conocimiento de diseño y agentes descriptivos.
- simulaciones deterministas, sensibilidad y Monte Carlo declarado.
- generación paramétrica, por patrones y evolutiva; `llm_assisted_v1` está definido pero no configurado.
- regulación y corpus controlado, sin afirmar vigencia legal automática.
- factibilidad y Pareto.

No se encontró una familia formal de módulos `H-005`, `H-006` o `H-007` equivalente al contrato congelado H-001–H-004. Existen capacidades superiores por RFC y módulos funcionales, pero no deben reportarse como una continuación H formal sin una orden/especificación adicional.

## 8. Motores y providers disponibles en este sandbox

- IfcOpenShell: disponible, versión `0.8.5`.
- `ezdxf`: no instalado.
- Blender: no disponible.
- FreeCAD: no disponible.
- LibreCAD: no disponible.
- Bonsai: no localizado.

La auditoría no instaló nada y no ejecutó providers externos.

## 9. Findings y riesgos

### F-01 — Dataset real sin derivaciones

**Severidad:** bloqueador para un E2E de comportamiento H sobre datos reales.  
**Evidencia:** 0 eventos `DERIVATION_RECORDED`.  
**Consecuencia:** el Bridge alcanza el Core real, pero solo puede demostrar identidad, introspección y disponibilidad del EventStore; no puede demostrar una cadena persistida H-001 → H-004.

### F-02 — La suite RFC-030 tiene side effect transitorio

Durante la auditoría previa, `tests/test_rfc030_drawing.py` regeneró/modificó el IFC rastreado. Se detectó, se inspeccionó el diff y se restauró el archivo exactamente al contenido versionado. El Core quedó sin cambios rastreados. El test debería generar sus artefactos en `tmp_path` o en un directorio de evidencia aislado para cumplir plenamente un contrato read-only.

### F-03 — `compileall -q` no deja evidencia textual

El archivo de salida de compileall tiene 0 bytes. Esto no es un fallo de compileall: el modo quiet escribe vacío al pasar. Para evidencia forense debe guardarse además el return code explícito, por ejemplo `compileall_rc=0`.

### F-04 — Estado dirty por `docs/orders/`

El Bridge informa `dirty=true` porque el checkout contiene `?? docs/orders/`. No corresponde a modificaciones de H-001–H-004 realizadas por la auditoría. Debe limpiarse o registrarse antes de usar `dirty` como criterio de integridad del canario.

### F-05 — Autenticación no configurada globalmente

El secreto existe en el mecanismo local usado para el canario, pero `BRIDGE_INTERNAL_SECRET` no está exportado en la shell. Un proceso iniciado sin inyección explícita falla cerrado con `BRIDGE_AUTH_NOT_CONFIGURED`.

### F-06 — Warnings de suite

La suite global pasa según su progreso, pero emite warnings de Starlette/httpx y un warning no gestionado de IfcOpenShell. Deben tratarse antes de declarar una suite sin warnings.

## 10. Recomendación operativa

1. Mantener H-001–H-004 congelados; no modificar el Core para resolver F-01.
2. Crear, en una base temporal o de prueba separada, un fixture de derivaciones persistido mediante la interfaz oficial `DerivationLedger.record`, y luego ejecutar el canario `derivation_integrity` sobre ese proyecto. No usar mocks en esa demostración.
3. Corregir el test RFC-030 para que nunca escriba sobre `docs/reference/RFC030_OUTPUT/EDIFICIO-YVAN-TRUJILLO-01.ifc`.
4. Registrar el return code de `compileall` y limpiar los warnings de IfcOpenShell/Starlette.
5. Configurar `BRIDGE_INTERNAL_SECRET` como secreto del servicio Bridge en su runtime.
6. Decidir explícitamente si `docs/orders/` forma parte de la orden actual; no eliminarlo automáticamente porque contiene trabajo del Product Owner.

## Conclusión

La conexión real y protegida **Bridge alpha8 → Core v1.0** está demostrada sin mocks de provider y sin mutar el Core: **`REAL_ARKI_BRIDGE_E2E_VERIFIED` para identidad, capacidades e integración read-only**. No debe ampliarse ese veredicto a comportamiento causal H sobre datos persistidos hasta resolver F-01 mediante un fixture/escenario real de derivaciones en una base controlada.
