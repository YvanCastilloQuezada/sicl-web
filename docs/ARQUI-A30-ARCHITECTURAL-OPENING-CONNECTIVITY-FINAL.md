# SiMS-DeI — ARQUI A30
# Architectural Opening, Connectivity and Access Evidence

## Estado final

**A30-P0/P1/P2 = PASS_WITH_OBSERVATIONS.** La capacidad implementada distingue límites espaciales, aperturas explícitas, binding geométrico, conexión observada y accesibilidad no evaluada. La implementación es un read model derivado del plan residencial y del modelo A29. No crea entidades persistentes de puertas, ventanas, muros ni BIM.

La autoridad humana se conserva. Una abertura no se convierte automáticamente en puerta, ventana, salida, ruta accesible o cumplimiento normativo.

## P0 — Auditoría de reutilización

El modelo `HOUSE-001-EXPLICIT` contiene siete espacios explícitos, muros, seis registros legacy de apertura, dos núcleos verticales y una ruta conceptual. Los seis registros legacy se conservan como evidencia histórica, pero no tienen extensión geométrica vinculada a un segmento A29, provenance suficiente para demostrar su origen geométrico ni estado explícito de atravesabilidad.

Por ello, la clasificación de P0 es **PARTIAL_BUT_REUSABLE**. A29 aporta segmentos de boundary y relaciones de `SHARED_BOUNDARY`. A20 aporta el grafo de evidencia de circulación y A20-P2 mantiene la evaluación de accesibilidad. A28 aporta el renderer y composer reutilizable.

La implementación no interpreta el campo legacy `kind: DOOR | WINDOW` como prueba suficiente de una puerta o ventana geométrica. La capa A30 usa el término genérico **OPENING**.

## P1 — Modelo derivado de apertura

Cada apertura A30 puede registrar `opening_id`, nivel, espacio anfitrión, espacio relacionado, extensión geométrica, rol, atravesabilidad, alternativa fuente, versión geométrica, referencias de evidencia, provenance, estado epistémico y estado de revisión humana.

El binding es válido solamente cuando la extensión de la apertura se encuentra sobre un segmento A29 compatible del mismo nivel, espacio anfitrión y espacio relacionado. No hay snapping silencioso. Si cambia la alternativa o la versión geométrica, la apertura se clasifica como `STALE` y no mantiene una conexión actual por inferencia.

La derivación conserva estados `VALID`, `INVALID`, `UNKNOWN` y `STALE`. Una abertura sin rol o atravesabilidad conocidos permanece sin conexión verificada. Una abertura no transitable puede estar observada, pero no genera conexión de circulación.

## P2 — Cadena integrada

La cadena positiva controlada fue demostrada con un fixture explícito y separado de la geometría de HOUSE-001:

```text
A29 SHARED_BOUNDARY
→ A30 EXPLICIT OPENING
→ VALID BOUNDARY BINDING
→ TRAVERSABLE
→ CONNECTION_OBSERVED
→ A20 CIRCULATION GRAPH INPUT
→ ACCESSIBILITY = NOT_ASSESSED
```

La cadena negativa también fue verificada. Una frontera compartida sin abertura queda como `NONE_OBSERVED`; una abertura fuera de boundary queda `INVALID`; una abertura no transitable o con atravesabilidad desconocida no se transforma en conexión observada. La intención A21 no crea una abertura y A16 no recibe una reparación automática.

A28 ahora puede mostrar un overlay semántico `OPENING_EVIDENCE`. El overlay usa un marcador genérico de apertura y no representa un giro de puerta, una ventana, un muro ni un elemento constructivo.

## HOUSE-001 — resultado real

| Nivel | Espacio | Relación boundary | Evidencia de apertura | Rol | Atravesabilidad | Conexión | Acceso | Estado | Provenance |
|---|---|---|---|---|---|---|---|---|---|
| N1 | LIVING | Compartida con HALL-N1 y KITCHEN según A29 | Registro legacy; sin extent | UNKNOWN | UNKNOWN | UNVERIFIED | UNVERIFIED | DERIVED / UNKNOWN binding | Plan residencial legacy + A30 audit |
| N1 | KITCHEN | Sin binding de apertura A30 | Registro legacy relacionado con LIVING | UNKNOWN | UNKNOWN | UNVERIFIED | UNVERIFIED | DERIVED / UNKNOWN binding | Plan residencial legacy |
| N1 | HALL-N1 | Relación declarada/geométrica revisable | Ninguna apertura geométrica A30 actual | UNKNOWN | UNKNOWN | UNVERIFIED | UNVERIFIED | UNKNOWN | A29 boundary read model |
| N2 | BED-01 | Compartida geométricamente con BATH; no con HALL-N2 según A29 | Registro `DOOR-BED-01`, sin extent | UNKNOWN | UNKNOWN | UNVERIFIED | UNVERIFIED | DERIVED / UNKNOWN binding | Plan residencial legacy + A30 audit |
| N2 | BED-02 | Boundary de espacio | Registro `DOOR-BED-02`, sin extent | UNKNOWN | UNKNOWN | UNVERIFIED | UNVERIFIED | DERIVED / UNKNOWN binding | Plan residencial legacy + A30 audit |
| N2 | BATH | Compartida con BED-01 y HALL-N2 | Registro `DOOR-BATH`, sin extent | UNKNOWN | UNKNOWN | UNVERIFIED | UNVERIFIED | DERIVED / UNKNOWN binding | Plan residencial legacy + A30 audit |
| N2 | HALL-N2 | Compartida con BATH y declarada hacia dormitorios | Registro legacy; sin extent | UNKNOWN | UNKNOWN | UNVERIFIED | UNVERIFIED | DERIVED / UNKNOWN binding | Plan residencial legacy + A30 audit |

La respuesta correcta para “¿cómo se accede al dormitorio 1?” con la evidencia actual es: **el espacio existe y tiene relaciones de contigüidad registradas, pero A30 no puede confirmar una abertura geométricamente vinculada entre BED-01 y HALL-N2; el acceso permanece UNVERIFIED**. Esto es un resultado válido, no un fallo del sistema.

## Controles negativos

Se cubrieron abertura sin boundary, binding fuera de boundary, contacto puntual o gap mediante la política A29, binding stale por cambio de alternativa o versión, geometría no suficiente, rol desconocido, atravesabilidad desconocida, abertura no transitable, boundary compartido sin abertura, intención sin abertura, ausencia de evidencia de accesibilidad y ausencia de aprobación automática.

No se fabricaron aperturas para mejorar la presentación de HOUSE-001. El fixture positivo fue aislado y no mutó el plan real.

## Validación

La prueba focalizada A30 ejecutó **9/9 tests PASS**. La suite Web completa ejecutó **65 archivos de prueba y 319 tests PASS**. TypeScript, build y `git diff --check` pasaron. El Core no fue modificado; su SHA permaneció en `646dae525dd1db4b9f357aced21cc1302fc791a0`, con compilación estática y `git diff --check` satisfactorios.

## Clasificación de capacidades

| Capacidad | Estado |
|---|---|
| Boundary observado | IMPLEMENTED via A29 reuse |
| Opening genérico | IMPLEMENTED as derived A30 read model |
| Opening-to-boundary binding | IMPLEMENTED, deterministic and bounded |
| Connection observed | IMPLEMENTED when binding and traversability are explicit |
| Circulation graph integration | IMPLEMENTED via A20 input composition |
| Accessibility certification | NOT IMPLEMENTED / remains A20-P2 |
| Door semantics | NOT IMPLEMENTED |
| Window semantics | NOT IMPLEMENTED |
| Wall/partition building-element hierarchy | NOT IMPLEMENTED |
| Exterior envelope reasoning | UNKNOWN / future |
| Fire exit or fire door reasoning | NOT IMPLEMENTED |
| Automatic opening creation | FORBIDDEN |

## Próxima ruptura causal

La siguiente capacidad causal es **DOOR/PASSAGE SEMANTICS**. A30 demuestra una conexión genérica, pero aún no modela hoja, marco, umbral, giro, ancho libre medido, control de acceso o clasificación normativa. Esa evolución requerirá una orden separada y no está incluida en este cierre.

## Invariantes conservados

```text
OPENING ≠ DOOR
OPENING ≠ WINDOW
OPENING ≠ WALL
SHARED_BOUNDARY ≠ OPENING
OPENING ≠ ACCESSIBLE
TRAVERSABLE ≠ ACCESSIBLE
CONNECTION ≠ COMPLIANCE
INTENT ≠ GEOMETRY
PRESENTATION ≠ SOURCE OF TRUTH
HUMAN CONFIRMATION ≠ CONSTRUCTION DETAIL
```

## Archivos de la fase

La fase modifica `a30ArchitecturalOpenings.ts`, extiende la integración existente en `a30AccessibleRouteVerification.ts`, añade el overlay genérico al composer A28 y agrega pruebas focalizadas. No modifica Core, Core Contract, persistencia ni entidades BIM.

**A30_STATUS = PASS_WITH_OBSERVATIONS**

**CORE_CHANGED = NO**

**AUTOMATIC_DOOR_OR_WINDOW_CREATED = NO**

**ACCESSIBILITY_CERTIFIED = NO**

**HUMAN_AUTHORITY = PRESERVED**

**REAL_GATE = NOT_TRIGGERED**

## Clasificación obligatoria

```text
A30 = PASS_WITH_OBSERVATIONS
A30_P0 = PASS
EXISTING_OPENING_SEMANTICS = PARTIAL_BUT_REUSABLE
A30_P1 = PASS
A30_P2 = PASS
OPENING_SEMANTICS = PARTIAL
OPENING_IDENTITY = PASS
BOUNDARY_BINDING = PASS
OPENING_GEOMETRY = PASS
OPENING_ROLE = PARTIAL
TRAVERSABILITY = PARTIAL
CONNECTION_INTEGRATION = PASS
ACCESS_INTEGRATION = PARTIAL
CIRCULATION_INTEGRATION = PASS
A20_INTEGRATION = PASS
A21_INTEGRATION = PARTIAL
A15_INTEGRATION = PARTIAL
A16_CONSUMPTION_READY = YES
A17_STALENESS_PROTECTION = PASS
A28_INTEGRATION = PASS
HOUSE_OPENINGS = 6
BEDROOM_1_ACCESS = UNVERIFIED
DOOR_INFERRED = NO
WINDOW_INFERRED = NO
WALL_INFERRED = NO
ACCESSIBILITY_COMPLIANCE = NOT_ASSESSED
REGULATORY_COMPLIANCE = NOT_ASSESSED
SOURCE_IMMUTABILITY = PASS
UNKNOWN_PRESERVATION = PASS
CONTRADICTION_PRESERVATION = PASS
FALSE_SUCCESS_PROTECTION = PASS
HUMAN_AUTHORITY = PRESERVED
FLOOR_PLAN_GENERATION_READINESS = PARTIAL
FIRST_CAUSAL_BREAK = DOOR / PASSAGE SEMANTICS
MINIMUM_NEXT_CAPABILITY = A31 ARCHITECTURAL PASSAGE / DOOR INTELLIGENCE
REAL_GATE = NOT_TRIGGERED
CORE_CHANGED = NO
WEB_CHANGED = YES
NEW_CANONICAL_ENTITY = NO
NEW_DERIVED_READ_MODEL = YES
NEW_GEOMETRY_ENGINE = NO
NEW_RENDERER = NO
NEW_CIRCULATION_GRAPH = NO
NEW_AUTHORITY_SYSTEM = NO
KNOWLEDGE_FEDERATION = FROZEN
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

## Origin of the A29 “explicit opening” language

A29 derives boundary observations from the explicit room footprints in `ResidentialPlan`. The residential plan also contains adjacency records marked `GEOMETRIC_OPENING` and six legacy `ResidentialOpening` records. However, the legacy records contain endpoint IDs, kind and nominal width only; they do not contain a boundary segment extent. Therefore A30 does not treat those records as geometrically proven openings. The A30 synthetic positive fixture is the first controlled record with an explicit extent, boundary binding and provenance.

## Floor-plan generation readiness

| Domain | State |
|---|---|
| Program understanding | PASS |
| Spatial relationships | PASS |
| Zoning | PASS |
| Parti | PARTIAL |
| Spatial organization | PASS |
| Space realization | PASS for explicit residential fixture |
| Boundary understanding | PASS |
| Opening understanding | PARTIAL |
| Connection understanding | PASS with explicit binding |
| Circulation | PARTIAL |
| Accessibility | PARTIAL; not certified |
| Multilevel | PASS / PARTIAL for vertical route evidence |
| Regulatory evidence | PARTIAL; not assessed for HOUSE-001 |
| Architectural reading | PASS |
| Critique | PASS |
| Revision | PASS with staleness protection |
| Visual presentation | PASS |
| Design memory | PASS |
| Floor-plan generation | PARTIAL; not construction-document generation |

**Recommendation.** The next causal capability should be **A31 Architectural Passage / Door Intelligence**, not wall or envelope intelligence. A30 has already established the minimum evidence chain from boundary to generic opening to connection. The next missing semantics are passage identity, clear width as measured evidence, threshold, operation, swing, access-control context and applicable fire/accessibility attributes. A31 must remain separate from automatic construction BIM authoring and must not infer door details from the current six legacy records.

**STOP.** A31 is not implemented by this order.
