# ARKI — Repositorio Canónico de Planificación

**Fecha de creación:** 2026-10-27
**Autor:** Yvan Castillo Quezada (Product Owner)
**Estado:** Vigente
**Resuelve:** I-01 (`NOT_FOUND / DISTRIBUTED_ARCHIVE` → `RESOLVED`)

## Propósito

Este directorio es el **repositorio canónico de planificación** de ARKI.
Centraliza el backlog, el roadmap, las decisiones del PO y las ideas en exploración.

Antes de este repositorio, la planificación vivía distribuida en:
- `00_REVIVIR.md` (continuidad operativa)
- `00_ARKI_EXPEDIENTE_MAESTRO.md` (índice maestro)
- `todo.md` (backlog ligero)
- GitHub Issues (issues abiertos)

Este repositorio **no reemplaza** a esos documentos. Los **complementa** dándoles
estructura persistente y trazable.

## Archivos

| Archivo | Propósito |
|---------|-----------|
| `BACKLOG.md` | Lista priorizada de ideas/decisiones (I-01 a I-24) |
| `ROADMAP.md` | Hoja de ruta por fases (F1-F10) |
| `DECISIONS.md` | Registro de decisiones del PO |
| `IDEAS.md` | Ideas en exploración (Ley del Embudo N→16→4→1) |

## Reglas

1. **Nada se borra.** Las ideas rechazadas se mueven a `REJECTED` con causa, no se eliminan.
2. **Toda decisión del PO se registra en `DECISIONS.md`** con fecha, actor y justificación.
3. **El roadmap no es un compromiso.** Es una guía que se actualiza cuando cambia la realidad.
4. **Este repositorio no autoriza implementación.** Solo planifica. La implementación
   va por RFCs y commits, con autorización explícita del PO.
5. **Fuente de verdad:** este repositorio es la fuente para `I-01` y `I-02`.
   Para otras fuentes, consultar `ARKI_IDEA_AND_DECISION_INVENTORY.md`.

## Referencias

- `docs/arki-inventory/ARKI_IDEA_AND_DECISION_INVENTORY.md` — inventario completo
- `docs/ops/ARKI-LIVE-SYSTEMD-INTEGRATION-20261014.md` — ciclo vivo
- `00_REVIVIR.md` (raíz) — continuidad operativa
- `00_ARKI_EXPEDIENTE_MAESTRO.md` (en `sicl-core`) — índice maestro
