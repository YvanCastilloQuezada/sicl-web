# ARKI — Work Ledger Canónico

**Fecha de creación:** 2026-10-27
**Resuelve:** I-02 (`PRESENT / PARTIALLY ACTIVE` → `RESOLVED`)

## Propósito

Este documento es el **work ledger canónico** de ARKI. Registra el trabajo
en curso, el completado y el pendiente, con owner, prioridad y fecha.

## Formato

| ID | Tarea | Owner | Prioridad | Estado | Fecha inicio | Fecha cierre | Notas |
|----|-------|-------|-----------|--------|--------------|--------------|-------|

## Trabajo en curso

| ID | Tarea | Owner | Prioridad | Estado | Fecha inicio | Notas |
|----|-------|-------|-----------|--------|--------------|-------|
| W-001 | Modificar `arki-av002-precedence.cjs` para detectar I-01 RESOLVED | PO | Alta | `IN_PROGRESS` | 2026-10-27 | Bloque 6 de la sesión |
| W-002 | Cerrar I-08 (OCR remoto) | PO | Media | `PENDING` | — | Requiere análisis técnico |
| W-003 | Cerrar I-12 (reverificación histórica) | PO | Media | `PENDING` | — | Requiere investigación |
| W-004 | Implementar autocorrección funcional real | PO | Media | `PENDING` | — | Misión del 00-START sección 5.2 |

## Trabajo completado

| ID | Tarea | Owner | Prioridad | Fecha cierre | Commit |
|----|-------|-------|-----------|--------------|--------|
| W-000 | Reparar worktree `av023-arbol-vivo` | PO | Alta | 2026-10-27 | (worktree reparado) |
| W-000 | Bind `0.0.0.0` para Árbol Vivo | PO | Alta | 2026-10-27 | `be3e1980` + `3cdff4ee` |
| W-000 | Verificar disparo del timer 19:00 | PO | Alta | 2026-10-27 | (log verificado) |
| W-000 | Doc de ops actualizado | PO | Alta | 2026-10-27 | `3db49934` + `639718e7` |
| W-000 | `00-START.md` actualizado | PO | Alta | 2026-10-27 | `35f6c50e` + `a41834ea` |
| W-000 | `00_ARKI_EXPEDIENTE_MAESTRO.md` actualizado | PO | Alta | 2026-10-27 | `4081124` |
| W-000 | Repositorio canónico de planificación | PO | Alta | 2026-10-27 | `8176cfee` |
| W-000 | I-01 → RESOLVED | PO | Alta | 2026-10-27 | `8176cfee` |
| W-000 | `00_START.md` consolidado como histórico | PO | Media | 2026-10-27 | `6adbdfbf` |

## Trabajo pendiente (backlog)

Ver `BACKLOG.md` para la lista completa de ideas (I-01 a I-24).

## Reglas

1. **Toda tarea tiene un owner.** No hay tareas huérfanas.
2. **Toda tarea tiene una prioridad.** No hay tareas "para algún día".
3. **Toda tarea cerrada tiene un commit o una evidencia.** No se cierra sin prueba.
4. **El backlog es la fuente de las tareas.** No se crean tareas fuera del backlog.
