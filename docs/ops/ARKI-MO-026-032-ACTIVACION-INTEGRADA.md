# ARKI — PAQUETE DE MACROÓRDENES MO-026 A MO-032
Fecha: 2026-10-14
Rama de trabajo: test/arki-autonomy-offline-ci-20261014
Estado: EXPERIMENTAL / SIN PROMOCIÓN CANÓNICA

## Evidencia ARKI-02 aportada por PO
- Temporizadores activos: arki-handoff.timer, arki02-ci.timer, arki02-continuity.timer, arki02-git-sync.timer.
- arki02-ci.service: FAILED. Causa no determinada.
- Instantáneas encontradas: arki-repository-snapshot.json en varios worktrees, drizzle/meta/*_snapshot.json, experimentos ACE85 históricos.
- No hay evidencia de que los archivos listados sean entradas frescas y semánticamente compatibles para MO-025.

## MO-026 — Reconocimiento y coexistencia
Inventariar unidades systemd de usuario, sus archivos, estados, errores y calendarios. No reiniciar, deshabilitar, reemplazar ni alterar unidades existentes. Identificar causa del FAILED de CI con journalctl. Gate: informe verificable.

## MO-027 — Fuentes verificadas
Obtener snapshot real de Core y Web desde productores autorizados; validar esquema, identidad, procedencia, mtime, sincronización y ausencia de mutación. Nunca tratar drizzle/meta o snapshot de repositorio como mapa vivo. Gate: fixtures reales validados.

## MO-028 — Pulso supervisado
Reutilizar el ciclo MO-025 y el scheduler protegido. Integrar con systemd solo tras MO-026/027, evitando duplicación de temporizadores. Gate: dos ejecuciones reales, journal íntegro y no solapamiento.

## MO-029 — Reanudación y replay
Validar estado después de reinicio, idempotencia, protección contra corrupción y recuperación sin falsear eventos. Gate: evidencia antes/después de reinicio.

## MO-030 — Autodiagnóstico y propuestas
Priorizar actividades, fuentes, dependencias y bloqueos. Toda propuesta incluye motivo, prueba y estado REVIEW_REQUIRED; ninguna aprobación automática. Gate: propuestas reproducibles con procedencia.

## MO-031 — Autocorrección aislada
Probar cambios únicamente en ramas/worktrees experimentales, comparar baseline, ejecutar pruebas adversariales, preparar rollback y solicitar PO. No promover cambios protegidos. Gate: ensayo y reversión verificados.

## MO-032 — Auditoría de vida
Certificar separadamente L1 pulso persistente, L2 ejecución supervisada y reanudación, L3 propuestas trazables, L4 autocorrección controlada, L5 aprendizaje Delta 6.2 y AGK 3D real. No confundir pruebas unitarias con demostración operacional.

## Reglas
F6 sigue descongelada. AGK único OCCT + ARKI_DELTA, 3D-first. CERO DEUDA. Ningún PASS sin evidencia. No instalar servicios ni activar timers desde la rama. No alterar la instalación del usuario. La macroorden agrupa el trabajo; cada puerta conserva su propia evidencia.
