# ARCHI — Especificación propia de controles funcionales para los 16 módulos

**Versión:** 1.0  
**Alcance:** producto propio Archi, no una copia de Archicad  
**Propósito:** definir los controles necesarios para que los módulos 2D, 3D, BIM, costos, expediente y ciclo de vida funcionen de forma coherente.

## 1. Aclaración de producto

Archi es un sistema propio. Archicad puede servir como referencia conceptual de interacción, pero no define el producto ni sus contratos. Los controles de este documento se derivan de la visión de Archi: generar familias y espacios, construir un modelo BIM semántico, producir metrados, costos, 4D, expediente técnico, coordinación, campo, COD, JPRD y mantenimiento.

El objetivo no es llenar la pantalla de botones. El objetivo es que cada control tenga una función clara dentro del flujo de trabajo y que cada modificación produzca efectos trazables en el modelo, los metrados, los costos, el cronograma y el expediente.

## 2. Arquitectura común de controles

Todas las pantallas deben mantener una estructura común:

```text
┌──────────────────┬─────────────────────────────────────┬──────────────────┐
│ CONTEXTO         │ CANVAS O ÁREA DE TRABAJO            │ INSPECTOR        │
│                  │                                     │                  │
│ navegación       │ modelo 2D, modelo 3D, tabla,        │ propiedades       │
│ filtros          │ documento, cronograma o evidencia   │ relaciones        │
│ herramientas     │                                     │ costos           │
│ acciones         │                                     │ trazabilidad     │
└──────────────────┴─────────────────────────────────────┴──────────────────┘
```

### 2.1 Controles globales

Estos controles deben existir en todo el workspace:

- Selector de proyecto y versión activa.
- Indicador de snapshot actual.
- Selector de idioma con ocho idiomas: español, inglés, portugués, francés, alemán, italiano, chino y japonés.
- Ayuda contextual.
- Estado del motor local o backend.
- Guardar snapshot.
- Deshacer y rehacer cuando el módulo permita edición.
- Buscar por ID, familia, tipo, nombre o partida.
- Filtros activos visibles.
- Indicador de cambios sin guardar.
- Validación del módulo.
- Exportación permitida según el módulo.

### 2.2 Reglas comunes de interacción

- Todo elemento BIM debe tener un `elementId` determinista.
- Seleccionar en el canvas debe actualizar el árbol y el inspector.
- Seleccionar en el árbol debe resaltar el elemento en el canvas.
- El panel derecho nunca debe mostrar datos de un elemento distinto al seleccionado.
- Los cambios deben indicar qué objetos, metrados, costos, tareas y documentos pueden verse afectados.
- Los filtros deben poder limpiarse con una acción visible.
- El usuario siempre debe poder volver al estado anterior o cancelar una operación antes de confirmarla.
- Una acción que modifique el modelo debe indicar si afecta geometría, materiales, cantidades, costos, plazo o expediente.
- Ningún control debe aparentar estar implementado si solo está registrado como futuro.

## 3. Módulo 1 — Data

### Propósito

Administrar datos base, catálogos, parámetros, normas, materiales, precios, usuarios técnicos y fuentes de información.

### Panel izquierdo: contexto y controles

- Selector de organización.
- Selector de proyecto.
- Selector de disciplina.
- Selector de fuente de datos.
- Filtro por tipo de dato.
- Filtro por estado: activo, pendiente, obsoleto.
- Filtro por versión.
- Árbol de catálogos.
- Buscar por código o nombre.
- Importar datos autorizados.
- Crear registro.
- Duplicar registro.
- Comparar versiones.
- Archivar registro.

### Canvas central

- Tabla de datos.
- Editor de registro.
- Comparador de versiones.
- Vista de relaciones entre datos.
- Vista de errores y registros incompletos.

### Panel derecho: inspector

- Identidad del registro.
- Fuente.
- Versión.
- Responsable.
- Fecha de vigencia.
- Registros que lo consumen.
- Cambios pendientes.
- Impacto potencial en familias, metrados, costos o expediente.
- Provenance.

### Pruebas funcionales

Crear un material, asociarlo a un muro, cambiar su versión y comprobar qué familias, metrados y costos quedan afectados.

## 4. Módulo 2 — Biblioteca

### Propósito

Administrar familias paramétricas, tipos, materiales, mobiliario, equipamiento, estructuras, instalaciones y objetos importados.

### Panel izquierdo

- Categorías: arquitectura, estructura, MEP, mobiliario, equipamiento, seguridad y exteriores.
- Filtro por disciplina.
- Filtro por tipología de obra.
- Filtro por nivel de detalle.
- Filtro por origen: Archi, importada, corporativa o usuario.
- Filtro por compatibilidad de exportación.
- Buscar familia.
- Crear familia.
- Importar familia.
- Duplicar familia.
- Crear tipo.
- Comparar familias.

### Canvas central

- Tarjetas de familias.
- Vista previa 2D.
- Vista previa 3D.
- Editor de parámetros.
- Editor de tipos.
- Editor de materiales.
- Vista de geometría paramétrica.

### Panel derecho

- Parámetros y rangos.
- Planos de referencia.
- Restricciones.
- Tipos disponibles.
- Materiales y acabados.
- Reglas de metrado.
- Reglas de costo.
- Reglas 4D.
- Cobertura IFC.
- Cobertura Revit.
- Historial de cambios.

### Pruebas funcionales

Cambiar ancho, alto y espesor de una familia. Verificar que la geometría, el metrado, el costo y la representación 2D/3D cambien de forma consistente.

## 5. Módulo 3 — Proyectos

### Propósito

Crear, organizar, versionar y controlar los proyectos de Archi.

### Panel izquierdo

- Lista de organizaciones.
- Lista de proyectos.
- Filtro por estado.
- Filtro por cliente.
- Filtro por tipología.
- Árbol de etapas.
- Árbol de disciplinas.
- Crear proyecto.
- Duplicar proyecto.
- Abrir snapshot.
- Comparar snapshots.
- Cerrar proyecto.

### Canvas central

- Resumen del proyecto.
- Hitos.
- Etapa actual.
- Progreso documental.
- Progreso BIM.
- Riesgos.
- Vista general del modelo.

### Panel derecho

- Código y nombre.
- Cliente y ubicación.
- Normativa.
- Responsables.
- Versión.
- Estado de aprobación.
- Último snapshot.
- Cambios recientes.
- Dependencias.
- Alertas de información faltante.

### Pruebas funcionales

Crear una segunda versión del proyecto, modificar una familia y verificar que el snapshot anterior permanezca reconstruible.

## 6. Módulo 4 — Generador

### Propósito

Generar propuestas de familias, edificios, espacios y variantes a partir de parámetros declarativos.

### Panel izquierdo

- Paso 1: familia base.
- Paso 2: tipología.
- Paso 3: terreno y ubicación.
- Paso 4: área y aforo.
- Paso 5: niveles.
- Paso 6: restricciones.
- Paso 7: materiales.
- Paso 8: reglas constructivas.
- Selector de variante.
- Búsqueda de familia.
- Guardar parámetros.
- Generar.
- Regenerar.
- Comparar.
- Restablecer parámetros.

### Canvas central

- Vista previa de planta.
- Vista previa de corte.
- Masa 3D conceptual.
- Indicadores de área y volumen.
- Estado de generación.
- Comparador de variantes.

### Panel derecho

- Parámetros aplicados.
- Elementos creados.
- Espacios creados.
- Materiales.
- Metrados preliminares.
- Presupuesto preliminar.
- Duración preliminar.
- Advertencias.
- Reglas que fallaron.
- Estado de la propuesta.
- Guardar snapshot.
- Exportar propuesta.

### Pruebas funcionales

Modificar aforo, número de niveles, ancho y alto. Comprobar que cambien los espacios, las áreas, la geometría, los elementos, los metrados, el costo y la duración.

## 7. Módulo 5 — Modelo BIM

### Propósito

Representar el proyecto como modelo semántico compuesto por espacios, elementos constructivos, materiales, relaciones, costos, tareas y documentos.

### Panel izquierdo

- Árbol del modelo.
- Niveles.
- Disciplinas.
- Fases.
- Categorías visibles.
- Filtro por familia.
- Filtro por tipo.
- Filtro por estado.
- Mostrar u ocultar elementos.
- Buscar por ID.
- Herramienta de selección.
- Herramienta de medir.
- Herramienta de aislar.
- Herramienta de encuadre.

### Canvas central

- Modelo 2D o 3D según la vista.
- Grilla.
- Ejes.
- Niveles.
- Elementos semánticos.
- Resaltado.
- Medición.
- Navegación orbital cuando exista vista 3D.

### Panel derecho

- ID y categoría.
- Familia y tipo.
- Nivel, fase y disciplina.
- Geometría.
- Capas y materiales.
- Metrados.
- Costo.
- Partida.
- Actividad 4D.
- Espacio asociado.
- Clashes.
- RFIs.
- Evidencias.
- Provenance.

### Pruebas funcionales

Seleccionar un muro en el árbol y en el canvas. Verificar que ambas selecciones sean la misma y que el inspector se actualice sin datos obsoletos.

## 8. Módulo 6 — Planta

### Propósito

Trabajar la vista horizontal 2D del modelo.

### Panel izquierdo

- Selector de nivel.
- Selector de disciplina.
- Selector de fase.
- Categorías visibles.
- Grilla.
- Ejes.
- Mostrar u ocultar espacios.
- Herramienta seleccionar.
- Herramienta zoom.
- Herramienta pan.
- Herramienta encuadrar.
- Árbol de niveles, categorías y elementos.
- Buscar elemento.

### Canvas central

- Planta 2D.
- Muros.
- Puertas.
- Ventanas.
- Columnas.
- Vigas.
- Losas.
- Espacios.
- Ejes y niveles.
- Selección individual.
- Selección múltiple con Shift.
- Click vacío para limpiar.
- Escape para limpiar.

### Panel derecho

- Estado del modelo si no hay selección.
- Propiedades del elemento.
- Capas de muro.
- Materiales.
- Metrados.
- Costo.
- Partida.
- Actividad 4D.
- Relaciones.
- Provenance.

### Pruebas funcionales

Comprobar click, Shift + click, click fuera, Escape, zoom, pan, encuadre y sincronización entre árbol, canvas e inspector.

## 9. Módulo 7 — Corte

### Propósito

Analizar la relación vertical entre niveles, espacios y elementos.

### Panel izquierdo

- Selector de línea de corte.
- Profundidad de corte.
- Nivel inicial y final.
- Disciplina.
- Fase.
- Categorías visibles.
- Mostrar cotas.
- Mostrar niveles.
- Herramientas de selección y medición.

### Canvas central

- Corte vertical.
- Muros y capas.
- Losas.
- Vigas.
- Columnas.
- Escaleras.
- Puertas y ventanas.
- Cotas y niveles.

### Panel derecho

- Alturas.
- Espesores.
- Encuentros.
- Capas.
- Materiales.
- Elementos que atraviesan el corte.
- Advertencias de continuidad.
- Metrados y costos afectados.

### Pruebas funcionales

Cambiar altura de nivel y espesor de losa. Verificar que el corte, los elementos relacionados, los metrados y el costo se actualicen.

## 10. Módulo 8 — 3D

### Propósito

Visualizar y revisar el modelo espacial.

### Panel izquierdo

- Selector de cámara.
- Vista axonométrica.
- Vistas predefinidas.
- Órbita.
- Pan.
- Zoom.
- Encuadre.
- Sección.
- Categorías visibles.
- Disciplina.
- Fase.
- Estilo de representación.
- Transparencia.
- Aislar elemento.

### Canvas central

- Modelo 3D navegable.
- Selección de elementos.
- Resaltado.
- Sección del modelo.
- Medición.
- Recorrido de cámara.
- Visualización de materiales.

### Panel derecho

- Propiedades del elemento.
- Materiales.
- Capas.
- Relaciones espaciales.
- Clashes.
- Metrados.
- Costo.
- Estado de fabricación o ejecución.
- Evidencias.

### Pruebas funcionales

Seleccionar el mismo elemento en planta y 3D, verificar identidad, aplicar una sección y comprobar que el modelo mantenga la coherencia.

## 11. Módulo 9 — Metrados

### Propósito

Obtener cantidades desde el modelo semántico.

### Panel izquierdo

- Regla de medición.
- Disciplina.
- Nivel.
- Fase.
- Categoría.
- Familia.
- Partida.
- Unidad.
- Inclusión de capas.
- Agrupación.
- Snapshot de referencia.
- Recalcular.

### Canvas central

- Tabla de metrados.
- Totales.
- Agrupaciones.
- Diferencias entre versiones.
- Elementos sin partida.
- Elementos sin unidad.

### Panel derecho

- Fórmula.
- Elementos origen.
- Dimensiones usadas.
- Cantidad.
- Unidad.
- Partida.
- Costo derivado.
- Cambios desde snapshot anterior.
- Evidencia de cálculo.

### Pruebas funcionales

Cambiar la longitud de un muro y comprobar que se actualicen área, volumen, peso, partida y total presupuestal.

## 12. Módulo 10 — PRESUP-5D

### Propósito

Relacionar modelo, cantidades, APU y presupuesto.

### Panel izquierdo

- Estructura WBS.
- Capítulos.
- Partidas.
- Región.
- Lista de precios.
- APU.
- Moneda.
- Impuestos.
- Costos directos e indirectos.
- Recalcular presupuesto.
- Comparar versiones.
- Exportar.

### Canvas central

- Presupuesto por capítulos.
- APU.
- Curva de costos.
- Cantidades.
- Precios unitarios.
- Variaciones.
- Presupuesto por nivel y disciplina.

### Panel derecho

- Partida seleccionada.
- Elementos BIM origen.
- Unidad y cantidad.
- Precio unitario.
- Mano de obra.
- Materiales.
- Equipos.
- Parcial.
- Indirectos.
- Variación.
- Evidencia y aprobación.

### Pruebas funcionales

Cambiar material o cantidad de una familia y verificar la reconciliación entre modelo, metrado, APU y presupuesto.

## 13. Módulo 11 — GASTOS

### Propósito

Controlar gasto real, compromisos, contratos, valorizaciones y desviaciones.

### Panel izquierdo

- Obra.
- Contrato.
- Proveedor.
- Centro de costo.
- Periodo.
- Tipo de gasto.
- Estado de aprobación.
- Importar gasto.
- Registrar gasto.
- Aprobar.
- Rechazar.
- Comparar contra presupuesto.

### Canvas central

- Tabla de gastos.
- Comprometido versus ejecutado.
- Flujo de valorizaciones.
- Desviaciones.
- Curva S.

### Panel derecho

- Documento.
- Proveedor.
- Partida.
- Elemento BIM relacionado.
- Monto.
- Impuesto.
- Estado de pago.
- Aprobadores.
- Evidencia.
- Impacto en presupuesto y plazo.

### Pruebas funcionales

Registrar una valorización vinculada a elementos ejecutados y comprobar su efecto en gastos, presupuesto y avance 4D.

## 14. Módulo 12 — 4D

### Propósito

Relacionar elementos BIM con actividades, fechas y avance.

### Panel izquierdo

- Estructura WBS.
- Actividades.
- Calendario.
- Línea base.
- Fecha de corte.
- Frentes.
- Responsables.
- Ruta crítica.
- Escenario planificado, actualizado o real.
- Recalcular avance.

### Canvas central

- Gantt.
- Simulación temporal.
- Modelo coloreado por avance.
- Comparación planificado versus ejecutado.
- Curva de avance.

### Panel derecho

- Actividad.
- Elementos vinculados.
- Duración.
- Predecesoras.
- Porcentaje planificado.
- Porcentaje real.
- Evidencias.
- Riesgo de atraso.
- Impacto económico.

### Pruebas funcionales

Cambiar duración o porcentaje ejecutado de una actividad y comprobar que cambien cronograma, avance, riesgos y relación con elementos.

## 15. Módulo 13 — Clashes

### Propósito

Detectar, revisar y resolver interferencias entre disciplinas.

### Panel izquierdo

- Disciplinas a comparar.
- Reglas.
- Tolerancia.
- Severidad.
- Estado.
- Responsable.
- Fecha.
- Filtro por nivel.
- Ejecutar detección.
- Recalcular.
- Asignar.
- Cerrar.

### Canvas central

- Elementos en conflicto.
- Ubicación.
- Sección local.
- Vista 3D cuando esté disponible.
- Comparación antes y después.

### Panel derecho

- ID del clash.
- Elementos.
- Disciplinas.
- Severidad.
- Responsable.
- Estado.
- Solución.
- Fecha límite.
- Impacto en costo, plazo y expediente.
- Evidencias.
- RFI asociado.

### Pruebas funcionales

Mover una tubería o una viga hacia una posición conflictiva, detectar el clash, asignarlo, corregirlo y comprobar que el estado cambie con historial.

## 16. Módulo 14 — EXP-TEC

### Propósito

Generar y controlar el expediente técnico desde información trazable.

### Panel izquierdo

- Índice del expediente.
- Memoria descriptiva.
- Memorias de cálculo.
- Especificaciones.
- Metrados.
- Presupuesto.
- Cronograma.
- Planos.
- Encofrados.
- Anexos.
- Revisión normativa.
- Estado documental.
- Generar documento.
- Revisar.
- Aprobar.
- Exportar.

### Canvas central

- Documento.
- Plano.
- Tabla.
- Memoria.
- Comparador de versiones.
- Previsualización de expediente.

### Panel derecho

- Fuente de cada dato.
- Elementos BIM relacionados.
- Versión.
- Autor.
- Revisor.
- Aprobador.
- Cambios.
- Advertencias.
- Firma.
- Estado de completitud.
- Dependencias faltantes.

### Pruebas funcionales

Cambiar una dimensión estructural y comprobar qué memorias, metrados, presupuesto, planos y especificaciones quedan marcados para regeneración o revisión.

## 17. Módulo 15 — O-M

### Propósito

Administrar operación, activos, garantías, mantenimiento y vida útil.

### Panel izquierdo

- Edificio.
- Sistema.
- Activo.
- Ubicación.
- Tipo de mantenimiento.
- Estado.
- Prioridad.
- Responsable.
- Calendario.
- Registrar incidencia.
- Crear orden de trabajo.
- Programar mantenimiento.

### Canvas central

- Modelo as-built.
- Plano de activos.
- Ficha del equipo.
- Calendario de mantenimiento.
- Historial de fallas.

### Panel derecho

- Activo.
- Fabricante.
- Modelo.
- Serie.
- Instalación.
- Garantía.
- Manuales.
- Última inspección.
- Próximo mantenimiento.
- Costos de operación.
- Historial.
- Responsable.

### Pruebas funcionales

Seleccionar un equipo, crear mantenimiento preventivo, registrar una falla y comprobar que cambien calendario, estado, costo y evidencia.

## 18. Módulo 16 — ADM

### Propósito

Administrar organizaciones, usuarios, roles, permisos, normas, plantillas y gobierno de información.

### Panel izquierdo

- Organización.
- Proyecto.
- Usuarios.
- Roles.
- Disciplinas.
- Permisos.
- Plantillas.
- Estándares.
- Integraciones.
- Auditoría.
- Invitar usuario.
- Asignar rol.
- Revocar acceso.
- Exportar auditoría.

### Canvas central

- Matriz de permisos.
- Lista de usuarios.
- Plantillas corporativas.
- Registro de auditoría.
- Configuración de estándares.

### Panel derecho

- Usuario o rol seleccionado.
- Permisos efectivos.
- Proyectos autorizados.
- Acciones recientes.
- Fecha de acceso.
- Cambios de permisos.
- Alertas de seguridad.
- Estado de integración.

### Pruebas funcionales

Crear un usuario especialista, darle acceso a un proyecto, verificar módulos visibles y confirmar que una acción no autorizada quede bloqueada y auditada.

## 19. Controles especiales de 2D, 3D y BIM

### Controles 2D

- Seleccionar.
- Selección múltiple.
- Zoom in y zoom out.
- Pan.
- Encuadre.
- Grilla.
- Ejes.
- Niveles.
- Medir distancia.
- Medir área.
- Medir ángulo.
- Mostrar u ocultar categorías.
- Mostrar u ocultar cotas.
- Aislar elementos.
- Buscar elemento.
- Resaltar selección.
- Limpiar selección.

### Controles 3D

- Órbita.
- Pan.
- Zoom.
- Encuadre.
- Vista axonométrica.
- Vistas ortogonales.
- Sección.
- Caja de recorte.
- Transparencia.
- Estilo de materiales.
- Aislar elemento.
- Ocultar temporalmente.
- Medir.
- Seleccionar por cara o por objeto.
- Guardar vista.
- Restaurar vista.

### Controles BIM

- Árbol de elementos.
- Selección semántica.
- Propiedades.
- Relaciones.
- Niveles.
- Disciplinas.
- Fases.
- Categorías.
- Materiales.
- Metrados.
- Costos.
- Actividades 4D.
- Clashes.
- Documentos relacionados.
- Provenance.
- Versiones.
- Comparación de snapshots.
- Reglas de validación.

## 20. Orden correcto de pruebas antes de construir más interfaz

Antes de declarar terminado cualquier módulo, Archi debe ejecutar una prueba controlada:

1. Crear o cargar una familia.
2. Modificar un parámetro.
3. Observar el cambio geométrico.
4. Observar el cambio semántico.
5. Recalcular metrado.
6. Recalcular costo.
7. Actualizar actividad 4D.
8. Verificar relaciones.
9. Generar advertencias si corresponde.
10. Crear un snapshot.
11. Comparar contra el estado anterior.
12. Confirmar qué documentos deben regenerarse.

Esta secuencia es más importante que la apariencia de los paneles. Los controles deben diseñarse después de observar qué operaciones realmente necesita el motor.

## 21. Estado actual honesto

Los controles descritos en este documento son la **especificación funcional objetivo de Archi**. No significa que los 16 módulos ya tengan todos estos controles implementados.

Actualmente existen el motor paramétrico, partes del modelo constructivo, costos, expediente conceptual, UI-1 y UI-2. El canvas BIM interactivo, la selección semántica completa, el contexto de vista, la sincronización 2D/3D, el backend, el campo móvil, COD, Luka, JPRD y O&M permanecen en diferentes etapas futuras.

Por esa razón, antes de avanzar se debe validar el motor con pruebas paramétricas y convertir cada resultado en controles concretos. No se debe copiar una interfaz de Archicad sin probar primero cómo responde el motor propio de Archi.

## 22. Decisión recomendada

El siguiente paso correcto no es implementar los 16 módulos al mismo tiempo. Es ejecutar una **fase de descubrimiento funcional de Archi** con una familia, un muro, una puerta, una ventana, una columna, una viga, una losa, un espacio y una variante de edificio.

Con esos casos se valida qué parámetros existen realmente, qué cálculos se propagan y qué controles son necesarios. Después se cierra UI-3A con el ContextPanel izquierdo y el InfoBoxPanel derecho sobre evidencia real.
