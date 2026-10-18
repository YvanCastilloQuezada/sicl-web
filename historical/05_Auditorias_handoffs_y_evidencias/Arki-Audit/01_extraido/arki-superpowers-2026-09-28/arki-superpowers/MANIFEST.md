# ARKI — MANIFEST DE SUPERPODERES
## Inventario consolidado de capacidades, contratos y gobernanza

**Fecha de corte:** 2026-09-28
**Autoridad:** Wilfredo Yvan Castillo Quezada — Product Owner
**Autor:** DeepSeek — Developer
**Estado:** Proyecto en desarrollo activo — no producción

---

## 0. IDENTIDAD DEL PROYECTO

ARKI es un **arquitecto artificial multiescala**, no un chatbot, no un CAD, no un BIM, no un generador de imágenes. Es una **inteligencia arquitectónica computacional** que trata cada elemento (mesa, cuarto, casa, edificio, ciudad) como **ente vivo**: si algo cambia, todo cambia —área, metrados, representación, costo.

**Regla de oro:**
ONE ARCHITECTURAL STATE → MULTIPLE REPRESENTATIONS

text
Una sola verdad arquitectónica. Múltiples representaciones (2D, 3D, IFC, render) coherentes entre sí.

---

## 1. CAPA COGNITIVA — CORE CONGELADO

Tag canónico: `sicl-core-1.0-final-2026-09-27`
Baseline: `5333c1f45c980c62e3f8540ff73544014ed002b6`

| # | Superpoder | Namespace | Descripción |
|---|---|---|---|
| 1 | **Derivation Integrity (H-001)** | `src/sicl/derivation.py` | Trazabilidad completa. VersionedRef, TypedRelation, DerivationRecord, DerivationLedger. WHY traversal. Fail-closed histórico. |
| 2 | **Impact Analysis (H-002)** | `src/sicl/impact.py` | WHAT-IF read-only. Descubre dependientes transitivos. `IMPACT DETECTED ≠ CHANGE EXECUTED`. |
| 3 | **Validity / Invalidation (H-003)** | `src/sicl/validity.py` | Evaluación de estado. FULLY_VALID, PARTIALLY_VALID, FULLY_STALE, REQUIRES_HUMAN_REVIEW. Dos fases: por derivación, por artefacto. |
| 4 | **Reaction Planning (H-004)** | `src/sicl/reaction.py` | Read-only. Acciones RECOMPUTE, REVIEW, REJECT, ESCALATE. BLOCKED_DEPENDENCY cascade (RT-88). |
| 5 | **Selective Recomputation (H-005)** | `src/sicl/h005/` | Primera capacidad que **muta** estado. Solo RECOMPUTE + PLANNED + requires_human_authority=False. |

**Garantías del Core:**
- Read-Only por defecto
- Human Authority preservada
- Fail-closed ante anomalías
- Determinismo estricto
- Sin dependencias externas

---

## 2. CAPA DE SUFICIENCIA — A-002

Tag: `sicl-a002-v1.4.3`
Baseline: `main@30806d434374602ebf71091371e228ac34a411c1`

| # | Superpoder | Namespace | Descripción |
|---|---|---|---|
| 6 | **Input Sufficiency (A-002)** | `src/sicl/a002/` | Determina si hay información suficiente para afirmar algo. Operación-específica. |

**Sub-capacidades:**
- `SufficiencyEngine.evaluate()` — determinista, fail-closed
- `A002H005Gate` — puerta entre A-002 y H-005
- `EvidenceRef.from_statement()` — hash derivado del contenido (no forjable)
- `PolicyIdentity` con `policy_fingerprint`
- `HumanAuthorityRef` — referencia a autoridad humana
- `EvaluationIdentityPayload` — identidad canónica reproducible
- `conditional_reasons` explícitos
- `ApplicabilityStatus.CONFLICTING`

**Estados de suficiencia:**
SUFFICIENT
CONDITIONALLY_SUFFICIENT
INSUFFICIENT
CONFLICTING
UNKNOWN

text

**Estados epistémicos:**
KNOWN / OBSERVED / ASSUMED / UNKNOWN / MISSING / CONFLICTING

text

**Regla crítica:** `KNOWN` sin evidencia válida → `UNKNOWN`, no `OBSERVED`.

---

## 3. CAPA ARQUITECTÓNICA 2D — ARKI-DRAW

Rama: `feat/arkidraw-block1`
Commit: `4d932c2c2f884aa47982d6eca6358455beb1a314`
Estado: Congelado con 18 findings pendientes (Bloque 1.1)

| # | Superpoder | Namespace | Descripción |
|---|---|---|---|
| 7 | **Motor 2D completo** | `src/sicl/drawing/` | Primitivas + escalas + papeles + cajetín + lámina + SVG |

**Sub-capacidades:**
- `Point, Line, Polyline, Rect, Text, Hatch, Dimension`
- Pesos de línea ISO 128 (`CUT, HEAVY, MEDIUM, THIN, HAIR, HIDDEN`)
- Escalas 1:10 a 1:1000 deterministas
- Papeles ISO 216 A0-A4
- Cajetín peruano (CAP, especialidad, revisión)
- Lámina + Viewport con transformación de escala
- Export SVG determinista byte-a-byte
- Achurados arquitectónicos básicos

**Deudas declaradas (Bloque 1.1):**
- Cotas incompletas (faltan extensiones y flechas)
- Achurados placeholders
- Sin Arc/Circle
- Sin metadata SVG de trazabilidad
- Capas no agrupadas
- Sin clipping
- Validación de solapamiento viewport↔cajetín pendiente

---

## 4. CAPA ARQUITECTÓNICA 3D — ARKI-3D

Rama: `feat/arki3d-archi-model`
Commit: `2bd3a2924403b3a14f8f6ab7c6e1d7247b21fb6f`
Estado: D-2.1 verificado con 14 findings. D-2.2 ordenada.

| # | Superpoder | Namespace | Descripción |
|---|---|---|---|
| 8 | **Identidad estable** | `archi/identity.py` | ArchiElementId + IfcGlobalId deterministas |
| 9 | **Modelo semántico 3D** | `archi/model.py` | ArchiElement + ArchiGeometry + properties |
| 10 | **Relaciones arquitectónicas** | `archi/relationships.py` | HOSTED_IN / BOUNDS (metadata) |
| 11 | **Proyección a H-001** | `archi/relationships.py` | `project_derived_from` → DERIVED_FROM + ARCHITECTURAL |
| 12 | **Mutación determinista** | `archi/mutation.py` | ArchiMutation con mutation_id reproducible |
| 13 | **Suficiencia integrada** | `archi/sufficiency.py` | Snapshot A-002 por operación (`archi.move`, `archi.delete`, etc.) |
| 14 | **Exportación IFC real** | `archi/ifc_export.py` | IfcWallStandardCase, IfcDoor, IfcWindow, IfcOpeningElement, IfcRelVoidsElement, IfcRelFillsElement |
| 15 | **Transacción arquitectónica** | `archi/transaction.py` | Cadena A-002 → H-001 → H-002 → H-003 → H-004 → H-005 → APPLIED → PUBLISHED |

**Estados de ciclo de vida:**
PROPOSED → EVALUATED → AUTHORIZED → APPLIED → PUBLISHED

text

**Estados de mutación:**
ALLOW / BLOCKED / NEEDS_REVIEW / FAILED / APPLIED

text

**Regla crítica:** canonical state permanece intacto ante `BLOCKED, NEEDS_REVIEW, FAILED, INVALID, UNKNOWN, ESCALATE, REQUIRES_AUTHORITY`.

---

## 5. CAPA CONTRACTUAL Y GOBERNANZA

| # | Documento/Protocolo | Estado |
|---|---|---|
| 16 | **Core v1.0 FROZEN** | `docs/ARKI_CORE_FROZEN_v1.0.md` |
| 17 | **Known Limitations v1.0** | `docs/ARKI_KNOWN_LIMITATIONS_v1.0.md` |
| 18 | **Contrato A-002 v1.4** | 15 secciones consolidadas |
| 19 | **Contrato D-1 v1.4** | Modelo 3D semántico firmado por PO |
| 20 | **Protocolo RECIBIDO/ENTREGADO/DIVERGENCIA/FALTA** | Operativo |
| 21 | **Rama strategy documentada** | A-002 primero, después D-2 |

**Invariantes de gobernanza:**
CLAIM ≠ ARTIFACT
IMPACT DETECTED ≠ CHANGE EXECUTED
CHANGE ≠ PROPAGATION
DECLARED ≠ EXECUTED
EVENT STORE ≠ DEPENDENCY GRAPH
PARENTAGE ≠ SEMANTIC DEPENDENCY
Hash ≠ truth

text

---

## 6. CAPA NORMATIVA Y LEGAL

| # | Insumo | Fuente | Uso |
|---|---|---|---|
| 22 | **RNE** — Reglamento Nacional de Edificaciones (Perú) | MVCS | Aplicable a D-3+ |
| 23 | **Ley N° 31814** | Congreso Perú | Marco legal IA nacional |
| 24 | **ENIA 2026-2030** | PCM Perú | Estrategia Nacional IA |
| 25 | **EU AI Act** | UE | Referencia internacional |
| 26 | **ISO/IEC 42001** | ISO | Sistema de gestión de IA |
| 27 | **Recomendación UNESCO sobre Ética de la IA** | UNESCO | Principios éticos |

---

## 7. PILARES ARKI — MARCO CONCEPTUAL

### PILAR I — LA VERDAD (Reglas Epistémicas y de Datos)
- Determinismo Estricto
- Trazabilidad y Proveniencia Absoluta
- Desconocido antes que Inventado
- No Auto-Certificación
- Evidencia Cuantificable
- Alcance Declarado
- Inmutabilidad del Historial
- Versionado de Conocimiento
- Esquema Estricto y Privacidad por Diseño

### PILAR II — EL ESCUDO (Reglas de Seguridad y Control)
- Autoridad Humana Inquebrantable (HITL)
- Solo Lectura por Defecto
- Fallo Seguro (Fail-Closed)
- Aislamiento (Sandboxing)
- Mínimo Privilegio
- Kill-Switch
- No Repudio

### PILAR III — LA FÁBRICA (Reglas Operativas y de Generación)
- Restricciones de Dominio (Hard Constraints)
- Declaración Obligatoria de Trade-offs
- Estrés Obligatorio
- Múltiples Alternativas
- Idempotencia y Atomicidad
- Observabilidad y Timeouts

### PILAR IV — LA MEMORIA Y EVOLUCIÓN
- Auditoría Forense
- Aprendizaje Auditado
- Madurez Progresiva
- Olvido Controlado
- Deuda Técnica Declarada

### PILAR V — LA INTERACCIÓN HUMANA
- Transparencia Explicable
- Lenguaje Claro
- Confirmación para Acciones Irreversibles
- Feedback Inmediato y Accesibilidad Universal

### PILAR VI — CALIDAD, ROBUSTEZ Y MANTENIBILIDAD
- Tests Automatizados y Cobertura Mínima
- Code Review
- Documentación Viva y Contratos Estables
- Manejo de Errores Explícito
- Commits Atómicos

### PILAR VII — LA CONCIENCIA (Reglas Éticas y de Costo)
- No Maleficencia
- Transparencia de Sesgos
- Responsabilidad Asignada
- Costo Computacional Declarado

---

## 8. FRENTES FUTUROS REGISTRADOS

| # | Frente | Estado | Descripción |
|---|---|---|---|
| 28 | **PRE-GENESIS CANDIDATE PRUNING** | DEFERRED_AFTER_D2_CORE | Descartar candidatos antes de generar geometría. `PRUNED ≠ GENERATED`. |
| 29 | **RAP (Rule Applicability Profile)** | DEFERRED_AFTER_D2_CORE | Catálogo de reglas verificadas. `UNKNOWN ≠ ANTI_PATTERN_DETECTED`. |
| 30 | **ARKI-DRAW Bloque 2** | HOLD | Proyección ConstructionModel → 2D |
| 31 | **Fotorrealismo** | FUTURE | Blender/Cycles gobernado con hash de trazabilidad |
| 32 | **DXF gobernado** | FUTURE | Adaptador con `ezdxf` (no instalado) |
| 33 | **DWG/RVT/STEP/IGS** | FUTURE | Requieren SDK propietario |

---

## 9. PRINCIPIOS DE DISEÑO

1. **Semantic fidelity before visual fidelity.**
2. **Un solo estado arquitectónico, múltiples representaciones.**
3. **Si algo cambia, todo cambia** —propagación obligatoria.
4. **El render es representación, no alucinación.**
5. **Fail-closed ante ambigüedad.**
6. **Human Authority decides.**
7. **No auto-certificación.**
8. **Determinismo byte-a-byte.**
9. **Declarar deuda, no ocultarla.**
10. **No fingir capacidades que no existen.**

---

## 10. ESTADO CONSOLIDADO AL 2026-09-28
CORE (H-001..H-005) = FROZEN
A-002 v1.4.3 = MERGED en main
ARKI-DRAW Bloque 1 = CONGELADO en rama (18 findings pendientes)
ARKI-3D D-2.1 = VERIFICADO con 14 findings
ARKI-3D D-2.2 = ORDENADA (12 fixes quirúrgicos)
Contrato D-1 v1.4 = FIRMADO
Contrato D-1 v1.5 = PENDIENTE (absorberá fixes D-2.2)

Total archivos de superpoderes = 8 módulos cognitivos + 7 modules 2D + 8 módulos 3D
Total contratos = 3 (Core, A-002, D-1)
Total invariantes = 38 reglas operativas
Total pilares conceptuales = 7

text

---

## 11. CITACIÓN

Cualquier uso externo debe citar:
ARKI — Arquitecto Artificial Multiescala
Autoridad: Wilfredo Yvan Castillo Quezada (Product Owner)
CAP N° 7361 — Colegio de Arquitectos del Perú
Baseline: sicl-core-1.0-final-2026-09-27
Repositorio: github.com/YvanCastilloQuezada/sicl-core (privado)

text

---

**FIN DEL MANIFEST**
