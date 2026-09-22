# ARKI — Implementación de mejoras 21

## Alcance incorporado

Se amplió ARKI sin crear un segundo motor. El runtime paramétrico existente ahora expone un **Project State gobernado**, un contrato de parámetros específicos por dominio, un catálogo de fuentes normativas y un adaptador determinista de geometría conceptual para tipologías especializadas. La biblioteca tipológica pasó de 51 a **69 tipologías declarativas**, conservando la identidad única de cada registro y la generación propuesta existente.

El Project State define versiones, procedencia, desconocidos, propuestas de cambio, estados `DRAFT`, `PROPOSED`, `APPROVED`, `REJECTED` y `FROZEN`, y exige revisión humana antes de mutar el estado. Las propuestas no se promueven automáticamente ni borran información.

El catálogo de parámetros contiene seis dominios: capacidad, geometría, circulación, ambiente, servicios y costos. Sus valores por defecto son supuestos conceptuales, no precios, normas ni hechos de sitio. Cada parámetro requiere evidencia antes de una decisión profesional.

El adaptador geométrico especializado produce zonas, relaciones de circulación y métricas conceptuales para hospitales, aeropuertos, terminales, estadios, parques, plantas, infraestructura hídrica, centralidades urbanas y otras familias. Su salida está marcada como `CONCEPTUAL`, `AI_PROPOSED` y `humanReviewRequired: true`; no sustituye cálculo estructural, BIM nativo, simulación física ni firma profesional.

El catálogo normativo incorpora referencias peruanas sectoriales como candidatos trazables. El estado es `REFERENCE_PENDING_VERIFICATION` y la adopción automática está desactivada. La fuente URL no se considera evidencia normativa vigente hasta su verificación humana y documental.

## API protegida añadida

La ruta `parametricRuntime` expone contratos públicos de lectura para Project State, parámetros, geometría especializada y fuentes normativas. También expone procedimientos protegidos para crear un Project State conceptual y proponer cambios. Estas operaciones permanecen en modo propuesta y requieren autorización real del proyecto; no habilitan mutación del SICL Core por sí solas.

## Validación ejecutada

TypeScript pasó. Las pruebas focalizadas de biblioteca tipológica, ejecución, DSL y mejoras normativas pasaron: **4 archivos y 14 pruebas**. El build completo pasó. `git diff --check` pasó y no se encontraron marcadores de conflicto en los directorios revisados.

## Gates pendientes

Continúan pendientes la persistencia productiva completa del Project State contra un SICL Core remoto conectado, la verificación de normativa vigente por jurisdicción, los hosts reales de Revit/Dynamo/Rhino/Grasshopper/Blender, la validación IFC/BIM con modelos productivos, simulaciones físicas y revisión profesional. Marketplace, reviews, analytics avanzados, proveedores de voz/distribución, ejecución sandbox aislada y publicaciones externas no se habilitan automáticamente mediante esta fase.
