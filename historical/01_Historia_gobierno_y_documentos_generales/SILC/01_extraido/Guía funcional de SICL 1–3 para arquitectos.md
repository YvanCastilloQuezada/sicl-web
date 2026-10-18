# Guía funcional de SICL 1–3 para arquitectos

## 1. Qué es SICL en términos sencillos

SICL es un sistema para **ordenar decisiones complejas de proyecto**. No reemplaza al arquitecto, al urbanista ni a la autoridad responsable. Su función es reunir información, hacer explícitos los criterios, comparar alternativas, mostrar consecuencias y conservar la trazabilidad de cómo se llegó a una recomendación.

La regla principal es:

> **La inteligencia puede analizar y recomendar; la autoridad humana decide y aprueba.**

SICL utiliza el mismo núcleo para tres escalas. Lo que cambia es el tamaño del problema y el tipo de territorio observado, no la lógica fundamental.

| Nivel | Escala de trabajo | Ejemplo sencillo |
|---|---|---|
| **SICL 1** | Objeto, edificio, sitio y proyecto | Elegir entre tres alternativas para un edificio en un terreno. |
| **SICL 2** | Sector, distrito, ciudad, área metropolitana y región | Comparar opciones de movilidad, equipamiento o crecimiento urbano. |
| **SICL 3** | Macroregión, país y escenarios nacionales | Analizar alternativas de desarrollo para 2030, 2040 o 2050. |

## 2. Cómo funciona todo el sistema

El flujo completo es una cadena de ocho pasos. Cada paso produce un registro que puede ser revisado después.

```text
1. Contexto
      ↓
2. Evidencia y fuentes
      ↓
3. Objetivos, restricciones y preferencias
      ↓
4. Alternativas
      ↓
5. Evaluaciones
      ↓
6. Comparación
      ↓
7. Recomendación analítica
      ↓
8. Revisión humana y decisión
```

SICL no salta directamente desde “datos” a “decisión”. Entre ambos extremos debe existir una explicación visible. Si faltan datos, dirección, unidad, referencia o factibilidad, el sistema debe mostrar un estado de insuficiencia en lugar de inventar una conclusión.

## 3. Funcionalidades comunes a los tres niveles

Estas funciones pertenecen al núcleo común y pueden utilizarse en un edificio, una ciudad o un escenario nacional.

### 3.1 Crear el proyecto y definir su contexto

El usuario crea un proyecto, le asigna un nombre, una localización o territorio, una escala espacial y un horizonte temporal. El contexto no es todavía una solución: describe **dónde, qué y durante qué periodo** se analizará.

**Entrada:** nombre del proyecto, localización, escala y horizonte.  
**Resultado:** un Project versionado y trazable.  
**Límite:** SICL no deduce coordenadas, límites geográficos ni pronósticos a partir de un texto libre.

### 3.2 Registrar fuentes y evidencia

El usuario incorpora documentos, mediciones, observaciones, fotografías, normas, estudios o datos de referencia. Cada evidencia debe conservar su origen y su relación con el análisis.

**Entrada:** fuente, evidencia, descripción, fecha y procedencia.  
**Resultado:** registros que explican de dónde sale cada dato.  
**Límite:** registrar una fuente no significa que SICL haya certificado su calidad profesional.

### 3.3 Definir objetivos

Un objetivo expresa qué se quiere mejorar o proteger. Debe indicar una dirección: **maximizar** o **minimizar**. Por ejemplo, “minimizar el costo” o “maximizar el área útil”.

**Entrada:** objetivo, unidad y dirección.  
**Resultado:** un criterio de orientación para la comparación.  
**Límite:** si no existe dirección, SICL no debe declarar ganador ni crear una recomendación automática.

### 3.4 Registrar restricciones y requisitos

Una restricción indica lo que no puede incumplirse o lo que debe respetarse. Un requisito expresa una condición necesaria del proyecto.

**Entrada:** descripción, valor o condición, fuente y alcance.  
**Resultado:** condiciones verificables relacionadas con el proyecto.  
**Límite:** SICL registra la condición; no sustituye la revisión legal, normativa o profesional competente.

### 3.5 Registrar preferencias

Una Preference permite documentar una preferencia del usuario o del equipo: por ejemplo, “priorizar iluminación natural”, “preferir bajo mantenimiento” o “dar mayor importancia a la integración urbana”. Debe incluir justificación, dominio, fuerza, alcance, procedencia y vigencia.

**Entrada:** preferencia, razón, dominio, fuerza, alcance y procedencia.  
**Resultado:** un registro semántico que permite entender por qué una alternativa puede resultar más adecuada para ese proyecto.  
**Límite:** una preferencia no es automáticamente un peso matemático ni una norma universal.

### 3.6 Definir alternativas

Una alternativa es una opción concreta que puede compararse con otras. En un edificio puede ser una distribución, una estrategia constructiva o una implantación. En una ciudad puede ser una política o una red. En un país puede ser un escenario.

**Entrada:** identificador, nombre y atributos escalares.  
**Resultado:** un conjunto de opciones diferenciadas.  
**Límite:** crear una alternativa no significa que sea viable, legal, económica o recomendable.

### 3.7 Registrar evaluaciones

Una Evaluation registra cómo se comporta una alternativa frente a un criterio. Debe conservar el valor, unidad, método, inputs, procedencia, dirección, versión del método y estado de factibilidad.

**Entrada:** alternativa, criterio, valor, unidad, método, inputs y evidencia.  
**Resultado:** una observación analítica trazable.  
**Límite:** una evaluación no puede presentarse como exacta si sus datos son inciertos o insuficientes.

### 3.8 Comparar alternativas

Una Comparison reúne evaluaciones compatibles y las observa frente a un objetivo y una dirección explícita. Puede indicar ventaja, desventaja, trade-off o insuficiencia de datos.

**Entrada:** evaluaciones válidas, objetivo, dirección y estado de factibilidad.  
**Resultado:** comparación analítica versionada.  
**Límite:** una comparación no es una decisión humana.

### 3.9 Crear una recomendación

Una Recommendation resume un resultado analítico y explica su razón. Debe indicar qué comparación la sustenta, qué método se utilizó y qué limitaciones tiene.

**Entrada:** comparación, razón, referencias y versión.  
**Resultado:** una recomendación que ayuda a deliberar.  
**Límite:** una recomendación no autoriza obras, contratos ni políticas públicas.

### 3.10 Registrar revisión humana

HumanReview permite que una persona identifique qué revisó, qué observó y si acepta, rechaza o solicita cambios en la recomendación.

**Entrada:** actor, autoridad, revisión, motivo y versión observada.  
**Resultado:** registro de revisión humana trazable.  
**Límite:** el software no debe fabricar la identidad ni la autoridad del revisor.

### 3.11 Registrar una decisión

Decision es el acto humano separado de la recomendación. Puede seleccionar una alternativa y registrar quién decidió, bajo qué autoridad y con qué fundamento.

**Entrada:** decisor, alternativa seleccionada, justificación, autoridad y recomendación revisada.  
**Resultado:** decisión durable y auditable.  
**Límite:** una Decision nunca se crea automáticamente porque un algoritmo haya producido un resultado favorable.

### 3.12 Consultar auditoría

La auditoría muestra eventos, versiones, actores, entidades y referencias. Permite reconstruir qué cambió y en qué orden.

**Entrada:** eventos generados por operaciones del sistema.  
**Resultado:** timeline y datos de trazabilidad filtrados sin secretos.  
**Límite:** el sistema actual utiliza snapshot más log de eventos protegido; no debe llamarse Event Sourcing completo.

### 3.13 Consultar Council y gobernanza

Council es una vista de lectura de comparaciones, trade-offs, recomendaciones y diagnósticos. El Capability Gate Ledger muestra qué etapa está preparada y qué rol debe intervenir.

**Entrada:** artefactos analíticos y referencias de gobernanza.  
**Resultado:** una vista ordenada para revisar el proyecto.  
**Límite:** Council no aprueba gates ni sustituye al Product Owner, arquitecto responsable o autoridad pública.

## 4. SICL 1 — Proyecto, objeto, edificio y sitio

SICL 1 es el nivel más concreto y el objetivo principal del MVP actual. Un arquitecto puede trabajar con un edificio real, su sitio y un conjunto de alternativas de diseño.

### 4.1 Qué puede hacer SICL 1

| Funcionalidad | Qué hace para el arquitecto | Estado actual |
|---|---|---|
| Crear proyecto | Abre un expediente estructurado del edificio o sitio | Implementado localmente |
| Definir contexto | Registra localización, escala SICL 1 y horizonte | Implementado localmente |
| Registrar evidencia | Relaciona estudios, fuentes y observaciones con el proyecto | Implementado localmente |
| Definir objetivos | Indica qué debe maximizarse o minimizarse | Implementado y probado |
| Definir restricciones | Registra requisitos de sitio, programa o normativa | Implementado y probado |
| Registrar preferencias | Documenta prioridades del cliente o equipo | Implementado y probado |
| Crear alternativas | Permite comparar soluciones de diseño | Implementado y probado |
| Evaluar alternativas | Registra métricas y métodos sin ocultar inputs | Implementado y probado |
| Comparar | Expone ventajas, desventajas y trade-offs | Implementado y probado |
| Recomendar | Produce un artefacto analítico con referencias | Implementado y probado |
| Revisar y decidir | Separa la opinión del sistema de la aprobación humana | Implementado y probado |
| Auditar | Conserva versiones, eventos y responsables | Implementado localmente |
| Simular casos | Ejecuta fixtures sintéticos para verificar invariantes | Implementado como harness externo |

### 4.2 Ejemplo de uso arquitectónico

Un arquitecto analiza un edificio multifuncional cerca de UPAO. Registra el sitio y la evidencia disponible. Define como objetivo minimizar costo sin perder área útil. Registra preferencias de mantenimiento y calidad espacial. Crea tres alternativas de implantación. Para cada una registra evaluaciones de costo, área, tiempo y mantenimiento. SICL muestra la comparación y una recomendación analítica. El arquitecto revisa las referencias y, si corresponde, utiliza el protocolo:

> **USTED APRUEBA ESTO: seleccionar la alternativa revisada bajo las condiciones indicadas. CONFIRMAR CON SI o NO.**

La aprobación humana queda registrada como Decision. Si el arquitecto no aprueba, la recomendación no se convierte en decisión.

### 4.3 Lo que SICL 1 todavía no hace

SICL 1 no realiza por sí solo diseño arquitectónico completo, cálculo estructural, certificación normativa, presupuesto profesional definitivo, validación de seguridad, levantamiento GIS, coordinación BIM ni juicio estético universal. Puede registrar resultados de esas actividades como evidencia o evaluación cuando exista un método y una fuente, pero no debe inventarlos.

## 5. SICL 2 — Ciudad y territorio

SICL 2 aplica el mismo núcleo a problemas de mayor extensión: sector, distrito, ciudad, área metropolitana y región. El objeto ya no es únicamente un edificio; puede ser una red de movilidad, un sistema de equipamientos, una estrategia de densificación o una alternativa territorial.

### 5.1 Qué puede hacer SICL 2

| Funcionalidad | Qué significa para un urbanista | Estado actual |
|---|---|---|
| Definir jerarquía territorial | Indica si el análisis trata sector, distrito, ciudad o región | Contrato mínimo diseñado |
| Definir horizonte | Permite trabajar con presente o escenarios temporales explícitos | Contrato mínimo diseñado |
| Registrar problemas urbanos | Convierte observaciones territoriales en objetivos y restricciones | Núcleo común disponible |
| Registrar alternativas de política o diseño | Compara redes, localizaciones o estrategias | Núcleo común; datos y métodos pendientes |
| Evaluar movilidad, cobertura o capacidad | Registra resultados de métodos analíticos | Catálogo IO read-only; métodos específicos pendientes |
| Comparar trade-offs territoriales | Expone conflictos entre costo, cobertura, accesibilidad o impacto | Preparado conceptualmente |
| Recomendar | Resume la alternativa analizada sin imponer política | Preparado conceptualmente |
| Revisar y decidir | Mantiene autoridad en municipio, equipo o institución | Regla común del núcleo |
| Auditar | Conserva fuentes, supuestos y versiones | Núcleo común disponible |

### 5.2 Ejemplo de uso urbano

Un urbanista compara tres alternativas para mejorar la conexión entre un distrito y un equipamiento regional. Registra población de referencia, rutas, costos, restricciones y horizonte. Define objetivos de cobertura y tiempo de viaje. Cada alternativa recibe evaluaciones con método, unidad y procedencia. SICL puede mostrar que una alternativa mejora cobertura pero aumenta costo, mientras otra reduce costo pero deja zonas sin atención. Esa salida es un trade-off, no una orden de ejecución.

### 5.3 Qué falta para un SICL 2 operativo

Se necesitan contratos aprobados para datos geoespaciales, unidades territoriales, agregación de población, incertidumbre, métodos de transporte, conectividad, cobertura, multiobjetivo y gobernanza interinstitucional. GIS y mapas pueden incorporarse como representación, pero un mapa visual no equivale a un análisis territorial válido.

## 6. SICL 3 — Desarrollo nacional y escenarios

SICL 3 utiliza el mismo núcleo para macroregiones, país y escenarios de largo plazo. Puede organizar alternativas de desarrollo y comparar supuestos, pero no debe presentarse como una máquina que predice el futuro.

### 6.1 Qué puede hacer SICL 3

| Funcionalidad | Qué significa para un equipo nacional | Estado actual |
|---|---|---|
| Definir macroregión o país | Establece el ámbito del análisis | Contrato mínimo diseñado |
| Definir horizonte 2030/2040/2050 | Declara el marco temporal de trabajo | Contrato mínimo diseñado |
| Registrar escenarios | Describe supuestos y condiciones posibles | Preparado conceptualmente |
| Registrar políticas o estrategias | Formula alternativas de desarrollo | Núcleo común; gobernanza pendiente |
| Evaluar indicadores | Organiza resultados de métodos aprobados | Métodos nacionales pendientes |
| Comparar escenarios | Hace visibles trade-offs e incertidumbres | Requiere contrato adicional |
| Recomendar | Produce una síntesis analítica condicionada | Requiere datos y métodos reales |
| Revisar y decidir | Mantiene autoridad institucional y política humana | Regla común del núcleo |
| Auditar | Conserva supuestos, fuentes, versiones y decisiones | Núcleo común disponible |

### 6.2 Ejemplo de uso nacional

Un equipo compara tres estrategias de desarrollo para 2030, 2040 y 2050. Cada escenario declara sus supuestos: inversión, infraestructura, crecimiento, riesgos y restricciones. SICL organiza las evidencias, muestra qué resultados dependen de qué supuestos y presenta las diferencias entre escenarios. El equipo responsable revisa la información y decide. SICL no afirma que un escenario vaya a ocurrir ni puede convertir una proyección en una certeza.

### 6.3 Qué falta para un SICL 3 operativo

Se requieren modelos nacionales verificables, datos oficiales o fuentes documentadas, gobernanza de múltiples instituciones, manejo de incertidumbre, conflictos de jurisdicción, criterios de agregación y procedimientos de revisión. También debe definirse cómo se comparan múltiples Objectives y cómo se documentan decisiones colectivas. Estas capacidades no deben inferirse del MVP de Objective único.

## 7. Investigación de Operaciones dentro de SICL

La Investigación de Operaciones es un conjunto de herramientas para analizar problemas, no una autoridad separada. Un método puede ayudar a calcular, ordenar o comparar, siempre que indique sus inputs, unidades, restricciones, supuestos, factibilidad, sensibilidad y procedencia.

| Función de IO | Uso sencillo | Estado |
|---|---|---|
| Catálogo de métodos | Muestra qué métodos existen y qué necesitan | Implementado read-only |
| Evaluación determinista | Calcula o registra una medida con reglas explícitas | Parcialmente disponible |
| Comparación | Ordena resultados compatibles | Implementado en el flujo local |
| Trade-off | Expone que mejorar una dimensión puede empeorar otra | Implementado como artefacto analítico |
| Sensibilidad | Muestra cómo cambia el resultado ante inputs distintos | Contrato disponible; cobertura futura |
| Optimización | Busca una solución según restricciones | Futuro, requiere contrato y gobernanza |
| Monte Carlo | Explora incertidumbre mediante escenarios | Futuro, no implementado |
| MCDA | Compara múltiples criterios | Parcial como estructura; no debe asumirse agregación universal |

## 8. Papel de la inteligencia artificial

La IA puede ayudar a organizar evidencia, proponer alternativas, resumir comparaciones, detectar inconsistencias y explicar condiciones de decisión. Sus resultados deben entrar a SICL como propuesta, evidencia o evaluación identificable. La IA no debe modificar silenciosamente el Core, inventar fuentes, ocultar incertidumbre ni registrar una Decision en nombre de una persona.

El sistema debe poder responder preguntas como: “¿qué evidencia sostiene esta evaluación?”, “¿qué cambió desde la versión anterior?”, “¿en qué condiciones deja de ser preferible esta alternativa?” y “¿quién autorizó la decisión?”.

## 9. Qué puede hacer hoy el MVP y qué no

| Capacidad | Situación |
|---|---|
| Crear y versionar proyectos | Disponible localmente |
| Registrar entidades semánticas | Disponible localmente |
| Registrar Preference canónica | Disponible en Core y HTTP v0.3 |
| Capturar Evaluation y Comparison | Disponible localmente |
| Generar Recommendation analítica | Disponible localmente |
| Registrar revisión y decisión humana | Disponible localmente |
| Mostrar Council y gobernanza read-only | Disponible en la interfaz |
| Ejecutar simulador sintético | Disponible como harness externo |
| Usar SQLite temporal | Disponible localmente |
| Usar SQLite persistente fuera de contenedor | Pendiente de Cloud Computer |
| Conectar web a Core remoto HTTPS | Preparado, pendiente de infraestructura |
| Analizar ciudad con GIS operativo | No implementado |
| Analizar país con modelos nacionales | No implementado |
| Diseñar automáticamente un edificio | No implementado |
| Emitir certificación profesional | No implementado y no debe inferirse |
| Decidir automáticamente | Prohibido por contrato |

## 10. Resumen para el arquitecto

SICL 1 ayuda a estructurar y comparar decisiones de proyecto. SICL 2 extiende la misma lógica a ciudad y territorio. SICL 3 la extiende a escenarios nacionales. En los tres casos, el sistema conserva la misma disciplina: declarar contexto, registrar evidencia, expresar objetivos y restricciones, documentar preferencias, crear alternativas, evaluar, comparar, recomendar, revisar y decidir.

La diferencia entre niveles está en la escala, los datos, los métodos y la gobernanza; no en conceder más autonomía al sistema. A mayor escala, aumenta la complejidad y también la obligación de documentar supuestos, incertidumbre, fuentes y autoridad.

El estado actual debe comunicarse así:

> **SICL 1 tiene un MVP local ejecutable y verificable. SICL 2 y SICL 3 tienen una base semántica y contractual preparada, pero todavía requieren métodos, datos, integración espacial, gobernanza y validación específica.**

## 11. Referencias internas

- `docs/AUDITORIA_CONSOLIDADA_SICL_0_6.md`
- `docs/ROADMAP_EJECUTIVA_SICL_0_6.md`
- `docs/PRODUCT_ACCEPTANCE_CONTRACT_SICL_0_6.md`
- `docs/GUIA_USUARIO_PRODUCT_0_6.md`
- `docs/SIMULATOR_PHASE_A.md`
- `http_adapter/sicl_core_http.py`
- `client/src/pages/Home.tsx`
- `server/routers.ts`
