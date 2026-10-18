# MiLukita — Reporte completo del estado de agentes

**Fecha de corte:** 27 de agosto de 2026  
**Fuente primaria:** `docs/MJP_MASTER_AGENT_MAP.md` y código del proyecto  
**Estado del piloto:** créditos exclusivamente virtuales; dinero real, pagos y retiros desactivados  
**Regla de autoridad:** los agentes ayudan al sistema, pero nunca son el sistema.

## 1. Resumen ejecutivo

El mapa maestro contiene **9 agentes o componentes gobernados**. No todos son agentes autónomos ejecutándose como procesos independientes. El documento distingue entre capacidades formales de agentes, módulos de soporte y funciones futuras. Esta distinción es importante: que exista un panel, un router o un health check no significa que exista un agente autónomo con identidad, ciclo de vida, permisos y trazabilidad propios.

Con una escala de avance documental y técnico definida para este reporte, el conjunto alcanza un **avance orientativo de 42 %**. Este porcentaje no es cobertura de código, disponibilidad 24/7 ni certificación; es una lectura de madurez de cada agente frente a cuatro dimensiones: definición y gobernanza, implementación runtime, pruebas y evidencia operativa. Los componentes de presentación, contenido, monitoreo y allowlist están más avanzados que el Auditor Agent autónomo, Watchdog y Supervisor independiente, que todavía son conceptuales.

| Indicador | Resultado | Interpretación |
|---|---:|---|
| Agentes/componentes gobernados | **9** | Inventario real del mapa maestro |
| Con implementación runtime limitada | **4** | Autopilot, Lukita, Content/Script y Monitoring |
| Preparados pero limitados | **2** | Scheduler y Safety |
| Conceptuales/no implementados como runtime independiente | **3** | Auditor Agent, Watchdog y Supervisor |
| Agentes con autoridad final sobre resultados | **0** | La autoridad permanece en MJP CORE |
| Agentes autorizados a alterar RNG/RTP/wallet/settlement | **0** | Invariante de seguridad |
| Operación monetaria | **OFF** | No hay dinero real ni retiros |

## 2. Método de cálculo del porcentaje

El porcentaje de avance se expresa como una estimación de madurez, no como una afirmación de certificación. Se asignaron pesos iguales a cuatro dimensiones: existencia de una definición clara, existencia de una implementación o soporte en runtime, pruebas automatizadas y evidencia operativa/documental suficiente. Una capacidad conceptual sin runtime recibe una puntuación baja; una capacidad implementada pero limitada recibe una puntuación intermedia-alta; una capacidad preparada sin ejecución autónoma recibe una puntuación intermedia.

| Estado del mapa | Valor orientativo usado |
|---|---:|
| Implementado / limitado | 70–80 % |
| Preparado / limitado | 40–50 % |
| Conceptual / no implementado | 10 % |
| Bloqueado por decisión o credenciales | 0 % para operación activa |

El valor mostrado por agente debe interpretarse como **avance del alcance definido**, no como probabilidad de éxito. Las certificaciones físicas, regulatorias, independientes y multiinstancia no se consideran completadas por pruebas locales.

## 3. Inventario general

| Nº | Nombre | Estado oficial del mapa | Avance orientativo | Tipo | Función principal |
|---:|---|---|---:|---|---|
| 1 | Auditor Agent | CONCEPTUAL / NOT IMPLEMENTED | 10 % | Futuro agente de verificación | Leer, recalcular, comparar, reportar y escalar discrepancias sin corregir resultados |
| 2 | Scheduler | PREPARED / LIMITED | 45 % | Orquestación operativa | Proponer ventanas y tareas allowlisted, sin decidir sorteos |
| 3 | Autopilot | IMPLEMENTED / LIMITED | 70 % | Automatización acotada | Ejecutar acciones permitidas dentro de allowlist, estado válido y kill switch |
| 4 | Watchdog | CONCEPTUAL / NOT IMPLEMENTED | 10 % | Supervisión futura | Detectar falta de heartbeat, retrasos, fallas y degradación |
| 5 | Supervisor | CONCEPTUAL / NOT IMPLEMENTED | 10 % | Gobernanza operativa | Coordinar escalamiento y decisiones con autorización humana |
| 6 | Lukita — Host Visual Agent | IMPLEMENTED / LIMITED | 80 % | Presentación no autoritativa | Presentar información autorizada desde `MjpTvManifest` |
| 7 | Content/Script | IMPLEMENTED / LIMITED | 70 % | Contenido y guiones | Producir borradores y variaciones sujetas a revisión humana |
| 8 | Monitoring | IMPLEMENTED / LIMITED | 65 % | Observabilidad | Mostrar métricas, health checks, logs y alertas sin cambiar juegos |
| 9 | Safety | PREPARED / LIMITED | 50 % | Protección operativa | Aplicar límites, pausas, señales de riesgo y escalamiento |

**Promedio simple orientativo:** 42,2 %, redondeado a **42 %**. El promedio no significa que el sistema esté “42 % listo para producción”; únicamente resume madurez de las fichas y componentes descritos.

## 4. Fichas técnicas por agente

### 4.1 Auditor Agent

**Propósito.** Sería el responsable de verificar rondas, draws, reglas, manifests y eventos, recalcular resultados esperados, comparar evidencia y emitir un informe de auditoría.

**Estado.** **Conceptual / no implementado como agente autónomo.** Existen auditoría, verificación pública, eventos y pruebas, pero no hay un proceso independiente con identidad, ciclo de vida, permisos y cola de trabajo propios.

**Puede leer.** Rondas, draws, reglas, manifest y eventos cuando la autorización lo permita. **Puede escribir.** Reportes y registros de auditoría. **Puede proponer.** Correcciones para revisión humana. **Puede ejecutar.** Nada por sí mismo.

**No puede modificar.** Resultados, RNG, premios, wallet, settlement, reglas activas ni manifest autoritativo. Su siguiente hito debe ser una implementación aislada de lectura y comparación con pruebas negativas explícitas.

### 4.2 Scheduler

**Propósito.** Proponer calendarios, ventanas de emisión, rondas siguientes y tareas repetibles.

**Estado.** **Preparado / limitado.** Existen `server/schedulerEngine.ts`, Heartbeat y procedimientos operativos. Esto no equivale a una operación programada autónoma plenamente certificada.

**Puede leer.** Calendario, registro de tareas y estados operativos. **Puede escribir.** Propuestas u órdenes autorizadas. **Puede proponer.** Próximas rondas y ventanas. **Puede ejecutar.** Solo tareas allowlisted y aprobadas.

**Riesgo principal.** Confundir una propuesta de programación con la apertura efectiva de una ronda. La autoridad final corresponde al Round Engine y a los procedimientos autorizados.

### 4.3 Autopilot

**Propósito.** Orquestar acciones repetitivas seguras bajo allowlist, estado válido y control de detención.

**Estado.** **Implementado / limitado.** `shared/autonomyEngine.ts` proporciona modos operativos, acciones seguras y kill switch parcial.

**Puede leer.** Estado operativo permitido. **Puede escribir.** Solo acciones allowlisted. **Puede proponer.** Acciones de automatización. **Puede ejecutar.** Solo con estado válido, autorización y control activo.

**No puede modificar.** RNG, RTP, rulesets, premios, wallet, resultados o settlement. Su avance real está limitado por la falta de autonomía 24/7 en infraestructura persistente y locking distribuido completo.

### 4.4 Watchdog

**Propósito.** Detectar procesos caídos, pérdida de heartbeat, manifests obsoletos, errores repetidos y degradación de señal.

**Estado.** **Conceptual / no implementado como servicio persistente independiente.** El proyecto posee health checks, métricas y alertas, pero no un Watchdog autónomo con ciclo de vida y recuperación propios.

**Puede leer.** Health, eventos y métricas. **Puede proponer.** Diagnósticos o solicitudes de recuperación. **Puede ejecutar.** Nada actualmente.

**Prioridad.** Alta antes de declarar autonomía real de 24 horas. Debe alertar y solicitar recuperación; no debe convertirse en superusuario ni modificar resultados.

### 4.5 Supervisor

**Propósito.** Coordinar estados operativos, escalamiento y decisiones que requieren control humano.

**Estado.** **Conceptual / no implementado como agente independiente.** El operador, Control Room y MJP CORE cubren partes del flujo, pero no existe un Supervisor runtime separado.

**Puede leer.** Estados operativos permitidos. **Puede escribir.** Informes y acciones administrativas limitadas. **Puede proponer.** Decisiones operativas. **Puede ejecutar.** Únicamente con autorización humana o procedimental.

**Prioridad.** Media-alta. Debe diseñarse después de cerrar los contratos de eventos, trazabilidad y kill switch, no como una IA con autoridad irreversible.

### 4.6 Lukita — Host Visual Agent

**Propósito.** Ser la anfitriona y companion visual de MiLukita: explicar, acompañar, reaccionar y presentar estados autorizados.

**Estado.** **Implementado / limitado.** Consume `MjpTvManifest`, scripts aprobados y superficies visuales. El visor 3D continúa aislado en Preview/Review.

**Puede leer.** Manifest y estado público autorizado. **Puede escribir.** Estado local de presentación. **Puede proponer.** Mensajes, poses y animaciones permitidas. **Puede ejecutar.** Presentación audiovisual autorizada.

**No puede modificar.** Números, ganadores, premios, rondas, wallet, RNG, RTP, rulesets ni manifest. Su avance visual no habilita voz, TTS, lip-sync, animación final o integración productiva.

### 4.7 Content/Script

**Propósito.** Preparar textos, guiones, variantes y mensajes para Lukita y la experiencia audiovisual.

**Estado.** **Implementado / limitado.** `shared/lukitaScripts.ts` y el panel de guiones gestionan borradores, categorías y revisión.

**Puede leer.** Contexto público y biblioteca aprobada. **Puede escribir.** Borradores. **Puede proponer.** Variantes de guion. **Puede ejecutar.** No publica por sí mismo.

**Control crítico.** Todo claim sobre premios, RTP, probabilidades, regulación o dinero debe quedar sujeto a revisión humana y a la fuente autoritativa correspondiente.

### 4.8 Monitoring

**Propósito.** Observar métricas de señal, health checks, logs, reconexiones y estado operativo.

**Estado.** **Implementado / limitado.** Existen paneles operativos, métricas y registros visuales. Las alertas no deben cambiar el estado del juego por sí mismas.

**Puede leer.** Métricas, logs y health. **Puede escribir.** Alertas y diagnósticos. **Puede proponer.** Acciones de observabilidad. **Puede ejecutar.** No modifica datos de juego.

**Brecha.** Falta una observabilidad de producción con retención, correlación distribuida, SLO, alertamiento externo y evidencia independiente de disponibilidad.

### 4.9 Safety

**Propósito.** Aplicar límites de uso, pausas, juego responsable, señales de riesgo, bloqueos y escalamiento.

**Estado.** **Preparado / limitado.** Hay controles de uso, arquitectura KYC/AML neutral y controles de acceso, pero no hay proveedor KYC/AML activo ni operación monetaria.

**Puede leer.** Señales, límites y políticas. **Puede escribir.** Bloqueos permitidos. **Puede proponer.** Restricciones y escalamiento. **Puede ejecutar.** Pausas o bloqueos dentro de política.

**No puede modificar.** Resultado del sorteo ni RNG. Antes de dinero real requiere definición legal, proveedor, protección de datos, procedimientos de apelación, auditoría y homologación.

## 5. Matriz comparativa de permisos

| Agente | READ | WRITE | PROPOSE | EXECUTE | Autoridad final |
|---|---|---|---|---|---|
| Auditor Agent | Evidencia autorizada | Reportes | Correcciones para revisión | No | MJP CORE |
| Scheduler | Calendario/estados | Órdenes autorizadas | Ventanas y rondas | Allowlist aprobada | Round Engine |
| Autopilot | Estado permitido | Allowlist | Automatización | Allowlist + control | MJP CORE |
| Watchdog | Health/métricas | Alertas futuras | Recuperación | No actual | Operación/MJP CORE |
| Supervisor | Estados operativos | Informes limitados | Decisiones operativas | Autorización humana | MJP CORE |
| Lukita | Manifest público | Presentación local | Mensajes/animaciones | Presentación | MjpTvManifest |
| Content/Script | Contexto público | Borradores | Variantes | No publicación | Revisión humana |
| Monitoring | Métricas/logs | Alertas | Observabilidad | No cambio de juego | Operación |
| Safety | Señales/políticas | Bloqueos | Restricciones | Pausas permitidas | Política/MJP CORE |

## 6. Dependencias y riesgos

| Riesgo | Agentes afectados | Impacto | Mitigación recomendada | Prioridad |
|---|---|---|---|---|
| Falta de locking distribuido | Scheduler, Autopilot, Monitoring | Estados divergentes en Autoscale | Lock transaccional u optimistic concurrency con versión | P1 |
| Auditor Agent inexistente | Auditoría | No hay auditor autónomo de ciclo completo | Implementar primero lectura, comparación y reporte sin mutación | P1 |
| Watchdog inexistente | Autonomía | No se demuestra recuperación persistente | Crear watchdog limitado a alertar y solicitar recuperación | P1 |
| Supervisor conceptual | Operación | Escalamiento manual no formalizado | Definir runbooks, roles, aprobaciones y kill switch | P1 |
| Evidencia solo local | Todos | No equivale a certificación | Ejecutar staging real, observabilidad y QA físico | P1 |
| Claims generados por contenido | Content/Lukita | Riesgo de información incorrecta | Revisión humana y fuentes versionadas | P1 |
| KYC/AML no operativo | Safety | No listo para dinero real | Revisión legal, proveedor, privacidad y homologación | P0 antes de monetización |
| Dependencia visual de Lukita | Lukita/MJP CORE | Riesgo de bloqueo si falla el avatar | Mantener manifest y contingencia independientes | P1 |

## 7. Qué está realmente implementado

Está implementado el control de autoridad server-side, el manifest público, la presentación de Lukita, guiones con revisión, monitoring básico, Autopilot con allowlist parcial, seguridad de acceso, límites y pruebas distribuidas en distintos módulos. También existen pruebas de autonomía simulada, WebSocket y paneles de control.

No está implementado como runtime autónomo independiente el Auditor Agent, Watchdog ni Supervisor. Scheduler y Safety tienen piezas funcionales, pero no deben describirse como agentes autónomos certificados. Tampoco existe evidencia de que un agente pueda producir resultados oficiales; eso es correcto y debe mantenerse así.

## 8. Próximo orden de trabajo recomendado

Primero debe cerrarse el contrato de eventos y trazabilidad de agentes, con identificador, autorización, correlación, estado y evidencia. Después conviene implementar el Auditor Agent en modo solo lectura y el Watchdog en modo alerta, ambos con pruebas negativas. En paralelo debe resolverse el locking distribuido de sesiones y tareas.

Luego se recomienda formalizar el Supervisor como un conjunto de runbooks y aprobaciones humanas antes de convertirlo en software. Finalmente deben ejecutarse staging multiinstancia, pruebas de carga, QA físico, revisión independiente del RNG y revisión legal. Ningún avance de agentes debe utilizarse para activar dinero real, retiros o convertibilidad durante el piloto.

## 9. Criterio de cierre del expediente

El proyecto no debe considerar “agentes completos” por cantidad de nombres. El criterio correcto es que cada agente tenga propósito, inputs, outputs, permisos READ/WRITE/PROPOSE/EXECUTE, eventos, prohibiciones, autoridad final, fallback, kill switch, auditoría, pruebas positivas y pruebas negativas. Mientras falte uno de esos elementos, su estado debe permanecer limitado, preparado, conceptual o bloqueado.

> **Conclusión:** MiLukita tiene una gobernanza de agentes bien definida y varios módulos de soporte implementados, pero solamente una parte del mapa existe como runtime limitado. La seguridad principal es que ningún agente tiene autoridad final sobre RNG, RTP, resultados, wallet o settlement. La prioridad es convertir las piezas conceptuales —Auditor, Watchdog y Supervisor— en controles verificables y no en automatismos irreversibles.
