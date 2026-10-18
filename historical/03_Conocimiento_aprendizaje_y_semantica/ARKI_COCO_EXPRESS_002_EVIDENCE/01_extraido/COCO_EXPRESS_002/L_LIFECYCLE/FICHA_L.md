# Ficha compacta — Familia L: Ciclo de vida

**Orden:** COCO-EXPRESS-002 FULL ARSENAL PRETRAINING. **Cobertura:** L1–L9. **Estado:** `PREREQUISITE_TESTED` únicamente para los invariantes y ejercicios descritos; no implica competencia profesional, habilitación, certificación ni emisión de expediente.

## CAPABILITY_ID: L1 — Expediente y memoria vinculada

**NAME:** Expediente trazable con memoria descriptiva vinculada.  
**PURPOSE:** Organizar requisitos, decisiones, fuentes, entregables y revisión humana a lo largo del ciclo de vida, manteniendo cada afirmación enlazada a evidencia y alcance.  
**CORE_CONCEPTS:** entidad documental; versión; dependencia; requisito; memoria; fuente; interpretación; transformación; estado epistemológico; `PASS/CONFLICT/UNKNOWN`; revisión humana; separación entre existencia documental y satisfacción del requisito.  
**PREREQUISITES:** identidad de proyecto y activo; esquema de documentos; control de versiones; autoridad y alcance; unidades, escala, tiempo y escenario; base de auditoría explícita.  
**INPUTS:** requisitos, documentos, planos/modelos, memorias, metadatos de autoría/fecha/versión, observaciones y decisiones.  
**OUTPUTS:** índice del expediente; matriz requisito–evidencia; memoria vinculada; conflictos y desconocidos; registro de revisión.  
**CORE_RELATIONSHIPS:** expediente ↔ memoria ↔ fuente ↔ página/hoja/región ↔ interpretación ↔ transformación ↔ validación; requisito ↔ evidencia ↔ decisión humana.  
**BASIC_METHODS_OR_ALGORITHMS:** inventario; IDs estables; grafo de referencias; validación de enlaces; detección de ausencia/conflicto; hash como integridad de bytes, no como verdad del contenido.  
**COMMON_FAILURES:** vínculo roto; duplicación de fuentes; versión incorrecta; confundir documento existente con requisito satisfecho; ocultar `UNKNOWN`; perder proyecto/fecha/escenario.  
**LIMITS:** no genera un expediente profesional emitible ni sustituye revisión, firma o responsabilidad legal.  
**PROFESSIONAL_BOUNDARY:** la aceptación y suficiencia del expediente corresponden a responsables habilitados y a la autoridad del proyecto.  
**ARKI_EXISTING_KNOWLEDGE:** `ARKI_SOURCE_RESULT_TRACEABILITY_SPEC.md` exige resultado ↔ fuente ↔ página/hoja ↔ región ↔ interpretación ↔ transformación ↔ validación; `ARKI_EVIDENCE_VAULT_SPEC.md` separa existencia, autenticidad, soporte y satisfacción; BKH0 registra `ArkiSnapshot/ArkiVersion` como parcial.  
**ARKI_NEW_TRAINING:** ficha de expediente de ciclo de vida con memoria como relación explícita, metadatos obligatorios y desconocidos preservados.  
**GAPS_REMAINING:** no hay flujo end-to-end demostrado de expediente, control documental regulado, firma ni autoridad transversal implementada.

## CAPABILITY_ID: L2 — Especificaciones técnicas

**NAME:** Especificaciones vinculadas a requisitos, interfaces y evidencias.  
**PURPOSE:** Convertir intención de proyecto en criterios verificables, sin presentar una especificación genérica como aprobación de diseño.  
**CORE_CONCEPTS:** requisito; criterio de aceptación; interfaz; tolerancia; unidad; aplicabilidad; alcance; versión; dependencia; método de verificación.  
**PREREQUISITES:** programa y jurisdicción conocidos; disciplina y escala declaradas; entradas coordinadas; autoridad para aprobar cambios.  
**INPUTS:** requisitos, normas aplicables aportadas por la autoridad, familias/activos, parámetros, interfaces y criterios de prueba.  
**OUTPUTS:** esquema de especificación; matriz requisito–método–evidencia; lista de interfaces y supuestos; conflictos/`UNKNOWN`.  
**CORE_RELATIONSHIPS:** especificación ↔ requisito ↔ objeto/activo ↔ plano/modelo ↔ prueba ↔ evidencia ↔ aprobación humana.  
**BASIC_METHODS_OR_ALGORITHMS:** normalización de campos; chequeo de unidades; matriz de cobertura; comparación de versiones; clasificación `PASS/CONFLICT/UNKNOWN`.  
**COMMON_FAILURES:** copiar límites sin jurisdicción; unidades implícitas; criterio no medible; versión obsoleta; elevar simulación o forecast a aceptación.  
**LIMITS:** no interpreta ni certifica códigos, normas o prestaciones profesionales.  
**PROFESSIONAL_BOUNDARY:** la especificación final, su conformidad normativa y su aceptación requieren especialistas y autoridad contractual.  
**ARKI_EXISTING_KNOWLEDGE:** `ARKI_BIM_REQUIREMENT_MODEL.md` y `ARKI_BIM_AUDIT_MODEL.md` aportan base explícita y estados; `ARKI_BIM_PROFESSIONAL_BOUNDARY.md` separa auditoría BIM de certificación.  
**ARKI_NEW_TRAINING:** cada criterio conserva unidades, escala, aplicabilidad, proyecto, tiempo y escenario, y declara método/evidencia en vez de verdad implícita.  
**GAPS_REMAINING:** no existe catálogo normativo completo ni motor profesional de conformidad o aceptación.

## CAPABILITY_ID: L3 — APU y cantidades con contexto

**NAME:** Análisis de precios unitarios (APU) y cantidades trazables.  
**PURPOSE:** Representar cantidades, recursos, precios y supuestos para planificación/comparación, vinculados a elementos y a su contexto temporal.  
**CORE_CONCEPTS:** QuantityItem; unidad; rendimiento; recurso; precio; costo directo; moneda; fecha de precio; ubicación; escala; incertidumbre; versión.  
**PREREQUISITES:** elementos identificados; reglas de medición; catálogo de recursos; moneda y fecha; alcance y exclusiones.  
**INPUTS:** cantidades, elementos, ítems de precio, rendimientos, precios fuente, ubicación, fecha y escenario.  
**OUTPUTS:** líneas APU; subtotales; supuestos; trazabilidad a elemento; advertencias de cobertura y `UNKNOWN`.  
**CORE_RELATIONSHIPS:** elemento ↔ cantidad ↔ QuantityItem ↔ precio ↔ Budget5D ↔ actividad 4D ↔ expediente.  
**BASIC_METHODS_OR_ALGORITHMS:** cálculo determinista cantidad × precio; agregación; validación dimensional; detección de faltantes; comparación temporal/versionada.  
**COMMON_FAILURES:** mezclar monedas/fechas; doble conteo; precio sin fuente; cantidad no vinculada; usar APU como oferta o compromiso.  
**LIMITS:** no entrega presupuesto contractual, licitación, costos definitivos ni decisión económica.  
**PROFESSIONAL_BOUNDARY:** metrados, costos y contractualización deben ser revisados por profesionales y responsables del contrato.  
**ARKI_EXISTING_KNOWLEDGE:** BKH0 identifica `QuantityItem` y `Budget5D` como existentes y `Activity4D` para precedencias; COCO scope permite fundamentos genéricos, no O&M productivo.  
**ARKI_NEW_TRAINING:** contexto obligatorio de proyecto/tiempo/escenario/escala y separación de cálculo reproducible frente a estimación profesional.  
**GAPS_REMAINING:** no se demostró cobertura de bases de precios, factores locales, indirectos, impuestos, riesgo ni reconciliación contractual.

## CAPABILITY_ID: L4 — Planos coordinados

**NAME:** Coordinación de planos/modelos y conflictos.  
**PURPOSE:** Detectar inconsistencias geométricas o de interfaces entre disciplinas y conservar la base de revisión.  
**CORE_CONCEPTS:** CoordinationNode; bounding box; sistema de referencia; disciplina; clash; tolerancia; versión; severidad; base de auditoría.  
**PREREQUISITES:** modelos/planos con coordenadas y unidades; origen y escala; versiones; tolerancias; reglas de coordinación; revisión humana.  
**INPUTS:** nodos geométricos, relaciones, hojas/modelos, sistemas de coordenadas, tolerancias y escenario de revisión.  
**OUTPUTS:** hallazgos de coordinación; pares en conflicto; no-conflictos bajo la regla; incertidumbres; reporte trazable.  
**CORE_RELATIONSHIPS:** plano ↔ modelo ↔ CoordinationNode ↔ elemento ↔ interfaz ↔ clash ↔ decisión.  
**BASIC_METHODS_OR_ALGORITHMS:** normalización de coordenadas; intersección de cajas; reglas de tolerancia; fingerprint/ID; clasificación y deduplicación de hallazgos.  
**COMMON_FAILURES:** unidades/orígenes mezclados; falso positivo por tolerancia; falso negativo por caja simplificada; tratar screening como aprobación; perder versión.  
**LIMITS:** una detección geométrica no prueba constructibilidad, seguridad, desempeño ni conformidad.  
**PROFESSIONAL_BOUNDARY:** coordinación final, rediseño y aprobación requieren disciplinas responsables.  
**ARKI_EXISTING_KNOWLEDGE:** BKH0 registra `CoordinationNode` con bounding boxes y clash detection; `ElementRelation` incluye `coordinates_with` parcialmente; `ARKI_BIM_AUDIT_MODEL.md` exige base explícita y separa screening de certificación.  
**ARKI_NEW_TRAINING:** todo hallazgo incluye escala, unidades, tolerancia, proyecto, fecha/versión y aplicabilidad.  
**GAPS_REMAINING:** no se demostró coordinación multi-formato completa, reglas disciplinares exhaustivas, revisión de planos sellados ni validación de constructibilidad.

## CAPABILITY_ID: L5 — PKI y confianza documental

**NAME:** Conceptos de PKI, identidad y firma sin implementación certificante.  
**PURPOSE:** Distinguir integridad, autenticidad, identidad, autorización y aceptación de un documento o paquete.  
**CORE_CONCEPTS:** clave pública/privada; certificado; cadena de confianza; revocación; firma; hash; timestamp; identidad; importación; confianza; `UNKNOWN`.  
**PREREQUISITES:** política de confianza; autoridad certificadora; identidad de sujetos; reloj; gestión de claves; jurisdicción; criterios de aceptación.  
**INPUTS:** bytes/documentos, hashes, firmas, certificados, cadena, timestamps, identidad declarada y política aplicable.  
**OUTPUTS:** resultado técnico de verificación; estado de cadena; provenance; advertencias; separación entre integridad y verdad/certificación.  
**CORE_RELATIONSHIPS:** documento ↔ hash ↔ firma ↔ certificado ↔ cadena ↔ identidad ↔ política ↔ decisión humana.  
**BASIC_METHODS_OR_ALGORITHMS:** hashing; verificación criptográfica; validación de cadena/fecha/revocación como conceptos; registro de provenance; estado `UNKNOWN` si falta evidencia.  
**COMMON_FAILURES:** tratar hash como contenido verdadero; import success como autenticidad; certificado válido como aprobación de obra; ignorar revocación/alcance/tiempo.  
**LIMITS:** esta ficha no implementa PKI productiva, firma, emisión de certificados ni verificación legal.  
**PROFESSIONAL_BOUNDARY:** confianza legal, firma y certificación pertenecen a la infraestructura y autoridad competente; ARKI no firma ni certifica.  
**ARKI_EXISTING_KNOWLEDGE:** `COCO_SCOPE_LIMITS.md` excluye PKI y PDF profesional firmado; `ARKI_SOURCE_RESULT_TRACEABILITY_SPEC.md` aporta trazabilidad y BKH0 marca identidad global como parcial.  
**ARKI_NEW_TRAINING:** regla explícita: hash/importación sólo describen integridad/evento, nunca verdad, autenticidad plena o certificación.  
**GAPS_REMAINING:** PKI operativa, gestión de claves, revocación, HSM, identidad legal, firma cualificada y política de confianza no están demostradas.

## CAPABILITY_ID: L6 — As-built

**NAME:** Registro as-built y delta diseño–construido.  
**PURPOSE:** Mantener la diferencia entre lo diseñado, lo instalado/observado y lo desconocido, con trazabilidad de cambios.  
**CORE_CONCEPTS:** design baseline; as-built; observación; evidencia; delta; asset identity; fecha; ubicación; tolerancia; estado epistemológico; handover.  
**PREREQUISITES:** baseline de diseño; identificadores estables; fuentes de campo; método de captura; escala y coordenadas; revisión humana.  
**INPUTS:** modelo/planos de diseño, registros de obra, observaciones, fotos/documentos, cambios, fechas y escenarios.  
**OUTPUTS:** inventario as-built provisional; delta; provenance; conflictos; campos `UNKNOWN`; paquete de entrega para revisión.  
**CORE_RELATIONSHIPS:** diseño ↔ elemento ↔ observación ↔ evidencia ↔ delta ↔ activo ↔ mantenimiento/commissioning.  
**BASIC_METHODS_OR_ALGORITHMS:** mapeo de IDs; comparación de atributos/geometría; registro append-only; clasificación observado/inferido/desconocido; control temporal.  
**COMMON_FAILURES:** importar paquete y declararlo conforme; confundir foto/hash con condición; perder fecha; sobrescribir diseño; omitir incertidumbre.  
**LIMITS:** no inspecciona físicamente ni declara conformidad, seguridad o entrega legal.  
**PROFESSIONAL_BOUNDARY:** levantamiento, aceptación y firma as-built requieren responsables de obra y profesionales competentes.  
**ARKI_EXISTING_KNOWLEDGE:** `COCO_SCOPE_LIMITS.md` reconoce separación diseño/as-built y observaciones sin verdad canónica; BKH0 registra `ConstructionModel`, relaciones e identidad global parcial; `ARKI_FACILITY_LIFECYCLE_MODEL.md` incluye handover.  
**ARKI_NEW_TRAINING:** paquete as-built conserva proyecto/tiempo/escenario/escala, provenance y `UNKNOWN`; importación no eleva el estado epistemológico.  
**GAPS_REMAINING:** no hay captura de campo, survey/escaneo, workflow de redlines ni aceptación as-built end-to-end.

## CAPABILITY_ID: L7 — Commissioning y entrega operativa

**NAME:** Commissioning como verificación, pruebas integradas, aceptación y readiness con evidencia.  
**PURPOSE:** Organizar pruebas de desempeño/función y su evidencia antes de la operación, sin convertir un resultado aislado en certificación.  
**CORE_CONCEPTS:** plan de commissioning; prefuncional; funcional; integrado; criterio; instrumento; resultado; testigo; punch list; aceptación; handover; readiness; escenario.  
**PREREQUISITES:** requisitos y criterios aprobados; sistemas identificados; instrumentos calibrados por tercero competente; secuencias; condiciones de prueba; responsables.  
**INPUTS:** especificaciones; as-built; procedimientos; lecturas; observaciones; simulaciones/forecasts; incidencias; fechas y escenarios.  
**OUTPUTS:** matriz de pruebas; resultados con provenance; punch list; restricciones; estado de aceptación propuesto; paquete de handover.  
**CORE_RELATIONSHIPS:** requisito ↔ procedimiento ↔ activo ↔ lectura/observación ↔ criterio ↔ evidencia ↔ aceptación humana.  
**BASIC_METHODS_OR_ALGORITHMS:** matriz requisito–prueba; control de precondiciones; captura de unidades y contexto; repetibilidad; clasificación pass/fail/unknown; cierre de incidencias.  
**COMMON_FAILURES:** prueba sin condiciones; instrumento sin trazabilidad; simulación presentada como prueba; `PASS` sin criterio; aceptar por hash o import success; no separar observación de conclusión.  
**LIMITS:** no ejecuta commissioning real, no calibra instrumentos, no acepta sistemas ni certifica desempeño.  
**PROFESSIONAL_BOUNDARY:** autoridad de commissioning y profesionales responsables deciden aceptación, seguridad y puesta en servicio.  
**ARKI_EXISTING_KNOWLEDGE:** `ARKI_FACILITY_LIFECYCLE_MODEL.md` define commissioning incluyendo verificación, pruebas integradas, aceptación, handover y readiness cuando existe evidencia; `ARKI_EVIDENCE_VAULT_SPEC.md` separa soporte de requisito.  
**ARKI_NEW_TRAINING:** taxonomía de epistemología y contexto evita que observación/simulación/forecast se conviertan en certificación.  
**GAPS_REMAINING:** no hay procedimientos de sistemas reales, integración de controles, gestión de punch list ni evidencia de aceptación.

## CAPABILITY_ID: L8 — BMS y monitoreo

**NAME:** Modelo conceptual de BMS, señales y monitoreo con contexto.  
**PURPOSE:** Representar puntos, tendencias, alarmas y observaciones para operación y diagnóstico preliminar, sin operar instalaciones reales.  
**CORE_CONCEPTS:** punto; sensor; actuador; unidad; calidad; timestamp; intervalo; alarma; tendencia; setpoint; gateway; control; observación; forecast; escala; contexto.  
**PREREQUISITES:** arquitectura autorizada; nomenclatura; unidades; calibración; ciberseguridad; límites; retención; roles; escenarios normales/falla.  
**INPUTS:** lecturas, metadatos, eventos, topología, setpoints, modelos de simulación y forecasts explícitamente etiquetados.  
**OUTPUTS:** series contextualizadas; estados de calidad; alarmas candidatas; dashboards conceptuales; diagnóstico con `UNKNOWN`; provenance.  
**CORE_RELATIONSHIPS:** activo ↔ punto ↔ sensor/actuador ↔ señal ↔ tendencia ↔ alarma ↔ evento ↔ decisión humana.  
**BASIC_METHODS_OR_ALGORITHMS:** validación de rango/unidad; detección simple de ausencia/outlier; agregación temporal; correlación contextual; separación observación/simulación/forecast.  
**COMMON_FAILURES:** sensor sin calibración; unidad errónea; timestamp ambiguo; forecast tratado como medición; alarma como fallo confirmado; control automático no autorizado.  
**LIMITS:** no BMS productivo, integración OT, control de equipos, mantenimiento predictivo ni seguridad operacional.  
**PROFESSIONAL_BOUNDARY:** operación y control corresponden a operadores, integradores y responsables habilitados; no se deben accionar sistemas desde ARKI.  
**ARKI_EXISTING_KNOWLEDGE:** `COCO_SCOPE_LIMITS.md` excluye BMS, sensores reales y mantenimiento predictivo; el alcance COCO-D conserva observaciones de sensores sin verdad canónica; `ARKI_OBSERVATION_WORKSPACE_SPEC.md` aparece como especificación existente.  
**ARKI_NEW_TRAINING:** campos obligatorios y regla de no verdad para observation/simulation/forecast, con proyecto-tiempo-escenario y escala.  
**GAPS_REMAINING:** no existe conexión BMS real, modelo de puntos productivo, ciberseguridad OT, calibración, alarm management ni validación operativa.

## CAPABILITY_ID: L9 — Fin de vida y circularidad

**NAME:** Planificación conceptual de desmantelamiento, reemplazo, reutilización y cierre.  
**PURPOSE:** Incorporar operación, mantenimiento, rehabilitación, expansión y fin de vida como entradas de diseño y gestión, conservando riesgos y decisiones.  
**CORE_CONCEPTS:** decommissioning; replacement; adaptive reuse; residual life; mantenibilidad; reversibilidad; materiales; residuos; trazabilidad; impacto; riesgo; escenario temporal.  
**PREREQUISITES:** inventario as-built; requisitos legales; peligros; acceso; secuencias; propietarios; datos de materiales; horizonte temporal.  
**INPUTS:** activos, materiales, mantenimiento, impactos, escenarios de retiro/reuso, costos/recursos y restricciones de seguridad.  
**OUTPUTS:** registro de decisiones; escenarios comparables; dependencias; riesgos; requisitos de información para futuro handover; `UNKNOWN` donde falte evidencia.  
**CORE_RELATIONSHIPS:** activo ↔ material ↔ mantenimiento ↔ impacto ↔ escenario ↔ decisión ↔ plan de cierre/reuso.  
**BASIC_METHODS_OR_ALGORITHMS:** inventario; grafo de dependencias; comparación multicriterio explícita; análisis de sensibilidad conceptual; registro temporal y de incertidumbre.  
**COMMON_FAILURES:** asumir vida útil fija; ignorar sustancias peligrosas; tratar forecast como hecho; optimizar costo sin seguridad; perder provenance o escala.  
**LIMITS:** no diseña demolición, gestión de residuos, remediación, seguridad ni valoración legal/ambiental.  
**PROFESSIONAL_BOUNDARY:** planes de cierre y reuso requieren especialistas, permisos, evaluación de riesgos y autoridad competente.  
**ARKI_EXISTING_KNOWLEDGE:** `ARKI_FACILITY_LIFECYCLE_MODEL.md` y `ARKI_INFRASTRUCTURE_LIFECYCLE_MODEL.md` incluyen mantenimiento, rehabilitación, expansión y decommissioning/replacement; `Impact` figura como existente con revisión humana en BKH0.  
**ARKI_NEW_TRAINING:** fin de vida se modela como escenario explícito y no como predicción cierta; se vincula a as-built, impactos y decisiones humanas.  
**GAPS_REMAINING:** no hay LCA/LCC profesional, inventario material completo, normativa local, permisos, plan de residuos ni análisis de seguridad de desmantelamiento.

## Reglas transversales de la familia L

1. Todo resultado conserva **provenance, estado epistemológico, units, applicability, scale** y, cuando corresponde, **project, time y scenario**.
2. `UNKNOWN` es un estado válido y debe conservar su razón; no se rellena por inferencia silenciosa.
3. `simulation`, `observation`, `forecast`, `hash` e `import_success` describen método, lectura, proyección o evento técnico: **no son por sí mismos verdad, autenticidad plena, conformidad ni certificación**.
4. La trazabilidad separa existencia del documento, autenticidad, soporte de la afirmación y satisfacción del requisito.
5. Se reutilizan contratos existentes; no se modifica Product State, BKH, TX, E5–E8 ni PF-H01. Los ejercicios son pruebas locales y no solvers profesionales.

## GAPS_REMAINING consolidado

La cobertura L es conceptual y de preentrenamiento. Permanecen brechas en workflows productivos end-to-end, autoridad humana transversal, normativa/jurisdicción, firma y PKI, captura de campo, coordinación multi-formato, commissioning real, BMS/OT, calibración, seguridad, LCA/LCC, permisos y aceptación profesional. El estado `PREREQUISITE_TESTED` sólo acredita el test pequeño adjunto y sus invariantes; no afirma competencia profesional.
