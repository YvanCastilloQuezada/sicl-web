# Investigación MEP hospitalaria para ARKI

**Fecha de corte de la investigación:** 2026-09-21  
**Ámbito:** instalaciones sanitarias, agua, desagüe, protección contra incendios, eléctrica, telecomunicaciones, HVAC/ventilación, calderas, oxígeno y gases medicinales, con énfasis en establecimientos de salud.  
**Propósito:** definir el bloque de conocimiento, datos de entrada y controles preventivos que ARKI debería aplicar. Este documento no constituye expediente técnico, memoria de cálculo, certificación, dictamen de cumplimiento ni sustituto de la revisión de un profesional habilitado y de la autoridad competente.

## 1. Resumen ejecutivo

ARKI debe tratar MEP hospitalario como un problema de **seguridad de vida, continuidad operativa, control de infecciones y coordinación interdisciplinaria**, no como una lista de tuberías y equipos. La primera decisión del motor debe ser jurisdiccional: identificar país, región, autoridad competente, nivel y cartera de servicios del establecimiento, edición vigente de cada norma y si el proyecto es nuevo, ampliación, remodelación u operación de una instalación existente.

Para Perú, la base regulatoria edificatoria que sí se pudo verificar en fuentes oficiales es el **Reglamento Nacional de Edificaciones (RNE)**. El Ministerio de Vivienda lo describe como de cumplimiento obligatorio para entidades públicas y personas naturales o jurídicas privadas que proyecten o ejecuten habilitaciones urbanas y edificaciones en el territorio nacional [1]. En el bloque MEP aparecen, entre otras, IS.010 para instalaciones sanitarias; EM.010 para instalaciones eléctricas interiores; EM.020 para instalaciones de comunicaciones; EM.030 para ventilación; EM.040 para instalaciones de gas; EM.050 para climatización; y A.130 para requisitos de seguridad. La ficha oficial del RNE identifica las ediciones y resoluciones asociadas, pero el motor debe comprobar la versión aplicable a la fecha y al expediente, porque el RNE se actualiza.

Para infraestructura de salud peruana, MINSA aprobó la **NTS 110-MINSA/DGIEM-V.01** para establecimientos del segundo nivel mediante RM 660-2014-MINSA [2], y la **NTS 119-MINSA/DGIEM-V.01** para establecimientos del tercer nivel mediante RM 862-2015-MINSA [3]. Estas normas deben leerse junto con la cartera de servicios, el nivel de atención, la autoridad sectorial y las normas del RNE. No se debe asumir que la NTS 110 o la NTS 119 aplican a cualquier clínica, ni que la sola mención de una norma demuestra cumplimiento.

En oxígeno medicinal existe una capa peruana específica: el DS 010-2021-SA aprueba el reglamento de la Ley 31113 para establecimientos públicos y privados a nivel nacional [4]; la RM 935-2021-MINSA aprueba la Directiva Administrativa 318-MINSA/DIGEMID-2021, que establece la trama de datos y el procedimiento de envío de información sobre stock y consumo de oxígeno medicinal de IPRESS y UGIPRESS [5]; y la RM 794-2022-MINSA aprueba una guía técnica para generación y control de calidad del oxígeno medicinal en IPRESS [6]. Estas fuentes regulan aspectos sanitarios, de disponibilidad, información y calidad. No bastan por sí solas para dimensionar toda la red física de gases medicinales.

Como referencias internacionales reconocidas, **ISO 7396-1:2016** cubre diseño, instalación, funcionamiento, desempeño, ensayos, puesta en servicio y documentación de redes de gases medicinales comprimidos y vacío, incluyendo oxígeno, óxido nitroso, aire medicinal, dióxido de carbono, mezclas, gases para herramientas quirúrgicas y vacío [7]. ISO indica que la edición 2016 fue confirmada en 2022, tiene una enmienda y está prevista para reemplazo; por ello ARKI debe almacenar edición y estado, no solo el número de norma. **ANSI/ASHRAE/ASHE 170** es una referencia internacional para ventilación de establecimientos de salud y publica adendas que modifican el texto base [8]. **NFPA 99** es una referencia internacional de seguridad de establecimientos de salud con enfoque basado en riesgo que cubre sistemas eléctricos, gases medicinales y vacío, telecomunicaciones, plomería, sistemas mecánicos y equipos especializados [9]. Su uso en Perú debe registrarse como referencia internacional o requisito contractual, salvo que una autoridad o contrato lo haga obligatorio.

La salida segura de ARKI debe ser una **matriz de criterios, supuestos, entradas faltantes, conflictos y verificaciones requeridas**, con estado `UNKNOWN` cuando no exista fuente suficiente o el dato dependa del proyecto. Nunca debe emitir “cumple” por inferencia. Debe separar: **obligatorio en Perú**, **referencia internacional**, **requisito contractual**, **criterio de diseño propuesto** y **dato no verificado**.

## 2. Qué debe estudiar ARKI: 12 materias curriculares

1. **Marco regulatorio y gestión de versiones.** Jerarquía entre ley, reglamento, norma técnica, resolución, guía, estándar voluntario, especificación del cliente y criterio de diseño. Control de jurisdicción, fecha de vigencia, modificaciones, derogaciones y alcance.

2. **Planificación MEP hospitalaria y programación funcional.** Relación entre nivel de atención, cartera de servicios, flujos limpio/sucio, pacientes, personal, residuos, suministros y áreas críticas. El sistema debe vincular cada ambiente con su carga clínica y sus sistemas de soporte, sin inventar ambientes ni demandas.

3. **Abastecimiento y distribución de agua.** Demanda de consumo, almacenamiento, presurización, sectorización, continuidad, calidad del agua, agua caliente sanitaria, retorno, prevención de conexiones cruzadas y coordinación con la empresa prestadora. Para Perú, estudiar IS.010 y las partes MEP de las NTS aplicables; los valores de diseño deben citarse desde la edición concreta.

4. **Desagüe sanitario, ventilación sanitaria y drenaje.** Separación de redes, pendientes, registros, sifones, ventilación, aguas de proceso, efluentes especiales, reboses y mantenimiento. ARKI debe distinguir desagüe doméstico, hospitalario y efluente regulado; no debe suponer que “hospitalario” implica una exigencia única.

5. **Protección contra incendios y seguridad de vida.** Carga de ocupación, sectorización, rutas, evacuación, resistencia al fuego, detección, alarma, extinción, rociadores, abastecimiento, bombas, reserva, control de humo y coordinación con bomberos. En Perú, usar A.130 y las normas específicas que la autoridad exija; NFPA puede ser referencia internacional o contractual. La aplicabilidad de cada sistema depende del uso, riesgo, altura, área y configuración.

6. **Instalaciones eléctricas hospitalarias.** Cálculo de cargas, cortocircuito, coordinación y selectividad, puesta a tierra, equipotencialidad, protección contra choque e incendio, calidad de energía, áreas críticas, sistemas esenciales, transferencia, grupo electrógeno, UPS, continuidad y pruebas. La base peruana identificada es EM.010; el Código Nacional de Electricidad-Utilización debe verificarse por edición y alcance antes de convertirlo en regla del motor. NFPA 99 puede complementar como referencia internacional.

7. **Telecomunicaciones, datos y sistemas clínicos.** EM.020, canalizaciones, cuartos técnicos, fibra/cobre, energía y puesta a tierra de telecomunicaciones, llamada de enfermería, reloj, voz/datos, seguridad electrónica, localización, radio y sistemas clínicos. ARKI debe pedir arquitectura de red, disponibilidad, ciberseguridad y separación de sistemas críticos. No debe asumir que todos los sistemas de baja tensión están cubiertos por EM.020.

8. **HVAC, ventilación, presiones y control de infecciones.** Zonificación, caudal, aire exterior, filtración, temperatura, humedad, presión relativa, recirculación, extracción, recuperación, ruido, mantenimiento y operación. En Perú, EM.030 fue modificada por RM 232-2020-VIVIENDA [10] y el RNE también identifica EM.050 para climatización. ASHRAE/ASHE 170 aporta criterios hospitalarios internacionales, pero no debe transformarse automáticamente en obligación peruana.

9. **Quirófanos, aislamiento, áreas críticas y ambientes especiales.** Matriz de ambientes y clasificación clínica; relaciones de presión y flujo; ventilación de aislamiento respiratorio, protección, procedimientos, laboratorio, farmacia, imagen, esterilización, morgue y residuos. Los caudales, cambios de aire y presiones deben quedar `UNKNOWN` si no se ha verificado la categoría exacta, la edición normativa y la estrategia de diseño.

10. **Calderas, vapor, agua caliente y energía térmica.** Balance de cargas, combustible, quemadores, chimenea, ventilación de sala, tratamiento de agua, purgas, vapor limpio o de servicio, retorno de condensado, alivio, controles, redundancia y seguridad de operación. El RNE oficial identifica EM.040 para instalaciones de gas, EM.050 para climatización y EM.060 para chimeneas y hogares [1]. La norma peruana específica aplicable a calderas hospitalarias, inspecciones, recipientes a presión, combustible y operación debe verificarse según proyecto y autoridad: `UNKNOWN` en esta investigación.

11. **Gases medicinales y vacío.** Inventario de gases, fuentes primaria/secundaria/reserva, producción o suministro, almacenamiento de cilindros, centrales, redes, válvulas de zona, alarmas, puntos terminales, identificación, no intercambiabilidad, pruebas, limpieza, documentación, mantenimiento y plan de contingencia. ISO 7396-1 es una referencia completa para la red; Perú añade obligaciones específicas sobre oxígeno medicinal que deben integrarse sin confundir calidad del producto con desempeño de la instalación.

12. **Comisionamiento, operación y mantenimiento.** Revisión de diseño, inspección de instalación, pruebas, balanceo, limpieza, calibración, pruebas de transferencia y autonomía, documentación as-built, capacitación, permisos, mantenimiento preventivo, simulacros, gestión de cambios e incidentes. En un hospital, la aceptación debe incluir operación segura en escenarios normales, falla de fuente y mantenimiento, no solo planos aprobados.

## 3. Anclas normativas verificadas

### 3.1 Perú: anclas principales

| Ancla | Qué se verificó | Uso correcto en ARKI |
|---|---|---|
| **RNE, Ministerio de Vivienda** | La ficha oficial declara que el RNE es de cumplimiento obligatorio para proyectos y ejecución de edificaciones en Perú. La ficha identifica IS.010, A.130, EM.010, EM.020, EM.030, EM.040, EM.050 y EM.060, con resoluciones asociadas [1]. | Fuente primaria para el marco edificatorio. Pedir jurisdicción, fecha de expediente y edición. No usar una copia secundaria como si fuera el texto vigente. |
| **IS.010 Instalaciones Sanitarias para Edificaciones** | El RNE oficial publica la norma como documento del bloque MEP; la ficha gob.pe también ofrece el PDF [1] [11]. | Base para agua, desagüe y servicios sanitarios de edificaciones. Los parámetros concretos deben extraerse de la edición aplicable y del caso. |
| **A.130 Requisitos de Seguridad** | Publicada por el RNE y disponible en PDF oficial [1] [12]. | Ancla peruana para seguridad de vida y protección contra incendios. No sustituye el análisis de riesgo ni las exigencias de la autoridad. |
| **EM.010 Instalaciones Eléctricas Interiores** | El RNE oficial la identifica como EM.010 con RM 083-2019-VIVIENDA [1] [13]. | Base peruana para instalaciones eléctricas interiores. Verificar coordinación con CNE-Utilización, empresa suministradora y requisitos de áreas críticas. |
| **EM.020 Instalaciones de Comunicaciones** | El RNE oficial la identifica como EM.020 con RM 400-2018-VIVIENDA [1]. La ficha gob.pe ofrece el documento [14]. | Base para canalizaciones e instalaciones de comunicaciones. No asumir que cubre por completo sistemas clínicos, radio o ciberseguridad. |
| **EM.030 Instalaciones de Ventilación** | La norma fue modificada por RM 232-2020-VIVIENDA [10]; el RNE también publica su documento [1] [15]. | Base peruana de ventilación general. Para áreas hospitalarias, verificar requisitos sectoriales y criterios de control de infecciones. |
| **EM.040 Instalaciones de Gas** | El RNE oficial identifica EM.040 con RM 341-2018-VIVIENDA [1]. | Base para instalaciones de gas combustible. No confundir gas combustible con gases medicinales. |
| **EM.050 Instalaciones de Climatización y EM.060 Chimeneas y Hogares** | Ambas aparecen en el índice oficial del RNE [1]. | Anclas para climatización y evacuación de productos de combustión. La aplicabilidad y el texto vigente deben verificarse para cada expediente. |
| **NTS 110-MINSA/DGIEM-V.01** | RM 660-2014-MINSA la aprueba para establecimientos de salud del segundo nivel y enlaza las partes de la NTS [2]. | Criterios sectoriales para segundo nivel. Confirmar que el establecimiento y el proyecto están dentro del alcance. |
| **NTS 119-MINSA/DGIEM-V.01** | RM 862-2015-MINSA la aprueba para establecimientos de salud del tercer nivel [3]. | Criterios sectoriales para tercer nivel. No extrapolar automáticamente a primer nivel, clínicas ambulatorias o usos no comprendidos. |
| **DS 010-2021-SA / Ley 31113** | El DS aprueba el reglamento de la Ley 31113 sobre uso de oxígeno medicinal en establecimientos públicos y privados a nivel nacional [4]. | Requisito sectorial peruano para el componente de oxígeno medicinal. ARKI debe pedir si el proyecto produce, almacena, recibe o solo distribuye oxígeno. |
| **RM 935-2021-MINSA, Directiva 318** | Regula la trama de datos y el procedimiento de envío de información sobre stock y consumo de oxígeno medicinal de IPRESS y UGIPRESS [5]. | Entrada para operación y reporte; no es una norma de dimensionamiento de tuberías. |
| **RM 794-2022-MINSA** | Aprueba la Guía Técnica para generación y control de calidad del oxígeno medicinal en IPRESS [6]. | Ancla para calidad y generación de oxígeno. No usarla como sustituto de la norma de red de gases. |

### 3.2 Referencias internacionales: no son automáticamente derecho peruano

| Referencia | Alcance verificado | Tratamiento en ARKI |
|---|---|---|
| **ISO 7396-1:2016** | Redes de gases medicinales comprimidos y vacío; cubre diseño, instalación, funcionamiento, desempeño, ensayos, puesta en servicio, documentación, fuentes, distribución, controles, alarmas y no intercambiabilidad [7]. ISO indica que fue confirmada en 2022, tiene una enmienda y está prevista para reemplazo. | Referencia internacional de alta relevancia para gases medicinales. Registrar edición y enmienda; exigir confirmación contractual o de autoridad antes de llamarla obligatoria. |
| **ANSI/ASHRAE/ASHE 170** | Estándar de ventilación de establecimientos de salud; ASHRAE publica adendas del estándar 170-2017 y presenta recursos de salud [8]. | Referencia para HVAC hospitalario y control ambiental. Verificar edición/adendas y compatibilizar con Perú. No insertar automáticamente sus tablas como obligación legal. |
| **NFPA 99 Health Care Facilities Code** | Código de establecimientos de salud con enfoque basado en riesgo; NFPA describe alcance sobre sistemas eléctricos, gases medicinales y vacío, telecomunicaciones, plomería, sistemas mecánicos y equipos especializados [9]. | Referencia internacional o contractual. NFPA informa ediciones trienales; registrar edición exacta. No afirmar que rige en Perú sin base jurídica o contractual. |

### 3.3 Anclas cuya verificación queda abierta

* **CNE-Utilización y requisitos de suministro eléctrico:** `UNKNOWN` respecto de la edición exacta, disposiciones aplicables a cada área clínica y relación con el expediente concreto. ARKI debe pedir el código adoptado y la opinión del proyectista eléctrico o de la autoridad.
* **Normas peruanas específicas de calderas, recipientes a presión, vapor hospitalario y operación:** `UNKNOWN` en esta investigación. Deben verificarse por combustible, potencia, presión, instalación, autoridad y régimen de inspección.
* **Requisitos detallados de gases medicinales dentro de NTS 110/NTS 119:** las resoluciones y el índice oficial se verificaron; el texto técnico completo debe revisarse por capítulo, parte y edición antes de extraer valores o declarar aplicabilidad. Estado de cualquier número o tabla no transcrito aquí: `UNKNOWN`.
* **Norma peruana única para HVAC hospitalario equivalente a ASHRAE 170:** `UNKNOWN`. No debe afirmarse que existe una equivalencia nacional automática.

## 4. Entradas que el motor ARKI debe pedir

### 4.1 Identidad, jurisdicción y autoridad

* País, región, municipio y dirección del proyecto.
* Tipo de trámite: licencia, inversión pública, ampliación, remodelación, regularización, operación o mantenimiento.
* Fecha base del expediente y fecha prevista de ejecución.
* Autoridad que revisa cada disciplina: municipal, sanitaria, bomberos, energía, empresa de agua, telecomunicaciones, ambiental u otra.
* Lista de normas contractuales y edición exigida por el cliente, financiador, asegurador o autoridad.
* Estado de cada fuente: vigente, modificada, derogada, en consulta, contractual o solo informativa.

### 4.2 Programa hospitalario

* Nivel de atención y cartera de servicios.
* Número y tipo de camas, ocupación, turnos y régimen de operación.
* Ambientes con criticidad clínica: emergencia, UCI, UCI neonatal, quirófanos, recuperación, aislamiento, hemodiálisis, esterilización, laboratorio, imagen, farmacia, morgue y áreas de residuos.
* Flujos de pacientes, personal, alimentos, residuos, ropa limpia/sucia y suministros.
* Equipamiento clínico y no clínico, fichas técnicas, cargas eléctricas, conexiones de agua, drenaje, gases, vapor, calor y rechazo térmico.
* Requisitos de continuidad por ambiente y tolerancia a interrupciones.

### 4.3 Datos del sitio y edificio

* Planos coordinados, modelo BIM si existe, niveles, alturas, shafts, salas técnicas, accesos y restricciones de mantenimiento.
* Topografía, clima, altitud, orientación, temperatura y humedad de diseño; estos valores no deben inferirse sin fuente.
* Disponibilidad y presión de agua, calidad, cota de conexión, alcantarillado, drenaje pluvial y capacidad de la red pública.
* Disponibilidad eléctrica, tensión, fases, frecuencia, potencia contratada, cortocircuito disponible, calidad de energía y restricciones de conexión.
* Disponibilidad de gas combustible y condiciones de suministro.
* Acceso de camiones, almacenamiento de cilindros, tanques, combustible, oxígeno líquido o concentradores.
* Riesgos naturales, inundación, sismo, incendio externo, continuidad de accesos y resiliencia requerida.

### 4.4 Entradas por sistema

* **Agua:** consumos por ambiente y equipo, simultaneidad, almacenamiento, presión mínima/máxima, agua caliente, retorno, tratamiento, redundancia y puntos de muestreo.
* **Desagüe:** caudales, temperatura, sólidos, químicos, grasas, radiactivos si aplican, separación de redes, tratamiento y disposición final.
* **Incendio:** ocupación, riesgo, carga combustible, sectores, altura, área, fachada, reserva, fuente de agua, bomberos, detección, alarma, rociadores y control de humo.
* **Eléctrica:** cuadro de cargas, demanda, cargas esenciales, grupos, UPS, autonomía, transferencia, selectividad, tierra, equipotencialidad, armónicos, aislamiento si aplica y pruebas.
* **Telecomunicaciones:** servicios, topología, disponibilidad, cuartos, rutas, fibra/cobre, PoE, radio, llamada de enfermería, integración clínica, seguridad y ciberseguridad.
* **HVAC:** clasificación de cada ambiente, caudal exterior, extracción, filtración, presiones, temperatura, humedad, operación 24/7, redundancia, mantenimiento y control.
* **Calderas:** combustible, potencia, presión, vapor/agua caliente, calidad requerida, chimenea, sala, ventilación, tratamiento de agua, purgas, alivios, operador y autoridad de inspección.
* **Gases medicinales:** gases requeridos, consumos pico y promedio, simultaneidad, presión, calidad, fuente primaria/secundaria/reserva, cilindros o tanque, generación de oxígeno, vacío, alarmas, válvulas de zona, puntos terminales, pruebas y responsables.

### 4.5 Evidencia y trazabilidad

* PDF o enlace oficial de cada norma, edición, fecha de consulta y resolución que la modifica.
* Matriz de requisitos con referencia exacta a capítulo, artículo, tabla o anexo.
* Memorias de cálculo, planos, diagramas unifilares, isométricos, esquemas de control y especificaciones.
* Certificados de producto, protocolos de ensayo, actas de comisionamiento y documentación as-built.
* Supuestos del proyectista, incertidumbres, decisiones pendientes y aprobaciones de la autoridad.

## 5. Gates preventivos para el motor

1. **Gate de jurisdicción.** Si faltan país, ubicación, autoridad o fecha normativa, detener la conclusión de cumplimiento y devolver `UNKNOWN`.

2. **Gate de alcance hospitalario.** Si faltan nivel de atención, cartera de servicios o ambientes críticos, no dimensionar ni seleccionar criterios de HVAC, gases, energía o agua por analogía.

3. **Gate de versión normativa.** No usar una copia sin edición. Registrar norma, resolución modificatoria, fecha de vigencia y texto consultado. Si hay conflicto entre versiones, marcarlo para revisión humana.

4. **Gate de jerarquía.** Separar requisitos legales peruanos de estándares internacionales, requisitos contractuales y recomendaciones. Nunca presentar ISO, ASHRAE o NFPA como ley peruana sin una base explícita.

5. **Gate de criticidad.** Para UCI, quirófanos, emergencia, aislamiento, áreas de procedimiento y sistemas de gases, exigir revisión de profesional competente y matriz de riesgos antes de emitir una propuesta.

6. **Gate de gases medicinales.** No aprobar una red sin confirmar gases, fuentes, presión, calidad, simultaneidad, alarmas, válvulas de zona, no intercambiabilidad, pruebas, limpieza, documentación y plan de respaldo. No confundir disponibilidad de oxígeno medicinal con cumplimiento de la red.

7. **Gate de oxígeno producido en sitio.** Si existe PSA, concentrador, oxígeno 93, tanque criogénico o llenado de cilindros, pedir base regulatoria, control de calidad, almacenamiento, ventilación, pureza, continuidad y responsable operativo. Si no se verifican, estado `UNKNOWN`.

8. **Gate de continuidad eléctrica.** Antes de declarar que un ambiente es seguro, pedir clasificación de cargas, transferencia, autonomía, pruebas de arranque, mantenimiento, selectividad y escenarios de falla. Un grupo electrógeno dibujado no demuestra continuidad.

9. **Gate de ventilación clínica.** No aplicar cambios de aire, presiones, filtración o recirculación sin identificar el tipo exacto de ambiente y la fuente normativa. Si solo existe una recomendación general, devolver una hipótesis claramente etiquetada.

10. **Gate de incendio.** No afirmar suficiencia de rociadores, reserva, bombas, detección, evacuación o sectorización sin datos geométricos, de ocupación, riesgo, autoridad y planos coordinados.

11. **Gate de coordinación espacial.** Bloquear la salida si tuberías, ductos, bandejas, gases, estructura, arquitectura, protección contra incendios o mantenimiento tienen interferencias no resueltas. Requerir accesibilidad a válvulas, equipos, filtros, bombas y tableros.

12. **Gate de pruebas y comisionamiento.** No cerrar el diseño por aprobación de planos. Exigir plan de inspección y pruebas, criterios de aceptación, instrumentos, responsables, registros y documentación de operación.

13. **Gate de cambio.** Cualquier cambio de uso, equipo, caudal, carga, gas, presión, ocupación o norma debe reabrir los cálculos y la matriz de cumplimiento.

14. **Gate de salida segura.** Las salidas del motor deben utilizar estados como `VERIFICADO`, `REQUIERE EVIDENCIA`, `NO APLICA CON JUSTIFICACIÓN`, `CONFLICTO` y `UNKNOWN`. Está prohibido convertir datos faltantes en cumplimiento implícito.

## 6. Cautelas y límites

* **No se verificó cumplimiento de un proyecto concreto.** Este informe solo define investigación, fuentes, campos y controles para ARKI.
* **El RNE es dinámico.** La ficha oficial consultada identifica documentos y resoluciones, incluso actualizaciones posteriores en el índice. ARKI debe consultar la edición vinculada al expediente, no fijar permanentemente un PDF.
* **Las normas hospitalarias de MINSA son sectoriales.** La NTS 110 y la NTS 119 tienen alcances por nivel de atención. No deben extrapolarse a todos los establecimientos.
* **Los estándares internacionales tienen alcance y edición.** ISO 7396-1, ASHRAE 170 y NFPA 99 pueden ser muy útiles, pero su obligatoriedad en Perú depende de ley, autoridad, contrato o especificación. NFPA 99 y ASHRAE publican nuevas ediciones o adendas; el número sin año es insuficiente.
* **No se deben inventar valores.** Caudales, diámetros, presiones, cambios de aire, temperaturas, humedad, autonomía, pureza, reservas, potencias, tiempos de evacuación y categorías de riesgo requieren una fuente y datos de proyecto. Cuando falte alguno, marcar `UNKNOWN`.
* **Calderas siguen abiertas.** Se identificaron anclas RNE para gas, climatización y chimeneas, pero no se verificó una norma peruana única que cubra todos los aspectos de calderas hospitalarias. La selección debe depender de combustible, presión, potencia, autoridad y régimen de inspección.
* **Gases medicinales no son gas combustible.** EM.040 no reemplaza ISO 7396-1 ni el marco sanitario peruano de oxígeno. El producto medicinal, la central, la red, el punto terminal, las alarmas y la operación tienen controles distintos.
* **El texto técnico completo de NTS 110 y NTS 119 debe ser revisado por capítulo.** Las resoluciones oficiales y los enlaces a las partes fueron verificados, pero cualquier valor específico que ARKI use debe apuntar a la página y tabla del PDF aplicable.
* **La coordinación clínica es indispensable.** Un sistema MEP puede satisfacer una tabla y aun así ser inadecuado para el flujo clínico, mantenimiento, limpieza, emergencia o control de infecciones. Se necesita revisión conjunta de arquitectura, ingeniería, usuarios clínicos, mantenimiento, seguridad y autoridad.
* **La responsabilidad profesional no se delega al motor.** ARKI puede organizar evidencia, detectar vacíos y generar una matriz de revisión; no debe firmar cálculos, emitir certificados ni reemplazar a profesionales habilitados, inspectores o autoridades.

## 7. Conclusión operativa para ARKI

El bloque MEP de ARKI debe funcionar como un **motor de trazabilidad y prevención**. Primero debe identificar la jurisdicción y el programa clínico. Luego debe seleccionar el conjunto normativo con edición verificable. Después debe pedir los datos de sitio, ambiente, equipo y operación que hacen posible el cálculo. Finalmente debe comparar el diseño con requisitos citados, documentar evidencia y detenerse ante cualquier vacío crítico.

La regla de seguridad central es: **sin fuente aplicable, dato de proyecto y evidencia verificable, no hay afirmación de cumplimiento**. La respuesta correcta del motor puede ser una lista de preguntas pendientes, un conflicto normativo o `UNKNOWN`.

## Referencias

[1]: https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne "Reglamento Nacional de Edificaciones - RNE, Ministerio de Vivienda, Construcción y Saneamiento"
[2]: https://www.gob.pe/institucion/minsa/normas-legales/1848318-660-2014-minsa "Resolución Ministerial N.° 660-2014-MINSA: aprobación de la NTS 110 para segundo nivel"
[3]: https://www.gob.pe/institucion/minsa/normas-legales/1848025-862-2015-minsa "Resolución Ministerial N.° 862-2015-MINSA: aprobación de la NTS 119 para tercer nivel"
[4]: https://www.gob.pe/institucion/minsa/normas-legales/1745301-010-2021-sa "Decreto Supremo N.° 010-2021-SA: reglamento de la Ley 31113 sobre oxígeno medicinal"
[5]: https://www.gob.pe/institucion/minsa/normas-legales/2046013-935-2021-minsa "Resolución Ministerial N.° 935-2021-MINSA: Directiva Administrativa 318 sobre stock y consumo de oxígeno medicinal"
[6]: https://www.gob.pe/institucion/minsa/normas-legales/3582594-794-2022-minsa "Resolución Ministerial N.° 794-2022-MINSA: guía técnica para generación y control de calidad del oxígeno medicinal"
[7]: https://www.iso.org/standard/60061.html "ISO 7396-1:2016 Medical gas pipeline systems — Part 1"
[8]: https://www.ashrae.org/technical-resources/standards-and-guidelines/standards-addenda/ansi-ashrae-ashe-standard-170-2017-ventilation-of-health-care-facilities "ANSI/ASHRAE/ASHE Standard 170-2017, Ventilation of Health Care Facilities"
[9]: https://www.nfpa.org/product/nfpa-99-health-care-facilities-code/p0099code "NFPA 99, Health Care Facilities Code"
[10]: https://www.gob.pe/institucion/vivienda/normas-legales/1210577-232-2020-vivienda "Resolución Ministerial N.° 232-2020-VIVIENDA: modificación de EM.030 Instalaciones de Ventilación"
[11]: https://www.gob.pe/institucion/munisantamariadelmar/informes-publicaciones/2619716-is-010-instalaciones-sanitarias-para-edificaciones-ds-n-017-2012 "IS.010 Instalaciones Sanitarias para Edificaciones, ficha oficial gob.pe"
[12]: https://www.gob.pe/institucion/munisantamariadelmar/informes-publicaciones/2619708-a-130-requisitos-de-seguridad-ds-n-017-2012 "A.130 Requisitos de Seguridad, ficha oficial gob.pe"
[13]: https://www.gob.pe/institucion/munisantamariadelmar/informes-publicaciones/2619718-em-010-instalaciones-electricas-interiores "EM.010 Instalaciones Eléctricas Interiores, ficha oficial gob.pe"
[14]: https://www.gob.pe/institucion/munisantamariadelmar/informes-publicaciones/2619720-em-020-instalaciones-de-comunicaciones "EM.020 Instalaciones de Comunicaciones, ficha oficial gob.pe"
[15]: https://www.gob.pe/institucion/munisantamariadelmar/informes-publicaciones/2619721-em-030-instalaciones-de-ventilacion "EM.030 Instalaciones de Ventilación, ficha oficial gob.pe"

*Nota de revisión:* los enlaces oficiales fueron consultados durante esta investigación. Antes de usar ARKI en un expediente, debe repetirse la verificación de vigencia, modificaciones, alcance territorial y requisitos de la autoridad competente.
