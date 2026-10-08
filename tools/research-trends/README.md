# Research & Trends — fuentes de vigilancia v1

Fuentes oficiales de **metadatos de versiones publicadas en GitHub** (no prueba de compatibilidad, licencia, seguridad, adopción ni cumplimiento normativo). Las URLs se encuentran en `sources.json`. Una fuente fallida se informa como `SOURCE_ERROR`; nunca se convierte en «sin novedades».

**Cadena de custodia:** identidad de repositorio fijada por configuración → HTTPS GitHub API → release id/tag/fecha/URL → comparación con snapshot anterior → agrupación por capacidad → comprobación de posible solapamiento con el estado canónico → `UPDATE_CANDIDATE` para evaluación humana. No se incorpora código ni se modifica el estado oficial.

**Primera ejecución:** genera línea base, sin llamar «novedad» a una versión que ya existía. Ejecutar posteriormente con `--previous` permite detectar cambios reales. Los reportes JSON pueden abrirse desde la Maqueta Viva sin conexión, previa selección manual del archivo.

**Límites:** comparar nombres y capacidades declaradas solo produce indicios de solapamiento, no demuestra equivalencia funcional. Las licencias y APIs deben auditarse aparte. La vigilancia normativa por jurisdicción y la evaluación de investigación académica requieren conectores y fuentes oficiales específicos, no están incluidos en esta primera fuente tecnológica.

**Ejemplo local:** `python tools/research-trends/watch.py --sources tools/research-trends/sources.json --canonical docs/arki-master-map/ARKI_MASTER_MAP_STATE.json --out-dir research-output`; después `--previous research-output/snapshot.json` en una ejecución posterior (con un directorio de salida diferente si se quiere conservar la línea base). En GitHub Actions el snapshot previo se restaura desde caché; los reportes se publican como artefactos descargables, nunca como cambios automáticos al roadmap.

**Gobernanza:** los candidatos son propuestas; `APPROVED_FOR_EVALUATION` autoriza estudiar, no integrar. Nunca escribir a `ARKI_MASTER_MAP_STATE.json`, a contratos FROZEN ni a ramas de producto.

## Ejecución separada en Windows

Desde la raíz del repositorio, ejecutar **`ARKI-RESEARCH-WATCH.cmd`** con conexión a internet y Python 3.10+. Guarda el informe en **`%LOCALAPPDATA%\ARKI\ResearchTrends\latest\report.json`** y conserva la última línea base exitosa en `previous\snapshot.json`. No modifica la Maqueta Viva ni el repositorio. Luego abrir la Maqueta Viva sin conexión, seleccionar **Research & Trends → Importar informe** y elegir el JSON. Los candidatos se presentan en amarillo como pendientes; al aprobar evaluación pasan a verde, sin integración automática.

## Ejecución programada

`.github/workflows/arki-research-trends.yml` tiene disparador manual y cron semanal (lunes, 11:20 UTC), pruebas, restauración de snapshot y artefacto JSON. **GitHub Actions ejecuta cron únicamente cuando el workflow esté en la rama predeterminada**; en esta rama de desarrollo el cron aún no está activo. El workflow tiene permisos `contents: read`, no realiza commits ni actualiza la fuente canónica. La caché es una ayuda operativa y puede expirar; si se pierde, la siguiente ejecución será nueva línea base y no fingirá detectar novedades históricas.

## Comparación con capacidades existentes

El observador cruza las novedades con señales **explícitas** del estado canónico (por ejemplo, autoridad OCCT de F6, ensayos booleanos de AGK y paquetes CAD/IFC de F7), y agrupa las novedades por capacidad para no crear un candidato por cada versión de un proveedor. **Solapamiento no equivale a duplicado funcional demostrado**: cualquier candidato exige contraste de contratos, APIs, licencias, rendimiento, pruebas y evidencia antes de añadir una función. La ausencia de señales no demuestra que la capacidad no exista.

## Pruebas

`python -m unittest discover -s tools/research-trends -p 'test_*.py' -v` (sin internet). El observador con fuentes reales no se considera verificado hasta ejecutar y conservar el informe y su resultado.
