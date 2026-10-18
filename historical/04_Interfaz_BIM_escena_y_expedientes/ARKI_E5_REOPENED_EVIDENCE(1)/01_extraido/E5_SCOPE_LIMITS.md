# E5 — Límites de reapertura quirúrgica

**Estado de implementación:** `REOPENED FOR EVIDENCE CLOSURE / PENDING INDEPENDENT REVIEW`  
**Fecha:** 23 de septiembre de 2026  
**Regla:** un ciclo; sin features nuevas.

## Dentro del alcance

Esta reapertura sólo cierra los puntos documentales y cosméticos del freeze E5:

- ocho paneles documentales SVG;
- ocho conversiones WEBP;
- hashes SHA-256 y manifest completo;
- `E5_OUTPUTS.txt` consolidado;
- restauración ejecutada de snapshots con IndexedDB emulado mediante `fake-indexeddb`;
- restauración ejecutada de viewpoints con IndexedDB emulado mediante `fake-indexeddb`;
- controles independientes de cámara, nivel y filtro por altura en comparación lado a lado;
- vocabulario `heightFilterActive` / `heightFilter`;
- vocabulario `medición entre centroides`.

## Deuda aceptada

| Capacidad | Estado |
|---|---|
| Clipping geométrico real sobre sólidos | `DECLARED_DEBT / FUTURE` |
| Snapping profesional de vértices, caras y ejes | `DECLARED_DEBT / FUTURE` |

El filtro por altura actual sólo filtra nodos por coordenada Y. La medición actual calcula distancia entre centroides. Ninguna de las dos capacidades se presenta como clipping o snapping profesional.

## Fuera del alcance

No se agregan nuevas funciones del visor 3D, no se reabre E6, E7, E8 ni BKH-1, no se modifica el motor BIM, no se implementa WebGL clipping de sólidos, no se implementa snapping geométrico profesional y no se crea persistencia remota.

Las capturas son paneles documentales generados por script, no screenshots de interacción de UI.

**Manus reporta evidencia. DeepSeek/Product Owner emite el veredicto.**
