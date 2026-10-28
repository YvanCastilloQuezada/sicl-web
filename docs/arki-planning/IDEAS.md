# ARKI — Ideas en Exploración (Ley del Embudo)

**Fecha de creación:** 2026-10-27
**Referencia:** Ley «La vida de las ideas es cruel» (`sicl-core/docs/ARKI_LAW_LIFE_OF_IDEAS_IS_CRUEL.md`)

## Principio

> **MUCHAS IDEAS NACEN... POCAS SOBREVIVEN.**
> **MATAR UNA IDEA ES BARATO. DESARROLLARLA ES CARO.**

ARKI explora miles de ideas (N), las filtra con restricciones verificadas, y solo las 16 supervivientes del primer corte se persisten. Esas 16 continúan al proceso 16→4→1.

## Reglas

1. **N → 16:** exploración amplia. Los descartes efímeros NO se guardan individualmente (solo se guardan las 16 finalistas).
2. **16 → 4:** evaluación multiobjetivo de las 16 finalistas.
3. **4 → 1:** selección final por autoridad humana (PO).
4. **Rechazo reversible:** las ideas rechazadas se marcan `REJECTED` con causa, no se borran.
5. **UNKNOWN no es rechazo:** las ideas sin datos se marcan `UNKNOWN/HOLD`, no se matan por desconocimiento.

## Estado actual

- **Ideas en exploración (N):** no cuantificadas
- **Ideas en el funnel (16):** pendiente de inventario
- **Ideas en evaluación (4):** pendiente
- **Ideas seleccionadas (1):** pendiente

## Cómo añadir una idea

1. Crear una entrada con `ID`, `Título`, `Descripción`, `Origen`, `Restricciones aplicables`.
2. Clasificar: `UNKNOWN`, `HOLD`, `ACTIVE`, `ADVANCED`, `REJECTED`, `SELECTED`.
3. Registrar la decisión en `DECISIONS.md` cuando pase de una etapa a otra.

## Ideas registradas

| ID | Título | Estado | Origen | Notas |
|----|--------|--------|--------|-------|
| IDEA-001 | Repositorio canónico de planificación | `SELECTED` | I-01 | Implementado en `docs/arki-planning/` (2026-10-27) |
