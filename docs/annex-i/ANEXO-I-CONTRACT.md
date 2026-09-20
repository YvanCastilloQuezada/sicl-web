# ANEXO I — Evidencia Experimental y Reproducibilidad ARKI

## Estado

`ANEXO_I_CONTRACT = IMPLEMENTED / REFERENCE_ONLY`

ANEXO I es un **paquete formal de referencias** asociado a un experimento, checkpoint o delta. No es un informe, un delta, una entidad de conocimiento ni un evento de aprendizaje. Agrupa mediante manifest e índices los artefactos ya existentes de lectura humana, ejecución, pruebas, reproducción y trazabilidad epistemológica.

## Invariantes

- **ANEXO I ≠ informe:** referencia el informe humano y estructurado; no lo sustituye.
- **ANEXO I ≠ delta:** se asocia a un delta, pero conserva su fuente y provenance.
- **ANEXO I ≠ checkpoint:** conserva evidencia del checkpoint sin cambiar sus resultados.
- **ANEXO I ≠ conocimiento:** puede soportar o refutar claims, pero no canoniza claims.
- **ANEXO I ≠ learning event:** puede contener un candidato de aprendizaje, pero no lo promociona automáticamente.
- No duplica artefactos físicos existentes.
- No modifica resultados experimentales, estados UNKNOWN, estados epistemológicos ni autoridad humana.

## Estructura mínima

Cada entrada machine-readable declara `anexoType = "ANEXO_I"` y puede referenciar:

| Campo | Propósito |
|---|---|
| `anexoId`, `title`, `version` | Identidad del paquete |
| `experimentId`, `checkpointId`, `deltaId` | Asociación experimental |
| `baselineSha`, `finalSha` | Trazabilidad de código |
| `humanReport`, `structuredReport` | Informes existentes |
| `executableProof`, `tests`, `replayOrGenerator` | Reproducción |
| `experimentalArtifacts` | Planos, modelos u otros resultados |
| `epistemicStatus`, `unknowns`, `blocked`, `coverage` | Límites y cobertura |
| `regressionStatus`, `humanAuthorityRequired` | Validación y gobernanza |
| `propagationRefs` | Delta → ARKI → Currículo → Libro Vivo |
| `provenance` | Fuentes, hashes y lineage |

La fuente completa del delta permanece versionada en `docs/deltas/inbox/`; ANEXO I la referencia y no la reescribe.

## Paquetes formalizados

El manifest `manifest.json` contiene actualmente referencias para **R-PARTI I0–I11** y **P9.4→P9.x**. La formalización es metadata/index-only. No se ejecuta nuevamente P9.4 y no se reabre R-PARTI.

## Compatibilidad futura

Los futuros experimentos deben declarar el mismo `anexoType` y añadir una entrada al manifest. La validación debe comprobar existencia de referencias, provenance, estado epistemológico, UNKNOWN/BLOCKED, regresión y autoridad humana sin convertir una ausencia de evidencia en PASS.
