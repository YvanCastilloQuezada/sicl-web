# AV036-16 — Auditoría y clasificación de los 22 archivos recuperados

**Fecha:** 2026-10-16. **Estado:** STATIC_REVIEW / NO_TEST_EXECUTION / NO_BRANCH_PRUNING.

## Contabilidad verificada por comparación Git
- Laboratorio general Web: **17** artefactos recuperados: 13 archivos .cjs (incluyendo tests y dependencias) + 4 .md. Los 2 archivos de control (catálogo y ledger) **no** se cuentan como recuperados.
- Laboratorio Web específico: **2** documentos .md recuperados.
- Laboratorio Core: **3** documentos .md recuperados.
- **Total: 22 artefactos recuperados**, repartidos entre **tres ramas experimentales**, NO en una sola rama.
- ACS: **0** archivos recuperados todavía.

## Catálogo por capacidad
| ID | Dominio | Qué contiene | Madurez documentada | Próxima acción | Riesgo / bloqueo |
|---|---|---|---|---|---|
| REC-001 | Web, sistemas vivos | Coordinador + test + 5 dependencias .cjs (7 archivos) | Composición read-only; no AGK, no sync persistente | Reconstruir disposición de dependencias y fixtures, ejecutar test | Importaciones relativas rotas en la copia experimental; faltan assembly-registry.json y ruta del mapa para prueba original |
| REC-002 | Web, grafo de aprendizaje | Módulo + test + documento (3) | Candidatos REQUIRES/INFORMS/FEEDBACK, sin descubrimiento semántico general | Vincular dependencia local, ejecutar tests, verificar citas contra blobs | require('./arki-dependency-coverage.cjs') no existe en su carpeta experimental; copia en REC-001/dependencies |
| REC-003 | Web, gemelo | Evaluador A/B/C + test + documento (3) | Evaluador, NO simulador | Ejecutar test aislado, integrar simulador solo después de validación | Recibo de verificador no autenticado criptográficamente |
| REC-006 | Web, observabilidad | Pulso HTTP + test (2) | Sensor read-only | Ejecutar tests aislados y revisar seguridad de endpoints | URLs arbitrarias configurables: analizar SSRF y límites de red antes de despliegue |
| REC-007 | Web, arquitectura | Auditoría Mapa/Árbol/Gemelo (1) | Análisis estático | Convertir hallazgos en expedientes individuales | Autoridad canónica duplicada en Core es riesgo identificado, no defecto resuelto |
| REC-008 | Web, operación | MO-025 diez órdenes L1–L5 (1) | Plan de activación, no prueba de L2–L5 | Separar 10 acciones y pruebas de aceptación | No activar systemd ni mutaciones sin autorización |
| WEB-IDEA-001 | Web, relaciones | Descubrimiento explícito de aristas en docs (1) | Scanner declarado implementado, pruebas no ejecutadas | Recuperar scanner y tests en una etapa siguiente | No infiere relaciones implícitas |
| WEB-IDEA-002 | Web, trazabilidad | Grafo unificado de cinco vistas (1) | Proyección local read-only | Identificar implementación y pruebas en rama origen | No persistencia/sincronización viva, E3 pendiente |
| CORE-IDEA-001 | Core, autocorrección | Contrato autónomo V0 (1) | PROPUESTO, no implementado | Dividir en estados y puertas de control | No confundir diseño con ejecución |
| CORE-IDEA-002 | Core, mapa | Mapa Vivo V1 (1) | Generador read-only declarado implementado | Revisar si duplica autoridad Web y recuperar pruebas | Runtime ARKI-02 no validado |
| CORE-IDEA-003 | Core, autorización | Integración ACE88 (1) | Funcional reportado; security freeze pendiente | Recuperar contratos, implementación y pruebas | No copiar secretos ni promover sin firma |

**Nota de conteo:** REC-001 tiene 7 archivos (coordinador, test y cinco dependencias); REC-002 3; REC-003 3; REC-006 2; REC-007 1; REC-008 1 = 17.

## Diagnóstico de integridad de laboratorio
La extracción inicial fue una **preservación de bytes**, no un paquete ejecutable. En particular, REC-001 requiere cinco módulos relativos a su directorio, pero fueron depositados en `REC-001/dependencies/`, y otros módulos en REC-002 y REC-003. Sus tests también leen `assembly-registry.json` y `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json` mediante rutas originales que ya no corresponden al laboratorio. REC-002 presenta un require relativo análogo. **No afirmar PASS** sin reempaquetar y ejecutar.

## Plan de cierre del lote (orden)
1. Registrar hashes de blobs y procedencia de los 22; preservar los originales intactos.
2. Crear paquete reproducible aislado de REC-001/REC-002, con fixtures explícitos y imports correctos, sin modificar código canónico.
3. Ejecutar pruebas de REC-003 y REC-006 por separado; después las de REC-001/REC-002 con fixture.
4. Descomponer REC-007/REC-008 y CORE-IDEA-001 en subideas con sus evidencias, sin confundir documentación con implementación.
5. Buscar equivalencias existentes en main y resolver duplicaciones Web/Core antes de cualquier integración.
6. Solo después de validar el lote y completar el inventario exclusivo de cada rama, proponer poda de ramas originales.

**No existe evidencia de que una rama origen esté íntegramente agotada.**
