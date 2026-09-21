# ARKI — Current User and Architect Journeys (Delta 513)

## 1. Journey actual demostrable

### A. Arquitecto: encargo → diagnóstico

1. Abre el Command Center y crea/selecciona un proyecto versionado.
2. Introduce el encargo y condiciones conocidas; puede adjuntar imagen/PDF o usar el flujo de cámara.
3. ARKI almacena la fuente con provenance y ejecuta OCR cuando corresponde.
4. El sistema muestra observaciones como `AI_PROPOSED`; ambigüedades quedan `UNKNOWN`.
5. El arquitecto revisa/edita el resumen y decide qué información es utilizable.
6. El reasoning harness recupera conocimiento acotado y muestra por qué fue recuperado.
7. Clasifica transferencias como `TRANSFER`, `ADAPT`, `DO_NOT_TRANSFER` o `UNKNOWN`.
8. Deriva actividades, relaciones, flujos, condiciones, hazards y déficits.
9. Produce dos estrategias arquitectónicas divergentes, ambas pendientes de revisión humana.

**Estado:** `DEMONSTRATED` para el ciclo analítico; no es todavía documentación profesional.

### B. Arquitecto: topología → representación

1. Reutiliza la topología del caso.
2. D6.3-G genera requisitos geométricos, design moves y mutaciones reversibles.
3. Construye dos `CanonicalSpatialRepresentation`.
4. Se ejecutan containment, non-overlap, controlled-interface, provenance y unknown gates.
5. El arquitecto observa SVG, 2D, massing 3D o la vista AR experimental.
6. Decide aceptar, rechazar o pedir nueva evidencia; ARKI no promueve automáticamente una solución.

**Estado:** `DEMONSTRATED_CONCEPTUAL`. `functionalValidity`, `operationalValidity` y regulación pueden seguir en `UNKNOWN`/`NOT_EVALUATED`.

### C. Cliente: inspección visual/AR

1. Recibe o abre el proyecto.
2. Entra a la vista espacial/AR.
3. Concede cámara, ubicación y orientación si el dispositivo lo permite.
4. Sigue la guía de cinco pasos para estacas A/B, distancia y eje.
5. Usa minimapa, cámara y modelo superpuesto.
6. Interpreta la salida como visualización de proyecto, no como replanteo topográfico certificado.

**Estado:** `EXPERIMENTAL`; depende de hardware, HTTPS, permisos y precisión.

### D. Revisor humano / especialista

1. Examina fuentes y provenance.
2. Verifica si una observación puede promoverse a FACT.
3. Revisa transferencias, unknowns, contraejemplos y gates.
4. Evalúa funcionamiento, normativa y especialidades.
5. Autoriza o rechaza la siguiente resolución del diseño.

**Estado:** `DEMONSTRATED_GOVERNANCE`; es una parte obligatoria del ciclo.

## 2. Lo que el journey actual no puede prometer

No puede prometer por sí solo un expediente de licencia, cálculo estructural/MEP, DWG nativo, modelo Revit, medición de obra, compatibilización BIM, levantamiento topográfico ni verificación normativa universal. El usuario debe aportar jurisdicción, fuentes, datos del sitio y especialistas cuando esos resultados sean necesarios.

## 3. Journey futuro cercano propuesto — no ejecutado

```text
Encargo libre
 → extracción estructurada y preguntas faltantes
 → confirmación editable del arquitecto
 → fuentes y normativa versionadas por jurisdicción
 → PARTI común
 → R-A / R-B / R-C
 → gates funcionales, geométricos y normativos
 → rechazo/backtrack/mutación
 → modelo espacial constructivo común
 → export adapters CAD/BIM/GIS
 → revisión por arquitecto y especialistas
 → paquete de entrega con estados y provenance
```

Cada transición futura necesita un gate específico. No debe saltarse de “visualización conceptual” a “listo para licencia”.

## 4. Journey pedagógico del Libro Vivo

El lector selecciona perfil `Junior`, `Senior`, `Master` o `Crazy`, volumen y tipología. Consulta conceptos, capítulos, ejemplos y preguntas; el sistema registra evaluación y mantiene separado el material público de los protocolos internos de ARKI. Los temas internos —provenance, UNKNOWN, transferencia, P9.4, persistencia, límites software/conocimiento— no deben presentarse como capítulos públicos ordinarios salvo decisión editorial explícita.

## 5. Matriz de responsabilidad

| Decisión | ARKI | Arquitecto | Especialista | Cliente |
|---|---|---|---|---|
| Capturar y ordenar encargo | Propone/estructura | Confirma/corrige | Consulta si aplica | Aporta datos |
| OCR/observación visual | Propone | Revisa | Verifica documento técnico | Aclara fuente |
| Transferencia tipológica | Clasifica y explica | Acepta/rechaza | Aporta contexto | — |
| Zonificación/topología | Genera alternativas | Evalúa funcionamiento | Verifica disciplina | Expone necesidades |
| Geometría conceptual | Materializa candidatos | Selecciona/itera | Valida especialidad | Comprende/feedback |
| Normativa/licencia | Organiza evidencia | Responsable de revisión profesional | Firma/valida disciplina | Proporciona requisitos |
| Anclaje AR | Guía y visualiza | Verifica condiciones | Topografía si procede | Coloca/mide estacas |
| Promoción a FACT | Nunca automática | Autoridad de revisión | Puede emitir evidencia | — |

## 6. Estado de journey global

`CURRENT_USER_AND_ARCHITECT_JOURNEY = DEMONSTRATED_ANALYTICAL_WORKFLOW`  
`PROFESSIONAL_EXECUTIVE_PROJECT_JOURNEY = NOT_DEMONSTRATED`  
`HUMAN_AUTHORITY = REQUIRED`  
`STOP_AFTER_INVENTORY = TRUE`
