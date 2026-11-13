# ESTADO ARKI-GIA

## Estado actual: ARKI-GIA-β+

### Criterios de salida (todos obligatorios para llamarse ARKI-GIA)

| # | Condición | Estado | Evidencia |
|---|---|---|---|
| 1 | GIA-001 a GIA-010 aprobadas | ✅ en 1 caso genérico, ❌ en 3 tipologías | 10/10 tests razonamiento PASS |
| 2 | ≥3 motores EXECUTABLE con efecto en geometría | ⚠️ | geotech PASS, acoustic PASS, structural PARTIAL |
| 3 | Expediente por alternativa | ⏳ | Pendiente |
| 4 | Divergencia real entre PARTIs | ⏳ | Pendiente (Entregable 2) |
| 5 | Determinismo declarado | ⏳ | Pendiente (Entregable 3) |
| 6 | Autorización humana registrada | ⏳ | Pendiente |
| 7 | CI verde en los tres repos | ⚠️ | GIA CI verde; CI global de sicl-web rojo (tests de client/ pendientes); sicl-core falla 5/5 |

### CI de GIA

| Check | Qué verifica | Estado |
|---|---|---|
| `GIA CI` | 10 tests de razonamiento (GIA-001 a GIA-010) | ✅ verde en GitHub Actions |
| Tests de motores (GIA-011 a GIA-025) | 15 tests con motores-api real | ⏳ solo local (requiere `motores-api` en `127.0.0.1:18771`) |

### Pendiente: mockear motores para CI completo

Los 15 tests de motores requieren openseespy, jupedsim, cfast, pyrato, pysewer, etc.
Para correrlos en GitHub Actions, hay que:
1. Grabar respuestas de los 7 motores en fixtures JSON.
2. Añadir flag `MOTORES_MOCK=true` en `motoresClient.ts`.
3. Configurar el workflow con `MOTORES_MOCK=true`.

Esto es la siguiente fase (Opción A). No bloquea el hito β+.

### Nomenclatura

- **ARKI-CORE**: ciclo funcional, sin motores especializados conectados.
- **ARKI-GIA-β**: ≥1 tipología con GIA-001..010 aprobadas y ≥1 motor EXECUTABLE.
- **ARKI-GIA-β+**: 7 motores + structural world-class + NSGA-II. ← **estás aquí**
- **ARKI-GIA**: 3 tipologías + ≥3 motores EXECUTABLE + determinismo + aprobación humana.
