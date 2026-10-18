# ARKI — Estado completo y pendientes

**Fecha de auditoría:** 22 de septiembre de 2026  
**Estado revisado:** checkpoint `6e4624b6`  
**Alcance:** generador de familias, modelo constructivo BIM conceptual, expediente técnico, encofrados, costos, 4D/5D, normativa, edición y exportaciones.

## Conclusión ejecutiva

ARKI dejó de ser únicamente un generador de sólidos. Actualmente genera una propuesta paramétrica, la convierte en un modelo constructivo semántico conceptual y muestra espacios, muros, capas, aberturas, elementos estructurales, materiales, metrados, presupuesto referencial, cronograma conceptual, incidencias de coordinación y un expediente técnico editable de forma local.

Sin embargo, todavía no es un sistema BIM profesional completo ni un generador de expediente técnico definitivo para aprobación o construcción. La mayor parte de las capacidades avanzadas existe como motor local, heurística, manifest o demostración visual. Faltan persistencia, usuarios, permisos, cálculos de ingeniería, documentos técnicos reales, validación normativa completa, firmas, integración profesional con formatos externos y un flujo de operación y mantenimiento.

## 1. Lo que ya está implementado

### 1.1 Generación paramétrica de familias

El frontend permite seleccionar familias y variantes, buscar por nombre o categoría, introducir ciudad, área, aforo y niveles, y generar una propuesta conceptual. Existen doce categorías de familias con variantes declarativas. Las propuestas se pueden guardar localmente, restaurar, eliminar y comparar entre versiones.

La propuesta incluye vistas conceptuales de planta, corte y masa 3D mediante SVG. También incluye calidad y resolución de visualización. El flujo se ejecuta en el navegador y no requiere un backend para generar la propuesta.

### 1.2 Modelo constructivo semántico

El motor construye un modelo con espacios, muros, capas, cimentaciones, columnas, vigas, losas, escaleras, pisos, techos, tabiques, puertas, ventanas y relaciones entre elementos. En el caso probado se generan 16 espacios, 16 muros, 72 cimentaciones, 72 columnas, 16 vigas, 4 losas, 4 escaleras, 4 pisos, 1 techo, 4 tabiques, 16 puertas, 320 ventanas y 464 relaciones.

El modelo calcula metrados básicos, pesos, presupuesto referencial, duración estimada y puertas o ventanas asociadas. También incluye gates que indican que la propuesta es conceptual y requiere revisión especializada.

### 1.3 IFC semántico conceptual

Existe una exportación IFC4X3 con GUIDs deterministas, unidades, espacios, muros, columnas, vigas, losas, cimentaciones, escaleras, techos, materiales, propiedades y relaciones espaciales. Las pruebas verifican la presencia de entidades IFC principales y relaciones de agregación y contención.

Esta exportación todavía debe considerarse **IFC conceptual**. No se ha validado con una batería de modelos de coordinación en Revit, Solibri, Navisworks, BIMcollab u otro visor profesional.

### 1.4 Elementos constructivos y APU

El sistema tiene una base referencial de partidas, unidades, materiales, mano de obra y equipos. El presupuesto se expresa en soles peruanos y se enlaza con los elementos generados. Existe importación local de CSV con columnas de S10 como código, descripción, unidad y costo directo.

La base regional actual incluye partidas de albañilería, tarrajeo, puertas, ventanas y encofrados de columna, viga y losa. Los precios se ajustan mediante un factor regional editable en el motor.

### 1.5 Encofrados

El sistema genera requerimientos de encofrado a partir de elementos estructurales. Calcula juegos por reutilización, área de contacto, área efectiva, volumen de cara, puntales, longitud de puntales, clavos, alambre y desmoldante. También registra sistema de encofrado, días estimados y condiciones de liberación.

La prueba actual produce 164 requerimientos para el caso de hospital usado como referencia. La interfaz muestra un resumen y los primeros 12 elementos para mantener la pantalla manejable.

### 1.6 Expediente técnico y especificaciones

Existe un dossier técnico local con siete especificaciones base para estructuras, arquitectura, instalaciones, seguridad y accesibilidad. También incluye seis secciones de expediente: memoria descriptiva, especificaciones, planos y modelo IFC, metrados/APU/encofrados, revisión RNE y firmas/emisión.

La interfaz permite editar localmente el título y la descripción de cada especificación. En encofrados permite cambiar el sistema, los días de desencofrado y los ciclos de reutilización de los elementos visibles. Se puede guardar un borrador en `localStorage` y descargar un Markdown actualizado.

### 1.7 Módulos 4D, 5D, coordinación y CDE demostrativo

Existe un cálculo local de periodos financieros, curva S, valorización acumulada, ruta crítica conceptual, recursos, conflictos de recursos, incidencias de clashes, flujo de aprobación y manifiesto CDE. Estos módulos fueron probados con scripts reproducibles.

Los resultados actuales del caso de prueba incluyen tres periodos financieros, costo 5D referencial de S/ 1,759,040.94, cero conflictos de recursos, 480 incidencias tipificadas, aprobación pendiente, dos documentos CDE y dos partidas importadas desde CSV S10.

## 2. Lo que está parcialmente implementado

### 2.1 Editor de expediente

El modo de edición ya existe, pero es local y limitado. Se pueden editar títulos y descripciones de especificaciones. En encofrados solo se editan algunos atributos de los primeros 12 registros mostrados. No se editan todavía materiales de cara, espesor, puntales, arriostres, alambre, clavos, desmoldante, notas ni condiciones de liberación.

Los cambios no se propagan al modelo constructivo original, al presupuesto, al cronograma, al IFC ni a las versiones guardadas. El botón de guardar borrador conserva datos en el navegador, pero no existe una entidad de proyecto persistente ni un historial de cambios.

### 2.2 Encofrados

La generación automática existe, pero aún no cubre una gestión profesional completa. Falta editar o crear los 164 registros desde una tabla completa, eliminar registros, duplicar sistemas, elegir entre madera, metálico, mixto, plástico y prefabricado con reglas específicas, calcular rendimientos por uso, asignar accesorios y emitir una hoja de encofrados lista para obra.

El modelo actual tampoco valida formalmente estabilidad, presión lateral del concreto, capacidad de puntales, arriostramiento, secuencia de vaciado o autorización de desencofrado. Esas comprobaciones requieren datos estructurales, de obra y de seguridad.

### 2.3 Especificaciones técnicas

Las siete especificaciones son una base referencial. El editor no permite todavía administrar secciones, artículos, criterios de aceptación, tolerancias, ensayos, responsables, documentos de referencia o versiones por especialidad. Tampoco existe un editor Markdown completo con vista previa segura, inserción de tablas y citas normativas como el prototipo Vue entregado en el documento fuente.

### 2.4 Normativa

La revisión RNE actual contiene cuatro hallazgos heurísticos: accesibilidad de puertas, revisión de losas, evacuación y estudio de suelos. No es todavía un motor completo de cumplimiento. No valida todos los parámetros de arquitectura, estructuras, instalaciones sanitarias, eléctricas, mecánicas, seguridad, salud, accesibilidad, gestión de residuos ni condiciones locales.

Los códigos aparecen como referencias de trabajo. El sistema no descarga ni versiona automáticamente el texto oficial vigente, no cita artículos completos y no sustituye la revisión de un profesional habilitado.

### 2.5 Presupuesto y APU

Existe un presupuesto referencial y una tabla de precios regionales, pero no un sistema completo de costos. Falta una base S10/CAPECO versionada, análisis detallado de cada insumo, rendimientos por cuadrilla, desperdicios, transporte, equipos, gastos generales, utilidad, IGV configurable, fórmulas auditables, partidas faltantes y actualización por fecha o región.

La importación CSV funciona como lectura local. No existe validación robusta de columnas, unidades, duplicados, códigos incompatibles, moneda, fecha de precios ni conciliación con una base contractual.

### 2.6 Cronograma 4D

El sistema genera una duración y una ruta crítica conceptual. No existe todavía un cronograma editable con actividades, predecesoras, calendarios, cuadrillas, restricciones, hitos, línea base, avance real, reprogramación, valorización por periodo, recursos nivelados ni enlace visual entre una tarea y sus elementos BIM.

### 2.7 Clash detection

El sistema clasifica incidencias de coordinación, pero la detección es heurística. No utiliza un motor geométrico espacial completo ni genera BCF con viewpoints, severidad, responsable, fecha límite, estado y evidencia. Tampoco permite asignar, comentar, resolver, reabrir ni cerrar un clash.

### 2.8 Aprobación y CDE

Existe una demostración local de flujo de firmas y un manifiesto CDE. No hay autenticación, roles, permisos, control documental real, transmittals, estados ISO 19650, revisiones, aprobaciones, comentarios, sellos, auditoría ni almacenamiento persistente.

## 3. Lo que falta para un expediente técnico definitivo

### 3.1 Documentos técnicos reales

Faltan una memoria descriptiva completa, memoria de cálculo estructural, memoria de instalaciones sanitarias, memoria eléctrica, memoria de seguridad, memoria de arquitectura, especificaciones por partida, metrados por especialidad, presupuesto completo, análisis de precios unitarios, cronograma valorizado, calendario de adquisición, plan de seguridad, plan de manejo ambiental y documentación de compatibilización.

Actualmente se descarga Markdown y se generan manifiestos JSON. No se genera un expediente PDF real compuesto por portada, índice, planos, memorias, cuadros, firmas y anexos.

### 3.2 Planos profesionales

Las vistas actuales son gráficos SVG conceptuales. Faltan planos técnicos con escala, cotas, ejes, niveles, simbología, norte, leyendas, cuadros de vanos, cuadros de acabados, detalles constructivos, cortes acotados, elevaciones, láminas numeradas y cajetín.

También faltan exportaciones DWG, DXF, PDF vectorial, RVT, RFA, IFC validado, BCF y formatos interoperables por especialidad.

### 3.3 Ingeniería estructural

Faltan predimensionamiento y diseño estructural verificable. El sistema necesita cargas permanentes y variables, combinaciones, sismo, viento, material, suelo, cimentaciones, derivas, cortante, flexión, punzonamiento, cuantías, confinamiento, detallado de acero y memoria de cálculo.

Para producir resultados aptos para obra se requiere integración o validación con un motor estructural especializado y revisión de un ingeniero responsable.

### 3.4 Instalaciones MEP

El modelo contiene elementos constructivos generales, pero no desarrolla redes sanitarias, eléctricas, mecánicas, HVAC, gases medicinales, telecomunicaciones, contra incendio ni drenaje con trazado, diámetros, pendientes, cargas, tableros, equipos, accesorios, pruebas y cuadros de cálculo.

En un hospital también faltan requerimientos específicos de flujo limpio y sucio, gases medicinales, respaldo eléctrico, climatización, esterilización, residuos hospitalarios, equipamiento médico y coordinación con la normativa sectorial.

### 3.5 Revisión legal y profesional

Falta un flujo de revisión con responsables por especialidad, observaciones, respuestas, firmas, sello profesional, número de colegiatura, versión emitida y registro de cambios. La aplicación debe distinguir con claridad una propuesta conceptual, una revisión interna y un expediente apto para presentar ante una entidad.

## 4. Lo que falta para el ciclo de vida completo

### 4.1 Concepción y factibilidad

Faltan análisis de terreno, topografía, geotecnia, restricciones urbanísticas, parámetros municipales, zonificación, compatibilidad de uso, riesgos naturales, asoleamiento, vientos, movilidad, servicios existentes, impacto ambiental y alternativas de emplazamiento.

### 4.2 Diseño y coordinación

Falta un entorno de coordinación multiusuario con modelos por disciplina, federación, reglas de intercambio, revisión de interferencias, issues BCF, reuniones, decisiones, estados y trazabilidad.

### 4.3 Construcción

Faltan planificación de obra real, metrados contractuales, órdenes de compra, subcontratos, control de materiales, control de calidad, protocolos de ensayo, RFI, no conformidades, partes diarios, seguridad, avance físico, valorizaciones, adicionales y control de cambios.

### 4.4 Entrega y puesta en operación

Faltan planos conforme a obra, modelo as-built, manuales de operación, fichas técnicas, garantías, protocolos de puesta en marcha, capacitación, inventario de activos, entrega de llaves y acta de recepción.

### 4.5 Operación y mantenimiento

Faltan activos mantenibles con código único, ubicación, fabricante, modelo, serie, garantía, frecuencia de mantenimiento, criticidad, repuestos, órdenes de trabajo, inspecciones, lecturas, incidencias, consumo energético y panel de indicadores.

### 4.6 Renovación y demolición

Faltan análisis de desempeño, rehabilitación, ampliaciones, cambios de uso, evaluación de fin de vida, desmontaje, valorización de materiales, residuos, trazabilidad y actualización del modelo durante todo el ciclo del activo.

## 5. Plataforma y arquitectura que faltan

### 5.1 Backend persistente

El proyecto actual es un frontend estático con motor local. Falta un backend para usuarios, organizaciones, proyectos, familias, versiones, documentos, modelos, metrados, precios, tareas, incidencias, aprobaciones y activos.

También faltan migraciones de base de datos, almacenamiento de archivos, colas de generación, control de concurrencia, versionado, recuperación ante errores y copias de seguridad.

### 5.2 Identidad y seguridad

Faltan inicio de sesión, recuperación de cuenta, roles, permisos por proyecto, permisos por documento, separación de organizaciones, auditoría, cifrado, gestión de sesiones, control de archivos, límites de carga y protección contra archivos maliciosos.

### 5.3 Integraciones profesionales

Faltan conectores de Revit, AutoCAD, Navisworks, Solibri, BIMcollab, Autodesk Construction Cloud, Procore, S10/CAPECO, servicios de firma digital, catastros, topografía, nubes de puntos y plataformas municipales.

### 5.4 Escalabilidad

Faltan procesamiento asíncrono para modelos grandes, almacenamiento de versiones pesadas, generación de PDF o IFC en segundo plano, caché, colas, observabilidad, métricas de rendimiento y límites de memoria. El build actual emite una advertencia por tamaño de bundle superior a 500 kB, aunque compila correctamente.

## 6. Calidad, validación y pruebas faltantes

Las pruebas existentes son scripts de humo que comprueban que se generan objetos y que existen ciertas entidades IFC. No cubren todavía pruebas unitarias exhaustivas, pruebas de propiedades geométricas, regresión visual, accesibilidad, seguridad, rendimiento, concurrencia, importación de archivos inválidos, compatibilidad entre versiones ni validación contra modelos externos.

Faltan pruebas específicas para:

- Persistencia y recuperación de borradores.
- Edición de cada campo del expediente.
- Recalculo del presupuesto después de editar encofrados.
- Recalculo del cronograma después de editar duraciones.
- Exportación IFC después de cambios.
- Validación de unidades y tolerancias.
- Apertura de archivos en visores BIM externos.
- Generación de PDF con todos los anexos.
- Control de permisos y auditoría.
- Experiencia móvil y accesibilidad con teclado y lector de pantalla.

## 7. Resumen de estado por módulo

| Módulo | Estado actual | Qué falta para nivel profesional |
|---|---|---|
| Familias paramétricas | Funcional local | Más reglas, catálogo editable, persistencia y validación de parámetros |
| Planta, corte y 3D | Conceptual funcional | Planos acotados, escalas, detalles y exportación CAD/BIM profesional |
| Espacios | Generados | Reglas completas de programa, áreas normativas, aforo y relaciones funcionales |
| Muros y capas | Semánticos | Detalles constructivos, encuentros, tolerancias y validación de ejecución |
| Estructuras | Elementos conceptuales | Cálculo, diseño, acero, cargas, suelo y memoria estructural |
| Puertas y ventanas | Generadas | Cuadros de vanos, herrajes, seguridad, accesibilidad y detalles |
| Instalaciones | Especificaciones base | Redes MEP calculadas y coordinadas |
| Encofrados | Motor y edición parcial | Gestión completa, estabilidad, seguridad, hoja de obra y recálculo enlazado |
| APU y presupuesto | Referencial | Base contractual, rendimientos, desperdicios, impuestos y auditoría |
| S10 | Importación CSV local | Integración versionada, validación y actualización de base |
| 4D | Simulación conceptual | Cronograma editable, avance, recursos y enlace BIM-tarea |
| 5D | Resumen financiero | Presupuesto completo, valorizaciones, cambios y control contractual |
| RNE | Reglas parciales | Motor normativo completo, fuentes versionadas y revisión profesional |
| Clashes | Detección heurística | Geometría espacial, BCF, responsables y cierre de incidencias |
| IFC | Exportación semántica | Validación externa y cobertura de propiedades por disciplina |
| Expediente | Markdown y manifiesto | PDF real, planos, memorias, anexos, firmas y emisión |
| Aprobaciones | Demo local | Firma legal, roles, flujo de revisión y auditoría |
| CDE | Manifiesto local | Documentos persistentes, ISO 19650, permisos y transmittals |
| Backend | No implementado | API, base de datos, archivos, usuarios y trabajos asíncronos |
| Mantenimiento | No implementado | Activos, O&M, órdenes de trabajo e indicadores |

## 8. Orden recomendado para terminar ARKI

### Fase 1 — Consolidar el expediente editable

Primero debe completarse el editor. Esto incluye cargar borradores al abrir un proyecto, editar todos los campos técnicos, agregar y eliminar especificaciones, administrar todos los encofrados, recalcular metrados y propagar cambios a APU, 4D, IFC y Markdown.

### Fase 2 — Generar documentos y planos reales

Después debe construirse el generador de PDF, memoria descriptiva, especificaciones por partida, metrados, presupuesto, cronograma y láminas técnicas. La aplicación debe generar un índice, numeración, cajetín, anexos y un manifiesto de integridad.

### Fase 3 — Incorporar persistencia y control de usuarios

Luego se necesita backend con proyectos, usuarios, permisos, versiones, documentos y archivos. Esta fase convierte el prototipo local en una herramienta multiusuario y permite mantener la trazabilidad del expediente.

### Fase 4 — Mejorar ingeniería y coordinación

A continuación se deben completar cálculo estructural, MEP, revisión RNE, clash detection geométrica, BCF y validación IFC con software externo.

### Fase 5 — Construcción y operación

Finalmente deben incorporarse control de obra, calidad, seguridad, compras, valorizaciones, as-built, inventario de activos, mantenimiento y desempeño del edificio.

## 9. Qué puede pedirse a continuación

La siguiente orden más útil sería: **“Implementa la Fase 1 completa: editor técnico persistente, edición de todos los encofrados, recálculo enlazado de metrado/APU/4D/IFC y guardado de versiones”**.

Una segunda orden posible sería: **“Implementa la generación de expediente PDF real con memoria, especificaciones, planos SVG/PDF, metrados, presupuesto y anexos”**.

Una tercera orden posible sería: **“Implementa el backend con usuarios, proyectos, documentos, versiones, permisos y almacenamiento persistente”**.

## Referencias

Este informe se basa en el estado ejecutable del proyecto ARKI y en la especificación técnica proporcionada durante la sesión.

[1]: manus-webdev://6e4624b6 "Checkpoint ejecutable de ARKI revisado durante la auditoría"
[2]: /home/ubuntu/upload/pasted_content_11.txt "Paquete de requisitos de editor de especificaciones y encofrados"
