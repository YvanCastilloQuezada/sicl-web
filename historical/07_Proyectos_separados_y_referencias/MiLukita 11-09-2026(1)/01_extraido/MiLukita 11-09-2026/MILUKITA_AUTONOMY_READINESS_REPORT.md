# MiLukita — Informe de preparación para autonomía

**Fecha de corte:** 26 de agosto de 2026  
**Proyecto:** `ruleta-peru-online`  
**Marca:** MiLukita  
**Estado declarado:** piloto gratuito con créditos exclusivamente virtuales

> Este informe distingue código existente, pruebas, simulación y validación operativa. No declara homologación, certificación, operación 24/7 ni preparación para dinero real.

## 1. Recomendación ejecutiva

MiLukita es un prototipo técnico avanzado con una base suficiente para continuar hacia preproducción. El núcleo de juegos, resultados, créditos virtuales, verificación, TV, QR, realtime, lobby, contenido interactivo y controles de operación están implementados en distintos grados. Sin embargo, la evidencia actual demuestra autonomía lógica y simulada, no autonomía productiva continua.

La recomendación es **NO activar dinero real ni publicación regulada**. La siguiente etapa debe concentrarse en auditoría, locking distribuido, pruebas de caos con servicios separados, QA físico, observabilidad y certificación independiente. No se recomienda añadir más juegos hasta cerrar estas brechas.

## 2. Principios y límites

MJP CORE permanece como autoridad sobre RNG, RTP, reglas, resultados, wallet, ledger, liquidación, Event Store autoritativo, MjpTvManifest y permisos. Lukita solo presenta, explica, acompaña y reacciona. El piloto no tiene dinero real, retiros, conversión ni pagos operativos.

Cualquier discrepancia debe seguir: **DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR**.

## 3. Arquitectura actual

| Capa | Estado | Evidencia principal |
|---|---|---|
| Frontend React/Vite | IMPLEMENTADO Y PROBADO | `client/src` |
| API Express/tRPC | IMPLEMENTADO Y PROBADO | `server/routers.ts`, routers por dominio |
| Base de datos Drizzle/MySQL-TiDB | IMPLEMENTADO | `drizzle/schema.ts`, migraciones |
| Autenticación y roles | IMPLEMENTADO Y PROBADO | Manus OAuth y procedimientos protegidos |
| MJP CORE y rondas | IMPLEMENTADO Y PROBADO | `server/pilot.ts` y pruebas de integración |
| TV/Overlay | IMPLEMENTADO; QA físico pendiente | `BroadcastPage.tsx`, `tvManifest.ts` |
| QR circular | IMPLEMENTADO Y PROBADO LOCALMENTE | `shared/circularQr.ts`, componente QR |
| Realtime | IMPLEMENTADO Y PROBADO LOCALMENTE | `PlayerSessionManager`, `websocketServer` |
| TV en línea | IMPLEMENTADO EN PRIMERA VERSIÓN | `OnlineTvGamesPage.tsx`, servicio y router |
| Persistencia de sesiones | PARCIAL | `onlineTvPersistence.ts`; locking de estado pendiente |
| Lukita 3D | MOCK/PREVIEW/REVIEW | `/lukita-3d`; producción final bloqueada |

## 4. Agentes y autoridad

La matriz existente está en `shared/agentMap.ts`. Resume correctamente la separación de capacidades, pero varios agentes son perfiles conceptuales o preparados y no procesos independientes de runtime.

| Agente | Estado | READ | WRITE | PROPOSE | EXECUTE | Autoridad |
|---|---|---|---|---|---|---|
| Auditor Agent | CONCEPTUAL | Estado autorizado | Reportes | Correcciones | No permitido | MJP CORE no delegada |
| Scheduler | PREPARADO | Calendario/registry | Propuestas | Ventanas | Limitado | Round Engine |
| Autopilot | IMPLEMENTADO/LIMITADO | Operación | Allowlist | Automatización | Limitado | MJP CORE |
| Watchdog | CONCEPTUAL | Health/métricas | Alertas futuras | Diagnóstico | No permitido | Operación |
| Supervisor | CONCEPTUAL | Estado permitido | Informes | Decisiones | Limitado | MJP CORE |
| Lukita | IMPLEMENTADO/LIMITADO | Manifest | Presentación local | Guiones/poses | Limitado | Manifest público |
| Content/Script | IMPLEMENTADO/LIMITADO | Biblioteca | Borradores | Variantes | No permitido | Revisión humana |
| Monitoring | IMPLEMENTADO/LIMITADO | Logs/métricas | Alertas | Observabilidad | No permitido | Operación |
| Safety | PREPARADO | Señales/límites | Bloqueos permitidos | Restricciones | Limitado | Política/MJP CORE |

**Conclusión:** no debe afirmarse que existe un sistema completo de agentes autónomos independientes. Existe una combinación de perfiles, servicios acotados, controles y simulaciones.

## 5. Scheduler y Event Engine

`server/schedulerEngine.ts` genera propuestas, bloques y eventos, valida prerequisitos y exige aprobación humana `DRAFT → APPROVED → PUBLISHED`. Esto es una frontera correcta de seguridad. El Scheduler detecta parámetros inválidos, ventana excedida, solapamientos y requisitos faltantes.

La matriz solicitada por la orden usa `VALID`, `WARNING` y `BLOCKED`. El estado explícito `CONFLICT` todavía no existe; los conflictos se representan dentro de `BLOCKED` mediante la lista `conflicts`. Debe añadirse solo si se decide que mejora la semántica del contrato.

**Estado:** IMPLEMENTADO/PARCIAL. Faltan persistencia operacional completa, conflictos de recursos, eventos sin cierre/siguiente estado, contingencias verificadas y ejecución prolongada.

## 6. Autonomía 24 horas

Existe `server/supervisedWorker.ts`, con claims por minuto, idempotencia, respeto de `STOPPED`, ciclos programados y eventos operacionales. Existe `shared/autonomySimulation.ts`, que simula 1.440 minutos y declara sus limitaciones.

La orden exige una cadena Scheduler → Event → TV → QR → celular → interacción → cierre → resultado → verificación → siguiente evento y supervisión por watchdog, auditoría, seguridad y recovery. El nuevo harness `shared/agentRuntimeAutonomy.ts` recorre esa cadena de forma determinista y registra 1.440 eventos, 144 identificadores de evento, 10 escenarios de caos y un escenario KILL LUKITA.

**Clasificación:** SIMULADO/PROBADO como harness; AUTONOMÍA PRODUCTIVA 24/7: PENDIENTE.

## 7. Caos controlado

El harness cubre QR caído, TV desconectada, conflicto de Scheduler, agente sin permiso, agente duplicado, agente detenido, Lukita detenida, intento de alterar resultado, Event Store no disponible y Kill Switch. La respuesta esperada es contingencia, rechazo, idempotencia, preservación del estado o detención segura.

Estas son pruebas contractuales deterministas. Falta ejecutarlas con servicios reales separados, fallos de red, reinicios, base de datos no disponible, timeouts y observabilidad externa.

## 8. KILL LUKITA

`docs/MILUKITA_KILL_LUKITA_RUNTIME.md` documenta el escenario. Con Lukita fuera de servicio deben continuar TV, QR, celular, evento, cierre, resultado, verificación y siguiente evento; se degradan guion, presencia adaptativa y celebración audiovisual.

**Estado:** SIMULADO/PROBADO. Falta prueba runtime con el avatar, TTS o proveedor externo realmente detenido.

## 9. Juegos y experiencia

El catálogo de TV en vivo contiene ruletas, loterías, bingos, Jackpot, Trío 13, Pick 3, Pick 4, Loto Diario, Loto Express, Raspa Digital y Sueldo de por vida. La línea TV en línea contiene diez juegos interactivos de habilidad/cooperación, incluidos Semáforo, Intruso y Código Cooperativo.

El catálogo está amplio. La prioridad debe ser seleccionar menos juegos para emisión, versionar contenido y mejorar comprensión, ritmo, accesibilidad y repetición responsable. No se debe usar cantidad de modalidades como sustituto de validación de producto.

## 10. TV, QR y celular

La TV usa `/tv`, manifest, QR circular MiLukita, temporizador, carrusel/video, contingencia y panel persistente. El celular usa lobby, join, heartbeat, reconexión, salida y acciones validadas. El QR circular prioriza escaneabilidad sobre estética y mantiene fallback.

**Pendiente crítico:** pruebas físicas en iPhone/Safari iOS, Android TV, Google TV, tablets y diferentes distancias/iluminación. Los screenshots de viewport no son certificación de hardware.

## 11. Seguridad y autoridad

La autoridad server-side está implementada para rondas, juegos interactivos, Boss Fight y acciones anti-replay. Se añadió persistencia de acciones con clave única y finalización de resultado. El locking de acción es distribuible si las instancias comparten base de datos, pero el estado completo de sesión aún requiere locking o versionado optimista.

KYC/AML, geolocalización, pagos, retiros y homologación no están activos. El expediente técnico de RNG no sustituye certificado de laboratorio.

## 12. Lukita y Character System

Lukita está definida como identidad, presentadora y companion no autoritativa. Debe aparecer en bienvenida, explicación, cuenta regresiva, resultados, celebración, transición, ayuda y recuperación; debe reducirse durante interacción densa o información crítica.

El mock 3D de `/lukita-3d` es infraestructura de Preview/Review. El blockout técnico no es avatar final. Modelado detallado, rigging definitivo, animación final, voz, TTS, lip-sync e integración pública permanecen bloqueados o pendientes de aprobación humana.

## 13. Estado de pruebas

La última validación registrada reporta `pnpm check` aprobado, suite con 54 archivos aprobados y 1 omitido, 173 pruebas aprobadas y 4 omitidas, y `pnpm build` aprobado. La prueba WebSocket sostenida local llegó a 100 clientes durante 15 minutos, con JOIN p99 de 279,296 ms y reconexión p99 de 314,015 ms.

Estas métricas son locales. No certifican producción, red pública, multiinstancia, navegador físico ni disponibilidad continua.

## 14. Riesgos P0–P3

| Prioridad | Riesgo | Estado | Acción |
|---|---|---|---|
| P0 | Doble autoridad o manipulación de resultados | Controlado parcialmente | Mantener servidor como única autoridad y agregar pruebas de adversario |
| P1 | Divergencia de estado multiinstancia | Pendiente | Locking DB/versionado/almacén realtime compartido |
| P1 | Falta de QA físico | Pendiente | Ejecutar matriz real y conservar evidencia |
| P1 | Autonomía confundida con simulación | Riesgo de comunicación | Etiquetar siempre `SIMULADO` y `NO CERTIFICADO` |
| P1 | RNG sin certificación independiente | Pendiente | Laboratorio independiente antes de monetización |
| P1 | Boss Fight público incompleto | Pendiente | QA interno cerrado antes de integrar públicamente |
| P2 | Contenido inicial pequeño | Parcial | Banco versionado, moderado y multilingüe |
| P2 | Observabilidad incompleta | Parcial | CPU, memoria, p95/p99, alertas y trazas |
| P2 | Torneos y rankings incompletos | Pendiente | Definir reglas, cierre, apelaciones y reconciliación |
| P3 | Nomenclatura histórica MJP/MiLukita | En corrección | Mantener glosario único |

## 15. Etapas de avance

| Etapa | Descripción | Estado |
|---|---|---|
| 0 | Núcleo, juegos virtuales, reglas, wallet y verificación | Completada |
| 1 | Realtime, lobby y 100 jugadores | Completada técnicamente |
| 2 | Boss Fight autoritativo | Motor interno; público pendiente |
| 3 | Ledger virtual y recompensas | Persistencia inicial; torneo completo pendiente |
| 4 | Simulación 1.000 partidas/sensibilidad | Completada como simulación |
| 5 | Diez juegos TV en línea | Primera versión implementada |
| 6 | Persistencia y carga sostenida | Parcial; 15 min local |
| 7 | Validación física, producto, seguridad y cumplimiento | Pendiente |
| 8 | Certificación interna de máquina autónoma | Pendiente |

## 16. Cronograma recomendado

| Horizonte | Actividad | Criterio de salida |
|---|---|---|
| Semana 1 | Locking distribuido, replay adversarial y carga 30–60 min | Sin divergencias; p95/p99 registrados |
| Semana 2 | QA físico multidispositivo | QR, conexión, salida y exportación verificados |
| Semana 3 | Auditoría completa Scheduler/estados/agentes | Matrices sin estados huérfanos críticos |
| Semana 4 | Runtime autonomy test con servicios separados | Cadena 24 h trazable y recuperable |
| Semana 5 | Kill Lukita real de proveedores | Cadena continúa con degradación documentada |
| Semana 6 | Boss Fight interno y observabilidad | Cierre, replay y reconexión verificados |
| Posterior | RNG, privacidad, KYC/AML y revisión legal | Decisión formal antes de monetización |

## 17. Criterio de salida

MiLukita podrá acercarse a la clasificación de “máquina autónoma de entretenimiento digital” solo cuando pueda demostrar, con evidencia reproducible y no solo simulada, que programa, prepara, presenta, genera QR, conecta TV/celular, ejecuta interacción, cierra, obtiene resultado autoritativo, verifica, se recupera y continúa al siguiente evento bajo control humano y límites explícitos.

## 18. Archivos clave

`shared/agentMap.ts`, `server/schedulerEngine.ts`, `server/supervisedWorker.ts`, `server/autonomy.ts`, `shared/autonomySimulation.ts`, `shared/agentRuntimeAutonomy.ts`, `server/realtime/playerSessionManager.ts`, `server/realtime/websocketServer.ts`, `shared/tvManifest.ts`, `shared/experienceEngine.ts`, `client/src/pages/BroadcastPage.tsx`, `client/src/pages/OnlineTvGamesPage.tsx`, `client/src/pages/Lukita3DStudioPage.tsx`, `docs/MILUKITA_AUDITORIA_TOTAL_UNIFICADA.md`, `docs/MILUKITA_UX_MASTER_AUDIT.md`, `docs/MILUKITA_15_MINUTE_EXPERIENCE.md`, `docs/MILUKITA_KILL_LUKITA_RUNTIME.md` y `docs/QA_DEVICE_CERTIFICATION.md`.

## Conclusión

La arquitectura es viable para continuar, pero el producto debe pasar de “muchos módulos implementados” a “una cadena operativa demostrada”. La orden maestra debe considerarse **en ejecución controlada**, con autonomía simulada, agentes parcialmente preparados, TV y juegos virtuales funcionales, y certificación física, distribuida, legal y de laboratorio aún pendientes.

**No activar monetización ni presentar autonomía productiva hasta cerrar las brechas P1.**

## Referencias oficiales

[1]: https://www.gob.pe/94256-autorizacion-y-registro-homologacion-y-o-renovacion-y-o-modificacion-de-las-plataformas-tecnologicas-de-los-juegos-a-distancia-y-o-de-las-apuestas-deportivas-a-distancia "MINCETUR — Homologación de plataformas tecnológicas"

[2]: https://www.gob.pe/94276-autorizacion-y-registro-homologacion-y-o-modificacion-de-programas-de-juego "MINCETUR — Homologación de programas de juego"

[3]: https://busquedas.elperuano.pe/dispositivo/NL/2095517-1 "El Peruano — Ley N.º 31557"


## 19. Evidencia ejecutada de la Orden Maestra

Se ejecutó `pnpm test:autonomy-runtime` el 26 de agosto de 2026. Resultado: `passed: true`, `chainCompleted: true`, `minutes: 1440`, `uniqueEventIds: 144`, `chaosPassed: true` y `killLukitaPassed: true`. El archivo generado es `audit-package/AGENT_RUNTIME_AUTONOMY_TEST.json`.

El resultado confirma que el harness recorre las fases declaradas y que las respuestas contractuales de caos son coherentes. No demuestra ejecución real de cron, red, navegador físico, proveedor de avatar, Event Store caído o infraestructura 24/7. La etiqueta correcta es **PROBADO/SIMULADO**, no `AUTÓNOMO PRODUCTIVO`.

## 20. Hallazgos específicos de Scheduler y estados

`server/schedulerEngine.ts` exige aprobación humana para publicar. Detecta parámetros inválidos, ventanas excedidas, solapamientos y prerequisitos ausentes. Sus estados formales son `VALID`, `WARNING` y `BLOCKED`; la orden solicita además `CONFLICT`, pero hoy un solapamiento se registra dentro de `BLOCKED`. Esto es una brecha semántica de prioridad P2, no una razón para reescribir el motor.

`shared/experienceEngine.ts` contiene transiciones explícitas y estados terminales `COMPLETED` y `CANCELLED`. Las pruebas existentes cubren transiciones válidas e inválidas. La auditoría no encuentra autorización para que Lukita, un agente o el cliente cambien el estado oficial. Debe añadirse una matriz automática de entradas/salidas y un detector de eventos sin QR, contenido, contingencia o siguiente evento antes de operar programación a escala.

## 21. Veredicto de la Orden Maestra

La orden está **parcialmente ejecutada**. Se completó la auditoría de arquitectura, la matriz de permisos existente, el harness de autonomía, los escenarios de caos y el KILL LUKITA simulado. Permanecen pendientes la autonomía runtime real, el watchdog como servicio persistente independiente, la prueba física, locking distribuido completo, observabilidad de producción, certificación RNG, homologación y validación legal. No se agregaron agentes nuevos ni se modificaron superficies autoritativas.
