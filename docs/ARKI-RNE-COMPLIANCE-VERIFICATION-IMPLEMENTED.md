# ARKI — Verificación de cumplimiento RNE peruano

## Estado

`RNE_SOURCE_REGISTRY = VERIFIED_FOR_OFFICIAL_SOURCE_METADATA`

`RNE_PROJECT_COMPLIANCE_VERIFIER = IMPLEMENTED`

`PERMIT_READY = NOT_GRANTED`

`AUTOMATIC_APPROVAL = FORBIDDEN`

## Implementación

Se añadió `client/src/components/rnePeruCompliance.ts`, que incorpora un registro versionado de fuentes oficiales del RNE peruano y un verificador cerrado de evidencia. El registro incluye:

- Reglamento Nacional de Edificaciones y su índice oficial;
- G.010 Consideraciones Básicas, RM 278-2026-VIVIENDA;
- E.030 Diseño Sismorresistente, RM 183-2026-VIVIENDA, modificada por RM 217-2026-VIVIENDA;
- índice oficial de normas publicado por SENCICO.

El verificador exige simultáneamente:

1. jurisdicción `PERU`;
2. escala, uso y etapa del proyecto;
3. fuentes oficiales con versión, autoridad, provenance y estado `VERIFIED`;
4. requisitos RNE explícitos, interpretados y confirmados por revisión humana;
5. evidencia de proyecto con resultado `PASS`;
6. referencias al modelo canónico y a la evidencia documental/geometría;
7. ausencia de conflictos regulatorios sin resolver;
8. confirmación profesional identificable, con rol, fecha y `confirmationId`.

Solo si todos los gates pasan el resultado puede ser `VERIFIED`. En cualquier otro caso permanece `NOT_ASSESSED` con bloqueadores explícitos.

## Integración con permisos

`arkiPermitDocumentationOrchestrator.ts` acepta un resultado RNE `VERIFIED` y sus referencias para elevar únicamente el gate `P3_REGULATORY_APPLICABILITY` a `PASS_WITH_OBSERVATIONS`. Esto no eleva automáticamente:

- `permitReady`;
- `constructionReady`;
- P2 de ingeniería;
- P4 de exportación/round-trip;
- P5 de revisión profesional y firma;
- presentación o aprobación de autoridad.

## Invariante epistemológico

`RNE_SOURCE_VERIFIED != PROJECT_COMPLIANCE_VERIFIED != PERMIT_APPROVED`

El módulo no inventa artículos, valores, dimensiones, aplicabilidad ni cumplimiento. Un valor del RNE no se transforma automáticamente en una condición satisfecha del proyecto: debe existir requisito identificado, interpretación contextual, evidencia y revisión profesional.

## Validación

- `pnpm check`: PASS.
- Pruebas focalizadas RNE, fundamento regulatorio y orquestador: **14/14 PASS**.
- Regresión completa: **110 archivos, 849 pruebas PASS**.
- `pnpm build`: PASS.

## Fuentes oficiales

- [Ministerio de Vivienda — Reglamento Nacional de Edificaciones](https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne)
- [SENCICO — Normas del RNE](https://www.gob.pe/institucion/sencico/informes-publicaciones/887225-normas-del-reglamento-nacional-de-edificaciones-rne)
- [RM 183-2026-VIVIENDA](https://www.gob.pe/institucion/vivienda/normas-legales/8081915-183-2026-vivienda)
- [RM 217-2026-VIVIENDA](https://www.gob.pe/institucion/vivienda/normas-legales/8219609-217-2026-vivienda)

## Pendiente para una verificación real de proyecto

El proyecto debe aportar jurisdicción municipal aplicable, uso y categoría confirmados, etapa, levantamiento y modelo geométrico completo, requisitos específicos del RNE vigente, evidencia de cada requisito, coordinación estructural/MEP/seguridad/accesibilidad, revisión profesional firmada y, cuando corresponda, interacción con la autoridad competente. Sin esos datos, ARKI debe mantener `NOT_ASSESSED`.
