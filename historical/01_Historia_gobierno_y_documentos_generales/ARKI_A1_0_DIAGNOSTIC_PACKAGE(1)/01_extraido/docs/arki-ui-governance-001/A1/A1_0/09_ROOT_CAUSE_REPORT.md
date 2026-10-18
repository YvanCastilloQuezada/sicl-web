# Root-cause report

## What is confirmed

The production build contains matching chunks for all 12 direct lazy targets, and the canonical server returns HTTP 200 JavaScript responses. Representative components render after waiting. Therefore `CHUNK_NOT_REQUESTED`, `CHUNK_404`, `CHUNK_HTTP_FAILURE`, MIME failure, and source/build mismatch are not supported by the collected evidence for those targets.

## What is probable

The A0.R3 screenshots captured the global Suspense fallback before slower dynamic-import chains completed. This is demonstrated by the same runtime showing `Cargando módulo` at initial observation and meaningful UI after waiting; the strongest timing evidence is `/arki-research-review`, which remained fallback after two seconds and rendered after a longer wait. The cause is therefore **PROBABLE lazy-resolution latency / observation-window insufficiency**, not a confirmed permanent route failure.

## What remains unknown

A1.0 did not directly instrument JavaScript parse completion, `import()` promise settlement, or every route in an isolated browser context. It therefore does not upgrade the probable cluster to confirmed for all 14 routes. No repair is allowed under this wave.
