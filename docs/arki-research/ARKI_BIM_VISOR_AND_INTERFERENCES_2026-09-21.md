# ARKI-BIM-VISOR — Visor BIM y coordinación

## Decisión de arquitectura

ARKI no crea un segundo motor geométrico. Reutiliza **ARKI-Parametric Runtime** como control plane de geometría y añade un visor BIM especializado para información de modelos, propiedades, coordinación y registro de incidencias.

`ARK` es el formato canónico de intercambio de ARKI. IFC y DWG se reciben mediante adaptadores gobernados. Revit (`RVT`) y MicroStation (`DGN`) requieren un host autorizado o convertidor porque sus formatos y ecosistemas no deben fingirse como parseados directamente desde el navegador.

## Flujo

`IMPORT → NORMALIZE → VIEW → CLASH CHECK → ISSUE REGISTER → HUMAN REVIEW → RESOLUTION`

El primer detector implementado usa **axis-aligned bounding boxes (AABB)** para localizar candidatos de interferencia entre disciplinas. Registra elementos, disciplinas, volumen de solape, ubicación, severidad y estado `OPEN`.

Una interferencia detectada no es automáticamente un error constructivo. Puede ser una tolerancia intencional, una representación simplificada, una duplicación de elementos, una diferencia de coordenadas o un problema real. Por eso la incidencia queda abierta para revisión humana y especializada.

## Compatibilidad

| Formato | Estado | Uso actual |
|---|---|---|
| ARK | Nativo canónico | Visualización y coordinación normalizada |
| IFC | Adaptador requerido | Inspección y normalización cuando exista parser aprobado |
| RVT | Host requerido | Revit/Dynamo o convertidor autorizado |
| DGN | Host requerido | MicroStation/ProjectWise o convertidor autorizado |
| DWG | Adaptador requerido | Geometría y capas mediante parser aprobado |

## Nuevas especialidades registradas

Se ampliaron las familias de agentes con ingeniería de sistemas, ingeniería informática, ingeniería de software, economía, contabilidad, finanzas, administración, organización empresarial, investigación de operaciones, ingeniería industrial, ingeniería agrícola, ingeniería forestal e información/seguridad digital.

Estas especialidades están registradas en el motor único con límites explícitos. Algunas están en estado `CONTRACT_ONLY` o `NOT_DEMONSTRATED`; esto significa que ARKI puede estructurar requisitos, dependencias y preguntas, pero no reclama autoridad profesional, opinión contable, aprobación financiera, firma de ingeniería ni certificación sectorial.

## Estado

Implementado y probado localmente. El visor se abre desde la página principal y conserva un acceso directo al runtime paramétrico para inspección geométrica avanzada. La detección AABB es una primera capa de coordinación; todavía no sustituye un motor geométrico B-Rep, un verificador IFC completo, Revit Navisworks, Solibri, BIMcollab u otra herramienta profesional de coordinación.
