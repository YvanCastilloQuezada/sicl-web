# COCO-A — Auditoría de fundamentos de sintaxis espacial

**Repositorio auditado:** `/home/ubuntu/generador-familias`  
**Fecha de auditoría:** 2026-09-23  
**Alcance:** fundamentos de sintaxis espacial: grafos, matemáticas, programa y relaciones espaciales.  
**Método:** inspección estática de archivos fuente, contratos, adaptadores y pruebas existentes del repositorio real. No se implementó Space Syntax, no se ejecutaron implementaciones nuevas y no se modificó código de producto.  
**Exclusiones explícitas:** no se usaron casos de hospital, museo ni colegio; no se usaron los exámenes conocidos de DeepSeek.

## 1. Dictamen ejecutivo

**Resultado global: PARTIAL, con base reutilizable importante pero sin un fundamento COCO-A completo de sintaxis espacial.** El repositorio sí contiene un modelo constructivo con `projectId`, espacios, muros, aberturas, elementos estructurales, relaciones dirigidas, agenda, cantidades y exportación semántica IFC. También contiene una `Relationship Fabric` con identidad estable de relación, revisiones, escalas, disciplinas, estado epistémico, evidencia y provenance. Estas piezas son reutilizables para COCO-A.

Lo que no existe como capacidad demostrada es un grafo espacial canónico orientado al análisis de configuración espacial. No hay representación explícita y validada de nodos de acceso/circulación, conexiones entre espacios por permeabilidad, fronteras transitables, secuencias de movimiento, matriz de adyacencia espacial, grafo dual, grafo axial/segmentario, isovistas ni métricas de profundidad, integración, elección, conectividad o inteligibilidad. La aritmética existente es principalmente metrado, cantidades, costes, geometría elemental y recálculo paramétrico; no constituye todavía matemática de sintaxis espacial.

La mayor fortaleza arquitectónica es que el repositorio ya separa identidad, revisión, provenance, evidencia y autoridad en varios contratos. La mayor debilidad es la falta de un contrato único que conecte esos campos con una observación espacial: la relación fabric tiene `projectVersion`, pero no una revisión/escenario/instante temporal de análisis espacial; el adaptador usa `projectVersion` derivado de `model.generatedAt`, deja `unknownLegacyTypes: []` de forma incondicional y etiqueta relaciones adaptadas como `OBSERVED` aun cuando la evidencia es generada o calculada. Además, el estado `UNKNOWN` existe en el vocabulario, pero no hay una política COCO-A que establezca cuándo una inferencia espacial debe quedar UNKNOWN, qué evidencia la resuelve o cómo se propaga al resultado.

## 2. Evidencia inspeccionada

| Área | Archivos reales inspeccionados | Hallazgo de base |
|---|---|---|
| Modelo espacial y constructivo | `shared/arkiConstructionOntology.ts`, `shared/arkiConstructionElements.ts`, `shared/arkiSceneModel.ts` | Existen `ConstructionSpace`, `Muro`, elementos constructivos, geometría básica y proyección 3D; la semántica de espacio es principalmente descriptiva/constructiva. |
| Programa y tiempo | `shared/arkiConstructionOntology.ts`, `shared/arkiArchitecturalProgram.ts`, `shared/arkiConstructionElements.ts` | Existen función del espacio, requisitos, estado, agenda, precedencias, duración y vínculos actividad-elemento. |
| Relaciones | `shared/arkiRelationshipFabric.ts`, `shared/arkiRelationshipAdapters.ts` | Existe fabric tipada, identidad estable, revisiones, escalas, disciplinas, provenance, evidencia y estado epistémico. |
| Cálculo | `shared/arkiConstructionElements.ts`, `shared/arkiArchitecturalProgram.ts`, `shared/arkiConstraintEngine.ts`, `scripts/test-wall-coherence.ts`, `scripts/test-recalculation.ts` | Existen cálculos deterministas de longitudes, áreas, volúmenes, peso, coste, presupuesto, geometría paramétrica y coherencia de muros. |
| Persistencia y autoridad | `shared/arkiCanonicalProjectRepository.ts`, `shared/arkiCanonicalPersistence.ts`, `shared/arkiTransactionEngine.ts`, `scripts/test-persistence-formal.ts` | Existen revisiones canónicas, fingerprints, cadena de auditoría, estados transaccionales y gates de autoridad. |
| Contratos | `BKH1_RELATIONSHIP_FABRIC_CONTRACT.md`, `BKH1_RELATION_MIGRATION_MATRIX.md`, `BKH4_TRANSACTION_ENGINE_CONTRACT_V1_1.md`, `ARKI_EVIDENCE_VAULT_SPEC.md`, `ARKI_JOB_EVIDENCE_LEDGER_SPEC.md` | Los contratos declaran determinismo, escalas, evidencia, provenance, revisión y separación de autoridad, pero no un contrato COCO-A de sintaxis espacial. |

## 3. Clasificación consolidada

### 3.1 EXISTS

1. **Identidad de proyecto:** `ConstructionModel.projectId`, `StructuralElement.projectId` y la identidad `projectId` del repositorio canónico.
2. **Espacio constructivo:** `ConstructionSpace` contiene `id`, nombre, función, nivel, área, altura libre, `wallIds`, requisitos y estado (`conceptual`, `coordinado`, `validado`).
3. **Relaciones constructivas legacy:** `ElementRelation` contiene `fromId`, `toId`, tipo, descripción y `verified`; los tipos actuales incluyen `supports`, `rests_on`, `hosts`, `bounds`, `opens_to` y `coordinates_with`.
4. **Fabric relacional:** `RelationshipFabric` mantiene registros, historial por `relationshipId`, consulta por entidad, serialización y relaciones inversas.
5. **Escala y disciplina relacional:** el fabric declara escalas desde `COMPONENT`/`OBJECT`/`SPACE`/`BUILDING` hasta escalas territoriales, y disciplinas de arquitectura, estructura, MEP, coordinación, coste, agenda, documental y desconocida.
6. **Estado epistémico:** existe `PROPOSED`, `OBSERVED`, `COMPUTED`, `VERIFIED`, `REJECTED` y `UNKNOWN`.
7. **Provenance mínima relacional:** el fabric exige `provenance.source` y transformaciones no vacías; los adaptadores registran `source`, `adapter` y transformaciones.
8. **Evidencia tipada mínima:** la validación de relaciones distingue evidencia `fixture`, `calculation`, `source`, `human_review` y `legacy`, con requisitos mínimos según el tipo de relación.
9. **Identidad y revisión de relación:** `stableRelationshipId` deriva una identidad de la clave semántica y `relationshipRevisionId` deriva una revisión de `relationshipId` y `projectVersion`.
10. **Revisiones canónicas de proyecto:** el repositorio canónico valida `projectId`, `revisionId`, `transactionId`, padre de revisión, timestamp, actor, authority, fingerprint y provenance; rechaza forks silenciosos y colisiones de identidad.
11. **Autoridad humana/transaccional:** existen estados `AWAITING_HUMAN_DECISION`, `AUTHORIZED`, `REJECTED`, `COMMITTED`, `UNKNOWN`, `STALE` y `RECOVERY_REQUIRED`; también existe `HUMAN_AUTHORIZED` como valor de autoridad canónica y `approvedBy` en el gate de persistencia.
12. **Determinismo en cálculos existentes:** las pruebas de recálculo verifican que un mismo cambio produce la misma salida; la generación de IDs IFC usa una función hash determinista; el fabric ordena resultados y serialización.
13. **Matemática constructiva:** hay fórmulas de longitud, área neta de muro, volumen, peso por capas, cantidades, presupuesto y derivación de geometría de escena.
14. **Programa/agenda:** `ConstructionSpace.funcion`, `requisitos`, `ScheduleTask.predecessors`, ventanas temporales de tareas y `elementIds` ofrecen un punto de entrada para contexto de programa y tiempo constructivo.

### 3.2 PARTIAL

1. **Grafo general:** las relaciones dirigidas pueden materializar un grafo de entidades, pero la implementación no expone una abstracción de grafo, matriz, recorridos, componentes, ciclos, conectividad o consultas topológicas. `RelationshipFabric.byEntity` es consulta de registros, no análisis de grafo.
2. **Grafo espacial:** `BOUNDED_BY` se deriva de `space.wallIds`, pero sólo expresa que un espacio está delimitado por muros. No expresa que dos espacios sean adyacentes, que exista una abertura transitable o que un recorrido sea posible.
3. **Programa espacial:** hay función, requisitos y estado del espacio, pero no hay requisitos relacionales explícitos del tipo “A debe ser adyacente a B”, separación, jerarquía de acceso, privacidad, orientación, centralidad o secuencia programática.
4. **Relaciones geométricas:** existe geometría numérica y `interferences`, pero no hay un contrato uniforme para intersección, contacto, distancia, visibilidad, permeabilidad, orientación o tolerancia espacial.
5. **Evidencia:** la fabric registra referencias y detalles, pero no obliga a un identificador de evidencia resoluble, hash, versión del insumo, método de medición, ventana temporal ni cobertura del cálculo.
6. **Provenance:** existe en relaciones, transacciones, persistencia y ledger documental, pero no hay un envelope compartido que asegure los mismos campos para cada resultado de análisis espacial.
7. **Revisionamiento:** las revisiones de relaciones usan `projectVersion`, mientras el repositorio canónico usa `revisionId`/`parentRevisionId` y la persistencia mantiene otros registros; la integración semántica entre ambos es incompleta.
8. **Tiempo:** `generatedAt`, `timestamp`, `createdAt` y agenda existen, pero no distinguen de forma uniforme tiempo del dato, tiempo de observación, tiempo de validez, tiempo de escenario y tiempo de cómputo.
9. **Aplicabilidad:** el fabric tiene `applicabilityScale`, pero el adaptador fija `BUILDING`; esto es útil como default de construcción, pero no demuestra que cada relación o resultado sea aplicable a la escala espacial analizada.
10. **Escenario:** el modelo tiene estado y agenda, pero no un identificador contractual de escenario (existente, propuesto, ejecutado, alternativo, intervención o simulación) asociado a cada relación o métrica.
11. **Human Authority:** existe en el motor transaccional y en gates, pero el resultado espacial no tiene un campo propio que indique quién puede aceptar, rechazar o dejar en UNKNOWN una inferencia.
12. **Matemática:** las fórmulas constructivas son deterministas, pero la matemática de sintaxis espacial (distancias topológicas, profundidad, normalización, integración, elección, centralidad y sensibilidad) está ausente.

### 3.3 REUSABLE

1. **`RelationshipFabric` como infraestructura de registros:** es reutilizable para representar aristas COCO-A siempre que la arista espacial tenga tipo canónico, dirección, escalas, disciplinas, evidencia y provenance completos.
2. **`ConstructionSpace` y `Muro`:** son insumos reutilizables para construir una representación espacial derivada; no deben convertirse automáticamente en una conclusión de accesibilidad o visibilidad.
3. **Adaptadores de relaciones:** `adaptSpaceBoundary`, `adaptElementRelation`, `adaptTrace` y `adaptScheduleLink` ofrecen un patrón de migración y preservan referencias legacy.
4. **Identidad y revisión:** `stableRelationshipId`, `relationshipRevisionId`, `projectId`, `revisionId`, `parentRevisionId` y fingerprints son reutilizables para reproducibilidad de resultados derivados.
5. **Cadena de evidencia/auditoría:** los gates de persistencia, entradas encadenadas y contratos de ledger son reutilizables como base de auditoría de un análisis espacial.
6. **Pruebas deterministas existentes:** `scripts/test-wall-coherence.ts`, `scripts/test-recalculation.ts` y las comprobaciones de exportación pueden reutilizarse como patrón de fixtures, invariantes y repetición; no validan sintaxis espacial por sí mismas.
7. **`ScheduleTask`:** es reutilizable para separar el tiempo de construcción del tiempo del escenario espacial y evitar mezclar secuencia de obra con secuencia de movimiento.
8. **`SceneModel`:** es reutilizable como vista derivada para inspección, no como autoridad semántica del grafo; esta separación está explícitamente alineada con la matriz de migración BKH-1.

### 3.4 EXTENDABLE

1. **Registro de tipos relacionales:** puede extenderse con tipos espaciales como adyacencia, conexión por abertura, acceso, visibilidad, separación y pertenencia de ruta, sin reutilizar sinónimos ambiguos de `ElementRelation`.
2. **Modelo de espacio:** `ConstructionSpace` puede extenderse de forma compatible con geometría verificable, límites, entradas/salidas, aperturas, niveles de privacidad y relaciones de programa.
3. **Evidence/provenance:** el objeto mínimo existente puede extenderse con `evidenceId`, hash, fuente, versión, método, observador, `observedAt`, `validFrom`, `validTo`, `inputRevision` y `derivation`.
4. **Revisión y escenario:** `projectVersion` puede enlazarse a la revisión canónica mediante un mapping explícito; cada análisis debe declarar `scenarioId`, `scale`, `time`, `revision` y determinismo.
5. **Resultados derivados:** el patrón de fingerprint y serialización estable puede extenderse a matrices y métricas, incluyendo orden canónico, precisión, unidad, tolerancia y dependencia de inputs.
6. **UNKNOWN:** el vocabulario existente puede extenderse con razones estructuradas: input ausente, tipo legacy no resuelto, geometría ambigua, evidencia insuficiente, solver no aplicable, conflicto de revisiones o autoridad pendiente.
7. **Human Authority:** los gates existentes pueden extenderse para autorizar el conjunto exacto de aristas/métricas y la revisión exacta, no una aprobación genérica del proyecto.

### 3.5 MISSING

1. **Grafo espacial canónico COCO-A:** falta un contrato de nodos, aristas, atributos, dirección, pesos, multiaristas, nodos aislados, componentes, ciclos y reglas de identidad.
2. **Topología espacial:** faltan adyacencia espacio-espacio, conectividad por puerta/abertura, permeabilidad, acceso al exterior, rutas y reglas para límites coincidentes o superpuestos.
3. **Representaciones analíticas:** faltan grafo dual, grafo de accesos, grafo axial/segmentario, mapa de convexidad, visibilidad/isovistas y definición de qué representación es aplicable a cada pregunta.
4. **Métricas de sintaxis espacial:** faltan conectividad, profundidad, distancia topológica, integración, elección/betweenness, centralidad, control, inteligibilidad, normalización y propagación de incertidumbre.
5. **Contrato matemático:** faltan unidades, precisión, tolerancias, tratamiento de degenerados, límites, redondeo, fórmulas, versiones de algoritmo y pruebas de invariantes específicas de cada métrica.
6. **Programa espacial formal:** faltan requisitos de adyacencia, separación, accesibilidad, privacidad, jerarquía, secuencia, capacidad, compatibilidad y trazabilidad entre requisito y resultado.
7. **Contexto temporal y de escenario:** faltan `scenarioId`, `observedAt`, `validFrom`, `validTo`, `analysisTime`, estado de ocupación/uso y separación formal entre estado de diseño y cronograma de obra.
8. **Contrato de aplicabilidad:** falta una regla que determine si una relación/métrica es válida para `SPACE`, `BUILDING` u otra escala, y que rechace extrapolación silenciosa.
9. **Desconocimiento explícito en migración:** `migrateLegacyRelations` devuelve siempre `unknownLegacyTypes: []`; no hay inventario real de vocabularios no mapeados ni informe de rechazo/ambigüedad.
10. **Evidencia de análisis:** faltan fixtures COCO-A, casos sintéticos neutrales, hashes de entradas, salidas esperadas y pruebas de repetibilidad para grafos y métricas.
11. **Propagación de estado:** falta una regla que derive `UNKNOWN` cuando una arista, geometría, revisión o evidencia crítica no es resoluble; tampoco hay distinción operacional entre `UNKNOWN`, `REJECTED`, `FAILED` y `NOT_APPLICABLE` en el resultado espacial.
12. **Autoridad analítica:** falta definir quién autoriza una topología propuesta, quién puede corregir una relación observada y qué cambio requiere nueva revisión.

### 3.6 CONFLICT

1. **`OBSERVED` frente a evidencia calculada/legacy:** `recordFor` asigna `epistemicStatus: "OBSERVED"` incluso cuando `evidenceKind` es `calculation` o `legacy`. Esto puede sobreafirmar observación humana o fuente primaria; el estado debe corresponder a la procedencia real.
2. **UNKNOWN contractual frente a adaptador vacío:** BKH-1 exige que un tipo legacy sin correspondencia quede `UNKNOWN` y produzca informe; `migrateLegacyRelations` retorna `unknownLegacyTypes: []` sin resolver ni reportar vocabularios desconocidos.
3. **Dos niveles de revisión:** el fabric usa `projectVersion` como base de `relationshipRevisionId`; el repositorio canónico usa `revisionId` y `parentRevisionId`. Sin enlace explícito, una relación puede parecer versionada sin estar anclada a la revisión canónica.
4. **Provenance no uniforme:** el fabric exige sólo `source` y transformaciones, mientras el contrato transaccional/canónico maneja actor, autoridad, timestamp, estado y fingerprint. El resultado espacial no hereda automáticamente el envelope más fuerte.
5. **`createdAt` no determinista en generación:** `arkiConstructionElements.ts` usa `new Date().toISOString()` al construir elementos. La geometría y cantidades pueden ser deterministas, pero el objeto completo no lo es si el timestamp forma parte de la salida o del hash.
6. **Semántica de `BOUNDED_BY`:** derivar límites desde `wallIds` no prueba adyacencia, acceso ni movimiento. Consumirlo como conectividad espacial sería un conflicto semántico entre relación constructiva y relación analítica.
7. **Escala fijada a `BUILDING`:** el adaptador asigna `applicabilityScale: "BUILDING"` a toda relación. Esto puede ser incorrecto para relaciones de componente, espacio, actividad o sistema y puede falsear la aplicabilidad de análisis a otra escala.
8. **Proyección IFC versus autoridad analítica:** la exportación emite relaciones y espacios IFC conceptuales, pero la matriz BKH-1 establece que una representación derivada/IFC debe conservar provenance y no convertirse en owner de la semántica espacial.
9. **Legacy paralelo:** `ConstructionModel.relations`, listas `wallIds`, `tracesTo`, `elementIds` y `SceneNode.relatedIds` coexisten. BKH-1 declara la Fabric como fuente final, pero la integración completa y la eliminación de fuentes paralelas no están demostradas.
10. **Interferencias sin grafo de conflicto:** `interferences` es un arreglo descriptivo en elementos; tratarlo como arista de clash o como relación espacial validada produciría una conclusión no respaldada.

### 3.7 UNKNOWN

Los siguientes puntos no pueden determinarse sólo con los archivos inspeccionados y deben permanecer UNKNOWN, no inferirse como PASS:

1. Si existe en otra ruta no inspeccionada un consumidor productivo que convierta `RelationshipFabric` en un grafo espacial; no se encontró en la búsqueda realizada.
2. Si las relaciones IFC exportadas tienen round-trip semántico completo para espacios, aberturas, conectividad y límites; la metadata declara geometría conceptual y `nativeRvt: false`.
3. Si `projectVersion` de los adaptadores siempre corresponde a una revisión canónica durable, porque el adaptador deriva la versión de `model.generatedAt` y no muestra un vínculo a `revisionId`.
4. Si una relación `verified: true` fue validada por una persona, por una fuente externa o por una rutina; el adapter sólo transforma ese booleano en una clase de evidencia.
5. Si el espacio tiene geometría suficiente para un análisis de visibilidad o recorrido; `ConstructionSpace` contiene área, altura y muros, pero no un polígono, puertas, coordenadas de acceso o obstáculos completos.
6. Si las fórmulas constructivas cumplen las convenciones métricas de una futura métrica COCO-A; no hay contrato de unidades/tolerancias para sintaxis espacial.
7. Si los estados de agenda representan ocupación/uso espacial; el contrato actual describe tareas de construcción, no conducta de ocupantes.
8. Si la autoridad humana existente cubre una decisión espacial concreta; los gates se refieren al estado canónico/transaccional y no a un resultado COCO-A identificado.

## 4. Contratos compartidos auditados

| Contrato requerido | Dónde aparece | Evaluación COCO-A |
|---|---|---|
| `provenance` | `RelationshipRecord.provenance`, `TransactionProvenance`, repositorio canónico, ledger de evidencia | **PARTIAL/REUSABLE.** Hay varias formas válidas, pero falta un envelope común para input, transformación, algoritmo, actor, tiempo y revisión. |
| `evidence` | `RelationshipRecord.evidence`, validadores, `ARKI_JOB_EVIDENCE_LEDGER_SPEC.md` | **PARTIAL/REUSABLE.** Hay clases y mínimos, pero falta referencia resoluble/hash/versionado y vínculo obligatorio a cada métrica. |
| `UNKNOWN` | `EpistemicStatus`, estados BKH-4, matriz BKH-1 | **EXISTS/PARTIAL.** Existe vocabulario, falta política de activación, razones, propagación y resolución. |
| `applicability` | `applicabilityScale`, reglas de escala del fabric y BKH-1 | **EXISTS/PARTIAL.** Existe el campo, pero la aplicación real es un default `BUILDING`, no una decisión validada por análisis. |
| `scale` | `sourceScale`, `targetScale`, `applicabilityScale` | **EXISTS/REUSABLE.** Debe evitarse colapsar escalas cross-scale y debe probarse la compatibilidad del tipo. |
| `time` | `generatedAt`, `createdAt`, `timestamp`, `projectVersion`, `ScheduleTask` | **PARTIAL.** Hay tiempos heterogéneos sin semántica unificada de observación, validez, escenario y cómputo. |
| `scenario` | No se encontró un campo contractual común para escenario espacial | **MISSING/UNKNOWN.** La agenda y estados no sustituyen `scenarioId`. |
| `projectId` | modelo, elementos, repositorio canónico, DTO | **EXISTS/REUSABLE.** Debe propagarse a toda arista y resultado derivado. |
| `revision` | `relationshipRevisionId`, `revisionId`, `parentRevisionId`, fingerprints | **PARTIAL/EXTENDABLE.** Falta mapping obligatorio entre revisión relacional y canónica. |
| `determinism` | hashes, ordenamientos y pruebas de recálculo | **PARTIAL/REUSABLE.** Falta incluir timestamp/inputs/algoritmo y probar invariancia de grafos/métricas. |
| `Human Authority` | `HUMAN_AUTHORIZED`, `approvedBy`, estados transaccionales y gates | **EXISTS/PARTIAL.** Falta enlazar autorización a un resultado espacial exacto, inputs y revisión. |

## 5. Auditoría por dimensión COCO-A

### Grafos

**Estado: PARTIAL.** La materia prima de un grafo está presente en relaciones dirigidas, entidades, espacios, elementos y agenda. La Fabric ofrece identidad, validación de escalas/disciplinas, historial y consultas básicas. Sin embargo, no hay un objeto de grafo ni funciones de construcción, deduplicación topológica, recorrido, componentes, conectividad, detección de ciclos, matriz de adyacencia o pesos espaciales. La relación `BOUNDED_BY` sólo conecta espacio y muro; no crea automáticamente una arista espacio-espacio ni una ruta.

**Reutilización:** Fabric, adapters, IDs estables, historial y serialización.  
**Extensión necesaria:** contrato de nodos/aristas espaciales, reglas de derivación desde límites/aberturas, control de aristas ambiguas y estados UNKNOWN.

### Matemáticas

**Estado: PARTIAL.** Existen cálculos sólidos para longitud de muro, área neta, volumen, peso, presupuesto, geometría paramétrica y cambios dependientes. Las pruebas comprueban invariantes de muro, DTO, recálculo y determinismo de algunas salidas. No existe matemática específica de sintaxis espacial ni contrato para distancia topológica, profundidad, normalización, integración, elección, centralidad, visibilidad o sensibilidad a tolerancias.

**Reutilización:** funciones de redondeo, hashes, pruebas de invariantes y patrón de recálculo.  
**Conflicto:** no debe presentarse el metrado constructivo como evidencia de una métrica de configuración espacial.

### Programa

**Estado: PARTIAL.** El modelo expresa función, requisitos, estado y área del espacio; la agenda expresa tareas, precedencias, duración y elementos afectados. Falta un programa espacial formal que exprese adyacencias deseadas, separación, accesibilidad, privacidad, jerarquía de acceso, capacidad, secuencia de uso y trazabilidad requisito→relación→métrica. El tiempo de construcción no equivale al tiempo de ocupación o escenario de uso.

**Reutilización:** `ConstructionSpace`, `ScheduleTask`, `projectId`, `elementIds`, requisitos y gates.  
**Extensión necesaria:** programa relacional versionado y escenario de uso separado de 4D de obra.

### Relaciones espaciales

**Estado: PARTIAL.** Existen tipos constructivos y la Fabric permite añadir familias espaciales, con evidencia y provenance. Faltan relaciones analíticas de adyacencia, conectividad, acceso, visibilidad, separación, orientación, permeabilidad y recorrido. La presencia de una puerta o abertura en un muro no está formalmente ligada a un par de espacios ni a una condición de transitabilidad.

**Reutilización:** `RelationshipTypeRegistry`, validación mínima de evidencia, escalas, disciplinas e inversas.  
**Conflicto:** no interpretar `supports`, `rests_on`, `opens_to`, `bounds` o `BOUNDED_BY` como equivalentes de `ADJACENT`, `CONNECTED` o `VISIBLE`.

## 6. Recomendación de estado, sin propuesta de código

No se propone código en esta auditoría. Antes de cualquier implementación, el repositorio necesita una decisión contractual COCO-A que defina: (a) la representación espacial elegida y su aplicabilidad; (b) el envelope único de provenance/evidence/UNKNOWN; (c) el enlace `projectId`–`revision`–`scenario`–`time`; (d) las unidades, tolerancias y versiones de algoritmo; (e) la autoridad humana y el alcance exacto de su aprobación; y (f) fixtures neutrales y pruebas de determinismo. Hasta que esas decisiones existan, cualquier métrica de sintaxis espacial debe clasificarse **MISSING** o **UNKNOWN**, no como capacidad existente.

## 7. Conclusión auditable

El repositorio ofrece una base **REUSABLE/EXTENDABLE** para COCO-A en identidad, relaciones, espacios constructivos, cálculos deterministas, trazabilidad, revisiones y autoridad. El estado correcto no es EXISTS completo: es **PARTIAL**. Los fundamentos analíticos que distinguen una sintaxis espacial de un modelo BIM relacional —grafo espacial, topología de movimiento, programa espacial formal y métricas matemáticas de configuración— están **MISSING**. Los principales riesgos son **CONFLICT** entre evidencia declarada y estado epistemológico, entre `projectVersion` y revisión canónica, entre `BOUNDED_BY` y conectividad, y entre defaults de escala y aplicabilidad real. Los casos no demostrados deben conservarse como **UNKNOWN**.

**No se modificó ningún archivo de producto.** El único artefacto creado para esta tarea es este reporte.
