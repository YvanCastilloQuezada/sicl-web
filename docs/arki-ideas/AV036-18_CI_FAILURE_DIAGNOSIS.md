# AV036-18 — Evidencia de fallo CI y cierre condicionado

**Fecha:** 2026-10-16. **Estado:** `CI_FAILURE_CONFIRMED / TESTS_NOT_CERTIFIED / ROOT_CAUSE_UNKNOWN`.

## Evidencia observada de GitHub Actions

- Workflow: `.github/workflows/av036-recovery-validation.yml`
- Rama: `experiment/arki-ideas-mapa-vivo-20261015`
- Cinco runs consecutivos fallaron, incluso después de incorporar fixtures:
  - `38865140694` — SHA `5849b3f8`
  - `38865155758` — SHA `44d0da98`
  - `38865160828` — SHA `248206d3`
  - `38865174259` — SHA `70bcf3bb`
  - `38865193931` — SHA `8b334bfc775c1d998dab3e481bfb87603404674a`
- Último job: `recovered-smoke`, id `116856275529`, `failure`.
- En la API del último job `steps=null`, `logs_url=null`; la descarga de logs respondió `BlobNotFound`. El run terminó unos dos segundos después de iniciarse.
- Por tanto **no se puede afirmar que los tests Node se ejecutaron, ni diagnosticar con certeza si el fallo es de runner, política, infraestructura, workflow o código**. El fallo del workflow sí está confirmado.

## Procedimiento de validación reproducible

Ejecutar en checkout de la rama experimental, con Node 22 y Git:

```bash
bash experiments/arki-ideas/run-av036-validation.sh
```

El script imprime SHA exacto, versión de Node, archivos faltantes y TAP; termina con código no cero en cualquier fallo. No modifica archivos canónicos.

## Puertas de salida

1. Obtener al menos un log TAP completo y resultado `PASS` para el SHA exacto.
2. Confirmar correspondencia de archivos con blobs de origen; registrar excepción solo para fixtures reubicados y correcciones del laboratorio.
3. Revisar riesgo de `REC-006`: `sanitizeUrl` prohíbe secretos y protocolos no HTTP(S), pero **no impide acceso a IP locales, loopback o metadatos cloud**; prohibir URL de origen no confiable hasta implementar política segura. No exponer `observe()` a entradas arbitrarias.
4. Mantener `REC-003` como evaluador de métricas, NO simulador gemelo certificado.
5. Mantener `REC-001` y `REC-002` como proyección read-only y candidatos no promovidos.
6. **Sin poda de ramas, merge a main, cambios FROZEN ni promoción ACE88**.

### Dictamen

`PRESERVATION_PASS / PACKAGE_PREPARED / CI_FAIL / FUNCTIONAL_CERTIFICATION_BLOCKED / BRANCH_PRUNING_BLOCKED`.

Este reporte reemplaza cualquier interpretación de que "workflow creado" equivale a "tests PASS".
