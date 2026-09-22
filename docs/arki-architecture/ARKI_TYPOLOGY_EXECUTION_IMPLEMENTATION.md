# ARKI — Implementación ejecutable de tipologías

## Estado

Se implementó sobre el motor TypeScript existente una capa única de ejecución tipológica. La orden adjunta se adaptó desde sus módulos Python a contratos reutilizables de ARKI, sin crear un segundo motor ni ejecutar código Python arbitrario dentro del servidor.

La biblioteca vigente contiene **51 tipologías declarativas**. La nueva capa permite ejecutar cualquiera de ellas como una propuesta conceptual gobernada, incluyendo las familias educativas, salud, cultura, deporte, oficinas, comercio, industria, transporte, hospedaje, culto, paisaje y urbanismo representadas por la orden adjunta.

## Capacidades implementadas

| Capacidad | Estado | Descripción |
|---|---|---|
| Generación parametrizada | IMPLEMENTED | Produce una masa rectangular conceptual, dimensiones, niveles, áreas, capacidad, espacios y costo conceptual. |
| Parámetros | IMPLEMENTED | Acepta `area_m2`, `capacity`, `levels`, país y overrides tipológicos; valida rangos declarados. |
| Validación normativa | IMPLEMENTED | Convierte métricas a hechos normativos y ejecuta las reglas RNE de referencia disponibles en ARKI. Los resultados UNKNOWN y las referencias requieren revisión vigente. |
| Búsqueda tipológica | IMPLEMENTED | Búsqueda determinista por tokens sobre nombre, descripción, familia, dominios y métricas. Es una base reproducible; no se presenta como embeddings RAG productivos. |
| Exportación JSON | IMPLEMENTED | Exporta la propuesta, parámetros, geometría, métricas, espacios, provenance y gates. |
| Exportación GeoJSON | IMPLEMENTED | Exporta la huella rectangular conceptual como `FeatureCollection`. No representa un levantamiento GIS ni coordenadas geodésicas reales. |
| Exportación SVG | IMPLEMENTED | Exporta una lámina vectorial mínima de la masa conceptual. No sustituye planos constructivos ni renders. |
| Integración UI | IMPLEMENTED | Se añadió el panel de biblioteca ejecutable a `ARKI-PARAMETRIC-RUNTIME`. |
| Persistencia canónica | BLOCKED_BY_DESIGN | No se muta Project State ni SICL Core automáticamente. La propuesta debe pasar revisión humana. |
| Firma profesional | REQUIRED | Se conserva como gate antes de construcción, expediente o aprobación normativa. |

## API protegida

Se añadieron procedimientos al router `parametricRuntime`:

- `typologyExecution`: resumen de versión, cantidad y gates.
- `generateTypology`: genera una propuesta conceptual.
- `validateTypology`: ejecuta validación normativa sin promoción canónica.
- `searchTypologies`: busca tipologías de manera determinista.
- `exportTypology`: entrega JSON, GeoJSON o SVG para descarga.

Los procedimientos de generación, validación, búsqueda y exportación están protegidos por sesión. No reciben secretos del navegador, no ejecutan código arbitrario y no habilitan publicación automática.

## Límites explícitos

La implementación no declara que una tipología sea un expediente técnico, un modelo BIM coordinado, un cálculo estructural firmado, una cotización de mercado, un permiso, un archivo nativo RVT/3DM o una aprobación profesional. Las fórmulas de área y costo son conceptuales y deben sustituirse por programa, sitio, normativa vigente, precios observados, especialidades coordinadas y revisión humana.

Las tipologías adicionales del catálogo maestro de 855 registros continúan como banco de expansión documental. Para volverlas ejecutables se requiere convertir cada ficha propuesta en contrato con parámetros, reglas, evidencia, geometría, pruebas y revisión; no se las marca artificialmente como implementadas.

## Validación realizada

- TypeScript: PASS.
- Pruebas focalizadas de ejecución y biblioteca: **8/8 PASS**.
- Build completo: PASS.
- `git diff --check`: PASS.
- Escaneo de conflictos en los archivos modificados: PASS.
- Escaneo de ejecución arbitraria y secretos en el nuevo flujo: PASS.

## Reversibilidad

La integración se conserva en la rama de trabajo y se registrará en un checkpoint WebDev independiente. La restauración del checkpoint elimina la capa de ejecución nueva sin alterar el contrato histórico de la biblioteca declarativa.
