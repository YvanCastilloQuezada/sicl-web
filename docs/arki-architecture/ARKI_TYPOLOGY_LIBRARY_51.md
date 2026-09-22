# ARKI — Biblioteca paramétrica de tipologías

## Estado

Se implementó `ARKI-TYPOLOGY-LIBRARY-1.0` con **51 tipologías declarativas** agrupadas en edificaciones residenciales, educación, salud, cultura, deporte, oficinas, comercio, industria, transporte, hospedaje, culto, paisajismo y urbanismo.

La biblioteca es consumible desde `ARKI-PARAMETRIC-RUNTIME` y expone un catálogo tRPC protegido por el contrato existente. Cada ficha contiene:

- identificador estable y nombre en español;
- categoría y escala (`BUILDING`, `SITE`, `CAMPUS`, `DISTRICT` o `CITY`);
- parámetros comunes de área, capacidad, niveles, país normativo y revisión profesional;
- dominios normativos y de coordinación transversal;
- métricas conceptuales sugeridas;
- evidencia mínima requerida;
- estado `REFERENCE_TEMPLATE`.

## Tipologías incluidas

| Grupo | Tipologías |
|---|---|
| Residencial | Vivienda unifamiliar, vivienda multifamiliar, conjunto habitacional, vivienda social |
| Educación | Educación inicial, escuela primaria, escuela secundaria, universidad |
| Salud | Puesto de salud, centro de salud, hospital general, hospital especializado |
| Cultura | Biblioteca, museo, teatro, centro cultural |
| Deporte | Estadio, coliseo, piscina deportiva, cancha deportiva |
| Oficinas | Edificio corporativo, coworking, edificio gubernamental |
| Comercio | Centro comercial, mercado, tienda departamental |
| Industria | Planta de manufactura, almacén, centro logístico |
| Transporte | Terminal terrestre, aeropuerto, puerto, estación de metro |
| Hospedaje | Hotel, hostal, resort |
| Culto | Iglesia, templo |
| Paisajismo | Parque urbano, plaza, alameda, malecón, jardín botánico, corredor verde, humedal artificial, parque metropolitano, recuperación ribereña |
| Urbanismo | Manzana urbana, barrio, sector urbano, ciudad |

## Integración

El runtime conserva el generador nativo de primera parte para geometrías conceptuales. El nuevo catálogo no finge generar expedientes completos ni modelos BIM coordinados automáticamente. La instancia de una tipología devuelve una propuesta `AI_PROPOSED` con `humanReviewRequired = true` y `persistence = PROPOSAL_ONLY`; no muta Project State ni promueve conocimiento al Core.

La validación normativa utiliza el motor RNE de referencia existente, con estados `PASS`, `FAIL` y `UNKNOWN`. La vigencia de cada regla, la normativa de otros países, el programa arquitectónico, las cargas reales, el cálculo estructural, la coordinación MEP, los costos y la firma profesional siguen requiriendo evidencia específica y revisión competente.

## Validación

TypeScript PASS; prueba focalizada de la biblioteca PASS; suite completa: **85 archivos y 372 pruebas PASS**; build PASS; `git diff --check` PASS. Permanecen únicamente advertencias no bloqueantes ya conocidas de `canvas/jsdom`, dimensiones de Recharts y tamaño de algunos chunks.
