# SiMS-DeI — ARQUI
# Juicio arquitectónico, dominio tipológico y validación multinivel

## Resumen ejecutivo

ARQUI ya dispone de una base verificable para razonar sobre una propuesta arquitectónica: puede leer un problema, derivar estrategias, organizar relaciones espaciales, conservar alternativas, revisar una realización y comprobar parte de la coherencia vertical. Sin embargo, esa capacidad no equivale todavía a generar una planta constructiva completa.

Para hacer la diferencia visible se incorporó el ejemplo educativo `HOUSE-001-EDUCATIONAL`. El ejemplo representa una vivienda unifamiliar de dos niveles, con espacios públicos, privados, de servicio y de transición. La casa no se presenta como un proyecto aprobado ni como documentación para construir. Su función es mostrar qué puede verificar actualmente ARQUI y qué información todavía debe ser aportada, dibujada o validada por profesionales.

También se definió un protocolo reproducible para validar la coherencia multinivel de un hospital. El protocolo verifica primero la continuidad geométrica y de niveles. Después exige comprobaciones separadas para circulación clínica, circulación pública, rutas accesibles, evacuación, estructura e infección. Una masa alineada no prueba por sí sola ninguna de esas propiedades.

## 1. Estado visible de juicio arquitectónico

La facultad de **juicio arquitectónico** se encuentra en estado `PARTIAL`. Esto significa que ARQUI puede comparar y explicar ciertos trade-offs, pero no puede afirmar que una alternativa sea bella, excelente o apropiada en sentido profesional sin evidencia contextual y revisión humana.

En el ejemplo de casa, el juicio arquitectónico se apoya en los siguientes elementos:

| Dimensión | Estado | Evidencia visible | Límite actual |
|---|---|---|---|
| Proporción y compacidad | Parcial | Comparación de alternativas y métricas de massing | No existe evaluación completa de experiencia espacial |
| Carácter arquitectónico | Requiere evidencia | A16 y A26 pueden formular hipótesis | El carácter sigue siendo una decisión humana |
| Utilidad | Parcial | Programa y relaciones funcionales propuestas | No hay validación completa de uso cotidiano |
| Dignidad y habitabilidad | Requiere evidencia | Puede registrarse como criterio | No se infiere desde la geometría |
| Complejidad formal | Parcial | A24 permite perfiles controlados | No existe aún coste constructivo validado |
| Excelencia | Requiere evidencia | Puede comparar objetivos y tensiones | No es un score automático |
| Costo razonable | Requiere evidencia | Se reconoce como tensión | Falta presupuesto, mercado y ciclo de vida verificados |

El sistema debe mostrar explícitamente la tensión entre **belleza y costo**, **complejidad formal y constructibilidad**, y **privacidad y eficiencia de circulación**. No debe ocultar esas tensiones dentro de una puntuación única.

La salida correcta para la casa no es “esta es la mejor vivienda”. La salida correcta es: “estas son las alternativas, estas son sus cualidades observables, estas son sus incertidumbres y estas son las decisiones que corresponden a la autoridad humana”.

## 2. Estado visible de dominio tipológico

El **dominio tipológico** también se encuentra en estado `PARTIAL`. ARQUI distingue una vivienda unifamiliar de un hospital porque el programa, los flujos y los riesgos no son los mismos. A24, A26 y A27 ofrecen superficies de razonamiento para tipología, materiales, accesibilidad y seguridad.

En `HOUSE-001-EDUCATIONAL`, la tipología se estructura así:

```text
TYPOLOGY = SINGLE_FAMILY_HOUSE
LEVELS = N1 + N2
PUBLIC = Living / dining
SERVICE = Kitchen
PRIVATE = Bedroom 1 + Bedroom 2
TRANSITION = Patio + stair core
```

Esta estructura es útil porque obliga a diferenciar:

- el espacio público de la vivienda;
- el gradiente hacia lo privado;
- el servicio y apoyo doméstico;
- la transición interior-exterior;
- el núcleo de conexión entre niveles.

Todavía faltan datos del hogar, edad de sus habitantes, prácticas culturales, presupuesto, clima, normativa local, mantenimiento y modo de ocupación. Por ese motivo, el ejemplo es una **hipótesis tipológica estructurada**, no una solución universal para viviendas.

## 3. Ejemplo utilizable de una casa

El panel de ARQUI muestra ahora el caso `HOUSE-001-EDUCATIONAL` y permite observar la separación entre evidencia conceptual y verificación.

### 3.1 Datos del caso

```text
SITE = 18 m × 24 m
NORTH = NORTH_UP
LEVELS = N1 + N2
MASS = 10 m × 8 m on N1 and N2
COORDINATE_FRAME = LOCAL_ENU
UNITS = m
```

### 3.2 Espacios propuestos

| Espacio | Nivel | Área indicativa | Zona | Estado |
|---|---:|---:|---|---|
| Living / dining | N1 | 32 m² | Pública | Propuesta conceptual |
| Kitchen | N1 | 14 m² | Servicio | Propuesta conceptual |
| Patio / transition | N1 | 18 m² | Transición | Propuesta conceptual |
| Bedroom 1 | N2 | 16 m² | Privada | Propuesta conceptual |
| Bedroom 2 | N2 | 14 m² | Privada | Propuesta conceptual |
| Stair core | N1 → N2 | 8 m² | Transición | No verificado |

### 3.3 Qué se verifica actualmente

La prueba de la casa confirma determinísticamente que:

1. existen dos niveles ordenados;
2. ambos niveles utilizan las mismas unidades;
3. ambos niveles utilizan el mismo marco de coordenadas;
4. la masa superior está contenida dentro de la masa inferior;
5. la relación vertical `STACKS_ABOVE` existe y tiene provenance;
6. el estado de alineamiento de masa es `COHERENT`;
7. la autoridad humana permanece preservada.

### 3.4 Qué permanece conceptual

La prueba no confirma todavía:

- límites geométricos de cada habitación;
- puertas y ventanas;
- ancho o geometría de la escalera;
- ruta accesible;
- estructura;
- instalaciones;
- iluminación natural por espacio;
- ventilación;
- cumplimiento normativo;
- costo de construcción;
- habitabilidad real;
- documentación constructiva.

En consecuencia, `COHERENT` en esta prueba significa **coherente para el apilamiento de masas**, no “casa lista para construir”.

## 4. Límite entre síntesis conceptual y planta constructiva

La síntesis espacial conceptual responde preguntas como:

```text
¿Qué espacios debería considerar el programa?
¿Qué relaciones son requeridas o preferidas?
¿Qué zonas podrían agruparse?
¿Qué gradiente público-privado es plausible?
¿Qué estrategia de circulación se desea explorar?
```

Una planta arquitectónica constructiva debe responder además:

```text
¿Dónde está exactamente cada límite?
¿Qué muro contiene cada espacio?
¿Dónde están las puertas y con qué sentido abren?
¿Qué ancho y pendiente tiene cada recorrido?
¿Cómo se resuelve la estructura?
¿Cómo pasan instalaciones y ductos?
¿Qué norma y jurisdicción aplican?
¿Cómo se construye, mantiene y presupuesta?
```

La diferencia central es la **semántica espacial verificable**. Un `ProgramNode` expresa una necesidad. Una `SpatialZoneProposal` expresa una organización sugerida. Una geometría de espacio arquitectónico explícita expresa un límite que puede medirse. Ninguna de las tres, por sí sola, equivale a un conjunto constructivo completo.

El flujo correcto debe ser:

```text
PROGRAM
→ RELATIONS
→ ZONE PROPOSAL
→ HUMAN REVIEW
→ EXPLICIT SPACE GEOMETRY
→ A15 READ
→ A16 CRITIQUE
→ ACCESSIBILITY / REGULATORY REVIEW
→ STRUCTURAL / MEP COORDINATION
→ CONSTRUCTION DOCUMENTATION
```

La etapa de generación de planta constructiva requiere nuevas verificaciones de colisión, contención, continuidad, puertas, estructura, instalaciones, accesibilidad, evacuación y normativa. No debe lograrse reinterpretando una `SpatialZone` sintética como si fuera una habitación construible.

## 5. Prueba de coherencia multinivel para un hospital

El hospital requiere una prueba más exigente que la casa porque la coherencia vertical no se limita a masas alineadas. La validación debe preservar flujos distintos y usuarios con distintas condiciones.

### 5.1 Fixture

```text
PROJECT = HOSPITAL-001-VALIDATION
LEVEL N1 = Emergency / public base
LEVEL N2 = ICU / surgery upper
MASS = 36 m × 24 m on both levels
RELATION = STACKS_ABOVE
COORDINATE_FRAME = LOCAL_ENU
UNITS = m
```

### 5.2 Secuencia de validación

#### Paso 1: Identidad y orden vertical

Comprobar que N1 y N2 pertenecen al mismo proyecto y alternativa. Verificar que `levelIndex(N2) > levelIndex(N1)` y que no existan niveles duplicados o invertidos.

#### Paso 2: Compatibilidad geométrica

Comprobar unidades, marco de coordenadas y orientación. Calcular contención, intersección, desplazamiento y ratio de solape. Un resultado `COHERENT` solo puede emitirse cuando la geometría cumple el umbral y existe evidencia suficiente.

#### Paso 3: Continuidad del núcleo

Registrar explícitamente escaleras, ascensores, ductos y rutas verticales. La continuidad de la masa no debe convertirse en una afirmación de continuidad del núcleo. Si el núcleo no tiene geometría y evidencia propia, su estado debe permanecer `UNKNOWN` o `INSUFFICIENT_EVIDENCE`.

#### Paso 4: Separación de flujos

Evaluar por separado:

```text
PUBLIC / FAMILY
EMERGENCY
CLINICAL
CLEAN
DIRTY / WASTE
STAFF
BED-DEPENDENT PATIENTS
```

Una conexión geométrica entre dos niveles no prueba que los flujos sean seguros ni que estén correctamente separados.

#### Paso 5: Accesibilidad

Comprobar rutas para personas ambulantes, sillas de ruedas, camillas, acompañantes y personal. Registrar ancho, pendiente, descansos, radios de giro, cambios de nivel y ascensores. El resultado debe ser `NOT_ASSESSED` mientras no exista evidencia geométrica y normativa suficiente.

#### Paso 6: Evacuación

Comprobar salidas redundantes, distancias de recorrido, sectores, ocupación, puertas, resistencia al fuego, señalización, alarma, humo y evacuación horizontal de pacientes dependientes de cama. El resultado no debe interpretarse como certificación.

#### Paso 7: Estructura

Comprobar que las cargas y apoyos de N2 estén respaldados por una hipótesis estructural explícita. La alineación vertical es una condición geométrica favorable, pero no es cálculo estructural.

#### Paso 8: Control de infecciones

Comprobar separación de circuitos limpios y sucios, áreas de aislamiento, flujos clínicos y soporte logístico. Esta validación necesita conocimiento hospitalario especializado y no puede derivarse únicamente de `A22`.

#### Paso 9: Revisión humana

Presentar los resultados como una matriz de hallazgos, evidencias, desconocidos y preguntas abiertas. La salida final debe requerir revisión de arquitectos, ingenieros, especialistas hospitalarios y autoridad competente.

### 5.3 Criterios de aceptación

La prueba hospitalaria puede considerarse técnicamente aprobada solo si:

| Criterio | Resultado mínimo |
|---|---|
| Identidad de niveles | `SUPPORTED` |
| Unidades y coordenadas | `SUPPORTED` |
| Orden vertical | `SUPPORTED` |
| Alineamiento de masas | `SUPPORTED` o `COHERENT_WITH_OBSERVATIONS` |
| Continuidad de núcleo | Evidencia explícita o `UNKNOWN` declarado |
| Rutas clínicas | Evaluadas separadamente |
| Ruta accesible | Evidencia y jurisdicción vinculadas |
| Evacuación | Análisis conceptual con unknowns visibles |
| Estructura | No inferida desde la geometría |
| Infecciones | Revisión especializada requerida |
| Certificación automática | Prohibida |
| Decisión automática | Prohibida |

## 6. Resultado y límites de la implementación

La casa hace utilizable la inteligencia existente porque reúne en un solo panel el juicio, la tipología, el programa, la coherencia multinivel, las facultades y los límites de verificación.

El hospital queda preparado como fixture de validación, no como proyecto certificado. La prueba demuestra cómo pasar de una lectura geométrica a una evaluación disciplinar sin mezclar evidencias ni elevar una hipótesis a hecho.

La separación entre conceptual y verificable queda definida así:

```text
CONCEPTUAL = intención, programa, estrategia, zona propuesta, hipótesis
VERIFICABLE = geometría explícita, métricas, relaciones observadas, provenance y pruebas reproducibles
CONSTRUCTIVO = coordinación profesional, normativa vigente, ingeniería y documentación de obra
```

ARQUI puede avanzar de la primera categoría hacia la segunda. La tercera requiere una ampliación futura específica y revisión profesional.

## Referencias

[1]: /tmp/sims-dei-canonical-web/docs/ARQUI-A18-ARCHITECTURAL-CAPABILITY-GAP-DIAGNOSIS.md "ARQUI A18 Architectural Capability Gap Diagnosis"
[2]: /tmp/sims-dei-canonical-web/docs/ARQUI-A21-IMPLEMENTATION-FINAL.md "ARQUI A21 Spatial Relationships and Design Memory"
[3]: /tmp/sims-dei-canonical-web/docs/ARQUI-A22-IMPLEMENTATION-FINAL.md "ARQUI A22 Vertical Coherence Implementation"
[4]: /tmp/sims-dei-canonical-web/docs/ARQUI-A27-WORLD-CLASS-ACCESSIBILITY-FIRE-HOSPITAL-FINAL.md "ARQUI A27 World-Class Accessibility Fire Hospital"
