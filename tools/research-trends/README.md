# Research & Trends — fuentes de vigilancia v1

Fuentes oficiales de **metadatos de versiones publicadas en GitHub** (no prueba de compatibilidad, licencia, seguridad, adopción ni cumplimiento normativo). Las URLs se encuentran en `sources.json`. Una fuente fallida se informa como `SOURCE_ERROR`; nunca se convierte en «sin novedades».

**Cadena de custodia:** identidad de repositorio fijada por configuración → HTTPS GitHub API → release id/tag/fecha/URL → comparación con snapshot anterior → agrupación por capacidad → comprobación de posible solapamiento con el estado canónico → `UPDATE_CANDIDATE` para evaluación humana. No se incorpora código ni se modifica el estado oficial.

**Primera ejecución:** genera línea base, sin llamar «novedad» a una versión que ya existía. Ejecutar posteriormente con `--previous` permite detectar cambios reales. Los reportes JSON pueden abrirse desde la Maqueta Viva sin conexión, previa selección manual del archivo.

**Límites:** comparar nombres y capacidades declaradas solo produce indicios de solapamiento, no demuestra equivalencia funcional. Las licencias y APIs deben auditarse aparte. La vigilancia normativa por jurisdicción y la evaluación de investigación académica requieren conectores y fuentes oficiales específicos, no están incluidos en esta primera fuente tecnológica.

**Ejemplo local:** `python tools/research-trends/watch.py --sources tools/research-trends/sources.json --canonical docs/arki-master-map/ARKI_MASTER_MAP_STATE.json --out-dir research-output`; después `--previous research-output/snapshot.json` en una ejecución posterior (con un directorio de salida diferente si se quiere conservar la línea base). En GitHub Actions el snapshot previo se restaura desde caché; los reportes se publican como artefactos descargables, nunca como cambios automáticos al roadmap.

**Gobernanza:** los candidatos son propuestas; `APPROVED_FOR_EVALUATION` autoriza estudiar, no integrar. Nunca escribir a `ARKI_MASTER_MAP_STATE.json`, a contratos FROZEN ni a ramas de producto.
