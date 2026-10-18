# Multi Juegos Perú — Estado situacional y auditoría exhaustiva

**Proyecto:** `ruleta-peru-online`  
**Producto:** Multi Juegos Perú (MJP)  
**Fecha de corte:** 25 de agosto de 2026  
**Autor:** Manus AI  
**Checkpoint de esta entrega:** se asignará al guardar la versión validada  
**Alcance:** piloto de entretenimiento con créditos virtuales, sin dinero real

> Este informe describe el estado técnico observable del piloto. No constituye certificación independiente, homologación ni opinión legal. Una futura operación con dinero real, pagos, retiros o conversión a soles debe diseñarse como un producto separado, someterse a revisión jurídica peruana especializada y obtener las autorizaciones que correspondan antes de operar.

## 1. Resumen ejecutivo

Multi Juegos Perú es un piloto web full-stack de juegos virtuales. El backend actúa como autoridad de rondas, reglas, resultados, premios virtuales, billeteras y auditoría. La capa de presentación incluye Web/PWA, simuladores, verificación pública, QR firmado, `/tv` y `/overlay/:roundId` para consumo en navegador u OBS.

La integración TV OS utiliza `MjpTvManifest v1` como contrato unificado. El manifest se deriva de la proyección pública de rondas y contiene evento, estado, cuenta regresiva, participación, QR, resultado, verificación, recuperación, secuencia y banderas explícitas de `VIRTUAL_CREDITS`. TV Client y overlay no sortean ni liquidan; interpretan el estado que reciben del servidor.

En esta entrega se incorporan cuatro mejoras operativas. Al abrir `/tv`, el usuario puede elegir **Ver transmisión en vivo** o **Ver en línea**, y dispone de **Cambiar modo** y **Salir**. Las notificaciones de `/tv` admiten temas visuales configurables y persistentes por navegador. El overlay resalta cambios del panel estadístico y permite exportarlo como PNG local. El informe conserva también las limitaciones anteriores: YouTube Live oficial, avatar 3D, TTS, watchdog persistente y operación real permanecen desactivados o bloqueados.

## 2. Política de dinero virtual y separación regulatoria

El piloto opera con créditos virtuales gratuitos. En el código y en el contrato TV se mantienen las banderas `virtualOnly: true`, `creditsOnly: true` y el modo `VIRTUAL_CREDITS`. No se implementan depósitos, retiros, Yape, tarjetas, conversión, pagos, cobros ni liquidación de valor monetario.

La arquitectura puede servir como base de una futura evaluación, pero no convierte automáticamente el piloto en un sistema autorizado. La migración a dinero real exigiría una nueva evaluación de producto, jurisdicción, identidad, geolocalización, límites, juego responsable, prevención de fraude, trazabilidad financiera, homologación, seguridad, proveedores y aprobación legal. La interfaz actual no debe interpretarse como autorización para operar.

| Control | Estado actual | Evidencia | Riesgo o pendiente |
|---|---|---|---|
| Créditos virtuales | PASS | Wallet y contratos con banderas virtuales | Mantener aislamiento en cualquier nueva integración |
| Depósitos y retiros | OFF | No hay flujo activo | No activar sin decisión y revisión legal |
| Yape/tarjetas | OFF | Sin proveedor conectado | Requiere alcance separado |
| Conversión a soles | OFF | No existe conversión | Prohibida dentro del piloto |
| KYC/AML real | OFF | Existe preparación documental, no operación | Requiere proveedor, política y base legal |
| Juego responsable | Parcial | Límites y autoexclusión simulada | Falta validación operativa y legal |

## 3. Stack y arquitectura vigente

| Capa | Tecnología o módulo | Estado |
|---|---|---|
| Frontend | React 19, Vite, Tailwind 4, componentes shadcn/ui | Implementado |
| Backend | Express, tRPC 11, TypeScript | Implementado |
| Persistencia | Drizzle ORM, MySQL/TiDB | Implementado |
| Identidad | Manus OAuth y roles | Implementado |
| Motor de rondas | `server/pilot.ts`, estados persistidos y reglas versionadas | Implementado con pendientes de concurrencia profunda |
| Resultado verificable | HMAC-SHA-256, semilla, hash y verificación pública | Implementado |
| TV OS | `/tv`, `/overlay/:roundId`, `MjpTvManifest v1` | Implementado para piloto |
| Sincronización | Polling de 5–10 segundos y `BroadcastChannel` local | Implementado; no es tiempo real de baja latencia |
| YouTube Live API | Adaptador con fallback bloqueado | Bloqueado sin credenciales y decisión humana |
| PWA | Manifest, instalación, offline, guía táctil y responsive | Implementado |
| Persistencia de señal | `broadcast_signal_metrics` y panel operativo | Implementado como fuente local |

## 4. Fuente única de verdad y flujo TV OS

El flujo autoritativo es:

```text
Round Engine + Draw Engine + Rule Engine + Credit Engine
                         │
                         ▼
              Proyección pública de broadcast
                         │
                         ▼
                  MjpTvManifest v1
                    │             │
                    ▼             ▼
                 /tv       /overlay/:roundId
                    │             │
                    ▼             ▼
             señal audiovisual     OBS / navegador
                    │
                    ▼
          pantalla secundaria mediante QR
```

El backend calcula el estado público a partir de la ronda y sus tiempos. La secuencia del manifest se deriva de la apertura de la ronda y del estado proyectado; por ello, una transición como `OPEN → LOCKED` puede generar un aviso, mientras que un polling repetido sin cambio no debe producir ruido. La corrección aplicada evita que una ronda vencida continúe apareciendo como abierta en el manifest.

## 5. Inicio del TV: en vivo, en línea y salida

Al acceder a `/tv` sin parámetro de modo, la pantalla inicial presenta dos alternativas:

| Opción | Función | Dependencias |
|---|---|---|
| Ver transmisión en vivo | Muestra el iframe audiovisual cuando existe un ID válido y conserva QR, ronda, historial y verificación | ID de video y disponibilidad de señal |
| Ver en línea | Oculta la dependencia audiovisual y muestra estado del evento, manifest, historial, QR cuando corresponda y verificación | Conectividad con MJP Core |

El modo seleccionado aparece en una barra de control. **Cambiar modo** regresa al selector sin abandonar el portal. **Salir** navega a `/`, evitando que el usuario quede atrapado en una pantalla de emisión. También es posible entrar mediante `?mode=live` o `?mode=online` para pruebas y enlaces controlados.

La opción en línea no es un bypass de seguridad: solo cambia la presentación. La autoridad de la ronda, el cierre, el resultado y la evidencia sigue estando en el servidor.

## 6. Notificaciones de `/tv` y personalización de marca

La vista TV compara el identificador de evento y la secuencia del manifest anterior con la respuesta nueva. Si cambia el evento, muestra **Nueva ronda disponible**. Si cambia la secuencia dentro del mismo evento, muestra **Manifest actualizado**. La notificación es accesible mediante `role=status` y `aria-live`, tiene botón de cierre y desaparece automáticamente después de unos segundos.

Se añadieron cuatro temas locales para la marca del canal:

| Tema | Uso recomendado | Persistencia |
|---|---|---|
| Esmeralda MJP | Identidad principal del producto | `localStorage` del navegador |
| Dorado cálido | Sorteos, resultados o mensajes destacados | `localStorage` del navegador |
| Azul medianoche | Canal sobrio o nocturno | `localStorage` del navegador |
| Alto contraste | Accesibilidad y pantallas con baja legibilidad | `localStorage` del navegador |

La personalización cambia colores de la notificación, no el contenido autoritativo del evento. Los colores no deben utilizarse para ocultar estados de desconexión o presentar resultados no verificados.

## 7. Overlay y estadísticas del manifest

`/overlay/:roundId` consume el manifest del mismo round ID y muestra `ManifestStatsPanel`. El panel presenta datos recibidos desde el contrato, sin estimarlos en el navegador:

| Grupo | Datos |
|---|---|
| Estado | Estado del evento, juego, identificador y secuencia |
| Tiempo | Cuenta regresiva y fuente temporal del servidor |
| Participación | Participantes confirmados, modo y permiso de participación |
| Acceso | QR disponible, firmado y con expiración |
| Resultado | Disponibilidad, verificación y publicación |
| Control | Ruleset, recuperación, hora de actualización y evento |
| Separación | `VIRTUAL_CREDITS` y leyenda de sin dinero real |

Cuando cambia la secuencia del manifest, el panel aplica un realce breve de borde y halo. El efecto está anulado cuando el usuario o el sistema operativo solicita reducción de movimiento.

El botón **Exportar PNG** genera una imagen local a partir de los datos visibles del manifest. No envía la estadística a terceros ni modifica la base de datos. La imagen incluye evento, estado, secuencia, participantes, QR, resultado, ruleset, canal, hora y la leyenda de créditos virtuales.

## 8. Estados visuales, accesibilidad y contingencia

El componente `ManifestConnectionStatus` distingue `Cargando manifest`, `Manifest conectado` y `Manifest desconectado`. La carga usa un indicador visual; la conexión identifica a `MJP CORE`; la desconexión informa que se conserva el último estado verificable. El shimmer, el pulso y las transiciones tienen alternativas estáticas para `prefers-reduced-motion`.

En `/tv`, una caída audiovisual no equivale a un cierre o sorteo fallido. Se muestra contingencia con reconexión, historial, verificación y estado del servidor. En modo en línea, la señal audiovisual no se requiere para consultar el manifest.

## 9. Estado funcional por área

| Área | Estado | Evidencia y comentario |
|---|---|---|
| Round Engine | PASS | Rondas y estados persistidos; falta claim transaccional profundo para concurrencia extrema |
| Draw Engine | PASS | HMAC-SHA-256 y verificación pública |
| QR | PASS | Firma, expiración y derivación determinista por ronda |
| Wallet virtual | PASS | Idempotencia y ausencia de valor monetario |
| RTP | MIXTO | Calculadora teórica disponible; algunas simulaciones aisladas no modelan todas las reglas |
| PWA | PASS | Instalación, offline, guía táctil, temas y responsive |
| TV Client | PASS / LOCAL ONLY | Modos en vivo/en línea, contingencia, manifest y notificaciones; señal real aún depende de configuración |
| Overlay/OBS | PASS / LOCAL ONLY | Presentación web y estadísticas del manifest; OBS físico no certificado |
| YouTube oficial | BLOCKED | Requiere credenciales restringidas, canal y decisión de alcance |
| Auditor Agent | PASS / NO AUTORITATIVO | Verifica de forma determinista; no decide resultados |
| Event Store | PASS | Eventos operativos con correlación e idempotencia |
| Game Registry | PASS | Registro central de modalidades y ciclo de vida |
| Analítica | LOCAL ONLY | DAU/WAU/retención y beacon no-PII preparados; falta observabilidad productiva completa |
| Scheduler | BLOCKED | Preparado, desactivado por decisión humana |
| Watchdog | NOT IMPLEMENTED | Requiere servicio persistente y procedimiento de escalamiento |
| Avatar 3D/TTS | NOT IMPLEMENTED | Sin proveedor ni activos integrados |
| Dinero real | OFF | No debe activarse dentro del piloto |

## 10. Base de datos y API

El esquema contiene tablas para usuarios, rulesets, rondas, billeteras, transacciones, tickets, programaciones, auditoría, mercados, impacto social y métricas de señal. Las lecturas públicas de rondas, manifest, QR y verificación no requieren autenticación porque entregan información pública; las reservas y billetera son protegidas; las funciones operativas son administrativas.

El contrato de broadcast debe mantenerse como lectura pública y no debe aceptar desde TV o overlay instrucciones de sorteo, liquidación, cambio de estado o modificación de reglas. Los consumidores solo interpretan el manifest.

## 11. Seguridad, privacidad y riesgos

La aplicación utiliza OAuth, roles, rate limiting, cabeceras y procedimientos administrativos. La telemetría frontend de retención se diseñó sin PII. Aun así, antes de producción se requiere revisión de secretos, pruebas de penetración, pruebas de autorización horizontal, revisión de almacenamiento, políticas de retención, protección ante abuso del polling y pruebas de concurrencia de cierre/liquidación.

El riesgo técnico principal identificado es la ausencia de un claim transaccional explícito que impida que dos procesos de cierre concurrentes lean y liquiden la misma ronda antes de completar su idempotencia. El riesgo de producto principal es no demostrar retención real con usuarios. El riesgo regulatorio principal aparecería al intentar monetizar, cobrar, pagar, convertir o presentar el piloto como operación autorizada.

## 12. Pruebas y evidencias de esta entrega

La validación específica de esta mejora incluye:

| Validación | Resultado |
|---|---|
| TypeScript (`pnpm check`) | Aprobado |
| Pruebas de manifest, broadcast y UI pura | Aprobadas: 13 pruebas en 3 archivos |
| Build de producción (`pnpm build`) | Aprobado en esta entrega; genera solo advertencias no bloqueantes preexistentes |
| Revisión visual escritorio | Realizada para TV y overlay |
| Revisión visual móvil | Realizada a 390×844 px |
| `git diff --check` | Aprobado sin errores |
| Datos reales modificados | Ninguno por el laboratorio; exportación PNG es local |
| Pagos o dinero real | No activados |

## 13. Archivos relevantes de la entrega

| Archivo | Función |
|---|---|
| `client/src/pages/BroadcastPage.tsx` | Selector de modo, salida, notificaciones y TV Client |
| `client/src/components/TvModeStartScreen.tsx` | Pantalla inicial de selección en vivo/en línea |
| `client/src/components/ManifestConnectionStatus.tsx` | Indicador reutilizable de conexión |
| `client/src/components/ManifestStatsPanel.tsx` | Panel estadístico, animación y exportación PNG |
| `client/src/index.css` | Transiciones, pulso, shimmer y reducción de movimiento |
| `shared/manifestUi.ts` | Lógica pura de estados y cambios del manifest |
| `server/broadcast.ts` | Proyección autoritativa y secuencia estable del manifest |
| `server/tvManifest.test.ts` | Pruebas del contrato y estado `LOCKED` |
| `shared/manifestUi.test.ts` | Pruebas de estados y notificaciones |
| `MJP_MASTER_IMPLEMENTATION_AUDIT.md` | Auditoría maestra acumulativa |
| `todo.md` | Trazabilidad de tareas |

## 14. Pendientes priorizados

| Prioridad | Pendiente | Criterio de cierre |
|---|---|---|
| Alta | Claim transaccional de cierre y liquidación | Dos cierres simultáneos producen un solo resultado y una sola liquidación |
| Alta | Certificación independiente de RNG y reglas | Informe externo reproducible |
| Alta | Pruebas de carga y concurrencia | Matriz con usuarios concurrentes y latencias medidas |
| Media | YouTube Live oficial | Credenciales restringidas, scopes mínimos, canal y procedimiento aprobados |
| Media | Observabilidad productiva | Métricas, logs, alertas y retención definida |
| Media | Pruebas físicas | Smart TV, Android TV, Google TV, tablet, celular y OBS reales |
| Baja | Avatar/TTS | Proveedor, activos, voces, permisos y presupuesto aprobados |
| Bloqueado | Dinero real | Nueva decisión de negocio, revisión legal, homologación y autorización antes de cualquier activación |

## 15. Recomendación de auditoría

La siguiente auditoría debe separar tres preguntas. Primero, si el motor produce resultados reproducibles y no permite doble cierre bajo concurrencia. Segundo, si el usuario entiende cuándo está en piloto virtual, qué significa el QR y qué datos son autoritativos. Tercero, si el producto demuestra retorno y uso recurrente sin apoyarse en afirmaciones no verificadas o en una monetización prematura.

No se recomienda activar pagos, conversión, premios monetarios, publicidad que sugiera valor económico ni automatizaciones irreversibles hasta cerrar la revisión técnica independiente y la decisión legal. Se recomienda mantener el modo en línea como ruta estable de contingencia, porque reduce la dependencia de YouTube y hace visible el estado verificable del sistema.

## 16. Conclusión

El sistema se encuentra en una etapa funcional de piloto virtual con una arquitectura TV OS coherente. La selección en vivo/en línea y la salida hacen explícito el flujo de entrada; las notificaciones personalizables mejoran la adaptación de marca; el overlay ofrece datos compartibles y trazables; y el manifest continúa siendo la única fuente de estado para los consumidores.

La plataforma todavía no debe describirse como operación comercial, certificada, homologada ni habilitada para dinero real. La ruta responsable es consolidar la concurrencia del backend, completar pruebas independientes, validar hardware y medir retención real antes de considerar cualquier ampliación.

## Referencias internas

[1]: `./MJP_MASTER_IMPLEMENTATION_AUDIT.md` — Auditoría maestra acumulativa del proyecto.  
[2]: `./shared/tvManifest.ts` — Contrato compartido `MjpTvManifest v1`.  
[3]: `./server/broadcast.ts` — Proyección de broadcast, rondas y manifest.  
[4]: `./todo.md` — Registro verificable de tareas y pendientes.  
[5]: `./shared/eventEngine.ts` — Estados públicos y transiciones del Event Engine.


## 17. Revisión visual de la entrega actual

La revisión visual de `/tv` confirma que el acceso inicial presenta dos opciones claramente diferenciadas: transmisión en vivo y vista en línea. También se observa el botón **Salir al portal**. La revisión de `/tv?mode=online` confirma que el modo en línea muestra su barra de modo y no depende del iframe audiovisual. La revisión de `/overlay/RP-R-JQXXKIYB` confirma el indicador de manifest conectado, la secuencia y el botón **Exportar PNG** en el panel estadístico.

La vista TV conserva la guía táctil inicial previamente configurada; esta guía puede cubrir parte del contenido en el primer acceso y debe cerrarse para continuar. El comportamiento observado es consistente con el diseño existente. El selector de temas de notificaciones queda disponible dentro del modo operativo y utiliza opciones de contraste diferenciadas. No se observaron desbordamientos horizontales en las capturas revisadas.
