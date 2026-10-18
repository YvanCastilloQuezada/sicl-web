> **© 2026 Wilfredo Yvan Castillo Quezada. Todos los derechos reservados.**
> **CONFIDENCIAL Y PROPIETARIO / CONFIDENTIAL & PROPRIETARY**
> Este documento constituye un secreto comercial y propiedad intelectual exclusiva de Wilfredo Yvan Castillo Quezada (Proyecto ARKI / SICL). Queda estrictamente prohibida su reproducción, distribución, modificación, ingeniería reversa o uso no autorizado, total o parcial, sin el consentimiento previo y por escrito del titular. Protegido bajo D.L. 822 (Perú), Convenio de Berna y ADPIC (OMC).
> **Regla de Sistema:** `ONE GEOMETRY. ONE SEMANTICS. MULTIPLE OUTPUTS.` | `HUMAN AUTHORITY = FINAL DECISION`
> **Guardrail aplicado:** `GUARDRAIL-IP-001`

---

# 📦 ARKI — PAQUETE RED TEAM ACUMULATIVO v1.0
## H-001 · H-002 · F-1 · Secuencia Macro H-001 → BIM/Paramétrico

| Campo | Valor |
|---|---|
| **ID del documento** | `ARKI-REDTEAM-H001-H002-F1-PACKAGE-v1.0` |
| **Estado epistémico** | `PROPOSED / PENDING DEEPSEEK STATIC RED TEAM` |
| **Autoridad** | Wilfredo Yvan Castillo Quezada (Product Owner) |
| **Fecha** | 2026-09-27 |
| **Predecesores** | H-001 Examen 10 (322 PASS) · H-002 Examen 10 (337 PASS) · v6.2 Knowledge Base |
| **Regla rectora** | `REUSE → CONNECT → EXTEND → CREATE` |
| **Constitución aplicable** | INV-000 a INV-004 (quemados) · DL-01 a DL-10 · E-01 a E-07 |
| **Autorización** | Sí — Product Owner (Yvan Castillo) · 2026-09-27 |
| **Destino** | DeepSeek Red Team estático |

---

## ⚠️ DECLARACIÓN EPISTÉMICA CRÍTICA (LEER ANTES DE EJECUTAR)

### 1. Modo de revisión
**DeepSeek NO tiene runtime.** Este paquete está diseñado exclusivamente para **revisión estática** sobre:
- Contratos documentados (TypeScript interfaces)
- Tests TDD (criterios de aceptación, no evidencia de PASS)
- Interfaces derivadas (no implementación real)

### 2. Implementación real
**La implementación real de `arkiH001DerivationLedger.ts` y `arkiH002ImpactAnalyzer.ts` NO está adjunta en este paquete.**
- Los archivos fuente residen en el repositorio privado `YvanCastilloQuezada/sicl-web`
- Solo se incluyen contratos, tests e interfaces derivadas
- DeepSeek NO puede ejecutar código, encontrar bugs de implementación ni verificar comportamiento runtime
- DeepSeek SÍ puede: auditar coherencia contractual, detectar ambigüedades semánticas, identificar posibles violaciones de invariantes

### 3. Nombres de métodos (resuelto)
**Se mantienen DOS métodos semánticamente distintos en `ImpactAnalyzer`:**
- `analyze_dependency(ref: VersionedRef, options?: AnalysisOptions): Promise<ImpactReport>` — WHAT-IF estático
- `analyze_change(change: ImpactChange, options?: AnalysisOptions): Promise<ImpactReport>` — WHAT-IF dinámico

**NO existe `analyzeImpact()`.** Ese nombre fue un error en versiones anteriores del paquete y se corrige en esta v1.0.

### 4. Regla RC-08 (conteo de nodos en ciclos)
**Incorporada explícitamente al contrato de canonicalización:**
> El nodo raíz de la consulta SE INCLUYE en `affectedArtifacts` si forma parte del ciclo descubierto.
> CONTAJE = nodos únicos alcanzados desde `changed_ref` (incluye `changed_ref`).
> Excepción: self-loop A→A → `affectedArtifacts = [A]` (longitud 1).

### 5. Decisión F-1 (resuelto)
**Opción A: F-1 se cierra en H-002. No se hereda a H-003.**
- Reglas F1-01 a F1-07 implementadas
- Tests CF-1-01 a CF-1-03 deben pasar
- H-002 no puede cerrarse hasta que F-1 esté resuelto

### 6. Lo que DeepSeek debe hacer
- **Auditar estáticamente** los 4 bloques
- **Reportar findings** clasificados por severidad (CRITICAL / HIGH / MEDIUM / LOW)
- **Aportar contraejemplos lógicos** (no ejecución)
- **NO implementar** correcciones
- **NO modificar** contratos ni tests

---

## 📑 ÍNDICE

1. [Contexto y estado actual](#1-contexto-y-estado-actual)
2. [Secuencia macro H-001 → BIM/Paramétrico](#2-secuencia-macro-h-001--bimparamétrico)
3. [Contratos H-001 a H-006 (pregunta, contrato, cierre, entrada)](#3-contratos-h-001-a-h-006)
4. [Bloque 1 — H-001 solo](#4-bloque-1--h-001-solo)
5. [Bloque 2 — H-002 solo](#5-bloque-2--h-002-solo)
6. [Bloque 3 — H-001 + H-002 juntos](#6-bloque-3--h-001--h-002-juntos)
7. [Bloque 4 — F-1](#7-bloque-4--f-1)
8. [Interfaces derivadas H-001/H-002](#8-interfaces-derivadas)
9. [Red Team v2 — 10 ataques estáticos](#9-red-team-v2--10-ataques-estáticos)
10. [Notas epistémicas y límites](#10-notas-epistémicas-y-límites)
11. [Próximos pasos y criterios de aceptación](#11-próximos-pasos-y-criterios-de-aceptación)

---

## 1. CONTEXTO Y ESTADO ACTUAL

### 1.1 Lo que YA está DEMONSTRADO

| Componente | Estado | Evidencia |
|---|---|---|
| H-001 Derivation Integrity | ✅ `REFORZADO HASTA EXAMEN 10` | 322 PASS / 0 FAIL Core reproducible |
| H-002 Impact Analysis | ⚠️ `EN DESARROLLO / EXAMEN 10` | 337 PASS / 0 FAIL; cycle canonicalization EN VERIFICACIÓN |
| D6.2 Reasoning Harness | ✅ `DEMONSTRATED` | Microcaso validado |
| D6.3 Geometric Bridge | ✅ `DEMONSTRATED` | Microcaso conceptual |
| D6.4 OCR/Vision | ✅ `DEMONSTRATED` | Source Library + provenance |
| L2 Transfer Runtime | ✅ `DEMONSTRATED` | Bounded scope |
| R-PARTI guardrails | ✅ `FROZEN CORE` | RP-01 a RP-05 |

### 1.2 Lo que NO está demostrado (honestidad epistémica)

| Componente | Estado | Razón |
|---|---|---|
| H-002 cycle canonicalization | ⚠️ `EN VERIFICACIÓN` | Prueba final no ejecutada |
| F-1 (gap identidad) | 🔴 `NO RESUELTO` | Requiere modificación H-002 |
| H-003 Validity/Invalidation | 🔮 `FUTURE` | Bloqueado hasta cierre H-002 |
| H-004 Reaction Plan | 🔮 `FUTURE` | Bloqueado hasta H-003 |
| H-005 Selective Recompute | 🔮 `FUTURE` | Bloqueado hasta H-004 |
| H-006 Architectural Re-evaluation | 🔮 `FUTURE` | Bloqueado hasta H-005 |
| WALL-MOVE E2E | 🔮 `FUTURE` | Bloqueado hasta H-006 |
| 16 → 4 → 1 Optimization | 🔮 `FUTURE` | Bloqueado hasta WALL-MOVE |
| BIM / Paramétrico | 🔮 `FUTURE` | Gap UNK-KR62-004 |

### 1.3 Secuencia obligatoria (R-10: No auto-chain)
