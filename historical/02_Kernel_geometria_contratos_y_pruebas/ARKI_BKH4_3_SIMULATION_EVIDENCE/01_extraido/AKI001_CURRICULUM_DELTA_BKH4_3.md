# AKI-001 Curriculum Delta — BKH4-3 Simulation Sandbox

**Fecha:** 23 de septiembre de 2026

BKH4-3 incorpora al currículo de ARKI la distinción operacional entre proponer, simular y comprometer un cambio. La simulación debe trabajar sobre una copia aislada del estado canónico; BKH-1 aporta impacto relacional, BKH-2 aporta evaluación gobernada y BKH-3 aporta regeneración derivada. Ninguna de esas salidas autoriza commit.

La lección central es: `SIMULATION ≠ COMMIT` y `SIMULATED STATE ≠ CANONICAL STATE`. Las situaciones de evidencia insuficiente, dependencia ausente, stale base, bloqueo o fallo deben conservar su estado epistemológico y no convertirse en éxito silencioso.

El delta no habilita commit, rollback, undo, redo, persistencia atómica ni autoridad humana de commit.
