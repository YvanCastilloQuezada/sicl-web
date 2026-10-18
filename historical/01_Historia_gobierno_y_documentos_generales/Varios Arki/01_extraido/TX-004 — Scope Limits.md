# TX-004 — Scope Limits

TX-004 sólo implementa compensating transactions sobre `CanonicalDurablePersistence`. Incluye undo, redo, provenance de reversión, durable idempotency, CAS, revalidación obligatoria para redo, protección cross-project, clasificación de reversibilidad y pruebas adversariales.

Quedan fuera: migración de writers legacy, consolidación global de ownership, commit/rollback fuera de la ruta canónica, solvers profesionales, nuevas relaciones, nuevas constraints, regeneración productiva, BKH-5/6/7, E8, CAD, GEO, LUCA, MVH, ARKI-SEC y cualquier modificación de PF-H01 o PF-H01.R1.

La evidencia real de crash/restart cubre dos puntos de la matriz: `after-idempotency-write` y `after-current-write`. La pérdida física de energía no fue probada. Los seis puntos restantes de crash matrix no se promueven a PASS.

La revalidación de redo es una frontera explícita. El engine rechaza redo si el adapter no existe o si devuelve false. El paquete no afirma que el adapter haya ejecutado todos los solvers profesionales ni que TX-004 cierre BKH4 completo.

`UNDO(UNDO(T1))` no se reduce automáticamente a REDO. Cada transición de estado canónico debe conservar una identidad transaccional propia.

PF-H01 y PF-H01.R1 son constitucionales, inmutables y no reversibles dentro de este alcance. El engine rechaza targets protegidos y no incorpora secretos, recovery keys ni mecanismos de modificación in-app.

## References

[1]: ARKI_BKH4_TX_004_ORDER.md "Orden ARKI-BKH4-TX-004"
[2]: ARKI_FOUNDATIONAL_PRINCIPLE_PF-H01_LOCK.json "PF-H01 constitutional lock"
