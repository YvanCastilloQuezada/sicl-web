# ARKI L1→L2 — Runtime de transferencia tipológica

## Estado

La implementación eleva el runtime desde **L0–L1: registro de encargo y retrieval acotado** hacia **L2: retrieval razonado con transferencia tipológica acotada, adaptación, alternativas estratégicas y control epistemológico**.

La implementación extiende `server/arkiD62ReasoningHarness.ts`; no crea un segundo Core ni reemplaza SICL.

## Componentes implementados

| Componente | Estado | Regla epistemológica |
|---|---|---|
| Retrieval con provenance y scope | PASS | Recuperar no equivale a promover |
| Decisión `TRANSFER` | PASS | Solo para conocimiento general dentro de su alcance |
| Decisión `ADAPT` | PASS | Exige diferencias, carga de adaptación y revisión |
| Decisión `DO_NOT_TRANSFER` | PASS | Rechaza copiar tipologías o configuraciones incompatibles |
| Decisión `UNKNOWN` | PASS | Se conserva cuando faltan alcance o evidencia |
| Modelo funcional previo a habitaciones | PASS | Purpose → operating model → activities → processes → flows → requirements |
| Programa derivado | PASS | Need → activity/capability → spatial requirement → possible realization; no nombres de habitaciones sin razón |
| Dos estrategias genuinamente distintas | PASS | Spine with controlled branches vs distributed clusters around commons |
| Perturbación simultánea | PASS parcial | Reevaluación de flujos, interferencias, control, capacidad y cuellos de botella |
| Fallo de acceso | PASS parcial | Distingue conectividad física de topología operacional activa |
| Contraejemplo | PASS | Refina la regla “todos los flujos deben separarse” |
| Candidato de aprendizaje | PASS | `HUMAN_REVIEW_REQUIRED`; no promoción automática |
| Replay determinista | PASS | Misma entrada, snapshot y versión producen la misma huella |
| Persistencia local versionada | PASS | Guarda `reasoningExecutions` y evento en el snapshot SICL local |
| Persistencia remota | BLOCKED HONESTAMENTE | Requiere endpoint canónico de escritura de razonamiento; no se inventa |

## Integración

Se añadió el procedimiento protegido:

```text
projects.reasoningExecute
```

El procedimiento:

1. valida proyecto y versión esperada;
2. recupera el snapshot SICL;
3. ejecuta retrieval, transferencia y razonamiento;
4. registra la ejecución en `reasoningExecutions`;
5. añade un evento `ARCHITECTURAL_REASONING_EXECUTED`;
6. incrementa la versión del proyecto;
7. devuelve candidatos y estados sujetos a revisión humana.

Cuando existe `SICL_CORE_URL`, el procedimiento se detiene con un gate explícito porque aún no existe un contrato remoto documentado para escribir ejecuciones de razonamiento. Esto evita fingir una persistencia que no puede verificarse.

## Validación

- Pruebas focalizadas L2: **4/4 PASS**.
- Prueba de tema y regresión asociada al encabezado: **6/6 PASS**.
- Suite completa: **177/177 PASS**.
- TypeScript: **PASS**.
- Build: **PASS**.
- `git diff --check`: **PASS**.

## Límite de capacidad

El runtime ahora puede producir y evaluar candidatos razonados de transferencia y alternativas organizativas. Esto no equivale todavía a una planta constructiva, cumplimiento normativo verificado ni decisión profesional autónoma. La autoridad final continúa siendo humana.

## Próximo gate legítimo

Para cerrar la integración con un SICL Core remoto se necesita un contrato explícito y verificable para:

```text
POST /projects/{project_id}/reasoning-executions
```

con versionado optimista, provenance, replay fingerprint, actor, estado epistemológico y respuesta canónica. Hasta que ese contrato exista, el runtime informa `REMOTE_WRITE_NOT_DEMONSTRATED` en lugar de simularlo.
