# ARKI Master Codebook v1.0 Candidate

**Estado:** APPROVED / CANONICAL  
**Aprobación:** 23 de septiembre de 2026 — Product Owner / Human Authority  
**Tipo:** documentación y gobernanza; no modifica producto ni kernel.  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`. El worktree estaba sucio antes de esta orden.

## Propósito

Este documento es un diccionario de orientación del proyecto ARKI. No presenta como universales los códigos internos de ARKI y no completa significados por intuición. Cuando la evidencia disponible no permite reconstruir un significado con seguridad, se conserva `UNKNOWN` o `HISTORICAL_MEANING_NOT_FULLY_RECOVERED`.

## Taxonomía

| Categoría | Uso |
|---|---|
| HISTORICAL_PHASE | Fase histórica del desarrollo |
| CURRENT_PROGRAM | Programa vigente |
| WORK_ORDER | Orden de trabajo |
| CORRECTIVE_ORDER | Orden correctiva |
| DELTA | Cambio acotado sobre una entrega |
| AUDIT | Auditoría o revisión |
| TEST | Prueba o batería de pruebas |
| DEFECT | Defecto registrado |
| OPEN_ITEM | Pendiente abierto |
| INVARIANT | Regla que no debe romperse |
| CAPABILITY | Capacidad del producto |
| ENGINE | Motor computacional |
| FABRIC | Infraestructura semántica relacional |
| STANDARD / EXTERNAL_STANDARD | Estándar externo o referencia normativa |
| RESEARCH_PROGRAM | Programa de conocimiento |
| ARCHITECTURAL_DECISION | Decisión arquitectónica |
| EVIDENCE_PACKAGE | Paquete verificable |
| STATUS | Estado documental |

## Registro maestro resumido

| code | canonicalName | español | category | origin | parentProgram | currentStatus | confidence |
|---|---|---|---|---|---|---|---|
| D1–D18 | Historical D-series | Serie histórica D | HISTORICAL_PHASE | ARKI_INTERNAL | Historical development | HISTORICAL | LOW–MEDIUM |
| E1–E8 | Delivery / evolution series | Serie de entregas E | HISTORICAL_PHASE | ARKI_INTERNAL | Product evolution | E5–E7 FROZEN; E8 NOT_STARTED | MEDIUM |
| E5-PREVIEW | E5 preview state | Vista previa E5 | STATUS | ARKI_INTERNAL | E5 | FROZEN / PREVIEW | HIGH |
| E5-DEBT | E5 inherited debt | Deuda heredada E5 | OPEN_ITEM | ARKI_INTERNAL | E5 | FROZEN | HIGH |
| E6-D1–D9 | E6 debt items | Deudas E6 | OPEN_ITEM | ARKI_INTERNAL | E6 | PARTIAL / FROZEN | HIGH |
| E7-D1–D7 | E7 debt items | Deudas E7 | OPEN_ITEM | ARKI_INTERNAL | E7 | PARTIAL / FROZEN | HIGH |
| AKI-001 | Architect Knowledge / curriculum program | Programa de conocimiento del arquitecto | RESEARCH_PROGRAM | ARKI_INTERNAL | Knowledge / Intelligence | IMPLEMENTED / historical baseline | HIGH |
| UI-1 | BIM gateway and shell | Gateway y shell BIM | HISTORICAL_PHASE | ARKI_INTERNAL | UI program | APPROVE / CLOSED | HIGH |
| UI-1.5 | Complete i18n phase | i18n completo | HISTORICAL_PHASE | ARKI_INTERNAL | UI program | BLOCKED | HIGH |
| UI-2 | BIM workspace shell | Workspace BIM | HISTORICAL_PHASE | ARKI_INTERNAL | UI program | APPROVE / CLOSED | HIGH |
| UI-3A | Canvas BIM and selection | Canvas BIM y selección | HISTORICAL_PHASE | ARKI_INTERNAL | UI program | APPROVED / implementation lineage | HIGH |
| UI-3B/UI-3C/UI-3D | Later UI phases | Fases UI posteriores | HISTORICAL_PHASE | ARKI_INTERNAL | UI program | BLOCKED | HIGH |
| BKH-0 | Forensic Mapping | Mapeo forense | AUDIT / CURRENT_PROGRAM | ARKI_INTERNAL | BIM Kernel Hardening | VERIFIED | HIGH |
| BKH-1 | Relationship Fabric | Tejido de relaciones | FABRIC | ARKI_INTERNAL | BIM Kernel Hardening | VERIFIED | HIGH |
| BKH-2 | Constraint Engine | Motor de restricciones | ENGINE | ARKI_INTERNAL | BIM Kernel Hardening | VERIFIED | HIGH |
| BKH-3 | Regeneration Engine | Motor de regeneración | ENGINE | ARKI_INTERNAL | BIM Kernel Hardening | VERIFIED | HIGH |
| BKH-4 | Transaction Engine | Motor transaccional | ENGINE | ARKI_INTERNAL | BIM Kernel Hardening | BKH4-0/1/2 VERIFIED; BKH4-3 BLOCKED | HIGH |
| BKH-5 | Documentation Compiler | Compilador documental | ENGINE | ARKI_INTERNAL | BIM Kernel Hardening | BLOCKED | HIGH |
| BKH-6 | Performance Baseline | Línea base de rendimiento | CURRENT_PROGRAM | ARKI_INTERNAL | BIM Kernel Hardening | BLOCKED | HIGH |
| BKH-7 | Integrated Torture Test | Prueba integrada de tortura | TEST | ARKI_INTERNAL | BIM Kernel Hardening | BLOCKED | HIGH |
| FIX-BKH1-01–03 | Relationship corrections | Correcciones BKH-1 | CORRECTIVE_ORDER | ARKI_INTERNAL | BKH-1 | CLOSED / VERIFIED in scope | HIGH |
| FIX-BKH2-01–05 | Constraint corrections | Correcciones BKH-2 | CORRECTIVE_ORDER | ARKI_INTERNAL | BKH-2 | CLOSED / VERIFIED | HIGH |
| FIX-BKH3-01–05 | Regeneration corrections | Correcciones BKH-3 | CORRECTIVE_ORDER | ARKI_INTERNAL | BKH-3 | CLOSED / VERIFIED | HIGH |
| FIX-93C-01/03/05 | Consistency closure fixes | Fixes 93C | CORRECTIVE_ORDER | ARKI_INTERNAL | BKH closure | CLOSED in evidence scope | HIGH |
| OI-001–OI-012 | Open Items | Ítems abiertos | OPEN_ITEM | ARKI_INTERNAL | Kernel closure | Mixed; see ledger | HIGH |
| ORDEN 92A | BKH-3 corrective order | Orden correctiva BKH-3 | CORRECTIVE_ORDER | ARKI_INTERNAL | BKH-3 | CLOSED / evidence review | HIGH |
| ORDEN 93 | Kernel evidence closure | Cierre de evidencia Kernel | WORK_ORDER | ARKI_INTERNAL | BKH-0–3 | CLOSED / historical | HIGH |
| ORDEN 93A | Final kernel evidence closure | Cierre final de evidencia | WORK_ORDER | ARKI_INTERNAL | BKH-0–3 | CLOSED / historical | HIGH |
| ORDEN 93C | Kernel consistency closure | Cierre de consistencia | WORK_ORDER | ARKI_INTERNAL | BKH-3 | CLOSED / historical | HIGH |
| ORDEN 94A | BKH-4 contract closure | Cierre contractual BKH-4 | WORK_ORDER | ARKI_INTERNAL | BKH-4 | COMPLETED / review boundary | HIGH |
| ORDEN 95 | BKH4 foundation implementation | Implementación fundacional BKH4 | WORK_ORDER | ARKI_INTERNAL | BKH-4 | VERIFIED FOR APPROVED SCOPE | HIGH |
| ORDEN 95A | BKH4 foundation hardening | Endurecimiento BKH4 | CORRECTIVE_ORDER | ARKI_INTERNAL | BKH-4 | CLOSED / VERIFIED FOR APPROVED SCOPE | HIGH |
| ORDEN 96 | BKH4-3 Simulation Sandbox | Simulación aislada, validación y preview de consecuencias | WORK_ORDER | ARKI_INTERNAL | BKH-4 | IMPLEMENTED / PENDING INDEPENDENT VERIFICATION | HIGH |
| IFC | Industry Foundation Classes | Clases Fundamentales de la Industria | EXTERNAL_STANDARD | INDUSTRY / STANDARD | Interoperability | PARTIAL bounded implementation | HIGH |
| ISO 16739 | IFC standard reference | Norma ISO de IFC | EXTERNAL_STANDARD | STANDARD | IFC | REFERENCE | HIGH |
| CityGML | City model standard | Estándar de modelos urbanos | EXTERNAL_STANDARD | STANDARD | Future / open | REFERENCE; not implemented here | HIGH |
| Smart Cities | Domain/program concept | Ciudades inteligentes | RESEARCH_PROGRAM | INDUSTRY | Future / open | FUTURE REFERENCE | MEDIUM |
| Digital Twin | Domain concept | Gemelo digital | RESEARCH_PROGRAM | INDUSTRY / SCIENTIFIC | Future / open | FUTURE REFERENCE | MEDIUM |

### BKH4-1/2 hardening fixes

| Fix | Estado reconciliado |
|---|---|
| F1 — TransactionRevision state semantics | CLOSED |
| F2 — Declarative mutation security | CLOSED |
| F3 — Operation-specific mutation invariants | CLOSED |

## Estados documentales

`PROPOSED`, `DESIGNED`, `CONTRACT_APPROVED`, `IMPLEMENTED`, `PARTIAL`, `VERIFIED`, `HARDENED`, `FROZEN`, `BLOCKED`, `DEFERRED`, `SUPERSEDED`, `NOT_STARTED`, `NOT_DEMONSTRATED`, `UNKNOWN` y `CLOSED_FOR_APPROVED_SCOPE` se conservan como estados distintos. Un test PASS no convierte automáticamente un programa en VERIFIED.

## Correcciones forenses

Los identificadores D-series no tienen una reconstrucción completa en la evidencia actualmente accesible; no se inventa su significado individual. `E9`, `UI-4` y otros tokens detectados en documentación no reciben aquí un significado funcional sin registro contractual suficiente. Los estados de BKH-2/BKH-3 se expresan con el alcance real de sus informes y no como una afirmación de producto profesional completo.

## Fuentes

Véase `ARKI_CODEBOOK_EVIDENCE_INDEX.md`. Este documento es un candidato canónico y permanece pendiente de revisión independiente. La promoción conserva el historial anterior y se limita a los alcances evidenciados.
