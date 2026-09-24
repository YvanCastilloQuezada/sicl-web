# Design Funnel Event Model

Eventos normalizados: `HUMAN_DESIGN_SELECTION`, `DEEP_EVALUATION_STARTED`, `DEEP_EVALUATION_COMPLETED`, `RETURN_TO_FINAL_FOUR` y `NEW_GENERATION_REQUESTED`.

Los eventos son append-only dentro del estado de demostración y contienen referencias de evidencia. La UI muestra un historial breve; el contrato completo queda disponible para persistencia futura en CDE/Project State.
