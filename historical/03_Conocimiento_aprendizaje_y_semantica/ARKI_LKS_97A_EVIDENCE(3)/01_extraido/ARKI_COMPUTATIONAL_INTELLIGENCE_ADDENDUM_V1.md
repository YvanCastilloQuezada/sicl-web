# ARKI Computational Intelligence — Addendum v1.0

## Decisión arquitectónica

ARKI debe combinar **conocimiento propio, razonamiento propio, computación determinista propia, evaluación, generación, memoria, causalidad y autoridad humana**.

No se adoptan ninguno de estos extremos:

- `ARKI = LLM + 20 APIs externas`.
- `ARKI = LLM que leyó libros y afirma saber calcularlo todo`.
- `ARKI = orquestador que delega permanentemente su inteligencia técnica a software de terceros`.

La dirección aprobada para desarrollo es:

> **ARKI = inteligencia integral + conocimiento verificable + computación determinista propia + herramientas externas opcionales + Core/Trust + Human Authority.**

## Arquitectura de tres fabrics

```text
                 ARKI COMPUTATIONAL INTELLIGENCE

                              ARKI
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
      KNOWLEDGE            REASONING            COMPUTATION
       FABRIC                FABRIC                FABRIC
       SABER                 PENSAR                CALCULAR
          └────────────────────┼────────────────────┘
                               ▼
                          EVALUATION
                               │
                          GENERATION
                               │
                            PROJECT
```

### Knowledge Fabric — Saber

Contiene conocimiento estructurado, no únicamente documentos indexados. Cada conocimiento debe registrar:

- Fuente.
- Autor o institución.
- País y jurisdicción.
- Disciplina y tipología.
- Edición y vigencia.
- Hipótesis.
- Unidades.
- Nivel de confianza.
- Relaciones con reglas, ecuaciones, entidades y casos.
- Contradicciones conocidas.
- Pruebas de competencia asociadas.

El conocimiento se incorpora mediante el siguiente flujo:

```text
LIBROS · NORMAS · PAPERS · MANUALES · CASOS · EXPEDIENTES
                              ↓
                         EXTRACCIÓN
                              ↓
                    CONOCIMIENTO CANDIDATO
                              ↓
                         PROVENANCE
                              ↓
                      CONTRADICCIONES
                              ↓
                         VALIDACIÓN
                              ↓
                      KNOWLEDGE GRAPH
                              ↓
                    COMPETENCY TESTS
                              ↓
                       ARKI KNOWLEDGE
```

Un documento extraído por OCR o por un modelo de lenguaje es **conocimiento candidato**, nunca conocimiento canónico automático.

### Reasoning Fabric — Pensar

La Reasoning Fabric interpreta el contexto del proyecto y decide:

1. Qué disciplina interviene.
2. Qué entidades y relaciones están afectadas.
3. Qué hipótesis son válidas.
4. Qué reglas y ecuaciones son aplicables.
5. Qué kernel debe ejecutarse.
6. Qué datos faltan.
7. Qué contradicciones deben resolverse.
8. Cuándo el resultado requiere validación profesional.

La Reasoning Fabric no realiza silenciosamente las matemáticas del kernel. Decide **cuándo, por qué y bajo qué condiciones** se ejecutan.

### Computation Fabric — Calcular

La Computation Fabric es determinista, versionada y testeable. No es un agente generativo.

Ejemplo conceptual:

```text
Reasoning:
  “Debe comprobarse el pandeo del elemento E-104.”

Structural Kernel:
  λ = ...
  capacity = ...
  demand = ...

ARKI Interpretation:
  “El elemento no satisface el criterio X bajo las hipótesis Y.”

Core/Trust registra:
  inputs + método + fórmula + versión + fuente + resultado + incertidumbre

Human Authority:
  decide y aprueba o devuelve el resultado
```

## Kernels propios por disciplina

### ARKI.Structures

El primer vertical científico recomendado es estructuras, porque permite establecer el patrón reutilizable para futuras disciplinas.

Capacidades objetivo:

- `assemble_stiffness_matrix()`
- `solve_displacements()`
- `calculate_member_forces()`
- `modal_analysis()`
- `response_spectrum()`
- `nonlinear_analysis()`
- `check_drift()`
- `check_capacity()`

Conocimiento asociado:

- Estática.
- Resistencia de materiales.
- Elasticidad.
- Dinámica.
- Concreto armado.
- Acero.
- Albañilería.
- Madera.
- Geotecnia.
- Ingeniería sísmica.
- FEM.
- Normativa aplicable.

### ARKI.Hydraulics

Capacidades objetivo:

- `flow()`
- `velocity()`
- `pressure_loss()`
- `pipe_sizing()`
- `pump_curve()`
- `tank_capacity()`
- `network_balance()`

ARKI no sólo dimensiona una tubería o una cisterna. Debe comprender su efecto en arquitectura, ubicación, mantenimiento, redundancia, presión, incendio, costos y operación.

### ARKI.Electrical

Capacidades objetivo:

- `load_estimation()`
- `demand_factor()`
- `circuit_sizing()`
- `voltage_drop()`
- `short_circuit()`
- `selectivity()`
- `transformer_sizing()`
- `generator_sizing()`
- `UPS_sizing()`

El razonamiento debe ser interdisciplinar. Cambiar un tomógrafo puede afectar simultáneamente potencia, UPS, grupo electrógeno, HVAC, estructura, espacio, mantenimiento, shielding, costo y cronograma.

## Herramientas externas como oráculos

EnergyPlus, OpenSees, calculadores especializados y otros motores no se eliminan de inmediato. Se les asigna un rol controlado:

- Validación independiente.
- Benchmarking.
- Casos extraordinarios.
- Interoperabilidad.
- Contraste durante el desarrollo.

Ejemplo de validación:

```text
ARKI Structural Kernel  = 23.42 mm
OpenSees                 = 23.39 mm
Benchmark analítico      = 23.41 mm

Resultado: PASS dentro de la tolerancia declarada
```

El proceso debe crecer por lotes:

1. Diez casos de referencia.
2. Cien casos.
3. Mil casos.
4. Diez mil casos cuando el dominio y los recursos lo justifiquen.

La promoción de un kernel exige declarar:

- Fixtures.
- Tolerancias.
- Casos límite.
- Unidades.
- Hipótesis.
- Convergencia.
- Comparación contra solución analítica o herramienta externa.
- Limitaciones.
- Revisión profesional.

Un tercero puede seguir siendo útil aunque ARKI ya sea competente en un cálculo. La independencia no significa aislamiento; significa que ARKI no depende ciegamente de ese tercero para afirmar el resultado.

## Biblioteca científica ARKI

Las capacidades deben organizarse como bibliotecas computacionales y de conocimiento, no como agentes independientes:

```text
ARKI.Math
ARKI.Geometry
ARKI.Structures
ARKI.Seismic
ARKI.Geotechnics
ARKI.Hydraulics
ARKI.Electrical
ARKI.HVAC
ARKI.Fire
ARKI.Evacuation
ARKI.Acoustics
ARKI.Lighting
ARKI.Energy
ARKI.Environment
ARKI.GIS
ARKI.BIM
ARKI.Cost
ARKI.Schedule
ARKI.Airport
ARKI.Rail
ARKI.Port
ARKI.Hospital
```

Cada biblioteca debe añadir cinco componentes coordinados:

1. Conocimiento.
2. Ecuaciones y algoritmos.
3. Kernel o funciones deterministas.
4. Verificadores.
5. Pruebas de competencia.

## Impacto interdisciplinar

El valor diferencial de ARKI no consiste únicamente en calcular más disciplinas por separado. Consiste en conservar las consecuencias cruzadas.

Un cambio en un equipo, espacio o sistema debe poder propagar impactos a:

- Arquitectura.
- Estructuras.
- Electricidad.
- HVAC.
- Sanitarias.
- Seguridad y protección contra incendios.
- Telecomunicaciones.
- Costos.
- Cronograma.
- Mantenimiento.
- Expediente técnico.

Esto exige un grafo causal y de dependencias, no sólo una lista de módulos.

## Estados de competencia

ARKI debe utilizar estados explícitos:

| Estado | Significado |
|---|---|
| `UNKNOWN` | No existe información suficiente. |
| `NOT_DEMONSTRATED` | Existe una idea o contrato, pero no evidencia suficiente. |
| `IMPLEMENTED` | Existe código ejecutable. |
| `VERIFIED` | Existen pruebas y outputs reproducibles. |
| `E2E_VERIFIED` | La cadena completa se verificó con datos representativos. |
| `PROFESSIONAL_VALIDATION_REQUIRED` | El resultado requiere revisión o firma autorizada. |
| `EXTERNAL_ORACLE_REQUIRED` | El contraste externo sigue siendo obligatorio. |

Cuando una disciplina exceda lo demostrado, ARKI debe responder explícitamente:

```text
UNKNOWN
NOT_DEMONSTRATED
PROFESSIONAL_VALIDATION_REQUIRED
```

Nunca debe rellenar la ausencia de capacidad con una narrativa convincente.

## Core/Trust y Human Authority

El Core/Trust debe registrar, como mínimo:

- Identidad del proyecto.
- Identidad y versión del kernel.
- Inputs normalizados.
- Unidades.
- Fórmulas o método.
- Fuentes de conocimiento.
- Hipótesis.
- Tolerancias.
- Resultado.
- Incertidumbre.
- Warnings.
- Comparaciones externas.
- Evidencia.
- Usuario o especialista que aprobó.
- Fecha y versión del snapshot.

La **Human Authority** no es un elemento decorativo. En cálculos estructurales, eléctricos, sanitarios, de seguridad, hospitales y otros dominios regulados, la responsabilidad profesional no se transfiere automáticamente a ARKI.

## Orden de implementación recomendado

### CI-0 — Gobierno de inteligencia computacional

Crear ADR, vocabulario, estados de competencia, contrato de resultados, provenance, unidades y autoridad humana.

### CI-1 — Geometry y Math Kernel

Construir las bases comunes de unidades, tolerancias, vectores, matrices, geometría y validaciones.

### CI-2 — Primer vertical: ARKI.Structures

Implementar un caso pequeño de FEM o análisis estructural, con fixtures y comparación analítica.

### CI-3 — Oracle Benchmark Harness

Crear el arnés que ejecute el mismo caso contra ARKI, una solución de referencia y, cuando corresponda, OpenSees u otro oráculo.

### CI-4 — Knowledge Pipeline

Implementar extracción, provenance, contradicciones, validación, grafo de conocimiento y competency tests.

### CI-5 — Hydraulics y Electrical

Añadir kernels sanitarios y eléctricos reutilizando la infraestructura común, no creando agentes aislados.

### CI-6 — Causalidad interdisciplinar

Conectar impactos entre arquitectura, estructura, MEP, costos, 4D, operación y mantenimiento.

### CI-7 — Escalamiento por bibliotecas

Incorporar HVAC, fuego, evacuación, acústica, energía, GIS, hospitales, aeropuertos, ferrocarriles y puertos de forma incremental y verificable.

## Decisión final

Esta adenda se incorpora a la arquitectura **ARKI Computational Fabric** como dirección técnica prioritaria.

La decisión fundamental es:

> **ARKI debe construir conocimiento y cálculo propios, usar herramientas externas como contraste opcional o especializado, y nunca declarar una capacidad que no haya demostrado.**

El siguiente contrato técnico que debe redactarse es **ADR-CI-000 — ARKI Computational Intelligence**, seguido por un contrato pequeño y verificable de `ARKI.Math + ARKI.Geometry` antes de intentar implementar veinte disciplinas.
