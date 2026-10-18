# Auditoría profunda de MiLukita / Lukita Live

**Fecha de corte:** 28 de agosto de 2026  
**Autor:** Manus AI  
**Proyecto:** `ruleta-peru-online`  
**Checkpoint de referencia anterior:** `e41e559c`  
**Estado de esta auditoría:** preparada para revisión externa; requiere un checkpoint posterior para fijar esta versión exacta.

> **Declaración ejecutiva:** MiLukita ya no debe evaluarse únicamente como un visor WebAR. La dirección correcta es construir un núcleo de experiencia llamado **Lukita Live**, donde WebXR, cámara, video, QR, Controller Lab y los contenidos sociales son medios de presentación. El cuello de botella principal ya no es la capacidad técnica básica del visor, sino la consolidación del **Lukita Character Foundation**, la calidad visual del asset 3D aprobado, la evidencia en hardware real y la definición de contratos de producción.

## 1. Alcance solicitado y decisión arquitectónica

La orden actual cambia el centro de gravedad del producto. El objetivo no es acumular un visor AR aislado, sino consolidar un sistema en el que Lukita sea una protagonista viva de experiencias públicas y sociales. El flujo objetivo es: descubrir una experiencia, encontrarse con Lukita, interactuar con ella, usar la cámara, capturar una foto o video, revisar el material y compartirlo de manera explícita.

La arquitectura adoptada mantiene cuatro separaciones que no deben relajarse:

| Separación | Función | Estado auditado |
|---|---|---|
| **Experience QR ≠ Control QR** | El primero abre una experiencia pública; el segundo vincula una sesión de TV con Controller Lab. | **IMPLEMENTADO COMO CONTRATO** en `shared/lukitaLiveBoundaries.ts`; el flujo público completo requiere integración de producción. |
| **Controller Lab = backstage** | Controla navegación, volumen, escenas y puntero; no forma parte de la verdad del juego ni de la narrativa pública. | **IMPLEMENTADO** y cubierto por contratos previos y el nuevo límite formal. |
| **Lukita = protagonista viva** | Presenta, acompaña, explica, reacciona y genera momentos de cámara/social; no decide resultados. | **IMPLEMENTADO COMO FOUNDATION CONTRACT**; el modelo 3D final y la conducta audiovisual siguen sujetos a revisión. |
| **MJP CORE = verdad autoritativa** | Conserva RNG, resultados, RTP, reglas, wallet, ledger, settlement y manifest. | **PROBADO** por pruebas de aislamiento; no debe recibir mutaciones desde Lukita Live. |

La decisión técnica es mantener a AR Stage como un perímetro de presentación. Cualquier integración futura debe ser de lectura, versionada, auditable y explícitamente incapaz de enviar decisiones hacia MJP CORE.

## 2. Character Foundation: el cuello de botella correcto

La guía maestra existente define a Lukita como una anfitriona virtual adulta, cálida, reconocible y profesional. Sus anchors principales son rostro, cabello oscuro y largo, sonrisa, silueta, paleta maestra azul profundo/dorado/blanco, micrófono e insignia L. La guía también establece que el personaje puede presentar datos autorizados, pero nunca decidir resultados ni sustituir el sistema autoritativo [1].

La imagen entregada por el propietario fue incorporada como **referencia visual de Character Foundation**, no como sustituto silencioso de la ficha maestra. La evidencia visual queda disponible en [/manus-storage/lukita-character-foundation-reference_0f52a9ed.png](/manus-storage/lukita-character-foundation-reference_0f52a9ed.png); el concepto original del device AR queda en [/manus-storage/lukita-ar-device-concept_43fd0153.png](/manus-storage/lukita-ar-device-concept_43fd0153.png). Esto es importante porque la lámina muestra una dirección estilizada con acentos rosa, negro, dorado y blanco, mientras que la ficha maestra congelada prioriza azul profundo, dorado y blanco. La diferencia no debe resolverse automáticamente por código: debe registrarse como una decisión visual humana.

| Elemento | Decisión vigente | Evidencia | Riesgo pendiente |
|---|---|---|---|
| Edad aparente | Presentadora adulta | `docs/LUKITA_MASTER_CHARACTER_GUIDE.md` | Validar que cada render conserve apariencia adulta. |
| Rostro y mirada | Cálidos, expresivos, reconocibles | Guía maestra y lámina entregada | Prueba humana de reconocimiento en tamaño reducido. |
| Cabello | Oscuro, largo y consistente | Guía maestra; referencia visual | Asegurar consistencia entre vistas y LOD. |
| Estrella | Anchor reconocible de Lukita | Guía maestra, Controller Lab y AR Stage | No convertirla en un elemento que tape información autoritativa. |
| Vestuario/paleta | Azul profundo/dorado/blanco como dirección maestra; rosa/negro de la imagen como variante candidata | Foundation contract y guía maestra | Decisión humana de compatibilidad antes de producción 3D. |
| Mascota Kiko | Companion opcional | Lámina y foundation | No debe desplazar a Lukita como protagonista. |
| Voz, TTS, lip-sync | Bloqueados hasta revisiones específicas | Guía maestra | No implementar voz definitiva por inferencia. |

Se creó `shared/lukitaCharacterFoundation.ts` con versión `LUKITA-CHARACTER-FOUNDATION-01`. El contrato declara el rol de Lukita, sus anchors, el bucle `discover → meet → interact → capture → share`, las cámaras frontal/trasera, los modos foto/video y el estado `CANDIDATE_FOUNDATION_FOR_HUMAN_APPROVAL`. La propiedad `presentationOnly` es obligatoria y el contrato enumera los dominios prohibidos.

**Conclusión de identidad:** la dirección visual es suficientemente concreta para orientar el producto, pero no debe declararse como modelo 3D final ni como autorización de producción audiovisual completa. La fase correcta es revisión humana del foundation y luego preproducción 3D controlada.

## 3. Lukita Live: contrato de captura y social

Se creó `shared/lukitaLiveCaptureContract.ts` con el contrato `LUKITA-LIVE-CAPTURE-01`. Este contrato separa permiso, cámara, interacción, captura, revisión y compartir. La publicación automática está prohibida.

| Etapa | Regla | Estado |
|---|---|---|
| Permiso | La cámara requiere consentimiento explícito. | **CONTRATADO**; la validación física todavía falta. |
| Cámara | Se contemplan `front` y `rear`. | **CONTRATADO**; el AR Stage usa la cámara administrada por WebXR cuando corresponde. |
| Captura | Se contemplan foto y video. | Foto PNG implementada; video implementado mediante `MediaRecorder`. |
| Revisión | El usuario debe revisar antes de compartir. | **CONTRATADO**; UI social completa aún pendiente. |
| Compartir | No existe publicación automática desde el visor. | **CONTRATADO**. |
| Datos sensibles | Sin reconocimiento de identidad y sin acceso a verdad del juego. | **CONTRATADO Y PROBADO** en el contrato. |

### MP4: resultado real, no promesa universal

La función visible se presenta como **Grabar MP4**. El código intenta, en orden, `video/mp4` con codec H.264, y después WebM. Si el navegador no expone un codificador MP4, informa claramente que se descargará WebM. El nombre de archivo y el MIME se coordinan con el formato efectivamente soportado.

Por tanto, el resultado correcto de auditoría es **IMPLEMENTADO CON FALLBACK**, no “MP4 garantizado en todos los navegadores”. Safari puede exponer MP4 en determinadas condiciones; Chromium puede no exponerlo y producir WebM. La conversión universal a MP4 requeriría una estrategia adicional, por ejemplo un servicio o encoder WASM aprobado, con impacto en tamaño, memoria, rendimiento, privacidad y complejidad de despliegue.

## 4. Lukita AR Stage: estado funcional

**Ruta:** `/lukita-ar-stage`  
**Archivo principal:** `client/src/pages/LukitaARStagePage.tsx`  
**Propuesta técnica:** `docs/LUKITA_AR_STAGE_PROPOSAL.md`

| Capacidad | Estado | Evidencia técnica |
|---|---|---|
| Bienvenida y tutorial de 30 segundos | **IMPLEMENTADO** | Modal de cuatro pasos, reabrible desde Tutorial/Ayuda. |
| WebXR cuando el navegador lo permite | **IMPLEMENTADO CON FALLBACK** | `ARButton` y modo 3D fallback. |
| GLB candidato por defecto | **IMPLEMENTADO** | Asset de blockout externo marcado como candidato. |
| Carga de GLB por URL | **IMPLEMENTADO** | Panel de URL externa con mensaje de error. |
| Selección de ubicación | **IMPLEMENTADO** | Centro, izquierda, derecha y elevado. |
| Selección de elemento | **IMPLEMENTADO** | Cuerpo completo, rostro y accesorio como modos de revisión. |
| Rotación, desplazamiento y escala multitáctil | **IMPLEMENTADO** | Pointer events y pellizco con dos contactos. |
| Restablecimiento de transformación | **IMPLEMENTADO** | Botón de posición, rotación y escala originales. |
| Aparición suave y partículas | **IMPLEMENTADO** | Animación de aparición y burst de partículas. |
| Sombras dinámicas | **IMPLEMENTADO** | DirectionalLight, shadow map y materiales con cast/receive shadow. |
| Caja delimitadora | **IMPLEMENTADO** | `THREE.BoxHelper`, visible y ocultable. |
| Captura PNG | **IMPLEMENTADO** | `canvas.toBlob` y descarga local. |
| Video | **IMPLEMENTADO CON DEPENDENCIA DE NAVEGADOR** | MP4 si está soportado; WebM fallback. |
| Monitor de FPS | **IMPLEMENTADO** | Muestreo aproximado cada 500 ms. |
| Monitor de memoria | **IMPLEMENTADO COMO MÉTRICA CONDICIONAL** | Usa `performance.memory` cuando el navegador la expone. |
| Color ambiental | **IMPLEMENTADO** | Selector de color aplicado a la luz principal. |
| Presets de iluminación | **IMPLEMENTADO LOCALMENTE** | Nombre, intensidad y color en `localStorage`. |
| Control de volumen/mute | **IMPLEMENTADO COMO PRESENTACIÓN** | No representa audio productivo ni cambia el CORE. |
| Lukita Star Trail | **IMPLEMENTADO** | Color de estela y contactos visuales en la escena. |
| Character Foundation aprobado dentro del visor | **NO DECLARADO** | Se muestra como referencia; la aprobación sigue siendo humana. |

### Monitorización de rendimiento

El visor muestra FPS calculados a partir de cuadros renderizados durante ventanas de 500 milisegundos. Es una señal de experiencia, no un benchmark de laboratorio. La memoria se muestra únicamente cuando `performance.memory` está disponible; de lo contrario aparece “memoria no expuesta”. No debe interpretarse como consumo total de GPU, memoria de texturas, memoria de cámara o temperatura del dispositivo.

Para certificación se necesitarán mediciones externas en Safari iOS, Android Chrome y dispositivos de pantalla grande. Deben registrarse primera aparición, FPS sostenidos, tiempo en segundo plano, memoria antes/después, recuperación, temperatura y comportamiento con GLB pesado.

## 5. Separación constitucional y aislamiento

Se creó `shared/lukitaLiveBoundaries.ts`. La función central declara que Experience QR y Control QR tienen nombres, propósitos y payloads distintos; Controller Lab tiene estado `BACKSTAGE_ONLY`; y Lukita tiene autoridad `PRESENTATION_ONLY`.

Las pruebas existentes de `shared/mjpCoreIsolation.test.ts` verifican que:

1. Los dominios protegidos son `MJP_CORE`, `RNG`, `RTP`, `WALLET`, `LEDGER`, `SETTLEMENT`, `RULES` y `MjpTvManifest`.
2. Cada agente registrado no puede mutar el núcleo.
3. Los metadatos hostiles no pueden convertir un agente en mutador del núcleo.
4. La proyección del manifest no modifica el contenido autoritativo.
5. Commercial OS y Character OS no tienen autoridad sobre MJP CORE.
6. La ausencia de `nextEvent` se expresa como `NO DATA`, no como una afirmación inventada.

Esto respalda el principio: **MJP CORE → estado autorizado → manifest/proyección → Lukita → presentación**. No debe existir el camino inverso.

## 6. Controller Lab como backstage

La implementación heredada de Controller Lab está documentada y probada como experiencia de control de presentación. Las capacidades descritas incluyen Game Pad horizontal, Track Pad sensible, Teclado, puntero estrella, estela, volumen, mute, perfiles, QR de vinculación, latencia, reconexión y controles de orientación.

La posición arquitectónica correcta es que Controller Lab no debe convertirse en una segunda superficie de juego ni en un editor de MJP CORE. El nuevo contrato lo limita a navegación, volumen, escena, cursor y modo de presentación. Su QR no debe ser reutilizado como Experience QR: el primero vincula un backstage operativo; el segundo abre una experiencia pública de Lukita Live.

## 7. LukitaPoint y escalabilidad espacial

El documento base propone convertir `LukitaPoint` en una entidad de primera clase y no en una coordenada escondida dentro de una experiencia [2]. La idea es sólida para una evolución posterior: un mismo motor puede servir puntos en UPAO, Huanchaco, plazas, hoteles, restaurantes, malls o eventos.

El modelo conceptual debe incluir identidad, ubicación, orientación, anclaje espacial, escala, radios de activación/interacción, perfil de visibilidad, experiencias, assets, audio, QR, contexto del lugar, horarios, eventos, negocios cercanos y analytics agregados. La imagen de arquitectura objetivo es:

`MiLukita → Place System → Place / LukitaPoint → Location + AR + Content → Experience → Lukita/Mascot/Audio → Camera → Photo/Video → Share`

**Decisión de alcance:** en esta iteración se documentó el contrato de identidad y captura, pero no se creó aún una tabla persistente de LukitaPoints ni un administrador de publicación. Eso es correcto: primero se debe aprobar Character Foundation y contrato Live; luego diseñar schema, procedimientos, permisos y auditoría de LukitaPoint.

## 8. Métricas reales de repositorio y validación

Las métricas siguientes provienen del estado del repositorio y de la ejecución final registrada en `/tmp/lukita-live-final-validation.log` durante esta sesión.

| Métrica | Resultado |
|---|---:|
| Archivos bajo `client/src`, `server`, `shared` y `docs` inventariados | 602 |
| Archivos en `client/src/pages` | 27 |
| Archivos de prueba `server` | 38 |
| Archivos de prueba `shared` | 60 |
| Test files Vitest aprobados en ejecución final | 102 |
| Test files omitidos en ejecución final | 1 |
| Tests aprobados en ejecución final | 359 |
| Tests omitidos en ejecución final | 4 |
| Duración reportada de Vitest | 52,33 s |
| Build Vite/esbuild | PASS |
| Tiempo de build reportado | 6,02 s para el bundle frontend principal |
| Errores TypeScript finales | 0 |
| Chunks mayores de 500 kB | Advertencia informativa, principalmente vendor Three.js |

La suite completa también contiene pruebas de seguridad, MJP CORE, QR, TV, Controller Lab, juegos, auditoría, agentes, perfiles, accesibilidad y simulación. El número de pruebas aprobadas demuestra regresión automatizada, pero no certifica hardware físico, escaneo real, cámara real, grabación MP4 real ni rendimiento de GPU.

## 9. Inventario de archivos relevantes

| Ruta | Responsabilidad |
|---|---|
| `client/src/pages/LukitaARStagePage.tsx` | Visor WebXR/3D, GLB, gestos, captura, video, performance overlay, caja y presets. |
| `client/src/pages/TouchRemotePage.tsx` | Controller Lab y sus cuatro superficies de control. |
| `client/src/pages/BroadcastPage.tsx` | Interfaz de TV y presentación. |
| `client/src/pages/OnlineTvGamesPage.tsx` | Experiencia de TV en línea. |
| `client/src/App.tsx` | Registro de `/lukita-ar-stage`, `/touch-remote`, `/tv` y rutas relacionadas. |
| `shared/lukitaCharacterFoundation.ts` | Contrato de identidad y límites de Character Foundation. |
| `shared/lukitaCharacterFoundation.test.ts` | Pruebas de identidad, loop Live y aislamiento. |
| `shared/lukitaLiveBoundaries.ts` | Separación Experience QR, Control QR, Controller Lab y Lukita. |
| `shared/lukitaLiveBoundaries.test.ts` | Pruebas de separación constitucional. |
| `shared/lukitaLiveCaptureContract.ts` | Contrato de cámara, captura, revisión y compartir. |
| `shared/lukitaLiveCaptureContract.test.ts` | Pruebas del flujo frontal/trasera y foto/video. |
| `shared/lukitaArStageContract.test.ts` | Regresión de captura, MP4/WebM, caja, rendimiento y concepto. |
| `shared/mjpCoreIsolation.test.ts` | Pruebas P0 del aislamiento de MJP CORE. |
| `shared/agentRegistry.ts` | Registro de agentes, prioridades, modos y autoridades. |
| `docs/LUKITA_AR_STAGE_PROPOSAL.md` | Propuesta técnica y límites del AR Stage. |
| `docs/LUKITA_MASTER_CHARACTER_GUIDE.md` | Ficha maestra de identidad visual. |
| `docs/MILUKITA_CONTROLLER_LAB_MANUAL.md` | Manual del Controller Lab. |
| `docs/MILUKITA_ENTERTAINMENT_OS.md` | Documentación del Entertainment OS. |
| `docs/MILUKITA_MASTER_CONSTITUTION.md` | Constitución y límites globales. |
| `todo.md` | Historial verificable de tareas y estados. |

## 10. Estado de agentes y madurez declarada

El registro actual contiene 15 agentes. La tabla siguiente no inventa porcentajes: el archivo de registro deja `declaredMaturity` y `observedMetrics` sin datos numéricos productivos (`null`) para evitar confundir una implementación contractual con operación real.

| Agente | Dominio | Prioridad | Estado de evidencia | Modo | Madurez numérica | Limitación principal |
|---|---|---|---|---|---:|---|
| Audience Intelligence | AUDIENCE | P3 | PARTIAL | PROPOSE_ONLY | No disponible | Sin telemetría productiva persistente. |
| Marketing | MARKETING | P5 | PARTIAL | PROPOSE_ONLY | No disponible | Sin campañas externas ni atribución conectada. |
| Social | SOCIAL | P5 | PREPARED | PROJECTION_ONLY | No disponible | Canales externos sin conexión. |
| Content | CONTENT | P2 | PREPARED | PROPOSE_ONLY | No disponible | Sin pipeline productivo persistente. |
| Lukita | CHARACTER | P2 | IMPLEMENTED | PROPOSE_ONLY | No disponible | Foundation y blockout requieren revisión humana. |
| Sales | SALES | P4 | PARTIAL | PROPOSE_ONLY | No disponible | CRM conceptual; sin leads productivos. |
| Revenue | REVENUE | P4 | PREPARED | PROPOSE_ONLY | No disponible | Dinero real, cobros y retiros desactivados. |
| Financial Intelligence | FINANCE | P4 | IMPLEMENTED | PROPOSE_ONLY | No disponible | No decide sin datos y revisión profesional. |
| Experience Director | EXPERIENCE | P2 | IMPLEMENTED | PROPOSE_ONLY | No disponible | Scores no representan usuarios reales. |
| Auditor | GOVERNANCE | P0 | IMPLEMENTED | READ_ONLY | No disponible | Falta certificación independiente externa. |
| Watchdog | GOVERNANCE | P1 | IMPLEMENTED | ALERT_ONLY | No disponible | Staging persistente y multiinstancia pausados. |
| Recovery | GOVERNANCE | P1 | IMPLEMENTED | PROPOSE_ONLY | No disponible | Validación local/simulada pendiente de staging. |
| Supervisor | GOVERNANCE | P0 | PARTIAL | PROPOSE_ONLY | No disponible | Sin coordinación autónoma productiva. |
| Business Strategy | GOVERNANCE | P4 | IMPLEMENTED | PROPOSE_ONLY | No disponible | No aprueba presupuesto, contratos o distribución. |
| Distribution | DISTRIBUTION | P5 | PARTIAL | PROJECTION_ONLY | No disponible | Sin proveedores FAST, OTT, IPTV, CDN, DRM o playout. |

**Hallazgo clave:** los porcentajes de madurez mencionados en órdenes anteriores no deben presentarse como métricas observadas mientras el registro actual mantenga `null`. El estado honesto es contractual/simulado, no productivo.

## 11. Quality gates y pruebas pendientes

| Gate | Estado | Evidencia requerida para pasar a producción |
|---|---|---|
| TypeScript | **PASS** | Mantenerlo en CI. |
| Regresión Vitest | **PASS: 359 tests; 4 omitidos** | Explicar y resolver los omitidos cuando dependan de entorno. |
| Build | **PASS** | Revisar code splitting de Three.js antes de optimización final. |
| Character Foundation | **PENDIENTE HUMANO** | Confirmación visual y de derechos del owner. |
| GLB final | **PENDIENTE** | Asset aprobado, LODs, texturas, Draco/Meshopt y licencia. |
| MP4 universal | **PARCIAL** | Compatibilidad física por navegador o encoder aprobado. |
| Memoria AR | **PARCIAL** | Instrumentación de laboratorio y pruebas por dispositivo. |
| WebXR | **PROTOTIPO FUNCIONAL** | Safari iOS, Android Chrome y pantalla grande. |
| Cámara frontal/trasera | **CONTRATO PREPARADO** | Flujo real con permiso, cambio de cámara, pausa y recuperación. |
| Social/share | **CONTRATO PREPARADO** | Revisión humana, descarga y compartir explícito. |
| Experience QR | **SEPARADO A NIVEL DE CONTRATO** | Prueba real QR → experiencia pública. |
| Control QR | **IMPLEMENTADO EN CONTROLLER LAB** | Prueba de vinculación TV → celular bajo sesiones reales. |
| MJP CORE isolation | **PROBADO EN SANDBOX** | Repetir con threat model, staging y control de cambios. |
| Hardware físico | **NO VALIDADO** | QA formal en iOS, Android, Android/Google TV, Tizen y webOS. |

## 12. Riesgos priorizados

### P0 — Confusión de autoridad

El riesgo más grave sería que el protagonismo narrativo de Lukita o la conveniencia del Controller Lab se conviertan en un camino de escritura hacia MJP CORE. La mitigación existente es buena: boundaries explícitos, registry de agentes, `canAgentMutateCore` siempre falso, proyección inmutable del manifest y pruebas específicas. La mitigación restante es operacional: revisión de cambios, pruebas negativas, permisos de producción y observabilidad de intentos bloqueados.

### P0 — Identidad visual insuficiente

Un sistema AR impecable con un personaje mediocre no cumple el propósito. La imagen entregada es una buena dirección conceptual, pero el conflicto de paleta y vestuario con la ficha maestra debe resolverse antes de congelar el modelo 3D. La aprobación debe probar silueta, rostro, adultez, legibilidad móvil, reconocimiento sin texto y consistencia entre vistas.

### P1 — MP4 no portable

La API nativa no garantiza MP4 en todos los navegadores. El fallback WebM evita una experiencia rota, pero no satisface por sí solo la promesa de universalidad. Debe decidirse entre aceptar WebM como formato web principal, añadir un encoder WASM controlado o usar un servicio de conversión con requisitos de privacidad y coste.

### P1 — Métrica de memoria incompleta

`performance.memory` no es una API universal y no mide toda la memoria gráfica. La UI lo declara como aproximado y permite “memoria no expuesta”. Para una certificación se requiere perfilado específico por plataforma, no un número único del navegador.

### P1 — Dependencia de hardware físico

WebXR, cámara, permisos, sensores, MediaRecorder, reproducción de audio y rendimiento Three.js presentan variaciones entre plataformas. Ninguna prueba de sandbox sustituye la ejecución en hardware real.

### P2 — Crecimiento espacial sin LukitaPoint persistente

La red de puntos es estratégica, pero crearla prematuramente antes de cerrar el foundation y contratos de publicación aumentaría deuda. La secuencia recomendada es foundation → contract tests → schema LukitaPoint → manager → importación masiva → publicación con aprobación.

## 13. Qué se puede ejecutar sin intervención humana

Se puede seguir avanzando autónomamente en tareas de bajo riesgo y sin aprobación de identidad o producción: ampliar contratos de solo lectura, agregar pruebas negativas, documentar schemas, preparar fixtures no productivos, analizar bundle size, medir render fallback en sandbox, mejorar mensajes de compatibilidad MP4/WebM, generar reportes de accesibilidad y construir prototipos de cámara que no publiquen ni persistan datos sensibles.

No debe ejecutarse autónomamente: aprobar la identidad final de Lukita, decidir la paleta que prevalece entre ficha e imagen, producir voz definitiva, publicar un GLB como asset maestro, conectar proveedores sociales, activar dinero real, alterar MJP CORE, realizar publicaciones sociales, certificar hardware físico o declarar operación productiva 24/7.

## 14. Declaración de cumplimiento de la orden actual

| Solicitud | Declaración |
|---|---|
| Ejecutar la nueva dirección Lukita Live | **EJECUTADO EN ALCANCE AUTÓNOMO SEGURO**: contratos, foundation, captura social y límites preparados. |
| No saltar Character Foundation | **CUMPLIDO**: el foundation queda explícito y la identidad permanece marcada para revisión humana. |
| Mantener Experience QR ≠ Control QR | **CUMPLIDO COMO CONTRATO Y PRUEBA**. |
| Mantener Controller Lab como backstage | **CUMPLIDO COMO CONTRATO Y LÍMITE**. |
| Mantener Lukita como protagonista | **CUMPLIDO COMO FOUNDATION CONTRACT Y FLUJO LIVE**. |
| Exportación MP4 | **IMPLEMENTADA CON FALLBACK WEBM**; no se declara universal hasta QA físico. |
| Monitor FPS/memoria | **IMPLEMENTADO**; memoria condicional y FPS aproximado. |
| Color personalizado de iluminación | **IMPLEMENTADO Y PERSISTIBLE EN PRESETS LOCALES**. |
| Documento único de auditoría | **PREPARADO** en esta ruta. |

## 15. Veredicto final

MiLukita tiene una base técnica amplia y una separación constitucional más madura que un simple prototipo de avatar. El producto está preparado para evolucionar hacia **Lukita Live**, pero todavía no debe declararse una operación productiva autónoma ni una integración WebAR certificada. La madurez real está distribuida: el contrato y la arquitectura están adelantados; la identidad visual está definida y congelada para revisión; el AR Stage es funcional como prototipo; la captura y el rendimiento tienen instrumentación inicial; y el hardware, MP4 universal, social productivo y asset 3D final siguen pendientes.

La prioridad recomendada es cerrar tres decisiones en este orden: primero, aprobación o corrección formal del Character Foundation usando la imagen entregada como referencia; segundo, selección y validación del GLB final; tercero, piloto controlado de cámara → captura → revisión → compartir en dispositivos reales. Solo después conviene crear el administrador persistente de LukitaPoints y ampliar la red espacial.

> **Declaración:** En esta sesión se ejecutó todo lo realizable sin intervención humana sobre el perímetro de presentación. No se realizó ninguna acción sobre MJP CORE, no se aprobó automáticamente la identidad de Lukita, no se publicaron contenidos sociales y no se falsearon métricas productivas.

## Referencias internas

[1]: [Ficha maestra de diseño de Lukita](./LUKITA_MASTER_CHARACTER_GUIDE.md)  
[2]: Documento base de arquitectura LukitaPoint suministrado por el propietario: `pasted_content_2.txt` (fuente de trabajo externa al repositorio).  
[3]: [Propuesta técnica Lukita AR Stage](./LUKITA_AR_STAGE_PROPOSAL.md)  
[4]: [Manual de MiLukita Controller Lab](./MILUKITA_CONTROLLER_LAB_MANUAL.md)  
[5]: [Prueba P0 de aislamiento MJP CORE](../shared/mjpCoreIsolation.test.ts)  
[6]: [Contrato de Character Foundation](../shared/lukitaCharacterFoundation.ts)  
[7]: [Contrato de límites Lukita Live](../shared/lukitaLiveBoundaries.ts)  
[8]: [Contrato de captura Lukita Live](../shared/lukitaLiveCaptureContract.ts)  
[9]: [Registro de agentes](../shared/agentRegistry.ts)
