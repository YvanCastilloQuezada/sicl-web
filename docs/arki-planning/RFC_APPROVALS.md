# ARKI — RFC Approvals Registry

**Fecha de creación:** 2026-10-27
**Resuelve:** I-03 (`PRESENT / DOCUMENTARY` → `RESOLVED`)

## Propósito

Este documento registra el **estado de aprobación de cada RFC** de ARKI.
Sin este registro, un RFC puede estar "documentado" pero no "aprobado".

## Formato

| RFC | Título | Estado | Fecha propuesta | Fecha aprobación | Aprobador | Notas |
|-----|--------|--------|-----------------|------------------|-----------|-------|

## Estados

- `PROPOSED`: propuesto, no aprobado.
- `APPROVED`: aprobado por el PO, puede implementarse.
- `IMPLEMENTED`: aprobado e implementado.
- `REJECTED`: rechazado por el PO.
- `SUPERSEDED`: reemplazado por otro RFC.

## RFCs registrados

| RFC | Título | Estado | Fecha propuesta | Fecha aprobación | Aprobador | Notas |
|-----|--------|--------|-----------------|------------------|-----------|-------|
| RFC-002 | Core Contract v1 | `IMPLEMENTED` | (histórico) | (histórico) | PO | Consumido por PR #1 (RFC-002 phase D) |
| RFC-015 | Knowledge modules (phase A) | `IMPLEMENTED` | (histórico) | (histórico) | PO | PR #1 (`9ab6c8b2`), fase A |
| RFC-037 | Multi-Engine Absorption Doctrine | `APPROVED` | (histórico) | (histórico) | PO | Referenciado en `00_START.md` |
| RFC-037.1 | Vigilancia Semanal de Maestros (VSM) | `PROPOSED` | (histórico) | — | — | Pendiente de aprobación |
| RFC-024 | Frontend Architecture | `PROPOSED` | (histórico) | — | — | Documentado, no autoriza implementación |
| RFC-019 | (ver docs) | `PROPOSED` | (histórico) | — | — | Documentado |
| RFC-022 | (ver docs) | `PROPOSED` | (histórico) | — | — | Documentado |
| RFC-023 | (ver docs) | `PROPOSED` | (histórico) | — | — | Documentado |

## Reglas

1. **Un RFC sin registro de aprobación NO está aprobado.** La documentación no es aprobación.
2. **Un RFC aprobado NO es implementación.** La implementación requiere commit + CI verde.
3. **Un RFC implementado NO es despliegue.** El despliegue requiere Railway + E2E.
4. **El PO es la única autoridad de aprobación.** No hay aprobación automática.
