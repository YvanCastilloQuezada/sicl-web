# ARKI — Protocolo de ingestión automática de deltas

## Objetivo

Cada workbook, texto o fuente adjunta que sea identificado como un delta de ARKI debe reflejarse automáticamente en el **currículo vivo** y en el **Libro Vivo ARKI**, manteniendo provenance, versionado y límites epistemológicos.

## Operación

El comando reproducible es:

```bash
python3 scripts/arki_ingest_delta.py --file /ruta/al/delta.xlsx
```

También acepta `.md`, `.txt` y `.csv`. El ingestor:

- calcula el hash SHA-256;
- detecta duplicados;
- infiere un identificador versionado cuando es posible;
- copia la fuente al inbox versionado;
- actualiza `docs/deltas/ARKI-DELTA-REGISTRY.json`;
- agrega una entrada a `docs/deltas/ARKI-LIVING-CURRICULUM-AUTO-UPDATE.md`;
- vincula la fuente a los Volúmenes I, II y III;
- marca el conocimiento como `SUPPLIED_INPUT / NOT_LEARNED`;
- conserva la necesidad de revisión humana.

## Qué se actualiza automáticamente

La actualización automática es registral y curricular. Añade la nueva fuente al índice del Libro Vivo, prepara sus objetivos para los tres volúmenes y deja registrada la evidencia necesaria para futuros casos, ejercicios y pruebas de transferencia.

## Qué no se hace automáticamente

El ingestor no canoniza la fuente, no afirma que ARKI haya aprendido, no crea ganadores, no modifica geometría de proyectos, no ejecuta decisiones humanas, no emite aprobación profesional y no hace push a GitHub.

La promoción requiere una evaluación K0→K1. Debe distinguir la información suministrada del conocimiento previo, el conocimiento recuperado, el razonamiento ejecutado, las observaciones nuevas y el conocimiento persistido. También requiere transferencia positiva, restraint ante transferencia inválida y revisión humana.

## Límite operativo importante

El entorno conversacional no puede ejecutar código de manera invisible en el instante físico en que un archivo llega a una conversación nueva. En cada nueva sesión con un delta adjunto, el asistente debe invocar este ingestor antes de analizar o implementar el delta. Una futura interfaz web podría llamar al mismo comando desde un evento de carga de archivos.

## Estado

```text
INGESTION = IMPLEMENTED
CURRICULUM REFLECTION = IMPLEMENTED
LIVING BOOK REFLECTION = IMPLEMENTED
DUPLICATE PROTECTION = IMPLEMENTED
PROVENANCE = IMPLEMENTED
AUTO-CANONIZATION = FORBIDDEN
HUMAN AUTHORITY = FINAL
```
