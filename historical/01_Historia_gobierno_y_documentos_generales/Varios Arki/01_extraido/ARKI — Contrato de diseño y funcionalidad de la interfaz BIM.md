# ARKI — Contrato de diseño y funcionalidad de la interfaz BIM

**Versión:** 1.0  
**Fecha:** 22 de septiembre de 2026  
**Producto:** ARKI / Generador de Familias  
**Propietario del producto:** Usuario  
**Diseño y arquitectura de UI:** DeepSeek  
**Integración, compilación y verificación:** Manus  
**Estado:** Orden aprobada para diseño e implementación por entregas

## 1. Objeto del contrato

DeepSeek debe diseñar la interfaz completa de ARKI y entregar especificaciones, componentes, estados, flujos, atajos y criterios verificables para que Manus pueda integrarlos en el proyecto. La interfaz debe ser **minimalista, profesional, funcional y orientada a BIM**.

La referencia de interacción será la organización espacial de herramientas BIM profesionales, especialmente la separación entre barra de pestañas, toolbar contextual, navegador del proyecto, caja de información, toolbox, canvas central y barra de estado. ARKI no debe copiar la identidad visual, iconos, textos ni diseño propietario de Archicad. Debe adoptar únicamente la lógica de un workspace técnico y construir una identidad propia.

La UI utilizará como fondo base el color solicitado por el Product Owner:

```text
HEX:  #080736
RGB:  rgb(8, 7, 54)
HSL:  hsl(241, 77%, 12%)
CMYK: aproximadamente 85, 87, 0, 79
```

El texto principal será blanco. El sistema de estados utilizará amarillo, naranja y verde, con colores auxiliares azulados y rojos únicamente cuando sean necesarios para legibilidad, error o bloqueo.

> La interfaz debe sentirse como una estación de trabajo BIM profesional: sobria, oscura, precisa, rápida y orientada a la tarea. No debe parecer una landing page ni un dashboard genérico.

## 2. Alcance funcional

El contrato cubre la capa de experiencia de usuario para las siguientes áreas:

1. Inicio y estado del workspace.
2. Proyectos.
3. Configuración del proyecto.
4. Biblioteca de familias.
5. Editor de familias paramétricas.
6. Generador de propuestas.
7. Modelo BIM.
8. Editor 2D.
9. Visor 3D.
10. Metrados y presupuesto.
11. Programación y avance 4D.
12. Coordinación y clashes.
13. Expediente técnico.
14. Operación y mantenimiento.
15. Importación y exportación.
16. Historial, versiones y auditoría.
17. Configuración, ayuda y diagnósticos.

No se debe simular que una función existe. Todo botón visible debe ejecutar una acción real, cambiar el estado de la interfaz, abrir un panel funcional o mostrar un mensaje claro de capacidad pendiente. No debe haber botones decorativos sin comportamiento.

Cuando una capacidad todavía no exista en el motor, la UI debe mostrarla como **No disponible en esta versión** y explicar qué requisito falta. No debe presentar una acción futura como si estuviera implementada.

## 3. Arquitectura visual obligatoria

La aplicación debe usar un **BIM Workspace Shell** persistente. Las páginas no deben repetir una cabecera diferente ni romper la navegación del proyecto.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ARKI · proyecto · pestañas de vistas · acciones globales             │
├──────────────────────────────────────────────────────────────────────┤
│ Toolbar contextual: seleccionar · crear · editar · medir · exportar  │
├──────────────┬───────────────────────────────────────────┬───────────┤
│ Navigator /  │                                           │ Info Box  │
│ Toolbox      │                 Canvas                    │ Propiedad │
│              │       2D · 3D · datos · documentos        │ y estado  │
├──────────────┴───────────────────────────────────────────┴───────────┤
│ Status bar · unidades · nivel · fase · disciplina · escala · filtros │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.1 Barra superior

La barra superior debe mostrar:

- Marca ARKI.
- Nombre del proyecto activo.
- Estado del proyecto.
- Pestañas abiertas.
- Indicador de versión.
- Estado de guardado.
- Acceso a historial.
- Acceso a ayuda.
- Perfil o identidad local.
- Menú de acciones globales.

El nombre del proyecto y la versión deben permanecer visibles mientras el usuario trabaja.

### 3.2 Tab bar

Las pestañas deben representar vistas o módulos abiertos, no solamente rutas técnicas. Como mínimo:

```text
Inicio
Generador
Planta
Corte
3D
BIM
Presupuesto
4D
Clashes
Expediente
```

Cada pestaña debe poder:

- Activarse con clic.
- Cerrarse si no es una vista fija.
- Mostrar estado modificado.
- Mostrar indicador de error o advertencia.
- Recordar su estado de selección y filtros.
- Abrirse mediante atajo.

### 3.3 Toolbar contextual

La toolbar cambia según la vista activa. Debe mostrar únicamente acciones válidas para el contexto actual.

Acciones globales:

```text
Seleccionar
Deshacer
Rehacer
Guardar borrador
Regenerar
Medir
Buscar
Comparar
Exportar
Ayuda
```

Acciones de planta:

```text
Muro
Puerta
Ventana
Mampara
Espacio
Cota
Eje
Nivel
Alinear
Desfasar
Recortar
Ocultar
```

Acciones de modelo BIM:

```text
Seleccionar elemento
Aislar selección
Ocultar selección
Mostrar todo
Filtrar disciplina
Filtrar fase
Consultar propiedades
Ver relaciones
Ver metrados
```

Acciones de expediente:

```text
Editar
Guardar borrador
Validar
Comparar versión
Descargar Markdown
Exportar JSON
Preparar emisión
```

Cada acción debe tener:

- Icono.
- Texto o tooltip.
- Atajo cuando exista.
- Estado habilitado/deshabilitado.
- Explicación accesible.

### 3.4 Navigator

El navegador debe ser un panel izquierdo plegable con árbol jerárquico. Debe mostrar:

```text
Proyecto
├── Vistas
│   ├── Planta general
│   ├── Plantas por nivel
│   ├── Cortes
│   ├── Elevaciones
│   └── Modelo 3D
├── Niveles
├── Espacios
├── Elementos constructivos
│   ├── Muros
│   ├── Columnas
│   ├── Vigas
│   ├── Losas
│   ├── Puertas
│   ├── Ventanas
│   ├── Escaleras
│   ├── Pisos
│   ├── Techos
│   └── Tabiques
├── Familias paramétricas
├── Disciplinas
├── Documentos
├── Presupuesto
├── Cronograma
├── Clashes
└── Historial
```

El navegador debe permitir búsqueda, expansión y colapso, selección de elemento y navegación al canvas correspondiente.

### 3.5 Toolbox

El toolbox será un panel compacto con herramientas de creación, selección y consulta. En la primera versión no debe prometer edición geométrica avanzada si el motor todavía no la soporta.

Las herramientas deben tener tres estados:

```text
disponible
seleccionada
no disponible
```

Una herramienta no disponible debe explicar el motivo. No debe parecer un botón roto.

### 3.6 Canvas central

El canvas es el espacio de trabajo principal. Debe poder mostrar:

- Vista 2D conceptual.
- Vista 3D conceptual.
- Tabla BIM.
- Propiedades.
- Metrados.
- Presupuesto.
- Cronograma.
- Expediente.
- Comparación.

El canvas debe preservar el contexto del proyecto y mostrar un estado vacío útil cuando no hay una propuesta generada.

### 3.7 Info Box

El panel derecho debe mostrar la información del objeto seleccionado. Como mínimo:

```text
ID
Familia
Tipo
Disciplina
Nivel
Fase
Estado
Versión
Dimensiones
Materiales
Metrado
Costo
Duración
Relaciones
Origen
Última modificación
Advertencias
```

Si el elemento no está seleccionado, debe mostrar las propiedades de la vista o una guía breve de selección.

### 3.8 Barra de estado

La barra inferior debe mostrar:

- Estado de guardado.
- Versión actual.
- Unidad activa.
- Nivel activo.
- Disciplina activa.
- Fase activa.
- Escala de vista.
- Número de elementos visibles.
- Warnings.
- Estado del motor.

### 3.9 Quick Options Bar

La barra inferior contextual debe permitir cambiar rápidamente:

```text
Nivel
Disciplina
Fase
Escala
Unidades
Filtros
Modo de selección
Calidad de visualización
```

Los cambios deben reflejarse en el canvas y no perderse al cambiar de pestaña sin que el usuario lo sepa.

## 4. Sistema visual

### 4.1 Paleta

| Token | Valor | Uso |
|---|---:|---|
| `--arki-bg` | `#080736` | Fondo principal de aplicación |
| `--arki-bg-deep` | `#050424` | Fondo de canvas y áreas profundas |
| `--arki-surface` | `#111044` | Paneles principales |
| `--arki-surface-2` | `#181752` | Paneles elevados y popovers |
| `--arki-border` | `#302D69` | Bordes sutiles |
| `--arki-text` | `#FFFFFF` | Texto principal |
| `--arki-text-muted` | `#A9A8C7` | Texto secundario |
| `--arki-yellow` | `#F4D35E` | Atención, selección y parámetros editables |
| `--arki-orange` | `#FF8A4C` | Acción primaria y elementos activos |
| `--arki-green` | `#5BE38C` | Éxito, validado y guardado |
| `--arki-cyan` | `#63D7E5` | Información, geometría y referencias |
| `--arki-red` | `#FF6B6B` | Error, bloqueo y clash crítico |
| `--arki-blue` | `#7EA7FF` | Navegación y enlaces internos |

El texto sobre `#080736` debe ser blanco o una variante con contraste equivalente. No usar gris oscuro sobre el fondo principal.

### 4.2 Uso semántico de colores

El color no debe ser decorativo sin significado:

- Amarillo: atención, parámetro editable, elemento seleccionado en revisión.
- Naranja: acción primaria, generación, herramienta activa.
- Verde: guardado, validación, estado aprobado o correcto.
- Rojo: error, bloqueo, clash crítico o pérdida de datos.
- Cian: geometría, referencia, información técnica.
- Azul: navegación, enlaces, elementos informativos.

No se debe comunicar un estado únicamente con color. Cada estado debe incluir texto, icono o patrón alternativo.

### 4.3 Tipografía

La tipografía debe ser técnica y altamente legible. Se recomienda una sans-serif limpia para interfaz y una variante monoespaciada para IDs, códigos, coordenadas, cantidades y diagnósticos.

Jerarquía mínima:

```text
Título de módulo
Título de panel
Etiqueta de campo
Valor principal
Texto secundario
Código / ID / unidad
```

No utilizar tipografías decorativas que reduzcan la lectura de planos, cantidades o propiedades.

### 4.4 Densidad

La interfaz debe ser compacta, pero no comprimida. Debe permitir trabajar con muchas propiedades sin convertirse en una tabla ilegible.

- Paneles plegables.
- Separadores claros.
- Espaciado consistente.
- Acciones frecuentes visibles.
- Acciones peligrosas separadas.
- Estados de hover y focus visibles.

## 5. Páginas y vistas funcionales

La aplicación mantendrá un shell único y tendrá las siguientes vistas principales.

### 5.1 Inicio

Debe mostrar el estado del workspace, proyectos recientes, versiones, warnings y accesos directos. Las tarjetas deben llevar a acciones reales.

### 5.2 Proyectos

Debe permitir crear, abrir, duplicar, archivar y buscar proyectos. En la primera fase, si la persistencia es local, debe indicarlo claramente.

### 5.3 Generador

Debe conservar y mejorar la funcionalidad actual de `Home.tsx`:

- Selección de familia.
- Selección de variante.
- Parámetros.
- Contexto.
- Generación.
- Vistas de planta, corte y 3D.
- Guardado de versión.
- Comparación.
- Exportación.

### 5.4 Modelo BIM

Debe mostrar el árbol semántico, elementos, relaciones, espacios, niveles y propiedades. La selección de un elemento debe actualizar el Info Box.

### 5.5 Planta y corte

Deben mostrar las vistas conceptuales existentes y dejar clara su naturaleza. No deben declararse planos técnicos emitibles hasta que exista edición 2D, cotas y escalas verificadas.

### 5.6 Visor 3D

Debe mostrar la masa o modelo disponible. Los botones de aislar, ocultar, mostrar todo y restablecer vista deben funcionar sobre el estado visual disponible.

### 5.7 Presupuesto

Debe mostrar metrados, partidas, APU, moneda, fuente y fecha. Si el precio es referencial, debe mostrarse como referencial.

### 5.8 4D y avance

Debe mostrar tareas, duración, predecesoras y estado. La simulación conceptual debe distinguirse del seguimiento real de obra.

### 5.9 Clashes

Debe mostrar conflictos, severidad, elementos relacionados, estado y responsable. Si el motor geométrico todavía no existe, la UI debe marcar el modo como conceptual o no disponible.

### 5.10 Expediente

Debe incluir memoria, especificaciones, metrados, presupuesto, encofrados, revisión normativa, anexos y estado documental. La edición local debe mostrar claramente cuándo un dato está derivado, editado o desactualizado.

### 5.11 Familias

Debe permitir consultar familias de edificio y familias paramétricas. La edición profunda de geometría solo se habilita cuando el motor la soporte.

### 5.12 Operación y mantenimiento

Debe ser una vista preparada para la fase posterior. No debe presentarse como implementada si todavía no existen `Asset` y `MaintenanceTask`.

## 6. Atajos de teclado

Los atajos deben funcionar cuando el usuario no está escribiendo en un campo de texto. En inputs, textareas y selects se debe respetar la escritura normal, salvo atajos explícitos con `Ctrl` o `Cmd`.

| Atajo | Acción |
|---|---|
| `Ctrl/Cmd + S` | Guardar borrador |
| `Ctrl/Cmd + Z` | Deshacer |
| `Ctrl/Cmd + Shift + Z` | Rehacer |
| `Ctrl/Cmd + K` | Abrir búsqueda de comandos |
| `Ctrl/Cmd + P` | Abrir selector de proyecto o vista |
| `Ctrl/Cmd + Enter` | Generar propuesta |
| `Ctrl/Cmd + E` | Abrir exportaciones |
| `Ctrl/Cmd + Shift + E` | Exportar vista o documento |
| `Ctrl/Cmd + F` | Buscar en el contexto actual |
| `Escape` | Cancelar selección o cerrar panel |
| `Delete` | Eliminar selección editable, con confirmación cuando corresponda |
| `1` | Abrir planta |
| `2` | Abrir corte |
| `3` | Abrir 3D |
| `4` | Abrir modelo BIM |
| `5` | Abrir presupuesto |
| `6` | Abrir 4D |
| `7` | Abrir clashes |
| `8` | Abrir expediente |
| `Space` | Alternar selección/mover cuando el contexto lo soporte |
| `M` | Activar medición cuando la vista lo soporte |
| `W` | Activar herramienta muro cuando esté disponible |
| `D` | Activar herramienta puerta cuando esté disponible |
| `V` | Activar herramienta ventana cuando esté disponible |
| `G` | Mostrar u ocultar rejilla |
| `H` | Mostrar u ocultar paneles auxiliares |
| `F` | Ajustar vista al contenido |

Cada atajo debe tener una prueba de interacción o una verificación manual documentada. No registrar atajos que no tengan acción implementada.

## 7. Comandos y búsqueda rápida

`Ctrl/Cmd + K` debe abrir una paleta de comandos con búsqueda. Debe incluir solo acciones disponibles en el contexto actual.

Cada comando debe indicar:

```text
Nombre
Descripción
Módulo
Atajo
Estado
```

Ejemplos:

```text
Generar propuesta
Guardar borrador
Abrir planta
Abrir modelo BIM
Mostrar todos los elementos
Exportar IFC
Descargar Markdown
Comparar versiones
Importar S10
```

Un comando no disponible debe aparecer deshabilitado con explicación, no ejecutar una acción ficticia.

## 8. Estados de interacción

Cada vista debe definir estados para:

```text
vacío
cargando
datos listos
selección activa
edición activa
guardando
guardado
advertencia
error recuperable
bloqueo
sin permisos
funcionalidad no disponible
```

### Estado vacío

Debe explicar qué hacer a continuación. Ejemplo:

```text
No hay propuesta activa.
Selecciona una familia y genera una propuesta para comenzar.
```

### Estado de guardado

Debe mostrar claramente:

```text
Sin cambios
Cambios pendientes
Guardando
Guardado local
Error al guardar
```

### Estado de error

Debe incluir:

- Qué falló.
- En qué elemento o módulo.
- Si se puede reintentar.
- Qué puede hacer el usuario.
- Código de diagnóstico cuando exista.

## 9. Accesibilidad y usabilidad

La UI debe cumplir como mínimo:

- Navegación por teclado en controles principales.
- Foco visible.
- Etiquetas asociadas a inputs.
- Botones con nombre accesible.
- Tooltips que no sean la única fuente de información.
- Contraste suficiente con el fondo oscuro.
- Indicadores de estado que no dependan solo del color.
- Respeto a `prefers-reduced-motion`.
- Confirmación para acciones destructivas.
- Mensajes de error legibles.
- Diseño usable en laptop y monitor grande.

La versión móvil puede ser una vista adaptada de consulta. El editor BIM completo debe priorizar escritorio.

## 10. Reglas de funcionalidad

### Botones

Un botón debe ejecutar una acción real. Si abre un panel, debe abrirlo. Si guarda, debe guardar. Si exporta, debe generar un archivo. Si no puede funcionar aún, debe estar deshabilitado y explicar el motivo.

### Formularios

Cada campo debe tener:

- Etiqueta.
- Unidad cuando corresponda.
- Valor inicial válido.
- Validación de rango.
- Mensaje de error.
- Estado de guardado.

### Selección

La selección debe ser consistente entre canvas, navigator e info box. Seleccionar un elemento en cualquiera de esos lugares debe sincronizar los otros dos.

### Edición

Toda edición debe indicar si modifica:

- El borrador local.
- El modelo derivado.
- El expediente.
- Una versión nueva.

No sobrescribir silenciosamente un resultado derivado.

### Exportaciones

La UI debe mostrar el formato, nombre de archivo, versión, fecha y estado de validación. No llamar “definitivo” a un exportador conceptual.

## 11. Integración con el dominio ARKI

La UI debe consumir los contratos existentes y futuros sin duplicarlos:

```text
DynamicBuildingFamily
GeneratedBuilding
ConstructionModel
Muro
StructuralElement
TechnicalDossier
FormworkRequirement
ArkiParametricFamily
FamilyInstance
ProjectSnapshot
```

La UI no debe crear una segunda versión de estas entidades. Los estados visuales deben derivarse del modelo o de un estado de presentación claramente separado.

La selección de elementos debe conservar:

```text
id
familia
tipo
nivel
disciplina
versión
origen
estado
```

## 12. Arquitectura de componentes recomendada

La implementación debe separar el shell de los módulos:

```text
client/src/
├── app/
│   ├── AppShell.tsx
│   ├── routes.tsx
│   └── keyboardShortcuts.ts
├── components/
│   ├── workspace/
│   │   ├── TopBar.tsx
│   │   ├── TabBar.tsx
│   │   ├── ContextToolbar.tsx
│   │   ├── NavigatorPanel.tsx
│   │   ├── ToolboxPanel.tsx
│   │   ├── InfoBox.tsx
│   │   ├── StatusBar.tsx
│   │   └── QuickOptionsBar.tsx
│   ├── canvas/
│   │   ├── PlanCanvas.tsx
│   │   ├── SectionCanvas.tsx
│   │   ├── ModelCanvas.tsx
│   │   └── EmptyCanvasState.tsx
│   ├── families/
│   ├── bim/
│   ├── budget/
│   ├── schedule/
│   ├── clashes/
│   └── dossier/
├── contexts/
│   ├── ProjectContext.tsx
│   ├── WorkspaceContext.tsx
│   └── SelectionContext.tsx
├── hooks/
│   ├── useKeyboardShortcuts.ts
│   ├── useProjectSnapshot.ts
│   └── useSelection.ts
├── pages/
└── styles/
```

La reorganización no debe hacerse toda de una vez. Primero debe crearse el shell funcional y luego migrar cada módulo con pruebas visuales y de interacción.

## 13. Plan de implementación por entregas

### Entrega UI-1 — Shell y navegación

Implementar:

- Fondo y tokens ARKI.
- App shell.
- Top bar.
- Tab bar.
- Navigator.
- Toolbox.
- Info Box.
- Status bar.
- Quick Options Bar.
- Navegación entre vistas.
- Atajos globales básicos.
- Estados vacío y cargando.

Criterio de cierre: el usuario puede abrir todas las vistas disponibles, cambiar pestañas, usar `Ctrl/Cmd + K`, guardar un borrador y regresar sin perder el contexto.

### Entrega UI-2 — Generador integrado

Migrar la funcionalidad de `Home.tsx` al shell sin romper:

- Generación.
- Guardado.
- Restauración.
- Comparación.
- Exportaciones.
- S10.
- Expediente local.

Criterio de cierre: todos los botones existentes continúan funcionando dentro del nuevo shell.

### Entrega UI-3 — Modelo BIM y selección

Implementar:

- Navigator semántico.
- Selección sincronizada.
- Info Box.
- Filtros por disciplina, nivel y fase.
- Aislar, ocultar y mostrar elementos.
- Propiedades y trazabilidad.

Criterio de cierre: seleccionar un elemento actualiza canvas, navigator e info box.

### Entrega UI-4 — Familia paramétrica

Implementar:

- Biblioteca.
- Editor de parámetros.
- Restricciones.
- Materiales.
- Tipos.
- Vista previa.
- Estado de validación.

Criterio de cierre: una familia de mampara o ventana puede editar sus parámetros permitidos y mostrar resultados derivados.

### Entrega UI-5 — Presupuesto y 4D

Implementar:

- Metrados.
- APU.
- PriceBook.
- Presupuesto.
- Actividades.
- Gantt conceptual.
- Avance.

Criterio de cierre: los valores visibles indican fuente, versión y moneda, y cambian al recalcular.

### Entrega UI-6 — Expediente, coordinación y emisión

Implementar:

- Expediente completo.
- Clashes.
- Aprobaciones.
- Control documental.
- Exportaciones.
- Historial.

Criterio de cierre: cada documento tiene estado, versión, origen y acción disponible.

### Entrega UI-7 — Operación y mantenimiento

Implementar cuando existan contratos de activos:

- Activos.
- Garantías.
- Mantenimiento.
- Órdenes de trabajo.
- Historial.

No presentar esta entrega como implementada antes de contar con el dominio correspondiente.

## 14. Criterios de aceptación funcional

La UI no se acepta por una captura bonita. Se acepta mediante interacción verificable.

### Navegación

- Todas las pestañas disponibles abren una vista real.
- El navegador lleva a la vista correcta.
- El botón de volver no pierde el proyecto.
- Las vistas conservan filtros y selección cuando corresponde.

### Generación

- Se puede seleccionar una familia.
- Se puede seleccionar una variante.
- Se pueden cambiar parámetros.
- El botón Generar produce una propuesta.
- Se muestran planta, corte y 3D.
- Guardar crea una versión.
- Comparar exige dos versiones.
- Exportar genera el formato correspondiente.

### Selección

- El canvas puede mostrar selección.
- El Navigator refleja la selección.
- El Info Box muestra propiedades reales.
- Escape cancela la selección.
- Ocultar, aislar y mostrar todo cambian la vista.

### Atajos

- `Ctrl/Cmd + S` guarda o informa correctamente.
- `Ctrl/Cmd + K` abre la paleta de comandos.
- `1`, `2`, `3` cambian a planta, corte y 3D cuando el foco no está en un input.
- `Escape` cierra paneles o cancela la selección.
- Ningún atajo interfiere con la escritura normal.

### Estados

- La UI tiene estado vacío.
- La UI tiene estado de carga.
- La UI tiene estado de error.
- La UI distingue guardado local de guardado persistente.
- La UI distingue conceptual, derivado, validado y aprobado.

### Calidad visual

- El fondo principal es `#080736`.
- El texto principal es blanco.
- Amarillo, naranja y verde tienen significado consistente.
- No existen textos ilegibles.
- No existen paneles sin contraste.
- Los focus rings son visibles.
- La interfaz es usable en una pantalla de laptop y en una pantalla grande.

## 15. Tests obligatorios de UI

DeepSeek debe proponer o implementar pruebas verificables para:

```text
render del AppShell
navegación de pestañas
apertura y cierre del navigator
selección sincronizada
Ctrl/Cmd + S
Ctrl/Cmd + K
Escape
generación de propuesta
guardado de versión
comparación con menos de dos versiones
exportación JSON o IFC
estado de error
estado vacío
```

Si el proyecto no tiene todavía infraestructura de pruebas de navegador, debe documentarlo y entregar una matriz de verificación manual reproducible con pasos exactos y resultado esperado. No debe afirmar E2E VERIFIED sin evidencia.

## 16. Prohibiciones

No copiar literalmente la interfaz de Archicad.

No usar botones decorativos.

No añadir módulos ficticios como si fueran funcionales.

No romper la UI actual mientras se migra al shell.

No modificar el dominio BIM sin ADR cuando el cambio altere contratos.

No duplicar entidades del dominio en la UI.

No guardar estados críticos solamente en componentes aislados si deben sobrevivir al cambio de vista.

No usar colores semánticos de forma inconsistente.

No llamar “modelo BIM definitivo”, “expediente definitivo” o “aprobado” a resultados conceptuales.

## 17. Entrega obligatoria de DeepSeek

Cada entrega debe incluir:

1. Mapa de pantallas y flujos.
2. Inventario de componentes.
3. Tokens visuales.
4. Estados de cada componente.
5. Tabla de atajos.
6. Matriz de botones y acciones.
7. Archivos creados y modificados.
8. Contratos del dominio consumidos.
9. Tests o matriz manual.
10. Limitaciones.
11. Riesgos.
12. Decisiones pendientes.
13. Evidencia de compilación cuando Manus integre el código.

DeepSeek no debe declarar que la UI está terminada únicamente porque entregó JSX o CSS. La definición de terminada exige que los flujos críticos funcionen y que los comandos de verificación pasen.

## 18. Roles operativos

DeepSeek diseñará la arquitectura de experiencia, especificará componentes, producirá el código propuesto y documentará decisiones. Manus escribirá los archivos en el repositorio, integrará la UI, ejecutará compilación, pruebas y preview, y reportará regresiones. El Product Owner decidirá cambios que afecten alcance, navegación, contratos, estados del producto o prioridades.

## 19. Criterio de aceptación global

La UI BIM de ARKI se considerará aceptada únicamente cuando:

- El shell sea navegable.
- Las pestañas funcionen.
- Los botones críticos tengan comportamiento real.
- Los atajos principales funcionen.
- El generador actual siga operativo.
- El estado de selección sea coherente.
- El Info Box muestre datos reales.
- La UI distinga capacidades implementadas de futuras.
- El fondo sea `#080736` con contraste correcto.
- El sistema de colores sea consistente.
- Los errores y estados vacíos sean utilizables.
- `pnpm check` pase.
- `pnpm build` pase.
- Las pruebas de dominio existentes sigan pasando.
- La matriz de interacción no tenga botones sin acción.
- Las limitaciones estén documentadas.

La aceptación se hará por entregas UI-1 a UI-7. No se debe declarar terminada toda la plataforma mientras existan módulos marcados como futuros.

## 20. Mensaje corto para enviar a DeepSeek

> DeepSeek, queda aprobado el contrato de UI BIM de ARKI. Diseña y especifica una interfaz completa, minimalista y profesional, inspirada en la lógica espacial de Archicad pero con identidad propia. Usa `#080736` como fondo principal, texto blanco y amarillo, naranja y verde como colores semánticos de atención, acción y éxito. La interfaz debe ser un BIM Workspace Shell con barra superior, tab bar, toolbar contextual, Navigator, Toolbox, canvas central, Info Box, Status Bar y Quick Options Bar.
>
> Todos los botones deben tener comportamiento real. Todos los atajos deben funcionar. No aceptamos botones decorativos, rutas vacías ni estados ficticios. Define y entrega los módulos de Inicio, Proyectos, Familias, Generador, Modelo BIM, Planta, Corte, 3D, Presupuesto, 4D, Clashes, Expediente y Operación. Si un módulo todavía no existe en el dominio, la UI debe marcarlo como no disponible y no fingir que está implementado.
>
> Usa las entidades reales de ARKI sin duplicarlas. Mantén funcionando el generador, guardado, comparación, exportaciones, S10 y expediente local. Implementa por entregas: UI-1 shell y navegación; UI-2 migración del generador; UI-3 modelo BIM y selección; UI-4 familias paramétricas; UI-5 presupuesto y 4D; UI-6 expediente, coordinación y emisión; UI-7 operación y mantenimiento.
>
> Incluye mapa de pantallas, componentes, tokens visuales, estados, atajos, matriz de botones, pruebas y limitaciones. No afirmes que algo está terminado sin código, integración y evidencia. No copies literalmente Archicad. No avances sobre contratos BIM sin ADR. La aceptación exige navegación real, botones funcionales, atajos, selección sincronizada, estados de error y vacío, compilación y ausencia de regresiones.

## Referencias

[1]: https://graphisoft.com/solutions/archicad "Graphisoft Archicad — referencia de software BIM"
