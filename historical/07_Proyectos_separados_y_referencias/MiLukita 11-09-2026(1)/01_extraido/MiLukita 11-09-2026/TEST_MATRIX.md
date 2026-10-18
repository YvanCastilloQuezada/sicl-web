# Test Matrix — Orden 25

## Dimensiones

La matriz combina dispositivo, navegador, experiencia, red y estado. No busca combinaciones infinitas; prioriza los caminos que pueden afectar sincronización, accesibilidad, QR y continuidad del resultado.

| Dispositivo | Navegador/entorno | Experiencia | Red | Estados mínimos | Evidencia |
| --- | --- | --- | --- | --- | --- |
| Laptop/PC | Chrome/Edge/Firefox | `/tv`, `/overlay`, PWA | estable, offline | loading, OPEN, LOCKED, RESULT, CONTINGENCY | automatizada + captura |
| Tablet | Chrome/Safari | TV, QR, juego | estable, degradada | OPEN, LOCKED, RECOVERY | automatizada responsive + QA |
| Celular | Chrome/Safari | QR, pantalla secundaria, juego | estable, caída | OPEN, DRAWING, RESULT, OFFLINE | E2E + QA físico |
| Smart TV | navegador TV compatible | `/tv` | estable, caída | inicio, LIVE, ONLINE, CONTINGENCY | QA físico |
| Android TV/Google TV | Chromium TV | `/tv`, overlay | estable, degradada | LIVE, RESULT, NEXT EVENT | QA físico |
| OBS | navegador/overlay | `/overlay/:roundId` | estable | OPEN, DRAWING, RESULT | revisión de operador |

## E2E principal

`CREATE PROGRAM → CREATE BLOCK → CREATE EVENT → APPROVE → PUBLISH → START → TV CONNECTS → QR → MOBILE CONNECTS → INTERACTION → LOCK → DRAW → RESULT → VERIFY → PUBLISH → NEXT EVENT`.

## Estados de evidencia

Una suite puede declarar `CODE_EXISTS`, `UNIT_TESTED`, `E2E_TESTED`, `MANUALLY_VALIDATED` o `NOT MEASURED`. No se debe convertir una prueba responsive de Chromium en una certificación de hardware físico.

## Fallos y recuperación

Cada escenario debe registrar la detección, el fallback, el estado después de reinicio y la conservación de la autoridad del resultado. La concurrencia de base de datos se ejecuta únicamente con `STAGING_DATABASE_URL` explícita.
