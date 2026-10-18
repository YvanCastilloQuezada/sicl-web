# ARKI · Command Center

**URL:** https://4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer/help/user

---

Instala ARKI como WebApp

Acceso rápido y una experiencia local preparada para conectividad intermitente.

Instalar
SICL
⌘K
MODO DE ACCESO DIRECTO TEMPORAL · autenticación real conservada en el backend
ARKI
· by SICL

Sistema de Inteligencia de Diseño Espacial Multiescala

Idioma
Español
English
Português
Italiano
Français
Deutsch
Русский
中文
Idioma: Español
Control Center
Ayuda
AR
Sistema
Claro
Oscuro
Proyecto
ZGQ-RLI-137-118
· versión
v1
Navegación
Idioma
Español
English
Português
Italiano
Français
Deutsch
Русский
中文
Idioma: Español
Proyecto
Contexto / Sitio
Objetivos y restricciones
Alternativas y evaluación
Evidencia
Evaluaciones
Comparaciones
Consejo / Recomendación
Decisión y auditoría
ARKI · Libro Vivo
ARKI · Parametric Files
ARKI · Escuela Operativa
ARKI · Parametric Runtime
ARKI · Generador Paramétrico
ARKI · Field Mode
ARKI · Control Center
ARKI · Security Events
A

ARKI Direct Access

direct-access@arki.local

Volver al índice
Descargar PDF
Manual de Usuario de ARKI y SICL

Sistema: ARKI — Sistema de Inteligencia de Diseño Espacial Multiescala Lenguaje formal: SICL — Spatial Intelligence Command Language Versión documental: 2.2 Audiencia: arquitectos, urbanistas, analistas y responsables de proyecto

1. Introducción
1.1 Qué es ARKI

ARKI es un sistema para organizar, documentar y analizar decisiones de diseño espacial en múltiples escalas. Puede trabajar con un edificacion, una parcela, un barrio, una ciudad, una región o un país cuando la escala se declara de forma explícita.

El sistema conserva el contexto del proyecto, registra fuentes y evidencia, separa hechos de supuestos, ejecuta análisis reproducibles y deja una trazabilidad de las operaciones realizadas.

ARKI está pensado para apoyar conversaciones profesionales. No sustituye el criterio del arquitecto, la revisión normativa profesional ni la responsabilidad de quien adopta una decisión.

1.2 Qué es SICL

SICL es el lenguaje formal que permite operar sobre el Core de ARKI. Sus comandos representan operaciones como crear un proyecto, registrar un hecho, definir un objetivo, evaluar una alternativa o registrar una decisión humana.

SICL puede utilizarse mediante el intérprete CLI o mediante la API REST canónica /v1. Ambas superficies deben respetar las mismas reglas del dominio.

Para la sintaxis exacta de cada comando, ver COMMANDS_REFERENCE.md. Esta referencia es la fuente canónica y se mantiene alineada con src/sicl/cli.py.

1.3 Qué hace el sistema

El sistema registra proyectos y entidades, conecta información entre escalas, conserva evidencia, calcula evaluaciones, compara alternativas, ejecuta simulaciones declaradas, obtiene resultados multiobjetivo y prepara información para revisión humana.

También puede consultar inteligencia de sitio, ejecutar agentes expertos que producen evaluaciones y generar resultados descriptivos de Pareto o trade-offs.

1.4 Qué no hace

El sistema no toma decisiones humanas automáticamente. No convierte una recomendación en una decisión. No convierte una suposición en un hecho sin evidencia nueva y evento auditable.

El sistema no constituye certificación legal. Un corpus normativo real, GIS, BIM, Digital Twin, IoT, Project DNA, requisitos formales y agentes con autoridad no forman parte de este alcance documental.

2. Filosofía de uso
2.1 Recommendation no es Decision

Una Recommendation es una salida analítica o una propuesta derivada de comparaciones. Una Decision es un registro humano explícito que incluye actor, autoridad y la revisión humana requerida.

El flujo correcto es: analizar, comparar, recomendar, revisar y decidir. No se debe presentar una recomendación como si ya fuera una decisión adoptada.

2.2 La autoridad humana se preserva

El sistema puede señalar alternativas, explicar conflictos y mostrar resultados. La persona autorizada decide si acepta, rechaza o posterga una propuesta.

Antes de registrar una Decision, debe existir un HumanReview aprobado. El actor y la autoridad utilizados en la decisión deben ser explícitos.

2.3 La trazabilidad es parte del resultado

Cada mutación relevante produce un evento con actor y source. El historial permite reconstruir qué ocurrió, cuándo ocurrió y quién lo produjo.

La ausencia de una fuente debe permanecer visible. Una explicación sin evidencia debe identificarse como insuficiente, desconocida o conflictiva según corresponda.

3. Primeros pasos
3.1 Preparar el entorno

Para utilizar el CLI, instale las dependencias del proyecto y ejecute el intérprete desde la raíz del repositorio. La variable PYTHONPATH=.:src permite resolver el paquete local.

Para utilizar la API, ejecute FastAPI con el comando definido por el despliegue. En producción, el servicio debe proteger las rutas con el token server-side configurado por el operador.

3.2 Crear un proyecto
PRO-CRE UPAO-001 "UPAO Plaza Center"
PRO-OPE UPAO-001
PRO-SHO


El identificador debe ser estable y legible. El nombre describe el caso. Después de abrir un proyecto, los comandos siguientes se ejecutan en su contexto.

3.3 Definir escala

Declare una escala espacial cuando sea conocida. No deje que el sistema la infiera.

PRO-SET parcela_sitio proyecto


Las nueve escalas disponibles son pais, region, provincia_metropoli, distrito_ciudad, zona_barrio_sector, parcela_sitio, edificacion, espacio y objeto.

3.4 Definir objetivos
OBJ-SET ENERGY_SAVINGS MAXIMIZE 80
OBJ-SET CONSTRUCTION_COST MINIMIZE 60 USD_M2


El objetivo debe indicar una clave, una dirección y un valor. La dirección puede ser MAXIMIZE o MINIMIZE según el objetivo.

3.5 Registrar evidencia

La evidencia debe indicar qué se afirma, qué tipo de evidencia se utiliza y de qué fuente proviene.

EVI-ADD E-001 "El sitio se encuentra en Trujillo" OBSERVATION
EVI-LIS
EVI-SHO E-001


Una evidencia no se convierte automáticamente en hecho o suposición. El usuario debe realizar la clasificación correspondiente.

4. Flujo completo de uso
4.1 Contexto y sitio

Comience creando el proyecto, abriéndolo y declarando su escala. Si dispone de una ubicación, utilice Site Intelligence para obtener observaciones descriptivas.

SIT-INT "Trujillo, Peru"


Las observaciones deben conservar fuente, estado y trazabilidad. Site Intelligence no debe producir obligaciones normativas automáticas.

4.2 Fuentes y evidencia

Registre las fuentes antes de registrar evidencia que dependa de ellas. Compruebe que cada evidencia tenga una procedencia suficiente para el uso previsto.

Si dos fuentes difieren, conserve el estado CONFLICTING y no elija silenciosamente una de ellas.

4.3 Hechos y supuestos

Un hecho representa información verificada dentro del contexto del proyecto. Un supuesto representa una premisa de trabajo que aún requiere confirmación.

FAC-SET SITE_AREA=2000 CATASTRO
ASS-SET OCCUPANCY=80% ESTIMACION


No utilice una Assumption para ocultar la falta de un Fact. Tampoco cambie una Assumption a Fact sin nueva evidencia verificable y evento auditable.

4.4 Objetivos

Defina los objetivos antes de comparar alternativas. Los objetivos establecen qué se quiere maximizar, minimizar o alcanzar.

Revise que los valores y unidades sean comparables. Si un objetivo no tiene dirección o valor suficiente, el resultado analítico puede ser INSUFFICIENT.

4.5 Restricciones y requisitos
CON-SET HEIGHT <= 6 FLOORS
CON-SET BUDGET <= 500000 USD


En el alcance vigente, las constraints son HARD. Una constraint dura debe cumplirse para que una alternativa sea admisible.

Los requisitos formales completos permanecen fuera del alcance actual. No confunda una constraint con una interpretación jurídica.

4.6 Preferencias

Una Preference expresa una prioridad de un actor. Registre quién la formula y manténgala separada de los hechos y objetivos.

Las preferencias pueden influir en una comparación, pero no sustituyen las constraints ni generan una decisión automática.

4.7 Alternativas
/ALTERNATIVE CREATE CONVENCIONAL_A
/ALTERNATIVE SET CONVENCIONAL_A FLOORS 4
/ALTERNATIVE SET CONVENCIONAL_A AREA 2000
/ALTERNATIVE SET CONVENCIONAL_A FLOORS 6
/ALTERNATIVE SET CONVENCIONAL_A STRUCTURE "Mampostería"
/ALTERNATIVE LIST


Una alternativa es una opción de diseño que puede evaluarse. No es una decisión. Puede ser creada por una persona o generada mediante el motor determinista, pero debe pasar por revisión humana para convertirse en la opción elegida.

4.8 Evaluaciones
/EVALUATE CONVENCIONAL_A ENERGY_SAVINGS 72 PERCENT HIGH EXPERT_SYSTEM


Una evaluación expresa el valor observado o calculado de una alternativa respecto de un objetivo. Incluya unidad, confianza y source cuando estén disponibles.

Los agentes expertos solo producen Evaluation. No deciden.

4.9 Comparaciones
/COMPARE CONVENCIONAL_A BIOCLIMATICA_B


Una comparación reúne alternativas y sus evaluaciones para mostrar diferencias y trade-offs. Revise los valores faltantes antes de interpretar el resultado.

4.10 Simulaciones

Consulte primero los métodos disponibles.

/SIMULATE METHODS
/SIMULATE RUN SENSITIVITY BASELINE
/SIMULATE RUN MONTE_CARLO monte_carlo_v1 {"alternative_id":"ALT-...","objective_id":"OBJ-...","parameter_name":"height","parameter_distribution":{"type":"NORMAL","parameters":{"mean":10,"std_dev":1}},"iterations":1000,"seed":20260916}
/SIMULATE LIST
/SIMULATE SHOW <simulation_id>


Una simulación produce un resultado descriptivo. No crea una Decision. El método utilizado y sus parámetros deben quedar identificables. monte_carlo_v1 acepta distribuciones NORMAL, UNIFORM y TRIANGULAR, conserva la semilla y limita las ejecuciones a 10 000 iteraciones. Repetir los mismos inputs y la misma semilla permite reproducir los resultados; cambiar la semilla produce otra ejecución.

4.11 Multiobjective
PAR-ETO ENERGY_SAVINGS CONSTRUCTION_COST
MUL-TIO PARETO ENERGY_SAVINGS CONSTRUCTION_COST
MUL-TIO TRADEOFFS ENERGY_SAVINGS CONSTRUCTION_COST
MUL-TIO LIST


El frente de Pareto muestra opciones no dominadas con respecto a objetivos declarados. Un trade-off hace visible que mejorar un objetivo puede empeorar otro.

El resultado multiobjetivo es analítico. No indica por sí mismo qué alternativa debe escoger el arquitecto.

4.12 Recomendaciones
/RECOMMEND


Una recomendación resume una salida analítica. Debe conservar la separación respecto de Decision y debe poder ser revisada por una persona.

4.13 HumanReview
HUM-REV architect-yvan 2026-09-16T07:00:00Z "Revisé las evaluaciones y el trade-off" "Validación arquitectónica" BOARD


La revisión humana declara que un actor examinó el material relevante. Debe incluir actor, autoridad y una razón suficiente.

4.14 Decision
DEC-REC "Seleccionar CONVENCIONAL_A" A-DEC BOARD


La Decision debe registrarse después de HumanReview. Si falta la revisión, el actor o la autoridad, la operación debe rechazarse.

4.15 Audit
HIS-TOR
STA-TUS


Audit se obtiene de los eventos, snapshots y resultados trazables. El historial debe mostrar las mutaciones en orden temporal.

5. Comandos CLI
5.1 Proyecto y estado
PRO-CRE <project_id> <name> [spatial_scope] [temporal_scope]
PRO-OPE <project_id>
PRO-SET <spatial_scope> [temporal_scope]
PRO-IMP <source_project_id> <objective_id>
PRO-SHO
PRO-LIS
STA-SET <stage>
STA-TUS
HIS-TOR
/HELP
EXI-IT

5.2 Conocimiento y decisión
OBJ-SET <key> <direction> <value>
CON-SET <key> <operator> <value> [unit]
ROL-ADD <name> <actor>
FAC-SET <statement> [source]
ASS-SET <statement> [basis]
EVI-ADD <id> <statement> <type> [source_id] [url]
EVI-LIS
EVI-SHO <id>
HUM-REV <actor> <timestamp_utc> "<review>" "<reason>" [authority]
DEC-REC <statement> <actor> <authority>

5.3 Alternativas y análisis
/ALTERNATIVE CREATE <name>
/ALTERNATIVE SET <alternative> <key> <value>
/ALTERNATIVE LIST
/EVALUATE <alternative> <objective> <value> [unit] [confidence] [source]
/COMPARE <alternative> <alternative> [...]
/RECOMMEND
AGE-RUN <agent> <alternative>
DEB-ATE <alternative>
SIT-INT <location>
GEN-ERA <alternative> <objective_1> <objective_2>
PAR-ETO <objective_1> <objective_2>
TRA-DEO <objective_1> <objective_2>

5.4 Simulation, diseño y multiescala
/SIMULATE RUN <simulation_type> <method> [params]
/SIMULATE LIST
/SIMULATE SHOW <simulation_id>
/SIMULATE METHODS
/DESIGN PRINCIPLES
/DESIGN PRINCIPLE <principle_id>
SCA-PAR <scope>
SCA-CHI <scope>
SCA-RLT <parent_project_id> <child_project_id> <relation_type> [description]
SCA-RLS <project_id>

5.5 Planificación y regulación
PLA-ADD <id> <type> <name> [jurisdiction] [url]
PLA-LIS
PLA-SHO <id>
PLA-TYP
REG-ADD <id> <code> <title> [jurisdiction] [source_url]
REG-LIS
REG-SHO <id>
REG-STA <id> <status>
INT-ADD <id> <regulation_id> <article> <text>
INT-LIS [regulation_id]
INT-REV <id> <actor> <authority>
SNA-CRE <id> <project_id> <cut_date>
SNA-LIS <project_id>
SNA-FRE <id> <reviewer>

5.6 Ciclos y escenarios
CYC-CRE <cycle_id> <horizon> <start_date>
CYC-LIS
CYC-SHO <cycle_id>
SCE-CRE <branch_id> <parent_cycle_id> <name>
SCE-LIS
SCE-SEL <branch_id> <actor> <authority>


Los horizontes de ciclo son 2030, 2040, 2050 o CUSTOM. La selección de escenario exige actor activo y HumanReview aprobado.

Sources: HTTP-only

/SOURCE ADD, /SOURCE LIST y /SOURCE SHOW no son comandos del CLI local. Para operar Source use la API canónica:

POST /v1/projects/{project_id}/sources
GET  /v1/projects/{project_id}/sources
GET  /v1/projects/{project_id}/sources/{source_id}

6. Endpoints REST
6.1 Envelope y autenticación

Las respuestas /v1 utilizan un envelope canónico que incluye versión de contrato, estado, código, mensaje, proyecto, versión observada y datos.

{
  "contract_version": "1.0",
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "project_id": "UPAO-001",
  "observed_version": 1,
  "data": {}
}


Cuando el servicio lo requiera, envíe el token solamente desde un servidor autorizado.

curl -H "Authorization: Bearer $SICL_CORE_SERVICE_TOKEN" \
  https://core.example/v1/health

6.2 Salud, catálogos y escalas
GET /v1/health
GET /v1/operations-research/methods
GET /v1/simulations/methods
GET /v1/design/principles
GET /v1/design/principles/{principle_id}
GET /v1/scales
GET /v1/scales/{scope}/parent
GET /v1/scales/{scope}/children

6.3 Proyectos y operación
GET  /v1/projects
POST /v1/projects
GET  /v1/projects/{project_id}/snapshot
GET  /v1/projects/{project_id}/history
POST /v1/projects/{project_id}/commands
POST /v1/projects/{project_id}/preferences
POST /v1/projects/{project_id}/human-reviews
POST /v1/projects/{project_id}/decisions
POST /v1/projects/{project_id}/recommendations
GET  /v1/projects/{project_id}/council


Ejemplo de creación:

curl -X POST https://core.example/v1/projects \
  -H 'Content-Type: application/json' \
  -d '{"project_id":"UPAO-001","name":"UPAO Plaza Center"}'

6.4 Evidencia, evaluación y comparación
POST /v1/projects/{project_id}/evidence
GET  /v1/projects/{project_id}/evidence
GET  /v1/projects/{project_id}/evidence/{evidence_id}
POST /v1/projects/{project_id}/sources
GET  /v1/projects/{project_id}/sources
GET  /v1/projects/{project_id}/sources/{source_id}
POST /v1/projects/{project_id}/evaluations
GET  /v1/projects/{project_id}/evaluations
POST /v1/projects/{project_id}/comparisons
GET  /v1/projects/{project_id}/comparisons

6.5 Site Intelligence, agentes y multiobjetivo
POST /v1/projects/{project_id}/site-observations
POST /v1/projects/{project_id}/agents/{agent}/evaluations
POST /v1/projects/{project_id}/pareto
POST /v1/projects/{project_id}/debate
POST /v1/projects/{project_id}/simulations
GET  /v1/projects/{project_id}/simulations
GET  /v1/projects/{project_id}/simulations/{simulation_id}
POST /v1/projects/{project_id}/multiobjective/pareto
POST /v1/projects/{project_id}/multiobjective/tradeoffs
GET  /v1/projects/{project_id}/multiobjective
GET  /v1/projects/{project_id}/multiobjective/{id}

6.6 Planning, regulación y escalas
GET  /v1/planning/instruments
GET  /v1/planning/instruments/{id}
GET  /v1/planning/types
POST /v1/projects/{project_id}/planning/instruments
GET  /v1/projects/{project_id}/planning/instruments
POST /v1/projects/{project_id}/scale-relations
GET  /v1/projects/{project_id}/scale-relations
POST /v1/projects/{project_id}/import-objective
POST /v1/regulations
GET  /v1/regulations
GET  /v1/regulations/{id}
POST /v1/regulations/{id}/status
POST /v1/regulations/{id}/interpretations
GET  /v1/regulations/{id}/interpretations
POST /v1/interpretations/{id}/review
POST /v1/projects/{project_id}/normative-snapshots
GET  /v1/projects/{project_id}/normative-snapshots
POST /v1/normative-snapshots/{id}/freeze

6.7 Ciclos y escenarios
POST /v1/projects/{project_id}/cycles
GET  /v1/projects/{project_id}/cycles
GET  /v1/projects/{project_id}/cycles/{cycle_id}
POST /v1/projects/{project_id}/scenarios
GET  /v1/projects/{project_id}/scenarios
POST /v1/projects/{project_id}/scenarios/{branch_id}/select

6.8 Memoria institucional, actores y copilot

La memoria institucional se extrae de proyectos cerrados y se conserva como una proyección anonimizada. Su aplicación requiere actor y autoridad. Los actores y sus posiciones hacen explícitos los niveles de autoridad y no sustituyen HumanReview ni Decision.

GET  /v1/memory
GET  /v1/memory/{memory_id}
GET  /v1/memory/types
POST /v1/memory/extract
POST /v1/memory/{memory_id}/revoke
POST /v1/projects/{project_id}/memory/apply
POST /v1/projects/{project_id}/actors
GET  /v1/projects/{project_id}/actors
GET  /v1/projects/{project_id}/actors/{actor_id}
POST /v1/projects/{project_id}/positions
GET  /v1/projects/{project_id}/positions
GET  /v1/projects/{project_id}/positions/{position_id}


El User Copilot es una capacidad de asistencia, no una autoridad. Puede explicar, traducir lenguaje natural a comandos propuestos y señalar datos faltantes. No ejecuta comandos sin confirmación, no afirma sin fuente, no crea decisiones y no convierte recomendaciones en decisiones. La integración LLM de RFC-014 permanece definida como contrato y no debe interpretarse como una autorización para usar un modelo no configurado.

7. Capacidades incorporadas en ARKI 2.1 y 2.2
7.1 Generación de diseño

GeneratedAlternative conserva candidatos generados por métodos declarados. La generación paramétrica y por patrones producen propuestas; no producen una Alternative formal hasta que una persona las promueve con actor y autoridad. La generación no recomienda ni decide.

GEN-DES <method> <json_inputs>
GEN-LIS
GEN-SHO <generation_id>
GEN-MET
ALT-PRO <generation_id> <candidate_index> <actor> <authority>

7.2 Memoria institucional

InstitutionalMemory resume patrones o lecciones de proyectos cerrados. Se extrae con revisión humana, se anonimiza por defecto, puede revocarse y no se autoaplica. Aplicarla registra la intención de uso sin reescribir los hechos, eventos o decisiones del proyecto destino.

7.3 Modelo multi-actor

Actor expresa identidad, rol, autoridad, intereses y restricciones. ActorPosition registra apoyo, oposición, neutralidad o condiciones respecto de una alternativa, recomendación, generación o decisión propuesta. Una posición no equivale a una decisión y un desacuerdo no se resuelve automáticamente.

7.4 Ciclos temporales y escenarios

TemporalCycle organiza horizontes 2030, 2040, 2050 o CUSTOM. ScenarioBranch conserva ramas alternativas sin sobrescribir otras ramas. Seleccionar una rama exige actor activo y HumanReview aprobado. Ningún ciclo modifica decisiones históricas.

7.5 Source HTTP

Una Source identifica el origen de una evidencia u observación. Puede crearse y consultarse mediante /v1; source_id debe ser único dentro del proyecto y source_type debe ser OFFICIAL, SECONDARY, USER_PROVIDED o UNKNOWN. Crear una fuente no verifica automáticamente su contenido ni convierte la evidencia asociada en un Fact.

7.6 Frontend v2

El frontend v2 es una interfaz operativa para trabajar con las entidades del Core. Su prioridad es la funcionalidad: crear proyectos, registrar contexto, operar alternativas, evaluar, comparar, revisar, decidir y consultar trazabilidad. La interfaz no amplía la autoridad del Core. La autenticación y el token de servicio permanecen server-side; el navegador no debe recibir secretos.

El frontend presenta claramente los estados epistemológicos y mantiene separados Recommendation, HumanReview y Decision. Si una capacidad no está disponible en el contrato HTTP, debe mostrarse como no disponible y no sustituirse silenciosamente por un fallback local en producción.

8. Estados de conocimiento
UNKNOWN

UNKNOWN significa que no existe información suficiente para afirmar el valor. No significa que el valor sea falso.

CONFLICTING

CONFLICTING significa que existen fuentes o registros incompatibles. El usuario debe revisar el conflicto antes de usar el dato para una decisión.

INSUFFICIENT

INSUFFICIENT significa que hay información relacionada, pero no alcanza para realizar la operación o el análisis solicitado.

OBSERVED

OBSERVED significa que existe una observación registrada con fuente y trazabilidad. No implica por sí sola una interpretación normativa.

Cómo interpretar los estados

Los estados deben aparecer explícitamente en snapshots, respuestas y explicaciones. Nunca deben reemplazarse por texto ambiguo como “parece correcto”. Si el estado impide el análisis, complete la evidencia o solicite revisión humana.

9. Escalas

ARKI utiliza nueve escalas espaciales:

pais — país.
region — región.
provincia_metropoli — provincia o metrópoli.
distrito_ciudad — ciudad o distrito.
zona_barrio_sector — barrio o sector.
parcela_sitio — parcela o sitio.
edificacion — edificacion.
espacio — espacio.
objeto — objeto.

Una relación CONTAINS conecta un ámbito mayor con uno menor cuando ambos scopes son válidos. OVERLAPS, INFLUENCES y DEPENDS_ON son relaciones declaradas.

Las relaciones no se infieren automáticamente. El usuario debe declarar los proyectos y la relación. La importación de objetivos conserva la referencia al objetivo padre.

10. Caso de uso UPAO-001

UPAO-001 es un caso sintético para demostrar el flujo completo. Puede representar un proyecto en Trujillo con un área de 2000 m² y FAR 5.0.

Paso 1 — Crear
PRO-CRE UPAO-001 "UPAO Plaza Center"
PRO-OPE UPAO-001
PRO-SET parcela_sitio proyecto

Paso 2 — Registrar contexto
FAC-SET SITE_AREA=2000 CATASTRO
FAC-SET FAR=5.0 CATASTRO
ASS-SET OCCUPANCY=80% ESTIMACION

Paso 3 — Definir objetivos y constraints
OBJ-SET ENERGY_SAVINGS MAXIMIZE 80
OBJ-SET CONSTRUCTION_COST MINIMIZE 60
CON-SET HEIGHT <= 6 FLOORS

Paso 4 — Crear alternativas y evaluar
/ALTERNATIVE CREATE CONVENCIONAL_A
/ALTERNATIVE SET CONVENCIONAL_A FLOORS 4
/ALTERNATIVE SET CONVENCIONAL_A AREA 2000
/ALTERNATIVE CREATE BIOCLIMATICA_B
/ALTERNATIVE SET BIOCLIMATICA_B FLOORS 4
/ALTERNATIVE SET BIOCLIMATICA_B AREA 2000
/EVALUATE CONVENCIONAL_A ENERGY_SAVINGS 60 PERCENT HIGH EXPERT_SYSTEM
/EVALUATE BIOCLIMATICA_B ENERGY_SAVINGS 78 PERCENT HIGH EXPERT_SYSTEM
/COMPARE CONVENCIONAL_A BIOCLIMATICA_B
/RECOMMEND

Paso 5 — Revisar y decidir
HUM-REV architect-yvan 2026-09-16T07:00:00Z "Revisé la comparación y la recomendación" "Validación arquitectónica" BOARD
DEC-REC "Seleccionar BIOCLIMATICA_B" A-DEC BOARD
HIS-TOR


El resultado correcto muestra Recommendation y Decision como registros diferentes. La Decision tiene actor, autoridad y HumanReview previo.

11. Errores comunes
PROJECT_NOT_FOUND

El proyecto no existe o no está abierto. Verifique el identificador y ejecute PRO-OPE.

INVALID_ARGUMENT

El comando no contiene la cantidad o el formato de argumentos requeridos. Consulte /HELP y revise unidades, fechas y nombres.

UNKNOWN o INSUFFICIENT

El sistema no tiene información suficiente. Registre la fuente o evidencia faltante; no invente el valor.

CONFLICTING

Hay valores incompatibles. Mantenga el conflicto visible y solicite revisión.

HUMAN_REVIEW_REQUIRED

La operación requiere una revisión humana aprobada antes de continuar.

ACTOR_REQUIRED o AUTHORITY_REQUIRED

Falta un actor identificable o una autoridad válida. No use un nombre genérico para ocultar la ausencia.

CLOSED_PROJECT

El proyecto está cerrado y no acepta mutaciones. Abra un nuevo ciclo o proyecto conforme a la gobernanza.

APPEND_ONLY_VIOLATION

Se intentó modificar o eliminar un registro histórico protegido. Los eventos y entidades históricas deben conservarse.

CORS o UNAUTHORIZED

La API rechazó el origen o el token. Revise la configuración server-side y nunca copie secretos al navegador.

12. Preguntas frecuentes
¿El sistema decide por mí?

No. El sistema analiza y registra. La Decision requiere autoridad humana explícita.

¿Puedo tratar una recomendación como una decisión?

No. Son entidades diferentes y deben mostrarse separadas.

¿Qué hago si no conozco un dato?

Regístrelo como desconocido o deje constancia de que la información es insuficiente. No lo convierta en Fact por conveniencia.

¿Qué hago si dos fuentes discrepan?

Conserve el estado CONFLICTING, cite ambas fuentes y solicite revisión.

¿Los agentes pueden decidir?

No. Los agentes producen evaluaciones. El usuario revisa sus resultados.

¿Site Intelligence interpreta la normativa?

No automáticamente. Una observación del sitio no es una obligación normativa.

¿Las simulaciones prueban que una opción es correcta?

No. Las simulaciones son resultados descriptivos basados en un método y unos parámetros declarados.

¿Qué significa un frente de Pareto?

Es el conjunto de alternativas no dominadas respecto de objetivos definidos. No es una orden de selección.

¿Puedo modificar un evento histórico?

No. El event log es append-only. Las correcciones deben producir nuevos eventos trazables.

¿Los tokens pueden estar en el frontend?

No. Los secretos de servicio deben permanecer server-side.

¿Qué es una escala temporal?

Es el horizonte de trabajo asociado con un ciclo o proyecto. Los ciclos 2030, 2040, 2050 y CUSTOM no reescriben decisiones pasadas.

¿Quién puede usar el manual?

Cualquier persona que necesite comprender el sistema, pero las operaciones decisionales requieren el actor y la autoridad correspondientes.

13. Referencias
Estado vigente de capacidades — actualización 2026-09-16

Esta sección supersede las afirmaciones históricas de este documento que indiquen que GIS, BIM o el Copiloto local están fuera de alcance. El baseline vigente incluye RFC-027, RFC-028 y RFC-029.

El Core actual incluye importación IFC física de solo lectura, snapshots BIM persistentes, BIMChangeSet en modo PREVIEW, detección de conflictos BIM, contratos de exportación que exigen HumanReview, persistencia SQLite de ParcelSnapshot, catálogo GIS por jurisdicción, caducidad y ParcelBoundaryConflict, consulta OGC API Features y traducción Ollama a comandos SICL en modo PREVIEW_ONLY.

Estas capacidades no otorgan autoridad automática. El Copiloto no ejecuta comandos ni crea decisiones. Los adaptadores Revit y Archicad requieren sus hosts y SDKs nativos. La exportación BIM queda pendiente de ejecución externa después de una HumanReview aprobada. Las fuentes catastrales requieren registro explícito, licencia y validación humana.

La referencia operativa es PRODUCTION_CORE_DEPLOYMENT_MANUAL.md. La suite E2E se ejecuta con PYTHONPATH=.:src pytest -q tests/test_e2e_ollama_sicl.py -ra.

MANUAL DE USUARIO

Selecciona otro manual o usa los encabezados como guía.

Manual de Usuario
Manual Operativo
Referencia de Comandos