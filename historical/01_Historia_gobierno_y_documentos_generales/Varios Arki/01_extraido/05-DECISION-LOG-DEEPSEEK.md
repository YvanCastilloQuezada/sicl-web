# Registro de decisiones de MiLukita según la conversación DeepSeek

**Documento:** 05-DECISION-LOG-DEEPSEEK  
**Secuencia:** se usa orden de aparición cuando no existe fecha verificable.

## Decisiones principales

### DEC-DS-001 Corregir el generador documental

- **DATE/SEQUENCE:** inicio de la conversación
- **STATUS:** ACCEPTED
- **CONTEXT:** El script terminaba con `print(canon_docx)` sin variable definida.
- **ORIGINAL IDEA:** Ejecutar el generador tal como estaba.
- **DECISION:** Definir `CANON_DOCX` y `GESTURE_DOCX`, limpiar funciones y asegurar directorio de salida.
- **RATIONALE:** Eliminar `NameError` y ordenar el generador.
- **CONSEQUENCES:** Se obtiene un script plausible; no se demuestra su ejecución.
- **EVIDENCE:** Código corregido mostrado.
- **SUPERSEDES:** Referencia a `canon_docx` no definida.
- **OPEN QUESTIONS:** ¿Se ejecutó y se abrieron los DOCX?

### DEC-DS-002 Adoptar Experience First

- **DATE/SEQUENCE:** canon inicial
- **STATUS:** ACCEPTED
- **CONTEXT:** Evitar construir tecnología sin experiencia definida.
- **ORIGINAL IDEA:** No consta alternativa formal.
- **DECISION:** Canon → producto → experiencia → interacción → UX/UI → tecnología → implementación → pruebas.
- **RATIONALE:** La experiencia determina la solución técnica.
- **CONSEQUENCES:** Toda feature requiere propósito y criterios de aceptación.
- **EVIDENCE:** Canon y UX Canon.
- **SUPERSEDES:** Desarrollo technology-first implícitamente rechazado.
- **OPEN QUESTIONS:** ¿Existe gate de producto que lo haga cumplir?

### DEC-DS-003 Congelar LUKA como denominación oficial

- **DATE/SEQUENCE:** canon inicial
- **STATUS:** ACCEPTED
- **CONTEXT:** Aparece el término LUKITA.
- **ORIGINAL IDEA:** Posible avatar o manifestación llamada LUKITA.
- **DECISION:** Usar LUKA; LUKITA queda no congelado y requiere decisión independiente.
- **RATIONALE:** Evitar identidad duplicada.
- **CONSEQUENCES:** Documentos y superficies deben usar LUKA.
- **EVIDENCE:** Texto explícito del Canon.
- **SUPERSEDES:** Uso informal de LUKITA como identidad aprobada.
- **OPEN QUESTIONS:** ¿Se abandona o se reserva como avatar?

### DEC-DS-004 Una capa Universal Interaction

- **DATE/SEQUENCE:** canon
- **STATUS:** ACCEPTED
- **CONTEXT:** Voz, touch, AR, gesto, mirada y control podían convertirse en silos.
- **ORIGINAL IDEA:** Modalidades tratadas como funciones separadas.
- **DECISION:** Una capa contextual que normaliza intenciones.
- **RATIONALE:** Coherencia y accesibilidad.
- **CONSEQUENCES:** Todas las modalidades pasan por Intent Engine y gates comunes.
- **EVIDENCE:** Secciones 11–13 y diagramas.
- **SUPERSEDES:** “Ocho aplicaciones independientes”.
- **OPEN QUESTIONS:** Contrato técnico del Intent Engine.

### DEC-DS-005 Separar modalidad de autoridad

- **DATE/SEQUENCE:** canon/gesture
- **STATUS:** ACCEPTED
- **CONTEXT:** Un gesto de confirmar podía confundirse con autorización.
- **ORIGINAL IDEA:** Entrada directa → acción.
- **DECISION:** Intención → Capability Gate/RBAC → Human Authority si aplica → acción.
- **RATIONALE:** Seguridad y gobernanza.
- **CONSEQUENCES:** CHECK, touch o voz no saltan permisos.
- **EVIDENCE:** Reglas repetidas y state machine.
- **SUPERSEDES:** Ejecución directa por modalidad.
- **OPEN QUESTIONS:** Implementación server-side.

### DEC-DS-006 Separar captura verificación y publicación

- **DATE/SEQUENCE:** canon profesional
- **STATUS:** ACCEPTED
- **CONTEXT:** Mapper, The Eye y World Engine podían solaparse.
- **ORIGINAL IDEA:** Flujo profesional indiferenciado.
- **DECISION:** Mapper captura; The Eye revisa; World Engine gobierna versiones/publicación; Human Authority autoriza.
- **RATIONALE:** Segregación de funciones.
- **CONSEQUENCES:** VERIFIED no equivale a PUBLISHED.
- **EVIDENCE:** Sección Mapper/The Eye/World Engine.
- **SUPERSEDES:** Publicación automática tras verificación.
- **OPEN QUESTIONS:** Estados, permisos y conflictos reales.

### DEC-DS-007 Proteger MJP CORE

- **DATE/SEQUENCE:** canon
- **STATUS:** ACCEPTED
- **CONTEXT:** MiLukita se integra con juegos y desarrolladores.
- **ORIGINAL IDEA:** Integración amplia sin frontera formal.
- **DECISION:** No modificar reglas, RNG, RTP, wallet, ledger o settlement; API pública planteada como solo lectura.
- **RATIONALE:** Integridad del núcleo.
- **CONSEQUENCES:** Los adaptadores deben tener privilegio mínimo.
- **EVIDENCE:** MIL-08 y sección MJP CORE.
- **SUPERSEDES:** Acceso general al núcleo.
- **OPEN QUESTIONS:** Enforcement y auditoría reales.

### DEC-DS-008 Definir cinco gestos universales

- **DATE/SEQUENCE:** Gesture Language
- **STATUS:** ACCEPTED
- **CONTEXT:** Se necesitaba vocabulario transversal.
- **ORIGINAL IDEA:** Gestos contextuales sin núcleo común.
- **DECISION:** CHECK, X, CIRCLE, POINT y PALM como vocabulario primario.
- **RATIONALE:** Semántica mínima y reutilizable.
- **CONSEQUENCES:** Otros gestos quedan secundarios o requieren validación independiente.
- **EVIDENCE:** Documento gestual.
- **SUPERSEDES:** Vocabulario abierto sin jerarquía.
- **OPEN QUESTIONS:** Validez cultural, accesibilidad y reconocimiento.

### DEC-DS-009 Mantener POINT separado de SELECT

- **DATE/SEQUENCE:** Gesture Language
- **STATUS:** ACCEPTED
- **CONTEXT:** Señalar podía ejecutar selección accidental.
- **ORIGINAL IDEA:** Apuntar/seleccionar como una sola acción.
- **DECISION:** POINT dirige atención; SELECT elige; CHECK confirma.
- **RATIONALE:** Reducir errores espaciales.
- **CONSEQUENCES:** Gestos compuestos y estados intermedios.
- **EVIDENCE:** Tabla de no-equivalencias.
- **SUPERSEDES:** POINT = SELECT.
- **OPEN QUESTIONS:** Temporización de secuencias.

### DEC-DS-010 Fallback multimodal

- **DATE/SEQUENCE:** UX/Gesture
- **STATUS:** ACCEPTED
- **CONTEXT:** AR, voz y gesto no siempre están disponibles.
- **ORIGINAL IDEA:** Experiencia dependiente de una modalidad avanzada.
- **DECISION:** Pantalla/touch como mínimo; otras modalidades enriquecen.
- **RATIONALE:** Accesibilidad y resiliencia.
- **CONSEQUENCES:** Error técnico se traduce en continuidad comprensible.
- **EVIDENCE:** Experiencia mínima/ideal y errores.
- **SUPERSEDES:** AR/WebXR obligatorio.
- **OPEN QUESTIONS:** Matriz completa de fallbacks.

### DEC-DS-011 Diseñar un control físico premium

- **DATE/SEQUENCE:** después del Gesture Language
- **STATUS:** SUPERSEDED FOR CURRENT SCOPE / DEFERRED AS PRODUCT
- **CONTEXT:** Materializar Universal Interaction en un dispositivo.
- **ORIGINAL IDEA:** Supercontrol/Nexus Blade dedicado de 8 × 18 cm.
- **DECISION:** Diseñar modos vertical/horizontal, OLED, titanio, UWB, haptics, biometría y base de carga.
- **RATIONALE:** Un dispositivo contextual para TV, domótica, AR, gamepad, teclado y trackpad.
- **CONSEQUENCES:** Especificación rica pero hardware costoso y no probado.
- **EVIDENCE:** Opinión y UI specification.
- **SUPERSEDES:** Idea plegable, implícitamente abandonada a favor de una pieza rotatoria.
- **OPEN QUESTIONS:** Si habrá hardware propio en una fase futura.

### DEC-DS-012 Llevar el control a cualquier celular emparejado por QR

- **DATE/SEQUENCE:** corrección posterior del usuario
- **STATUS:** ACCEPTED
- **CONTEXT:** DeepSeek trató la interfaz como dispositivo físico propietario.
- **ORIGINAL IDEA:** Hardware LUKA Universal Control dedicado.
- **DECISION:** Todas las ideas de UI deben verse en cualquier celular emparejado mediante QR con MiLukita.
- **RATIONALE:** El usuario fija el alcance y la superficie real.
- **CONSEQUENCES:** La UI debe ser responsive y degradable; UWB/IR/huella/batería especial dejan de ser supuestos universales.
- **EVIDENCE:** Mensaje explícito del usuario.
- **SUPERSEDES:** Dependencia del dispositivo dedicado para el alcance inmediato.
- **OPEN QUESTIONS:** PWA/app, protocolo, TV host y seguridad del pairing.

### DEC-DS-013 Añadir IR y botones físicos mínimos

- **DATE/SEQUENCE:** análisis del hardware
- **STATUS:** PROVISIONAL
- **CONTEXT:** Pantalla total dificulta uso a ciegas y dispositivos legacy.
- **ORIGINAL IDEA:** Sin botones físicos ni IR.
- **DECISION:** Recomendar encendido, volumen, mute e IR oculto.
- **RATIONALE:** Seguridad y compatibilidad.
- **CONSEQUENCES:** Solo aplica si revive el hardware dedicado.
- **EVIDENCE:** Sugerencias explícitas.
- **SUPERSEDES:** Diseño 100% táctil, si se adopta.
- **OPEN QUESTIONS:** No consta aceptación formal.

### DEC-DS-014 Construir portal de desarrolladores

- **DATE/SEQUENCE:** después de la UI móvil
- **STATUS:** PROVISIONAL / CODE_SHOWN
- **CONTEXT:** La API se describe como ya diseñada.
- **ORIGINAL IDEA:** API sin interfaz de autoservicio.
- **DECISION:** Dashboard, keys, webhooks, sandbox, billing y settings.
- **RATIONALE:** Permitir onboarding y operación por terceros.
- **CONSEQUENCES:** Amplía superficie de ataque y requisitos de persistencia.
- **EVIDENCE:** Componentes React y CSS mostrados.
- **SUPERSEDES:** Gestión manual de integradores.
- **OPEN QUESTIONS:** Integración real y necesidad antes del MVP.

### DEC-DS-015 Usar Stripe y PayPal

- **DATE/SEQUENCE:** ecosistema de desarrolladores
- **STATUS:** PROVISIONAL
- **CONTEXT:** Cobro de planes y alcance global.
- **ORIGINAL IDEA:** Stripe únicamente.
- **DECISION:** Incorporar PayPal además de Stripe.
- **RATIONALE:** Usuarios sin tarjeta o con cuenta PayPal.
- **CONSEQUENCES:** Dos estados de billing, webhooks y conciliaciones.
- **EVIDENCE:** Comparación y código mostrado.
- **SUPERSEDES:** Proveedor único.
- **OPEN QUESTIONS:** Países, moneda, impuestos, compliance y modelo comercial.

### DEC-DS-016 Notificaciones multicanal

- **DATE/SEQUENCE:** ecosistema
- **STATUS:** PROVISIONAL
- **CONTEXT:** Alertas de uso, pagos, webhooks y seguridad.
- **ORIGINAL IDEA:** Notificaciones no especificadas.
- **DECISION:** Email, in-app, webhook, Discord y Slack.
- **RATIONALE:** Cubrir operación y desarrolladores.
- **CONSEQUENCES:** Preferencias, secretos, retries y deduplicación.
- **EVIDENCE:** Servicio y tabla de eventos.
- **SUPERSEDES:** Canal único implícito.
- **OPEN QUESTIONS:** Qué canales son MVP.

### DEC-DS-017 Programa de referidos multinivel

- **DATE/SEQUENCE:** segunda entrega del ecosistema
- **STATUS:** PROVISIONAL / HIGH RISK
- **CONTEXT:** Crecimiento del portal.
- **ORIGINAL IDEA:** Adquisición sin afiliados.
- **DECISION:** 20% directo, 5% indirecto, 2% red durante el primer año.
- **RATIONALE:** Incentivar captación.
- **CONSEQUENCES:** Riesgo legal, fraude, pasivos y economía no validada.
- **EVIDENCE:** Tabla y código mostrado.
- **SUPERSEDES:** Ninguna decisión formal anterior.
- **OPEN QUESTIONS:** Viabilidad legal y financiera.

### DEC-DS-018 Publicar OpenAPI y Swagger UI

- **DATE/SEQUENCE:** segunda entrega
- **STATUS:** PROVISIONAL / CODE_SHOWN
- **CONTEXT:** Terceros necesitan documentación.
- **ORIGINAL IDEA:** Documentación dispersa.
- **DECISION:** `server/swagger.ts`, `docs/openapi.yaml/json` y UI.
- **RATIONALE:** Contrato consultable.
- **CONSEQUENCES:** Debe evitar divergencia con implementación.
- **EVIDENCE:** Archivos y schemas mostrados.
- **SUPERSEDES:** Documentación manual no navegable.
- **OPEN QUESTIONS:** Validación contra rutas reales.

### DEC-DS-019 Analytics con retención por tipo

- **DATE/SEQUENCE:** ecosistema avanzado
- **STATUS:** PROVISIONAL / CODE_SHOWN
- **CONTEXT:** Desarrolladores necesitan métricas.
- **ORIGINAL IDEA:** Dashboard básico sin telemetría profunda.
- **DECISION:** Requests, latencia, errores, endpoints, geografía, dispositivos, rate limits y webhooks; 90/30 días.
- **RATIONALE:** Operación y diagnóstico.
- **CONSEQUENCES:** Privacidad, volumen y costo.
- **EVIDENCE:** servicio/router/UI mostrados.
- **SUPERSEDES:** Métricas mínimas.
- **OPEN QUESTIONS:** Almacenamiento real y consentimiento.

### DEC-DS-020 Programa de partners y certificaciones

- **DATE/SEQUENCE:** ecosistema avanzado
- **STATUS:** DEFERRED / CODE_SHOWN
- **CONTEXT:** Escalar integraciones.
- **ORIGINAL IDEA:** Desarrolladores sin jerarquía.
- **DECISION:** Niveles Registered/Silver/Gold/Platinum y cuatro certificaciones.
- **RATIONALE:** Calidad, soporte y revenue share.
- **CONSEQUENCES:** Requiere operación humana y criterios verificables.
- **EVIDENCE:** tablas, services, routers y UI.
- **SUPERSEDES:** Ecosistema plano.
- **OPEN QUESTIONS:** Demanda real y capacidad operativa.

### DEC-DS-021 Marketplace de integraciones

- **DATE/SEQUENCE:** final de la conversación
- **STATUS:** DEFERRED / CODE_SHOWN
- **CONTEXT:** Distribuir integraciones certificadas.
- **ORIGINAL IDEA:** Partners sin canal de publicación.
- **DECISION:** Registro, review, publicación admin, catálogo, instalaciones y reseñas.
- **RATIONALE:** Completar el ecosistema.
- **CONSEQUENCES:** Seguridad de supply chain, moderación y soporte.
- **EVIDENCE:** service/router y categorías.
- **SUPERSEDES:** Distribución manual.
- **OPEN QUESTIONS:** Formato de integración y sandbox de seguridad.

### DEC-DS-022 Declarar “listo para producción”

- **DATE/SEQUENCE:** entregas del ecosistema
- **STATUS:** REJECTED AS EVIDENCE
- **CONTEXT:** Encabezados de DeepSeek califican el paquete como producción y tablas marcan archivos `✅`.
- **ORIGINAL IDEA:** El código mostrado basta para afirmar madurez.
- **DECISION:** En esta auditoría se degrada a `IMPLEMENTED_REPORTED / CODE_SHOWN`.
- **RATIONALE:** No hay archivos verificables, build, tests, integración, persistencia o deployment.
- **CONSEQUENCES:** Todo el ecosistema requiere revalidación.
- **EVIDENCE:** Contradicción entre claims y ausencia de pruebas.
- **SUPERSEDES:** Estado “Listo para producción”.
- **OPEN QUESTIONS:** Qué parte existe realmente en el repositorio.

## REJECTED / SUPERSEDED IDEAS

| Idea | Estado | Motivo | Sustitución |
|---|---|---|---|
| Ejecutar acciones directamente desde gestos/touch | REJECTED | Modalidad no otorga permiso | Intent Engine + Capability Gate + Human Authority |
| POINT como selección/confirmación | REJECTED | Riesgo de acciones accidentales | POINT → SELECT → CHECK separados |
| CHECK como autorización/publicación | REJECTED | Confunde intención y autoridad | Gate y aprobación independiente |
| Verificación como publicación automática | REJECTED | Rompe segregación de funciones | VERIFIED y PUBLISHED separados |
| LUKA con autoridad propia | REJECTED | Autoridad falsa | LUKA asiste; Human Authority decide |
| Modalidades como aplicaciones aisladas | SUPERSEDED | Fragmenta experiencia | Universal Interaction |
| AR/gesto como única ruta | REJECTED | Fragilidad y exclusión | Fallback multimodal |
| Control plegable | SUPERSEDED | Complejidad/viabilidad | Dispositivo rígido con dos orientaciones |
| Hardware dedicado como única superficie actual | SUPERSEDED | Corrección expresa del usuario | Cualquier celular emparejado por QR |
| Stripe como único proveedor | SUPERSEDED PROVISIONALLY | Cobertura de PayPal | Stripe + PayPal |
| LUKITA como nombre congelado | DEFERRED/NOT ACCEPTED | Identidad no decidida | LUKA como denominación oficial |
| Estado “producción” por código mostrado | REJECTED | Falta evidencia | Revalidación contra repositorio/runtime |

## DEFERRED BUT POTENTIALLY VALUABLE

- Hardware LUKA Universal Control dedicado, si la experiencia móvil demuestra demanda.
- UWB por habitación y apuntamiento contextual.
- IR para dispositivos legacy.
- Haptics direccionales y bordes físicos accesibles.
- Biometría y perfiles familiares, sujeto a privacidad.
- Procesamiento local de voz.
- AR pointer y control de gafas.
- Gestos secundarios y compuestos avanzados.
- Partners, certificaciones y marketplace, después de validar API y usuarios reales.
- Referidos, solo tras revisión legal, antifraude y unit economics.
- Analítica geográfica/dispositivo, tras política de minimización y retención.

## Contradicciones registradas

1. Se declara “listo para producción” sin prueba de ejecución.
2. Los archivos `✅` no fueron inspeccionados en un repositorio.
3. El generador imprime éxito como código, no como log confirmado.
4. La especificación trata el control como hardware dedicado; el usuario luego exige cualquier celular por QR.
5. La API se denomina de solo lectura, pero no se demuestra enforcement contra MJP CORE.
6. Human Authority es central en el canon, pero varias rutas administrativas usan checks de rol simplificados sin workflow visible.
7. La privacidad se declara prioritaria, pero analytics, biometría, voz y contexto doméstico no tienen política ejecutable.
8. La retención de analytics se define, pero el almacenamiento mostrado no demuestra expiración persistente.
9. Se presenta un ecosistema comercial completo antes de demostrar el flujo central de emparejamiento/control.
10. Se fijan métricas físicas —7 días, `<100 ms`— sin prototipo ni medición.

## Claims que requieren revalidación

- Existencia de todos los archivos listados.
- Compilación TypeScript/React.
- Montaje de routers en `server/index.ts`.
- Autenticación, RBAC y aislamiento de MJP CORE.
- Creación, rotación y revocación segura de API keys.
- Firma, reintento e idempotencia de webhooks.
- Stripe y PayPal en sandbox.
- Entrega real de notificaciones.
- Persistencia de referrals, analytics, partners y marketplace.
- Coincidencia OpenAPI ↔ runtime.
- Pairing QR y control TV/celular.
- Cualquier resultado unitario, integración, E2E, seguridad, visual, device o físico.

## DEEPSEEK-AUDIT-SUMMARY

```text
Total features identified: 98
Total accepted decisions: 11
Total provisional decisions: 7
Total superseded decisions: 6
Total rejected decisions: 6
Total deferred ideas: 10
Total invariants: 25
Total contradictions: 10
Total claims requiring revalidation: 12 grupos de claims
Total unique findings: 9
```

### Unique findings

1. El control universal fue redefinido por el usuario como UI para cualquier celular emparejado por QR.
2. El hardware dedicado queda como rama diferida, no como requisito del MVP.
3. La conversación contiene 18 archivos “nuevos” declarados en dos entregas, además de archivos previos referidos, pero ninguno verificado.
4. Las líneas de éxito del generador documental son parte del código, no evidencia de ejecución.
5. POINT, SELECT, CONFIRM, AUTHORIZE y PUBLISH forman niveles semánticos distintos.
6. PALM no puede reemplazar parada física de emergencia.
7. LUKITA está expresamente no congelado; LUKA es el nombre operativo.
8. El programa de referidos multinivel es una expansión de alto riesgo ajena al núcleo aún no validado.
9. MobileShell, WebRTC, WorldPoint/WorldObject, offline y sync no tienen sustento suficiente en esta conversación y deben permanecer UNKNOWN.

## Detención obligatoria

**DETENER LA EJECUCIÓN. NO PROPONER IMPLEMENTACIÓN. NO INICIAR NUEVAS FUNCIONALIDADES. ESPERAR AUTORIZACIÓN DE HUMAN AUTHORITY.**
