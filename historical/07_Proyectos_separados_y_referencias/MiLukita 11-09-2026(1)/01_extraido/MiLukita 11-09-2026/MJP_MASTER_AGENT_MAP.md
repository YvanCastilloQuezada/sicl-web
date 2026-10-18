# Mapa Maestro de Agentes MJP

> **Alineación constitucional vigente:** Este documento queda subordinado a `docs/MILUKITA_MASTER_CONSTITUTION.md` y al contrato `shared/milukitaMasterOrder.ts`. La Orden Maestra de Reorientación y Consolidación (27-08-2026) redefine el orden superior como MiLukita Network → Experience/Content/Business OS → Agent OS → Governance OS → KPI/Observability → Control Room → Authority Boundary → MJP CORE. Las clasificaciones antiguas de este mapa no pueden utilizarse para declarar capacidades externas ni autoridad no demostrada.
>
> **Proyecto:** Multi Juegos Perú / MiLukita  
**Documento:** Orden 42 — Mapa Maestro de Agentes MJP  
**Estado:** Arquitectura y gobernanza; no autoriza por sí sola la activación de agentes  
**Dinero real:** OFF  
**Pagos y retiros:** OFF  
**Fuente de verdad:** MJP CORE  
**Última revisión:** 26 de agosto de 2026  
**Autor:** Manus AI

> Los agentes pueden ayudar al sistema; nunca pueden convertirse en el sistema.

## 1. Propósito y alcance

Este documento establece la separación entre observación, análisis, propuesta, ejecución autorizada y autoridad oficial. Es la referencia maestra para agentes actuales y futuros de MJP, pero no crea permisos que no existan en el código. Una capacidad descrita como preparada, conceptual o limitada no debe presentarse como implementada.

La Orden 42 es documental y de gobernanza. No modifica matemáticas, RNG, RTP, reglas, rondas, premios, wallet, créditos, settlement, MjpTvManifest, juegos, pagos, retiros, PWA ni el estado visual de Lukita. La revisión del visor `/lukita-3d` queda pausada y separada de este documento.

## 2. Principio de autoridad

La cadena de autoridad obligatoria es:

```text
AGENTES
   ↓
OBSERVAN / ANALIZAN / PROPONEN
   ↓
AUTORIDAD CONTROLADA
   ↓
MJP CORE
   ↓
RESULTADO OFICIAL
```

La fuente de verdad operativa permanece en:

```text
Round Engine
      ↓
Draw Engine
      ↓
Rule Engine
      ↓
Credit / Settlement Engine
      ↓
Audit / Verify
      ↓
MjpTvManifest
      ↓
Consumidores y agentes
```

En caso de discrepancia, **MJP CORE prevalece siempre**. Un agente no puede corregir una discrepancia cambiando el resultado, la semilla, el ruleset, el premio, la billetera o el manifest autoritativo. Debe registrar la anomalía, alertar y escalarla a la autoridad correspondiente.

## 3. Definición de capacidades

| Capacidad | Definición operativa | Regla de seguridad |
|---|---|---|
| READ | Consultar información dentro del alcance permitido. | Leer no concede autoridad. |
| PROPOSE | Emitir una recomendación o borrador que requiere otra autoridad. | Proponer no ejecuta. |
| WRITE | Modificar información dentro de un ámbito explícitamente permitido. | Toda escritura relevante debe ser auditable. |
| EXECUTE | Ejecutar una acción previamente autorizada y limitada por estado/allowlist. | No permite decidir resultados. |

> **PROPOSE ≠ EXECUTE** y **READ ≠ AUTHORITY**.

## 4. Inventario real de agentes y componentes

La siguiente clasificación distingue agentes formales de módulos de soporte. Cuando no existe un proceso independiente con identidad, permisos y ciclo de vida propios, se marca como limitado, preparado, conceptual o no implementado.

| Agente o componente | Estado real | Evidencia/referencia interna | Alcance actual |
|---|---|---|---|
| Auditor Agent | **CONCEPTUAL / NOT IMPLEMENTED** | Existen `audit_events`, verificación pública y pruebas, pero no un agente autónomo separado. | Las herramientas actuales verifican y registran; no gobiernan ni corrigen resultados. |
| Scheduler | **PREPARED / LIMITED** | `server/schedulerEngine.ts`, Heartbeat y procedimientos operativos. | Puede modelar/proponer programación; la operación programada permanece restringida y no decide resultados. |
| Autopilot | **IMPLEMENTED / LIMITED** | `shared/autonomyEngine.ts` con acciones seguras y modo detenido. | Guardrail de allowlist; no existe autorización para RNG, rulesets, premios, wallet o settlement. |
| Watchdog | **CONCEPTUAL / NOT IMPLEMENTED** | Existen health checks y métricas de señal; no hay servicio persistente de watchdog autónomo. | Puede inspirar alertas futuras; no ejecuta recuperación automática. |
| Supervisor | **CONCEPTUAL / NOT IMPLEMENTED** | No existe un agente supervisor independiente en el runtime. | La decisión operativa sigue en el operador y en MJP CORE. |
| Lukita — Host Visual Agent | **IMPLEMENTED / LIMITED** | `MjpTvManifest`, scripts aprobados y visor `/lukita-3d` aislado. | Presenta información autorizada; no es fuente oficial y no decide juegos. |
| Content/Script | **IMPLEMENTED / LIMITED** | `shared/lukitaScripts.ts` y panel de guiones. | Produce borradores y mensajes sujetos a revisión humana; no modifica resultados o reglas. |
| Monitoring | **IMPLEMENTED / LIMITED** | Métricas de señal, logs, paneles operativos y health checks. | Observa telemetría y propone alertas; no altera datos de juego. |
| Safety | **PREPARED / LIMITED** | Límites de uso, juego responsable, KYC/AML neutral y controles de acceso. | Puede bloquear flujos permitidos; no decide el resultado del sorteo. |

## 5. Matriz maestra de permisos

Esta matriz describe el alcance aprobado por arquitectura, no concede por sí sola permisos de ejecución.

| Agente | Puede leer | Puede escribir | Puede proponer | Puede ejecutar | No puede modificar | Eventos o trazas | Autoridad final |
|---|---|---|---|---|---|---|---|
| Auditor Agent | Rondas, draws, reglas, manifest y eventos cuando se le autorice | Auditoría y reportes | Correcciones para revisión humana | No | Resultados, RNG, premios, wallet, settlement | `AUDIT_*` futuros; auditoría existente | MJP CORE |
| Scheduler | Calendario, registry y estados operativos | Propuestas/órdenes autorizadas | Próximas rondas y ventanas | Solo tareas allowlisted y aprobadas | Resultados, RNG, reglas activas y settlement | `SCHEDULE_*` | Round Engine |
| Autopilot | Estado operativo permitido | Solo acciones allowlisted | Acciones de automatización | Solo dentro de allowlist, estado válido y control activo | RNG, reglas, premios, wallet y resultados | `AUTOPILOT_*` | MJP CORE |
| Watchdog | Health, eventos y métricas | Alertas o solicitudes de recuperación, si se implementa | Diagnósticos | No actualmente | Resultados, reglas y settlement | `WATCHDOG_*` futuros | Operación/MJP CORE |
| Supervisor | Estados operativos permitidos | Informes y acciones administrativas limitadas | Decisiones operativas | Solo con autorización humana/procedimental | Verdad del juego y resultados | `SUPERVISOR_*` futuros | MJP CORE |
| Lukita | `MjpTvManifest` y estado público autorizado | Estado local de presentación | Mensajes, poses y animaciones permitidos | Presentación audiovisual autorizada | Números, ganadores, premios, rondas, wallet, RNG, RTP, rulesets y manifest | `PRESENTATION_*` | MjpTvManifest |
| Content/Script | Contexto público y biblioteca aprobada | Borradores de texto | Variantes de guion | No publica por sí solo | Resultados, reglas y claims oficiales | `CONTENT_*` | Revisión humana |
| Monitoring | Métricas, logs y health | Alertas y diagnósticos | Acciones de observabilidad | No | Datos de juego, wallet y resultados | `MONITOR_*` | Operación |
| Safety | Señales, límites y políticas | Bloqueos permitidos | Restricciones y escalamiento | Pausas o bloqueos dentro de política | Resultado del sorteo y RNG | `SAFETY_*` | Política/MJP CORE |

## 6. Lukita — Host Visual Agent

Lukita se clasifica como **presentación no autoritativa**. Puede saludar, explicar, reaccionar, celebrar, acompañar transiciones, reproducir animaciones autorizadas, utilizar textos aprobados y mostrar información recibida desde `MjpTvManifest`.

Lukita no puede generar números, seleccionar ganadores, calcular premios, modificar rondas, abrir o cerrar participación, modificar wallet, aprobar resultados, sustituir Auditor/Verify ni ocultar una discrepancia. Si el manifest no es válido o existe contradicción, debe detenerse o utilizar un mensaje de contingencia aprobado.

La aprobación técnica del blockout y el visor `/lukita-3d` no otorgan autoridad sobre MJP CORE. La producción visual continúa separada del canal público y no habilita voz, TTS, lip-sync, animación final ni integración.

## 7. Auditor Agent: verificación, no gobierno

El Auditor Agent futuro debe seguir el flujo:

```text
leer
  ↓
recalcular / verificar
  ↓
comparar
  ↓
emitir resultado de auditoría
```

Ante una discrepancia, el flujo correcto es:

```text
detectar error
  ↓
registrar
  ↓
alertar
  ↓
escalar
```

El auditor no debe pasar de “detectar error” a “modificar resultado”. La corrección corresponde al módulo responsable y a la autoridad definida, con trazabilidad y revisión independiente.

## 8. Scheduler y Autopilot

El Scheduler puede proponer: “La siguiente ronda está programada para una fecha y hora determinadas”. La propuesta no abre una ronda ni autoriza un resultado. El Autopilot solo puede ejecutar acciones incluidas en una allowlist explícita, con validación del estado y controles de detención.

Nunca debe existir una instrucción equivalente a “decidiré qué resultado producir”. La automatización puede orquestar acciones repetibles ya autorizadas, pero no puede seleccionar resultados, cambiar premios, alterar RNG o saltarse el Event Store.

## 9. Watchdog y Supervisor

El Watchdog futuro podrá detectar procesos caídos, falta de heartbeat, retrasos, manifests desactualizados, inconsistencias, errores repetidos y pérdida de conectividad. No debe convertirse en un superusuario. Su salida esperada es una alerta o solicitud de recuperación.

El Supervisor u operador debe decidir la acción cuando la política lo requiera. La secuencia segura es:

```text
NORMAL
  ↓
ANOMALÍA
  ↓
ALERTA
  ↓
PAUSA CONTROLADA
  ↓
REVISIÓN
  ↓
DECISIÓN HUMANA
  ↓
RECUPERACIÓN
```

Debe evitarse la secuencia “anomalía → IA decide → cambio irreversible”.

## 10. Event Store y trazabilidad

Todo agente que produzca una acción relevante deberá dejar, como mínimo, los siguientes campos:

| Campo | Propósito |
|---|---|
| `agent_id` | Identificar el agente o módulo originador. |
| `event_id` | Identificar el evento individual. |
| `timestamp` | Registrar el instante en UTC. |
| `correlation_id` | Vincular eventos de un mismo flujo. |
| `action` | Describir la acción solicitada o ejecutada. |
| `reason` | Explicar el motivo. |
| `input_reference` | Referenciar los datos de entrada. |
| `output_reference` | Referenciar la salida o evidencia. |
| `authorization` | Indicar la autorización aplicable. |
| `status` | Indicar propuesto, aprobado, ejecutado, rechazado o fallido. |

La auditoría debe poder responder qué agente hizo qué, cuándo, por qué y bajo qué autorización. Los nombres definitivos de eventos deben reutilizar el Event Store existente y no crear duplicados semánticos.

## 11. Eventos versionados

Los siguientes nombres son contrato de gobernanza y deben mapearse a eventos existentes antes de una implementación formal:

| Familia | Eventos propuestos |
|---|---|
| Auditoría | `AUDIT_STARTED`, `AUDIT_PASSED`, `AUDIT_FAILED` |
| Watchdog | `WATCHDOG_ALERT`, `WATCHDOG_RECOVERY_REQUESTED` |
| Programación | `SCHEDULE_PROPOSED`, `SCHEDULE_APPROVED` |
| Autopilot | `AUTOPILOT_ACTION_REQUESTED`, `AUTOPILOT_ACTION_EXECUTED` |
| Presentación | `LUKITA_PRESENTATION_STARTED`, `LUKITA_PRESENTATION_STOPPED` |
| Monitoring | `MONITOR_ALERT_RAISED`, `MONITOR_SIGNAL_DEGRADED` |
| Safety | `SAFETY_PAUSE_REQUESTED`, `SAFETY_BLOCK_APPLIED` |

Mientras un agente o evento no exista en runtime, debe permanecer marcado como preparado, conceptual o pendiente; no debe presentarse como implementado.

## 12. Acciones permanentemente prohibidas

Ningún agente podrá generar resultados oficiales, alterar una semilla después de iniciar una ronda, modificar un resultado, modificar RTP, cambiar rulesets activos, cambiar premios, crear ganadores, alterar wallet, liquidar sin autorización de Settlement, abrir o cerrar rondas fuera de la autoridad correspondiente, eliminar evidencia, modificar retrospectivamente eventos, cambiar `MjpTvManifest` para ocultar una discrepancia, convertir créditos virtuales en dinero, activar pagos, activar retiros, activar KYC/AML real, activar operación monetaria o desactivar controles de seguridad sin autorización.

Estas prohibiciones son invariantes de seguridad y deben reflejarse tanto en la arquitectura como en las pruebas negativas. Una interfaz o función de propuesta no debe confundirse con permiso para ejecutar.

## 13. Kill switches

| Nivel | Puede detener | Autoridad requerida |
|---|---|---|
| Presentación | Lukita, animaciones, TTS futuro, streaming y automatizaciones no esenciales | Operación o procedimiento autorizado |
| Operativo | Procesos autorizados y tareas de soporte | Supervisor/operador, con auditoría |
| Juego | Procesos que puedan afectar rondas o liquidación | Política estricta y procedimiento humano; no depende solo de IA |

Toda acción crítica debe tener confirmación, trazabilidad, procedimiento de reversión y revisión posterior. El proyecto actual tiene controles de detención y allowlist parciales, pero no un kill switch de juego independiente plenamente implementado.

## 14. Estado de implementación

| Categoría | Componentes actuales |
|---|---|
| IMPLEMENTED / LIMITED | Lukita como presentación local/controlada, Content/Script con revisión, Monitoring con métricas y Autopilot como guardrail de allowlist. |
| PREPARED | Scheduler y Safety; existen piezas de soporte, pero no autonomía operativa completa. |
| CONCEPTUAL / NOT IMPLEMENTED | Auditor Agent autónomo, Watchdog persistente y Supervisor independiente. |
| BLOCKED | Integraciones que requieren credenciales externas o decisión regulatoria, incluida automatización oficial de YouTube y operación monetaria. |
| NOT IMPLEMENTED | Cualquier agente que pretenda decidir resultados, liquidar por sí mismo o gobernar MJP CORE. |

## 15. Tests obligatorios y estado de evidencia

Deben existir pruebas positivas para demostrar que un agente puede realizar exactamente las acciones permitidas y pruebas negativas para demostrar que no puede cambiar RNG, RTP, resultado, wallet, ruleset, Event Store o manifest autoritativo.

El golden rule test debe expresar: **ningún agente puede producir un resultado oficial por sí mismo**. Las pruebas actuales cubren contratos de autonomía, manifest, rondas, auditoría y seguridad en distintos módulos, pero las pruebas de autorización multiagente y el Auditor Agent autónomo permanecen pendientes porque esos agentes no existen como runtime independiente.

## 16. Requisitos para cualquier agente futuro

Antes de crear un agente nuevo debe documentarse su nombre, propósito, inputs, outputs, permisos READ/WRITE/PROPOSE/EXECUTE, eventos que produce y consume, acciones prohibidas, autoridad final, fallback, kill switch, auditoría y pruebas negativas. Si esta ficha no existe, el agente no puede pasar a producción.

## 17. Decisión de gobernanza

Este documento funciona como una constitución operativa de MJP: **los agentes ayudan al sistema, pero nunca son el sistema**. La separación protege la integridad de los juegos, la trazabilidad de la auditoría, la presentación de TV, la futura automatización y el carácter no autoritativo de Lukita.

## 18. Referencias internas

| Referencia | Uso |
|---|---|
| `server/schedulerEngine.ts` | Propuestas y estados de programación existentes. |
| `shared/autonomyEngine.ts` | Allowlist, modos de control y kill switch de automatización. |
| `shared/tvManifest.ts` | Contrato de `MjpTvManifest` y autoridad de presentación. |
| `shared/lukitaScripts.ts` | Triggers y registros de guiones de Lukita. |
| `server/routers.ts` y `server/routers/` | Procedimientos tRPC y separación de acceso. |
| `drizzle/schema.ts` | Entidades persistentes de rondas, wallet, auditoría y métricas. |
| `docs/LUKITA_MASTER_CHARACTER_GUIDE.md` | Identidad y límites no autoritativos de Lukita. |
| `docs/LUKITA_3D_PRODUCTION_SPEC.md` | Gates y restricciones de preproducción 3D. |
| `MJP_MASTER_IMPLEMENTATION_AUDIT.md` | Inventario de implementación, bloqueos y evidencia técnica. |

**Regla final:** si un agente no puede demostrar su permiso, su autorización y su trazabilidad, debe tratarse como no autorizado.


## 19. Panel administrativo de consulta

El Control Room dispone de un panel interactivo de consulta para esta matriz. Permite filtrar agentes por estado, seleccionar un agente y revisar sus alcances READ, WRITE, PROPOSE y EXECUTE, la autoridad final, los eventos y las prohibiciones documentadas.

El panel es **solo lectura** respecto de la gobernanza. No cambia perfiles, no concede permisos, no modifica allowlists, no activa agentes y no sustituye la autorización de MJP CORE. Los agentes PREPARED, CONCEPTUAL, BLOCKED o NOT IMPLEMENTED continúan sin poder presentarse como agentes autónomos operativos.
