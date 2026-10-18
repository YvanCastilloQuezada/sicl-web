# ARKI — Orden maestra posterior a UI-2

## UI-3: Canvas BIM semántico, selección, vistas y productividad profesional

**Estado:** Preparada para ejecutar después de finalizar y verificar UI-2 v1.6.  
**Decisor:** Product Owner de ARKI.  
**Destinatario:** DeepSeek, como arquitecto y desarrollador de la siguiente fase.  
**Regla principal:** esta orden se redacta ahora, pero **no debe ejecutarse hasta que UI-2 v1.6 tenga veredicto final y el Product Owner lo autorice expresamente**.

---

## 1. Objetivo

ARKI debe dejar de comportarse como un dashboard que genera sólidos conceptuales y comenzar a comportarse como un **entorno BIM semántico, paramétrico y trazable**.

El objetivo de UI-3 es construir el primer canvas profesional de ARKI. El usuario deberá poder abrir una propuesta, verla en planta, corte y 3D, seleccionar elementos, consultar sus propiedades y modificar parámetros sin perder la relación entre geometría, materiales, metrados, presupuesto, cronograma y expediente.

La geometría no debe ser la fuente principal de verdad. La fuente de verdad será el modelo semántico constructivo. La geometría será una representación derivada del modelo.

> Un muro no es una colección de líneas. Es un elemento con identidad, familia, tipo, capas, materiales, nivel, fase, relaciones, metrados, costo, tareas y trazabilidad.

---

## 2. Alcance obligatorio de UI-3

UI-3 debe incluir cinco capacidades integradas:

1. **Canvas BIM real** con vistas 2D y 3D sincronizadas.
2. **Selección semántica** de elementos y propiedades conectadas.
3. **Navegación profesional** por proyecto, disciplina, nivel, fase y vista.
4. **Herramientas contextuales y atajos** que no llenen la pantalla de botones permanentes.
5. **Actualización controlada** desde el elemento seleccionado hasta metrados, costos, cronograma, IFC y expediente.

No se debe implementar una simulación visual que parezca BIM pero no actualice el modelo. Toda interacción declarada como funcional debe modificar datos reales o mostrar claramente el estado `CONCEPTUAL`, `PARTIAL`, `NOT AVAILABLE` o `FUTURE REFERENCE`.

---

## 3. Arquitectura funcional del canvas

El workspace debe conservar una estructura estable inspirada en los mejores principios de herramientas BIM profesionales, pero con una experiencia visual contemporánea y propia de ARKI:

- **Navigator izquierdo fijo:** proyecto, vistas, niveles, disciplinas, fases, familias y cuadros.
- **Canvas central:** planta, corte, elevación, 3D, documentación o vista especializada.
- **Info Box derecho fijo:** propiedades del elemento seleccionado, relaciones, materiales, metrados, costo y trazabilidad.
- **Toolbar contextual:** cambia según la vista, el módulo y la selección. No se deben mostrar cien acciones al mismo tiempo.
- **Tab bar superior:** conserva los 16 módulos canónicos de UI-2.
- **Command palette:** búsqueda de comandos, familias, vistas, elementos y acciones por teclado.

La interfaz debe conservar la paleta profesional aprobada en UI-2. No se debe cambiar el sistema visual sin ADR y autorización del Product Owner.

---

## 4. Modelo semántico y contrato de selección

Crear o consolidar un contrato tipado para la selección BIM. Como mínimo debe incluir:

- `elementId` estable y determinista.
- `category` y `elementType`.
- Familia y tipo.
- Disciplina.
- Nivel y fase.
- Sistema o conjunto al que pertenece.
- Materiales y capas.
- Parámetros editables y parámetros calculados.
- Metrados.
- Costo y partidas relacionadas.
- Tareas 4D vinculadas.
- Relaciones con otros elementos.
- Provenance e invalidaciones.
- Estado de validación.

El Info Box debe mostrar información real del `ProjectSnapshot`, `ConstructionModel`, `FamilyInstance` o DTO equivalente. No se aceptan objetos inventados únicamente para pintar la interfaz.

La selección debe ser capaz de seleccionar un elemento, varios elementos y un conjunto filtrado. Debe existir una selección vacía explícita y un mensaje claro cuando el canvas todavía no pueda identificar elementos.

---

## 5. Vistas 2D, corte y 3D

Implementar un pipeline de vistas sincronizadas. Una modificación realizada en una vista debe reflejarse en las demás sin duplicar el modelo.

### Planta 2D

La planta debe mostrar muros, puertas, ventanas, columnas, vigas, losas, escaleras, mobiliario, equipamiento y elementos MEP cuando existan en el modelo. Debe soportar niveles, ejes, cotas, etiquetas, simbología básica, filtros de disciplina y aislamiento de elementos.

### Corte y elevación

El corte debe representar la relación vertical entre niveles, losas, escaleras, cubiertas, aberturas, muros y elementos estructurales. Debe existir una línea de corte o una definición de sección que forme parte del estado de la vista.

### Modelo 3D

El visor 3D debe permitir orbitación, zoom, paneo, selección, aislamiento, ocultamiento temporal, mostrar todo y visualización por disciplina o categoría. La versión inicial puede usar una representación paramétrica eficiente, pero cada objeto visible debe conservar su `elementId`.

### Rendimiento

El canvas debe priorizar actualizaciones incrementales. No debe recalcular todo el proyecto por cada movimiento visual. La regeneración completa debe reservarse para cambios semánticos que realmente lo requieran.

---

## 6. Elementos prioritarios

El primer ciclo de UI-3 debe demostrar la cadena completa con elementos constructivos reales. El conjunto mínimo es:

- Muro con capas de ladrillo, tarrajeo interior, tarrajeo exterior, imprimante y pintura.
- Puerta.
- Ventana.
- Mampara metálica y de vidrio.
- Columna.
- Viga.
- Losa.
- Cimentación.
- Escalera por tipología.
- Techo o cubierta.
- Piso.
- Tabique.

El muro debe poder mostrar material, espesor, acabado, cantidad de manos de pintura, metrado, costo y relación con aberturas. Las capas no pueden quedar reducidas a un texto decorativo.

La estructura debe quedar preparada para incorporar ascensores, cámaras de seguridad, telecomunicaciones, aire acondicionado, agua caliente, gases medicinales, Wi-Fi, routers, racks, mobiliario, equipamiento y familias especializadas sin cambiar el contrato central.

---

## 7. Herramientas y atajos

Implementar una tabla de comandos tipada, visible desde la command palette y la ayuda contextual. Como mínimo:

| Atajo | Acción |
|---|---|
| `WA` | Crear muro |
| `DR` | Crear puerta |
| `WN` | Crear ventana |
| `MV` | Mover elemento |
| `CO` | Copiar elemento |
| `RO` | Rotar elemento |
| `TR` | Recortar o extender |
| `AL` | Alinear |
| `OF` | Desfase |
| `DE` | Eliminar |
| `HI` | Ocultar elemento |
| `IS` | Aislar selección |
| `ZE` | Encuadrar todo |
| `ZS` | Encuadrar selección |
| `VG` | Filtros de visibilidad |
| `UN` | Deshacer |
| `RE` | Rehacer |
| `Ctrl/Cmd+K` | Abrir command palette |

Los atajos deben funcionar únicamente cuando el contexto sea compatible. Si una acción todavía no está implementada, debe mostrar un estado honesto y no modificar datos silenciosamente.

---

## 8. Cuadros de planificación

Crear cuadros derivados del modelo, no tablas manuales. La primera versión debe incluir:

- Cuadro de muros por tipo, nivel y fase.
- Cuadro de puertas y ventanas.
- Cuadro de ambientes o espacios.
- Cuadro de materiales y capas.
- Cuadro de metrados por especialidad.
- Cuadro de elementos con costo.
- Cuadro de elementos sin familia o sin material.
- Cuadro de elementos con advertencias de coordinación.

Cada fila debe poder llevar al elemento en planta, corte o 3D. Los filtros deben ser por disciplina, nivel, fase, familia, tipo y estado de validación.

---

## 9. Flujo de cambios y trazabilidad

Toda modificación semántica debe producir una operación registrada. El sistema debe conservar:

- Estado anterior.
- Estado nuevo.
- Usuario o perfil local que ejecutó la acción.
- Fecha lógica o versión del snapshot.
- Elementos afectados.
- Metrados recalculados.
- Partidas afectadas.
- Tareas afectadas.
- Exportaciones invalidadas.
- Motivo de la invalidación.

El flujo mínimo obligatorio es:

`parámetro → geometría → materiales → metrado → partida → presupuesto → 4D → IFC → expediente`.

Si una etapa todavía no puede actualizarse, el sistema debe detener la promoción de estado y declarar la limitación.

Debe existir undo/redo para operaciones semánticas importantes y un snapshot inmutable antes de cambios críticos.

---

## 10. Reglas de coordinación BIM

Implementar reglas de validación que detecten, como mínimo:

- Aberturas fuera del muro.
- Elementos sin nivel.
- Elementos sin material.
- Muros con capas incoherentes.
- Solapes entre elementos estructurales.
- Escaleras que no conectan niveles.
- Puertas o ventanas fuera de un anfitrión válido.
- Elementos sin familia o tipo.
- Elementos sin costo cuando deberían tenerlo.
- Tareas 4D sin elemento vinculado.
- Exportaciones con entidades sin GUID.

Los resultados deben aparecer en un panel de incidencias con severidad, ubicación, regla, elemento afectado y acción recomendada. La coordinación debe prepararse para BCF sin declarar integración BCF completa hasta tener código y pruebas.

---

## 11. Importación y exportación

UI-3 no debe prometer importación nativa de RFA o RVT si todavía no existe conector y backend para ello. La arquitectura debe preparar adaptadores separados para:

- IFC.
- glTF/GLB.
- OBJ o formatos geométricos auxiliares.
- RFA/RVT mediante conector futuro.
- CSV de familias y parámetros.
- JSON de snapshots.

Cada importación debe pasar por un proceso de mapeo semántico. No se debe aceptar un sólido importado como familia BIM completa sin declarar qué se pudo mapear y qué se perdió.

Las exportaciones deben incluir cobertura, advertencias y versión del modelo. Nunca se debe perder información silenciosamente.

---

## 12. Onboarding y Avatar

El Avatar ARKI permanece fuera de UI-3 como producto ejecutable, pero UI-3 debe dejar puntos de integración limpios para su futura incorporación.

El Avatar tendrá posteriormente tres tamaños: botón circular, panel mediano y panel semigrande. Debe poder acompañar al usuario, explicar el flujo, leer documentos mediante OCR, interpretar planos, apoyar funciones de visión y participar en experiencias AR cuando se implementen. Su GLB, rig, gestos y animaciones deben tener contrato propio.

En UI-3 solo se debe preparar:

- Eventos de ayuda contextual.
- Anclas de tutorial.
- Mensajes de validación que el Avatar podrá consumir.
- Estado de onboarding.
- Registro de comandos y errores legibles.

No se debe inventar que el Avatar ya entiende el modelo si esa integración todavía no está implementada.

---

## 13. Estados y control de calidad

Cada módulo, herramienta y vista debe conservar estados explícitos:

`IMPLEMENTED`, `VERIFIED`, `PARTIAL`, `CONCEPTUAL`, `NOT AVAILABLE` y `FUTURE REFERENCE`.

No se permite declarar UI-3 completa por apariencia visual. Una capacidad solo puede promoverse a `VERIFIED` cuando tenga código funcional, test automatizado y prueba de interacción en el navegador.

No se permite añadir `any`, `Math.random()` o `Date.now()` en contratos críticos. Los identificadores deben ser deterministas. No se debe duplicar `Muro`, `WallDTO`, `ConstructionModel` ni los tipos paramétricos existentes sin ADR.

---

## 14. Entregas obligatorias de DeepSeek

DeepSeek debe entregar la fase en bloques pequeños y verificables:

### Entrega UI-3A — Canvas y selección

Debe incluir contratos de vista, selección, Info Box, planta inicial, selección vacía y pruebas de montaje.

### Entrega UI-3B — Elementos y vistas sincronizadas

Debe incluir muro, puerta, ventana, mampara, estructura básica, niveles, capas, materiales, planta, corte y 3D con `elementId` compartido.

### Entrega UI-3C — Cuadros y comandos

Debe incluir cuadros derivados del modelo, filtros, command palette, atajos, aislamiento, ocultamiento, undo/redo y pruebas de interacción.

### Entrega UI-3D — Reconciliación y coordinación

Debe incluir invalidaciones, incidencias, reglas de coherencia, vínculos BIM–costo–4D–IFC–expediente y exportaciones con cobertura.

No se debe avanzar de un bloque al siguiente si el anterior no obtiene `APPROVE` o `APPROVE WITH FIXES`.

---

## 15. Pruebas mínimas exigidas

Cada entrega debe incluir outputs reales de:

- `pnpm check`.
- `pnpm build`.
- Regresión de todos los tests existentes.
- Test de selección semántica.
- Test de coherencia de vistas.
- Test de actualización de Info Box.
- Test de atajos.
- Test de filtros por disciplina, nivel y fase.
- Test de cuadros derivados.
- Test de determinismo.
- Test de exportación y cobertura.
- Prueba de navegador con las acciones principales.

La evidencia debe incluir código completo, diff, manifest, outputs sin resumir, capturas por vista y hash SHA-256 del paquete.

---

## 16. Fuera de alcance inmediato

Quedan fuera de esta orden, salvo autorización posterior y contrato propio:

- Avatar 3D final en GLB con rig y animaciones.
- OCR productivo y visión artificial.
- Realidad aumentada.
- Autenticación productiva multiusuario.
- Worksharing concurrente.
- Conectores nativos RFA/RVT.
- Mantenimiento operativo completo.
- Firma digital y emisión oficial del expediente.
- Integraciones comerciales externas sin credenciales y contrato de seguridad.

Estos temas deben conservarse como addenda independientes para no contaminar el núcleo de UI-3.

---

## 17. Mensaje corto para enviar a DeepSeek

> DeepSeek, prepara la implementación de UI-3 de ARKI para ejecutarla únicamente después de que UI-2 v1.6 tenga veredicto final. El objetivo es transformar ARKI en un canvas BIM semántico, no en un dashboard visual. Debes implementar por bloques UI-3A, UI-3B, UI-3C y UI-3D, sin saltarte verificaciones.
>
> Prioriza canvas planta/corte/3D, selección semántica, Info Box conectado al modelo, muros con capas y materiales, elementos constructivos con GUID determinista, vistas sincronizadas, niveles, fases, disciplinas, filtros, cuadros derivados, command palette, atajos, undo/redo, incidencias de coordinación, trazabilidad e invalidaciones.
>
> Mantén la navegación de UI-2 y los 16 módulos canónicos. No dupliques contratos existentes. No inventes funcionalidades. Respeta los estados `IMPLEMENTED`, `VERIFIED`, `PARTIAL`, `CONCEPTUAL`, `NOT AVAILABLE` y `FUTURE REFERENCE`.
>
> No ejecutes todavía. Primero devuelve el plan técnico, los contratos que tocarás, el árbol de archivos, los ADR necesarios, los riesgos, los criterios de aceptación y la secuencia de entregas. Espera autorización explícita del Product Owner para comenzar UI-3A.

---

## 18. Criterio de éxito

ARKI podrá afirmar que comenzó su transición real a BIM cuando un usuario pueda seleccionar un muro en planta o 3D, ver sus capas y propiedades, modificar un parámetro permitido, observar el cambio en las vistas relacionadas y recibir el impacto trazable en metrado, costo, cronograma, IFC y expediente, o una declaración explícita de qué etapa aún no está disponible.

Ese flujo demostrará que ARKI no solo dibuja sólidos: **comprende elementos, relaciones y consecuencias del proyecto**.

## Referencias

[1]: ARKI_CONTRATO_UI_BIM_CORPORATIVO_V2.md "Contrato corporativo de interfaz BIM de ARKI"
[2]: ARKI_ADDENDUM_AVATAR_INTELIGENTE_FUTURO.md "Addendum futuro del Avatar inteligente ARKI"
[3]: ARKI_UI2_V16_VERIFICATION_PACKAGE/README.md "Paquete verificable de UI-2 v1.6"
[4]: ARKI_VEREDICTO_UI2_V16.md "Veredicto de UI-2 v1.6"
