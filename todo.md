# Project TODO

- [x] Panel autenticado de proyectos SICL con estado, versión y navegación de módulos.
- [x] Modelo persistente de proyectos y entidades SICL: fuentes, evidencia, requisitos, objetivos, restricciones y alternativas.
- [ ] Validaciones explícitas en backend para referencias, versiones, direcciones y pertenencia al proyecto.
- [ ] Capa tRPC como adaptador único entre la interfaz y los contratos de SICL.
- [ ] Vista Council y comparaciones estrictamente read-only.
- [ ] Flujo de Recommendations versionadas con razón y referencias analíticas explícitas.
- [x] Flujo de HumanReviews con actor, confirmación, versión observada y recommendation_version.
- [ ] Flujo de preparación y registro de Decisions exclusivamente humanas con autoridad explícita.
- [x] Timeline de auditoría con eventos, revisiones y decisiones sin secretos de autenticación.
- [x] Autenticación integrada con Manus OAuth y autorización por proyecto.
- [x] Diseño visual Command Center elegante, sobrio, profesional y responsive.
- [x] Pruebas Vitest para invariantes de backend, read-only y autoridad humana.
- [ ] Verificación visual y funcional en navegador en escritorio y móvil.
- [ ] Checkpoint final reproducible antes de entregar.

## Auditoría de integración — pendientes añadidos

- [ ] Integrar la capa tRPC con los contratos reales de SICL en `/home/ubuntu/SICL_0_2_1`, eliminando el modelo paralelo que relaja invariantes.
- [ ] Renderizar en la UI la salida real de Council y comparaciones desde el endpoint read-only.
- [ ] Completar el flujo web de evaluaciones y comparaciones trazables para habilitar Recommendations analíticas de extremo a extremo.
- [ ] Implementar versionado real del ciclo de Recommendations, no solo `recommendationVersion: 1`.
- [ ] Añadir paso separado de preparación de Decision antes del registro durable.
- [ ] Ejecutar y documentar el flujo completo en navegador en escritorio y móvil.

## Integración aprobada con núcleo Python

- [x] Definir contrato HTTP versionado entre el núcleo Python y `sicl-web`.
- [x] Implementar servicio adaptador Python separado sin duplicar reglas de dominio.
- [x] Conectar tRPC al adaptador mediante un cliente anti-corrupción autenticado.
- [ ] Verificar que errores de dominio, conflictos de versión y autoridad se preservan extremo a extremo.
- [ ] Verificar flujo completo en escritorio y móvil después de la integración real.

## Corrección de integración — pendientes

- [x] Implementar autenticación server-to-server real para `coreHttpClient` mediante secreto de entorno y rechazo explícito.
- [x] Delegar Recommendation, HumanReview y Decision desde tRPC al adaptador Python real.
- [x] Añadir pruebas de autenticación rechazada, errores de dominio y conflictos de versión propagados.
- [x] Añadir pruebas Vitest para las tres mutaciones tRPC delegadas cuando `SICL_CORE_URL` está configurado.
- [x] Hacer explícito que el endpoint web delegado acepta solo Recommendations analíticas o respetar `source` y `based_on_kind` sin inferencias.
- [ ] Probar propagación íntegra de errores 401, 409 y 422 desde el adaptador Python hacia tRPC.
- [x] Hacer explícito `based_on_kind` en el contrato tRPC para Recommendations analíticas y validarlo sin hardcode implícito.
- [x] Añadir una prueba que verifique el valor exacto de `based_on_kind` enviado al adaptador Python.
