# AKI-001 Curriculum Delta — BKH4 Order 95A

**Fecha:** 23 de septiembre de 2026

La Orden 95A endurece la fundación transaccional sin implementar simulación ni commit. El aprendizaje incorporado es: la identidad de una transacción debe permanecer separada de sus revisiones; el estado de ciclo de vida pertenece a `Transaction`, mientras una revisión sólo conserva estados de propuesta/evaluación restringidos. Los mutation sets deben ser declarativos, JSON-only, estructuralmente cerrados, con vocabulario de operaciones limitado y sin callbacks, intérpretes ni ejecución arbitraria. Cada operación requiere invariantes propios antes de cualquier futura ejecución. Todos los estados de simulation/commit/recovery permanecen no aplicables hasta autorización posterior.
