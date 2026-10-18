# ARKI · Command Center

**URL:** https://4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer/arki-operations

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

ESCUELA OPERATIVA ARKI
Manual + laboratorio de comandos

Aprende haciendo: selecciona un comando a la izquierda, ajusta sus parámetros a la derecha y observa en el centro la previsualización, la trazabilidad y el resultado exportable.

Manual completo
Modo guiado
Comandos
ALL
PROJECT
STAGE
OBJECTIVE
CONSTRAINT
ROLE
ACTOR
POSITION
CYCLE
SCENARIO
FACT
ASSUMPTION
EVIDENCE
HUMAN
SITE
AGENT
DEBATE
GENERATE
ALTERNATIVE
MEMORY
PARETO
TRADEOFF_MATRIX
MULTIOBJECTIVE
SCALE
PLANNING
REGULATION
INTERPRET
SNAPSHOT
DECISION
STATUS
HISTORY
EXIT
/PROJECT CREATE
PROJECT
/PROJECT OPEN
PROJECT
/PROJECT SET SCOPE
PROJECT
/PROJECT IMPORT OBJECTIVE
PROJECT
/PROJECT SHOW
PROJECT
/PROJECT LIST
PROJECT
/STAGE SET
STAGE
/OBJECTIVE SET
OBJECTIVE
/CONSTRAINT SET
CONSTRAINT
/ROLE ADD
ROLE
/ACTOR ADD
ACTOR
/ACTOR LIST
ACTOR
/ACTOR SHOW
ACTOR
/POSITION ADD
POSITION
/POSITION LIST
POSITION
/CYCLE CREATE
CYCLE
/CYCLE LIST
CYCLE
/CYCLE SHOW
CYCLE
/SCENARIO CREATE
SCENARIO
/SCENARIO LIST
SCENARIO
/SCENARIO SELECT
SCENARIO
/FACT SET
FACT
/ASSUMPTION SET
ASSUMPTION
/EVIDENCE ADD
EVIDENCE
/EVIDENCE LIST
EVIDENCE
/EVIDENCE SHOW
EVIDENCE
/HUMAN REVIEW
HUMAN
/SITE INTELLIGENCE
SITE
/AGENT RUN
AGENT
/DEBATE
DEBATE
/GENERATE DESIGN
GENERATE
/GENERATE LIST
GENERATE
/GENERATE SHOW
GENERATE
/GENERATE METHODS
GENERATE
/ALTERNATIVE PROMOTE
ALTERNATIVE
/MEMORY LIST
MEMORY
/MEMORY SHOW
MEMORY
/MEMORY EXTRACT
MEMORY
/MEMORY REVOKE
MEMORY
/MEMORY APPLY
MEMORY
/MEMORY TYPES
MEMORY
/GENERATE
GENERATE
/PARETO
PARETO
/TRADEOFF_MATRIX
TRADEOFF_MATRIX
/MULTIOBJECTIVE
MULTIOBJECTIVE
/SCALE PARENT
SCALE
/SCALE CHILDREN
SCALE
/SCALE RELATE
SCALE
/SCALE RELATIONS
SCALE
/PLANNING ADD
PLANNING
/PLANNING LIST
PLANNING
/PLANNING SHOW
PLANNING
/PLANNING TYPES
PLANNING
/REGULATION ADD
REGULATION
/REGULATION LIST
REGULATION
/REGULATION SHOW
REGULATION
/REGULATION STATUS
REGULATION
/INTERPRET ADD
INTERPRET
/INTERPRET LIST
INTERPRET
/INTERPRET REVIEW
INTERPRET
/SNAPSHOT CREATE
SNAPSHOT
/SNAPSHOT LIST
SNAPSHOT
/SNAPSHOT FREEZE
SNAPSHOT
/DECISION RECORD
DECISION
/STATUS
STATUS
/HISTORY
HISTORY
/EXIT
EXIT

Regla de aprendizaje

Primero observa el comando, después cambia un parámetro, valida el efecto y finalmente exporta una evidencia reproducible.

project
/PROJECT CREATE

PRO-CRE <project_id> <name> [spatial_scope] [temporal_scope]

Actualizar preview
COMANDO CANÓNICO
EDITABLE

/PROJECT CREATE ZGQ-RLI-137-118 Proyecto arquitectónico demo PROJECT PRESENT

Vista central de resultado
CONTEXTO
REGLA
RESULTADO
PROJECT · EN ESPERA

Este centro está diseñado para dejar libre la lectura del resultado. Las propuestas siguen siendo previsualizaciones y requieren revisión humana.

Resultado estructurado
{
  "status": "READY_FOR_REVIEW",
  "command": "/PROJECT CREATE ZGQ-RLI-137-118 Proyecto arquitectónico demo PROJECT PRESENT",
  "projectId": "ZGQ-RLI-137-118",
  "category": "project",
  "humanReviewRequired": true,
  "source": "ARKI Operations Lab",
  "timestamp": "2026-09-25T00:46:58.581Z",
  "note": "Previsualización determinista; no crea una decisión ni ejecuta un host externo."
}
Siguiente paso: valida, revisa y exporta una evidencia; no se registra una decisión automáticamente.
Copiar
Exportar JSON
Exportar HTML
Parámetros

Los cambios se reflejan en el comando y la previsualización.

project_id
STRING
name
STRING
spatial_scope
STRING
temporal_scope
STRING

Human review

Siempre requerido antes de promover un resultado a decisión, FACT o exportación profesional.

Crear extensión

Genera un manifiesto compatible con la frontera de extensiones ARKI. El contrato no permite código arbitrario ni elimina la revisión humana.

Exportar manifest

vía `ARKI-EXTENSION-1.0` · capacidades limitadas · provenance obligatorio