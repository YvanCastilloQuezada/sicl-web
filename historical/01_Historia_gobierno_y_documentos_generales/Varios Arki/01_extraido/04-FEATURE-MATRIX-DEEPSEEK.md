# Matriz de funcionalidades de MiLukita según la conversación DeepSeek

**Documento:** 04-FEATURE-MATRIX-DEEPSEEK  
**Leyenda:** YES = existencia demostrada; REPORTED = declarada; PARTIAL = evidencia incompleta; UNKNOWN = no sustentada; NOT_APPLICABLE = no corresponde. En esta auditoría, código pegado en la conversación se registra como `CODE_SHOWN`, no como archivo verificado.

| ID | Feature | Exists | Implementation | Tests | Integration | Physical Validation | Evidence | Risk | Priority | Next Action |
|---|---|---|---|---|---|---|---|---|---|---|
| F-001 | Master Canon | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | Script y contenido | Medio | P0 | Confirmar archivo y versión canónica |
| F-002 | User Experience Canon | REPORTED | DESIGNED | NO | UNKNOWN | NO | Análisis del documento | Medio | P0 | Recuperar artefacto fuente |
| F-003 | LUKA Presence | REPORTED | DESIGNED | NO | UNKNOWN | NO | Principios y flujo | Alto | P1 | Definir comportamiento ejecutable |
| F-004 | Entrada sin tutorial técnico | REPORTED | DESIGNED | NO | UNKNOWN | NO | Flujo 0–60 s | Medio | P1 | Prototipo y prueba de usuario |
| F-005 | Test de experiencia de 60 segundos | REPORTED | DESIGNED | NO | NO | NO | Cuatro preguntas definidas | Medio | P1 | Convertir en protocolo medible |
| F-006 | Progressive Complexity | REPORTED | DESIGNED | NO | UNKNOWN | NO | Cinco niveles | Medio | P1 | Mapear controles por nivel |
| F-007 | L★ compartir/acceso | REPORTED | DESIGNED | NO | UNKNOWN | NO | Flujo de compartir | Alto | P1 | Definir semántica y seguridad |
| F-008 | QR contextual | REPORTED | DESIGNED | NO | UNKNOWN | NO | Canon y aclaración móvil | Alto | P0 | Especificar token, TTL y revocación |
| F-009 | Emparejamiento celular ↔ MiLukita/TV | REPORTED | UNKNOWN | NO | NO | NO | Aclaración del usuario | Crítico | P0 | Probar flujo vertical mínimo |
| F-010 | MobileShell | UNKNOWN | UNKNOWN | NO | UNKNOWN | NO | Solo figura en orden de auditoría | Alto | P0 | Buscar evidencia en repositorio |
| F-011 | Universal Interaction | REPORTED | DESIGNED | NO | UNKNOWN | NO | Arquitectura detallada | Alto | P0 | Implementar contrato de intents |
| F-012 | Intent Engine | REPORTED | DESIGNED | NO | NO | NO | Pipeline semántico | Crítico | P0 | Definir API, estados y tests |
| F-013 | Capability Gate | REPORTED | DESIGNED | NO | NO | NO | Reglas y diagramas | Crítico | P0 | Enforcement server-side |
| F-014 | RBAC | REPORTED | DESIGNED | NO | UNKNOWN | NOT_APPLICABLE | Regla repetida | Crítico | P0 | Auditar middleware real |
| F-015 | Human Authority | REPORTED | DESIGNED | NO | NO | NO | Canon e interacción | Crítico | P0 | Modelar workflow de aprobación |
| F-016 | Surface Agent | REPORTED | DESIGNED | NO | NO | NO | Límites explícitos | Alto | P1 | Separar UI de política |
| F-017 | Voice Copilot | REPORTED | DESIGNED | NO | NO | NO | Capacidades/límites | Alto | P2 | Prototipo con fallback |
| F-018 | Touch input | REPORTED | DESIGNED | NO | UNKNOWN | NO | Equivalencia modal | Medio | P1 | Integrar al Intent Engine |
| F-019 | Gesture input | REPORTED | DESIGNED | NO | NO | NO | Gesture Language | Alto | P2 | Dataset y prueba física |
| F-020 | HAND recognition | REPORTED | DESIGNED | NO | NO | NO | Reglas de gesto | Alto | P2 | Definir detector real |
| F-021 | Gaze input | REPORTED | DESIGNED | NO | NO | NO | Modalidad listada | Alto | P3 | Diferir hasta hardware |
| F-022 | Motion input | REPORTED | DESIGNED | NO | NO | NO | Rotación/señal | Medio | P2 | Probar sensores de celular |
| F-023 | CHECK gesture | REPORTED | DESIGNED | NO | NO | NO | Semántica explícita | Alto | P2 | Clasificador y confirmación |
| F-024 | X/CANCEL gesture | REPORTED | DESIGNED | NO | NO | NO | Semántica explícita | Alto | P2 | Clasificador y prioridad |
| F-025 | CIRCLE/SELECT gesture | REPORTED | DESIGNED | NO | NO | NO | Semántica explícita | Alto | P2 | Validar accesibilidad cultural |
| F-026 | POINT gesture | REPORTED | DESIGNED | NO | NO | NO | Semántica explícita | Alto | P2 | Hit-test y desambiguación |
| F-027 | PALM STOP/PAUSE | REPORTED | DESIGNED | NO | NO | NO | Semántica explícita | Crítico | P2 | Evitar uso como emergencia |
| F-028 | Gestos compuestos | REPORTED | DESIGNED | NO | NO | NO | Matriz de secuencias | Alto | P3 | Pruebas de tiempo/ambigüedad |
| F-029 | Confidence/fallback gestual | REPORTED | DESIGNED | NO | NO | NO | Alta/media/baja | Crítico | P1 | Umbrales y tests negativos |
| F-030 | Auditoría gestual por estados | REPORTED | DESIGNED | NO | NO | NO | State machine | Alto | P1 | Esquema de eventos auditable |
| F-031 | AR Discovery | REPORTED | DESIGNED | NO | NO | NO | Pilar público | Alto | P2 | Definir MVP no crítico |
| F-032 | AR pointer | REPORTED | DESIGNED | NO | NO | NO | UI vertical | Alto | P3 | Diferir hasta pairing estable |
| F-033 | Hit-test/raycasting | REPORTED | DESIGNED | NO | NO | NO | Gesture Language | Alto | P3 | Evaluar plataforma objetivo |
| F-034 | Games experience | REPORTED | DESIGNED | NO | UNKNOWN | NO | Pilar público | Alto | P1 | Mapear límites con MJP CORE |
| F-035 | TV experience/control | REPORTED | DESIGNED | NO | NO | NO | Pilar y UI | Crítico | P0 | Probar acción TV segura |
| F-036 | WebRTC | UNKNOWN | UNKNOWN | NO | NO | NO | Solo aparece en orden | Alto | P1 | Localizar decisión/prototipo |
| F-037 | Mapper | REPORTED | DESIGNED | NO | NO | NO | Responsabilidad definida | Alto | P2 | Definir modelo de captura |
| F-038 | The Eye | REPORTED | DESIGNED | NO | NO | NO | Responsabilidad definida | Alto | P2 | Definir evidencia/revisión |
| F-039 | World Engine | REPORTED | DESIGNED | NO | NO | NO | Responsabilidad definida | Crítico | P2 | Definir entidades/versionado |
| F-040 | WorldPoint/WorldObject | UNKNOWN | UNKNOWN | NO | NO | NO | Solo aparece en orden | Alto | P2 | Buscar definición fuente |
| F-041 | Verification workflow | REPORTED | DESIGNED | NO | NO | NO | VERIFIED ≠ PUBLISHED | Crítico | P1 | Estados y permisos ejecutables |
| F-042 | Publication workflow | REPORTED | DESIGNED | NO | NO | NO | World Engine/Human Authority | Crítico | P1 | Aprobación y audit trail |
| F-043 | Offline operation | UNKNOWN | UNKNOWN | NO | NO | NO | Solo aparece en orden | Alto | P1 | Definir alcance offline |
| F-044 | Synchronization | UNKNOWN | UNKNOWN | NO | NO | NO | Solo aparece en orden | Alto | P1 | Definir modelo de sync |
| F-045 | Conflict resolution | REPORTED | DESIGNED | NO | NO | NO | Reservada, no a LUKA | Crítico | P1 | Protocolo y autoridad |
| F-046 | MJP CORE isolation | REPORTED | DESIGNED | NO | UNKNOWN | NOT_APPLICABLE | Invariante | Crítico | P0 | Verificar enforcement real |
| F-047 | Public read-only API | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | `publicApi.ts` referido | Crítico | P0 | Auditar repositorio y scopes |
| F-048 | Developer authentication | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | Swagger/auth snippets | Crítico | P0 | Revisar auth y sesiones |
| F-049 | API keys management | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | React page/router referido | Crítico | P0 | Hash, scopes, rotación |
| F-050 | Developer dashboard | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | `DashboardPage.tsx` | Medio | P1 | Build y smoke test |
| F-051 | Developer layout/navigation | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | `DeveloperLayout.tsx` | Bajo | P1 | Integrar rutas reales |
| F-052 | Webhook configuration | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | UI y service referidos | Crítico | P0 | Firma, replay, retries |
| F-053 | Developer sandbox | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | `sandbox.ts`, página | Alto | P1 | Probar aislamiento |
| F-054 | Usage billing | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | `billing.ts` referido | Crítico | P0 | Ledger y reconciliación |
| F-055 | Stripe subscriptions | REPORTED | CODE_SHOWN | NO | NO | NOT_APPLICABLE | servicio/router | Crítico | P0 | Sandbox oficial e idempotencia |
| F-056 | PayPal subscriptions | REPORTED | CODE_SHOWN | NO | NO | NOT_APPLICABLE | servicio/router | Crítico | P0 | Sandbox oficial y webhooks |
| F-057 | Billing portal | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | endpoints/UI referidos | Alto | P1 | Integración E2E |
| F-058 | Email notifications | REPORTED | CODE_SHOWN | NO | NO | NOT_APPLICABLE | servicio multicanal | Alto | P1 | Configurar proveedor/prueba |
| F-059 | In-app notifications | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | servicio/router | Medio | P1 | Persistencia y lectura |
| F-060 | Discord notifications | REPORTED | CODE_SHOWN | NO | NO | NOT_APPLICABLE | adapter referido | Medio | P2 | Validar secretos y rate limits |
| F-061 | Slack notifications | REPORTED | CODE_SHOWN | NO | NO | NOT_APPLICABLE | canal listado | Medio | P2 | Confirmar código y OAuth |
| F-062 | Usage threshold alerts | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | 75/90/limit | Medio | P1 | Jobs y deduplicación |
| F-063 | Referral codes | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | service/router/UI | Alto | P2 | Persistencia y antifraude |
| F-064 | Three-level commissions | REPORTED | CODE_SHOWN | NO | NO | NOT_APPLICABLE | 20%/5%/2% | Crítico | P3 | Revisión legal/económica |
| F-065 | Referral payouts | REPORTED | CODE_SHOWN | NO | NO | NOT_APPLICABLE | balance pendiente | Crítico | P3 | Ledger/KYC/impuestos |
| F-066 | Swagger UI | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | `server/swagger.ts` | Medio | P1 | Comparar contrato vs runtime |
| F-067 | OpenAPI YAML/JSON | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | archivos referidos | Medio | P1 | Validación automática |
| F-068 | API analytics collector | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | `analytics.ts` | Alto | P1 | Persistencia y carga |
| F-069 | Metrics aggregation | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | requests/latency/errors | Alto | P1 | Tests de exactitud |
| F-070 | Analytics dashboard | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | React/CSS | Medio | P2 | Build y datos reales |
| F-071 | CSV/report export | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | generador referido | Medio | P2 | Escape y privacidad |
| F-072 | Anomaly alerts | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | spike de errores | Alto | P2 | Umbrales robustos |
| F-073 | Partner registration | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | service/router/UI | Alto | P2 | Workflow administrativo |
| F-074 | Partner tiers | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | Registered/Silver/Gold/Platinum | Alto | P3 | Criterios auditables |
| F-075 | Certifications | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | cuatro certificaciones | Alto | P3 | Banco de evaluación y fraude |
| F-076 | Certification approval/rejection | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | rutas y logs | Alto | P3 | RBAC admin y auditoría |
| F-077 | Integration registry | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | marketplace service | Alto | P2 | Persistencia y ownership |
| F-078 | Marketplace publication | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | publishIntegration | Crítico | P2 | Review/human authority |
| F-079 | Marketplace catalog/categories | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | ocho categorías | Medio | P3 | Producto/UX posterior |
| F-080 | Integration installation tracking | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | installs endpoints | Alto | P3 | Autorización/uninstall |
| F-081 | Ratings and reviews | REPORTED | CODE_SHOWN | NO | UNKNOWN | NOT_APPLICABLE | rating 1–5 | Medio | P3 | Moderación y abuso |
| F-082 | Universal Controller mobile UI | REPORTED | DESIGNED | NO | NO | NO | aclaración del usuario | Alto | P0 | Prototipo responsive |
| F-083 | TV/domotics vertical mode | REPORTED | DESIGNED | NO | NO | NO | wireframe | Alto | P1 | Adaptar a celular real |
| F-084 | Gamepad horizontal mode | REPORTED | DESIGNED | NO | NO | NO | wireframe | Alto | P2 | Latencia y haptics |
| F-085 | Keyboard horizontal mode | REPORTED | DESIGNED | NO | NO | NO | especificación | Medio | P2 | Prototipo accesible |
| F-086 | Trackpad mode | REPORTED | DESIGNED | NO | NO | NO | especificación | Medio | P2 | Probar gestos nativos |
| F-087 | Contextual status bar | REPORTED | DESIGNED | NO | NO | NO | wireframe/paleta | Bajo | P1 | Diseño responsive |
| F-088 | Device/profile detection | REPORTED | DESIGNED | NO | NO | NO | UWB/huella propuestos | Alto | P3 | Evitar dependencia hardware |
| F-089 | Predictive suggestions | REPORTED | DESIGNED | NO | NO | NO | continuidad horaria | Alto | P3 | Consentimiento y control manual |
| F-090 | Local voice processing | REPORTED | PROPOSED | NO | NO | NO | privacidad | Alto | P3 | Evaluar capacidad real |
| F-091 | IR legacy control | REPORTED | PROPOSED | NO | NO | NO | sugerencia de compatibilidad | Medio | P3 | Solo hardware futuro |
| F-092 | Wi-Fi 7/Bluetooth/UWB | REPORTED | PROPOSED | NO | NO | NO | tabla de protocolos | Alto | P3 | Separar móvil de hardware propio |
| F-093 | LTPO OLED/state-solid battery | REPORTED | PROPOSED | NO | NO | NO | concepto industrial | Alto | P3 | Mantener diferido |
| F-094 | Haptic feedback | REPORTED | DESIGNED | NO | NO | NO | criterios LUC | Medio | P2 | Usar capacidades del celular |
| F-095 | Rotation under 100 ms | REPORTED | TARGET_ONLY | NO | NO | NO | criterio LUC-04 | Alto | P2 | Medir en dispositivo |
| F-096 | 7-day battery | REPORTED | TARGET_ONLY | NO | NO | NO | criterio LUC-07 | Alto | P3 | No aplica igual al celular |
| F-097 | Offline/sync conflict analytics | UNKNOWN | UNKNOWN | NO | NO | NO | no desarrollado | Alto | P1 | Evitar afirmar existencia |
| F-098 | Deployment/operations | UNKNOWN | UNKNOWN | NO | NO | NOT_APPLICABLE | ninguna evidencia | Crítico | P0 | Auditoría de infraestructura |

## Lectura de la matriz

- **Features identificadas:** 98.
- **Features demostradas en runtime:** 0.
- **Features con código mostrado o reportado:** 37 aproximadamente, según granularidad.
- **Features conceptualmente diseñadas o propuestas:** la mayoría restante.
- **Áreas mencionadas por la orden pero no sustentadas en la conversación:** MobileShell, WebRTC, WorldPoint/WorldObject, offline, sincronización y analytics de conflictos. Deben permanecer `UNKNOWN` hasta localizar evidencia.

