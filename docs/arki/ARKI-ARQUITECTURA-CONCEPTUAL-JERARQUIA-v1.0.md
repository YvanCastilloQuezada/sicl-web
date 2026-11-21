# ARKI --- Arquitectura conceptual de la jerarquía geométrica y de diseño

**Documento:** ARKI-ARCH-CONCEPTUAL-HIERARCHY\
**Estado:** Propuesta normativa para revisión y adopción\
**Versión:** 1.0\
**Fecha:** 17 de noviembre de 2026\
**Ámbito:** Arquitectura conceptual, generación geométrica, conocimiento
tipológico y diseño de equipamientos

------------------------------------------------------------------------

## 1. Propósito

Este documento establece la jerarquía conceptual que organiza el
conocimiento geométrico y arquitectónico de ARKI:

**Primitivas → Shapes → Familias → Equipamiento arquitectónico**

La jerarquía define qué representa cada nivel, cuál es su
responsabilidad, cómo se relaciona con los demás y qué límites debe
respetar su implementación.

Su finalidad es evitar que elementos geométricos, configuraciones
volumétricas, tipologías arquitectónicas y operaciones de modelado se
mezclen bajo una misma clasificación. También establece una base común
para la generación de alternativas, su evaluación y su selección
mediante el funnel de diseño.

Esta jerarquía es conceptual y semántica. No sustituye la arquitectura
de software, los contratos técnicos ni las validaciones geométricas
existentes. Su adopción en código requiere una auditoría y una migración
controlada.

## 2. Principio rector

ARKI debe construir propuestas arquitectónicas desde elementos
geométricos fundamentales hasta equipamientos completos, sin limitar la
generación a un catálogo cerrado de soluciones predefinidas.

Cada nivel debe aportar conocimiento y capacidades al nivel superior:

1.  Las **primitivas** aportan elementos geométricos básicos.
2.  Los **shapes** combinan primitivas y operaciones para producir
    formas y configuraciones geométricas.
3.  Las **familias** organizan shapes en patrones o configuraciones
    arquitectónicas reutilizables.
4.  El **equipamiento arquitectónico** integra familias y otros sistemas
    para resolver un programa, un contexto y unos objetivos de diseño.

La jerarquía no implica que todo equipamiento deba construirse con una
única familia ni que toda familia deba utilizar un conjunto fijo de
shapes. Las relaciones deben admitir composición, variación,
reutilización y generación de nuevas soluciones.

## 3. Jerarquía conceptual

### 3.1. Nivel 1 --- Primitivas geométricas

**Definición**

Las primitivas son los elementos geométricos fundamentales utilizados
para construir shapes. Representan entidades básicas del dominio
geométrico y deben tener una definición matemática y computacional
precisa.

**Ejemplos iniciales**

-   Caja o paralelepípedo.
-   Esfera.
-   Cilindro.
-   Cono.
-   Pirámide.
-   Cuña.
-   Toroide.

Esta lista es ilustrativa y no constituye un inventario definitivo ni
limita la incorporación de otras primitivas.

**Responsabilidades**

-   Definir geometrías básicas mediante parámetros explícitos.
-   Exponer dimensiones, posición, orientación y sistema de coordenadas.
-   Permitir transformaciones geométricas controladas.
-   Proporcionar entradas consistentes para operaciones y composiciones.
-   Permitir validaciones de integridad, tolerancia y dimensionalidad.

**No son**

-   Tipologías arquitectónicas.
-   Familias de diseño.
-   Equipamientos.
-   Operaciones como extruir, barrer o unir.

Una primitiva puede ser simple desde el punto de vista conceptual,
aunque su implementación geométrica sea técnicamente compleja.

### 3.2. Nivel 2 --- Shapes

**Definición**

Los shapes son formas, perfiles o configuraciones geométricas
construidas a partir de primitivas, combinaciones de primitivas y
operaciones geométricas. Constituyen el vocabulario geométrico con el
que ARKI materializa configuraciones que podrán utilizarse en las
familias.

Un shape puede ser bidimensional, tridimensional o una configuración que
describa una composición espacial. Su dimensión y naturaleza deben
declararse explícitamente.

**Ejemplos ilustrativos**

-   Perfiles y contornos: círculo, arco, polígono, anillo.
-   Configuraciones en planta: L, U, T, barra, patio, anillo.
-   Configuraciones volumétricas: torre, bloque, agrupación, volumen
    escalonado.
-   Composiciones: conjuntos de sólidos o volúmenes articulados.

Estos ejemplos no afirman que todos estén implementados actualmente ni
que todos pertenezcan a la misma clase geométrica.

**Responsabilidades**

-   Componer primitivas mediante relaciones geométricas explícitas.
-   Definir perfiles, contornos, sólidos y configuraciones volumétricas.
-   Declarar parámetros, restricciones, dimensiones y dependencias.
-   Permitir variaciones paramétricas y transformaciones.
-   Proporcionar geometría reutilizable a las familias.
-   Conservar identidad, procedencia y trazabilidad de su construcción.

**Clasificación obligatoria**

El catálogo de shapes debe distinguir, como mínimo:

1.  **Primitiva:** entidad geométrica fundamental.
2.  **Perfil o contorno:** geometría plana que puede servir de sección o
    límite.
3.  **Shape compuesto:** composición de dos o más elementos geométricos.
4.  **Configuración volumétrica:** disposición espacial de uno o varios
    volúmenes.
5.  **Referencia tipológica:** patrón de forma asociado a una intención
    arquitectónica, sin ser necesariamente una entidad geométrica
    ejecutable.

Esta clasificación evita tratar como equivalentes una caja, un perfil en
L, una operación de extrusión y una organización volumétrica en torno a
un patio.

**Regla de apertura**

El catálogo de shapes debe ser extensible. Los elementos existentes
sirven como vocabulario reutilizable, no como límite de las formas que
ARKI puede generar.

### 3.3. Nivel 3 --- Familias arquitectónicas

**Definición**

Las familias son patrones o configuraciones arquitectónicas que
organizan uno o varios shapes para expresar una lógica de composición
espacial y volumétrica. Funcionan como conocimiento de diseño
reutilizable y como referencias para la generación de propuestas.

Ejemplos ilustrativos:

-   Organización de patio central.
-   Organización en claustro.
-   Bloques lineales.
-   Pabellones.
-   Organización radial.
-   Conjuntos de barras.
-   Configuraciones de torre y basamento.
-   Agrupaciones de volúmenes articulados.

**Responsabilidades**

-   Describir una lógica de organización espacial y volumétrica.
-   Relacionar shapes y definir sus posiciones o relaciones.
-   Registrar características, ventajas, limitaciones y casos de
    aplicación.
-   Aportar patrones de referencia al razonamiento de diseño.
-   Permitir variaciones, combinaciones y reinterpretaciones.
-   Ayudar a generar alternativas sin imponer una solución
    predeterminada.

**Familias como atlas de conocimiento**

Las familias existentes deben conservarse como un **Atlas de Familias
Arquitectónicas**: un manual estructurado de formas, volúmenes y
configuraciones base.

Cada ficha de familia debería incluir:

-   Identificador estable y nombre.
-   Descripción conceptual.
-   Esquema de organización espacial.
-   Shapes que pueden participar en su configuración.
-   Relaciones espaciales características.
-   Parámetros y grados de libertad.
-   Ventajas y limitaciones.
-   Usos potenciales y condiciones de pertinencia.
-   Variantes conocidas.
-   Ejemplos o referencias, cuando existan.
-   Procedencia, versión y estado de validación.

Las recomendaciones de una familia son conocimiento orientador. No deben
transformarse automáticamente en restricciones obligatorias del diseño.
Las restricciones obligatorias deben proceder del brief, la normativa,
las condiciones del sitio, los requisitos técnicos o decisiones
explícitas del proyecto.

**Regla de no duplicación**

Una familia no debe convertirse en un motor geométrico paralelo ni
duplicar las funciones del kernel. Debe describir y orientar una
configuración; la construcción y validación de la geometría deben
resolverse mediante los mecanismos geométricos autorizados por ARKI.

Por tanto, las familias redundantes como generadores operativos deben
eliminarse, consolidarse o reclasificarse. Su conocimiento útil debe
preservarse en el Atlas, con trazabilidad de lo que se haya fusionado o
retirado.

### 3.4. Nivel 4 --- Equipamiento arquitectónico

**Definición**

El equipamiento arquitectónico es el objeto de diseño completo que ARKI
debe resolver. Integra una o varias familias, shapes, espacios, sistemas
constructivos y relaciones funcionales para responder a un programa, un
emplazamiento, unas condiciones urbanas, una normativa y unos objetivos
de desempeño.

Ejemplos:

-   Colegio.
-   Hospital.
-   Mercado.
-   Biblioteca.
-   Terminal de transporte.
-   Centro cultural.
-   Complejo deportivo.

**Responsabilidades**

-   Interpretar el brief y convertirlo en requisitos verificables.
-   Organizar el programa arquitectónico y sus relaciones funcionales.
-   Seleccionar, combinar o generar familias y shapes pertinentes.
-   Resolver implantación, accesibilidad, circulaciones y relaciones con
    el contexto.
-   Integrar estructura, envolvente, materialidad y sistemas
    constructivos.
-   Verificar normativa, desempeño y restricciones del proyecto.
-   Producir alternativas comparables y justificar la propuesta
    seleccionada.

**Regla esencial**

El tipo de equipamiento no determina una única familia. Un mismo
colegio, hospital o mercado puede resolverse mediante múltiples
configuraciones arquitectónicas. La selección debe surgir del
razonamiento y de la evaluación contextual, no de una asociación rígida
entre programa y tipología.

## 4. Operaciones geométricas: una dimensión transversal

Las operaciones geométricas no deben confundirse con los cuatro niveles
de la jerarquía. Son mecanismos transversales que permiten crear,
transformar, combinar o validar geometría.

**Ejemplos**

-   Extrusión.
-   Revolución.
-   Barrido.
-   Loft o transición entre secciones.
-   Unión.
-   Diferencia.
-   Intersección.
-   Offset.
-   Shell o vaciado.
-   Espesor.
-   Fillet o redondeo.
-   Chamfer o bisel.
-   Split o división.
-   Transformaciones, patrones y matrices.

Una operación recibe geometría y parámetros, aplica un procedimiento
definido y produce un resultado que debe validarse. Según el caso, puede
generar un shape, modificar uno existente o participar en la
construcción de una configuración mayor.

Por tanto:

-   Una **primitiva** es una entidad geométrica básica.
-   Un **shape** es una forma o configuración geométrica.
-   Una **operación** es un procedimiento aplicado a geometría.
-   Una **familia** es una organización arquitectónica de referencia.
-   Un **equipamiento** es el problema y objeto arquitectónico integral.

La clasificación concreta de cada elemento debe basarse en su semántica
y comportamiento real, no solamente en su nombre.

## 5. Flujo conceptual de diseño y generación

La jerarquía debe integrarse con el flujo de razonamiento de ARKI:

**Brief → conocimiento → razonamiento D6.2 → PARTI → topología →
geometría D6.3 → AGK**

La relación entre ambos modelos es la siguiente:

1.  **Brief:** define el problema, el programa, el sitio, las
    restricciones y los objetivos.
2.  **Conocimiento:** consulta normas, estándares, precedentes, Atlas de
    Familias, catálogo de shapes y conocimiento técnico.
3.  **Razonamiento D6.2:** interpreta requisitos, establece criterios y
    formula estrategias.
4.  **PARTI:** expresa la intención arquitectónica y la lógica
    organizadora de la propuesta.
5.  **Topología:** define relaciones, conexiones, adyacencias,
    jerarquías y organización espacial.
6.  **Geometría D6.3:** construye y transforma geometría a partir de
    primitivas, shapes y operaciones.
7.  **AGK:** valida y gobierna la geometría operativa conforme a sus
    contratos.

La jerarquía Primitivas → Shapes → Familias → Equipamiento describe los
niveles de conocimiento y composición. El flujo anterior describe el
proceso de razonamiento y materialización. Son modelos complementarios,
no intercambiables.

## 6. Funnel de generación, evaluación y selección

El funnel de ARKI debe evaluar propuestas arquitectónicas, no limitarse
a seleccionar elementos de un catálogo.

La secuencia de referencia es:

**25 → 16 → 9 → 4 → 1**

Cuando una etapa anterior genere un universo mayor de alternativas,
podrán existir etapas de preselección adicionales. La secuencia concreta
debe respetar la configuración vigente del funnel y no debe alterarse
sin una decisión documentada.

**Principios de funcionamiento**

-   Generar alternativas a partir del brief, el conocimiento y la
    intención arquitectónica.
-   Utilizar primitivas, shapes y familias como recursos de construcción
    y referencia.
-   Permitir combinaciones nuevas y configuraciones no incluidas
    previamente en el Atlas.
-   Aplicar criterios de descarte explícitos y verificables.
-   Comparar alternativas con criterios consistentes.
-   Conservar la trazabilidad de las propuestas descartadas y
    seleccionadas.
-   Justificar por qué una alternativa avanza y otra no.
-   Evitar que la familiaridad o facilidad de generación de una
    tipología determine automáticamente su preferencia.

El funnel debe poder seleccionar una propuesta que combine varias
familias, modifique una familia existente o no corresponda directamente
a ninguna familia del Atlas.

**No confundir diversidad con calidad:** generar muchas variantes no
garantiza un buen resultado. La evaluación debe considerar cumplimiento
funcional, calidad espacial, pertinencia contextual, viabilidad técnica,
desempeño, normativa y demás criterios definidos para el proyecto.

## 7. Autoridad geométrica y principio de no duplicación

AGK es la autoridad única de la geometría operativa de ARKI.

En consecuencia:

-   Ninguna familia puede constituir un kernel geométrico alternativo.
-   Ningún catálogo de shapes puede validar por sí mismo la geometría
    operativa al margen de AGK.
-   Los generadores deben producir resultados que puedan ser sometidos a
    los contratos y validaciones de AGK.
-   Las operaciones geométricas deben tener semántica, entradas, salidas
    y errores definidos.
-   La geometría resultante debe conservar identidad, parámetros y
    trazabilidad.
-   Los adaptadores de formatos no deben convertirse en autoridades
    geométricas paralelas.

Las bibliotecas externas pueden ejecutar operaciones especializadas bajo
contratos controlados, pero no desplazan la autoridad de AGK.

## 8. Modelo de información recomendado

Cada nivel debe contar con identidad estable y metadatos explícitos.

  -----------------------------------------------------------------------
  Nivel                               Información mínima
  ----------------------------------- -----------------------------------
  Primitiva                           ID, tipo, parámetros, unidades,
                                      sistema de coordenadas, versión y
                                      validaciones

  Shape                               ID, clase semántica, geometría o
                                      receta, primitivas de origen,
                                      operaciones, parámetros y
                                      dependencias

  Familia                             ID, descripción, shapes
                                      participantes, relaciones,
                                      parámetros, recomendaciones,
                                      restricciones y procedencia

  Equipamiento                        ID de proyecto, programa, sitio,
                                      requisitos, familias y shapes
                                      utilizados, sistemas, evaluaciones
                                      y decisiones
  -----------------------------------------------------------------------

Además, cada objeto debe distinguir entre:

-   **Definición:** qué es el objeto.
-   **Instancia:** cómo se utiliza en una propuesta concreta.
-   **Receta de generación:** cómo se construye.
-   **Resultado geométrico:** qué geometría produjo la receta.
-   **Validación:** qué controles superó y con qué evidencia.

Esta separación evita que una definición de catálogo se confunda con una
instancia de proyecto o con un resultado geométrico validado.

## 9. Reglas de clasificación y gobierno del catálogo

Todo elemento existente o nuevo debe clasificarse según su naturaleza
real.

**Reglas obligatorias**

1.  No clasificar una operación como primitiva por el hecho de que
    produzca una forma.
2.  No clasificar un perfil bidimensional como sólido tridimensional.
3.  No clasificar una configuración volumétrica como familia
    arquitectónica si no expresa una lógica de organización de diseño.
4.  No convertir una familia en un generador independiente del kernel.
5.  No eliminar conocimiento útil por retirar una implementación
    redundante.
6.  No asumir que un nombre en el catálogo demuestra que la
    funcionalidad está implementada.
7.  No asumir que una geometría compila que sea válida, correcta o apta
    para uso operativo.
8.  Toda reclasificación, fusión o retiro debe conservar evidencia y
    trazabilidad.

### 9.1. Tratamiento de los catálogos existentes

Los inventarios históricos ---incluidos los registros declarados de 41
familias, 112 variantes y 128 shapes--- deben considerarse una línea
base pendiente de auditoría individual. Estas cifras no constituyen por
sí mismas una verificación técnica de la naturaleza, unicidad o
implementación de cada elemento.

No se deben borrar, renombrar ni fusionar elementos en bloque antes de:

-   Inventariar cada registro.
-   Identificar su definición y sus referencias en código.
-   Verificar su comportamiento real.
-   Determinar su clase semántica.
-   Detectar duplicados, alias y solapamientos.
-   Identificar dependencias y pruebas.
-   Proponer una migración reversible.

## 10. Validación geométrica, interoperabilidad y evidencia

La validez debe evaluarse por niveles. No son equivalentes:

1.  Registro en un catálogo.
2.  Definición de parámetros.
3.  Ejecución de una receta geométrica.
4.  Compilación de la geometría.
5.  Validez topológica y geométrica.
6.  Validación bajo AGK.
7.  Correspondencia semántica con el modelo arquitectónico.
8.  Exportación e importación interoperable.

La interoperabilidad con IFC debe preservar la semántica de los
elementos arquitectónicos. No basta con exportar sólidos: es necesario
representar correctamente entidades, propiedades, relaciones y
geometrías conforme al esquema y a los requisitos de intercambio
aplicables.

Un resultado STEP, B-Rep o malla no es automáticamente un elemento IFC
semánticamente válido. Los adaptadores deben documentar qué información
conservan, transforman o pierden.

## 11. Consecuencias para la arquitectura de software

La implementación debe reflejar la separación conceptual sin introducir
motores paralelos.

Se recomienda separar responsabilidades en componentes o módulos
equivalentes a:

-   **Primitive Catalog:** definiciones y parámetros de primitivas.
-   **Shape Catalog:** perfiles, formas y configuraciones geométricas.
-   **Geometry Operations:** operaciones y transformaciones.
-   **Family Atlas:** conocimiento y patrones de organización
    arquitectónica.
-   **Equipment Design Model:** programa, requisitos, contexto y
    composición del equipamiento.
-   **Design Funnel:** generación, poda, evaluación y selección de
    alternativas.
-   **AGK:** autoridad de geometría operativa, validación y
    regeneración.
-   **Interoperability Adapters:** intercambio con IFC y otros formatos.

Estos nombres son etiquetas conceptuales recomendadas, no una afirmación
de que dichos módulos ya existan en los repositorios.

La implementación concreta debe respetar la arquitectura vigente,
reutilizar componentes existentes y evitar duplicaciones.

## 12. Plan de adopción

La adopción debe ser incremental, verificable y reversible.

### Fase 1 --- Congelar la línea base

-   Registrar commits, ramas y estado de trabajo de los repositorios
    implicados.
-   Conservar los inventarios y manifiestos existentes.
-   Identificar las fuentes de verdad de cada catálogo.
-   No realizar eliminaciones durante esta fase.

### Fase 2 --- Auditar primitivas y shapes

-   Clasificar cada registro.
-   Separar primitivas, perfiles, shapes compuestos, configuraciones
    volumétricas, referencias tipológicas y operaciones mal
    clasificadas.
-   Verificar referencias en código, compiladores, generadores y
    pruebas.
-   Identificar duplicados, alias y elementos sin uso.

### Fase 3 --- Auditar y consolidar familias

-   Conservar el conocimiento útil en el Atlas de Familias.
-   Identificar familias redundantes como motores o generadores.
-   Reubicar sus reglas útiles como documentación o conocimiento de
    referencia.
-   Eliminar duplicaciones operativas solamente después de comprobar
    dependencias y cobertura.

### Fase 4 --- Formalizar contratos entre niveles

-   Definir esquemas y contratos de datos.
-   Establecer identidad, versiones y trazabilidad.
-   Definir cómo un shape se construye a partir de primitivas y
    operaciones.
-   Definir cómo una familia referencia y organiza shapes.
-   Definir cómo un equipamiento utiliza familias sin quedar limitado a
    ellas.

### Fase 5 --- Integrar el flujo de diseño y el funnel

-   Conectar el conocimiento con el razonamiento y PARTI.
-   Permitir generación de alternativas nuevas.
-   Evaluar las alternativas con criterios explícitos.
-   Registrar evidencia de poda, selección y descarte.
-   Verificar que el funnel no dependa de una lista cerrada de familias.

### Fase 6 --- Validar AGK e interoperabilidad

-   Comprobar que la geometría operativa pasa por AGK.
-   Verificar determinismo, regeneración y trazabilidad.
-   Validar exportación e importación según los contratos establecidos.
-   Separar resultados geométricos de resultados semánticos IFC.

### Fase 7 --- Cerrar con evidencia

-   Ejecutar pruebas unitarias, de integración y de regresión.
-   Verificar migraciones y compatibilidad.
-   Registrar resultados reproducibles.
-   Mantener la regla: **No Evidence = No Green**.
-   No declarar cerrada una fase con fallos, pruebas ausentes o
    resultados no verificables.

## 13. Criterios de aceptación

La jerarquía podrá considerarse adoptada cuando exista evidencia de que:

-   Cada elemento del catálogo está clasificado en el nivel correcto.
-   Las operaciones geométricas están separadas semánticamente de las
    entidades que producen.
-   Los shapes pueden componerse y parametrizarse sin depender de
    familias cerradas.
-   Las familias funcionan como conocimiento de diseño y no como kernels
    alternativos.
-   Un equipamiento puede combinar familias, shapes y configuraciones
    nuevas.
-   El funnel puede generar, evaluar y seleccionar propuestas fuera del
    catálogo predefinido.
-   AGK conserva la autoridad única de geometría operativa.
-   Las transformaciones, regeneraciones y decisiones mantienen
    trazabilidad.
-   Los cambios no destruyen conocimiento ni rompen dependencias sin
    migración documentada.
-   Las pruebas y evidencias respaldan el estado declarado.

## 14. Decisiones conceptuales que se establecen

Este documento propone formalizar las siguientes decisiones:

1.  La jerarquía conceptual de ARKI es **Primitivas → Shapes → Familias
    → Equipamiento arquitectónico**.
2.  Las primitivas son los elementos geométricos fundamentales.
3.  Los shapes son formas y configuraciones geométricas construidas
    mediante primitivas y operaciones.
4.  Las familias son patrones de organización arquitectónica y deben
    conservarse como un Atlas de conocimiento.
5.  Las familias no son motores geométricos ni deben duplicar la
    autoridad de AGK.
6.  El equipamiento es el objeto integral de diseño que resuelve
    programa, contexto, normativa y objetivos.
7.  Las operaciones geométricas constituyen una dimensión transversal,
    no un nivel equivalente de la jerarquía.
8.  Los catálogos son vocabularios extensibles y no límites de
    generación.
9.  El funnel selecciona propuestas arquitectónicas, no solamente formas
    predefinidas.
10. AGK sigue siendo la autoridad única de geometría operativa.
11. Toda reclasificación, consolidación o eliminación debe ser
    auditable, reversible cuando corresponda y respaldada por evidencia.

## 15. Esquema de referencia

``` text
EQUIPAMIENTO ARQUITECTÓNICO
│
├── Programa y requisitos
├── Contexto y emplazamiento
├── Sistemas arquitectónicos y constructivos
│
└── FAMILIAS ARQUITECTÓNICAS
    │
    ├── Organización espacial y volumétrica
    ├── Relaciones y patrones de diseño
    │
    └── SHAPES
        │
        ├── Perfiles y contornos
        ├── Formas geométricas
        ├── Composiciones
        └── Configuraciones volumétricas
            │
            └── PRIMITIVAS GEOMÉTRICAS

OPERACIONES GEOMÉTRICAS
└── Construyen, transforman y combinan geometría
    en los niveles donde corresponda.

AGK
└── Autoridad única de geometría operativa y validación.

DESIGN FUNNEL
└── Genera, evalúa, poda y selecciona propuestas
    utilizando conocimiento abierto de todos los niveles.
```

------------------------------------------------------------------------

**Declaración final**

ARKI no debe diseñar equipamientos ensamblando rígidamente un catálogo
de formas conocidas. Debe razonar sobre el problema arquitectónico,
utilizar primitivas y shapes como recursos geométricos, consultar las
familias como conocimiento tipológico, generar configuraciones nuevas y
validar la geometría mediante AGK.

La jerarquía organiza el conocimiento; no restringe la creatividad del
sistema. El catálogo orienta; no sustituye el razonamiento. La
generación propone; el funnel evalúa. AGK valida la geometría operativa.

**No Evidence = No Green.**
