# 14 — World Engine

```text
REALIDAD → CAPTURA → WorldObject/WorldPoint → WORLD ENGINE → THE EYE
→ HUMAN AUTHORITY → PUBLISHED VERSION → RUNTIME → LUKA AR
```

## Implementado

WorldObject, claims, sources, evidence, snapshots, confidence, publicación separada y listados publicados existen en `server/territorialTrust.ts` y el schema. La ruta runtime filtra `PUBLISHED`.

## Parcial o externo

WorldPoint puede ser un concepto de geometría/territorio más que una tabla separada según el código actual. La colocación AR, interacción 3D, geofencing y visualización estable dependen de WebXR, GPS, GLB y dispositivo. No debe afirmarse que cualquier dato capturado ya aparece en AR: debe atravesar revisión y publicación.

## Invariante

`VERIFIED ≠ PUBLISHED`; el runtime no consume CAPTURED, DISPUTED, REJECTED ni UNPUBLISHED.
