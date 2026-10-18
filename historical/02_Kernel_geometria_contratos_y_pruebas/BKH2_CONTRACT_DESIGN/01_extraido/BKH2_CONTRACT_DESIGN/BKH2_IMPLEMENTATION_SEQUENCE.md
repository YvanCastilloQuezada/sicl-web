# BKH-2 — Future Implementation Sequence

**Estado:** diseño de secuencia; no autorizada.

1. **Gate 1 — Baseline Freeze.** Congelar repository, branch, HEAD, worktree, hashes y regresión.
2. **Gate 2 — Constraint Schema + Registry.** Implementar sólo tipos canónicos y validar el registry.
3. **Gate 3 — Evaluation Core.** Implementar evaluación pura, unidades, estados y evidencia.
4. **Gate 4 — Relationship Fabric Integration.** Consumir BKH-1 por IDs y consultas; no copiar relaciones.
5. **Gate 5 — Legacy Adapters.** Adaptar reglas existentes con equivalencia y clasificación explícita.
6. **Gate 6 — Persistence / Revision History.** Persistir constraint revisions sin asumir Transaction Engine.
7. **Gate 7 — Negative and Adversarial Tests.** Probar UNKNOWN, unidades, escalas, evidencia y no mutación.
8. **Gate 8 — Regression.** Ejecutar check, build, regresión de dominio y pruebas específicas.
9. **Gate 9 — Evidence Closure.** Generar outputs crudos, manifest, hashes y veredicto.

Ningún gate autoriza el siguiente automáticamente. BKH-3 y BKH-4 permanecen fuera de la secuencia.
