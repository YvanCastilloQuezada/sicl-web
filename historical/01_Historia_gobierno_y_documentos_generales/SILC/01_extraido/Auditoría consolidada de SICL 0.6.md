# Auditoría consolidada de SICL 0.6

**Fecha de corte:** 24 de agosto de 2026  
**Objeto:** consolidar en un solo documento qué se ha avanzado, qué está probado, qué está preparado, qué sigue bloqueado y qué permanece fuera de alcance.  
**Criterio rector:** una capacidad solo se considera implementada cuando existe código, prueba o evidencia reproducible y una frontera semántica explícita.

## 1. Veredicto ejecutivo

SICL 0.6 tiene un **vertical slice local funcional** para registrar contexto, objetivos, restricciones, preferencias, alternativas, evaluaciones, comparaciones, recomendaciones, revisiones humanas, decisiones humanas y auditoría. La interfaz web está conectada a un adaptador tRPC con delegación server-to-server al Core Python cuando `SICL_CORE_URL` existe; fuera de ese modo, el fallback local exige una habilitación explícita.

El Core Python incorpora persistencia SQLite, control de versiones, eventos append-only a nivel de aplicación, Preference canónica, HTTP v0.3, catálogo read-only de Investigación de Operaciones y un simulador externo Fase A. El Release Candidate local cuenta además con smoke test HTTP, verificador agregado, manifiesto de hashes y documentación de despliegue.

La conclusión **no** es que SICL esté desplegado. La conclusión exacta es: **el producto local está preparado y verificado; la integración remota y la prueba poblada de producción siguen pendientes por ausencia de Cloud Computer, URL HTTPS real y persistencia externa**.

## 2. Leyenda de estados

| Estado | Significado |
|---|---|
| **Implementado y probado** | Código ejecutable y evidencia local reproducible. |
| **Preparado, no ejecutado remotamente** | Runbook, Dockerfile, scripts o secretos planificados, pero sin infraestructura real. |
| **Pendiente de Cloud Computer** | No puede cerrarse honestamente sin máquina persistente, dominio o volumen externo. |
| **Diseñado/read-only** | Contrato o representación disponible, sin escritura o autoridad automática. |
| **Fuera de alcance actual** | No forma parte de SICL 0.6 y no debe inferirse desde el MVP. |

## 3. Mapa consolidado del sistema

```text
SICL 0.6
├── Fundamento semántico
│   ├── Project / Context
│   ├── Requirement / Objective / Constraint
│   ├── Preference
│   ├── Source / Evidence
│   ├── Alternative / Evaluation / Comparison
│   ├── Recommendation
│   ├── HumanReview / Decision
│   └── Event / Traceability
├── Núcleo analítico
│   ├── Direcciones explícitas
│   ├── FeasibilityStatus
│   ├── EvaluationMethod catalogado
│   ├── Investigación de Operaciones read-only
│   └── Council y comparaciones read-only en web
├── Representación multiescala
│   ├── SICL 1: objeto, edificio, sitio y proyecto
│   ├── SICL 2: ciudad/territorio como contrato mínimo
│   └── SICL 3: desarrollo nacional/escenarios como contrato mínimo
├── Gobernanza
│   ├── Capability Gate Ledger read-only
│   ├── roles y referencias de autorización
│   └── Recommendation ≠ Decision
└── Validación
    ├── pruebas Python y Vitest
    ├── Simulador Fase A externo
    ├── smoke test HTTP temporal
    └── verificador agregado del Release Candidate
```

## 4. Auditoría por temas

### 4.1 Core Contract y modelo semántico

| Tema | Estado | Qué está efectivamente avanzado | Evidencia principal |
|---|---|---|---|
| Proyecto y contexto | Implementado y probado | Project, Context, estado, versiones y snapshot persistente. | `src/sicl/core_contract/model.py`, pruebas de modelo y SQLite |
| Objetivos | Implementado y probado | Dirección explícita `MAXIMIZE`/`MINIMIZE`; no se permite asumir `MINIMIZE`. | `tests/test_semantic_integrity_025.py` |
| Restricciones y requisitos | Implementado y probado | Referencias y pertenencia al proyecto validadas. | Core Contract y pruebas de referencias |
| Preference | Implementado y probado | Entidad canónica con justificación, dominio, fuerza, alcance, procedencia, vigencia y estado; persistencia y evento `PREFERENCE_RECORDED`. | `fe62b86`, pruebas HTTP y SQLite |
| Alternative | Implementado y probado | Payload escalar validado; se rechazan colecciones anidadas y claves vacías. | Pruebas de integridad semántica |
| Evidence y Source | Implementado y probado | Referencias de procedencia y evidencia se preservan en evaluaciones y snapshots. | pruebas de provenance y adaptador |
| Evaluation | Implementado y probado | Registra criterio, valor, unidad, método, inputs, dirección, versión, contrato y factibilidad. | `src/sicl/domain/model.py`, pruebas de evaluación |
| Comparison | Implementado y probado | Requiere dirección y referencias válidas; estados de factibilidad explícitos. | `tests/test_semantic_integrity_025.py` |
| Recommendation | Implementado y probado | Separa fuente analítica, referencia comparativa, razón y versión. | `analysis.py`, router web, pruebas de Recommendations |
| HumanReview | Implementado y probado | Actor, autoridad, versión observada y referencia a Recommendation. | Core, HTTP v0.3 y pruebas de revisión |
| Decision | Implementado y probado | Registro separado, con autoridad humana explícita; no se deriva automáticamente de Recommendation. | pruebas de autoridad y simulador |
| Event | Implementado y probado con límite | Persistencia protegida contra actualización y borrado; el diseño es snapshot más log append-only a nivel de aplicación, no Event Sourcing. | SQLite, triggers y pruebas de replay |

### 4.2 Persistencia, versionado e integridad

La persistencia local usa SQLite. El Core aplica transacciones, control de versiones esperado y eventos. El replay idempotente de Preference se endureció para exigir coincidencia de `event_type`, `entity_type`, `entity_id`, `project_id` y payload completo. Un segundo guardado no debe borrar ni modificar eventos anteriores.

La auditoría debe distinguir esta afirmación precisa de una afirmación más fuerte: el sistema tiene **protecciones append-only verificadas en SQLite y en la aplicación**, pero todavía no existe validación de persistencia externa tras reinicio de un contenedor en una máquina remota. Esa última propiedad continúa pendiente.

### 4.3 Adaptador HTTP y seguridad

El adaptador `sicl-core-http` expone contrato v0.3 con normalización JSON y autenticación Bearer server-to-server. Las rutas principales son `/health`, `/v1/contract`, creación de proyectos, Preference, Recommendation, HumanReview, Decision, catálogo de Investigación de Operaciones, Council y snapshot.

| Control | Estado |
|---|---|
| Bearer obligatorio para rutas protegidas | Implementado y probado |
| Token ausente o incorrecto devuelve 401 | Implementado y probado |
| Errores de contrato devuelven 422 | Implementado y probado |
| Conflictos de versión devuelven 409 | Implementado y probado |
| Entidades inexistentes devuelven 404 | Implementado y probado |
| Tokens fuera de logs y frontend | Diseñado y cubierto en pruebas de proyección segura |
| HTTPS público | Pendiente de Cloud Computer y dominio |
| Firewall UFW real | Pendiente de Cloud Computer |
| Persistencia externa | Pendiente de Cloud Computer |

### 4.4 Investigación de Operaciones y Council

La Investigación de Operaciones se formalizó como capa analítica extensible, no como autoridad. El catálogo incluye contratos de método, entradas, unidades, restricciones, supuestos, factibilidad, sensibilidad, salida y procedencia. La superficie HTTP es read-only.

Council y comparaciones se presentan como artefactos analíticos. El frontend conserva separadas `comparisons` y `multiComparisons`, y no permite que una recomendación cruce silenciosamente el tipo de comparación. La dominancia, agregación colectiva y comparación de múltiples Objectives permanecen como capacidades sujetas a decisiones contractuales; no deben inferirse de la regla actual de Objective único.

### 4.5 Interfaz web y flujo de usuario

El Command Center React/tRPC contiene módulos para Project, Context/Site, Objectives & Constraints, Alternatives & Evaluation, Council/Recommendation, Decision & Audit y Build Governance. El flujo local soporta la cadena:

```text
Evidence → Preference → Evaluation → Comparison → Recommendation → HumanReview → Decision
```

La UI conserva la frontera de autoridad: Council observa, Recommendation describe, HumanReview registra revisión y Decision requiere autorización humana. La interfaz fue revisada en escritorio y móvil a nivel visual; la verificación poblada del flujo contra un Core remoto todavía no se ha ejecutado.

Las pruebas Vitest registran **64 pruebas aprobadas** en 10 archivos. TypeScript no presenta errores en la verificación registrada. La cobertura web es contractual y de integración adaptada; no sustituye una prueba funcional poblada en navegador.

### 4.6 Gobernanza y autoridad humana

El Capability Gate Ledger se encuentra integrado como vista read-only con etapas, roles y referencias. No permite avanzar gates desde la interfaz. El protocolo de autoridad humana permanece explícito y debe emplear:

> **USTED APRUEBA ESTO: ... CONFIRMAR CON SI o NO.**

El simulador y el verificador local no crean decisiones ni convierten resultados sintéticos en autoridad. Cualquier decisión durable debe seguir requiriendo intervención humana identificable.

### 4.7 Escala SICL 1–3

| Escala | Estado actual | Interpretación correcta |
|---|---|---|
| SICL 1 | Implementado parcialmente y probado localmente | El MVP representa proyectos de objeto/edificio con el núcleo semántico común. |
| SICL 2 | Contrato mínimo diseñado | La jerarquía ciudad/territorio está representada conceptualmente; no equivale a un motor urbano operativo. |
| SICL 3 | Contrato mínimo diseñado | Los horizontes 2030/2040/2050 pueden actuar como marcos explícitos; no son predicciones ni planificación nacional automatizada. |

La misma cadena semántica puede servir a las escalas, pero la cobertura real de SICL 2–3 requerirá datos, métodos, agregación, incertidumbre y gobernanza adicionales.

### 4.8 Simulador de Proyectos Fase A

El simulador está implementado en `src/sicl/simulator.py` como harness externo. Tiene dos fixtures SICL 1 sintéticos, fingerprint determinista, SQLite temporal, reporte JSON y validación de invariantes. Comprueba que exista comparación y recomendación, que los eventos se conserven, que los invariantes declarados tengan checks implementados y que no aparezca una Decision automática.

La suite se ejecuta mediante `tools/run_simulator_phase_a.py` y está documentada en `docs/SIMULATOR_PHASE_A.md`. No incluye Monte Carlo, optimización, selección automática, datos profesionales reales, GIS, BIM ni SICL 2–3 operativo.

### 4.9 Release Candidate y reproducibilidad

El paquete Release Candidate local incluye un smoke test HTTP, un verificador agregado y un manifiesto con commit y hashes SHA-256. El comando agregado ejecuta cinco checks: simulador Fase A, smoke HTTP, `compileall`, suite Python y `git diff --check`. El último manifiesto local registra `remote_infrastructure_verified: false` y `professional_validity_claimed: false` deliberadamente.

| Referencia | Significado |
|---|---|
| `cde3159` | Implementación inicial del simulador Fase A |
| `ddebc70` | Preparación del Release Candidate local |
| `0cd0d04` | Aclaración del límite remoto de Decision Conditions |
| `25e53d0` | Verificador agregado, manifiesto y matriz de fallos |
| `manus-webdev://bb8a676a` | Checkpoint web de mejoras secundarias |

## 5. Lo que está preparado pero no ejecutado remotamente

| Elemento | Preparación disponible | Falta para cerrarlo |
|---|---|---|
| Docker | Dockerfile y contexto revisados estáticamente | Construcción y arranque en máquina real |
| Servicio Python | Uvicorn, `PORT` configurable y `PYTHONPATH` preparados | Despliegue del contenedor |
| Persistencia | Ruta planificada `/data/sicl/core.sqlite` | Volumen externo y prueba tras reinicio |
| systemd | Runbook con unidad y reinicio automático | Instalación y observación del servicio |
| UFW | Secuencia segura documentada con SSH, HTTP temporal y HTTPS | Aplicación en host real |
| HTTPS | Procedimiento DNS, reverse proxy y Let's Encrypt | Dominio resolviendo y certificado válido |
| Web | Variables server-side y delegación preparadas | URL real, secreto real y E2E |
| UPAO | Fixture sintético y guion documentados | Ejecución poblada contra servicio desplegado |

## 6. Pendientes reales

Los pendientes no son “errores locales” del paquete. Son verificaciones que requieren infraestructura o interacción real:

1. Adjuntar un Cloud Computer y confirmar sistema, IP, Docker, systemd, UFW y almacenamiento.
2. Desplegar `sicl-core-http` y comprobar `/health` localmente.
3. Configurar `/data/sicl/` fuera del contenedor y demostrar persistencia tras reinicio.
4. Configurar UFW sin perder la sesión SSH.
5. Instalar reverse proxy, DNS y certificado HTTPS real.
6. Registrar `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN` únicamente server-side.
7. Ejecutar E2E poblado con UPAO-001: snapshot, Council, Preference, Evaluation, Comparison, Recommendation, HumanReview, Decision y auditoría.
8. Verificar en navegador escritorio y móvil los datos canónicos poblados.
9. Confirmar preservación de 401/404/409/422 y ausencia de secretos en respuestas/logs.

## 7. Capacidades deliberadamente no implementadas

AestheticProfile, motor universal de belleza, pesos normativos, visión artificial, GIS/Leaflet productivo, BIM, Monte Carlo, análisis de sensibilidad profesional, optimización automática, perfiles/agentes autónomos, agregación colectiva, dominancia general, comparación multobjetivo como regla universal y planificación nacional automatizada permanecen fuera del alcance actual o requieren nuevos contratos.

Esta exclusión es una protección arquitectónica. Añadirlas antes de cerrar sus contratos podría hacer que el software funcione mientras la reconstrucción conceptual de SICL se vuelve incorrecta.

## 8. Riesgos y observaciones de auditoría

| Riesgo | Evaluación |
|---|---|
| Confundir tests con validación profesional | Mitigado documentalmente; el manifiesto lo declara expresamente. |
| Declarar despliegue sin máquina real | Mitigado; el runbook y manifiesto mantienen el estado remoto en falso. |
| Crear autoridad automática a partir de Recommendation | Mitigado mediante Core, UI y simulador. |
| Escribir Decision Conditions localmente cuando existe Core remoto | Mitigado con fallo cerrado y límite documentado. |
| Confundir snapshot + eventos con Event Sourcing | Mitigado en documentación; la arquitectura actual no se declara Event Sourcing. |
| Cobertura web poblada insuficiente | Pendiente; requiere proyecto y datos canónicos en entorno conectado. |
| Dependencia de un dominio no definido | Pendiente; HTTPS no puede configurarse honestamente sin DNS real. |
| Advertencia de deprecación `httpx`/Starlette | No bloqueante; debe revisarse en una actualización futura de dependencias. |

## 9. Conclusión y decisión operativa

La auditoría confirma que el proyecto ha avanzado de forma sustancial y disciplinada: el Core Contract tiene un vertical slice ejecutable; Preference está integrado; la interfaz web es trazable; la autoridad humana está preservada; el simulador externo valida invariantes; y el Release Candidate local es reproducible.

La auditoría también confirma que **el proyecto no debe declararse desplegado ni listo para operación real** hasta completar la fase remota. El único siguiente paso que puede cerrar los pendientes principales es disponer del Cloud Computer, ejecutar el runbook y registrar evidencia del E2E real.

Mientras esa infraestructura no exista, el estado correcto del proyecto es:

> **SICL 0.6 — Release Candidate local verificado; integración remota y validación E2E poblada pendientes.**

## 10. Fuentes internas auditadas

| Fuente | Uso |
|---|---|
| `src/sicl/core_contract/model.py` | Entidades, invariantes y estados del Core |
| `src/sicl/core_contract/sqlite.py` | Persistencia, versiones y eventos |
| `src/sicl/core_contract/analysis.py` | Comparaciones, Recommendations y Decisions |
| `http_adapter/sicl_core_http.py` | Contrato HTTP v0.3 y rutas |
| `tests/` y `http_adapter/test_sicl_core_http.py` | Evidencia de pruebas Python y HTTP |
| `client/src/pages/Home.tsx` | Command Center y flujo visual |
| `server/routers.ts` y `server/coreHttpClient.ts` | Delegación tRPC y frontera server-side |
| `docs/PRODUCT_ACCEPTANCE_CONTRACT_SICL_0_6.md` | Criterios de aceptación del producto |
| `docs/GUIA_USUARIO_PRODUCT_0_6.md` | Guía operativa local |
| `docs/SIMULATOR_PHASE_A.md` | Contrato y límites del simulador |
| `docs/RELEASE_CANDIDATE_SICL_0_6.md` | Matriz, E2E y límites del Release Candidate |
| `evidence_release_candidate.json` | Manifiesto de checks y hashes |
| `todo.md` | Registro de pendientes y trazabilidad de trabajo |
