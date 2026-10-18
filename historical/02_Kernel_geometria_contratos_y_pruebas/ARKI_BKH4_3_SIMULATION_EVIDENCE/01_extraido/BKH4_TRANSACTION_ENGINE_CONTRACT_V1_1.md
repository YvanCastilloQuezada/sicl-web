# ARKI — BKH-4 Transaction Engine
## Contract Design v1.0

**Sistema:** ARKI — Architectural Intelligence

**Programa:** BIM Kernel Hardening

**Fase:** BKH-4 — Transaction Engine

**Tipo de documento:** diseño contractual; no implementación

**Product Owner y autoridad humana:** Yvan Castillo

**Estado:** COMPLETED / PENDING INDEPENDENT REVIEW

**Implementación:** bloqueada

**Fecha:** 23 de septiembre de 2026

---

## 0. Decisión de alcance

Este documento define el contrato que deberá gobernar las mutaciones del estado canónico de ARKI. No crea interfaces, tipos, funciones, migraciones, pruebas de producto ni cambios en el repositorio. Ninguna sección de este documento autoriza escribir código.

La implementación de BKH-4 sólo podrá comenzar después de una revisión independiente del contrato y de una autorización explícita del Product Owner. El contrato podrá recibir correcciones antes de esa autorización.

BKH-4 no reabre E5, E6 ni E7. Tampoco inicia E8 ni BKH-5, BKH-6 o BKH-7.

## 1. Baseline vinculante

El diseño parte de los siguientes estados declarados:

| Componente | Estado de entrada | Frontera para BKH-4 |
|---|---|---|
| BKH-0 — Forensic Mapping | VERIFIED / RECONCILED | Diagnóstico y ownership no se resuelven automáticamente |
| BKH-1 — Relationship Fabric | VERIFIED / HARDENED | BKH-4 consume sus contratos y registros |
| BKH-2 — Constraint Engine | VERIFIED / HARDENED | BKH-4 consume sus estados y gates |
| BKH-3 — Regeneration Engine | VERIFIED / HARDENED | BKH-4 solicita impacto y regeneración; no la duplica |
| BKH-4 — Transaction Engine | CONTRACT DESIGN ONLY | Implementación bloqueada |
| BKH-5 — Documentation Compiler | BLOCKED | Fuera de alcance |
| BKH-6 — Performance Baseline | BLOCKED | Fuera de alcance |
| BKH-7 — Integrated Torture Test | BLOCKED | Fuera de alcance |
| E5, E6 y E7 | FROZEN | No reabrir |
| E8 | NOT STARTED | No iniciar |

El worktree histórico sucio, los bypasses legacy y las decisiones de ownership no resueltas forman parte de las precondiciones del diseño. No se presentarán como solucionados por este contrato.

## 2. Misión

BKH-4 deberá proporcionar una unidad explícita, identificable, versionada, trazable y gobernada de cambio propuesto sobre el estado canónico de un proyecto.

El objetivo es permitir el siguiente flujo:

```text
CURRENT CANONICAL STATE
        ↓
PROPOSED MUTATION
        ↓
SIMULATION
        ↓
IMPACT ANALYSIS
        ↓
CONSTRAINT VALIDATION
        ↓
REGENERATION
        ↓
CONSEQUENCE EVALUATION
        ↓
HUMAN REVIEW / AUTHORITY
        ↓
COMMIT
        ↓
NEW CANONICAL STATE
```

El flujo deberá preservar atomicidad, identidad, versiones, trazabilidad, consistencia, estado `UNKNOWN`, autoridad humana, ausencia de estado stale y ausencia de mutación silenciosa.

## 3. Definición canónica

Una **transacción ARKI** es una unidad gobernada de cambio propuesta sobre un estado canónico. La transacción se evalúa contra una versión base, sus revisiones de entidades, sus relaciones, sus restricciones, sus dependencias, sus fingerprints y su contexto relevante antes de poder producir una nueva versión canónica.

Una transacción no es una acción de interfaz, un comando de teclado, una regeneración, una mutación directa, un autosave, una decisión humana ni un snapshot. Cada uno de esos conceptos puede participar en una transacción, pero no la sustituye.

El principio objetivo es:

> **No puede producirse mutación canónica sin una transacción válida cuando la capacidad haya sido migrada formalmente a BKH-4.**

Este principio es una meta de migración. No se afirmará que todo ARKI ya lo cumple, porque BKH-0 identificó rutas directas y legacy que todavía requieren tratamiento.

## 4. Estados de una transacción

BKH-4 deberá conservar una máquina de estados explícita. La implementación deberá demostrar que cada transición está gobernada, es trazable y no colapsa estados epistemológicamente distintos.

| Estado | Significado contractual |
|---|---|
| `DRAFT` | La propuesta existe, pero está incompleta o aún no fue presentada para evaluación |
| `PROPOSED` | La propuesta contiene un mutation set y una versión base declarada |
| `SIMULATING` | Se está construyendo el estado transaccional sin tocar el estado canónico |
| `SIMULATED` | La simulación terminó y produjo sus resultados declarados |
| `VALIDATING` | Se evalúan precondiciones, constraints, freshness y gates |
| `VALID` | Las validaciones conocidas pasan y no existe un bloqueo pendiente |
| `INVALID` | Una condición conocida impide la validez |
| `UNKNOWN` | La evidencia, dependencia, solver u oracle requerido no permite concluir |
| `AWAITING_HUMAN_DECISION` | Se requiere una decisión humana explícita |
| `AUTHORIZED` | La autoridad requerida autorizó el commit de la propuesta exacta |
| `REJECTED` | Una autoridad rechazó la propuesta |
| `COMMITTING` | El commit atómico se encuentra en ejecución |
| `COMMITTED` | El mutation set autorizado produjo una nueva versión canónica completa |
| `ABORTED` | La transacción terminó antes de un commit exitoso |
| `FAILED` | Una operación falló durante la ejecución y no equivale a una invalidación semántica |
| `STALE` | La propuesta dejó de ser válida contra el estado actual por cambio de inputs relevantes |
| `RECOVERY_REQUIRED` | El sistema no puede determinar todavía el resultado de una operación interrumpida |

Las siguientes distinciones son obligatorias:

- `INVALID` no equivale a `UNKNOWN`.
- `FAILED` no equivale a `INVALID`.
- `REJECTED` no equivale a `FAILED`.
- `STALE` no equivale a `INVALID`.
- `ABORTED` no equivale a `ROLLED_BACK`.
- `RECOVERY_REQUIRED` no equivale a `COMMITTED`.

La implementación podrá ajustar el catálogo únicamente mediante un ADR y pruebas de transición completas. No podrá eliminar distinciones sólo para simplificar la interfaz.

## 5. Identidad y revisiones

La identidad de una transacción deberá permanecer separada de la identidad de sus revisiones.

El contrato mínimo deberá contemplar:

```text
transactionId
transactionRevisionId
projectId
baseProjectVersion
proposedBy
createdAt
intent
mutationSet
status
provenance
```

La modificación de una propuesta no deberá crear silenciosamente otra transacción. Deberá producir una nueva revisión de la misma identidad o una nueva transacción sólo cuando el contrato determine que el cambio constituye una intención distinta.

La implementación deberá preservar también la relación entre:

```text
Transaction
ProjectVersion
Snapshot
EntityRevision
RelationshipRevision
ConstraintRevision
DerivedFingerprint
```

No se resolverá por conveniencia ningún ownership que BKH-0 haya clasificado como `ARCHITECTURAL_DECISION_REQUIRED`.

## 6. Mutation Set

El mutation set deberá ser declarativo, tipado, serializable, determinista y validable. Cada mutación deberá expresar como mínimo:

```text
target
operation
before
proposedAfter
expectedRevision
provenance
reason
intent
```

Las operaciones iniciales que deberán evaluarse, sin congelarlas antes de la auditoría de implementación, son:

```text
CREATE_ENTITY
UPDATE_PROPERTY
MOVE_ENTITY
DELETE_ENTITY
ADD_RELATIONSHIP
REMOVE_RELATIONSHIP
UPDATE_PARAMETER
```

La enumeración final deberá surgir de la auditoría de los escritores actuales y de los contratos BKH-1, BKH-2 y BKH-3. No se aceptará una lista decorativa que no cubra las mutaciones reales del Generador, los adapters, la persistencia y las rutas legacy.

Quedan prohibidos:

- `eval()`.
- `Function()`.
- JavaScript arbitrario embebido en una mutación.
- Callbacks opacos que muten el estado canónico.
- Strings interpretados como código ejecutable.
- Mutation sets no tipados cuya semántica dependa de convenciones ocultas.

## 7. Pipeline canónico

La implementación deberá demostrar este pipeline, sin saltos silenciosos:

```text
INTENT
  ↓
TRANSACTION PROPOSAL
  ↓
BASE VERSION CAPTURE
  ↓
MUTATION SET
  ↓
SIMULATION
  ↓
BKH-1 RELATIONSHIP IMPACT
  ↓
BKH-2 PRECONDITIONS
  ↓
BKH-3 REGENERATION
  ↓
BKH-2 POSTCONDITIONS
  ↓
CONSEQUENCE SET
  ↓
REVIEW
  ↓
HUMAN AUTHORIZATION, WHEN REQUIRED
  ↓
COMMIT
  ↓
NEW VERSION
  ↓
AUDIT / PROVENANCE
```

Cada etapa deberá conservar su resultado, su estado, sus diagnósticos y sus dependencias. Una etapa no podrá inferirse como exitosa porque la siguiente haya producido una salida.

## 8. Precondiciones

Antes de simular o aplicar un mutation set, BKH-4 deberá evaluar, cuando corresponda:

1. Existencia del target.
2. Coincidencia de la revisión esperada.
3. Permisos técnicos.
4. Autoridad profesional o humana requerida.
5. Prerrequisitos de relaciones.
6. Prerrequisitos de constraints.
7. Disponibilidad del estado fuente.
8. Disponibilidad de dependencias.
9. Disponibilidad de evidencia requerida.
10. Freshness de la versión base.

La falta de evidencia deberá producir `UNKNOWN` con una razón explícita. Nunca podrá transformarse en `VALID`, `SATISFIED` o autorización implícita.

## 9. Simulación

La simulación deberá operar sobre un estado transaccional aislado:

```text
canonical state S0 + mutation M → simulated state S*
```

La simulación no podrá mutar el estado canónico, el estado de otra transacción ni una representación presentada como current.

La implementación deberá demostrar:

```text
hash(S0 antes de simular) = hash(S0 después de simular)
```

salvo metadata transaccional no canónica expresamente permitida.

La simulación deberá producir, cuando corresponda:

- Estado propuesto.
- Entidades afectadas.
- Dirty set.
- Evaluación de constraints.
- Estados `UNKNOWN`.
- Consecuencias.
- Plan de regeneración.
- Diagnósticos.
- Provenance.
- Fingerprints utilizados.

## 10. Integración con BKH-1

BKH-4 consumirá Relationship Fabric. No creará un segundo motor relacional.

Una mutación podrá crear, modificar o retirar una relación, o afectar entidades relacionadas, pero deberá utilizar los contratos, identidades, revisiones y reglas de BKH-1. No podrá mantener arrays paralelos ad hoc como autoridad relacional.

El impacto relacional deberá ser trazable desde el mutation set hasta el conjunto de entidades afectadas.

## 11. Integración con BKH-2

BKH-4 consumirá Constraint Engine para precondiciones, evaluación del estado simulado, postcondiciones, gates de commit y decisiones que requieran autoridad humana.

Deberá preservar los estados:

```text
SATISFIED
VIOLATED
UNKNOWN
NOT_APPLICABLE
CONFLICTING
ERROR
```

Una transacción no podrá auto-certificarse como válida mediante un callback de confianza, una bandera local o una sustitución de resultados de BKH-2.

La falta de evidencia deberá seguir siendo `UNKNOWN`. El commit de una transacción no convierte una suposición en hecho ni una inferencia en verificación profesional.

## 12. Integración con BKH-3

BKH-4 solicitará a BKH-3 el impacto, el dirty set mínimo, el plan de regeneración, el estado derivado regenerado, la freshness y los resultados por nodo.

BKH-4 no duplicará el algoritmo de propagación ni creará un regenerador paralelo.

Los resultados `PARTIAL`, `BLOCKED`, `UNKNOWN` y `FAILED` no podrán convertirse silenciosamente en `VALID`, `AUTHORIZED` o `COMMITTED`.

La frontera será explícita:

```text
BKH-3 propone y evalúa estado derivado.
BKH-4 gobierna la transición del estado canónico.
```

## 13. Atomicidad

La atomicidad deberá definirse respecto de cada clase de estado.

La regla mínima para mutaciones canónicas autorizadas es:

```text
TODAS LAS MUTACIONES CANÓNICAS AUTORIZADAS SE COMMIT
O
NINGUNA MUTACIÓN CANÓNICA SE COMMIT
```

La implementación deberá evitar estados como:

```text
wall moved
relationship changed
quantity half-updated
cost stale
transaction reported success
```

El contrato deberá distinguir estas fronteras:

| Clase | Tratamiento requerido |
|---|---|
| Canonical source state | Debe respetar atomicidad del commit |
| Derived state | Puede regenerarse después del commit si se invalida explícitamente |
| Cached representation | Debe invalidarse o actualizarse con estado trazable |
| External artifact | No forma parte automáticamente del commit interno |
| External side effect | Requiere registro y tratamiento de fallo separado |

El commit nunca podrá declarar éxito si sólo una parte del mutation set llegó al estado canónico.

## 14. Autoridad de commit

El contrato deberá responder explícitamente quién puede proponer, simular, validar, autorizar y hacer commit.

ARKI podrá proponer, simular, analizar, regenerar, comparar, explicar y recomendar. No podrá convertir automáticamente una decisión profesional o humana requerida en estado canónico.

La implementación deberá separar:

```text
technical permission ≠ professional authority ≠ human decision
```

Tener permiso técnico de edición no implica autoridad para aceptar consecuencias estructurales, MEP, normativas o profesionales.

## 15. Human Decision Record

BKH-4 diseñará sólo el registro mínimo para asociar una decisión humana con una transacción. El registro deberá contemplar:

```text
transactionId
decisionId
actor
decisionType
timestamp
evidenceReviewed
conditions
provenance
```

BKH-4 no implementará en esta fase un sistema transversal completo de `HumanDecision`. Tampoco duplicará una entidad de decisión ya existente sin ADR de consolidación.

## 16. Concurrencia optimista y stale

Una transacción deberá conservar su versión base y convertirse en `STALE` cuando cambien inputs relevantes desde la simulación o validación.

La freshness deberá considerar, según corresponda:

- Versión base.
- Revisiones de fuente.
- Relaciones.
- Constraints.
- Contexto relevante.
- Versiones de regeneradores.
- Datasets u oracles requeridos.
- Fingerprints derivados.

Ejemplo contractual:

```text
T1.baseVersion = V10
currentProjectVersion = V11
commit(T1) → STALE / CONFLICT
```

No se permitirá last-write-wins silencioso, retry automático, merge automático ni overwrite sin un contrato específico aprobado.

Dos transacciones que parten de V10 deberán conservar identidades separadas. Si T1 produce V11, T2 deberá revalidarse o quedar stale; no podrá sobrescribir V11 silenciosamente.

## 17. Commit

El commit será una operación explícita y gobernada. Un commit exitoso deberá producir:

```text
previousProjectVersion
newProjectVersion
transactionId
committedMutationSet
canonicalChanges
derivedStateDisposition
provenance
auditRecord
```

La transición a `COMMITTED` sólo será válida si el mutation set autorizado se aplicó completo y la nueva versión canónica es verificable.

La regeneración posterior deberá indicar si el estado derivado quedó actualizado, invalidado, pendiente, bloqueado o desconocido.

## 18. Abort, rollback y reversión histórica

`ABORTED` significa que la transacción terminó antes de un commit exitoso. Si no hubo mutación canónica, no se requiere rollback canónico.

`ROLLBACK` deberá reservarse para restaurar el estado canónico cuando un commit falle parcialmente y el contrato lo permita.

La reversión histórica de una transacción ya comprometida es una operación distinta. No deberá confundirse con cargar un snapshot antiguo.

El contrato de implementación deberá definir dos casos separados:

1. **Failed-commit rollback:** restauración de un commit incompleto.
2. **Historical reversal:** nueva operación gobernada que revierte una transacción ya comprometida.

Ninguno de los dos conceptos podrá borrar el historial de auditoría.

## 19. Undo y redo

Undo y redo no serán simples botones de interfaz.

La semántica propuesta es:

```text
UNDO = nueva operación gobernada que invierte una transacción comprometida
REDO = nueva operación gobernada que reaplica una operación aún válida
```

La implementación deberá resolver qué ocurre con la identidad original, las transacciones posteriores, las dependencias modificadas, el estado stale y los efectos externos.

El default contractual recomendado es que undo y redo creen operaciones nuevas, auditables y sujetas a validación. No deberán borrar historia ni cargar snapshots antiguos sin evaluar sus consecuencias.

## 20. Crash recovery

El diseño deberá cubrir un proceso interrumpido durante `SIMULATING`, `VALIDATING` y `COMMITTING`.

Especialmente, si el proceso cae durante un commit parcial, el sistema deberá poder determinar o declarar explícitamente:

```text
NOT_COMMITTED
COMMITTED
RECOVERY_REQUIRED
UNKNOWN_COMMIT_STATE
```

Nunca se asumirá éxito por ausencia de error observable. El journal y la versión canónica deberán permitir reconstruir el estado real o declarar que la evidencia es insuficiente.

## 21. Transaction Journal

BKH-4 deberá diseñar un journal append-only o un mecanismo equivalente con las garantías necesarias para reconstruir:

- Qué se propuso.
- Contra qué versión se evaluó.
- Qué se simuló.
- Qué constraints se evaluaron.
- Qué se autorizó.
- Qué se commitió.
- Quién autorizó.
- Cuándo ocurrió cada transición.
- Qué evidencia fue revisada.
- Qué consecuencias y efectos externos fueron registrados.

El journal es una especificación contractual en esta fase. No se implementará junto con el diseño.

## 22. Snapshots y límites de persistencia

El contrato deberá determinar si un snapshot funciona como prerrequisito, optimización, mecanismo de recuperación, artefacto de auditoría o combinación de estos papeles.

No se podrá asumir que:

```text
TRANSACTION = SNAPSHOT
UNDO = LOAD OLD SNAPSHOT
```

La relación entre snapshots, project versions, entity revisions, transaction revisions y derived fingerprints deberá quedar explícita antes de implementar.

## 23. Efectos externos

El commit interno y un efecto externo no forman automáticamente una transacción distribuida.

El contrato deberá distinguir:

```text
INTERNAL CANONICAL COMMIT
≠
EXTERNAL SIDE EFFECT
```

Se deberán contemplar exportaciones, APIs externas, notificaciones, futuras escrituras en hosts BIM, bases de datos y otros efectos irreversibles.

Para cada efecto externo deberán definirse momento de ejecución, estado registrado, fallo, reintento permitido y relación con el commit interno. BKH-4 no implementará transacciones distribuidas.

## 24. Rutas legacy y bypasses

Durante la implementación deberá auditarse, sin asumir que una ruta es canónica por su nombre:

```text
GeneratorModule → ProjectContext
arkiRecalculation
arki4d
arki5d
legacy adapters
persistence writers
IFC import/export writers
```

Cada ruta deberá registrar:

```text
currentWriter
targetState
canonicalOrDerived
transactionRelevance
migrationRequirement
bypassRisk
futureTreatment
```

Las rutas legacy no se corregirán durante este diseño contractual. El contrato deberá decidir cuáles requieren adapter gobernado, migración, deprecación, bloqueo fail-closed o decisión arquitectónica.

## 25. Ownership matrix

BKH-4 deberá entregar una matriz explícita para:

```text
ConstructionModel
Geometry
Relationship
Constraint
Quantity
Cost
Schedule
ProjectVersion
Snapshot
SceneModel
HumanDecision
```

Cada elemento se clasificará como:

```text
CANONICAL_SOURCE
CANONICAL_METADATA
DERIVED
CACHE
REPRESENTATION
EXTERNAL
OWNERSHIP_UNRESOLVED
```

La matriz no podrá resolver arbitrariamente los conflictos que BKH-0 identificó. Si el diseño no puede continuar sin decidir un owner, deberá declarar `ARCHITECTURAL_DECISION_REQUIRED` y detener esa parte del contrato.

## 26. Aislamiento

Una transacción en simulación no deberá contaminar:

- Otra transacción.
- El estado canónico.
- El trabajo futuro de otro usuario.
- Una caché presentada como current.
- Un snapshot que no corresponda a su versión.

El diseño deberá distinguir como mínimo:

```text
transaction-local state
canonical state
derived transaction state
external artifact state
```

## 27. Nested transactions

Para la versión inicial se recomienda:

```text
NESTED TRANSACTIONS = NOT SUPPORTED
```

Un proceso interno podrá componerse dentro de una transacción, pero no podrá convertirse silenciosamente en otra transacción independiente. Cualquier soporte posterior requerirá contrato, estados, aislamiento, journal y pruebas propios.

## 28. Escalas y disciplinas

Una transacción podrá afectar varias escalas sólo mediante dependencias explícitas. No podrá extrapolar automáticamente un cambio de componente hacia sitio, ciudad u otra escala.

Una transacción podrá generar consecuencias interdisciplinarias, pero una consecuencia detectada no equivale a cálculo profesional.

El sistema deberá conservar `UNKNOWN`, `NOT_DEMONSTRATED` y `EXTERNAL_ORACLE_REQUIRED` cuando no exista el solver, el host o la evidencia autorizada.

## 29. Seguridad epistémica

El commit establece el estado del proyecto; no convierte automáticamente ese estado en verdad sobre el mundo.

La implementación deberá impedir las transformaciones silenciosas:

```text
GENERATED → FACT
UNKNOWN → SATISFIED
ASSUMPTION → VERIFIED
```

Las afirmaciones de Structural y MEP deberán conservar sus límites. `MEP VERIFIED` en un fixture topológico no podrá promocionarse a cálculo MEP profesional firmado.

## 30. Modelo de fallos

El contrato deberá distinguir como mínimo:

```text
INVALID_MUTATION
MISSING_TARGET
REVISION_CONFLICT
STALE_BASE
CONSTRAINT_VIOLATION
CONSTRAINT_UNKNOWN
REGENERATION_BLOCKED
REGENERATION_FAILED
MISSING_DEPENDENCY
AUTHORIZATION_REQUIRED
AUTHORIZATION_REJECTED
COMMIT_FAILURE
RECOVERY_REQUIRED
EXTERNAL_SIDE_EFFECT_FAILURE
UNKNOWN_COMMIT_STATE
```

No se podrá colapsar todo en `FAILED`. La causa, el estado epistemológico, la reversibilidad y la acción permitida deberán permanecer separables.

## 31. Requisitos de evidencia para la implementación futura

Ninguna fase de implementación podrá declararse `VERIFIED` sólo por compilación.

La futura entrega deberá incluir, como mínimo:

1. Contratos y schemas versionados.
2. Tests positivos y negativos de cada estado.
3. Prueba de simulación sin mutación canónica.
4. Prueba de atomicidad para mutation sets múltiples.
5. Prueba de revisión y conflicto stale.
6. Prueba de UNKNOWN por falta de evidencia o dependencia.
7. Prueba de integración BKH-1/BKH-2/BKH-3 sin duplicación.
8. Prueba de rechazo de `eval`, `Function` y callbacks arbitrarios.
9. Prueba de abort, rollback y reversión histórica separados.
10. Prueba de crash recovery y `UNKNOWN_COMMIT_STATE`.
11. Prueba de aislamiento entre transacciones.
12. Prueba de journal reconstruible.
13. Prueba de Human Authority.
14. Prueba de rutas legacy y clasificación de bypasses.
15. Manifest, outputs crudos, hashes individuales y hash del paquete.
16. Declaración explícita de limitaciones y decisiones pendientes.

Las capturas de interfaz no sustituyen estas pruebas. Las pruebas de contrato no sustituyen pruebas browser cuando se afirme persistencia o restauración browser.

## 32. Secuencia contractual de implementación futura

La implementación deberá dividirse en entregas pequeñas y verificables. La secuencia propuesta es:

| Entrega | Alcance | Gate de salida |
|---|---|---|
| BKH4-0 | Baseline, invariantes, ownership matrix y mutation inventory | Contrato ejecutable sin mutaciones |
| BKH4-1 | Transaction identity, revisions y state machine | Transiciones deterministas y serialización |
| BKH4-2 | Mutation Set declarativo y validación de inputs | Sin ejecución arbitraria |
| BKH4-3 | Simulation sandbox y isolation | Canonical state hash unchanged |
| BKH4-4 | Integración BKH-1/BKH-2/BKH-3 | Sin motores paralelos ni auto-certificación |
| BKH4-5 | Stale, optimistic concurrency y conflicts | No silent overwrite |
| BKH4-6 | Atomic commit, abort y failure model | All-or-none en canonical state |
| BKH4-7 | Journal, recovery y external side-effect boundaries | Reconstrucción auditable |
| BKH4-8 | Undo/redo y historical reversal | Nuevas operaciones gobernadas |
| BKH4-9 | Legacy migration adapters | Writers clasificados y fail-closed |
| BKH4-10 | Torture, regression y evidence closure | Veredicto independiente |

Esta secuencia no autoriza automáticamente ninguna entrega. Cada una necesitará orden específica, alcance cerrado y evidencia propia.

## 33. Exclusiones explícitas

Este contrato no autoriza:

- Transaction Engine implementado.
- Commit, rollback, undo o redo implementados.
- Worksharing multiusuario.
- Ownership consolidation automática.
- BKH-5, BKH-6 o BKH-7.
- E8.
- Nuevos solvers profesionales.
- Hosts Revit, Dynamo, Rhino, Grasshopper o Blender.
- IFC profesional completo.
- Cambios en E5, E6 o E7.
- Avatar, Academy, Luka o WebXR.
- Nuevos motores paralelos.

## 34. Criterios de aprobación del contrato

El contrato podrá pasar a `APPROVED` sólo si la revisión independiente confirma que:

1. La frontera entre BKH-3 y BKH-4 está clara.
2. La atomicidad distingue canonical, derived y external state.
3. La identidad transaccional está separada de las revisiones.
4. Los estados `UNKNOWN`, `STALE`, `FAILED`, `ABORTED` y `RECOVERY_REQUIRED` no se colapsan.
5. Human Authority no queda sustituida por permisos técnicos.
6. Las rutas legacy están inventariadas sin ser falsamente declaradas migradas.
7. Ownership no resuelto permanece explícito.
8. Simulation no implica mutación canónica.
9. No existe ejecución arbitraria en mutation sets.
10. Commit, rollback, undo y redo tienen semánticas separadas.
11. Crash recovery y efectos externos tienen fronteras explícitas.
12. El plan de evidencia permite distinguir `IMPLEMENTED`, `VERIFIED` y `E2E VERIFIED`.

## 35. Estado final del documento

```text
BKH-4 CONTRACT DESIGN: PROPOSED FOR REVIEW
BKH-4 IMPLEMENTATION: BLOCKED
BKH-4 AUTHORIZATION: NOT GRANTED
BKH-5/BKH-6/BKH-7: BLOCKED
E5/E6/E7: FROZEN
E8: NOT STARTED
```

La siguiente acción autorizable es la **revisión independiente de este contrato**. Hasta que exista aprobación explícita del Product Owner, el repositorio no debe recibir implementación BKH-4.

**STOP.**

## References

[1]: file:///home/ubuntu/generador-familias/BKH_KERNEL_INVARIANT_MASTER_MATRIX.md "ARKI BKH Kernel Invariant Master Matrix"

[2]: file:///home/ubuntu/generador-familias/BKH_KERNEL_BYPASS_AUDIT.md "ARKI BKH Kernel Bypass Audit"

[3]: file:///home/ubuntu/generador-familias/BKH_93C_FINAL_REPORT.md "ARKI BKH-0 to BKH-3 Kernel Closure Report"

---

## 36. Anexos contractuales 94A

La revisión 94A conserva el núcleo conceptual de v1.0 y añade seis artefactos obligatorios. Estos anexos forman parte del contrato v1.1 y no autorizan implementación:

1. [BKH4 Invariant Registry](BKH4_INVARIANT_REGISTRY.md).
2. [BKH4 Adversarial Test Plan](BKH4_TEST_PLAN.md).
3. [BKH4 Torture Scenarios](BKH4_TORTURE_SCENARIOS.md).
4. [BKH4 Legacy Mutation Migration Matrix](BKH4_LEGACY_MUTATION_MIGRATION_MATRIX.md).
5. [BKH4 Transaction Ownership Matrix](BKH4_TRANSACTION_OWNERSHIP_MATRIX.md).
6. [BKH4 Open Questions](BKH4_OPEN_QUESTIONS.md).

El registro contiene 23 invariantes contractuales. El plan contiene 42 escenarios adversariales. Las preguntas abiertas Q1–Q10 están clasificadas según su estado contractual. La matriz de ownership conserva explícitamente los conflictos identificados por BKH-0.

## 37. Gate de persistencia atómica

La evidencia actual demuestra persistencia local, serialización y fixtures, pero no demuestra una primitive durable de commit atómico ni recuperación confiable ante crash durante commit. Por tanto:

```text
ATOMIC_COMMIT_PERSISTENCE = IMPLEMENTATION_PREREQUISITE
```

BKH4-6, crash recovery y cualquier afirmación de commit atómico permanecen bloqueados hasta que esta primitive exista y sea verificada. No se permite simular atomicidad cargando snapshots antiguos ni presentar snapshot persistence como transaction commit.

## 38. Estado v1.1

```text
BKH-4 CONTRACT v1.1: COMPLETED / PENDING INDEPENDENT REVIEW
BKH-4 IMPLEMENTATION: BLOCKED
ATOMIC_COMMIT_PERSISTENCE: IMPLEMENTATION_PREREQUISITE
BKH-5/BKH-6/BKH-7: BLOCKED
E5/E6/E7: FROZEN
E8: NOT STARTED
```

**STOP.**
