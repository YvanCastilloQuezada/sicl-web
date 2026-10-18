# E8-A — Expediente técnico mínimo trazable

**Estado máximo:** `IMPLEMENTED / PENDING INDEPENDENT REVIEW`  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `c62183a`  
**Alcance:** un ciclo único de E8; sólo E8-A.

## Resultado

Se implementó y ejecutó el flujo mínimo autorizado:

```text
snapshot aprobado → compileTechnicalDossier() →
memoria + especificaciones + metrados + presupuesto + plano SVG
```

La compilación produjo cinco documentos físicos en `E8_A_OUTPUT/`. Cada documento conserva `sourceSnapshotId`, `sourceVersion` y una lista de `elementIds` fuente. El plano contiene además `data-element-id` por muro representado.

El snapshot de evidencia fue aprobado por `Product Owner`, con versión `1`. La compilación terminó en estado `COMPILED`, pero no se declara `VERIFIED` ni `APTO PARA CONSTRUCCIÓN`.

## Componentes implementados

| Componente | Ubicación | Estado |
|---|---|---|
| Contrato y tipos del compilador | `shared/arkiTechnicalDossierCompiler.ts` | IMPLEMENTED |
| Generación de expediente | `compileTechnicalDossier()` | IMPLEMENTED |
| Memoria descriptiva | `E8_A_OUTPUT/01-memoria-descriptiva.md` | GENERATED |
| Especificaciones técnicas | `E8_A_OUTPUT/02-especificaciones-tecnicas.md` | GENERATED |
| Metrados | `E8_A_OUTPUT/03-metrados.md` | GENERATED |
| Presupuesto | `E8_A_OUTPUT/04-presupuesto.md` | GENERATED |
| Plano mínimo | `E8_A_OUTPUT/05-planta.svg` | GENERATED |
| Capturas de evidencia | `E8_CAPTURAS/` | GENERATED |

## Pruebas ejecutadas

1. Un snapshot no aprobado es rechazado.
2. Un snapshot aprobado compila cinco documentos.
3. La trazabilidad conserva snapshot, versión y elementos BIM.
4. Presupuesto y plano contienen datos derivados y elementos trazables.

Resultado: **4/4 PASS**.

Además, `pnpm check`, `pnpm build` y `scripts/test-technical-dossier.ts` terminaron con `EXIT_CODE=0`.

## Límites

E8-A no implementa O-M ni el gate final E8-C. No genera PDF profesional, RVT, DXF ni documentación constructiva definitiva. Las especificaciones y el presupuesto son derivados de la información disponible y requieren revisión, coordinación y firma de especialistas. El expediente queda expresamente marcado como **NO APTO PARA CONSTRUCCIÓN**.

Las fases E5, E6 y E7 permanecen congeladas y no fueron modificadas.

## Evidencia

- `E8A_GENERATION_OUTPUTS.txt`
- `E8A_TEST_OUTPUTS.txt`
- `E8_CAPTURAS/01-expediente-compilado.svg`
- `E8_CAPTURAS/02-trazabilidad-snapshot.svg`
- `E8_MANIFEST.json`

**Manus reporta la evidencia. No emite el veredicto final.**
