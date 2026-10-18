# Contingency Engine

## Escenarios

El contrato contempla caída de TV, móvil, QR, base de datos, timeout de evento, fallo de draw, realtime, Scheduler, Avatar y contenido. Cada escenario sigue `DETECT → ISOLATE → FALLBACK → RECOVER → VERIFY → CONTINUE`.

## Fallbacks

Si falla la presentación, el resultado autoritativo no cambia. Si falla TV, el backend continúa. Si falla móvil, TV continúa. Si falla realtime, se usa polling. Si falla contenido o Avatar, se usa contenido estático seguro. Si la base de datos no está disponible, el sistema entra en modo degradado y no inventa estados.

## Evidencia

`shared/contingencyEngine.ts` conserva un snapshot confirmado, la causa, el paso actual y la garantía `resultAuthorityPreserved: true`. El Event Store debe registrar detección, fallback y recuperación cuando el entorno permita persistencia.

## Límite

La recuperación ante fallos de base de datos y concurrencia real requiere staging aislado. No se ejecutan simulaciones destructivas contra la base del piloto.
