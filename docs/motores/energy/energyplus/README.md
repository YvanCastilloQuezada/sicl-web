# EnergyPlus en ARKI-GIA

**Estado:** ✅ Operativo (desde 2026-11-20)
**Versión:** EnergyPlus 24.1.0
**Ubicación:** `/usr/local/bin/energyplus`

## Hito Alcanzado

El 20 de noviembre de 2026, ARKI-GIA completó su primera simulación energética anual exitosa con EnergyPlus, extrayendo datos reales de temperatura interior/exterior y consumo energético.

## Arquitectura

1. **Honeybee** genera el modelo geométrico (Room, Face, Aperture)
2. **model_to_idf()** traduce a formato IDF
3. **Inyección quirúrgica** de objetos obligatorios (Building, GlobalGeometryRules, Timestep, RunPeriod)
4. **Output:Variable** define qué datos extraer
5. **subprocess** ejecuta EnergyPlus directamente
6. **CSV parser** lee eplusout.csv para KPIs

## Scripts

- `scripts/arki_energy_sim_v14.py` — Simulación completa funcional
- `examples/` — Casos de uso y modelos de prueba

## Dependencias

- honeybee-energy (Python)
- EnergyPlus 24.1.0 (binario)
- EPW de Lima (`server/gia/energy/weather/lima_pe.epw`)

## Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `Missing required property 'Building'` | Honeybee no inyecta objetos globales | Inyectar manualmente |
| `No Design Days or Run Period` | Falta RunPeriod | Añadir RunPeriod con fechas |
| `No Output:Variable` | CSV vacío | Inyectar Output:Variable |
| `ImportError: run_model` | API deprecated en honeybee-energy | Usar `model_to_idf` + subprocess |

## Próximos Pasos

- [ ] Integrar con el Funnel de ARKI (evaluar 16 propuestas)
- [ ] Extraer métricas ASHRAE 55 (confort térmico)
- [ ] Conectar con Radiance para luz natural (sDA/ASE)
- [ ] Visualizar resultados en Cockpit React

