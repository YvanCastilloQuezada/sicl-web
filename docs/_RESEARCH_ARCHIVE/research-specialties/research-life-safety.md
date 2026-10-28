# ARKI — Seguridad, evacuación, incendios y defensa civil

**Estado de investigación:** 21 de septiembre de 2026. Este documento es una base de estudio y de diseño de entradas y controles preventivos para ARKI. **No es una certificación, una memoria de seguridad, una aprobación municipal ni una opinión legal.** Cuando una cuestión no pudo verificarse de forma suficiente se marca **UNKNOWN**.

## Resumen ejecutivo

El bloque debe tratar la seguridad como una cadena completa: seguridad y salud durante la obra, seguridad de la edificación terminada, ocupación y aforo, medios de evacuación, protección activa y pasiva contra incendios, accesibilidad, defensa civil/gestión del riesgo, y continuidad de operaciones. La relación causal es importante: el uso y la carga de ocupantes determinan el aforo; el aforo y la geometría determinan la capacidad y configuración de los medios de evacuación; el riesgo de incendio y la estrategia de protección determinan compartimentación, resistencia al fuego, detección, alarma, extinción y control de humos; el plan operativo determina cómo se mantiene, prueba y usa todo ello.

Para **Perú**, las anclas principales son el **Reglamento Nacional de Edificaciones (RNE)**, en particular A.130 “Requisitos de Seguridad”, A.120 “Accesibilidad Universal en Edificaciones” y G.050 “Seguridad durante la construcción”; la Ley 29783 y su reglamento para seguridad y salud en el trabajo; el marco SINAGERD de la Ley 29664; y el procedimiento de Inspección Técnica de Seguridad en Edificaciones (**ITSE**) con sus documentos vigentes. El RNE A.130 publicado por el MVCS contiene requisitos mínimos y declara como objetivo salvaguardar vidas, preservar patrimonio y continuidad de la edificación [1]. El compendio RNE del MVCS lista A.130 como DS 017-2012 y A.120 como RM 075-2023-VIVIENDA [2].

Hay una cautela normativa crítica: el 15 de julio de 2026 el MVCS publicó la **RM 264-2026-VIVIENDA**, que dispone publicar el **proyecto** de modificación de A.130 [3]. La página consultada no demuestra que el proyecto haya sido aprobado como norma final. Por tanto, ARKI debe versionar la norma y marcar **UNKNOWN** la vigencia de cualquier texto de revisión hasta verificar una publicación aprobatoria posterior en el diario oficial o en el MVCS. No debe mezclar el proyecto con el A.130 vigente.

Las referencias internacionales sirven como criterios de aprendizaje o comparación, no sustituyen la norma peruana aplicable. NFPA explica los conceptos de *exit access*, *exit* y *exit discharge*, además de distancia de recorrido, recorrido común, callejones sin salida y separación entre salidas; la propia página advierte que es un artículo explicativo y remite a NFPA 101 para los requisitos completos [8]. ISO 45001 aporta un sistema de gestión de seguridad y salud ocupacional, incluyendo identificación de peligros, evaluación de riesgos, preparación ante emergencias, investigación y mejora continua [9]. ISO 22301 aporta el marco de gestión de continuidad para proteger, responder y recuperarse de incidentes disruptivos [10]. OSHA 1910.38 es una referencia estadounidense que exige, cuando aplica su marco, un plan escrito de emergencia con reporte, evacuación, funciones críticas, conteo de personas, rescate/atención médica, responsables, alarmas, entrenamiento y revisión [7]. ISO 23601:2009 sobre planos de escape está retirada y reemplazada por ISO 23601:2020; por ello, usar la edición 2009 como requisito actual sería incorrecto [6].

**Conclusión de producto:** ARKI puede ayudar a recopilar datos, detectar inconsistencias, calcular o comprobar trazabilidad de supuestos y generar listas de verificación. No debe declarar “cumple”, “aprobado”, “ITSE favorable”, “seguro” o “conforme” sin una revisión competente, la versión normativa correcta, evidencias documentales y, cuando corresponda, la autoridad o profesional responsable.

## 1. Materias curriculares que ARKI debe estudiar

Se proponen **12 materias**. Cada una debe terminar en conocimiento verificable, trazabilidad de fuentes, condiciones de aplicabilidad, datos requeridos y límites de automatización.

1. **Marco regulatorio peruano y control de versiones.** RNE, jerarquía normativa, fecha de aprobación, modificaciones, disposiciones transitorias, ordenanzas y exigencias sectoriales. Debe distinguir una norma vigente de un proyecto, una guía y una práctica recomendada. La RM 264-2026-VIVIENDA es un caso de prueba: publicación de proyecto, no evidencia por sí sola de aprobación final [3].

2. **Seguridad y salud en el trabajo durante la construcción.** G.050, Ley 29783 y su reglamento; identificación de peligros, evaluación de riesgos, controles jerárquicos, capacitación, equipos de protección personal, contratistas, incidentes y supervisión. G.050 declara aplicación nacional a actividades comprendidas en su campo y obligaciones para empleadores y trabajadores de la actividad [4].

3. **Organización segura de la obra y riesgos temporales.** Delimitación de frentes, almacenamiento, combustibles, gases, materiales peligrosos, residuos, circulación peatonal y de maquinaria, instalaciones eléctricas provisionales, trabajos en altura, excavaciones, izaje y espacios confinados. La obra cambia, por lo que el modelo debe tener estados por fase y no tratar el plano final como si describiera la obra en curso [4].

4. **Defensa civil y gestión del riesgo de desastres.** SINAGERD, responsabilidades institucionales, prevención, reducción del riesgo, preparación, respuesta y rehabilitación. La Ley 29664 crea el sistema nacional; ARKI debe diferenciar gestión del riesgo de desastres de la sola protección contra incendios [5]. El detalle de roles, formatos y procedimientos municipales debe verificarse por jurisdicción: **UNKNOWN** en ausencia de localidad y expediente concretos.

5. **ITSE y evidencia para inspección de seguridad en edificaciones.** Tipo de ITSE, calificación de riesgo, planos, aforo, arquitectura, rutas, señalización, instalaciones eléctricas, plan de seguridad y protocolos de prueba y mantenimiento. El manual consultado pide, para ITSE de detalle, entre otros, plano de arquitectura con uso, mobiliario, giros de puertas y medios de evacuación; cálculo de aforo; planos de señalización y rutas; plan de seguridad; y protocolos de operatividad y mantenimiento según corresponda [11]. ARKI debe producir un expediente trazable, no un certificado.

6. **Clasificación de ocupación, usos y aforo.** Uso principal y usos simultáneos, mobiliario fijo, densidad, aforo por ambiente/nivel/piso y aforo total. A.130 remite el cálculo a las normas tipológicas A.020–A.110 y prohíbe superar el aforo calculado [1]. Si un espacio tiene usos distintos debe analizarse el uso de mayor densidad para el cálculo indicado por la norma; no se debe escoger el resultado más conveniente.

7. **Medios de evacuación y circulación.** Acceso a salida, salida protegida, descarga a vía pública o área segura, puertas, pasajes, escaleras, rampas, recorridos, obstrucciones, recorrido común, callejones sin salida y separación de salidas. A.130 trata los medios como componentes para canalizar ocupantes hacia la vía pública o áreas seguras y exige mantenerlos libres de obstáculos [1]. NFPA es útil para vocabulario y razonamiento comparativo, pero sus valores no deben trasladarse automáticamente a Perú [8].

8. **Protección pasiva contra incendios.** Compartimentación, barreras, cerramientos, sellos de penetración, puertas y herrajes cortafuego, resistencia al fuego, control de humo y continuidad de la envolvente. Deben estudiarse certificados, ensayos, compatibilidad de sistemas y detalles de obra. ARKI no debe inferir una resistencia al fuego por el nombre comercial del material ni por una imagen sin ficha/ensayo aplicable.

9. **Protección activa y respuesta al incendio.** Extintores, detección, alarma, gabinetes, redes y abastecimiento de agua, rociadores, extracción o control de humos, presurización y comunicación de emergencia, según uso, altura, riesgo y norma aplicable. La necesidad exacta de un sistema depende del caso; si no están disponibles uso, riesgo, altura, área, sótanos y ocupación, el resultado debe ser **UNKNOWN**, no “no aplica”.

10. **Señalización e iluminación de emergencia.** Señales de salida y dirección, identificación de equipos, visibilidad, continuidad de ruta, alumbrado de emergencia, autonomía, pruebas y mantenimiento. G.050 exige señalizar vías, salidas y zonas seguras de obra conforme a normas técnicas peruanas vigentes y dispone iluminación de emergencia cuando el alumbrado falla [4]. A.130 contiene requisitos de señalización e iluminación para medios de evacuación [1].

11. **Accesibilidad universal y evacuación inclusiva.** A.120 vigente, rutas accesibles, desniveles, rampas, puertas, servicios, ascensores, señalización, usuarios con movilidad, visión o audición diversas, refugios y evacuación asistida. Accesibilidad de uso cotidiano y evacuación no son idénticas: una ruta accesible no demuestra por sí sola que exista una estrategia de evacuación inclusiva. La ADA estadounidense puede servir para comparar el principio de conectar entradas y espacios accesibles, pero no sustituye A.120 [12].

12. **Continuidad operativa, mantenimiento y verificación.** Funciones críticas, dependencias de energía, agua, comunicaciones, datos, accesos, equipos de seguridad y proveedores; niveles mínimos de servicio; respaldo; recuperación; simulacros; inspección; pruebas; registros; gestión de cambios. ISO 22301 es una referencia de sistema de continuidad, no un permiso peruano de operación [10]. La continuidad de la edificación mencionada en A.130 y la continuidad del negocio/servicio deben mapearse, pero no confundirse [1].

## 2. Anclas normativas y cómo debe usarlas ARKI

| Jurisdicción | Fuente | Qué ancla | Uso y límite para ARKI |
|---|---|---|---|
| Perú | RNE A.130, DS 017-2012-VIVIENDA, publicación oficial [1] [2] | Seguridad, prevención de siniestros, ocupantes, aforo, puertas, medios de evacuación, señalización, barreras y sistemas de protección | Base normativa peruana del bloque. Debe aplicarse con la norma tipológica del uso y el expediente real. No declarar cumplimiento automático. |
| Perú | RNE A.120, RM 075-2023-VIVIENDA, y ficha oficial de modificaciones [2] [13] | Accesibilidad universal en edificaciones | Usar la versión publicada vigente y controlar sus modificaciones. **UNKNOWN** si una municipalidad aplica una regla local adicional no ingresada. |
| Perú | RNE G.050, DS 010-2009, publicación oficial [4] | Seguridad durante construcción, organización de obra, riesgos, evacuación temporal, señalización e iluminación | Aplicar a la fase de obra y a su evolución. No usarlo como sustituto de la seguridad de la edificación terminada. |
| Perú | Ley 29783 y DS 005-2012-TR, reglamento consultado [14] | Sistema de gestión SST, obligaciones, capacitación, EPP, emergencias e investigación | Ancla laboral/SST. Verificar texto oficial consolidado y modificatorias antes de una decisión jurídica. El PDF consultado es un repositorio institucional del reglamento; la ley completa y modificaciones deben comprobarse en fuente oficial vigente. |
| Perú | Ley 29664 SINAGERD, publicación INDECI [5] | Sistema nacional de gestión del riesgo de desastres | Base institucional de defensa civil/GRD. No equivale por sí sola a un diseño de evacuación ni a un certificado ITSE. |
| Perú | Reglamento y Manual ITSE; manual CENEPRED consultado [11] | Tipo de inspección, expediente, planos, aforo, plan de seguridad, pruebas y mantenimiento | Usar para preparar evidencias y detectar faltantes. El procedimiento y formatos deben verificarse en la versión vigente y en la municipalidad competente. |
| Perú | NTP citadas por G.050, incluida NTP 399.010 | Señalización, extintores y otros temas técnicos citados por la norma | Verificar edición vigente, alcance y disponibilidad legal; no reconstruir el contenido de una NTP desde un resumen. |
| Perú | RM 264-2026-VIVIENDA [3] | Proyecto de revisión de A.130 publicado para comentarios | **No es ancla vigente demostrada.** Registrar como propuesta y bloquear su uso como requisito, salvo verificación posterior de aprobación. |
| Internacional | NFPA 101 y explicación oficial NFPA [8] | Modelo reconocido para ocupación, egreso, recorrido, salidas y protección | Referencia comparativa y de diseño cuando el contrato o autoridad la adopte. No reemplaza RNE ni convierte un proyecto peruano en “NFPA compliant”. El artículo consultado no es el código completo. |
| Internacional | ISO 45001:2018 [9] | Sistema de gestión SST, riesgos, emergencias, auditoría y mejora | Marco de gestión; no fija por sí solo anchos, aforos, resistencia al fuego ni aprobación de obra. |
| Internacional | ISO 22301:2019 [10] | Sistema de continuidad operativa y recuperación | Marco de resiliencia organizacional. No sustituye planes locales de emergencia ni la ITSE. |
| Internacional | ISO 23601:2020 como versión actual; ficha 2009 retirada [6] | Principios para planos exhibidos de escape y evacuación | Verificar y adquirir la edición actual. La edición 2009 consultada está retirada; no usarla como estándar vigente. |
| Internacional | OSHA 29 CFR 1910.38 [7] | Ejemplo oficial de plan de acción de emergencia en EE. UU. | Referencia internacional. Aplicación directa solo si el proyecto está sujeto a OSHA o el contrato la incorpora; no es legislación peruana. |
| Internacional | ADA 2010 / U.S. Access Board, rutas accesibles [12] | Principio de conexión entre puntos de llegada, entradas y espacios accesibles | Comparador internacional. No sustituye A.120 ni la normativa peruana de discapacidad y edificación. |

## 3. Entradas que el motor ARKI debe pedir

El motor debe pedir datos estructurados y documentos, con estado **confirmado / declarado por usuario / derivado / faltante / UNKNOWN**. No debe rellenar silenciosamente los campos faltantes.

### Identidad, jurisdicción y alcance

- País, región, provincia, distrito y autoridad competente.
- Tipo de encargo: anteproyecto, expediente, licencia, obra en ejecución, ampliación, cambio de uso, regularización, operación o inspección.
- Fecha de corte normativa y versión de RNE, ordenanzas, licencias, resoluciones y estándares contractuales.
- Uso o usos autorizados, zonificación, condición de edificación nueva/existente, patrimonio o sector regulado.
- Fase de obra, cronograma, frentes activos, contratista principal, subcontratistas y responsables SST.
- Si se busca una comprobación peruana, una comparación internacional o ambas.

### Geometría, ocupación y circulación

- Planos arquitectónicos por nivel, modelo BIM/IFC si existe, escala, cotas, niveles y áreas.
- Área de cada ambiente, uso previsto, uso alternativo, mobiliario fijo y flexible, densidad adoptada y aforo calculado.
- Personas por piso, ambiente y turno; visitantes; trabajadores; público; niños; pacientes; personas con discapacidad; usuarios dormidos o con asistencia.
- Puertas: ubicación, ancho libre, sentido de giro, herrajes, cerraduras, barra antipánico y condición cortafuego.
- Pasajes, escaleras, rampas, ascensores, corredores, rutas accesibles, desniveles y obstáculos.
- Distancias de recorrido, recorrido común, callejones sin salida, número y separación de salidas, descarga y vía pública.
- Áreas de refugio o zonas seguras, capacidad, accesibilidad, protección frente a humo/fuego y conexión con el exterior.

### Riesgo de incendio y sistemas

- Carga y tipo de combustibles, procesos peligrosos, almacenamiento, gases, líquidos inflamables, materiales peligrosos y residuos.
- Altura, número de niveles, sótanos, estacionamientos, atrios, vacíos, patios, fachadas y colindancias.
- Estructura, cerramientos, sectorización, resistencia al fuego especificada, sellos, puertas cortafuego y certificados/ensayos.
- Detección, alarma, monitoreo, comunicación, extintores, gabinetes, red de agua, bombas, tanque, rociadores y control/extracción de humo.
- Instalación eléctrica normal y de emergencia, grupo electrógeno, UPS, tableros, puesta a tierra y cargas críticas.
- Planos unifilares, memorias de cálculo, fichas técnicas, certificados de instalación, pruebas de aceptación, mantenimiento y fecha de vencimiento.
- Acceso de bomberos, hidrantes, aproximación de vehículos, llave maestra, ascensor de bomberos cuando corresponda y restricciones del sitio.

### SST, defensa civil y continuidad

- Matriz IPERC/identificación de peligros, AST, permisos de trabajo, procedimientos, inducciones y capacitaciones.
- Plan SST de obra, organigrama, prevencionista, comité/supervisor, EPP, inspecciones, incidentes y acciones correctivas.
- Plan de emergencia y evacuación, responsables, brigadas, comunicaciones, primeros auxilios, rescate, conteo y asistencia a personas vulnerables.
- Puntos de reunión, zonas seguras, señalización, iluminación de emergencia, alarmas y resultados de simulacros.
- Certificado o expediente ITSE, tipo de ITSE, actas, observaciones, levantamientos y autoridad que interviene.
- Análisis de impacto de interrupción, funciones críticas, RTO/RPO si existen, dependencias, respaldos, proveedores, operación mínima y recuperación.
- Evidencia fechada: fotografías, actas, protocolos, certificados, reportes de prueba, planos “as built” y registro de cambios.

Si el usuario no entrega ubicación, uso, aforo, fase o versión normativa, el motor debe mostrar **UNKNOWN — no es posible determinar aplicabilidad** y pedir el dato antes de emitir una conclusión.

## 4. Gates preventivos para el motor

Un **gate** bloquea una recomendación concluyente cuando falta un dato o evidencia que podría cambiar el resultado. El motor debe explicar qué falta y no convertir un “no evaluado” en “cumple”.

1. **Gate de jurisdicción y versión.** No ejecutar reglas de cumplimiento sin país, autoridad, fecha de corte y texto normativo identificado. Si solo hay un proyecto de norma, etiquetar “propuesta” y no usarlo como obligación.

2. **Gate de uso y ocupación.** No calcular un resultado final si faltan uso, usos simultáneos, mobiliario, área, densidad y ocupantes vulnerables. Reportar aforo por ambiente/nivel y el supuesto que lo produce.

3. **Gate de cambio de uso.** Bloquear la reutilización de un aforo o estrategia de evacuación de otro uso sin revisar zonificación, norma tipológica, carga de ocupantes y riesgo.

4. **Gate de geometría confiable.** No medir rutas desde un plano sin escala, cotas o versión coordinada. Marcar conflictos entre modelo BIM, planos PDF y levantamiento.

5. **Gate de continuidad de rutas.** Reportar como bloqueo cualquier obstáculo, puerta cerrada con llave, giro incompatible, reducción de ancho, descarga incompleta, ruta no accesible o señalización no visible.

6. **Gate de salidas y recorrido.** No concluir que hay evacuación suficiente sin comprobar número, capacidad, separación, recorrido, recorrido común, callejones sin salida y descarga conforme a la norma seleccionada.

7. **Gate de incendio.** No declarar “no requiere rociadores/detección/red” sin evaluación documentada de ocupación, altura, área, riesgo, sótanos, carga de fuego y texto aplicable. Si faltan variables, resultado **UNKNOWN**.

8. **Gate de resistencia al fuego.** No inferir clasificación por material, color, marca o render. Exigir especificación, sistema ensayado/listado y detalle de continuidad; para obra existente exigir evidencia o inspección competente.

9. **Gate de sistemas operativos.** No considerar instalado un sistema por aparecer en el plano. Exigir puesta en servicio, prueba, mantenimiento vigente, autonomía y responsable. El manual ITSE pide protocolos de operatividad y mantenimiento cuando corresponda [11].

10. **Gate de obra temporal.** Separar el estado “construcción” del estado “operación”. Exigir rutas, zonas seguras, iluminación y señalización para la configuración diaria de la obra, no solo para la edificación terminada [4].

11. **Gate de accesibilidad inclusiva.** No equivaler “cumple ruta accesible” con “evacuación inclusiva”. Pedir estrategia de asistencia, refugio o evacuación horizontal cuando aplique, alarmas perceptibles y roles entrenados.

12. **Gate de defensa civil/ITSE.** No producir certificado, aprobación municipal, nivel de riesgo oficial ni resultado ITSE. ARKI solo puede preparar evidencia, señalar faltantes y citar la autoridad/profesional que debe verificar.

13. **Gate de continuidad.** No declarar continuidad operativa sin identificar funciones críticas, dependencias, escenarios, umbrales de interrupción, respaldo, comunicación, recuperación y pruebas. Un plan documental no demuestra capacidad real.

14. **Gate de cambios y mantenimiento.** Cualquier cambio en uso, mobiliario, aforo, distribución, sistema, contratista o fase debe invalidar o reabrir las comprobaciones afectadas.

15. **Gate de salida del informe.** Toda salida debe separar: “dato recibido”, “cálculo o comprobación”, “supuesto”, “fuente”, “evidencia”, “resultado”, “UNKNOWN” y “revisión requerida”. Prohibir lenguaje de certeza jurídica cuando solo exista una alerta automática.

## 5. Cautelas y límites

- **No inventar requisitos.** Los valores de ancho, distancia, resistencia, autonomía, número de salidas o cantidad de equipos solo deben mostrarse cuando se haya identificado la norma, el uso y la condición de aplicabilidad. Si una fuente secundaria los resume, verificar en el texto oficial.
- **Perú no es NFPA/OSHA/ADA.** Un valor o término de una referencia internacional no puede sustituir el RNE, una NTP aplicable, una ordenanza o una exigencia sectorial peruana. Las referencias internacionales deben etiquetarse como “internacional/comparativa”.
- **Proyecto de A.130.** La RM 264-2026-VIVIENDA consultada publica un proyecto de modificación. El estado final de aprobación de esa propuesta es **UNKNOWN** en esta investigación; ARKI debe verificarlo antes de actualizar reglas [3].
- **A.120 y modificaciones.** La página oficial muestra la RM 075-2023-VIVIENDA y el compendio RNE la lista como versión de A.120 [2] [13]. Debe verificarse cualquier modificatoria posterior a la fecha de corte del proyecto.
- **ITSE no es diseño.** La ITSE examina condiciones de seguridad según su procedimiento y expediente. Una lista de documentos o una simulación ARKI no equivale a certificado ni a pronunciamiento de la autoridad.
- **Cálculos no son validación de campo.** Un cálculo de aforo o recorrido depende de la geometría y supuestos; no prueba que una puerta abra, que una alarma sea audible, que un rociador tenga caudal, que un sello esté instalado o que una ruta esté libre.
- **Operatividad requiere evidencia.** Deben registrarse pruebas, mantenimiento, fechas, responsables y resultados. Los sistemas pueden fallar aunque aparezcan dibujados.
- **Emergencias reales exigen criterio profesional.** Incendios, sismos, materiales peligrosos, rescate, humo, pacientes, niños y personas con discapacidad requieren planes y personal competente. ARKI no debe dar instrucciones tácticas en tiempo real ni sustituir a bomberos, brigadas, ingenieros, arquitectos, prevencionistas o autoridades.
- **Accesibilidad y evacuación son objetivos relacionados pero distintos.** Una ruta accesible de uso cotidiano puede no ser un medio de evacuación protegido; un área de refugio requiere estrategia, protección y procedimiento, no solo un símbolo en plano.
- **Continuidad tiene dos capas.** La continuidad física de una edificación no es lo mismo que continuidad del negocio o servicio. ISO 22301 ayuda a estructurar la segunda; la primera depende además de diseño, mantenimiento, redundancia y operación local.
- **Fuentes retiradas.** ISO 23601:2009 aparece retirada y reemplazada por ISO 23601:2020 en la ficha oficial; cualquier uso de la edición 2009 debe marcarse histórico y no vigente [6].
- **Licencias y requisitos locales.** Sin distrito, proyecto, uso y autoridad no se pueden verificar ordenanzas, bomberos, empresa prestadora, patrimonio, sector salud/educación, transporte u otras exigencias. Estado: **UNKNOWN**.
- **Responsabilidad y revisión.** El resultado de ARKI debe ser una ayuda de coordinación y control preventivo. La responsabilidad del diseño, la firma, la construcción, la inspección, el mantenimiento y la operación permanece en los actores legalmente competentes.

## References

[1]: https://www.gob.pe/institucion/munisantamariadelmar/informes-publicaciones/2619708-a-130-requisitos-de-seguridad-ds-n-017-2012 "Municipalidad Distrital de Santa María del Mar — A.130 Requisitos de Seguridad DS N° 017-2012"

[2]: https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne "Ministerio de Vivienda, Construcción y Saneamiento — Reglamento Nacional de Edificaciones (RNE)"

[3]: https://www.gob.pe/institucion/vivienda/normas-legales/8394201-264-2026-vivienda "Ministerio de Vivienda, Construcción y Saneamiento — Resolución Ministerial N.° 264-2026-VIVIENDA"

[4]: https://www.gob.pe/institucion/munisantamariadelmar/informes-publicaciones/2619670-norma-g-050-seguridad-durante-la-construccion-ds-n-010-2009 "Municipalidad Distrital de Santa María del Mar — Norma G.050 Seguridad durante la construcción DS N° 010-2009"

[5]: https://www.gob.pe/institucion/indeci/informes-publicaciones/2370524-ley-n-29664-ley-del-sistema-nacional-de-gestion-del-riesgo-de-desastres-sinagerd "INDECI — Ley N° 29664, Ley del Sistema Nacional de Gestión del Riesgo de Desastres (SINAGERD)"

[6]: https://www.iso.org/standard/41685.html "ISO — ISO 23601:2009 Safety identification — Escape and evacuation plan signs; withdrawn and replaced by ISO 23601:2020"

[7]: https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.38 "U.S. OSHA — 1910.38 Emergency action plans"

[8]: https://www.nfpa.org/news-blogs-and-articles/blogs/2021/10/15/basics-of-means-of-egress-arrangement "NFPA — Basics of Means of Egress Arrangement"

[9]: https://www.iso.org/standard/45001 "ISO — ISO 45001:2018 Occupational health and safety management systems — Requirements with guidance for use"

[10]: https://www.iso.org/standard/75106.html "ISO — ISO 22301:2019 Security and resilience — Business continuity management systems — Requirements"

[11]: https://www.muniventanilla.gob.pe/contenidos-nfs/files/MANUAL%20DE%20EJECUCION%20ITSE.pdf "CENEPRED — Manual de ejecución de Inspección Técnica de Seguridad en Edificaciones (ITSE)"

[12]: https://www.access-board.gov/ada/guides/chapter-4-accessible-routes/ "U.S. Access Board — ADA Guide, Chapter 4: Accessible Routes"

[13]: https://www.gob.pe/institucion/vivienda/normas-legales/3906930-075-2023-vivienda "Ministerio de Vivienda, Construcción y Saneamiento — Resolución Ministerial N.° 075-2023-VIVIENDA"

[14]: https://www.midagri.gob.pe/portal/download/pdf/seguridad-y-salud/reglamento-ley29783.pdf "MIDAGRI — Reglamento de la Ley N° 29783, Ley de Seguridad y Salud en el Trabajo"

**Nota de verificación:** Las referencias [1], [2], [3], [4], [5], [13] y [14] son páginas o documentos alojados por entidades públicas; [6]–[10] y [12] son organismos/entidades internacionales o gubernamentales reconocidos. La existencia de una fuente no prueba por sí sola que un proyecto particular la cumpla.

---

**Resultado operativo para ARKI:** el motor debe preferir “falta dato / requiere verificación / UNKNOWN” frente a una conclusión positiva. La salida mínima recomendable es una matriz de trazabilidad que conecte cada regla aplicable con jurisdicción, versión, entrada, cálculo, evidencia, responsable de revisión y estado.
