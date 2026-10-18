> **© 2026 Wilfredo Yvan Castillo Quezada. Todos los derechos reservados.**
> **CONFIDENCIAL Y PROPIETARIO / CONFIDENTIAL & PROPRIETARY**
> Este documento constituye un secreto comercial y propiedad intelectual exclusiva de Wilfredo Yvan Castillo Quezada (Proyecto ARKI / SICL). Queda estrictamente prohibida su reproducción, distribución, modificación, ingeniería inversa o uso no autorizado, total o parcial, sin el consentimiento previo y por escrito del titular. Protegido bajo D.L. 822 (Perú), Convenio de Berna y ADPIC (OMC).
> **Regla de Sistema:** `ONE GEOMETRY. ONE SEMANTICS. MULTIPLE OUTPUTS.` | `HUMAN AUTHORITY = FINAL DECISION`
> **Guardrail aplicado:** `GUARDRAIL-IP-001`

---

# 📦 ARKI / ARQUI — PAQUETE RED TEAM ACUMULATIVO H-001 + H-002 + F-1

**ID del documento:** `ARKI-REDTEAM-H001-H002-F1-PACKAGE-v1.0`
**Estado epistémico:** `PROPOSED / PENDING DEEPSEEK STATIC RED TEAM`
**Autoridad:** Wilfredo Yvan Castillo Quezada (Product Owner)
**Fecha:** 2026-09-27
**Predecesores:** H-001 Examen 10 (322 PASS) · H-002 Examen 10 (337 PASS) · v6.2 Knowledge Base
**Regla rectora:** `REUSE → CONNECT → EXTEND → CREATE`
**Constitución aplicable:** INV-000 a INV-004 (quemados) · DL-01 a DL-10 · E-01 a E-07

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
- Solo se incluyen contratos, tests y interfaces derivadas
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
**Opción A: F-1 se cierra en H-002.** No se hereda a H-003.
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

1. [Bloque 1 — H-001 solo](#1-bloque-1--h-001-solo)
2. [Bloque 2 — H-002 solo](#2-bloque-2--h-002-solo)
3. [Bloque 3 — H-001 + H-002 juntos](#3-bloque-3--h-001--h-002-juntos)
4. [Bloque 4 — F-1](#4-bloque-4--f-1)
5. [Instrucciones para DeepSeek](#5-instrucciones-para-deepseek)
6. [Criterios de aceptación global](#6-criterios-de-aceptación-global)

---

## 1. BLOQUE 1 — H-001 SOLO

### 1.1 Objetivo
Auditar la base derivacional: bugs en primitivos, contratos y reglas de integridad.

### 1.2 Superficie de ataque
```typescript
VersionedRef {
  entityType: string;
  entityId: string;
  version: number;
  contentHash?: string; // SHA-256 opcional
}

TypedRelation {
  type: 'DERIVED_FROM' | 'COMPUTED_FROM' | 'SUPPORTED_BY';
  domain: 'computational' | 'epistemic' | 'architectural';
}

DerivationRecord {
  contractVersion: number; // Añadido en Examen 9
  derivationId: string;
  output: VersionedRef;
  method: { id: string; version: number };
  inputs: VersionedRef[];
  relations: TypedRelation[];
  assumptions: string[]; // Normalizadas: trim + unicidad
  fingerprint: string;   // SHA-256 de canonical_json
  projectId: string;     // Aislamiento por proyecto
  timestamp: string;
}

DerivationLedger {
  record(entry: Omit<DerivationRecord, 'contractVersion'>): Promise<DerivationRecord>;
  why(ref: VersionedRef): Promise<DerivationRecord[]>;
  list(): Promise<DerivationRecord[]>;
  stableFingerprint(params: {
    inputs: string[];
    relations: TypedRelation[];
    assumptions: string[];
  }): string;
  detectDiscrepancies(ref: VersionedRef): Promise<DiscrepancyKind[]>;
}

type DiscrepancyKind =
  | 'MISSING_DEPENDENCY'
  | 'VERSION_MISMATCH'
  | 'CONTENT_HASH_MISMATCH';