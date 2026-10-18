# Expediente canónico de consolidación LUKA / MiLukita

**Fecha de corte:** 2026-09-01  
**Proyecto:** ruleta-peru-online  
**Código de control:** MILUKITA-BRAND-FREEZE-001  
**Estado:** Documento de trabajo para auditoría externa y revisión humana  
**Base técnica:** `docs/LUKA_AUDITORIA_TOTAL_FASE_0_2026-09-01.md`, `docs/MILUKITA_NAMING_MIGRATION_AUDIT.md`

> **Aviso legal:** Soy una IA, no un abogado. Este expediente es un borrador de análisis y control interno, no asesoría legal formal. Un abogado especializado en propiedad intelectual, publicidad, protección al consumidor y, cuando corresponda, regulación de juegos, debe revisar cualquier decisión de registro, publicación, contrato o lanzamiento.

## 1. Dictamen de consolidación

La auditoría nominal fue revisada contra el inventario activo y los documentos de trazabilidad. El criterio correcto no es reemplazar globalmente todas las variantes históricas, porque ello destruiría evidencia, compatibilidad y referencias de pruebas. Se aprueba un **freeze selectivo**: el producto nuevo usa el glosario canónico; los documentos históricos, fixtures, hashes, nombres de archivos y pruebas antiguas se conservan y se etiquetan como históricos cuando corresponda.

El planteamiento actual es coherente con la separación constitucional: **MJP CORE** conserva la verdad del juego; **Experience OS** orquesta; **Character OS** decide la presencia permitida; **Presentation OS** muestra la experiencia; y los agentes observan o proponen dentro de límites. El lanzamiento de Fase 1 debe exponer únicamente **LUKA Visor AR** y **LUKA TV**. El resto permanece RESERVED, HIDDEN, SIMULATED o sujeto a aprobación humana.

## 2. Glosario canónico aprobado para material nuevo

| Término | Significado operativo | Uso aprobado | Sustituciones no autorizadas |
|---|---|---|---|
| **MiLukita** | Marca y ecosistema matriz | Encabezados corporativos, producto, navegación institucional y materiales comerciales | No usar como nombre del avatar inteligente |
| **El Mundo de MiLukita** | Universo público y territorial de experiencias | Entrada pública, narrativa de territorio, campañas y contenido de usuario | No confundir con LUKA OS |
| **LUKA** | Presencia inteligente, guía y avatar | Diálogo, guía AR, acciones contextuales y personaje | No usar “Lukita” como término técnico canónico nuevo |
| **LUKA OS** | Capa técnica de orquestación e interacción | Contratos, arquitectura, runtime, Capability Registry y documentación técnica | No atribuirle autoridad sobre MJP CORE |
| **LUKA AR / LUKA Visor AR** | Experiencia aumentada territorial | Visor, onboarding, GPS, puntos de interés y captura social | No presentarlo como WebXR productivo certificado |
| **LUKA TV** | Experiencia de televisión y presentación | TV Runtime, LRUD, QR de vinculación y navegación | No afirmar Cast/DLNA real si la integración sigue simulada |
| **Controller Lab** | Backstage de pruebas y configuración | Herramientas internas, simuladores, presets y contratos de integración | No presentarlo como acceso al núcleo |
| **L★ / Lukita Star Trail** | Motivo visual de interfaz aprobado | QR circular, puntero y rastro visual cuando el contexto lo requiera | No afirmar que es una marca registrada |
| **Lukallpa / LUKITA / Lukita** | Variantes heredadas o históricas | Solo en evidencia histórica, compatibilidad o migración contextual | No introducirlas en material nuevo sin justificación y revisión |

### Regla editorial
En código nuevo, títulos, etiquetas, documentación pública y materiales comerciales activos se usan las formas canónicas. En contratos, pruebas y auditorías históricas se conserva el texto original, agregando una nota de clasificación cuando sea necesario. Los nombres técnicos de variables o assets solo se cambian mediante migración explícita y pruebas de compatibilidad.

## 3. Cláusula exacta de congelamiento funcional

> **Cláusula de congelamiento de expansión y preservación del MJP CORE.** A partir de la aprobación de esta Orden Maestra, el alcance funcional de la Fase 1 queda congelado en las capacidades declaradas `AVAILABLE` por el Capability Registry. Ningún agente, módulo de Experience OS, Character OS, Presentation OS, Controller Lab, integración de distribución o interfaz pública podrá crear, activar, publicar, contratar, monetizar o conectar una capacidad no declarada sin una solicitud de cambio versionada, análisis de impacto, evidencia de pruebas, revisión de seguridad y aprobación humana expresa. MJP CORE permanece `PROTECTED`: sus reglas, RNG, RTP, wallet, ledger, settlement, resultados, manifiestos y mecanismos de supervivencia no podrán ser modificados por agentes ni por superficies de experiencia. Todo desarrollo futuro se documentará como contrato reservado, sin activación ni afirmación de disponibilidad, hasta superar los quality gates definidos y quedar incorporado a una versión aprobada del contrato constitucional.

## 4. Matriz de riesgos de marca y publicación

| Riesgo | Probabilidad | Impacto | Nivel | Control requerido | Gate de salida |
|---|---:|---:|---|---|---|
| Confusión entre MiLukita, LUKA y LUKITA | Media | Alto | P1 | Glosario canónico, revisión editorial y alias históricos etiquetados | Revisión humana de activos |
| Coincidencia fonética o denominativa con terceros | Desconocida | Alto | P0 | Búsqueda oficial por denominación, fonética, clases y titulares | Informe de abogado de marcas |
| Confundir prototipo simulado con integración real | Media | Alto | P0 | Etiquetas `SIMULATED`, `SANDBOX`, `NO PROVIDER`, `NO DATA` | QA de publicación |
| Afirmación de disponibilidad o registrabilidad | Media | Alto | P0 | Prohibir lenguaje concluyente en UI, marketing y contratos | Validación profesional |
| Uso de logotipos, personajes o marcas de terceros | Media | Alto | P1 | Revisión de licencia, origen de asset y similitud visual | Clearance documentado |
| Afirmaciones de rendimiento, latencia o autonomía sin medición productiva | Media | Medio | P1 | Separar métricas simuladas de observadas; conservar evidencia | Métrica reproducible |
| Publicidad de premios, créditos o monetización como valor real | Media | Alto | P0 | Aviso persistente de piloto y créditos virtuales; revisión regulatoria | Legal/compliance sign-off |
| Publicación de contenido generado por usuario sin consentimiento | Media | Alto | P1 | Consentimiento, privacidad, moderación y retención definida | QA de flujo completo |
| Geolocalización que exponga domicilios o datos sensibles | Media | Alto | P1 | Minimización, consentimiento, precisión limitada y borrado | Revisión de privacidad |
| Alteración indirecta del MJP CORE por herramientas de backstage | Baja | Crítico | P0 | Permisos presentation-only, contratos de no autoridad y pruebas de aislamiento | P0 CORE isolation PASS |
| Reutilización de material histórico como claim vigente | Media | Medio | P2 | Etiquetar “histórico/no vigente” y separar rutas de publicación | Revisión de contenido |
| Acceso público al Dev Lab o a contratos internos | Baja | Alto | P1 | Gesto reservado, autorización y no exposición en navegación pública | Pen-test de rutas |

## 5. Protocolo de publicación y fuentes

INDECOPI indica que su herramienta permite comprobar si existen marcas o signos idénticos o similares, incluyendo búsquedas por denominación y fonética, considerando la clase de producto o servicio. La herramienta oficial es [Busca tu marca](https://pi.indecopi.gob.pe/buscatumarca/) y la guía institucional está disponible en [gob.pe/Indecopi](https://www.gob.pe/16475-buscar-una-marca-o-servicio-registrado-busca-tu-marca).

WIPO señala que la [Global Brand Database](https://www.wipo.int/en/web/global-brand-database) permite consultar marcas internacionales y registros participantes por palabras clave, nombres, bienes/servicios y similitud de imagen, pero recomienda consultar también registros nacionales/regionales y considerar a un abogado de marcas. Por ello, este expediente **no declara** que MiLukita, LUKA, LUKA OS, LUKA AR, LUKA TV o L★ estén disponibles, sean registrables o estén libres de conflicto.

Antes de cualquier publicación comercial o solicitud de registro, el responsable humano debe conservar: fecha y hora de búsqueda; términos exactos y variantes fonéticas; clases Niza evaluadas; capturas o exportaciones permitidas; resultados relevantes; análisis de similitud denominativa y figurativa; titularidad potencial; territorios; y opinión profesional.

## 6. Estado real de agentes al corte

| Agente/capacidad | Estado técnico verificable | Modo | Evidencia disponible | Autoridad sobre MJP CORE |
|---|---|---|---|---|
| Audience Intelligence | IMPLEMENTED-SANDBOX | OBSERVE/PROPOSE | Paneles y contratos locales | NO |
| Marketing | IMPLEMENTED-SANDBOX | PROPOSE_ONLY | Métricas de demostración sin fuente productiva | NO |
| Social | IMPLEMENTED-SANDBOX | PROPOSE_ONLY | Flujo preparado, publicación real no habilitada | NO |
| Content | IMPLEMENTED-SANDBOX | REVIEW/PROPOSE | Validaciones y estados de aprobación | NO |
| Lukita/LUKA | IMPLEMENTED-SANDBOX | BOUNDED | Avatar y contextualidad simulada | NO |
| Sales | IMPLEMENTED-SANDBOX | PROPOSE_ONLY | Pipeline e inventario en cero sin leads productivos | NO |
| Revenue | IMPLEMENTED-SANDBOX | OBSERVE/PROPOSE | Panel sin ingresos productivos | NO |
| Financial Intelligence | IMPLEMENTED-SANDBOX | PROPOSE_ONLY | Propuestas simuladas, no ejecución financiera | NO |
| Experience Director | IMPLEMENTED-SANDBOX | PROPOSE_ONLY | Activación manual y estado RUNNING simulado | NO |
| Auditor | IMPLEMENTED-SANDBOX | READ_ONLY | Cobertura de contratos y registros locales | NO |
| Watchdog | IMPLEMENTED-SANDBOX | ALERT_ONLY | Alertas y fail-safes locales | NO |
| Recovery | IMPLEMENTED-SANDBOX | DETERMINISTIC | Fallbacks reproducibles | NO |
| Supervisor | IMPLEMENTED-SANDBOX | ESCALATE_ONLY | Coordinación sin autoridad de resultado | NO |
| Distribution | PREPARED / SIMULATED | PREVIEW_ONLY | Flujo de canales simulado; sin proveedores | NO |
| Legal & Compliance | RESERVED / CONSULTIVE | INACTIVE / INSPECT | Estados, límites y revisión humana | NO |

**Interpretación:** “IMPLEMENTED” significa que existe una implementación de sandbox y contratos verificables. No significa autonomía productiva, certificación, conexión a proveedores, autoridad legal ni métricas reales. Legal & Compliance debe permanecer consultivo y reservado; `POLICY_BLOCKED`, `REQUIRES_PROFESSIONAL_REVIEW`, `NO_DATA`, `INSPECT`, `BOUNDED` y `PROTECTED` son estados auditables, no errores de la interfaz.

## 7. Quality gates de cierre

| Gate | Criterio | Resultado esperado |
|---|---|---|
| Identidad | Material activo usa glosario canónico y conserva históricos | PASS con revisión humana |
| Marca | Búsqueda INDECOPI/WIPO y opinión profesional antes de claim | PENDING externo |
| Publicación | No se presentan simuladores como integraciones reales | PASS en sandbox |
| Seguridad | MJP CORE no aparece como superficie mutable de agentes | PASS en código/pruebas |
| Contratos | Cambios futuros son versionados y requieren aprobación | PASS documental |
| Calidad técnica | TypeScript, Vitest y build sin errores bloqueantes | Verificar en este corte |
| QA físico | QR, WebAR, TV y celular probados en dispositivos reales | PENDING humano |

## 8. Recomendación final

La decisión correcta ahora es **consolidar y auditar**, no crear más agentes. La ventaja del sistema no está en declarar una gran cantidad de agentes, sino en probar que las capas están separadas, que las propuestas son reversibles y que ninguna experiencia puede alterar la verdad del Core. La Fase 1 puede presentarse como un MVP de sandbox listo para validación, pero no como operación productiva certificada hasta cerrar los gates externos de marca, privacidad, proveedores, dispositivos, seguridad y revisión profesional.

## 9. Hashes y trazabilidad

- Auditoría nominal base: `docs/MILUKITA_NAMING_MIGRATION_AUDIT.md`.
- Auditoría total base: `docs/LUKA_AUDITORIA_TOTAL_FASE_0_2026-09-01.md`.
- Fuentes oficiales: `docs/TRADEMARK_REVIEW_SOURCES_2026-09-01.md`.
- Este expediente debe recibir un SHA-256 después de la validación final y antes de su publicación externa.
