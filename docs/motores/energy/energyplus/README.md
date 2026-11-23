# ARKI — ENERGYPLUS

**Estado:** EN DESARROLLO · AUDITORÍA ABIERTA  
**Versión del motor documentada:** EnergyPlus 24.1.0  
**Corte documental:** 2026-11-22  
**Módulo:** ARKI-GIA / Energy Engine  
**Principio:** CERO DEUDA · No Evidence = No Green

> Esta es la memoria técnica central de EnergyPlus en ARKI. Thermal KPI forma parte de la evolución del mismo módulo; no es un proyecto independiente.


## 0. Advertencia de trazabilidad: código publicado vs. estado forense local

Una comparación directa posterior a la fusión de esta memoria encontró que el archivo de `main`:

`server/gia/energy/arkiEnergyEngine.ts`

contiene una implementación **V31**, anterior a la evolución descrita en el informe forense local del 22-11-2026. En el archivo revisado de `main`:

- Las advertencias indican que ubicación y periodo no se aplican al IDF.
- No se incorpora Thermal KPI en el Engine.
- Los KPI energéticos permanecen en `null` y `kpiStatus: "not_instrumented"`.
- El IDF de `main` revisado no muestra el timestep 6 ni las variables térmicas documentadas en la evolución local.

Los archivos Thermal KPI tampoco se encontraron en las rutas esperadas de `main` durante esta comprobación.

**Interpretación:** esto no prueba que los cambios se hayan perdido del servidor. La evolución V19/V46.6 y Thermal KPI está respaldada por el informe forense local, pero no se ha verificado que esté publicada en GitHub. Por ello, esta memoria describe dos estados separados:

1. **Estado forense/local (22-11-2026):** cambios reportados y evidencias del trabajo en el servidor.
2. **Estado GitHub `main` verificado:** implementación V31 observada; Thermal KPI no localizado en las rutas esperadas.

No considerar la evolución local como integrada en `main` hasta localizar la rama/commit publicado y reconciliarla. No hacer merge, cherry-pick, reset ni reemplazo de archivos en esta etapa.


## 1. Propósito y alcance

ARKI EnergyPlus prepara, ejecuta y procesa simulaciones energéticas de modelos arquitectónicos. El módulo configura el modelo IDF, aplica emplazamiento y periodo, ejecuta EnergyPlus, extrae resultados y calcula indicadores energéticos y térmicos.

Honeybee y EnergyPlus cumplen funciones distintas dentro del stack: Honeybee participa en la generación geométrica/modelado cuando corresponde; EnergyPlus realiza la simulación física. El pipeline V19 descrito abajo trabaja sobre un IDF configurable.

## 2. Arquitectura y flujo

1. Recibir parámetros de simulación.
2. Preparar/configurar el IDF.
3. Aplicar ubicación y periodo.
4. Ejecutar EnergyPlus como proceso externo.
5. Recuperar resultados CSV/SQLite.
6. Calcular Energy KPIs.
7. Calcular Thermal KPI a partir del CSV de la misma simulación.
8. Consolidar resultados, errores y advertencias para ARKI.

**Regla:** una simulación produce los datos que alimentan varios análisis. Thermal KPI no debe iniciar una segunda simulación para volver a calcular información ya disponible.

## 3. Implementación registrada

### Energy Engine

Archivo: `server/gia/energy/arkiEnergyEngine.ts`

Responsabilidades conocidas:

- Configurar y ejecutar el modelo IDF.
- Aplicar datos geográficos a `Site:Location`.
- Aplicar fechas a `RunPeriod`.
- Ejecutar EnergyPlus mediante subprocess.
- Procesar resultados.
- Incorporar Thermal KPI y gestionar su error como advertencia no fatal cuando corresponda.

Se incorporó `updateIdfObject(idf, objectName, updates)` para actualizar objetos IDF y `applyEnergySimulationInput(idf, input)` para validar y aplicar parámetros de entrada. La robustez de la estrategia basada en expresiones regulares queda pendiente de auditoría EP-01.

### Plantilla IDF

Archivo: `server/gia/energy/templates/lima_1zone.idf`

Configuración registrada:

- `Timestep, 6;` — seis pasos por hora, intervalo de 10 minutos.
- Variables de salida con frecuencia Timestep:
  - `Zone Operative Temperature`
  - `Zone Mean Radiant Temperature`
  - `Zone Air Relative Humidity`

La plantilla `lima_1zone.idf` es el modelo de referencia actual del pipeline, no una definición universal de cualquier edificio.

### Thermal KPI

Archivos:

- `server/gia/energy/arkiThermalKPIs.ts`
- `server/gia/energy/arkiThermalKPIs.test.ts`

Thermal KPI procesa el CSV generado por la simulación existente. Los campos registrados incluyen:

- `sampleCount`
- `durationHours`
- `meanOperativeTemperature`
- `minOperativeTemperature`
- `maxOperativeTemperature`
- `operativeTemperatureRange`
- `meanIndoorAirTemperature`
- `meanRadiantTemperature`
- `meanOutdoorTemperature`
- `meanIndoorOutdoorDelta`
- `meanRelativeHumidity`
- `comfortRange`
- `samplesOutsideComfort`
- `hoursOutsideComfort`
- `warnings`

La temperatura operativa es necesaria para el análisis térmico principal. Las variables auxiliares faltantes generan advertencias. No se inventa una banda de confort: si no se proporciona una banda, los indicadores asociados permanecen nulos.

El resultado de Energy Engine contempla `thermalKPIs?` y `thermalKpiError?`. Un fallo aislado de Thermal KPI debe registrarse sin invalidar automáticamente resultados energéticos válidos.

## 4. Cronología de evolución

La siguiente cronología es una sola línea evolutiva de ARKI EnergyPlus. Los hashes se consignan como referencias de commits comunicadas en el registro de desarrollo:

| Fecha | Commit | Hito registrado |
|---|---|---|
| 2026-11-19 | `9cf124e940ac6e3969708f438e80ed461af740e4` | MO-ENERGY-02 — pipeline inicial EnergyPlus |
| 2026-11-19 | `7cc3b475f668d92ede384002ff512be84feb40e4` | Correcciones TypeScript y fallos de simulación |
| 2026-11-20 | `a7d6dae32a29bca1d678f42af9b96572f2c2be58` | Hito de pipeline EnergyPlus 24.1.0 |
| 2026-11-21 | `5c6ff5e81f88281b959b14f5b707bf0cef6f1921` | V19 — extracción SQLite y subprocess |
| 2026-11-21 | `e743b045dfdf4e9cdcafff98dd2ad0e2ff99de05` | Evidencia de verificación |
| 2026-11-21 | `fcd90ed0e9abb02bcc10fcc0de2f54689b7ecbc8` | V19 — pipeline funcional Python |
| 2026-11-22 | — | Integración Thermal KPI, timestep, precisión y pruebas unitarias |

La integración paralela de LCA, Climate y Radiance/Honeybee debe conservar su propia trazabilidad. No se deben atribuir automáticamente esos cambios al Energy Engine.

## 5. Evidencia de pruebas y límites

### Evidencia recibida

La ejecución comunicada de:

```bash
pnpm exec vitest run server/gia/energy/arkiThermalKPIs.test.ts
```

reportó **6/6 tests passing**, exit code 0.

Casos de prueba descritos en el registro: conteo de muestras, duración, timestep explícito, banda de confort, ausencia de banda, banda inválida y temperatura operativa ausente.

### No certificado todavía

El informe forense del 2026-11-22 indicó que durante su recopilación no se ejecutaron tests ni simulaciones. La suite Thermal KPI se ejecutó después y constituye evidencia unitaria específica, no evidencia de integración completa.

Quedan pendientes evidencias actuales de:

- Tests de Energy Engine.
- Aplicación real de ubicación y periodo al IDF ejecutado.
- Ejecución end-to-end con EnergyPlus.
- Extracción y consistencia CSV/SQLite.
- Integración Energy KPI + Thermal KPI.
- Regresión del módulo.

**No declarar operativo/cerrado el pipeline integral hasta contar con esas evidencias.**

## 6. Auditoría técnica pendiente

| ID | Punto | Verificación requerida | Prioridad |
|---|---|---|---|
| EP-01 | Actualización IDF | Fragilidad regex, formato, objetos duplicados y campos | Alta |
| EP-02 | Calendario | Rechazar fechas imposibles y validar periodos | Alta |
| EP-03 | Duración | Contrastar `sampleCount × timestep` con semántica temporal del CSV | Alta |
| EP-04 | Columnas CSV | Evitar selección ambigua por substring, zonas o variables duplicadas | Alta |
| EP-05 | Timestep | Validar extracción y valores aceptados por EnergyPlus | Alta |
| EP-06 | Parser CSV | Comillas, escapes, campos vacíos y registros incompletos | Media |
| EP-07 | Errores | Diferenciar fallo del proceso, salida ausente, extracción y KPI | Alta |
| EP-08 | Temporales | Distinguir temporales de evidencia y definir política de retención | Media |
| EP-09 | Reproducibilidad | Registrar inputs, versión, configuración y outputs | Alta |
| EP-10 | Integración ARKI | Verificar contrato de salida y consumidores | Alta |

No introducir correcciones preventivas sin confirmar el defecto y añadir pruebas correspondientes.

## 7. Estado Git registrado al corte forense

El reporte forense del 2026-11-22 consignó:

- Rama: `sync/sicl-web-56-commits`.
- HEAD: `fcd90ed0e9abb02bcc10fcc0de2f54689b7ecbc8`.
- Rama con cinco commits de adelanto respecto del tracking remoto, según el estado local informado.
- Historial divergente respecto de `main`.
- Cambios ajenos a EnergyPlus presentes en el working tree.

Archivos EnergyPlus modificados:

- `server/gia/energy/arkiEnergyEngine.ts`
- `server/gia/energy/arkiEnergyEngine.test.ts`
- `server/gia/energy/templates/lima_1zone.idf`

Archivos EnergyPlus nuevos:

- `server/gia/energy/arkiThermalKPIs.ts`
- `server/gia/energy/arkiThermalKPIs.test.ts`

El informe también registró siete directorios `temp_sim_*` (28 archivos) como eliminados del tracking y varios backups V44/V45/V46.x sin seguimiento. No eliminarlos ni incorporarlos masivamente: primero clasificar temporales, evidencia y copias de seguridad.

**Nota:** el estado Git de esta sección es una fotografía del informe forense, no una lectura en vivo del servidor ni del estado actual de la rama remota.

## 8. Protocolo de cambios

1. Auditar el código activo antes de modificarlo.
2. Resolver EP-01 a EP-05 en ese orden.
3. Reproducir cada defecto mediante un test.
4. Aplicar cambios pequeños y delimitados.
5. Ejecutar tests unitarios y de integración pertinentes.
6. Conservar salidas y logs como evidencia.
7. Actualizar esta memoria en cada hito.
8. No realizar merges, resets, limpiezas ni borrados amplios como parte de esta auditoría.

## 9. Criterios de cierre

- [ ] EP-01 a EP-05 auditados y resueltos o aceptados con justificación.
- [ ] IDF configurado y verificado.
- [ ] Ubicación y periodo aplicados y verificados.
- [ ] Timestep validado.
- [ ] Simulación real EnergyPlus exitosa.
- [ ] Extracción CSV/SQLite verificada.
- [ ] Energy KPIs validados.
- [ ] Thermal KPI integrado y validado.
- [ ] Tests unitarios y end-to-end aprobados.
- [ ] Errores y advertencias clasificados.
- [ ] Reproducibilidad documentada.
- [ ] Temporales y evidencias clasificados.
- [ ] Estado Git reconciliado sin pérdida de trabajo.
- [ ] Memoria técnica y evidencias archivadas.

## 10. Próximo paso

Continuar con la auditoría focalizada EP-01 a EP-05 sobre el código activo. No repetir el inventario general. La siguiente actualización de esta memoria debe registrar hallazgos confirmados, correcciones, tests y evidencias, manteniendo EnergyPlus y Thermal KPI en una sola cronología.

---

**Estado al 2026-11-22:** IMPLEMENTACIÓN EN PROGRESO · AUDITORÍA ABIERTA · DOCUMENTACIÓN ACTIVA.
