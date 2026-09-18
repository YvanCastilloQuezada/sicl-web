# SiMS-DeI — ARQUI A21
# Architectural Design Backbone: HOUSE-A21 Controlled Proof

## 1. Estado y alcance

```text
A21 = IMPLEMENTED / DERIVED WEB READ MODEL
A21-P0R = PASS
A21-P1 = PASS
A21-P2 = PASS
CONTROLLED_HOUSE_PROOF = PASS
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_DEPENDENCY = NO
PERSISTENCE_ADDED = NO
HUMAN_AUTHORITY = PRESERVED
DECISION_CREATED = FALSE
WINNER_CREATED = FALSE
REGULATORY_CLAIM_CREATED = FALSE
GEOMETRY_CREATED_BY_A21 = FALSE
```

A21 implementa únicamente la cadena **PROGRAM → RELATIONSHIPS → FUNCTIONAL ZONING**. No implementa una planta arquitectónica constructiva, no genera habitaciones geométricas, no crea muros, puertas, ventanas, ductos o instalaciones, y no activa Knowledge Federation ni inferencia normativa.

## 2. Baselines

```text
EXPECTED_CORE_SHA = 646dae525dd1db4b9f357aced21cc1302fc791a0
ACTUAL_CORE_SHA = 646dae525dd1db4b9f357aced21cc1302fc791a0
EXPECTED_WEB_SHA = 3d908e8f06f043073ed132c17abe3c92a60bfcb0
ACTUAL_WEB_SHA_BEFORE_A21 = ba7852b30b05f1d1058eb1ceb646a4d2c57eec0d
```

La diferencia del Web respecto del baseline esperado corresponde a trabajo autorizado y previamente existente en la rama activa; no se hizo reset ni limpieza amplia de archivos históricos no relacionados. El Core permaneció intacto.

## 3. A21-P0R — reutilización y no duplicación

Se verificaron A11/A12/A13, el modelo A21 existente de relaciones y memoria, A20-P1, A29, A30, HOUSE-001 y sus fuentes de provenance. La implementación nueva compone el vocabulario y los validadores A21 existentes; no crea una entidad Core, no crea persistencia y no crea una segunda SpatialRepresentation.

`HouseA21Proof` es un **read model de prueba controlada**, no un nuevo modelo canónico de programa. Sus nodos se expresan con el `ProgramNode` y los tipos de relación ya existentes. HOUSE-A21 sirve para demostrar trazabilidad de intención humana antes de la geometría.

## 4. A21-P1 — programa a grafo de relaciones

El fixture controlado contiene **10 ítems programáticos**: estar/comedor, cocina, baño social, dormitorio principal, dormitorio secundario, baño privado, circulación N1, circulación N2, acceso y patio.

Se registraron **7 relaciones**, todas de origen humano explícito en el fixture:

| Relación | Tipo | Prioridad | Lectura |
|---|---|---|---|
| Living/dining ↔ main bedroom | REQUIRED_SEPARATION | MUST | Separación social/privada |
| Living/dining ↔ bedroom 2 | REQUIRED_SEPARATION | MUST | Separación social/privada |
| Kitchen ↔ living/dining | PREFERRED_ADJACENCY | SHOULD | Proximidad de servicio y comedor |
| Living/dining ↔ patio | VISUAL_CONNECTION | SHOULD | Relación visual exterior |
| Upper circulation → main bedroom | CONTROLLED_ACCESS | MUST | Acceso privado controlado |
| Access → living/dining | SEQUENTIAL_RELATION | MUST | Secuencia de llegada |
| Ground circulation ↔ upper circulation | VERTICAL_RELATION | MUST | Continuidad multinivel |

```text
HUMAN_SOURCED_EDGES = 7
DERIVED_EDGES = 0
AI_PROPOSED_EDGES = 0
CONFLICTS = 0
```

Cada relación conserva intención, prioridad semántica, dirección explícita, estado epistemológico y provenance. No se aplican pesos numéricos ocultos.

## 5. A21-P2 — relaciones a zonificación funcional

La propuesta produce zonas funcionales con estado `PROPOSED`, sin geometría y sin decisión:

```text
PUBLIC
SERVICE
PRIVATE
TRANSITION
ACCESS
OUTDOOR
```

La explicación generada para el arquitecto es legible y trazable: separa áreas sociales de dormitorios, relaciona cocina y comedor, mantiene la relación visual con el patio, y controla el acceso al dormitorio principal desde la circulación privada. La salida se presenta como **hipótesis de organización previa a la geometría**, no como planta realizada.

La transición de privacidad queda explicitada como:

```text
ACCESS → PUBLIC/SOCIAL
PUBLIC/SOCIAL → TRANSITION/CIRCULATION
TRANSITION/CIRCULATION → PRIVATE
```

## 6. HOUSE-001 controlled proof

El runtime reproducible `/tmp/a21_runtime_result.json` confirmó:

```text
PROOF_ID = HOUSE-A21
VALID = TRUE
PROGRAM_COUNT = 10
RELATIONSHIP_COUNT = 7
GEOMETRY_CREATED = FALSE
DECISION_CREATED = FALSE
```

Se preservan como `UNKNOWN` las relaciones o datos no suministrados: adyacencia dormitorio secundario–baño privado, requisitos exactos de accesibilidad y requisitos regulatorios. No fueron inventados.

## 7. Comparación read-only contra HOUSE-001

La comparación utiliza A29 y A30 únicamente como observación del estado existente:

```text
A29 = GEOMETRIC_ADJACENCY_OBSERVED
A30 = DIRECT_CONNECTION_NOT_DEMONSTRATED
A20 = NOT_USED_FOR_P1_P2
MATCH = OBSERVED_MATCH (solo para la observación geométrica de cocina–estar)
```

El resultado no afirma que HOUSE-001 haya cumplido originalmente la intención humana de A21. La intención se construye desde el fixture humano HOUSE-A21 y nunca se invierte la causalidad desde los rectángulos existentes. La abertura heredada de A30 no tiene extent explícito; por eso la conexión directa no se promueve como demostrada.

## 8. Controles negativos

| Control | Resultado |
|---|---|
| Sin intención | `0` relaciones; estado `UNKNOWN` |
| Adyacencia requerida + separación requerida | `2` conflictos detectados y preservados |
| Etiqueta programática sin relación | No se infiere adyacencia |
| Geometría fabricada por A21 | 0 polígonos, posiciones, dimensiones, openings, puertas, ventanas o muros |
| Regulación inferida | No |
| Decisión o ganador automático | No |

## 9. Validación

```text
FOCUSED_A21 = 12 passed / 12
WEB_FULL_SUITE = 331 passed / 331 tests, 68 test files
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS
CORE_FULL_SUITE = PASS
CORE_COMPILEALL = PASS
CORE_GIT_DIFF_CHECK = PASS
CORE_WORKTREE = CLEAN
```

La suite Web completa emitió únicamente warnings de configuración previamente existentes de pnpm; no hubo fallos. El Core no fue modificado.

## 10. Archivos de A21 añadidos

```text
client/src/components/a21ArchitecturalProgram.ts
client/src/components/a21ArchitecturalProgram.test.ts
docs/ARQUI-A21-FINAL-CONTROLLED-HOUSE-PROGRAM.md
```

## 11. Clasificación arquitectónica

A21 demuestra que ARQUI puede recibir un programa residencial controlado, distinguir requisitos humanos de derivaciones, representar relaciones arquitectónicas semánticas, proponer una zonificación funcional y explicar la lógica de privacidad y circulación **antes de la geometría**.

A21 todavía no demuestra generación de planta constructiva, adyacencia geométrica de una propuesta nueva, accesibilidad normativa, evacuación certificada, continuidad de instalaciones ni calidad arquitectónica. Esas capacidades pertenecen a fases posteriores y no se activan por este cierre.

## 12. Cierre

```text
A21-P0R = PASS
A21-P1 = PASS
A21-P2 = PASS
HOUSE-001_CONTROLLED_PROOF = PASS
REAL_GATE = NOT_TRIGGERED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
STOP = REQUIRED
```

La autoridad humana permanece superior a la propuesta de ARQUI. Las relaciones y zonas pueden alimentar futuras fases de configuración espacial, pero esta orden se detiene aquí.
