# ARKI — Contrato corporativo de interfaz BIM

**Versión:** 2.0  
**Fecha:** 22 de septiembre de 2026  
**Producto:** ARKI / Generador de Familias  
**Propietario del producto:** Product Owner de ARKI  
**Diseño funcional y especificación:** DeepSeek  
**Implementación, integración, compilación y verificación:** Manus  
**Estado:** Contrato maestro de UI aprobado para diseño por bloques

## 1. Objeto del contrato

Este contrato define la interfaz corporativa de ARKI, una plataforma BIM propia para concebir, generar, coordinar, documentar, construir, entregar y mantener activos.

La interfaz debe ser **minimalista, técnica, rápida, profesional y orientada a decisiones de proyecto**. No debe parecer una landing page ni un dashboard genérico. Debe funcionar como una estación de trabajo BIM con identidad propia.

Archicad y Revit son referencias de organización e interoperabilidad, no patrones de copia visual ni límites de capacidad. ARKI puede contener más información que una exportación concreta hacia Revit.

Este contrato de UI consume las entidades reales que ya existen en ARKI, incluyendo:

```text
DynamicBuildingFamily
GeneratedBuilding
ConstructionModel
Muro
StructuralElement
ArkiParametricFamily
FamilyInstance
ProjectSnapshot
PriceBook
TechnicalDossier
FormworkRequirement
```

No se deben duplicar estas entidades dentro de la interfaz.

## 2. Responsabilidades de trabajo

El Product Owner define la visión, prioridades, decisiones de producto y criterio profesional de ARKI.

DeepSeek diseña la arquitectura de información, contratos de interacción, wireflows, estados, atajos, matriz de módulos, criterios de aceptación y especificaciones de UI.

Manus integra el código en el proyecto, conserva los contratos del dominio, compila, ejecuta pruebas, verifica regresiones y documenta el estado real.

Ningún participante puede declarar una capacidad como implementada sin código integrado, comportamiento verificable y evidencia de prueba.

## 3. Acceso corporativo de ARKI

ARKI tendrá un gateway común con **cuatro entradas de acceso**. No serán cuatro aplicaciones independientes.

```text
ARKI Gateway
├── Visitante
├── Usuario / Proyecto
├── Especialista / Coordinación
└── Corporativo / Costos / Interferencias
```

### 3.1 Visitante

El visitante puede consultar información pública, demostraciones, tipologías, familias, capacidades, documentación y solicitudes de acceso.

No puede consultar proyectos privados, modelos de clientes, precios contractuales, documentos internos ni información de especialistas.

Estados permitidos:

```text
público
informativo
demostración
solicitud de acceso
```

### 3.2 Usuario / Proyecto

El usuario puede crear y gestionar proyectos, definir programa y contexto, generar propuestas, guardar versiones, comparar alternativas, consultar el modelo, revisar presupuesto referencial y abrir el expediente local.

El usuario no puede modificar silenciosamente un elemento aprobado por un especialista. Toda modificación debe crear una versión, invalidación u observación según el estado del proyecto.

### 3.3 Especialista / Coordinación

El especialista trabaja sobre proyectos y disciplinas autorizadas. Puede revisar, observar, corregir y aprobar técnicamente según su rol.

La entrada debe permitir seleccionar especialidad:

```text
Arquitectura
Estructuras y cálculo estructural
Geotecnia y cimentaciones
Materiales y acabados
Costos, metrados y APU
Programación y avance
Coordinación BIM
Instalaciones sanitarias
Instalaciones eléctricas
HVAC y climatización
Gases medicinales
Telecomunicaciones y datos
CCTV y seguridad electrónica
Contra incendio
Transporte vertical
Seguridad, evacuación y accesibilidad
Construcción
Operación y mantenimiento
```

### 3.4 Corporativo / Costos / Interferencias

Esta entrada contiene módulos de sensibilidad económica, coordinación y gobierno corporativo:

```text
PriceBook y APU
S10 y CAPECO
Presupuesto contractual
Metrados
Cambios y adicionales
Clashes e incidencias
BCF
CDE
Biblioteca corporativa
Estándares
Auditoría
Permisos
Integraciones
```

El acceso a costos e interferencias debe estar protegido por perfil y quedar registrado. No será un botón escondido dentro del perfil general.

### 3.5 Estado de autenticación en la primera fase

La primera fase utilizará perfiles locales de prototipo para verificar navegación y visibilidad de módulos.

La interfaz debe mostrar siempre:

```text
PROTOTIPO LOCAL — NO ES AUTENTICACIÓN DE PRODUCCIÓN
```

Autenticación real, organizaciones, sesiones, permisos persistentes, auditoría y almacenamiento corporativo quedan para una fase posterior.

## 4. Perfiles iniciales

| Perfil | Función principal |
|---|---|
| Visitante | Consulta pública y demostraciones |
| Usuario / Propietario | Proyecto, programa, variantes y revisión general |
| Arquitectura | Espacios, familias, acabados, accesibilidad y expediente arquitectónico |
| Estructuras | Elementos estructurales, predimensionamiento y revisión de cálculo |
| Instalaciones / MEP | Sanitarias, eléctricas, HVAC, gases, telecomunicaciones y seguridad |
| Costos y Presupuesto | Metrados, APU, PriceBook, S10 y CAPECO |
| Coordinación BIM | Relaciones, federación, propiedades, interferencias y BCF |
| Construcción | 4D, avance, encofrados, calidad, seguridad y cambios |
| Operación y Mantenimiento | Activos, garantías, mantenimiento y desempeño |
| Administrador Corporativo | Bibliotecas, estándares, permisos, auditoría e integraciones |

Cada perfil debe tener estados visibles de permiso:

```text
permitido
solo lectura
requiere revisión
no disponible
no autorizado
```

## 5. Shell BIM persistente

Después de abrir un proyecto, toda la aplicación utilizará un shell único.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ARKI · proyecto · pestañas · versión · guardado · perfil             │
├──────────────────────────────────────────────────────────────────────┤
│ Toolbar contextual: seleccionar · crear · editar · medir · exportar  │
├──────────────┬───────────────────────────────────────────┬───────────┤
│ Navigator /  │                                           │ Info Box  │
│ Toolbox      │                 Canvas                    │ Propiedad │
│              │       2D · 3D · datos · documentos        │ y estado  │
├──────────────┴───────────────────────────────────────────┴───────────┤
│ Quick Options · unidades · nivel · disciplina · fase · filtros       │
├──────────────────────────────────────────────────────────────────────┤
│ Status bar · motor · versión · elementos visibles · warnings         │
└──────────────────────────────────────────────────────────────────────┘
```

El nombre del proyecto y la versión deben permanecer visibles mientras el usuario trabaja.

## 6. Sistema visual

### 6.1 Paleta principal

| Token | Valor | Uso |
|---|---|---|
| `--arki-bg` | `#080736` | Fondo principal |
| `--arki-bg-deep` | `#050424` | Áreas profundas y canvas |
| `--arki-surface` | `#111044` | Paneles |
| `--arki-surface-2` | `#181752` | Paneles elevados |
| `--arki-border` | `#302D69` | Bordes |
| `--arki-text` | `#FFFFFF` | Texto principal |
| `--arki-text-muted` | `#A9A8C7` | Texto secundario |
| `--arki-yellow` | `#F4D35E` | Atención y edición |
| `--arki-orange` | `#FF8A4C` | Acción primaria |
| `--arki-green` | `#5BE38C` | Éxito y validación |
| `--arki-cyan` | `#63D7E5` | Geometría e información técnica |
| `--arki-red` | `#FF6B6B` | Error, bloqueo y clash crítico |
| `--arki-blue` | `#7EA7FF` | Navegación y enlaces |

El texto sobre el fondo principal debe ser blanco o tener contraste equivalente. Cada estado debe comunicarse mediante color y texto, icono o patrón.

### 6.2 Identidad

ARKI no copiará iconos, textos, logotipos ni composición visual propietaria de Archicad o Revit. Solo utilizará la idea general de estación de trabajo BIM: navegación persistente, vistas, herramientas contextuales, propiedades y estado.

## 7. Áreas del shell

### 7.1 Barra superior

Debe mostrar marca, proyecto, estado, versión, guardado, perfil, ayuda, historial y acciones globales.

### 7.2 Tab bar

Las vistas mínimas son:

```text
Inicio
Generador
Planta
Corte
3D
BIM
Metrados
Presupuesto
4D
Clashes
Expediente
O&M
```

Cada pestaña puede abrirse, activarse, cerrarse cuando corresponda y conservar selección, filtros y estado modificado.

### 7.3 Toolbar contextual

La toolbar debe mostrar solo acciones válidas para la vista activa.

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

Acciones BIM:

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
Ver costos
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

Cada acción debe tener tooltip o texto, estado habilitado, motivo de deshabilitación y atajo cuando exista.

### 7.4 Navigator

El Navigator debe mostrar un árbol de proyecto con:

```text
Proyecto
├── Vistas
├── Niveles
├── Espacios
├── Elementos constructivos
├── Familias paramétricas
├── Disciplinas
├── Costos
├── Cronograma
├── Clashes
├── Expediente
├── Documentos
├── Activos
└── Historial
```

Debe permitir búsqueda, expansión, selección y navegación hacia el canvas.

### 7.5 Toolbox

El Toolbox contiene herramientas de creación, selección y consulta. Sus estados son:

```text
disponible
seleccionada
no disponible
no autorizada
```

Una herramienta no disponible debe explicar el requisito faltante.

### 7.6 Canvas

El canvas puede mostrar vista 2D conceptual, vista 3D conceptual, tabla BIM, propiedades, metrados, costos, cronograma, expediente y comparaciones.

Si no existe una propuesta, debe mostrar un estado vacío útil con una acción real para comenzar.

### 7.7 Info Box

Debe mostrar para el elemento seleccionado:

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
Geometría
Materiales
Metrado
Costo
Duración
Relaciones
Origen
Última modificación
Advertencias
Responsable
Aprobación
```

### 7.8 Quick Options y Status bar

La barra contextual debe permitir cambiar nivel, disciplina, fase, escala, unidades, filtros, modo de selección y calidad visual.

La barra de estado debe mostrar guardado, versión, unidad, nivel, disciplina, fase, escala, elementos visibles, warnings y estado del motor.

## 8. Módulos y páginas funcionales

El shell tendrá las siguientes áreas. Una página solo se considera funcional si ejecuta una acción real o identifica de forma clara su estado.

### 8.1 Inicio

Estado del workspace, proyectos recientes, versiones, warnings, tareas pendientes y accesos directos.

### 8.2 Proyectos

Crear, abrir, duplicar, archivar, buscar y recuperar proyectos. La primera versión local debe indicar que la persistencia es local.

### 8.3 Generador

Debe conservar el flujo actual de selección de familia, variante, contexto, parámetros, generación, planta, corte, 3D, guardado, comparación y exportación.

### 8.4 Biblioteca de familias

Consulta de familias de sistema, cargables, in situ y anidadas. La edición geométrica profunda solo se habilita cuando el motor la soporte.

### 8.5 Editor de familias

Debe mostrar parámetros, restricciones, planos de referencia, materiales, tipos, reglas de cantidades, costo, duración, mantenimiento y clasificación IFC/Revit.

### 8.6 Modelo BIM

Árbol semántico, espacios, niveles, elementos, relaciones, propiedades, selección, filtros y trazabilidad.

### 8.7 Planta, corte y 3D

Las vistas actuales son conceptuales. La UI debe declararlo hasta contar con cotas, escalas, ejes, niveles, simbología y validación profesional.

### 8.8 Metrados y presupuesto

Metrados, partidas, APU, PriceBook, moneda, fuente, fecha, versión, desperdicios, mano de obra, equipos, gastos generales, utilidad e impuestos cuando estén disponibles.

### 8.9 4D y avance

Tareas, duración, predecesoras, fases, línea base, avance y diferencia entre simulación conceptual y seguimiento real.

### 8.10 Clashes e interferencias

Conflictos duros, blandos, espaciales, de mantenimiento, normativos, de secuencia e información. Cada incidencia debe mostrar elementos, disciplinas, severidad, responsable, estado, fecha, comentarios y evidencia.

### 8.11 Expediente técnico

Memoria, especificaciones, metrados, presupuesto, encofrados, revisión normativa, planos, anexos, emisión y estado documental.

### 8.12 Especialidades

Espacio de trabajo con vistas filtradas por arquitectura, estructuras, MEP, costos, coordinación, construcción y operación.

### 8.13 CDE y aprobaciones

En la fase local mostrará estados de documentos y flujo simulado claramente marcado. El CDE productivo requiere backend y permisos persistentes.

### 8.14 Activos y mantenimiento

La vista debe prepararse para activos, garantías, mantenimiento, órdenes de trabajo e inspecciones. No debe aparecer como implementada mientras el dominio no tenga esas entidades.

## 9. Alcance técnico visible en la interfaz

### 9.1 Muros y acabados

La interfaz debe poder mostrar un muro por capas con soporte, ladrillo o bloque, mortero, tarrajeo en ambas caras, imprimante, primera mano de pintura, segunda mano, acabado, juntas y remates.

Cada capa puede mostrar material, función, espesor, rendimiento, desperdicio, APU, costo, peso, inspección, color y acabado.

La pintura debe distinguir tipo y acabado, incluyendo látex, acrílica, esmalte, epóxica, poliuretano, anticorrosiva, mate, satinado, semibrillante, brillante, texturada y sanitaria cuando exista en el catálogo.

### 9.2 Estructuras

La UI debe separar arquitectura de estructuras y mostrar ejes, niveles, columnas, vigas, losas, placas, cimentaciones, acero, cargas, combinaciones, resultados, cuantías y advertencias.

Debe diferenciar predimensionamiento conceptual de cálculo estructural revisado y aprobado.

### 9.3 Escaleras y ascensores

Debe permitir filtrar escaleras rectas, en L, en U, helicoidales, de caracol, metálicas, de concreto, prefabricadas, de emergencia, marinas y de mantenimiento.

Los ascensores deben mostrar tipo, capacidad, carga, velocidad, niveles atendidos, puertas, foso, sobre recorrido, equipo, energía, mantenimiento y relaciones con arquitectura, estructura, electricidad y seguridad.

### 9.4 MEP y sistemas especiales

La interfaz debe contemplar, según el estado del motor:

```text
agua fría y caliente
retorno de agua caliente
desagüe y ventilación
eléctrica y respaldo
HVAC y climatización
gases medicinales
contra incendio
telecomunicaciones
Wi-Fi
racks, patch panels, switches y routers
CCTV
control de acceso
sensores y alarmas
```

### 9.5 Mobiliario y equipamiento

Debe contemplar mobiliario de oficinas, educación, comercio, salud, industria y vivienda, además de computadoras, monitores, televisores, servidores, equipos médicos, laboratorio, cocina, seguridad y mantenimiento.

Cada activo debe poder mostrar ubicación, dimensiones, conexiones, consumo, costo, fabricante, modelo, serie, garantía y mantenimiento cuando el dominio lo soporte.

## 10. Biblioteca, tipologías y prioridades

La biblioteca inicial priorizará:

1. Salud.
2. Educación.
3. Comercio y oficinas.
4. Vivienda.

La lista corporativa completa se considera inventario de referencia futura. Una familia solo se marca como `IMPLEMENTED` si tiene contrato, integración y prueba.

Las familias pueden ser más numerosas que las categorías disponibles en Revit. La UI debe mostrar el origen, disciplina, tipología, estado, nivel geométrico, nivel de información y exportabilidad.

## 11. Estados de capacidad

Toda función, familia, disciplina y exportación debe utilizar uno de estos estados:

```text
IMPLEMENTED
VERIFIED
E2E VERIFIED
CONCEPTUAL
PARTIAL
NOT AVAILABLE
PRODUCT DECISION REQUIRED
FUTURE REFERENCE
```

`E2E VERIFIED` solo se permite cuando la acción se prueba desde la interfaz hasta el dominio, la persistencia o la exportación correspondiente.

No se debe presentar una heurística como cálculo profesional, un precio referencial como contractual, una vista conceptual como plano emitible ni un perfil local como autenticación de producción.

## 12. Atajos de teclado

Los atajos deben respetar la escritura en campos de texto.

| Atajo | Acción |
|---|---|
| `Ctrl/Cmd + S` | Guardar borrador |
| `Ctrl/Cmd + Z` | Deshacer |
| `Ctrl/Cmd + Shift + Z` | Rehacer |
| `Ctrl/Cmd + K` | Búsqueda de comandos |
| `Ctrl/Cmd + P` | Selector de proyecto o vista |
| `Ctrl/Cmd + Enter` | Generar propuesta |
| `Ctrl/Cmd + E` | Abrir exportaciones |
| `Ctrl/Cmd + Shift + E` | Exportar vista o documento |
| `Ctrl/Cmd + F` | Buscar en contexto |
| `Escape` | Cancelar o cerrar panel |
| `1` | Planta |
| `2` | Corte |
| `3` | 3D |
| `4` | Modelo BIM |
| `5` | Presupuesto |
| `6` | 4D |
| `7` | Clashes |
| `8` | Expediente |

Cada atajo debe probarse y documentarse.

## 13. Interoperabilidad ARKI → IFC/Revit

Revit es un destino de interoperabilidad, no el patrón de completitud de ARKI.

Toda exportación debe utilizar este mapa:

```text
Entidad ARKI
→ destino
→ categoría o familia
→ parámetros compartidos
→ material
→ clasificación IFC
→ reglas de pérdida
→ advertencias
→ prueba de exportación
```

Si ARKI tiene treinta características y el destino soporta veinte:

1. Las treinta permanecen en ARKI.
2. Las veinte compatibles se exportan directamente.
3. Las diez restantes se guardan en parámetros, propiedades IFC, JSON, CSV o anexos.
4. Se produce un reporte de cobertura.
5. No se elimina información silenciosamente.

No se debe declarar compatibilidad con Revit sin archivo, conector o prueba reproducible. IFC conceptual, RVT/RFA, BCF, PDF, CSV y JSON deben indicar su estado individual.

## 14. Fases de implementación

### Bloque A — Gobernanza antes de código

Entregables obligatorios:

1. ADR de transición de `Home.tsx` al shell.
2. Mapa de cuatro accesos.
3. Matriz de módulos por rol y estado.

No se escribe código de la nueva UI antes de aprobar este bloque.

### Bloque B — Inventario técnico

Entregables obligatorios:

1. Inventario de disciplinas y familias.
2. Contrato ARKI → IFC/Revit.

No se implementan nuevas disciplinas antes de aprobar este bloque.

### Bloque C — Flujos y pruebas

Entregables obligatorios:

1. Wireflows de especialistas, costos, interferencias y revisión.
2. Plan de pruebas y aceptación.

### UI-1 — Shell y navegación

Gateway, perfiles locales, shell, Navigator, Toolbox, Tab bar, Toolbar, Canvas, Info Box, Status bar, atajos y estados.

### UI-2 — Generador integrado

Migración gradual de `Home.tsx` sin romper generación, guardado, comparación, S10, expediente ni exportaciones.

### UI-3 — Modelo BIM y selección

Árbol semántico, selección, propiedades, relaciones, espacios, niveles y geometría disponible.

### UI-4 — Familias paramétricas

Biblioteca, editor, mampara, parámetros, constraints, materiales y vistas.

### UI-5 — Metrados, costos y 4D

PriceBook, APU, presupuesto, metrados, cronograma, avance conceptual y advertencias.

### UI-6 — Expediente y coordinación

Especificaciones, encofrados, revisión normativa, clashes, incidencias, CDE local, exportaciones y emisión según disponibilidad.

### UI-7 — Operación y mantenimiento

Activos, garantías, fichas, mantenimiento e indicadores cuando el dominio correspondiente exista.

## 15. Backend y seguridad

La Fase A no incluye backend corporativo. El backend posterior deberá cubrir:

- Organizaciones.
- Usuarios.
- Roles.
- Permisos por proyecto, disciplina, documento y módulo.
- Autenticación.
- Recuperación de cuenta.
- Auditoría.
- Almacenamiento persistente.
- Versiones.
- Copias de seguridad.
- Control documental.
- Registro de exportaciones.
- Validación de archivos.
- Separación de información técnica y comercial.

La UI debe estar preparada para sustituir perfiles locales por autorización real sin rehacer la navegación.

## 16. Regla de no duplicación

Antes de crear un módulo, tipo o adaptador se debe buscar primero en:

```text
shared/arkiDynamicFamilies.ts
shared/arkiConstructionOntology.ts
shared/arkiConstructionElements.ts
shared/arkiParametricFamilies.ts
shared/arkiMamparaFamily.ts
shared/arkiPriceBook.ts
shared/arkiRecalculation.ts
shared/arkiTechnicalDossier.ts
```

No se deben crear dos representaciones de un muro, presupuesto, familia, snapshot, PriceBook o elemento constructivo que representen la misma realidad.

## 17. Criterios de aceptación

La UI se acepta por bloque cuando:

1. Compila sin errores TypeScript.
2. Mantiene las pruebas del núcleo 1A–1C.
3. La navegación no contiene rutas vacías.
4. Cada botón tiene comportamiento real o estado explícito.
5. Los atajos funcionan fuera de campos de texto.
6. Los estados vacío, error, cargando, parcial y no disponible son visibles.
7. La selección actualiza el Info Box.
8. Los filtros se reflejan en el canvas.
9. Los módulos consumen entidades reales del dominio.
10. Las exportaciones cambian cuando cambia el modelo.
11. No se declara E2E sin evidencia desde UI hasta salida.
12. No se modifican contratos de backend o dominio sin ADR.

Para la exportación se requiere además:

```text
archivo generado
metadatos
reporte de cobertura
reporte de pérdida o aproximación
prueba de apertura o validación disponible
```

## 18. Restricciones de alcance

No se debe hacer durante UI-1:

- Reescritura completa de `Home.tsx`.
- Backend corporativo.
- Cálculo estructural profesional.
- Conector RVT/RFA.
- Redes MEP completas.
- CDE productivo.
- Seguimiento real de obra.
- Mantenimiento operativo completo.

Estas capacidades pueden aparecer como módulos con estado `NOT AVAILABLE`, `PARTIAL`, `CONCEPTUAL` o `PRODUCT DECISION REQUIRED`.

## 19. Entrega obligatoria de DeepSeek

Antes de escribir código, DeepSeek debe entregar el Bloque A:

```text
ADR de transición Home.tsx → BIM Workspace Shell
Mapa de cuatro accesos y perfiles
Matriz de módulos por rol y estado
```

Después de la aprobación del Bloque A podrá preparar el Bloque B. Después de la aprobación del Bloque B podrá preparar el Bloque C.

Cada entrega debe incluir decisiones, contratos, limitaciones y criterios verificables. No debe incluir código no solicitado ni declarar capacidades futuras como implementadas.

## 20. Estado actual conocido

El núcleo paramétrico 1A–1C está verificado con correcciones no bloqueantes. Actualmente existen familias declarativas, DTO, PriceBook, trazabilidad de encofrados, recálculo, mampara paramétrica, snapshots, presupuesto base más mamparas, 4D, IFC extendido y Markdown.

El proyecto actual sigue siendo principalmente un frontend con motor local. Todavía no tiene autenticación corporativa, organizaciones persistentes, cálculo estructural profesional, redes MEP completas, RVT/RFA validado, PDF emitible, seguimiento real de obra ni mantenimiento operativo integral.

Este contrato define el objetivo y el orden de construcción; no convierte automáticamente esos objetivos en funcionalidades implementadas.

## 21. Veredicto de estado

```text
Contrato UI anterior: sustituido por este contrato V2
Núcleo 1A: APPROVE WITH FIXES
Núcleo 1B: APPROVE WITH FIXES
Núcleo 1C: APPROVE WITH FIXES
Bloque A de UI: PENDIENTE DE ENTREGA
Bloque B de UI: BLOQUEADO HASTA APROBAR A
Bloque C de UI: BLOQUEADO HASTA APROBAR B
Código nuevo de UI: BLOQUEADO HASTA APROBAR A
```

## Referencias

[1]: file:///home/ubuntu/generador-familias/ARKI_ADENDA_CONTRATO_CORPORATIVO_BIM.md "Adenda al contrato corporativo BIM de ARKI"

[2]: file:///home/ubuntu/generador-familias/ARKI_DECISION_BLOQUE_A_DEEPSEEK.md "Decisión formal para el Bloque A"

[3]: file:///home/ubuntu/generador-familias/ARKI_ESTADO_COMPLETO_Y_PENDIENTES.md "Estado completo y pendientes de ARKI"

[4]: file:///home/ubuntu/generador-familias/ARKI_VEREDICTO_ENTREGA_1C.md "Acta de verificación de la Entrega 1C"


## Addendum — Internacionalización obligatoria del workspace

El shell BIM debe incluir un **botón de cambio de idioma** visible en la barra superior. El catálogo inicial obligatorio contiene exactamente estos ocho idiomas:

1. Español (`es`)
2. English (`en`)
3. Português (`pt`)
4. Français (`fr`)
5. Deutsch (`de`)
6. Italiano (`it`)
7. 中文 (`zh`)
8. 日本語 (`ja`)

DeepSeek debe diseñar el contrato de interacción, estados, etiquetas y criterios de aceptación. Manus debe integrar el código, compilar y ejecutar una prueba que verifique los ocho códigos, nombres y orden del catálogo. El botón puede cambiar temporalmente el idioma seleccionado y mostrar el estado local mientras no exista el sistema i18n completo, pero no debe presentarse como traducción completa si las cadenas no están traducidas.

La implementación futura debe separar catálogo, persistencia de preferencia, traducciones, fallback, formato numérico, fechas, unidades BIM, pluralización y pruebas por idioma. Ningún idioma puede declararse soportado sin cobertura verificable de sus cadenas de interfaz.
