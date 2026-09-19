# ARKI — Handoff maestro desde el inicio del proyecto

**Fecha de corte:** 19 de septiembre de 2026  
**Repositorio:** `YvanCastilloQuezada/sicl-web`  
**Rama:** `feat/spatial-pilot-media-studio-v1`  
**HEAD local y remoto:** `d03370eeec5bd033efc325a033807b791442984a`  
**Estado de worktree:** limpio  
**Autor del handoff:** Manus AI

## 1. Propósito del handoff

Este documento transfiere el estado acumulado de ARKI desde su origen conceptual hasta la implementación actual. Su objetivo es que otro equipo o agente pueda continuar el trabajo sin repetir investigaciones, romper contratos canónicos, confundir hipótesis con hechos o interpretar capacidades preparadas como capacidades profesionales ya certificadas.

La conclusión principal es la siguiente: **ARKI evolucionó de un generador espacial conceptual a una plataforma experimental de inteligencia arquitectónica con conocimiento funcional, razonamiento tipológico, generación espacial controlada, visualización 2D/3D, trazabilidad epistemológica, regulación versionada y documentación ejecutiva simulada**. Sin embargo, todavía no sustituye al arquitecto ni produce automáticamente documentación legal o constructiva aprobable.

> El estado real de ARKI es una combinación de capacidades implementadas, capacidades demostradas en fixtures sintéticos y capacidades preparadas para una realización posterior. `IMPLEMENTED` no equivale a `PROFESSIONALLY_CERTIFIED`.

## 2. Principios que gobiernan el sistema

ARKI conserva cinco principios transversales.

### 2.1 Autoridad humana

El sistema puede preparar, comparar, evaluar y explicar alternativas. No crea por sí mismo una decisión humana, una recomendación final, un ganador definitivo ni una aprobación profesional.

### 2.2 Integridad epistemológica

Las salidas generadas se clasifican como `HYPOTHESIS`, `PROPOSED`, `SYNTHETIC` o `DETERMINISTIC_DERIVED` según corresponda. Una hipótesis no se presenta como hecho. Una correlación computacional no se presenta como causalidad real. Una referencia bibliográfica no se presenta como normativa automáticamente aplicable.

### 2.3 Fuente única canónica

La arquitectura debe derivarse de una cadena común:

```text
INTENT
→ PROGRAM
→ ACTIVITIES
→ RELATIONSHIPS
→ PARTI
→ ZONING
→ TOPOLOGY
→ SPACES
→ BOUNDARIES
→ WALLS / OPENINGS / CORES
→ CANONICAL BUILDING MODEL
→ PLAN / SECTION / ELEVATION / 3D / EXPORTS
```

No se deben crear modelos de geometría paralelos para la misma arquitectura.

### 2.4 Reutilización antes que duplicación

Las ampliaciones deben extender los contratos existentes. No se deben crear un segundo motor generativo, un segundo motor de distancia, una segunda representación 3D ni un segundo sistema de conocimiento funcional.

### 2.5 Función antes que estética

La secuencia de evaluación adoptada es:

```text
FUNCIONAMIENTO
→ RELACIONES
→ CIRCULACIÓN
→ ZONIFICACIÓN
→ HABITABILIDAD
→ REGULACIÓN
→ GEOMETRÍA
→ MATERIALIDAD
→ ESTÉTICA
```

La belleza, la innovación formal y los perfiles `CRAZY` solo deben evaluarse después de resolver la organización funcional y la seguridad de la propuesta.

## 3. Evolución por etapas

### 3.1 Identidad y producto

Se consolidó ARKI dentro de SiMS-DeI como una capacidad de inteligencia arquitectónica. El producto se integró al shell común del sistema, con i18n en ocho idiomas, navegación unificada y preservación de la identidad visible de SiMS-DeI.

Se adoptaron las escalas espaciales desde objeto y espacio hasta país. La representación se adapta a la escala: 2D, 3D, GIS, CAD, BIM y medios pueden coexistir, pero no significan lo mismo.

### 3.2 Generación y diseño arquitectónico

Se implementaron los modos `JUNIOR`, `ARCHITECT`, `MASTER` y `CRAZY`, junto con gramática arquitectónica, gramática tipológica, parti causal, evaluación heurística, razonamiento de masa/void, relaciones verticales y crítica de diseño.

La generación dejó de tratarse como una lista de rectángulos. El sistema ahora puede conservar una intención arquitectónica, una estrategia de parti, una traza de conocimiento y una explicación de fortalezas, problemas y unknowns.

### 3.3 Modelo canónico y realización espacial

Se desarrolló el `CanonicalBuildingModel` y su autoría controlada. El modelo soporta, según el nivel de evidencia disponible:

- niveles y continuidad multinivel;
- masas y huellas;
- espacios y límites;
- muros y particiones;
- puertas y ventanas;
- patios y vacíos;
- galerías;
- escaleras y núcleos;
- reservas de ductos;
- rutas accesibles;
- relaciones espaciales;
- estado epistemológico y lineage.

Se agregaron espesores de muro, puertas principales e interiores, alturas de piso a techo, alturas de alféizar, continuidad de tragaluces y deduplicación de muros compartidos. Dos ambientes colindantes pueden compartir un solo muro físico canónico.

### 3.4 Visualización y representación

Se reutilizó el visor 3D existente basado en Three.js. El plan, la sección y el 3D deben derivar del mismo modelo canónico. Se añadieron etiquetas selectivas, leyendas de color, estados epistemológicos y diagnósticos de representación.

También se consolidaron:

- visor SVG de alternativas;
- plantas rotuladas por nivel;
- circulación explícita;
- simbología de muros, puertas, ventanas y ventanas altas;
- vistas axonométricas derivadas;
- GLB para visualización;
- DXF para intercambio de massing/footprint;
- IFC limitado a massing BIM;
- GeoJSON para representación territorial donde corresponde.

### 3.5 Interoperabilidad y límites de exportación

El sistema mantiene el lock `MASSING_ONLY` para IFC, DXF y GLB cuando la fuente no contiene información constructiva suficiente.

```text
MASS ≠ WALL
MASS ≠ SLAB
MASS ≠ STRUCTURAL MODEL
MASS ≠ CONSTRUCTION BIM
IFC EXPORT ≠ NATIVE REVIT MODEL
```

No se deben fabricar familias Revit, estructura, MEP, cantidades, detalles constructivos o documentación ejecutiva solo por exportar una masa.

### 3.6 Aprendizaje y Escuela ARKI

Se implementaron contratos de aprendizaje, currículo, fuentes, almacenamiento y recuperación de conocimiento, adquisición controlada, ejercicios, evaluación, corrección y transferencia.

La secuencia pedagógica implementada es:

```text
PRINCIPLE
→ EXPLANATION
→ PRACTICE
→ EVALUATION
→ CORRECTION
→ TRANSFER
→ INTEGRATED REVIEW
```

El ledger de adquisición conecta el conocimiento con programas, relaciones, topologías y evidencia de ejercicios. Se añadió el estado `PRACTICED_WITH_OBSERVATIONS` para no confundir práctica con dominio profesional.

### 3.7 Conocimiento arquitectónico

Se integraron o registraron familias de conocimiento relacionadas con:

- Edward T. White y conceptos de organización espacial;
- Francis D. K. Ching y forma, espacio y orden;
- Christopher Alexander y el Center for Environmental Structure como influencia reconocida, no como doctrina;
- Neufert como referencia funcional y dimensional;
- Plazola como referencia tipológica y de funcionamiento;
- RNE peruano como fuente regulatoria versionada;
- conocimiento ambiental, solar, viento y temperatura contextual.

Los conceptos de autores no se convierten automáticamente en requisitos. Se preservan las distinciones:

```text
INFLUENCE ≠ AUTHORITY
PATTERN ≠ REQUIREMENT
AUTHOR ≠ AGENT
REFERENCE ≠ COMPLIANCE
```

### 3.8 Tipologías y funcionamiento

Se construyó la biblioteca de perfiles funcionales. La última extensión operacionalizó las ocho tipologías registradas:

| Tipología | Estado del perfil operativo |
|---|---|
| Vivienda residencial | Implementado |
| Educación | Implementado |
| Salud | Implementado |
| Hotelería / comercio | Implementado |
| Oficinas / religiosos | Implementado |
| Industria / laboratorio / agricultura | Implementado |
| Deportes / cultura | Implementado |
| Transporte | Implementado |

Cada perfil puede expresar actores, actividades, sistemas, procesos, flujos, relaciones, interfaces, controles, capacidades, requisitos y fuentes. Estos programas siguen siendo funcionales y pre-geométricos. No equivalen a plantas profesionales completas.

### 3.9 Caso residencial de aprendizaje

Se trabajó una casa sintética con terreno de aproximadamente 300 m² y área techada aproximada de 200 m². El programa incluyó habitaciones, closets, baños, cocina, sala, comedor, garaje y terraza.

El caso se corrigió progresivamente para resolver:

- una sola fachada libre y tres vecinos;
- acceso frontal a la cochera;
- eliminación de puertas hacia medianeras;
- ubicación accesible de la escalera;
- patio de servicio con ancho funcional;
- patio/tragaluz alineado verticalmente;
- continuidad del ducto abierto hasta el último nivel;
- prohibición de ambientes sobre el ducto;
- muros de 0.15 m;
- puertas interiores de 0.90 m;
- accesos principales ampliados;
- luz y ventilación como restricciones explícitas;
- mobiliario y aparatos sanitarios como determinantes del tamaño de los ambientes;
- detección y eliminación de superficies residuales.

La casa fue utilizada como fixture de aprendizaje y diagnóstico, no como proyecto certificado.

### 3.10 Regulación y proyecto ejecutivo simulado

Se incorporó un perfil versionado de verificación del RNE peruano y su conexión con el orquestador de documentación. El estado `VERIFIED` requiere evidencia de fuente, aplicabilidad, proyecto, versión y revisión humana. No equivale por sí solo a aprobación municipal.

Se implementó `arkiPermitDocumentationOrchestrator` y un proyecto ejecutivo simulado con gates explícitos para:

- entradas faltantes;
- cumplimiento no demostrado;
- revisión profesional;
- firma profesional;
- presentación a autoridad;
- exportaciones con límites de madurez;
- separación entre material sintético y evidencia real.

El paquete simulado se clasifica como `SIMULATED_NOT_FOR_PERMIT` cuando faltan las condiciones profesionales reales.

### 3.11 Ingeniería y ambiente

Se prepararon capacidades de ingeniería multidisciplinaria, accesibilidad, evacuación, acústica, iluminación, confort, materiales, carbono y sostenibilidad, respetando el alcance autorizado de cada fase.

Se implementaron resultados ambientales existentes para:

- posición solar;
- radiación solar;
- sombras analíticas;
- viento contextual;
- temperatura ambiente contextual;
- reproducción temporal multivariable.

Se mantienen congelados, salvo autorización específica, los análisis de confort acoplado, CFD, energía, hidrología avanzada, humedad, simulación térmica completa y otros modelos físicos no implementados.

## 4. Capacidades implementadas actualmente

### 4.1 Diseño y razonamiento

ARKI puede:

- estructurar un problema arquitectónico;
- conservar intención y parti;
- generar alternativas conceptuales;
- evaluar heurísticas espaciales;
- comparar estrategias;
- criticar relaciones, circulación y coherencia;
- proponer modificaciones controladas;
- conservar lineage y razones de cambios;
- detectar unknowns y falsos éxitos;
- trabajar con coherencia multinivel;
- analizar masas, vacíos y continuidad vertical.

### 4.2 Espacios y geometría

ARKI puede representar y validar, dentro de los contratos actuales:

- ambientes y límites;
- contención;
- no solapamiento;
- áreas objetivo;
- adyacencias;
- puertas y conexiones;
- muros de cierre;
- circulación;
- escaleras;
- núcleos;
- ductos;
- patios y vacíos;
- rutas accesibles;
- mobiliario y use-fit;
- elementos verticalmente alineados.

### 4.3 Tipología funcional

ARKI puede construir un programa operativo común para todas las tipologías registradas. En educación puede construir además tres topologías pre-coordenadas distintas antes de generar geometría.

### 4.4 Evaluación

Se ejecutaron evaluaciones sintéticas y ciegas en múltiples fases. La validación reciente de tipologías obtuvo:

- 8 tipologías operacionalizadas;
- 3 topologías educativas;
- 2 evaluaciones independientes;
- 21 pruebas focalizadas aprobadas;
- 113 archivos de prueba aprobados en regresión;
- 879 pruebas aprobadas en regresión completa.

## 5. Estado epistemológico y profesional

La siguiente tabla resume la madurez correcta.

| Área | Estado real |
|---|---|
| Conocimiento funcional | Implementado como hipótesis trazable |
| Perfiles tipológicos | Implementados en contrato operativo |
| Zonificación educativa | Implementada antes de coordenadas |
| Topologías educativas | Propuestas y evaluadas |
| Generación espacial | Implementada en alcance controlado |
| Modelo canónico | Implementado y reutilizado |
| Plan/section/3D consistency | Implementada en alcance verificado |
| BIM constructivo nativo | No implementado |
| Revit nativo | No implementado |
| MEP automático | No implementado |
| Estructura automática | No implementado |
| Cumplimiento profesional automático | No implementado |
| Planos listos para licencia | No reclamado |
| Proyecto ejecutivo real | No reclamado |
| Proyecto ejecutivo simulado | Implementado con gates |
| Decisión humana automática | Prohibida |

## 6. Validación acumulada

El workspace actual tiene typecheck, pruebas focalizadas, regresión y build exitosos después de la última extensión tipológica.

```text
Typecheck                         PASS
Focused typology tests            21/21 PASS
Full regression                   113 test files PASS
Full regression tests              879 tests PASS
Production build                  PASS
Git diff check                    PASS
Worktree                          CLEAN
```

El último commit publicado es:

```text
d03370e feat(arki): operationalize typologies and pre-coordinate education
```

Los commits inmediatamente anteriores incluyen la operacionalización funcional, el gate RNE, la reorganización residencial, la biblioteca tipológica y las correcciones de circulación, muros, aberturas, tragaluces, símbolos y planos.

## 7. Organización de código y documentación

Los contratos principales se encuentran en:

- `client/src/components/arkiBuildingAuthoring.ts`: autoría y modelo canónico.
- `client/src/components/arkiConstructiveSpatialGeneration.ts`: realización espacial controlada.
- `client/src/components/arkiCanonicalFunctionalOperationalization.ts`: programa funcional canónico.
- `client/src/components/arkiTypologyFunctionalKnowledge.ts`: perfiles tipológicos.
- `client/src/components/arkiTypologyOperationalPrograms.ts`: operacionalización de todas las tipologías y topologías educativas.
- `client/src/components/arkiKnowledgeCurriculum.ts`: currículo de aprendizaje.
- `client/src/components/arkiLearningCycle.ts`: ciclo pedagógico.
- `client/src/components/arkiKnowledgeAcquisitionLedger.ts`: ledger de adquisición.
- `client/src/components/arkiNeufertResidentialZoning.ts`: zonificación residencial.
- `client/src/components/arkiNeufertResidentialCirculation.ts`: circulación y privacidad residencial.
- `client/src/components/arkiResidentialFixtureKnowledge.ts`: dimensiones funcionales de muebles y aparatos.
- `client/src/components/arkiFunctionalVoidAudit.ts`: detección de espacios residuales.
- `client/src/components/arkiArchitecturalPlanSymbols.ts`: simbología arquitectónica.
- `client/src/components/rnePeruCompliance.ts`: perfil y verificación RNE.
- `client/src/components/arkiPermitDocumentationOrchestrator.ts`: documentación de permisos.
- `client/src/components/arkiSimulatedExecutiveProject.ts`: proyecto ejecutivo simulado.
- `client/src/lib/spatialExport.ts`: exportaciones y límites de madurez.

Documentación de referencia interna:

- `docs/ARKI-FULL-CAPABILITY-REALITY-VERIFICATION-V1.md`.
- `docs/ARKI-CONSTRUCTION-DOCUMENTATION-PERMIT-ROADMAP-IMPLEMENTED.md`.
- `docs/ARKI-S1-CONSTRUCTIVE-SPATIAL-GENERATION-CLOSEOUT.md`.
- `docs/ARKI-RESEARCH-IMPLEMENTATION-HANDOFF-CLOSEOUT.md`.
- `docs/ARKI-PHASE-B-EDUCATION-AND-FLOW-TRANSFER.md`.
- `docs/ARKI-TYPOLOGY-OPERATIONALIZATION-PHASE-B-CLOSEOUT.md`.
- `docs/ARKI-DESIGN-GENIUS-CLOSEOUT.md`.
- `docs/ARKI-PROJECT-ORGANIGRAM.md`.

## 8. Lo que se aprendió realmente

ARKI aprendió, en el sentido de este sistema, a **representar y ejecutar contratos de conocimiento arquitectónico**. Aprendió que una tipología no se define solo por nombres de ambientes, sino por actores, actividades, flujos, relaciones, restricciones, secuencias y controles.

También aprendió que un principio puede transferirse entre tipologías solo si se explican las condiciones que permanecen, las condiciones que cambian y los casos en que el principio no aplica.

Aprendió a no tratar un vacío como un espacio válido sin función, a no tapar un ducto vertical, a no colocar ambientes sobre un tragaluz, a no inventar puertas hacia vecinos, a no duplicar muros compartidos y a no afirmar cumplimiento cuando faltan datos o revisión profesional.

En términos de diseño, la mejora más importante es el cambio de una generación directa de rectángulos hacia una secuencia funcional previa:

```text
TIPOLOGÍA
→ FUNCIONAMIENTO
→ RELACIONES
→ CIRCULACIÓN
→ ZONIFICACIÓN
→ TOPOLOGÍA
→ GEOMETRÍA
```

## 9. Brechas pendientes

Las brechas más importantes son las siguientes.

### 9.1 De topología a planta completa

La educación ya tiene zonificación y topologías pre-coordenadas, pero todavía falta convertir una topología seleccionada por el arquitecto en una planta espacial completa con áreas, límites, aperturas, muebles, rutas y comprobaciones específicas del proyecto.

### 9.2 De anteproyecto a documentación ejecutiva real

Faltan, para reclamar un proyecto listo para licencia:

- jurisdicción y versión normativa aplicable;
- topografía y levantamiento verificables;
- datos estructurales;
- instalaciones sanitarias y eléctricas;
- sistemas contra incendios;
- memoria de cálculo;
- detalles constructivos;
- cuantificación;
- coordinación interdisciplinaria;
- firma profesional;
- presentación y aceptación de autoridad.

### 9.3 De conocimiento registrado a aprendizaje generalizable

El conocimiento actual está implementado mediante contratos, perfiles, ejercicios y pruebas. No existe aprendizaje autónomo ilimitado ni actualización automática de pesos de un modelo. Toda nueva fuente debe pasar por extracción, atribución, aplicabilidad, práctica, evaluación, transferencia y revisión humana.

### 9.4 Simulación física avanzada

CFD, energía, confort térmico acoplado, hidrología avanzada y otros análisis físicos permanecen limitados o congelados según los locks vigentes.

### 9.5 Escalas urbanas y territoriales

Existe arquitectura multiescala e interoperabilidad GIS/CAD/BIM, pero la realización profesional urbana y territorial requiere fuentes georreferenciadas, datos locales, reglas de aplicabilidad y validación especializada.

## 10. Orden recomendado de continuidad

1. Seleccionar una de las tres topologías educativas con autoridad humana.
2. Transformarla en grafo espacial detallado.
3. Definir programa, áreas objetivo, accesos, patios, circulaciones y flujos.
4. Generar la planta desde el modelo canónico.
5. Validar habitabilidad, no solapamiento, iluminación, ventilación, accesibilidad y evacuación.
6. Revisar la relación entre planta, sección y 3D.
7. Solo después preparar documentación constructiva del alcance realmente modelado.
8. Mantener toda salida como `HYPOTHESIS` o `PROPOSED` hasta que exista evidencia y revisión profesional.

## 11. Reglas para el próximo agente

El próximo agente debe:

- revisar este handoff antes de modificar ARKI;
- leer los documentos de cierre de la fase que vaya a tocar;
- comprobar el HEAD y la rama antes de trabajar;
- reutilizar los módulos canónicos existentes;
- no repetir investigaciones ya registradas;
- no convertir fuentes bibliográficas en normativa universal;
- no inventar datos faltantes;
- no declarar una planta como constructiva si solo es conceptual;
- no generar decisiones automáticas;
- mantener `UNKNOWN` cuando falte evidencia;
- ejecutar pruebas focalizadas antes de regresión;
- no hacer push, merge o deploy sin autorización explícita.

## 12. Cierre de transferencia

ARKI está preparado para continuar desde un nivel funcional y tipológico más sólido que al inicio. El sistema ya puede razonar sobre el funcionamiento previo a la geometría y puede conservar la trazabilidad entre conocimiento, programa, topología y realización.

El próximo salto de calidad no consiste en añadir más nombres de ambientes. Consiste en demostrar que una topología seleccionada produce una planta que funciona: que los usuarios llegan, se orientan, circulan, usan los espacios, reciben luz y ventilación, mantienen privacidad, evacúan y operan el edificio sin conflictos. Esa demostración debe seguir siendo verificable, trazable y revisada por un arquitecto.

## References

[1]: ../docs/ARKI-FULL-CAPABILITY-REALITY-VERIFICATION-V1.md "ARKI full capability reality verification"

[2]: ../docs/ARKI-CONSTRUCTION-DOCUMENTATION-PERMIT-ROADMAP-IMPLEMENTED.md "ARKI construction documentation and permit roadmap"

[3]: ../docs/ARKI-RESEARCH-IMPLEMENTATION-HANDOFF-CLOSEOUT.md "ARKI research implementation handoff closeout"

[4]: ../docs/ARKI-TYPOLOGY-OPERATIONALIZATION-PHASE-B-CLOSEOUT.md "ARKI typology operationalization and education topology closeout"

[5]: https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne "Reglamento Nacional de Edificaciones — Ministerio de Vivienda del Perú"

[6]: https://www.nationalcadstandard.org/ncs6/content.php "National CAD Standard — drawing conventions and documentation"

[7]: https://www.iso.org/obp/ui/es/#!iso:std:65296:en "ISO 128 — general rules for technical drawings"

[8]: https://www.uceb.eu/DATA/CivBook/03.%20Architect_s%20Data.pdf "Architects' Data — public reference copy consulted for functional and dimensional study"

[9]: https://archive.org/details/arquitectura-habitacional-plazola-quinta-edicion-complementada-vol.-ii "Arquitectura Habitacional Plazola — public bibliographic record"
