# MiLukita — Plan de avance autónomo de agentes

**Estado:** plan ejecutable en sandbox; no equivale a operación productiva. **Regla constitucional:** ningún avance de madurez puede declarar datos, conectores, aprobaciones o certificaciones inexistentes.

## Criterio de avance

Un agente puede subir de `PLANNED` o `PREPARED` a una evidencia técnica superior únicamente cuando existe contrato ejecutable, validador determinista, pruebas, observabilidad honesta y una superficie de revisión. `IMPLEMENTED` significa implementado en código o contrato, no necesariamente desplegado, conectado ni aprobado para producción. Los estados `EXTERNAL_REQUIRED` y `REQUIRES_HUMAN` permanecen visibles aunque el contrato esté completo.

## Trabajo autónomo permitido por agente

| Agente | Trabajo que puede hacerse sin intervención humana | Bloqueo que debe permanecer |
|---|---|---|
| Audience Intelligence | Eventos tipados, cohortes, ventanas temporales, validación de retención, dashboard `NO_DATA` y pruebas de privacidad | Datos reales de usuarios, identidad, consentimiento y conclusiones de audiencia |
| Marketing Intelligence | Truth gate, Brand Intelligence, lifecycle de contenido, campaign brief, Launch Pack y KPI separados | Claims regulatorios, presupuesto, proveedores, publicidad y publicación |
| Social | Matriz de canales, metadatos, readiness, exportación local y bloqueos por proveedor | OAuth, publicación, moderación y métricas sociales reales |
| Content | Content Records, moderación determinista, fallback seguro, QA de claims y versionado conceptual | Generación multimodal productiva, licencias y aprobación editorial |
| Lukita | Character Foundation, anchors, estados de comportamiento, fallback visual y contrato de asset | GLB final, derechos, voz, TTS, reconocimiento y aprobación visual |
| Sales | Pipeline local, estados de lead, score explicable y exportación auditable | Leads reales, CRM externo, contacto comercial y contratos |
| Revenue | Fórmulas tipadas, fuentes obligatorias, escenarios y bloqueo de dinero real | Cobros, MRR real, LTV real, retiros y decisiones financieras |
| Financial Intelligence | Escenarios reproducibles, trazabilidad, sensibilidad y `NO_DATA` | Asesoría profesional, impuestos reales, inversión y decisiones ejecutivas |
| Experience Director | Propuestas, checklist UX, scores explicables, accesibilidad y aprobación manual | Rediseño automático, claims de conversión y despliegue |
| Auditor | Cobertura de invariantes, evidence paths, reportes y lectura append-only | Certificación independiente y autoridad de cambio |
| Watchdog | Reglas de alerta, deduplicación, severidad, cooldown y escalamiento | Kill switch productivo, operación persistente y cambios irreversibles |
| Recovery | Matriz de fallos, retries acotados, fallback determinista y simulador | Recuperación multiinstancia real y decisiones de continuidad |
| Supervisor | Máquina de escalamiento, conflictos, quorum documental y límites | Coordinación autónoma productiva y autoridad sobre agentes |
| Business Strategy | Hipótesis, escenarios, recomendaciones y separación hecho/proyección | Presupuesto, precios, contratos, adquisiciones y compromisos |
| Distribution | Contrato de gates, readiness por canal, matriz de proveedores y QA local | Proveedores, CDN, DRM, playout, publicación y certificación de dispositivos |
| Legal & Compliance | Contrato constitucional, estados auditables, checklist de revisión y rutas de evidencia | Asesoría legal, filing, contratos, licensing, interpretación jurídica y autonomía; permanece `PLANNED / DISABLED / ADVISORY_ONLY / 0` |

## Prioridad ejecutable

La primera ola autónoma debe completar Legal & Compliance y Distribution como contratos verificables, después normalizar Audience, Social, Content, Sales y Revenue con Data Trust. La segunda ola debe añadir persistencia de eventos y auditoría. La tercera ola puede conectar proveedores solo después de secretos, permisos, retención y aprobación humana.

## Quality gates comunes

Cada agente debe demostrar `CONTRACT`, `VALIDATION`, `TESTS`, `EVIDENCE`, `OBSERVABILITY`, `FAILURE_BEHAVIOR` y `AUTHORITY_BOUNDARY`. La falta de datos conserva `NO_DATA`; una dependencia externa conserva `EXTERNAL_REQUIRED`; un asunto jurídico conserva `REQUIRES_HUMAN`. El promedio de madurez nunca puede ocultar un `P0`, un fallo de aislamiento o una violación de autoridad.

## Límites permanentes

Todos los agentes pueden leer únicamente entradas autorizadas, analizar, proponer, alertar o escalar. Ninguno puede modificar `MJP CORE`, RNG, resultados, RTP, wallet, ledger, settlement, reglas ni `MjpTvManifest`. Legal no se convierte en un agente operativo por tener un contrato; Distribution no se convierte en un canal de publicación por tener readiness; Marketing no convierte una proyección en una promesa.

## Evidencia de esta iteración

Los contratos nuevos o ampliados son `shared/marketingIntelligence.ts` y `shared/distributionReadiness.ts`. Sus pruebas son `shared/marketingIntelligence.test.ts` y `shared/distributionReadiness.test.ts`. El panel integrado vive en `client/src/components/MarketingIntelligencePanel.tsx` dentro del Control Room. Los datos productivos, proveedores y métricas reales continúan sin conectarse deliberadamente.


## Catálogo ejecutable

`shared/agentAutonomyBacklog.ts` convierte esta tabla en un catálogo auditable de 16 agentes. Cada entrada separa `safeDeliverables` de `humanGates` y conserva el estado actual. La función `allAgentsHaveAuthorityBoundary` no concede permisos: expresa que el límite de autoridad debe existir para cada entrada. El catálogo no promueve agentes a `IMPLEMENTED`; esa decisión requiere evidencia suficiente y, cuando corresponda, revisión humana.


## Seguimiento en Control Room

La vista `AgentAutonomyPlanPanel` permite buscar y filtrar los 16 agentes por estado, mostrando por cada uno los entregables autónomos y los gates humanos. `shared/agentSafeCapability.ts` ofrece una lectura determinista de contrato, ruta de evidencia, failure behavior y límites de autoridad. Las capacidades persistentes, externas y de producción continúan marcadas como no disponibles hasta que exista evidencia real.


## Evidencia de la iteración 2026-08-28

Se añadieron `shared/agentSafeCapability.ts`, `shared/agentSafeCapability.test.ts` y `client/src/components/AgentAutonomyPlanPanel.tsx`. La validación integral registró TypeScript PASS, 111 archivos de prueba aprobados y 1 omitido, 391 tests aprobados y 4 omitidos, build PASS y simulación Live PASS con 15 eventos, 3 recuperaciones, 0 errores críticos y 100 % de uptime simulado. Estas cifras describen el entorno de validación; no son métricas de audiencia, disponibilidad productiva ni certificación externa.


## Superficies añadidas en esta iteración

Control Room ahora muestra una franja destacada de **Validación humana requerida** con el conteo y los agentes bloqueados por gates humanos. Distribution OS incorpora un preview local de publicación con gates parcialmente cumplidos, readiness `PARTIAL`/`EXTERNAL_REQUIRED` y una insignia de `PUBLICACIÓN BLOQUEADA`. Controller Lab, en su pestaña de cumplimiento, permite descargar un reporte SVG visual con estado, entregables seguros y gates humanos de los 16 agentes. Ninguna de estas superficies publica, conecta proveedores ni modifica MJP CORE.


## Segunda iteración de las superficies de revisión

Los gates humanos ahora muestran el siguiente paso directamente junto al agente y ofrecen contexto mediante tooltip accesible. El preview de Distribution desglosa cada gate requerido como `OK · simulado` o `PENDIENTE`, pero conserva `PUBLICACIÓN BLOQUEADA`. El reporte visual de Compliance OS incorpora totales por estado, porcentaje de agentes con gates humanos, capacidades seguras, fecha de generación y una advertencia explícita de que no certifica producción ni concede autoridad.
