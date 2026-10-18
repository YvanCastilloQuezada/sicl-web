# COCO-EXPRESS-002 — Familia T: Ingeniería

**Alcance:** T1–T8: modal, sísmica, cimentaciones, HVAC, sanitario, eléctrico, incendio y gases medicinales. **Estado:** `PARTIAL`. Esta ficha es entrenamiento fundamental y trazabilidad; no declara competencia profesional, no ejecuta solvers de diseño, no certifica ni firma.

## Invariantes transversales

Toda afirmación conserva `UNKNOWN` cuando falta evidencia suficiente. Cada dato debe transportar **provenance, units, applicability, scale** y, cuando aplique, **project, time y scenario**. Un resultado de simulación es una salida epistemológica acotada; una observación no es un hecho canónico; un forecast no es una medición; un hash no es una firma; un import success no prueba fidelidad semántica; y ningún ejercicio produce aprobación, certificación o emisión profesional. La aplicabilidad de una norma no se infiere sólo porque la norma exista: `STANDARD EXISTS ≠ REQUIREMENT APPLIES`.

## T1 — Modal

**CAPABILITY_ID:** `T1-MODAL`

**NAME:** Análisis modal conceptual de sistemas estructurales.

**PURPOSE:** Identificar grados de libertad, rigideces, masas y modos propios como base para razonar sobre respuesta dinámica, sin sustituir un modelo estructural validado.

**CORE_CONCEPTS:** Masa, rigidez, amortiguamiento, grados de libertad, matriz de masa `M`, matriz de rigidez `K`, autovalores y autovectores, período y frecuencia, ortogonalidad, participación modal, condiciones de borde.

**PREREQUISITES:** Geometría y conectividad trazables; unidades coherentes; hipótesis explícitas de masa, rigidez y apoyos; versión del proyecto; escenario de excitación; revisión estructural independiente.

**INPUTS:** Elementos y nodos del modelo, materiales y secciones declarados, masas por nivel o elemento, restricciones, unidades, escala (elemento/sistema/edificio), `projectId`, `time`, `scenario`, evidencia y provenance.

**OUTPUTS:** Representación de entradas; lista conceptual de modos y períodos sólo si se cuenta con un solver autorizado; banderas de datos faltantes; `UNKNOWN` ante modelo incompleto; nunca capacidad resistente, cumplimiento normativo o certificación.

**CORE_RELATIONSHIPS:** `K·φ = λ·M·φ`; período–frecuencia; masa y rigidez condicionan la respuesta; apoyos y diafragmas alteran los grados de libertad; los modos dependen del escenario y de la idealización.

**BASIC_METHODS_OR_ALGORITHMS:** Ensamble conceptual de matrices; detección de nodos o referencias faltantes; comprobación dimensional; inspección de simetría y conectividad; estimación cualitativa de sensibilidad masa–rigidez. No se implementa un solver profesional.

**COMMON_FAILURES:** Masa duplicada o ausente; unidades mezcladas; apoyos libres no intencionales; torsión omitida; modos interpretados como fuerzas de diseño; modelo importado tratado como semánticamente fiel.

**LIMITS:** Sin cálculo profesional de autovalores, amortiguamiento, respuesta espectral, combinaciones, no linealidad ni interacción suelo–estructura.

**PROFESSIONAL_BOUNDARY:** BIM, chequeo sintáctico o salida computada no equivalen a licencia, revisión estructural, memoria firmada ni conformidad legal. Requiere profesional habilitado y norma/jurisdicción verificadas.

**ARKI_EXISTING_KNOWLEDGE:** `shared/structural/index.ts` aporta `StructuralNode`, `StructuralMember`, `StructuralModel` y validación de referencias, con advertencia explícita de solver no profesional. `arkiConstructionOntology.ts` modela columnas, vigas, losas, cimentaciones y relaciones constructivas. `arkiSimulationSandbox.ts` conserva versión base, unidades, tolerancias, provenance y `canonicalMutation: false`.

**ARKI_NEW_TRAINING:** Distinguir prechequeo modal de análisis estructural; preservar el escenario dinámico, la escala y la cadena de evidencia; bloquear la promoción de un resultado calculado a `VERIFIED` sin oráculo/revisión aplicable.

**GAPS_REMAINING:** Solver modal validado; calibración de masas y rigideces; biblioteca normativa jurisdiccional; validación independiente y pruebas de escala real.

## T2 — Sísmica

**CAPABILITY_ID:** `T2-SEISMIC`

**NAME:** Razonamiento sísmico conceptual y gestión de escenarios.

**PURPOSE:** Organizar peligros, demanda, regularidad, derivas, discontinuidades y decisiones de modelado como hipótesis verificables.

**CORE_CONCEPTS:** Peligro sísmico, sitio, categoría de importancia, sistema resistente, diafragma, irregularidad, deriva, cortante basal, combinación de carga, ductilidad, capacidad y demanda.

**PREREQUISITES:** Jurisdicción y edición normativa; estudio geotécnico cuando corresponda; uso y ocupación; geometría y sistema resistente; combinaciones y escenario temporal identificados.

**INPUTS:** Modelo estructural, parámetros de sitio y amenaza con fuente, cargas y combinaciones, propiedades de materiales, escala, unidades, `projectId`, fecha/edición, escenario y evidencia.

**OUTPUTS:** Matriz de supuestos y dependencias; conflictos o datos faltantes; indicadores conceptuales; simulación con estado epistemológico; nunca una demanda de diseño certificada.

**CORE_RELATIONSHIPS:** Amenaza–sitio–demanda; masa–aceleración–fuerza inercial; deriva–rigidez–altura; irregularidad–distribución de demanda; capacidad–detallado–ductilidad. La aplicabilidad normativa depende de jurisdicción, uso, edición y alcance.

**BASIC_METHODS_OR_ALGORITHMS:** Clasificación de escenario; balance dimensional; trazado de ruta de carga; detección de discontinuidades y referencias ausentes; comparación cualitativa de hipótesis. No se ejecuta análisis espectral, pushover, tiempo-historia ni diseño sismorresistente.

**COMMON_FAILURES:** Copiar parámetros de otro proyecto; inventar clase de suelo; tratar un hash o importación IFC exitosa como validación; confundir forecast o simulación con observación; omitir deriva, torsión o interacción.

**LIMITS:** Sin espectro normativo aplicable, análisis dinámico, diseño de conexiones, detallado, evaluación de vulnerabilidad ni dictamen.

**PROFESSIONAL_BOUNDARY:** Una simulación, preview, hash o chequeo de modelo no es certificación sísmica ni autorización de ocupación. La decisión queda en Human Authority y profesional habilitado.

**ARKI_EXISTING_KNOWLEDGE:** `ARKI_STANDARDS_KNOWLEDGE_MODEL.md` separa estado de norma y aplicabilidad; `arkiSimulationSandbox.ts` conserva `UNKNOWN`, provenance, unidades, versión base y decisión humana; el escenario transversal de COCO exige no convertir simulación en verdad.

**ARKI_NEW_TRAINING:** Enlazar cada hipótesis sísmica con proyecto, tiempo, escala y escenario; marcar `UNKNOWN` cuando falte sitio, norma o revisión; probar que import success y hash no elevan el estado epistemológico.

**GAPS_REMAINING:** Parámetros sísmicos oficiales por jurisdicción; geotecnia; solver y benchmark independientes; revisión profesional de derivas, ductilidad y detallado.

## T3 — Cimentaciones

**CAPABILITY_ID:** `T3-FOUNDATIONS`

**NAME:** Razonamiento conceptual de cimentaciones y transferencia suelo–estructura.

**PURPOSE:** Relacionar acciones, geometría de apoyo, suelo, drenaje y constructibilidad para detectar dependencias y solicitar evidencia faltante.

**CORE_CONCEPTS:** Capacidad portante, asentamiento, excentricidad, presión de contacto, deslizamiento, volteo, punzonamiento, socavación, nivel freático, interacción suelo–estructura, secuencia constructiva.

**PREREQUISITES:** Informe geotécnico vigente; cargas y combinaciones; topografía; nivel freático; agresividad del suelo; restricciones vecinas; criterios y norma aplicables.

**INPUTS:** Tipo y dimensiones conceptuales de apoyo, reacciones, suelo y agua con fuente, cotas, materiales, escala, unidades, proyecto, fecha, escenario de carga y evidencia.

**OUTPUTS:** Registro de supuestos; mapa de dependencias y riesgos; comprobaciones aritméticas básicas sólo como screening; `UNKNOWN` si faltan suelo, cargas o trazabilidad; no dimensiones finales.

**CORE_RELATIONSHIPS:** Reacción–presión–área; excentricidad–distribución de presión; suelo–asentamiento; agua–efectivo–estabilidad; carga sísmica–deslizamiento/volteo; detalle y secuencia–constructibilidad.

**BASIC_METHODS_OR_ALGORITHMS:** Control de unidades; balance de fuerzas y momentos; detección de entradas incompletas; comparación de casos y sensibilidad cualitativa; revisión de coherencia entre cimentación, columna y modelo constructivo. No se ejecuta diseño geotécnico.

**COMMON_FAILURES:** Usar capacidad portante genérica; olvidar agua o socavación; mezclar servicio y resistencia; aceptar reacciones sin provenance; confundir metrado con capacidad; ignorar excavación y edificios vecinos.

**LIMITS:** Sin estudio de suelo, cálculo de asentamientos, estabilidad global, diseño de acero/concreto, interacción avanzada o aprobación de excavación.

**PROFESSIONAL_BOUNDARY:** El screening no autoriza construcción ni reemplaza firma geotécnica/estructural, ensayos ni permisos.

**ARKI_EXISTING_KNOWLEDGE:** `arkiConstructionOntology.ts` representa `foundations`, elementos constructivos, relaciones, metrados, interferencias y gates de revisión especialista. `arkiBIM_PROFESSIONAL_BOUNDARY.md` establece que auditoría BIM no es certificación de ingeniería.

**ARKI_NEW_TRAINING:** Mantener separados modelo de diseño, observación de campo y as-built; propagar `UNKNOWN` por ausencia de geotecnia; tratar una cantidad calculada como cantidad, no como validación de capacidad.

**GAPS_REMAINING:** Geotecnia real; ensayos; modelos constitutivos; solvers de asentamiento/estabilidad; coordinación y revisión profesional en sitio.

## T4 — HVAC

**CAPABILITY_ID:** `T4-HVAC`

**NAME:** Balance conceptual de climatización, ventilación y confort.

**PURPOSE:** Organizar cargas, caudales, zonificación, aire exterior, presión y operación sin declarar desempeño certificado.

**CORE_CONCEPTS:** Carga sensible/latente, caudal, renovación, aire exterior, temperatura, humedad, presión, zonificación, filtración, recuperación, control, puesta en marcha.

**PREREQUISITES:** Programa y ocupación; clima y horario; envolvente; cargas internas; calidad de aire; criterios de confort; equipos y red; norma y escala aplicables.

**INPUTS:** Espacios y áreas/volúmenes, condiciones de diseño, cargas, caudales, equipos, ductos, setpoints, horarios, unidades, proyecto, tiempo, escenario operativo, provenance y evidencia.

**OUTPUTS:** Balance preliminar de caudal/energía; lista de supuestos; conflictos de red y capacidad no demostrada; observaciones con unidad; `UNKNOWN` si faltan medición, calibración o estado operativo.

**CORE_RELATIONSHIPS:** Carga–caudal–temperatura; aire exterior–ocupación–calidad; red–pérdida de carga–ventilador; envolvente–ganancia; control–setpoint–operación; HVAC–eléctrico–incendio.

**BASIC_METHODS_OR_ALGORITHMS:** Conservación de masa y energía en forma conceptual; suma de caudales; chequeo dimensional; comparación diseño–observación; detección de zonas y dependencias; no EnergyPlus, CFD ni dimensionamiento profesional.

**COMMON_FAILURES:** Tomar un caudal observado como cumplimiento; mezclar `m³/h`, `L/s` y ACH; ignorar simultaneidad; confundir potencia nominal con capacidad disponible; validar confort sin calibración ni escenario.

**LIMITS:** Sin simulación energética profesional, CFD, selección final, acústica detallada, control implementado ni commissioning certificado.

**PROFESSIONAL_BOUNDARY:** Un balance o forecast es apoyo al razonamiento; no es garantía de confort, IAQ, eficiencia, seguridad ni aceptación de obra.

**ARKI_EXISTING_KNOWLEDGE:** `ConstructionSpace` y `ConstructionModel` aportan espacios, áreas, alturas, requisitos y relaciones; `arkiCocoOm.ts` conserva observaciones de sensores con unidad, tiempo, calidad y fuente; el escenario COCO registra red HVAC con capacidad no demostrada.

**ARKI_NEW_TRAINING:** El microejercicio NORMAL suma observaciones de caudal y conserva `UNKNOWN`; entrena la distinción entre medición puntual, diseño, operación y verificación.

**GAPS_REMAINING:** Datos climáticos y ocupacionales validados; modelado energético/CFD; balanceo real; sensores calibrados; commissioning y revisión profesional.

## T5 — Sanitario

**CAPABILITY_ID:** `T5-SANITARY`

**NAME:** Topología y razonamiento conceptual de instalaciones sanitarias.

**PURPOSE:** Relacionar consumo, evacuación, ventilación, pendientes, aparatos, reservación y riesgos de contaminación.

**CORE_CONCEPTS:** Continuidad hidráulica, caudal probable, presión, pérdidas, pendiente, gravedad, ventilación sanitaria, sifón, separación de redes, retorno, drenaje y mantenimiento.

**PREREQUISITES:** Programa de aparatos; fuente y descarga; cotas; demanda; materiales; ubicación de registros; norma/jurisdicción; coordinación con estructura, arquitectura, incendio y gases.

**INPUTS:** Nodos, conectores, diámetros nominales, cotas, pendientes, caudales, presiones, equipos, unidades, escala, proyecto, tiempo/escenario y provenance.

**OUTPUTS:** Grafo de red; conexiones faltantes; conflictos e interfaces; balance conceptual; `UNKNOWN` ante topología o evidencia incompleta; no dimensionamiento final.

**CORE_RELATIONSHIPS:** Aparato–ramal–colector; pendiente–gravedad–cota; presión–pérdida–elevación; ventilación–sifón; sanitario–estructura–reserva de pases; red–mantenimiento–accesibilidad.

**BASIC_METHODS_OR_ALGORITHMS:** Validación de nodos y conectores; continuidad cualitativa; detección de ciclos/ramas y conexiones huérfanas; chequeo de unidades y cotas; no solver profesional de redes.

**COMMON_FAILURES:** Confundir diámetro nominal con caudal garantizado; omitir ventilación; conectar redes incompatibles; aceptar DWG sin semántica; ignorar cotas, limpieza o retorno de olores.

**LIMITS:** Sin cálculo de demanda normativa, pérdidas detalladas, golpe de ariete, calidad de agua, tratamiento ni aprobación sanitaria.

**PROFESSIONAL_BOUNDARY:** La topología revisada es un artefacto de coordinación, no un permiso, prueba de salubridad ni diseño firmado.

**ARKI_EXISTING_KNOWLEDGE:** `shared/mep/index.ts` valida nodos/conectores y devuelve `NOT_DEMONSTRATED` si faltan referencias; `arkiConstructionOntology.ts` incluye especialidad sanitaria e interferencias; `MepModel` separa disciplina y conectividad.

**ARKI_NEW_TRAINING:** Extender la disciplina de conectividad hacia unidades, cotas, escala y aplicabilidad; pedir evidencia de pendiente, prueba y fuente antes de elevar estado.

**GAPS_REMAINING:** Biblioteca de reglas jurisdiccionales; cálculo de demanda; hidráulica detallada; pruebas de estanqueidad/calidad; revisión profesional.

## T6 — Eléctrico

**CAPABILITY_ID:** `T6-ELECTRICAL`

**NAME:** Razonamiento conceptual de distribución eléctrica y seguridad.

**PURPOSE:** Organizar cargas, circuitos, protecciones, puesta a tierra, continuidad de servicio y coordinación con otros sistemas.

**CORE_CONCEPTS:** Potencia, tensión, corriente, factor de potencia, caída de tensión, cortocircuito, selectividad, puesta a tierra, protección diferencial, emergencia, cargas esenciales.

**PREREQUISITES:** Inventario de cargas; tensión y esquema; demanda y simultaneidad; fuente; clasificación de locales; coordinación de protecciones; norma y autoridad aplicables.

**INPUTS:** Paneles, alimentadores, cargas, tensiones, corrientes, protecciones, conductores, longitudes, tierra, unidades, escala, proyecto, tiempo, escenario y provenance.

**OUTPUTS:** Diagrama/topología; sumas de carga y banderas dimensionales; dependencias y riesgos; `UNKNOWN` ante datos de placa, cortocircuito o norma faltantes; no planos aprobables.

**CORE_RELATIONSHIPS:** Carga–corriente–conductor; longitud–impedancia–caída; falla–protección–selectividad; tierra–tensión de contacto; emergencia–prioridad–transferencia; eléctrico–HVAC–incendio–gases.

**BASIC_METHODS_OR_ALGORITHMS:** Sumas con unidades; ley de Ohm y potencia como screening; validación de conectividad; detección de circuitos sin protección o fuente; no cálculo profesional de cortocircuito, arco, coordinación ni puesta a tierra.

**COMMON_FAILURES:** Mezclar kW/kVA/A; usar potencia instalada como demanda; ignorar armónicos; declarar seguridad por importación o hash; omitir cargas esenciales, redundancia o prueba.

**LIMITS:** Sin cálculo de cortocircuito, coordinación, arc-flash, luminotecnia, puesta a tierra, inspección ni certificación.

**PROFESSIONAL_BOUNDARY:** Ninguna salida autoriza energización, inspección aprobatoria o firma eléctrica.

**ARKI_EXISTING_KNOWLEDGE:** `arkiConstructionOntology.ts` liga partidas y especialidades; `arkiCocoDossier.ts` exige estado, responsabilidad, trazabilidad, provenance y unknowns; COCO limita explícitamente solvers MEP profesionales.

**ARKI_NEW_TRAINING:** Preservar unidad y escenario operativo en sumas de carga; separar cálculo computado, observación de campo y aprobación; relacionar cambios con proyecto/versionado.

**GAPS_REMAINING:** Datos de red y utility; modelos de falla; coordinación normativa; medición de calidad de energía; revisión, ensayo y firma profesional.

## T7 — Incendio

**CAPABILITY_ID:** `T7-FIRE`

**NAME:** Razonamiento conceptual de protección contra incendio y evacuación.

**PURPOSE:** Detectar dependencias entre ocupación, carga de fuego, detección, alarma, compartimentación, rociadores, rutas y respuesta.

**CORE_CONCEPTS:** Peligro, carga de fuego, sectorización, resistencia al fuego, detección, alarma, supresión, evacuación, humo, redundancia, disponibilidad y mantenimiento.

**PREREQUISITES:** Uso y ocupación; aforo; geometría y rutas; combustibles; autoridad competente; edición normativa; interfaces eléctricas, HVAC, sanitario y gases.

**INPUTS:** Espacios, ocupación, puertas y rutas, elementos con resistencia declarada, dispositivos, zonas, caudales/presiones, alimentación, unidades, escala, proyecto, tiempo, escenario y evidencia.

**OUTPUTS:** Matriz de riesgos e interfaces; trazado de rutas y dependencias; inconsistencias; `UNKNOWN` ante fuente/edición/prueba faltante; no cálculo FDS, hidráulico o certificado.

**CORE_RELATIONSHIPS:** Ocupación–evacuación; sectorización–humo; detección–alarma–respuesta; supresión–agua–energía; HVAC–control de humo; puerta–ruta–aforo; mantenimiento–disponibilidad.

**BASIC_METHODS_OR_ALGORITHMS:** Grafo de rutas y conectividad; conteo y consistencia de dispositivos; chequeo de evidencia de resistencia; clasificación de aplicabilidad; no FDS, egress final, hidráulica de rociadores ni aprobación.

**COMMON_FAILURES:** Tratar una ruta dibujada como ruta aprobada; asumir resistencia por material nominal; mezclar norma y jurisdicción; omitir interfaces y pruebas; convertir simulación de humo en seguridad real.

**LIMITS:** Sin modelado de humo, hidráulica, cálculo de evacuación normativo, ensayo de alarma, inspección ni aprobación de autoridad.

**PROFESSIONAL_BOUNDARY:** La revisión conceptual no garantiza vida, operación o cumplimiento; requiere autoridad competente, profesionales y ensayos aplicables.

**ARKI_EXISTING_KNOWLEDGE:** `arkiConstructionOntology.ts` contiene resistencia al fuego por capa, aberturas y especialidad de seguridad; `arkiCocoDossier.ts` permite trazabilidad y estados `UNKNOWN`; el escenario transversal exige verificar la fuente y vigencia de restricciones de evacuación.

**ARKI_NEW_TRAINING:** Diferenciar requisito aplicable de norma existente; preservar evidencia de prueba, versión y escenario; marcar una simulación o dibujo como no concluyente.

**GAPS_REMAINING:** Normativa vigente por jurisdicción; modelos hidráulicos y de humo; ensayos de campo; integración de alarma; revisión y aprobación de autoridad.

## T8 — Gases medicinales

**CAPABILITY_ID:** `T8-MEDICAL_GAS`

**NAME:** Topología y prechequeo de gases medicinales.

**PURPOSE:** Modelar fuentes, ramales, válvulas, alarmas, tomas y separación de gases como sistema crítico, sin commissioning ni certificación clínica.

**CORE_CONCEPTS:** Identidad del gas, pureza, presión, caudal, simultaneidad, fuente primaria/reserva, alarmas, válvulas de zona, redundancia, compatibilidad, trazabilidad y pruebas.

**PREREQUISITES:** Programa clínico; gases autorizados; demanda y simultaneidad; esquema de fuentes; clasificación de áreas; norma/edición; procedimientos de prueba y autoridad clínica.

**INPUTS:** Nodos y conectores, gas y dirección, presión/caudal, válvulas, alarmas, fuentes, tomas, unidades, escala, proyecto, tiempo, escenario de demanda, provenance y evidencia.

**OUTPUTS:** Grafo y conexiones faltantes; inventario de supuestos; observaciones de presión con calidad; `UNKNOWN` ante identidad, prueba o simultaneidad faltante; no liberación clínica.

**CORE_RELATIONSHIPS:** Fuente–reserva–red; gas–conector–toma; simultaneidad–caudal–presión; válvula–zona–alarma; identidad–compatibilidad–seguridad; prueba–commissioning–aceptación.

**BASIC_METHODS_OR_ALGORITHMS:** Validación de nodos/conectores; chequeo de gas y unidades; detección de ramas huérfanas; separación diseño–as-built–observación; no dimensionamiento, pureza, leak test ni commissioning profesional.

**COMMON_FAILURES:** Tratar presión puntual como disponibilidad; no identificar el gas; asumir que continuidad topológica prueba limpieza; omitir alarmas/reserva; aceptar un forecast o import como verdad.

**LIMITS:** Sin cálculo de red, ensayos de identidad/pureza/fugas, validación de alarmas, commissioning clínico, gestión de riesgo ni aprobación sanitaria.

**PROFESSIONAL_BOUNDARY:** Cualquier uso clínico exige profesionales habilitados, pruebas documentadas, autoridad responsable y procedimientos aplicables. ARKI no libera ni certifica la red.

**ARKI_EXISTING_KNOWLEDGE:** `shared/mep/index.ts` ya soporta disciplina `medical-gas`, fuentes, ramas, dispositivos, conectores y estado `NOT_DEMONSTRATED`; `arkiCocoOm.ts` conserva observaciones con unidad, tiempo, calidad y fuente; `sensorIsCanonical()` es deliberadamente falso.

**ARKI_NEW_TRAINING:** El ejercicio TRANSFER conserva una lectura de presión como observación `UNKNOWN`, con unidad, escala, aplicabilidad, proyecto, tiempo, escenario y provenance; entrena transferencia de invariantes sin convertirla en commissioning.

**GAPS_REMAINING:** Normas y procedimientos clínicos aplicables; pruebas de pureza/fugas; cálculo de simultaneidad; alarmas y redundancia reales; commissioning y autoridad clínica.

## Evidencia de ejecución y decisión de estado

Se ejecutó un test pequeño propio en un scratch aislado. Resultado: `NORMAL PASS`, `ADVERSARIAL PASS`, `TRANSFER PASS` y un mutante controlado de promoción indebida a `VERIFIED` fue detectado (`MUTANT_KILLED=1`). Los casos son sintéticos y no proceden de exámenes conocidos. La evidencia prueba invariantes de datos y precondiciones de entrenamiento, no competencia profesional ni validez de diseño. Por ello el estado global es **`PARTIAL`**.

No se modificaron Product State, BKH, TX, E5–E8 ni PF-H01. No se añadió solver profesional, firma, certificación ni respuesta de examen.

## References

[1]: /home/ubuntu/generador-familias/shared/structural/index.ts "ARKI structural validation primitives"
[2]: /home/ubuntu/generador-familias/shared/mep/index.ts "ARKI MEP topology and medical-gas types"
[3]: /home/ubuntu/generador-familias/shared/arkiConstructionOntology.ts "ARKI construction ontology and specialist-review gates"
[4]: /home/ubuntu/generador-familias/shared/arkiSimulationSandbox.ts "ARKI simulation epistemic and canonical-mutation boundary"
[5]: /home/ubuntu/generador-familias/shared/arkiCocoOm.ts "ARKI O&M observations and as-built separation"
[6]: /home/ubuntu/generador-familias/ARKI_STANDARDS_KNOWLEDGE_MODEL.md "ARKI standards applicability model"
[7]: /home/ubuntu/generador-familias/COCO/COCO_SCOPE_LIMITS.md "ARKI COCO scope and professional limits"
[8]: /home/ubuntu/generador-familias/COCO_EXPRESS_002/EXERCISES/TRANSVERSE_SCENARIO.md "COCO-EXPRESS-002 synthetic transfer scenario"
