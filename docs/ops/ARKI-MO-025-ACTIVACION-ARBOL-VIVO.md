# ARKI — MACROORDEN MO-025 · ACTIVACIÓN OPERATIVA DEL ÁRBOL VIVO
Fecha: 2026-10-14
Estado: EJECUCIÓN EXPERIMENTAL / NO CANÓNICA
Ámbito: sicl-web, rama test/arki-autonomy-offline-ci-20261014

## Mandato
Activar un ciclo autónomo **supervisado, auditable y recuperable** sin atribuirle aprendizaje arquitectónico, AGK real ni autoridad del PO que aún no posee.

## Órdenes de ejecución y puertas
1. MO25-01 Identidad: verificar SHA, repositorio, versión Node y entradas explícitas; abortar si no coinciden.
2. MO25-02 Observación: consumir exclusivamente instantáneas Core/Web suministradas, con procedencia verificable; no suponer que están actualizadas.
3. MO25-03 Pulso: reutilizar `arki-live-pulse.cjs` para diagnóstico, historial y replay, sin escribir sobre el canon.
4. MO25-04 Persistencia: mantener directorio de estado fuera del repositorio, protegido contra enlaces simbólicos y ejecuciones concurrentes.
5. MO25-05 Reanudación: permitir invocación repetida idempotente y registro persistente de cada intento; diferenciar ejecución y duplicado.
6. MO25-06 Programación: entregar unidades systemd de usuario **de instalación manual**. No instalar ni activar servicios desde GitHub.
7. MO25-07 Propuestas: derivar propuestas de los bloqueos con estado REVIEW_REQUIRED, sin aprobarlas ni aplicarlas.
8. MO25-08 Pruebas: adversariales de entradas inválidas, concurrencia, persistencia, reejecución y límites de autoridad.
9. MO25-09 Integración: evaluar D6.2, Delta 6.2 y AGK en laboratorio, con métricas reales, sin inventar competencia.
10. MO25-10 Aceptación: pruebas focales, CI offline, TypeScript, reinicio real ARKI-02 y revisión del PO.

## Definición de «vivo»
L1 = pulso manual y persistente probado.
L2 = pulso programado supervisado, reinicio/replay demostrado.
L3 = autodiagnóstico con propuestas verificables y trazables.
L4 = reparación aislada con pruebas, reversión y autorización explícita.
L5 = aprendizaje Delta 6.2 y AGK real con evaluación arquitectónica E2E.
**No declarar L2–L5 sin evidencia de ejecución.**

## Reglas innegociables
- F6 permanece descongelada; no auto-FROZEN.
- AGK único OCCT + ARKI_DELTA, 3D-first; sin motor paralelo.
- No modificar el canon, ni promover conocimiento, ni instalar servicios, ni ejecutar cambios protegidos sin PO.
- Si faltan entradas o son obsoletas: UNKNOWN/BLOCKED, nunca PASS ficticio.
- CERO DEUDA: no cerrar hitos sin pruebas adversariales y evidencia reproducible.
