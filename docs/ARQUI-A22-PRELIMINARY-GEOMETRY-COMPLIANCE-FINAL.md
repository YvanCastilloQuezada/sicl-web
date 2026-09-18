# SiMS-DeI — ARQUI A22
# Revisión normativa A21 y geometría preliminar derivada

## Estado final

A22 queda implementada como una **traducción controlada de las zonas funcionales A21 a geometría preliminar de planta**. El resultado es un modelo espacial explícito y verificable a nivel de contención, solape y dimensiones preliminares. No es una planta constructiva, no contiene documentación ejecutiva y no constituye aprobación normativa.

```text
A21_COMPLIANCE_REVIEW = PASS_WITH_LIMITATIONS
A22_PRELIMINARY_GEOMETRY = PASS
WEB_FULL_SUITE = 335 passed
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
DECISION_CREATED = FALSE
RECOMMENDATION_CREATED = FALSE
HUMAN_AUTHORITY = PRESERVED
```

## Revisión normativa y de restricciones espaciales

La revisión reutiliza la fundación normativa A20-P3R. Se evaluaron como referencias candidatas RNE A.010, RNE A.120 y RNE A.130. En los tres casos el resultado es `INSUFFICIENT_CONTEXT` y `complianceStatus = NOT_ASSESSED`.

Esta clasificación es intencional. El programa A21 no suministra todavía jurisdicción del proyecto como hecho verificado, versión efectiva de cada fuente, fecha de vigencia, requisitos extraídos ni vínculos requisito–espacio. Por ello, ARQUI no afirma cumplimiento, no aprueba accesibilidad, no certifica evacuación y no selecciona automáticamente una interpretación normativa.

La revisión espacial preliminar sí comprueba determinísticamente que los espacios propuestos estén contenidos en el sitio, que no se solapen dentro del mismo nivel y que cumplan un umbral geométrico preliminar. El umbral es una salvaguarda interna del modelo, no una dimensión normativa. La continuidad del núcleo vertical y el ancho reglamentario de circulación permanecen `NOT_ASSESSED` porque A22 todavía no genera geometría de escaleras, ascensores, puertas reglamentarias ni rutas certificadas.

## Traducción A21 → A22

La traducción consume las zonas y relaciones de `HOUSE-A21`. Genera siete espacios preliminares:

| Nivel | Espacios derivados | Estado |
|---|---|---|
| N1 | Living/dining, kitchen, ground circulation | `DERIVED_PRELIMINARY_GEOMETRY` |
| N2 | Main bedroom, bedroom 2, private bath, upper circulation | `DERIVED_PRELIMINARY_GEOMETRY` |

Cada espacio conserva `programItemId`, `zoneId`, nivel, huella rectangular, área calculada, origen `A21_ZONE_TRANSLATION` y estado epistemológico explícito. Las relaciones A21 siguen siendo intención y soporte de organización; no se reinterpretan como muros, puertas o cumplimiento.

## Salvaguardas

A22 no crea decisiones, ganadores, recomendaciones ni documentación constructiva. La geometría se etiqueta como preliminar y requiere revisión humana. Si falta una zona A21, el sistema conserva un identificador `MISSING-*` en lugar de inventar una pertenencia. Las comprobaciones de solape se realizan únicamente entre espacios del mismo nivel.

La integración visible se añadió al panel `WorldClassArchitectPanel`. El panel muestra el número de espacios derivados, las restricciones geométricas aprobadas, las comprobaciones que todavía requieren evidencia y el estado de revisión normativa.

## Archivos principales

- `client/src/components/a22PreliminaryFloorPlan.ts`: modelo derivado, traducción A21→A22, restricciones y revisión normativa.
- `client/src/components/a22PreliminaryFloorPlan.test.ts`: pruebas focalizadas y controles negativos.
- `client/src/components/WorldClassArchitectPanel.tsx`: superficie visible de A22 dentro del panel ARQUI.

## Validación

La validación focalizada pasó con **13 pruebas** en A21/A22. La validación completa del Web pasó con **69 archivos de prueba y 335 pruebas**. TypeScript, build y `git diff --check` también pasaron. El build mantiene únicamente el warning preexistente de chunks grandes; no es un fallo de A22.

El Core no fue modificado y su árbol de trabajo permaneció limpio.

## Límites y siguiente gate

El siguiente gate seguro es completar los datos normativos verificables y definir un contrato explícito para traducir circulaciones y núcleos verticales a geometría. Antes de afirmar cumplimiento deben suministrarse jurisdicción, fuentes versionadas, requisitos extraídos y evidencia espacial asociada. Antes de generar una planta constructiva deben existir reglas adicionales para puertas, muros, accesibilidad, evacuación, instalaciones y resolución de conflictos.

## Referencias

[1]: docs/ARQUI-A21-FINAL-CONTROLLED-HOUSE-PROGRAM.md "A21 final controlled house program"
[2]: docs/ARQUI-A20-P3R-REGULATORY-APPLICABILITY-EVIDENCE-FOUNDATION-FINAL.md "A20-P3R regulatory applicability and evidence foundation"
[3]: client/src/components/a22PreliminaryFloorPlan.ts "A22 preliminary floor plan implementation"
[4]: client/src/components/a22PreliminaryFloorPlan.test.ts "A22 preliminary floor plan tests"
