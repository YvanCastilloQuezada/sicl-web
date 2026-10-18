# SICL — Simulador de Proyectos, Fase A

## Propósito

El simulador de Fase A es un **harness externo de validación**. Su función es ejecutar casos sintéticos, deterministas y versionados contra la interfaz pública de SICL y verificar invariantes del Core Contract. No es un motor profesional, no es un selector automático y no sustituye la revisión humana.

> Un resultado del simulador demuestra que el software respetó un contrato probado; no demuestra que una alternativa sea correcta para un proyecto real.

## Frontera arquitectónica

El módulo vive en `src/sicl/simulator.py`, fuera de los modelos canónicos. Usa `SICL` y `SQLiteRepository` como cliente externo y cada ejecución se realiza sobre una base SQLite temporal. No escribe en la base productiva, no modifica los modelos de dominio y no crea una `Decision` automáticamente.

| Regla | Garantía de Fase A |
|---|---|
| Casos sintéticos | Cada `SimulationCase` tiene `synthetic=True` y una identificación `SIM-`. |
| Determinismo | El caso contiene una semilla y su fingerprint depende únicamente del contenido canónico del caso. |
| No autoridad | El flujo termina en Recommendation; el runner verifica que no aparezca Decision. |
| Trazabilidad | El reporte conserva respuestas de comandos y salida de `/TRACEABILITY SHOW`. |
| Aislamiento | `run_builtin_suite()` usa directorios temporales y no persiste datos de producción. |
| Compatibilidad | El harness ejecuta comandos de la interfaz pública, sin duplicar reglas de negocio. |

## Fixtures iniciales

La suite contiene dos casos SICL 1: un edificio mixto basado en UPAO-001, explícitamente sintético, y un objeto/mobiliario. Ambos registran contexto, requisito, objetivo con dirección explícita, restricción, rol, dos alternativas, evaluaciones, comparación y recomendación analítica.

Los fixtures no incluyen un `expected_output` con una alternativa “verdadera”. En su lugar, validan invariantes: existencia de comparación y recomendación, éxito de los comandos, conservación del historial, marcación sintética y ausencia de decisión automática.

## Ejecución reproducible

Desde la raíz del repositorio:

```bash
PYTHONPATH=src ./tools/run_simulator_phase_a.py
PYTHONPATH=src pytest -q
```

La primera orden genera `evidence_simulator_phase_a.json`. Este archivo es evidencia de una ejecución local sobre SQLite temporal; no representa datos de producción ni una validación profesional del caso UPAO.

## No incluido en Fase A

La Fase A no implementa Monte Carlo, análisis de sensibilidad, medición profesional de factibilidad, optimización, selección automática de ganadores, perfiles profesionales, GIS, BIM, simulación SICL 2–3 ni integración con el servicio Python remoto. Esas capacidades requieren contratos semánticos independientes y no deben inferirse desde estos fixtures.

## Siguiente incremento posible

La Fase B puede añadir más fixtures SICL 1 y casos declarativos de insuficiencia de datos, conflicto y trade-off. Antes de ejecutar contra Cloud Computer debe existir un adaptador remoto explícito y una política de limpieza/aislamiento. La incorporación de SICL 2–3 debe esperar a que se cierren los contratos de agregación, escala, incertidumbre y gobernanza.
