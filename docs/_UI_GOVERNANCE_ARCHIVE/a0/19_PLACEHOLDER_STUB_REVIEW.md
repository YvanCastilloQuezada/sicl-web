# A0 — Placeholders, mocks y stubs

El inventario detecta vocabulario que puede indicar `placeholder`, `mock`, `demo`, `sample`, `stub` o `coming soon`. Estos términos no prueban que una ruta sea falsa: algunos pertenecen a ejemplos didácticos o a contratos intencionalmente gated.

La regla A0 es no presentar un demo como integración real. Cada superficie debe declarar si usa fixture, cálculo local, almacenamiento real, endpoint real, WebSocket real o host externo. Si el código solo prepara el adaptador, el estado correcto es `PREPARED_NOT_CONNECTED`, no `FUNCTIONAL`.
