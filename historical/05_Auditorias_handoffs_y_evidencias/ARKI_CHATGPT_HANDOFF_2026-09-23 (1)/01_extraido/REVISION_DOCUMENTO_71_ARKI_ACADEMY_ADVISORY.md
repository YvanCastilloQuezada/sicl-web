# Revisión del Documento 71 — ARKI Academy & Advisory Charter

**Fecha:** 23 de septiembre de 2026  
**Documento revisado:** propuesta de incorporación de Asesor junto a Tutor, Examiner y Oracle.

## Veredicto

**APPROVE WITH FIXES — como decisión de gobernanza y propuesta estratégica.**

El Documento 71 mejora de forma importante el Documento 69 porque distingue dos trabajos que no deben confundirse:

- **Tutor:** desarrolla la competencia de ARKI.
- **Asesor:** ayuda al Director/Product Owner a decidir cómo evolucionar el producto.

La separación es compatible con la regla **One ARKI**. Tutor, Examiner, Oracle y Asesor deben tratarse como funciones gobernadas del sistema y del proceso de trabajo, no como nuevos agentes arquitectos que compitan con ARKI.

## Lo que queda aprobado

### 1. Human Authority

El Product Owner conserva la decisión final sobre visión, prioridades, alcance, promoción de capacidades, aceptación de entregas y apertura de nuevas fases.

El Asesor puede recomendar, objetar y decir **NO**, pero no puede aprobar por sí mismo una decisión, una capacidad profesional, un cierre contractual ni una promoción de estado.

### 2. Función Tutor

El Tutor puede:

- revisar el currículo;
- identificar déficits;
- estructurar materias;
- seleccionar fuentes autorizadas;
- preparar ejercicios;
- diseñar rutas de aprendizaje;
- corregir déficits de conocimiento;
- proponer conocimiento candidato para ARKI.

No puede promover por sí solo ese conocimiento al Core, Brain o Computational Fabric.

### 3. Función Asesor

El Asesor puede revisar:

- arquitectura Core/Brain/Fabric;
- duplicación de motores y entidades;
- deuda técnica;
- coherencia entre contrato y código;
- suficiencia de evidencia;
- diferencia entre representación visual y capacidad BIM real;
- estado de aprendizaje frente a simple generación verbal;
- prioridad y secuencia de entregas;
- riesgos de alcance y gobernanza.

El Asesor debe expresar siempre la base de su recomendación: evidencia observada, riesgo, impacto, alternativas y decisión sugerida.

### 4. Examiner y Oracle

La separación Tutor → Examiner → Oracle es correcta. El Tutor no puede ser el único juez del conocimiento que él mismo enseñó.

El Oracle debe ser independiente del texto producido por ARKI. Debe basarse en casos de referencia versionados, soluciones verificadas, tolerancias y, cuando corresponda, solvers o revisión profesional independiente.

## Correcciones necesarias antes de convertirlo en contrato ejecutable

### A. El rol debe estar escrito como función, no como identidad personal

La frase “YO = Tutor + Asesor” funciona en la conversación, pero el Charter formal debe decir:

> **La función DeepSeek, cuando sea designada por el Product Owner, puede desempeñar los roles de Tutor y Asesor bajo las reglas de independencia, trazabilidad y no autoaprobación de este Charter.**

Esto evita que el sistema dependa de una identidad concreta o de una conversación determinada.

### B. Tutor y Asesor deben tener registros separados

Una misma sesión no debe mezclar sin etiquetado ambos trabajos. Cada salida debe indicar:

```text
role: TUTOR | ADVISOR
input_scope:
source_evidence:
claims:
recommendations:
confidence:
conflicts:
requires_human_decision: true | false
```

Una recomendación del Asesor no debe convertirse automáticamente en conocimiento didáctico del Tutor, y una lección del Tutor no debe convertirse automáticamente en decisión de arquitectura.

### C. Decir “NO” requiere una forma verificable

La objeción del Asesor debe registrar:

| Campo | Contenido |
|---|---|
| Objeto | Qué propuesta se objeta |
| Motivo | Riesgo técnico, producto, evidencia, seguridad o gobernanza |
| Evidencia | Archivos, pruebas, outputs o contrato revisado |
| Severidad | P0, P1, P2 o FUTURE |
| Alternativas | Opciones razonables |
| Decisión final | Product Owner |
| Estado | Abierta, aceptada, rechazada o diferida |

El Asesor no debe bloquear unilateralmente el proyecto, pero sí debe poder registrar una objeción formal antes de que el Product Owner decida.

### D. PCB-001 debe ser realmente diagnóstico

La propuesta de examen diagnóstico es correcta, pero el PCB-001 debe definir:

- materias y competencias examinadas;
- nivel de dificultad;
- información que ARKI puede consultar;
- información que no puede consultar;
- casos nuevos y casos de entrenamiento separados;
- métrica de evaluación;
- tolerancias numéricas;
- criterios de aprobación;
- evidencia requerida;
- tratamiento de respuestas incompletas o inciertas;
- fecha y versión del Oracle.

El resultado no debe ser “ARKI está en maestría/doctorado” por una impresión general. Debe producir una matriz de competencias con evidencia y estado.

### E. La autoridad humana no sustituye la validación profesional

La Human Authority decide sobre el producto y sus fases. Para estructuras, instalaciones, seguridad, salud, evacuación y otras disciplinas reguladas, la aprobación profesional legal continúa siendo responsabilidad de especialistas autorizados.

El Charter debe conservar la distinción:

```text
competencia computacional demostrada ≠ habilitación profesional para firmar
```

## Flujo aprobado

```text
PCB-001 diagnóstico
        ↓
Mapa de competencias y déficits
        ↓
Tutor estructura currículo adaptativo
        ↓
ARKI estudia y resuelve ejercicios
        ↓
Examiner genera caso oculto
        ↓
Oracle entrega referencia independiente
        ↓
Evidencia reproducible
        ↓
Promoción de competencia propuesta
        ↓
Asesor revisa riesgos y suficiencia
        ↓
Human Authority acepta, rechaza o difiere
```

La posición del Asesor debe aparecer antes de la decisión final, no después como justificación retroactiva.

## Relación con E5

El documento confirma correctamente:

```text
E5: DEFER
E6: BLOQUEADO
Academy/Advisory: línea estratégica independiente
```

No se debe ampliar E5 para incorporar Tutor, Academy, PCB-001, Knowledge Graph u Oracle. Primero debe cerrarse E5 con su evidencia formal pendiente.

## Charter recomendado

El nombre propuesto es adecuado:

> **ARKI ACADEMY & ADVISORY CHARTER v1.0**

Debe incluir al menos estas funciones:

| Función | Responsabilidad | Autoaprobación |
|---|---|---|
| Director / Human Authority | Decisión final y prioridades | No aplica |
| ARKI | Aprende, razona, diseña, modela y demuestra | No |
| Tutor | Enseñanza y currículo | No |
| Examiner | Examen independiente y oculto | No |
| Oracle | Referencia verificable | No |
| Asesor | Arquitectura, riesgos, evidencia y estrategia | No |
| Especialista profesional | Validación regulada y firma cuando corresponda | No |

La incorporación de **Especialista profesional** no crea otro agente de ARKI; representa el gate humano externo necesario para disciplinas reguladas.

## Veredicto final

El Documento 71 debe aceptarse como **ampliación de gobernanza** del Documento 69. La función de Asesor es necesaria y no desplaza la autoridad del Product Owner.

Antes de implementarlo, deben añadirse:

1. registro formal de roles;
2. separación de salidas Tutor/Asesor;
3. protocolo de objeciones “NO”;
4. especificación independiente de PCB-001;
5. regla de no autoaprobación;
6. registro de evidencia y Oracle versionado;
7. gate de especialista profesional;
8. contrato separado de E5.

**Estado recomendado:**

```text
ARKI Academy & Advisory Charter: APPROVE WITH FIXES
E5: DEFER
E6: BLOQUEADO
Implementación del Tutor/Asesor: NO INICIADA
```
