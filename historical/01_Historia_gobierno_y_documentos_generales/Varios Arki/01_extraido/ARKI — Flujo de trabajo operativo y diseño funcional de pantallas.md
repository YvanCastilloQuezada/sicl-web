# ARKI — Flujo de trabajo operativo y diseño funcional de pantallas

**Versión:** 1.0  
**Propósito:** definir el flujo completo de ARKI antes de implementar UI-3A y decidir qué debe aparecer en los paneles izquierdo y derecho.

## 1. Principio general de la interfaz

ARKI debe organizarse como una estación de trabajo BIM. El usuario no debe saltar entre aplicaciones aisladas. Cada pantalla debe responder tres preguntas:

1. **Panel izquierdo:** ¿dónde estoy, qué estoy revisando y qué acciones o filtros puedo activar?
2. **Canvas central:** ¿qué objeto, plano, modelo, tabla o expediente estoy trabajando?
3. **Panel derecho:** ¿qué propiedades, relaciones, impactos, evidencias y decisiones corresponden al objeto seleccionado?

La estructura recomendada es:

```text
┌──────────────────┬────────────────────────────────────┬──────────────────┐
│ CONTEXTO Y       │                                    │ INSPECTOR Y      │
│ HERRAMIENTAS     │          CANVAS DE TRABAJO         │ TRAZABILIDAD     │
│                  │                                    │                  │
│ Proyecto         │  Modelo / plano / tabla /          │ Propiedades      │
│ Navegación       │  expediente / cronograma           │ Relaciones       │
│ Filtros          │                                    │ Costos           │
│ Acciones         │                                    │ Evidencias       │
└──────────────────┴────────────────────────────────────┴──────────────────┘
```

El panel izquierdo y el derecho pueden verse visualmente similares, pero no deben duplicar responsabilidades. El izquierdo controla **contexto y acción**. El derecho explica **selección, impacto y trazabilidad**.

## 2. Flujo corporativo completo

El ciclo de vida objetivo de ARKI es:

```text
Acceso
  ↓
Configuración de organización y proyecto
  ↓
Concepción y programa arquitectónico
  ↓
Generación de familias y espacios
  ↓
Modelo BIM semántico
  ↓
Coordinación de arquitectura, estructuras y especialidades
  ↓
Metrados, costos, presupuesto y 4D
  ↓
Expediente técnico
  ↓
Licitación y contratación
  ↓
Ejecución y captura de campo
  ↓
COD, RFIs, incidencias y JPRD
  ↓
Recepción y as-built
  ↓
Operación y mantenimiento
```

Cada etapa debe producir un **ProjectSnapshot**. El snapshot representa el estado del proyecto en un momento determinado y permite reconstruir qué cambió, quién lo cambió, cuándo ocurrió y qué impacto tuvo.

## 3. Acceso y perfiles

### 3.1 Gateway corporativo

El gateway inicial presenta cuatro accesos:

| Perfil | Objetivo | Entrada principal |
|---|---|---|
| Visitante | Explorar ARKI y conocer el concepto | Biblioteca, demostraciones y documentación |
| Usuario / Proyecto | Crear y desarrollar proyectos | Proyectos, Generador, Modelo BIM y Expediente |
| Especialista / Coordinación | Revisar disciplinas y conflictos | Modelo BIM, Planta, Corte, 3D, Clashes y metrados |
| Corporativo | Controlar costos, estándares y gobierno | PRESUP-5D, GASTOS, 4D, Clashes, EXP-TEC, O-M y ADM |

El gateway no debe simular autenticación real hasta que exista backend. Mientras tanto, debe identificarse como **prototipo local**.

## 4. Flujo 0 — Configuración del proyecto

### Objetivo

Crear la identidad del proyecto antes de generar geometría.

### Canvas central

Muestra el panel de configuración del proyecto con nombre, código, ubicación, tipología, cliente, etapa, unidades, normativa aplicable y versión.

### Panel izquierdo

Debe mostrar:

- Selector de organización.
- Selector de proyecto.
- Árbol de etapas del proyecto.
- Estado del proyecto.
- Filtros por disciplina y fase.
- Acciones: nuevo proyecto, duplicar, importar snapshot y abrir versión.

### Panel derecho

Debe mostrar:

- Datos del proyecto seleccionado.
- Responsable y organización.
- Normas aplicables.
- Última versión y fecha.
- Estado de validación.
- Historial de cambios.
- Advertencias de información incompleta.

## 5. Flujo 1 — Biblioteca de familias

### Objetivo

Seleccionar una familia paramétrica, una familia importada o una familia corporativa normalizada.

### Canvas central

Muestra tarjetas, búsqueda, filtros y vista previa de familias. Debe permitir distinguir familias nativas ARKI, familias importadas de Revit y familias corporativas.

### Panel izquierdo

Debe mostrar:

- Categorías: arquitectura, estructura, MEP, equipamiento, mobiliario, seguridad y exteriores.
- Filtros por disciplina, tipología y nivel de detalle.
- Origen: ARKI, Revit, usuario o biblioteca corporativa.
- Estado de compatibilidad.
- Acciones: importar, duplicar, crear variante y comparar.

### Panel derecho

Debe mostrar:

- Parámetros de la familia.
- Tipos disponibles.
- Materiales y acabados.
- Reglas geométricas.
- Reglas de metrado.
- Reglas de costo.
- Reglas 4D.
- Cobertura IFC y Revit.
- Historial de versiones.

## 6. Flujo 2 — Generador de familias

### Objetivo

Crear una propuesta arquitectónica o constructiva a partir de parámetros declarativos.

### Canvas central

Muestra el formulario del generador y las vistas resultantes: planta conceptual, corte conceptual y masa 3D. El usuario puede seleccionar tipología, familia, variante, área, aforo, niveles, terreno y parámetros específicos.

### Panel izquierdo

Debe mostrar un flujo paso a paso:

1. Definición base.
2. Parámetros del proyecto.
3. Restricciones.
4. Materiales.
5. Variante.
6. Validación.
7. Generación.

También debe contener búsqueda de familia, filtros, guardado y comparación de variantes.

### Panel derecho

Antes de generar debe mostrar:

- Resumen de parámetros.
- Alertas de incompatibilidad.
- Reglas aplicadas.
- Familias y materiales involucrados.

Después de generar debe mostrar:

- ID de propuesta.
- Área, volumen y niveles.
- Elementos generados.
- Metrados preliminares.
- Costo preliminar.
- Duración preliminar.
- Advertencias.
- Acciones: guardar, duplicar, comparar y exportar.

## 7. Flujo 3 — Modelo BIM

### Objetivo

Convertir la propuesta en un modelo semántico que reconozca espacios, muros, puertas, ventanas, columnas, vigas, losas, escaleras, techos, pisos, instalaciones y equipamiento.

### Canvas central

Muestra el modelo BIM y sus vistas. En UI-3A se inicia con planta 2D y selección semántica. Posteriormente se incorporan corte, elevación y 3D sincronizados.

### Panel izquierdo

Debe mostrar:

- Árbol del modelo.
- Niveles.
- Disciplinas.
- Categorías.
- Fases.
- Filtros de visibilidad.
- Selector de vista: planta, corte, elevación o 3D.
- Herramientas de zoom, pan, encuadre y selección.

### Panel derecho

Cuando no hay selección:

- Estado del modelo.
- Cantidad de elementos.
- Elementos con advertencias.
- Última actualización.
- Estado de coordinación.

Cuando hay selección:

- ID determinista.
- Categoría y familia.
- Tipo y nivel.
- Fase y disciplina.
- Dimensiones.
- Materiales y acabados.
- Metrado.
- Costo.
- Actividad 4D.
- Relaciones con espacios, partidas, RFIs y evidencias.
- Historial y provenance.

## 8. Flujo 4 — Planta, Corte y 3D

Estas son vistas del mismo modelo, no módulos desconectados.

### Planta

El panel izquierdo controla nivel, disciplina, fase, filtros, grilla y visualización. El panel derecho muestra las propiedades del elemento seleccionado.

### Corte y elevación

El panel izquierdo controla línea de corte, nivel, profundidad, disciplina y escala. El panel derecho muestra propiedades, encuentros, alturas, capas, materiales y advertencias constructivas.

### 3D

El panel izquierdo controla cámara, estilo visual, categorías, fases, sección y modo de representación. El panel derecho muestra propiedades del elemento, relaciones espaciales, colisiones, materiales y estado de coordinación.

## 9. Flujo 5 — Metrados

### Objetivo

Obtener cantidades trazables desde elementos BIM y no desde cifras aisladas.

### Canvas central

Muestra tablas de cantidades por disciplina, categoría, nivel, partida y fase.

### Panel izquierdo

Debe mostrar:

- Filtros por nivel y disciplina.
- Reglas de medición.
- Inclusión o exclusión de capas.
- Unidad de medida.
- Agrupación.
- Periodo o versión del snapshot.

### Panel derecho

Debe mostrar:

- Elementos que originan la cantidad.
- Fórmula de cálculo.
- Área, longitud, volumen, peso o unidades.
- Diferencia contra la versión anterior.
- Partida relacionada.
- Evidencia de cálculo.
- Advertencias de elementos sin partida.

## 10. Flujo 6 — PRESUP-5D y GASTOS

### PRESUP-5D

El canvas central muestra presupuesto, partidas, APU, materiales, mano de obra, equipos, indirectos y cronograma valorizado.

El panel izquierdo controla estructura WBS, capítulos, regiones, moneda, versión de precios y filtros. El panel derecho explica la partida seleccionada, su origen BIM, fórmula, cantidad, precio unitario, subtotal, variación y evidencia.

### GASTOS

El canvas central muestra gastos reales, compromisos, valorizaciones, órdenes de cambio y desviaciones.

El panel izquierdo controla contrato, proveedor, periodo, centro de costo y estado. El panel derecho muestra la relación con partida, elemento BIM, orden, documento, aprobación y efecto sobre presupuesto y plazo.

## 11. Flujo 7 — 4D y avance de obra

### Objetivo

Comparar lo planificado con lo ejecutado.

### Panel izquierdo

Debe mostrar:

- WBS y actividades.
- Calendario.
- Línea base.
- Filtros por frente y disciplina.
- Fecha de corte.
- Escenario planificado, actualizado o real.

### Canvas central

Muestra Gantt, simulación temporal, avance por elementos y comparación planificado versus ejecutado.

### Panel derecho

Debe mostrar:

- Actividad seleccionada.
- Elementos relacionados.
- Porcentaje planificado y real.
- Duración.
- Ruta crítica.
- Evidencias de avance.
- Impacto en costo.
- Riesgo de plazo.

## 12. Flujo 8 — Clashes y coordinación

### Panel izquierdo

Debe mostrar disciplinas, reglas de interferencia, tolerancias, filtros por severidad y responsables.

### Canvas central

Muestra el elemento o conjunto de elementos en conflicto, su ubicación y el contexto espacial.

### Panel derecho

Debe mostrar:

- ID de clash.
- Elementos involucrados.
- Disciplinas responsables.
- Severidad.
- Fecha de detección.
- Responsable.
- Estado.
- Solución propuesta.
- Evidencias.
- Impacto en costo, plazo y expediente.

## 13. Flujo 9 — EXP-TEC

### Objetivo

Construir el expediente técnico desde información trazable del modelo y del proyecto.

### Panel izquierdo

Debe mostrar el índice del expediente:

- Memoria descriptiva.
- Memorias de cálculo.
- Especificaciones técnicas.
- Metrados.
- Presupuesto.
- Cronograma.
- Planos.
- Encofrados.
- Anexos.
- Revisión normativa.

También debe mostrar estado de cada documento y porcentaje de completitud.

### Canvas central

Muestra el documento, plano, tabla o memoria que se está revisando.

### Panel derecho

Debe mostrar:

- Fuente de cada dato.
- Elementos BIM relacionados.
- Versión del documento.
- Revisor y aprobador.
- Advertencias.
- Cambios desde la versión anterior.
- Firma y estado de aprobación.
- Exportaciones disponibles.

## 14. Flujo 10 — Campo móvil, COD y Luka

### Objetivo

Capturar la realidad de la obra y conectarla con el modelo.

### Panel izquierdo en celular o PWA

Debe ser simplificado y orientado a acción:

- Obra activa.
- Frente de trabajo.
- Elemento o espacio seleccionado.
- Capturar foto.
- Capturar video.
- Dictar observación.
- Escanear QR.
- Ubicar en plano.
- Crear incidencia.
- Crear RFI.
- Preparar asiento COD.

### Canvas central

En móvil muestra cámara, mapa, plano, AR o formulario de captura. En escritorio muestra la evidencia vinculada al modelo.

### Panel derecho

Debe mostrar:

- Coordenadas.
- Fecha y hora.
- Usuario.
- Elemento BIM.
- Partida.
- Actividad 4D.
- Evidencia adjunta.
- Texto OCR o transcripción.
- RFI sugerido.
- Asiento COD prellenado.
- Estado de revisión y firma.

La escritura automática en el COD solo debe habilitarse cuando exista API o convenio oficial. Antes de eso, ARKI prepara la información para revisión y carga autorizada.

## 15. Flujo 11 — JPRD

### Panel izquierdo

Debe mostrar consultas, respuestas, riesgos, controversias, plazos y evidencias por obra.

### Canvas central

Muestra la línea de tiempo de una consulta o controversia: origen, respuesta, cambios posteriores, impactos y estado.

### Panel derecho

Debe mostrar:

- Pregunta original.
- Norma, plano o especificación invocada.
- Usuarios y fechas.
- Respuesta y fundamento.
- Cambios de costo y plazo.
- Evidencias.
- Riesgo preventivo.
- Estado consultivo, preventivo o decisorio.
- Provenance completa.

Este módulo requiere backend, trazabilidad inmutable, COD y middleware de coordinación.

## 16. Flujo 12 — Recepción, as-built y O&M

### Panel izquierdo

Debe mostrar activos, sistemas, áreas, manuales, garantías, inspecciones, mantenimiento preventivo y órdenes de trabajo.

### Canvas central

Muestra el modelo as-built, ficha del activo, plano, foto de campo o calendario de mantenimiento.

### Panel derecho

Debe mostrar:

- Activo seleccionado.
- Fabricante y modelo.
- Número de serie.
- Fecha de instalación.
- Garantía.
- Manuales.
- Última inspección.
- Próximo mantenimiento.
- Historial de fallas.
- Responsable.
- Costo de operación.

## 17. Qué debe aparecer siempre en ambos paneles

### Siempre en el panel izquierdo

El usuario debe poder saber dónde está y qué puede hacer. Por eso el panel izquierdo siempre debe contener contexto, navegación, filtros y acciones del módulo activo.

### Siempre en el panel derecho

El usuario debe poder saber qué significa lo que está viendo. Por eso el panel derecho siempre debe contener propiedades, relaciones, impactos, evidencia, provenance y acciones de revisión.

### Cuando no hay selección

Ambos paneles deben mostrar un estado vacío útil, no un panel muerto. El izquierdo debe mostrar el contexto y las acciones disponibles. El derecho debe explicar qué aparecerá al seleccionar un elemento.

### Cuando hay selección

Ambos paneles deben actualizarse con el mismo identificador. El izquierdo puede mostrar el árbol y acciones del elemento. El derecho debe mostrar sus propiedades e impactos.

## 18. Orden de implementación recomendado

1. UI-3A: canvas 2D, selección semántica y Info Box compartido.
2. UI-3B: elementos, corte, elevación, 3D y vistas sincronizadas.
3. UI-3C: cuadros, command palette, atajos y undo/redo.
4. UI-3D: coordinación, reconciliación, clashes y propagación de impactos.
5. UI-4: familias paramétricas completas y backend básico.
6. UI-5: costos, gastos, 4D, valorizaciones y S-10.
7. UI-6: expediente técnico real, PDF, planos y conectores.
8. UI-7: operación, mantenimiento y activos.
9. Addendum B/E: campo móvil, captura y COD preparado.
10. Addenda F/G: middleware y JPRD.

## 19. Decisión de diseño recomendada

La pantalla no debe tener un panel izquierdo y otro derecho con contenido idéntico. La apariencia puede ser simétrica, pero la semántica debe ser distinta:

- **Izquierda:** contexto, navegación, filtros, herramientas y acciones.
- **Centro:** objeto principal de trabajo.
- **Derecha:** inspector, relaciones, costos, riesgos, evidencia y trazabilidad.

En UI-3A, como todavía no existe selección semántica, ambos paneles pueden conservar un estado vacío visualmente limpio. Cuando se implemente la selección, el izquierdo debe evolucionar hacia contexto de vista y el derecho hacia Info Box semántico.

Esta separación evita que ARKI se convierta en una interfaz decorativa y permite que la misma estructura funcione para arquitectura, estructura, MEP, costos, expediente, campo, COD, JPRD y mantenimiento.
