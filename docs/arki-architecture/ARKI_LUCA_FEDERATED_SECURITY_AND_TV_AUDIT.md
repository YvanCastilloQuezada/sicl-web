# ARKI–LUCA: seguridad federada, control y TV

## Resultado

Se implementó un contrato federado para que ARKI y LUCA compartan prácticas defensivas, evidencia y candidatos de mejora sin fusionar sus núcleos canónicos. ARKI conserva el control arquitectónico y SICL Core; LUCA conserva su dominio geoespacial, publicitario, de campo y de interoperabilidad de MiLukita.

## Seguridad transferida

Ambos productos reconocen tres capas defensivas: `EDGE`, `BRAIN_APPLICATION` y `CORE_TRUST_MANiac`. La transferencia es de contrato, invariantes, pruebas y trazabilidad; nunca transfiere secretos, tokens, permisos de administración ni acceso directo de un producto al Core del otro.

La capa Edge debe aplicar origen, CSP, límites de tamaño, rate limiting y degradación segura. La capa Brain/Application debe validar esquemas, aislar candidatos, exigir revisión y registrar auditoría. La capa Core/Trust debe permanecer fail-closed, rechazar conflictos de versión, impedir escrituras directas desde Edge y conservar la autoridad humana final.

En LUCA se añadió `LUCA_SECURITY_LAYERS` y `authorizeLucaAction`. La publicación queda bloqueada sin autenticación y aprobación humana. El MJP CORE permanece aislado. En ARKI se añadió el contrato `arkiLucaSecurityFederation.ts` para gobernar artefactos de aprendizaje entre productos.

## Retroalimentación

La retroalimentación es bidireccional pero no automática. Cada propuesta requiere `sourceCommit`, evidencia, unknowns, alcance y revisión humana. El estado inicial es `CANDIDATE`; la promoción a conocimiento reutilizable o canónico no ocurre por similitud, popularidad, puntuación o decisión de otro agente.

Ejemplos permitidos:

- ARKI → LUCA: seguridad, gobernanza, trazabilidad, razonamiento espacial y contratos de revisión.
- LUCA → ARKI: georreferenciación, campañas AR, captura de campo, dispositivos y contexto territorial.
- Compartido bajo revisión: estadística, contabilidad, teoría de juegos, costos, visión y agentes auxiliares.

## Control Panel de LUKA

Se añadió una vista independiente dentro de ARKI con identidad, misión, asistentes, estado de integración, seguridad federada, retroalimentación y TV. El panel es una interfaz de gobierno y preparación; no crea una conexión física ni modifica automáticamente ningún Core.

## LUKA-TV y ARKI-TV

LUKA-TV queda preparado como experiencia de avatar presentadora. La interfaz muestra identidad, guion y estado `AVATAR_UI_READY`; la voz, render de video y publicación real requieren un host audiovisual autorizado y un gate humano.

ARKI-TV queda definido como canal multi-asistente: ARKI explica arquitectura/BIM, LUCA territorio y mercado, VISION contexto visual y COSTOS presupuestos. Cada segmento debe conservar fuente, asistente responsable, estado epistemológico y revisión antes de publicarse.

## Hallazgos de auditoría

| Área | Estado | Límite pendiente |
|---|---|---|
| ARKI MANIAC | IMPLEMENTED | Verificación continua en despliegue productivo |
| LUCA capas federadas | IMPLEMENTED | Conectar a su middleware de producción y observar métricas |
| Retroalimentación | CONTRACT_PREPARED | Persistencia y revisión humana operativa |
| Panel LUKA en ARKI | IMPLEMENTED | Integrar consultas persistentes del repositorio LUCA |
| Avatar LUKA-TV | AVATAR_UI_READY | Host TTS/video y publicación autorizada |
| ARKI-TV multi-asistente | CONCEPT_PREPARED | Scheduler, render, fuentes y host audiovisual |
| Sincronización Core a Core | BLOCKED_BY_DESIGN | No debe habilitarse sin contrato, identidad y gate explícitos |

## Conclusión

La arquitectura recomendada es una federación de productos, no una fusión. ARKI puede gobernar y visualizar a LUCA; LUCA puede aportar conocimiento territorial y publicitario; ambos pueden retroalimentarse mediante candidatos auditables. Ningún avatar, asistente o canal de TV debe convertirse en autoridad implícita sobre el estado canónico, publicación, permisos o seguridad.
