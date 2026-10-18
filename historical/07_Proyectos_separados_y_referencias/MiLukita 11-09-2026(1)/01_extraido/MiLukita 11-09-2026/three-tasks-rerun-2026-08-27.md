# Reejecución de las tres tareas finales

## Alcance

La reejecución cubrió el máximo verificable en Sandbox: navegación multidispositivo mediante viewports, contratos QR y medición de bundles. No se presentó como certificación física ningún resultado que requiera un televisor, teléfono o lector óptico real.

| Tarea | Evidencia ejecutada | Resultado | Límite |
|---|---|---|---|
| QA TV/QR | Capturas de `/tv`, `/generador-qr` y `/control-room` a 1280×720; `/tv` y `/generador-qr` a 390×844 | PASS visual reproducible; TV ofrece vivo/en línea y QR Studio muestra `REVIEW_ONLY` | No sustituye Samsung Tizen, LG webOS, Android TV, iOS/Android físicos |
| QR | `circularQr.test.ts`, `tvQrGoldenFlow.test.ts`, `qrExpiry.test.ts` y `customQrGenerator.test.ts` | 4 archivos y 17 pruebas PASS | No hubo cámara/lector óptico disponible; por tanto no se declara escaneo físico |
| Rendimiento | `IdentityParticipationPanel` en lazy import y `three` aislado en `vendor-three` | Control Room 57,74 kB; visor 53,61 kB; panel Identity 454,64 kB; vendor Three 568,57 kB | Three.js sigue por encima de 500 kB, pero solo se carga para el visor 3D; queda como trabajo futuro si se exige bajar ese vendor |

## Integridad y regresión

La reejecución no modificó MJP CORE, RNG, reglas, resultados, wallet, ledger, settlement ni MjpTvManifest. `pnpm check` pasó. La regresión terminó con 95 archivos PASS, 1 omitido, 320 pruebas PASS y 4 omitidas. `pnpm build` terminó PASS en 7,52 s. El aviso de `vendor-three` superior a 500 kB es no bloqueante y se mantiene visible para evitar ocultar el estado real.

## Clasificación final

La prueba de PDF administrativo queda **VALIDADA en navegador Sandbox** porque el modal produjo y abrió un PDF seguro con límites constitucionales, sin confirmar la aprobación. El QA de TV/QR queda **PROBADO en emulación de viewport**. El escaneo QR con cámara real y la compatibilidad certificada de hardware quedan **NO VERIFICABLES** en este entorno.

## Evaluación adicional del vendor 3D

Se probó una segunda estrategia de reducción: reemplazar el namespace `THREE` por imports nombrados en `LukitaBlockoutViewer`. TypeScript y el build pasaron, pero Rollup mantuvo el vendor en 568,57 kB; por tanto no se retuvo una afirmación de reducción adicional. La división efectiva sigue siendo separar el visor y `vendor-three` de la carga inicial del Control Room. Reducir el vendor por debajo de 500 kB requeriría sustituir o particionar la dependencia 3D, una decisión de producto que no se ejecutó automáticamente.
