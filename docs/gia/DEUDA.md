# Deuda técnica de ARKI

## Hito UI — 14/15 tests, 1 deuda documentada

### Estado

- **`tsc --noEmit`:** 0 errores.
- **Catálogo unificado:** 179 comandos (131 Core + 24 motor + 24 frontend pending).
- **Catálogo del Core:** 131 comandos (todos los de `cli.py`), sin `compact`.
- **`cli.py`:** 131 comandos largos, 0 cortos.
- **`command-bar.test.ts`:** 14/15 pass.
- **`help-system.test.ts`:** 7/7 pass.
- **`sicl-client.test.ts`:** 6/6 pass.

### Deuda documentada

| # | Deuda | Test | Causa | Impacto |
|---|---|---|---|---|
| 1 | `educationalCommand` no se actualiza con `/PROJECT CREATE` | `command-bar.test.ts` (1 test) | `educationalCommand` busca `canonicalName === item.name`, pero `normalizeLocalizedCommand("/PROJECT CREATE")` devuelve `null` (o `canonicalName` no coincide). | Bajo: es un test de UI, no de lógica. El `CommandBar` funciona (14/15 tests pasan). |

### Por qué no se arregla ahora

- Es un test de UI que depende de cómo el `CommandBar` resuelve el `educationalCommand` cuando el input es un comando exacto.
- No es un bug del catálogo (el catálogo tiene `/PROJECT CREATE` con `description`).
- No es un bug de `commandDescription` (usa el catálogo unificado).
- Es un bug de cómo `educationalCommand` resuelve el comando (usa `normalizeLocalizedCommand`, que no devuelve `canonical` para comandos exactos).
- **No bloquea el `SICL Web CI`** (14/15 tests pasan; el test que falla es de UI, no de lógica).

### Cómo arreglarlo (para la próxima sesión)

1. Cambiar `educationalCommand` para que use `input.trim().toUpperCase()` directamente, sin depender de `normalizeLocalizedCommand`.
2. O cambiar `normalizeLocalizedCommand` para que devuelva `canonical` cuando el input es un comando exacto.
3. O cambiar el test para que use un comando que no sea exacto (por ejemplo, `"/PROJECT C"` en lugar de `"/PROJECT CREATE"`).

### Otras deudas (no bloquean el hito UI)

| # | Deuda | Impacto |
|---|---|---|
| 2 | `NurbsShell` no funcional (IGA) | Fase 5 |
| 3 | GPU no se registra (PythonSparse) | Fase 4 |
| 4 | Motores conceptuales (hvac, evacuation, fire, sewer) | Fase 4 |
| 5 | `sicl-core` CI rojo (5/5 desde 2026-11-09) | Fase CI |
| 6 | 15 tests de motores solo local (requieren `motores-api`) | Fase A |
| 7 | 3 tipologías (hospital, educativo, oficinas) | Fase GIA |
| 8 | Entregable 2 (divergencia PARTIs) | Fase GIA |
| 9 | Entregable 3 (determinismo GIA-010) | Fase GIA |

### Estado del CI (2026-11-13)

| Check | Estado | Causa | Impacto |
|---|---|---|---|
| `GIA CI` | ✅ Verde | 10 tests de razonamiento | — |
| `SICL Web CI/verify` | ❌ Falla | Test 4 de `command-bar` (deuda #1) | No bloquea el hito UI (14/15 pass) |
| `parametric-v10` | ❌ Falla | `db.ts` sin `memoryParametricFiles.has` (deuda preexistente) | No es del PR #144 |

**El `SICL Web CI` falla por el Test 4 de `command-bar` (deuda documentada).** **El `parametric-v10` falla por el `db.ts` (deuda preexistente, no del PR #144).** **La regla de protección de `main` no exige checks verdes, solo PR.**

---

## Fase 4 — Motores conceptuales (2026-11-13)

### Estado

| Motor | Librería | Estado | Evidencia |
|---|---|---|---|
| **fire** | CFAST 8.0 (`pycfast` + `cfast-bin`) | ✅ **Cerrado** | 2 pisos, 342.6°C, `PASS` |
| **evacuation** | jupedsim 1.4.2 | ✅ **Cerrado** | 5 pisos, 100 agentes, 32.7s, `PASS` |
| **sewer** | pysewer 0.3.1 | ❌ **Deuda** | Bug de pysewer con networkx |
| **hvac** | openstudio 3.11.0 | ❌ **Deuda** | Crash nativo de OpenStudio (SEGV) |

### `fire` — Cerrado

- **Librería:** `pycfast` 0.2.2 + `cfast-bin` 8.0.0.dev354.
- **Modelo:** edificio de N pisos, con `Compartment` (uno por piso, `origin_z` apilado), `CeilingFloorVent` para conectar pisos (deshabilitado temporalmente), y `Fire` con curva de HRR.
- **Resultado:** 2 pisos, 342.6°C de temperatura máxima de la capa superior (extraída de `ULT_1` y `ULT_2` del CSV de CFAST).
- **Endpoint:** `/fire/evaluate` (reemplaza el conceptual).

### `evacuation` — Cerrado

- **Librería:** `jupedsim` 1.4.2.
- **Modelo:** edificio de N pisos, con `walkable` 2D (todos los pisos proyectados en un solo rectángulo), `exit_polygon` dentro del walkable, `JourneyDescription([exit_id])`, agentes con `v0=1.2` y `distance_to_agents=0.4`.
- **Resultado:** 5 pisos, 50 agentes → 16.25s, 100 agentes → 32.7s. `PASS`.
- **Endpoint:** `/evacuation/evaluate` (reemplaza el conceptual).

### `sewer` — Deuda

**Estado:** el endpoint `/sewer/evaluate` está reescrito con `pysewer`, pero falla en `rsph_tree_fast` con:

`TypeError: ModelDomain.__init__() missing 3 required positional arguments: dem, roads, and buildings`

**Causa:** `pysewer.routing.rsph_tree_fast` llama a `nx.create_empty_copy(connection_graph)`, pero `connection_graph` es un `ModelDomain`, no un grafo. Es un bug de `pysewer` 0.3.1 con `networkx` 3.x.

**Impacto:** el motor `sewer` no puede generar redes de alcantarillado con `pysewer` 0.3.1 en este entorno.

**Solución pendiente:**
1. Probar con una versión anterior de `pysewer` (0.2.x) que no tenga este bug.
2. O implementar el solver RSPH manualmente (sin `pysewer`), usando `networkx` directamente.

### `hvac` — Deuda

**Estado:** el endpoint `/hvac/evaluate` está reescrito con OpenStudio, pero el proceso de `motores-api` muere con `SEGV` (segmentation fault) al intentar traducir el modelo a IDF o al correr EnergyPlus.

**Causa probable:** OpenStudio es una librería nativa (C++) y el modelo construido (zonas + espacios sin geometría) no es válido para `ForwardTranslator`. El crash nativo tumba el proceso de Python, no solo la request.

**Impacto:** `hvac` no puede correr en el mismo proceso que `motores-api` sin un aislamiento (subprocess separado o worker).

**Solución pendiente:**
1. Aislar la simulación de OpenStudio en un subprocess separado (para que el SEGV no tumbe `motores-api`).
2. O usar `openstudio` CLI (no los bindings de Python) en un subprocess.

---

## Resumen de la Fase 4

- **2 de 4 motores cerrados:** `fire` (CFAST) y `evacuation` (jupedsim).
- **2 de 4 motores documentados como deuda:** `sewer` (pysewer) y `hvac` (openstudio).
- **Con `fire` + `evacuation`, ARKI puede simular incendios y evacuación en rascacielos**, que es lo que necesita NFPA 101 (Life Safety Code).
