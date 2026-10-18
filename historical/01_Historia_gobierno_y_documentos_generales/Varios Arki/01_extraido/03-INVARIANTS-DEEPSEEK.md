# Invariantes de MiLukita extraídos de la conversación DeepSeek

**Documento:** 03-INVARIANTS-DEEPSEEK  
**Criterio:** solo se registran reglas explícitas o inequívocamente congeladas en la conversación.

## Catálogo

### INV-DS-001 Experience First

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** La cadena de decisión es Canon → producto → experiencia → interacción → UX/UI → tecnología → implementación → pruebas.
- **RATIONALE:** La tecnología sirve a una experiencia definida; no la determina.
- **CONSEQUENCE:** Una pantalla o feature sin objetivo, contexto, feedback, errores y criterios de aceptación no debe considerarse diseño válido.
- **SOURCE/CONTEXT:** Master Canon, secciones de Experience First y User Experience Canon.

### INV-DS-002 Una presencia LUKA

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** LUKA acompaña transversalmente y no se fragmenta en personajes independientes por superficie.
- **RATIONALE:** Mantener continuidad y reconocimiento entre experiencias.
- **CONSEQUENCE:** AR, TV, Games, móvil y campo deben compartir identidad y comportamiento, aunque LUKA pueda retirarse cuando no aporta valor.
- **SOURCE/CONTEXT:** One Presence; “LUKA no se ancla. LUKA acompaña”.

### INV-DS-003 LUKA no es autoridad

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** La IA guía, explica, propone, alerta y registra, pero no verifica verdad, resuelve conflictos, concede permisos ni publica por sí misma.
- **RATIONALE:** Evitar autoridad falsa.
- **CONSEQUENCE:** Toda acción reservada debe llegar a personas o sistemas autorizados.
- **SOURCE/CONTEXT:** Human Authority, Surface Agent y Voice Copilot.

### INV-DS-004 Intención no equivale a permiso

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** Ninguna modalidad de entrada otorga autoridad adicional.
- **RATIONALE:** Voz, touch o gesto expresan lo que el usuario quiere, no lo que está autorizado a hacer.
- **CONSEQUENCE:** Capability Gate y RBAC se ejecutan después de interpretar la intención.
- **SOURCE/CONTEXT:** Matriz de intenciones; reglas de gesto; UI del Universal Controller.

### INV-DS-005 Pipeline de interacción

- **STATUS:** ACCEPTED
- **RULE:** Señal → interpretación de intención → comprobación de capacidad/permiso/contexto → autorización humana cuando corresponda → acción → traza.
- **RATIONALE:** Separar observación, significado, autoridad y ejecución.
- **CONSEQUENCE:** No se permite acoplar directamente un evento de UI o sensor a una operación sensible.
- **SOURCE/CONTEXT:** Gesture Language y diagramas de Universal Interaction.

### INV-DS-006 Equivalencia multimodal

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** Una misma intención puede expresarse mediante modalidades distintas y debe converger en el mismo modelo semántico.
- **RATIONALE:** Accesibilidad, continuidad y fallback.
- **CONSEQUENCE:** No deben crearse reglas de autoridad diferentes para voz, touch, gesto, AR o control.
- **SOURCE/CONTEXT:** “Una intención. Múltiples formas de expresarla”.

### INV-DS-007 Fallback obligatorio

- **STATUS:** ACCEPTED
- **RULE:** Ninguna modalidad avanzada debe ser la única vía obligatoria; debe existir alternativa compatible.
- **RATIONALE:** Capacidades, permisos, hardware y contexto varían.
- **CONSEQUENCE:** Si AR/WebXR, voz o gesto fallan, la experiencia ofrece pantalla/touch u otra vía y explica el resultado en lenguaje humano.
- **SOURCE/CONTEXT:** User Experience Canon y Gesture Language.

### INV-DS-008 Ambigüedad segura

- **STATUS:** ACCEPTED
- **RULE:** Confianza media solicita aclaración; confianza baja no ejecuta.
- **RATIONALE:** Reducir falsos positivos y acciones accidentales.
- **CONSEQUENCE:** Acciones críticas no pueden depender de una clasificación incierta.
- **SOURCE/CONTEXT:** Niveles de confianza gestual y estados NEEDS_CLARIFICATION/CONFIRMATION_REQUIRED.

### INV-DS-009 POINT no es SELECT

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** Señalar, seleccionar, confirmar y ejecutar son actos distintos.
- **RATIONALE:** Eliminar ambigüedad espacial.
- **CONSEQUENCE:** POINT solo dirige atención; CIRCLE/SELECT elige; CHECK confirma; la autorización se evalúa aparte.
- **SOURCE/CONTEXT:** Gesture Language, secciones POINT vs SELECT y hit-test.

### INV-DS-010 CHECK no publica

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** CHECK expresa confirmación contextual, pero no concede autoridad ni publica automáticamente.
- **RATIONALE:** Mantener Human Authority y gobernanza de publicación.
- **CONSEQUENCE:** `CHECK → CONFIRM → PUBLISH` debe detenerse en `HUMAN_REQUIRED` cuando corresponda.
- **SOURCE/CONTEXT:** Sección Human Authority del lenguaje gestual.

### INV-DS-011 PALM no reemplaza seguridad física

- **STATUS:** ACCEPTED
- **RULE:** PALM significa stop/pause contextual y no sustituye un mecanismo físico de emergencia.
- **RATIONALE:** Un clasificador gestual no tiene confiabilidad suficiente para seguridad de vida o equipo.
- **CONSEQUENCE:** Sistemas críticos conservan controles físicos certificados.
- **SOURCE/CONTEXT:** Gesture Language.

### INV-DS-012 MJP CORE protegido

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** MiLukita no altera juegos, reglas, RNG, RTP, wallet, ledger, settlement ni superficies protegidas de MJP CORE.
- **RATIONALE:** Preservar integridad, seguridad y gobernanza del núcleo de juegos.
- **CONSEQUENCE:** Toda integración debe ser explícitamente autorizada y, cuando se defina como pública, de solo lectura.
- **SOURCE/CONTEXT:** Master Canon y descripción de API pública.

### INV-DS-013 Verificado no equivale a publicado

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** `VERIFIED` y `PUBLISHED` son estados separados.
- **RATIONALE:** La calidad de evidencia y la autoridad de difusión son decisiones distintas.
- **CONSEQUENCE:** The Eye no publica por haber verificado; World Engine y Human Authority mantienen el flujo de publicación.
- **SOURCE/CONTEXT:** Mapper/The Eye/World Engine.

### INV-DS-014 Separación Mapper The Eye World Engine

- **STATUS:** ACCEPTED
- **RULE:** Mapper captura/documenta; The Eye revisa/contrasta; World Engine gobierna representación, versiones y publicación técnica.
- **RATIONALE:** Evitar que el capturador certifique o publique su propio trabajo.
- **CONSEQUENCE:** Los roles y permisos deben impedir atajos entre captura, verificación y publicación.
- **SOURCE/CONTEXT:** Sección profesional del Canon.

### INV-DS-015 Surface Agent limitado

- **STATUS:** ACCEPTED
- **RULE:** Surface Agent adapta presentación e interacción; no decide permisos, autoridad o publicación.
- **RATIONALE:** La capa visible no debe convertirse en política.
- **CONSEQUENCE:** Capability Gate, RBAC y Human Authority permanecen fuera de la UI.
- **SOURCE/CONTEXT:** Master Canon, sección Surface Agent.

### INV-DS-016 Tecnología invisible sistema explícito

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** La complejidad técnica se oculta al usuario cuando sea posible, pero sus estados y fallos deben ser explícitos para el sistema y la auditoría.
- **RATIONALE:** Simplicidad de uso sin perder trazabilidad.
- **CONSEQUENCE:** El usuario recibe fallback comprensible; logs y estados conservan precisión técnica.
- **SOURCE/CONTEXT:** Technology Invisible y gestión de errores.

### INV-DS-017 Complejidad progresiva

- **STATUS:** ACCEPTED
- **RULE:** La interfaz revela controles conforme aparecen acciones, información o decisiones y los reduce cuando dejan de ser necesarios.
- **RATIONALE:** Evitar sobrecarga y sostener usuarios nuevos y profesionales.
- **CONSEQUENCE:** No todos los modos ni controles deben mostrarse simultáneamente.
- **SOURCE/CONTEXT:** Progressive Complexity, cinco niveles.

### INV-DS-018 Continuidad con retirada contextual

- **STATUS:** ACCEPTED
- **RULE:** LUKA proporciona continuidad, pero debe desaparecer o guardar silencio cuando no añade valor.
- **RATIONALE:** Presencia no significa intrusión.
- **CONSEQUENCE:** No forzar avatar, voz o animación permanente.
- **SOURCE/CONTEXT:** Voz/silencio y continuidad de experiencia.

### INV-DS-019 Privacidad por minimización

- **STATUS:** ACCEPTED
- **RULE:** Capturar y retener solo datos necesarios; voz y capacidades sensibles deben favorecer procesamiento local.
- **RATIONALE:** Reducir exposición y sostener confianza.
- **CONSEQUENCE:** Gestos, biometría, voz y contexto doméstico requieren límites de retención y permisos.
- **SOURCE/CONTEXT:** Gesture Language y Universal Controller.

### INV-DS-020 Auditoría por etapas

- **STATUS:** ACCEPTED
- **RULE:** La traza distingue señal detectada, clasificación, intención propuesta, autorización y ejecución.
- **RATIONALE:** Investigar falsos positivos, rechazos y acciones no ejecutadas.
- **CONSEQUENCE:** Un log único de “acción” es insuficiente.
- **SOURCE/CONTEXT:** Máquina de estados gestual.

### INV-DS-021 Estado técnico basado en evidencia

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** Pantalla, ruta, código mostrado, unit test o build exitoso no justifican por sí solos un estado superior.
- **RATIONALE:** Impedir inflación de madurez.
- **CONSEQUENCE:** Cada claim debe citar evidencia del nivel correspondiente.
- **SOURCE/CONTEXT:** Master Canon, realidad tecnológica.

### INV-DS-022 Prueba física antes de validación física

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** Ningún gesto, sensor, dispositivo o flujo de campo se marca `PHYSICALLY_TESTED` sin prueba real en el dispositivo y contexto previstos.
- **RATIONALE:** Simulación y navegador no reproducen condiciones físicas.
- **CONSEQUENCE:** UWB, haptics, rotación, batería, cámara y gestos permanecen no validados.
- **SOURCE/CONTEXT:** Gesture Language y estados del Canon.

### INV-DS-023 No regresión sin decisión explícita

- **STATUS:** ACCEPTED / FROZEN
- **RULE:** Una evolución no contradice el Canon, debilita seguridad, rompe MJP CORE ni elimina capacidad validada sin decisión explícita.
- **RATIONALE:** Preservar coherencia y trazabilidad.
- **CONSEQUENCE:** Cambios incompatibles requieren Decision Log y autoridad.
- **SOURCE/CONTEXT:** Regla de evolución del Master Canon.

### INV-DS-024 El celular es la superficie actual del control

- **STATUS:** ACCEPTED LATER / SCOPE CLARIFICATION
- **RULE:** Las interfaces diseñadas para el control universal deben poder mostrarse en cualquier celular emparejado por QR con MiLukita.
- **RATIONALE:** El usuario corrigió el alcance después del concepto de hardware dedicado.
- **CONSEQUENCE:** La arquitectura no debe depender exclusivamente de titanio, pantalla propietaria, UWB, huella o batería especial.
- **SOURCE/CONTEXT:** Aclaración del usuario inmediatamente posterior a la especificación física/UI.

### INV-DS-025 Control manual disponible

- **STATUS:** ACCEPTED
- **RULE:** El usuario puede anular sugerencias automáticas; la predicción no toma control irreversible.
- **RATIONALE:** Preservar agencia.
- **CONSEQUENCE:** Las automatizaciones del control necesitan salida manual y feedback.
- **SOURCE/CONTEXT:** Principios de UI del Universal Controller.

## Observación de gobernanza

Los invariantes 1–23 provienen de reglas conceptuales explícitas. El 24 es una corrección posterior de alcance y, por tanto, prevalece para la superficie inmediata. Ninguno está demostrado como enforcement técnico; hoy son **normas de diseño**, no garantías de runtime.

