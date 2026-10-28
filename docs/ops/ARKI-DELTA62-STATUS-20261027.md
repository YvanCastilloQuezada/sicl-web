# ARKI — Estado de Delta 6.2

**Fecha:** 2026-10-27
**Estado:** Implementado y verificado con tests

## Qué es Delta 6.2

Delta 6.2 es el **formato federado de conocimiento** de ARKI. Permite:
- Registrar conocimiento con provenance y sourceCommit.
- Particionar por producto: SHARED, ARKI, LUCA.
- Validar registros con humanReviewRequired.
- Proponer promoción sin mutación automática.
- Mantener separación entre CANDIDATE, STAGED, VALIDATED, CANONICAL, REJECTED, FROZEN.

## Implementación existente

**Archivo:** `shared/delta62Knowledge.ts`

**Funciones:**
- `validateDelta62Record()` — valida un registro.
- `partitionDelta62Records()` — particiona por producto.
- `makeDelta62LucaSeed()` — seed de LUCA.
- `proposeDelta62Promotion()` — propone promoción (sin mutar).
- `DELTA_62_AUTHORITY_BOUNDARY` — límites de autoridad.

**Tests:** `server/delta62Knowledge.test.ts` — 3 tests PASS.

## Autoridad

**Delta 6.2 NO es una vía de mutación canónica directa.** La autoridad es:
- `DELTA_62_AUTHORITY_BOUNDARY.directCoreMutation = false`
- `DELTA_62_AUTHORITY_BOUNDARY.directD2Mutation = false`
- `DELTA_62_AUTHORITY_BOUNDARY.directAgkMutation = false`

La promoción requiere revisión humana.

## Nota histórica

El 2026-10-27 se intentó implementar `delta62Pipeline.ts` como una versión alternativa. La auditoría reveló que `delta62Knowledge.ts` ya existía y era más completa. Se eliminó `delta62Pipeline.ts` para evitar duplicación.

## Referencias

- `shared/delta62Knowledge.ts` — implementación
- `server/delta62Knowledge.test.ts` — tests
- `docs/ops/ARKI-DELTA62-STATUS-20261027.md` — este documento
