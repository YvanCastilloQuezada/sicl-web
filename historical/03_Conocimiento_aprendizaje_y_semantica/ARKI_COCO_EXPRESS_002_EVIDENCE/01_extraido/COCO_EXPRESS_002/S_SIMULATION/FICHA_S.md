# COCO-EXPRESS-002 — Familia S: Simulación

**Orden:** `COCO-EXPRESS-002 FULL ARSENAL PRETRAINING`  
**Alcance:** S1–S5: EnergyPlus/OpenStudio; Radiance/DIALux; CFD/OpenFOAM; FDS; acústica.  
**Estado de esta ficha:** `PREREQUISITE_TESTED`. Se probaron invariantes de metadatos y separación epistémica en tres microejercicios propios. Esto **no demuestra competencia profesional**, no ejecuta solvers profesionales y no certifica resultados.

## Regla transversal de interpretación

Una simulación es un resultado condicionado por modelo, geometría, malla, materiales, condiciones de borde, clima o excitación, versión, configuración, unidades y escenario. No es por sí sola verdad física. Una observación, un forecast, un hash coincidente o un import success tampoco se convierten en verdad, fidelidad o certificación. La ausencia de evidencia queda como `UNKNOWN`; no se reescribe como `FALSE` ni como aprobación.

El registro mínimo de cualquier resultado S es: `project`, `time`, `scenario`, `scale`, `units`, `applicability`, `provenance` (`source`, `version`, `evidence_refs`), `epistemic` y `status`. Una afirmación sólo es aplicable a la escala y al dominio declarados. La autoridad humana conserva la decisión, aprobación, firma y publicación.

---

## S1 — EnergyPlus / OpenStudio

**CAPABILITY_ID:** `S1-ENERGY-HVAC`  
**NAME:** Simulación energética y de sistemas del edificio con EnergyPlus/OpenStudio.  
**PURPOSE:** Explorar cargas térmicas, consumo energético y respuesta de HVAC bajo un modelo parametrizado; apoyar comparación de alternativas, no emitir una conformidad ni una garantía de desempeño.  
**CORE_CONCEPTS:** balance de energía; zonas térmicas; envolvente; ganancias internas; infiltración y ventilación; clima y período de simulación; horarios; cargas; equipos y controles; timestep; condiciones iniciales; convergencia; calibración; sensibilidad; escenarios; energía final frente a energía primaria.  
**PREREQUISITES:** geometría y zonificación coherentes; materiales y propiedades con unidades; clima/versionado; horarios y cargas trazables; equipos y controles explícitos; convenciones de orientación; sistema de coordenadas; revisión de mensajes de warning/error; definición de escala y aplicabilidad.  
**INPUTS:** modelo IDF/OSM; geometría; construcción; aperturas y sombreamiento; ocupación/equipamiento/iluminación; HVAC; setpoints; schedules; clima; timestep; período; supuestos y tolerancias; versión del motor; escenario y variante.  
**OUTPUTS:** series de temperatura, humedad, cargas, consumos y estados de equipos; sumarios; warnings/errors; indicadores derivados. Cada salida debe conservar unidades, intervalo temporal, escenario, escala, versión y procedencia.  
**CORE_RELATIONSHIPS:** geometría → superficies/volúmenes → cargas → balance de zona → demanda → equipos/controles → consumos; clima y horarios condicionan todos los términos. La comparación sólo es válida si entradas, períodos, métricas y supuestos permanecen comparables.  
**BASIC_METHODS_OR_ALGORITHMS:** balances horarios o subhorarios; redes de aire y agua; modelos de transferencia térmica; control por setpoint; corrida paramétrica; análisis de sensibilidad; comparación de escenarios; calibración contra medición sólo cuando existen datos independientes. No se implementa aquí ningún solver.  
**COMMON_FAILURES:** unidades o orientación incorrectas; zonas mal cerradas; superficies duplicadas; horarios sin trazabilidad; clima incompatible; equipos sobredimensionados por supuestos; timestep/convergencia ignorados; warnings tratados como éxito; consumo simulado presentado como consumo observado; baseline confundido con forecast o código normativo.  
**LIMITS:** sensibilidad alta a supuestos y calidad de datos; un edificio real tiene operación, fallas y clima distintos del caso modelado; resultados no extrapolan automáticamente a otra escala, estación, uso o jurisdicción; import success sólo confirma lectura parcial del archivo. `UNKNOWN` queda vigente cuando faltan inputs, evidencia o aplicabilidad.  
**PROFESSIONAL_BOUNDARY:** no se declara modelo energético validado, dimensionamiento MEP, cumplimiento normativo, commissioning, predicción garantizada ni firma profesional. Requiere revisión y decisión de profesionales y autoridad humana.  
**ARKI_EXISTING_KNOWLEDGE:** existe un contrato general de simulación aislada y sin mutación canónica en `BKH4_3_SIMULATION_CONTRACT.md` y `shared/arkiSimulationSandbox.ts`; el contrato conserva estados `COMPLETED`, `INVALID`, `UNKNOWN`, `STALE`, `BLOCKED` y `FAILED`, contexto, unidades, tolerancias y procedencia. La evidencia previa de pruebas reporta separación de `UNKNOWN`, determinismo semántico y ausencia de mutación canónica en `BKH4_TX_003C_OUTPUTS.txt`, pero no valida EnergyPlus/OpenStudio.  
**ARKI_NEW_TRAINING:** ficha conceptual para leer un resultado energético como `SIMULATION/COMPUTED`, exigir clima/versión/unidades/escenario/aplicabilidad y separar consumo calculado, observación y forecast; ejercicio NORMAL con proxy energético determinista y metadatos completos.  
**GAPS_REMAINING:** no hay corrida real de EnergyPlus/OpenStudio, validación contra medición, biblioteca de climas/plantillas versionada, verificación de HVAC, calibración, análisis de incertidumbre ni trazabilidad de cada parámetro.

## S2 — Radiance / DIALux

**CAPABILITY_ID:** `S2-LIGHTING-DAYLIGHT`  
**NAME:** Análisis de iluminación natural y artificial mediante Radiance/DIALux.  
**PURPOSE:** Explorar iluminancia, luminancia, deslumbramiento y distribución luminosa en escenarios declarados; no convertir una imagen o métrica en conformidad automática.  
**CORE_CONCEPTS:** transporte de luz; ray tracing; materiales reflectantes/transmisivos; cielo y clima; luminarias; fotometría; posición solar; puntos de cálculo; malla; métricas temporales; glare; adaptación visual; escala y plano de trabajo.  
**PREREQUISITES:** geometría cerrada y orientada; materiales y reflectancias; archivos fotométricos y unidades; ubicación/fecha/hora o clima; altura y malla de cálculo; obstrucciones; versión y parámetros del motor; criterio de aplicabilidad.  
**INPUTS:** escena geométrica; materiales; luminarias y fotometría; cielo/clima; ubicación; calendario; sensores/puntos; reflectancias; parámetros de muestreo; unidades; escenario.  
**OUTPUTS:** iluminancia `lux`, luminancia `cd/m²`, factores o métricas derivadas, imágenes y reportes; hash de artefactos; warnings. Un hash identifica integridad del artefacto registrado, no veracidad física ni certificación.  
**CORE_RELATIONSHIPS:** geometría/materiales/luminarias/cielo → transporte de luz → valores en puntos o imágenes → métricas bajo un criterio. Cambiar malla, reflectancia, cielo o fotometría cambia aplicabilidad y comparabilidad.  
**BASIC_METHODS_OR_ALGORITHMS:** ray tracing Monte Carlo; cálculo puntual y por malla; daylight coefficients; integración temporal; evaluación fotométrica; estudios paramétricos. No se implementan Radiance ni DIALux.  
**COMMON_FAILURES:** fotometría equivocada; reflectancias irreales; unidades o orientación incorrectas; cielo sin fecha/ubicación; malla insuficiente; cámaras o previews interpretadas como decisión; glare omitido; hash o import success presentados como fidelity.  
**LIMITS:** el resultado depende de escena, clima, fotometría, malla y criterio visual; no sustituye medición in situ, revisión de seguridad visual ni juicio de diseño; una escala de habitación no representa automáticamente el edificio.  
**PROFESSIONAL_BOUNDARY:** no se declara cálculo lumínico normativo, certificación, cumplimiento de seguridad, diseño eléctrico ni firma.  
**ARKI_EXISTING_KNOWLEDGE:** el sandbox existente registra `provenance`, `relevantDatasets`, `units`, `tolerances`, fingerprints y consecuencias desconocidas; la doctrina distingue hash, preview e import success de verdad. No existe evidencia leída de una corrida Radiance/DIALux.  
**ARKI_NEW_TRAINING:** ficha para preservar tipo epistémico `INTEGRITY/HASH_MATCH` separado de `SIMULATION/COMPUTED`; ejercicio ADVERSARIAL incluye hash coincidente e import success sin promoverlos a fidelidad o certificación.  
**GAPS_REMAINING:** falta integración real de escenas/fotometría, validación cruzada Radiance–DIALux, medición de iluminancia/glare, biblioteca climática, tolerancias y trazabilidad de versiones/parámetros.

## S3 — CFD / OpenFOAM

**CAPABILITY_ID:** `S3-CFD-FLOW`  
**NAME:** Preparación e interpretación acotada de dinámica de fluidos computacional con OpenFOAM.  
**PURPOSE:** Razonar sobre flujo, presión, temperatura o transporte en un dominio y escenario definidos; comparar hipótesis sin presentar una solución no verificada como campo físico certificado.  
**CORE_CONCEPTS:** conservación de masa/momento/energía; Navier–Stokes; turbulencia; régimen; dominio; malla; condiciones de borde; discretización; solver; residual; convergencia; estabilidad; time step; independencia de malla; validación; incertidumbre.  
**PREREQUISITES:** dominio y escala; propiedades y unidades; entradas/salidas/paredes; régimen y modelo físico; malla de calidad; versión; inicialización; criterios de convergencia; evidencia de independencia y validación apropiadas.  
**INPUTS:** geometría; malla; propiedades; campos iniciales; condiciones de borde; modelo de turbulencia/transferencia; solver/configuración; timestep; tolerancias; escenario; semilla si aplica.  
**OUTPUTS:** campos y series de velocidad, presión, temperatura o especies; residuos; balances; diagnósticos; snapshots; métricas derivadas; estado de convergencia. `CONVERGED` no significa `VALIDATED`; cada campo debe conservar escala, unidades, versión y procedencia.  
**CORE_RELATIONSHIPS:** dominio/malla/modelo/condiciones → discretización → iteraciones → residuos y balances → campo calculado → diagnóstico de sensibilidad/validación. La calidad de la conclusión depende de entradas y de la comparación con evidencia independiente.  
**BASIC_METHODS_OR_ALGORITHMS:** volúmenes finitos; esquemas de discretización; SIMPLE/PIMPLE o equivalentes; modelos RANS/LES según caso; iteración estacionaria o transitoria; estudios de independencia de malla y timestep. No se ejecuta ni implementa OpenFOAM aquí.  
**COMMON_FAILURES:** malla no apta; BC incompatibles; unidades o propiedades erradas; residual usado como única validación; no revisar conservación; turbulencia escogida sin aplicabilidad; flujo transitorio tratado como estacionario; dominio pequeño; extrapolación fuera del rango.  
**LIMITS:** alta dependencia de malla, modelos y BC; soluciones numéricas son aproximaciones condicionadas; no se extrapolan entre escalas o regímenes sin justificación; `UNKNOWN` cuando no hay evidencia suficiente de convergencia, calidad o aplicabilidad.  
**PROFESSIONAL_BOUNDARY:** no se declara predicción CFD validada, seguridad de flujo, diseño de ventilación, estabilidad, incendio o cumplimiento regulatorio.  
**ARKI_EXISTING_KNOWLEDGE:** `shared/arkiSimulationSandbox.ts` conserva estados `FAILED/BLOCKED/UNKNOWN`, contexto de datasets/unidades/tolerancias, no mutación canónica y consecuencias; `BKH4_TX_003C_OUTPUTS.txt` registra pruebas de determinismo, dependencia faltante y resultado desconocido. No existe evidencia de OpenFOAM ejecutado.  
**ARKI_NEW_TRAINING:** mapa de dependencias entre malla, BC, convergencia, validación y aplicabilidad; separación entre resultado computado y validado; regla de escala transferida al ejercicio TRANSFER.  
**GAPS_REMAINING:** no hay generador/verificador de malla, catálogo de casos, ejecución real, validación experimental, incertidumbre, acoplamiento térmico/aire ni control de recursos.

## S4 — FDS

**CAPABILITY_ID:** `S4-FDS-FIRE-SMOKE`  
**NAME:** Simulación computacional de incendio y movimiento de humo con FDS.  
**PURPOSE:** Explorar escenarios de fuego, humo, temperatura y movimiento en un dominio declarado; apoyar preguntas preliminares, no aprobar una estrategia de seguridad ni sustituir ingeniería de protección contra incendios.  
**CORE_CONCEPTS:** fuente de fuego; HRR; combustión; especies; humo; temperatura; ventilación; obstrucciones; compartimentos; malla; timestep; detectores; condiciones iniciales; escenarios; incertidumbre; sensibilidad; tenabilidad.  
**PREREQUISITES:** escenario de incendio y fuente trazables; geometría y aberturas; propiedades; mallas; ventilación; condiciones de borde; versión del solver; criterios de terminación; outputs; criterios y jurisdicción declarados.  
**INPUTS:** archivo FDS; geometría; combustibles/HRR; ventilación y puertas; malla; detectores; condiciones ambientales; duración/timestep; escenarios y supuestos; versión/procedencia.  
**OUTPUTS:** temperatura, visibilidad, concentración, velocidad, presión, tiempos de detección y archivos de visualización. Cada salida requiere unidades, tiempo, ubicación, escenario, escala, versión y status epistémico.  
**CORE_RELATIONSHIPS:** fuente + geometría + ventilación + malla → campos de fuego/humo → indicadores en detectores/recorridos → comparación con criterios explícitos. Un caso calculado no demuestra que el escenario real sea igual.  
**BASIC_METHODS_OR_ALGORITHMS:** resolución numérica de flujo y combustión en malla; transporte de especies/energía; extracción de slices/devices; análisis de escenarios y sensibilidad. No se ejecuta ni implementa FDS aquí.  
**COMMON_FAILURES:** HRR o combustible arbitrario; puertas/ventilación omitidas; malla inadecuada; visibilidad o tenabilidad interpretadas sin criterio; un único escenario tratado como envolvente; output visual presentado como validación; simulación convertida en aprobación.  
**LIMITS:** incertidumbre severa en fuente, ocupación, ventilación y material; resultados dependen de escala temporal y malla; no sustituyen ensayos, inspección, diseño ni normativa jurisdiccional; faltantes permanecen `UNKNOWN`.  
**PROFESSIONAL_BOUNDARY:** no se declara análisis de seguridad contra incendios, evacuación aprobable, certificación, cumplimiento de código ni firma de ingeniería.  
**ARKI_EXISTING_KNOWLEDGE:** la doctrina CORE exige `UNKNOWN`, procedencia, escala, fecha, versión y aplicabilidad, y prohíbe convertir simulación en verdad; el contrato de simulación deja `humanDecisionRequired` cuando hay unknowns o bloqueos. No existe corrida FDS evidenciada.  
**ARKI_NEW_TRAINING:** plantilla para registrar escenario/fuente/malla/versiones y para no confundir visualización o resultado calculado con evidencia suficiente; el ejercicio ADVERSARIAL ejercita la separación entre forecast, observación, integridad e importación.  
**GAPS_REMAINING:** falta caso FDS real, validación de malla y fuente, comparación experimental, criterio de tenabilidad versionado, acoplamiento evacuación–humo y revisión por especialista.

## S5 — Acústica

**CAPABILITY_ID:** `S5-ACOUSTICS`  
**NAME:** Modelado e interpretación preliminar de propagación y niveles acústicos.  
**PURPOSE:** Organizar hipótesis sobre fuentes, caminos, absorción y receptores; comparar alternativas en una escala y escenario explícitos sin emitir conformidad acústica ni certificación.  
**CORE_CONCEPTS:** presión/nivel sonoro; frecuencia; bandas; ponderación A/C/Z; fuente y directividad; distancia; reflexión; absorción; transmisión; reverberación; ruido de fondo; tiempo; receptor; incertidumbre; escala.  
**PREREQUISITES:** tipo y posición de fuente; espectro y unidades; geometría; materiales; receptor; ambiente; horario; escala; criterio de aplicabilidad; mediciones y calibración si se afirma validación.  
**INPUTS:** fuentes; espectros; potencia o presión; geometría; absorción/transmisión; receptores; ponderación; bandas; escenario; tiempo; versión y procedencia.  
**OUTPUTS:** niveles por banda o ponderación, mapas, tiempos de reverberación y comparaciones. Cada salida conserva unidad, frecuencia/ponderación, receptor, tiempo, escala, escenario, aplicabilidad y status.  
**CORE_RELATIONSHIPS:** fuente/espectro + geometría/materiales + trayectorias → nivel en receptor; cambiar receptor, frecuencia, ocupación o materiales cambia la conclusión. Una estimación de habitación no se transfiere al edificio sin justificación.  
**BASIC_METHODS_OR_ALGORITHMS:** propagación geométrica simplificada; suma energética; reflexión/absorción; modelos de tiempo de reverberación; análisis por bandas; comparación con observaciones. No se implementan paquetes acústicos profesionales.  
**COMMON_FAILURES:** sumar dB aritméticamente; mezclar dB(A) con bandas sin declarar; fuente sin espectro/directividad; receptor o tiempo ambiguos; reverberación omitida; medición sin calibración; simulación tratada como observación; transferencia de escala no justificada.  
**LIMITS:** los niveles dependen de fuente, frecuencia, ambiente y receptor; una medición puntual no describe todos los tiempos; un modelo preliminar no es mapa regulatorio ni diagnóstico certificado; `NOT_APPLICABLE` o `UNKNOWN` son resultados válidos.  
**PROFESSIONAL_BOUNDARY:** no se declara evaluación normativa, diseño acústico, control de exposición, impacto ambiental, aislamiento certificado ni firma.  
**ARKI_EXISTING_KNOWLEDGE:** el sandbox existente exige contexto explícito, datasets, unidades, tolerancias, procedencia y status; su prueba previa mantiene `UNKNOWN` y no muta el estado canónico. No existe evidencia de solver o medición acústica integrada.  
**ARKI_NEW_TRAINING:** microejercicio TRANSFER que rechaza convertir una estimación de habitación en afirmación de edificio y conserva `NOT_APPLICABLE`, escala y metadatos; regla explícita de dB/ponderación como unidad contextual, no sólo número.  
**GAPS_REMAINING:** falta motor acústico, medición calibrada, catálogo de materiales por frecuencia, validación, incertidumbre, criterios jurisdiccionales y revisión profesional.

---

## Relaciones transversales S1–S5

La cadena común es `modelo → inputs versionados → método/solver externo → outputs con unidades → diagnóstico → evidencia independiente → aplicabilidad → decisión humana`. Un archivo legible, un hash coincidente, una gráfica atractiva o una corrida sin error no saltan directamente a `VERIFIED`, `TRUE` o `CERTIFIED`. La comparación exige equivalencia de proyecto, tiempo, escenario, escala, unidades, versión y límites de aplicación. Si un componente indispensable falta, el estado es `UNKNOWN`, `BLOCKED` o `NOT_APPLICABLE` según la razón, nunca una aprobación implícita.

## ARKI_EXISTING_KNOWLEDGE consolidado

La reutilización se limita al contrato de simulación ya presente: aislamiento frente al estado canónico, fingerprints, determinismo semántico, estados diferenciados, dependencias explícitas, `humanDecisionRequired`, procedencia y unidades. La evidencia existente documenta pruebas de `CANONICAL_STATE_UNCHANGED`, `SIMULATION_DETERMINISM`, `CONSTRAINT_UNKNOWN`, `MISSING_DEPENDENCY`, `REGENERATION_BLOCKED` y `NO_COMMIT_PATH_CREATED` en `BKH4_TX_003C_OUTPUTS.txt`. Estos resultados validan un **marco de simulación de transacciones**, no los solvers físicos S1–S5.

## ARKI_NEW_TRAINING consolidado

Se agrega conocimiento conceptual de dominio para leer EnergyPlus/OpenStudio, Radiance/DIALux, CFD/OpenFOAM, FDS y acústica bajo metadatos y epistemología común. Se agregan tres microejercicios propios en `EXERCISES_S.txt`, ejecutados con assertions. El runner no implementa solvers, no usa respuestas de exámenes y no altera el código correcto de ARKI.

## GAPS_REMAINING consolidado

No se demostró competencia profesional, validación física, calibración, conformidad normativa, diseño emitible, firma, certificación, integración real de ninguno de los cinco pares/ámbitos, ni revisión humana de un expediente. Permanecen pendientes los datos, versiones, mallas/escenas, criterios jurisdiccionales, validación independiente, incertidumbre, auditoría de parámetros y pruebas de escala.

## References

[1]: https://github.com/NREL/EnergyPlus "EnergyPlus official repository"

[2]: https://openstudio.net/ "OpenStudio official website"

[3]: https://www.radiance-online.org/ "Radiance official website"

[4]: https://www.dialux.com/ "DIALux official website"

[5]: https://www.openfoam.com/ "OpenFOAM official website"

[6]: https://pages.nist.gov/fds-smv/ "NIST Fire Dynamics Simulator and Smokeview documentation"

[7]: https://www.iso.org/standard/67550.html "ISO 16283-1 field measurement of sound insulation"
