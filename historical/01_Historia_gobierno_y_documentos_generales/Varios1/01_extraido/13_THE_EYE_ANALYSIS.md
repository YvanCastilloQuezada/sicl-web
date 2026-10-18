# 13 — Análisis de The Eye

The Eye revisa expedientes territoriales. Lee WorldObject, Claims, Sources, Evidence, versiones, hashes, snapshots y conflictos; contrasta consistencia y emite una decisión de revisión.

## Decisiones

`REQUEST_EVIDENCE`, `VERIFY`, `DISPUTE`, `REJECT`, `ARCHIVE`. `VERIFY` puede producir estado VERIFIED y score; no produce PUBLISHED automáticamente.

## Evidence Matrix

La matriz conceptual debe permitir relacionar claim, fuente, evidencia, fecha, origen, responsable, integridad y versión. El backend valida referencias de claim/evidence/object y registra evidencia revisada en `territorialVerificationReviews`.

## Confianza

El score se calcula a partir de cantidad de claims, fuentes, evidencia, precisión y estado. El score es una señal explicable, no una autoridad independiente.

## Límites

Eye Reviewer no publica ni modifica MJP CORE. Human Authority conserva la decisión de publicación. Conflictos se resuelven con opciones auditables.

## Estado real

Procedimientos y tablas: IMPLEMENTADO. Auditoría humana, calidad de fuentes y aceptación de la evidencia: REQUIERE_HUMANO. UX pública y desempeño en campo: NO_VERIFICADO.
