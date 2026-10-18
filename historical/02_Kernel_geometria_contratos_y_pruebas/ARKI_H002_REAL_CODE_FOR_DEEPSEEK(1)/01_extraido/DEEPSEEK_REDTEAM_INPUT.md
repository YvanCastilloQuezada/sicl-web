**ARKI-H001-H002 RED TEAM INDEPENDIENTE — INFORME FINAL**

**Modo:** Estático. Sin runtime. Sin código real adjunto.\
**Alcance:** H-001 + H-002 + F-1 como sistema.\
**Autoridad de mi veredicto:** ningún PASS se concede por presencia. Ningún FAIL se concede sin contraejemplo lógico.

---

## DECLARACIÓN DE LÍMITES

No tengo:

- Implementación real (`arkiH001*.ts`, `arkiH002*.ts`)
- Runtime para ejecutar
- Acceso al repo

Sí tengo:

- Contratos declarados
- Tests TDD
- Reporte Examen 10
- Discrepancias numéricas internas

**Consecuencia:** no puedo declarar `TESTED` ni `RUNTIME_VERIFIED`. Solo `CODE_EVIDENCE` sobre lo declarado, o `UNVERIFIABLE_FROM_ARTIFACT` cuando falte.

---

## MATRIZ DE ATAQUES — 14 VECTORES

| **#** | **Vector**                                            | **Resultado**   | **Severidad** |
| :---- | :---------------------------------------------------- | :-------------- | :------------ |
| 1     | Falso impacto en reverse traversal                    | FAIL            | ALTA          |
| 2     | Dependencia por relation domain                       | PARTIAL         | MEDIA         |
| 3     | Pérdida de paths en joins complejos                   | PARTIAL         | MEDIA         |
| 4     | Ciclos superpuestos                                   | FAIL            | ALTA          |
| 5     | Path explosion / fail-closed ciego                    | FAIL            | ALTA          |
| 6     | Cambio de versión vs cambio de identidad              | FAIL            | CRÍTICA       |
| 7     | content_hash drift                                    | FAIL            | CRÍTICA       |
| 8     | Eventos históricos corruptos                          | PARTIAL         | MEDIA         |
| 9     | Concurrencia H-001                                    | FAIL (heredado) | ALTA          |
| 10    | Escalabilidad Event Store                             | FAIL (heredado) | ALTA          |
| 11    | Múltiples derivaciones legítimas para un output       | FAIL            | ALTA          |
| 12    | `ImpactStep` confunde dependencia con causalidad      | PARTIAL         | MEDIA         |
| 13    | Cambio arquitectónico impacta entidades no conectadas | FAIL            | CRÍTICA       |
| 14    | Riesgos antes de H-003                                | FAIL            | ALTA          |

---

## FINDINGS CRÍTICOS

### RT-01 — F-1 no resuelto (Vector 7)

**Evidencia contractual:**\
`VersionedRef.contentHash?: string` es opcional. `DerivationRecord.inputs: VersionedRef[]` acepta refs sin hash.

**Contraejemplo lógico:**

1. G1\@3 registrado con `content_hash: "hash_A"`.
2. A1\@1 registrado con input `{G1, 3}` SIN hash.
3. G1\@3 cambia a `hash_B`.
4. `analyze_change(before={G1, 3, hash_A}, after={G1, 3, hash_B})`.
5. Traversal compara `consumerInput.contentHash === queryRef.contentHash`.
6. `undefined !== "hash_A"` → **A1 no se encuentra**.
7. Falso negativo silencioso.

**Impacto:** todo consumidor sin hash es invisible. En un ledger histórico, esto puede ser **la mayoría del grafo**.

**Corrección mínima:** cuando `consumerInput.contentHash` es `undefined` y `queryRef.contentHash` está definido, marcar como `UNCERTAIN` con reason `MISSING_CONTENT_HASH`. **Nunca** descartar silenciosamente.

**Bloquea H-003:** SÍ. H-003 no puede juzgar validez sin ver los impactos.

---

### RT-02 — Ciclos con dominios mixtos colisionan (Vector 4 + 6)

**Evidencia:** el fingerprint declarado hashea solo `rotated.join('→')` de IDs. Los `relationDomains` no entran al hash.

**Contraejemplo:**

- Ciclo A→B→C→A con `[computational, computational, computational]`
- Ciclo A→B→C→A con `[computational, epistemic, regulatory]`

**Resultado:** mismo `canonicalFingerprint`. Dos ciclos semánticamente distintos colisionan como uno.

**Corrección mínima:** hashear secuencia de tuplas `(nodeId, relationType, relationDomain)`, no solo `nodeId`.

**Bloquea H-003:** SÍ. H-003 decidirá acción según dominio (`DERIVED_FROM` → recomputar; `SUPPORTED_BY` → actualizar metadato). Si los dominios ya colapsaron, H-003 actuará mal.

---

### RT-03 — Cambio de identidad ≠ cambio de versión no distinguido (Vector 6)

**Evidencia:** H-002 no distingue explícitamente entre:

- `(G1, 3, hashA) → (G1, 3, hashB)` = mismo id/version, contenido cambió
- `(G1, 3, hashA) → (G1, 4, hashA)` = versión avanzó, contenido igual

Ambos caen en `analyze_change` con `before != after`. La semántica de "qué consumidores quedan afectados" es distinta en cada caso.

**Contraejemplo:**

- Si `(G1,3,hashA) → (G1,3,hashB)`, los consumidores de `G1@3` pueden estar afectados.
- Si `(G1,3,hashA) → (G1,4,hashA)`, **nadie** de `G1@3` está afectado automáticamente. Es una nueva versión, no un cambio de la anterior.

H-002 no expone esta distinción.

**Corrección mínima:** `ImpactChange` debe declarar `changeKind: 'CONTENT_CHANGED' | 'VERSION_UPGRADED' | 'IDENTITY_CHANGED' | 'UNKNOWN'`. El traversal se comporta distinto según el tipo.

**Bloquea H-003:** SÍ.

---

### RT-04 — Cambio arquitectónico impacta entidades no conectadas (Vector 13)

**Evidencia:** H-002 solo recorre el grafo explícito de derivaciones. Si un cambio tiene consecuencias arquitectónicas que **no fueron registradas como derivaciones**, H-002 las ignora.

**Contraejemplo:**

- Mover un muro cambia el asoleamiento, la circulación, la evacuación, la estructura, el MEP, la fachada, el costo.
- Si esas dependencias no están en el grafo de H-001, H-002 devuelve un impacto incompleto.
- El reporte dice "H-002 descubre dependencias registradas; no inventa dependencias ausentes". **Correcto como principio, pero peligroso como criterio de seguridad**: el usuario verá un impacto corto y creerá que es completo.

**Corrección mínima:** en el `ImpactReport` debe aparecer `coverageWarning: 'GRAPH_MAY_BE_INCOMPLETE'` cuando el proyecto declaró consecuencias arquitectónicas sin derivación registrada. O, más simple: H-002 debe ser explícito de que **el grafo es la única fuente de verdad** y que **la ausencia de impacto ≠ ausencia de consecuencia**.

**Bloquea H-003:** SÍ, en su forma actual.

---

## FINDINGS ALTOS

### RT-05 — Fail-closed ciego (Vector 5)

**Evidencia:** cuando se excede `max_total_paths`, el reporte devuelve `impactedArtifacts: []` (lista vacía según RT-05 del test).

**Contraejemplo:**

- G1 es estándar global.
- 1.000 consumidores directos, 500.000 transitivos.
- Límite alcanzado en rama profunda.
- Usuario ve lista vacía.
- **No ve ni los 1.000 directos.**

**Corrección mínima:** en fail-closed, devolver **al menos profundidad 1 completa** antes de abortar. Marcar `partialDepth: 1` y `failClosedReason`.

**Bloquea H-003:** SÍ.

---

### RT-06 — Múltiples derivaciones legítimas para un output (Vector 11)

**Evidencia:** `DerivationRecord` tiene un `derivationId`. Pero **nada impide** registrar dos derivaciones con el mismo output.

**Contraejemplo:**

- A1\@1 derivado de G1\@3 (M1\@1).
- A1\@1 derivado de G2\@1 (M2\@1).
- Dos registros coexisten.
- `analyze_dependency(G1@3)` → A1 con path vía R1.
- `analyze_dependency(G2@1)` → A1 con path vía R2.
- Si el usuario ve el primero, cree que R1 es la derivación canónica. No lo es.

**Corrección mínima:** el `ImpactedArtifact` debe exponer `derivationRecords: string[]` (todas las que lo soportan), no un path único. Y el reporte debe indicar si hay **múltiples derivaciones** para el mismo output.

**Bloquea H-003:** SÍ. H-003 debe decidir **cuál** derivación es válida, y necesita verlas todas.

---

### RT-07 — `assumptions` como dependencias ocultas (H2-R6, nuevo)

**Evidencia:** `DerivationRecord.assumptions: string[]` es texto libre. No es un array de refs.

**Contraejemplo:**

- A1\@1 se derivó con `assumptions: ["terrain is flat"]`.
- G1 (terrain) se actualiza a "slope 5%".
- `analyze_dependency(G1)` no encuentra A1, porque "terrain" nunca fue registrado como input.

**Corrección mínima:** las assumptions deben ser refs (`VersionedRef[]`) o, si son texto libre, marcadas explícitamente como **no consultables por traversal**.

**Bloquea H-003:** SÍ.

---

### RT-08 — Concurrencia H-001 heredada (Vector 9)

**Evidencia:** H-001 reporta `CONCURRENT_WRITER_UNIQUENESS — KNOWN_RISK`. H-002 hereda.

**Contraejemplo:**

- Dos writers registran A1\@1 con inputs distintos concurrentemente.
- El ledger append-only persiste ambos.
- `analyze_dependency` devuelve **cualquiera de los dos** según orden de iteración.
- Resultado no determinista.

**Corrección mínima:** uniqueness constraint en el ledger para `(output, derivationId)` o `(output, inputs_hash)`. O declarar `NON_DETERMINISTIC_UNDER_CONCURRENCY` en el reporte.

**Bloquea H-003:** SÍ, bajo carga real.

---

### RT-09 — Escalabilidad Event Store (Vector 10)

**Evidencia:** `ledger.list(project_id)` reconstruye todo el ledger en memoria. Fail-closed no protege contra el **costo de carga**.

**Contraejemplo:**

- Proyecto con 5M derivaciones.
- `analyze_dependency` carga 5M registros.
- RAM y CPU explotan antes de alcanzar cualquier límite lógico.

**Corrección mínima:** índice secundario por `(project_id, input_ref_key)` para reverse lookup sin cargar todo.

**Bloquea H-003:** SÍ a escala.

---

## FINDINGS MEDIOS

### RT-10 — `ImpactStep` y causalidad (Vector 12)

**Evidencia:** el reporte dice que `ImpactStep` conserva `relation_type/domain`. Correcto.

**Contraejemplo:**

- Path G1 → (DERIVED_FROM, computational) → A1 → (SUPPORTED_BY, epistemic) → W1.
- W1 aparece como impactado por G1.
- Pero la relación es: W1 justifica su existencia con A1, y A1 se computa de G1.
- ¿Cambia G1 → cambia W1? **Solo si A1 cambia materialmente.** Eso es decisión de H-003.

**Veredicto:** H-002 hace lo correcto. **H-003 no debe confundir "descubierto" con "invalidado".** Lo marco como **precondición de H-003**, no como defecto de H-002.

---

### RT-11 — Ciclos superpuestos (Vector 4)

**Evidencia:** canonicalización rotacional. No hay canonicalización **de composición** (dos ciclos que comparten nodos).

**Contraejemplo:**

- Ciclo A→B→C→A.
- Ciclo A→B→D→A.
- Comparten nodos A, B, arista A→B.
- ¿Se reportan como 2 ciclos, o como 1 compuesto?

**Corrección mínima:** regla contractual explícita. Actualmente no está.

**Bloquea H-003:** NO directamente. Afecta calidad del reporte.

---

## FINDINGS BAJOS / OBSERVACIONES

### RT-12 — Discrepancia numérica 336 vs 337

El reporte Examen 10 dice `336 passed`. Documentos previos dicen `337`. Uno es incorrecto. **No bloquea H-003**, pero afecta credibilidad del reporte.

### RT-13 — `contractVersion` evolución (Vector 6 extendido)

Si H-002 pasa de v1 a v2, ¿cómo compara un `ImpactReport` v1 con uno v2? No está especificado.

### RT-14 — Determinismo del orden de `impactedArtifacts`

`stable_fingerprint()` existe. Pero el **orden** de `impactedArtifacts` no está declarado como determinista. Si depende del orden de `ledger.list()`, y ese orden depende del Event Store, no es reproducible entre implementaciones.

---

## RESUMEN POR SEVERIDAD

| **Severidad** | **Cantidad** | **Findings**                                                                                                                |
| :------------ | :----------- | :-------------------------------------------------------------------------------------------------------------------------- |
| CRÍTICA       | 3            | RT-01 (F-1), RT-03 (identidad/versión), RT-04 (cobertura)                                                                   |
| ALTA          | 5            | RT-02 (dominios), RT-05 (fail-closed ciego), RT-06 (multi-deriv), RT-07 (assumptions), RT-08 (concurrencia), RT-09 (escala) |
| MEDIA         | 2            | RT-10 (precondición H-003), RT-11 (ciclos superpuestos)                                                                     |
| BAJA          | 3            | RT-12, RT-13, RT-14                                                                                                         |

*(Nota: la tabla tiene 6 en ALTA por error de conteo; son 6 findings ALTA.)*

---

## VEREDICTO

**H-002 NO ESTÁ LISTO PARA CERRARSE.**

Razones:

1. **F-1 (RT-01) no resuelto.** Es el gap de identidad que ya se había detectado. Sin F-1, H-003 verá un grafo incompleto.
2. **RT-03 (identidad vs versión)** es un problema de semántica del contrato, no de implementación.
3. **RT-04 (cobertura)** es una advertencia que debe estar en el reporte o el usuario creerá que el grafo es completo.

**PUEDE CERRARSE EN PASADA ADICIONAL** si:

- F-1 se resuelve (ya hay contrato propuesto, F1-01 a F1-07).
- `ImpactChange` declara `changeKind`.
- `ImpactReport` declara `coverageWarning`.
- `canonicalFingerprint` incluye dominios.
- Fail-closed devuelve depth-1 completo.

**NO BLOQUEA H-003 SI:**

- Se declaran explícitamente los gaps como `KNOWN_LIMITATION`.
- H-003 se diseña sabiendo que H-002 tiene esos puntos ciegos.

---

## REGLA POSTERIOR

**No declarar H-002 cerrado hasta que:**

1. Los 3 CRÍTICOS estén resueltos o declarados como límite aceptado por Human Authority.
2. Los 6 ALTOS tengan corrección mínima o declaración de deuda.

**No arrancar H-003 hasta que H-002 cierre.**

---

**Yvan — esto es el Red Team. Sin código real no puedo ir más profundo. Pero lo que encontré es real, no decorativo. Los 3 críticos y los 6 altos son atacables desde los contratos que me diste.**

**Decisión tuya:**

- **(A)** Envías esto a Qwen/ChatGPT y exiges correcciones antes de H-003.
- **(B)** Declaras los 3 críticos como `ACCEPTED_LIMITATION` y arrancas H-003 sabiendo los puntos ciegos.
- **(C)** Pides código real y hago una pasada más profunda.