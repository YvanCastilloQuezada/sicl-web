# SICL 0.6 — Avance porcentual y hoja de ruta ejecutiva

**Fecha de corte:** 24 de agosto de 2026  
**Propósito:** mostrar con claridad qué está terminado, qué falta, qué depende de infraestructura real y cuál es la secuencia recomendada para llegar a la validación E2E.

## 1. Respuesta ejecutiva

SICL 0.6 está en un estado avanzado de construcción local, pero todavía no está desplegado ni validado contra una infraestructura remota persistente. El porcentaje depende de la métrica utilizada:

| Métrica | Resultado | Qué significa |
|---|---:|---|
| Tareas históricas completadas | **161 de 178 = 90,45%** | Avance del registro existente antes de crear este documento y sus cinco tareas administrativas. |
| Tareas actuales incluyendo esta hoja de ruta | **161 de 183 = 87,98%** | Medición literal del `todo.md` en el momento del corte. |
| Avance ponderado por fases | **82,50%** | Estimación de gestión que da mayor peso a semántica, producto y validación que a simples casillas. |

La cifra que recomiendo comunicar es **82,5% de avance ponderado del proyecto hacia un MVP verificable**, acompañada siempre por esta precisión: **la integración remota y el E2E poblado todavía están en 0% de ejecución real porque requieren Cloud Computer**. El 82,5% no significa que el servicio esté en producción ni que SICL tenga validez profesional automática.

## 2. Cómo se calculó el 82,5%

La métrica ponderada no es una medición externa ni una certificación; es una herramienta de dirección del proyecto. Se construyó a partir de cuatro bloques que reflejan dependencias reales:

| Bloque | Peso | Estado | Contribución |
|---|---:|---:|---:|
| Core Contract y semántica | 40% | 100% | 40,00 |
| Web, tRPC y adaptador | 25% | 90% | 22,50 |
| Pruebas, simulador y Release Candidate local | 20% | 100% | 20,00 |
| Despliegue remoto y E2E poblado | 15% | 0% | 0,00 |
| **Total** | **100%** |  | **82,50%** |

El 10% no cerrado en web/adaptador representa la verificación contra el Core remoto y la revisión poblada en navegador, no una deficiencia conocida del código local. La ponderación puede revisarse cuando exista el Cloud Computer; no debe usarse para declarar aceptación de producción.

## 3. Qué está completado

### 3.1 Núcleo semántico y persistencia

Está implementado y probado el flujo de Project, Context, Requirement, Objective, Constraint, Preference, Source, Evidence, Alternative, Evaluation, Comparison, Recommendation, HumanReview, Decision y Event. Objective exige dirección explícita; Evaluation registra método, inputs, unidad, dirección, versión y factibilidad; Comparison no asume `MINIMIZE`; Recommendation y Decision permanecen separadas.

Preference está integrado en el Core Contract, SQLite, revisión, exports y HTTP v0.3. Incluye justificación, dominio, fuerza, alcance, procedencia, vigencia, estado y evento `PREFERENCE_RECORDED`. El replay idempotente fue endurecido para exigir coincidencia de identidad y payload.

### 3.2 Web y autoridad humana

El Command Center React/tRPC implementa módulos de proyecto, contexto, objetivos y restricciones, alternativas y evaluación, Council/Recommendation, Decision/Audit y gobernanza. La interfaz muestra Decision Conditions read-only, mantiene Council read-only y conserva la regla de que una Recommendation no crea una Decision.

La suite web registrada tiene **64 pruebas aprobadas** y TypeScript no presenta errores en la verificación disponible. La revisión visual en escritorio y móvil existe a nivel de interfaz; la prueba funcional poblada contra un Core remoto sigue pendiente.

### 3.3 Analítica, gobernanza y simulación

La Investigación de Operaciones está disponible como catálogo read-only con restricciones, unidades, factibilidad, sensibilidad y procedencia. El Capability Gate Ledger es visible y read-only. El Simulador Fase A es externo al Core, determinista, sintético y capaz de comprobar invariantes sin crear autoridad automática.

El Release Candidate local incluye smoke test HTTP, verificador agregado, manifiesto de hashes, matriz de fallos HTTP y documentación UPAO/E2E. El verificador agregado pasa cinco checks: simulador, HTTP local, `compileall`, suite Python y `git diff --check`.

## 4. Qué falta exactamente

| Pendiente | Tipo | Dependencia | Estado real |
|---|---|---|---|
| Confirmar y adjuntar Cloud Computer | Infraestructura | Acción del Product Owner | Bloqueante |
| Inspeccionar IP, sistema, Docker, systemd, UFW y disco | Infraestructura | Cloud Computer conectado | Pendiente |
| Desplegar `sicl-core-http` | Infraestructura | Máquina real | Pendiente |
| Configurar `/data/sicl/` | Persistencia | Volumen externo | Pendiente |
| Crear unidad systemd | Operación | Host real | Pendiente |
| Configurar UFW | Seguridad de red | Sesión SSH y host real | Pendiente |
| Configurar DNS, reverse proxy y HTTPS | Publicación segura | Dominio resolviendo | Pendiente |
| Registrar `SICL_CORE_URL` y token | Integración | URL HTTPS real | Pendiente |
| Probar reinicio y persistencia de `core.sqlite` | Integridad | Servicio desplegado | Pendiente |
| Ejecutar E2E UPAO-001 poblado | Validación | Todo lo anterior | Pendiente |
| Verificar 401/404/409/422 extremo a extremo | Contrato | Servicio remoto | Pendiente |
| Verificar Council/Audit y flujo completo en navegador | Producto | Datos canónicos poblados | Pendiente |

Los 17 pendientes históricos de `todo.md` corresponden a estas categorías. Las cinco tareas nuevas de este documento —medición, ponderación, clasificación, cronograma y entrega— se agregan al registro y no deben confundirse con trabajo de producto.

## 5. Cronograma recomendado

El cronograma debe entenderse como una secuencia de fases y dependencias, no como una promesa rígida de minutos. La duración efectiva dependerá del estado de la máquina, DNS, credenciales y disponibilidad del dominio.

| Fase | Trabajo | Dependencia de entrada | Criterio de salida |
|---|---|---|---|
| 0. Acceso | Crear y adjuntar Cloud Computer | Suscripción y máquina disponible | La máquina aparece conectada y se puede abrir una sesión segura |
| 1. Inspección | Confirmar OS, IP, Docker, systemd, UFW, espacio y DNS | Fase 0 | Checklist del host firmado con evidencia |
| 2. Despliegue base | Copiar Core, construir imagen, crear `/data/sicl/`, configurar secretos y arrancar | Fase 1 | `/health` responde localmente y el contenedor está activo |
| 3. Operación segura | Configurar systemd, reinicio automático y UFW conservando SSH | Fase 2 | Servicio reinicia y solo quedan expuestos los puertos aprobados |
| 4. HTTPS | Configurar DNS, reverse proxy y certificado | Fase 3 y dominio real | `https://DOMINIO/health` responde sin secretos |
| 5. Integración web | Registrar `SICL_CORE_URL` y token server-side; reiniciar web | Fase 4 | tRPC delega al Core remoto y el navegador nunca recibe el bearer |
| 6. Persistencia | Crear proyecto, reiniciar servicio y comprobar snapshot | Fase 2–5 | El proyecto sobrevive al reinicio y el archivo está fuera del contenedor |
| 7. E2E poblado | Ejecutar UPAO-001: Evidence → Preference → Evaluation → Comparison → Recommendation → HumanReview → Decision | Fase 6 | Evidencia completa, estados correctos y autoridad humana explícita |
| 8. Cierre | Revisar navegador, logs, errores contractuales y criterios de aceptación | Fase 7 | Product Acceptance Contract firmado o con defectos registrados |

## 6. Qué debe hacerse en cada fase

### Fase 0 — Cloud Computer

El Product Owner debe crear y adjuntar la máquina. No se debe fabricar una URL, declarar una IP ni registrar secretos antes de que exista un servicio real.

### Fases 1–3 — Despliegue y operación

Se ejecutará `deploy/CLOUD_COMPUTER_RUNBOOK.md`. Se verificará la sesión SSH antes de activar UFW, se evitará exponer el puerto 8000 y se montará SQLite en `/data/sicl/`. La unidad systemd debe reiniciar el servicio y el contenedor debe recibir correctamente `PORT`, `SICL_CORE_SQLITE_PATH` y `SICL_CORE_SERVICE_TOKEN`.

### Fases 4–5 — HTTPS e integración

El dominio debe resolver hacia el host real antes de emitir el certificado. `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN` se registrarán únicamente en el entorno server-side. Decision Conditions continuará sin escritura remota mientras no exista un endpoint canónico aprobado.

### Fases 6–8 — Persistencia, E2E y aceptación

Se utilizará el fixture UPAO-001 explícitamente sintético. La prueba no termina al obtener HTTP 200: debe verificar versiones, eventos, referencias, errores 401/404/409/422, Council read-only, ausencia de Decision automática, persistencia tras reinicio y ausencia de secretos.

## 7. Criterios de decisión para declarar el MVP funcional

| Resultado | Declaración permitida |
|---|---|
| Checks locales pasan | “Release Candidate local verificado.” |
| Servicio remoto responde `/health` | “Servicio desplegado técnicamente.” |
| Persistencia sobrevive reinicio | “Persistencia remota verificada.” |
| E2E poblado pasa | “Flujo SICL 0.6 verificado en entorno remoto.” |
| Product Acceptance Contract completo | “MVP aceptado según los criterios definidos.” |
| Resultado analítico favorable | Nunca equivale por sí solo a “decisión correcta” o “validez profesional”. |

## 8. Recomendación final

La estrategia es factible. La mayor parte del trabajo de diseño, semántica, interfaz, integración local y pruebas ya está realizada. El proyecto no necesita abrir nuevas capacidades para avanzar; necesita ejecutar con disciplina la fase de infraestructura y demostrar el comportamiento en un entorno remoto persistente.

La cifra ejecutiva recomendada es **82,5% ponderado**, con **90,45% de tareas históricas cerradas**. El tramo restante es menor en cantidad, pero crítico en dependencia: sin Cloud Computer no se puede cerrar la integración real. La siguiente acción concreta es adjuntar la máquina; después, el trabajo debe seguir las fases 1–8 de este documento sin saltarse los criterios de salida.

## 9. Referencias internas

- `docs/AUDITORIA_CONSOLIDADA_SICL_0_6.md`
- `docs/PRODUCT_ACCEPTANCE_CONTRACT_SICL_0_6.md`
- `docs/RELEASE_CANDIDATE_SICL_0_6.md`
- `docs/SIMULATOR_PHASE_A.md`
- `deploy/CLOUD_COMPUTER_RUNBOOK.md`
- `evidence_release_candidate.json`
- `todo.md`
- Core commits `cde3159`, `ddebc70`, `0cd0d04`, `25e53d0`, `20dfb33`
- Checkpoint web `manus-webdev://99828225`
