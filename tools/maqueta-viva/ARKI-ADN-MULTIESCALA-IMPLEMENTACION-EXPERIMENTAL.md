# ARKI — ADN de diseño y aprendizaje multiescala

**Estado:** EXECUTABLE_EXPERIMENTAL_REFERENCE / NOT_INTEGRATED_IN_CANONICAL_CORE / REAL_LEARNING_NOT_VERIFIED.

## Ámbitos implementados como modelos conceptuales

| Escala | Dominio | Escala padre permitida |
|---|---|---|
| OBJECT | Diseño de objetos | INTERIOR |
| INTERIOR | Diseño interior | ARCHITECTURE |
| ARCHITECTURE | Arquitectura | URBANISM |
| LANDSCAPE | Paisajismo | URBANISM |
| URBANISM | Urbanismo | REGIONAL |
| REGIONAL | Diseño regional | MACROREGIONAL |
| MACROREGIONAL | Diseño macrorregional | Ninguna |

El prototipo **no extrapola normativa** entre escalas. Cada encargo declara `requiredChecks` y todos permanecen `NOT_VERIFIED`; jurisdicción `NOT_RESOLVED`.

## Componentes publicados

- `arki-multiscale-design.cjs`: validación de encargo y escala, cuatro organizaciones espaciales alternativas `COMPACT`, `LINEAR`, `COURTYARD`, `CLUSTER`; rectángulos 2D de conceptualización; comprobaciones de límites, solapamiento y cobertura; métricas heurísticas de compacidad, espacio abierto y conectividad; ranking multiobjetivo y frente Pareto.
- `arki-multiscale-portfolio.cjs`: jerarquía padre-hijo, referencias explícitas y propagación de invalidez ante cambios de una escala a sus descendientes. No rediseña automáticamente descendientes ni cambia Core.
- `Run-ARKI-Multiscale-Design.cjs`: CLI para producir un resultado JSON aislado desde un brief JSON, sin sobrescribir resultados.
- `arki-multiscale-design.test.cjs`, `arki-multiscale-portfolio.test.cjs`: contratos y pruebas adversariales, agregados a CI Linux/Windows y PowerShell experimental.

## Aprendizaje

`learn(designResult, feedback, verifyEvidence)` admite una recompensa acotada por estrategia, pero requiere una función externa de verificación de evidencia que devuelva `true`. `design(brief, memory, verifyLearning)` **ignora** toda memoria cuya procedencia no sea validada por esa función. Las etiquetas `INDEPENDENTLY_VERIFIED` y los hashes, por sí solos, no autentican nada. La memoria solo influye en la preferencia por estrategia de la **misma escala y mismo commit**. No existe aprendizaje por transferencia ciega entre escalas.

**Importante:** esta es la interfaz de confianza de un aprendizaje adaptativo; no está conectada todavía a un verificador independiente real. No se ha demostrado mejora arquitectónica real, entrenamiento de modelos, descubrimiento creativo abierto, ni autonomía persistente de Core/AGK.

## Ejemplo de brief (sintético)

```json
{
  "schema": "ARKI-MULTISCALE-BRIEF-1",
  "id": "PRUEBA-ARQ-001",
  "scale": "ARCHITECTURE",
  "sourceCommit": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "site": {"widthM": 50, "depthM": 40},
  "program": {"units": 4, "targetCoverage": 0.3},
  "objectives": {"compactness": 0.4, "openSpace": 0.3, "connectivity": 0.3},
  "constraints": {"maxCoverage": 0.65, "requiredChecks": ["NORMATIVA_LOCAL", "ACCESIBILIDAD", "SEGURIDAD"]}
}
```

Ejecutar en la raíz del worktree experimental (PowerShell):

```powershell
node tools/maqueta-viva/arki-multiscale-design.test.cjs
node tools/maqueta-viva/arki-multiscale-portfolio.test.cjs
node tools/maqueta-viva/Run-ARKI-Multiscale-Design.cjs .\brief.json .\alternativas.json
```

`brief.json` debe existir y `alternativas.json` no debe existir antes de ejecutar el último comando.

## Límites que impiden declarar autonomía arquitectónica

1. Las geometrías son **rectángulos 2D conceptuales**; no AGK 3D, no BIM, no modelos constructivos ni validación estructural.
2. Los indicadores son **heurísticos geométricos**, no simulaciones climáticas, urbanas, ambientales, energéticas, de movilidad o económicas.
3. No hay corpus normativo, climático, territorial o de tipologías con procedencia autenticada integrado a cada escala.
4. No hay productor de observaciones reales, ejecutor autónomo AGK, comparador de experimentos reproducibles ni verificador externo conectado.
5. La interfaz de aprendizaje no constituye aprendizaje autónomo real hasta que evidencias y resultados auténticos alimenten iteraciones repetibles.
6. No se toca la verdad canónica ni los contratos FROZEN. La aprobación y auditoría Red Team de la integración al Core siguen pendientes.

**Criterio de siguiente puerta:** conectar un caso real de cada dominio con datos verificables, alternativas geométricas ejecutadas por AGK, métricas reproducibles, evaluación multiobjetivo, propagación de impactos y dos ciclos iniciados autónomamente con aprendizaje auditado.
