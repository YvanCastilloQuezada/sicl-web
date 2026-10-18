# E7 — Límites de la reapertura quirúrgica

**Estado de implementación:** `REOPENED FOR EVIDENCE CLOSURE / PENDING INDEPENDENT REVIEW`  
**Fecha:** 23 de septiembre de 2026  
**Regla:** un solo ciclo de reapertura; sin features nuevas.

## Dentro de la reapertura

La reapertura sólo cierra evidencia de capacidades ya implementadas en el ciclo 1:

- ocho paneles documentales SVG;
- ocho conversiones WEBP;
- hashes SHA-256 para cada captura y artefacto;
- manifest E7 regenerado;
- un `E7_OUTPUTS.txt` consolidado;
- regresión de los 23 checks E7;
- regresión seleccionada E5, E6 y E8;
- `pnpm check` y `pnpm build`.

Las capturas son paneles documentales generados por script. No son screenshots de interacción de UI.

## Deuda declarada / fuera del alcance

| Capacidad | Estado |
|---|---|
| Catálogo corporativo PriceBook más allá del fixture | `DECLARED_DEBT / FUTURE` |
| Recursos, avance y calendario 4D visibles en UI | `DECLARED_DEBT / FUTURE` |
| Estados persistentes de clash y revisión visual | `DECLARED_DEBT / FUTURE` |
| Adaptadores visibles StructuralModel/MEPModel | `DECLARED_DEBT / FUTURE` |
| Solver OpenSees real | `NOT_DEMONSTRATED / PERMANENT DECLARED DEBT` |
| Dimensionamiento MEP profesional | `TOPOLOGY ONLY / PERMANENT DECLARED DEBT` |
| Firma profesional estructural o MEP | `NOT_IMPLEMENTED / DECLARED DEBT` |

El valor histórico `mep: "VERIFIED"` conserva su significado acotado: integridad topológica del fixture. No implica solver profesional ni diseño hospitalario firmado.

## Firewalls

No se reabren E5 ni E6. No se modifica E8. No se reabre BKH-1. No se agregan features, solvers, persistencia de clashes, recursos 4D, catálogo corporativo ni adaptadores profesionales.

**Manus reporta evidencia. DeepSeek/Product Owner emite el veredicto.**
