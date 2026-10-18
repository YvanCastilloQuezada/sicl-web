# Product findings vs harness findings

## Product/runtime findings

The production runtime can render several previously marked routes. Two rendered route screens expose Core HTTP 503; this is a dependency boundary, not lazy failure. One route entered the authentication flow. Six routes remained in Suspense without positive lazy-chain failure evidence.

## Harness/observation findings

A screenshot or an immediate `Cargando módulo` state is insufficient to conclude that the route is permanently blocked. Results varied between navigation attempts and browser state: some chunks were present and some pages rendered normally, while others stayed in Suspense. This supports an observation/runtime-state contribution, but does not prove that all remaining cases are a harness defect.
