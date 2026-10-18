# COCO-B — Auditoría de fundamentos de expediente técnico

**Repositorio auditado:** `/home/ubuntu/generador-familias`  
**Alcance:** dossier, documentos, trazabilidad, revisión, responsabilidad profesional y reutilización de E8-A/E8-C.  
**Fecha de auditoría:** 2026-09-23.  
**Estado global:** `PARTIAL / NO EMITIBLE`.  
**Regla de alcance:** esta auditoría no construye, certifica ni declara emitible un expediente profesional. Tampoco propone ni ejecuta implementaciones.

## 1. Conclusión ejecutiva

El repositorio contiene una base real y reutilizable para un **expediente técnico interno derivado de snapshot**. E8-A ya compila cinco documentos y conserva una relación básica con `projectId`, `sourceSnapshotId`, `sourceVersion` y `elementIds`. E8-C aporta un gate fail-closed que no aprueba cuando el actor es IA, exige criterios trazables verificados por una persona y requiere una firma profesional declarada. Ambos bloques tienen salidas, pruebas y manifiestos locales.

La base no alcanza, por sí sola, los fundamentos de un expediente técnico profesional emitible. La diferencia no es solamente de formato. El contrato de dossier no tiene un esquema común de evidencia por sección, no representa `UNKNOWN`/`NOT_DEMONSTRATED` de forma estructural, no declara aplicabilidad, escala documental, escenario ni periodo de validez, y no enlaza cada afirmación con una autoridad responsable y una revisión independiente. E8-A acepta una aprobación de `Product Owner` como precondición de compilación, pero esa aprobación no equivale a revisión profesional. E8-C puede devolver `approved` en su prueba contractual, aunque el resultado no conserva dentro del `GateResult` la firma, las evidencias, los verificadores ni una referencia al dossier concreto.

Por tanto, el repositorio debe clasificarse como **`PARTIAL` para COCO-B**. Lo reutilizable es el mecanismo de snapshot, provenance parcial, hashes y revisionado canónico, junto con el gate humano de E8-C. Lo faltante es un contrato de expediente que haga obligatoria la completitud epistemológica y documental, una cadena de evidencia auditable por sección y un vínculo verificable entre dossier, revisión profesional, versión congelada y decisión humana. No se autoriza inferir que los outputs actuales son planos, memoria, especificaciones, presupuesto o expediente aptos para construcción.

## 2. Evidencia inspeccionada

La clasificación se basa únicamente en archivos reales del repositorio, excluyendo materiales y exámenes conocidos de DeepSeek:

| Área | Evidencia inspeccionada | Hallazgo principal |
|---|---|---|
| Dossier E8-A | `E8-A_REPORT.md`, `E8-A_OUTPUTS.txt`, `E8_A_OUTPUT/dossier-compilation.json`, `shared/arkiTechnicalDossierCompiler.ts` | Existe compilación de cinco documentos; la trazabilidad es básica y el estado es `COMPILED`, no `VERIFIED`. |
| Contrato de dossier | `E8_CONTRATO_PROPUESTO_V1.md` | Exige portada, índice, modelo, metrados, presupuesto, cronograma, clashes, limitaciones, provenance y aprobación humana; exige `UNKNOWN` o `NOT_DEMONSTRATED` si faltan datos. |
| Gate E8-C | `E8-C_REPORT.md`, `E8-C_FINAL_OUTPUTS.txt`, `shared/arkiProjectGate.ts` | Existe gate determinista mínimo, fail-closed, con actor humano/IA, doce criterios y firma profesional declarada. |
| Provenance y snapshots | `shared/arkiRecalculation.ts`, `shared/arkiTransactionEngine.ts`, `shared/arkiCanonicalProjectRepository.ts`, `shared/arkiCanonicalPersistence.ts` | Hay varios contratos parciales de provenance, hash, revisión y autoridad, pero no uno unificado para documentos del expediente. |
| Evidencia y restricciones | `shared/arkiConstraintEngine.ts` | Existen contratos ricos de evidencia, aplicabilidad, escala, disciplina, escenario, validez temporal y estados epistemológicos, pero pertenecen al motor de restricciones y no están conectados al dossier E8-A. |
| O-M reutilizable | `E8-B_REPORT.md`, `shared/arkiOperationMaintenance.ts` | Existe trazabilidad modelo → activo → mantenimiento, con evidencia puntual en inspecciones; no es evidencia de revisión profesional del expediente. |
| Manifiesto | `E8_MANIFEST.json` | Declara E8-A/E8-B/E8-C `IMPLEMENTED / PENDING INDEPENDENT REVIEW`, con hashes de fuentes y outputs; no equivale a verificación independiente. |

## 3. Taxonomía aplicada

- **`EXISTS`**: el contrato o artefacto está presente y es observable en archivos reales.
- **`PARTIAL`**: existe una parte funcional, pero no cubre el requisito completo o no tiene cierre probatorio.
- **`REUSABLE`**: puede reutilizarse directamente como fundamento, sin convertirlo en una certificación profesional.
- **`EXTENDABLE`**: tiene una base técnica razonable, pero necesita un contrato adicional o una ampliación controlada.
- **`MISSING`**: no se encontró el contrato o evidencia requerida.
- **`CONFLICT`**: hay dos semánticas incompatibles o una implementación contradice el contrato declarado.
- **`UNKNOWN`**: el repositorio no permite demostrar el punto con los artefactos inspeccionados; no se debe rellenar por inferencia.

## 4. Auditoría por área

### 4.1 Dossier / expediente técnico

**Clasificación: `PARTIAL`; base `REUSABLE`; extensión `EXTENDABLE`; emisión profesional `MISSING`.**

E8-A implementa `compileTechnicalDossier()` en `shared/arkiTechnicalDossierCompiler.ts`. El compilador exige un snapshot con `approval.gateStatus: "passed"`, `approvedBy` y `approvedAt`. Devuelve el esquema `ARKI-E8A-TECHNICAL-DOSSIER-1.0`, un `projectId`, `sourceSnapshotId`, `sourceVersion`, cinco documentos y advertencias. Los outputs observados son `01-memoria-descriptiva.md`, `02-especificaciones-tecnicas.md`, `03-metrados.md`, `04-presupuesto.md` y `05-planta.svg`.

La base es reutilizable para un **paquete documental interno, derivado y sujeto a revisión**. También es reutilizable la separación por tipo de documento y la prohibición explícita de presentarlo como `APTO PARA CONSTRUCCIÓN`. El propio E8-A reporta `COMPILED`, no `VERIFIED`, y declara que requiere revisión y firma de especialistas.

La cobertura no satisface todavía el mínimo semántico del contrato E8. El contrato enumera portada, índice, cronograma, clashes, limitaciones, provenance de cada sección y estado de aprobación humana. El compilador observado no implementa esos elementos como documentos o campos estructurados obligatorios. La memoria contiene advertencias y algunos conteos, pero no existe un manifiesto de secciones con responsable, evidencia, revisión, aplicabilidad y estado epistemológico. El compilador tampoco exige que cada salida tenga una evidencia independiente asociada.

**Resultado:** `EXISTS` para compilación; `REUSABLE` para derivación interna; `PARTIAL` para cobertura del contrato; `MISSING` para expediente profesional emitible; `EXTENDABLE` para un dossier COCO-B no emitible.

### 4.2 Documentos y contenido técnico

**Clasificación: `PARTIAL`; outputs `EXISTS`; suficiencia profesional `MISSING`; riesgo de sobrelectura `CONFLICT`.**

Los cinco archivos físicos existen y el manifiesto `E8_MANIFEST.json` registra hashes de outputs. El compilador preserva el snapshot y la versión en el contenido de memoria, especificaciones, metrados, presupuesto y plano. El plano SVG lleva `data-element-id` para los muros representados.

La memoria y las especificaciones se generan desde el modelo constructivo. Las especificaciones contienen normas RNE y criterios de aceptación, y `arkiTechnicalDossier.ts` clasifica secciones como `ready`, `review_required` o `pending`. El presupuesto conserva moneda, `priceBookId` y `priceBookVersion`. Estas propiedades son útiles como **datos derivados**, no como validación normativa, cálculo estructural, coordinación MEP o aprobación de costos.

Existe una tensión documental que debe quedar explícita: los nombres `memoria-descriptiva`, `especificaciones-tecnicas`, `metrados`, `presupuesto` y `planta` parecen documentos profesionales, pero el contenido y los informes los describen como compilación técnica derivada. La existencia de archivos no prueba que tengan el alcance, firma, responsabilidad, escala o revisión exigidos para una emisión. En particular, no se encontró PDF profesional, RVT, DXF, paquete de planos coordinados, firma digital PKI ni un registro de emisión.

La salida observada también muestra una señal que requiere control: la memoria registra `Provenance del snapshot: 0 registros`. El contrato del snapshot sí tiene un arreglo `provenance`, pero el caso compilado no demuestra provenance de transformación para sus contenidos. No debe interpretarse el valor cero como trazabilidad completa.

**Resultado:** `EXISTS` para documentos derivados; `REUSABLE` para estructura y advertencias; `CONFLICT` entre apariencia nominal de expediente y estado real no emitible; `MISSING` para documentación profesional coordinada y emitible.

### 4.3 Trazabilidad y provenance

**Clasificación: `PARTIAL`; componentes `REUSABLE`; contrato dossier-documento `MISSING`; divergencias `CONFLICT`.**

E8-A conserva en cada `DossierDocument.traceability` los campos `sourceSnapshotId`, `sourceVersion` y `elementIds`. La función `trace()` ordena los identificadores. El output `dossier-compilation.json` contiene esos valores y el manifiesto conserva SHA-256 para fuentes, código, outputs y capturas. Este es el núcleo reutilizable para una relación documento → snapshot → elementos.

`ProjectSnapshot` en `shared/arkiRecalculation.ts` contiene `schema`, `id`, `version`, `sourceVersion`, `generatedAt`, `provenance`, invalidaciones, presupuesto y cronograma. `stableHash()` ofrece una identidad estable para ciertos snapshots. `TransactionProvenance` en `shared/arkiTransactionEngine.ts` requiere `source`, `actorId`, `evidenceRefs` y `transformations`, con campos opcionales para comando, transacción padre, revisión esperada y resultado. `shared/arkiCanonicalProjectRepository.ts` y `shared/arkiCanonicalPersistence.ts` aportan revisiones inmutables, `projectId`, `revisionId`, `parentRevisionId`, `transactionId`, `stateFingerprint`, autoridad, auditoría durable, idempotencia y recuperación.

Sin embargo, estos contratos no están unificados en el contrato E8-A. `ProvenanceRecord` de `arkiRecalculation.ts` sólo tiene `entityId`, `entityKind`, `action`, `cause`, `sourceSnapshotId` y `timestamp`; no tiene `actorId`, `evidenceRefs`, transformación, revisión ni hash. `DossierDocument.traceability` tampoco tiene hash del contenido, provenance de transformación, evidencia de revisión ni autoridad responsable. En consecuencia, la existencia de un `sourceSnapshotId` no demuestra la cadena completa de origen, transformación, revisión y publicación.

Además, el output compilado contiene identificadores repetidos para algunas entidades derivadas, por ejemplo entradas repetidas de `door-1`, `door-2`, etc. Esto no prueba por sí solo corrupción, pero impide asumir que `elementIds` sea un conjunto canónico sin una regla de unicidad o una relación explícita de instancia. Debe clasificarse como `UNKNOWN` para el requisito de cobertura uno-a-uno por documento.

**Resultado:** `REUSABLE` para snapshots, hashes, revisionado canónico y trazabilidad elemental; `PARTIAL` para provenance; `MISSING` para provenance documental por sección; `CONFLICT` entre la exigencia contractual de provenance de cada sección y el output que declara cero registros de provenance del snapshot; `UNKNOWN` para unicidad completa de elementos trazados.

### 4.4 Revisión, estados y verificación

**Clasificación: `PARTIAL`; gate `REUSABLE`; verificación independiente `MISSING`; estado final `UNKNOWN` para el expediente.**

E8-C implementa `evaluateProjectGate()` en `shared/arkiProjectGate.ts`. El gate rechaza siempre a `actor: "ai"`, rechaza snapshots no aprobados, valida identidad y fecha básica, detecta criterios duplicados y exige doce criterios satisfechos con `evidenceRef`, `verifiedBy` y `verifiedAt`. También exige `professionalSignature` con nombre, fecha y hash no vacío. Es un control fail-closed útil y reutilizable.

Los outputs E8-C prueban cuatro escenarios contractuales: actor IA rechazado, snapshot no aprobado rechazado, criterio faltante reportado y caso con doce criterios y firma declarada aprobado. El informe E8-C declara expresamente que el resultado no es `VERIFIED` y que la revisión independiente de archivos, outputs, manifiestos y hashes corresponde a un verificador autorizado.

El `GateResult` sólo conserva `status`, `missingCriteria`, `reason`, `evaluatedAt` y `actor`. No conserva la lista de criterios, sus evidencias, verificadores, firma, hash del dossier, hash del snapshot o identidad de la revisión. Por eso, un resultado `approved` no es autosuficiente como registro de auditoría reproducible ni demuestra qué documentos concretos se revisaron. Tampoco hay una relación explícita entre `evidenceRef` y los archivos enumerados en `E8_MANIFEST.json`.

`E8_MANIFEST.json` declara `IMPLEMENTED / PENDING INDEPENDENT REVIEW` y registra hashes de fuentes, outputs y capturas. Es una buena base de integridad de paquete, pero no sustituye una revisión independiente. El número de capturas y pruebas producido en el bloque tampoco se convierte automáticamente en cobertura del expediente.

**Resultado:** `EXISTS` para gate y manifest; `REUSABLE` para fail-closed y rechazo de IA; `PARTIAL` para revisión; `MISSING` para registro de revisión independiente vinculado al dossier; `UNKNOWN` para la condición final de verificación del expediente.

### 4.5 Responsabilidad profesional y autoridad humana

**Clasificación: `PARTIAL`; autoridad humana `EXISTS`; responsabilidad por sección `MISSING`; riesgo de confusión `CONFLICT`.**

E8-C define `GateActor` como `human | ai` y sólo permite aprobación con actor humano. También define `ProfessionalSignature` con `professionalName`, `signedAt` y `hash`. El contrato canónico define `CanonicalAuthority` como `SYSTEM_PROPOSED`, `HUMAN_AUTHORIZED` o `SYSTEM_EXECUTED`. Estas piezas demuestran que el repositorio reconoce una autoridad humana diferenciada de la ejecución del sistema.

La responsabilidad profesional está incompleta. `licenseNumber` es opcional; el gate no verifica licencia, jurisdicción, especialidad, alcance de competencia, identidad criptográfica ni relación entre la firma y el contenido firmado. El hash sólo se exige como texto no vacío, y el informe E8-C declara que no hay PKI real. Tampoco existe una matriz que asigne arquitecto, estructurista, especialista MEP, revisor independiente o responsable de costos a cada sección y criterio.

La aprobación de E8-A usa `approvedBy: "Product Owner"` y `gateStatus: "passed"` para habilitar la compilación. Esto es una precondición de producto, no una firma profesional. Tratarlo como aprobación técnica profesional sería incorrecto. El gate E8-C exige firma profesional, pero la salida compilada de E8-A no conserva esa firma ni una referencia a su resultado. Esta desconexión es un **conflicto semántico** que bloquea cualquier lectura emitible.

**Resultado:** `EXISTS` para autoridad humana declarada; `REUSABLE` para la separación IA/humano; `PARTIAL` para responsabilidad profesional; `MISSING` para validación de licencia, competencia, firma criptográfica, responsabilidad por sección y cadena de custodia; `CONFLICT` entre aprobación de Product Owner y aprobación profesional.

## 5. Contratos compartidos relevantes para COCO-B

| Contrato o campo | Ubicación real | Estado | Evaluación COCO-B |
|---|---|---|---|
| `provenance` de transacción | `shared/arkiTransactionEngine.ts`, `TransactionProvenance` | `EXISTS` / `REUSABLE` | Exige `source`, `actorId`, `evidenceRefs` y `transformations`; no está conectado al `DossierDocument`. |
| `provenance` de snapshot | `shared/arkiRecalculation.ts`, `ProvenanceRecord` | `EXISTS` / `PARTIAL` | Conserva entidad, acción, causa, snapshot y tiempo; no exige evidencia, actor ni transformación completa. |
| `provenance` canónico | `shared/arkiCanonicalProjectRepository.ts` y `shared/arkiCanonicalPersistence.ts` | `EXISTS` / `REUSABLE` | Aporta `projectId`, revisiones, hash de estado, autoridad, auditoría durable y recuperación. |
| `evidence` de restricciones | `shared/arkiConstraintEngine.ts`, `ConstraintEvidence` | `EXISTS` / `REUSABLE` | Tiene tipo de evidencia, referencia y detalle; no es un contrato de evidencia de documento. |
| `evidence` de gate | `shared/arkiProjectGate.ts`, `CriterionEvidence` | `EXISTS` / `PARTIAL` | Tiene `evidenceRef`, verificador y fecha; el resultado no conserva el detalle. |
| `evidenceRef` de inspección O-M | `shared/arkiOperationMaintenance.ts`, `Inspection` | `EXISTS` / `REUSABLE` | Sirve para evidencia de mantenimiento, no para responsabilidad profesional del expediente. |
| `UNKNOWN` | `arkiTransactionEngine.ts`, `arkiConstraintEngine.ts` | `EXISTS` / `REUSABLE` | Hay estados y razones explícitos (`UNKNOWN`, `NOT_DEMONSTRATED`, `INSUFFICIENT_EVIDENCE`). No llegan al dossier E8-A. |
| `applicability` | `arkiConstraintEngine.ts`, `ApplicabilityCondition` | `EXISTS` / `EXTENDABLE` | Incluye escalas, disciplinas, entidades, jurisdicciones, fases, tipos de proyecto y condiciones; no se aplica a secciones del dossier. |
| `scale` | `ConstraintScale` en `arkiConstraintEngine.ts` | `EXISTS` / `EXTENDABLE` | Hay vocabulario de escala de humano a país. El plano E8-A usa `const scale = 20`, sin declarar escala documental ni unidad en un contrato de plano. |
| `time` | `generatedAt`, `approvedAt`, `timestamp`, `validFrom`, `validTo` | `EXISTS` / `PARTIAL` | Hay fechas en varios contratos; falta una política de validez, vigencia y corte temporal del dossier. |
| `scenario` | `ConstraintRecord.scenario?` | `EXISTS` / `EXTENDABLE` | Existe sólo como campo opcional en restricciones; no existe para documento, revisión o emisión. |
| `projectId` | snapshot, dossier, gate y persistencia canónica | `EXISTS` / `REUSABLE` | El enlace de identidad del proyecto está bien representado en varias capas. |
| `revision` | `version` de snapshot; `revisionId` y cadena canónica; revisiones transaccionales | `EXISTS` / `PARTIAL` | Hay revisionado de estado, pero no una revisión propia del documento con revisor, delta y congelamiento. |
| `determinism` | `stableHash()` en `arkiRecalculation.ts`; serialización canónica estable | `EXISTS` / `PARTIAL` | Hay hash determinista en algunas capas; `arkiConstructionOntology.ts` todavía usa `Math.random()` y `new Date()` para IDs/fechas de elementos. |
| `Human Authority` | `GateActor`, `ProfessionalSignature`, `CanonicalAuthority` | `EXISTS` / `PARTIAL` | La autoridad está tipada, pero su identidad, competencia, alcance y firma no se verifican criptográficamente ni se vinculan al dossier. |

## 6. Reutilización específica de E8-A y E8-C

### E8-A — reutilizable con límites

1. `compileTechnicalDossier()` puede servir como fuente de una futura compilación COCO-B porque ya recibe un snapshot aprobado, conserva `projectId`, `sourceSnapshotId` y `sourceVersion`, y produce documentos separados.
2. `DossierDocument.traceability` es una base adecuada para ampliar la trazabilidad a hash de contenido, sección, elemento, evidencia, transformación, responsable y revisión.
3. `E8_A_OUTPUT/dossier-compilation.json`, `E8-A_OUTPUTS.txt`, `E8-A_REPORT.md` y `E8_MANIFEST.json` constituyen evidencia de que el flujo fue ejecutado en el repositorio real.
4. Las advertencias de E8-A —`requiere revisión y firma de especialistas` y `no es APTO PARA CONSTRUCCIÓN`— deben preservarse como límites de producto, no eliminarse.

### E8-C — reutilizable con límites

1. La regla `actor === "ai"` → `GATE_NEVER_APPROVED_BY_AI` es un control de autoridad humana directamente reutilizable.
2. La exigencia de `evidenceRef`, `verifiedBy` y `verifiedAt` por criterio es una base para un registro de revisión.
3. El gate fail-closed y los estados `approved`/`not_approved` son reutilizables para una decisión de cierre, siempre que el resultado se amplíe con referencias al dossier y sus hashes.
4. `ProfessionalSignature` es sólo una declaración mínima. No debe usarse como prueba de licencia, PKI, competencia o emisión profesional sin controles adicionales.

No se reutilizan como prueba de emisión los paneles SVG/WEBP. Los informes indican que son paneles documentales generados por script y no screenshots de interacción del preview. Tampoco se reutiliza la prueba sintética de E8-C como evidencia de que un expediente real ya fue revisado por un profesional.

## 7. Gaps priorizados

| Prioridad | Gap | Clasificación |
|---|---|---|
| P0 | No existe un esquema de dossier que obligue a enlazar cada sección y afirmación con evidencia, provenance, responsable, revisor y estado epistemológico. | `MISSING` |
| P0 | No existe una unión verificable entre `DossierDocument`, hashes del manifiesto, criterios E8-C, firma profesional y decisión final. | `MISSING` |
| P0 | La aprobación `Product Owner` que habilita E8-A no está separada estructuralmente de la revisión profesional. | `CONFLICT` |
| P0 | No hay demostración de licencia, especialidad, competencia, jurisdicción ni firma criptográfica del responsable profesional. | `MISSING` |
| P1 | `UNKNOWN` y `NOT_DEMONSTRATED` existen en restricciones/transacciones, pero no son campos obligatorios de dossier, documento, sección y criterio. | `PARTIAL` |
| P1 | No hay contrato documental de aplicabilidad, escala, escenario, periodo de validez y fecha de corte. | `MISSING` |
| P1 | No hay revisión propia del documento: `documentRevisionId`, revisor, alcance, fecha, delta, resultado y evidencia de independencia. | `MISSING` |
| P1 | El resultado del gate no conserva criterios, evidencias ni firma; sólo devuelve una decisión resumida. | `PARTIAL` |
| P1 | `ProvenanceRecord` de snapshot no contiene el mismo nivel de evidencia y actor que `TransactionProvenance`. | `CONFLICT` |
| P1 | El output compilado muestra `Provenance del snapshot: 0 registros`; la trazabilidad de transformación de contenido queda sin demostrar. | `UNKNOWN` / `CONFLICT` |
| P2 | La escala del plano se implementa como número interno `20`, pero no como escala declarada, unidad, norte, datum o regla de impresión. | `PARTIAL` |
| P2 | Existen funciones no deterministas en el modelo constructivo (`Math.random()`, `new Date()`), fuera del hash estable de snapshots. | `CONFLICT` / `PARTIAL` |
| P2 | La lista `elementIds` no se prueba como conjunto único y completo por documento; el output contiene identificadores repetidos en algunas entidades. | `UNKNOWN` |
| P2 | No hay paquete de emisión profesional con PDF, modelos coordinados, índice firmado, registro de cambios y control de distribución. | `MISSING` |

## 8. Conflictos que bloquean una lectura emitible

1. **Aprobación de producto frente a aprobación profesional.** E8-A requiere `gateStatus: "passed"` y `approvedBy`, pero el ejemplo usa `Product Owner`. E8-C exige además criterios humanos y firma profesional. No existe un vínculo de datos que demuestre que ambas aprobaciones se refieren al mismo dossier, snapshot, contenido y revisión.
2. **Provenance declarado frente a provenance observado.** El contrato E8 exige provenance de cada sección y el snapshot tiene un arreglo `provenance`; el documento compilado registra `Provenance del snapshot: 0 registros`. La presencia de campos de provenance no demuestra una cadena de transformación poblada.
3. **Estado `COMPILED` frente a apariencia de documento final.** Los nombres de los archivos se parecen a entregables profesionales, pero los informes dicen `PENDING INDEPENDENT REVIEW`, `NO APTO PARA CONSTRUCCIÓN` y `requiere revisión y firma de especialistas`.
4. **Firma declarada frente a firma verificable.** `ProfessionalSignature.hash` sólo se valida como cadena no vacía. E8-C declara que no hay PKI real. No se prueba que el hash cubra el dossier ni que identifique criptográficamente al firmante.
5. **Determinismo parcial frente a modelo generativo no determinista.** Hay hash estable en snapshots y serialización canónica, pero la ontología usa generación aleatoria de IDs y fechas actuales. No puede asumirse reproducibilidad total del contenido a partir de una ejecución cualquiera.

## 9. Clasificación final por requisito COCO-B

| Requisito | Estado | Base reutilizable | Qué no se puede afirmar |
|---|---|---|---|
| Dossier | `PARTIAL` | Compilador E8-A y cinco outputs | Que sea expediente profesional emitible o completo según el contrato. |
| Documentos | `EXISTS` / `PARTIAL` | Markdown, SVG, JSON y manifiesto con hashes | Que tengan coordinación, escala, firma o suficiencia técnica profesional. |
| Trazabilidad | `PARTIAL` | Snapshot, versión, proyecto, elementos y hashes | Que exista provenance poblada y completa por sección/documento. |
| Revisión | `PARTIAL` | Gate E8-C, criterios, evidencia referencial y estados | Que haya revisión independiente real del dossier producido. |
| Responsabilidad profesional | `PARTIAL` | Actor humano, autoridad canónica y firma declarada | Que se haya validado identidad, licencia, competencia, PKI o alcance. |
| `UNKNOWN` / `NOT_DEMONSTRATED` | `PARTIAL` | Estados ricos en restricciones y transacciones | Que el dossier fuerce el uso de esos estados cuando faltan datos. |
| Applicability / scale / time / scenario | `PARTIAL` | Contratos del motor de restricciones y timestamps | Que esos campos gobiernen el expediente, el plano o la emisión. |
| Determinismo | `PARTIAL` | `stableHash()` y serialización canónica | Que todo el pipeline constructivo sea reproducible. |
| Human Authority | `EXISTS` / `PARTIAL` | Gate fail-closed y `CanonicalAuthority` | Que la autoridad profesional esté autenticada y vinculada al contenido. |

## 10. Dictamen de auditoría

**COCO-B queda `PARTIAL / NO EMITIBLE`.** El repositorio tiene fundamentos suficientes para conservar un dossier interno derivado y para reutilizar controles de snapshot, provenance parcial, evidencia, hash, revisionado y autoridad humana. No tiene fundamentos suficientes para declarar un expediente técnico profesional listo para emisión, construcción, contratación o firma.

La decisión de cierre debe mantener visibles, como mínimo, estas etiquetas: `COMPILED`, `PENDING INDEPENDENT REVIEW`, `NO APTO PARA CONSTRUCCIÓN`, `UNKNOWN` cuando falte demostración y `NOT_DEMONSTRATED` cuando el sistema no haya probado una capacidad. Ninguna salida de E8-A ni caso aprobado de E8-C debe reinterpretarse como autorización profesional.

Este archivo es un **informe de auditoría**. No es un expediente técnico, no es una memoria emitible, no es una firma profesional y no constituye un veredicto de aptitud para construcción.

## References

[1]: file:///home/ubuntu/generador-familias/E8-A_REPORT.md "E8-A — Expediente técnico mínimo trazable"
[2]: file:///home/ubuntu/generador-familias/E8-C_REPORT.md "E8-C — Gate final de aptitud para construcción"
[3]: file:///home/ubuntu/generador-familias/E8_CONTRATO_PROPUESTO_V1.md "ARKI — Contrato E8 v1.0"
[4]: file:///home/ubuntu/generador-familias/shared/arkiTechnicalDossierCompiler.ts "ARKI E8-A technical dossier compiler"
[5]: file:///home/ubuntu/generador-familias/shared/arkiProjectGate.ts "ARKI E8-C project gate"
[6]: file:///home/ubuntu/generador-familias/shared/arkiRecalculation.ts "ARKI project snapshots and recalculation provenance"
[7]: file:///home/ubuntu/generador-familias/shared/arkiTransactionEngine.ts "ARKI transaction and provenance contracts"
[8]: file:///home/ubuntu/generador-familias/shared/arkiCanonicalProjectRepository.ts "ARKI canonical project repository and revision chain"
[9]: file:///home/ubuntu/generador-familias/shared/arkiCanonicalPersistence.ts "ARKI durable canonical persistence and recovery"
[10]: file:///home/ubuntu/generador-familias/shared/arkiConstraintEngine.ts "ARKI constraint evidence, applicability and epistemic states"
[11]: file:///home/ubuntu/generador-familias/E8_MANIFEST.json "ARKI E8 manifest and output hashes"
[12]: file:///home/ubuntu/generador-familias/E8_A_OUTPUT/dossier-compilation.json "Observed E8-A dossier compilation output"
[13]: file:///home/ubuntu/generador-familias/E8-B_REPORT.md "E8-B — Operación y mantenimiento básico"
[14]: file:///home/ubuntu/generador-familias/shared/arkiOperationMaintenance.ts "ARKI operation and maintenance contract"
[15]: file:///home/ubuntu/generador-familias/shared/arkiConstructionOntology.ts "ARKI construction ontology and model generation"

**Control de cambios de esta auditoría:** se creó únicamente este reporte en `COCO/AUDIT/COCO-B_AUDIT.md`. No se modificó código de producto y no se ejecutaron implementaciones.

---

**Resumen de estados:** `EXISTS`: E8-A, E8-C, manifiestos, snapshots, hashes, gate humano, contratos parciales. `PARTIAL`: dossier, documentos, trazabilidad, revisión y responsabilidad profesional. `REUSABLE`: compilación derivada, snapshots, hashes, revisionado canónico, gate fail-closed y estados de evidencia. `EXTENDABLE`: vínculo dossier-gate, contratos de aplicabilidad/escala/tiempo/escenario y provenance unificada. `MISSING`: expediente profesional emitible, revisión independiente demostrada, PKI, responsabilidad por sección y contrato documental completo. `CONFLICT`: Product Owner frente a firma profesional, provenance declarada frente a cero registros observados, `COMPILED` frente a apariencia final y determinismo parcial. `UNKNOWN`: unicidad completa de elementos, verificación final real del expediente y cobertura de provenance de transformación.

## References

[1]: file:///home/ubuntu/generador-familias/E8-A_REPORT.md "E8-A — Expediente técnico mínimo trazable"
[2]: file:///home/ubuntu/generador-familias/E8-C_REPORT.md "E8-C — Gate final de aptitud para construcción"
[3]: file:///home/ubuntu/generador-familias/E8_CONTRATO_PROPUESTO_V1.md "ARKI — Contrato E8 v1.0"
[4]: file:///home/ubuntu/generador-familias/shared/arkiTechnicalDossierCompiler.ts "ARKI E8-A technical dossier compiler"
[5]: file:///home/ubuntu/generador-familias/shared/arkiProjectGate.ts "ARKI E8-C project gate"
[6]: file:///home/ubuntu/generador-familias/shared/arkiRecalculation.ts "ARKI project snapshots and recalculation provenance"
[7]: file:///home/ubuntu/generador-familias/shared/arkiTransactionEngine.ts "ARKI transaction and provenance contracts"
[8]: file:///home/ubuntu/generador-familias/shared/arkiCanonicalProjectRepository.ts "ARKI canonical project repository and revision chain"
[9]: file:///home/ubuntu/generador-familias/shared/arkiCanonicalPersistence.ts "ARKI durable canonical persistence and recovery"
[10]: file:///home/ubuntu/generador-familias/shared/arkiConstraintEngine.ts "ARKI constraint evidence, applicability and epistemic states"
[11]: file:///home/ubuntu/generador-familias/E8_MANIFEST.json "ARKI E8 manifest and output hashes"
[12]: file:///home/ubuntu/generador-familias/E8_A_OUTPUT/dossier-compilation.json "Observed E8-A dossier compilation output"
[13]: file:///home/ubuntu/generador-familias/E8-B_REPORT.md "E8-B — Operación y mantenimiento básico"
[14]: file:///home/ubuntu/generador-familias/shared/arkiOperationMaintenance.ts "ARKI operation and maintenance contract"
[15]: file:///home/ubuntu/generador-familias/shared/arkiConstructionOntology.ts "ARKI construction ontology and model generation"

**Control de cambios de esta auditoría:** se creó únicamente este reporte en `COCO/AUDIT/COCO-B_AUDIT.md`. No se modificó código de producto y no se ejecutaron implementaciones.
